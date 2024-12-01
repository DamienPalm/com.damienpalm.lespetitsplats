class Filters {
  constructor(recipes, displayedRecipesCount) {
    this.recipes = recipes;
    this.displayedRecipesCount = displayedRecipesCount;
    this.categories = this.getUniqueElements();
  }

  getUniqueElements() {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    this.recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) =>
        ingredients.add(ingredient.ingredient.toLowerCase())
      );
      appliances.add(recipe.appliance.toLowerCase());
      recipe.ustensils.forEach((ustensil) =>
        ustensils.add(ustensil.toLowerCase())
      );
    });

    return {
      Ingredients: Array.from(ingredients),
      Appareils: Array.from(appliances),
      Ustensiles: Array.from(ustensils),
    };
  }

  updateRecipeCount(count) {
    const countElement = document.querySelector(
      ".main__filters-section__recipes-counter"
    );
    if (countElement) {
      countElement.textContent = `${count} recette${count > 1 ? "s" : ""}`;
    }
  }

  render() {
    this.updateRecipeCount(this.displayedRecipesCount);

    return `
    <section class="main__filters-section__filters-and-count">
      <section class="main__filters-section__filters">
        ${Object.entries(this.categories)
          .map(([category, items]) => this.renderDropdown(category, items))
          .join("")}
      </section>
      <p class="main__filters-section__recipes-counter"></p>
    </section>
    <section class="main__filters-section__tag"></section>
    `;
  }

  renderDropdown(category, items) {
    return `
    <div class="main__filters-section__filters__dropdown" data-filter-category="${category}">
      <button role="button" class="main__filters-section__filters__dropdown__select" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="sort-heading sort-button">
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
        <div class="main__filters-section__filters__dropdown__filter__active-filter"></div>
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

  renderTags(selectedTags) {
    const tagSection = document.querySelector(".main__filters-section__tag");
    tagSection.innerHTML = "";

    selectedTags.forEach((tag) => {
      const tagElement = document.createElement("div");
      tagElement.classList.add("filter-tag");
      tagElement.dataset.category = tag.category;
      tagElement.innerHTML = `
        ${tag.value}
        <i class="fa-solid fa-xmark remove-tag"></i>
      `;
      tagSection.appendChild(tagElement);
    });
  }

  attachEventListeners() {}
}

export default Filters;
