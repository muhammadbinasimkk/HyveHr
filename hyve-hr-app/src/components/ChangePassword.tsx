import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const ChangePassword: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams<{ token: string }>(); // Get the token from the URL
  const navigate = useNavigate();
  const { t } = useTranslation(); // Use t function for translations

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t('changePassword.passwordRequired'))
        .min(6, t('changePassword.passwordMin')),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], t('changePassword.passwordMismatch'))
        .required(t('changePassword.confirmPasswordRequired')),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        const response = await axios.post(
          `http://localhost:5000/api/auth/reset-password/${token}`,
          { password: values.password }
        );
        if (response.status === 200) {
          setMessage(t('changePassword.passwordChanged'));
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error: any) {
        console.error('Password change failed:', error);
        setError(
          error?.response?.data?.message || t('changePassword.failureMessage')
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex font-tahoma items-center justify-center min-h-screen bg-gray-200 p-2">
      <div
        className="gap-4 rounded-xl relative flex flex-col items-center justify-center w-full max-w-lg p-4 bg-white shadow-lg shadow-gray-400 px-8"
        style={{ height: '500px' }}
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          {t('changePassword.title')}
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}

        <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              {t('changePassword.newPassword')}
            </label>
            <div className="flex items-center mt-2 relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full py-2 pl-10 pr-12 bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 text-sm mt-2">
                {formik.errors.password}
              </p>
            ) : null}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              {t('changePassword.confirmPassword')}
            </label>
            <div className="flex items-center mt-2 relative">
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className="w-full py-2 pl-10 pr-12 bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            {formik.touched.confirmPassword &&
            formik.errors.confirmPassword ? (
              <p className="text-red-500 text-sm mt-2">
                {formik.errors.confirmPassword}
              </p>
            ) : null}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white font-semibold hover:bg-green-600 transition duration-300"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting
                ? t('changePassword.submitting')
                : t('changePassword.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
