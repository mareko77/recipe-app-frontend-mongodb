import React, { Component } from 'react';

class RecipeBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      name: '',
      description: '',
      ingredients: '',
      url_photo: '',
      editingRecipeId: null,
    };
  }

  componentDidMount() {
    this.fetchRecipes();
  }

  fetchRecipes = () => {
    fetch(`http://localhost:3002/recipes/${this.props.user.id}`)
      .then((response) => response.json())
      .then((recipes) => this.setState({ recipes }))
      .catch((err) => console.error('Error fetching recipes:', err));
  };

  onInputChange = (field, value) => {
    this.setState({ [field]: value });
  };

  onSubmitRecipe = () => {
    const { name, description, ingredients, url_photo, editingRecipeId } = this.state;
    const { user } = this.props;

    const ingredientsArray = ingredients.split(',').map((ingredient) => ingredient.trim());

    if (editingRecipeId) {
      fetch(`http://localhost:3002/recipes/${editingRecipeId}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name,
          description,
          ingredients: ingredientsArray,
          url_photo,
        }),
      })
        .then(() => {
          this.fetchRecipes();
          this.setState({ name: '', description: '', ingredients: '', url_photo: '', editingRecipeId: null });
        })
        .catch((err) => console.error('Error updating recipe:', err));
    } else {
      fetch('http://localhost:3002/recipes', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name,
          description,
          ingredients: ingredientsArray,
          url_photo,
        }),
      })
        .then(() => {
          this.fetchRecipes();
          this.setState({ name: '', description: '', ingredients: '', url_photo: '' });
        })
        .catch((err) => console.error('Error adding recipe:', err));
    }
  };

  onDeleteRecipe = (recipeId) => {
    fetch(`http://localhost:3002/recipes/${recipeId}`, { method: 'delete' })
      .then(() => this.fetchRecipes())
      .catch((err) => console.error('Error deleting recipe:', err));
  };

  onEditRecipe = (recipe) => {
    this.setState({
      editingRecipeId: recipe._id, // Use _id for MongoDB
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients.join(', '), // Convert array to comma-separated string
      url_photo: recipe.url_photo,
    });
  };

  render() {
    const { recipes, name, description, ingredients, url_photo, editingRecipeId } = this.state;

    return (
      <div className="pa4">
        <div className="mb3">
          <input
            type="text"
            placeholder="Recipe Name"
            className="pa2 input-reset ba bg-transparent w-100 mb2"
            value={name}
            onChange={(e) => this.onInputChange('name', e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="pa2 input-reset ba bg-transparent w-100 mb2"
            value={description}
            onChange={(e) => this.onInputChange('description', e.target.value)}
          />
          <textarea
            placeholder="Ingredients (comma-separated)"
            className="pa2 input-reset ba bg-transparent w-100 mb2"
            value={ingredients}
            onChange={(e) => this.onInputChange('ingredients', e.target.value)}
          />
          <input
            type="text"
            placeholder="Photo URL"
            className="pa2 input-reset ba bg-transparent w-100 mb2"
            value={url_photo}
            onChange={(e) => this.onInputChange('url_photo', e.target.value)}
          />
          <button onClick={this.onSubmitRecipe} className="pa2 ba bw1 bg-light-green">
            {editingRecipeId ? 'Update Recipe' : 'Add Recipe'}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap3">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-item flex flex-column items-center mb4 pa3 ba b--black-20">
              <h2 className="f4">{recipe.name}</h2>
              <p>{recipe.description}</p>
              <p>
                <strong>Ingredients:</strong> {recipe.ingredients}
              </p>
              <img 
                src={recipe.url_photo} 
                alt={recipe.name} 
                className="w-100 h-auto mw5 mh3" 
              />
              <div className="recipe-buttons mt2 flex justify-center gap2">
                <button
                  onClick={() => this.onDeleteRecipe(recipe.id)}
                  className="pa2 ba bw1 bg-light-red mt2 f6 link white bg-red ba b--red br2 hover-bg-light-red"
                >
                  Delete
                </button>
                <button
                  onClick={() => this.onEditRecipe(recipe)}
                  className="pa2 ba bw1 bg-light-yellow mt2 f6 link black bg-yellow ba b--yellow br2 hover-bg-light-yellow"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default RecipeBox;
