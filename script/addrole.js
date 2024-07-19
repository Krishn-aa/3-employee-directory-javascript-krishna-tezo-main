const employeeListDiv = document.querySelector(".assign-role-employee-list");
const assignDiv = document.querySelector(".assign-employee");
const selectedEmployeesList = [];

let oldData=[];
let data = [];

//Check for dropdown collapse
document.addEventListener("click" , (e)=>{
  let isClickedInside = assignDiv.contains(e.target);
  if(!isClickedInside){
    employeeListDiv.classList.remove("active");
  }
})

//Assign Employee dropdown check
function selectEmployeeToAssign(selectBtn) {
  if (data.length == 0){
    data = JSON.parse(localStorage.getItem("employeesDetails"));
    populateEmployeesList();
  }
  employeeListDiv.classList.toggle("active");
}

//Populate dropdown employee list
function populateEmployeesList() {
  for (let employee of data) {
    let fullName =
      employee.userProfile.firstName + " " + employee.userProfile.lastName;
    var emp = document.createElement("div");
    emp.innerHTML = `
        <div class="employee-list-container">
            <p>${fullName}</p>
            <input type="checkbox" onchange="addInAssignedEmployees(this,'${employee.empNo}')"/>
        </div>
        `;
    employeeListDiv.appendChild(emp);
  }
}

function addInAssignedEmployees(checkbox,empId){
  if(!selectedEmployeesList.includes(empId)){
    selectedEmployeesList.push(empId)
  }
  else{
    selectedEmployeesList.splice(selectedEmployeesList.indexOf(empId),1);
  }
}

//Search bar in assign employee dropdown
function searchEmployee() {
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  let x = document.querySelectorAll(".assign-role-employee-list div");

  for (let i = 0; i < x.length; i++) {
    let element = x[i].children[0].textContent.toLowerCase();
    if (!element.includes(input)) {
      x[i].style.display = "none";
    } else {
      x[i].style.display = "flex";
    }
  }
}

function generateRoleId(roleName,location){
  let roleId=roleName.substring(0,3)+location.substring(0,3);
  return roleId;
}

//Form validation msg error
function showError(input, msg) {
  if (msg.length != 0) input.style.outline = "2px solid red";
  else {
    input.style.outline = "2px solid #e0e4e4";
  }
  input.nextElementSibling.innerHTML = `${msg}`;
}

//Add role form validation
function validateRole(){
  oldData = JSON.parse(localStorage.getItem("roleDetails"));
  let name = document.getElementById("input-text-box");
  let location = document.getElementById("location");
  let roleId = generateRoleId(name.value,location.value);
  let b = true;
  if(location.value==""){
    showError(location, "&#9888 cant be empty");
    b=false;
  }
  else{
    showError(location,"");
  }
  if(name.value==""){
    showError(name, "&#9888 cant be empty");
    b=false;
  }
  else{
    showError(name,"");
  }
  if(oldData.find(role=> role.roleId==roleId)){
    showError(name,"roleId already exist");
    b=false;
  }
  else{
    showError(name,"");
  }

  if(b){
    addRole();
  }
}

//Addign role to the database
function addRole(){
  let form = document.querySelector("#form")
  let formData = new FormData(form);
  const roleName = formData.get("roleName");
  const location = formData.get("location");
  const department = formData.get("department");
 
  let empArr = selectedEmployeesList;
  
  let newRole = {
    roleId: generateRoleId(roleName,location),
    roleName: roleName,
    department: department,
    location: location,
    employees: empArr,
  };
  oldData.push(newRole);
  localStorage.setItem("roleDetails",JSON.stringify(oldData));
  updateEmployeesData(newRole,empArr);

}

//Updating employee data with newly assigned role
function updateEmployeesData(role,empArr){
  let employeeData = JSON.parse(localStorage.getItem("employeesDetails"));
  for(let emp of employeeData){
    if(empArr.includes(emp.empNo)){
      emp.roleId = role.roleId;
      emp.role.id = role.roleId;
      emp.role.department=role.department;
      emp.role.roleName=role.roleName;
      emp.role.location=role.location;
    }
  }
  localStorage.setItem("employeesDetails",JSON.stringify(employeeData));
  alert("The role is added");
  window.parent.postMessage('added');
}

//Cancel Add Role
function cancelAddRole(){
  window.parent.postMessage('cancelled');
}