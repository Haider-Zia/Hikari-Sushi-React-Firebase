import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Link, Redirect } from "react-router-dom";
import firebase from "../firebase";

import "../ViewStyles/ManagerSales.css";
import logo from "../ViewStyles/logo.png";

const db = firebase.firestore();
class ManagerSales extends Component {
  state = {
    order: "",
    orders: null,
    returnToDashboardClicked: false,
    selectedValue: "",
  };
  getOrders() {
    db.collection("orders")
      .where("type", "==", "dinein")
      .where("sentStatus", "==", "sent")
      .get()
      .then((querySnapshot) => {
        const dbToArray = [];
        querySnapshot.forEach((doc) => {
          dbToArray.push(doc.data());
        });
        this.setState({
          orders: dbToArray,
        });
      });
    db.collection("orders")
      .where("type", "==", "online")
      .where("deliveredStatus", "==", "delivered")
      .get()
      .then((querySnapshot) => {
        const dbToArray = this.state.orders;
        querySnapshot.forEach((doc) => {
          dbToArray.push(doc.data());
        });
        this.setState({
          orders: dbToArray,
        });
      });
  }
  componentDidMount() {
    this.getOrders();
  }
  selectValue = (event) => {
    this.setState({
      selectedValue: event.target.value,
    });
  };
  returnToDashboard = () => {
    this.setState({ returnToDashboardClicked: true });
  };
  render() {
    if (this.state.returnToDashboardClicked) {
      return <Redirect to="/Manager" />;
    }
    return (
      <React.Fragment>
        <Helmet>
          <title>Manager | Sales | Hikari Sushi</title>
        </Helmet>

        <body>
          <div className="ManagerSalesMenuBar">
            <img className="logo" src={logo} alt="logo" />
            <a onClick={this.returnToDashboard}>Manager Main Dashboard</a>
          </div>
          <div className="ManagerSalesBodycontainer">
            <div className="ManagerSalesLeft">
              <p>Select Items</p>
              <select
                className="ManagerSalesSelectItems"
                onChange={this.selectValue}
                value={this.state.selectedValue}
                multiple>
                {this.state.orders
                  ? this.state.orders.map((ordersEntry) => (
                      <option value={ordersEntry.order}>Sale</option>
                    ))
                  : () => {}}
              </select>
            </div>
            <div className="ManagerSalesRight">
              <p>Order:</p>
              <div clasclassNames="items">
                <p>{this.state.selectedValue}</p>
              </div>
            </div>
          </div>
        </body>
      </React.Fragment>
    );
  }
}

export default ManagerSales;
