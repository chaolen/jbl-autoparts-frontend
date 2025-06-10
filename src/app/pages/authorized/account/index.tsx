import React, { useEffect, useState } from "react";
import ProfileTab from "./components/profile-tab";
import SettingsTab from "./components/settings-tab";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useLazyGetUserDetailsQuery } from "store/apis/userApi";
import { User } from "types/user";

const adminTabs = ["profile"];
// const adminTabs = ["profile", "settings"];
const userTab = ["profile"];

const AccountPage = () => {
  const [getUserDetails, userResponse] = useLazyGetUserDetailsQuery();
  const user = useSelector((state: RootState) => state.user);
  const isAdmin = user.role === "admin";
  const [activeTab, setActiveTab] = useState("profile");
  const tabs = isAdmin ? adminTabs : userTab;
  const [userDetails, setUserDetails] = useState<User>();

  useEffect(() => {
    getUserDetails();
  }, [])

  useEffect(() => {
    if (userResponse?.data && Object.keys(userResponse?.data).length > 0) {
      setUserDetails(userResponse?.data.data);
    }
  }, [userResponse.data]);

  const renderHeader = () => (
    <div className="flex flex-row">
      <p className="text-primary font-semibold text-4xl">Account</p>
    </div>
  );

  return (
    <div className="flex flex-col p-5 py-4 w-full">
      {renderHeader()}
      <div className="flex space-x-4 border-b mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-sm font-medium capitalize ${activeTab === tab
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {activeTab === "profile" && <ProfileTab refreshData={getUserDetails} userDetails={userDetails} />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
};

export default AccountPage;
