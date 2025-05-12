document.addEventListener("DOMContentLoaded", function () {
    const scanButton = document.getElementById("scan-btn");
    const deepfakeButton = document.getElementById("deepfake-btn");
    const sidebar = document.getElementById("deepfake-sidebar");
    const closeSidebarButton = document.getElementById("close-sidebar");
    const resultsList = document.getElementById("deepfake-results");

    // Open Sidebar when "D" button is clicked
    deepfakeButton.addEventListener("click", () => {
        sidebar.style.display = "block";
    });

    // Close Sidebar when "Close" button is clicked
    closeSidebarButton.addEventListener("click", () => {
        sidebar.style.display = "none";
    });

    // Scan media when "Scan Page" button is clicked
    scanButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: detectMedia
            });
        });
    });

    // Function to detect media (runs on webpage)
    function detectMedia() {
        let mediaElements = document.querySelectorAll("img, video");
        let mediaData = [];

        mediaElements.forEach((element) => {
            if (element.src) {
                mediaData.push({ url: element.src, element: element });
            }
        });

        // Send media to backend for deepfake detection
        if (mediaData.length > 0) {
            fetch("http://127.0.0.1:5000/detect", { // Replace with actual API
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ urls: mediaData.map(m => m.url) })
            })
            .then(response => response.json())
            .then(results => {
                resultsList.innerHTML = ""; // Clear previous results

                results.forEach((result, index) => {
                    let confidence = result.confidence; // Fake detection score

                    // Apply border color based on detection score
                    if (confidence > 40) {
                        mediaData[index].element.style.border = "4px solid red"; // Fake
                    } else if (confidence > 10) {
                        mediaData[index].element.style.border = "4px solid blue"; // Suspicious
                    } else {
                        mediaData[index].element.style.border = "4px solid green"; // Real
                    }

                    // Append results to the sidebar
                    let listItem = document.createElement("li");
                    listItem.innerText = `Media ${index + 1}: ${confidence}% Fake`;
                    resultsList.appendChild(listItem);
                });

                // Show sidebar with results
                document.getElementById("deepfake-sidebar").style.display = "block";
            })
            .catch(error => console.error("Deepfake detection error:", error));
        }
    }
});
