import heic2any from 'heic2any';
import {
  compressAccurately,
  compressAccuratelyConfig,
  dataURLtoFile,
  downloadFile,
  EImageType
} from 'image-conversion';

interface ImageData {
  path: string;
  data: string;
  width: number;
  height: number;
}

const getHeightAndWidthFromDataUrl = (
  dataURL: string
): Promise<{ width: number; height: number }> =>
  new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width
      });
    };
    img.src = dataURL;
  });

const getFileData = async (
  file: File | Blob
): Promise<{ width: number; height: number; data: string }> => {
  const reader = new FileReader();

  const promise: Promise<{
    width: number;
    height: number;
    data: string;
  }> = new Promise((resolve, reject) => {
    reader.onload = async () => {
      const { width, height } = await getHeightAndWidthFromDataUrl(
        URL.createObjectURL(file)
      );

      resolve({ width, height, data: reader.result as string });
    };

    reader.onerror = () => {
      reject(reader.error);
    };
  });

  reader.readAsDataURL(file);

  return promise;
};

const compressImage = async (
  file: Blob,
  dimension: { width: number; height: number },
  config: compressAccuratelyConfig = {
    size: 340,
    accuracy: 98,
    type: EImageType.JPEG
  }
) => {
  const { width, height } = getDownScaledDimension(
    dimension.width,
    dimension.height
  );

  return {
    blob: await compressAccurately(file, {
      ...config,
      width,
      height
    }),
    width,
    height
  };
};

const decodeHEIC = (blob: Blob) => {
  return heic2any({ blob });
};

const getDownScaledDimension = (
  width: number,
  height: number
): { width: number; height: number } => {
  const maxPixels = 1800;
  const requireDownScale = Math.max(width, height) > maxPixels;

  const result = {
    width,
    height
  };

  if (!width || !height || !requireDownScale) {
    return result;
  }

  // landscape
  if (width > height) {
    result.width = maxPixels;
    result.height = Math.floor(maxPixels * (height / width));
    return result;
  }

  // potrait
  result.height = maxPixels;
  result.width = Math.floor(maxPixels * (width / height));
  return result;
};

export {
  ImageData,
  decodeHEIC,
  getHeightAndWidthFromDataUrl,
  getFileData,
  compressImage,
  dataURLtoFile,
  downloadFile,
  EImageType
};
