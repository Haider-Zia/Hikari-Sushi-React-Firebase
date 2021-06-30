import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { Suspense, lazy } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";

//Lazy imports
const Home = lazy(() => import("./ControllersAndViews/Home"));
const SignIn = lazy(() => import("./ControllersAndViews/SignIn"));
const Manager = lazy(() => import("./ControllersAndViews/Manager"));
const OrderOnline = lazy(() => import("./ControllersAndViews/OrderOnline"));
const Receptionist = lazy(() => import("./ControllersAndViews/Receptionist"));
const ReceptionistOrder = lazy(() => import("./ControllersAndViews/ReceptionistOrder"));
const Chef = lazy(() => import("./ControllersAndViews/Chef"));
const ManagerSales = lazy(() => import("./ControllersAndViews/ManagerSales"));
const Delivery = lazy(() => import("./ControllersAndViews/Delivery"));

ReactDOM.render(
    <Router>
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route exact path="/" render={() => <Home />} />
                <Route exact path="/Login" render={() => <SignIn/>}/>
                <Route exact path="/Manager" render={() => <Manager/>}/>
                <Route exact path="/Manager/Sales" render={() => <ManagerSales/>}/>
                <Route exact path="/OrderOnline" render={() => <OrderOnline/>}/>
                <Route exact path="/Receptionist" render={() => <Receptionist/>}/>
                <Route exact path="/Receptionist/Order" render={() => <ReceptionistOrder/>}/>
                <Route exact path="/Chef" render={() => <Chef/>}/>
                <Route exact path="/Delivery" render={() => <Delivery/>}/>
            </Switch>
        </Suspense>
    </Router>
    , document.getElementById('root')
);

reportWebVitals();
