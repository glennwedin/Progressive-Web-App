import React from 'react';
import Alert from './Alert';

export default class Push extends React.Component {
	swRegistration = "test";
	timer = null;

	constructor() {
		super();
		this.state = {
			resp: null
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	subscribe() {
		//register service worker and send
		var isSubscribed;

		if ('serviceWorker' in navigator && 'PushManager' in window) {
		  console.log('Service Worker and Push is supported');
		  navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
		      this.subscreibUser(serviceWorkerRegistration);
		  });
		} else {
		  console.warn('Push messaging is not supported');
		}
	}

	subscreibUser(sworker) {
		let applicationServerPublicKey = 'BHVJ8n4KMCPy7YOTwNTwn-M3lSKOP_J1PgPQ5lau8ExQ_HwhpbwjYwxtne9vFaOGMzVj_ETeLu5uv8sCZGwFFFc';
	    sworker.pushManager.getSubscription().then((subscription) => {
	        console.log('User is NOT subscribed. - Subscribing');
	        //DO THE STUFFING
	        const applicationServerKey = this.urlBase64ToUint8Array(applicationServerPublicKey);
	        sworker.pushManager.subscribe({
	            userVisibleOnly: true,
	            applicationServerKey: applicationServerKey
	        }).then((subscription) => {
	            console.log('User is subscribed:', subscription);
							this.persist(subscription);
	        }).catch((err) => {
	            console.log('Failed to subscribe the user: ', err);
	        });
	    });
	}

	persist(sub) {
		let xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/push');
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4 && xhr.status === 200) {
				this.setState({
					resp: "Thanks, you will receive a push message within 60 seconds"
				}, () => {
						this.timer = setTimeout(() => {
							this.setState({resp:null})
						}, 3000);
				});
			}
		}
		xhr.send(JSON.stringify({subscription: sub}));
	}

	urlBase64ToUint8Array(base64String) {
	    const padding = '='.repeat((4 - base64String.length % 4) % 4);
	    const base64 = (base64String + padding)
	        .replace(/\-/g, '+')
	        .replace(/_/g, '/');
	    const rawData = window.atob(base64);
	    const outputArray = new Uint8Array(rawData.length);
	    for (let i = 0; i < rawData.length; ++i) {
	        outputArray[i] = rawData.charCodeAt(i);
	    }
	    return outputArray;
	}

	render() {
		return (
			<div className="row">
				<div className="column">
					<h1>Push notifications</h1>
					<div className="desc"><p>Register for a push message. You will receive the push message within a minute from registering
					and you will then be forgotten forever</p></div>
				</div>
				<div className="column">
					<button className="button right" onClick={this.subscribe.bind(this)}>Get a push message</button>
					<Alert msg={this.state.resp} />
				</div>
			</div>
		)
	}
}
