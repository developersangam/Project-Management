"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { switchOrganization } from "../../store/organization/organizationThunk";
import { logoutThunk } from "../../store/auth/authThunk";
import { Dropdown, DropdownItem } from "../ui/dropdown";
import { Breadcrumb } from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { ChevronDown, User, LogOut, Building, Plus } from "lucide-react";

const getBreadcrumbs = (
  pathname: string,
): Array<{ label: string; href?: string }> => {
  const segments = pathname.split("/").filter(Boolean);
  console.log("Pathname:", pathname);
  console.log("Segments:", segments);
  if (segments.length === 1 && segments[0] === "dashboard") {
    return [];
  }

  const breadcrumbs = [];

  if (segments.includes("projects")) {
    const projectIndex = segments.indexOf("projects");
    console.log("Project index:", projectIndex);
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
    console.log(orgIndex);
    if (orgIndex === 0) {
      breadcrumbs.push({ label: "Organizations", href: "/organizations" });
    }
    if (segments.includes("settings") && segments.length > orgIndex + 2) {
      console.log("Setting");
      const orgSlug = segments[orgIndex + 1];
      breadcrumbs.push({
        label:
          orgSlug.charAt(0).toUpperCase() + orgSlug.slice(1).replace("-", " "),
        href: `/organizations/${orgSlug}`,
      });
      breadcrumbs.push({ label: "settings" });
    } else if (segments.length > orgIndex + 1) {
      console.log("ORG SLUG");
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

export const Header: React.FC = () => {
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
  console.log("Header - Organizations:", organizations);
  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      <div className="flex items-center space-x-4 lg:space-x-6 flex-1">
        {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
      </div>

      <div className="flex items-center space-x-2 lg:space-x-3">
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
          onToggle={() => {
            setOrgDropdownOpen(!orgDropdownOpen);
          }}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 px-2 lg:px-3"
            >
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-medium">
                {currentOrganization?.organization?.name
                  ?.charAt(0)
                  .toUpperCase() || "O"}
              </div>
              <span className="hidden lg:inline text-sm font-medium">
                {currentOrganization?.organization?.name ||
                  "Select Organization"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          }
        >
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b border-border mb-1">
            Switch Organization
          </div>
          {organizations.map((org) => (
            <DropdownItem
              key={org?.organization?.id}
              onClick={() => handleOrgSwitch(org)}
            >
              {console.log("Organization in dropdown:", org)}
              <div className="w-5 h-5 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-medium mr-3">
                {org?.organization?.name?.charAt(0).toUpperCase()}
              </div>
              {org?.organization?.name}
            </DropdownItem>
          ))}
          <div className="border-t border-border mt-1 pt-1">
            <DropdownItem
              onClick={() => {
                setOrgDropdownOpen(false);
                router.push("/organizations/create");
              }}
            >
              <Plus className="w-4 h-4 mr-3" />
              Create Organization
            </DropdownItem>
          </div>
        </Dropdown>

        <Dropdown
          isOpen={userDropdownOpen}
          onToggle={() => setUserDropdownOpen(!userDropdownOpen)}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 px-2 lg:px-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.userName?.charAt(0).toUpperCase() || "G"}
              </div>
              <div className="hidden md:flex flex-col items-start text-left leading-tight">
                <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                  {user?.userName || "Guest"}
                </span>
                {/* Optional: Add the user's role or email in tiny text for a more "Enterprise" feel */}
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  {currentOrganization?.organization?.owner
                    ? "Owner"
                    : "Member"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
          }
        >
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b border-border mb-1">
            {user?.email}
          </div>
          <DropdownItem>
            <User className="w-4 h-4 mr-3" />
            Profile Settings
          </DropdownItem>
          <DropdownItem>
            <Building className="w-4 h-4 mr-3" />
            Organization Settings
          </DropdownItem>
          <div className="border-t border-border mt-1 pt-1">
            <DropdownItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </DropdownItem>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
