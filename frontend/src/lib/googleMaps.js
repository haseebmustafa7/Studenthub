export const googleMapsSearchUrl = (job) => {
  const query = job?.latitude && job?.longitude
    ? `${job.latitude},${job.longitude}`
    : job?.location || `${job?.city || ''}, ${job?.country || 'Pakistan'}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export const googleMapsEmbedUrl = (job) => {
  const query = job?.latitude && job?.longitude
    ? `${job.latitude},${job.longitude}`
    : job?.location || `${job?.city || ''}, ${job?.country || 'Pakistan'}`
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`
}
