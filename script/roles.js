const addEmployeeBtn = document.querySelector(".assign-employee-search");

let employeesData = [];
let data = JSON.parse(localStorage.getItem("roleDetails"));
let displayData = [];
populateData(data);

function populateData(data) {
  const rolesCardSection = document.querySelector(".roles-card-section");
  data.forEach((role) => {
    let roleCard = document.createElement("div");
    roleCard.innerHTML = `
        <div class="roles-card">
            <div class="roles-card-header flex">
              <p class="roles-card-header-title">${role.roleName}</p>
              <button><img src="../assets/edit-icon.svg" alt="edit" /></button>
            </div>

            <div class="roles-card-content">
              <div class="roles-card-content-div flex">
                <div class="flex">
                  <img src="../assets/employees-icon.svg" alt="" />
                  <p>Department</p>
                </div>

              <div>
                <p class="department">${role.department}</p>
              </div>
            </div>
            <div class="roles-card-content-div flex">
                <div class="flex">
                  <img src="../assets/location-icon.svg" alt="" />
                  <p>Location</p>
                </div>

                <div>
                  <p class="location">${role.location}</p>
                </div>
            </div>
            <div class="roles-card-content-div flex">
                <div class="flex">
                  <p>Total Employees</p>
                </div>


                <div class="roles-card-total-employees-card ${role.roleId}">
                        

                </div>
              </div>
            </div>

            <div class="roles-card-bottom flex">
              <button class="flex" onclick="viewAllEmployees('${role.roleId}')">
                <p>View all Employees</p>
                <img src="../assets/right-arrow-icon.svg" alt="" />
              </button>
            </div>
          </div>
    `;
    rolesCardSection.appendChild(roleCard);

    //Adding the images dynamically
    let imgContainers = document.querySelectorAll(
      ".roles-card-total-employees-card"
    );
    for (let imgContainer of imgContainers) {
      if (imgContainer.classList[1] == role.roleId) {
        addImages(role.employees, imgContainer);
      }
    }
  });
}

//Add image cards
function addImages(employees, imgContainer) {
  let count = 0;
  let imagesLinks = [];
  let empData = JSON.parse(localStorage.getItem("employeesDetails"));
  for (let emp of empData) {
    if (employees.includes(emp.empNo)) {
      imagesLinks.push(emp.userProfile.link);
    }
  }
  for (let i = 0; i < imagesLinks.length; i++) {
    if (i == 4) {
      let countContainer = document.createElement("div");
      countContainer.classList.add("profile-remaining-count");
      countContainer.classList.add("flex");
      countContainer.innerHTML = `+ ${imagesLinks.length - i}`;
      imgContainer.appendChild(countContainer);
      break;
    }
    let img = document.createElement("img");
    img.src = imagesLinks[i];
    img.classList.add("profile-img");
    let className = "profile-img-" + (i + 1);
    img.classList.add(className);
    imgContainer.appendChild(img);
  }
}

function unpopulateData() {
  const rolesCardSection = document.querySelector(".roles-card-section");

  //Delete all childs before
  while (rolesCardSection.hasChildNodes()) {
    rolesCardSection.removeChild(rolesCardSection.firstChild);
  }
}

//Filter Roles
var selectedFilter = {
  department: [],
  location: [],
};

function filter(type, arr) {
  let tempData = displayData.slice();
  let valueToCompare = undefined;

  for (let role of displayData) {
    if (type == "department") {
      valueToCompare = role.department;
    } else {
      valueToCompare = role.location;
    }

    let isMatched = false;
    for (let i of arr) {
      if (valueToCompare == i) {
        isMatched = true;
      }
    }
    if (!isMatched) {
      tempData.splice(tempData.indexOf(role), 1);
    }
  }
  displayData = tempData.slice();
}

//View All Employees
function viewAllEmployees(roleName) {
  let url = "roledetails.html?" + roleName;
  window.open(url, "_self");
}

function handleAddRole(action) {
  const employeeHeader = document.querySelector(".page-header");
  const filter = document.querySelector(".filter-options");
  const rolesCardSection = document.querySelector(".roles-card-section");
  const addRolePage = document.querySelector(".add-role-page");
  employeeHeader.classList.toggle("hide");
  filter.classList.toggle("hide");
  rolesCardSection.classList.toggle("hide");
  addRolePage.classList.toggle("hide");
  window.addEventListener("message", (event) => {
    if (event.data != "cancelled" || event.data != "added") {
      employeeHeader.classList.toggle("hide");
      filter.classList.toggle("hide");
      rolesCardSection.classList.toggle("hide");
      addRolePage.classList.toggle("hide");
      window.location.reload();
    }
  });
}
