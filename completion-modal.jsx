// ==================== JOB COMPLETION MODAL WITH PHOTO PROOF ====================

const { useState } = React;

function JobCompletionModal({ job, onComplete, onCancel, processing }) {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  const handlePhotoCapture = (file, preview) => {
    setPhoto(file);
    setPhotoPreview(preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert('Please take a photo as proof of delivery');
      return;
    }

    setUploading(true);

    try {
      // Upload photo first if we have one
      let photoUrl = null;
      if (photo) {
        // Convert to base64 for storage (in production, upload to S3/cloud storage)
        photoUrl = photoPreview;
      }

      const deliveryProof = {
        photo: photoUrl,
        notes: notes || 'Delivered successfully',
        timestamp: new Date().toISOString()
      };

      await onComplete(job.id, JSON.stringify(deliveryProof));
    } catch (error) {
      console.error('Error completing job:', error);
      alert('Failed to complete delivery. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Complete Delivery</h2>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600"
              disabled={processing || uploading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Job Info */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Delivery Address</p>
            <p className="font-medium text-slate-800">{job.delivery_address}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Proof */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Photo Proof of Delivery <span className="text-red-500">*</span>
              </label>
              <PhotoCapture
                onCapture={handlePhotoCapture}
                existingPhoto={photoPreview}
              />
              <p className="text-xs text-slate-500 mt-2">
                Take a clear photo showing the delivered items at the destination
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Delivery Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Left with security guard, handed to recipient..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                disabled={processing || uploading}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing || uploading || !photo}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading || processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Completing...
                  </span>
                ) : (
                  'Complete Delivery'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Export to window
window.JobCompletionModal = JobCompletionModal;
