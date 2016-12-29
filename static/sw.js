//OFFLINE
self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('v1').then(function(cache) {
     return cache.addAll([
       '/',
       '/offline',
       '/pushmessages',
       '/css/main.css',
       '/client.js',
	   '/manifest.webmanifest'
     ]).then(() => self.skipWaiting());
   })
 );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
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
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

///PUSH
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push fra PWA POC';
  const options = {
    body: event.data.text(), //Your push message - event.data.text() for instance
    icon: '', //image
    badge: '' ////image
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

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
        console.log('1')
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

function doSync() {
    return new Promise((res, rej) => {
        let data = getOfflineData();
        data.then((d) => {
            console.log('data: ', d);
            fetch('http://localhost:3000/api/offline', {
                method: 'post',
                headers: {
                  "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(d)
            }).then((data) => {
                data.json().then((d) => {
                    console.log('response', d)
                })
            }).catch((error) => {
                console.log('Request failed', error);
            });
        })
    });
}

//Background sync
self.addEventListener('sync', function(event) {
    console.log('hva?')
  if (event.tag == 'syncoffline') {
     event.waitUntil(doSync());
  }
});
