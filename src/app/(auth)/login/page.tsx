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
        if (data.message === "Email not verified") {
          router.push(
            `/email-sent?email=${encodeURIComponent(formData.email)}`
          );
        } else {
          throw new Error(data.message || "Invalid credentials");
        }
      }

      if (data.data.token) {
        localStorage.setItem("accessToken", data.data.token);
        // Set token in cookies instead of localStorage
        document.cookie = `accessToken=${data.data.token}; path=/; max-age=604800; SameSite=Strict`;

        setTimeout(() => {
          // Force a refresh of the authentication state before redirecting
          router.push("/dashboard");
        }, 100);
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
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white flex-col p-8 relative overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              alt="Payment Processing Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-indigo-900/90"></div>
          </div>

          {/* Glossy overlay effect */}
          <div className="absolute inset-0 bg-white opacity-5 rounded-full blur-3xl transform -translate-x-1/4 -translate-y-1/4 w-3/4 h-3/4"></div>
          <div className="absolute bottom-0 right-0 bg-blue-500 opacity-10 rounded-full blur-3xl w-96 h-96"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 relative">
                <Image
                  src="/assets/logos/apex-logo.svg"
                  alt="App Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Boskify
              </h1>
            </div>

            <div className="w-full h-full mt-6 flex items-center justify-center">
              <div className="max-w-lg">
                <h2 className="text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
                  Streamline Your Payments
                </h2>
                <p className="text-xl mb-8 text-center text-blue-100 leading-relaxed">
                  Join our platform to manage orders, process payments
                  efficiently, and track transactions in real-time with our
                  secure payment processing system.
                </p>

                <div className="backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-xl border border-white/20">
                  <h3 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-200 to-indigo-100 bg-clip-text text-transparent">
                    Platform Features
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Fast and secure payment processing",
                      "Real-time transaction tracking",
                      "Comprehensive order management",
                      "Multiple bank integration",
                      "Detailed financial reporting",
                      "Mobile-friendly dashboard",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/30">
                          <svg
                            className="w-4 h-4 text-blue-200"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span className="text-blue-50">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            {/* Logo and name for mobile and tablet */}
            <div className="flex items-center justify-center space-x-2 mb-6 md:hidden">
              <div className="w-10 h-10 relative">
                <Image
                  src="/assets/logos/apex-logo.svg"
                  alt="App Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
                Boskify
              </h1>
            </div>
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
