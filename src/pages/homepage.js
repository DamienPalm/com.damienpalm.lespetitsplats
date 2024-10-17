import { recipes } from "../../public/data/recipes.js";
import Filters from "../components/Filters.js";
import Header from "../components/Header.js";
import RecipeCard from "../components/RecipeCard.js";
import FilterManager from "../utils/FilterManager.js";
import SearchManager from "../utils/SearchManager.js";

const App = {
  init() {
    this.rootElement = document.getElementById("app");
    this.header = new Header();
    this.recipes = recipes;
    this.filteredRecipes = this.recipes;
    this.filters = new Filters(this.recipes);
    this.searchManager = new SearchManager(this);
    this.filterManager = new FilterManager(this);
    this.render();
  },

  render() {
    const displayedRecipesCount = this.filteredRecipes.length;
    this.filters = new Filters(this.recipes, displayedRecipesCount);
    this.rootElement.innerHTML = `
    ${this.header.render()}
    <main class="main">
      <section class="main__filters-section">
      ${this.filters.render()}
      </section>
      <section class="main__cards-section" id="recipe-cards-container">
        ${this.renderRecipeCards()}
      </section
    </main>
    `;

    this.searchManager.attachEventListeners();
    this.filterManager.attachEventListeners();
    this.updateRecipeCount();
  },

  renderRecipeCards() {
    return this.filteredRecipes
      .map((recipe) => new RecipeCard(recipe).render())
      .join("");
  },

  updateRecipeCards() {
    const cardsContainer = document.getElementById("recipe-cards-container");
    cardsContainer.innerHTML = this.renderRecipeCards();
    this.updateRecipeCount();
  },

  updateRecipeCount() {
    const count = this.filteredRecipes.length;
    this.filters.updateRecipeCount(count);
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
