// Get form elements
const form = document.getElementById('codeAssistantForm');
const button = document.getElementById('getAnswerBtn');
const status = document.getElementById('assistantStatus');
const answerDiv = document.getElementById('codeAnswer');

// Your Gemini API key
const GEMINI_API_KEY = 'AIzaSyA4cMafQgMha76d-nKKkHyuyJwRRhdUsLg';

// Debug logging
console.log('Form:', form);
console.log('Button:', button);
console.log('Status:', status);
console.log('Answer Div:', answerDiv);

// Handle button click
if (button) {
  console.log('Adding click event listener to button');
  button.onclick = async function(e) {
    console.log('Button clicked');
    e.preventDefault();
    
    // Disable button and show loading state
    button.disabled = true;
    button.innerHTML = '&#128187; Processing...';
    status.textContent = 'Analyzing your question...';
    answerDiv.innerHTML = `
      <div class="card">
        <div class="loading-indicator">
          <div class="spinner"></div>
          <p style="color:#c4b5fd; margin-top: 1rem;">Thinking about your code...</p>
        </div>
      </div>
    `;
    
    const language = document.getElementById('language').value;
    const question = document.getElementById('codeQuestion').value;
    
    console.log('Language:', language);
    console.log('Question:', question);
    
    if (!question.trim()) {
      status.textContent = 'Please enter your coding question.';
      button.disabled = false;
      button.innerHTML = '&#128187; Get Answer';
      return;
    }

    try {
      console.log('Sending request to Gemini API...');
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `As an expert ${language} developer, help with this coding question: "${question}". Provide a clear, detailed answer with code examples if relevant. Format the response in a structured way with proper code blocks and explanations.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
      }

      const data = JSON.parse(responseText);
      console.log('Parsed response:', data);
      
      if (data.error) {
        throw new Error(data.error.message || 'API Error');
      }
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const text = data.candidates[0].content.parts[0].text;
        console.log('Extracted text:', text);
        
        // Format the response with proper styling and syntax highlighting
        const formattedText = text
          .split('\n')
          .map(line => {
            // Handle code blocks
            if (line.trim().startsWith('```')) {
              return `<pre class="code-block">${line.replace('```', '')}</pre>`;
            }
            // Handle bullet points
            if (line.trim().startsWith('•')) {
              return `<li>${line.trim().substring(1).trim()}</li>`;
            }
            return line;
          })
          .join('\n');

        answerDiv.innerHTML = `
          <div class="card">
            <h2 class="hero-subtitle" style="color:#a78bfa;">Code Assistant Response</h2>
            <div class="answer-content" style="color:#c4b5fd; line-height: 1.8;">
              ${formattedText}
            </div>
          </div>
        `;
        status.textContent = '';
      } else {
        throw new Error('No answer generated');
      }
    } catch (err) {
      console.error('Error:', err);
      status.textContent = 'Error: ' + err.message;
      answerDiv.innerHTML = `
        <div class="card">
          <h2 class="hero-subtitle" style="color:#a78bfa;">Error</h2>
          <div class="answer-content" style="color:#c4b5fd;">
            <p>Sorry, I encountered an error while processing your question.</p>
            <p>Error details: ${err.message}</p>
            <p>Please try again later or contact me directly.</p>
          </div>
        </div>
      `;
    } finally {
      // Re-enable button
      button.disabled = false;
      button.innerHTML = '&#128187; Get Answer';
    }
  };
} else {
  console.error('Button element not found!');
}

// Add styles
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .answer-content {
      animation: fade-in 0.5s ease-out;
    }
    
    .answer-content li {
      margin-bottom: 0.75rem;
      padding-left: 1.5rem;
      position: relative;
    }
    
    .answer-content li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--primary-light);
    }

    .loading-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(99, 102, 241, 0.1);
      border-left-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .code-block {
      background: #1a1a2e;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1rem 0;
      font-family: 'Consolas', monospace;
      color: #e2e8f0;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    select {
      cursor: pointer;
    }

    select:hover {
      background: #363062 !important;
    }
  </style>
`); 