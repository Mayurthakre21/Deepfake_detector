chrome.runtime.onInstalled.addListener(() => {
    console.log("Deepfake Detector Extension Installed!");
});

// Listener for messages from popup.js or content.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openSidebar") {
        chrome.action.openPopup(); // Opens the popup
    }
});
