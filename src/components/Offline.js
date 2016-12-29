import React from 'react';
import Dexie from 'dexie';

export default class Offline extends React.Component {

	constructor() {
		super();

		let db = new Dexie("text");
	    db.version(1).stores({
	        texts: "++id,content"
	    });

		this.state = {
			db: db,
			text: ""
		}
	}

	componentDidMount() {}

	textchange(e) {
		this.setState({
			text: e.target.innerText
		});
	}

	save(e) {
		let text = document.querySelector('.textarea');
		//save to indexdb
		this.state.db.texts.add({
	        content: this.state.text,
	    }).then(() => {
			text.innerHTML = '';
			//register sync on service worker
			window.navigator.serviceWorker.ready.then((sworker) => {
				sworker.sync.register('syncoffline').then((e) => {
					console.log('registered sync', e);
				});
			})

		}).catch(function(e) {
			console.log(e)
	    });

	}

	render() {
		return (
			<div className="row">
				<div className="columns small-12">
					<h1>Notes</h1>
					<div className="desc"><p>If you are offline, the text is stored on your phone and will be persisted to a server automatically
					when you have a connection</p></div>
					<label>Write a note to be stored offline</label>
					<div className="textarea" onKeyUp={this.textchange.bind(this)} contentEditable="true"></div>
					<button className="button" onClick={this.save.bind(this)}>Save offline</button>
				</div>
			</div>
		)
	}
}
