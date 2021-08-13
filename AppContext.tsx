import React, { createContext, useState, useContext } from 'react';
import { ImageObject } from './utils/image';

type AppContextParams = {
  images: ImageObject[];
  maxFiles?: number;
  maxSizeInMB?: number;
  totalFileByteSize?: number;
  maxDimension?: number;
  addImage?: (image: ImageObject) => void;
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

  const addImage = (newImage: ImageObject) => {
    setImages(otherImages => [...otherImages, newImage]);
  };

  return (
    <AppContext.Provider
      value={{
        images,
        maxFiles: 3,
        maxSizeInMB: 30,
        totalFileByteSize: Math.pow(1024, 2),
        maxDimension: 1800,
        addImage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextParams => useContext(AppContext);
