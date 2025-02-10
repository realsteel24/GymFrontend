import { useEffect, useState } from "react";

import { LabelledInput } from "../LabelledInput";
import { Button } from "../ui/button";
import { BACKEND_URL, SUPER_ADMIN } from "@/config";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [gymCode, setGymCode] = useState("STEEL/");
  const [signinLoading, setSigninLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", "true");
    document.documentElement.classList.add("dark");
  }, []);
  const handleSubmit = async () => {
    setSigninLoading(true);
    setError("");
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/admin/signin`, {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
          gymCode: gymCode,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Sign in failed");
      }
      const admin = await response.json();
      localStorage.setItem("token", admin.jwt);

      admin.jwt === SUPER_ADMIN
        ? navigate(`/gym/${gymCode.split("/")[1]}`)
        : navigate(`/gym/${gymCode.split("/")[1]}/menu`);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else setError("An unexpected error occurred");
    } finally {
      setSigninLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {signinLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        )}{" "}
        <div className="h-screen flex-col flex justify-center bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-900">
          <div className="w-full flex justify-center">
            <div>
              <div className="text-gray-200 text-4xl text-center mb-5">
                Log In
              </div>
              <LabelledInput
                label="Gym Code"
                placeholder="Code"
                labelColor="gray-200"
                textColor="white"
                formName="GymCode"
                formId="GymCode"
                autoComplete="Code"
                defaultValue="STEEL/"
                onChange={(e) => {
                  setGymCode(e.target.value.toUpperCase());
                }}
              />
              <LabelledInput
                label="Username"
                placeholder="Email"
                labelColor="gray-200"
                textColor="white"
                formName="email"
                formId="email"
                autoComplete="email"
                // defaultValue="Demo"
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase());
                }}
              />
              <LabelledInput
                label="Password"
                placeholder="Password"
                labelColor="gray-200"
                textColor="white"
                formName="password"
                formId="password"
                type="password"
                // defaultValue=""
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <div className="flex justify-center">
                <Button
                  variant={"outline"}
                  className="my-4"
                  onClick={handleSubmit}
                >
                  Login
                </Button>
                {error && (
                  <p className="text-red-500 font-light flex justify-center flex-col text-sm ml-2">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-300 hidden md:block">
          <div className="w-full flex justify-center">
            <div className="h-screen flex-col flex justify-center ">
              <div className="text-6xl font-semibold text-gray-600 max-w-md text-start">
                Insights turning heads
              </div>
              <div className="text-xl flex justify-center text-black pt-4 max-w-md pl-10">
                -Admin
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
