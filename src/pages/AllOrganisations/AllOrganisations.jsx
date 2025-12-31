import { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import {
  fetchOrganizationsStart,
  fetchOrganizationsSuccess,
  fetchOrganizationsFailure,
  openCreateModal,
  openEditModal,
  openDeleteModal,
  closeFormModal,
  closeDeleteModal,
  setPage,
  selectOrganizations,
  selectPagination,
  selectOrganizationLoading,
  selectIsFormModalOpen,
  selectIsDeleteModalOpen,
  selectFormMode,
} from '../../store/slices/organizationSlice';
import { organizationApi } from '../../api/organizationApi';
import { Modal } from '../../components/common';
import { OrganizationForm, DeleteConfirmation } from '../../components/organization';
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
import styles from './AllOrganisations.module.css';

/**
 * All Organisations Page
 * Accessible only to Admin users
 * Full CRUD functionality for organizations
 */
const AllOrganisations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organizations = useSelector(selectOrganizations);
  const pagination = useSelector(selectPagination);
  const isLoading = useSelector(selectOrganizationLoading);
  const isFormModalOpen = useSelector(selectIsFormModalOpen);
  const isDeleteModalOpen = useSelector(selectIsDeleteModalOpen);
  const formMode = useSelector(selectFormMode);
  
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch organizations
  const fetchOrganizations = useCallback(async (page = 1) => {
    dispatch(fetchOrganizationsStart());
    try {
      const response = await organizationApi.getAll(page, pagination.pageSize);
      dispatch(fetchOrganizationsSuccess(response.data));
    } catch (error) {
      dispatch(fetchOrganizationsFailure(error.message || 'Failed to fetch organizations'));
    }
  }, [dispatch, pagination.pageSize]);

  // Initial fetch
  useEffect(() => {
    fetchOrganizations(pagination.page);
  }, [fetchOrganizations, pagination.page]);

  // Handlers
  const handlePageChange = (newPage) => dispatch(setPage(newPage));
  const handleCreate = () => dispatch(openCreateModal());
  const handleEdit = (org) => dispatch(openEditModal(org));
  const handleDelete = (org) => dispatch(openDeleteModal(org));
  const handleViewUsers = (org) => {
    navigate(`${ROUTES.USERS}?orgId=${org.orgId}&orgName=${encodeURIComponent(org.name)}`);
  };
  const handleCloseFormModal = () => dispatch(closeFormModal());
  const handleCloseDeleteModal = () => dispatch(closeDeleteModal());

  // Get status variant for badge
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'active';
      case 'suspended': return 'suspended';
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  // Calculate stats
  const stats = {
    total: pagination.totalCount,
    active: organizations.filter(org => org.status === 'active').length,
    suspended: organizations.filter(org => org.status === 'suspended').length,
  };

  // Filter organizations by search
  const filteredOrgs = searchQuery
    ? organizations.filter(org => 
        org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.contact?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : organizations;

  // Empty state component
  const EmptyState = (
    <>
      <div className={styles.emptyIcon}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
          <path d="M19 21H5" />
          <path d="M9 7h6" />
          <path d="M9 11h6" />
          <path d="M9 15h4" />
        </svg>
      </div>
      <h3>No Organizations Found</h3>
      <p>Get started by creating your first organization.</p>
      <ActionButton
        icon={ActionIcons.add}
        label="Add Organization"
        onClick={handleCreate}
      />
    </>
  );

  // Render table row
  const renderRow = (org) => (
    <>
      <td>
        <AvatarCell
          avatar={org.name?.charAt(0).toUpperCase()}
          title={org.name}
          subtitle={org.orgId}
        />
      </td>
      <td>
        <div className={styles.contactCell}>
          <span className={styles.contactEmail}>{org.contact?.email}</span>
          <span className={styles.contactLocation}>
            {org.contact?.address?.city}, {org.contact?.address?.country}
          </span>
        </div>
      </td>
      <td>
        <StatusBadge status={org.status} variant={getStatusVariant(org.status)} />
      </td>
      <td>
        <span className={styles.userLimit}>{org.subscription?.limits?.userLimit || '-'}</span>
      </td>
      <td>
        <ActionButtons>
          <ActionBtn
            icon={TableIcons.users}
            onClick={() => handleViewUsers(org)}
            title="View Users"
            variant="users"
          />
          <ActionBtn
            icon={TableIcons.edit}
            onClick={() => handleEdit(org)}
            title="Edit"
          />
          <ActionBtn
            icon={TableIcons.delete}
            onClick={() => handleDelete(org)}
            title="Delete"
            variant="delete"
          />
        </ActionButtons>
      </td>
    </>
  );

  // Table columns
  const columns = [
    { key: 'name', label: 'Organization' },
    { key: 'contact', label: 'Contact' },
    { key: 'status', label: 'Status' },
    { key: 'userLimit', label: 'User Limit' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <PageHeader
          badge="Admin Dashboard"
          title="Organizations"
          subtitle="Manage all organizations in your SaaS platform"
        />

        {/* Stats */}
        <StatsGrid columns={3}>
          <StatCard
            icon={StatIcons.organization}
            value={stats.total}
            label="Total Organizations"
          />
          <StatCard
            icon={StatIcons.active}
            value={stats.active}
            label="Active"
            variant="active"
          />
          <StatCard
            icon={StatIcons.warning}
            value={stats.suspended}
            label="Suspended"
            variant="warning"
          />
        </StatsGrid>

        {/* Actions Bar */}
        <ActionsBar
          searchPlaceholder="Search organizations..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        >
          <ActionButton
            icon={ActionIcons.add}
            label="Add Organization"
            onClick={handleCreate}
          />
        </ActionsBar>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredOrgs}
          isLoading={isLoading}
          emptyState={EmptyState}
          renderRow={renderRow}
          keyExtractor={(item) => item.id}
        />

        {/* Pagination */}
        {filteredOrgs.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            pageSize={pagination.pageSize}
            totalCount={pagination.totalCount}
            hasMore={pagination.hasMore}
            onPageChange={handlePageChange}
            itemLabel="organizations"
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={formMode === 'edit' ? 'Edit Organization' : 'Create Organization'}
        size="large"
      >
        <OrganizationForm />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Confirm Deletion"
        size="small"
      >
        <DeleteConfirmation />
      </Modal>
    </div>
  );
};

export default AllOrganisations;
