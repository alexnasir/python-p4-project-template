import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import "./recipe.css"
import Navbar from './Navbar';

function CreateRecipe({ authToken }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientIds, setIngredientIds] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanIngredientIds = ingredientIds
      .split(',')
      .map(id => id.trim()) // Trim spaces around ingredient IDs
      .filter(id => id !== '' && !isNaN(id)); 
    if (cleanIngredientIds.length === 0) {
      setError('Please provide valid ingredient IDs.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name, description, ingredient_ids: cleanIngredientIds }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Recipe created successfully!');
        setError(''); // Clear any previous error
        setName('');
        setDescription('');
        setIngredientIds('');

        // Redirect to the homepage after successfully creating the recipe
        navigate('/home');
      } else {
        setError(data.error || 'Something went wrong!');
        setSuccess(''); // Clear any previous success message
      }
    } catch (err) {
      setError('Something went wrong!');
      setSuccess(''); // Clear any previous success message
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Create Recipe</h2>
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
        <input
          type="text"
          placeholder="Ingredient IDs"
          value={ingredientIds}
          onChange={(e) => setIngredientIds(e.target.value)}
        />
        <button type="submit">Create Recipe</button>
      </form>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreateRecipe;
