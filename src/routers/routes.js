"use strict";
import React from "react";
import {Route, StaticRouter, BrowserRouter } from 'react-router-dom';
import Main from "../containers/Main";

let serverRoute = (req, context) => {
	return (
		<StaticRouter location={req.url} context={context}>
			<Route path="/*" component={Main} />
		</StaticRouter>
	);
};

let browserRoute = () => {
	return (
		<BrowserRouter>
			<Route path="/*" component={Main} />
		</BrowserRouter>
	);
};
export { serverRoute, browserRoute };
