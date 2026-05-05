const PROXY_URL = 'http://localhost:3000/api/summarize';

document.getElementById('summarizeBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const output = document.getElementById('output');
  const loader = document.getElementById('loader');
  
  output.innerText = "";
  loader.classList.remove('hidden');

  // Request content from the active webpage
  chrome.tabs.sendMessage(tab.id, { action: "extractContent" }, async (response) => {
    if (!response || !response.text) {
      loader.classList.add('hidden');
      output.innerText = "Error: Unable to extract text from this webpage.";
      return;
    }

    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: response.text })
      });

      const data = await res.json();
      loader.classList.add('hidden');

      if (data.summary) {
        output.innerText = `Title: ${response.title}\n\n${data.summary}`;
      } else {
        output.innerText = "Error: " + (data.error || "Failed to contact proxy server.");
      }
    } catch (err) {
      loader.classList.add('hidden');
      output.innerText = "Error connecting to proxy server. Is it running?";
    }
  });
});

document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('output').innerText = "";
});