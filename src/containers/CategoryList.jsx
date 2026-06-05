import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { apiGetCategories, apiCreateCategory, apiUpdateCategory, apiDeleteCategory } from '../services/categoryService';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiGetCategories();
      if (res?.data?.data) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể tải danh sách danh mục.',
        icon: 'error',
        confirmButtonColor: '#0da487',
        customClass: { popup: 'rounded-[1rem]' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    Swal.fire({
      title: 'Thêm Danh mục mới',
      input: 'text',
      inputPlaceholder: 'Nhập tên danh mục...',
      showCancelButton: true,
      confirmButtonText: 'Lưu lại',
      cancelButtonText: 'Hủy bỏ',
      confirmButtonColor: '#0da487',
      cancelButtonColor: 'rgba(160, 160, 160, 1)',
      customClass: { popup: 'rounded-[1rem]' },
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Tên danh mục không được để trống!';
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await apiCreateCategory(result.value);
          Swal.fire({
            title: 'Thành công!',
            text: 'Đã thêm danh mục mới.',
            icon: 'success',
            confirmButtonColor: '#0da487',
            customClass: { popup: 'rounded-[1rem]' }
          });
          fetchCategories();
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Lỗi!',
            text: error.response?.data?.message || 'Có lỗi xảy ra khi tạo danh mục.',
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

  const handleEdit = (category) => {
    Swal.fire({
      title: 'Chỉnh sửa Danh mục',
      input: 'text',
      inputValue: category.name,
      inputPlaceholder: 'Nhập tên danh mục mới...',
      showCancelButton: true,
      confirmButtonText: 'Cập nhật',
      cancelButtonText: 'Hủy bỏ',
      confirmButtonColor: '#0da487',
      cancelButtonColor: 'rgba(160, 160, 160, 1)',
      customClass: { popup: 'rounded-[1rem]' },
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Tên danh mục không được để trống!';
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await apiUpdateCategory(category.id, result.value);
          Swal.fire({
            title: 'Thành công!',
            text: 'Đã cập nhật danh mục.',
            icon: 'success',
            confirmButtonColor: '#0da487',
            customClass: { popup: 'rounded-[1rem]' }
          });
          fetchCategories();
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Lỗi!',
            text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục.',
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

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Xóa danh mục này có thể ảnh hưởng đến dữ liệu các cây liên quan. Thao tác này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'rgba(160, 160, 160, 1)',
      confirmButtonText: 'Xóa ngay',
      cancelButtonText: 'Hủy bỏ',
      customClass: { popup: 'rounded-[1rem]' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await apiDeleteCategory(id);
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Danh mục đã được xóa thành công.',
            icon: 'success',
            confirmButtonColor: '#0da487',
            customClass: { popup: 'rounded-[1rem]' }
          });
          fetchCategories();
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: 'Lỗi!',
            text: error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục.',
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

  return (
    <div className="p-6 max-w-5xl mx-auto pb-12 relative animate-[fadeIn_0.5s_ease-out]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục Cây trồng</h1>
        <button
          onClick={handleCreate}
          className="bg-[#0da487] hover:bg-[#009289] text-white px-5 py-2.5 rounded-md shadow-md transition-all font-semibold flex items-center gap-2 cursor-pointer text-sm"
        >
          + Thêm danh mục mới
        </button>
      </div>

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
                  <th className="p-4 w-16 text-center">STT</th>
                  <th className="p-4">Tên danh mục</th>
                  <th className="p-4 w-60">Ngày tạo</th>
                  <th className="p-4 text-center w-40">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-gray-400 font-medium">Chưa có danh mục nào được tạo.</td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-center text-gray-500 font-semibold">{index + 1}</td>
                      <td className="p-4 font-semibold text-gray-800">{category.name}</td>
                      <td className="p-4 text-gray-500 font-medium">
                        {new Date(category.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 bg-blue-50 border border-blue-100 hover:bg-blue-500 hover:text-white rounded-lg text-blue-600 transition duration-150 cursor-pointer"
                            title="Chỉnh sửa tên danh mục"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 bg-rose-50 border border-rose-100 hover:bg-rose-500 hover:text-white rounded-lg text-rose-600 transition duration-150 cursor-pointer"
                            title="Xóa danh mục"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
