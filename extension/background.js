// Create the right-click context menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "pardafaash-scan",
        title: "Scan with Pardafaash",
        contexts: ["image", "video", "audio"]
    });
});

// Listen for when the menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "pardafaash-scan") {
        // Send a message to the content script to get the media URL
        chrome.tabs.sendMessage(tab.id, {action: "getMediaUrl", srcUrl: info.srcUrl});
    }
});