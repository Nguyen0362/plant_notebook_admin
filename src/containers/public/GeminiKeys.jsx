import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { 
  FaKey, 
  FaPlus, 
  FaTrash, 
  FaPen, 
  FaRotate, 
  FaCopy, 
  FaEye, 
  FaEyeSlash, 
  FaCheck, 
  FaXmark, 
  FaClock, 
  FaTriangleExclamation,
  FaArrowRotateRight,
  FaToggleOn,
  FaToggleOff
} from "react-icons/fa6";
import { 
  apiGetGeminiKeys, 
  apiCreateGeminiKey, 
  apiUpdateGeminiKey, 
  apiDeleteGeminiKey, 
  apiPingGeminiKey 
} from "../../services/geminiKey";

const GeminiKeys = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pingingId, setPingingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [selectedKey, setSelectedKey] = useState(null);
  const [formData, setFormData] = useState({
    apiKey: "",
    dailyRequestLimit: 1500,
    isActive: true
  });

  // Visbility of API keys state (keyId -> boolean)
  const [visibleKeys, setVisibleKeys] = useState({});

  // Show toast notification helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch keys list
  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await apiGetGeminiKeys();
      if (res && res.data) {
        setKeys(res.data);
      }
    } catch (err) {
      showToast(err?.message || "Không thể tải danh sách API Keys", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  // Handle open add modal
  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData({
      apiKey: "",
      dailyRequestLimit: 1500,
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (keyRecord) => {
    setModalMode("edit");
    setSelectedKey(keyRecord);
    setFormData({
      apiKey: keyRecord.apiKey,
      dailyRequestLimit: keyRecord.dailyRequestLimit,
      isActive: keyRecord.isActive
    });
    setIsModalOpen(true);
  };

  // Copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Đã sao chép API Key vào bộ nhớ tạm");
  };

  // Toggle API Key visibility
  const toggleVisibility = (id) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle submit form (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.apiKey.trim()) {
      showToast("Vui lòng nhập API Key", "error");
      return;
    }

    setActionLoading(true);
    try {
      if (modalMode === "add") {
        const res = await apiCreateGeminiKey({
          apiKey: formData.apiKey.trim(),
          dailyRequestLimit: Number(formData.dailyRequestLimit),
          isActive: formData.isActive
        });
        showToast(res?.message || "Thêm API Key thành công");
      } else {
        const res = await apiUpdateGeminiKey(selectedKey.id, {
          apiKey: formData.apiKey.trim(),
          dailyRequestLimit: Number(formData.dailyRequestLimit),
          isActive: formData.isActive
        });
        showToast(res?.message || "Cập nhật API Key thành công");
      }
      setIsModalOpen(false);
      fetchKeys();
    } catch (err) {
      showToast(err?.message || "Thao tác thất bại", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete key
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa API Key này khỏi hệ thống? Thao tác này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "rgba(160, 160, 160, 1)",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
      background: "#fff",
      customClass: {
        popup: "rounded-[1rem]"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setActionLoading(true);
        try {
          const res = await apiDeleteGeminiKey(id);
          Swal.fire({
            title: "Đã xóa thành công!",
            text: res?.message || "API Key đã được gỡ bỏ khỏi hệ thống.",
            icon: "success",
            confirmButtonColor: "#0da487",
            customClass: {
              popup: "rounded-[1rem]"
            }
          });
          fetchKeys();
        } catch (err) {
          Swal.fire({
            title: "Lỗi!",
            text: err?.message || "Không thể xóa API Key. Vui lòng thử lại.",
            icon: "error",
            confirmButtonColor: "#0da487",
            customClass: {
              popup: "rounded-[1rem]"
            }
          });
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  // Toggle active status directly
  const handleToggleActive = async (keyRecord) => {
    try {
      const res = await apiUpdateGeminiKey(keyRecord.id, {
        isActive: !keyRecord.isActive
      });
      showToast(res?.message || "Đã cập nhật trạng thái API Key");
      fetchKeys();
    } catch (err) {
      showToast(err?.message || "Cập nhật trạng thái thất bại", "error");
    }
  };

  // Ping test
  const handlePing = async (id) => {
    setPingingId(id);
    try {
      const res = await apiPingGeminiKey(id);
      showToast(res?.message || "API Key hoạt động bình thường", "success");
      fetchKeys();
    } catch (err) {
      showToast(err?.message || "API Key lỗi hoặc bị Google khóa", "error");
      fetchKeys();
    } finally {
      setPingingId(null);
    }
  };

  // Format last used date
  const formatTime = (timeString) => {
    if (!timeString) return "Chưa từng dùng";
    const date = new Date(timeString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    });
  };

  // Check if a key is currently cooling down
  const getCooldownInfo = (cooldownUntil) => {
    if (!cooldownUntil) return null;
    const cooldownDate = new Date(cooldownUntil);
    const now = new Date();
    if (cooldownDate > now) {
      const remainingSeconds = Math.ceil((cooldownDate - now) / 1000);
      return `${remainingSeconds} giây`;
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 relative animate-[fadeIn_0.5s_ease-out]">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
          toast.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          {toast.type === "success" ? <FaCheck className="text-xl" /> : <FaTriangleExclamation className="text-xl" />}
          <span className="font-medium text-sm">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-4 hover:opacity-75">
            <FaXmark />
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="bg-gradient-to-r from-[#0da487] to-[#009289] text-white rounded-2xl p-6 md:p-8 shadow-[0_10px_30px_rgba(13,164,135,0.15)] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <FaKey className="text-2xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Gemini API Keys</h1>
          </div>
          <p className="text-white/80 text-sm md:text-base">
            Quản lý và xoay vòng các API Key dùng cho tính năng quét nhận diện ảnh cây trồng bằng AI.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="relative z-10 bg-white text-[#0da487] hover:bg-emerald-50 active:scale-95 px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-sm md:text-base"
        >
          <FaPlus />
          Thêm API Key mới
        </button>
      </div>

      {/* Keys list container */}
      <div className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100/80 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Danh sách API Key ({keys.length})
          </h2>
          <button 
            onClick={fetchKeys}
            className="p-2 text-gray-400 hover:text-[#0da487] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Tải lại danh sách"
          >
            <FaArrowRotateRight className={`${loading ? "animate-spin text-[#0da487]" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col justify-center items-center gap-3 text-gray-400">
            <svg className="animate-spin h-10 w-10 text-[#0da487]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="font-semibold text-sm">Đang tải dữ liệu...</span>
          </div>
        ) : keys.length === 0 ? (
          <div className="p-20 flex flex-col justify-center items-center gap-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 text-2xl">
              🗝️
            </div>
            <div>
              <p className="text-gray-700 font-bold text-lg mb-1">Chưa có API Key nào</p>
              <p className="text-gray-400 text-sm max-w-sm">Hệ thống cần ít nhất 1 API Key đang hoạt động để chạy tính năng phân tích nhận diện cây trồng.</p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="bg-[#0da487] text-white hover:bg-[#009289] px-5 py-2.5 rounded-lg font-semibold transition cursor-pointer text-sm mt-2"
            >
              Tạo Key đầu tiên
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-12">ID</th>
                  <th className="py-4 px-6">API Key</th>
                  <th className="py-4 px-6 text-center">Trạng thái</th>
                  <th className="py-4 px-6 min-w-[150px]">Lưu lượng trong ngày (Used)</th>
                  <th className="py-4 px-6">Sử dụng cuối</th>
                  <th className="py-4 px-6 text-center w-48">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {keys.map((item) => {
                  const cooldownText = getCooldownInfo(item.cooldownUntil);
                  const isVisible = !!visibleKeys[item.id];
                  const maskKey = (keyStr) => {
                    if (keyStr.length <= 12) return keyStr;
                    return `${keyStr.slice(0, 8)}••••••••${keyStr.slice(-4)}`;
                  };

                  // Render status badge logic
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Hoạt động
                    </span>
                  );

                  if (item.isBanned) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <FaXmark className="text-xs" />
                        Bị khóa (Banned)
                      </span>
                    );
                  } else if (cooldownText) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200" title={`Cooldown: ${item.cooldownUntil}`}>
                        <FaClock className="text-xs animate-spin-slow" />
                        Đóng băng ({cooldownText})
                      </span>
                    );
                  } else if (!item.isActive) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-500 border border-gray-200">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        Vô hiệu
                      </span>
                    );
                  }

                  // Progress Limit Percentage
                  const percentage = Math.min(Math.round((item.usedToday / item.dailyRequestLimit) * 100), 100);
                  const isLimitWarning = percentage >= 80;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-center text-gray-400 font-medium">{item.id}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 font-mono text-gray-700 font-semibold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-150/50 max-w-xs md:max-w-md">
                          <span className="truncate flex-grow">
                            {isVisible ? item.apiKey : maskKey(item.apiKey)}
                          </span>
                          <button 
                            onClick={() => toggleVisibility(item.id)} 
                            className="text-gray-400 hover:text-gray-600 p-0.5"
                            title={isVisible ? "Ẩn" : "Hiện"}
                          >
                            {isVisible ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button 
                            onClick={() => handleCopy(item.apiKey)} 
                            className="text-gray-400 hover:text-[#0da487] p-0.5"
                            title="Sao chép"
                          >
                            <FaCopy />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">{statusBadge}</td>
                      <td className="py-4 px-6">
                        <div className="space-y-1.5">
                          <div className="flex justify-end text-xs font-medium text-gray-500 gap-1">
                            <span className="font-bold text-gray-700">{item.usedToday}</span>
                            <span>/ {item.dailyRequestLimit} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                isLimitWarning 
                                  ? "bg-gradient-to-r from-red-500 to-rose-500" 
                                  : "bg-gradient-to-r from-[#0da487] to-[#009289]"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500 font-medium">{formatTime(item.lastUsed)}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-2">
                          {/* Ping Test Button */}
                          <button
                            onClick={() => handlePing(item.id)}
                            disabled={pingingId !== null || actionLoading}
                            className={`p-2 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/80 rounded-lg text-emerald-600 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                            title="Ping kiểm tra tình trạng"
                          >
                            <FaRotate className={`${pingingId === item.id ? "animate-spin" : ""}`} />
                          </button>

                          {/* Quick Toggle Active */}
                          <button
                            onClick={() => handleToggleActive(item)}
                            className={`p-2 border rounded-lg transition duration-150 cursor-pointer ${
                              item.isActive
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/80"
                                : "bg-gray-50 text-gray-400 border-gray-150 hover:bg-gray-100"
                            }`}
                            title={item.isActive ? "Tạm tắt (Vô hiệu hóa)" : "Kích hoạt"}
                          >
                            {item.isActive ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            disabled={actionLoading}
                            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-500 border border-gray-150 transition duration-150 cursor-pointer disabled:opacity-50"
                            title="Sửa giới hạn"
                          >
                            <FaPen />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={actionLoading}
                            className="p-2 bg-rose-50 hover:bg-rose-100/80 rounded-lg text-rose-600 border border-rose-100 transition duration-150 cursor-pointer disabled:opacity-50"
                            title="Xóa Key"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 border border-gray-150 animate-[scaleUp_0.3s_ease-out] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0da487] to-[#009289] text-white p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FaKey />
                {modalMode === "add" ? "Thêm Gemini API Key mới" : "Chỉnh sửa API Key"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition"
              >
                <FaXmark className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* API Key string input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">API Key String</label>
                <input
                  type="text"
                  placeholder="Nhập API Key của Gemini..."
                  value={formData.apiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  required
                  disabled={modalMode === "edit"} // Khóa không cho sửa key cũ, chỉ cho đổi limit/trạng thái hoặc tạo key mới
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition font-mono disabled:bg-gray-50 disabled:text-gray-400"
                />
                {modalMode === "edit" && (
                  <p className="text-xs text-gray-400">Không thể sửa chuỗi Key đã lưu. Nếu muốn đổi key mới, vui lòng xóa key này và tạo key mới.</p>
                )}
              </div>

              {/* Daily Limit Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Giới hạn trong ngày (Daily Limit)</label>
                <input
                  type="number"
                  placeholder="Mặc định: 1500"
                  value={formData.dailyRequestLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, dailyRequestLimit: e.target.value }))}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition"
                />
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-150/50">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-0.5">Trạng thái kích hoạt</label>
                  <span className="text-xs text-gray-400">Cho phép hệ thống sử dụng Key này để xoay vòng.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0da487]"></div>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition cursor-pointer text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0da487] to-[#009289] text-white font-bold shadow-md hover:shadow-lg transition cursor-pointer text-sm disabled:opacity-50"
                >
                  {actionLoading ? "Đang xử lý..." : modalMode === "add" ? "Thêm mới" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiKeys;
