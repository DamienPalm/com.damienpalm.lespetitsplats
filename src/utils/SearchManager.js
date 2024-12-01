class SearchManager {
  constructor(app) {
    this.app = app;
    this.urlParams = new UrlParamsManager();
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
    let searchType = "nom";
    this.app.filteredRecipes = [];

    for (let i = 0; i < this.app.recipes.length; i++) {
      const recipe = this.app.recipes[i];
      let isMatch = false;

      if (recipe.name.toLowerCase().includes(lowerCaseSearchTerm)) {
        searchType = "nom";
        isMatch = true;
      }

      if (
        !isMatch &&
        recipe.appliance.toLowerCase().includes(lowerCaseSearchTerm)
      ) {
        searchType = "appareils";
        isMatch = true;
      }

      if (!isMatch) {
        for (let j = 0; j < recipe.ingredients.length; j++) {
          if (
            recipe.ingredients[j].ingredient
              .toLowerCase()
              .includes(lowerCaseSearchTerm)
          ) {
            searchType = "ingredients";
            isMatch = true;
            break;
          }
        }
      }

      if (!isMatch) {
        for (let k = 0; k < recipe.ustensils.length; k++) {
          if (recipe.ustensils[k].toLowerCase().includes(lowerCaseSearchTerm)) {
            searchType = "ustensiles";
            isMatch = true;
            break;
          }
        }
      }

      if (isMatch) {
        this.app.filteredRecipes.push(recipe);
      }
    }

    this.app.filterManager.filterRecipes();
    this.app.filterManager.updateFilterOptions();
    this.clearSuggestions();
  }

  clearSearch() {
    this.searchTerm = "";
    this.updateUrlWithSearch("", "");
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
