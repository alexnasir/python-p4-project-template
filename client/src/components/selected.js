import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

function SelectedRecipe() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    // Retrieve the selected recipe from localStorage
    const recipe = JSON.parse(localStorage.getItem('selectedRecipe'));
    if (recipe) {
      setSelectedRecipe(recipe);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <h2>Selected Recipe</h2>
      {selectedRecipe ? (
        <div>
          <h3>{selectedRecipe.name}</h3>
          <p>{selectedRecipe.description}</p>
          <ul>
            {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
              // Make sure ingredients is an array of strings, or map through the array
              selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.name || ingredient}</li>  
              ))
            ) : (
              <li>No ingredients listed</li>
            )}
          </ul>
        </div>
      ) : (
        <p>No recipe selected</p>
      )}
    </div>
  );
}

export default SelectedRecipe;
