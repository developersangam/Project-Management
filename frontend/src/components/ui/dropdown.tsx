import * as React from "react"
import { cn } from "../../lib/utils"

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, isOpen, onToggle }) => {
  return (
    <div className="relative">
      <div onClick={onToggle}>
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
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

export const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick }) => (
  <div
    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
  >
    {children}
  </div>
);