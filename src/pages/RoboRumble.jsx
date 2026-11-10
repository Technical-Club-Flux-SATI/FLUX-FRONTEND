import { useEffect, useRef, useState } from 'react';
const styles = String.raw`:root {
        color-scheme: dark;
        --bg: #050505;
        --panel: #0c0c0c;
        --panel-soft: #101316;
        --text: #f4f4f5;
        --muted: #9ca3af;
        --line: rgba(255, 255, 255, 0.1);
        --cyan: #22d3ee;
        --blue: #3b82f6;
        --max-width: 1160px;
        --nav-easing: cubic-bezier(0.4, 0, 0.2, 1);
      }

      html[data-theme="light"] {
        color-scheme: light;
        --bg: #f8fafc;
        --panel: #ffffff;
        --panel-soft: #f1f5f9;
        --text: #18181b;
        --muted: #64748b;
        --line: rgba(15, 23, 42, 0.12);
        --cyan: #0891b2;
        --blue: #2563eb;
      }

      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: #06b6d4 transparent;
      }

      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        border: 2px solid transparent;
        border-radius: 20px;
        background: #0ea5e9;
        background-clip: content-box;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #06b6d4;
        background-clip: content-box;
      }

      html[data-theme="dark"] ::-webkit-scrollbar-thumb {
        background: #06b6d4;
        background-clip: content-box;
      }

      body {
        margin: 0;
        background:
          radial-gradient(ellipse at 50% 0, rgba(6, 182, 212, 0.09), transparent 38rem),
          var(--bg);
        color: var(--text);
        font-family: Raleway, "Segoe UI", sans-serif;
        line-height: 1.65;
      }

      html[data-theme="light"] body {
        background:
          radial-gradient(ellipse at 50% 0, rgba(6, 182, 212, 0.08), transparent 38rem),
          var(--bg);
      }

      a {
        color: inherit;
      }

      button {
        font: inherit;
      }

      .mono,
      .eyebrow,
      .tag,
      .step-number,
      .footer-meta {
        font-family: "Share Tech Mono", Consolas, monospace;
      }

      .site-header {
        position: fixed;
        top: 0;
        z-index: 150;
        width: 100%;
        padding-top: 0;
        transition:
          top 500ms var(--nav-easing),
          padding 500ms var(--nav-easing);
      }

      .nav-inner {
        position: relative;
        width: 100%;
        min-height: 64px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border: 1px solid rgba(15, 23, 42, 0.12);
        border-bottom-color: rgba(15, 23, 42, 0.16);
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(18px);
        transition:
          width 700ms var(--nav-easing),
          max-width 700ms var(--nav-easing),
          min-height 500ms var(--nav-easing),
          margin 700ms var(--nav-easing),
          padding 500ms var(--nav-easing),
          border-radius 500ms var(--nav-easing),
          border-color 500ms var(--nav-easing),
          background-color 500ms var(--nav-easing),
          box-shadow 500ms var(--nav-easing),
          backdrop-filter 500ms var(--nav-easing);
      }

      html[data-theme="dark"] .nav-inner {
        border-color: rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.8);
      }

      .site-header[data-scrolled="true"] {
        top: 0;
        padding-inline: 0;
      }

      .site-header[data-scrolled="true"] .nav-inner {
        width: 100%;
        max-width: 100%;
        min-height: 64px;
        margin-inline: auto;
        border-top: 0;
        border-right: 0;
        border-bottom-color: rgba(15, 23, 42, 0.12);
        border-left: 0;
        border-radius: 0;
        background: rgba(255, 255, 255, 0.95);
        box-shadow: none;
      }

      html[data-theme="dark"] .site-header[data-scrolled="true"] .nav-inner {
        border-bottom-color: rgba(6, 182, 212, 0.3);
        background: rgba(0, 0, 0, 0.95);
      }

      @media (min-width: 640px) {
        .site-header[data-scrolled="true"] .nav-inner {
          min-height: 80px;
        }
      }

      @media (min-width: 1024px) {
        .site-header {
          top: 24px;
          padding-inline: 24px;
        }

        .nav-inner {
          max-width: 1232px;
          min-height: 80px;
          margin-inline: auto;
          padding-inline: 40px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        html[data-theme="dark"] .nav-inner {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
        }

        html[data-theme="light"] .nav-inner {
          background: rgba(255, 255, 255, 0.9);
        }
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
        text-decoration: none;
      }

      .brand-mark {
        position: relative;
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
      }

      .brand-orbit {
        position: absolute;
        inset: 0;
        border: 1px solid rgba(6, 182, 212, 0.25);
        border-radius: 50%;
        transition: transform 500ms ease, border-color 500ms ease;
      }

      .brand-bracket {
        position: absolute;
        inset: -4px;
        display: none;
        border: 2px solid transparent;
        border-top-color: #06b6d4;
        border-left-color: #06b6d4;
        border-radius: 50%;
        opacity: 0;
        transform: rotate(0);
        transition: opacity 300ms ease, transform 700ms ease-in-out;
      }

      .brand:hover .brand-orbit,
      .brand:focus-visible .brand-orbit {
        transform: scale(1.15);
        border-color: rgba(6, 182, 212, 0.6);
      }

      .brand:hover .brand-bracket,
      .brand:focus-visible .brand-bracket {
        opacity: 1;
        transform: rotate(180deg);
      }

      .brand-logo-wrap {
        position: relative;
        overflow: hidden;
        display: grid;
        place-items: center;
      }

      .brand img {
        width: 23px;
        height: 23px;
        object-fit: contain;
      }

      .brand-scanline {
        position: absolute;
        inset: 0;
        display: none;
        height: 2px;
        background: rgba(34, 211, 238, 0.5);
        pointer-events: none;
        transform: translateY(-40px);
      }

      .brand:hover .brand-scanline,
      .brand:focus-visible .brand-scanline {
        animation: brand-scan 1.5s ease-in-out infinite;
      }

      @keyframes brand-scan {
        0% { transform: translateY(-40px); }
        100% { transform: translateY(40px); }
      }

      .brand-name {
        display: none;
        line-height: 1.1;
      }

      .brand-name strong {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 24px;
        font-weight: 900;
        letter-spacing: -0.06em;
      }

      .brand-status {
        width: 6px;
        height: 6px;
        display: inline-block;
        flex: 0 0 6px;
        border-radius: 50%;
        background: #ef4444;
        box-shadow: 0 0 8px #ef4444;
      }

      .brand-name span {
        margin-top: 3px;
        color: var(--cyan);
        font: 700 8px "Share Tech Mono", Consolas, monospace;
        letter-spacing: 0.2em;
      }

      @media (min-width: 640px) {
        .brand-name {
          display: grid;
        }

        .brand-mark {
          width: 40px;
          height: 40px;
        }

        .brand img {
          width: 28px;
          height: 28px;
        }
      }

      @media (min-width: 1024px) {
        .brand-mark {
          width: 48px;
          height: 48px;
        }

        .brand img {
          width: 32px;
          height: 32px;
        }

        .brand-bracket,
        .brand-scanline {
          display: block;
        }
      }

      .desktop-links,
      .desktop-tools {
        display: none;
      }

      .desktop-links {
        align-items: center;
        gap: 4px;
      }

      .desktop-nav-link {
        position: relative;
        display: block;
        overflow: hidden;
        height: 32px;
        padding: 8px 12px;
        color: #64748b;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.2em;
        line-height: 16px;
        text-decoration: none;
        text-transform: uppercase;
      }

      html[data-theme="dark"] .desktop-nav-link {
        color: #9ca3af;
      }

      .desktop-nav-link span {
        display: block;
        line-height: 16px;
        transition: transform 300ms var(--nav-easing);
      }

      .desktop-nav-link span:last-child {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: var(--cyan);
        transform: translateY(100%);
      }

      .desktop-nav-link:hover span:first-child,
      .desktop-nav-link:focus-visible span:first-child {
        transform: translateY(-100%);
      }

      .desktop-nav-link:hover span:last-child,
      .desktop-nav-link:focus-visible span:last-child {
        transform: translateY(0);
      }

      @media (min-width: 1280px) {
        .desktop-links,
        .desktop-tools {
          display: flex;
        }
      }

      .desktop-tools {
        align-items: center;
        gap: 14px;
      }

      .version-wrap {
        position: relative;
      }

      .version-button {
        min-height: 34px;
        padding: 0 11px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(6, 182, 212, 0.3);
        border-radius: 12px;
        background: rgba(6, 182, 212, 0.1);
        color: #06b6d4;
        cursor: pointer;
        font: 700 10px "Share Tech Mono", Consolas, monospace;
      }

      .version-menu {
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        width: 208px;
        padding: 10px;
        display: none;
        border: 1px solid rgba(6, 182, 212, 0.3);
        border-radius: 16px;
        background: #fff;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.22);
      }

      html[data-theme="dark"] .version-menu {
        background: #0a0a0a;
      }

      .version-wrap[data-open="true"] .version-menu {
        display: grid;
      }

      .version-menu a {
        padding: 11px 12px;
        border-radius: 10px;
        color: #64748b;
        font: 700 10px "Share Tech Mono", Consolas, monospace;
        text-decoration: none;
        text-transform: uppercase;
      }

      html[data-theme="dark"] .version-menu a {
        color: #d1d5db;
      }

      .version-menu a:hover {
        background: rgba(6, 182, 212, 0.1);
        color: #06b6d4;
      }

      .system-access {
        padding: 9px 13px;
        border: 1px solid rgba(6, 182, 212, 0.3);
        border-radius: 3px;
        color: #0891b2;
        font: 700 9px "Share Tech Mono", Consolas, monospace;
        letter-spacing: 0.16em;
        text-decoration: none;
        text-transform: uppercase;
      }

      html[data-theme="dark"] .system-access {
        color: #22d3ee;
      }

      .system-access:hover {
        border-color: #22d3ee;
      }

      .mobile-tools {
        display: flex;
        align-items: center;
        gap: 7px;
      }

      @media (min-width: 1280px) {
        .mobile-tools {
          display: none;
        }
      }

      .mobile-version {
        min-height: 32px;
        padding: 0 8px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid rgba(6, 182, 212, 0.3);
        border-radius: 9px;
        background: rgba(6, 182, 212, 0.1);
        color: #06b6d4;
        cursor: pointer;
        font: 700 10px "Share Tech Mono", Consolas, monospace;
      }

      .mobile-version-menu {
        position: absolute;
        top: calc(100% + 9px);
        right: 0;
        width: 180px;
        padding: 8px;
        display: none;
        border: 1px solid rgba(6, 182, 212, 0.3);
        border-radius: 14px;
        background: #fff;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.22);
      }

      html[data-theme="dark"] .mobile-version-menu {
        background: #0a0a0a;
      }

      .version-wrap[data-open="true"] .mobile-version-menu {
        display: grid;
      }

      .mobile-version-menu a {
        padding: 10px;
        border-radius: 9px;
        color: #64748b;
        font: 700 10px "Share Tech Mono", Consolas, monospace;
        text-decoration: none;
        text-transform: uppercase;
      }

      html[data-theme="dark"] .mobile-version-menu a {
        color: #d1d5db;
      }

      .mobile-version-menu a:hover {
        background: rgba(6, 182, 212, 0.1);
        color: #06b6d4;
      }

      .sign-in-icon,
      .menu-toggle {
        width: 36px;
        height: 36px;
        padding: 0;
        display: grid;
        place-items: center;
        border: 1px solid rgba(6, 182, 212, 0.3);
        border-radius: 10px;
        background: transparent;
        color: #0891b2;
        cursor: pointer;
        text-decoration: none;
      }

      html[data-theme="dark"] .sign-in-icon,
      html[data-theme="dark"] .menu-toggle {
        color: #06b6d4;
      }

      .menu-toggle svg {
        width: 23px;
        height: 23px;
      }

      .mobile-drawer {
        position: fixed;
        inset: 0;
        z-index: 140;
        padding: 100px 24px 40px;
        display: flex;
        flex-direction: column;
        background: #fff;
        opacity: 0;
        pointer-events: none;
        transform: translateY(-100%);
        transition: transform 300ms ease, opacity 300ms ease;
      }

      html[data-theme="dark"] .mobile-drawer {
        background: #000;
      }

      .mobile-drawer[data-open="true"] {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }

      .menu-close-icon {
        display: none;
      }

      .menu-toggle[data-open="true"] .menu-open-icon {
        display: none;
      }

      .menu-toggle[data-open="true"] .menu-close-icon {
        display: block;
      }

      .mobile-nav-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .mobile-nav-grid a {
        min-height: 64px;
        padding: 12px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(15, 23, 42, 0.08);
        border-radius: 16px;
        background: #f8fafc;
        color: #18181b;
        font: 700 11px "Share Tech Mono", Consolas, monospace;
        letter-spacing: 0.12em;
        text-decoration: none;
        text-transform: uppercase;
      }

      html[data-theme="dark"] .mobile-nav-grid a {
        border-color: rgba(255, 255, 255, 0.05);
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
      }

      .mobile-nav-grid a:hover,
      .mobile-nav-grid a:focus-visible {
        border-color: rgba(6, 182, 212, 0.3);
        color: #06b6d4;
      }

      .drawer-footer {
        margin-top: auto;
        padding-top: 24px;
        border-top: 1px solid var(--line);
        text-align: center;
      }

      .drawer-footer strong,
      .drawer-footer span {
        display: block;
        font-family: "Share Tech Mono", Consolas, monospace;
        text-transform: uppercase;
      }

      .drawer-footer strong {
        color: var(--cyan);
        font-size: 10px;
        letter-spacing: 0.14em;
      }

      .drawer-footer span {
        margin-top: 5px;
        color: var(--muted);
        font-size: 9px;
      }

      .theme-toggle {
        width: 38px;
        height: 38px;
        padding: 0;
        display: inline-grid;
        flex: 0 0 auto;
        place-items: center;
        border: 1px solid rgba(34, 211, 238, 0.2);
        border-radius: 50%;
        background: transparent;
        color: #22d3ee;
        cursor: pointer;
        transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
      }

      html[data-theme="light"] .theme-toggle {
        border-color: rgba(8, 145, 178, 0.25);
        color: #0891b2;
      }

      .theme-toggle:hover,
      .theme-toggle:focus-visible {
        border-color: var(--cyan);
        background: rgba(6, 182, 212, 0.1);
        outline: none;
      }

      .theme-toggle svg {
        width: 18px;
        height: 18px;
      }

      .sun-icon,
      html[data-theme="dark"] .moon-icon {
        display: none;
      }

      html[data-theme="dark"] .sun-icon {
        display: block;
      }

      .wrap {
        width: min(var(--max-width), calc(100% - 40px));
        margin-inline: auto;
      }

      .hero {
        padding: 124px 0 68px;
        border-bottom: 1px solid var(--line);
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: var(--cyan);
        font-size: 11px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
      }

      .eyebrow::before {
        width: 22px;
        height: 1px;
        background: var(--cyan);
        content: "";
      }

      h1,
      h2,
      h3,
      p {
        margin-top: 0;
      }

      h1 {
        max-width: 900px;
        margin: 22px 0 18px;
        font-size: clamp(48px, 9vw, 104px);
        font-weight: 900;
        letter-spacing: -0.075em;
        line-height: 0.92;
        text-transform: uppercase;
      }

      .gradient {
        color: transparent;
        background: linear-gradient(100deg, var(--cyan), var(--blue));
        background-clip: text;
        -webkit-background-clip: text;
      }

      .hero-copy {
        max-width: 660px;
        margin-bottom: 26px;
        color: var(--muted);
        font-size: 16px;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
      }

      .tag {
        padding: 6px 11px;
        border: 1px solid rgba(34, 211, 238, 0.18);
        border-radius: 6px;
        background: rgba(34, 211, 238, 0.055);
        color: #a5f3fc;
        font-size: 11px;
      }

      html[data-theme="light"] .tag {
        color: #0e7490;
      }

      main {
        padding: 58px 0 90px;
      }

      .content-section {
        margin-top: 68px;
      }

      .section-heading {
        margin-bottom: 22px;
      }

      .section-heading .eyebrow {
        margin-bottom: 8px;
      }

      h2 {
        margin-bottom: 0;
        font-size: clamp(27px, 4vw, 42px);
        font-weight: 800;
        letter-spacing: -0.045em;
        line-height: 1.1;
      }

      .surface {
        border: 1px solid var(--line);
        border-radius: 20px;
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.012));
        box-shadow: 0 22px 70px rgba(0, 0, 0, 0.16);
      }

      .video-panel {
        position: relative;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        background: #050505;
      }

      .project-video {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .video-play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        display: grid;
        width: 76px;
        height: 76px;
        place-items: center;
        padding: 0;
        transform: translate(-50%, -50%);
        border: 1px solid rgba(103, 232, 249, 0.72);
        border-radius: 50%;
        background: rgba(8, 145, 178, 0.38);
        color: #cffafe;
        box-shadow: 0 0 36px rgba(34, 211, 238, 0.28);
        backdrop-filter: blur(8px);
        cursor: pointer;
        transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease, opacity 160ms ease;
      }

      .video-panel[data-playing="true"] .video-play-button {
        opacity: 0;
        pointer-events: none;
      }

      .video-panel[data-playing="true"]:hover .video-play-button,
      .video-play-button:focus-visible {
        opacity: 1;
        pointer-events: auto;
      }

      .video-play-button:hover {
        transform: translate(-50%, -50%) scale(1.08);
        background: rgba(8, 145, 178, 0.62);
        box-shadow: 0 0 46px rgba(34, 211, 238, 0.42);
      }

      .video-play-button:focus-visible {
        outline: 2px solid #cffafe;
        outline-offset: 4px;
      }

      .video-play-button svg {
        width: 34px;
        height: 34px;
      }

      .video-controls {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 28px 18px 14px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.82));
        color: #fff;
      }

      .video-audio-button {
        display: grid;
        width: 34px;
        height: 34px;
        flex: 0 0 auto;
        place-items: center;
        padding: 5px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: inherit;
        cursor: pointer;
      }

      .video-audio-button svg,
      .video-fullscreen-button svg {
        width: 22px;
        height: 22px;
      }

      .video-time {
        flex: 0 0 auto;
        font-family: "Share Tech Mono", Consolas, monospace;
        font-size: 12px;
        font-variant-numeric: tabular-nums;
      }

      .video-seek {
        width: 100%;
        min-width: 40px;
        height: 4px;
        margin: 0;
        accent-color: #22d3ee;
        cursor: pointer;
      }

      .video-fullscreen-button {
        display: grid;
        width: 34px;
        height: 34px;
        flex: 0 0 auto;
        place-items: center;
        padding: 5px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: inherit;
        cursor: pointer;
      }

      .video-audio-button:hover,
      .video-fullscreen-button:hover {
        background: rgba(255, 255, 255, 0.16);
      }

      .video-audio-button:focus-visible,
      .video-fullscreen-button:focus-visible,
      .video-seek:focus-visible {
        outline: 2px solid #cffafe;
        outline-offset: 2px;
      }

      .video-error {
        position: absolute;
        right: 12px;
        bottom: 64px;
        left: 12px;
        margin: 0;
        color: #fecaca;
        font-size: 13px;
        text-align: center;
        text-shadow: 0 1px 5px #000;
        pointer-events: none;
      }

      .video-panel::before {
        content: none;
      }

      .video-message {
        position: relative;
        max-width: 470px;
      }

      .play-mark {
        width: 66px;
        height: 66px;
        margin: 0 auto 18px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(34, 211, 238, 0.6);
        border-radius: 50%;
        background: rgba(6, 182, 212, 0.13);
        color: var(--cyan);
        box-shadow: 0 0 35px rgba(6, 182, 212, 0.16);
        font-size: 23px;
      }

      .video-message h3 {
        margin-bottom: 7px;
        font-size: 20px;
      }

      .video-message p {
        margin: 0;
        color: #c1c6cb;
        font-size: 13px;
      }

      html[data-theme="light"] .video-message p {
        color: #475569;
      }

      .two-column {
        display: grid;
        grid-template-columns: minmax(0, 1.3fr) minmax(260px, 0.7fr);
        gap: 22px;
      }

      .description-card,
      .items-card {
        padding: 28px;
      }

      .description-card p {
        margin-bottom: 0;
        color: #b7bbc1;
        font-size: 15px;
      }

      html[data-theme="light"] .description-card p,
      html[data-theme="light"] .item-list li {
        color: #475569;
      }

      .items-card h3 {
        margin-bottom: 17px;
        font-size: 17px;
      }

      .item-list {
        margin: 0;
        padding: 0;
        display: grid;
        gap: 11px;
        list-style: none;
      }

      .item-list li {
        display: flex;
        align-items: center;
        gap: 11px;
        color: #d1d5db;
        font-size: 14px;
      }

      .item-list li::before {
        width: 7px;
        height: 7px;
        flex: 0 0 7px;
        border-radius: 50%;
        background: var(--cyan);
        box-shadow: 0 0 10px rgba(34, 211, 238, 0.65);
        content: "";
      }

      .procedure {
        display: grid;
        gap: 18px;
        position: relative;
      }

      .procedure::before {
        position: absolute;
        top: 26px;
        bottom: 26px;
        left: 21px;
        width: 1px;
        background: linear-gradient(var(--cyan), rgba(34, 211, 238, 0.12));
        content: "";
      }

      .step {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 20px;
        margin-left: 52px;
        padding: 24px;
      }

      .step::before {
        position: absolute;
        top: 31px;
        left: -40px;
        width: 13px;
        height: 13px;
        border: 2px solid var(--cyan);
        border-radius: 50%;
        background: var(--bg);
        box-shadow: 0 0 15px rgba(34, 211, 238, 0.35);
        content: "";
      }

      .step-copy {
        min-width: 0;
      }

      .step-number {
        display: block;
        margin-bottom: 12px;
        color: var(--cyan);
        font-size: 12px;
        letter-spacing: 0.14em;
      }

      .step h3 {
        margin-bottom: 8px;
        font-size: 16px;
      }

      .step p {
        margin-bottom: 0;
        color: var(--muted);
        font-size: 13px;
      }

      .step-visual {
        min-width: 0;
        width: min(100%, 560px);
        margin: 0;
        overflow: hidden;
        border: 1px solid rgba(34, 211, 238, 0.16);
        border-radius: 12px;
        background:
          radial-gradient(circle at 50% 35%, rgba(34, 211, 238, 0.09), transparent 55%),
          #080c0f;
      }

      .step-visual-compact {
        width: min(100%, 460px);
      }

      html[data-theme="light"] .step-visual {
        background:
          radial-gradient(circle at 50% 35%, rgba(8, 145, 178, 0.09), transparent 55%),
          #f1f5f9;
      }

      .step-visual svg {
        width: 100%;
        height: auto;
        display: block;
      }

      .step-visual img {
        display: block;
        width: 100%;
        height: auto;
      }

      .step-visual figcaption {
        padding: 8px 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.07);
        color: #8b969d;
        font: 10px "Share Tech Mono", Consolas, monospace;
        letter-spacing: 0.04em;
      }

      html[data-theme="light"] .step-visual figcaption {
        color: #64748b;
      }

      .gallery {
        display: grid;
        grid-template-columns: minmax(0, 1.45fr) minmax(0, 0.75fr);
        gap: 16px;
      }

      .gallery-photo {
        min-height: 390px;
        overflow: hidden;
      }

      .gallery-photo img {
        width: 100%;
        height: 100%;
        min-height: 390px;
        display: block;
        object-fit: cover;
        transition: transform 450ms ease;
      }

      .gallery-photo:hover img {
        transform: scale(1.035);
      }

      .gallery-note {
        min-height: 390px;
        padding: 28px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        background:
          radial-gradient(circle at 90% 15%, rgba(34, 211, 238, 0.13), transparent 12rem),
          var(--panel);
      }

      html[data-theme="light"] .gallery-note {
        background:
          radial-gradient(circle at 90% 15%, rgba(8, 145, 178, 0.1), transparent 12rem),
          var(--panel);
      }

      .gallery-note .eyebrow {
        margin-bottom: 12px;
      }

      .gallery-note p {
        margin-bottom: 0;
        color: var(--muted);
        font-size: 13px;
      }

      .contact-section {
        position: relative;
        isolation: isolate;
        display: grid;
        justify-items: center;
        gap: 20px;
        padding: 56px 24px;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 24px;
        background:
          linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px),
          radial-gradient(ellipse at 50% 0, rgba(6, 182, 212, 0.08), transparent 70%),
          var(--panel);
        background-size: 48px 48px, 48px 48px, auto, auto;
        text-align: center;
      }

      .contact-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        color: var(--cyan);
        font: 700 11px "Share Tech Mono", Consolas, monospace;
        letter-spacing: 0.14em;
        text-transform: uppercase;

        
      }

      .contact-eyebrow svg {
        width: 16px;
        height: 16px;
        flex: 0 0 auto;
      }

      
      .contact-title {
        margin: -10px 0 0;
        font-family: "Russo One", sans-serif;
        font-size: 36px;
        font-weight: 900;
        font-style: italic;
        line-height: 40px;
        letter-spacing: -0.9px;
        color: #0f172a;
        line-height: 1.05;
        text-transform: uppercase;
      }

      .contact-intro {
        max-width: 620px;
        margin: -8px 0 0;
        color: var(--muted);
        font-size: 14px;
      }

      .contact-email,
      .contact-directions {
        min-height: 50px;
        padding: 0 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border-radius: 999px;
        font: 700 13px "Share Tech Mono", Consolas, monospace;
        text-decoration: none;
        transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
      }

      .contact-email {
        border: 1px solid rgba(6, 182, 212, 0.35);
        background: rgba(6, 182, 212, 0.1);
        color: var(--cyan);
      }

      .contact-email svg,
      .contact-directions svg {
        width: 18px;
        height: 18px;
        flex: 0 0 auto;
      }

      .contact-email:hover,
      .contact-email:focus-visible,
      .contact-action:hover,
      .contact-action:focus-visible {
        transform: translateY(-2px);
      }

      .contact-people {
        width: min(100%, 640px);
        display: grid;
        gap: 14px;
        text-align: left;
      }

      .contact-person {
        min-width: 0;
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border: 1px solid var(--line);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.68);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
      }

      html[data-theme="dark"] .contact-person {
        background: rgba(255, 255, 255, 0.04);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
      }

      .contact-person-copy {
        min-width: 0;
      }

      .contact-person h3 {
        margin: 0;
        overflow: hidden;
        color: var(--text);
        font-size: 15px;
        font-weight: 800;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .contact-person p {
        margin: 3px 0 0;
        overflow: hidden;
        color: var(--muted);
        font: 11px "Share Tech Mono", Consolas, monospace;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .contact-actions {
        display: flex;
        flex: 0 0 auto;
        gap: 8px;
      }

      .contact-action {
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        border: 1px solid;
        border-radius: 14px;
        transition: transform 180ms ease, background 180ms ease;
      }

      .contact-action svg {
        width: 19px;
        height: 19px;
      }

      .contact-action-phone {
        border-color: rgba(6, 182, 212, 0.35);
        background: rgba(6, 182, 212, 0.08);
        color: var(--cyan);
      }

      .contact-action-whatsapp {
        border-color: rgba(16, 185, 129, 0.35);
        background: rgba(16, 185, 129, 0.08);
        color: #059669;
      }

      html[data-theme="dark"] .contact-action-whatsapp {
        color: #34d399;
      }

      .contact-directions {
        margin-top: 4px;
        border: 1px solid #111827;
        background: #111827;
        box-shadow: 0 8px 16px rgba(15, 23, 42, 0.2);
        color: #fff;
        letter-spacing: 0.03em;
        text-align: center;
      }

      .contact-directions svg {
        color: #22d3ee;
      }

      .contact-directions:hover,
      .contact-directions:focus-visible {
        transform: translateY(-2px);
        background: #1f2937;
      }

      .back-to-top {
        position: fixed;
        right: 0;
        bottom: 0;
        z-index: 120;
        min-width: 76px;
        height: 60px;
        padding: 0 15px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        border: 0;
        border-radius: 999px;
        background: #06b6d4;
        box-shadow: 0 5px 12px rgba(6, 182, 212, 0.28);
        color: #fff;
        cursor: pointer;
        font: 500 16px/1 "Segoe UI", Arial, sans-serif;
        opacity: 0;
        pointer-events: none;
        transform: translateY(8px);
        transition: opacity 180ms ease, transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
      }

      .back-to-top[data-visible="true"] {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }

      .back-to-top svg {
        width: 15px;
        height: 15px;
        flex: 0 0 auto;
      }

      html[data-theme="dark"] .back-to-top {
        background: #06b6d4;
        color: #fff;
      }

      .back-to-top:hover,
      .back-to-top:focus-visible {
        transform: translateY(-4px);
        background: #0891b2;
        box-shadow:
          0 7px 16px rgba(8, 145, 178, 0.34);
        outline: 2px solid rgba(34, 211, 238, 0.3);
        outline-offset: 2px;
      }

      .back-to-top:active {
        transform: translateY(-1px);
      }

      .rulebook-button {
        min-height: 48px;
        margin: 18px auto 0;
        padding: 0 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
        color: #111827;
        cursor: not-allowed;
        font: 700 12px "Share Tech Mono", Consolas, monospace;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .rulebook-button svg {
        width: 17px;
        height: 17px;
      }

      .rulebook-button:disabled {
        opacity: 1;
      }

      .site-footer {
        position: relative;
        overflow: hidden;
        border-top: 1px solid var(--line);
        background: #fff;
        padding: 48px 0 32px;
        transition: background 500ms ease, border-color 500ms ease;
      }

      html[data-theme="dark"] .site-footer {
        background: #050505;
      }

      .site-footer::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.7), transparent);
        content: "";
      }

      .footer-inner {
        width: min(1280px, calc(100% - 48px));
        margin: auto;
        position: relative;
        z-index: 1;
        padding: 0 24px;
      }

      .footer-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 40px;
        margin-bottom: 64px;
      }

      .footer-brand,
      .footer-newsletter {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .footer-brand-heading {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .footer-brand-mark {
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: #06b6d4;
        box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
        color: #fff;
      }

      html[data-theme="dark"] .footer-brand-mark {
        color: #000;
      }

      .footer-brand-mark svg {
        width: 20px;
        height: 20px;
      }

      .footer-brand-name {
        display: flex;
        flex-direction: column;
      }

      .footer-brand-name strong {
        color: var(--text);
        font-size: 23px;
        font-style: italic;
        font-weight: 900;
        letter-spacing: -0.06em;
        line-height: 1;
      }

      .footer-brand-name span {
        margin-top: 5px;
        color: var(--cyan);
        font: 700 9px "Share Tech Mono", Consolas, monospace;
        letter-spacing: 0.2em;
      }

      .footer-description {
        max-width: 360px;
        margin: 0;
        color: var(--muted);
        font: 13px/1.7 "Share Tech Mono", Consolas, monospace;
      }

      .footer-socials {
        display: flex;
        flex-direction: column;
        gap: 13px;
      }

      .footer-kicker {
        color: #94a3b8;
        font: 10px "Share Tech Mono", Consolas, monospace;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .social-links {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
      }

      .social-links a {
        width: 40px;
        height: 40px;
        padding: 0;
        display: grid;
        place-items: center;
        border: 1px solid rgba(15, 23, 42, 0.12);
        border-radius: 7px;
        background: #f8fafc;
        color: #64748b;
        font-size: 0;
        text-decoration: none;
        transition: color 160ms ease, border-color 160ms ease;
      }

      html[data-theme="dark"] .social-links a {
        border-color: rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        color: #94a3b8;
      }

      .social-links a svg {
        width: 18px;
        height: 18px;
      }

      .social-links a:hover,
      .social-links a:focus-visible {
        border-color: rgba(6, 182, 212, 0.5);
        color: var(--cyan);
      }

      .footer-columns {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 32px;
      }

      .footer-column h3,
      .footer-newsletter h3 {
        margin: 0 0 17px;
        padding-bottom: 9px;
        border-bottom: 1px solid rgba(6, 182, 212, 0.3);
        color: var(--text);
        font: 700 11px "Share Tech Mono", Consolas, monospace;
        letter-spacing: 0.15em;
        text-transform: uppercase;
      }

      .footer-column ul {
        margin: 0;
        padding: 0;
        display: grid;
        gap: 11px;
        list-style: none;
      }

      .footer-column a {
        color: #64748b;
        font: 11px "Share Tech Mono", Consolas, monospace;
        text-decoration: none;
        transition: color 160ms ease;
      }

      html[data-theme="dark"] .footer-column a {
        color: #6b7280;
      }

      .footer-column a:hover,
      .footer-column a:focus-visible {
        color: var(--cyan);
      }

      .footer-newsletter h3 {
        margin-bottom: 4px;
        border-bottom: 0;
      }

      .newsletter-form {
        position: relative;
      }

      .newsletter-form input {
        width: 100%;
        min-height: 45px;
        padding: 10px 44px 10px 14px;
        border: 1px solid rgba(15, 23, 42, 0.12);
        border-radius: 8px;
        outline: none;
        background: #f1f5f9;
        color: var(--text);
        font: 11px "Share Tech Mono", Consolas, monospace;
      }

      html[data-theme="dark"] .newsletter-form input {
        border-color: rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
      }

      .newsletter-form input:focus {
        border-color: var(--cyan);
      }

      .newsletter-form button {
        position: absolute;
        top: 50%;
        right: 7px;
        width: 31px;
        height: 31px;
        display: grid;
        place-items: center;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--cyan);
        cursor: pointer;
        transform: translateY(-50%);
      }

      .newsletter-form button:hover {
        background: var(--cyan);
        color: #fff;
      }

      .newsletter-form svg {
        width: 16px;
        height: 16px;
      }

      .footer-newsletter p {
        margin: 0;
        color: #94a3b8;
        font: 9px/1.5 "Share Tech Mono", Consolas, monospace;
      }

      .footer-meta {
        padding-top: 32px;
        border-top: 1px solid var(--line);
        color: #7d858d;
        font: 10px "Share Tech Mono", Consolas, monospace;
        letter-spacing: 0.08em;
      }

      .footer-meta-primary,
      .footer-meta-status,
      .footer-meta-item {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .footer-meta-primary,
      .footer-meta-status {
        flex-wrap: wrap;
      }

      .footer-meta-separator {
        color: var(--line);
      }

      .footer-meta-item svg {
        width: 12px;
        height: 12px;
        color: var(--cyan);
      }

      .footer-watermark {
        position: absolute;
        bottom: -30px;
        left: 0;
        color: rgba(15, 23, 42, 0.035);
        font-size: clamp(80px, 18vw, 190px);
        font-style: italic;
        font-weight: 900;
        letter-spacing: -0.07em;
        line-height: 1;
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
      }

      html[data-theme="dark"] .footer-watermark {
        color: rgba(255, 255, 255, 0.025);
      }

      @media (min-width: 640px) {
        .nav-inner {
          min-height: 80px;
          padding-inline: 32px;
        }

        .contact-people {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .brand-mark {
          width: 40px;
          height: 40px;
        }

        .brand img {
          width: 28px;
          height: 28px;
        }

        .footer-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 40px;
        }

        .footer-brand,
        .footer-newsletter {
          grid-column: span 2;
        }

        .footer-columns {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
      }

      @media (min-width: 768px) {
        .site-footer {
          padding-top: 80px;
        }

        .footer-grid {
          gap: 48px;
          margin-bottom: 80px;
        }

        .footer-columns {
          gap: 32px;
        }

        .footer-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
      }

      @media (min-width: 1024px) {
        .footer-grid {
          grid-template-columns: repeat(12, minmax(0, 1fr));
        }

        .footer-brand {
          grid-column: span 4;
        }

        .footer-columns {
          grid-column: span 5;
        }

        .footer-newsletter {
          grid-column: span 3;
        }
      }

      @media (max-width: 760px) {
        .hero {
          padding: 84px 0 48px;
        }

        main {
          padding-top: 34px;
        }

        .content-section {
          margin-top: 52px;
        }

        .two-column,
        .gallery {
          grid-template-columns: 1fr;
        }

        .gallery-photo,
        .gallery-photo img {
          min-height: 300px;
        }

        .gallery-note {
          min-height: 220px;
        }
      }

      @media (max-width: 520px) {
        .wrap {
          width: min(100% - 30px, var(--max-width));
        }

        .footer-inner {
          width: 100%;
          padding-inline: 24px;
        }

        .nav-inner {
          min-height: 64px;
          padding-inline: 16px;
        }

        .brand img {
          width: 22px;
          height: 22px;
        }

        .brand-name strong {
          font-size: 16px;
        }

        .brand-name span {
          font-size: 8px;
        }

        .theme-toggle {
          width: 34px;
          height: 34px;
        }

        .hero-copy {
          font-size: 14px;
        }

        .video-panel {
          min-height: 0;
        }

        .video-play-button {
          width: 64px;
          height: 64px;
        }

        .video-controls {
          gap: 7px;
          padding: 24px 10px 8px;
        }

        .video-time {
          font-size: 10px;
        }

        .video-audio-button,
        .video-fullscreen-button {
          width: 30px;
          height: 30px;
        }

        .description-card,
        .items-card {
          padding: 22px;
        }

        .contact-section {
          gap: 18px;
          padding: 40px 16px;
          border-radius: 18px;
        }

        .contact-person {
          padding: 12px;
        }

        .contact-action {
          width: 40px;
          height: 40px;
        }

        .contact-email,
        .contact-directions {
          max-width: 100%;
          padding-inline: 16px;
          font-size: 11px;
        }

        .procedure {
          gap: 10px;
        }

        .step {
          grid-template-columns: minmax(0, 1fr);
          gap: 16px;
          margin-left: 38px;
          padding: 17px;
        }

        .procedure::before {
          left: 14px;
        }

        .step::before {
          left: -31px;
        }

        .footer-meta-primary,
        .footer-meta-status {
          gap: 8px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
        }

        .site-header {
          transition:
            top 500ms var(--nav-easing),
            padding 500ms var(--nav-easing) !important;
        }

        .nav-inner {
          transition:
            width 700ms var(--nav-easing),
            max-width 700ms var(--nav-easing),
            min-height 500ms var(--nav-easing),
            margin 700ms var(--nav-easing),
            padding 500ms var(--nav-easing),
            border-radius 500ms var(--nav-easing),
            border-color 500ms var(--nav-easing),
            background-color 500ms var(--nav-easing),
            box-shadow 500ms var(--nav-easing),
            backdrop-filter 500ms var(--nav-easing) !important;
        }

        .desktop-nav-link span {
          transition: transform 300ms var(--nav-easing) !important;
        }

        .brand-orbit {
          transition-duration: 500ms !important;
        }

        .brand-bracket {
          transition-duration: 700ms !important;
        }

        .brand:hover .brand-scanline,
        .brand:focus-visible .brand-scanline {
          animation-duration: 1.5s !important;
        }
      }
`;
import RoboProjectPage from './RoboProjectPage';

