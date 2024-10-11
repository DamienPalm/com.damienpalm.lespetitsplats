class RecipeCard {
  constructor(recipe) {
    this.id = recipe.id;
    this.image = recipe.image;
    this.name = recipe.name;
    this.servings = recipe.servings;
    this.ingredients = recipe.ingredients;
    this.time = recipe.time;
    this.description = recipe.description;
    this.appliance = recipe.appliance;
    this.ustensils = recipe.ustensils;
  }

  render() {
    return `
      <article class="main__cards-section__card" data-id="${this.id}">
        <img src="../src/assets/images/recettes/${this.image}" alt="${
      this.name
    }" class="main__cards-section__card__recipes-photo">
        <div class="main__cards-section__card__body-card">
          <h2 class="main__cards-section__card__body-card__recipes-name">${
            this.name
          }</h2>
          <div class="main__cards-section__card__body-card__recipes-description">
            <h3 class="main__cards-section__card__body-card__recipes-description__title">Recette</h3>
            <p class="main__cards-section__card__body-card__recipes-description__description">${
              this.description
            }</p>
          </div>
          <div class="main__cards-section__card__body-card__recipes-description">
            <h3 class="main__cards-section__card__body-card__recipes-description__title">Ingrédients</h3>
            <ul class="main__cards-section__card__body-card__recipes-description__ingedients">
              ${this.ingredients
                .map(
                  (ingredient) => `
                <li class="main__cards-section__card__body-card__recipes-description__ingedients__items">
                  ${ingredient.ingredient}
                  <span class="main__cards-section__card__body-card__recipes-description__ingedients__items__quantity">
                    ${ingredient.quantity || ""} ${ingredient.unit || ""}
                  </span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div> 
        </div>
      </article>
    `;
  }
}

export default RecipeCard;
