// ==================== ENHANCED FEATURES ====================
// Advanced components with Maps integration and photo proof

const { useState, useEffect, useRef } = React;

// Address Autocomplete Component
function AddressAutocomplete({ value, onChange, placeholder, label }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = async (e) => {
    const input = e.target.value;
    onChange({ address: input, location: null });

    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await window.MapsService.getAddressSuggestions(input);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Autocomplete error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    try {
      const placeDetails = await window.MapsService.getPlaceDetails(suggestion.id);
      onChange({
        address: placeDetails.address,
        location: placeDetails.location
      });
      setShowSuggestions(false);
    } catch (error) {
      console.error('Place details error:', error);
      onChange({ address: suggestion.description, location: null });
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value?.address || ''}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder={placeholder || 'Start typing an address...'}
          required
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-slate-100 last:border-0"
            >
              <div className="font-medium text-slate-800">{suggestion.mainText}</div>
              <div className="text-sm text-slate-500">{suggestion.secondaryText}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Photo Capture Component
function PhotoCapture({ onCapture, label, existingPhoto }) {
  const [preview, setPreview] = useState(existingPhoto || null);
  const [capturing, setCapturing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onCapture(file, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setPreview(null);
    onCapture(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {!preview ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleCameraClick}
            className="w-full border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">Take a photo</p>
                <p className="text-xs text-slate-500 mt-1">Or select from gallery</p>
              </div>
            </div>
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Captured photo"
            className="w-full h-64 object-cover rounded-lg border-2 border-slate-200"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            ✓ Photo captured
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Job Form with Maps and Auto-calculation
function EnhancedJobForm({ onSubmit, onCancel }) {
  const [pickup, setPickup] = useState({ address: '', location: null });
  const [delivery, setDelivery] = useState({ address: '', location: null });
  const [loadType, setLoadType] = useState('General Cargo');
  const [loadWeight, setLoadWeight] = useState('');
  const [loadDimensions, setLoadDimensions] = useState('');
  const [vehicleType, setVehicleType] = useState('PICKUP');
  const [instructions, setInstructions] = useState('');
  const [scheduledPickup, setScheduledPickup] = useState('');

  const [routeInfo, setRouteInfo] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const VEHICLE_TYPES = {
    PICKUP: { name: 'Pickup Truck', capacity: '1 ton', icon: '🚙', priceMultiplier: 1.0 },
    SMALL_TRUCK: { name: 'Small Truck', capacity: '2 tons', icon: '🚚', priceMultiplier: 1.3 },
    FLATBED: { name: 'Flatbed', capacity: '3 tons', icon: '🛻', priceMultiplier: 1.5 },
    LARGE_TRUCK: { name: 'Large Truck', capacity: '5 tons', icon: '🚛', priceMultiplier: 2.0 }
  };

  const LOAD_TYPES = [
    'Furniture', 'Electronics', 'Food & Beverages', 'Clothing',
    'Construction Materials', 'Waste/Disposal', 'General Cargo', 'Other'
  ];

  // Calculate route when both addresses are set
  useEffect(() => {
    if (pickup.location && delivery.location) {
      calculateRoute();
    }
  }, [pickup.location, delivery.location]);

  const calculateRoute = async () => {
    setCalculating(true);
    try {
      const route = await window.MapsService.calculateRoute(pickup.location, delivery.location);
      setRouteInfo(route);
    } catch (error) {
      console.error('Route calculation error:', error);
    } finally {
      setCalculating(false);
    }
  };

  const calculatePrice = () => {
    if (!routeInfo) return 0;

    const BASE_PRICE = 50; // NAD
    const PRICE_PER_KM = 8; // NAD
    const PRICE_PER_MIN = 2; // NAD
    const multiplier = VEHICLE_TYPES[vehicleType]?.priceMultiplier || 1.0;

    const total = (
      BASE_PRICE +
      (parseFloat(routeInfo.distance.km) * PRICE_PER_KM) +
      (routeInfo.duration.minutes * PRICE_PER_MIN)
    ) * multiplier;

    return Math.round(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickup.location || !delivery.location) {
      alert('Please select addresses from the suggestions');
      return;
    }

    setSubmitting(true);

    const jobData = {
      pickup: {
        address: pickup.address,
        location: pickup.location
      },
      delivery: {
        address: delivery.address,
        location: delivery.location
      },
      loadType,
      loadWeight: loadWeight || 'Not specified',
      loadDimensions: loadDimensions || 'Not specified',
      vehicleType,
      specialInstructions: instructions,
      scheduledPickup: scheduledPickup || null
    };

    await onSubmit(jobData);
    setSubmitting(false);
  };

  const estimatedPrice = calculatePrice();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Request Transport</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup & Delivery with Autocomplete */}
          <div className="grid md:grid-cols-2 gap-4">
            <AddressAutocomplete
              value={pickup}
              onChange={setPickup}
              placeholder="e.g., Windhoek CBD"
              label="Pickup Location"
            />

            <AddressAutocomplete
              value={delivery}
              onChange={setDelivery}
              placeholder="e.g., Eros, Windhoek"
              label="Delivery Location"
            />
          </div>

          {/* Route Information */}
          {calculating && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">Calculating route...</p>
            </div>
          )}

          {routeInfo && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-700 font-medium">Distance</p>
                  <p className="text-lg font-bold text-green-900">{routeInfo.distance.text}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">Estimated Time</p>
                  <p className="text-lg font-bold text-green-900">{routeInfo.duration.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              <Truck className="w-4 h-4 inline mr-1" />
              Vehicle Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(VEHICLE_TYPES).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVehicleType(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    vehicleType === type
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{VEHICLE_TYPES[type].icon}</div>
                  <div className="text-xs font-medium text-slate-700">{VEHICLE_TYPES[type].name}</div>
                  <div className="text-xs text-slate-500">{VEHICLE_TYPES[type].capacity}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Load Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Package className="w-4 h-4 inline mr-1" />
                Load Type
              </label>
              <select
                value={loadType}
                onChange={(e) => setLoadType(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {LOAD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Weight className="w-4 h-4 inline mr-1" />
                Estimated Weight
              </label>
              <input
                type="text"
                value={loadWeight}
                onChange={(e) => setLoadWeight(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., 500 kg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Ruler className="w-4 h-4 inline mr-1" />
                Dimensions
              </label>
              <input
                type="text"
                value={loadDimensions}
                onChange={(e) => setLoadDimensions(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., 2m x 1m x 1m"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Scheduled Pickup (Optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledPickup}
                onChange={(e) => setScheduledPickup(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Special Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Any special handling requirements..."
            />
          </div>

          {/* Price Estimate */}
          {routeInfo && estimatedPrice > 0 && (
            <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Estimated Price</p>
                  <p className="text-3xl font-bold">NAD {estimatedPrice.toFixed(2)}</p>
                  <p className="text-xs opacity-75 mt-1">Final price may vary based on actual route</p>
                </div>
                <DollarSign className="w-12 h-12 opacity-50" />
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !pickup.location || !delivery.location}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Job...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Export components
window.AddressAutocomplete = AddressAutocomplete;
window.PhotoCapture = PhotoCapture;
window.EnhancedJobForm = EnhancedJobForm;
