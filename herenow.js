// Self-invoking async function to encapsulate our logic.
(function() {
    // --- Configuration ---
    const SERVER_URL = 'https://herenow-anhz7w.fly.dev';
    const PROJECT_URL = 'https://wgx.github.io/herenow/';
    const PING_INTERVAL_MS = 15000;
    const SESSION_STORAGE_KEY = 'hereNowSessionId';

    // --- State ---
    const counterElements = document.querySelectorAll('.herenow');
    if (counterElements.length === 0) {
        // Don't log an error if the element simply isn't on the page.
        return;
    }

    const pageIdentifier = window.location.hostname + window.location.pathname;
    let isFirstLoad = true;

    // --- Core Logic ---

    function getSessionId() {
        let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!sessionId) {
            // Use crypto.randomUUID for a more robust unique ID.
            sessionId = crypto.randomUUID();
            sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
        }
        return sessionId;
    }

    const sessionId = getSessionId();
    // Get the true referrer from the document object. Default to 'direct' if empty.
    const referrer = document.referrer || 'direct';

    async function sendPing() {
        try {
            await fetch(`${SERVER_URL}/ping`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Include the referrer in the ping payload.
                body: JSON.stringify({
                    sessionId: sessionId,
                    page: pageIdentifier,
                    referrer: referrer
                }),
            });
        } catch (error) {
            console.error('Failed to send ping:', error);
        }
    }

    async function fetchAndUpdateCount() {
        try {
            const safePageIdentifier = encodeURIComponent(pageIdentifier);
            const response = await fetch(`${SERVER_URL}/count?page=${safePageIdentifier}`);
            if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);

            const data = await response.json();
            let userCount = data.count || 0;

            if (isFirstLoad && userCount === 0) {
                userCount = 1;
            }
            isFirstLoad = false;

            const userText = userCount === 1 ? 'user' : 'users';
            const newText = `${userCount} ${userText} here now`;

            const linkHTML = `<a href="${PROJECT_URL}" target="_blank" style="color: inherit; text-decoration: none;">${newText}</a>`;

            counterElements.forEach(el => {
                el.innerHTML = linkHTML;
            });

        } catch (error) {
            console.error('Failed to fetch count:', error);
            counterElements.forEach(el => {
                el.textContent = 'Herenow unavailable';
            });
        }
    }

    // --- Initialization ---
    sendPing();
    fetchAndUpdateCount();
    setInterval(sendPing, PING_INTERVAL_MS);
    setInterval(fetchAndUpdateCount, PING_INTERVAL_MS);

    // Use `pagehide` instead of `beforeunload` for the final ping.
    // It is more reliable and avoids permissions policy violations.
    window.addEventListener('pagehide', function() {
        const payload = JSON.stringify({
            sessionId: sessionId,
            page: pageIdentifier,
            referrer: referrer
        });
        const data = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(`${SERVER_URL}/ping`, data);
    });

})();

