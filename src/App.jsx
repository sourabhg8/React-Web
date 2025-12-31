import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

// Layout Components
import { Header, Footer } from "./components/layout";

// Common Components
import { Modal, Loader } from "./components/common";

// Auth Components
import { AuthGuard, LoginForm } from "./components/auth";

// Pages
import { Home, AllOrganisations, OrgAdmin, Search, Users } from "./pages";

// Redux
import {
  selectIsLoginModalOpen,
  selectGlobalLoader,
} from "./store/slices/uiSlice";
import { closeLoginModal } from "./store/slices/uiSlice";
import { useDispatch } from "react-redux";

// Constants
import { ROUTES, ROLES } from "./utils/constants";

function App() {
  const dispatch = useDispatch();
  const isLoginModalOpen = useSelector(selectIsLoginModalOpen);
  const globalLoader = useSelector(selectGlobalLoader);

  const handleCloseLoginModal = () => {
    dispatch(closeLoginModal());
  };

  return (
    <>
      {/* Global Loader */}
      {globalLoader && <Loader fullScreen text="Loading..." />}

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<Home />} />

          {/* Protected Routes - Platform Admin Only */}
          <Route
            path={ROUTES.ALL_ORGANISATIONS}
            element={
              <AuthGuard allowedRoles={ROLES.PLATFORM_ADMIN}>
                <AllOrganisations />
              </AuthGuard>
            }
          />

          {/* Protected Routes - Platform Admin and Org Admin */}
          <Route
            path={ROUTES.USERS}
            element={
              <AuthGuard allowedRoles={[ROLES.PLATFORM_ADMIN, ROLES.ORG_ADMIN]}>
                <Users />
              </AuthGuard>
            }
          />

          {/* Protected Routes - Regular Users */}
          <Route
            path={ROUTES.SEARCH}
            element={
              <AuthGuard allowedRoles={ROLES.ORG_USER}>
                <Search />
              </AuthGuard>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        title="Sign In"
        size="small"
      >
        <LoginForm />
      </Modal>
    </>
  );
}

export default App;
