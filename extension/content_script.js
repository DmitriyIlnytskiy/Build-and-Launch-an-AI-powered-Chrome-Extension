// content script: respond with selection or page text
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_SELECTION') {
    const sel = window.getSelection().toString().trim();
    sendResponse({selection: sel});
  } else if (msg.type === 'GET_PAGE_TEXT') {
    const article = document.querySelector('article') || document.body;
    const text = article.innerText.replace(/\s+/g,' ').trim().slice(0,15000);
    sendResponse({pageText: text});
  }
});
