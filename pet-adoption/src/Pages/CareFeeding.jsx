
import React from "react";
import SectionTitle from "../Components/SectionTitle";

function CareFeeding() {
  const careTips = [
    {
      icon: "🥗",
      title: "Healthy Nutrition",
      description:
        "Give your pet balanced food according to its age, size and health needs. Always provide fresh drinking water.",
    },
    {
      icon: "🩺",
      title: "Regular Health Checkups",
      description:
        "Visit a veterinarian regularly. Keep vaccinations and deworming up to date.",
    },
    {
      icon: "🛁",
      title: "Grooming & Hygiene",
      description:
        "Bathe your pet when needed, brush its coat regularly and keep its sleeping area clean.",
    },
    {
      icon: "🏃",
      title: "Exercise & Play",
      description:
        "Give your pet daily exercise and playtime to maintain physical fitness and mental happiness.",
    },
    {
      icon: "❤️",
      title: "Love & Attention",
      description:
        "Spend quality time with your pet. Give affection, patience and a safe environment.",
    },
    {
      icon: "🛏️",
      title: "Comfortable Shelter",
      description:
        "Provide a clean, comfortable and safe place for your pet to sleep and relax.",
    },
  ];

  const feedingTips = [
    {
      pet: "🐶 Dogs",
      tips: [
        "Choose dog food suitable for the dog's age and size.",
        "Provide clean drinking water throughout the day.",
        "Avoid chocolate, grapes, raisins and onions.",
        "Maintain a regular feeding schedule.",
      ],
    },
    {
      pet: "🐱 Cats",
      tips: [
        "Provide nutritionally complete cat food.",
        "Always keep fresh water available.",
        "Avoid onions, garlic, chocolate and alcohol.",
        "Keep feeding bowls clean.",
      ],
    },
    {
      pet: "🐾 Puppies & Kittens",
      tips: [
        "Give age-appropriate puppy or kitten food.",
        "Feed smaller meals more frequently as advised by a vet.",
        "Do not give cow's milk as a substitute for proper nutrition.",
        "Arrange regular veterinary checkups.",
      ],
    },
  ];

  return (
    <div className="care-page">
      <section className="care-hero">
        <div className="container">
          <p>PAWHAVEN PET CARE GUIDE</p>
          <h1>Healthy Pets, Happy Homes</h1>
          <span>
            Simple care, proper nutrition and lots of love make
            every pet's life better.
          </span>
        </div>
      </section>

      <div className="container section-padding">
        <SectionTitle
          subtitle="EVERYDAY PET CARE"
          title="How to Care for Your Pet"
          description="Follow these simple habits to keep your furry friend healthy and happy."
        />

        <div className="row g-4 mt-3">
          {careTips.map((tip, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div className="care-tip-card">
                <div className="care-tip-icon">{tip.icon}</div>
                <h4>{tip.title}</h4>
                <p>{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="feeding-section">
          <SectionTitle
            subtitle="FOOD & NUTRITION"
            title="Feeding Guide"
            description="Some basic feeding tips for different pets."
          />

          <div className="row g-4 mt-3">
            {feedingTips.map((item, index) => (
              <div className="col-lg-4" key={index}>
                <div className="feeding-card">
                  <h3>{item.pet}</h3>
                  <ul>
                    {item.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="care-note">
          <h3>Important Reminder ❤️</h3>
          <p>
            Every pet has different health and nutritional needs.
            Consult a qualified veterinarian before making major
            changes to your pet's diet or care routine.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CareFeeding;

