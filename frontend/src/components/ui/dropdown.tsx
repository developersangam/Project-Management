import * as React from "react";
import { cn } from "../../lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  isOpen,
  onToggle,
}) => {
  // Use the hook and tell it to call 'onToggle' (or a close function)
  // when a click happens outside.
  const dropdownRef = useClickOutside(() => {
    if (isOpen) onToggle();
  });

  return (
    // Attach the ref here
    <div className="relative" ref={dropdownRef}>
      <div onClick={onToggle}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
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
  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={onClick}>
    {children}
  </div>
);
