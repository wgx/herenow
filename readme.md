# herenow.js

A feather-light, privacy-respecting, GDPR-compliant visitor counter that shows you how many users are on the page right now. No creepy tracking, no personal data.

![herenow.js Counter Example](https://placehold.co/200x50/ffffff/111827?text=1%20user%20here)

---

## Features

* **Privacy First**: No cookies or personally identifiable information are ever used or stored.
* **GDPR Compliant**: Helps you meet your privacy compliance goals effortlessly.
* **Simple & Minimal**: Just one line of HTML and one script tag. The counter is unstyled by default, giving you complete control over its appearance.
* **Lightweight**: The script is tiny and loads asynchronously so it won't slow down your site.

---

## Getting Started

### 1. Add the HTML Element

Place this `<span>` tag wherever you want the counter to appear on your page. The script will automatically find it by its class name.

```html
<span class="herenow">1 user here</span>
```

### 2. Add the Script

Add this script tag just before the closing `</body>` tag on your page. The `defer` attribute ensures it won't block your page from loading.

```html
<script src="[https://SERVERNAME/herenow.js](https://SERVERNAME/herenow.js)" defer></script>
```

### 3. Style the Counter (Optional)

The counter is unstyled by default. If you'd like to create a styled badge with a pulsing dot, you can use the CSS below.

**CSS:**

```css
.herenow-container {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #f0f2f5;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
}

.dot {
    width: 0.75rem;
    height: 0.75rem;
    background-color: #22c55e;
    border-radius: 50%;
    animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    50% { opacity: .5; }
}
```

**HTML Structure:**

With the dot:

```html
<div class="herenow-container">
    <span class="dot"></span>
    <span class="herenow">1 user here</span>
</div>
```

Or just plain text:

```html
<span class="herenow">1 user here</span>
```