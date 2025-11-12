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

// APK Download Modal Class
class APKModal {
    constructor() {
        this.modal = document.getElementById('apk-modal');
        this.closeBtn = document.querySelector('.modal-close');
        this.downloadBtn = document.querySelector('.download-button');
        this.laterBtn = document.querySelector('.later-button');
        this.dismissBtn = document.querySelector('.dismiss-button');
        this.languageSelect = document.getElementById('language-select');
        this.progressBar = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
        this.progressSection = document.querySelector('.download-progress');
        
        this.currentLanguage = 'en';
        this.isDownloading = false;
        this.downloadProgress = 0;
        
        this.translations = {
            en: {
                title: 'Download Our App',
                subtitle: 'Get the best experience with our native app',
                version: 'Version',
                size: 'Size',
                download: 'Download APK',
                downloading: 'Downloading...',
                later: 'Remind me later',
                dismiss: "Don't show again",
                features: [
                    'Works offline without internet',
                    'Faster performance',
                    'No browser required',
                    'Regular updates'
                ]
            },
            es: {
                title: 'Descarga Nuestra App',
                subtitle: 'Obtén la mejor experiencia con nuestra app nativa',
                version: 'Versión',
                size: 'Tamaño',
                download: 'Descargar APK',
                downloading: 'Descargando...',
                later: 'Recordarme más tarde',
                dismiss: 'No mostrar de nuevo',
                features: [
                    'Funciona sin conexión a internet',
                    'Rendimiento más rápido',
                    'No requiere navegador',
                    'Actualizaciones regulares'
                ]
            },
            fr: {
                title: 'Téléchargez Notre App',
                subtitle: 'Obtenez la meilleure expérience avec notre application native',
                version: 'Version',
                size: 'Taille',
                download: 'Télécharger APK',
                downloading: 'Téléchargement...',
                later: 'Me le rappeler plus tard',
                dismiss: 'Ne plus afficher',
                features: [
                    'Fonctionne hors ligne sans internet',
                    'Performance plus rapide',
                    'Aucun navigateur requis',
                    'Mises à jour régulières'
                ]
            },
            de: {
                title: 'Laden Sie Unsere App Herunter',
                subtitle: 'Erhalten Sie das beste Erlebnis mit unserer nativen App',
                version: 'Version',
                size: 'Größe',
                download: 'APK Herunterladen',
                downloading: 'Wird heruntergeladen...',
                later: 'Später erinnern',
                dismiss: 'Nicht mehr anzeigen',
                features: [
                    'Funktioniert offline ohne Internet',
                    'Schnellere Leistung',
                    'Kein Browser erforderlich',
                    'Regelmäßige Updates'
                ]
            },
            it: {
                title: 'Scarica La Nostra App',
                subtitle: 'Ottieni la migliore esperienza con la nostra app nativa',
                version: 'Versione',
                size: 'Dimensione',
                download: 'Scarica APK',
                downloading: 'Download in corso...',
                later: 'Ricordamelo più tardi',
                dismiss: 'Non mostrare più',
                features: [
                    'Funziona offline senza internet',
                    'Prestazioni più veloci',
                    'Nessun browser richiesto',
                    'Aggiornamenti regolari'
                ]
            },
            pt: {
                title: 'Baixe Nosso App',
                subtitle: 'Obtenha a melhor experiência com nosso app nativo',
                version: 'Versão',
                size: 'Tamanho',
                download: 'Baixar APK',
                downloading: 'Baixando...',
                later: 'Lembrar mais tarde',
                dismiss: 'Não mostrar novamente',
                features: [
                    'Funciona offline sem internet',
                    'Desempenho mais rápido',
                    'Nenhum navegador necessário',
                    'Atualizações regulares'
                ]
            },
            ru: {
                title: 'Скачайте Наше Приложение',
                subtitle: 'Получите лучший опыт с нашим нативным приложением',
                version: 'Версия',
                size: 'Размер',
                download: 'Скачать APK',
                downloading: 'Загрузка...',
                later: 'Напомнить позже',
                dismiss: 'Больше не показывать',
                features: [
                    'Работает офлайн без интернета',
                    'Более быстрая производительность',
                    'Браузер не требуется',
                    'Регулярные обновления'
                ]
            },
            zh: {
                title: '下载我们的应用',
                subtitle: '使用我们的原生应用获得最佳体验',
                version: '版本',
                size: '大小',
                download: '下载 APK',
                downloading: '下载中...',
                later: '稍后提醒我',
                dismiss: '不再显示',
                features: [
                    '无需互联网即可离线工作',
                    '更快的性能',
                    '无需浏览器',
                    '定期更新'
                ]
            },
            ja: {
                title: '私たちのアプリをダウンロード',
                subtitle: 'ネイティブアプリで最高の体験を',
                version: 'バージョン',
                size: 'サイズ',
                download: 'APKをダウンロード',
                downloading: 'ダウンロード中...',
                later: '後で思い出させる',
                dismiss: '二度と表示しない',
                features: [
                    'インターネットなしでオフラインで動作',
                    'より速いパフォーマンス',
                    'ブラウザ不要',
                    '定期的なアップデート'
                ]
            },
            ar: {
                title: 'قم بتنزيل تطبيقنا',
                subtitle: 'احصل على أفضل تجربة مع تطبيقنا الأصلي',
                version: 'الإصدار',
                size: 'الحجم',
                download: 'تحميل APK',
                downloading: 'جاري التحميل...',
                later: 'ذكرني لاحقًا',
                dismiss: 'لا تظهر مرة أخرى',
                features: [
                    'يعمل بدون اتصال بالإنترنت',
                    'أداء أسرع',
                    'لا يتطلب متصفح',
                    'تحديثات منتظمة'
                ]
            },
            hi: {
                title: 'हमारा ऐप डाउनलोड करें',
                subtitle: 'हमारे नेटिव ऐप के साथ सर्वोत्तम अनुभव प्राप्त करें',
                version: 'संस्करण',
                size: 'आकार',
                download: 'APK डाउनलोड करें',
                downloading: 'डाउनलोड हो रहा है...',
                later: 'बाद में याद दिलाना',
                dismiss: 'फिर से न दिखाएं',
                features: [
                    'इंटरनेट के बिना ऑफ़लाइन काम करता है',
                    'तेज़ प्रदर्शन',
                    'ब्राउज़र की आवश्यकता नहीं',
                    'नियमित अपडेट'
                ]
            },
            ko: {
                title: '우리 앱 다운로드',
                subtitle: '네이티브 앱으로 최고의 경험을 얻으세요',
                version: '버전',
                size: '크기',
                download: 'APK 다운로드',
                downloading: '다운로드 중...',
                later: '나중에 알려주세요',
                dismiss: '다시 표시하지 않음',
                features: [
                    '인터넷 없이 오프라인에서 작동',
                    '더 빠른 성능',
                    '브라우저 불필요',
                    '정기 업데이트'
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkModalDisplay();
        this.setInitialLanguage();
    }
    
    bindEvents() {
        this.closeBtn.addEventListener('click', () => this.hideModal());
        this.laterBtn.addEventListener('click', () => this.remindLater());
        this.dismissBtn.addEventListener('click', () => this.dismissModal());
        this.downloadBtn.addEventListener('click', () => this.startDownload());
        this.languageSelect.addEventListener('change', (e) => this.changeLanguage(e.target.value));
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.hideModal();
            }
        });
    }
    
