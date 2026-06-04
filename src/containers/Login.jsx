import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import icons from "../utils/icons";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../stores/actions";

const { MdEmail, MdLock, MdVisibility, MdVisibilityOff } = icons;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    email: '',
    password: ''
  });

  // Select state from auth including msg and update
  const { isLoggedIn, msg, update } = useSelector(state => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [isLoggedIn, navigate]);

  // Sync error messages from Redux store
  useEffect(() => {
    if (msg) {
      setErrors({ submit: msg });
      setLoading(false);
    }
  }, [msg, update]);

  const handleInputChange = (field, value) => {
    setPayload(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null, submit: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let localErrors = {};
    if (!payload.email) {
      localErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(payload.email)) {
      localErrors.email = "Email không đúng định dạng";
    }

    if (!payload.password) {
      localErrors.password = "Mật khẩu không được để trống";
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setLoading(true);
    try {
      dispatch(actions.login(payload));
    } catch (error) {
      setErrors({ submit: "Không thể kết nối tới server. Vui lòng thử lại sau." });
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0d1612] relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#1b7a3d] opacity-20 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0da487] opacity-25 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }}></div>

      {/* Floating Leaves or Organic Shapes (decorative) */}
      <div className="absolute top-1/4 left-1/5 w-12 h-12 bg-emerald-500/10 rounded-br-full transform rotate-45 blur-sm"></div>
      <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-teal-500/10 rounded-tl-full transform -rotate-12 blur-sm"></div>

      {/* Login Box */}
      <div className="relative w-full max-w-md mx-4 z-10">
        {/* Glassmorphic Container */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.3)] overflow-hidden">

          {/* Top Header Card */}
          <div className="p-8 text-center border-b border-white/10 relative bg-gradient-to-b from-white/5 to-transparent">
            {/* Glowing Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#1b7a3d] to-[#0da487] rounded-2xl flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(27,122,61,0.5)] transform hover:rotate-12 transition-transform duration-300">
                🌱
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-sm">Plant Notebook</h1>
            <p className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mt-1">Hệ thống quản trị viên</p>
          </div>

          {/* Form Area */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Form Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-300">
                  Email quản trị viên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400">
                    <MdEmail size={20} />
                  </div>
                  <input
                    type="email"
                    value={payload.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="admin@email.com"
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-emerald-800/40 focus:outline-none transition-all duration-300 ${errors.email
                      ? "border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-white/10 focus:border-[#0da487] focus:bg-white/10 focus:ring-2 focus:ring-[#0da487]/20"
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 font-semibold">{errors.email}</p>
                )}
              </div>

              {/* Password Form Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-300">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400">
                    <MdLock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={payload.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-emerald-800/40 focus:outline-none transition-all duration-300 ${errors.password
                      ? "border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-white/10 focus:border-[#0da487] focus:bg-white/10 focus:ring-2 focus:ring-[#0da487]/20"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-emerald-400/60 hover:text-emerald-300 transition-colors"
                  >
                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 font-semibold">{errors.password}</p>
                )}
              </div>

              {/* Remember/Forgot Section */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/20 bg-white/5 cursor-pointer accent-[#0da487]"
                  />
                  <span className="ml-2 text-emerald-400/80 group-hover:text-emerald-300 transition-colors">
                    Duy trì đăng nhập
                  </span>
                </label>
                <a
                  href="#"
                  className="text-emerald-400 font-semibold hover:text-[#0da487] hover:underline transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-950/40 border border-red-500/50 p-4 rounded-xl">
                  <p className="text-red-400 text-xs font-semibold text-center">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-[#1b7a3d] to-[#0da487] text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_20px_rgba(27,122,61,0.3)] hover:shadow-[0_4px_25px_rgba(13,164,135,0.4)] hover:from-[#218e47] hover:to-[#0fb897] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
                    Đang xác thực...
                  </>
                ) : (
                  "Đăng nhập hệ thống"
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
