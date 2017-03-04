import React from "react";
import { Route } from "react-router";
import { Provider, observer } from 'mobx-react';
import Top from '../components/Top';
import Menu from '../components/Menu';

import Front from '../components/Front';
import Push from '../components/Push';
import Offline from '../components/Offline';
import ServerSentEvents from '../components/ServerSentEvents';

import SSE from '../stores/SSE';

let SSEStore = new SSE();

@observer
class Main extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			menu: false
		};
	}

	toggleMenu() {
		this.setState({
			menu: !this.state.menu
		});
	}

	render () {
		return (
				<Provider ssestore={SSEStore}>
					<html lang="en">
						<head>
							<meta charSet="UTF-8" />
							<meta name="viewport" content="width=device-width" />
							<meta name="theme-color" content="#3269ff" />
							<title>Progressive Wep App</title>
							<link rel="manifest" href="/manifest.webmanifest" />
							<link rel="stylesheet" href="css/shell.css" type="text/css" />
						</head>
						<body>
							<Menu open={this.state.menu} toggle={this.toggleMenu.bind(this)} />
							<Top toggle={this.toggleMenu.bind(this)} />
							<div id="app">
								<Route exact path="/" component={Front} />
								<Route exact path="/pushmessages" component={Push} />
								<Route exact path="/offline" component={Offline} />
								<Route exact path="/serversentevents" component={ServerSentEvents} />
							</div>
							<script src="/serviceWorkerInstaller.js"></script>
							<script type="text/javascript" src="/client.js"></script>
						</body>
					</html>
				</Provider>
			);
	}

}
export default Main;
