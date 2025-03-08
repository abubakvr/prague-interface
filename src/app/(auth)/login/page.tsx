"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/lib/constants";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Email not verified") {
          router.push(
            `/email-sent?email=${encodeURIComponent(formData.email)}`
          );
        } else {
          throw new Error(data.error || "Invalid credentials");
        }
      }

      if (data.token) {
        localStorage.setItem("accessToken", data.token);
        // Set token in cookies instead of localStorage
        document.cookie = `accessToken=${data.token}; path=/; max-age=86400; SameSite=Strict`;

        setTimeout(() => {
          // Force a refresh of the authentication state before redirecting
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex w-full h-screen">
        {/* Left side - Platform Info */}
        <div className="hidden md:flex md:w-1/2 bg-blue-900 text-white flex-col p-8">
          <div className="">
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 relative">
                <Image
                  src="/assets/logos/apex-logo@2x.png"
                  alt="App Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-00">Apex Trader</h1>
            </div>
            <div className="w-full h-full mt-10 flex items-center justify-center">
              <div className="max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  Welcome to Apex Trader
                </h2>
                <p className="text-xl mb-6 text-center">
                  Access real-time market data, advanced trading tools, and
                  comprehensive analytics to make informed investment decisions.
                </p>
                <div className="bg-blue-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">
                    Platform Features
                  </h3>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>Real-time market data and insights</li>
                    <li>Advanced trading tools and indicators</li>
                    <li>Secure and reliable platform</li>
                    <li>24/7 customer support</li>
                    <li>Customizable dashboards and alerts</li>
                    <li>Mobile trading capabilities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Login to Your Account
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your email"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label
                    className="text-gray-700 text-sm font-semibold"
                    htmlFor="password"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 transition duration-200"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="mt-4 text-right">
              <Link
                href="/forgotpassword"
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                Forgot Password?
              </Link>
            </div>

            <p className="mt-8 text-center text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
