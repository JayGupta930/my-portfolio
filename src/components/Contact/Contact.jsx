import React, { useState, useEffect, useRef, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Orb from "../orb";
import notificationAvatar from "../../assets/work_logo/iii.jpg";

// Creative notification messages
const NOTIFICATION_MESSAGES = [
  "Itna mat socho this is the right person.",
  "You're on the right page let's talk!",
  "Good choice. Ab bas message bhej do.",
  "Don't overthink. Just say hi.",
  "If you're still reading, we might already vibe.",
  "Your future collaborator is waiting.👋",
  "The best conversations start with a simple hello.",
  "You've scrolled this far, might as well connect!",
  "Great minds think alike. Let's chat!",
  "One message could change everything."
];

// Creative Toast Notification Component
const CreativeToast = ({ message, onClose, isVisible, position }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  };

  // Position styles based on random position
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      case 'bottom-center':
        return 'bottom-6 left-1/2 -translate-x-1/2';
      case 'top-center':
        return 'top-6 left-1/2 -translate-x-1/2';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed ${getPositionStyles()} z-[9999] max-w-[calc(100vw-3rem)] sm:max-w-xs w-full transform transition-all duration-500 ease-in-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-8 opacity-0 pointer-events-none'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '14px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
      }}
    >
      <div className="flex items-center gap-3 p-4">
        <div 
          className="flex-shrink-0 rounded-full overflow-hidden"
          style={{
            width: '40px',
            height: '40px',
            minWidth: '40px',
            minHeight: '40px',
            boxShadow: '0 0 0 2px rgba(156, 67, 254, 0.5)',
          }}
        >
          <img 
            src={notificationAvatar} 
            alt="Avatar" 
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/90 font-medium leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          onKeyDown={handleKeyDown}
          aria-label="Close notification"
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

    </div>
  );
};

// Notification System Hook
const useCreativeNotifications = () => {
  const [currentToast, setCurrentToast] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [toastCount, setToastCount] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [currentPosition, setCurrentPosition] = useState('bottom-right');
  
  const timeoutRef = useRef(null);
  const activationTimeoutRef = useRef(null);
  const usedMessagesRef = useRef(new Set());
  const maxToasts = 10;

  // Available positions for toast
  const positions = ['bottom-right', 'bottom-left', 'top-right', 'top-left', 'bottom-center', 'top-center'];

  const getRandomPosition = useCallback(() => {
    return positions[Math.floor(Math.random() * positions.length)];
  }, []);

  const getRandomMessage = useCallback(() => {
    const availableMessages = NOTIFICATION_MESSAGES.filter(
      (_, index) => !usedMessagesRef.current.has(index)
    );
    
    if (availableMessages.length === 0) {
      usedMessagesRef.current.clear();
      return NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];
    }
    
    const randomIndex = Math.floor(Math.random() * availableMessages.length);
    const originalIndex = NOTIFICATION_MESSAGES.indexOf(availableMessages[randomIndex]);
    usedMessagesRef.current.add(originalIndex);
    
    return availableMessages[randomIndex];
  }, []);

  const getRandomInterval = useCallback(() => {
    return Math.floor(Math.random() * 1000) + 2000; // 2000-3000ms gap between toasts
  }, []);

  const toastDuration = 3000; // Toast stays visible for 3 seconds
  const fadeOutDuration = 500; // Fade out animation duration

  const showNextToast = useCallback(() => {
    if (isStopped || toastCount >= maxToasts) return;
    
    const message = getRandomMessage();
    const position = getRandomPosition();
    setCurrentToast(message);
    setCurrentPosition(position);
    setIsVisible(true);
    setToastCount(prev => prev + 1);
    
    // Auto-hide after 3 seconds (toast stays visible)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      
      // Wait for fade out animation to complete, then schedule next toast
      if (!isStopped && toastCount < maxToasts - 1) {
        timeoutRef.current = setTimeout(() => {
          // Random gap before next toast appears
          timeoutRef.current = setTimeout(() => {
            showNextToast();
          }, getRandomInterval());
        }, fadeOutDuration);
      }
    }, toastDuration);
  }, [isStopped, toastCount, getRandomMessage, getRandomInterval]);

  const stopNotifications = useCallback(() => {
    setIsStopped(true);
    setIsVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (activationTimeoutRef.current) {
      clearTimeout(activationTimeoutRef.current);
    }
  }, []);

  // Handle visibility change (pause when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } else if (isActivated && !isStopped && toastCount < maxToasts) {
        // Resume showing toasts when tab becomes visible again
        timeoutRef.current = setTimeout(() => {
          showNextToast();
        }, getRandomInterval());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActivated, isStopped, toastCount, showNextToast, getRandomInterval]);

  // Activation after 5 seconds on contact page
  useEffect(() => {
    activationTimeoutRef.current = setTimeout(() => {
      if (!isStopped) {
        setIsActivated(true);
        showNextToast();
      }
    }, 5000);

    return () => {
      if (activationTimeoutRef.current) {
        clearTimeout(activationTimeoutRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    currentToast,
    isVisible,
    stopNotifications,
    currentPosition,
  };
};

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const { currentToast, isVisible, stopNotifications, currentPosition } = useCreativeNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    formData.append("access_key", "c006e100-1aca-40b1-b697-e3903efd1fd8");

    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Message sent successfully! ✅", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        e.target.reset();
      } else {
        toast.error("Failed to send message. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="flex flex-col items-center justify-center py-24 px-[12vw] md:px-[7vw] lg:px-[20vw]"
    >
      <ToastContainer />
      
      {/* Creative Notification System */}
      <CreativeToast 
        message={currentToast} 
        onClose={stopNotifications} 
        isVisible={isVisible}
        position={currentPosition}
      />
      
      {/* ARIA Live Region for Screen Readers */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {isVisible && currentToast}
      </div>
      
      <div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Orb
    hoverIntensity={0.5}
    rotateOnHover={true}
    hue={0}
    forceHoverState={false}
  />
</div>

      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">CONTACT</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          I’d love to hear from you—reach out for any opportunities or questions!
        </p>
      </div>

      <div className="mt-8 w-full max-w-md bg-[#0d081f] p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold text-white text-center">
          Connect With Me <span className="ml-1">🚀</span>
        </h3>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          <textarea
            name="message"
            placeholder="Message"
            rows="4"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            className={`w-full border-2 border-transparent bg-transparent py-3 text-white font-semibold rounded-md transition transform active:scale-95 active:shadow-inner ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"
              }`}
            style={{
              borderImage: "linear-gradient(to right, #9C43FE, #4CC2E9) 1",
              borderImageSlice: 1
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-40"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Sending...
              </span>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
