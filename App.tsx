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

const App = (): JSX.Element => {
  return (
    <Container>
      <p>Compress images</p>
      <AppContextProvider>
        <ImageSelector />
        <Thumbnails />
        <FileSize />
      </AppContextProvider>
    </Container>
  );
};

export default App;
