var isCollapsed = false;
// Responsiveness
if (window.matchMedia("(max-width: 1200px)").matches) {
  sidePanelToggle();
}

//Toggle the side panel
function sidePanelToggle() {
  const collapseBtn = document.querySelector(".side-panel-collapse-btn");
  const mainContainer = document.querySelector(".main-container");
  const logoImage = document.querySelector(".logo-img");
  const selectorTitles = document.querySelectorAll(".side-panel-title");
  const rightLogos = document.querySelectorAll(".side-panel-logo-right");
  const updateBox = document.querySelector(".side-panel-update-box");
  const sidePanelHeadings = document.querySelectorAll(".side-panel-heading");
  const headerContainer = document.querySelectorAll(
    ".side-panel-header-container"
  );
  const pseudoSideBar = document.querySelector(".pseudo-side-bar");
  mainContainer.classList.toggle("collapsed");
  updateBox.classList.toggle("hide");
  pseudoSideBar.classList.toggle("hide");

  //refactor
  if (isCollapsed == false) {
    logoImage.src = "../assets/tezo-logo-icon.svg";
  } else {
    logoImage.src = "../assets/tezo-logo.svg";
  }

  for (let i = 0; i < selectorTitles.length; i++) {
    headerContainer[i].classList.toggle("collapsed");
    selectorTitles[i].classList.toggle("hide");
  }

  for (let heading of sidePanelHeadings) {
    heading.classList.toggle("hide");
  }

  for (let rightLogo of rightLogos) {
    rightLogo.classList.toggle("hide");
  }

  collapseBtn.classList.toggle("collapsed");
  isCollapsed = !isCollapsed;
}