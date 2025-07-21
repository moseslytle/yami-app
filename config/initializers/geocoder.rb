# Created 07/19/2025 by Paulina Salazar.

# Initialize geocoder for distance search purposes.
Geocoder.configure(
  units: :mi,
  # Request exits if it takes too long.
  timeout: 5,
  distance: :spherical
)
