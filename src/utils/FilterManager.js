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

    this.app.filteredRecipes = this.app.recipes.filter((recipe) => {
      const matchesSearch =
        searchTerm === "" ||
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.appliance.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some((ing) =>
          ing.ingredient.toLowerCase().includes(searchTerm)
        ) ||
        recipe.ustensils.some((ustensil) =>
          ustensil.toLowerCase().includes(searchTerm)
        );

      const matchesFilters = this.selectedTags.every((tag) => {
        switch (tag.category) {
          case "Ingredients":
            return recipe.ingredients.some(
              (ingredient) =>
                ingredient.ingredient.toLowerCase() === tag.value.toLowerCase()
            );
          case "Appareils":
            return recipe.appliance.toLowerCase() === tag.value.toLowerCase();
          case "Ustensiles":
            return recipe.ustensils.some(
              (ustensil) => ustensil.toLowerCase() === tag.value.toLowerCase()
            );

          default:
            return true;
        }
      });

      return matchesSearch && matchesFilters;
    });

    this.app.filters.renderTags(this.selectedTags);
    this.app.updateRecipeCards();
  }
}

export default FilterManager;
