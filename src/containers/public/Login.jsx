import { act, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { path } from "../../utils/constant";
import icons from "../../utils/icons";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../stores/actions"

const { MdEmail, MdLock, MdVisibility, MdVisibilityOff } = icons;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [payload, setPayload] = useState({
    email: '',
    password: ''
  })
  const { isLoggedIn } = useSelector(state => state.auth)
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isLoggedIn && navigate('/admin/dashboard')
  }, [isLoggedIn])

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      dispatch(actions.login(payload))
    } catch (error) {
      setErrors({ submit: "Lỗi đăng nhập. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#f5faf9] via-white to-[#e8f5f2]">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0da487] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0da487] opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Header with theme color */}
          <div className="bg-gradient-to-r from-[#0da487] to-[#0b9576] p-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl">
                🌱
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Plant Notebook</h1>
            <p className="text-white text-opacity-90 text-sm">Quản lý cây trồng của bạn</p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#0da487]">
                    <MdEmail size={20} />
                  </div>
                  <input
                    type="email"
                    value={payload.email}
                    onChange={(e) => {
                      setPayload(prev => ({ ...prev, ["email"]: e.target.value }))
                    }}
                    placeholder="your@email.com"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 ${errors.email
                      ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 bg-gray-50 focus:border-[#0da487] focus:ring-2 focus:ring-[#0da487] focus:ring-opacity-20"
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#0da487]">
                    <MdLock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={payload.password}
                    onChange={(e) => {
                      setPayload(prev => ({ ...prev, ["password"]: e.target.value }))
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 ${errors.password
                      ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 bg-gray-50 focus:border-[#0da487] focus:ring-2 focus:ring-[#0da487] focus:ring-opacity-20"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#0da487] transition-colors"
                  >
                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-2 border-gray-200 rounded cursor-pointer accent-[#0da487]"
                  />
                  <span className="ml-2 text-gray-600 group-hover:text-gray-800">
                    Nhớ tôi
                  </span>
                </label>
                <a
                  href="#"
                  className="text-[#0da487] font-semibold hover:text-[#0b9576] transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <p className="text-red-700 text-sm font-medium">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0da487] to-[#0b9576] text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:from-[#0b9576] hover:to-[#097a63] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
