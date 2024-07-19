let data = [];
let displayData = [];
let rolesData = [];
let tableData;
let sortColumnName = "none";
let sortDirection = "none";

//Populating the table with rows
//Fetching data from JSON
fetch("./data/data.json")
  .then((response) => response.json())
  .then((json) => {
    if (!localStorage.getItem("employeesDetails")){
      localStorage.setItem("employeesDetails", JSON.stringify(json.employees));
    }

    if(!localStorage.getItem("roleDetails")){
      localStorage.setItem("roleDetails", JSON.stringify(rolesData));
    }
    data = JSON.parse(localStorage.getItem("employeesDetails"));
    displayData = data.slice();
    populateData(data);
  }
);



// Populating Table Data
function populateData(data) {
  const tableBody = document.querySelector(".employee-table-data");
  rolesData=JSON.parse(localStorage.getItem("roleDetails"));

  for (let i = 0; i < data.length; i++) {
    let status = "";

    //Generating Roles Id for each distinct role
    let roleId = generateRoleId(data[i].role.roleName,data[i].role.location);
    let role = rolesData.find(role=> role.roleId==roleId);
    if(!role){
      data[i].roleId = roleId;
      let empArr=[];
      empArr.push(data[i].empNo);
      let newRole = {
        roleId: roleId,
        roleName: data[i].role.roleName,
        department: data[i].role.department,
        location: data[i].role.location,
        employees: empArr,
      };
      rolesData.push(newRole);
    }
    else{
      let empArr = role["employees"];
      if(!empArr.includes(data[i].empNo)){
        empArr.push(data[i].empNo);
      }
      role["employees"] = empArr;
    }
    localStorage.setItem("roleDetails", JSON.stringify(rolesData));

    //Managing Status
    let activeClass = "";
    if (data[i].status == true) {
      status = "Active";
    } else {
      status = "Inactive";
      activeClass = "inactive";
    }

    const row = document.createElement("tr");
    row.classList.add("employee-table-row");
    row.innerHTML = `
    <td><label><input type="checkbox" name="check" id="check-box" class="row-checkbox" onchange ="manageSelectedEmployees(this,'${data[i].empNo}')"/></label> </td>
    <td>
        <div class="table-user">
          <img
            src="${data[i].userProfile.link}"
            alt="user-profile-pic"
          />
          <div>
            <p class="user-profile-name">${
              data[i].userProfile.firstName + " " + data[i].userProfile.lastName
            }</p>
            <p class="user-profile-email">${data[i].userProfile.email}</p>
          </div>
        </div>
    </td>
    <td>${data[i].role.location}</td>
    <td>${data[i].role.department}</td>
    <td>${data[i].role.roleName}</td>
    <td>${data[i].empNo}</td>
    <td><div class="status-btn ${activeClass}">${status}</div></td>
    <td>${data[i].joinDate}</td>
    <td>
      <div class="ellipsis" onclick="showEllipsisMenu(this)">
        <div class="ellipsis-icon">
          <i class="fa-solid fa-ellipsis"></i>
        </div>
        <div class="ellipsis-menu">
          <div onclick="viewDetails('${data[i].empNo}')">View Details</div>
          <div onclick="editDetails('${data[i].empNo}')">Edit</div>
          <div onclick="deleteFromEllipsisMenu('${data[i].empNo}')">Delete</div>
        </div>
      </div>
    </td>
    `;
    tableBody.appendChild(row);
  }
}

//Ellipsis menu manage
function showEllipsisMenu(div) {
  div.children[1].classList.toggle("active");
}

//Unpopulate table data
function unpopulateData() {
  const tableBody = document.querySelector(".employee-table-data");
  //Delete all childs before
  while (tableBody.hasChildNodes()) {
    tableBody.removeChild(tableBody.firstChild);
  }
}

//Rendering A to Z buttons
const filterDiv = document.querySelector(".filter-alphabets");

for (let i = 1; i <= 26; i++) {
  const div = document.createElement("div");
  const char = String.fromCharCode(64 + i);
  div.setAttribute("onclick", "manageFilterSelection(this)");
  div.innerHTML = `${char}`;
  filterDiv.appendChild(div);
}

