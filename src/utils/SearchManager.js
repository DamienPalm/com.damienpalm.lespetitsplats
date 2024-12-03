class SearchManager {
  constructor(app) {
    this.app = app;
    this.searchTerm;
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
    if (searchTerm.length >= 3) {
      this.search(searchTerm);
    } else {
      this.clearSearch();
    }
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
    if (searchTerm.length < 3) {
      this.clearSearch();
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    this.app.filteredRecipes = this.app.recipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        recipe.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    });

    this.clearSuggestions();
    this.app.filterManager.filterRecipes();
  }

  clearSearch() {
    this.searchTerm = "";
    this.app.filterManager.filterRecipes();
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
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some((ing) =>
          ing.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
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
    const searchInput = document.getElementById("header__search-bar");
    searchInput.value = suggestion;
    this.searchTerm = suggestion;
    this.clearSuggestions();
    this.search(suggestion);
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
}

export default SearchManager;
