chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractContent") {
    // Locate the main content section, falling back to the whole body
    const article = document.querySelector('article') || 
                    document.querySelector('main') || 
                    document.body;

    // Clone and strip non-readable elements
    const clone = article.cloneNode(true);
    clone.querySelectorAll('script, style, nav, footer, noscript, iframe').forEach(el => el.remove());

    sendResponse({ 
      text: clone.innerText.substring(0, 6000), // Limits length for request
      title: document.title 
    });
  }
});