//Filter
var selectedFilter = {
  selectedAlphabets: [],
  status: [],
  location: [],
  department: [],
};

function filter(type, arr) {
  var tempData = displayData.slice();
  var valueToCompare = undefined;

  for (let employee of displayData) {
    switch (type) {
      case "selectedAlphabets":
        valueToCompare = employee.userProfile.firstName[0];
        break;
      case "location":
        valueToCompare = employee["role"]["location"];
        break;
      case "department":
        valueToCompare = employee["role"]["department"];
        break;
      default:
        valueToCompare = employee[type];
        if (valueToCompare == false) {
          valueToCompare = "Inactive";
        } else {
          valueToCompare = "Active";
        }
        break;
    }

    let isMatched = false;
    for (let i of arr) {
      if (valueToCompare == i) {
        isMatched = true;
      }
    }
    if (!isMatched) {
      tempData.splice(tempData.indexOf(employee), 1);
    }
  }
  displayData = tempData.slice();
}

//Reset Alphabet filter
function resetAlphabetFilter() {
  const resetFilterBtn = document.querySelector(".remove-filter-btn");
  if (selectedFilter.selectedAlphabets.length > 0) {
    selectedFilter.selectedAlphabets = [];
  }
  const alphabetDivs = document.querySelectorAll(".filter-alphabets div");
  for (element of alphabetDivs) {
    element.classList.remove("active");
  }
  resetFilterBtn.src = "assets/interface/filter.svg";
  applyFilter();
}

//Detect the shortcut key press
document.onkeydown = keydown;
function keydown(evt){
  let searchbar = document.getElementById("searchbar")
  if (evt.ctrlKey && evt.keyCode==191){ 
    searchbar.focus(); 
  }
}

//Search header for employees
function searchEmployee() {
  let input = document.getElementById("searchbar").value;
  input = input.toLowerCase();
  let row = document.querySelectorAll(".employee-table-row");

  for (let i = 1; i < row.length; i++) {

    let name = row[i].children[1].children[0].children[1].children[0].textContent.toLowerCase();
    if (!name.includes(input)) {
      row[i].style.display = "none";
    } else {
      row[i].style.display = "table-row";
    }
  }
}

//Table To CSV
var csvData = "";
function exportToCSV() {
  let employees = displayData.slice();
  extractHeadersForCSV(employees[0]);
  csvData = extractEmployeeData(csvData, employees);
  generateCSVFile(csvData);
}

function extractHeadersForCSV(employee){
  let headers = Object.keys(employee);
  headers.forEach((item) => {
    if (item == "userProfile") {
      csvData += "Name" + ", ";
      Object.keys(employee["userProfile"]).forEach((userProfileItem) => {
        if (userProfileItem == "email") {
          csvData += userProfileItem + ", ";
        }
      });
    } else if (item == "role") {
      Object.keys(employee["role"]).forEach((roleItem) => {
        if (
          roleItem == "roleName" ||
          roleItem == "department" ||
          roleItem == "location"
        ) {
          csvData += roleItem + ", ";
        }
      });
    } else {
      csvData += item + ", ";
    }
  });
  csvData += "\n";
}

function extractEmployeeData(csvData, employees) {
  for (let employee of employees) {
    let headers = Object.keys(employees[0]);
    headers.forEach((item) => {
      if (item == "userProfile") {
        let name = "";
        let email = "";
        Object.keys(employees[0]["userProfile"]).forEach((userProfileItem) => {
          if (userProfileItem == "firstName" || userProfileItem == "lastName")
            name += employee["userProfile"][userProfileItem] + " ";
          else if (userProfileItem == "email") {
            email += employee["userProfile"][userProfileItem];
          }
        });
        csvData += name + ", " + email + ", ";
      } else if (item == "role") {
        Object.keys(employees[0]["role"]).forEach((roleItem) => {
          if (
            roleItem == "roleName" ||
            roleItem == "department" ||
            roleItem == "location"
          ) {
            csvData += employee["role"][roleItem] + ", ";
          }
        });
      } else {
        csvData += employee[item] + ", ";
      }
    });
    csvData += "\n";
  }
  return csvData;
}

