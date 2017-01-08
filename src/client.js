import React from "react";
import ReactDOM from "react-dom";
import  { Router, browserHistory } from "react-router";
import mainroute from "./routers/routes";
//import "./scss/main.scss";
//import "./scss/shell.scss";

var routing = mainroute(browserHistory);

ReactDOM.render(routing, document);
