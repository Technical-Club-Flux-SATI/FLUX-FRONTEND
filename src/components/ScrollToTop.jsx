import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ showButton = true }) => {
  const { pathname, search, hash } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Disable browser automatic scroll restoration so navigation starts at top
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Scroll to top immediately whenever the page route changes
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const resetScroll = () => {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      } catch {
        window.scrollTo(0, 0);
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();

    // Re-verify on next animation frame in case lazy components or images shift the height
    const rAF = requestAnimationFrame(() => {
      resetScroll();
    });

    return () => cancelAnimationFrame(rAF);
  }, [pathname, search]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!showButton || !isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 bg-cyan-500 text-white rounded-full shadow-lg hover:bg-cyan-600 transition-all duration-300"
      aria-label="Back to Top"
    >
      ↑ Top
    </button>
  );
};

export default ScrollToTop;