import React, { Fragment, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../AppContext';
import { compressImage, dataURLtoFile, ImageData } from '../utils/image';

const Container = styled.div`
  margin: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubmitButton = styled.button`
  margin: 12px;
  height: 40px;
`;

const Image = styled.img`
  display: block;
  max-width: 160px;
  max-height: 120px;
  width: auto;
  height: auto;
`;

const formatBytes = (bytes: number, decimals = 2): number => {
  if (bytes === 0) return 0;
  const dm = decimals < 0 ? 0 : decimals;
  return parseFloat((bytes / Math.pow(1024, 2)).toFixed(dm));
};

const FileSize = (): JSX.Element | null => {
  const { images } = useAppContext();
  const [totalSize, setTotalSize] = useState<number>(0);
  const [compressed, setCompressed] = useState<
    { blob: Blob; width: number; height: number }[]
  >([]);
  const [totalCompressedSize, setTotalCompressedSize] = useState<number>(0);
  const [compressing, setCompressing] = useState<boolean>(false);

  const getTotal = async (): Promise<void> => {
    setTotalSize(0);
    if (!images) {
      return;
    }
    images.forEach(async item => {
      const blob = await dataURLtoFile(item.data);
      setTotalSize(prevTotalSize => prevTotalSize + blob.size);
    });
  };

  const getCompressedTotal = async (): Promise<void> => {
    setTotalCompressedSize(0);
    compressed.forEach(async info => {
      setTotalCompressedSize(prevTotalSize => prevTotalSize + info.blob.size);
    });
  };

  useEffect(() => {
    void getTotal();
  }, [images]);

  useEffect(() => {
    void getCompressedTotal();
  }, [compressed]);

  const compressFiles = async (): Promise<void> => {
    setCompressed([]);
    setCompressing(true);
    for (let index = 0; index < images.length; index++) {
      const blob = await dataURLtoFile(images[index].data as string);
      const compressedBlob = await compressImage(blob, {
        width: images[index].width,
        height: images[index].height
      });
      setCompressed(files => [...files, compressedBlob]);
    }

    setCompressing(false);
  };

  if (!images || !images[0]) {
    return null;
  }

  return (
    <Container>
      <div>Total size: {`${formatBytes(totalSize)} MB before compression`}</div>
      <SubmitButton onClick={() => compressFiles()}>
        Compress images
      </SubmitButton>
      {compressing ? (
        <span>Compressing images</span>
      ) : (
        <div style={{ display: compressed.length > 0 ? 'block' : 'none' }}>
          <hr />
          {compressed.map((item, index) => (
            <div key={index}>
              <Image
                src={URL.createObjectURL(item.blob)}
                alt=""
                width="200"
                height="150"
              />
              {formatBytes(item.blob.size)} MB ({item.width} x {item.height}
              px)
            </div>
          ))}
          <hr />
          Total compressed size:{' '}
          {`${formatBytes(totalCompressedSize)} MB after compression`}
        </div>
      )}

      <SubmitButton disabled>Upload</SubmitButton>
    </Container>
  );
};

export default FileSize;
