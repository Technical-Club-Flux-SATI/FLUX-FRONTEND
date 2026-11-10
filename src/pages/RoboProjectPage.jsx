import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoboProjectPage({ className, styles, children }) {
  const pageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const controller = new AbortController();
    const { signal } = controller;
    const themeToggles = page.querySelectorAll('.theme-toggle');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const header = page.querySelector('.site-header');
    const menuToggle = page.querySelector('.menu-toggle');
    const mobileDrawer = page.querySelector('.mobile-drawer');
    const backToTop = page.querySelector('.back-to-top');
    const year = page.querySelector('#year');
    const footerTime = page.querySelector('#footer-time');

    if (year) year.textContent = new Date().getFullYear();

    const applyTheme = (theme) => {
      const isDark = theme === 'dark';
      document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggles.forEach((toggle) => {
        toggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
        toggle.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);
        toggle.setAttribute('aria-pressed', String(isDark));
      });
      themeColor?.setAttribute('content', isDark ? '#050505' : '#f8fafc');
    };

    const setMobileMenu = (isOpen) => {
      if (!mobileDrawer || !menuToggle) return;
      mobileDrawer.dataset.open = String(isOpen);
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
      menuToggle.dataset.open = String(isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} navigation menu`);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const updateHeaderScrollState = () => {
      if (header) header.dataset.scrolled = String(window.scrollY > 20);
      if (!backToTop) return;
      const isVisible = window.scrollY > 300;
      backToTop.dataset.visible = String(isVisible);
      backToTop.setAttribute('aria-hidden', String(!isVisible));
      backToTop.tabIndex = isVisible ? 0 : -1;
    };

    const updateTime = () => {
      if (footerTime) footerTime.textContent = new Date().toLocaleTimeString();
    };

    applyTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
    themeToggles.forEach((toggle) => {
      toggle.addEventListener('click', () => {
        applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
      }, { signal });
    });

    window.addEventListener('storage', (event) => {
      if (event.key === 'theme' || event.key === null) {
        applyTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
      }
    }, { signal });
    window.addEventListener('scroll', updateHeaderScrollState, { passive: true, signal });
    window.addEventListener('scrollend', updateHeaderScrollState, { signal });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMobileMenu(false);
        page.querySelectorAll('.version-wrap[data-open="true"]').forEach((menu) => {
          menu.dataset.open = 'false';
          menu.querySelector('button')?.setAttribute('aria-expanded', 'false');
        });
      }
    }, { signal });

    page.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const anchor = target.closest('a[href^="/"]');
      if (anchor && !anchor.hasAttribute('target')) {
        event.preventDefault();
        navigate(anchor.getAttribute('href'));
        if (mobileDrawer?.contains(anchor)) setMobileMenu(false);
        return;
      }

      if (menuToggle?.contains(target)) {
        setMobileMenu(mobileDrawer?.dataset.open !== 'true');
      }

      const versionWrap = target.closest('.version-wrap');
      if (versionWrap && versionWrap.querySelector('button')?.contains(target)) {
        const isOpen = versionWrap.dataset.open !== 'true';
        page.querySelectorAll('.version-wrap').forEach((menu) => {
          menu.dataset.open = 'false';
          menu.querySelector('button')?.setAttribute('aria-expanded', 'false');
        });
        versionWrap.dataset.open = String(isOpen);
        versionWrap.querySelector('button')?.setAttribute('aria-expanded', String(isOpen));
      } else {
        page.querySelectorAll('.version-wrap[data-open="true"]').forEach((menu) => {
          if (!menu.contains(target)) {
            menu.dataset.open = 'false';
            menu.querySelector('button')?.setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (target.closest('.back-to-top')) window.scrollTo({ top: 0, behavior: 'smooth' });
    }, { signal });

    page.querySelector('#newsletter-form')?.addEventListener('submit', (event) => {
      event.preventDefault();
    }, { signal });

    updateHeaderScrollState();
    updateTime();
    const timeInterval = window.setInterval(updateTime, 1000);

    return () => {
      controller.abort();
      window.clearInterval(timeInterval);
      document.body.style.overflow = '';
    };
  }, [navigate]);

  return (
    <>
      <style>{styles}</style>
      <div className={className} ref={pageRef}>
        {children}
      </div>
    </>
  );
}