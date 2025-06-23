from models import db, Booking, Car, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from app import  mail
from flask import Blueprint, request, jsonify
from datetime import datetime

booking_bp = Blueprint('booking', __name__)

@booking_bp.route('/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    # Block if user not found or is admin
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if user.is_admin:
        return jsonify({'error': 'Admins are not allowed to create bookings'}), 403

    car_id = data.get('car_id')
    status = data.get('status', 'pending')

    # Convert strings to date objects
    try:
        start_date = datetime.strptime(data.get('start_date'), "%Y-%m-%d").date()
        end_date = datetime.strptime(data.get('end_date'), "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    if not car_id or not start_date or not end_date:
        return jsonify({'error': 'Missing required fields'}), 400
    if start_date >= end_date:
        return jsonify({'error': 'End date must be after start date'}), 400

    car = Car.query.get(car_id)
    if not car:
        return jsonify({'error': 'Car not found'}), 404
    if car.status != 'available':
        return jsonify({'error': 'Car is not available'}), 400

    # Check for overlapping bookings
    overlapping = Booking.query.filter(
        Booking.car_id == car_id,
        Booking.start_date < end_date,
        Booking.end_date > start_date
    ).first()
    if overlapping:
        return jsonify({'error': 'Car is already booked for the selected dates'}), 400

    booking = Booking(
        user_id=user_id,
        car_id=car_id,
        start_date=start_date,
        end_date=end_date,
        status=status
    )

    try:
        msg = Message('Booking Confirmation', recipients=[user.email])
        msg.body = (
            f"Hello {user.username},\n\n"
            f"Your booking for car ID {car_id} has been created successfully.\n"
            f"Start Date: {start_date}\n"
            f"End Date: {end_date}\n"
            f"Status: {status}\n\n"
            "Thank you for choosing our service!\n\n"
            "Best regards,\nYour Service Team"
        )
        mail.send(msg)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to send email notification", "details": str(e)}), 500

    db.session.add(booking)
    car.status = 'booked'
    db.session.commit()

    return jsonify({"message": "Booking created successfully", "booking_id": booking.id}), 201

#=========================update booking=========================
@booking_bp.route('/bookings/<int:booking_id>/', methods=['PATCH'])
@jwt_required()
def update_booking(booking_id):
    current_user_id = get_jwt_identity()
    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({'error': 'Booking not found'}), 404

    # Only the user who made the booking or an admin can update it
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if booking.user_id != current_user_id and not user.is_admin:
        return jsonify({'error': 'You are not authorized to update this booking'}), 403

    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ['pending', 'confirmed', 'cancelled']:
        return jsonify({'error': 'Invalid status'}), 400

    # Get the previous status for comparison
    previous_status = booking.status
    booking.status = new_status
    
    # Get the car and user details
    car = Car.query.get(booking.car_id)
    booking_user = User.query.get(booking.user_id)
    
    try:
        # Send email notification if status changed to confirmed or cancelled
        if new_status in ['confirmed', 'cancelled'] and new_status != previous_status:
            subject = f"Booking {new_status.capitalize()}: {car.brand} {car.model}"
            
            if new_status == 'confirmed':
                body = f"""Hello {booking_user.username},
                
Your booking for {car.brand} {car.model} has been confirmed!
                
Booking Details:
- Dates: {booking.start_date} to {booking.end_date}
- Car: {car.brand} {car.model}
- Total Price: Ksh {car.price_per_day * (booking.end_date - booking.start_date).days}
                
Thank you for choosing our service!
                
Best regards,
The Car Rental Team"""
            else:  # cancelled
                body = f"""Hello {booking_user.username},
                
Your booking for {car.brand} {car.model} has been cancelled.
                
Booking Details:
- Dates: {booking.start_date} to {booking.end_date}
- Car: {car.brand} {car.model}
                
If this was unexpected, please contact our support team.
                
Best regards,
The Car Rental Team"""

            msg = Message(
                subject=subject,
                recipients=[booking_user.email],
                sender='noreply@carrental.com'
            )
            msg.body = body
            mail.send(msg)
            
            # Also notify admin if user cancelled their own booking
            if new_status == 'cancelled' and current_user_id == booking.user_id:
                admin = User.query.filter_by(is_admin=True).first()
                if admin:
                    admin_msg = Message(
                        subject=f"Booking Cancelled: #{booking.id}",
                        recipients=[admin.email],
                        sender='noreply@carrental.com'
                    )
                    admin_msg.body = f"""Admin Notification:
                    
User {booking_user.username} has cancelled their booking.

Booking Details:
- Car: {car.brand} {car.model}
- Dates: {booking.start_date} to {booking.end_date}
- Original Status: {previous_status}
                    
Please review the system for any necessary updates."""
                    mail.send(admin_msg)

        db.session.commit()
        return jsonify({
            'message': 'Booking updated successfully',
            'status': booking.status,
            'notification_sent': new_status in ['confirmed', 'cancelled']
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Booking update failed',
            'details': str(e)
        }), 500

#=========================fetch all bookings=========================
@booking_bp.route('/bookings', methods=['GET'])  
@jwt_required()   
def fetch_all_bookings():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    
    if user.is_admin:
        bookings = Booking.query.all()
    else:
        
        bookings = Booking.query.filter_by(user_id=current_user_id).all()

    if not bookings:
        return jsonify({'message': 'No bookings found'}), 404

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
@jwt_required()
def fetch_bookings_by_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    
    if current_user_id != user_id and not user.is_admin:
        return jsonify({'error': 'You are not authorized to view these bookings'}), 403

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


#=========================delete booking by id=========================     
@booking_bp.route('/bookings/<int:booking_id>/', methods=['DELETE'])
@jwt_required()
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

