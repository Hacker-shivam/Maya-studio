import * as faceapi from '@vladmandic/face-api';

export const detectAndCropFace = async (imageElement) => {
  // Load models from CDN for zero-setup
  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

  const detections = await faceapi.detectSingleFace(
    imageElement, 
    new faceapi.TinyFaceDetectorOptions()
  );

  if (!detections) return null;

  const { x, y, width, height } = detections.box;
  
  // Passport Rule: Head should take up ~70% of the frame
  // We add padding: 40% above the head, 20% to sides
  return {
    x: Math.max(0, x - width * 0.2),
    y: Math.max(0, y - height * 0.4),
    width: width * 1.4,
    height: height * 1.8,
  };
};