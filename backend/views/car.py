from flask import Blueprint, request, jsonify
from models import db, Car

car_bp = Blueprint('car_bp', __name__)

@car_bp.route('/cars', methods=['POST'])
def create_car():
    data = request.get_json()

    brand= data.get('brand')
    model = data.get('model')
    image1 = data.get('image1')
    image2 = data.get('image2')
    price_per_day = data.get('price_per_day')
    status = data.get('status', 'available')

    if not brand or not model or not image1 or not image2 or not price_per_day:
        return jsonify({'error': 'Missing required fields'}), 400
    if price_per_day <= 0:
        return jsonify({'error': 'Price per day must be greater than 0'}), 400
    existing_car = Car.query.filter((Car.brand == brand) & (Car.model == model)).first()
    if existing_car:
        return jsonify({'error': 'Car with this brand and model already exists'}), 400
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

#=======================update car=========================
@car_bp.route('/cars/<int:car_id>/', methods=['PATCH'], strict_slashes=False)
def update_car(car_id):
    car = Car.query.get(car_id)
    if not car:
        return jsonify({'error': 'Car not found'}), 404

    data = request.get_json()
    brand = data.get('brand')
    model = data.get('model')
    image1 = data.get('image1')
    image2 = data.get('image2')
    price_per_day = data.get('price_per_day')
    status = data.get('status', 'available')

    if not brand or not model or not image1 or not image2 or not price_per_day:
        return jsonify({'error': 'Missing required fields'}), 400
    if price_per_day <= 0:
        return jsonify({'error': 'Price per day must be greater than 0'}), 400

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
def delete_car(car_id):
    car = Car.query.get(car_id)
    if not car:
        return jsonify({'error': 'Car not found'}), 404

    db.session.delete(car)
    db.session.commit()
    return jsonify({'message': 'Car deleted successfully'}), 200