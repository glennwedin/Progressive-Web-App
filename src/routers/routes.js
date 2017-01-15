import React from "react";
import {Match, Miss, ServerRouter, BrowserRouter } from 'react-router'
import Main from "../containers/Main";

let serverRoute = (req, context) => {
	return (
		<ServerRouter location={req.url} context={context}>
			<Match pattern="/*" component={Main} />
		</ServerRouter>
	);
};

let browserRoute = () => {
	return (
		<BrowserRouter>
			<Match pattern="/*" component={Main} />
		</BrowserRouter>
	);
}
export { serverRoute, browserRoute }
