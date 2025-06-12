export const addCloudinaryTransform = (url: string, transformStr = "") => {
  const uploadSegment = "/upload/";
  const index = url.indexOf(uploadSegment);

  if (index === -1 || !transformStr) return url; // no '/upload/' found or no transform

  const before = url.slice(0, index + uploadSegment.length);
  const after = url.slice(index + uploadSegment.length);

  return `${before}${transformStr}/${after}`;
};
