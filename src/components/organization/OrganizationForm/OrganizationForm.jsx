import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../common';
import { organizationApi } from '../../../api/organizationApi';
import {
  createOrganizationSuccess,
  updateOrganizationSuccess,
  closeFormModal,
  setError,
  selectSelectedOrganization,
  selectFormMode,
  selectOrganizationError,
} from '../../../store/slices/organizationSlice';
import styles from './OrganizationForm.module.css';

/**
 * Organization Form Component
 * Handles both creation and editing of organizations
 */
const OrganizationForm = () => {
  const dispatch = useDispatch();
  const selectedOrganization = useSelector(selectSelectedOrganization);
  const formMode = useSelector(selectFormMode);
  const error = useSelector(selectOrganizationError);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    contact: {
      email: '',
      phone: {
        countryCode: '+91',
        number: '',
      },
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'IN',
      },
    },
    subscription: {
      userLimit: 5,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (formMode === 'edit' && selectedOrganization) {
      setFormData({
        name: selectedOrganization.name || '',
        status: selectedOrganization.status || 'active',
        contact: {
          email: selectedOrganization.contact?.email || '',
          phone: {
            countryCode: selectedOrganization.contact?.phone?.countryCode || '+91',
            number: selectedOrganization.contact?.phone?.number || '',
          },
          address: {
            line1: selectedOrganization.contact?.address?.line1 || '',
            line2: selectedOrganization.contact?.address?.line2 || '',
            city: selectedOrganization.contact?.address?.city || '',
            state: selectedOrganization.contact?.address?.state || '',
            postalCode: selectedOrganization.contact?.address?.postalCode || '',
            country: selectedOrganization.contact?.address?.country || 'IN',
          },
        },
        subscription: {
          userLimit: selectedOrganization.subscription?.limits?.userLimit || 5,
        },
      });
    }
  }, [formMode, selectedOrganization]);

  // Validation function
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Organization name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 200) {
      errors.name = 'Name must be less than 200 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.contact.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.contact.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but if provided must be valid)
    if (formData.contact.phone.number && !/^\d{10}$/.test(formData.contact.phone.number)) {
      errors.phone = 'Phone number must be 10 digits';
    }

    // Address validation
    if (!formData.contact.address.line1.trim()) {
      errors.addressLine1 = 'Address line 1 is required';
    }
    if (!formData.contact.address.city.trim()) {
      errors.city = 'City is required';
    }
    if (!formData.contact.address.state.trim()) {
      errors.state = 'State is required';
    }
    if (!formData.contact.address.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    }

    // Subscription validation
    if (formData.subscription.userLimit < 1 || formData.subscription.userLimit > 1000) {
      errors.userLimit = 'User limit must be between 1 and 1000';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Handle nested fields
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload
      const payload = {
        name: formData.name,
        contact: {
          email: formData.contact.email,
          phone: formData.contact.phone.number ? {
            countryCode: formData.contact.phone.countryCode,
            number: formData.contact.phone.number,
          } : undefined,
          address: {
            line1: formData.contact.address.line1,
            line2: formData.contact.address.line2 || undefined,
            city: formData.contact.address.city,
            state: formData.contact.address.state,
            postalCode: formData.contact.address.postalCode,
            country: formData.contact.address.country,
          },
        },
        subscription: {
          userLimit: parseInt(formData.subscription.userLimit, 10),
        },
      };

      if (formMode === 'edit') {
        payload.status = formData.status;
        const response = await organizationApi.update(selectedOrganization.id, payload);
        dispatch(updateOrganizationSuccess(response.data));
      } else {
        const response = await organizationApi.create(payload);
        dispatch(createOrganizationSuccess(response.data));
      }
    } catch (err) {
      dispatch(setError(err.data?.message || err.message || 'An error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    dispatch(closeFormModal());
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <div className={styles.error}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Basic Information Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
            <path d="M19 21H5" />
            <path d="M9 7h6" />
            <path d="M9 11h6" />
            <path d="M9 15h4" />
          </svg>
          Basic Information
        </h3>

        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>
            Organization Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.name ? styles.inputError : ''}`}
            placeholder="Enter organization name"
          />
          {validationErrors.name && <span className={styles.fieldError}>{validationErrors.name}</span>}
        </div>

        {formMode === 'edit' && (
          <div className={styles.inputGroup}>
            <label htmlFor="status" className={styles.label}>Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {/* Contact Information Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Contact Information
        </h3>

        <div className={styles.inputGroup}>
          <label htmlFor="contact.email" className={styles.label}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="contact.email"
            name="contact.email"
            value={formData.contact.email}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.email ? styles.inputError : ''}`}
            placeholder="contact@organization.com"
          />
          {validationErrors.email && <span className={styles.fieldError}>{validationErrors.email}</span>}
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="contact.phone.countryCode" className={styles.label}>Country Code</label>
            <select
              id="contact.phone.countryCode"
              name="contact.phone.countryCode"
              value={formData.contact.phone.countryCode}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="+91">+91 (India)</option>
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+61">+61 (Australia)</option>
              <option value="+49">+49 (Germany)</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="contact.phone.number" className={styles.label}>Phone Number</label>
            <input
              type="tel"
              id="contact.phone.number"
              name="contact.phone.number"
              value={formData.contact.phone.number}
              onChange={handleChange}
              className={`${styles.input} ${validationErrors.phone ? styles.inputError : ''}`}
              placeholder="9876543210"
              maxLength="10"
            />
            {validationErrors.phone && <span className={styles.fieldError}>{validationErrors.phone}</span>}
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Address
        </h3>

        <div className={styles.inputGroup}>
          <label htmlFor="contact.address.line1" className={styles.label}>
            Address Line 1 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="contact.address.line1"
            name="contact.address.line1"
            value={formData.contact.address.line1}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.addressLine1 ? styles.inputError : ''}`}
            placeholder="Street address"
          />
          {validationErrors.addressLine1 && <span className={styles.fieldError}>{validationErrors.addressLine1}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="contact.address.line2" className={styles.label}>Address Line 2</label>
          <input
            type="text"
            id="contact.address.line2"
            name="contact.address.line2"
            value={formData.contact.address.line2}
            onChange={handleChange}
            className={styles.input}
            placeholder="Apartment, suite, etc. (optional)"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="contact.address.city" className={styles.label}>
              City <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="contact.address.city"
              name="contact.address.city"
              value={formData.contact.address.city}
              onChange={handleChange}
              className={`${styles.input} ${validationErrors.city ? styles.inputError : ''}`}
              placeholder="City"
            />
            {validationErrors.city && <span className={styles.fieldError}>{validationErrors.city}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="contact.address.state" className={styles.label}>
              State <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="contact.address.state"
              name="contact.address.state"
              value={formData.contact.address.state}
              onChange={handleChange}
              className={`${styles.input} ${validationErrors.state ? styles.inputError : ''}`}
              placeholder="State"
            />
            {validationErrors.state && <span className={styles.fieldError}>{validationErrors.state}</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="contact.address.postalCode" className={styles.label}>
              Postal Code <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="contact.address.postalCode"
              name="contact.address.postalCode"
              value={formData.contact.address.postalCode}
              onChange={handleChange}
              className={`${styles.input} ${validationErrors.postalCode ? styles.inputError : ''}`}
              placeholder="Postal code"
            />
            {validationErrors.postalCode && <span className={styles.fieldError}>{validationErrors.postalCode}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="contact.address.country" className={styles.label}>Country</label>
            <select
              id="contact.address.country"
              name="contact.address.country"
              value={formData.contact.address.country}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Subscription
        </h3>

        <div className={styles.inputGroup}>
          <label htmlFor="subscription.userLimit" className={styles.label}>
            User Limit <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="subscription.userLimit"
            name="subscription.userLimit"
            value={formData.subscription.userLimit}
            onChange={handleChange}
            className={`${styles.input} ${validationErrors.userLimit ? styles.inputError : ''}`}
            min="1"
            max="1000"
          />
          {validationErrors.userLimit && <span className={styles.fieldError}>{validationErrors.userLimit}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader size="small" variant="dots" />
          ) : (
            <>
              <span>{formMode === 'edit' ? 'Update Organization' : 'Create Organization'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default OrganizationForm;

