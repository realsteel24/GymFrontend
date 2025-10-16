// src/components/SignIn.tsx
import { useEffect, useState } from "react";
import { LabelledInput } from "../LabelledInput";
import { Button } from "../ui/button";
import { BACKEND_URL, MP_ADMIN, SUPER_ADMIN } from "@/config";
import { useNavigate } from "react-router-dom";
import { useForm } from "@/hooks/formstatehook";

export const SignIn = () => {
  // initialize gymCode here so we don't need a separate useEffect to set it later
  const { formData, setFieldValue } = useForm({ gymCode: "STEEL/" });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [signinLoading, setSigninLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", "true");
    document.documentElement.classList.add("dark");
  }, []);

  const handleSubmit = async () => {
    if (signinLoading) return;
    setSigninLoading(true);
    setError("");
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/admin/signin`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        // read server error message if present
        let msg = "Sign in failed";
        try {
          const j = await response.json();
          if (j?.message) msg = j.message;
        } catch {}
        throw new Error(msg);
      }
      const admin = await response.json();
      localStorage.setItem("token", admin.jwt);

      const code = (formData.gymCode || "").split("/")[1] || "";

      if (admin.jwt === SUPER_ADMIN || admin.jwt === MP_ADMIN) {
        navigate(`/gym/${code}`);
      } else {
        navigate(`/gym/${code}/menu`);
      }
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError("An unexpected error occurred");
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
        )}

        <div className="h-screen flex-col flex justify-center bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-900">
          <div className="w-full flex justify-center">
            <div>
              <div className="text-gray-200 text-4xl text-center mb-5">Log In</div>
              {/* Gym Code */}
              <LabelledInput
                label="Gym Code"
                placeholder="Code"
                labelColor="gray-200"
                textColor="white"
                formName="gymCode"
                formId="gymCode"
                autoComplete="Code"
                value={formData.gymCode || ""}
                onChange={(e) =>
                  // explicit set keeps it predictable (uppercase transformation)
                  setFieldValue("gymCode", e.target.value.toUpperCase())
                }
              />

              {/* Username */}
              <LabelledInput
                label="Username"
                placeholder="Email"
                labelColor="gray-200"
                textColor="white"
                formName="username"
                formId="username"
                autoComplete="email"
                value={formData.username || ""}
                onChange={(e) =>
                  // keep username lowercased
                  setFieldValue("username", e.target.value.toLowerCase())
                }
              />

              {/* Password */}
              <LabelledInput
                label="Password"
                placeholder="Password"
                labelColor="gray-200"
                textColor="white"
                formName="password"
                formId="password"
                type="password"
                value={formData.password || ""}
                onChange={(e) => setFieldValue("password", e.target.value)}
              />

              <div className="flex justify-center">
                <Button variant={"outline"} className="my-4" onClick={handleSubmit}>
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
              <div className="text-xl flex justify-center text-black pt-4 max-w-md pl-10">-Admin</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};