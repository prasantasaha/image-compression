import {
  compressAccurately,
  compressAccuratelyConfig,
  dataURLtoFile,
  downloadFile,
  EImageType
} from 'image-conversion';

import libheif from 'libheif-js';

interface ImageObject {
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

const getImageData = async (image): Promise<ImageData> => {
  const width = image.get_width();
  const height = image.get_height();

  const imageData: ImageData = await new Promise((resolve, reject) => {
    const whiteImage = new ImageData(width, height);
    image.display(whiteImage, displayData => {
      if (!displayData) {
        return reject(new Error('HEIF processing error'));
      }
      resolve(displayData);
    });
  });

  return imageData;
};

const imageDataToDataURL = async (
  imageData: ImageData,
  type: string = 'image/jpeg',
  quality: number = 0.7
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');

  ctx.putImageData(imageData, 0, 0);

  return new Promise(resolve => {
    canvas.toBlob(
      (blob: Blob) => {
        resolve(blob);
      },
      type,
      quality
    );
  });
};

const decodeHEIC = async (
  blob: Blob | File,
  multiple = false
): Promise<Blob | Blob[]> => {
  const decoder = new libheif.HeifDecoder();
  const data = decoder.decode(await blob.arrayBuffer());

  if (!data.length) {
    throw new Error('HEIF image not found');
  }

  if (!multiple) {
    return imageDataToDataURL(await getImageData(data[0]));
  }

  return data.map(async image => {
    return imageDataToDataURL(await getImageData(image));
  });
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
  ImageObject,
  decodeHEIC,
  getHeightAndWidthFromDataUrl,
  getFileData,
  compressImage,
  dataURLtoFile,
  downloadFile,
  EImageType
};
