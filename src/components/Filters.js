class Filters {
  constructor(recipes, displayedRecipesCount) {
    this.recipes = recipes;
    this.displayedRecipesCount = displayedRecipesCount;
    this.categories = {
      ingredients: this.getUniqueIngredients(),
      appliances: this.getUniqueAppliances(),
      ustensils: this.getUniqueUstensils(),
    };
  }

  getUniqueIngredients() {
    return [
      ...new Set(
        this.recipes.flatMap((recipe) =>
          recipe.ingredients.map((ing) => ing.ingredient)
        )
      ),
    ];
  }

  getUniqueAppliances() {
    return [...new Set(this.recipes.map((recipe) => recipe.appliance))];
  }

  getUniqueUstensils() {
    return [...new Set(this.recipes.flatMap((recipe) => recipe.ustensils))];
  }

  render() {
    return `
      <section class="main__filters-section__filters">
        ${Object.entries(this.categories)
          .map(([category, items]) => this.renderDropdown(category, items))
          .join("")}
      </section>
      <p class="main__filters-section__recipes-counter">${
        this.displayedRecipesCount
      } recettes</p>
    `;
  }

  renderDropdown(category, items) {
    return `
    <div class="main__filters-section__filters__dropdown">
      <button role="button" class="main__filters-section__filters__dropdown__select" data-filter-category="${category}" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="sort-heading sort-button">
        <span class="main__filters-section__filters__dropdown__select--selected">${category}</span>
        <i class="fa-solid fa-chevron-down chevron-down" aria-hidden="true"></i>
      </button>
      <div class="main__filters-section__filters__dropdown__filter" data-filter-category="${category}">
        <div class="main__filters-section__filters__dropdown__filter__search-bar-container">
          <input type="search" name="search-bar" class="main__filters-section__filters__dropdown__filter__search-bar">
          <button class="main__filters-section__filters__dropdown__filter__button" type="submit">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <span class="main__filters-section__filters__dropdown__filtes__active-filter"></span>
        <ul class="main__filters-section__filters__dropdown__filter__filters-list" role="listbox" aria-labelledby="sort-button">
        ${items
          .map(
            (item) =>
              `<li class="main__filters-section__filters__dropdown__filter__filters-list__item" role="option">${item}</li>`
          )
          .join("")}
        </ul>
      </div>
    </div>
    `;
  }
}

export default Filters;
