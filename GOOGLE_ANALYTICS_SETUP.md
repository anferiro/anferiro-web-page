# Google Analytics 4 Setup Guide

## Quick Setup Steps

### 1. Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring" or "Create Account"
3. Follow the setup wizard:
   - **Account Name**: "Andres Rincon Portfolio"
   - **Property Name**: "anferiro.me"
   - **Industry**: "Technology"
   - **Business Size**: "Small"
   - **Website URL**: "https://anferiro.me"

### 2. Get Your Measurement ID
1. After creating the property, you'll see a **Measurement ID** like: `G-XXXXXXXXXX`
2. Copy this ID

### 3. Update Your Website
Replace `G-XXXXXXXXXX` in `index.html` with your actual Measurement ID:

```html
<!-- Find this line in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

<!-- And this line -->
gtag('config', 'G-XXXXXXXXXX', {
```

### 4. What's Already Implemented

✅ **Enhanced Tracking**: 
- Page views
- Scroll depth (25%, 50%, 75%, 100%)
- Navigation clicks
- Article clicks
- Contact interactions
- Hero button clicks
- Outbound link clicks

✅ **Custom Events**:
- `navigation_click` - Track section navigation
- `article_click` - Track article engagement
- `contact_click` - Track contact interactions
- `hero_button_click` - Track CTA button clicks
- `scroll_depth` - Track user engagement depth

### 5. Real-time Verification
After replacing the ID and uploading to GitHub:
1. Go to your GA4 property
2. Click on "Realtime" in the left sidebar
3. Visit your website
4. You should see your visit appear in real-time

### 6. Key Reports to Monitor
- **Realtime**: See current visitors
- **Engagement > Pages and screens**: Most popular pages
- **Engagement > Events**: Track custom events
- **Acquisition > Traffic acquisition**: How people find your site
- **Demographics > User attributes**: Visitor demographics

## Advanced Features Enabled

### Enhanced Measurement
- **Scrolls**: Track scroll depth
- **Outbound clicks**: Track external links
- **File downloads**: Track PDF/file downloads
- **Enhanced page views**: More detailed page tracking

### Custom Dimensions (Optional)
You can add custom dimensions in GA4 for:
- Article categories
- Contact types
- User journey stages

## Privacy & GDPR Compliance

The current implementation:
- Uses Google Analytics 4 (GDPR compliant)
- No personal data collection beyond standard GA4
- No cookies beyond GA4 requirements
- Anonymized IP addresses

## Troubleshooting

**Not seeing data?**
1. Check if the Measurement ID is correct
2. Verify the website is live and accessible
3. Check browser console for errors
4. Use GA4 DebugView for detailed tracking

**Want to test locally?**
Add this to your local development:
```javascript
// For testing - shows events in console
gtag('config', 'G-XXXXXXXXXX', {
  debug_mode: true
});
```

## Next Steps

1. **Set up Goals**: Define conversion goals in GA4
2. **Create Audiences**: Segment visitors by behavior
3. **Set up Alerts**: Get notified of traffic spikes
4. **Connect to Google Search Console**: See search performance
5. **Enable Demographics**: Get age/gender insights (optional)

---

**Need help?** Check the [Google Analytics Help Center](https://support.google.com/analytics/answer/9304153)
