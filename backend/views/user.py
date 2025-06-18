from flask import Flask, request, jsonify, Blueprint
from models import db, User
from werkzeug.security import generate_password_hash
# Importing Flask-Mail for email functionalities
from flask_mail import Message
from app import app, mail


user_bp = Blueprint('user', __name__)

#=========================create user=========================

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')  
    role = data.get('admin', 'user') 
    is_admin = True if role == 'admin' else False

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
        role=role,
        is_admin=is_admin
    )

    try:
        db.session.add(new_user)
        msg = Message(
            'Welcome to Our Service',
            recipients=[email]
        )
        msg.body = f"Hello {username},\n\nThank you for registering with us. Your account has been created successfully.\n\nBest regards,\nYour Service Team"
        mail.send(msg)
        db.session.commit()
        return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to send email notification", "details": str(e)}), 500

#=========================update usersadmin =========================


@user_bp.route('/users/<int:user_id>/', methods=['PUT'], strict_slashes=False)
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    role = data.get('role')
    is_admin = True if role == 'admin' else False

    user.username = username
    user.email = email
    user.role = role
    user.is_admin = is_admin

    try:
        msg = Message('Account Update Notification',
        recipients=[email])
        msg.body = f"Hello {username},\n\nYour account details have been updated successfully.\n\nBest regards,\nYour Service Team"
        mail.send(msg)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to send email notification", "details": str(e)}), 500

    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200

#======================get user by id======================
@user_bp.route('/users/<int:user_id>/', methods=['GET'], strict_slashes=False)
def fetch_user(user_id):
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

#======================delete user by id======================
@user_bp.route('/users/<int:user_id>/', methods=['DELETE'], strict_slashes=False)
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

