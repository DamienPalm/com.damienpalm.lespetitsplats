import Header from "../components/Header.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  const header = new Header();
  header.render(app);
});
