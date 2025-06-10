// @ts-nocheck
import Modal from "../../shared/modal";
import { Formik } from "formik";
import { defaultUser } from "constants/default-values";
import * as Yup from "yup";

const predefinedRoles = ["admin", "cashier", "partsman", "custom"];


const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  username: Yup.string().required("Username is required"),
  role: Yup.string().required("Role is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Must be at least 8 characters"),
  customRole: Yup.string().when("role", {
    is: "custom",
    then: (schema) => schema.required("Define the role"),
    otherwise: (schema) => schema,
  }),
});

type AddUserProps = {
  isOpen: boolean;
  toggleModal: () => void;
  onSubmit: (details: any, helpers: any) => void;
}

const AddUser = ({
  isOpen,
  onSubmit,
  toggleModal,
}: AddUserProps) => {

  return (
    <Formik
      initialValues={defaultUser}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
      validateOnChange={true}
      validateOnBlur={false}
    >
      {({
        values,
        handleChange,
        setFieldValue,
        handleBlur,
        touched,
        errors,
        handleSubmit,
      }) => {
        const renderError = (name: string) => (
          <>
            {touched[name] && errors && errors[name] && (
              <p className="text-red-500 text-[10px] mt-1">
                {errors[name]?.toString()}
              </p>
            )}
          </>
        )

        const renderSection = (fullWidth: boolean, label: string, name: string, placeholder: string, fieldType?: string) => {
          return (
            <div className={`max-mobile:w-full ${fullWidth ? "w-full" : "w-1/2"}`}>
              <label className="tracking-wide text-gray-400 text-xs text-medium bg-white relative px-1 top-[12px] left-3 w-auto">
                {label}
              </label>
              <input
                type={fieldType || "text"}
                className="appearance-none block text-[14px] w-full text-gray-700 border rounded py-4 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
                value={values[name]}
                name={name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
              />
              {renderError(name)}
            </div>
          )
        }

        const renderRoleSelection = () => {
          const selectedRole = values.role;

          return (
            <div className="w-full">
              <label className="tracking-wide text-gray-400 text-md font-medium bg-white relative top-[12px] w-auto">
                Select Role
              </label>
              <div className="flex flex-wrap flex-col gap-2 mt-4 ml-2">
                {predefinedRoles.map((roleOption) => (
                  <label key={roleOption} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="role"
                      value={roleOption}
                      checked={selectedRole === roleOption}
                      onChange={handleChange}
                      className="form-radio text-green-600"
                    />
                    <span className="text-sm text-gray-700 font-medium capitalize">{roleOption}</span>
                  </label>
                ))}
              </div>
              {selectedRole === "custom" && (
                <>
                  <input
                    type="text"
                    name="customRole"
                    className="mt-3 appearance-none block text-[14px] w-full text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    placeholder="Enter custom role"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.customRole}
                  />
                  {renderError("customRole")}
                </>
              )}
              {renderError("role")}
            </div>
          );
        };


        return (
          <div>
            <Modal
              isOpen={isOpen}
              title="Add User"
              onClose={toggleModal}
              onSubmit={handleSubmit}
              submitButtonLabel="Submit"
              width="w-screen"
              mx="mx-5"
            >
              <div className="h-auto overflow-y-auto">
                {renderSection(true, "Name", "name", "Type name")}
                <div className="w-full flex max-mobile:flex-col max-mobile:space-x-0 space-x-4">
                  {renderSection(false, "Username", "username", "Type username")}
                  {renderSection(false, "Password", "password", "Type password")}
                </div>
                {renderRoleSelection()}
              </div>
            </Modal>
          </div>)
      }}
    </Formik>
  );
};

export default AddUser;
