
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./Components/Header";
import Footer from "./Components/Footer";

import Landing from "./Pages/Landing";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Pets from "./Pages/Pets";
import PetDetails from "./Pages/PetDetails";
import Wishlist from "./Pages/Wishlist";
import AdoptionRequest from "./Pages/AdoptionRequest";
import MyAdoptions from "./Pages/MyAdoptions";
import CareFeeding from "./Pages/CareFeeding";
import AdoptionTerms from "./Pages/AdoptionTerms";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Profile from "./Pages/Profile";
import VaccinationCalendar from "./Pages/VaccinationCalendar";
import AddPet from "./Pages/AddPet";
import MyPets from "./Pages/MyPets";
import EditPet from "./Pages/EditPet";
import Dashboard from "./Pages/Dashboard";
import PetDocuments from "./Pages/PetDocuments";

import "./App.css";

// Protected Route
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("pawhavenUser");

  return user ? children : <Navigate to="/login" replace />;
}

// Header and Footer Layout
function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// App Component
function App() {
  return (
    <div className="pawhaven-app">
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* All Pets */}
        <Route
          path="/pets"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Pets />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Pet Details - View More */}
        <Route
          path="/pet/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PetDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Wishlist />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Adoption Request */}
        <Route
          path="/adopt/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AdoptionRequest />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* My Adoptions */}
        <Route
          path="/my-adoptions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyAdoptions />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Care and Feeding */}
        <Route
          path="/care-feeding"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CareFeeding />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Adoption Terms */}
        <Route
          path="/adoption-terms"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AdoptionTerms />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* About */}
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <MainLayout>
                <About />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Contact */}
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Contact />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Vaccination Calendar */}
        <Route
          path="/vaccination-calendar"
          element={
            <ProtectedRoute>
              <MainLayout>
                <VaccinationCalendar />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Add Pet */}
        <Route
          path="/add-pet"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddPet />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* My Pets */}
        <Route
          path="/my-pets"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyPets />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Edit Pet */}
        <Route
          path="/edit-pet/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EditPet />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Pet Documents */}
        <Route
          path="/pet-documents"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PetDocuments />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Invalid Route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </div>
  );
}

export default App;

