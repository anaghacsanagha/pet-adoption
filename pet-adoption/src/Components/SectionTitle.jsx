
import React from "react";

function SectionTitle({ subtitle, title, description, center = true }) {
  return (
    <div className={`section-title ${center ? "text-center" : ""}`} data-aos="fade-up">
      {subtitle && <span className="section-subtitle">{subtitle}</span>}

      <h2>{title}</h2>

      {description && <p>{description}</p>}
    </div>
  );
}

export default SectionTitle;
