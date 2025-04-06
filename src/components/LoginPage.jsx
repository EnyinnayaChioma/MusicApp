import React from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { basicSchema } from "../schemas/index.js";
import overlay from "../assets/overlay.png";

const onSubmit = async (values, actions) => {
  await new Promise((r) => setTimeout(r, 2000));
  actions.resetForm();
};

const LoginPage = () => {
  const {
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    values,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: basicSchema,
    onSubmit,
  });

  return (
    <div className="min-h-screen bg-black overflow-y-auto">
      {/* Overlay Image */}
      <div className="relative">
        <img 
          src={overlay} 
          alt="Background" 
          className="absolute left-0 top-0 md:top-24 h-64 md:h-96 w-full md:w-2/5 object-cover opacity-70"
        />
        
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <h1 className="text-3xl font-bold text-amber-300">LynSound</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex justify-center items-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 z-10">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100">
              Sign into your account
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your details to access your account
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={handleChange}
                  value={values.name}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className="mt-1 w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                           placeholder-gray-500"
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  onBlur={handleBlur}
                  type="email"
                  placeholder="example@gmail.com"
                  className="mt-1 w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                           placeholder-gray-500"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={values.password}
                  onBlur={handleBlur}
                  type="password"
                  placeholder="********"
                  className="mt-1 w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                           placeholder-gray-500"
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  type="password"
                  placeholder="********"
                  className="mt-1 w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                           placeholder-gray-500"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-600 rounded bg-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-amber-400 hover:text-amber-300">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-3 px-4 border border-transparent 
                rounded-md shadow-sm text-sm font-medium text-gray-900 bg-amber-300 
                hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-amber-500 transition-colors duration-300
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                <Link to="/home" className="w-full text-center">
                  Sign in
                </Link>
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <div>
              <button
                type="button"
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 
                         border border-gray-700 rounded-md shadow-sm bg-gray-900 text-sm font-medium 
                         text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <span>Sign in with Google</span>
              </button>
            </div>
          </form>

          {/* Terms */}
          <div className="mt-6 text-sm text-center text-gray-500">
            <p>
              By clicking continue, you agree to our{" "}
              <a href="#" className="text-amber-400 hover:text-amber-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-amber-400 hover:text-amber-300">
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="mt-4 text-sm text-center text-gray-500">
            <p>
              Don't have an account?{" "}
              <a href="#" className="text-amber-400 hover:text-amber-300">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;