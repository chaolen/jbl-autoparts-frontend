import React from "react";

type MobileHeaderProps = {
  toggleDrawer: () => void;
};

const MobileHeader = ({ toggleDrawer }: MobileHeaderProps) => {
  return (
    <header className="bg-gray-800 text-white p-4 flex flex-row justify-between items-center">
      <img
        src="/images/jbl-logo-white.svg"
        alt="hero-logo"
        className="rounded-lg w-[130px] h-[50px]"
      />
      <button onClick={toggleDrawer}>
        <img src="/images/menu.svg" alt="menu" className="h-[30px] w-[30px] " />
      </button>
    </header>
  );
};
export default MobileHeader;
