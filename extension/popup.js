const API_USER = "1794228343";  // <-- your Sightengine api_user
const API_SECRET = "pyts5RypEBg564bnvbmAuGj9gyT65ZDn"; // <-- your Sightengine api_secret
const API_URL = "https://api.sightengine.com/1.0/check.json";

const resultDiv = document.getElementById("result");
const debugDiv = document.getElementById("debug");
const toggleDebugBtn = document.getElementById("toggleDebug");

function showResult(score) {
  let color = "black";
  if (score > 0.7) color = "red";
  else if (score > 0.3) color = "orange";
  else color = "green";
  resultDiv.innerHTML = `Deepfake Probability: <span style="color:${color}">${(score * 100).toFixed(2)}%</span>`;
}

async function checkFormData(formData) {
  resultDiv.textContent = "Checking...";
  debugDiv.style.display = "none";
  toggleDebugBtn.style.display = "none";

  try {
    const response = await fetch(API_URL, { method: "POST", body: formData });
    const data = await response.json();

    // Debug view toggle
    toggleDebugBtn.style.display = "inline-block";
    debugDiv.textContent = JSON.stringify(data, null, 2);
    toggleDebugBtn.onclick = () => {
      debugDiv.style.display =
        debugDiv.style.display === "none" ? "block" : "none";
      toggleDebugBtn.textContent =
        debugDiv.style.display === "none" ? "Show Debug" : "Hide Debug";
    };

    if (data.status === "success") {
      if (data.type && typeof data.type.deepfake !== "undefined") {
        showResult(data.type.deepfake);
      } else {
        resultDiv.textContent = "No deepfake probability found.";
      }
    } else {
      resultDiv.textContent =
        "Error: " + (data.error?.message || "Unknown error");
    }
  } catch (err) {
    resultDiv.textContent = "Network/API error: " + err.message;
  }
}

// Mode 1: Check URL
document.getElementById("checkUrlBtn").addEventListener("click", () => {
  const url = document.getElementById("imageUrl").value.trim();
  if (!url) {
    resultDiv.textContent = "Please enter a URL.";
    return;
  }
  const formData = new FormData();
  formData.append("url", url);
  formData.append("models", "deepfake");
  formData.append("api_user", API_USER);
  formData.append("api_secret", API_SECRET);
  checkFormData(formData);
});

// Mode 2: Check uploaded file
document.getElementById("checkFileBtn").addEventListener("click", () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) {
    resultDiv.textContent = "Please select a file.";
    return;
  }
  const formData = new FormData();
  formData.append("media", file);
  formData.append("models", "deepfake");
  formData.append("api_user", API_USER);
  formData.append("api_secret", API_SECRET);
  checkFormData(formData);
});

// Autofill from right-clicked media
chrome.storage.local.get("mediaUrl", (data) => {
  if (data.mediaUrl) {
    document.getElementById("imageUrl").value = data.mediaUrl;
    document.getElementById("checkUrlBtn").click();
    chrome.storage.local.remove("mediaUrl");
  }
});
