from models import User, db
from app import app
from werkzeug.security import generate_password_hash

def seed():
    with app.app_context():
        username = "admin"
        email = "admin11@gmail.com"
        raw_password = "admin"  
        password_hash = generate_password_hash(raw_password)  # hash it

        # Check if username already exists
        if User.query.filter_by(username=username).first():
            print("Username already exists.")
            return

        # Check if email already exists
        if User.query.filter_by(email=email).first():
            print("Email already exists.")
            return

        # Create and add admin user
        new_admin = User(
            username=username,
            email=email,
            password_hash=password_hash,
            is_admin=True,
            role='admin'  
        )
        db.session.add(new_admin)
        db.session.commit()
        print("Admin added successfully.")

seed()
