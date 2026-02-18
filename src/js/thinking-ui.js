// thinking-ui.js - Qwen AI Thinking Display
// Menampilkan proses thinking AI seperti Qwen

class ThinkingUI {
  constructor() {
    this.container = document.getElementById('chat-window');
    this.isThinking = false;
  }

  // Tampilkan thinking state
  showThinking(userMessage) {
    this.isThinking = true;
    
    // Display user message first
    this.displayUserMessage(userMessage);
    
    // Create thinking container
    const thinkingContainer = document.createElement('div');
    thinkingContainer.className = 'message-container thinking-container';
    thinkingContainer.innerHTML = `
      <div class="thinking-wrapper">
        <div class="thinking-header">
          <span class="thinking-label">🤔 Thinking</span>
          <div class="thinking-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="thinking-content">
          <div class="thinking-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="thinking-text">Analyzing your request...</span>
        </div>
      </div>
    `;
    
    this.container.appendChild(thinkingContainer);
    this.container.scrollTop = this.container.scrollHeight;
    
    return thinkingContainer;
  }

  // Hide thinking dan show response
  hideThinking(thinkingElement, aiResponse) {
    this.isThinking = false;
    
    if (thinkingElement && thinkingElement.parentNode) {
      // Fade out thinking
      thinkingElement.style.opacity = '0';
      thinkingElement.style.transition = 'opacity 0.3s ease';
      
      setTimeout(() => {
        thinkingElement.remove();
      }, 300);
    }
    
    // Display AI response
    this.displayAIMessage(aiResponse);
  }

  displayUserMessage(message) {
    const container = document.createElement('div');
    container.className = 'message-container';
    
    const msg = document.createElement('div');
    msg.className = 'message user-message';
    msg.innerHTML = message
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
    
    container.appendChild(msg);
    this.container.appendChild(container);
    this.container.scrollTop = this.container.scrollHeight;
  }

  displayAIMessage(message) {
    const container = document.createElement('div');
    container.className = 'message-container ai-message-container';
    container.style.animation = 'fadeInUp 0.4s ease';
    
    const msg = document.createElement('div');
    msg.className = 'message ai-message';
    
    // Format message
    let formatted = message
      .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
        const esc = code.trim()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<div class="code-container"><div class="code-header"><span class="code-language">${lang || 'code'}</span><button class="copy-button" onclick="handleCopy(this)">📋 Copy</button></div><pre><code>${esc}</code></pre></div>`;
      })
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    
    msg.innerHTML = formatted;
    container.appendChild(msg);
    this.container.appendChild(container);
    this.container.scrollTop = this.container.scrollHeight;
  }

  isCurrentlyThinking() {
    return this.isThinking;
  }
}

// Initialize globally
window.thinkingUI = new ThinkingUI();
