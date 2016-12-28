import React from 'react';
import {observer, inject} from 'mobx-react';

@inject('store') @observer
export default class Front extends React.Component{
	constructor (props) {
		super(props);
		console.log(this.props)
	}

	componentDidMount() {}

	add() {
		this.props.store.addItem('tufsing');
	}

	render() {
		return (
			<div className="row">
				<div className="columns">
					<h1>Glenn Wedin</h1>
					<p>This is a universal progressive webapp. It is server rendered with express, and buildt on ReactJS and MobX</p>

					<h2>Progressive web app features implemented</h2>
					<ul>
						<li>Offline (using web cache api)</li>
						<li>Push messages</li>
					</ul>
					<ul>
						{this.props.store.items.map((res, i) => {
							return(<div key={res.id}>{res.name}</div>)
						})}
					</ul>
					<button className="button" onClick={this.add.bind(this)}>Add stuff to mobx</button>
				</div>
			</div>
		)
	}
}
