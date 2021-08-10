import React, {
  createContext,
  useState,
  useContext,
  SetStateAction,
  useEffect
} from 'react';
import { ImageData } from './utils/image';

type AppContextParams = {
  images: ImageData[];
  addImage?: (imageData: ImageData) => void;
};

export const AppContext = createContext<AppContextParams>({ images: [] });

export const AppContextProvider = ({
  children
}: {
  children: JSX.Element[] | JSX.Element;
}): JSX.Element => {
  const [images, setImages] = useState<ImageData[]>([]);

  const addImage = (newImage: ImageData) => {
    setImages(otherImages => [...otherImages, newImage]);
  };

  return (
    <AppContext.Provider value={{ images, addImage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextParams => useContext(AppContext);
