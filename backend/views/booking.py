from models import db, Booking, Car, User
from flask import Blueprint, request, jsonify
from datetime import datetime

booking_bp = Blueprint('booking', __name__)


@booking_bp.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()

    user_id = data.get('user_id')
    car_id = data.get('car_id')
    status = data.get('status', 'pending')

    # Convert strings to Python date objects
    try:
        start_date = datetime.strptime(data.get('start_date'), "%Y-%m-%d").date()
        end_date = datetime.strptime(data.get('end_date'), "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    if not user_id or not car_id or not start_date or not end_date:
        return jsonify({'error': 'Missing required fields'}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    car = Car.query.get(car_id)
    if not car:
        return jsonify({'error': 'Car not found'}), 404
    if car.status != 'available':
        return jsonify({'error': 'Car is not available'}), 400
    if start_date >= end_date:
        return jsonify({'error': 'End date must be after start date'}), 400
    if Booking.query.filter(
        Booking.car_id == car_id,
        Booking.start_date < end_date,
        Booking.end_date > start_date
    ).first():
        return jsonify({'error': 'Car is already booked for the selected dates'}), 400

    booking = Booking(
        user_id=user_id,
        car_id=car_id,
        start_date=start_date,
        end_date=end_date,
        status=status
    )
    db.session.add(booking)
    car.status = 'booked'
    db.session.commit()

    return jsonify({"message": "Booking created successfully", "booking_id": booking.id}), 201

#=========================update booking=========================
@booking_bp.route('/bookings/<int:booking_id>/', methods=['PATCH'], strict_slashes=False)
def update_booking(booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404

    data = request.get_json()
    status = data.get('status')

    if status not in ['pending', 'confirmed', 'cancelled']:
        return jsonify({'error': 'Invalid status'}), 400

    booking.status = status
    db.session.commit()

    return jsonify({'message': 'Booking updated successfully'}), 200

#=========================fetch all bookings=========================
@booking_bp.route('/bookings', methods=['GET'])     
def fetch_all_bookings():
    bookings = Booking.query.all()

    booking_list = []
    for booking in bookings:
        booking_data = {
            'id': booking.id,
            'user_id': booking.user_id,
            'car_id': booking.car_id,
            'start_date': booking.start_date.isoformat(),
            'end_date': booking.end_date.isoformat(),
            'status': booking.status,
            'created_at': booking.created_at.isoformat()
        }
        booking_list.append(booking_data)

    return jsonify(booking_list), 200
#=========================fetch booking by user=========================
@booking_bp.route('/bookings/user/<int:user_id>/', methods=['GET'])
def fetch_bookings_by_user(user_id):
    bookings = Booking.query.filter_by(user_id=user_id).all()

    if not bookings:
        return jsonify({'message': 'No bookings found for this user'}), 404

    booking_list = []
    for booking in bookings:
        booking_data = {
            'id': booking.id,
            'car_id': booking.car_id,
            'start_date': booking.start_date.isoformat(),
            'end_date': booking.end_date.isoformat(),
            'status': booking.status,
            'created_at': booking.created_at.isoformat()
        }
        booking_list.append(booking_data)

    return jsonify(booking_list), 200

#=========================fetch booking by car=========================
@booking_bp.route('/bookings/car/<int:car_id>/', methods=['GET'])
def fetch_bookings_by_car(car_id):
    bookings = Booking.query.filter_by(car_id=car_id).all()

    if not bookings:
        return jsonify({'message': 'No bookings found for this car'}), 404

    booking_list = []
    for booking in bookings:
        booking_data = {
            'id': booking.id,
            'user_id': booking.user_id,
            'start_date': booking.start_date.isoformat(),
            'end_date': booking.end_date.isoformat(),
            'status': booking.status,
            'created_at': booking.created_at.isoformat()
        }
        booking_list.append(booking_data)

    return jsonify(booking_list), 200
#=========================delete booking by id=========================     
@booking_bp.route('/bookings/<int:booking_id>/', methods=['DELETE'])
def delete_booking(booking_id):
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404

    car = Car.query.get(booking.car_id)
    if car:
        car.status = 'available'

    db.session.delete(booking)
    db.session.commit()

    return jsonify({'message': 'Booking deleted successfully'}), 200

