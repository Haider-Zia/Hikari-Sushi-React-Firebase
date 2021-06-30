import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Link, Redirect } from "react-router-dom";
import uuid from "react-uuid";
import firebase from "../firebase";

import "../ViewStyles/ReceptionistOrder.css";
import logo from "../ViewStyles/logo.png";

const db = firebase.firestore();
class ReceptionistOrder extends Component {
  state = {
    menu: null,
    bill: 0,
    order: "",
    returnToDashboardClicked: false,
    selectedValue: "",
  };
  getMenu() {
    db.collection("menu").onSnapshot((querySnapshot) => {
      const dbToArray = [];
      querySnapshot.forEach((doc) => {
        dbToArray.push(doc.data());
      });
      this.setState({
        menu: dbToArray,
      });
    });
  }
  componentDidMount() {
    this.getMenu();
  }

  returnToDashboard = () => {
    this.setState({ returnToDashboardClicked: true });
  };

  selectValue = (event) => {
    this.setState({
      selectedValue: event.target.value,
    });
  };
  addToOrder = () => {
    var priceString = "";
    var priceNumber = 0;

    this.state.menu.find((menuEntry) => {
      if (menuEntry.item === this.state.selectedValue) {
        priceString = menuEntry.price;
        priceNumber = menuEntry.price;
      }
    });
    this.setState({
      order:
        this.state.order +
        this.state.selectedValue +
        " | " +
        priceString +
        "Rs." +
        "\n",
      bill: this.state.bill + priceNumber,
    });
  };
  placeOrder = () => {
    if (this.state.bill !== 0) {
      db.collection("orders").add({
        id: uuid(),
        bill: this.state.bill,
        order: this.state.order,
        preparedStatus: "unprepared",
        sentStatus: "unsent",
        type: "dinein",
      });
      this.setState({
        returnToDashboardClicked: true,
      });
      alert("Order placed");
    } else {
      alert("Please fill all fields for your order");
    }
  };

  render() {
    if (this.state.returnToDashboardClicked) {
      return <Redirect to="/Receptionist" />;
    }
    return (
      <React.Fragment>
        <Helmet>
          <title>Receptionist | Order | Hikari Sushi</title>
        </Helmet>

        <body>
          <div className="ReceptionistOrderMenuBar">
            <img className="logo" src={logo} alt="logo" />
            <a onClick={this.returnToDashboard}>Receptionist Main Dashboard</a>
          </div>
          <div className="ReceptionistOrderBodycontainer">
            <div className="ReceptionistOrderLeft">
              <p>Select Items</p>
              <select
                className="ReceptionistOrderSelectItems"
                onChange={this.selectValue}
                value={this.state.selectedValue}
                multiple>
                {this.state.menu
                  ? this.state.menu.map((menuEntry) => (
                      <option value={menuEntry.item}>
                        {menuEntry.item + " | " + menuEntry.price + " Rs."}
                      </option>
                    ))
                  : () => {}}
              </select>
              <button
                className="ReceptionistOrderButton"
                onClick={this.addToOrder}>
                Add
              </button>
            </div>
            <div className="ReceptionistOrderRight">
              <p>Order:</p>
              <div clasclassNames="items">
                <p>{this.state.order}</p>
              </div>
              <div className="ReceptionistOrderBottomRight">
                <p>Total-----------------------{this.state.bill} Rs</p>
                <button
                  className="ReceptionistOrderButton"
                  onClick={this.placeOrder}>
                  Order
                </button>
              </div>
            </div>
          </div>
        </body>
      </React.Fragment>
    );
  }
}

export default ReceptionistOrder;
