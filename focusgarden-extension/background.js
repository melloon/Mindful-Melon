async function ensureOffscreenDocument() {
  const exists = await chrome.offscreen.hasDocument();
  if (!exists) {
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play lofi audio in background"
    });
  }
}

// listen for toggleMusic from popup
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "toggleMusic") {
    await ensureOffscreenDocument();

    // forward the message to the offscreen document
    const offscreenId = await chrome.offscreen.getDocument(); // gets the offscreen doc
    chrome.runtime.sendMessage({ type: "toggleMusic" });
    sendResponse({ success: true });
  }
  return true; // keep port open for async response
});
