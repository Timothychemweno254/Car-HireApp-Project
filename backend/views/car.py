from flask import Blueprint, request, jsonify
from models import db, Car, User
from flask_jwt_extended import jwt_required, get_jwt_identity

car_bp = Blueprint('car_bp', __name__)
@car_bp.route('/cars', methods=['POST'])
@jwt_required()
def create_car():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    # Block if user is not admin
    if not user or not user.is_admin:
        return jsonify({'error': 'Only admins are allowed to add cars'}), 403

    data = request.get_json()

    brand = data.get('brand')
    model = data.get('model')
    image1 = data.get('image1')
    image2 = data.get('image2')
    status = data.get('status', 'available')

    # Safely convert price_per_day to float
    try:
        price_per_day = float(data.get('price_per_day'))
    except (TypeError, ValueError):
        return jsonify({'error': 'Price per day must be a valid number'}), 400

    if not brand or not model or not image1 or not image2 or price_per_day is None:
        return jsonify({'error': 'Missing required fields'}), 400

    if price_per_day <= 0:
        return jsonify({'error': 'Price per day must be greater than 0'}), 400

    # Check for duplicate car
    existing_car = Car.query.filter(
        (Car.brand == brand) & (Car.model == model)
    ).first()
    if existing_car:
        return jsonify({'error': 'Car with this brand and model already exists'}), 400

    # Create and save new car
    new_car = Car(
        brand=brand,
        model=model,
        image1=image1,
        image2=image2,
        price_per_day=price_per_day,
        status=status
    )

    db.session.add(new_car)
    db.session.commit()

    return jsonify({"message": "Car created successfully", "car_id": new_car.id}), 201

# =======================update car status=========================
@car_bp.route('/cars/<int:car_id>/status', methods=['PATCH'])
@jwt_required()
def update_car_status(car_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        new_status = data.get('status')
        if not new_status or new_status not in ['available', 'booked', 'under_maintenance']:
            return jsonify({'error': 'Invalid status'}), 400

        car = Car.query.get(car_id)
        if not car:
            return jsonify({'error': 'Car not found'}), 404

        car.status = new_status
        db.session.commit()

        return jsonify({
            'message': 'Car status updated successfully',
            'status': new_status
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Server error: {str(e)}'}), 500
#=======================update car=========================
@car_bp.route('/cars/<int:car_id>/', methods=['PATCH'], strict_slashes=False)
@jwt_required()
def update_car(car_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or not user.is_admin:
        return jsonify({'error': 'You are not authorized to update this car'}), 403

    car = Car.query.get(car_id)
    if not car:
        return jsonify({'error': 'Car not found'}), 404

    data = request.get_json()
    brand = data.get('brand')
    model = data.get('model')
    image1 = data.get('image1')
    image2 = data.get('image2')
    status = data.get('status', 'available')

    # Safely convert price_per_day
    try:
        price_per_day = float(data.get('price_per_day'))
    except (TypeError, ValueError):
        return jsonify({'error': 'Price per day must be a valid number'}), 400

    if not brand or not model or not image1 or not image2 or price_per_day is None:
        return jsonify({'error': 'Missing required fields'}), 400

    if price_per_day <= 0:
        return jsonify({'error': 'Price per day must be greater than 0'}), 400

    # Update fields
    car.brand = brand
    car.model = model
    car.image1 = image1
    car.image2 = image2
    car.price_per_day = price_per_day
    car.status = status

    db.session.commit()
    return jsonify({'message': 'Car updated successfully'}), 200


#=======================get car by id=========================
@car_bp.route('/cars/<int:car_id>/', methods=['GET'], strict_slashes=False)
def fetch_car(car_id):
    car = Car.query.get(car_id)
    if not car:
        return jsonify({'error': 'Car not found'}), 404

    car_data = {
        'id': car.id,
        'brand': car.brand,
        'model': car.model,
        'image1': car.image1,
        'image2': car.image2,
        'price_per_day': car.price_per_day,
        'status': car.status
    }
    return jsonify(car_data), 200
#=======================get all cars=========================       
@car_bp.route('/cars', methods=['GET'])
def fetch_all_cars():
    cars = Car.query.all()

    car_list = []
    for car in cars:
        car_data = {
            'id': car.id,
            'brand': car.brand,
            'model': car.model,
            'image1': car.image1,
            'image2': car.image2,
            'price_per_day': car.price_per_day,
            'status': car.status
        }
        car_list.append(car_data)
    
    return jsonify(car_list), 200
#=======================delete car by id=========================
@car_bp.route('/cars/<int:car_id>/', methods=['DELETE'], strict_slashes=False)
@jwt_required()
def delete_car(car_id):
    car = Car.query.get(car_id)
    if not car:
        return jsonify({'error': 'Car not found'}), 404

    db.session.delete(car)
    db.session.commit()
    return jsonify({'message': 'Car deleted successfully'}), 200