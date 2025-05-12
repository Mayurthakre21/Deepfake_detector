# Real Time Deepfake Detection System (Chrome Extension)

It is a Chrome extension that detects whether a video being played (e.g., on YouTube) is **real or fake** using a machine learning model running in the backend.

---

## 💻 What This Project Does

- This browser extension takes frames from online videos.
- It sends the frame to the backend API.
- The backend responds with whether the video is real or fake along with a confidence score.
- The result is displayed to the user inside the extension popup or as an overlay.

---

## 🛠 Technologies Used

- HTML, CSS, JavaScript
- Chrome Extension APIs
- Fetch API (for calling the backend)
- Flask (in backend – mentioned here for context)

---

## 🚀 How to Run It

1. Open Chrome and go to:
2. Turn ON **Developer Mode** (top-right).
3. Click **"Load unpacked"** 
4. Play any video on YouTube.
5. Click on the extension icon to check if the video is detected as real or fake.

---

## 📁 Folder Structure

frontend/
├── manifest.json # Extension configuration
├── popup.html # UI displayed when extension icon is clicked
├── popup.js # JS logic for fetching prediction
├── content.js # Injected into video pages to capture data
├── background.js # Runs in background (for future use)
├── styles.css # Styling for popup
└── icons/ # Icons used in the extension