export default function RoboRumble() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playError, setPlayError] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const updateDuration = () => setDuration(video.duration);
    updateDuration();
    video.addEventListener('durationchange', updateDuration);
    return () => video.removeEventListener('durationchange', updateDuration);
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const togglePlayback = async () => {
    if (!videoRef.current) return;

    if (!videoRef.current.paused) {
      videoRef.current.pause();
      return;
    }

    try {
      await videoRef.current.play();
      setPlayError('');
    } catch {
      setPlayError('The video could not be played. Try using the player controls.');
    }
  };

  const seekTo = (time) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await videoRef.current?.parentElement?.requestFullscreen();
      }
    } catch {
      setPlayError('Fullscreen is not available in this browser.');
    }
  };

  const formatTime = (time) => {
    if (!Number.isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <RoboProjectPage className="robo-rumble-page" styles={styles}>
      
          <header className="site-header">
            <div className="nav-inner">
              <a className="brand" href="/" aria-label="FLUX home">
                <span className="brand-mark">
                  <span className="brand-orbit" aria-hidden="true"></span>
                  <span className="brand-bracket" aria-hidden="true"></span>
                  <span className="brand-logo-wrap">
                    <img src="/fluxlogo.png" alt="Flux" />
                    <span className="brand-scanline" aria-hidden="true"></span>
                  </span>
                </span>
                <span className="brand-name">
                  <strong>FLUX<span className="brand-status" aria-label="Offline"></span></strong>
                  <span>TECHNICAL CLUB</span>
                </span>
              </a>
              <nav className="desktop-links" aria-label="Main navigation">
                <a className="desktop-nav-link" href="/about"><span>About</span><span>About</span></a>
                <a className="desktop-nav-link" href="/events"><span>Events</span><span>Events</span></a>
                <a className="desktop-nav-link" href="/team"><span>Team</span><span>Team</span></a>
                <a className="desktop-nav-link" href="/projects"><span>Projects</span><span>Projects</span></a>
                <a className="desktop-nav-link" href="/gallery"><span>Gallery</span><span>Gallery</span></a>
                <a className="desktop-nav-link" href="/LearningHub"><span>Learning</span><span>Learning</span></a>
                <a className="desktop-nav-link" href="/contact"><span>Contact</span><span>Contact</span></a>
              </nav>
              <div className="desktop-tools">
                <div className="version-wrap">
                  <button className="version-button" type="button" aria-expanded="false">
                    <span aria-hidden="true">⟳</span>
                    <span>v2.0</span>
                    <span aria-hidden="true">⌄</span>
                  </button>
                  <div className="version-menu">
                    <a href="/old-site">v1.0 / Legacy</a>
                    <a href="/">v2.0 / Current</a>
                  </div>
                </div>
                <button
                  className="theme-toggle"
                  id="theme-toggle"
                  type="button"
                  aria-label="Switch to dark mode"
                  aria-pressed="false"
                  title="Switch to dark mode"
                >
                  <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
                  </svg>
                  <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                  </svg>
                </button>
                <a className="system-access" href="/login">System_Access</a>
              </div>
              <div className="mobile-tools">
                <div className="version-wrap">
                  <button className="mobile-version" type="button" aria-expanded="false">
                    <span aria-hidden="true">⟳</span>
                    <span>v2.0</span>
                    <span aria-hidden="true">⌄</span>
                  </button>
                  <div className="mobile-version-menu">
                    <a href="/old-site">v1.0 / Legacy</a>
                    <a href="/">v2.0 / Current</a>
                  </div>
                </div>
                <button
                  className="theme-toggle"
                  id="mobile-theme-toggle"
                  type="button"
                  aria-label="Switch to dark mode"
                  aria-pressed="false"
                  title="Switch to dark mode"
                >
                  <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
                  </svg>
                  <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                  </svg>
                </button>
                <a className="sign-in-icon" href="/login" aria-label="Sign in" title="Sign in">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21a7 7 0 0 1 14 0" />
                  </svg>
                </a>
                <button
                  className="menu-toggle"
                  id="menu-toggle"
                  type="button"
                  aria-label="Open navigation menu"
                  aria-expanded="false"
                  aria-controls="mobile-drawer"
                >
                  <svg className="menu-open-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <svg className="menu-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="m18 6-12 12M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </header>
          <div className="mobile-drawer" id="mobile-drawer" data-open="false" aria-hidden="true">
            <nav className="mobile-nav-grid" aria-label="Mobile navigation">
              <a href="/about">About</a>
              <a href="/events">Events</a>
              <a href="/team">Team</a>
              <a href="/projects">Projects</a>
              <a href="/gallery">Gallery</a>
              <a href="/LearningHub">Learning</a>
              <a href="/contact">Contact</a>
            </nav>
            <div className="drawer-footer">
              <strong>FLUX Technical Club</strong>
              <span>Engineered for Excellence</span>
            </div>
          </div>
          <button className="back-to-top" id="back-to-top" type="button" aria-label="Back to top" aria-hidden="true" tabIndex="-1" data-visible="false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5m-6 6 6-6 6 6" />
            </svg>
            <span>Top</span>
          </button>
      
          <section className="hero">
            <div className="wrap">
              <span className="eyebrow">Project archive / Robotics</span>
              <h1>ROBO <span className="gradient">Rumble</span></h1>
              <p className="hero-copy">
                Build your own robot and compete in an arena-based challenge where bots go head-to-head in a test of strength, control, and strategy. Design, manoeuvre, and outlast your opponents to claim victory!
              </p>
              <div className="tags" aria-label="Project technologies">
                <span className="tag">Microcontrollers</span>
                <span className="tag">Motor and Drivers</span>
                <span className="tag">ROBOTICS</span>
              </div>
            </div>
          </section>
      
          <main className="wrap">
            <section className="content-section" aria-labelledby="tutorial-title">
              <div className="section-heading">
                <span className="eyebrow">Watch / Learn</span>
                <h2 id="tutorial-title">Tutorial video</h2>
              </div>
              <div className="video-panel surface" data-playing={isPlaying}>
                <video
                  ref={videoRef}
                  className="project-video"
                  playsInline
                  preload="metadata"
                  muted={isMuted}
                  disablePictureInPicture
                  aria-label="Robo Rumble project video"
                  onClick={togglePlayback}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                  onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                  onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
                  onError={() => setPlayError('The video could not be loaded. Please try again later.')}
                >
                  <source src="/projects/robo-rumble/Robo-Rumble-vid.mp4.mp4" type="video/mp4" />
                  Your browser does not support video playback.
                </video>
                <button className="video-play-button" type="button" onClick={togglePlayback} aria-label={isPlaying ? 'Pause video' : 'Play video'}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    {isPlaying ? (
                      <path d="M7 5.5A1.5 1.5 0 0 1 8.5 4h1A1.5 1.5 0 0 1 11 5.5v13A1.5 1.5 0 0 1 9.5 20h-1A1.5 1.5 0 0 1 7 18.5v-13Zm6 0A1.5 1.5 0 0 1 14.5 4h1A1.5 1.5 0 0 1 17 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-13Z" />
                    ) : (
                      <path d="M8 5.8a1 1 0 0 1 1.52-.85l9.1 5.7a1.6 1.6 0 0 1 0 2.7l-9.1 5.7A1 1 0 0 1 8 18.2V5.8Z" />
                    )}
                  </svg>
                </button>
                <div className="video-controls">
                  <button
                    className="video-audio-button"
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    title={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                      {isMuted ? <path d="m16 9 5 6m0-6-5 6" /> : <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>}
                    </svg>
                  </button>
                  <span className="video-time">{formatTime(currentTime)}</span>
                  <input
                    className="video-seek"
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={Math.min(currentTime, duration || 0)}
                    onChange={(event) => seekTo(Number(event.currentTarget.value))}
                    aria-label="Seek video"
                  />
                  <span className="video-time">{formatTime(duration)}</span>
                  <button className="video-fullscreen-button" type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen" title="Toggle fullscreen">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" />
                    </svg>
                  </button>
                </div>
                {playError && <p className="video-error" role="alert">{playError}</p>}
              </div>
              <a className="rulebook-button" href="/projects/robo-rumble/rulebook.pdf" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                </svg>
                Download Rulebook PDF
              </a>
            </section>
      
            <section className="content-section" aria-labelledby="description-title">
              <div className="section-heading">
                <span className="eyebrow">Mission brief</span>
                <h2 id="description-title">Project description</h2>
              </div>
              <div className="two-column">
                <article className="description-card surface">
                  <p>
                    Put your engineering skills, precision, and control to the test!
                    <br /><br />
                    Navigate your robot from Point A to Point B through a challenging obstacle course. 
                    <br />
                    The objective is to complete the course as quickly as possible while avoiding contact with obstacles, as collisions will result in point deductions.
                    <br />
                    Both wired and wireless robots are welcome, with separate scoring criteria for each category.
                    <br />
                    Speed, precision, and control – conquer the course and claim victory!
                  </p>
                </article>
                <aside className="items-card surface" aria-labelledby="items-title">
                  <h3 id="items-title">Components Used</h3>
                  <ul className="item-list">
                    <li>Battery: 12V maximum.</li>
                    <li>Control: Wired or wireless.</li>
                    <li>Motors: DC and geared motors.</li>
                    <li>Movement: No circular objects aiding movement allowed.</li>
                    <li>Microcontrollers: Arduino, ESP, and similar boards permitted.</li>
                  </ul>
                </aside>
              </div>
            </section>
      
            <section className="content-section" aria-labelledby="procedure-title">
              <div className="section-heading">
                <span className="eyebrow">Build log</span>
                <h2 id="procedure-title">Making procedure</h2>
              </div>
              <p className="mono" style={{ margin: "0 0 20px 52px", color: "#7d858d", fontSize: "11px" }}>
                STEP-BY-STEP BUILD PHOTOS
              </p>
              <div className="procedure" aria-label="Step-by-step making procedure">
                <article className="step surface">
                  <div className="step-copy">
                    <span className="step-number">STEP_01</span>
                    <h3>Bot Planning and Component Procurement</h3>
                    <p>Plan the bot's design and identify and gather all the required components, including the ESP board, motors, battery, battery holder/casing, and other necessary parts.</p>
                  </div>
                  <figure className="step-visual step-visual-compact">
                    <img src="/projects/robo-rumble/roborumble-step1.png" alt="Robo Rumble Step 1: bot planning and component procurement" />
                    <figcaption>Step 1 / Bot planning and component procurement</figcaption>
                  </figure>
                </article>
                <article className="step surface">
                  <div className="step-copy">
                    <span className="step-number">STEP_02</span>
                    <h3>Step 2: Chassis Design and Preparation</h3>
                    <p>Shape and modify the scrap materials to form the bot's chassis, ensuring the structure is ready for the assembly process.</p>
                  </div>
                  <figure className="step-visual">
                    <img src="/projects/robo-rumble/roborumble-step2.png" alt="Robo Rumble Step 2: chassis design and preparation" />
                    <figcaption>Step 2 / Chassis design and preparation</figcaption>
                  </figure>
                </article>
                <article className="step surface">
                  <div className="step-copy">
                    <span className="step-number">STEP_03</span>
                    <h3>Step 3: Bot Assembly</h3>
                    <p>Assemble the chassis by mounting the motors, ESP board, battery, and other components in their respective positions.</p>
                  </div>
                  <figure className="step-visual">
                    <img src="/projects/robo-rumble/step3.png" alt="Robo Rumble Step 3: bot assembly" />
                    <figcaption>Step 3 / Bot assembly</figcaption>
                  </figure>
                </article>
                <article className="step surface">
                  <div className="step-copy">
                    <span className="step-number">STEP_04</span>
                    <h3>Step 4: Testing and Tuning</h3>
                    <p>Test the bot's functionality, identify any issues, and fine-tune its components to ensure smooth and reliable operation.</p>
                  </div>
                  <figure className="step-visual">
                    <img src="/projects/robo-rumble/step4.png" alt="Robo Rumble Step 4: testing and tuning" />
                    <figcaption>Step 4 / Testing and tuning</figcaption>
                  </figure>
                </article>
              </div>
            </section>
      
            <section className="content-section" aria-labelledby="gallery-title">
              <div className="section-heading">
                <span className="eyebrow">Visual record</span>
                <h2 id="gallery-title">Project gallery</h2>
              </div>
              <div className="gallery">
                <figure className="gallery-photo surface">
                  <img src="/projects/robo-rumble.png" alt="Robo Rumble robot prototype" />
                </figure>
                <aside className="gallery-note surface">
                  <span className="eyebrow">Prototype / 01</span>
                  <h3>Robo Rumble prototype.</h3>
                  <p>
                    This is the project image currently available. Add build-stage and detail photos
                    here to expand the gallery.
                  </p>
                </aside>
              </div>
            </section>
      
            <section className="content-section contact-section" id="contact" aria-labelledby="contact-title">
              <p className="contact-eyebrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Official Technical Club FLUX · SATI Vidisha
              </p>
              <h2 className="contact-title" id="contact-title">Have questions or need help?</h2>
              <p className="contact-intro">
                Get in direct touch with the student organizing committee for rule clarifications, arena dimensions, or accommodation guidance.
              </p>
              <a className="contact-email" href="mailto:flux.club@satiengg.in">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                flux.club@satiengg.in
              </a>
              <div className="contact-people" aria-label="FLUX event contacts">
                <article className="contact-person">
                  <div className="contact-person-copy">
                    <h3>Devansh Patel</h3>
                    <p>Management head, Technical Club FLUX</p>
                  </div>
                  <div className="contact-actions">
                    <a className="contact-action contact-action-phone" href="tel:+919302276804" aria-label="Call Devansh Patel">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.05 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69A2 2 0 0 1 22 16.92Z" />
                      </svg>
                    </a>
                    <a className="contact-action contact-action-whatsapp" href="https://wa.me/919302276804" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Devansh Patel">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                      </svg>
                    </a>
                  </div>
                </article>
                <article className="contact-person">
                  <div className="contact-person-copy">
                    <h3>Dhananjay Rawat</h3>
                    <p>Software head, Technical Club FLUX</p>
                  </div>
                  <div className="contact-actions">
                    <a className="contact-action contact-action-phone" href="tel:+919238138023" aria-label="Call Dhananjay Rawat">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.05 8.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69A2 2 0 0 1 22 16.92Z" />
                      </svg>
                    </a>
                    <a className="contact-action contact-action-whatsapp" href="https://wa.me/919238138023" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Dhananjay Rawat">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                      </svg>
                    </a>
                  </div>
                </article>
              </div>
              <a className="contact-directions" href="https://maps.app.goo.gl/pHCjLxgC2DvYY7EWA" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                Open SU Ground, directions on Google Maps.
              </a>
            </section>
          </main>
      
          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-grid">
                <section className="footer-brand" aria-label="FLUX club information">
                  <div className="footer-brand-heading">
                    <span className="footer-brand-mark" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="5" width="14" height="14" rx="2" />
                        <path d="M9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4" />
                      </svg>
                    </span>
                    <span className="footer-brand-name">
                      <strong>FLUX</strong>
                      <span>TECHNICAL CLUB</span>
                    </span>
                  </div>
                  <p className="footer-description">
                    Engineering the interface between hardware precision and software agility.
                    SATI's premier technical innovation hub.
                  </p>
                  <div className="footer-socials">
                    <span className="footer-kicker">System_Access_Points</span>
                    <nav className="social-links" aria-label="FLUX social media">
                      <a href="https://www.linkedin.com/company/fluxsati/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18H5.67V9.4h2.67ZM7 8.23a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1ZM18.34 18h-2.67v-4.18c0-1-.02-2.28-1.39-2.28s-1.6 1.09-1.6 2.21V18h-2.66V9.4h2.55v1.17h.04a2.8 2.8 0 0 1 2.52-1.39c2.7 0 3.21 1.78 3.21 4.1Z"/></svg>
                      </a>
                      <a href="https://www.instagram.com/fluxsati/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>
                      </a>
                      <a href="https://www.youtube.com/@fluxsati" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12s0-3.1-.4-4.6a2.4 2.4 0 0 0-1.7-1.7C18.4 5.3 12 5.3 12 5.3s-6.4 0-7.9.4a2.4 2.4 0 0 0-1.7 1.7C2 8.9 2 12 2 12s0 3.1.4 4.6a2.4 2.4 0 0 0 1.7 1.7c1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4a2.4 2.4 0 0 0 1.7-1.7C22 15.1 22 12 22 12Z"/><path d="m10 15 5-3-5-3z"/></svg>
                      </a>
                      <a href="https://github.com/fluxsati/FLUX-FRONTEND" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.3-1.23-1.65-1.23-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.76 2.17 3.06 1.63.1-.72.39-1.21.7-1.49-2.47-.28-5.06-1.23-5.06-5.49 0-1.21.43-2.2 1.14-2.97-.11-.28-.5-1.41.11-2.94 0 0 .93-.3 3.05 1.13a10.6 10.6 0 0 1 5.55 0c2.12-1.43 3.04-1.13 3.04-1.13.61 1.53.23 2.66.11 2.94.71.77 1.14 1.76 1.14 2.97 0 4.27-2.59 5.2-5.07 5.48.4.35.75 1.02.75 2.06v3.39c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>
                      </a>
                    </nav>
                  </div>
                </section>
      
                <nav className="footer-columns" aria-label="Footer navigation">
                  <section className="footer-column">
                    <h3>Navigation</h3>
                    <ul>
                      <li><a href="/about">&gt; About_Us</a></li>
                      <li><a href="/projects">&gt; Our_Projects</a></li>
                      <li><a href="/team">&gt; Team_Flux</a></li>
                      <li><a href="/events">&gt; Events_Log</a></li>
                    </ul>
                  </section>
                  <section className="footer-column">
                    <h3>Resources</h3>
                    <ul>
                      <li><a href="/LearningHub">&gt; Learning_Hub</a></li>
                      <li><a href="#tutorial-title">&gt; Documentation</a></li>
                      <li><a href="/gallery">&gt; Gallery_View</a></li>
                      <li><a href="#items-title">&gt; Tech_Stack</a></li>
                    </ul>
                  </section>
                  <section className="footer-column">
                    <h3>Connect</h3>
                    <ul>
                      <li><a href="/contact">&gt; Contact_System</a></li>
                      <li><a href="/contact">&gt; Sponsorship</a></li>
                      <li><a href="/contact">&gt; Bug_Report</a></li>
                      <li><a href="/contact">&gt; System_Status</a></li>
                    </ul>
                  </section>
                </nav>
      
                <section className="footer-newsletter" aria-labelledby="newsletter-title">
                  <h3 id="newsletter-title">Encrypted_Updates</h3>
                  <form className="newsletter-form" id="newsletter-form">
                    <label className="sr-only" htmlFor="newsletter-email">Email address</label>
                    <input id="newsletter-email" type="email" placeholder="Enter_User_Email..." autoComplete="email" />
                    <button type="submit" aria-label="Subscribe">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </button>
                  </form>
                  <p>*Subscribe to receive technical bulletins and mission updates from FLUX_HQ.</p>
                </section>
              </div>
      
              <div className="footer-meta">
                <div className="footer-meta-primary">
                  <span>&copy; <span id="year"></span> TECHNICAL_CLUB_FLUX</span>
                  <span className="footer-meta-separator" aria-hidden="true">|</span>
                  <span>All_Systems_Nominal</span>
                </div>
                <div className="footer-meta-status">
                  <span className="footer-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>
                    SATI_Node_v2.6.0
                  </span>
                  <span className="footer-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20m-10-10a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/></svg>
                    <span id="footer-time"></span>
                  </span>
                </div>
              </div>
            </div>
            <div className="footer-watermark" aria-hidden="true">TECHNICAL</div>
          </footer>
      
          
        
    </RoboProjectPage>
  );
}
