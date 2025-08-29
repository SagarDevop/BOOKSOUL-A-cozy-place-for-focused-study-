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
from bson import ObjectId

# Load environment variables from .env file
load_dotenv()



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

MONGO_URI = os.getenv("MONGO_URI")
admin_name = os.getenv("ADMIN_NAME")
admin_email = os.getenv("ADMIN_EMAIL")
admin_password = os.getenv("ADMIN_PASSWORD")


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
if not users_collection.find_one({"email": admin_email}):
    users_collection.insert_one({
        "name": admin_name,
        "email": admin_email,
        "password": admin_password,
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
        message["From"] = f"Chitrakoot Digital Library <{sender_email}>"
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



@app.route('/request-booking', methods=['POST'])
def request_booking():
    data = request.get_json()
    email = data.get('email')
    seats = data.get('seats')
    
    if not email or not seats:
        return jsonify({'error': 'Email and seats are required'}), 400

    booking_request = {
        'email': email,
        'seats': seats,
        'status': 'pending'
    }

    result = db.booking_requests.insert_one(booking_request)

    # Add the inserted _id (converted to string)
    booking_request['_id'] = str(result.inserted_id)

    return jsonify({
        'message': 'Booking request submitted!',
        'request': booking_request
    }), 200
    
@app.route("/send-admin-email", methods=["POST"])
def send_admin_booking_email():
    data = request.get_json()
    user_email = data.get("userEmail")
    seats = data.get("seats")

    if not user_email or not seats:
        return jsonify({"error": "userEmail and seats are required"}), 400

    try:
        sender_email = "Sagar.singh44818@gmail.com"
        sender_password = "wjyv znpq ondf qlky"  
        admin_email = "pandeyshiv5798@gmail.com"  

        subject = "📌 New Seat Booking Request"

        text = f"""
        Hello ,Shiv Pandey

        A new booking request has been made.

        User Email: {user_email}
        Seats Requested: {', '.join(seats)}

        Please review and approve the booking in the admin panel.
        """

        html = f"""
        <html>
        <body>
            <p>Hello Shiv,</p>
            <p>A new booking request has been made.</p>
            <p><strong>User Email:</strong> {user_email}</p>
            <p><strong>Seats Requested:</strong> {', '.join(seats)}</p>
            <p>Please review and approve the booking in the admin panel.</p>
            <br>
            <p>Thanks,<br>Chitrakoot Digital Library Booking System</p>
        </body>
        </html>
        """

        message = MIMEMultipart("alternative")
        message["From"] = f"Chitrakoot Digital Library <{sender_email}>"
        message["To"] = admin_email
        message["Subject"] = subject
        message.attach(MIMEText(text, "plain"))
        message.attach(MIMEText(html, "html"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(message)
        server.quit()

        print(f"Booking email sent to admin for user {user_email}")
        return jsonify({"message": "Email sent successfully"}), 200

    except Exception as e:
        print(f"Error sending booking email: {e}")
        return jsonify({"error": str(e)}), 500




@app.route('/admin/requests', methods=['GET'])
def get_requests():
    requests = list(db.booking_requests.find())
    # Convert ObjectId to string for each request
    for req in requests:
        req['_id'] = str(req['_id'])
    return jsonify(requests), 200

@app.route('/update_booking/<id>', methods=['POST'])
def update_booking(id):
    data = request.get_json()
    action = data.get('action')  # "approve" or "reject"

    if action not in ['approve', 'reject']:
        return jsonify({'success': False, 'message': 'Invalid action'}), 400

    booking_request = db.booking_requests.find_one({'_id': ObjectId(id)})
    if not booking_request:
        return jsonify({'success': False, 'message': 'Request not found'}), 404

    if action == 'approve':
        # Insert into booked_seats
        db['booked_seats'].insert_one({
            'email': booking_request['email'],
            'seats': booking_request['seats'],
            'status': 'booked'
        })
        send_booking_email(booking_request['email'], booking_request['seats'], status="approve")
        # Update status in pending requests
        db.booking_requests.update_one({'_id': ObjectId(id)}, {'$set': {'status': 'approve'}})
    elif action == 'reject':
        send_booking_email(booking_request['email'], booking_request['seats'], status="reject")
        # ✅ Instead of deleting, just update status
        db.booking_requests.update_one({'_id': ObjectId(id)}, {'$set': {'status': 'reject'}})

    return jsonify({'success': True, 'message': f'Request {action}d successfully'}), 200


# 👇 Get all booked seats
@app.route('/booked-seats', methods=['GET'])
def get_booked_seats():
    try:
        seats = db['booked_seats'].find()
        seat_list = []

        for seat_doc in seats:
            if 'seats' in seat_doc:
                seat_list.extend(seat_doc['seats'])  # 👈 flatten arrays

        return jsonify(seat_list), 200

    except Exception as e:
        print(f"Error in /booked-seats: {e}")
        return jsonify({'error': 'Server error'}), 500


def send_booking_email(to_email, seats, status="approve"):
    try:
        sender_email = "Sagar.singh44818@gmail.com"
        sender_password = "wjyv znpq ondf qlky"  # Use App Password

        # Subject and messages based on status
        if status == "approved":
            subject = "🎟️ Your Seat Booking is Approved!"
            text_msg = f"""Hello {to_email},

Your seat booking has been approved.

Seats Booked: {', '.join(seats)}
Booking Date & Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Enjoy your study time! If you did not make this booking, contact us immediately.

Thanks,
Chitrakoot Digital Library Booking Team
"""
            html_msg = f"""
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>🎉 Booking Approved!</h2>
    <p>Hello {to_email},</p>
    <p>Your seat booking has been approved.</p>
    <ul>
      <li><strong>Seats Booked:</strong> {', '.join(seats)}</li>
      <li><strong>Booking Time:</strong> {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</li>
    </ul>
    <p>Enjoy your study time! If you didn’t make this booking, contact us immediately.</p>
    <p><strong>– StudySpace Booking Team</strong></p>
  </body>
</html>
"""
        elif status == "reject":
            subject = "❌ Your Seat Booking was Rejected"
            text_msg = f"""Hello {to_email},

Unfortunately, your seat booking has been rejected by the admin.

Seats Requested: {', '.join(seats)}
Booking Date & Time: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

You may try booking different seats or contact us for assistance.

Thanks,
Chitrakoot Digital Library Booking Team
"""
            html_msg = f"""
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>❌ Booking Rejected</h2>
    <p>Hello {to_email},</p>
    <p>Unfortunately, your seat booking has been rejected by the admin.</p>
    <ul>
      <li><strong>Seats Requested:</strong> {', '.join(seats)}</li>
      <li><strong>Booking Time:</strong> {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</li>
    </ul>
    <p>You may try booking different seats or contact us for assistance.</p>
    <p><strong>– Chitrakoot Digital Library Booking Team</strong></p>
  </body>
</html>
"""
        else:
            raise ValueError("Invalid status for email")

        # Create message container
        message = MIMEMultipart('alternative')
        message['From'] = f"Chitrakoot Digital Library Booking <{sender_email}>"
        message['To'] = to_email
        message['Subject'] = subject
        message['Date'] = datetime.datetime.now().strftime('%a, %d %b %Y %H:%M:%S')
        message['Reply-To'] = sender_email

        # Attach both plain text and HTML
        message.attach(MIMEText(text_msg, 'plain'))
        message.attach(MIMEText(html_msg, 'html'))

        # Send email
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(message)
        server.quit()

        print(f"Booking {status} email sent to: {to_email}")

    except Exception as e:
        print(f"Error sending email: {e}")

    
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
