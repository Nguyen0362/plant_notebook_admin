import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetPlantById, apiCreatePlant, apiUpdatePlant } from '../../services/libraryPlantService';
import { path } from '../../utils/constant';

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
        
        if (p.careGuide && p.careGuide.length > 0) setCareGuide(p.careGuide);
        if (p.funFacts && p.funFacts.length > 0) setFunFacts(p.funFacts);
        if (p.growthTimeline && p.growthTimeline.length > 0) setGrowthTimeline(p.growthTimeline);
      }
    } catch (error) {
      console.error(error);
      alert('Không thể tải thông tin cây!');
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
      // Required for create if missing id is handled in backend (Wait, we should send an id if creating, or backend auto-generates. The backend says: if (!id) error. Let's send a fake ID for now or fix backend to use UUIDV4). 
      // Actually backend model uses UUIDV4 as default for `LibraryPlant.id` but controller checks `!req.body.id`.
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
        alert('Cập nhật thành công!');
      } else {
        await apiCreatePlant(submitData);
        alert('Thêm mới thành công!');
      }
      navigate(`/admin/${path.LIBRARY_PLANTS}`);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
      alert('Lỗi: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 mt-8 mb-16">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-4">
        {isEdit ? 'Chỉnh sửa Cây' : 'Thêm Cây Mới'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên cây <span className="text-red-500">*</span></label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên khoa học</label>
            <input type="text" name="scientificName" value={formData.scientificName} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all bg-white">
              <option value="Trong nhà">Trong nhà</option>
              <option value="Ngoài trời">Ngoài trời</option>
              <option value="Ban công">Ban công</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mức độ ánh sáng <span className="text-red-500">*</span></label>
            <input required type="text" name="lightLevel" value={formData.lightLevel} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nhu cầu nước <span className="text-red-500">*</span></label>
            <input required type="text" name="waterNeed" value={formData.waterNeed} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Độ khó chăm sóc <span className="text-red-500">*</span></label>
            <input required type="text" name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả ngắn gọn <span className="text-red-500">*</span></label>
          <textarea required name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all h-24" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả chi tiết <span className="text-red-500">*</span></label>
          <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all h-40" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nhiệt độ</label>
            <input type="text" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Độ ẩm</label>
            <input type="text" name="humidity" value={formData.humidity} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Độc tính</label>
            <input type="text" name="toxicity" value={formData.toxicity} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Badge (Nhãn)</label>
            <input type="text" name="badge" value={formData.badge} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
          </div>
        </div>

        <div className="flex gap-8 p-4 bg-gray-50 rounded-md border border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} className="w-5 h-5 text-[#0da487] rounded focus:ring-[#0da487]" />
            <span className="text-sm font-bold text-gray-700">Đang thịnh hành (Trending)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isRare" checked={formData.isRare} onChange={handleChange} className="w-5 h-5 text-[#0da487] rounded focus:ring-[#0da487]" />
            <span className="text-sm font-bold text-gray-700">Cây hiếm (Rare)</span>
          </label>
        </div>

        <hr className="border-gray-200" />
        
        {/* Dynamic Arrays */}
        <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
          <label className="block text-sm font-bold text-gray-800 mb-4">Hướng dẫn chăm sóc (Mỗi bước 1 dòng)</label>
          {careGuide.map((item, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input type="text" value={item} onChange={(e) => updateArrayField(setCareGuide, index, e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
              <button type="button" onClick={() => removeArrayField(setCareGuide, index)} className="px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-semibold transition-colors">Xóa</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField(setCareGuide, '')} className="text-[#0da487] font-semibold text-sm mt-2 hover:underline">+ Thêm bước</button>
        </div>

        <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
          <label className="block text-sm font-bold text-gray-800 mb-4">Sự thật thú vị (Fun Facts)</label>
          {funFacts.map((item, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input type="text" value={item} onChange={(e) => updateArrayField(setFunFacts, index, e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
              <button type="button" onClick={() => removeArrayField(setFunFacts, index)} className="px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-semibold transition-colors">Xóa</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField(setFunFacts, '')} className="text-[#0da487] font-semibold text-sm mt-2 hover:underline">+ Thêm Fun Fact</button>
        </div>

        <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
          <label className="block text-sm font-bold text-gray-800 mb-4">Quá trình phát triển</label>
          {growthTimeline.map((item, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input type="text" placeholder="Giai đoạn (vd: Tháng 1)" value={item.monthLabel} onChange={(e) => updateGrowthTimeline(index, 'monthLabel', e.target.value)} className="w-1/3 border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
              <input type="text" placeholder="Ghi chú" value={item.note} onChange={(e) => updateGrowthTimeline(index, 'note', e.target.value)} className="w-2/3 border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0da487]/30 focus:border-[#0da487] transition-all" />
              <button type="button" onClick={() => removeArrayField(setGrowthTimeline, index)} className="px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-semibold transition-colors">Xóa</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField(setGrowthTimeline, { monthLabel: '', note: '' })} className="text-[#0da487] font-semibold text-sm mt-2 hover:underline">+ Thêm giai đoạn</button>
        </div>

        <hr className="border-gray-200" />

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Hình ảnh {!isEdit && <span className="text-red-500">*</span>}</label>
          <input required={!isEdit} type="file" accept="image/*" onChange={handleImageChange} className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#0da487]/10 file:text-[#0da487] hover:file:bg-[#0da487]/20 transition-all cursor-pointer" />
          {previewImage && (
            <div className="mt-4 inline-block p-2 border border-gray-200 rounded-lg">
              <img src={previewImage} alt="Preview" className="h-56 object-cover rounded-md shadow-sm" />
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-200 mt-8">
          <button type="button" onClick={() => navigate(`/admin/${path.LIBRARY_PLANTS}`)} className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-md shadow-sm hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button type="submit" disabled={loading} className="px-8 py-3 bg-[#0da487] text-white font-bold rounded-md shadow-md hover:bg-[#009289] disabled:opacity-50 transition-colors flex items-center justify-center min-w-[140px]">
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
