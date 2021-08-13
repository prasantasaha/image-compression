import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react';
import { ImageObject } from './utils/image';

type AppContextParams = {
  images: ImageObject[];
  maxFiles?: number;
  maxSizeInMB?: number;
  totalFileByteSize?: number;
  maxDimension?: number;
  addImage?: (image: ImageObject) => void;
  reset?: () => void;
  updateMaxDimension?: Dispatch<SetStateAction<number>>;
  updateTotalFileByteSize?: Dispatch<SetStateAction<number>>;
};

export const AppContext = createContext<AppContextParams>({
  images: []
});

export const AppContextProvider = ({
  children
}: {
  children: JSX.Element[] | JSX.Element;
}): JSX.Element => {
  const [images, setImages] = useState<ImageObject[]>([]);
  const [maxDimension, updateMaxDimension] = useState<number>(0);
  const [totalFileByteSize, updateTotalFileByteSize] = useState<number>(0);

  useEffect(() => init(), []);

  const init = () => {
    setImages([]);
    updateMaxDimension(1800);
    updateTotalFileByteSize(Math.pow(1024, 2));
  };
  const addImage = (newImage: ImageObject) => {
    setImages(otherImages => [...otherImages, newImage]);
  };

  const reset = () => {
    init();
  };

  return (
    <AppContext.Provider
      value={{
        images,
        maxFiles: 3,
        maxSizeInMB: 30,
        totalFileByteSize,
        maxDimension,
        addImage,
        reset,
        updateMaxDimension,
        updateTotalFileByteSize
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextParams => useContext(AppContext);
