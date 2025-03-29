import React from "react";
import { useFormik } from "formik";
import { basicSchema } from "../schemas/index.js";
import overlay from "../assets/overlay.png";


const onSubmit = async (values, actions) => {
  // console.log(values);
  // console.log(actions);
  // console.log("submitted")
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
  //  const [formData , setFormDate] = useState({
  //   name: '',
  //   email: '',
  //   password: ''
  //  })

  //  const handleChange =(e)=>{
  //     const {name, value} = e.target;
  //     setFormDate(prevState =>({...prevState, [name]: value}))
  //  }

  // const handleSubmit =(e)=>{
  //     e.preventDefault();
  //     console.log(formData)
  // }
  // console.log(errors);

  return (
    <div className=" min-h-screen fixed inset-0 bg-black md:bg-black z-10 flex flex-col justify-center py-12 sm:px-6 lg:px-8 ">
        <div className="width-full h-[100vh]  ">
              <img 
                src={overlay} 
                alt="" 
                className="absolute md:left-0 md:top-[15%] h-[40vh] md:h-[50%] w-full md:w-[40%] object-cover opacity-80"
              />
            </div>
            <div>
              <h1>LynSound</h1>
            </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md ">
        <div className=" py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Header */}
          <h3 className="text-3xl md:text-4xl font-bold text-center  text-gray-100 mb-8">
            Sign into your account
          </h3>

          {/* Form */}
          <form className="space-y-6 " onSubmit={handleSubmit}>
            {/* name */}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white sm:text-gray-200 mb-1"
              >
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                         placeholder-gray-400"
              />
              {/* error for name */}
              {errors.name && touched.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white sm:text-gray-700 mb-1"
              >
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                         placeholder-gray-400"
              />
              {/* error for email */}
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white sm:text-gray-700 mb-1"
              >
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                         placeholder-gray-400"
              />
              {/* error for password */}
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            {/* confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white sm:text-gray-700 mb-1"
              >
                Confirm Passwword
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                onChange={handleChange}
                value={values.confirmPassword}
                onBlur={handleBlur}
                type="password"
                placeholder="********"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                         placeholder-gray-400"
              />
              {/* error for confirmPassword */}
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-white sm:text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-amber-400 hover:text-amber-300"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white border-white 
              hover:border-amber-300 bg-amber-300 transition-colors duration-300
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isSubmitting}
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <div>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center space-x-2 py-2 px-4 
                         border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium 
                         text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <span>Sign in with Google</span>.
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-6 max-w-xs mx-auto text-sm text-center text-gray-500">
        <p>
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
