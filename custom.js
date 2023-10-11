async function uploadDocument() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  var paragraph = document.getElementById('errorText');
  if (!file) {
    paragraph.textContent += 'Please select File';
    return;
  } else {
    paragraph.textContent += '';
  }
  // Handle PDF documents using PDF.js
  if (file.type === 'application/pdf') {
    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray })
        .promise;
      let text = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(' ');
      }
      displayText(text);
    };
    reader.readAsArrayBuffer(file);
  } else if (

    file.type === 'application/msword' ||
    file.type ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    // Handle Word documents using Mammoth
    const reader = new FileReader();
    reader.onload = function () {
      mammoth
        .extractRawText({ arrayBuffer: this.result })
        .then((result) => {
          const text = result.value;
          displayText(text);
        });
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert(
      'Unsupported file format. Please upload a PDF or Word document.'
    );
  }
}

// Add an event listener to the search input field
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    searchKeywords();
  }
});

function searchKeywords() {
  const searchInput = document.getElementById('searchInput');
  const keywords = searchInput.value;
  displayText(highlightKeywords(keywords.trim()));
}
function highlightKeywords(keywords) {
  const text = document.getElementById('textToHighlight').textContent;
  const regex = new RegExp(`\\b(${keywords})\\b`, 'gi');
  const highlightedText = text.replace(
    regex,
    '<span class="highlighted">$1</span>'
  );
  return highlightedText;
}
function displayText(text) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<div id="textToHighlight">' + text + '</div>';
}



document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById('fileInput');
  const selectedFileName = document.getElementById('selectedFileName');
  const errorText = document.getElementById('errorText');
  const uploadForm = document.querySelector('form');

  fileInput.addEventListener('change', function () {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
      const fileName = selectedFile.name;
      selectedFileName.textContent = 'Selected File: ' + fileName;
      errorText.textContent = '';
    } else {
      selectedFileName.textContent = 'No file selected';
      errorText.textContent = '';
    }
  });
});