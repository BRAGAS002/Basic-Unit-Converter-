# APK Creation Guide for Unit Converter PWA

## Overview
This guide explains how to create a real Android APK file from your Unit Converter PWA for distribution through the download modal.

## Prerequisites
- Android Studio (Latest version)
- Node.js and npm
- Basic knowledge of Android development
- Your PWA files (HTML, CSS, JS)

## Method 1: Trusted Web Activity (TWA) - Recommended

### Step 1: Set up Android Studio Project
1. Open Android Studio
2. Create new project with "Empty Activity"
3. Set minimum SDK to API 21 (Android 5.0)
4. Configure package name: `com.unitconverter.app`

### Step 2: Add TWA Dependencies
In `build.gradle` (Module: app):
```gradle
dependencies {
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.4.0'
    implementation 'androidx.core:core-ktx:1.9.0'
}
```

### Step 3: Configure AndroidManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.unitconverter.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Unit Converter"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">
        
        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:label="Unit Converter"
            android:exported="true">
            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="https://basic-unit-converter-6sguo2618-franxxs-projects-c1a3f89f.vercel.app" />
            
            <meta-data
                android:name="android.support.customtabs.trusted.STATUS_BAR_COLOR"
                android:resource="@color/colorPrimary" />
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="https"
                    android:host="basic-unit-converter-6sguo2618-franxxs-projects-c1a3f89f.vercel.app" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### Step 4: Create Asset Links File
Create `assetlinks.json` and upload to your domain:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.unitconverter.app",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

### Step 5: Build and Sign APK
1. Generate signing key:
```bash
keytool -genkey -v -keystore unit-converter.keystore -alias unit-converter -keyalg RSA -keysize 2048 -validity 10000
```

2. Build signed APK in Android Studio:
   - Build → Generate Signed Bundle/APK
   - Select APK
   - Use your keystore
   - Choose release build

## Method 2: WebView Wrapper

### Step 1: Create Basic WebView App
```java
package com.unitconverter.app;

import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient());
        
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setDatabaseEnabled(true);
        
        webView.loadUrl("https://basic-unit-converter-6sguo2618-franxxs-projects-c1a3f89f.vercel.app");
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
```

### Step 2: Layout File (res/layout/activity_main.xml)
```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
        
</RelativeLayout>
```

## Method 3: PWA Builder (Automated)

### Step 1: Use PWA Builder
1. Visit https://www.pwabuilder.com
2. Enter your PWA URL
3. Select "Android" platform
4. Download generated package
5. Build in Android Studio

### Step 2: Customize Generated Code
- Update app name and icons
- Configure package name
- Add any native features needed

## APK Optimization

### Reduce APK Size
1. Enable ProGuard/R8 in build.gradle:
```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

2. Use Android App Bundle (AAB) for Play Store
3. Compress assets and resources
4. Remove unused libraries

### Security Best Practices
1. Enable app signing by Google Play
2. Use HTTPS for all web content
3. Implement certificate pinning
4. Add obfuscation for sensitive code
5. Regular security updates

## Testing the APK

### Before Release
1. Test on multiple Android versions (API 21+)
2. Verify offline functionality
3. Check performance on low-end devices
4. Test with different screen sizes
5. Validate all PWA features work

### Using Android Studio
1. Run on emulator
2. Test on physical device via USB
3. Use Android Vitals for performance monitoring
4. Check for memory leaks

## Deployment Process

### Step 1: Replace Placeholder File
1. Build your APK using one of the methods above
2. Rename it to `UnitConverter-v2.1.0.apk`
3. Replace the placeholder file in `/public/` directory
4. Update version number in both filename and API config

### Step 2: Update Version Information
In `api/download.js`:
```javascript
const APK_CONFIG = {
  filename: 'UnitConverter-v2.1.0.apk', // Update version here
  filepath: path.join(process.cwd(), 'public', 'UnitConverter-v2.1.0.apk'),
  mimeType: 'application/vnd.android.package-archive',
  fileSize: [ACTUAL_FILE_SIZE] // Update with real file size
};
```

### Step 3: Deploy to Vercel
```bash
vercel deploy
```

## Alternative: Use Trusted Web Activity (Recommended)
For the best PWA-to-APK conversion, use Trusted Web Activity which:
- Maintains all PWA features
- Provides native app experience
- Supports push notifications
- Works offline seamlessly
- Passes Play Store review easily

## Resources
- [Trusted Web Activity Documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [PWA Builder](https://www.pwabuilder.com)
- [Android Developer Guide](https://developer.android.com/guide)
- [WebView Documentation](https://developer.android.com/reference/android/webkit/WebView)

## Support
If you need help creating the real APK, consider:
1. Hiring an Android developer
2. Using PWA Builder automated service
3. Following Android Studio tutorials
4. Joining Android development communities