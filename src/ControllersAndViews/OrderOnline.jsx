import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Link, Redirect } from "react-router-dom";
import uuid from "react-uuid";
import firebase from "../firebase";

import "../ViewStyles/OrderOnline.css";
import logo from "../ViewStyles/logo.png";

const db = firebase.firestore();
class OrderOnline extends Component {
  state = {
    menu: null,
    bill: 0,
    order: "",
    returnHomeClicked: false,
    selectedValue: "",
    name: "",
    address: "",
    number: "",
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

  returnHome = () => {
    this.setState({ returnHomeClicked: true });
  };
  handleNameChange = (event) => {
    this.setState({
      name: event.target.value,
    });
    console.log(this.state.name);
  };
  handleNumberChange = (event) => {
    this.setState({
      number: event.target.value,
    });
    console.log(this.state.number);
  };
  handleAddressChange = (event) => {
    this.setState({
      address: event.target.value,
    });
    console.log(this.state.address);
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
    if (
      this.state.address !== "" &&
      this.state.bill !== 0 &&
      this.state.name !== "" &&
      this.state.number !== ""
    ) {
      db.collection("orders").add({
        id: uuid(),
        address: this.state.address,
        bill: this.state.bill,
        name: this.state.name,
        number: this.state.number,
        order: this.state.order,
        preparedStatus: "unprepared",
        sentStatus: "unsent",
        deliveredStatus: "undelivered",
        type: "online",
      });
      this.setState({
        returnHomeClicked: true,
      });
      alert("Order placed");
    } else {
      alert("Please fill all fields for your order");
    }
  };
  render() {
    if (this.state.returnHomeClicked) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <Helmet>
          <title>Order Online | Hikari Sushi</title>
        </Helmet>
        <body>
          <div className="OrderOnlineMenuBar">
            <img class="logo" src={logo} alt="logo" />
            <a onClick={this.returnHome}>Home</a>
          </div>
          <div className="OrderOnlineBodycontainer">
            <div className="OrderOnlineLeft">
              <p>Select Items</p>
              <select
                className="OrderOnlineSelectItems"
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
              <button className="OrderOnlineButton" onClick={this.addToOrder}>
                Add
              </button>
            </div>
            <div className="OrderOnlineMiddle">
              <p>Enter Info</p>
              <div className="name">
                <label>Name </label>
                <input
                  name="name"
                  value={this.state.name}
                  onChange={this.handleNameChange}
                />
              </div>
              <div className="ContactNumber">
                <label>Contact Number </label>
                <input
                  name="contact_number"
                  value={this.state.number}
                  onChange={this.handleNumberChange}
                />
              </div>
              <div className="Address">
                <label>Address </label>
                <input
                  name="address"
                  value={this.state.address}
                  onChange={this.handleAddressChange}
                />
              </div>
            </div>
            <div className="OrderOnlineRight">
              <p>Bill:</p>
              <div className="items">
                <p>{this.state.order}</p>
              </div>
              <div className="OrderOnlineBottomRight">
                <p>Total-----------------------{this.state.bill} Rs</p>
                <button className="OrderOnlineButton" onClick={this.placeOrder}>
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

export default OrderOnline;
