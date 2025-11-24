# T8000 GUI User Guide

## 🚀 Quick Start

### Easiest Way to Use

1. **Double-click** the `StartWebsite.bat` file.
2. **Wait** for 5 seconds; the website will automatically open in your browser.
3. **Start using** the T8000 GUI system.
4. **To close**, simply close the black command window.


---

## 📋 Detailed Instructions

### System Requirements
- ✅ Windows 7/10/11 Operating System
- ✅ Node.js installed (Version 16 or higher)
  - If not installed, please visit: https://nodejs.org/en
  - Download and install the "LTS" (Recommended) version.

### Startup Steps

**First Time Use:**
1. Ensure Node.js is installed on your computer.
2. Double-click `StartWebsite.bat`.
3. Wait for the green "T8000 GUI Started!" message.
4. The browser will automatically open the website (http://localhost:4173).

**Subsequent Use:**
- Just double-click `StartWebsite.bat` each time.

### Website Address
- Local Access: http://localhost:4173
- LAN Access (Other devices): http://[Your PC IP]:4173

---

## ❓ FAQ

### Q1: No reaction after double-clicking?
**A:** Check if Node.js is installed.
- Open Command Prompt (Win+R, type cmd).
- Type `node -v` and press Enter.
- If a version number appears (e.g., v18.17.0), it is installed.
- If it says "not recognized as an internal or external command", you need to install Node.js.

### Q2: Black window flashes and closes?
**A:** Right-click `StartWebsite.bat` → Select "Run as administrator".

### Q3: "Port already in use" error?
**A:** 
1. Close other programs that might be using port 4173.
2. Or change the port number:
   - Open `standalone/server.js`.
   - Change `4173` on line 5 to another number (e.g., `3000`).

### Q4: Browser didn't open automatically?
**A:** Manually open your browser and enter: http://localhost:4173

### Q5: Page shows blank or error?
**A:** 
1. Wait 10-20 seconds; the server might still be starting.
2. Press F5 to refresh the page.
3. Check the black window for error messages.

---

## 🔧 Advanced Options

### Method 1: Deploy to Company Server
Copy the `web/dist` folder to an IIS or Nginx server.

### Method 2: LAN Access
1. Find your computer's IP address (using `ipconfig` command).
2. Others can access via http://YourIP:4173.

### Method 3: Change Port Number
Edit line 5 of `standalone/server.js` and change `4173` to your desired port.

---

## 📞 Technical Support

If you have any questions, please contact the development team.

**Development Environment Info:**
- Frontend Framework: React + Vite + TypeScript
- UI Components: Ant Design 5
- Backend: Go (Deployed separately)
- Runtime: Node.js 16+
