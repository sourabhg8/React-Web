import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectUser,
  logout,
} from "../../../store/slices/authSlice";
import { openLoginModal } from "../../../store/slices/uiSlice";
import { ROLES, ROUTES } from "../../../utils/constants";
import ChangePasswordModal from "../../auth/ChangePasswordModal";
import styles from "./Header.module.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLoginClick = () => {
    dispatch(openLoginModal());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.HOME);
  };

  const getDashboardRoute = () => {
    if (!user) return ROUTES.HOME;

    switch (user.role) {
      case ROLES.ADMIN:
        return ROUTES.ALL_ORGANISATIONS;
      case ROLES.ORG_ADMIN:
        return ROUTES.ORG_ADMIN;
      default:
        return ROUTES.SEARCH;
    }
  };

  // Format role for display
  const getDisplayRole = () => {
    if (!user?.role) return "";
    switch (user.role) {
      case ROLES.ADMIN:
      case "platform_admin":
        return "Platform Admin";
      case ROLES.ORG_ADMIN:
      case "org_admin":
        return "Org Admin";
      case "org_user":
        return "User";
      default:
        return user.role;
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          <img src="/logo.png" alt="TehriHills" className={styles.logoImg} />
        </Link>

        <nav className={styles.nav}>
          <Link to={ROUTES.HOME} className={styles.navLink}>
            Home
          </Link>

          {isAuthenticated && (
            <Link to={getDashboardRoute()} className={styles.navLink}>
              Dashboard
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <div className={styles.userMenuWrapper}>
              <button className={styles.userIconBtn} aria-label="User menu">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              <div className={styles.userDropdown}>
                <div className={styles.userInfoSection}>
                  <div className={styles.userAvatar}>
                    {user?.name?.charAt(0).toUpperCase() ||
                      user?.username?.charAt(0).toUpperCase() ||
                      "U"}
                  </div>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>
                      {user?.name || user?.username}
                    </span>
                    <span className={styles.userRole}>{getDisplayRole()}</span>
                  </div>
                </div>
                <div className={styles.dropdownDivider}></div>
                <button
                  className={styles.dropdownItem}
                  onClick={() => setShowChangePassword(true)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Change Password</span>
                </button>
                <div className={styles.dropdownDivider}></div>
                <button
                  className={styles.dropdownLogout}
                  onClick={handleLogout}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <button className={styles.loginBtn} onClick={handleLoginClick}>
              <span>Login</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuBtn} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </header>
  );
};

export default Header;
