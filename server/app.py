from flask import Flask, jsonify, request, make_response
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from models import db, User, Recipe, Ingredient, RecipeIngredient
from werkzeug.exceptions import BadRequest
from flask_migrate import Migrate
import os
import logging

# Initialize Flask app
app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///" + os.path.join(basedir, 'instance', 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_secret_key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')
app.json.compact = False

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

# Logging configuration
logging.basicConfig(level=logging.DEBUG)

# Validation functions
def validate_password(password):
    if len(password) < 8:
        raise BadRequest("Password must be at least 8 characters long")
    if not any(char.isdigit() for char in password):
        raise BadRequest("Password must contain at least one number")
    if not any(char.isalpha() for char in password):
        raise BadRequest("Password must contain at least one letter")
    return password

def validate_username(username):
    if len(username) < 3:
        raise BadRequest("Username must be at least 3 characters long")
    return username

def validate_recipe_input(data):
    if 'name' not in data or not data['name']:
        raise BadRequest("Recipe name is required")
    if 'description' not in data or not data['description']:
        raise BadRequest("Recipe description is required")
    if 'ingredient_ids' not in data or not data['ingredient_ids']:
        raise BadRequest("At least one ingredient is required")
    return data

class RecipeResource(Resource):
    def get(self):
        # Fetch all recipes from the database
        recipes = Recipe.query.all()

        # If no recipes exist
        if not recipes:
            return jsonify({"message": "No recipes found"}), 404

        # Convert recipes to dictionaries and return them in a list
        recipes_dict = [recipe.to_dict() for recipe in recipes]

        # Log the recipes (optional for debugging)
        logging.debug(f"Recipes dict: {recipes_dict}")

        # Return the list of recipes as a JSON response
        return jsonify(recipes_dict)
    
    def post(self):
        data = request.get_json()
        logging.info(f"Received data: {data}")

        try:
            # Validate the input data for the new recipe
            validate_recipe_input(data)
        except BadRequest as e:
            logging.error(f"Validation failed: {e}")
            return jsonify({"error": str(e)}), 400

        # Parse ingredient IDs
        ingredient_ids = [int(id) for id in data.get('ingredient_ids', []) if isinstance(id, int) or id.isdigit()]
        ingredients = Ingredient.query.filter(Ingredient.id.in_(ingredient_ids)).all()

        # Check if all the ingredients are valid
        if len(ingredients) != len(ingredient_ids):
            logging.error(f"Invalid ingredient IDs: {ingredient_ids}")
            return jsonify({"error": "One or more ingredient IDs are invalid"}), 400

        # Create a new Recipe object
        new_recipe = Recipe(
            name=data['name'],
            description=data['description'],
            user_id=data.get('user_id')
        )

        # Add ingredients to the new recipe
        for ingredient in ingredients:
            recipe_ingredient = RecipeIngredient(recipe=new_recipe, ingredient=ingredient)
            db.session.add(recipe_ingredient)

        try:
            # Add and commit the new recipe to the database
            db.session.add(new_recipe)
            db.session.commit()
            logging.info(f"Recipe added to database: {new_recipe.to_dict()}")
            return jsonify({
                'message': 'Recipe added!',
                'recipe': new_recipe.to_dict()
            }), 201
        except Exception as e:
            # Handle any errors during the database operation
            db.session.rollback()
            logging.error(f"Error during database operation: {e}")
            return jsonify({"error": "Could not add recipe", "details": str(e)}), 500

   

class RecipeDetailResource(Resource):
    def get(self, recipe_id):
        recipe = Recipe.query.get_or_404(recipe_id)
        return jsonify(recipe.to_dict())

    def patch(self, recipe_id):
        data = request.get_json()
        logging.info(f"PATCH request data for recipe {recipe_id}: {data}")

        recipe = Recipe.query.get_or_404(recipe_id)

        try:
            validate_recipe_input(data)
        except BadRequest as e:
            logging.error(f"Validation failed: {e}")
            return jsonify({"error": str(e)}), 400

        recipe.name = data.get('name', recipe.name)
        recipe.description = data.get('description', recipe.description)

        if 'ingredient_ids' in data:
            RecipeIngredient.query.filter_by(recipe_id=recipe.id).delete()
            ingredient_ids = data['ingredient_ids']
            ingredients = Ingredient.query.filter(Ingredient.id.in_(ingredient_ids)).all()
            for ingredient in ingredients:
                recipe_ingredient = RecipeIngredient(recipe=recipe, ingredient=ingredient)
                db.session.add(recipe_ingredient)

        try:
            db.session.commit()
            logging.info(f"Recipe {recipe_id} updated successfully")
            return jsonify({'message': 'Recipe updated!'}), 200
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error updating recipe {recipe_id}: {e}")
            return jsonify({"error": "Could not update recipe", "details": str(e)}), 500

    def delete(self, recipe_id):
        recipe = Recipe.query.get_or_404(recipe_id)
        db.session.delete(recipe)
        try:
            db.session.commit()
            return jsonify({'message': 'Recipe deleted!'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Could not delete recipe", "details": str(e)}), 500

class UserRegistrationResource(Resource):
    def post(self):
        data = request.get_json()
        logging.info(f"Registration request data: {data}")

        if not data:
            logging.error("No data received in the request")
            return jsonify({"error": "Invalid JSON data"}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            logging.error("Missing username or password in the request")
            return jsonify({"error": "Username and password are required"}), 400

        try:
            username = validate_username(username)
            password = validate_password(password)
        except BadRequest as e:
            logging.error(f"Validation failed: {e}")
            return jsonify({"error": str(e)}), 400

        user = User.query.filter_by(username=username).first()
        if user:
            logging.error(f"User {username} already exists")
            return jsonify({"error": "User already exists"}), 400

        try:
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            new_user = User(username=username, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()

            response_data = {
                'message': 'User created successfully',
                'user': {'id': new_user.id, 'username': new_user.username}
            }
            logging.info(f"User {username} registered successfully")
            return jsonify(response_data), 201
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error during user registration: {e}")
            return jsonify({"error": "Could not register user", "details": str(e)}), 500

class UserLoginResource(Resource):
    def post(self):
        data = request.get_json()
        logging.info(f"Login request data: {data}")

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            logging.error("Username or password missing in request")
            return jsonify({"error": "Username and password are required"}), 400

        user = User.query.filter_by(username=username).first()
        if not user:
            logging.error(f"User {username} not found")
            return jsonify({"error": "User not found"}), 404

        if not bcrypt.check_password_hash(user.password, password):
            logging.error("Invalid password")
            return jsonify({"error": "Invalid password"}), 401

        access_token = create_access_token(identity=username)
        logging.info(f"Login successful for user: {username}")
        return jsonify(access_token=access_token)

# Add resources to API
api.add_resource(RecipeResource, '/api/recipes')
api.add_resource(RecipeDetailResource, '/api/recipes/<int:recipe_id>')
api.add_resource(UserRegistrationResource, '/api/register')
api.add_resource(UserLoginResource, '/api/login/')

# Create database tables
def create_tables():
    with app.app_context():
        db.create_all()

create_tables()

# Run the application
if __name__ == '__main__':
    app.run(debug=True)