import React, { useEffect, useState } from 'react';
import { apiGetPlants, apiApprovePlant, apiRejectPlant, apiDeletePlant } from '../../services/libraryPlantService';
import { Link } from 'react-router-dom';
import { path } from '../../utils/constant';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaUndo } from 'react-icons/fa';
import Swal from 'sweetalert2';

const LibraryPlantList = ({ mode = 'approved' }) => {
  const [plants, setPlants] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const response = await apiGetPlants({
        page: currentPage,
        limit: 10,
        search,
        category: categoryFilter,
        approvalStatus: mode
      });
      if (response?.data?.data) {
        setPlants(response.data.data.plants);
        setTotalItems(response.data.data.totalItems);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching plants:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể tải danh sách cây trồng.',
        icon: 'error',
        confirmButtonColor: '#0da487',
        customClass: { popup: 'rounded-[1rem]' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, [currentPage, mode, categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPlants();
  };

  const handleApprove = async (id) => {
    Swal.fire({
      title: 'Xác nhận duyệt?',
      text: 'Bạn có chắc chắn muốn duyệt cây này vào thư viện chính thức?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0da487',
      cancelButtonColor: 'rgba(160, 160, 160, 1)',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      background: '#fff',
      customClass: { popup: 'rounded-[1rem]' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await apiApprovePlant(id);
          Swal.fire({
            title: 'Thành công!',
            text: 'Cây đã được duyệt thành công.',
            icon: 'success',
            confirmButtonColor: '#0da487',
            customClass: { popup: 'rounded-[1rem]' }
          });
          fetchPlants();
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Lỗi!',
            text: error.response?.data?.message || 'Có lỗi xảy ra khi duyệt cây.',
            icon: 'error',
            confirmButtonColor: '#0da487',
            customClass: { popup: 'rounded-[1rem]' }
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleReject = async (id) => {
    Swal.fire({
      title: 'Từ chối đề xuất?',
      text: 'Bạn có chắc chắn muốn từ chối cây đề xuất này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffa53b',
      cancelButtonColor: 'rgba(160, 160, 160, 1)',
      confirmButtonText: 'Từ chối',
      cancelButtonText: 'Hủy bỏ',
      background: '#fff',
      customClass: { popup: 'rounded-[1rem]' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await apiRejectPlant(id);
          Swal.fire({
            title: 'Đã từ chối!',
            text: 'Đã cập nhật trạng thái từ chối cho cây đề xuất này.',
            icon: 'success',
            confirmButtonColor: '#0da487',
            customClass: { popup: 'rounded-[1rem]' }
          });
          fetchPlants();
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Lỗi!',
            text: error.response?.data?.message || 'Có lỗi xảy ra khi từ chối cây.',
            icon: 'error',
            confirmButtonColor: '#0da487',
            customClass: { popup: 'rounded-[1rem]' }
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Thao tác này sẽ xóa cây vĩnh viễn khỏi hệ thống và không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'rgba(160, 160, 160, 1)',
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy bỏ',
      background: '#fff',
      customClass: { popup: 'rounded-[1rem]' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await apiDeletePlant(id);
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Cây đã được gỡ bỏ khỏi thư viện.',
            icon: 'success',
            confirmButtonColor: '#0da487',
            customClass: { popup: 'rounded-[1rem]' }
          });
          fetchPlants();
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Lỗi!',
            text: error.response?.data?.message || 'Có lỗi xảy ra khi xóa cây.',
            icon: 'error',
            confirmButtonColor: '#0da487',
            customClass: { popup: 'rounded-[1rem]' }
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Define page title based on current mode
  let pageTitle = 'Quản lý Thư viện Cây';
  if (mode === 'pending') {
    pageTitle = 'Yêu cầu duyệt Cây trồng';
  } else if (mode === 'history') {
    pageTitle = 'Lịch sử duyệt Cây trồng';
  }

  return (
    <div className="p-6 max-w-7xl mx-auto pb-12 relative animate-[fadeIn_0.5s_ease-out]">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        {mode === 'approved' && (
          <Link 
            to={`/admin/${path.LIBRARY_PLANTS_ADD}`} 
            className="bg-[#0da487] hover:bg-[#009289] text-white px-5 py-2.5 rounded-md shadow-md transition-all font-semibold flex items-center gap-2"
          >
            + Thêm cây mới
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-6 border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Tìm kiếm cây theo tên hoặc tên khoa học..." 
            className="border border-gray-300 p-2.5 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all bg-white text-sm font-semibold text-gray-700"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Tất cả danh mục</option>
            <option value="Trong nhà">Trong nhà</option>
            <option value="Ngoài trời">Ngoài trời</option>
            <option value="Ban công">Ban công</option>
            <option value="Khác">Khác</option>
          </select>
          <button type="submit" className="bg-[#0da487] hover:bg-[#009289] active:scale-95 text-white px-6 py-2.5 rounded-md shadow transition-colors font-semibold text-sm cursor-pointer">
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col justify-center items-center gap-3 text-gray-400">
            <svg className="animate-spin h-10 w-10 text-[#0da487]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="font-semibold text-sm">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0da487]/10 border-b border-gray-200 text-[#0da487] uppercase text-xs font-bold tracking-wider">
                  <th className="p-4 text-center w-24">Hình ảnh</th>
                  <th className="p-4">Tên cây / Khoa học</th>
                  <th className="p-4 w-40">Danh mục</th>
                  <th className="p-4 w-40 text-center">Trạng thái</th>
                  <th className="p-4 text-center w-48">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {plants.map((plant) => {
                  // Render category badge
                  let categoryBadge = (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-600 border border-gray-200">
                      {plant.category}
                    </span>
                  );
                  if (plant.category === 'Trong nhà') {
                    categoryBadge = (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Trong nhà
                      </span>
                    );
                  } else if (plant.category === 'Ngoài trời') {
                    categoryBadge = (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Ngoài trời
                      </span>
                    );
                  } else if (plant.category === 'Ban công') {
                    categoryBadge = (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                        Ban công
                      </span>
                    );
                  }

                  // Render status badge
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Đã duyệt
                    </span>
                  );
                  if (plant.approvalStatus === 'pending') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        Chờ duyệt
                      </span>
                    );
                  } else if (plant.approvalStatus === 'rejected') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Từ chối
                      </span>
                    );
                  }

                  return (
                    <tr key={plant.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-center">
                        {plant.imageUrl || plant.image ? (
                          <img src={plant.imageUrl || plant.image} alt={plant.name} className="w-14 h-14 object-cover rounded shadow-sm border border-gray-150 mx-auto" />
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-400 text-xs font-semibold mx-auto">No Image</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-800 text-[0.95rem]">{plant.name}</div>
                        <div className="text-xs text-gray-400 font-medium italic mt-0.5">{plant.scientificName || 'Chưa cập nhật tên khoa học'}</div>
                        {mode === 'history' && (
                          <>
                            {plant.contributor ? (
                              <div className="text-[0.7rem] text-gray-400 mt-1 font-semibold flex flex-col gap-0.5">
                                <div>Đóng góp bởi: <span className="text-[#0da487] font-bold">{plant.contributor.fullName || 'Người dùng'}</span></div>
                                <div className="text-[0.65rem] text-gray-500 font-normal">{plant.contributor.email}</div>
                              </div>
                            ) : plant.contributorId ? (
                              <div className="text-[0.7rem] text-gray-400 mt-1 font-semibold flex items-center gap-1">
                                <span>Đóng góp bởi:</span> 
                                <span className="text-gray-500 bg-gray-50 border border-gray-150 px-1.5 py-0.5 rounded text-[0.65rem] max-w-[120px] truncate" title={plant.contributorId}>{plant.contributorId}</span>
                              </div>
                            ) : null}
                          </>
                        )}
                      </td>
                      <td className="p-4">{categoryBadge}</td>
                      <td className="p-4 text-center">{statusBadge}</td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          {/* Duyệt & Từ chối cho trạng thái Pending */}
                          {plant.approvalStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(plant.id)}
                                className="p-2 bg-emerald-50 border border-emerald-100 hover:bg-emerald-500 hover:text-white rounded-lg text-emerald-600 transition duration-150 cursor-pointer"
                                title="Phê duyệt vào thư viện chính thức"
                              >
                                <FaCheck className="text-xs" />
                              </button>
                              <button
                                onClick={() => handleReject(plant.id)}
                                className="p-2 bg-amber-50 border border-amber-100 hover:bg-amber-500 hover:text-white rounded-lg text-amber-600 transition duration-150 cursor-pointer"
                                title="Từ chối đề xuất này"
                              >
                                <FaTimes className="text-xs" />
                              </button>
                            </>
                          )}

                          {/* Khôi phục/Duyệt lại cho trạng thái Rejected */}
                          {plant.approvalStatus === 'rejected' && (
                            <button
                              onClick={() => handleApprove(plant.id)}
                              className="p-2 bg-emerald-50 border border-emerald-100 hover:bg-emerald-500 hover:text-white rounded-lg text-emerald-600 transition duration-150 cursor-pointer"
                              title="Duyệt lại và đưa vào thư viện chính thức"
                            >
                              <FaUndo className="text-xs" />
                            </button>
                          )}

                          {/* Chỉnh sửa */}
                          <Link
                            to={`/admin/library-plants/edit/${plant.id}`}
                            className="p-2 bg-blue-50 border border-blue-100 hover:bg-blue-500 hover:text-white rounded-lg text-blue-600 transition duration-150 cursor-pointer flex items-center justify-center"
                            title="Sửa thông tin chi tiết"
                          >
                            <FaEdit className="text-xs" />
                          </Link>

                          {/* Xóa vĩnh viễn */}
                          <button
                            onClick={() => handleDelete(plant.id)}
                            className="p-2 bg-rose-50 border border-rose-100 hover:bg-rose-500 hover:text-white rounded-lg text-rose-600 transition duration-150 cursor-pointer"
                            title="Xóa vĩnh viễn khỏi thư viện"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {plants.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-16 text-center text-gray-400 font-bold text-base">Không tìm thấy dữ liệu cây trồng.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 border border-gray-200 rounded-md font-medium text-gray-600 hover:bg-[#0da487]/10 hover:text-[#0da487] hover:border-[#0da487] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-colors cursor-pointer"
          >
            Trang trước
          </button>
          <span className="px-4 py-2 font-semibold text-[#0da487]">Trang {currentPage} / {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 border border-gray-200 rounded-md font-medium text-gray-600 hover:bg-[#0da487]/10 hover:text-[#0da487] hover:border-[#0da487] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-colors cursor-pointer"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default LibraryPlantList;
