from flask import Flask
import os

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
def create_app():
    app = Flask(__name__, static_url_path='')
    
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app