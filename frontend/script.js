//  const API_URL = 'https://literate-umbrella-r46rw474xv6hxr4p-3000.app.github.dev';  // Update this with your actual API URL
const API_URL = 'https://literate-spork-r4p7vqxg97w52ppjg-8000.app.github.dev'; 

async function fetchRecipes() {
    try {
        let response = await axios.get(`${API_URL}/recipes`);
        let recipes = response.data.recipes;
        let recipeListHtml = '';

        for (let recipe of recipes) {
            recipeListHtml += `
                <div class="recipe">
                    <h3>${recipe.name}</h3>
                    <p>Cuisine: ${recipe.cuisine.name}</p>
                    <p>Prep Time: ${recipe.prepTime} minutes</p>
                    <button onclick="viewRecipe('${recipe._id}')">View Details</button>
                    <button onclick="deleteRecipe('${recipe._id}')">Delete Recipe</button>
                    <button onclick="showAddReviewForm('${recipe._id}')">Add Review</button>
                </div>
            `;
        }

        document.getElementById('recipeList').innerHTML = recipeListHtml;
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

async function addRecipe() {
    let name = document.getElementById('recipeName').value;
    let cuisine = document.getElementById('cuisine').value;
    let prepTime = document.getElementById('prepTime').value;
    let cookTime = document.getElementById('cookTime').value;
    let servings = document.getElementById('servings').value;
    let ingredients = document.getElementById('ingredients').value.split(',').map(item => ({ name: item.trim() }));
    let instructions = document.getElementById('instructions').value.split('\n');
    let tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());

    try {
        await axios.post(`${API_URL}/recipes`, {
            name, cuisine, prepTime, cookTime, servings, ingredients, instructions, tags
        });
        alert('Recipe added successfully!');
        fetchRecipes();
    } catch (error) {
        console.error('Error adding recipe:', error);
        alert('Failed to add recipe. Please try again.');
    }
}

async function viewRecipe(id) {
    try {
        let response = await axios.get(`${API_URL}/recipes/${id}`);
        let recipe = response.data;
        let recipeHtml = `
            <h2>${recipe.name}</h2>
            <p>Cuisine: ${recipe.cuisine.name}</p>
            <p>Prep Time: ${recipe.prepTime} minutes</p>
            <p>Cook Time: ${recipe.cookTime} minutes</p>
            <p>Servings: ${recipe.servings}</p>
            <h3>Ingredients:</h3>
            <ul>${recipe.ingredients.map(ing => `<li>${ing.name}</li>`).join('')}</ul>
            <h3>Instructions:</h3>
            <ol>${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}</ol>
            <h3>Tags:</h3>
            <p>${recipe.tags.map(tag => tag.name).join(', ')}</p>
            <h3>Reviews:</h3>
        `;

        if (recipe.reviews && recipe.reviews.length > 0) {
            for (let review of recipe.reviews) {
                recipeHtml += `
                    <div class="review">
                        <p><strong>${review.user}</strong> - Rating: ${review.rating}</p>
                        <p>${review.comment}</p>
                        <button onclick="showUpdateReviewForm('${id}', '${review.review_id}', '${review.user}', ${review.rating}, '${review.comment}')">Update Review</button>
                        <button onclick="deleteReview('${id}', '${review.review_id}')">Delete Review</button>
                    </div>
                `;
            }
        } else {
            recipeHtml += '<p>No reviews yet.</p>';
        }

        document.getElementById('recipeList').innerHTML = recipeHtml;
    } catch (error) {
        console.error('Error viewing recipe:', error);
    }
}

async function deleteRecipe(id) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        try {
            await axios.delete(`${API_URL}/recipes/${id}`);
            alert('Recipe deleted successfully!');
            fetchRecipes();
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Failed to delete recipe. Please try again.');
        }
    }
}

function showAddReviewForm(recipeId) {
    document.getElementById('reviewRecipeId').value = recipeId;
    document.getElementById('addReviewForm').style.display = 'block';
}

async function addReview() {
    let recipeId = document.getElementById('reviewRecipeId').value;
    let user = document.getElementById('reviewUser').value;
    let rating = document.getElementById('reviewRating').value;
    let comment = document.getElementById('reviewComment').value;

    try {
        await axios.post(`${API_URL}/recipes/${recipeId}/reviews`, { user, rating, comment });
        alert('Review added successfully!');
        document.getElementById('addReviewForm').style.display = 'none';
        viewRecipe(recipeId);
    } catch (error) {
        console.error('Error adding review:', error);
        alert('Failed to add review. Please try again.');
    }
}

function showUpdateReviewForm(recipeId, reviewId, user, rating, comment) {
    document.getElementById('updateReviewRecipeId').value = recipeId;
    document.getElementById('updateReviewId').value = reviewId;
    document.getElementById('updateReviewUser').value = user;
    document.getElementById('updateReviewRating').value = rating;
    document.getElementById('updateReviewComment').value = comment;
    document.getElementById('updateReviewForm').style.display = 'block';
}

async function updateReview() {
    let recipeId = document.getElementById('updateReviewRecipeId').value;
    let reviewId = document.getElementById('updateReviewId').value;
    let user = document.getElementById('updateReviewUser').value;
    let rating = document.getElementById('updateReviewRating').value;
    let comment = document.getElementById('updateReviewComment').value;

    try {
        await axios.put(`${API_URL}/recipes/${recipeId}/reviews/${reviewId}`, { user, rating, comment });
        alert('Review updated successfully!');
        document.getElementById('updateReviewForm').style.display = 'none';
        viewRecipe(recipeId);
    } catch (error) {
        console.error('Error updating review:', error);
        alert('Failed to update review. Please try again.');
    }
}

async function deleteReview(recipeId, reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        try {
            await axios.delete(`${API_URL}/recipes/${recipeId}/reviews/${reviewId}`);
            alert('Review deleted successfully!');
            viewRecipe(recipeId);
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review. Please try again.');
        }
    }
}

// Load recipes when the page loads
fetchRecipes();