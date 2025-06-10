import React from "react";
import { NavLink } from "react-router";

type SidebarNavLinkProps = {
  path: string;
  label: string;
  icon: string;
  state?: any;
  disableActive?: boolean;
  onClick?: () => void;
};

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
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
        `flex flex-row p-2 transition ${
          isActive && !disableActive
            ? "border-primary font-bold underline underline-offset-8"
            : "font-semibold hover:underline hover:underline-offset-8"
        }`
      }
    >
      <img src={icon} alt="dashboard" className="mr-2" />
      {label}
    </NavLink>
  );
};

export default SidebarNavLink;
