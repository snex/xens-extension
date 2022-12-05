function logError(e) {
  console.log('xens: Error: ' + e);
}

chrome.alarms.onAlarm.addListener(() => {
  chrome.action.setIcon({ path: 'xens.png' });
});

chrome.action.onClicked.addListener(async (tab) => {
  fetch('https://xens.org/n.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: tab.url })
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [res.url + ' ' + res.statusText],
        func: logError
      });
      return { error: true };
    }
  }).then((data) => {
    if (data.error) {
      chrome.action.setIcon({ path: 'xens-error.png' });
      chrome.alarms.create({ when: Date.now() + 1000 });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [data],
        func: (data) => {
          let input = document.createElement('textarea');
          input.style.position = 'fixed';
          input.style.bottom = 0;
          input.style.left = 0;
          document.body.appendChild(input);
          input.value = data.url;
          input.focus();
          input.select();
          document.execCommand('copy');
          input.remove();
        }
      });
      chrome.action.setIcon({ path: 'xens-success.png' });
      setTimeout(function() {
        chrome.action.setIcon({ path: 'xens.png' });
      }, 1000);
    }
  }).catch(function(err) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [err.message],
      func: logError
    });
    chrome.action.setIcon({ path: 'xens-error.png' });
    chrome.alarms.create({ when: Date.now() + 1000 });
  });
})
