// Settings page JavaScript (Firefox compatible)

// Cross-browser compatibility
const browser = chrome || window.browser;

document.addEventListener('DOMContentLoaded', function() {
  const settings = {
    enableHover: document.getElementById('enableHover'),
    enableContextMenu: document.getElementById('enableContextMenu'),
    hoverDelay: document.getElementById('hoverDelay'),
    showBalance: document.getElementById('showBalance'),
    showUtxos: document.getElementById('showUtxos'),
    showTotalReceived: document.getElementById('showTotalReceived')
  };
  
  const hoverDelayValue = document.getElementById('hoverDelayValue');
  const saveButton = document.getElementById('saveSettings');
  const resetButton = document.getElementById('resetSettings');
  const saveStatus = document.getElementById('saveStatus');
  
  // Load current settings
  loadSettings();
  
  // Update hover delay display
  settings.hoverDelay.addEventListener('input', function() {
    hoverDelayValue.textContent = this.value + 'ms';
  });
  
  // Save settings
  saveButton.addEventListener('click', saveSettings);
  
  // Reset settings
  resetButton.addEventListener('click', resetSettings);
  
  function loadSettings() {
    browser.storage.sync.get([
      'enableHover',
      'enableContextMenu',
      'hoverDelay',
      'showBalance',
      'showUtxos',
      'showTotalReceived'
    ], function(result) {
      settings.enableHover.checked = result.enableHover !== false;
      settings.enableContextMenu.checked = result.enableContextMenu !== false;
      settings.hoverDelay.value = result.hoverDelay || 500;
      settings.showBalance.checked = result.showBalance !== false;
      settings.showUtxos.checked = result.showUtxos !== false;
      settings.showTotalReceived.checked = result.showTotalReceived !== false;
      
      hoverDelayValue.textContent = settings.hoverDelay.value + 'ms';
    });
  }
  
  function saveSettings() {
    const settingsData = {
      enableHover: settings.enableHover.checked,
      enableContextMenu: settings.enableContextMenu.checked,
      hoverDelay: parseInt(settings.hoverDelay.value),
      showBalance: settings.showBalance.checked,
      showUtxos: settings.showUtxos.checked,
      showTotalReceived: settings.showTotalReceived.checked
    };
    
    browser.storage.sync.set(settingsData, function() {
      // Show success message
      saveStatus.textContent = 'Settings saved!';
      saveStatus.className = 'save-status success';
      
      // Update context menu visibility
      browser.runtime.sendMessage({
        action: 'updateContextMenu'
      }).catch(error => {
        console.warn('Failed to update context menu:', error);
      });
      
      // Clear status after 3 seconds
      setTimeout(() => {
        saveStatus.textContent = '';
        saveStatus.className = 'save-status';
      }, 3000);
      
      // Refresh all tabs to apply changes (Firefox approach)
      if (browser.tabs && browser.tabs.query) {
        browser.tabs.query({}, function(tabs) {
          tabs.forEach(tab => {
            if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
              browser.tabs.reload(tab.id).catch(error => {
                // Some tabs may not be reloadable, ignore errors
                console.debug('Could not reload tab:', tab.url, error);
              });
            }
          });
        });
      }
    });
  }
  
  function resetSettings() {
    const defaultSettings = {
      enableHover: true,
      enableContextMenu: true,
      hoverDelay: 500,
      showBalance: true,
      showUtxos: true,
      showTotalReceived: true
    };
    
    browser.storage.sync.set(defaultSettings, function() {
      // Update UI to reflect reset settings
      loadSettings();
      
      // Show reset message
      saveStatus.textContent = 'Settings reset to defaults!';
      saveStatus.className = 'save-status success';
      
      // Update context menu visibility
      browser.runtime.sendMessage({
        action: 'updateContextMenu'
      }).catch(error => {
        console.warn('Failed to update context menu:', error);
      });
      
      // Clear status after 3 seconds
      setTimeout(() => {
        saveStatus.textContent = '';
        saveStatus.className = 'save-status';
      }, 3000);
      
      // Refresh all tabs to apply changes (Firefox approach)
      if (browser.tabs && browser.tabs.query) {
        browser.tabs.query({}, function(tabs) {
          tabs.forEach(tab => {
            if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
              browser.tabs.reload(tab.id).catch(error => {
                // Some tabs may not be reloadable, ignore errors
                console.debug('Could not reload tab:', tab.url, error);
              });
            }
          });
        });
      }
    });
  }
});