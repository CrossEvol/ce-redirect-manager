chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
  console.log('chrome.tabs.onUpdated: change', change);
  if (tab.active && change.url) {
    chrome.storage.sync.get(({ dataTables }) => {
      handlePageRedirectPage(tab, change.url, dataTables);
    });
  }
});

function handlePageRedirectPage(tab, url, dataTables) {
  if (!isValidHttpUrl(url)) {
    console.log('currentURL not valid: ' + url);
    return;
  }
  let currentURL = new URL(url);
  let hostCurrentUrl = currentURL.host;
  console.log('currentURL: ' + currentURL + '; hostCurrentURL: ' + hostCurrentUrl);
  console.log('handlePageRedirectPage dataTable', dataTables);
  if (dataTables && dataTables.length > 0) {
    for (let i = 0; i <= dataTables.length; i++) {
      if (dataTables[i] && isValidHttpUrl(dataTables[i].block)) {
        let urlBlocked = new URL(dataTables[i].block);

        let urlRedirect = new URL(dataTables[i].redirect);

        // Stop always recdirect forever
        if (urlBlocked.host == urlRedirect.host) {
          console.log('urlBlocked.host == urlRedirect.host => stop');
          break;
        }

        // Match redirect
        if (urlBlocked.host == hostCurrentUrl || 'www.' + urlBlocked.host == hostCurrentUrl) {
          console.log('currentURL match => update');
          chrome.tabs.update(tab.id, { url: dataTables[i].redirect });
        } else {
          console.log('urlBlocked.host: ' + urlBlocked.host + ' is not equal hostCurrentUrl' + hostCurrentUrl);
        }
      } else {
        console.log('Blocked URL not valid ' + dataTables[i]);
      }
    }
  }
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
