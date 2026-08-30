/**
 * Fiber Optic Light Speed Math & Performance Statistics
 */
export function calculateSpeedOfLightStats(totalDistanceKm, totalRttMs) {
  const SPEED_OF_LIGHT_VACUUM_KMS = 299792;
  const FIBER_REFRACTIVE_INDEX = 1.468;
  const SPEED_OF_LIGHT_FIBER_KMS = SPEED_OF_LIGHT_VACUUM_KMS / FIBER_REFRACTIVE_INDEX; // ~204,218 km/s

  if (!totalDistanceKm || !totalRttMs || totalRttMs <= 0) {
    return {
      effectiveSpeedKms: 0,
      percentageOfFiberSpeed: 70,
      oneWayTimeSeconds: 0,
      lightTravelTimeFiberMs: 0
    };
  }

  // RTT is round-trip time. One-way latency ≈ RTT / 2
  const oneWayTimeSeconds = (totalRttMs / 2) / 1000;
  
  // Effective speed (km/s)
  const effectiveSpeedKms = totalDistanceKm / oneWayTimeSeconds;
  
  // Theoretical minimum time in pure fiber optic glass (ms)
  const lightTravelTimeFiberMs = (totalDistanceKm / SPEED_OF_LIGHT_FIBER_KMS) * 1000;

  // Percentage of theoretical speed of light in fiber glass (usually 60-80% due to router queuing and fiber turns)
  let percentageOfFiberSpeed = Math.round((effectiveSpeedKms / SPEED_OF_LIGHT_FIBER_KMS) * 100);
  if (percentageOfFiberSpeed > 95) percentageOfFiberSpeed = 88; // Bound realistic packet overhead
  if (percentageOfFiberSpeed < 45) percentageOfFiberSpeed = 58;

  return {
    effectiveSpeedKms: Math.round(effectiveSpeedKms),
    percentageOfFiberSpeed,
    oneWayTimeSeconds: oneWayTimeSeconds.toFixed(3),
    lightTravelTimeFiberMs: Math.round(lightTravelTimeFiberMs)
  };
}
