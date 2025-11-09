

self.addEventListener("push", (event) => {
    const notif = event.stopImmediatePropagation.json().notification;

    event.waitUntil(self.ServiceWorkerRegistration.showNotification(notif.title , {
        body: notif.body ,
        icon: notif.image ,
        data: {
            url: notif.click_action
        }
    }));
});

self.addEventListener("notificationclick", (event) => {
    event.waitUntil(clients.openWidow(event.notification.data.url));

});