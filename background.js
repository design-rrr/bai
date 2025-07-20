// Background script for Bitcoin Address Inspector (Firefox compatible)

// Cross-browser compatibility
const browser = chrome || browser;

browser.runtime.onInstalled.addListener(() => {
  // Initialize default settings
  browser.storage.sync.set({
    enableHover: true,
    enableContextMenu: true,
    hoverDelay: 500,
    showBalance: true,
    showUtxos: true,
    showTotalReceived: true
  });

  // Create context menu
  browser.contextMenus.create({
    id: "bitcoin-inspector",
    title: "Check Bitcoin Address Info",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "bitcoin-inspector") {
    const selectedText = info.selectionText.trim();
    if (isBitcoinAddress(selectedText)) {
      browser.tabs.sendMessage(tab.id, {
        action: "showAddressInfo",
        address: selectedText,
        x: 0,
        y: 0,
        fromContextMenu: true
      }).catch(error => {
        // Handle cases where content script isn't loaded
        console.warn("Failed to send message to content script:", error);
      });
    }
  }
});

// Bitcoin address validation
function isBitcoinAddress(address) {
  // Legacy addresses (1...)
  const legacyRegex = /^[1][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  // P2SH addresses (3...)
  const p2shRegex = /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  // Bech32 addresses (bc1...)
  const bech32Regex = /^bc1[a-z0-9]{39,59}$/;
  
  return legacyRegex.test(address) || p2shRegex.test(address) || bech32Regex.test(address);
}

// Message handling for settings updates
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateContextMenu") {
    browser.storage.sync.get(['enableContextMenu'], (result) => {
      if (result.enableContextMenu) {
        browser.contextMenus.update("bitcoin-inspector", { visible: true });
      } else {
        browser.contextMenus.update("bitcoin-inspector", { visible: false });
      }
    });
    return true; // Keep message channel open for async response
  }
});