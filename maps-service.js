// ==================== GOOGLE MAPS SERVICE ====================
// This module handles Google Maps integration for address autocomplete and geocoding

// NOTE: To use this service, you need to:
// 1. Get a Google Maps API key from: https://console.cloud.google.com/
// 2. Enable these APIs:
//    - Maps JavaScript API
//    - Places API
//    - Geocoding API
//    - Directions API
// 3. Add your API key to backend/.env as GOOGLE_MAPS_API_KEY
// 4. Load the Maps script in HTML

class MapsService {
  constructor() {
    this.autocompleteService = null;
    this.placesService = null;
    this.directionsService = null;
    this.geocoder = null;
    this.isLoaded = false;
  }

  // Initialize Google Maps services
  async initialize() {
    if (this.isLoaded) return true;

    try {
      // Check if Google Maps is loaded
      if (typeof google === 'undefined' || !google.maps) {
        console.warn('Google Maps not loaded. Using fallback mode.');
        return false;
      }

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.geocoder = new google.maps.Geocoder();
      this.directionsService = new google.maps.DirectionsService();

      // Create a dummy div for PlacesService (required by Google Maps API)
      const dummyDiv = document.createElement('div');
      const dummyMap = new google.maps.Map(dummyDiv);
      this.placesService = new google.maps.places.PlacesService(dummyMap);

      this.isLoaded = true;
      console.log('✅ Google Maps services initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Maps:', error);
      return false;
    }
  }

  // Get address suggestions as user types
  async getAddressSuggestions(input, options = {}) {
    if (!this.isLoaded) {
      await this.initialize();
    }

    if (!this.autocompleteService) {
      // Fallback: return mock suggestions for development
      return this.getMockSuggestions(input);
    }

    return new Promise((resolve, reject) => {
      const request = {
        input,
        componentRestrictions: { country: options.country || 'na' }, // Namibia
        types: options.types || ['address']
      };

      this.autocompleteService.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const suggestions = predictions.map(p => ({
            id: p.place_id,
            description: p.description,
            mainText: p.structured_formatting.main_text,
            secondaryText: p.structured_formatting.secondary_text
          }));
          resolve(suggestions);
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([]);
        } else {
          console.warn('Autocomplete request failed:', status);
          resolve(this.getMockSuggestions(input));
        }
      });
    });
  }

  // Get detailed place information including coordinates
  async getPlaceDetails(placeId) {
    if (!this.isLoaded) {
      await this.initialize();
    }

    if (!this.placesService) {
      // Fallback: return mock location for development
      return this.getMockPlaceDetails(placeId);
    }

    return new Promise((resolve, reject) => {
      const request = {
        placeId,
        fields: ['name', 'formatted_address', 'geometry', 'place_id']
      };

      this.placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve({
            placeId: place.place_id,
            address: place.formatted_address,
            name: place.name,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
          });
        } else {
          console.warn('Place details request failed:', status);
          resolve(this.getMockPlaceDetails(placeId));
        }
      });
    });
  }

  // Geocode an address to get coordinates
  async geocodeAddress(address) {
    if (!this.isLoaded) {
      await this.initialize();
    }

    if (!this.geocoder) {
      return this.getMockGeocodeResult(address);
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          resolve({
            address: results[0].formatted_address,
            location: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            }
          });
        } else {
          console.warn('Geocoding failed:', status);
          resolve(this.getMockGeocodeResult(address));
        }
      });
    });
  }

  // Calculate distance and duration between two points
  async calculateRoute(origin, destination) {
    if (!this.isLoaded) {
      await this.initialize();
    }

    if (!this.directionsService) {
      return this.getMockRouteResult(origin, destination);
    }

    return new Promise((resolve, reject) => {
      const request = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING
      };

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result.routes[0]) {
          const route = result.routes[0].legs[0];
          resolve({
            distance: {
              value: route.distance.value, // meters
              text: route.distance.text,   // "15.2 km"
              km: (route.distance.value / 1000).toFixed(1)
            },
            duration: {
              value: route.duration.value, // seconds
              text: route.duration.text,   // "25 mins"
              minutes: Math.round(route.duration.value / 60)
            },
            polyline: route.overview_polyline
          });
        } else {
          console.warn('Directions request failed:', status);
          resolve(this.getMockRouteResult(origin, destination));
        }
      });
    });
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  // ==================== MOCK DATA FOR DEVELOPMENT ====================
  // These functions provide fallback data when Google Maps API is not available

  getMockSuggestions(input) {
    const namibianLocations = [
      { id: '1', description: 'Windhoek CBD, Khomas, Namibia', mainText: 'Windhoek CBD', secondaryText: 'Khomas, Namibia' },
      { id: '2', description: 'Eros, Windhoek, Namibia', mainText: 'Eros', secondaryText: 'Windhoek, Namibia' },
      { id: '3', description: 'Klein Windhoek, Khomas, Namibia', mainText: 'Klein Windhoek', secondaryText: 'Khomas, Namibia' },
      { id: '4', description: 'Olympia, Windhoek, Namibia', mainText: 'Olympia', secondaryText: 'Windhoek, Namibia' },
      { id: '5', description: 'Khomasdal, Windhoek, Namibia', mainText: 'Khomasdal', secondaryText: 'Windhoek, Namibia' },
      { id: '6', description: 'Walvis Bay, Erongo, Namibia', mainText: 'Walvis Bay', secondaryText: 'Erongo, Namibia' },
      { id: '7', description: 'Swakopmund, Erongo, Namibia', mainText: 'Swakopmund', secondaryText: 'Erongo, Namibia' },
      { id: '8', description: 'Oshakati, Oshana, Namibia', mainText: 'Oshakati', secondaryText: 'Oshana, Namibia' }
    ];

    return namibianLocations.filter(loc =>
      loc.description.toLowerCase().includes(input.toLowerCase())
    );
  }

  getMockPlaceDetails(placeId) {
    const locations = {
      '1': { address: 'Windhoek CBD, Khomas, Namibia', location: { lat: -22.5609, lng: 17.0658 } },
      '2': { address: 'Eros, Windhoek, Namibia', location: { lat: -22.5809, lng: 17.0858 } },
      '3': { address: 'Klein Windhoek, Khomas, Namibia', location: { lat: -22.5509, lng: 17.0558 } },
      '4': { address: 'Olympia, Windhoek, Namibia', location: { lat: -22.5909, lng: 17.0958 } },
      '5': { address: 'Khomasdal, Windhoek, Namibia', location: { lat: -22.5709, lng: 17.0458 } }
    };

    return locations[placeId] || {
      address: 'Windhoek, Namibia',
      location: { lat: -22.5609, lng: 17.0658 }
    };
  }

  getMockGeocodeResult(address) {
    return {
      address: address || 'Windhoek, Namibia',
      location: { lat: -22.5609, lng: 17.0658 }
    };
  }

  getMockRouteResult(origin, destination) {
    const distance = this.calculateDistance(
      origin.lat, origin.lng,
      destination.lat, destination.lng
    );

    const estimatedMinutes = Math.round(distance * 3); // Rough estimate: 3 min per km

    return {
      distance: {
        value: distance * 1000,
        text: `${distance.toFixed(1)} km`,
        km: distance.toFixed(1)
      },
      duration: {
        value: estimatedMinutes * 60,
        text: `${estimatedMinutes} mins`,
        minutes: estimatedMinutes
      }
    };
  }
}

// Create singleton instance
const mapsService = new MapsService();

// Initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    mapsService.initialize();
  });
}

// Export to window
window.MapsService = mapsService;
