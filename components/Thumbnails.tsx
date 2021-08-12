import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../AppContext';
import {
  compressImage,
  dataURLtoFile,
  downloadFile,
  ImageData
} from '../utils/image';

const Container = styled.div`
  padding: 16px;
  display: flex;
  margin: 20px 10px;
  flex-wrap: wrap;
  color: white;

  @media (max-width: 600px) {
    margin: 10px 6px;
  }
`;

const ItemContainer = styled.div`
  display: inline-grid;
  background-color: grey;
  margin: 2px;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-botton: 8px;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;

  a:link {
    color: white;
    background-color: transparent;
    text-decoration: none;
  }

  a:visited {
    color: white;
    background-color: transparent;
    text-decoration: none;
  }

  a:hover {
    color: white;
    background-color: transparent;
    text-decoration: underline;
  }

  a:active {
    color: white;
    background-color: transparent;
    text-decoration: underline;
  }
`;

const Image = styled.img`
  display: block;
  max-width: 320px;
  max-height: 240px;
  width: auto;
  height: auto;
  margin: 8px;

  @media (max-width: 600px) {
    margin: 0;
    max-width: 240px;
    max-height: 180px;
  }
`;

const DownloadIcon = styled.i.attrs({
  className: 'fa fa-download'
})`
  color: white;
  margin-right: 6px;
`;

const Thumbnails = (): JSX.Element | null => {
  const { images } = useAppContext();

  const downloadOriginal = async (image: ImageData) => {
    const blob = await dataURLtoFile(image.data);
    downloadFile(blob, image.path || 'image');
  };

  const downloadCompressed = async (image: ImageData) => {
    const blob = await dataURLtoFile(image.data);
    const compressedBlob = (await compressImage(blob, {
      width: image.width,
      height: image.height
    })).blob;

    downloadFile(
      compressedBlob,
      image.path
        ? image.path.slice(0, image.path.lastIndexOf('.')) + '-compressed.jpeg'
        : 'image-compressed'
    );
  };

  if (!images || !images.length) {
    return null;
  }

  return (
    <Container>
      {images.map((item: ImageData, index: number) => (
        <ItemContainer key={index}>
          <Image src={item.data} alt="" width="400" height="300" />
          <InfoContainer>
            Dimension: {item.width} x {item.height}px
          </InfoContainer>
          <LinkContainer>
            <a href="#" onClick={() => downloadOriginal(item)}>
              <DownloadIcon /> original
            </a>
            <a href="#" onClick={() => downloadCompressed(item)}>
              <DownloadIcon /> compressed
            </a>
          </LinkContainer>
        </ItemContainer>
      ))}
    </Container>
  );
};

export default Thumbnails;
