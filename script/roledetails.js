const rolesCardSection = document.querySelector(".roles-card-section");
let roleId = document.URL.substring(document.URL.indexOf("?") + 1);
let employees = [];
let displayData=[];

//Get data from local storage
if (localStorage.getItem("employeesDetails")) {
  employees = JSON.parse(localStorage.getItem("employeesDetails"));
  for (let employee of employees) {
    if (employee.roleId == roleId) {
      displayData.push(employee);
    }
  }
  populateEmployeeCard(displayData);
}

//Populate employee cards in role details page
function populateEmployeeCard(employees) {
  for (let employee of employees) {
    let employeeCard = document.createElement("div");
    let name =
      employee.userProfile.firstName + " " + employee.userProfile.lastName;
    employeeCard.innerHTML = `
            <div class="roles-card">
                <div class="roles-card-profile flex">
                  <img
                    src="${employee.userProfile.link}"
                    alt="profile-pic"
                    class="role-detail-profile-img"
                  />
    
                  <div>
                    <p class="profile-detail-name">${name}</p>
                    <p class="profile-detail-postion">Head of ${employee.role.department}</p>
                  </div>
                </div>
    
                <div class="role-profile-details">
                  <div class="role-profile-detail-row flex">
                    <img src="../assets/inf-id.svg" alt="" />
                    <p>${employee.empNo}</p>
                  </div>
                  <div class="role-profile-detail-row flex">
                    <img src="../assets/email-logo.svg" alt="" />
                    <p>${employee.userProfile.email}</p>
                  </div>
                  <div class="role-profile-detail-row flex">
                    <img src="../assets/employees-icon.svg" alt="" />
                    <p>${employee.role.department}</p>
                  </div>
                  <div class="role-profile-detail-row flex">
                    <img src="../assets/location-icon.svg" alt="" />
                    <p>${employee.role.location}</p>
                  </div>
                </div>
    
                <div class="roles-card-bottom flex">
                    <button onclick="viewEmployee('${employee.empNo}')">View</button>
                    <img src="../assets/right-arrow-icon.svg" alt="" />
                </div>
              </div>
            `;
    rolesCardSection.appendChild(employeeCard);
  }
}

//Add employee navigation
function handleAddEmployee(){
  let url = "addemployee.html?"+"action=addemployee"+"&id="+roleId;;
  window.open(url,"_self");
}

//view employee navigation
function viewEmployee(empId){
  let url = "addemployee.html?"+"action=viewemployee"+"&id="+empId;
  window.open(url);
}
