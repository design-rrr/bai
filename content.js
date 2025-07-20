// Content script for Bitcoin Address Inspector (Firefox compatible)

// Cross-browser compatibility
const browser = chrome || window.browser;

let hoverTimeout;
let popup = null;
let settings = {};

// Load settings on initialization
loadSettings();

function loadSettings() {
  browser.storage.sync.get([
    'enableHover',
    'enableContextMenu', 
    'hoverDelay',
    'showBalance',
    'showUtxos',
    'showTotalReceived'
  ], (result) => {
    settings = {
      enableHover: result.enableHover !== false,
      enableContextMenu: result.enableContextMenu !== false,
      hoverDelay: result.hoverDelay || 500,
      showBalance: result.showBalance !== false,
      showUtxos: result.showUtxos !== false,
      showTotalReceived: result.showTotalReceived !== false
    };
    
    if (settings.enableHover) {
      highlightBitcoinAddresses();
    }
  });
}

// Listen for settings changes
browser.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    loadSettings();
  }
});

// Bitcoin address regex patterns
const bitcoinAddressRegex = [
  /\b[1][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g, // Legacy
  /\b[3][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g, // P2SH
  /\bbc1[a-z0-9]{39,59}\b/g // Bech32
];

function highlightBitcoinAddresses() {
  if (!settings.enableHover) return;
  
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }

  textNodes.forEach(textNode => {
    let text = textNode.textContent;
    let hasAddress = false;

    bitcoinAddressRegex.forEach(regex => {
      if (regex.test(text)) {
        hasAddress = true;
      }
      regex.lastIndex = 0; // Reset regex state
    });

    if (hasAddress) {
      const parent = textNode.parentNode;
      if (parent && parent.nodeType === Node.ELEMENT_NODE) {
        const span = document.createElement('span');
        span.innerHTML = highlightText(text);
        parent.replaceChild(span, textNode);
      }
    }
  });
}

function highlightText(text) {
  let highlightedText = text;
  
  bitcoinAddressRegex.forEach(regex => {
    highlightedText = highlightedText.replace(regex, (match) => {
      return `<span class="bitcoin-address" data-address="${match}">${match}</span>`;
    });
    regex.lastIndex = 0;
  });
  
  return highlightedText;
}

// Event delegation for hover events
document.addEventListener('mouseover', (e) => {
  if (!settings.enableHover) return;
  
  if (e.target.classList.contains('bitcoin-address')) {
    const address = e.target.dataset.address;
    
    hoverTimeout = setTimeout(() => {
      showAddressPopup(address, e.pageX, e.pageY);
    }, settings.hoverDelay);
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.classList.contains('bitcoin-address')) {
    clearTimeout(hoverTimeout);
    hidePopup();
  }
});

// Message listener for context menu actions
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showAddressInfo") {
    if (request.fromContextMenu) {
      const selection = document.getSelection();
      if (selection.rangeCount > 0) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        showAddressPopup(request.address, rect.left + window.scrollX, rect.bottom + window.scrollY);
      } else {
        // Fallback position if selection is not available
        showAddressPopup(request.address, 100, 100);
      }
    }
    sendResponse({success: true});
    return true; // Keep message channel open
  }
});

async function showAddressPopup(address, x, y) {
  hidePopup(); // Hide any existing popup
  
  // Create popup element
  popup = document.createElement('div');
  popup.className = 'bitcoin-popup';
  popup.innerHTML = `
    <div class="bitcoin-popup-header">
      <strong>Bitcoin Address Info</strong>
      <button class="bitcoin-popup-close">&times;</button>
    </div>
    <div class="bitcoin-popup-content">
      <div class="address-display">${address}</div>
      <div class="loading">Loading...</div>
    </div>
  `;
  
  // Position popup with boundary checking
  const maxX = Math.max(0, window.innerWidth - 320);
  const maxY = Math.max(0, window.innerHeight - 200);
  popup.style.left = Math.min(x, maxX) + 'px';
  popup.style.top = Math.min(y + 10, maxY) + 'px';
  
  document.body.appendChild(popup);
  
  // Add close button functionality
  popup.querySelector('.bitcoin-popup-close').addEventListener('click', hidePopup);
  
  // Fetch address data
  try {
    const data = await fetchAddressData(address);
    displayAddressData(data);
  } catch (error) {
    console.error('Error fetching address data:', error);
    displayError('Failed to fetch address data');
  }
}

function hidePopup() {
  if (popup && popup.parentNode) {
    popup.parentNode.removeChild(popup);
    popup = null;
  }
}

async function fetchAddressData(address) {
  try {
    const response = await fetch(`https://mempool.space/api/address/${address}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Fetch UTXO data if enabled
    let utxos = [];
    if (settings.showUtxos) {
      try {
        const utxoResponse = await fetch(`https://mempool.space/api/address/${address}/utxo`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        if (utxoResponse.ok) {
          utxos = await utxoResponse.json();
        }
      } catch (error) {
        console.warn('Failed to fetch UTXO data:', error);
      }
    }
    
    return { ...data, utxos };
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
}

function displayAddressData(data) {
  if (!popup) return;
  
  const contentDiv = popup.querySelector('.bitcoin-popup-content');
  const addressDiv = contentDiv.querySelector('.address-display');
  
  let html = addressDiv.outerHTML;
  
  if (settings.showBalance) {
    const balance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
    html += `<div class="info-row">
      <span class="label">Balance:</span>
      <span class="value">${formatSatoshis(balance)} BTC</span>
    </div>`;
  }
  
  if (settings.showTotalReceived) {
    html += `<div class="info-row">
      <span class="label">Total Received:</span>
      <span class="value">${formatSatoshis(data.chain_stats.funded_txo_sum)} BTC</span>
    </div>`;
  }
  
  if (settings.showUtxos && data.utxos) {
    html += `<div class="info-row">
      <span class="label">UTXOs:</span>
      <span class="value">${data.utxos.length}</span>
    </div>`;
  }
  
  html += `<div class="info-row">
    <span class="label">Transactions:</span>
    <span class="value">${data.chain_stats.tx_count || 0}</span>
  </div>`;
  
  contentDiv.innerHTML = html;
}

function displayError(message) {
  if (!popup) return;
  
  const contentDiv = popup.querySelector('.bitcoin-popup-content');
  const addressText = popup.querySelector('.address-display') ? 
    popup.querySelector('.address-display').textContent : 'Unknown address';
  
  contentDiv.innerHTML = `
    <div class="address-display">${addressText}</div>
    <div class="error">${message}</div>
  `;
}

function formatSatoshis(satoshis) {
  if (typeof satoshis !== 'number' || isNaN(satoshis)) {
    return '0.00000000';
  }
  return (satoshis / 100000000).toFixed(8);
}

// Close popup when clicking outside
document.addEventListener('click', (e) => {
  if (popup && !popup.contains(e.target) && !e.target.classList.contains('bitcoin-address')) {
    hidePopup();
  }
});

// Re-scan for addresses when DOM changes
const observer = new MutationObserver((mutations) => {
  if (settings.enableHover) {
    let shouldRescan = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldRescan = true;
      }
    });
    
    if (shouldRescan) {
      setTimeout(highlightBitcoinAddresses, 100);
    }
  }
});

// Start observing after a short delay to ensure DOM is ready
setTimeout(() => {
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}, 1000);