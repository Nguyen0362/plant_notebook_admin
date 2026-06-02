import React, { useEffect, useState } from 'react';
import { apiGetPlants, apiApprovePlant, apiRejectPlant, apiDeletePlant } from '../../services/libraryPlantService';
import { Link } from 'react-router-dom';
import { path } from '../../utils/constant';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const LibraryPlantList = () => {
  const [plants, setPlants] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const response = await apiGetPlants({
        page: currentPage,
        limit: 10,
        search,
        approvalStatus: statusFilter
      });
      if (response?.data?.data) {
        setPlants(response.data.data.plants);
        setTotalItems(response.data.data.totalItems);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching plants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, [currentPage, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPlants();
  };

  const handleApprove = async (id) => {
    if (window.confirm('Bạn có chắc muốn duyệt cây này?')) {
      try {
        await apiApprovePlant(id);
        fetchPlants();
      } catch (error) {
        alert('Có lỗi xảy ra khi duyệt cây.');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Bạn có chắc muốn từ chối cây này?')) {
      try {
        await apiRejectPlant(id);
        fetchPlants();
      } catch (error) {
        alert('Có lỗi xảy ra khi từ chối cây.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa cây này khỏi thư viện?')) {
      try {
        await apiDeletePlant(id);
        fetchPlants();
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa cây.');
      }
    }
  };

  return (
    <div className="p-4 w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Thư viện Cây</h1>
        <Link 
          to={`/admin/${path.LIBRARY_PLANTS_ADD}`} 
          className="bg-[#0da487] hover:bg-[#009289] text-white px-5 py-2.5 rounded-md shadow-md transition-all font-semibold flex items-center gap-2"
        >
          + Thêm cây mới
        </Link>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm mb-6 border border-gray-100">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên..." 
            className="border border-gray-300 p-2.5 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all bg-white"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="approved">Đã duyệt (Approved)</option>
            <option value="pending">Chờ duyệt (Pending)</option>
            <option value="rejected">Từ chối (Rejected)</option>
          </select>
          <button type="submit" className="bg-[#0da487] hover:bg-[#009289] text-white px-6 py-2.5 rounded-md shadow transition-colors font-semibold">
            Tìm kiếm
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-medium">
            <svg className="animate-spin h-8 w-8 text-[#0da487] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0da487]/10 border-b border-gray-200 text-[#0da487] uppercase text-xs font-bold tracking-wider">
                  <th className="p-4">Hình ảnh</th>
                  <th className="p-4">Tên cây / Khoa học</th>
                  <th className="p-4">Danh mục</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {plants.map((plant) => (
                  <tr key={plant.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {plant.imageUrl || plant.image ? (
                        <img src={plant.imageUrl || plant.image} alt={plant.name} className="w-16 h-16 object-cover rounded shadow-sm" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No img</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{plant.name}</div>
                      <div className="text-sm text-gray-500 italic">{plant.scientificName}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {plant.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {plant.approvalStatus === 'approved' && <span className="text-green-600 font-semibold">Approved</span>}
                      {plant.approvalStatus === 'pending' && <span className="text-yellow-600 font-semibold">Pending</span>}
                      {plant.approvalStatus === 'rejected' && <span className="text-red-600 font-semibold">Rejected</span>}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3 text-lg">
                        {plant.approvalStatus === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(plant.id)} title="Duyệt" className="text-green-500 hover:text-green-700">
                              <FaCheck />
                            </button>
                            <button onClick={() => handleReject(plant.id)} title="Từ chối" className="text-yellow-500 hover:text-yellow-700">
                              <FaTimes />
                            </button>
                          </>
                        )}
                        <Link to={`/admin/library-plants/edit/${plant.id}`} title="Chỉnh sửa" className="text-blue-500 hover:text-blue-700">
                          <FaEdit />
                        </Link>
                        <button onClick={() => handleDelete(plant.id)} title="Xóa" className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {plants.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">Không tìm thấy dữ liệu cây trồng.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 border rounded-md font-medium text-gray-600 hover:bg-[#0da487]/10 hover:text-[#0da487] hover:border-[#0da487] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-colors"
          >
            Trang trước
          </button>
          <span className="px-4 py-2 font-semibold text-[#0da487]">Trang {currentPage} / {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 border rounded-md font-medium text-gray-600 hover:bg-[#0da487]/10 hover:text-[#0da487] hover:border-[#0da487] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-colors"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default LibraryPlantList;
