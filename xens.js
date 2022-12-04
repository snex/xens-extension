chrome.action.onClicked.addListener(async (tab) => {
  fetch('https://xens.org/n.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: tab.url })
  }).then((res) => {
    return res.json();
  }).then((data) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [data],
      func: (data) => {
        let input = document.createElement('textarea');
        document.body.appendChild(input);
        input.value = data.url;
        input.focus();
        input.select();
        document.execCommand('copy');
        input.remove();
      }
    });
  });
})