function generateCSVFile(csvData) {
  var blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  var link = document.createElement("a");
  var url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", "employees.csv");
  link.style.visibility = "hidden";
  link.click();
}

// Add Employee
function handleAddEmployee() {
  window.open("html/addEmployee.html");
}

//Delete Selection
let empIdsToDel = [];

function manageSelectedEmployees(checkBox, empId) {
  const checkBoxes = document.querySelectorAll(".row-checkbox");
  const delBtn = document.querySelector(".btn-delete");
  if (empId == undefined) {
    if (checkBox.checked == true) {
      for (let cb of checkBoxes) {
        cb.checked = true;
      }
      selectAllEmployees();
    } else {
      for (let cb of checkBoxes) {
        cb.checked = false;
      }
      empIdsToDel = [];
    }
  } else {
    if (empIdsToDel.includes(empId))
      empIdsToDel.splice(empIdsToDel.indexOf(empId), 1);
    else empIdsToDel.push(empId);
  }

  if (checkBox.checked == true) delBtn.style.display = "block";
  else delBtn.style.display = "none";
}

function selectAllEmployees() {
  empIdsToDel = [];
  let postDeleteData = displayData.slice();
  for (let emp of postDeleteData) {
    empIdsToDel.push(emp["empNo"]);
  }
}

function deleteFromEllipsisMenu(empId){
  empIdsToDel.push(empId);
  deleteEmployees();
}

function deleteEmployees() {
  for (let emp of displayData) {
    if (empIdsToDel.includes(emp["empNo"])) {
      data.splice(data.indexOf(emp), 1);
    }
  }
  let fisrtCheckBox = (document.querySelector(
    ".first-checkbox"
  ).checked = false);
  resetFilter();
  resetAlphabetFilter();
  unpopulateData();
  populateData(data);
}

//View details of ellipsis menu
function viewDetails(empId){
  let url = "html/addEmployee.html?"+"action=viewemployee"+"&id="+empId;
  window.open(url);
}

//Edit of ellipsis menu
function editDetails(empId){
  let url = "html/addEmployee.html?"+"action=editemployee"+"&id="+empId;
  window.open(url);
}

//Table Sort
function handleColumnSort(columnName) {
  tableData = displayData.slice();
  if (sortDirection == "DESC") {
    unpopulateData();
    populateData(displayData);
    sortDirection = "none";
    return;
  } else if (sortColumnName == "none" || sortColumnName != columnName) {
    sortDirection = "ASC";
    sortColumnName = columnName;
  } else {
    sortColumnName = columnName;
    if (sortDirection == "ASC") sortDirection = "DESC";
    else if (sortDirection == "DESC") sortDirection = "none";
    else if (sortDirection == "none") sortDirection = "ASC";
  }
  sortColumn(sortDirection, columnName);
  unpopulateData();
  populateData(tableData);
}

function getEmployeeValueByColumnName(emp, columnName) {
  let value;
  switch (columnName) {
    case "user":
      value = emp.userProfile.firstName;
      break;
    case "location":
      value = emp.role.location;
      break;
    case "department":
      value = emp.role.department;
      break;
    case "role":
      value = emp.role.roleName;
      break;
    case "emp-no":
      value = emp.empNo;
      break;
    case "status":
      value = emp.status;
      break;
    case "join-date":
      value = emp.joinDate;
      break;

    default:
      break;
  }
  return value;
}

function sortColumn(order, columnName) {
  let returnValue = 1;
  if (order == "ASC" || order == "none") {
    returnValue = -returnValue;
  }

  tableData.sort((a, b) => {
    employee1 = getEmployeeValueByColumnName(a, columnName);
    employee2 = getEmployeeValueByColumnName(b, columnName);
    if (employee1 < employee2) {
      return returnValue;
    }
    if (employee1 > employee2) {
      return -returnValue;
    }
    return 0;
  });
}