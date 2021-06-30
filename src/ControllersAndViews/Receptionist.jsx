import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Link, Redirect } from "react-router-dom";
import firebase from "../firebase";

import "../ViewStyles/Receptionist.css";
import logo from "../ViewStyles/logo.png";

const db = firebase.firestore();
class Receptionist extends Component {
  state = {
    logOutClicked: false,
    redirectToOrder: false,
    preparedOrders: null,
    selectedValue: "",
  };
  getPreparedOrders() {
    db.collection("orders")
      .where("preparedStatus", "==", "prepared")
      .where("sentStatus", "==", "unsent")
      .get()
      .then((querySnapshot) => {
        const dbToArray = [];
        querySnapshot.forEach((doc) => {
          dbToArray.push(doc.data());
        });
        this.setState({
          preparedOrders: dbToArray,
        });
      });
  }
  componentDidMount() {
    this.getPreparedOrders();
  }
  logOut = () => {
    this.setState({ logOutClicked: true });
  };
  redirectToOrder = () => {
    this.setState({ redirectToOrder: true });
  };
  selectValue = (event) => {
    this.setState({
      selectedValue: event.target.value,
    });
  };
  sendOutOrder = () => {
    db.collection("orders")
      .where("order", "==", this.state.selectedValue)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs[0].ref.set(
          {
            sentStatus: "sent",
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
    if (this.state.redirectToOrder) {
      return <Redirect to="/Receptionist/Order" />;
    }
    return (
      <React.Fragment>
        <Helmet>
          <title>Receptionist | Hikari Sushi</title>
        </Helmet>
        <body>
          <div className="ReceptionistMenuBar">
            <img className="logo" src={logo} alt="logo" />
            <a onClick={this.logOut}>Home | Logout</a>
          </div>
          <div className="ReceptionistBodyContainer">
            <div className="ReceptionistLeft">
              <form>
                <button
                  className="ReceptionistButton"
                  onClick={this.redirectToOrder}>
                  Send Order To Chef
                </button>
              </form>
            </div>

            <div className="ReceptionistRight">
              <p>Orders Sent Out By Chef</p>
              <select
                className="ReceptionistSelectItems"
                onChange={this.selectValue}
                onClick={this.viewOrderDetails}
                value={this.state.selectedValue}
                multiple>
                {this.state.preparedOrders
                  ? this.state.preparedOrders.map((orderEntry) => (
                      <option value={orderEntry.order}>
                        order ____ {orderEntry.type}
                      </option>
                    ))
                  : () => {}}
              </select>
              <button
                className="ReceptionistButton"
                onClick={this.sendOutOrder}>
                Send Out
              </button>
            </div>
          </div>
        </body>
      </React.Fragment>
    );
  }
}

export default Receptionist;
