import React, { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./Contact.css";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    // EmailJS send function
    emailjs
      .send(
        "YOUR_SERVICE_ID", // Replace with your EmailJS Service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "YOUR_USER_ID" // Replace with your EmailJS User ID
      )
      .then(
        () => {
          setStatus("Message sent successfully! We'll get back to you soon.");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          setStatus("Failed to send message. Please try again later.");
          console.error("EmailJS error:", error);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="contact-container">
      <header className="header">
        <h1>Contact Us</h1>
        <p>Have questions or feedback? We're here to help you succeed with LEARNCODE.</p>
      </header>

      <section className="contact-section info">
        <h2>Get in Touch</h2>
        <div className="contact-grid">
          <div className="contact-details">
            <h3>Our Office</h3>
            <p>Brighton University</p>
            <p>Cockcroft Building, Lewes Rd, Brighton BN2 4GJ, United Kingdom</p>
            <p>Email: support@LEARNCODE.com</p>
            <p>Phone: +44 1273 600900</p>
          </div>
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.901394614847!2d-0.119015684229736!3d50.84298797953168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48758570980a6f81%3A0x5b5e6b7b0c9c0b7e!2sUniversity%20of%20Brighton%20-%20Cockcroft%20Building!5e0!3m2!1sen!2suk!4v1698765432109!5m2!1sen!2suk"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Brighton University Location"
            ></iframe>
          </div>
        </div>
      </section>

      <section className="contact-section form">
        <h2>Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Your email address"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="How can we assist you?"
              rows="6"
            ></textarea>
          </div>
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
          {status && <p className={`form-status ${status.includes("Failed") ? "error" : "success"}`}>{status}</p>}
        </form>
      </section>

      <footer className="footer">
        <p>© 2025 LearnJS. All rights reserved.</p>
        <Link to="/services">About Us</Link>
      </footer>
    </div>
  );
};