    checkModalDisplay() {
        const modalDismissed = localStorage.getItem('apkModalDismissed');
        const lastShown = localStorage.getItem('apkModalLastShown');
        const now = Date.now();
        
        // If dismissed, don't show again
        if (modalDismissed === 'true') {
            return;
        }
        
        // If shown recently (within 24 hours), don't show again
        if (lastShown && (now - parseInt(lastShown)) < 24 * 60 * 60 * 1000) {
            return;
        }
        
        // Show modal after a short delay
        setTimeout(() => {
            this.showModal();
        }, 2000);
    }
    
    setInitialLanguage() {
        // Get browser language or use stored preference
        const savedLanguage = localStorage.getItem('apkModalLanguage');
        const browserLanguage = navigator.language.split('-')[0];
        const supportedLanguages = Object.keys(this.translations);
        
        let language = 'en'; // Default
        
        if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
            language = savedLanguage;
        } else if (supportedLanguages.includes(browserLanguage)) {
            language = browserLanguage;
        }
        
        this.currentLanguage = language;
        this.languageSelect.value = language;
        this.updateLanguage();
    }
    
    showModal() {
        this.modal.classList.add('show');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Update last shown time
        localStorage.setItem('apkModalLastShown', Date.now().toString());
    }
    
    hideModal() {
        this.modal.classList.remove('show');
        this.modal.classList.add('hiding');
        
        setTimeout(() => {
            this.modal.classList.remove('hiding');
            this.modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }, 300);
    }
    
    remindLater() {
        // Set reminder for 24 hours later
        const nextReminder = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('apkModalLastShown', nextReminder.toString());
        this.hideModal();
    }
    
    dismissModal() {
        localStorage.setItem('apkModalDismissed', 'true');
        this.hideModal();
    }
    
    changeLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('apkModalLanguage', language);
            this.updateLanguage();
        }
    }
    
    updateLanguage() {
        const t = this.translations[this.currentLanguage];
        
        // Update text content
        document.getElementById('modal-title').textContent = t.title;
        document.getElementById('modal-subtitle').textContent = t.subtitle;
        document.getElementById('version-label').textContent = t.version;
        document.getElementById('size-label').textContent = t.size;
        
        if (this.isDownloading) {
            this.downloadBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                ${t.downloading}
            `;
        } else {
            this.downloadBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                ${t.download}
            `;
        }
        
        this.laterBtn.textContent = t.later;
        this.dismissBtn.textContent = t.dismiss;
        
        // Update features list
        const featuresList = document.getElementById('features-list');
        featuresList.innerHTML = t.features.map(feature => `
            <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="margin-right: 8px; flex-shrink: 0;">
                    <polyline points="20,6 9,17 4,12"/>
                </svg>
                ${feature}
            </div>
        `).join('');
        
        // Set RTL for Arabic
        if (this.currentLanguage === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.removeAttribute('dir');
        }
    }
    
    startDownload() {
        if (this.isDownloading) return;
        
        this.isDownloading = true;
        this.downloadBtn.disabled = true;
        this.progressSection.classList.remove('hidden');
        this.updateLanguage(); // Update button text
        
        // Simulate download progress
        this.downloadProgress = 0;
        this.simulateDownload();
    }
    
    simulateDownload() {
        const interval = setInterval(() => {
            this.downloadProgress += Math.random() * 15;
            
            if (this.downloadProgress >= 100) {
                this.downloadProgress = 100;
                this.updateProgress();
                this.completeDownload();
                clearInterval(interval);
            } else {
                this.updateProgress();
            }
        }, 500);
    }
    
    updateProgress() {
        this.progressBar.style.width = `${this.downloadProgress}%`;
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.innerHTML = `
                <span>${Math.round(this.downloadProgress)}%</span>
                <span>${this.formatFileSize(this.downloadProgress * 0.15)} / 15.2 MB</span>
            `;
        }
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    completeDownload() {
        // Simulate download completion
        setTimeout(() => {
            this.isDownloading = false;
            this.downloadBtn.disabled = false;
            this.progressSection.classList.add('hidden');
            this.downloadProgress = 0;
            
            // Show success message
            const originalText = this.downloadBtn.innerHTML;
            this.downloadBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                </svg>
                Download Complete!
            `;
            this.downloadBtn.style.background = '#059669';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                this.updateLanguage();
                this.downloadBtn.style.background = '';
            }, 3000);
            
            // Hide modal after successful download
            setTimeout(() => {
                this.hideModal();
            }, 2000);
            
        }, 1000);
    }
}

// Initialize APK Modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the APK modal
    new APKModal();
});