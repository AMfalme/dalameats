"use client";
import { Button } from "@headlessui/react"; // Adjust the import path based on your library or project setup

const WhatsAppButton = () => {
  const handleSubmit = () => {
    const phoneNumber = "254717416898";
    const message = "I would like more information about the product.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Open the WhatsApp chat
    window.open(whatsappUrl, "_blank");
  };
  

  return (
    <Button className={"whatsapp-button"} onClick={handleSubmit}>
      Chat via WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
