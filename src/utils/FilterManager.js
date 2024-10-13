class FilterManager {
  constructor(app) {
    this.app = app;
    this.categories = ["ingredients", "appliances", "ustensils"];
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

    button.classList.toggle("open");
    filterContent.classList.toggle("active");
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
}

export default FilterManager;
