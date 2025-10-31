"use client";
import { useEffect } from "react";

const TawkToChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/67f64617d640c5190a38c023/1iod03jh4";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      // optional cleanup if you ever unmount the component
      document.body.removeChild(script);
    };
  }, []);

  return null; // no button, just loads Tawk.to
};

export default TawkToChat;
