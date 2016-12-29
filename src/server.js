import express from "express";
import React from "react";
import { match, RouterContext } from "react-router";
import { renderToString } from 'react-dom/server';
import mainroute from "./routers/routes";
import path from "path";
import webpush from 'web-push';
import bodyParser from 'body-parser';
import EventEmitter from 'events';

var app = express();
var queue = [];
var em = new EventEmitter;
//Point to static files
app.use(express.static('dist/'));
app.use(express.static('static/'))
app.use(bodyParser.json());

app.post('/api/push', function(req, res) {
	let sub = req.body.subscription;
	queue.push(sub);
	res.send('OK');
});
app.post('/api/offline', function(req, res) {
	res.json(req.body);
});
app.get('/api/sse', function(req, res) {
	em.on('sseevent', function (data) {
		res.write('event: sse\n');
	  res.write('data: ' + JSON.stringify({ msg : data }) + '\n\n');
	});
  res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
  });
  res.write("retry: 10000\n\n");
});


app.get('*', function (req, res) {
	let routes = mainroute();
	match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
		if (error) {
			res.status(500).send(error.message)
		} else if (redirectLocation) {
			res.redirect(302, redirectLocation.pathname + redirectLocation.search)
		} else if (renderProps) {
			res.status(200).send('<!DOCTYPE html>'+renderToString(<RouterContext {...renderProps} />));
		} else {
			res.status(404).send('Not found')
		}
	})
});

function timedEventEmitter() {
		setInterval(() => {
				em.emit('sseevent', 'message with number: #'+ Math.round(Math.random(2000, 1000000)*100000))
		}, 5000);
}

function pushService() {
	setInterval(() => {
		let i = queue.length;
		while(i--) {
			console.log(i)
			const pushSubscription = queue.pop(); //your subscription object
			const payload = 'Dette er en pushmelding fra PWA POC :)';
			if(pushSubscription) {
				const options = {
				  vapidDetails: {
				    subject: 'http://localhost:4000/',
				    publicKey: 'BHVJ8n4KMCPy7YOTwNTwn-M3lSKOP_J1PgPQ5lau8ExQ_HwhpbwjYwxtne9vFaOGMzVj_ETeLu5uv8sCZGwFFFc', //These are the keys you generated in step 1
				    privateKey: 'FLuaKQ7j6ZDxwM_5q0Yr69f0MPaV-M-EBMtC8dgo_Ao' //These are the keys you generated in step 1
				  },
				  TTL: 90000,
				  headers: {
				    //'< header name >': '< header value >'
				  }
				}
				webpush.sendNotification(
				  pushSubscription,
				  payload,
				  options
				).then((res) => {
				    console.log(res);
				}).catch((err) => {
				    console.log(err);
				});
			}
		}
		console.log('done')
	}, 60000);
}
//Listen on port
app.listen(3000);
pushService();
timedEventEmitter()
