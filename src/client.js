import React from "react";
import ReactDOM from "react-dom";
import  { Router, browserHistory } from "react-router";
import { browserRoute } from "./routers/routes";
import "!style-loader!css-loader!sass-loader!./scss/main.scss";

var routing = browserRoute();
ReactDOM.render(routing, document);
