const DEFAULT_MAX_TABS = 10;

async function getMaxTabs() {
  const result = await chrome.storage.sync.get('maxTabs');
  return result.maxTabs || DEFAULT_MAX_TABS;
}

async function getNonGroupedTabCount() {
  const tabs = await chrome.tabs.query({});
  return tabs.filter(tab => tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE).length;
}

async function enforceTabLimit(newTabId) {
  const maxTabs = await getMaxTabs();
  const nonGroupedCount = await getNonGroupedTabCount();

  if (nonGroupedCount > maxTabs) {
    await chrome.tabs.remove(newTabId);
  }
}

chrome.tabs.onCreated.addListener(async (tab) => {
  if (tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
    await enforceTabLimit(tab.id);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
    await enforceTabLimit(tabId);
  }
});
