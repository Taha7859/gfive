"use client";

import { useEffect } from "react";

export default function ChatWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      createChat({
        webhookUrl: 'https://alix12.app.n8n.cloud/webhook/3f26a183-7997-4e03-8867-56b6e7e6a242/chat',
        style: {
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: '99999'
        }
      });
    `;
    document.body.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    document.head.appendChild(link);

    return () => {
      // optional cleanup
    };
  }, []);

  return null; // nothing to render, widget attaches to body
}
