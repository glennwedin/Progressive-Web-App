import React from "react";
import {Router, Route, IndexRoute} from "react-router";
import Main from "../containers/Main";
import Front from '../components/Front';
import Push from '../components/Push';
import Offline from '../components/Offline';
import ServerSentEvents from '../components/ServerSentEvents';

var mainroute = (history) => {
	history = history || null;
	return (<Router history={history}>
				<Route path="/" component={Main} >
					<IndexRoute component={Front} />
					<Route path="pushmessages" component={Push} />
					<Route path="offline" component={Offline} />
					<Route path="serversentevents" component={ServerSentEvents} />
				</Route>
			</Router>);
};

export default mainroute;