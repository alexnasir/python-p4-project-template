import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // useParams hook for accessing route params
import Navbar from './Navbar';

function RecipeDetail() {
  const { recipeId } = useParams();  // Access the recipeId parameter from the URL
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`http://127.0.0.1:5000/api/recipes/${recipeId}`);
      const data = await response.json();
      setRecipe(data);
    };

    fetchRecipe();
  }, [recipeId]);  // Re-fetch when recipeId changes

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <h2>{recipe.name}</h2>
      <p>{recipe.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeDetail;
