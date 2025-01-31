from app import app, db
from models import User, Recipe, Ingredient, RecipeIngredient
from sqlalchemy.exc import IntegrityError

def seed_data():
    # Get user input for creating a new user
    username = input("Enter a username: ")
    password = input("Enter a password: ")

    # Create a new user with dynamic input
    try:
        user = User(username=username, password=password)
        db.session.add(user)
        db.session.commit()
        print(f"User {username} added successfully.")
    except IntegrityError:
        db.session.rollback()
        print("Username already exists. Please try again with a different name.")

    # Create ingredients
    ingredients = [
        "Coffee Beans",
        "Milk",
        "Sugar",
        "Water",
        "Cinnamon",
        "Chocolate Syrup",
        "Ice Cream",
        "Almond Milk",
        "Oat Milk",
        "Vanilla Syrup",
        "Honey",
        "Caramel Syrup",
        "Whipped Cream",
        "Nutmeg",
        "Coconut Milk",
        "Mocha Syrup",
        "Hazelnut Syrup",
        "Mint Leaves",
        "Lemon Zest",
        "Orange Peel"
    ]

    # Add ingredients to the database
    ingredient_objects = []
    for ingredient_name in ingredients:
        ingredient = Ingredient(name=ingredient_name)
        db.session.add(ingredient)
        ingredient_objects.append(ingredient)
    
    db.session.commit()  # Commit after all ingredients have been added to ensure they have IDs

    # Create recipes and link ingredients to them
    recipe_data = [
        {"name": "Cappuccino", "description": "A coffee with steamed milk", "ingredients": [ingredient_objects[0], ingredient_objects[1], ingredient_objects[2]]},
        {"name": "Iced Latte", "description": "Espresso, milk, and ice", "ingredients": [ingredient_objects[0], ingredient_objects[1], ingredient_objects[3]]},
        {"name": "Mocha", "description": "A chocolatey coffee drink", "ingredients": [ingredient_objects[0], ingredient_objects[5], ingredient_objects[1]]},
        {"name": "Caramel Macchiato", "description": "A sweet espresso drink", "ingredients": [ingredient_objects[0], ingredient_objects[1], ingredient_objects[11]]},
        {"name": "Vanilla Latte", "description": "Espresso with vanilla syrup", "ingredients": [ingredient_objects[0], ingredient_objects[1], ingredient_objects[9]]},
        {"name": "Iced Coffee", "description": "Cold brew coffee with ice", "ingredients": [ingredient_objects[0], ingredient_objects[3]]},
        {"name": "Flat White", "description": "Espresso with microfoam", "ingredients": [ingredient_objects[0], ingredient_objects[1]]},
        {"name": "Affogato", "description": "Espresso poured over ice cream", "ingredients": [ingredient_objects[0], ingredient_objects[6]]},
        {"name": "Nitro Coffee", "description": "Cold brew coffee infused with nitrogen", "ingredients": [ingredient_objects[0], ingredient_objects[3]]},
        {"name": "Chai Latte", "description": "Spiced tea with steamed milk", "ingredients": [ingredient_objects[3], ingredient_objects[14]]},
        {"name": "Latte", "description": "Espresso with steamed milk", "ingredients": [ingredient_objects[0], ingredient_objects[1]]},
        {"name": "Iced Mocha", "description": "A chilled mocha coffee with ice", "ingredients": [ingredient_objects[0], ingredient_objects[5], ingredient_objects[3]]},
        {"name": "Cinnamon Coffee", "description": "Coffee spiced with cinnamon", "ingredients": [ingredient_objects[0], ingredient_objects[4]]},
    ]

    # Add recipes and associate ingredients to them
    for recipe_info in recipe_data:
        recipe = Recipe(name=recipe_info["name"], description=recipe_info["description"], user_id=user.id)
        db.session.add(recipe)  # Add recipe before linking ingredients
        db.session.commit()  # Commit recipe so it gets an ID

        # Now link ingredients to recipe using RecipeIngredient
        for ingredient in recipe_info["ingredients"]:
            recipe_ingredient = RecipeIngredient(recipe_id=recipe.id, ingredient_id=ingredient.id)
            db.session.add(recipe_ingredient)
    
    db.session.commit()  # Commit all changes after adding RecipeIngredients
    print("Database seeded!")

if __name__ == '__main__':
    with app.app_context():
        seed_data()
