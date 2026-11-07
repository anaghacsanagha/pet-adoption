
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import SectionTitle from "../Components/SectionTitle";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Save message to JSON Server
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const newMessage = {
      ...formData,
      date: new Date().toLocaleDateString(),
    };

    try {
      const response = await fetch(
        "http://localhost:3000/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      alert("Your message has been submitted successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Message submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <p>GET IN TOUCH</p>
        <h1>Contact Us</h1>
        <span>
          We would love to hear from you. Feel free to contact us!
        </span>
      </div>

      <Container className="py-5">
        <SectionTitle
          subtitle="CONTACT PAWHAVEN"
          title="Let's Talk About Pet Adoption"
          description="Have questions about adoption? We are here to help you."
        />

        <Row className="g-4 mt-3">
          <Col lg={5}>
            <div className="contact-info-card">
              <h3>Contact Information</h3>

              <div className="contact-info-item">
                <span>📍</span>
                <div>
                  <h5>Our Location</h5>
                  <p>Kerala, India</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span>📧</span>
                <div>
                  <h5>Email Address</h5>
                  <p>hello@pawhaven.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span>🐾</span>
                <div>
                  <h5>Our Support</h5>
                  <p>Pet Adoption Support Team</p>
                </div>
              </div>

              <div className="contact-message">
                Every pet deserves a loving home.
                Contact us and become a part of our mission!
              </div>
            </div>
          </Col>

          <Col lg={7}>
            <div className="contact-form">
              <h3>Send Us a Message</h3>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    placeholder="Enter subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Your Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Contact;
