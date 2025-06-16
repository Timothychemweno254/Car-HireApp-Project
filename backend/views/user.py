from flask import Flask, request, jsonify, Blueprint
from models import db,User
from

user_bp = Blueprint('user', __name__)

#=========================create user=========================

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password_hash = data.get('password_hash')
    role = data.get('admin', 'user') 
    is_admin = True if role == 'admin' else False

    new_user = User(
        username=username,
        email=email,
        password_hash=password_hash,
        role=role,
        is_admin=is_admin
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201

#=========================update users =========================


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

