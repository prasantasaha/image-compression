import React, { useEffect, useState } from 'react';
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
  width: 80px;
  height: 40px;
`;

const formatBytes = (bytes: number, decimals = 2): number => {
  if (bytes === 0) return 0;
  const dm = decimals < 0 ? 0 : decimals;
  return parseFloat((bytes / Math.pow(1024, 2)).toFixed(dm));
};

const FileSize = (): JSX.Element | null => {
  const { images } = useAppContext();
  const [totalSize, setTotalSize] = useState<number>(0);
  const [compressed, setCompressed] = useState<Blob[]>([]);
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
    compressed.forEach(async blob => {
      setTotalCompressedSize(prevTotalSize => prevTotalSize + blob.size);
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
    images.forEach(async (item: ImageData) => {
      setCompressing(true);
      const blob = await dataURLtoFile(item.data as string);
      const compressedBlob = await compressImage(blob, {
        width: item.width,
        height: item.height
      });
      setCompressed(files => [...files, compressedBlob]);
      setCompressing(false);
    });
  };

  if (!images || !images[0]) {
    return null;
  }

  return (
    <Container>
      <div>Total size: {`${formatBytes(totalSize)} MB before compression`}</div>
      <SubmitButton onClick={() => compressFiles()}>Compress</SubmitButton>
      {compressing ? (
        <span>Compressing images</span>
      ) : (
        <div>
          Total compressed size:{' '}
          {`${formatBytes(totalCompressedSize)} MB after compression`}
        </div>
      )}
    </Container>
  );
};

export default FileSize;
