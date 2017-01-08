//OFFLINE
self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('v1').then(function(cache) {
     //Add all resources to cache
     return cache.addAll([
       '/',
       '/offline',
       '/pushmessages',
       '/serversentevents',
       '/client.js',
       '/css/shell.css',
	   '/manifest.webmanifest'
     ]).then(() => self.skipWaiting());
   })
 );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  //Remove old caches
  var cacheWhitelist = ['v1'];
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  //Proxy the request and respond from cache
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

///PUSH
self.addEventListener('push', function(event) {
  const title = 'Push message';
  const options = {
    body: event.data.text(), //Your push message - event.data.text() for instance
    icon: '/icon.png', //image
    badge: '/icon.png' ////image
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

//Function for fetching data from indexedDB
function getOfflineData() {
    return new Promise((res, rej) => {
        let request = self.indexedDB.open("text"),
        db;

        //Do we really need to here?
        request.onupgradeneeded = function(event) {
            db = event.target.result;
            // Create an objectStore for this database
            let objectStore = db.createObjectStore("texts", { keyPath: "id", autoIncrement:true }); ;
        };
        request.onerror = function(event) {
          console.log('error:', event);
        };
        request.onsuccess = function (e) {
            db = e.target.result;
            let result = [],
            transaction = db.transaction(["texts"], IDBTransaction.READ_WRITE),
            objectStore = transaction.objectStore('texts');
            objectStore.index('content').openCursor().onsuccess = (event) => {
                let c = event.target.result;
                if (c) {
                    result.push(c.value);
    			    c.continue();
    			} else {
                    res(result);
                }
            };
        }
    });
}

//Function to sync data between app and server
function doSync() {
    return new Promise((res, rej) => {
        let data = getOfflineData();
        data.then((d) => {
            fetch('/api/offline', {
                method: 'post',
                headers: {
                  "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(d)
            }).then((data) => {
                data.json().then((d) => {
                    const title = 'Background sync is done';
                    const options = {
                      body: "Data have been synced with the server", //Your push message - event.data.text() for instance
                      icon: '/icon.png', //image
                      badge: '/icon.png' ////image
                    };
                    self.registration.showNotification(title, options);
                })
            }).catch((error) => {
                console.log('Request failed', error);
            });
        })
    });
}

//Trigger background sync
self.addEventListener('sync', function(event) {
  if (event.tag == 'syncoffline') {
     event.waitUntil(doSync());
  }
});
