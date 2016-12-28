import React from 'react';

export default class Push extends React.Component {
	swRegistration = "test";

	constructor() {
		super();
		this.state = {
			resp: ""
		}
	}
	subscribe() {
		//register service worker and send
		var isSubscribed;

		if ('serviceWorker' in navigator && 'PushManager' in window) {
		  console.log('Service Worker and Push is supported');
		  navigator.serviceWorker.register('sw.js').then((swReg) => {
		      console.log('Service Worker is registered', swReg);

		      navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
		          this.subscreibUser();
		      });
		    })
		    .catch(function(error) {
		      console.error('Service Worker Error', error);
		    });
		} else {
		  console.warn('Push messaging is not supported');
		}
	}

	subscreibUser() {
		let applicationServerPublicKey = 'BHVJ8n4KMCPy7YOTwNTwn-M3lSKOP_J1PgPQ5lau8ExQ_HwhpbwjYwxtne9vFaOGMzVj_ETeLu5uv8sCZGwFFFc';
	    window.sworker.pushManager.getSubscription().then((subscription) => {
	        console.log('User is NOT subscribed. - Subscribing');
	        //DO THE STUFFING
	        const applicationServerKey = this.urlBase64ToUint8Array(applicationServerPublicKey);
	        window.sworker.pushManager.subscribe({
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
		xhr.open('POST', 'http://localhost:3000/api/push');
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4 && xhr.status === 200) {
				this.setState({
					resp: "Thanks, you will receive a push message within 60 seconds"
				})
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
				<div className="columns small-12">
					<h1>Push notifications</h1>
					<div className="desc"><p>Register for a push message. You will receive the push message within a minute from registering
					and you will then be forgotten forever</p></div>
					<button className="button" onClick={this.subscribe.bind(this)}>Get a push message</button>
					{this.state.resp ?
					<div className="alert">
						<p>{this.state.resp}</p>
					</div>
					: ''}
				</div>
			</div>
		)
	}
}
