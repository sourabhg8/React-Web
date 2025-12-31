import { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { selectUser } from '../../store/slices/authSlice';
import {
  setCurrentOrg,
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  openCreateModal,
  openEditModal,
  openDeleteModal,
  closeFormModal,
  closeDeleteModal,
  setPage,
  resetUserState,
  selectUsers,
  selectCurrentOrg,
  selectUserPagination,
  selectUserLoading,
  selectIsUserFormModalOpen,
  selectIsUserDeleteModalOpen,
  selectUserFormMode,
  setSelectedUser,
  clearSelectedUser,
  selectSelectedUser,
} from '../../store/slices/userSlice';
import { userApi } from '../../api/userApi';
import { Modal } from '../../components/common';
import { UserForm, UserDeleteConfirmation } from '../../components/user';
import { ROLES, ROUTES } from '../../utils/constants';
import {
  PageHeader,
  StatsGrid,
  StatCard,
  StatIcons,
  ActionsBar,
  ActionButton,
  ActionIcons,
  DataTable,
  AvatarCell,
  StatusBadge,
  ActionButtons,
  ActionBtn,
  TableIcons,
  Pagination,
} from '../../components/shared';
import styles from './Users.module.css';

/**
 * Users Page
 * Manages users for an organization
 * Accessible to Platform Admin (for any org) and Org Admin (for their org)
 */
const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const currentUser = useSelector(selectUser);
  const users = useSelector(selectUsers);
  const currentOrg = useSelector(selectCurrentOrg);
  const pagination = useSelector(selectUserPagination);
  const isLoading = useSelector(selectUserLoading);
  const isFormModalOpen = useSelector(selectIsUserFormModalOpen);
  const isDeleteModalOpen = useSelector(selectIsUserDeleteModalOpen);
  const formMode = useSelector(selectUserFormMode);
  const selectedUser = useSelector(selectSelectedUser);

  const [searchQuery, setSearchQuery] = useState('');
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  // Set organization context from URL params or user's org
  useEffect(() => {
    const orgIdParam = searchParams.get('orgId');
    const orgNameParam = searchParams.get('orgName');

    let newOrgId = null;
    let newOrgName = null;

    if (orgIdParam && orgNameParam) {
      newOrgId = orgIdParam;
      newOrgName = orgNameParam;
    } else if (currentUser?.userType === ROLES.ORG_ADMIN) {
      newOrgId = currentUser.orgId;
      newOrgName = currentUser.orgName;
    }

    if (newOrgId && newOrgId !== currentOrg.orgId) {
      dispatch(resetUserState());
      dispatch(setCurrentOrg({ orgId: newOrgId, orgName: newOrgName }));
    } else if (!newOrgId && !currentOrg.orgId) {
      navigate(ROUTES.ALL_ORGANISATIONS);
    }
  }, [searchParams, currentUser, currentOrg.orgId, dispatch, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetUserState());
    };
  }, [dispatch]);

  // Fetch users
  const fetchUsers = useCallback(async (page = 1) => {
    if (!currentOrg.orgId) return;

    dispatch(fetchUsersStart());
    try {
      const response = await userApi.getAll(currentOrg.orgId, page, pagination.pageSize);
      dispatch(fetchUsersSuccess(response.data));
    } catch (error) {
      dispatch(fetchUsersFailure(error.message || 'Failed to fetch users'));
    }
  }, [dispatch, currentOrg.orgId, pagination.pageSize]);

  // Fetch users when org changes or page changes
  useEffect(() => {
    if (currentOrg.orgId) {
      fetchUsers(pagination.page);
    }
  }, [fetchUsers, currentOrg.orgId, pagination.page]);

  // Handlers
  const handlePageChange = (newPage) => dispatch(setPage(newPage));
  const handleCreate = () => dispatch(openCreateModal());
  const handleEdit = (user) => dispatch(openEditModal(user));
  const handleDelete = (user) => dispatch(openDeleteModal(user));
  const handleCloseFormModal = () => dispatch(closeFormModal());
  const handleCloseDeleteModal = () => dispatch(closeDeleteModal());
  const handleBackToOrgs = () => navigate(ROUTES.ALL_ORGANISATIONS);

  // Reset Password Handlers
  const handleResetPassword = (user) => {
    dispatch(setSelectedUser(user));
    setIsResetPasswordModalOpen(true);
    setResetMessage(null);
  };

  const handleCloseResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
    dispatch(clearSelectedUser());
    setResetMessage(null);
  };

  const handleConfirmResetPassword = async () => {
    if (!selectedUser) return;
    
    setIsResetting(true);
    try {
      await userApi.resetPassword(selectedUser.id);
      setResetMessage({
        type: 'success',
        text: `Password reset successfully! New password: first 4 letters of email + "_" + first 4 letters of name (lowercase)`
      });
      // Keep modal open to show success message
    } catch (error) {
      setResetMessage({
        type: 'error',
        text: error.message || 'Failed to reset password'
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Get status variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'active';
      case 'suspended': return 'suspended';
      default: return '';
    }
  };

  // Get user type display
  const getUserTypeDisplay = (userType) => {
    switch (userType) {
      case 'org_admin': return 'Org Admin';
      case 'org_user': return 'User';
      default: return userType;
    }
  };

  // Calculate stats
  const stats = {
    total: pagination.totalCount,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.userType === 'org_admin').length,
  };

  const isPlatformAdmin = currentUser?.userType === ROLES.PLATFORM_ADMIN;

  // Filter users by search
  const filteredUsers = searchQuery
    ? users.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  // Empty state component
  const EmptyState = (
    <>
      <div className={styles.emptyIcon}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <h3>No Users Found</h3>
      <p>Get started by adding your first user to this organization.</p>
      <ActionButton
        icon={ActionIcons.add}
        label="Add User"
        onClick={handleCreate}
      />
    </>
  );

  // Render table row
  const renderRow = (user) => (
    <>
      <td>
        <AvatarCell
          avatar={user.name?.charAt(0).toUpperCase()}
          title={user.name}
          subtitle={user.userId}
        />
      </td>
      <td>
        <span className={styles.email}>{user.email}</span>
      </td>
      <td>
        <span className={`${styles.roleBadge} ${styles[user.userType]}`}>
          {getUserTypeDisplay(user.userType)}
        </span>
      </td>
      <td>
        <StatusBadge status={user.status} variant={getStatusVariant(user.status)} />
      </td>
      <td>
        <ActionButtons>
          <ActionBtn
            icon={TableIcons.edit}
            onClick={() => handleEdit(user)}
            title="Edit"
          />
          <ActionBtn
            icon={TableIcons.resetPassword}
            onClick={() => handleResetPassword(user)}
            title="Reset Password"
            variant="warning"
          />
          <ActionBtn
            icon={TableIcons.delete}
            onClick={() => handleDelete(user)}
            title="Delete"
            variant="delete"
          />
        </ActionButtons>
      </td>
    </>
  );

  // Table columns
  const columns = [
    { key: 'name', label: 'User' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <PageHeader
          badge={currentOrg.orgName}
          title="Users"
          subtitle="Manage users in this organization"
          onBack={isPlatformAdmin ? handleBackToOrgs : undefined}
          backLabel="Back to Organizations"
        />

        {/* Stats */}
        <StatsGrid columns={3}>
          <StatCard
            icon={StatIcons.users}
            value={stats.total}
            label="Total Users"
          />
          <StatCard
            icon={StatIcons.active}
            value={stats.active}
            label="Active"
            variant="active"
          />
          <StatCard
            icon={StatIcons.star}
            value={stats.admins}
            label="Admins"
            variant="primary"
          />
        </StatsGrid>

        {/* Actions Bar */}
        <ActionsBar
          searchPlaceholder="Search users..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        >
          <ActionButton
            icon={ActionIcons.add}
            label="Add User"
            onClick={handleCreate}
          />
        </ActionsBar>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading}
          emptyState={EmptyState}
          renderRow={renderRow}
          keyExtractor={(item) => item.id}
        />

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            pageSize={pagination.pageSize}
            totalCount={pagination.totalCount}
            hasMore={pagination.hasMore}
            onPageChange={handlePageChange}
            itemLabel="users"
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={formMode === 'edit' ? 'Edit User' : 'Create User'}
        size="medium"
      >
        <UserForm />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Confirm Deletion"
        size="small"
      >
        <UserDeleteConfirmation />
      </Modal>

      {/* Reset Password Confirmation Modal */}
      <Modal
        isOpen={isResetPasswordModalOpen}
        onClose={handleCloseResetPasswordModal}
        title="Reset Password"
        size="small"
      >
        <div className={styles.resetPasswordModal}>
          {!resetMessage ? (
            <>
              <div className={styles.resetPasswordIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
              </div>
              <p className={styles.resetPasswordText}>
                Are you sure you want to reset the password for <strong>{selectedUser?.name}</strong>?
              </p>
              <p className={styles.resetPasswordHint}>
                New password will be: first 4 letters of email + &quot;_&quot; + first 4 letters of name (lowercase)
              </p>
              <div className={styles.resetPasswordActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={handleCloseResetPasswordModal}
                  disabled={isResetting}
                >
                  Cancel
                </button>
                <button
                  className={styles.resetBtn}
                  onClick={handleConfirmResetPassword}
                  disabled={isResetting}
                >
                  {isResetting ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={`${styles.resetPasswordIcon} ${styles[resetMessage.type]}`}>
                {resetMessage.type === 'success' ? (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
              </div>
              <p className={`${styles.resetPasswordText} ${styles[resetMessage.type]}`}>
                {resetMessage.text}
              </p>
              <div className={styles.resetPasswordActions}>
                <button
                  className={styles.closeBtn}
                  onClick={handleCloseResetPasswordModal}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Users;
