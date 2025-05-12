document.addEventListener("DOMContentLoaded", function () {
    console.log("Deepfake Detector Extension Loaded.");

    // Find all images & videos on the page
    let mediaElements = document.querySelectorAll("img, video");

    // Extract media URLs
    let mediaData = [];
    mediaElements.forEach((element) => {
        if (element.src) {
            mediaData.push({ url: element.src, element: element });
        }
    });

    // Function to show detection popup
    function showDetectionPopup(confidence, category) {
        const existingPopup = document.getElementById("deepfake-popup");
        if (existingPopup) existingPopup.remove();

        const popup = document.createElement("div");
        popup.id = "deepfake-popup";
        popup.style.position = "fixed";
        popup.style.bottom = "20px";
        popup.style.left = "20px";
        popup.style.padding = "10px 16px";
        popup.style.background = category === "High Risk" ? "rgba(255, 0, 0, 0.9)" :
                                  category === "Moderate Risk" ? "rgba(0, 0, 255, 0.9)" :
                                  "rgba(0, 128, 0, 0.9)";
        popup.style.color = "white";
        popup.style.fontSize = "16px";
        popup.style.zIndex = "999999";
        popup.style.borderRadius = "8px";
        popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
        popup.innerText = `Confidence: ${confidence.toFixed(1)}% (${category})`;

        document.body.appendChild(popup);
    }

    // Add fullscreen event listener
    document.addEventListener("fullscreenchange", () => {
        const popup = document.getElementById("deepfake-popup");
        if (popup) {
            popup.style.zIndex = document.fullscreenElement ? "2147483647" : "999999";
        }
    });

    // Send media URLs to the backend for deepfake detection
    if (mediaData.length > 0) {
        fetch("http://127.0.0.1:5000/detect", { // Replace with actual API endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls: mediaData.map(m => m.url) })
        })
        .then(response => response.json())
        .then(results => {
            results.forEach((result, index) => {
                let confidence = result.confidence; // Confidence score from backend
                const category = confidence > 70 ? "High Risk" :
                                 confidence > 40 ? "Moderate Risk" :
                                 "Low Risk";

                const media = mediaData[index].element;

                // Check if fullscreen is active
                const isFullscreen = !!document.fullscreenElement;

                // If not fullscreen, show border and popup
                if (!isFullscreen) {
                    if (confidence > 70) {
                        media.classList.add("deepfake-red");  // High fake probability
                    } else if (confidence > 40) {
                        media.classList.add("deepfake-blue"); // Suggest caution
                    } else {
                        media.classList.add("deepfake-green"); // Likely real
                    }
                }

                // Always show popup (in both modes)
                showDetectionPopup(confidence, category);
            });
        })
        .catch(error => console.error("Deepfake detection error:", error));
    }

    // Create Floating Deepfake Icon 
    let floatIcon = document.createElement("img");
    floatIcon.src = chrome.runtime.getURL("icon.png"); // Replace with extension's icon
    floatIcon.className = "deepfake-float-icon";

    document.body.appendChild(floatIcon);

    // Open Sidebar Popup on Click
    floatIcon.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "openSidebar" });
    });
});
