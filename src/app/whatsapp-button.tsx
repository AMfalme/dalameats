"use client";
import { Button } from "@headlessui/react"; // Adjust the import path based on your library or project setup
import { useEffect } from "react";

const WhatsAppButton = () => {
  const handleSubmit = () => {
    const phoneNumber = "254717416898";
    const message = "I would like more information about the product.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Open the WhatsApp chat
    window.open(whatsappUrl, "_blank");
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to//67f64617d640c5190a38c023/1iod03jh4";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }, []);

  return (
    <Button className={"whatsapp-button"} onClick={handleSubmit}>
      Chat via WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
