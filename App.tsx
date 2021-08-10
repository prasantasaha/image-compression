import React, { useEffect } from 'react';
import styled from 'styled-components';
import Thumbnails from './components/Thumbnails';
import FileSize from './components/FileSize';
import { AppContextProvider } from './AppContext';
import ImageSelector from './components/ImageSelector';

export const Container = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SubmitButton = styled.button`
  width: 80px;
  height: 40px;
`;

const App = (): JSX.Element => {
  return (
    <Container>
      <p>Compress and upload images</p>
      <AppContextProvider>
        <ImageSelector />
        <Thumbnails />
        <FileSize />
        <SubmitButton disabled>Upload</SubmitButton>
      </AppContextProvider>
    </Container>
  );
};

export default App;
