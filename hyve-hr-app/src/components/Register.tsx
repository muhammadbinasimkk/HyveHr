import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const navigate = useNavigate();
  const { t } = useTranslation(); // Use t function to access translations

  const initialValues: RegisterFormValues = {
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required(t('register.firstNameRequired')),
    lastName: Yup.string().required(t('register.lastNameRequired')),
    companyName: Yup.string().required(t('register.companyNameRequired')),
    email: Yup.string()
      .email(t('register.invalidEmail'))
      .required(t('register.emailRequired')),
    password: Yup.string()
      .required(t('register.passwordRequired'))
      .min(6, t('register.passwordMin')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t('register.passwordsMustMatch'))
      .required(t('register.confirmPasswordRequired')),
  });

  const onSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    setError(null); // Clear previous error
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        values
      );
      if (response.status === 201) {
        const { paymentUrl, sessionId } = response.data;
  
        // Redirect to the payment page with sessionId as a query parameter
        navigate(`/payment?sessionId=${sessionId}`);
  
        // Or, alternatively, redirect directly to the Stripe checkout page:
        // window.location.href = paymentUrl;
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError(error?.response?.data?.message || t('register.failureMessage'));
    } finally {
      setSubmitting(false); // Always reset submitting state
    }
  };
  


  const formik = useFormik<RegisterFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="flex font-tahoma items-center justify-center min-h-screen bg-[#fafafa] p-2">
      <div className="gap-4 rounded-xl relative flex flex-col items-center justify-center w-full max-w-2xl p-4 bg-white shadow-lg px-8 border-2 border-[#f2f2f2]" style={{ height: '600px' }}>
        <h1 className="text-3xl text-black mt-2 mb-4 text-center">
          {t('register.title')}
        </h1>

        {/* Fixed container for error and message */}
        <div className="flex flex-col justify-center items-center" style={{ minHeight: '20px' }}>
          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* First Name Field */}
          <div className="relative">
            <label
              htmlFor="firstName"
              className="block text-sm text-black"
            >
              {t('register.firstName')}
            </label>
            <div className="flex items-center mb-2">
              <input
                id="firstName"
                type="text"
                name="firstName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                className="w-full py-2 pr-12 bg-white text-black border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-red-500"
                required
              />
            </div>
            {/* Fixed height for error message */}
            <p className="text-red-500 text-sm mt-1" style={{ minHeight: '20px' }}>
              {formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : ""}
            </p>
          </div>

          {/* Last Name Field */}
          <div className="relative">
            <label
              htmlFor="lastName"
              className="block text-sm text-black"
            >
              {t('register.lastName')}
            </label>
            <div className="flex items-center mb-2">
              <input
                id="lastName"
                type="text"
                name="lastName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                className="w-full py-2 pr-12 bg-white text-black border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-red-500"
                required
              />
            </div>
            {/* Fixed height for error message */}
            <p className="text-red-500 text-sm mt-1" style={{ minHeight: '20px' }}>
              {formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : ""}
            </p>
          </div>

          {/* Company Name Field */}
          <div className="relative">
            <label
              htmlFor="companyName"
              className="block text-sm text-black"
            >
              {t('register.companyName')}
            </label>
            <div className="flex items-center mb-2">
              <input
                id="companyName"
                type="text"
                name="companyName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.companyName}
                className="w-full py-2 pr-12 bg-white text-black border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-red-500"
                required
              />
            </div>
            {/* Fixed height for error message */}
            <p className="text-red-500 text-sm mt-1" style={{ minHeight: '20px' }}>
              {formik.touched.companyName && formik.errors.companyName ? formik.errors.companyName : ""}
            </p>
          </div>

          {/* Email Field */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm text-black"
            >
              {t('register.email')}
            </label>
            <div className="flex items-center mb-2">
              <input
                id="email"
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full py-2 pr-12 bg-white text-black border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-red-500"
                required
              />
            </div>
            {/* Fixed height for error message */}
            <p className="text-red-500 text-sm mt-1" style={{ minHeight: '20px' }}>
              {formik.touched.email && formik.errors.email ? formik.errors.email : ""}
            </p>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm text-black"
            >
              {t('register.password')}
            </label>
            <div className="flex items-center mb-2 relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full py-2 pr-12 bg-white text-black border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-red-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
            {/* Fixed height for error message */}
            <p className="text-red-500 text-sm mt-1" style={{ minHeight: '20px' }}>
              {formik.touched.password && formik.errors.password ? formik.errors.password : ""}
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm text-black"
            >
              {t('register.confirmPassword')}
            </label>
            <div className="flex items-center mb-2 relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className="w-full py-2 pr-12 bg-white text-black border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-red-500"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
            {/* Fixed height for error message */}
            <p className="text-red-500 text-sm mt-1" style={{ minHeight: '20px' }}>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : ""}
            </p>
          </div>

          <div className="col-span-2 mt-4 flex justify-center">
            <button
              type="submit"
              className="w-1/3 py-2 bg-green-500 text-black font-tahoma-semibold hover:bg-green-600 transition duration-300 rounded-sm"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? t('register.registering') : t('register.registerButton')}
            </button>
          </div>

          <div className="col-span-2 mt-4 text-center">
            <p className="text-black">
              {t('register.haveAccount')}{" "}
              <Link to="/login" className="text-red-400 hover:underline">
                {t('register.loginHere')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
