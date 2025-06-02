# Visitor Counter Implementation

This website includes a simple client-side visitor counter that works perfectly with static hosting.

## Client-Side Counter
- Uses localStorage to track unique daily visitors
- Works on static hosting (GitHub Pages, Netlify, Vercel, etc.)
- Counts are per-browser and reset when localStorage is cleared
- Only increments once per day per browser
- No server requirements - pure JavaScript solution

## How it Works:
1. Checks localStorage for last visit date
2. If new day or first visit, increments counter
3. Displays animated count in footer
4. Stores data locally in browser

## Features:
- **Daily Unique Counting**: Only counts each visitor once per day
- **Animated Display**: Smooth number animation when updating
- **Persistent Storage**: Count persists across browser sessions
- **No Dependencies**: Pure JavaScript, no external services
- **Privacy Friendly**: No data sent to external servers

## Files:
- `js/script.js` - Contains counter JavaScript functionality
- Counter displays in website footer

## Technical Details:
- Uses `localStorage.getItem('visitorCount')` to store count
- Uses `localStorage.getItem('lastVisit')` to track daily visits
- Animates counter with smooth increment effect
- Automatically initializes when page loads
