
from sqlalchemy.orm import relationship

from flask_sqlalchemy import SQLAlchemy

# Initialize db
db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "recipes": [recipe.to_dict() for recipe in self.recipes]  
        }

    recipes = relationship('Recipe', backref='user', lazy=True)

    def __repr__(self):
        return f"<User {self.username}>"

class Ingredient(db.Model):
    __tablename__ = 'ingredients'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    recipes = relationship('Recipe', secondary='recipe_ingredients', back_populates='ingredients')

    def to_dict(self):
        return {"id": self.id, "name": self.name}

    def __repr__(self):
        return f"<Ingredient {self.name}>"

class Recipe(db.Model):
    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    ingredients = relationship('Ingredient', secondary='recipe_ingredients', back_populates='recipes')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "user_id": self.user_id,
            "ingredients": [ingredient.to_dict() for ingredient in self.ingredients] 
        }

    def __repr__(self):
        return f"<Recipe {self.name}>"

class RecipeIngredient(db.Model):
    __tablename__ = 'recipe_ingredients'

    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.id'), primary_key=True)

    def __repr__(self):
        return f"<RecipeIngredient recipe_id={self.recipe_id}, ingredient_id={self.ingredient_id}>"
