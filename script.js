document.addEventListener("DOMContentLoaded", () => {
  const yearNode = document.querySelector(".js-year");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
});