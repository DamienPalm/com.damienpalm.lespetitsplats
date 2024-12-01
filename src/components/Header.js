class Header {
  constructor() {
    this.logoSrc = "../src/assets/images/logo/logo.png";
    this.title = "Les petits plats";
  }

  render() {
    return `
    <header class="header">
        <a href="./index.html" class="header__logo-link">
          <img src="${this.logoSrc}" alt="${this.title}" class="header__logo-link__logo">
        </a>
        <h1 class="header__main-title">Cherchez parmi plus de 1500 recettes du quotidien, simples et délicieuses</h1>
        <form action="" method="get" class="header__search-bar-form">
          <label for="header__search-bar"></label>
          <input type="search" name="search-bar" id="header__search-bar" placeholder="Recherchez une recette, un ingrédient, ...">
          <button class="header__search-bar-form__button" type="submit">
            <i class="fa-solid fa-magnifying-glass header__search-bar-form__button__button-icon"></i>
          </button>
          <div class="header__search-bar-suggestions"></div>
        </form>
    </header>
    `;
  }
}

export default Header;
