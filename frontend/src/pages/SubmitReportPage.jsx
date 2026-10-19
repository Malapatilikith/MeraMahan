import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { reportApi, metaApi } from '../api/client';
import {
  Camera,
  Upload,
  X,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Info,
} from 'lucide-react';

export default function SubmitReportPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    stateId: '',
    cityId: '',
    locationArea: '',
    incidentDate: new Date().toISOString().split('T')[0],
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    metaApi.getCategories().then((res) => setCategories(res.data.data || [])).catch(() => {});
    metaApi.getStates().then((res) => setStates(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (formData.stateId) {
      metaApi.getCities(formData.stateId)
        .then((res) => setCities(res.data.data || []))
        .catch(() => setCities([]));
    } else {
      setCities([]);
      setFormData((prev) => ({ ...prev, cityId: '' }));
    }
  }, [formData.stateId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Limit to max 4 photos
    const combinedFiles = [...images, ...files].slice(0, 4);
    setImages(combinedFiles);

    const newPreviews = combinedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.categoryId) {
      setError('Please select an issue category.');
      return;
    }
    if (!formData.title.trim()) {
      setError('Please provide a title for the report.');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters long.');
      return;
    }
    if (!formData.stateId || !formData.cityId) {
      setError('Please select both your State and City.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('categoryId', formData.categoryId);
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('stateId', formData.stateId);
      data.append('cityId', formData.cityId);
      if (formData.locationArea.trim()) {
        data.append('locationArea', formData.locationArea.trim());
      }
      data.append('incidentDate', formData.incidentDate);

      images.forEach((img) => {
        data.append('images', img);
      });

      const res = await reportApi.createReport(data);
      const createdReport = res.data.data;

      // Navigate to created report detail
      navigate(`/reports/${createdReport.id}`, {
        state: { message: 'Your report has been submitted and is currently under screening.' },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to submit report. Please check your connection and inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-amber-50/50 via-white to-slate-50">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Create Citizen Report</h1>
            <p className="text-xs text-slate-500 mt-1">
              Your voice counts. Document public issues for community awareness and action.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Photo Upload Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Evidence Photographs (Max 4)
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />

              {previews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {previews.map((previewUrl, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden aspect-square border border-slate-200 bg-slate-100 group"
                    >
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-slate-900/80 hover:bg-rose-600 text-white p-1 rounded-full backdrop-blur-xs transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {previews.length < 4 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 flex flex-col items-center justify-center gap-1.5 aspect-square text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      <Camera className="w-5 h-5 text-slate-400" />
                      <span className="text-[11px] font-semibold">Add More</span>
                    </button>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#FF9933] bg-amber-50/20 hover:bg-amber-50/40 p-8 text-center cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-3 text-[#FF9933]">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Take Photo / Choose Image</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Upload clear photographs of the civic problem, location, or damage
                  </p>
                </div>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all font-medium"
              >
                <option value="">Select Category ▼</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.categoryGroup})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Broken streetlight on Gandhi Road causing dark spot"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={100}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                name="description"
                placeholder="Provide accurate, objective details about the issue observed..."
                value={formData.description}
                onChange={handleInputChange}
                maxLength={2000}
                required
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block text-right">
                {formData.description.length} / 2000 characters
              </span>
            </div>

            {/* State and City Selection (Mandatory Manual Input, No Geolocation!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State / Union Territory *
                </label>
                <select
                  name="stateId"
                  value={formData.stateId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all font-medium"
                >
                  <option value="">Select State ▼</option>
                  {states.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  disabled={!formData.stateId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all font-medium disabled:opacity-50"
                >
                  <option value="">
                    {formData.stateId ? 'Select City ▼' : 'Select State First'}
                  </option>
                  {cities.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Area & Landmark */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Area / Landmark (Manual description)
              </label>
              <input
                type="text"
                name="locationArea"
                placeholder="e.g. Near Pillar No. 42, Hitech City Main Road"
                value={formData.locationArea}
                onChange={handleInputChange}
                maxLength={200}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
              />
            </div>

            {/* Incident Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date of Observation *
              </label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={handleInputChange}
                required
                className="w-full sm:w-48 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Disclaimer reminder */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                By submitting this citizen report, you verify that the information is accurate and
                submitted in good faith. Reports are reviewed by community moderators before public
                display.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#e67e1a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting Report...' : 'Submit Citizen Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
