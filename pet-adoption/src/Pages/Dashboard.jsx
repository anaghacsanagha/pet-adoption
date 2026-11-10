
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

  // Detect dark mode from the existing app wrapper
  const isDarkMode = document.querySelector(".pawhaven-app")?.classList.contains("dark-mode");

  const colors = {
    background: isDarkMode ? "#171d19" : "#FFF8F3",
    sidebar: isDarkMode ? "#202923" : "#F3E5DC",
    text: isDarkMode ? "#F3F0E9" : "#604735",
    heading: isDarkMode ? "#F3F0E9" : "#604735",
    muted: isDarkMode ? "#BDC4BA" : "#A18472",
    border: isDarkMode ? "#465449" : "#EAD8CC",
    active: isDarkMode ? "#465B49" : "#FFFFFF",
    activeText: "#FFFFFF",
    hover: isDarkMode ? "#334139" : "#EAD9CD",
    logout: isDarkMode ? "#647E62" : "#765846",
  };

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

  const styles = {
    dashboard: {
      display: "flex",
      minHeight: "75vh",
      width: "100%",
      background: colors.background,
      position: "relative",
      color: colors.text,
      transition: "background 0.3s ease",
    },

    sidebar: {
      width: "260px",
      minWidth: "260px",
      background: colors.sidebar,
      color: colors.text,
      padding: "25px 15px",
      display: "flex",
      flexDirection: "column",
      borderRight: `1px solid ${colors.border}`,
      transition: "background 0.3s ease",
    },

    sidebarOpen: {
      display: "flex",
    },

    sidebarTitle: {
      color: colors.heading,
      fontSize: "25px",
      margin: "0 0 5px",
    },

    sidebarSubtitle: {
      color: colors.muted,
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
      width: "100%",
      padding: "13px 15px",
      border: "none",
      borderRadius: "10px",
      background: "transparent",
      color: colors.text,
      cursor: "pointer",
      textAlign: "left",
      fontSize: "15px",
      fontWeight: "500",
      transition: "0.2s ease",
    },

    activeMenu: {
      background: colors.active,
      color: colors.activeText,
      fontWeight: "bold",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },

    logoutButton: {
      marginTop: "auto",
      padding: "13px",
      border: "none",
      borderRadius: "10px",
      background: colors.logout,
      color: "#FFFFFF",
      cursor: "pointer",
      fontSize: "15px",
    },

    mainContent: {
      flex: 1,
      minWidth: 0,
      padding: "30px",
      background: colors.background,
      transition: "background 0.3s ease",
    },

    topBar: {
      marginBottom: "25px",
    },

    heading: {
      color: colors.heading,
      fontSize: "28px",
      margin: "0 0 8px",
    },

    welcome: {
      color: colors.muted,
      margin: 0,
    },

    contentArea: {
      width: "100%",
      minWidth: 0,
      color: colors.text,
    },

    mobileMenu: {
      display: "none",
    },

    overlay: {
      display: "none",
    },
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

        <p style={styles.sidebarSubtitle}>User Dashboard</p>

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
              onMouseEnter={(e) => {
                if (activeMenu !== item.name) {
                  e.currentTarget.style.background = colors.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.name) {
                  e.currentTarget.style.background = "transparent";
                }
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

      <style>{`
        @media (max-width: 992px) {
          .dashboard-mobile-placeholder {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
