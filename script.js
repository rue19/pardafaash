const fileInput = document.getElementById('fileInput');
const linkInput = document.getElementById('linkInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resetBtn = document.getElementById('resetBtn');
const feedback = document.getElementById('feedback');
const feedbackMessage = document.getElementById('feedbackMessage');
const reportBtn = document.getElementById('reportBtn');

// UI States
function setProcessing() {
  feedback.className = 'feedback';
  feedbackMessage.textContent = 'Analyzing...';
  reportBtn.classList.add('hidden');
  feedback.classList.remove('fake', 'clean', 'hidden');
}

function setResult(isFake, confidence) {
  feedback.className = 'feedback';
  feedbackMessage.textContent = isFake
    ? `Deepfake Detected! Confidence: ${confidence}%`
    : `No Deepfake Detected. Confidence: ${confidence}%`;

  feedback.classList.add(isFake ? 'fake' : 'clean');

  reportBtn.classList.toggle('hidden', !isFake);
}

function setError(message) {
  feedback.className = 'feedback fake';
  feedbackMessage.textContent = message;
  reportBtn.classList.add('hidden');
}

// Analyze button click
analyzeBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  const url = linkInput.value.trim();

  if (!file && !url) {
    return setError('Please upload a file or paste a URL.');
  }

  setProcessing();

  try {
    // Example API call
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (url) formData.append('url', url);

    const response = await fetch('/analyze', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    setResult(data.isFake, data.confidence);
  } catch (err) {
    setError('Failed to analyze. Try again.');
    console.error(err);
  }
});

// Reset button
resetBtn.addEventListener('click', () => {
  fileInput.value = '';
  linkInput.value = '';
  feedback.classList.add('hidden');
  reportBtn.classList.add('hidden');
});

// Report button
reportBtn.addEventListener('click', async () => {
  try {
    await fetch('/report', { method: 'POST' });
    alert('Report sent!');
  } catch (err) {
    alert('Failed to send report.');
  }
});
