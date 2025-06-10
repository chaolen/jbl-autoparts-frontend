import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSignInMutation } from "store/apis/userApi";
import { setSession } from "store/slices/userSlice";
import { RootState } from "store/store";

type SigInData = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [signIn] = useSignInMutation();
  const dispatch = useDispatch();
  const [signInData, setSignInData] = useState<SigInData>({
    password: "",
    username: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await signIn(signInData).unwrap();

      dispatch(
        setSession({
          id: result.data.id,
          username: result.data.username,
          role: result.data.role,
          token: result.token,
          name: result.data.name,
          customRole: result.data.customRole,
        })
      );
      navigate("/loading");

      toast.success("User authenticated.");
    } catch (err: any) {
      if (err?.status === 'FETCH_ERROR') {
        toast.error("No Internet.");
      } else if (err?.status === 403) {
        toast.error(err?.data?.message);
      } else {
        toast.error("Invalid credentials.");
      }
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center px-4">
      <img
        src="/images/jbl-logo.svg"
        alt="hero-logo"
        className="mb-10 rounded-lg w-40 sm:w-48 md:w-52"
      />
      <form
        onSubmit={onSignIn}
        className="w-full max-w-sm sm:max-w-md md:min-w-[400px] bg-white border p-5 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-5 text-gray-700 text-center">
          Sign in
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-500 text-sm px-1">Username</label>
            <input
              className="appearance-none w-full text-sm text-gray-700 border rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
              value={signInData.username}
              name="username"
              onChange={updateField}
              placeholder="Username"
            />
          </div>
          <div>
            <label className="text-gray-500 text-sm px-1">Password</label>
            <div className="flex items-center border rounded overflow-hidden">
              <input
                type={showPassword ? "text" : "password"}
                className="appearance-none text-sm flex-1 py-3 px-4 focus:outline-none"
                value={signInData.password}
                name="password"
                onChange={updateField}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-gray-500"
              >
                {!showPassword ? (
                  <img src="/images/eye-off.svg" alt="eye-off" className="h-5 w-5" />
                ) : (
                  <img src="/images/eye.svg" alt="eye" className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 bg-primary text-white py-2 rounded w-full hover:bg-primary/90 transition"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
