import * as React from "react";
import {
  DataTable,
  Input,
  NativeSelect,
  SearchIcon,
  SpinnerIcon,
  useAuth,
} from "@admin/core";
import { USER_ROLE } from "@admin/types";
import type { User } from "@admin/types";
import { useUsersQuery } from "./api/user.api";
import { createUserColumn } from "./components/user.column";
import { ChangeRoleModal } from "./components/change-role-modal";

import { useSessionQuery } from "../settings/api/settings.api";

export function UserPage() {
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  const { data: sessionData, isLoading: isSessionLoading } = useSessionQuery();
  const currentUser = sessionData?.user ?? authUser;

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] =
    React.useState<string>("all");

  const [selectedUserForRole, setSelectedUserForRole] =
    React.useState<User | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);

  // Debounced search query
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useUsersQuery({
    search: debouncedSearch,
    role:
      selectedRoleFilter !== "all"
        ? (selectedRoleFilter as USER_ROLE)
        : undefined,
  });

  const users = data?.users ?? [];

  const handleOpenRoleModal = (targetUser: User) => {
    setSelectedUserForRole(targetUser);
    setIsRoleModalOpen(true);
  };

  const columns = createUserColumn({
    onChangeRole: handleOpenRoleModal,
  });

  const isAuthorized =
    currentUser?.role === USER_ROLE.ADMIN ||
    currentUser?.role === USER_ROLE.SUPER_ADMIN;

  if (isAuthLoading || (isSessionLoading && !currentUser)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center p-6">
        <SpinnerIcon className="size-6 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  if (!isAuthorized && currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center p-6 border border-border rounded-xl bg-sidebar">
        <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-3">
          <span className="text-xl font-bold">!</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          Access Restricted
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          You do not have administrator permissions to view or manage user
          accounts. Contact a system administrator for access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="gap-1 flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            View users and administrators, audit access levels, and assign
            system roles.
          </p>
        </div>
      </div>

      {/* Data Table with Toolbar */}
      <DataTable
        columns={columns}
        data={users}
        toolbar={(table) => (
          <DataTable.Toolbar>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<SearchIcon />}
                containerClassName="h-9 w-64 sm:w-80"
              />
              <NativeSelect
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="h-8 text-xs w-36"
                options={[
                  { value: "all", label: "All Roles" },
                  { value: USER_ROLE.SUPER_ADMIN, label: "Super Admin" },
                  { value: USER_ROLE.ADMIN, label: "Admin" },
                  { value: USER_ROLE.USER, label: "Standard User" },
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              {isLoading && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <SpinnerIcon className="size-3.5" />
                  <span>Syncing...</span>
                </div>
              )}
              <DataTable.ViewOptions table={table} />
            </div>
          </DataTable.Toolbar>
        )}
      />

      {/* Change Role Modal */}
      <ChangeRoleModal
        isOpen={isRoleModalOpen}
        setIsOpen={setIsRoleModalOpen}
        targetUser={selectedUserForRole}
        currentUser={currentUser}
      />
    </div>
  );
}

export default UserPage;
