import React, { Component } from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../ViewStyles/Home.css";
import logo from "../ViewStyles/logo.png";

const Home = () => {
  let history = useHistory();
  //This function is the SFC equivalent of a componentWillUnmount function. It reloads the page when redirecting to another page. This helps with getting rid of the cache so that its css file is reloaded(lazy imported) whenever the page is accessed through the router
  useEffect(() => {
    return () => {
      window.location.reload();
    };
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>Hikari Sushi | Home Page</title>
      </Helmet>
      <body>
        <div className="menuBar">
          <a
            onClick={() => {
              history.push("/Login");
            }}>
            Employee?
          </a>
          <a
            onClick={() => {
              history.push("/OrderOnline");
            }}>
            Order
          </a>
        </div>

        <div className="content">
          <img className="logo" src={logo} alt="logo" />
          <p className="resturauntName">Hikari Sushi</p>
          <p>
            At Hikari Sushi & Grill, our food is prepared by skilled and
            experienced chefs, made from fresh, select ingredients, and served
            at a reasonable price for our guests. Our dining area is complete
            with a free fresh salad bar as well as a kids’ area and menu, in
            order to give our customers a more enjoyable family dining
            experience!
          </p>
        </div>
      </body>
    </React.Fragment>
  );
};

export default Home;
