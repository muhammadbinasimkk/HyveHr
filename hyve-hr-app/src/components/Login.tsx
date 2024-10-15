import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Use translation

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email(t('login.invalidEmail')).required(t('login.emailRequired')),
    password: Yup.string().required(t('login.passwordRequired')).min(6, t('login.passwordMin')),
  });

  const onSubmit = async (values: typeof initialValues) => {
    try {
      await login(values.email, values.password);
      navigate('/home');
    } catch (error) {
      setError(t('login.invalidCredentials'));
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="flex font-tahoma items-center justify-center min-h-screen bg-[#fafafa] p-2">
      <div className="gap-4 rounded-xl relative flex flex-col items-center justify-center w-full max-w-lg p-4 bg-white shadow-lg px-8 border-2 border-[#f2f2f2]" style={{ height: '500px' }}>
        <h1 className="text-3xl text-black mb-6 text-center">{t('login.title')}</h1>
        <div className="flex flex-col justify-center items-center" style={{ minHeight: '20px' }}>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
          <div className="relative mb-10">
            <label htmlFor="email" className="block text-sm text-black">{t('login.email')}</label>
            <div className="flex items-center mt-2">
              <input
                id="email"
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full py-2 pr-4 bg-white text-black border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-red-500"
              />
            </div>
            <p className="text-red-500 text-sm mt-1" style={{ minHeight: '20px' }}>
              {formik.touched.email && formik.errors.email ? formik.errors.email : ""}
            </p>
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm text-black">{t('login.password')}</label>
            <div className="flex items-center mt-2 relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full py-2 pr-12 bg-white text-black border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-red-500"
              />
              <button type="button" onClick={togglePasswordVisibility} className="absolute right-3">
                {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
              </button>
            </div>
            <p className="text-red-500 text-sm mt-1" style={{ minHeight: '20px' }}>
              {formik.touched.password && formik.errors.password ? formik.errors.password : ""}
            </p>
          </div>

          <div className="col-span-2 mt-4 flex justify-center">
            <button
              type="submit"
              className="w-1/3 py-2 bg-green-500 text-white hover:bg-green-600 transition duration-300 rounded-sm"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? t('login.loggingIn') : t('login.loginButton')}
            </button>
          </div>

          <div className="col-span-2 mt-4 text-center">
            <p className="text-black">
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                {t('login.forgotPassword')}
              </Link>
            </p>
            <p className="text-black">
              <Link to="/register" className="text-blue-600 hover:underline">
                {t('login.register')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
