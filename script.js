// Unit Converter JavaScript
class UnitConverter {
    constructor() {
        this.currentType = 'length';
        this.lengthUnits = {
            m: 1,           // Meters (base unit)
            km: 0.001,      // Kilometers
            cm: 100,        // Centimeters
            mm: 1000,       // Millimeters
            ft: 3.28084,    // Feet
            in: 39.3701,    // Inches
            yd: 1.09361,    // Yards
            mi: 0.000621371 // Miles
        };
        
        this.temperatureUnits = {
            c: {
                toBase: (val) => val,           // Celsius to Celsius
                fromBase: (val) => val
            },
            f: {
                toBase: (val) => (val - 32) * 5/9,    // Fahrenheit to Celsius
                fromBase: (val) => (val * 9/5) + 32   // Celsius to Fahrenheit
            },
            k: {
                toBase: (val) => val - 273.15,        // Kelvin to Celsius
                fromBase: (val) => val + 273.15        // Celsius to Kelvin
            }
        };
        
        this.initializeElements();
        this.bindEvents();
        this.setupServiceWorker();
    }
    
    initializeElements() {
        // Type selector buttons
        this.typeButtons = document.querySelectorAll('.selector-btn');
        
        // Converter sections
        this.lengthConverter = document.getElementById('length-converter');
        this.temperatureConverter = document.getElementById('temperature-converter');
        
        // Length converter elements
        this.lengthInput = document.getElementById('length-input');
        this.lengthFrom = document.getElementById('length-from');
        this.lengthTo = document.getElementById('length-to');
        this.lengthSwap = document.getElementById('length-swap');
        this.lengthResult = document.getElementById('length-result');
        
        // Temperature converter elements
        this.temperatureInput = document.getElementById('temperature-input');
        this.temperatureFrom = document.getElementById('temperature-from');
        this.temperatureTo = document.getElementById('temperature-to');
        this.temperatureSwap = document.getElementById('temperature-swap');
        this.temperatureResult = document.getElementById('temperature-result');
        
        // Clear button
        this.clearBtn = document.getElementById('clear-btn');
    }
    
    bindEvents() {
        // Type selector events
        this.typeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchConverter(e.target.dataset.type));
        });
        
        // Length converter events
        this.lengthInput.addEventListener('input', () => this.convertLength());
        this.lengthFrom.addEventListener('change', () => this.convertLength());
        this.lengthTo.addEventListener('change', () => this.convertLength());
        this.lengthSwap.addEventListener('click', () => this.swapLengthUnits());
        
        // Temperature converter events
        this.temperatureInput.addEventListener('input', () => this.convertTemperature());
        this.temperatureFrom.addEventListener('change', () => this.convertTemperature());
        this.temperatureTo.addEventListener('change', () => this.convertTemperature());
        this.temperatureSwap.addEventListener('click', () => this.swapTemperatureUnits());
        
        // Clear button event
        this.clearBtn.addEventListener('click', () => this.clearAll());
        
        // Keyboard support for better accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearAll();
            }
        });
    }
    
    switchConverter(type) {
        this.currentType = type;
        
        // Update button states
        this.typeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        
        // Show/hide converter sections
        this.lengthConverter.classList.toggle('hidden', type !== 'length');
        this.temperatureConverter.classList.toggle('hidden', type !== 'temperature');
        
        // Update document title
        const title = type === 'length' ? 'Length Converter' : 'Temperature Converter';
        document.title = `${title} - Unit Converter`;
    }
    
    convertLength() {
        const inputValue = parseFloat(this.lengthInput.value);
        const fromUnit = this.lengthFrom.value;
        const toUnit = this.lengthTo.value;
        
        if (isNaN(inputValue)) {
            this.lengthResult.textContent = '0';
            return;
        }
        
        // Convert to meters first, then to target unit
        const meters = inputValue / this.lengthUnits[fromUnit];
        const result = meters * this.lengthUnits[toUnit];
        
        this.lengthResult.textContent = this.formatNumber(result);
    }
    
    convertTemperature() {
        const inputValue = parseFloat(this.temperatureInput.value);
        const fromUnit = this.temperatureFrom.value;
        const toUnit = this.temperatureTo.value;
        
        if (isNaN(inputValue)) {
            this.temperatureResult.textContent = '0';
            return;
        }
        
        // Convert to Celsius first, then to target unit
        const celsius = this.temperatureUnits[fromUnit].toBase(inputValue);
        const result = this.temperatureUnits[toUnit].fromBase(celsius);
        
        this.temperatureResult.textContent = this.formatNumber(result);
    }
    
    swapLengthUnits() {
        const fromValue = this.lengthFrom.value;
        const toValue = this.lengthTo.value;
        
        this.lengthFrom.value = toValue;
        this.lengthTo.value = fromValue;
        
        this.convertLength();
    }
    
    swapTemperatureUnits() {
        const fromValue = this.temperatureFrom.value;
        const toValue = this.temperatureTo.value;
        
        this.temperatureFrom.value = toValue;
        this.temperatureTo.value = fromValue;
        
        this.convertTemperature();
    }
    
    formatNumber(num) {
        if (Math.abs(num) < 0.01 || Math.abs(num) > 1000000) {
            return num.toExponential(4);
        }
        
        // Round to reasonable decimal places
        const rounded = Math.round(num * 100000) / 100000;
        
        // Remove trailing zeros
        return parseFloat(rounded.toString()).toString();
    }
    
    clearAll() {
        this.lengthInput.value = '';
        this.temperatureInput.value = '';
        this.lengthResult.textContent = '0';
        this.temperatureResult.textContent = '0';
        
        // Reset to default units
        this.lengthFrom.value = 'm';
        this.lengthTo.value = 'km';
        this.temperatureFrom.value = 'c';
        this.temperatureTo.value = 'f';
        
        // Focus on current input
        if (this.currentType === 'length') {
            this.lengthInput.focus();
        } else {
            this.temperatureInput.focus();
        }
    }
    
    // Service Worker Registration for PWA functionality
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then((registration) => {
                    console.log('ServiceWorker registration successful:', registration.scope);
                })
                .catch((error) => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }
    
    // Utility method to handle offline/online status
    updateOnlineStatus() {
        const isOnline = navigator.onLine;
        document.body.classList.toggle('offline', !isOnline);
        
        if (!isOnline) {
            // Show offline indicator (could be enhanced)
            console.log('App is offline - using cached data');
        }
    }
}

// Additional utility functions
class PWAUtils {
    static init() {
        // Handle app installation
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.deferredPrompt = e;
            
            // Show install button or banner (optional)
            this.showInstallPromotion();
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            document.body.classList.remove('offline');
        });
        
        window.addEventListener('offline', () => {
            document.body.classList.add('offline');
        });
    }
    
    static showInstallPromotion() {
        // You can add a custom install button here
        console.log('App is installable - show install promotion');
    }
    
    static async installApp() {
        const promptEvent = window.deferredPrompt;
        
        if (!promptEvent) {
            return;
        }
        
        promptEvent.prompt();
        
        const { outcome } = await promptEvent.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        window.deferredPrompt = null;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UnitConverter();
    PWAUtils.init();
    
    // Add some helpful keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + L for length converter
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            document.querySelector('[data-type="length"]').click();
        }
        
        // Ctrl/Cmd + T for temperature converter
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            document.querySelector('[data-type="temperature"]').click();
        }
    });
});

// Handle visibility change for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // App is in background - could pause any ongoing processes
        console.log('App moved to background');
    } else {
        // App is visible again
        console.log('App is visible');
    }
});