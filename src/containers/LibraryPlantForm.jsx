import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetPlantById, apiCreatePlant, apiUpdatePlant } from '../services/libraryPlantService';
import { path } from '../utils/constant';
import Swal from 'sweetalert2';

const LibraryPlantForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    category: 'Trong nhà',
    shortDescription: '',
    description: '',
    lightLevel: '',
    waterNeed: '',
    difficulty: '',
    temperature: '',
    humidity: '',
    toxicity: '',
    badge: '',
    isTrending: false,
    isRare: false
  });

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [careGuide, setCareGuide] = useState(['']);
  const [funFacts, setFunFacts] = useState(['']);
  const [growthTimeline, setGrowthTimeline] = useState([{ monthLabel: '', note: '' }]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchPlantDetail();
    }
  }, [id]);

  const fetchPlantDetail = async () => {
    try {
      const res = await apiGetPlantById(id);
      if (res?.data?.data) {
        const p = res.data.data;
        setFormData({
          name: p.name || '',
          scientificName: p.scientificName || '',
          category: p.category || 'Trong nhà',
          shortDescription: p.shortDescription || '',
          description: p.description || '',
          lightLevel: p.lightLevel || '',
          waterNeed: p.waterNeed || '',
          difficulty: p.difficulty || '',
          temperature: p.temperature || '',
          humidity: p.humidity || '',
          toxicity: p.toxicity || '',
          badge: p.badge || '',
          isTrending: p.isTrending || false,
          isRare: p.isRare || false
        });
        
        setPreviewImage(p.imageUrl || p.image || null);
        
        if (p.careGuide && p.careGuide.length > 0) {
          const formattedCare = p.careGuide.map(item => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
              if (item.title && item.content) return `${item.title}: ${item.content}`;
              if (item.content) return item.content;
              if (item.text) return item.text;
              if (item.title) return item.title;
              return JSON.stringify(item);
            }
            return '';
          }).filter(Boolean);
          setCareGuide(formattedCare.length > 0 ? formattedCare : ['']);
        } else {
          setCareGuide(['']);
        }
        
        if (p.funFacts && p.funFacts.length > 0) {
          const formattedFun = p.funFacts.map(item => (typeof item === 'string' ? item : JSON.stringify(item))).filter(Boolean);
          setFunFacts(formattedFun.length > 0 ? formattedFun : ['']);
        } else {
          setFunFacts(['']);
        }
        
        if (p.growthTimeline && p.growthTimeline.length > 0) {
          const formattedGrowth = p.growthTimeline.map(item => {
            if (item && typeof item === 'object') {
              return {
                monthLabel: item.monthLabel || item.stage || item.duration || '',
                note: item.note || ''
              };
            }
            if (typeof item === 'string') {
              return { monthLabel: '', note: item };
            }
            return { monthLabel: '', note: '' };
          });
          setGrowthTimeline(formattedGrowth);
        } else {
          setGrowthTimeline([{ monthLabel: '', note: '' }]);
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể tải thông tin cây trồng!',
        icon: 'error',
        confirmButtonColor: '#0da487',
        customClass: { popup: 'rounded-[1rem]' }
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // --- Handlers for dynamic arrays ---
  const updateArrayField = (setter, index, value) => {
    setter(prev => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  };
  const addArrayField = (setter, emptyVal) => setter(prev => [...prev, emptyVal]);
  const removeArrayField = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

  const updateGrowthTimeline = (index, field, value) => {
    setGrowthTimeline(prev => {
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], [field]: value };
      return newArr;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      if (!isEdit) {
        submitData.append('id', crypto.randomUUID());
      }

      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      submitData.append('careGuide', JSON.stringify(careGuide.filter(Boolean)));
      submitData.append('funFacts', JSON.stringify(funFacts.filter(Boolean)));
      submitData.append('growthTimeline', JSON.stringify(growthTimeline.filter(i => i.monthLabel || i.note)));

      if (image) {
        submitData.append('image', image);
      }

      if (isEdit) {
        await apiUpdatePlant(id, submitData);
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã cập nhật thông tin cây thành công.',
          icon: 'success',
          confirmButtonColor: '#0da487',
          customClass: { popup: 'rounded-[1rem]' }
        }).then(() => {
          navigate(`/admin/${path.LIBRARY_PLANTS}`);
        });
      } else {
        await apiCreatePlant(submitData);
        Swal.fire({
          title: 'Thành công!',
          text: 'Đã tạo mới cây trồng thành công.',
          icon: 'success',
          confirmButtonColor: '#0da487',
          customClass: { popup: 'rounded-[1rem]' }
        }).then(() => {
          navigate(`/admin/${path.LIBRARY_PLANTS}`);
        });
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
      Swal.fire({
        title: 'Lỗi!',
        text: 'Thao tác thất bại: ' + errorMsg,
        icon: 'error',
        confirmButtonColor: '#0da487',
        customClass: { popup: 'rounded-[1rem]' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 mt-8 mb-16 relative animate-[fadeIn_0.5s_ease-out]">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        {isEdit ? 'Chỉnh sửa Cây' : 'Thêm Cây Mới'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên cây <span className="text-red-500">*</span></label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên khoa học</label>
            <input type="text" name="scientificName" value={formData.scientificName} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium italic" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all bg-white font-medium text-gray-700">
              <option value="Trong nhà">Trong nhà</option>
              <option value="Ngoài trời">Ngoài trời</option>
              <option value="Ban công">Ban công</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mức độ ánh sáng <span className="text-red-500">*</span></label>
            <input required type="text" name="lightLevel" value={formData.lightLevel} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nhu cầu nước <span className="text-red-500">*</span></label>
            <input required type="text" name="waterNeed" value={formData.waterNeed} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Độ khó chăm sóc <span className="text-red-500">*</span></label>
            <input required type="text" name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả ngắn gọn <span className="text-red-500">*</span></label>
          <textarea required name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium h-24" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả chi tiết <span className="text-red-500">*</span></label>
          <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium h-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nhiệt độ thích hợp</label>
            <input type="text" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Độ ẩm</label>
            <input type="text" name="humidity" value={formData.humidity} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Độc tính</label>
            <input type="text" name="toxicity" value={formData.toxicity} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Badge (Nhãn phụ)</label>
            <input type="text" name="badge" value={formData.badge} onChange={handleChange} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} className="w-5 h-5 text-[#0da487] rounded focus:ring-[#0da487]/30 border-gray-300" />
            <span className="text-sm font-bold text-gray-700">Đang thịnh hành (Trending)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isRare" checked={formData.isRare} onChange={handleChange} className="w-5 h-5 text-[#0da487] rounded focus:ring-[#0da487]/30 border-gray-300" />
            <span className="text-sm font-bold text-gray-700">Cây quý hiếm (Rare)</span>
          </label>
        </div>

        <hr className="border-gray-100" />
        
        {/* Dynamic Arrays */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <label className="block text-sm font-bold text-gray-800 mb-4">Hướng dẫn chăm sóc (Mỗi bước một dòng)</label>
          {careGuide.map((item, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input type="text" placeholder={`Bước ${index + 1}`} value={item} onChange={(e) => updateArrayField(setCareGuide, index, e.target.value)} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium bg-white" />
              <button type="button" onClick={() => removeArrayField(setCareGuide, index)} className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer">Xóa</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField(setCareGuide, '')} className="flex items-center gap-1.5 mt-3 px-4 py-2.5 border border-dashed border-gray-300 text-gray-500 hover:border-[#0da487] hover:text-[#0da487] rounded-xl text-xs font-bold transition-all cursor-pointer bg-white">
            + Thêm bước hướng dẫn
          </button>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <label className="block text-sm font-bold text-gray-800 mb-4">Sự thật thú vị (Fun Facts)</label>
          {funFacts.map((item, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input type="text" placeholder={`Sự thật thú vị #${index + 1}`} value={item} onChange={(e) => updateArrayField(setFunFacts, index, e.target.value)} className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium bg-white" />
              <button type="button" onClick={() => removeArrayField(setFunFacts, index)} className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer">Xóa</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField(setFunFacts, '')} className="flex items-center gap-1.5 mt-3 px-4 py-2.5 border border-dashed border-gray-300 text-gray-500 hover:border-[#0da487] hover:text-[#0da487] rounded-xl text-xs font-bold transition-all cursor-pointer bg-white">
            + Thêm sự thật thú vị
          </button>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <label className="block text-sm font-bold text-gray-800 mb-4">Quá trình phát triển</label>
          {growthTimeline.map((item, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input type="text" placeholder="Giai đoạn (vd: Tháng 1)" value={item.monthLabel} onChange={(e) => updateGrowthTimeline(index, 'monthLabel', e.target.value)} className="w-1/3 border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium bg-white" />
              <input type="text" placeholder="Ghi chú mô tả sự phát triển..." value={item.note} onChange={(e) => updateGrowthTimeline(index, 'note', e.target.value)} className="w-2/3 border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0da487]/20 focus:border-[#0da487] transition-all font-medium bg-white" />
              <button type="button" onClick={() => removeArrayField(setGrowthTimeline, index)} className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer">Xóa</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField(setGrowthTimeline, { monthLabel: '', note: '' })} className="flex items-center gap-1.5 mt-3 px-4 py-2.5 border border-dashed border-gray-300 text-gray-500 hover:border-[#0da487] hover:text-[#0da487] rounded-xl text-xs font-bold transition-all cursor-pointer bg-white">
            + Thêm giai đoạn phát triển
          </button>
        </div>

        <hr className="border-gray-100" />

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Hình ảnh cây trồng {!isEdit && <span className="text-red-500">*</span>}</label>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Upload Area */}
            <div className="flex-1 w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-[#0da487]/5 hover:border-[#0da487]/40 transition-all duration-300 group/upload">
                <div className="flex flex-col items-center justify-center py-4">
                  <svg className="w-10 h-10 mb-2 text-gray-300 group-hover/upload:text-[#0da487] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zm16.5-13.5h.008v.008h-.008V7.5z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-400 group-hover/upload:text-[#0da487] transition-colors">Nhấn để chọn ảnh</p>
                  <p className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP</p>
                </div>
                <input required={!isEdit} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            {/* Preview Area */}
            {previewImage && (
              <div className="flex-shrink-0">
                <div className="relative group/preview inline-block rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                  <img src={previewImage} alt="Preview" className="h-40 w-auto object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/10 transition-all duration-300 rounded-2xl"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-150 mt-8">
          <button type="button" onClick={() => navigate(`/admin/${path.LIBRARY_PLANTS}`)} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all cursor-pointer text-sm">
            Hủy
          </button>
          <button type="submit" disabled={loading} className="px-6 py-3 bg-[#0da487] text-white font-bold rounded-xl shadow-md hover:bg-[#009289] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center min-w-[140px] cursor-pointer text-sm">
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Lưu thông tin'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LibraryPlantForm;
