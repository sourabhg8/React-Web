import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Loader } from "../../common";
import styles from "./LoginForm.module.css";

/**
 * Login Form component
 * Handles user login with username and password
 */
const LoginForm = () => {
  const { login, isLoading, error, clearAuthError } = useAuth();

  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      clearAuthError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Username || !formData.Password) {
      return;
    }

    await login(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to your account to continue</p>
      </div>

      {error && (
        <div className={styles.error}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="Username" className={styles.label}>
          Username
        </label>
        <div className={styles.inputWrapper}>
          <svg
            className={styles.inputIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <input
            type="text"
            id="Username"
            name="Username"
            value={formData.Username}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="Password" className={styles.label}>
          Password
        </label>
        <div className={styles.inputWrapper}>
          <svg
            className={styles.inputIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            id="Password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={styles.options}>
        <label className={styles.remember}>
          <input type="checkbox" />
          <span className={styles.checkmark}></span>
          <span>Remember me</span>
        </label>
        <a href="#forgot" className={styles.forgotLink}>
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isLoading || !formData.Username || !formData.Password}
      >
        {isLoading ? (
          <Loader size="small" variant="dots" />
        ) : (
          <>
            <span>Sign In</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </>
        )}
      </button>

      <p className={styles.signupText}>
        Don&apos;t have an account?{" "}
        <a href="#signup" className={styles.signupLink}>
          Create one
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
