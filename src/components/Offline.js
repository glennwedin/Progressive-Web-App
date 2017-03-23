import React from 'react';
import Dexie from 'dexie';
import Alert from './Alert';

export default class Offline extends React.Component {
	timer = null;

	constructor() {
		super();

		let db = new Dexie("text");
	    db.version(1).stores({
	        texts: "++id,content"
	    });

		db.texts.toArray().then((res) => {
			this.setState({
				texts: res
			})
		})
		this.state = {
			db: db,
			texts: [],
			text: "",
			resp: null
		}
	}

	componentDidMount() {
		console.log('mount')
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	textchange(e) {
		this.setState({
			text: e.target.innerText
		});
	}

	save(e) {
		let text = document.querySelector('.textarea');
		//save to indexdb
		this.state.db.texts.add({
	  		content: this.state.text
		}).then(() => {
			text.innerHTML = '';
			//register sync on service worker
			window.navigator.serviceWorker.ready.then((sworker) => {
				sworker.sync.register('syncoffline').then((e) => {
					console.log('registered sync', e);
					let texts = this.state.texts;
					texts.push({content: this.state.text, id: Math.random(3422,23423423)});
					console.log(texts)
					this.setState({
						texts: texts,
						resp: "Thank you for your message"
					}, () => {
							this.timer = setTimeout(() => {
								this.setState({resp:null})
							}, 3000);
					});
				});
			})
		}).catch(function(e) {
			console.log(e)
	  });

	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="">
						<h1>Notes</h1>
						<div className="desc"><p>If you are offline, the text is stored on your phone and will be persisted to a server automatically
						when you have a connection</p></div>
					</div>
					<ul>
						{this.state.texts.map((obj, i) => {
							return (<li key={obj.id}>{obj.content} -- <button>Slett</button></li>)
						})}
					</ul>
				</div>
				<div className="fullblock">
					<h2>Try it out</h2>
					<label>Write a note to be stored offline</label>
					<div className="textarea" onKeyUp={this.textchange.bind(this)} contentEditable="true"></div>
					<button className="button" onClick={this.save.bind(this)}>Save offline</button>
					<Alert msg={this.state.resp} />
				</div>
			</div>
		)
	}
}
