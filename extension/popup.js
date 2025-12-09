// Popup JS: calls background script to get selection/page then calls backend API
const runBtn = document.getElementById('runBtn');
const status = document.getElementById('status');
const output = document.getElementById('output');
const result = document.getElementById('result');
const modeSelect = document.getElementById('mode');
const copyBtn = document.getElementById('copyBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const manageLink = document.getElementById('manageLink');
manageLink.onclick = () => chrome.runtime.openOptionsPage?.();
async function getSelectionText() {
  const [tab] = await chrome.tabs.query({active:true,currentWindow:true});
  try {
    const res = await chrome.tabs.sendMessage(tab.id, {type: 'GET_SELECTION'});
    if (res && res.selection && res.selection.trim().length>0) return res.selection;
    const pageRes = await chrome.tabs.sendMessage(tab.id, {type: 'GET_PAGE_TEXT'});
    return (pageRes && pageRes.pageText) ? pageRes.pageText : '';
  } catch (e) {
    return '';
  }
}
async function summarize() {
  status.textContent = 'Getting selection...';
  const text = await getSelectionText();
  if (!text) { status.textContent = 'No text found on page. Select text or open a text-based page.'; return; }
  status.textContent = 'Summarizing…';
  runBtn.disabled = true;
  result.classList.add('hidden');
  try {
    const resp = await fetch('http://localhost:3000/api/summarize', {
      method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ text, mode: modeSelect.value })
    });
    if (!resp.ok) throw new Error('server error');
    const data = await resp.json();
    output.textContent = data.summary;
    result.classList.remove('hidden');
    result.setAttribute('aria-hidden','false');
    status.textContent = `Done — ${Math.round(data.latency_ms)} ms`;
    fetch('http://localhost:3000/api/analytics/event', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name:'summarize', latency_ms: data.latency_ms, success:true})}).catch(()=>{});
  } catch (e) {
    console.error(e);
    status.textContent = 'Error: could not summarize. Check server or try again.';
    fetch('http://localhost:3000/api/analytics/event', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name:'summarize', success:false})}).catch(()=>{});
  } finally {
    runBtn.disabled = false;
  }
}
runBtn.addEventListener('click', summarize);
copyBtn.addEventListener('click', async ()=>{ await navigator.clipboard.writeText(output.textContent||''); status.textContent='Copied to clipboard'; });
saveNoteBtn.addEventListener('click', async ()=>{ const notes = JSON.parse(localStorage.getItem('ws_notes')||'[]'); notes.push({text: output.textContent, created_at: Date.now()}); localStorage.setItem('ws_notes', JSON.stringify(notes)); status.textContent='Saved note locally'; });
