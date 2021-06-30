import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Link, Redirect } from "react-router-dom";
import firebase from "../firebase";

import "../ViewStyles/Chef.css";
import logo from "../ViewStyles/logo.png";

const db = firebase.firestore();
class Chef extends Component {
  state = {
    orders: null,
    logOutClicked: false,
    selectedValue: null,
    selectedBill: 0,
    selectedOrder: "",
    selectedType: "",
    selectedAddress: "",
    selectedName: "",
    selectedNumber: "",
  };
  getOrders() {
    db.collection("orders")
      .where("preparedStatus", "==", "unprepared")
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
  }
  componentDidMount() {
    this.getOrders();
  }

  logOut = () => {
    this.setState({ logOutClicked: true });
  };

  selectValue = (event) => {
    this.setState({
      selectedValue: event.target.value,
    });
  };

  viewOrderDetails = () => {
    this.state.orders.find((orderEntry) => {
      if (orderEntry.order === this.state.selectedValue) {
        this.setState({
          selectedOrder: orderEntry.order,
          selectedType: orderEntry.type,
        });
        if (this.state.selectedType == "online") {
          this.setState({
            selectedAddress: orderEntry.address,
            selectedName: orderEntry.name,
            selectedNumber: orderEntry.number,
          });
        }
      }
    });
  };

  sendOutOrder = () => {
    db.collection("orders")
      .where("order", "==", this.state.selectedOrder)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs[0].ref.set(
          {
            preparedStatus: "prepared",
          },
          { merge: true }
        );
      });
    alert("Order Sent");
  };

  render() {
    if (this.state.logOutClicked) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <Helmet>
          <title>Chef | Hikari Sushi</title>
        </Helmet>
        <body>
          <div className="Chef_menu_bar">
            <img className="logo" src={logo} alt="logo" />
            <a onClick={this.logOut}>Home | Logout</a>
          </div>
          <div className="Chef_bodycontainer">
            <div className="Chef_left">
              <p>Select Items</p>

              <select
                className="Chef_select_items"
                onChange={this.selectValue}
                onClick={this.viewOrderDetails}
                value={this.state.selectedValue}
                multiple>
                {this.state.orders
                  ? this.state.orders.map((orderEntry) => (
                      <option value={orderEntry.order}>order</option>
                    ))
                  : () => {}}
              </select>
            </div>
            <div className="Chef_right">
              <p>Order:</p>
              <div className="Chef_items">
                <p>{this.state.selectedOrder}</p>
              </div>
              <div className="Chef_bottom_right">
                <button className="Chef_button" onClick={this.sendOutOrder}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </body>
      </React.Fragment>
    );
  }
}

export default Chef;
