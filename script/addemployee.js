const form = document.querySelector("#employeeForm");
const btn = document.querySelector("#submit-button");
let rolesData = JSON.parse(localStorage.getItem("roleDetails"));
let employeeData = JSON.parse(localStorage.getItem("employeesDetails"));

let inputEmpNo = document.getElementById("empNo");
let inputFirstName = document.getElementById("firstName");
let inputLastName = document.getElementById("lastName");
let inputDOB = document.getElementById("dob");
let inputEmail = document.getElementById("email");
let inputMobNo = document.getElementById("mobNumber");
let inputJoinDate = document.getElementById("joinDate");
let inputLocation = document.getElementById("location");
let inputRoleName = document.getElementById("roleName");
let inputDepartment = document.getElementById("department");
let inputManager = document.getElementById("managerName");
let inputProject = document.getElementById("projectName");

let roleId;
let empId;
let employeeInfo;
let employeePicURL;
let userInputValid = false;
let isEditEmployeeForm = false;
let isViewEmployeeForm = false;

//Check if page info or add employee or edit employee or add employee with fixed role
let url = new URL(document.URL);
let params = new URLSearchParams(url.search);
if (params.size != 0) {
  if (params.get("action") == "viewemployee") {
    empId = params.get("id");
    isEditEmployeeForm = false;
    isViewEmployeeForm = true;
    for (let employee of employeeData) {
      if (employee.empNo == empId) {
        employeeInfo = employee;
        setFormDataInfo(employee);
        break;
      }
    }
  } else if (params.get("action") == "addemployee") {
    roleId = params.get("id");
    for (let employee of employeeData) {
      if (employee.roleId == roleId) {
        employeeInfo = employee;
        setFormDataRole(employee);
        break;
      }
    }
  } else if (params.get("action") == "editemployee") {
    empId = params.get("id");
    isEditEmployeeForm = true;
    for (let employee of employeeData) {
      if (employee.empNo == empId) {
        employeeInfo = employee;
        setFormDataInfo(employee);
        break;
      }
    }
  }
}

//Set all values for view or edit employee
function setFormDataInfo(emp) {
  let formInputs = document.querySelectorAll(".employee-form input");
  let selectInputs = document.getElementsByTagName("select");
  let heading = document.querySelector(".add-employee-container h1");
  let uploadBtn = document.querySelector(".upload-profile-pic-btn");
  let profilePic = document.querySelector("#profileImagePreview");
  let addEmployeeBtn = document.querySelector("#submit-button");
  
  if (isViewEmployeeForm) {
    addEmployeeBtn.style.display = "none";
    uploadBtn.classList.add("hide");
    heading.innerHTML = "Employee Info";
  }
  else if (isEditEmployeeForm) {
    addEmployeeBtn.innerHTML="Update Employee";
    heading.innerHTML = "Edit Employee";
    uploadBtn.innerHTML = "Edit Profile Picture";
    employeePicURL = emp.userProfile.link;
  }
  profilePic.style.scale = "1.2";
  profilePic.src = emp.userProfile.link;

  for (let input of formInputs) {
    let inputName = input.name;
    if (input.name != "profileImage") {
      if (
        input.name == "firstName" ||
        input.name == "lastName" ||
        input.name == "email"
      ) {
        input.value = emp["userProfile"][inputName];
      } else {
        input.value = emp[inputName];
      }
      if (!isEditEmployeeForm || input.name=='empNo') input.disabled = true;
    }
  }
  for (let select of selectInputs) {
    let selectName = select.name;
    if (selectName == "managerName" || selectName == "projectName") {
      select.value = emp[selectName];
    } else {
      select.value = emp["role"][selectName];
    }
    if (!isEditEmployeeForm) select.disabled = true;
  }
}

//Set Data for role if page is navigated from roles page
function setFormDataRole(emp) {
  inputLocation.value = emp.role.location;
  inputLocation.disabled = true;
  inputRoleName.value = emp.role.roleName;
  inputRoleName.disabled = true;
  inputDepartment.value = emp.role.department;
  inputDepartment.disabled = true;
}

// Add new employee
btn.addEventListener("click", function (e) {
  e.preventDefault();
  validateUserInput();
});

//Validations
function showError(input, msg) {
  if (msg.length != 0) input.style.outline = "2px solid red";
  else {
    input.style.outline = "2px solid #e0e4e4";
  }
  input.nextElementSibling.innerHTML = `${msg}`;
}

