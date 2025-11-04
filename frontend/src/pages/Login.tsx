import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../services/memberApi";
import { toast } from "react-toastify";

const Signup = (): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const role = searchParams.get("role");
    console.log("role", role);
    if (!role) {
      navigate("/");
    }
  }, [searchParams, navigate]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const role = searchParams.get("role");
    if (!role) return; 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      const data = await login(form, role);
      console.log("Login response:", data);
      toast.success("Login successful!");
      if (role === "manager") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const role = searchParams.get("role");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          {role === "manager" ? "Project Manager Login" : "Team Member Login"}
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {role === "member" && (
          <p className="text-center text-gray-500 text-sm mt-4">
            Don't have an account?{" "}
            <Link to={`/signup`} className="text-blue-600 hover:underline">
              Create Account
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;
