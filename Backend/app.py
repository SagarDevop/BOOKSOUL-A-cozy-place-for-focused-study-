from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()



app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")


# ✅ MongoDB connection





# Create a new client and connect to the server
client = MongoClient(MONGO_URI, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


db = client['library_web']  # 🔥 your db name
users_collection = db['users']  # 🔥 your collection name
contact_collection = db['contact']  # 🔥 your collection name
seat_booking_collection = db['seatBookings'] 

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 400
    
    users_collection.insert_one({'email': email, 'password': password, 'name': name})
    return jsonify({'message': 'User registered successfully!'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})

    if user and user['password'] == password:
        return jsonify({'message': 'Login successful!', 'user': {'name': user['name'], 'email': user['email']}}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401
    
# 👇 Add this under your collection setups
seat_booking_collection = db['seatBookings']  # 🔥 your new collection

# 👇 Get all booked seats
@app.route('/booked-seats', methods=['GET'])
def get_booked_seats():
    try:
        seats = db['booked_seats'].find()
        seat_list = [seat['seat_id'] for seat in seats]
        return jsonify(seat_list), 200

    except Exception as e:
        print(f"Error in /booked-seats: {e}")
        return jsonify({'error': 'Server error'}), 500


# 👇 Book seats
@app.route('/book-seats', methods=['POST'])
def book_seats():
    try:
        data = request.get_json()
        email = data.get('email')
        seats = data.get('seats')

        if not email or not seats:
            return jsonify({'error': 'Missing email or seats'}), 400

        print(f"Booking request from {email} for seats: {seats}")

        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'User not found. Please login first.'}), 401

        # Check for already booked seats
        for seat in seats:
            if db['booked_seats'].find_one({'seat_id': seat}):
                return jsonify({'error': f'Seat {seat} is already booked'}), 400

        for seat in seats:
            db['booked_seats'].insert_one({
                'seat_id': seat,
                'booked_by': email
            })

        return jsonify({'message': 'Seats booked successfully!'}), 200

    except Exception as e:
        print(f"Error in /book-seats: {e}")
        return jsonify({'error': 'Server error'}), 500


    
@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
        timestamp = data.get('timestamp')

        if not name or not email or not message:
            return jsonify({'error': 'Missing fields'}), 400

        # Save to MongoDB
        contact_collection.insert_one({
            'name': name,
            'email': email,
            'message': message,
            "timestamp": timestamp
            
        })

        return jsonify({'message': 'Contact message saved successfully'}), 200

    except Exception as e:
        print(f"Error in /contact: {e}")
        return jsonify({'error': 'Server error'}), 500
    



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # default to 5000 if not set
    app.run(host="0.0.0.0", port=port, debug=True)
