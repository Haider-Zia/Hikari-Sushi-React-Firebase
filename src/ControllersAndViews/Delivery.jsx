import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Link, Redirect } from "react-router-dom";
import firebase from "../firebase";

import "../ViewStyles/Delivery.css";
import logo from "../ViewStyles/logo.png";

const db = firebase.firestore();
class Delivery extends Component {
  state = {
    orders: null,
    logOutClicked: false,
    selectedValue: "",
    selectedOrder: "",
    selectedBill: 0,
    selectedAddress: "",
    selectedNumber: "",
  };
  getOrders() {
    db.collection("orders")
      .where("type", "==", "online")
      .where("sentStatus", "==", "sent")
      .where("deliveredStatus", "==", "undelivered")
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
  selectValue = (event) => {
    this.setState({
      selectedValue: event.target.value,
    });
    this.state.orders.find((order) => {
      if (order.id === this.state.selectedValue) {
        this.setState({
          selectedOrder: order.order,
          selectedAddress: order.address,
          selectedBill: order.bill,
          selectedNumber: order.number,
        });
      }
    });
    console.log(this.state.selectedValue);
  };
  logOut = () => {
    this.setState({ logOutClicked: true });
  };
  handleDelivered = () => {
    db.collection("orders")
      .where("id", "==", this.state.selectedValue)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs[0].ref.set(
          {
            deliveredStatus: "delivered",
          },
          { merge: true }
        );
      });
    alert("Order Delivered");
  };
  render() {
    if (this.state.logOutClicked) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <Helmet>
          <title>Delivery | Hikari Sushi</title>
        </Helmet>

        <body>
          <div className="DeliveryMenuBar">
            <img className="logo" src={logo} alt="logo" />
            <a onClick={this.logOut}>Home | Logout</a>
          </div>
          <div className="DeliveryBodycontainer">
            <div className="DeliveryLeft">
              <p>Select Items</p>
              <select
                className="DeliverySelectItems"
                onChange={this.selectValue}
                value={this.state.selectedValue}
                multiple>
                {this.state.orders
                  ? this.state.orders.map((ordersEntry) => (
                      <option value={ordersEntry.id}>Sale</option>
                    ))
                  : () => {}}
              </select>
            </div>
            <div className="DeliveryRight">
              <div clasclassNames="items">
                {this.state.selectedValue !== "" ? (
                  <p>
                    {this.state.selectedOrder +
                      "\n" +
                      "Bill: " +
                      this.state.selectedBill +
                      "\n" +
                      "Address: " +
                      this.state.selectedAddress +
                      "\n" +
                      "Phone: " +
                      this.state.selectedNumber}
                  </p>
                ) : (
                  () => {}
                )}
              </div>
              <div className="DeliveryBottomRight">
                {this.state.selectedValue !== "" ? (
                  <button
                    className="DeliveryButton"
                    onClick={this.handleDelivered}>
                    Delivered
                  </button>
                ) : (
                  () => {}
                )}
              </div>
            </div>
          </div>
        </body>
      </React.Fragment>
    );
  }
}

export default Delivery;
