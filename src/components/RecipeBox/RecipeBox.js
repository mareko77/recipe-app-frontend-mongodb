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
    fetch(`https://recipe-app-backend-mongodb-9.onrender.com/recipes/${this.props.user.id}`)
      .then((response) => response.json())
      .then((recipes) => this.setState({ recipes }))
      .catch((err) => console.error('Error fetching recipes:', err));
  };

  onInputChange = (field, value) => {
    this.setState({ [field]: value });
  };

  onSubmitRecipe = () => {
    const { name, description, ingredients,  url_photo, editingRecipeId } = this.state;
    const { user } = this.props;

   
    if (editingRecipeId) {
      fetch(`https://recipe-app-backend-mongodb-9.onrender.com/recipes/${editingRecipeId}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name,
          description,
          ingredients, /*: ingredientsArray,*/
          url_photo,
        }),
      })
        .then(() => {
          this.fetchRecipes();
          this.setState({ name: '', description: '', ingredients: '',  url_photo: '', editingRecipeId: null });
        })
        .catch((err) => console.error('Error updating recipe:', err));
    } else {
      fetch('https://recipe-app-backend-mongodb-9.onrender.com/recipes', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name,
          description,
          ingredients,
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
    fetch(`https://recipe-app-backend-mongodb-9.onrender.com/recipes/${recipeId}`, { method: 'delete' })
      .then(() => this.fetchRecipes())
      .catch((err) => console.error('Error deleting recipe:', err));
  };

  onEditRecipe = (recipe) => {
    this.setState({
      editingRecipeId: recipe._id, 
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      url_photo: recipe.url_photo,
    });
  };

  render(){
    const { recipes, name, description, ingredients,  url_photo } = this.state;

    return (
      <div className="pa4">
        <h1 className="tc f3 fw6">Your Recipes</h1>
        <div className="mb4 bg-sand pa3 br3 shadow-2">
          <h2 className="f4">Add or Edit a Recipe</h2>
          <input
            type="text"
            placeholder="Recipe Name"
            className="pa2 input-reset ba b--black-20 br3 w-100 mb3"
            value={name}
            onChange={(e) => this.onInputChange('name', e.target.value)}
          />
          <textarea
            placeholder="Instructions"
            className="pa2 input-reset ba b--black-20 br3 w-100 mb3"
            value={description}
            onChange={(e) => this.onInputChange('description', e.target.value)}
          />
          <textarea
            placeholder="Ingredients (comma-separated)"
            className="pa2 input-reset ba b--black-20 br3 w-100 mb3"
            value={ingredients}
            onChange={(e) => this.onInputChange('ingredients', e.target.value)}
          />


          <input
            type="text"
            placeholder="Photo URL"
            className="pa2 input-reset ba b--black-20 br3 w-100 mb3"
            value={url_photo}
            onChange={(e) => this.onInputChange('url_photo', e.target.value)}
          />
          <button
            onClick={this.onSubmitRecipe}
            className="pa2 ba bw1 b--black-20 bg-blue br3 grow pointer"
          >
            {this.state.editingRecipeId ? 'Update Recipe' : 'Add Recipe'}
          </button>
        </div>

        <div className="flex flex-wrap justify-center">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white ba b--black-20 pa3 ma2 br3 shadow-1 w-100 w-50-m w-25-l flex flex-column justify-between"
            >
              <div>
                <h2 className="f5 fw6 mb2">{recipe.name}</h2>
                <p className="f6 mb2">
                  <strong>Instruction:</strong> {recipe.description}
                </p>
                <p className="f6 mb2">
                  <strong>Ingredients:</strong> {recipe.ingredients}
                </p>
                {recipe.url_photo && (
                  <img
                    src={recipe.url_photo}
                    alt={recipe.name}
                    className="w-100 h-auto br3 mb2"
                  />
                )}
              </div>
              <div className="flex justify-between mt3">
                <button
                  onClick={() => this.onEditRecipe(recipe)}
                  className="pa1 ba bw1 b--blue bg-light-blue br3 pointer grow"
                >
                  Edit
                </button>
                <button
                    onClick={() => this.onDeleteRecipe(recipe._id)}
                    className="pa1 ba bw1 b--red bg-light-red br3 pointer grow"
                >
                    Delete
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

