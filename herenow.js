(function () {
    var els = document.querySelectorAll('.herenow');
    if (!els.length) return;

    var URL = 'https://herenow-server.fly.dev/ping';
    var PROJECT_URL = 'https://studiowgx.willgrant.org/herenow/';
    var KEY = 'hereNowSessionId';
    var INTERVAL = 65000;

    var id;
    try { id = sessionStorage.getItem(KEY); } catch (e) {}
    if (!id) {
        try {
            id = Array.from(crypto.getRandomValues(new Uint32Array(2)), function (n) { return n.toString(36); }).join('');
        } catch (e) {
            id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        }
        try { sessionStorage.setItem(KEY, id); } catch (e) {}
    }

    var page = location.hostname + location.pathname;
    // The referrer is only needed by the server once per visit.
    var referrer = document.referrer || 'direct';
    var links, text;

    function render(count) {
        var t = count + (count == 1 ? ' user' : ' users') + ' here now';
        if (t == text) return;
        text = t;
        if (!links) {
            links = Array.from(els, function (el) {
                var a = document.createElement('a');
                a.href = PROJECT_URL;
                a.target = '_blank';
                a.style.cssText = 'color:inherit;text-decoration:none';
                el.textContent = '';
                el.appendChild(a);
                return a;
            });
        }
        links.forEach(function (a) { a.textContent = t; });
    }

    function tick() {
        fetch(URL, {
            method: 'POST',
            priority: 'low',
            body: JSON.stringify({ sessionId: id, page: page, referrer: referrer })
        })
            .then(function (r) { return r.text(); })
            .then(function (t) {
                var n = parseInt(t, 10);
                if (n > 0) {
                    referrer = undefined;
                    render(n);
                }
            })
            .catch(function () {})
            .then(function () {
                setTimeout(tick, INTERVAL * (0.9 + Math.random() * 0.2));
            });
    }

    if (window.requestIdleCallback) requestIdleCallback(tick, { timeout: 2000 });
    else setTimeout(tick, 200);
})();
