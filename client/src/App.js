import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use `Routes` instead of `Switch`

import CreateRecipe from './components/recipe';
import RecipeList from './components/recipeList';
import RecipeDetail from './components/recipeDetail';
import Home from './components/Home';
import Sign from './components/sign'
import "./index.css"
import EditRecipe from './components/edit';
import SelectedRecipe from './components/selected';


function App() {
  return (
    <Router>
      <Routes>  
        <Route path="/" element={<Sign  />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-recipe" element={<CreateRecipe />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:recipeId" element={<RecipeDetail />} />
        <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        <Route path="/selected-recipe" element={<SelectedRecipe />} />

      </Routes>
    </Router>
  );
}

export default App;
