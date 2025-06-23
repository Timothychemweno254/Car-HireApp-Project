from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, Review,User
from flask_jwt_extended import jwt_required, get_jwt_identity

review_bp = Blueprint('review', __name__)

# ========================== Create Review ==========================
@review_bp.route('/reviews', methods=['POST'])
@jwt_required()
def create_review():
    data = request.get_json()

    user_id = get_jwt_identity()
    car_id = data.get('car_id')
    rating = data.get('rating')
    comment = data.get('comment')

    if not user_id or not car_id or not rating:
        return jsonify({'error': 'Missing required fields'}), 400

    review = Review(
        user_id=user_id,
        car_id=car_id,
        rating=rating,
        comment=comment
    )
    db.session.add(review)
    db.session.commit()

    return jsonify({"message": "Review created successfully", "review_id": review.id}), 201

# ========================== Fetch Reviews by Car ID ==========================
# Get all reviews
@review_bp.route('/reviews', methods=['GET'])
def get_all_reviews():
    reviews = Review.query.all()
    result = []
    for review in reviews:
        result.append({
            'id': review.id,
            'user_id': review.user_id,
            'car_id': review.car_id,
            'rating': review.rating,
            'comment': review.comment,
            'timestamp': review.timestamp.isoformat() if review.timestamp else ''
        })
    return jsonify(result), 200


# ========================== Fetch Reviews by User ID ==========================
@review_bp.route('/reviews/car/<int:car_id>/', methods=['GET'])
def get_reviews_by_car(car_id):
    reviews = Review.query.filter_by(car_id=car_id).all()

    result = []
    for review in reviews:
        result.append({
            'id': review.id,
            'username': review.user.username if review.user else 'Unknown',
            'car_model': review.car.model if review.car else 'Unknown',
            'rating': review.rating,
            'comment': review.comment,
            'timestamp': review.timestamp.isoformat() if review.timestamp else ''
        })
    return jsonify(result), 200

   

# ========================== Delete Review by ID ==========================


@review_bp.route('/reviews/<int:review_id>/', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    current_user_id = get_jwt_identity()
    
    # ✅ Fix here
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not user.is_admin:
        return jsonify({'error': 'Only admins can delete reviews'}), 403

    review = Review.query.get(review_id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    db.session.delete(review)
    db.session.commit()

    return jsonify({'message': 'Review deleted successfully'}), 200
