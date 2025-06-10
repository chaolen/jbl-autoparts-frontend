import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  useChangePasswordMutation,
  useUpdateUserDetailsMutation,
} from "store/apis/userApi";
import { RootState } from "store/store";
import { User } from "types/user";

type ProfileTabProps = {
  refreshData: () => void;
  userDetails: any;
};

const ProfileTab = ({
  refreshData,
  userDetails,
}: ProfileTabProps) => {
  const user = useSelector((state: RootState) => state.user);
  const role =
    user.role === "custom" ? `${user.role} - ${user.customRole}` : user.role;

  const [changePassword] = useChangePasswordMutation();
  const [updateDetails] = useUpdateUserDetailsMutation();

  const [fields, setFields] = useState<User>();
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setFields(userDetails)
  }, [userDetails]);

  const [passwordVisibile, setPasswordVisibile] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const onChangeDetails = (e: any) => {
    const { value, name } = e.target;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const onChangePassword = (e: any) => {
    const { value, name } = e.target;
    setPasswordData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const togglePasswordVisible = (field: string) => {
    if (field === "newPassword") {
      setPasswordVisibile({
        ...passwordVisibile,
        newPassword: !passwordVisibile.newPassword,
      });
    } else {
      setPasswordVisibile({
        ...passwordVisibile,
        confirmPassword: !passwordVisibile.confirmPassword,
      });
    }
  };

  const onSubmitDetails = async () => {
    try {
      if (!fields?.username) {
        toast.error("Username cannot be empty");
        return;
      }
      await updateDetails({
        userId: user.id,
        name: fields.name ?? "",
        username: fields.username ?? "",
      });
      await refreshData();
      setFields({
        ...fields,
        name: fields.name ?? "",
        username: fields.username ?? "",
      });
      toast.success("User details updated!");
    } catch (error) {
      toast.success("Something went wrong try again");
    }
  };

  const saveNewPassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Password do not match", {
        position: "bottom-center",
      });
      return;
    }

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Invalid password", {
        position: "bottom-center",
      });
      return;
    }

    try {
      await changePassword({
        userId: user.id,
        newPassword: passwordData.newPassword,
      });
  
      toast.success("Password updated!");
      setPasswordVisibile({ confirmPassword: false, newPassword: false });
      setPasswordData({ confirmPassword: "", newPassword: "" });
    } catch (error) {
      toast.success("Something went wrong try again");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-gray-500 font-medium text-sm px-1">Name</label>
        <div className="w-1/2 max-lg-custom:w-full">
          <input
            className="appearance-none w-full text-sm text-gray-700 border rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            value={fields?.name}
            name="name"
            onChange={onChangeDetails}
            placeholder="Name"
          />
        </div>
      </div>
      <div>
        <label className="text-gray-500 font-medium text-sm px-1">
          Username
        </label>
        <div className="w-1/2 max-lg-custom:w-full">
          <input
            className="appearance-none w-full text-sm text-gray-700 border rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            value={fields?.username}
            name="username"
            onChange={onChangeDetails}
            placeholder="Username"
          />
        </div>
      </div>
      <div>
        <label className="text-gray-500 font-medium text-sm px-1">
          User Role
        </label>
        <div className="w-1/2 max-lg-custom:w-full">
          <input
            disabled
            className="capitalize appearance-none w-full text-sm text-gray-700 border rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            value={role}
            placeholder="Role"
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={onSubmitDetails}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium max-mobile:w-full"
        >
          Save Details
        </button>
      </div>
      <div className="h-[1px] bg-primary-silver my-5" />
      <p className="font-medium text-md">Password</p>
      <div>
        <label className="text-gray-500 font-medium text-sm px-1 text-primary">
          New Password
        </label>
        <div className="flex items-center border rounded overflow-hidden w-1/2 max-lg-custom:w-full">
          <input
            className="appearance-none w-full text-sm text-gray-700 border rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            type={passwordVisibile.newPassword ? "text" : "password"}
            value={passwordData.newPassword}
            name="newPassword"
            onChange={onChangePassword}
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisible("newPassword")}
            className="p-2 text-gray-500"
          >
            {!passwordVisibile.newPassword ? (
              <img
                src="/images/eye-off.svg"
                alt="eye-off"
                className="h-5 w-5"
              />
            ) : (
              <img src="/images/eye.svg" alt="eye" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <div>
        <label className="text-gray-500 font-medium text-sm px-1 text-primary">
          Confirm Password
        </label>
        <div className="flex items-center border rounded overflow-hidden w-1/2 max-lg-custom:w-full">
          <input
            className="appearance-none w-full text-sm text-gray-700 border rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            type={passwordVisibile.confirmPassword ? "text" : "password"}
            value={passwordData.confirmPassword}
            name="confirmPassword"
            onChange={onChangePassword}
            placeholder="Re-enter password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisible("confirmPassword")}
            className="p-2 text-gray-500"
          >
            {!passwordVisibile.confirmPassword ? (
              <img
                src="/images/eye-off.svg"
                alt="eye-off"
                className="h-5 w-5"
              />
            ) : (
              <img src="/images/eye.svg" alt="eye" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={saveNewPassword}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium max-mobile:w-full"
        >
          Save Password
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
