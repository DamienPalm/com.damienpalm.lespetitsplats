import UrlParamsManager from "./UrlParamsManager.js";

class SearchManager {
  constructor(app) {
    this.app = app;
    this.urlParams = new UrlParamsManager();
    this.searchTerm;
    this.initializeFromUrl();
  }

  attachEventListeners() {
    const searchForm = document.querySelector(".header__search-bar-form");
    const searchInput = document.getElementById("header__search-bar");

    searchForm.addEventListener("submit", this.handleSubmit.bind(this));
    searchInput.addEventListener("input", this.handleInput.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    const searchTerm = document.getElementById("header__search-bar").value;
    console.log("Recherche soumise : ", searchTerm);
    this.search(searchTerm);
  }

  handleInput(event) {
    this.searchTerm = event.target.value;
    this.updateSuggestions(this.searchTerm);

    if (this.searchTerm.length < 3) {
      this.clearSuggestions();
    } else {
      this.updateSuggestions(this.searchTerm);
    }
  }

  search(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let searchType = "name";

    this.app.filteredRecipes = this.app.recipes.filter((recipe) => {
      switch (true) {
        case recipe.name.toLowerCase().includes(lowerCaseSearchTerm):
          searchType = "name";
          return true;

        case recipe.appliance.toLowerCase().includes(lowerCaseSearchTerm):
          searchType = "appliance";
          return true;

        case recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(lowerCaseSearchTerm)
        ):
          searchType = "ingredient";
          return true;

        case recipe.ustensils.some((ustensil) =>
          ustensil.toLowerCase().includes(lowerCaseSearchTerm)
        ):
          searchType = "ustensil";
          return true;

        default:
          return false;
      }
    });

    this.updateUrlWithSearch(searchType, searchTerm);
    this.app.render();
  }

  updateSuggestions(searchTerm) {
    if (this.searchTerm.length < 3) {
      return;
    }

    const suggestions = this.getSuggestions(searchTerm);
    this.displaySuggestions(suggestions);
  }

  getSuggestions(searchTerm) {
    const recipeSuggestions = new Set();

    this.app.recipes.forEach((recipe) => {
      if (
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.appliance.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ing) =>
          ing.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        recipe.ustensils.some((ustensil) =>
          ustensil.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        recipeSuggestions.add(recipe.name);
      }
    });

    return recipeSuggestions;
  }

  displaySuggestions(suggestions) {
    const searchForm = document.querySelector(".header__search-bar-form");
    const suggestionsContainer = document.querySelector(
      ".header__search-bar-suggestions"
    );

    suggestionsContainer.innerHTML = "";

    suggestions.forEach((suggestion) => {
      const suggestionElement = document.createElement("p");
      suggestionElement.classList.add("suggestion-item");
      suggestionElement.textContent = suggestion;
      suggestionElement.addEventListener("click", () =>
        this.selectSuggestion(suggestion)
      );
      suggestionsContainer.appendChild(suggestionElement);
    });

    searchForm.classList.add("open-suggestions");
    suggestionsContainer.classList.add("active");
  }

  selectSuggestion(suggestion) {
    this.search(suggestion);
    this.clearSuggestions();
  }

  clearSuggestions() {
    const searchForm = document.querySelector(".header__search-bar-form");
    const suggestionsContainer = document.querySelector(
      ".header__search-bar-suggestions"
    );
    suggestionsContainer.innerHTML = "";
    searchForm.classList.remove("open-suggestions");
    suggestionsContainer.classList.remove("active");
  }

  updateUrlWithSearch(searchType, searchTerm) {
    const url = new URL(window.location);
    ["name", "ingredient", "applicance", "ustensil"].forEach((type) => {
      url.searchParams.delete(type);
    });

    if (searchTerm) {
      url.searchParams.set(searchType, encodeURIComponent(searchTerm));
    }

    window.history.pushState({}, "", url);
  }

  initializeFromUrl() {
    const url = new URL(window.location);
    const searchTypes = ["name", "ingredient", "appliance", "ustensil"];

    for (const type of searchTypes) {
      const searchTerm = url.searchParams.get(type);
      if (searchTerm) {
        document.getElementById("header__search-bar").value =
          decodeURIComponent(searchTerm);
        this.search(decodeURIComponent(searchTerm));
        break;
      }
    }
  }
}

export default SearchManager;
