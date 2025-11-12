# Unit Converter PWA

A Progressive Web App for converting length and temperature units. Works offline and can be installed on your device without app stores.

## Features

- 📱 **Mobile-First Design**: Optimized for mobile devices with responsive layout
- 🔄 **Dual Converters**: Convert both length and temperature units
- 📏 **Length Units**: Meters, Kilometers, Centimeters, Millimeters, Feet, Inches, Yards, Miles
- 🌡️ **Temperature Units**: Celsius, Fahrenheit, Kelvin
- 📲 **PWA Ready**: Installable on iOS and Android devices
- 🌐 **Offline Support**: Works without internet connection
- ⚡ **Fast & Lightweight**: Minimal loading time
- ♿ **Accessible**: Keyboard navigation and screen reader support

## Installation

### Option 1: Direct Installation
1. Open the app in your browser
2. Look for the "Install" or "Add to Home Screen" prompt
3. Follow the installation steps

### Option 2: Manual Installation
#### iOS Safari:
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm

#### Android Chrome:
1. Open the app in Chrome
2. Tap the menu button (three dots)
3. Tap "Add to Home Screen"
4. Tap "Add" to confirm

#### Desktop Chrome/Edge:
1. Open the app in your browser
2. Click the install icon in the address bar
3. Click "Install" to confirm

## Usage

### Length Conversion
1. Select "Length" tab
2. Enter the value you want to convert
3. Select the unit you're converting FROM
4. Select the unit you're converting TO
5. The result updates automatically

### Temperature Conversion
1. Select "Temperature" tab
2. Enter the temperature value
3. Select the temperature unit you're converting FROM
4. Select the temperature unit you're converting TO
5. The result updates automatically

### Keyboard Shortcuts
- `Ctrl/Cmd + L`: Switch to Length converter
- `Ctrl/Cmd + T`: Switch to Temperature converter
- `Escape`: Clear all inputs

## Technical Details

### Built With
- HTML5
- CSS3 with mobile-first responsive design
- Vanilla JavaScript (ES6+)
- Service Worker for offline functionality
- Web App Manifest for installability

### Browser Support
- Chrome/Edge (Recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Features
- Service Worker caching for offline use
- Responsive images and icons
- Minimal JavaScript bundle
- Optimized CSS with mobile-first approach

## File Structure

```
unit-converter/
├── index.html          # Main HTML file
├── styles.css          # CSS styles with responsive design
├── script.js           # JavaScript functionality
├── manifest.json       # PWA configuration
├── sw.js              # Service Worker for offline support
├── icon.svg           # App icon source
└── README.md          # This file
```

## Development

To run locally:
1. Clone or download the files
2. Serve the files through a local web server (required for PWA features)
3. Open in your browser

### Local Server Options
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
http-server -p 8000

# PHP
php -S localhost:8000
```

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!