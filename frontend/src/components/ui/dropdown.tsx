import * as React from "react";
import { cn } from "../../lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  align?: "left" | "right";
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  isOpen,
  onToggle,
  align = "left", // Default to left
}) => {
  const dropdownRef = useClickOutside(() => {
    if (isOpen) onToggle();
  });

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={onToggle} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={cn(
            "absolute mt-2 min-w-[240px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden",
            /* Dynamic Alignment Logic */
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
}) => (
  /* REMOVED px-4 py-2 to prevent double-padding. 
     Now the internal content controls the look. */
  <div
    className="hover:bg-slate-50 cursor-pointer transition-colors w-full"
    onClick={onClick}
  >
    {children}
  </div>
);
