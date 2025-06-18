from flask import Flask, request, jsonify, Blueprint
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from datetime import timezone

auth_bp = Blueprint('auth_bp', __name__)

# --------------------------- login user ---------------------------
@auth_bp.route('/login', methods=['POST'])
def login_user():
    email = request.json.get('email')
    password_hash = request.json.get('password_hash')

    if not email or not password_hash:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

   
    if user and check_password_hash(user.password_hash, password_hash):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401

  #============================fetch logged in user============================
@auth_bp.route('/current_user', methods=['GET'])
@jwt_required()
def fetch_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

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
#=============================logout user============================
@auth_bp.route('/logout', methods=['DELETE'])
@jwt_required()
def logout_user():
    jti = get_jwt()['jti']
    now = datetime.now(timezone.utc)

    new_blocked_token = TokenBlocklist(jti=jti, created_at=now)
    db.session.add(new_blocked_token)
    db.session.commit()
    return jsonify({"message": "Successfully logged out"}), 200