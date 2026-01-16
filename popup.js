const maxTabsInput = document.getElementById('maxTabs');
const saveBtn = document.getElementById('save');
const status = document.getElementById('status');
const currentCount = document.getElementById('currentCount');
const maxDisplay = document.getElementById('maxDisplay');

async function loadSettings() {
  const result = await chrome.storage.sync.get('maxTabs');
  const maxTabs = result.maxTabs || 10;
  maxTabsInput.value = maxTabs;
  maxDisplay.textContent = maxTabs;

  const tabs = await chrome.tabs.query({});
  const nonGrouped = tabs.filter(tab => tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE).length;
  currentCount.textContent = nonGrouped;
}

saveBtn.addEventListener('click', async () => {
  const maxTabs = parseInt(maxTabsInput.value, 10);
  if (maxTabs < 1) {
    status.textContent = 'Min value is 1';
    status.style.color = '#ea4335';
    return;
  }

  await chrome.storage.sync.set({ maxTabs });
  maxDisplay.textContent = maxTabs;
  status.textContent = 'Saved!';
  status.style.color = '#34a853';
  setTimeout(() => status.textContent = '', 2000);
});

loadSettings();
