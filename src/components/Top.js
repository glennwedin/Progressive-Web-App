/* globals navigator */
"use strict";
import React from 'react';

export default class Top extends React.Component {
	constructor () {
		super();
		this.state = {
			isOnline: true
		};
	}

	componentDidMount() {
		this.checkConnection();
	}

	checkConnection() {
		if(navigator.connection || navigator.mozConnection || navigator.webkitConnection) {
			let connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection,
				type = connection.type;
			setInterval(() => {
				console.log("Connection type is change from " + type + " to " + connection.type);
			}, 3000);
		}
		if(navigator.onLine) {
			setInterval(() => {
				this.setState({
					isOnline: navigator.onLine
				});
			}, 3000);
		}
	}

	render() {
		return (
			<div className="topbar">
				<div className="row">
					<div className="menutoggle" onClick={this.props.toggle}>
						|||
					</div>
					<div className="title">Progressive web app</div>
					<div className="netstatus">
						{this.state.isOnline ? "" : "!"}
					</div>
				</div>
			</div>
		);
	}
}
