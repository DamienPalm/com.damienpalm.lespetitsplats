class UrlParamsManager {
  constructor() {
    this.params = new UrlParamsManager(window.location.search);
  }

  get(name) {
    return this.params.get(name);
  }

  set(name, value) {
    this.params.set(name, value);
    this.updateUrl();
  }

  append(name, value) {
    this.params.append(name, value);
    this.updateUrl();
  }

  delete(name) {
    this.params.delete(name);
    this.updateUrl();
  }

  has(name) {
    return this.params.has(name);
  }

  getAll() {
    const result = {};
    for (const [key, value] of this.params.entries()) {
      result[key] = value;
    }
    return result;
  }

  updateUrl() {
    const newUrl = `${window.location.pathname}?${this.params.toString()}`;
    history.pushState(null, "", newUrl);
  }
}
