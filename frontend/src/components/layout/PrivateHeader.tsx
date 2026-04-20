"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { switchOrganization } from "../../store/organization/organizationThunk";
import { logoutThunk } from "../../store/auth/authThunk";
import { Dropdown, DropdownItem } from "../ui/dropdown";
import { Breadcrumb } from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import { ChevronDown, User, LogOut, Building, Plus } from "lucide-react";

const getBreadcrumbs = (
  pathname: string,
): Array<{ label: string; href?: string }> => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && segments[0] === "dashboard") {
    return [];
  }

  const breadcrumbs = [];

  if (segments.includes("projects")) {
    const projectIndex = segments.indexOf("projects");
    if (projectIndex === 0) {
      breadcrumbs.push({ label: "Projects", href: "/projects" });
    }
    if (segments.includes("board") && segments.length > projectIndex + 2) {
      const projectSlug = segments[projectIndex + 1];
      breadcrumbs.push({
        label:
          projectSlug.charAt(0).toUpperCase() +
          projectSlug.slice(1).replace("-", " "),
        href: `/projects/${projectSlug}`,
      });
      breadcrumbs.push({ label: "Board" });
    } else if (
      segments.includes("members") &&
      segments.length > projectIndex + 2
    ) {
      const projectSlug = segments[projectIndex + 1];
      breadcrumbs.push({
        label:
          projectSlug.charAt(0).toUpperCase() +
          projectSlug.slice(1).replace("-", " "),
        href: `/projects/${projectSlug}`,
      });
      breadcrumbs.push({ label: "Members" });
    } else if (
      segments.length > projectIndex + 1 &&
      !segments.includes("board")
    ) {
      const projectSlug = segments[projectIndex + 1];
      breadcrumbs.push({
        label:
          projectSlug.charAt(0).toUpperCase() +
          projectSlug.slice(1).replace("-", " "),
      });
    }
  } else if (segments.includes("organizations")) {
    const orgIndex = segments.indexOf("organizations");
    if (orgIndex === 0) {
      breadcrumbs.push({ label: "Organizations", href: "/organizations" });
    }
    if (segments.includes("settings") && segments.length > orgIndex + 2) {
      const orgSlug = segments[orgIndex + 1];
      breadcrumbs.push({
        label:
          orgSlug.charAt(0).toUpperCase() + orgSlug.slice(1).replace("-", " "),
        href: `/organizations/${orgSlug}`,
      });
      breadcrumbs.push({ label: "settings" });
    } else if (segments.length > orgIndex + 1) {
      const orgSlug = segments[orgIndex + 1];
      breadcrumbs.push({
        label:
          orgSlug.charAt(0).toUpperCase() + orgSlug.slice(1).replace("-", " "),
        href: `/organizations/${orgSlug}`,
      });
    }
  } else if (segments.includes("analytics")) {
    breadcrumbs.push({ label: "Analytics" });
  } else if (segments.includes("settings")) {
    breadcrumbs.push({ label: "Settings" });
  }

  return breadcrumbs;
};

export const PrivateHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { organizations, currentOrganization } = useAppSelector(
    (state) => state.organization,
  );
  const { user } = useAppSelector((state) => state.auth);
  const [orgDropdownOpen, setOrgDropdownOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const breadcrumbs = getBreadcrumbs(pathname);

  const handleOrgSwitch = (org: any) => {
    dispatch(switchOrganization(org));
    setOrgDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutThunk());
    setUserDropdownOpen(false);
  };
  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      <div className="flex items-center space-x-4 lg:space-x-6 flex-1">
        {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
      </div>

      <div className="flex items-center space-x-2 lg:space-x-3">
        <ThemeToggle />
        
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center space-x-2"
          type="button"
          onClick={() => router.push("/organizations/create")}
        >
          <Plus className="w-4 h-4" />
          <span>Create</span>
        </Button>

        <Dropdown
          isOpen={orgDropdownOpen}
          onToggle={() => setOrgDropdownOpen(!orgDropdownOpen)}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-[10px] font-bold">
                {currentOrganization?.organization?.name
                  ?.charAt(0)
                  .toUpperCase() || "O"}
              </div>
              <span className="hidden lg:inline text-sm font-medium">
                {currentOrganization?.organization?.name || "Select Org"}
              </span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          }
        >
          {/* Wrapper for the internal sections */}
          <div className="flex flex-col">
            {/* HEADER */}
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-500 bg-slate-50/50 border-b border-slate-100">
              Switch Organization
            </div>

            {/* SCROLLABLE LIST */}
            <div className="max-h-[250px] overflow-y-auto">
              {organizations.map((org) => (
                <DropdownItem
                  key={org?.organization?.id}
                  onClick={() => handleOrgSwitch(org)}
                >
                  <div className="flex items-center px-3 py-2">
                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-600 text-[10px] font-bold mr-3">
                      {org?.organization?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium truncate text-slate-700">
                      {org?.organization?.name}
                    </span>
                  </div>
                </DropdownItem>
              ))}
            </div>

            {/* FOOTER */}
            <div className="border-t border-slate-100 p-1">
              <DropdownItem
                onClick={() => {
                  setOrgDropdownOpen(false);
                  router.push("/organizations/create");
                }}
              >
                <div className="flex items-center px-2 py-1.5 text-sm text-primary font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Organization
                </div>
              </DropdownItem>
            </div>
          </div>
        </Dropdown>

        <Dropdown
          isOpen={userDropdownOpen}
          align="right"
          onToggle={() => setUserDropdownOpen(!userDropdownOpen)}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-3 px-2 lg:px-3 h-10 hover:bg-slate-100 transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user?.userName?.charAt(0).toUpperCase() || "G"}
              </div>

              {/* Name and Role Label */}
              <div className="hidden md:flex flex-col items-start text-left leading-tight">
                <span className="text-sm font-semibold text-slate-700 truncate max-w-[100px]">
                  {user?.userName || "Guest"}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold">
                  {currentOrganization?.organization?.owner
                    ? "Owner"
                    : "Member"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </Button>
          }
        >
          <div className="flex flex-col w-56">
            {/* Account Info Section */}
            <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                Account
              </p>
              <p className="text-sm font-medium text-slate-700 truncate">
                {user?.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <DropdownItem onClick={() => router.push("/profile")}>
                <div className="flex items-center px-4 py-2 text-sm text-slate-600 font-medium">
                  <User className="w-4 h-4 mr-3 text-slate-400" />
                  Profile Settings
                </div>
              </DropdownItem>

              <DropdownItem
                onClick={() => router.push("/settings/organization")}
              >
                <div className="flex items-center px-4 py-2 text-sm text-slate-600 font-medium">
                  <Building className="w-4 h-4 mr-3 text-slate-400" />
                  Organization Settings
                </div>
              </DropdownItem>
            </div>

            {/* Footer / Logout */}
            <div className="border-t border-slate-100 mt-1 py-1 bg-slate-50/30">
              <DropdownItem onClick={handleLogout}>
                <div className="flex items-center px-4 py-2 text-sm text-red-600 font-semibold">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </div>
              </DropdownItem>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
