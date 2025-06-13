from flask import Flask,request, jsonify
from models import db, User, Car, Booking, Review
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///car_rental.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)

from views import *

app.register_blueprint(user_bp)
app.register_blueprint(car_bp)
app.register_blueprint(booking_bp)
app.register_blueprint(review_bp)



if __name__ == '__main__':
    app.run(debug=True)