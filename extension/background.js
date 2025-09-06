chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "deepfakeCheck",
    title: "Check for Deepfakes",
    contexts: ["image", "video", "audio"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "deepfakeCheck" && info.srcUrl) {
    chrome.storage.local.set({ mediaUrl: info.srcUrl }, () => {
      chrome.action.openPopup();
    });
  }
});
