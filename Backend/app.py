from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# ✅ MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
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
        seats = data.get('seats')

        if not seats:
            return jsonify({'error': 'No seats provided'}), 400

        # Save booked seats
        for seat in seats:
            db['booked_seats'].insert_one({'seat_id': seat})

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
    app.run(debug=True)
