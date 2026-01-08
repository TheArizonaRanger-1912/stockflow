import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, Calendar, FileText, Image, ZoomIn } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ReceiptsModal = ({ onClose }) => {
  const { selectedRestaurant, addReceipt, deleteReceipt, getRestaurantReceipts, canManageInventory } = useApp();
  const [note, setNote] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const receipts = getRestaurantReceipts(selectedRestaurant?.id);
  const canManage = canManageInventory();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB for localStorage)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!previewImage) return;

    setIsUploading(true);

    // Small delay for UX
    setTimeout(() => {
      addReceipt(selectedRestaurant.id, previewImage, note);
      setPreviewImage(null);
      setNote('');
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 300);
  };

  const handleDelete = (receiptId) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      deleteReceipt(receiptId);
      if (viewingReceipt?.id === receiptId) {
        setViewingReceipt(null);
      }
    }
  };

  const cancelPreview = () => {
    setPreviewImage(null);
    setNote('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] border border-slate-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Shipment Receipts</h2>
            <p className="text-slate-400 text-sm mt-1">{selectedRestaurant?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left side - Upload & List */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-slate-700">
            {/* Upload section */}
            {canManage && (
              <div className="mb-6">
                {!previewImage ? (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center hover:border-amber-500/50 hover:bg-slate-700/30 transition-all">
                      <Upload size={40} className="mx-auto text-slate-500 mb-3" />
                      <p className="text-slate-300 font-medium">Click to upload receipt</p>
                      <p className="text-slate-500 text-sm mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="bg-slate-700/50 rounded-2xl p-4">
                    <div className="relative mb-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full max-h-48 object-contain rounded-xl"
                      />
                      <button
                        onClick={cancelPreview}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note (optional)"
                      className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={cancelPreview}
                        className="flex-1 py-2 rounded-xl bg-slate-600 hover:bg-slate-500 text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50"
                      >
                        {isUploading ? 'Uploading...' : 'Upload Receipt'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Receipts list */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Uploaded Receipts ({receipts.length})
              </h3>

              {receipts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-500">No receipts uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {receipts.map((receipt) => (
                    <div
                      key={receipt.id}
                      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                        viewingReceipt?.id === receipt.id
                          ? 'bg-amber-500/20 border border-amber-500/30'
                          : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                      }`}
                      onClick={() => setViewingReceipt(receipt)}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-600 flex-shrink-0">
                        <img
                          src={receipt.imageData}
                          alt="Receipt thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-amber-400 text-sm mb-1">
                          <Calendar size={14} />
                          <span>{receipt.date}</span>
                        </div>
                        {receipt.note && (
                          <p className="text-white text-sm truncate">{receipt.note}</p>
                        )}
                        <p className="text-slate-500 text-xs">
                          {new Date(receipt.uploadedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {canManage && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(receipt.id);
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Preview */}
          <div className="w-96 p-6 bg-slate-900/50 flex flex-col">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Preview
            </h3>

            {viewingReceipt ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-slate-800 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                  <img
                    src={viewingReceipt.imageData}
                    alt="Receipt"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    <Calendar size={16} />
                    <span className="font-medium">{viewingReceipt.date}</span>
                  </div>
                  {viewingReceipt.note && (
                    <p className="text-white mb-2">{viewingReceipt.note}</p>
                  )}
                  <p className="text-slate-500 text-sm">
                    Uploaded at {new Date(viewingReceipt.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Image size={48} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-500">Select a receipt to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptsModal;
