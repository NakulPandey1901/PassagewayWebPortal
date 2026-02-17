import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [quickActions, setQuickActions] = useState([]);
    const [flowState, setFlowState] = useState('discovery');
    const [userIntent, setUserIntent] = useState(null);
    const [specificInterest, setSpecificInterest] = useState(null);
    const messagesEndRef = useRef(null);
    const location = useLocation();

    // Config
    const CONFIG = {
        typingDelay: 1500,
        scrollTrigger: 0.6,
        timeTrigger: 5500
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, showQuickActions]);

    // Initial Trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            // Logic to show chat button or auto-open could go here
            // For now, we just rely on user clicking the button
        }, CONFIG.timeTrigger);
        return () => clearTimeout(timer);
    }, []);

    const startConversation = () => {
        if (messages.length > 0) return;

        setMessages([]);
        setFlowState('discovery');

        botReply("Hi! I'm here to help you explore our AI solutions.\n\nWhat brings you here today?");

        setTimeout(() => {
            setQuickActions([
                { text: 'Browse Solutions', action: 'solutions' },
                { text: 'Partnership Inquiry', action: 'partner' },
                { text: 'Book a Demo', action: 'demo' }
            ]);
            setShowQuickActions(true);
        }, CONFIG.typingDelay + 500);
    };

    const toggleChat = () => {
        if (!isOpen && messages.length === 0) {
            startConversation();
        }
        setIsOpen(!isOpen);
    };

    const addMessage = (text, sender) => {
        setMessages(prev => [...prev, { text, sender }]);
    };

    const botReply = (text, delay = CONFIG.typingDelay) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            addMessage(text, 'bot');
        }, delay);
    };

    const handleQuickAction = (action, text) => {
        setShowQuickActions(false);
        addMessage(text, 'user');
        setUserIntent(action);

        let response = "";
        let nextState = 'value';

        if (action === 'solutions') {
            response = "Perfect! We specialize in transforming complex data into actionable intelligence.\n\nOur core offerings include:\n\n**Predictive Analytics**\nTurn historical data into future insights\n\n**Machine Learning Models**\nCustom-built for your specific use case\n\n**AI Integrations**\nSeamless connections to your existing tools\n\nWhich area is most relevant to your needs?";
        } else if (action === 'partner') {
            response = "Great! We'd love to explore how we can work together.\n\nAre you interested in:\n\n**Technology Integration**\nEmbed our AI into your platform\n\n**Strategic Partnership**\nLong-term collaboration opportunities\n\n**Reseller Program**\nOffer our solutions to your clients\n\nTell me more about your goals, and I can point you in the right direction.";
        } else if (action === 'demo') {
            response = "Excellent! Our demos typically cover:\n\n- Live walkthrough of our AI capabilities\n- Custom use cases for your industry\n- Q&A with our technical team\n- Next steps and implementation timeline\n\nBefore I connect you with our team, **what industry are you in?** This helps us prepare a relevant demo for you.";
        }

        setFlowState(nextState);
        botReply(response);
    };

    const handleInput = async () => {
        if (!inputValue.trim()) return;
        const text = inputValue.trim();
        setInputValue('');
        addMessage(text, 'user');

        if (flowState === 'contact') {
            await handleEmailSubmission(text);
            return;
        }

        // Simulating logic
        setTimeout(() => {
            handleConversationLogic(text);
        }, 500);
    };

    const handleConversationLogic = (userText) => {
        if (flowState === 'value' && !specificInterest) {
            setSpecificInterest(userText);
        }

        if (flowState === 'value' && userIntent === 'demo') {
            botReply("Perfect! That helps us tailor the demo to your needs.\n\nWhat's the best **email address** to send you the demo booking link?");
            setFlowState('contact');
            return;
        }

        if (flowState === 'value' && userIntent === 'solutions') {
            botReply("This sounds like a great fit.\n\nWould you like me to connect you with our team for a personalized consultation?");
            setFlowState('transition');
            setTimeout(() => {
                setQuickActions([
                    { text: "Yes, connect me", action: 'yes_connect' },
                    { text: "No, I'm good", action: 'no_good' }
                ]);
                setShowQuickActions(true);
            }, CONFIG.typingDelay + 1000);
            return;
        }

        // Default
        if (flowState === 'value' || flowState === 'discovery') {
            botReply("That's insightful. Our " + (userIntent === 'partner' ? 'partnership team' : 'engineers') + " have worked on similar challenges.\n\nCould you share a bit more about your timeline?");
        }
    };

    const handleYesNoAction = (action, text) => {
        setShowQuickActions(false);
        addMessage(text, 'user');

        if (action === 'yes_connect') {
            botReply("Great! What's the best **email address** to reach you?");
            setFlowState('contact');
        } else {
            botReply("Understood! Feel free to ask more questions anytime.");
            setFlowState('done');
        }
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleEmailSubmission = async (email) => {
        if (!isValidEmail(email)) {
            botReply("That doesn't look like a valid email. Could you try again?");
            return;
        }

        setIsTyping(true);

        const payload = {
            email: email,
            interest: userIntent,
            specificInterest: specificInterest,
            source: 'AI Chatbot Widget',
            page: location.pathname,
            timestamp: new Date().toLocaleString()
        };

        try {
            await axios.post('/api/chat', payload);
            setIsTyping(false);
            setFlowState('done');
            addMessage("Thanks!", 'bot');
            setTimeout(() => {
                addMessage(`Someone from our team will reach out to you at **${email}** within 24 hours.`, 'bot');
                setTimeout(() => {
                    addMessage("Is there anything else I can help you with?", 'bot');
                    setFlowState('chat');
                }, 1000);
            }, 600);
        } catch (error) {
            console.error('Submission error:', error);
            setIsTyping(false);
            botReply("I'm having trouble connecting to our server right now.\n\nPlease email us directly at **info@pssgway.com**.");
            setFlowState('done');
        }
    };

    return (
        <>
            <button id="chat-button" className={isOpen ? 'chat-visible' : 'chat-visible'} onClick={toggleChat}>
                {/* Using text or need to import image */}
                <span style={{ color: 'white', fontWeight: 'bold' }}>{isOpen ? '✕' : '💬'}</span>
            </button>

            <div id="chat-window" className={isOpen ? 'open' : ''}>
                <div className="chat-header">
                    <h3>Passageway AI</h3>
                    <button id="chat-close" onClick={toggleChat}>×</button>
                </div>

                <div id="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {msg.text.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                            return <strong key={j}>{part.slice(2, -2)}</strong>;
                                        }
                                        return part;
                                    })}
                                    <br />
                                </React.Fragment>
                            ))}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="typing-indicator" id="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    )}
                    {showQuickActions && (
                        <div className="quick-actions">
                            {quickActions.map((btn, idx) => (
                                <button key={idx} className={btn.action === 'yes_connect' ? 'cta-btn-yes' : btn.action === 'no_good' ? 'cta-btn-no' : 'quick-action-btn'}
                                    onClick={() => btn.action === 'yes_connect' || btn.action === 'no_good' ? handleYesNoAction(btn.action, btn.text) : handleQuickAction(btn.action, btn.text)}>
                                    {btn.text}
                                </button>
                            ))}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-container" style={{ display: 'flex', borderTop: '1px solid #eee', padding: '10px' }}>
                    <input
                        type="text"
                        id="chat-input"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleInput()}
                        style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' }}
                    />
                    <button id="chat-send" onClick={handleInput} style={{ marginLeft: '8px', background: '#4A90E2', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Send</button>
                </div>
            </div>
        </>
    );
};

export default ChatWidget;
