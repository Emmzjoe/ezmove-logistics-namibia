class PricingService {
  constructor() {
    // Pricing structure (in NAD)
    this.basePrices = {
      PICKUP: 100,
      SMALL_TRUCK: 150,
      FLATBED: 200,
      LARGE_TRUCK: 300
    };

    this.pricePerKm = {
      PICKUP: 15,
      SMALL_TRUCK: 20,
      FLATBED: 25,
      LARGE_TRUCK: 35
    };

    this.pricePerMinute = {
      PICKUP: 2,
      SMALL_TRUCK: 3,
      FLATBED: 4,
      LARGE_TRUCK: 5
    };

    // Platform commission (20%)
    this.commissionRate = 0.20;
  }

  calculatePrice(vehicleType, distanceKm, durationMinutes) {
    const basePrice = this.basePrices[vehicleType] || this.basePrices.PICKUP;
    const distancePrice = (distanceKm || 0) * (this.pricePerKm[vehicleType] || this.pricePerKm.PICKUP);
    const timePrice = (durationMinutes || 0) * (this.pricePerMinute[vehicleType] || this.pricePerMinute.PICKUP);

    const totalPrice = basePrice + distancePrice + timePrice;
    const platformCommission = totalPrice * this.commissionRate;
    const driverEarnings = totalPrice - platformCommission;

    return {
      basePrice: parseFloat(basePrice.toFixed(2)),
      distancePrice: parseFloat(distancePrice.toFixed(2)),
      timePrice: parseFloat(timePrice.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      platformCommission: parseFloat(platformCommission.toFixed(2)),
      driverEarnings: parseFloat(driverEarnings.toFixed(2))
    };
  }

  estimateDistance(pickup, delivery) {
    // Simple haversine distance calculation
    const R = 6371; // Earth's radius in km
    const lat1 = pickup.latitude * Math.PI / 180;
    const lat2 = delivery.latitude * Math.PI / 180;
    const dLat = (delivery.latitude - pickup.latitude) * Math.PI / 180;
    const dLon = (delivery.longitude - pickup.longitude) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return parseFloat(distance.toFixed(2));
  }

  estimateDuration(distanceKm) {
    // Assume average speed of 40 km/h in Namibia
    const avgSpeedKmh = 40;
    const hours = distanceKm / avgSpeedKmh;
    const minutes = Math.ceil(hours * 60);
    return minutes;
  }
}

module.exports = new PricingService();
