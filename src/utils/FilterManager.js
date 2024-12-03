class FilterManager {
  constructor(app) {
    this.app = app;
    this.categories = ["Ingredients", "Appareils", "Ustensiles"];
    this.selectedTags = [];
    this.searchManager = app.searchManager;
  }

  attachEventListeners() {
    this.categories.forEach((category) => {
      const dropdown = document.querySelector(
        `.main__filters-section__filters__dropdown[data-filter-category="${category}"]`
      );
      const button = dropdown.querySelector(
        ".main__filters-section__filters__dropdown__select"
      );
      const input = dropdown.querySelector(
        ".main__filters-section__filters__dropdown__filter__search-bar"
      );
      const filterList = dropdown.querySelector(
        ".main__filters-section__filters__dropdown__filter__filters-list"
      );

      button.addEventListener("click", () => this.toggleDropdown(category));
      input.addEventListener("input", (event) =>
        this.handleInput(event, category)
      );
      filterList.addEventListener("click", (event) =>
        this.handleFilterSelection(event, category)
      );
    });
  }

  toggleDropdown(category) {
    const dropdown = document.querySelector(
      `.main__filters-section__filters__dropdown[data-filter-category="${category}"]`
    );
    const button = dropdown.querySelector(
      ".main__filters-section__filters__dropdown__select"
    );
    const filterContent = dropdown.querySelector(
      ".main__filters-section__filters__dropdown__filter"
    );
    const chevron = dropdown.querySelector(".chevron-down");

    button.classList.toggle("open");
    filterContent.classList.toggle("active");
    chevron.classList.toggle("chevron-up");
  }

  handleInput(event, category) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchFilters(category, searchTerm);
  }

  searchFilters(category, searchTerm) {
    const toLowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredItems = this.app.filters.categories[category].filter((item) =>
      item.toLowerCase().includes(toLowerCaseSearchTerm)
    );

    this.updateFilterList(category, filteredItems);
  }

  updateFilterList(category, items) {
    const filterList = document.querySelector(
      `.main__filters-section__filters__dropdown[data-filter-category="${category}"] .main__filters-section__filters__dropdown__filter__filters-list`
    );
    filterList.innerHTML = items
      .map(
        (item) =>
          `<li class="main__filters-section__filters__dropdown__filter__filters-list__item" role="option">${item}</li>`
      )
      .join("");
  }

  updateFilterOptions() {
    const currentRecipes = this.app.filteredRecipes;
    const availableIngredients = new Set();
    const availableAppliances = new Set();
    const availableUstensils = new Set();

    currentRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) =>
        availableIngredients.add(ingredient.ingredient.toLowerCase())
      );
      availableAppliances.add(recipe.appliance.toLowerCase());
      recipe.ustensils.forEach((ustensil) =>
        availableUstensils.add(ustensil.toLowerCase())
      );
    });

    this.updateFilterList("Ingredients", [...availableIngredients]);
    this.updateFilterList("Appareils", [...availableAppliances]);
    this.updateFilterList("Ustensiles", [...availableUstensils]);
  }

  handleFilterSelection(event, category) {
    if (
      event.target.classList.contains(
        "main__filters-section__filters__dropdown__filter__filters-list__item"
      )
    ) {
      const selectedValue = event.target.textContent;
      this.addTag(category, selectedValue);
      this.filterRecipes();
    }
  }

  addTag(category, value) {
    if (
      !this.selectedTags.some(
        (tag) => tag.category === category && tag.value === value
      )
    ) {
      this.selectedTags.push({ category, value });
      this.app.filters.renderTags(this.selectedTags);
      this.attachRemoveTagListeners();
      this.filterRecipes();
      this.updateUrlWithFilter();
    }
  }

  removeTag(category, value) {
    this.selectedTags = this.selectedTags.filter(
      (tag) => !(tag.category === category && tag.value === value)
    );
    this.app.filters.renderTags(this.selectedTags);
    this.filterRecipes();
  }

  attachRemoveTagListeners() {
    const tagSection = document.querySelector(".main__filters-section__tag");
    tagSection.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("remove-tag") ||
        event.target.parentElement.classList.contains("remove-tag")
      ) {
        const tagElement = event.target.closest(".filter-tag");
        const category = tagElement.dataset.category;
        const value = tagElement.textContent.trim();
        this.removeTag(category, value);
      }
    });
  }

  filterRecipes() {
    const searchTerm = this.app.searchManager.searchTerm
      ? this.app.searchManager.searchTerm.toLowerCase()
      : "";

    this.app.filteredRecipes = [];

    for (let i = 0; i < this.app.recipes.length; i++) {
      const recipe = this.app.recipes[i];
      let matchesSearch = false;
      let matchesFilters = true;

      if (searchTerm === "") {
        matchesSearch = true;
      } else {
        if (
          recipe.name.toLowerCase().includes(searchTerm) ||
          recipe.description.toLowerCase().includes(searchTerm)
        ) {
          matchesSearch = true;
        } else {
          for (let j = 0; j < recipe.ingredients.length; j++) {
            if (
              recipe.ingredients[j].ingredient
                .toLowerCase()
                .includes(searchTerm)
            ) {
              matchesSearch = true;
              break;
            }
          }
        }
      }

      for (let l = 0; l < this.selectedTags.length; l++) {
        const tag = this.selectedTags[l];
        let tagMatches = false;

        switch (tag.category) {
          case "Ingredients":
            for (let m = 0; m < recipe.ingredients.length; m++) {
              if (
                recipe.ingredients[m].ingredient.toLowerCase() ===
                tag.value.toLowerCase()
              ) {
                tagMatches = true;
                break;
              }
            }
            break;
          case "Appareils":
            if (recipe.appliance.toLowerCase() === tag.value.toLowerCase()) {
              tagMatches = true;
            }
            break;
          case "Ustensiles":
            for (let n = 0; n < recipe.ustensils.length; n++) {
              if (
                recipe.ustensils[n].toLowerCase() === tag.value.toLowerCase()
              ) {
                tagMatches = true;
                break;
              }
            }
            break;
        }

        if (!tagMatches) {
          matchesFilters = false;
          break;
        }
      }

      if (matchesSearch && matchesFilters) {
        this.app.filteredRecipes.push(recipe);
      }
    }

    this.app.filters.renderTags(this.selectedTags);
    this.updateFilterOptions();
    this.app.updateRecipeCards();
  }
}

export default FilterManager;
