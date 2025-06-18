from datetime import timedelta
from flask import Flask, request, jsonify
from models import db, TokenBlocklist
from flask_migrate import Migrate
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///car_rental.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)

#flask cors
CORS(app)

##=====================email config========================

app.config['MAIL_SERVER'] = 'smtp.gmail.com' 
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config["MAIL_USE_SSL"] = False
app.config['MAIL_USERNAME'] = 'emailstest491@gmail.com'
app.config['MAIL_PASSWORD'] = 'bjwm ujbc uekw omqn' 
app.config['MAIL_DEFAULT_SENDER'] = 'yourrmail@gmail.com'

mail = Mail(app)

# JWT
app.config["JWT_SECRET_KEY"] = "sjusefvyilgfvksbhvfiknhalvufn"  
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

# test
app.config["JWT_VERIFY_SUB"] = False

jwt = JWTManager(app)
jwt.init_app(app)


from views import *

app.register_blueprint(user_bp)
app.register_blueprint(car_bp)
app.register_blueprint(booking_bp)
app.register_blueprint(review_bp)
app.register_blueprint(auth_bp)

# Callback function to check if a JWT exists in the database blocklist
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None



if __name__ == '__main__':
    app.run(debug=True)