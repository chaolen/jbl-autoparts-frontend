import React from "react";
import { NavLink } from "react-router";

type MobileNavLinkProps = {
  path: string;
  label: string;
  icon: string;
  state?: any;
  disableActive?: boolean;
  onClick?: () => void;
};

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  icon,
  label,
  path,
  state,
  disableActive,
  onClick,
}) => {
  return (
    <NavLink
      to={path}
      state={state}
      onClick={onClick}
      className={({ isActive }) =>
        `flex flex-row p-2 transition text-white text-xl ${
          isActive && !disableActive
            ? "border-primary font-bold underline underline-offset-8"
            : "font-semibold hover:underline hover:underline-offset-8"
        }`
      }
    >
      {label}
    </NavLink>
  );
};

export default MobileNavLink;
