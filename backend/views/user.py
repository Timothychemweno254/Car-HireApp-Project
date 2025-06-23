from flask import Flask, request, jsonify, Blueprint
from models import db, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
# Importing Flask-Mail for email functionalities
from flask_mail import Message
from app import app, mail


user_bp = Blueprint('user', __name__)

#=========================create user=========================
@user_bp.route('/users', methods=['POST'])
@jwt_required(optional=True)
def create_user():
    current_user_id = get_jwt_identity()

    # Block admin users from registering anyone
    if current_user_id:
        current_user = User.query.get(current_user_id)
        if current_user and current_user.is_admin:
            return jsonify({'error': 'Admins are not allowed to create users'}), 403

    # Get form data
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        role='user',
        is_admin=False
    )

    try:
        db.session.add(new_user)
        db.session.commit()

        # Sending email notification
        try:
            msg = Message('Account Registration Confirmation',
                recipients=[new_user.email])
            msg.body = f"""Hello {new_user.username},

             Your account has been created successfully.

             Email: {new_user.email}
             Role: {new_user.role.capitalize()}

             Thank you for joining our platform!

             Best regards,  
             Your Service Team"""
            mail.send(msg)

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Failed to send email notification", "details": str(e)}), 500

        return jsonify({'message': 'User created successfully', 'user_id': new_user.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create user', 'details': str(e)}), 500
#=========================update usersadmin =========================

@user_bp.route('/users/<int:user_id>/', methods=['PUT'], strict_slashes=False)
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user.email = email
    user.password_hash = generate_password_hash(password)

    try:
        msg = Message(
            'Account Update Notification',
            recipients=[email]
        )
        msg.body = f"Hello {user.username},\n\nYour account email and password have been updated successfully.\n\nBest regards,\nYour Service Team"
        mail.send(msg)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to send email notification", "details": str(e)}), 500

    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200
#======================get all users======================
@user_bp.route('/users', methods=['GET'])

def fetch_all_users():
    users = User.query.all()

    user_list = []
    for user in users:
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'is_admin': user.is_admin
        }
        user_list.append(user_data)
    return jsonify(user_list), 200

#======================get user by id======================
@user_bp.route('/users/<int:user_id>/', methods=['GET'], strict_slashes=False)
@jwt_required()
def fetch_user_by_id(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'is_admin': user.is_admin
    }
    return jsonify(user_data), 200

#======================delete user by id======================
@user_bp.route('/users/<int:user_id>/', methods=['DELETE'], strict_slashes=False)
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

