import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Link, Redirect } from "react-router-dom";
import firebase from "../firebase";

import "../ViewStyles/Manager.css";
import logo from "../ViewStyles/logo.png";

const db = firebase.firestore();
class Manager extends Component {
  state = {
    addClicked: false,
    editClicked: false,
    logOutClicked: false,
    viewSalesClicked: false,
    employees: null,
    selectedValue: "None",
    selectedEmployeeName: "",
    selectedEmployeeSalary: "",
    selectedEmployeePosition: "",
  };

  //Gets Employees from Firebase and populates state with it
  getEmployees() {
    db.collection("employees").onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      this.setState({
        employees: items,
      });
    });
  }
  //Calls getEmployees as soon as component is mounted
  componentDidMount() {
    this.getEmployees();
  }

  addEmployeeRender = () => {
    console.log(" add employee clicked");
    this.setState({ addClicked: true });
  };

  editEmployeeRender = () => {
    if (this.state.selectedValue !== "None") {
      const selectedEmployee = this.state.employees.filter(
        (employee) => employee.username === this.state.selectedValue
      );
      const tempSelectedEmployeeName = selectedEmployee[0].username;
      const tempSelectedEmployeePosition = selectedEmployee[0].type;
      const tempSelectedEmployeeSalary = selectedEmployee[0].salary;
      this.setState({
        editClicked: true,
        selectedEmployeeName: tempSelectedEmployeeName,
        selectedEmployeePosition: tempSelectedEmployeePosition,
        selectedEmployeeSalary: tempSelectedEmployeeSalary,
      });
    } else {
      alert("Choose an employee to edit");
    }
  };

  addEmployee = () => {
    this.setState({
      selectedEmployeeName: "",
      selectedEmployeePosition: "",
      selectedEmployeeSalary: "",
    });
    db.collection("employees").add({
      username: this.state.selectedEmployeeName,
      password: 1234,
      type: this.state.selectedEmployeePosition,
      salary: this.state.selectedEmployeeSalary,
    });

    this.returnToManagerMain();
  };

  editEmployee = () => {
    //add code
    db.collection("employees")
      .where("username", "==", this.state.selectedEmployeeName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs[0].ref.set(
          {
            type: this.state.selectedEmployeePosition,
            salary: this.state.selectedEmployeeSalary,
          },
          { merge: true }
        );
      });
    this.setState({ selectedValue: "None" });
    this.returnToManagerMain();
  };

  deleteEmployee = () => {
    if (this.state.selectedValue !== "None") {
      var deleteQuery = db
        .collection("employees")
        .where("username", "==", this.state.selectedValue);
      deleteQuery.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });
      alert(this.state.selectedValue + " " + " removed");
    }
  };

  returnToManagerMain = () => {
    this.setState({ addClicked: false });
    this.setState({ editClicked: false });
  };
  logOut = () => {
    this.setState({ logOutClicked: true });
  };

  viewSales = () => {
    this.setState({ viewSalesClicked: true });
  };

  selectValue = (event) => {
    this.setState({ selectedValue: event.target.value });
    console.log(this.state.selectedValue);
  };

  handleNameChange = (event) => {
    this.setState({ selectedEmployeeName: event.target.value });
  };
  handlePositionChange = (event) => {
    this.setState({ selectedEmployeePosition: event.target.value });
  };
  handleSalaryChange = (event) => {
    this.setState({ selectedEmployeeSalary: event.target.value });
  };
  render() {
    if (this.state.logOutClicked) {
      return <Redirect to="/" />;
    }
    if (this.state.viewSalesClicked) {
      return <Redirect to="/Manager/Sales" />;
    }
    if (this.state.addClicked) {
      return (
        <React.Fragment>
          <Helmet>
            <title>Add Employee | Manager | Hikari Sushi</title>
          </Helmet>
          <body>
            <div className="AddEditEmployeeMenuBar">
              <img className="logo" src={logo} alt="logo" />
              <a onClick={this.returnToManagerMain}>Manager Main Dashboard</a>
            </div>
            <div className="AddEditEmployeeBodyContainer">
              <form className="AddEditEmployeeF">
                <div className="name">
                  <label>Name </label>
                  <input name="name" onChange={this.handleNameChange} />
                </div>
                <div className="position">
                  <label>Position </label>
                  <input name="position" onChange={this.handlePositionChange} />
                </div>
                <div className="salary">
                  <label>Salary(Rs/Month) </label>
                  <input name="salary" onChange={this.handleSalaryChange} />
                </div>
                <button
                  className="AddEditEmployeeButton"
                  onClick={this.addEmployee}>
                  Add
                </button>
              </form>
            </div>
          </body>
        </React.Fragment>
      );
    }
    if (this.state.editClicked) {
      return (
        <React.Fragment>
          <Helmet>
            <title>Edit Employee | Manager | Hikari Sushi</title>
          </Helmet>
          <body>
            <div className="AddEditEmployeeMenuBar">
              <img className="logo" src={logo} alt="logo" />
              <a onClick={this.returnToManagerMain}>Manager Main Dashboard</a>
            </div>
            <div className="AddEditEmployeeBodyContainer">
              <form className="AddEditEmployeeF">
                <div className="name">
                  <label>Name </label>
                  <input name="name" value={this.state.selectedEmployeeName} />
                </div>
                <div className="position">
                  <label>Position </label>
                  <input
                    name="position"
                    value={this.state.selectedEmployeePosition}
                    onChange={this.handlePositionChange}
                  />
                </div>
                <div className="salary">
                  <label>Salary(Rs/Month) </label>
                  <input
                    name="salary"
                    value={this.state.selectedEmployeeSalary}
                    onChange={this.handleSalaryChange}
                  />
                </div>
                <button
                  className="AddEditEmployeeButton"
                  onClick={this.editEmployee}>
                  Edit
                </button>
              </form>
            </div>
          </body>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Helmet>
          <title>Manager | Hikari Sushi</title>
        </Helmet>
        <body>
          <div className="ManagerMenuBar">
            <img className="logo" src={logo} alt="logo" />
            <a onClick={this.logOut}>Home | Logout</a>
          </div>
          <div className="ManagerMainBodyContainer">
            <div className="ManagerMainLeft">
              <form>
                <button
                  className="ManagerMainButton"
                  onClick={this.addEmployeeRender}>
                  Add Employee
                </button>
              </form>
              <form>
                <button
                  className="ManagerMainButton"
                  onClick={this.editEmployeeRender}>
                  Edit Employee
                </button>
              </form>
              <form>
                <button
                  className="ManagerMainButton"
                  onClick={this.deleteEmployee}>
                  Remove Employee
                </button>
              </form>
              <form>
                <button className="ManagerMainButton" onClick={this.viewSales}>
                  View Sales
                </button>
              </form>
            </div>

            <div className="ManagerMainRight">
              <p>Employees</p>
              <select
                className="ManagerMainEmployees"
                onChange={this.selectValue}
                value={this.state.selectedValue}>
                <option value="None">SELECT EMPLOYEE</option>
                {this.state.employees
                  ? this.state.employees.map((employee) => (
                      <option>{employee.username}</option>
                    ))
                  : () => {}}
              </select>
            </div>
          </div>
        </body>
      </React.Fragment>
    );
  }
}

export default Manager;
