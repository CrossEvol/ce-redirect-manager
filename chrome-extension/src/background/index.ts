import { exampleThemeStorage } from '@extension/storage';
import localforage from 'localforage';
import 'webextension-polyfill';
import { RedirectItem } from './type';
import { FORAGE_KEY } from './constant';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

chrome.tabs.onUpdated.addListener(async (tabId, change, tab) => {
  console.log('chrome.tabs.onUpdated: change', change);

  const items = await localforage.getItem<RedirectItem[]>(FORAGE_KEY);

  if (items === null || items.length === 0) {
    return;
  }

  if (tab.active && change.url) {
    chrome.storage.sync.get(({ dataTables }) => {
      handlePageRedirectPage(tab, change.url!, items);
    });
  }
});

function handlePageRedirectPage(tab: chrome.tabs.Tab, url: string, dataTables: RedirectItem[]) {
  if (!isValidHttpUrl(url)) {
    console.log('currentURL not valid: ' + url);
    return;
  }
  let currentURL = new URL(url);
  let hostCurrentUrl = currentURL.host;
  console.log('currentURL: ' + currentURL + '; hostCurrentURL: ' + hostCurrentUrl);

  if (dataTables && dataTables.length > 0) {
    for (let i = 0; i <= dataTables.length; i++) {
      if (dataTables[i] && isValidHttpUrl(dataTables[i].pageBlocked)) {
        if (dataTables[i].permitted) {
          console.log('currentURL match => but permitted');
          return;
        }
        let urlBlocked = new URL(dataTables[i].pageBlocked);

        let urlRedirect = new URL(dataTables[i].redirectTo);

        // Stop always recdirect forever
        if (urlBlocked.host == urlRedirect.host) {
          console.log('urlBlocked.host == urlRedirect.host => stop');
          break;
        }

        // Match redirect
        if (urlBlocked.host == hostCurrentUrl || 'www.' + urlBlocked.host == hostCurrentUrl) {
          console.log('currentURL match => update');
          chrome.tabs.update(tab.id!, { url: dataTables[i].redirectTo });
        } else {
          console.log('urlBlocked.host: ' + urlBlocked.host + ' is not equal hostCurrentUrl' + hostCurrentUrl);
        }
      } else {
        console.log('Blocked URL not valid ' + dataTables[i]);
      }
    }
  }
}

function isValidHttpUrl(unresolvedURL: string) {
  let url;

  try {
    url = new URL(unresolvedURL);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

console.log('background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
