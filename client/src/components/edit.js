import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditRecipe({ authToken }) {
  const { id } = useParams();  // Get recipe ID from URL
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredients, setIngredients] = useState([]);  // Initialize ingredients as an empty array
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();  // Initialize the navigate function

  // Fetch the current recipe data from the API
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setDescription(data.description);
          setIngredients(data.ingredient_ids || []);  // Ensure ingredients is an array
        } else {
          setError('Failed to fetch recipe');
        }
      } catch (err) {
        setError('Failed to fetch recipe');
      }
    };

    fetchRecipe();
  }, [id]);

  const handleAddIngredient = () => {
    if (!ingredientName || !ingredientQuantity) {
      setError('Please enter both ingredient name and quantity.');
      return;
    }

    const newIngredient = { name: ingredientName, quantity: ingredientQuantity };
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);

    // Reset the ingredient input fields
    setIngredientName('');
    setIngredientQuantity('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeData = {
      name,
      description,
      ingredient_ids: ingredients,  // Ingredients as an array of objects
    };

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Recipe updated successfully!');
        setError('');
        navigate(`/recipes/${id}`);  // Redirect to the updated recipe details page
      } else {
        setError(data.error || 'Something went wrong!');
        setSuccess('');
      }
    } catch (err) {
      setError('Something went wrong!');
      setSuccess('');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;  // Display the error if it occurred
  }

  return (
    <div>
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipe Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Recipe Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        
        <div className="ingredient-input">
          <input
            type="text"
            placeholder="Ingredient Name"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Quantity"
            value={ingredientQuantity}
            onChange={(e) => setIngredientQuantity(e.target.value)}
          />
          <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
        </div>

        <div>
          <h4>Ingredients:</h4>
          {ingredients.length === 0 ? (
            <p>No ingredients added yet. You can add them below.</p>
          ) : (
            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name} - {ingredient.quantity}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit">Save Changes</button>
      </form>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default EditRecipe;
