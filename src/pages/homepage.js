import { recipes } from "../../public/data/recipes.js";
import Header from "../components/Header.js";
import RecipeCard from "../components/RecipeCard.js";

const App = {
  init() {
    this.rootElement = document.getElementById("app");
    this.header = new Header();
    this.recipes = recipes;
    this.render();
    this.attachComponentEventListeners();
  },

  render() {
    this.rootElement.innerHTML = `
    ${this.header.render()}
    <main class="main">
      <section class="main__cards-section">
        ${this.recipes
          .map((recipe) => new RecipeCard(recipe).render())
          .join("")}
      </section
    </main>
    `;
  },

  attachComponentEventListeners() {},
};

document.addEventListener("DOMContentLoaded", () => App.init());
