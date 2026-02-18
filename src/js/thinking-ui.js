// thinking-ui.js - Qwen AI Thinking Display with actual thinking content

class ThinkingUI {
  constructor() {
    this.container = document.getElementById('chat-window');
    this.isThinking = false;
    this.currentThinkingElement = null;
  }

  // Display thinking output dari API
  showThinking(userMessage, thinkingContent = null) {
    this.isThinking = true;
    
    // Create AI thinking container
    const thinkingContainer = document.createElement('div');
    thinkingContainer.className = 'message-container ai-message-container thinking-display';
    thinkingContainer.innerHTML = `
      <div class="ai-thinking-box">
        <div class="thinking-header">
          <span class="thinking-label">💭 Thinking</span>
        </div>
        <div class="thinking-content" id="thinking-stream">
          ${thinkingContent ? this.formatThinkingText(thinkingContent) : '<span class="thinking-animated">Analyzing...</span>'}
        </div>
      </div>
    `;
    
    this.container.appendChild(thinkingContainer);
    this.container.scrollTop = this.container.scrollHeight;
    this.currentThinkingElement = thinkingContainer;
    
    return thinkingContainer;
  }

  // Update thinking content secara real-time
  updateThinking(thinkingContent) {
    if (this.currentThinkingElement) {
      const thinkingStream = this.currentThinkingElement.querySelector('#thinking-stream');
      if (thinkingStream) {
        thinkingStream.innerHTML = this.formatThinkingText(thinkingContent);
        this.container.scrollTop = this.container.scrollHeight;
      }
    }
  }

  // Format thinking text dengan line breaks
  formatThinkingText(text) {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => `<div class="thinking-line">• ${this.escapeHtml(line)}</div>`)
      .join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Hide thinking dan show response dengan typing animation
  hideThinking(thinkingElement, aiResponse) {
    this.isThinking = false;
    
    if (thinkingElement && thinkingElement.parentNode) {
      // Fade out thinking
      thinkingElement.style.opacity = '0';
      thinkingElement.style.transition = 'opacity 0.2s ease';
      
      setTimeout(() => {
        if (thinkingElement.parentNode) {
          thinkingElement.remove();
        }
      }, 200);
    }
    
    // Display AI response dengan typing animation
    this.displayAIMessageWithTyping(aiResponse);
  }

  // Display user message (right side)
  displayUserMessage(message) {
    const container = document.createElement('div');
    container.className = 'message-container user-container';
    
    const msg = document.createElement('div');
    msg.className = 'message user-message';
    msg.innerHTML = this.formatMessage(message);
    
    container.appendChild(msg);
    this.container.appendChild(container);
    this.container.scrollTop = this.container.scrollHeight;
  }

  // Display AI message (left side) dengan typing animation
  displayAIMessageWithTyping(message) {
    const container = document.createElement('div');
    container.className = 'message-container ai-container';
    
    const msg = document.createElement('div');
    msg.className = 'message ai-message';
    msg.id = 'typing-message-' + Date.now();
    
    container.appendChild(msg);
    this.container.appendChild(container);
    
    // Typing animation
    this.typeMessage(msg, message, () => {
      this.container.scrollTop = this.container.scrollHeight;
    });
  }

  // Typing animation effect
  typeMessage(element, fullText, onComplete) {
    const formatted = this.formatMessage(fullText);
    let currentIndex = 0;
    let htmlBuffer = '';
    
    // Parse HTML properly
    const parser = new DOMParser();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formatted;
    
    // Typewriter effect
    const typeChar = () => {
      if (currentIndex < fullText.length) {
        htmlBuffer += fullText[currentIndex];
        
        // Re-format at intervals
        if (currentIndex % 3 === 0) {
          element.innerHTML = this.formatMessage(htmlBuffer);
          this.container.scrollTop = this.container.scrollHeight;
        }
        
        currentIndex++;
        setTimeout(typeChar, Math.random() * 20 + 10); // 10-30ms per char
      } else {
        // Final format
        element.innerHTML = formatted;
        if (onComplete) onComplete();
      }
    };
    
    typeChar();
  }

  // Format message dengan markdown
  formatMessage(content) {
    return content
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
  }

  // Display AI message without typing (untuk legacy)
  displayAIMessage(message) {
    this.displayAIMessageWithTyping(message);
  }

  isCurrentlyThinking() {
    return this.isThinking;
  }
}

// Initialize globally
window.thinkingUI = new ThinkingUI();
