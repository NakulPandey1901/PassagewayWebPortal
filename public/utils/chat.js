document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const chatButton = document.getElementById('chat-button');
    const chatWindow = document.getElementById('chat-window');
    const closeButton = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('chat-send');

    // --- State ---
    let isOpen = false;
    let hasInteracted = false;
    let flowState = 'discovery'; // discovery, value, transition, contact, done
    let exchangeCount = 0;
    let userIntent = null;
    let specificInterest = null;
    let lastBotMessage = '';

    // --- Configuration ---
    const CONFIG = {
        typingDelay: 1500, // 1.5s
        scrollTrigger: 0.6, // 60%
        timeTrigger: 5500 // 5.5s
    };

    // --- Context Awareness ---
    const pageContext = {
        '/': 'Questions? Chat with AI',
        '/index.html': 'Questions? Chat with AI',
        '/solutions.html': 'Explore AI Solutions',
        '/partners.html': 'Partnership Inquiry',
        '/services.html': 'Our Expertise',
        '/contact.html': 'Get in Touch'
    };

    function updateChatButtonLabel() {
        if (!chatButton) return;
        const currentPath = window.location.pathname.split('/').pop() || '/';
        const label = pageContext['/' + currentPath] || pageContext[currentPath] || 'Chat with Us';

        // Ensure badge exists
        let badge = chatButton.querySelector('.chat-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'chat-badge';
            badge.textContent = '1';
            chatButton.appendChild(badge);
        }

        chatButton.title = label; // Tooltip for now, or could append text
    }

    updateChatButtonLabel();

    // --- Trigger Logic ---
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('passageway_portal/');

    function showChatButton() {
        if (!chatButton) return;
        chatButton.classList.add('chat-visible');
    }

    if (isHomePage) {
        // Initially hidden by CSS

        // Time Trigger
        setTimeout(() => {
            if (!isOpen && chatButton && !chatButton.classList.contains('chat-visible')) {
                showChatButton();
            }
        }, CONFIG.timeTrigger);

        // Scroll Trigger
        window.addEventListener('scroll', () => {
            if (!chatButton) return;
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (scrollPercent > CONFIG.scrollTrigger && !chatButton.classList.contains('chat-visible')) {
                showChatButton();
            }
        });
    } else {
        showChatButton();
    }

    // --- Toggle Window ---
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.classList.add('open');
            // Remove badge on open
            const badge = chatButton.querySelector('.chat-badge');
            if (badge) badge.style.display = 'none';

            if (!hasInteracted) {
                startConversation();
                hasInteracted = true;
            }
        } else {
            chatWindow.classList.remove('open');
        }
    }

    if (chatButton) chatButton.addEventListener('click', toggleChat);
    if (closeButton) closeButton.addEventListener('click', toggleChat);

    // --- Message Handling ---
    function addMessage(text, sender) {
        // Deduplication for bot messages
        if (sender === 'bot') {
            if (text === lastBotMessage) {
                console.warn('Duplicate message prevented.');
                return;
            }
            lastBotMessage = text;
        }

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        // Formatting: Replace newlines with <br>, bold with <strong>, bullet points
        let formattedText = text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        messageDiv.innerHTML = formattedText;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- Typing Indicator ---
    function showTyping() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(indicator);
        scrollToBottom();
    }

    function hideTyping() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    // --- Bot Response ---
    function botReply(text, delay = CONFIG.typingDelay) {
        showTyping();
        setTimeout(() => {
            hideTyping();
            addMessage(text, 'bot');
        }, delay);
    }

    // --- Conversation Flow ---
    function startConversation() {
        chatMessages.innerHTML = '';
        flowState = 'discovery';
        exchangeCount = 0;

        botReply("Hi! I'm here to help you explore our AI solutions.\n\nWhat brings you here today?");

        setTimeout(addQuickActions, CONFIG.typingDelay + 500);
    }

    function addQuickActions() {
        if (document.querySelector('.quick-actions')) return;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'quick-actions';

        const buttons = [
            { text: 'Browse Solutions', action: 'solutions' },
            { text: 'Partnership Inquiry', action: 'partner' },
            { text: 'Book a Demo', action: 'demo' }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'quick-action-btn';
            button.textContent = btn.text;
            button.onclick = () => handleQuickAction(btn.action, btn.text);
            actionsDiv.appendChild(button);
        });

        chatMessages.appendChild(actionsDiv);
        scrollToBottom();
    }

    function handleQuickAction(action, text) {
        const actions = document.querySelector('.quick-actions');
        if (actions) actions.remove();

        addMessage(text, 'user');
        userIntent = action;
        exchangeCount++;

        // Discovery Stage Response
        let response = "";

        if (action === 'solutions') {
            response = "Perfect! We specialize in transforming complex data into actionable intelligence.\n\nOur core offerings include:\n\n<strong>Predictive Analytics</strong>\nTurn historical data into future insights\n\n<strong>Machine Learning Models</strong>\nCustom-built for your specific use case\n\n<strong>AI Integrations</strong>\nSeamless connections to your existing tools\n\nWhich area is most relevant to your needs?";
            flowState = 'value'; // Move to next stage
        } else if (action === 'partner') {
            response = "Great! We'd love to explore how we can work together.\n\nAre you interested in:\n\n<strong>Technology Integration</strong>\nEmbed our AI into your platform\n\n<strong>Strategic Partnership</strong>\nLong-term collaboration opportunities\n\n<strong>Reseller Program</strong>\nOffer our solutions to your clients\n\nTell me more about your goals, and I can point you in the right direction.";
            flowState = 'value';
        } else if (action === 'demo') {
            response = "Excellent! Our demos typically cover:\n\n- Live walkthrough of our AI capabilities\n- Custom use cases for your industry\n- Q&A with our technical team\n- Next steps and implementation timeline\n\nBefore I connect you with our team, **what industry are you in?** This helps us prepare a relevant demo for you.";
            flowState = 'value'; // Asking for industry is part of value qualification
        }

        botReply(response);
    }

    // --- Input Handling ---
    function handleInput() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';
        exchangeCount++;

        // Logic based on state
        if (flowState === 'contact') {
            handleEmailSubmission(text);
            return;
        }

        // Generic Interaction Logic
        setTimeout(() => { // Small delay before typing matches UX
            handleConversationLogic(text);
        }, 500);
    }

    function handleConversationLogic(userText) {
        // Generic Interest Capture: If we are in the 'value' stage (qualification), capture the input.
        if (flowState === 'value' && !specificInterest) {
            specificInterest = userText;
        }

        // Simple keyword matching for demo/industry
        if (flowState === 'value' && userIntent === 'demo') {
            botReply("Perfect! That helps us tailor the demo to your needs.\n\nWhat's the best **email address** to send you the demo booking link?");
            flowState = 'contact';
            // Show email input logic? We just use standard input for now.
            return;
        }

        // Capture Specific Interest for Solutions
        if (flowState === 'value' && userIntent === 'solutions') {
            botReply("This sounds like a great fit.\n\nWould you like me to connect you with our team for a personalized consultation?");
            setTimeout(showYesNoButtons, CONFIG.typingDelay + 1000);
            flowState = 'transition';
            return;
        }

        // Transition Stage Check (Exchange 3-4) - Fallback if not caught above
        if (exchangeCount >= 2 && flowState !== 'transition' && flowState !== 'done' && flowState !== 'contact') {
            botReply("This sounds like a great fit.\n\nWould you like me to connect you with our team for a personalized consultation?");
            setTimeout(showYesNoButtons, CONFIG.typingDelay + 1000);
            flowState = 'transition';
            return;
        }

        // Default "Value" Stage Response
        if (flowState === 'value' || flowState === 'discovery') {
            // Mock AI response
            botReply("That's insightful. Our " + (userIntent === 'partner' ? 'partnership team' : 'engineers') + " have worked on similar challenges.\n\nCould you share a bit more about your timeline?");
            return;
        }

        // Fallback
        if (flowState === 'done') {
            botReply("I'm listening. Feel free to ask about our other services.");
        }
    }

    function showYesNoButtons() {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'quick-actions';

        const btnYes = document.createElement('button');
        btnYes.className = 'cta-btn-yes';
        btnYes.textContent = "Yes, connect me →";
        btnYes.onclick = () => {
            actionsDiv.remove();
            addMessage("Yes, connect me", 'user');
            botReply("Great! What's the best **email address** to reach you?");
            flowState = 'contact';
        };

        const btnNo = document.createElement('button');
        btnNo.className = 'cta-btn-no';
        btnNo.textContent = "No, I'm good";
        btnNo.onclick = () => {
            actionsDiv.remove();
            addMessage("No, I'm good", 'user');
            botReply("Understood! Feel free to ask more questions anytime.");
            flowState = 'done';
        };

        actionsDiv.appendChild(btnYes);
        actionsDiv.appendChild(btnNo);
        chatMessages.appendChild(actionsDiv);
        scrollToBottom();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const ACCESS_KEY = '53b23622-8fcb-49c8-95ac-a595d08a040a';

    async function handleEmailSubmission(email) {
        // 1. Validate Email
        if (!isValidEmail(email)) {
            botReply("That doesn't look like a valid email. Could you try again?");
            return;
        }

        // 2. Show Processing State
        showTyping();

        // 3. Prepare Data
        const payload = {
            email: email,
            interest: userIntent ? userIntent.charAt(0).toUpperCase() + userIntent.slice(1) : 'General',
            specificInterest: specificInterest,
            source: 'AI Chatbot Widget',
            page: window.location.pathname,
            timestamp: new Date().toLocaleString()
        };

        try {
            // 4. Send to Backend (Google Sheets + Email) - Relative Path
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            hideTyping();

            if (result.success) {
                flowState = 'done';

                addMessage("Thanks!", 'bot');
                setTimeout(() => {
                    addMessage(`Someone from our team will reach out to you at **${email}** within 24 hours.`, 'bot');
                    setTimeout(() => {
                        addMessage("In the meantime, feel free to browse our <a href='solutions.html' style='color: var(--accent);'>solutions page</a>.", 'bot');
                        setTimeout(() => {
                            addMessage("Is there anything else I can help you with?", 'bot');
                            flowState = 'chat'; // Allow generic chat
                        }, 1000);
                    }, 1000);
                }, 600);
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            hideTyping();
            console.error('Email submission error:', error);
            botReply("I'm having trouble connecting to our server right now.\n\nPlease email us directly at **info@pssgway.com**.");
            flowState = 'done';
        }
    }

    // --- Listeners ---
    if (sendButton) sendButton.addEventListener('click', handleInput);
    if (chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInput();
    });
});
