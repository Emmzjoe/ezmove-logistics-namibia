# Troubleshooting Guide - EZMove

Quick solutions to common issues with the EZMove application.

## 🔐 Authentication Issues

### Demo Driver Accounts Not Working

**Problem**: Cannot login with demo accounts (johannes@ezmove.com, maria@ezmove.com, david@ezmove.com)

**Solutions**:

1. **Clear localStorage and refresh**:
   - Open browser DevTools (F12 or Cmd+Option+I)
   - Go to Console tab
   - Run: `localStorage.clear()`
   - Refresh the page (Ctrl+R or Cmd+R)
   - Try logging in again

2. **Verify demo accounts exist**:
   - Open browser DevTools Console
   - Run: `console.log(JSON.parse(localStorage.getItem('drivers')))`
   - You should see 3 drivers with emails ending in @ezmove.com
   - If not found, clear localStorage and refresh

3. **Check password**:
   - Demo password is: `driver123` (all lowercase, no spaces)
   - Make sure Caps Lock is off

4. **Hard refresh**:
   - Clear browser cache with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - This ensures you have the latest version of the code

### Cannot Sign Up New Account

**Problem**: Getting "Email already registered" or "Phone already registered"

**Solutions**:

1. **Check if account exists**:
   ```javascript
   // In browser console
   const clients = JSON.parse(localStorage.getItem('clients')) || [];
   console.log('Registered clients:', clients);

   const drivers = JSON.parse(localStorage.getItem('drivers')) || [];
   console.log('Registered drivers:', drivers);
   ```

2. **Use different email/phone**:
   - Try a completely different email address
   - Make sure phone number is unique

3. **Clear previous test accounts**:
   ```javascript
   // Remove all clients
   localStorage.removeItem('clients');

   // Or remove all drivers
   localStorage.removeItem('drivers');

   // Then refresh the page
   ```

### Session Lost After Refresh

**Problem**: Have to login again after refreshing the page

**Solutions**:

1. **Check if session exists**:
   ```javascript
   console.log(JSON.parse(localStorage.getItem('currentSession')));
   ```

2. **Verify localStorage is enabled**:
   - Not in Incognito/Private mode
   - Browser settings allow localStorage
   - No extensions blocking storage

3. **Re-login**:
   - Sometimes the session gets corrupted
   - Logout completely and login again

### "Account not found" Error

**Problem**: Getting this error when trying to login with valid credentials

**Solutions**:

1. **Verify account exists in correct database**:
   ```javascript
   // For clients
   const clients = JSON.parse(localStorage.getItem('clients')) || [];
   console.log('Looking for:', 'your-email@example.com');
   console.log('Exists:', clients.find(c => c.email === 'your-email@example.com'));

   // For drivers
   const drivers = JSON.parse(localStorage.getItem('drivers')) || [];
   console.log('Looking for:', 'your-email@example.com');
   console.log('Exists:', drivers.find(d => d.email === 'your-email@example.com'));
   ```

2. **Make sure you're using the right login form**:
   - Client accounts can only login via "I Need Transport"
   - Driver accounts can only login via "I'm a Driver"

3. **Check for typos in email**:
   - Email is case-sensitive in this implementation
   - No extra spaces before or after

### "Incorrect password" Error

**Problem**: Sure the password is correct but getting this error

**Solutions**:

1. **Check password in storage** (for debugging only):
   ```javascript
   const drivers = JSON.parse(localStorage.getItem('drivers')) || [];
   const driver = drivers.find(d => d.email === 'your-email@example.com');
   console.log('Stored hash:', driver?.passwordHash);
   console.log('Your password hash:', btoa('your-password'));
   // These should match
   ```

2. **Password is case-sensitive**:
   - `Driver123` is different from `driver123`
   - Check Caps Lock

3. **Re-register**:
   - If you forgot password, you'll need to clear that account and re-register
   - There's no password reset in this demo version

## 🚀 App Loading Issues

### Blank White Screen

**Problem**: App shows nothing, just white screen

**Solutions**:

1. **Check browser console for errors**:
   - F12 or Cmd+Option+I
   - Look for red error messages
   - Common issues:
     - "Failed to fetch" - Not running on a web server
     - "Unexpected token" - JavaScript syntax error

2. **Verify you're using a web server**:
   - URL should be `http://localhost:8000` or similar
   - NOT `file:///path/to/file.html`
   - See HOW_TO_RUN.md for server options

3. **Check file locations**:
   - `index.html` and `ehail-logistics-app.jsx` must be in the same folder
   - Check for typos in filenames

### "App Failed to Load" Message

**Problem**: Seeing error message about app failing to load

**Solutions**:

1. **Start a web server**:
   ```bash
   # Python 3
   python3 -m http.server 8000

   # Or use the provided script
   # Double-click START_SERVER.command (macOS)
   ```

2. **Check file exists**:
   - Verify `ehail-logistics-app.jsx` is in the folder
   - Check spelling and case sensitivity

3. **Clear cache**:
   - Hard refresh: Ctrl+Shift+R or Cmd+Shift+R

### Styles Look Broken

**Problem**: App loads but looks ugly/unstyled

**Solutions**:

1. **Check Tailwind CSS is loading**:
   - Open DevTools Network tab
   - Refresh page
   - Look for `tailwindcss.com` request
   - Should return status 200

