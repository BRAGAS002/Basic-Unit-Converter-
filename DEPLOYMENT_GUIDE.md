# APK Download Deployment Guide

## Overview
This guide explains how to deploy the Unit Converter PWA with functional APK download capability to Vercel.

## Prerequisites
- Vercel account (free tier is sufficient)
- Node.js 14+ installed locally
- Git repository (optional but recommended)

## Deployment Steps

### Step 1: Prepare Your Files
Ensure you have all the following files in your project:
```
unit-converter/
├── api/
│   └── download.js          # Backend API for APK downloads
├── public/
│   └── UnitConverter-v2.1.0.apk  # Your APK file (replace with real one)
├── index.html              # Main app with APK modal
├── styles.css              # Styles including modal styling
├── script.js               # JavaScript with download functionality
├── manifest.json            # PWA manifest
├── sw.js                   # Service worker
├── package.json            # Node.js dependencies
├── vercel.json             # Vercel configuration
└── README.md               # Documentation
```

### Step 2: Create Real APK File
1. Follow the `APK_CREATION_GUIDE.md` to create a real Android APK
2. Replace the placeholder file in `/public/UnitConverter-v2.1.0.apk`
3. Update the file size in `api/download.js` if different from 15.2MB

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy your project:
```bash
vercel
```

3. Follow the prompts:
   - Link to your Vercel account
   - Configure project settings
   - Deploy

#### Option B: Using Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel dashboard
3. Configure build settings
4. Deploy automatically on push

#### Option C: Manual Upload
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Upload your project files
4. Configure and deploy

### Step 4: Configure Environment Variables (Optional)
If needed, set environment variables in Vercel dashboard:
- `APK_FILENAME`: Custom APK filename
- `APK_FILEPATH`: Custom file path
- `CORS_ORIGIN`: Specific CORS origin instead of "*"

### Step 5: Test the Deployment

#### Test Download Functionality
1. Visit your deployed URL
2. Wait for the APK modal to appear (2 seconds)
3. Click "Download APK"
4. Verify the download starts with progress tracking
5. Check that the file downloads completely

#### Test Cross-Browser Compatibility
- Chrome/Chromium
- Firefox
- Safari
- Edge
- Mobile browsers

#### Test Error Scenarios
- Network disconnection during download
- Large file downloads (>50MB)
- Multiple simultaneous downloads
- Browser refresh during download

## Configuration Options

### Custom APK File
Update these values in `api/download.js`:
```javascript
const APK_CONFIG = {
  filename: 'YourApp-v1.0.0.apk',
  filepath: path.join(process.cwd(), 'public', 'YourApp-v1.0.0.apk'),
  mimeType: 'application/vnd.android.package-archive',
  fileSize: [ACTUAL_FILE_SIZE_IN_BYTES]
};
```

### Custom API Endpoint
Modify the API endpoint in `script.js`:
```javascript
const apiEndpoint = isLocalhost 
    ? 'http://localhost:3000/api/download'
    : 'https://your-custom-domain.com/api/download';
```

### CORS Configuration
For production, restrict CORS instead of allowing all origins:
```javascript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Range'
};
```

## Security Considerations

### 1. File Validation
- Verify APK file integrity before serving
- Implement file size limits
- Add rate limiting for downloads
- Monitor download patterns

### 2. CORS Security
- Restrict allowed origins in production
- Use proper authentication if needed
- Implement request validation

### 3. HTTPS Enforcement
- Always use HTTPS for APK downloads
- Implement HSTS headers
- Use secure file transfer protocols

## Performance Optimization

### 1. CDN Integration
For high-traffic apps, consider using a CDN:
```javascript
// Use CDN URL for APK files
const APK_CONFIG = {
  filename: 'UnitConverter-v2.1.0.apk',
  cdnUrl: 'https://cdn.yourdomain.com/UnitConverter-v2.1.0.apk',
  // ... rest of config
};
```

### 2. Caching Strategy
- Set appropriate cache headers
- Implement browser caching
- Use service worker for offline support

### 3. Download Optimization
- Enable HTTP/2 for multiplexing
- Implement download resume
- Use chunked transfer for large files

## Monitoring and Analytics

### 1. Download Tracking
Add analytics to track:
- Download success rate
- Download completion time
- Error rates and types
- User agent information

### 2. Error Monitoring
Implement error tracking:
- Sentry integration
- Custom error logging
- Performance monitoring

## Troubleshooting

### Common Issues

#### APK Download Fails
1. Check file exists in `/public/` directory
2. Verify file permissions
3. Check Vercel function logs
4. Test API endpoint directly

#### CORS Errors
1. Verify CORS headers in `vercel.json`
2. Check API endpoint configuration
3. Test with different browsers

#### Large File Issues
1. Increase Vercel function timeout
2. Implement chunked downloads
3. Use external file hosting

#### Browser Compatibility
1. Test with multiple browsers
2. Check for polyfill requirements
3. Verify progressive enhancement

### Debug Mode
Enable debug logging:
```javascript
// In script.js
const DEBUG = true;
if (DEBUG) {
  console.log('Download API endpoint:', apiEndpoint);
  console.log('Download progress:', this.downloadProgress);
}
```

## Support and Maintenance

### Regular Updates
- Update APK file regularly
- Monitor for security issues
- Update dependencies
- Test with new browser versions

### User Support
- Provide clear error messages
- Offer alternative download methods
- Maintain documentation
- Monitor user feedback

## Advanced Features

### 1. Multiple APK Versions
Support different APK versions:
```javascript
const APK_VERSIONS = {
  stable: 'UnitConverter-v2.1.0.apk',
  beta: 'UnitConverter-v2.2.0-beta.apk',
  lite: 'UnitConverter-lite-v2.1.0.apk'
};
```

### 2. Download Resume
Implement download resume for large files:
```javascript
// Support HTTP Range requests
const range = req.headers.range;
if (range) {
  // Handle partial content
}
```

### 3. Authentication
Add authentication for premium downloads:
```javascript
// Verify user authentication
const authHeader = req.headers.authorization;
if (!isValidAuth(authHeader)) {
  return sendError(res, 401, 'Unauthorized');
}
```

## Conclusion
Your APK download functionality is now ready for production use. The implementation provides:
- ✅ Secure file serving
- ✅ Cross-browser compatibility
- ✅ Progress tracking
- ✅ Error handling
- ✅ CORS support
- ✅ Vercel optimization

For additional support, refer to the Vercel documentation and Android development resources.