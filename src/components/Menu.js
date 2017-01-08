import React from 'react';
import { Link } from 'react-router';

export default class Menu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div onClick={this.props.toggle} className={'sidemenuWrapper '+ (this.props.open ? 'open' : '')}>
				<div className="column sidemenu">
					<div className="head">Menu</div>
					<ul>
						<li><Link to="/" onClick={this.props.toggle}>Home</Link></li>
						<li><Link to="/offline" onClick={this.props.toggle}>Offline storage / Background-sync</Link></li>
						<li><Link to="/pushmessages" onClick={this.props.toggle}>Push messages</Link></li>
						<li><Link to="/serversentevents" onClick={this.props.toggle}>Server sent events</Link></li>
					</ul>
				</div>
			</div>
		)
	}
}
