
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AddPet from "./AddPet";
import MyPets from "./MyPets";
import EditPet from "./EditPet";
import PetDocuments from "./PetDocuments";
import VaccinationCalendar from "./VaccinationCalendar";
import MyAdoptions from "./MyAdoptions";
import AdoptionRequests from "../Components/AdoptionRequests";
import Wishlist from "./Wishlist";
import Profile from "./Profile";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("pawhavenUser") || "null"
  );

  const [activeMenu, setActiveMenu] = useState("My Adoption Posts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingPetId, setEditingPetId] = useState(null);

  const menuItems = [
    { name: "Add Your Pet", icon: "➕" },
    { name: "My Adoption Posts", icon: "🐾" },
    { name: "Adoption Requests", icon: "📩" },
    { name: "Pet Documents", icon: "📄" },
    { name: "Vaccination Calendar", icon: "📅" },
    { name: "My Adoptions", icon: "🏡" },
    { name: "Wishlist", icon: "❤️" },
    { name: "My Profile", icon: "👤" },
  ];

  const handleMenuClick = (name) => {
    setActiveMenu(name);
    setEditingPetId(null);
    setSidebarOpen(false);
  };

  const handleEditPet = (id) => {
    setEditingPetId(id);
  };

  const handleBackFromEdit = () => {
    setEditingPetId(null);
  };

  const handleEditSuccess = () => {
    setEditingPetId(null);
  };

  const renderContent = () => {
    if (editingPetId !== null) {
      return (
        <EditPet
          petId={editingPetId}
          onBack={handleBackFromEdit}
          onSaved={handleEditSuccess}
        />
      );
    }

    switch (activeMenu) {
      case "Add Your Pet":
        return <AddPet />;

      case "My Adoption Posts":
        return <MyPets onEdit={handleEditPet} />;

      case "Adoption Requests":
        return <AdoptionRequests />;

      case "Pet Documents":
        return <PetDocuments />;

      case "Vaccination Calendar":
        return <VaccinationCalendar />;

      case "My Adoptions":
        return <MyAdoptions />;

      case "Wishlist":
        return <Wishlist />;

      case "My Profile":
        return <Profile />;

      default:
        return <MyPets onEdit={handleEditPet} />;
    }
  };

  return (
    <div style={styles.dashboard}>
      <button
        style={styles.mobileMenu}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰ Dashboard Menu
      </button>

      <aside
        style={{
          ...styles.sidebar,
          ...(sidebarOpen ? styles.sidebarOpen : {}),
        }}
      >
        <h2 style={styles.sidebarTitle}>🐾 PawHaven</h2>

        <p style={styles.sidebarSubtitle}>
          User Dashboard
        </p>

        <div style={styles.menuList}>
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleMenuClick(item.name)}
              style={{
                ...styles.menuButton,
                ...(activeMenu === item.name
                  ? styles.activeMenu
                  : {}),
              }}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <button
          style={styles.logoutButton}
          onClick={() => {
            localStorage.removeItem("pawhavenUser");
            navigate("/login");
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main style={styles.mainContent}>
        <div style={styles.topBar}>
          <h1 style={styles.heading}>
            {editingPetId !== null
              ? "Edit Pet Details"
              : activeMenu}
          </h1>

          <p style={styles.welcome}>
            Welcome back, {user?.name || "Pet Lover"}! 🐾
          </p>
        </div>

        <div style={styles.contentArea}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

const styles = {
  dashboard: {
    display: "flex",
    minHeight: "75vh",
    background: "#FFF8F3",
    position: "relative",
  },

  sidebar: {
    width: "260px",
    minWidth: "260px",
    background: "#F3E5DC",
    color: "#604735",
    padding: "25px 15px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #EAD8CC",
  },

  sidebarOpen: {
    display: "flex",
  },

  sidebarTitle: {
    color: "#765846",
    fontSize: "25px",
    margin: "0 0 5px",
  },

  sidebarSubtitle: {
    color: "#A18472",
    margin: "0 0 30px",
  },

  menuList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  menuButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 15px",
    border: "none",
    borderRadius: "10px",
    background: "transparent",
    color: "#604735",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "15px",
    fontWeight: "500",
  },

  activeMenu: {
    background: "#FFFFFF",
    color: "#76513D",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  logoutButton: {
    marginTop: "auto",
    padding: "13px",
    border: "none",
    borderRadius: "10px",
    background: "#765846",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
  },

  mainContent: {
    flex: 1,
    minWidth: 0,
    padding: "30px",
  },

  topBar: {
    marginBottom: "25px",
  },

  heading: {
    color: "#604735",
    fontSize: "28px",
    margin: "0 0 8px",
  },

  welcome: {
    color: "#A18472",
    margin: 0,
  },

  contentArea: {
    width: "100%",
    minWidth: 0,
  },

  mobileMenu: {
    display: "none",
  },

  overlay: {
    display: "none",
  },
};

export default Dashboard;

