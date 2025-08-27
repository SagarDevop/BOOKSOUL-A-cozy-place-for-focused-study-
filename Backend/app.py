from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime
import random

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
users_collection = db['users']# 🔥 your collection name
users_collection.insert_one({
    "name": "Super Admin",
    "email": "admin@example.com",
    "password": "Admin@123",
   "role": "admin"
})
contact_collection = db['contact']  # 🔥 your collection name
seat_booking_collection = db['seatBookings'] 

# In-memory store for OTPs (in production, use Redis or database with expiry)
otp_store = {}

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(to_email, otp):
    try:
        sender_email = "Sagar.singh44818@gmail.com"
        sender_password = "wjyv znpq ondf qlky"  # App password

        subject = "🔐 Your OTP for Password Reset"
        text = f"Your OTP for resetting your password is: {otp}\nIt is valid for 5 minutes."
        html = f"""
        <html>
        <body>
            <p>Hi,</p>
            <p>Your OTP for resetting your password is:</p>
            <h2>{otp}</h2>
            <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
        </body>
        </html>
        """

        message = MIMEMultipart("alternative")
        message["From"] = f"BookSoul <{sender_email}>"
        message["To"] = to_email
        message["Subject"] = subject
        message.attach(MIMEText(text, "plain"))
        message.attach(MIMEText(html, "html"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(message)
        server.quit()
        print(f"OTP sent to {to_email}")

    except Exception as e:
        print(f"Error sending OTP: {e}")



@app.route('/')
def home():
    return jsonify({"message": "Welcome to BookSoul API!"})

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 400
    
    users_collection.insert_one({'email': email, 'password': password, 'name': name , 'role': 'user'})
    return jsonify({'message': 'User registered successfully!'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})

    if user and user['password'] == password:
        return jsonify({'message': 'Login successful!', 'user': {'name': user['name'], 'email': user['email'], 'role': user.get('role', 'user')}}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401
    
# 👇 Add this under your collection setups
seat_booking_collection = db['seatBookings']  # 🔥 your new collection


@app.route('/request-reset', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')

    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'error': 'Email not registered'}), 400

    otp = generate_otp()
    otp_store[email] = {'otp': otp, 'timestamp': datetime.datetime.now()}
    send_otp_email(email, otp)

    return jsonify({'message': 'OTP sent successfully!'}), 200


@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp_input = data.get('otp')
    new_password = data.get('newPassword')

    record = otp_store.get(email)
    if not record:
        return jsonify({'error': 'OTP not requested'}), 400

    time_diff = (datetime.datetime.now() - record['timestamp']).seconds
    if time_diff > 300:
        return jsonify({'error': 'OTP expired'}), 400

    if record['otp'] != otp_input:
        return jsonify({'error': 'Invalid OTP'}), 400

    users_collection.update_one({'email': email}, {'$set': {'password': new_password}})
    del otp_store[email]  # Remove OTP after use

    return jsonify({'message': 'Password updated successfully'}), 200


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
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

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

        # Send booking confirmation email
        send_booking_email(email, seats)

        return jsonify({'message': 'Seats booked successfully and confirmation email sent!'}), 200

    except Exception as e:
        print(f"Error in /book-seats: {e}")
        return jsonify({'error': 'Server error'}), 500


def send_booking_email(to_email, seats):
    try:
        # Email configuration
        sender_email = "Sagar.singh44818@gmail.com"
        sender_password = "wjyv znpq ondf qlky"  # Use App Password, not your main Gmail password
        subject = "🎟️ Your Seat Booking Confirmation"

        seat_list = ', '.join(seats)
        booking_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Create message container
        message = MIMEMultipart('alternative')
        message['From'] = f"StudySpace Booking <{sender_email}>"
        message['To'] = to_email
        message['Subject'] = subject
        message['Date'] = datetime.datetime.now().strftime('%a, %d %b %Y %H:%M:%S')
        message['Reply-To'] = sender_email

        # Plain text fallback
        text = f"""\
Hello {to_email},

Your seat booking is confirmed.

Seats Booked: {seat_list}
Booking Date & Time: {booking_time}

If you did not make this booking, please contact us immediately.

Thanks,
StudySpace Booking Team
"""

        # HTML content
        html = f"""\
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>🎉 Seat Booking Confirmation</h2>
    <p>Hello {to_email},</p>
    <p>We're happy to confirm your seat booking.</p>
    <ul>
      <li><strong>Seats Booked:</strong> {seat_list}</li>
      <li><strong>Booking Time:</strong> {booking_time}</li>
    </ul>
    <p>If you didn’t make this booking, please contact us immediately.</p>
    <p>Thank you for using our service!</p>
    <p><strong>– StudySpace Booking Team</strong></p>
  </body>
</html>
"""

        # Attach both versions
        message.attach(MIMEText(text, 'plain'))
        message.attach(MIMEText(html, 'html'))

        # Send email via Gmail SMTP
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(message)
        server.quit()

        print(f"Booking confirmation email sent to: {to_email}")

    except Exception as e:
        print(f"Error sending email: {e}")

#

    
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
