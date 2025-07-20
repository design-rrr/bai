![](https://github.com/design-rrr/bai/blob/firefox/icons/icon48.png?raw=true)
# Bitcoin Address Inspector
A browser extension that automatically detects Bitcoin addresses on webpages and displays their balance, UTXO count, total received amount, and transaction count using the mempool.space API.

|Options|In action|
|---|---|
|![](https://github.com/design-rrr/bai/blob/firefox/options.png?raw=true)|![Screenshot](https://github.com/design-rrr/bai/blob/firefox/screenshot.png?raw=true)|
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

## Installation

### Method 1: Temporary Installation (Development/Testing)

1. Download or clone all the add-on files
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the folder containing the add-on files and select `manifest.json`
6. The add-on will be loaded temporarily (removed when Firefox restarts)

### Method 2: Install Signed XPI (Recommended for Regular Use)

1. Download the signed `.xpi` file from the releases section
2. Open Firefox and go to `about:addons`
3. Click the gear icon (⚙️) and select "Install Add-on From File"
4. Select the downloaded `.xpi` file
5. Click "Add" when prompted to confirm installation

### Method 3: Firefox Developer Edition (Unsigned Add-ons)

Firefox Developer Edition allows installation of unsigned add-ons:

1. Download Firefox Developer Edition
2. In `about:config`, set `xpinstall.signatures.required` to `false`
3. Package the add-on files into a `.zip` file and rename to `.xpi`
4. Install via `about:addons` → Install Add-on From File

## Files Structure

```
bitcoin-address-inspector/
├── manifest.json          # Add-on configuration (Firefox-compatible)
├── background.js          # Background script for context menu
├── content.js            # Main detection and popup logic
├── popup.css             # Styling for address popups
├── settings.html         # Settings page HTML
├── settings.css          # Settings page styling
├── settings.js           # Settings page functionality
└── icons/               # Add-on icons
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
1. Click the add-on icon in your toolbar (or access from Add-ons Manager)
2. Adjust settings as needed:
   - Toggle hover popups on/off
   - Toggle context menu on/off
   - Change hover delay (100ms to 2000ms)
   - Choose which information to display
3. Click "Save Settings" to apply changes
4. Use "Reset to Defaults" to restore original settings

## Firefox-Specific Features

- **Background Script**: Uses persistent background scripts optimized for Firefox
- **Storage API**: Leverages Firefox's `browser.storage.sync` for cross-device settings sync
- **Context Menus**: Native Firefox context menu integration
- **Permissions**: Minimal permissions required following Firefox security guidelines

## API Usage

This add-on uses the free mempool.space API:
- No API key required
- Rate limits apply (be respectful)
- API endpoint: `https://mempool.space/api/address/{address}`

## Privacy & Security

- No data is collected or stored remotely
- Address queries are sent directly to mempool.space
- Settings are stored locally using Firefox's sync storage
- No tracking or analytics
- Add-on follows Firefox security guidelines and signing requirements

## Supported Address Formats

- **Legacy (P2PKH)**: `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`
- **P2SH**: `3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy`
- **Bech32 (Native SegWit)**: `bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4`

## Troubleshooting

### Add-on not detecting addresses
- Refresh the page after enabling the add-on
- Check that hover detection is enabled in settings
- Ensure addresses are in plain text (not images or complex formatting)

### Popup not showing
- Check your internet connection
- Verify that the mempool.space API is accessible
- Try increasing the hover delay in settings
- Check Firefox's Developer Console (F12) for any error messages

### Context menu not appearing
- Ensure context menu is enabled in settings
- Make sure you're selecting the address text before right-clicking
- Try refreshing the page
- Verify the add-on has proper permissions

### Installation Issues
- For unsigned add-ons, use Firefox Developer Edition or Nightly builds
- Standard Firefox requires signed add-ons unless signature checking is disabled
- Ensure the manifest.json is properly formatted for Firefox

## Development Notes

### Firefox vs Chrome Differences
- Uses `background.scripts` instead of `service_worker` in manifest
- Supports both `chrome.*` and `browser.*` API namespaces
- Firefox supports promises for asynchronous events in the chrome.* namespace
- Background scripts can be persistent in Firefox

### Building for Firefox
1. Ensure manifest.json uses Firefox-compatible format
2. Test with `web-ext` tool: `web-ext run`
3. Build XPI: `web-ext build`
4. Sign for distribution: Submit to AMO or use `web-ext sign`

## Distribution

### Firefox Add-ons (AMO)
- Listed add-ons: Available through official Firefox Add-ons store
- Unlisted add-ons: Signed by Mozilla but distributed by developer
- Standard distribution is through signed XPI files from AMO or developer setup

### Self-Distribution
- Sign your add-on through Mozilla's signing service
- Distribute the signed XPI file directly to users
- Users can install via "Install Add-on From File" option

## Contributing

To modify or enhance the add-on:

1. Make changes to the appropriate files
2. Test using `about:debugging` temporary installation
3. Update version number in `manifest.json`
4. Rebuild and test thoroughly
5. Follow Firefox add-on review guidelines for submission

## License

This project is open source. Feel free to modify and distribute according to your needs.

## Changelog

### Firefox Branch v1.0
- Firefox-compatible manifest format
- Background script optimization for Firefox
- Native Firefox context menu integration
- Firefox storage API implementation
- AMO preparation and signing compatibility

### Version 1.0 (Base)
- Initial release
- Bitcoin address detection for all formats
- Hover and context menu interactions  
- Configurable settings page
- Integration with mempool.space API

## Resources

- [Firefox Extension Workshop](https://extensionworkshop.com/)
- [MDN WebExtensions Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [web-ext Tool](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/)
- [Submit to AMO](https://addons.mozilla.org/developers/)
