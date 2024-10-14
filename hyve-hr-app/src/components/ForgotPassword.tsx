import React, { useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const initialValues: ForgotPasswordFormValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const onSubmit = async (
    values: ForgotPasswordFormValues,
    { setSubmitting }: FormikHelpers<ForgotPasswordFormValues>
  ) => {
    setError(null); // Clear previous error
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        values
      );
      if (response.status === 200 || response.status === 201) {
        setMessage("Check your email for password reset instructions.");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after success
        }, 3000);
      }
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      setError(error?.response?.data?.message || "Failed to send reset email");
    } finally {
      setSubmitting(false); // Always reset submitting state
    }
  };

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-2">
      <div className="gap-4 rounded-xl relative flex flex-col items-center justify-center w-full max-w-lg p-4 bg-white shadow-lg shadow-gray-400 px-8" style={{ height: '350px' }}>
        <h1 className="text-3xl font-tahoma text-black mb-6 text-center">
          Forgot Password
        </h1>

       {/* Fixed container for error and message */}
       <div className="flex flex-col justify-center items-center" style={{ minHeight: '20px' }}>
          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full space-y-6"
        >
          {/* Email Field */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-tahoma text-black"
            >
              Work Email
            </label>
            <div className="flex items-center mt-2">
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
            <p className="text-red-500 text-sm mt-1" style={{ minHeight: '20px' }}>
              {formik.touched.email && formik.errors.email ? formik.errors.email : ""}
            </p>
          </div>

          <div className="col-span-1 mt-4 flex justify-center">
            <button
              type="submit"
              className="w-1/3 py-2 bg-green-500 text-white font-tahoma hover:bg-green-600 transition duration-300 rounded-sm"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <div className="col-span-1 mt-4 text-center">
            <p className="text-black">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
