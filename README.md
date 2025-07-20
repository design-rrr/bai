![](https://github.com/design-rrr/bai/blob/main/icons/icon48.png?raw=true)
# Bitcoin Address Inspector
A browser extension that automatically detects Bitcoin addresses on webpages and displays their balance, UTXO count, total received amount, and transaction count using the mempool.space API.

|Options|In action|
|---|---|
|![](https://github.com/design-rrr/bai/blob/main/options.png?raw=true)|![Screenshot](https://github.com/design-rrr/bai/blob/main/screenshot.png?raw=true)|

## Features

- **Automatic Detection**: Recognizes all Bitcoin address formats:
  - Legacy addresses (starting with `1`)
  - P2SH addresses (starting with `3`) 
  - Bech32 addresses (starting with `bc1`)

- **Multiple Interaction Methods**:
  - Hover over highlighted addresses for instant popup
  - Right-click context menu on selected addresses
  - Configurable hover delay

- **Comprehensive Address Information**:
  - Current balance
  - Number of UTXOs (Unspent Transaction Outputs)
  - Total amount ever received
  - Total transaction count

- **Customizable Settings**:
  - Enable/disable hover popups
  - Enable/disable context menu
  - Adjust hover delay
  - Choose which information to display

## Chrome Installation

### Method 1: Developer Mode (Recommended)

1. Download or clone all the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension icon should appear in your toolbar

### Method 2: Create Extension Package

1. Zip all the extension files together
2. Follow Method 1 but use "Load unpacked" on the zip file

## Files Structure

```
bitcoin-address-inspector/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for context menu
├── content.js            # Main detection and popup logic
├── popup.css             # Styling for address popups
├── settings.html         # Settings page HTML
├── settings.css          # Settings page styling
├── settings.js           # Settings page functionality
└── icons/               # Extension icons (create this folder)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Usage

### Hover Detection
1. Visit any webpage with Bitcoin addresses
2. Bitcoin addresses will be automatically highlighted with a yellow background
3. Hover over any highlighted address to see a popup with address information
4. The popup shows balance, UTXOs, total received, and transaction count

### Context Menu
1. Select any Bitcoin address text on a webpage
2. Right-click to open the context menu
3. Click "Check Bitcoin Address Info" to display the information popup

### Settings Configuration
1. Click the extension icon in your toolbar
2. Adjust settings as needed:
   - Toggle hover popups on/off
   - Toggle context menu on/off
   - Change hover delay (100ms to 2000ms)
   - Choose which information to display
3. Click "Save Settings" to apply changes
4. Use "Reset to Defaults" to restore original settings

## API Usage

This extension uses the free mempool.space API:
- No API key required
- Rate limits apply (be respectful)
- API endpoint: `https://mempool.space/api/address/{address}`

## Privacy & Security

- No data is collected or stored remotely
- Address queries are sent directly to mempool.space
- Settings are stored locally in browser's sync storage
- No tracking or analytics

## Supported Address Formats

- **Legacy (P2PKH)**: `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`
- **P2SH**: `3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy`
- **Bech32 (Native SegWit)**: `bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4`

## Troubleshooting

### Extension not detecting addresses
- Refresh the page after enabling the extension
- Check that hover detection is enabled in settings
- Ensure addresses are in plain text (not images or complex formatting)

### Popup not showing
- Check your internet connection
- Verify that the mempool.space API is accessible
- Try increasing the hover delay in settings

### Context menu not appearing
- Ensure context menu is enabled in settings
- Make sure you're selecting the address text before right-clicking
- Try refreshing the page

## Contributing

To modify or enhance the extension:

1. Make changes to the appropriate files
2. Test in developer mode
3. Update version number in `manifest.json`
4. Reload the extension

## License

This project is open source. Feel free to modify and distribute according to your needs.

## Changelog

### Version 1.0
- Initial release
- Bitcoin address detection for all formats
- Hover and context menu interactions  
- Configurable settings page
- Integration with mempool.space API
