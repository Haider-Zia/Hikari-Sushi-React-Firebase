import React, { Component } from "react";
import { BrowserRouter as Link, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import firebase from "../firebase";

import "../ViewStyles/SignIn.css";
import logo from "../ViewStyles/logo.png";

const db = firebase.firestore();
class SignIn extends Component {
  state = {
    username: "",
    password: "",
    managerAuthorized: false,
    receptionistAuthorized: false,
    chefAuthorized: false,
    deliveryAuthorized: false,
    returnHomeClicked: false,
    employees: null,
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

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value,
    });
  };
  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleSubmit = (event) => {
    //find in array
    this.state.employees.find((employee) => {
      if (
        employee.username === this.state.username &&
        employee.password === this.state.password
      ) {
        if (employee.type === "manager") {
          this.setState({ managerAuthorized: true });
        } else if (employee.type === "receptionist") {
          this.setState({ receptionistAuthorized: true });
        } else if (employee.type === "chef") {
          this.setState({ chefAuthorized: true });
        } else if (employee.type === "delivery") {
          this.setState({ deliveryAuthorized: true });
        }
      }
    });
  };

  linkHome = () => {
    this.setState({ returnHomeClicked: true });
  };

  render() {
    if (this.state.managerAuthorized) {
      return <Redirect to="/Manager" />;
    }
    if (this.state.receptionistAuthorized) {
      return <Redirect to="/Receptionist" />;
    }
    if (this.state.chefAuthorized) {
      return <Redirect to="/Chef" />;
    }
    if (this.state.deliveryAuthorized) {
      return <Redirect to="/Delivery" />;
    }
    if (this.state.returnHomeClicked) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <Helmet>
          <title>Hikari Sushi | SignIn Employee</title>
        </Helmet>
        <body>
          <div className="SignInMenuBar">
            <img className="logo" src={logo} alt="logo" />
            <a onClick={this.linkHome}>Home</a>
          </div>
          <div className="SignInHeader">
            <div>
              <span>Hikari Sushi</span>
            </div>
          </div>
          <br />
          <div className="SignInLogin">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                placeholder="username"
                name="user"
                value={this.state.username}
                onChange={this.handleUsernameChange}
              />
              <br />
              <input
                type="password"
                placeholder="password"
                name="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
              <br />
              <button type="submit">Login</button>
            </form>
          </div>
        </body>
      </React.Fragment>
    );
  }
}

export default SignIn;
