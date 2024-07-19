// Generate unique roleid
function generateRoleId(roleName, location) {
    let roleId = roleName.substring(0, 3) + location.substring(0, 3);
    return roleId;
}


// Filters
// Toggle Filter Apply buttons
function toggleFilterApplyButtons() {
    let isOptionFilterApplied = false;
    Object.keys(selectedFilter).forEach((type) => {
      if (type != "char" && selectedFilter[type].length > 0) {
        isOptionFilterApplied = true;
      }
    });
  
    const btnReset = document.querySelector(".filter-options-reset");
    const btnApply = document.querySelector(".filter-options-apply");
    let show = "inline-block";
    let hide = "none";
    if (isOptionFilterApplied) {
      btnReset.style.display = show;
      btnApply.style.display = show;
    } else {
      btnReset.style.display = hide;
      btnApply.style.display = hide;
    }
  }
  
  //Show Dropdowns
  function showFilterDropdown(currFilterOption) {
    currFilterOption.nextElementSibling.classList.toggle("active");
    const dropDownBtnIcon = currFilterOption.children[0].children[1];
    dropDownBtnIcon.classList.toggle("active");
    toggleFilterApplyButtons();
  }
  
  //Manage filter selection
  function manageFilterSelection(element) {
      var criteria = "";
      if (element.innerHTML.length == 1) {
        criteria = "selectedAlphabets";
      } else {
        criteria = element.classList[1];
      }
      var filterName = element.textContent;
      var arr = selectedFilter[criteria];
      if (!arr.includes(filterName)) {
        arr.push(filterName);
      } else {
        arr.splice(arr.indexOf(filterName), 1);
      }
      element.classList.toggle("active");
      if (criteria == "selectedAlphabets") {
        let removeFilterBtn = document.querySelector(".remove-filter-btn");
        removeFilterBtn.src = "assets/interface/filter_red.svg";
        applyFilter();
      } else {
        toggleFilterApplyButtons();
      }
  }
  
  //Apply Filter
  function applyFilter() {
    let filterNames = document.querySelectorAll(".filter-options-btn p");
    displayData = data.slice();
    let types = Object.keys(selectedFilter);
    var arr = [];
    types.forEach((type) => {
      arr = selectedFilter[type];
      if (arr.length > 0) {
        for (let fn of filterNames) {
          if (fn.classList[0].toLowerCase() == type) {
            fn.textContent = arr.length + " selected";
          }
        }
        filter(type, arr);
      }
    });
    unpopulateData();
    populateData(displayData);
  }
  
  //Reset Filter
  function resetFilter() {
    selectedFilter.status = [];
    selectedFilter.location = [];
    selectedFilter.department = [];
    let filterBtn = document.querySelectorAll(".drop-down-menu");
    let filterNames = document.querySelectorAll(".filter-options-btn p");
    for (let fName of filterNames) {
      let name = fName.classList[0];
      if (name == "status") {
        fName.textContent = "Status";
      } else if (name == "location") {
        fName.textContent = "Location";
      } else {
        fName.textContent = "Department";
      }
    }
  
    applyFilter();
    toggleFilterApplyButtons();
    filterBtn.forEach((btn) => {
      btn.classList.remove("active");
    });
  }
  
  //Detect outside click to close the dropdowns
  document.addEventListener("click", (event) => {
    const filterContainers = document.querySelectorAll(
      ".filter-option-container"
    );
    for (let fc of filterContainers) {
      if (!fc.contains(event.target)) {
        fc.children[1].classList.remove("active");
        fc.children[0].children[0].children[1].classList.remove("active");
      }
    }
  });