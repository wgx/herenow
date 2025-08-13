        // Self-invoking async function to encapsulate our logic.
        (function() {
            // --- Configuration ---
            // IMPORTANT: Change this to the public address of your Go server.
            const SERVER_URL = 'https://herenow-anhz7w.fly.dev';
            const PING_INTERVAL_MS = 15000; // Ping every 15 seconds
            const SESSION_STORAGE_KEY = 'liveCounterSessionId';

            // --- State ---
            const counterElements = document.querySelectorAll('.herenow');
            if (counterElements.length === 0) {
                console.error('Live counter element with class "herenow" not found.');
                return;
            }

            // Create a unique identifier for the page by combining hostname and pathname.
            const pageIdentifier = window.location.hostname + window.location.pathname;
            let isFirstLoad = true; // Flag to handle the initial fetch.
            
            // --- Core Logic ---

            function getSessionId() {
                let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
                if (!sessionId) {
                    sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
                    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
                }
                return sessionId;
            }

            const sessionId = getSessionId();

            async function sendPing() {
                try {
                    await fetch(`${SERVER_URL}/ping`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId: sessionId, page: pageIdentifier }),
                    });
                } catch (error) {
                    // It's okay to fail silently here as the user doesn't need to see ping errors.
                    console.error('Failed to send ping:', error);
                }
            }

            async function fetchAndUpdateCount() {
                try {
                    // The encodeURIComponent function safely escapes the identifier.
                    const safePageIdentifier = encodeURIComponent(pageIdentifier);
                    const response = await fetch(`${SERVER_URL}/count?page=${safePageIdentifier}`);
                    if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
                    
                    const data = await response.json();
                    let userCount = data.count || 0;

                    // Prevent the initial 1 -> 0 flicker.
                    // On the very first load, if the server returns 0 (due to a race condition
                    // with the first ping), conservatively show 1 instead of overwriting the default.
                    if (isFirstLoad && userCount === 0) {
                        userCount = 1;
                    }
                    isFirstLoad = false; // This check will only run once.
                    
                    const userText = userCount === 1 ? 'user' : 'users';
                    const newText = `${userCount} ${userText} here now`;

                    // Update the text content of all counter elements.
                    counterElements.forEach(el => {
                        el.textContent = newText;
                    });

                } catch (error) {
                    console.error('Failed to fetch count:', error);
                    // Update to an error state.
                    counterElements.forEach(el => {
                        el.textContent = 'Herenow count unavailable';
                    });
                }
            }

            // --- Initialization ---
            sendPing();
            fetchAndUpdateCount();
            setInterval(sendPing, PING_INTERVAL_MS);
            setInterval(fetchAndUpdateCount, PING_INTERVAL_MS);

            window.addEventListener('beforeunload', function() {
                const data = new Blob([JSON.stringify({ sessionId: sessionId, page: pageIdentifier })], { type: 'application/json' });
                navigator.sendBeacon(`${SERVER_URL}/ping`, data);
            });

        })();