document.getElementById('checkBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  const resultDiv = document.getElementById('result');
  const debugDiv = document.getElementById('debug');
  const toggleDebugBtn = document.getElementById('toggleDebug');

  if (fileInput.files.length === 0) {
    resultDiv.textContent = 'Please select a file.';
    return;
  }

  const file = fileInput.files[0];
  resultDiv.textContent = 'Checking...';
  debugDiv.style.display = 'none';
  toggleDebugBtn.style.display = 'none';

  // Prepare form data for API
  const formData = new FormData();
  formData.append('media', file);
  formData.append('models', 'deepfake');
  formData.append('api_user', '1794228343');
  formData.append('api_secret', 'pyts5RypEBg564bnvbmAuGj9gyT65ZDn');

  try {
    const response = await fetch('https://api.sightengine.com/1.0/check.json', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    // Show debug section
    toggleDebugBtn.style.display = 'inline-block';
    debugDiv.textContent = JSON.stringify(data, null, 2);

    toggleDebugBtn.onclick = () => {
      debugDiv.style.display =
        debugDiv.style.display === 'none' ? 'block' : 'none';
      toggleDebugBtn.textContent =
        debugDiv.style.display === 'none' ? 'Show Debug' : 'Hide Debug';
    };

    if (data.status === 'success') {
      if (data.type && typeof data.type.deepfake !== 'undefined') {
        const score = data.type.deepfake;
        resultDiv.textContent = `Deepfake Probability: ${(score * 100).toFixed(2)}%`;
      } else {
        resultDiv.textContent =
          "No deepfake probability found in response.";
      }
    } else {
      resultDiv.textContent =
        'Error detecting deepfake: ' +
        (data.error && data.error.message ? data.error.message : 'Unknown error');
    }
  } catch (error) {
    resultDiv.textContent = 'Network or API error: ' + error.message;
  }
});
