// service worker for MV3 - placeholder for auth/token management
self.addEventListener('install', ()=> self.skipWaiting());
self.addEventListener('activate', ()=> self.clients.claim());
chrome.runtime.onInstalled.addListener(()=>{
  chrome.contextMenus.create({id:'summarize-selection',title:'Summarize selection',contexts:['selection']});
});
chrome.contextMenus.onClicked.addListener((info, tab)=>{
  if (info.menuItemId==='summarize-selection') {
    chrome.scripting.executeScript({target:{tabId:tab.id}, func: ()=> { window.getSelection().toString(); }});
  }
});
