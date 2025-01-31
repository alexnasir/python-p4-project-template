import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import RecipeDetail from './recipeDetail';

function RecipeList() {
  const [recipe, setRecipe] = useState(null); // State for a single recipe
  const [error, setError] = useState(null);

  const id = 1; // Hardcoded ID for demonstration (replace with dynamic value)

  useEffect(() => {
    // Fetch a single recipe by ID
    fetch(`http://127.0.0.1:5000/api/recipes/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }
        return response.json();
      })
      .then((data) => setRecipe(data)) // Set the single recipe
      .catch((err) => setError(err.message));
  }, [id]); // Re-fetch if `id` changes

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!recipe) {
    return <div>Loading...</div>; // Show a loading message while fetching
  }

  return (
    <div>
      <Navbar />
      <h2>Recipe List</h2>
      <ul>
        <li key={recipe.id}>
          <strong>{recipe.name}</strong>: {recipe.description}
        </li>
       <RecipeDetail />
        

      </ul>
      <button>Edit</button>
      <button>Delete</button>
    </div>
  );
}

export default RecipeList;