function validateUserInput() {
  let formInputs = document.querySelectorAll(".employee-form input");
  let selectInputs = document.getElementsByTagName("select");
  let flag = true;
  for (let input of formInputs) {
    if (input.name == "dob" || input.name == "profileImage") {
      continue;
    } else {
      if (input.value == "") {
        showError(input, "&#9888 cant be empty");
        flag = false;
      } else {
        showError(input, "");
      }
      if (input.name == "mobNumber") {
        if (!/\d{10}/.test(input.value)) {
          showError(input, "&#9888 enter valid phone number");
          flag = false;
        } else {
          showError(input, "");
        }
      } else if (input.name == "email") {
        if (!/^[\w-\.]+@([\w]+\.)+[\w]{2,4}$/.test(input.value)) {
          showError(input, "&#9888 enter valid email");
          flag = false;
        } else {
          showError(input, "");
        }
      } else if (input.name == "empNo" && !isEditEmployeeForm) {
        let employees = JSON.parse(localStorage.getItem("employeesDetails"));

        for (let emp of employees) {
          if (emp.empNo == input.value) {
            showError(input, "&#9888 Id already exists");
            flag = false;
            break;
          } else {
            showError(input, "");
          }
        }
      }
    }
  }

  for (let input of selectInputs) {
    if (input.name == "managerName" || input.name == "projectName") {
      continue;
    } else {
      if (input.value == "") {
        showError(input, "&#9888 cant be empty");
        flag = false;
      } else {
        showError(input, "");
      }
    }
  }

  if (flag) {
    addEmployee();
  }
}

//Change the to base64 and preview
let baseString;
function getBaseUrl(file, setBaseUrl) {
  var reader = new FileReader();
  reader.onloadend = function () {
    baseString = reader.result;
    setPreviewImage(baseString);
  };
  reader.readAsDataURL(file);
}
function setPreviewImage(url) {
  let imgPreview = document.getElementById("profileImagePreview");
  imgPreview.src = url;
  imgPreview.style.scale = "1.2";
}

uploadPicture.onchange = (evt) => {
  const file = uploadPicture.files[0];
  if (file) {
    getBaseUrl(file);
  }
};

//Adding employee to the database
function addEmployee() {
  if (baseString != null) employeePicURL = baseString;

  //Check if role id is already fixed

  roleId = generateRoleId(inputRoleName.value, inputLocation.value);

  var employee = {
    userProfile: {
      link: employeePicURL,
      firstName: inputFirstName.value,
      lastName: inputLastName.value,
      email: inputEmail.value,
    },
    empNo: inputEmpNo.value,
    dob: inputDOB.value,
    mobNumber: inputMobNo.value,
    managerName: inputManager.value,
    projectName: inputProject.value,
    roleId: roleId,
    status: true,
    joinDate: inputJoinDate.value,
    role: {
      id: roleId,
      roleName: inputRoleName.value,
      department: inputDepartment.value,
      description: "This is description",
      location: inputLocation.value,
      employees: [],
    },
  };

  //Checking for role id
  roleIdExist = false;
  for (let role of rolesData) {
    if (role.roleId == roleId) {
      roleIdExist = true;
      if(!role.employees.includes(inputEmpNo.value)){
        role.employees.push(inputEmpNo.value);
      }
      break;
    }
  }

  if (!roleIdExist) {
    let empArr=[];
    empArr.push(inputEmpNo.value);
    let role = {
      roleId: roleId,
      roleName: inputRoleName.value,
      department: inputDepartment.value,
      location: inputLocation.value,
      employees: empArr,
    };
    employee.role.employees = empArr;
    rolesData.push(role);
  } else {
    employee.role.employees.push(inputEmpNo.value);
  }

  if (isEditEmployeeForm) {
    editEmployee(employee);
  } else addDataToStorage(employee);
}

//Get employee object and update it
function editEmployee(employee) {
  let employees = JSON.parse(localStorage.getItem("employeesDetails"));
  for (let emp of employees) {
    if (emp.empNo == employee.empNo) {
      Object.assign(emp, employee);
      break;
    }
  }
  localStorage.setItem("employeesDetails", JSON.stringify(employees));
  window.opener.location.reload();
  window.close();
}

//Add data to database
function addDataToStorage(employee) {
  localStorage.setItem("roleDetails", JSON.stringify(rolesData));
  var oldData = JSON.parse(localStorage.getItem("employeesDetails"));
  oldData.push(employee);
  localStorage.setItem("employeesDetails", JSON.stringify(oldData));
  window.opener.location.reload();
  alert("The employee has been added");
  window.close();
}

//Cancel add employee
function cancelAddEmployee() {
  window.close();
}