2. **Check internet connection**:
   - Tailwind CSS loads from CDN
   - Need internet for styles to work

3. **Try different browser**:
   - Some extensions block CDN resources
   - Try in Incognito mode

## 💾 Data Issues

### Jobs Not Showing Up

**Problem**: Created a job but don't see it in the list

**Solutions**:

1. **Check if job was created**:
   ```javascript
   const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
   console.log('All jobs:', jobs);
   ```

2. **Check job status**:
   - Active jobs: status is 'pending', 'accepted', or 'in-progress'
   - Completed jobs: status is 'completed'
   - Check the right tab

3. **Refresh the page**:
   - Jobs should persist after refresh
   - If not, there's a storage issue

### Driver Not Seeing Jobs

**Problem**: Driver logged in but "Available Jobs" is empty

**Solutions**:

1. **Create a job first**:
   - Login as client (or open in another browser/incognito)
   - Create a new job
   - Job will appear for matching drivers

2. **Check vehicle type match**:
   - Driver only sees jobs for their vehicle type
   - If you have a Pickup truck, you only see Pickup truck jobs

3. **Verify job status**:
   ```javascript
   const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
   console.log('Pending jobs:', jobs.filter(j => j.status === 'pending'));
   ```

### Lost All Data

**Problem**: All jobs/accounts disappeared

**Solutions**:

1. **Check if localStorage was cleared**:
   - Could have been cleared manually
   - Browser cleaning tools might have done it
   - Incognito mode doesn't persist

2. **Check browser**:
   - Same browser and profile?
   - localStorage is per-browser, per-profile

3. **Prevention**:
   - For production, use a real database
   - localStorage is only for demos

## 🔧 Browser-Specific Issues

### Safari Issues

**Problem**: App doesn't work properly in Safari

**Solutions**:

1. **Enable localStorage**:
   - Safari > Preferences > Privacy
   - Uncheck "Block all cookies"

2. **Disable "Prevent cross-site tracking"**:
   - In Privacy settings
   - Can interfere with localStorage

3. **Try different browser**:
   - Chrome or Firefox recommended for development

### Firefox Private Mode

**Problem**: App doesn't persist data in Firefox Private Mode

**Solution**:
- Private/Incognito mode doesn't save localStorage
- Use normal browsing mode

### Mobile Browser Issues

**Problem**: App not working on mobile

**Solutions**:

1. **Use Chrome or Safari on mobile**:
   - Better React support
   - Better localStorage support

2. **Check viewport**:
   - App is responsive but some features might be cramped
   - Rotate to landscape for better view

3. **Enable JavaScript**:
   - Must have JavaScript enabled
   - Check browser settings

## 🐛 Common Error Messages

### "Cannot read property 'map' of undefined"

**Cause**: Data not loaded properly from localStorage

**Solution**:
```javascript
localStorage.clear();
location.reload();
```

### "Maximum update depth exceeded"

**Cause**: Infinite re-render loop (usually from hooks)

**Solution**:
- Clear cache and hard refresh
- Check browser console for specific component
- Report as bug if persists

### "Failed to execute 'btoa'"

**Cause**: Password contains invalid characters

**Solution**:
- Use only ASCII characters in password
- Avoid emojis or special Unicode

## 📊 Debugging Tools

### View All Data

```javascript
// View everything in localStorage
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key + ':', JSON.parse(localStorage.getItem(key)));
}
```

### Test Demo Login Programmatically

```javascript
// Test if demo driver auth works
const drivers = JSON.parse(localStorage.getItem('drivers'));
const testDriver = drivers.find(d => d.email === 'johannes@ezmove.com');
console.log('Demo driver found:', testDriver);
console.log('Password matches:', testDriver.passwordHash === btoa('driver123'));
```

### Reset Everything

```javascript
// Nuclear option - reset entire app
localStorage.clear();
location.reload();
// Then the app will reinitialize with demo data
```

### Export Your Data

```javascript
// Save your data before clearing
const backup = {
  clients: localStorage.getItem('clients'),
  drivers: localStorage.getItem('drivers'),
  jobs: localStorage.getItem('jobs'),
  session: localStorage.getItem('currentSession')
};
console.log('Backup:', JSON.stringify(backup));
// Copy the output to save
```

### Restore Data

```javascript
// Paste your backup and run
const backup = {/* paste your backup here */};
Object.keys(backup).forEach(key => {
  if (backup[key]) {
    localStorage.setItem(key, backup[key]);
  }
});
location.reload();
```

## 🆘 Still Having Issues?

If none of these solutions work:

1. **Check browser console** for specific error messages
2. **Clear all browser data** for localhost
3. **Try a different browser** (Chrome recommended)
4. **Check the AUTHENTICATION_GUIDE.md** for detailed auth info
5. **Verify you have the latest version** (v6 in index.html)

## 📝 Reporting Bugs

When reporting issues, please include:

1. **Browser and version** (Chrome 120, Safari 17, etc.)
2. **Operating System** (Windows 11, macOS 14, etc.)
3. **Steps to reproduce** the problem
4. **Error messages** from console (F12)
5. **What you expected** vs **what happened**

---

**Last Updated**: December 2024
**Version**: 1.1.0 (Authentication Update)
