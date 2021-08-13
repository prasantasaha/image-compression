import React, { useCallback, Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { decodeHEIC, getFileData, ImageData } from '../utils/image';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useAppContext } from '../AppContext';

const DragAndDropContainer = styled.div`
  border: 2px dashed #0068d7;
  border-radius: 10px;
  width: 70vh;
  margin: 20px 10px;
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #0068d705;

  :disabled {
    opacity: 0.4;
    cursor: default;
  }

  @media (max-width: 600px) {
    width: 95%;
    height: 300px;
  }
`;

const CameraIcon = styled.i.attrs({
  className: 'fa fa-camera'
})`
  color: #0068d7;
  font-size: 3em;
`;

const ActionTitle = styled.h3`
  color: #0068d7;
`;

const ActionDescription = styled.h3`
  margin-top: 30px;
  color: #777373;
`;

const ImageSelector = (): JSX.Element => {
  const { images, maxFiles, maxSizeInMB, addImage } = useAppContext();

  const onDrop = useCallback(
    async (acceptedFiles: File[]): Promise<void> => {
      if (!acceptedFiles.length) {
        return;
      }

      if (acceptedFiles.length + images.length > maxFiles) {
        alert('Too many files');
        return;
      }

      acceptedFiles.forEach(async (file: File) => {
        const path = file['path'] as string;
        const { width, height, data } =
          file.type === 'image/heic'
            ? await getFileData((await decodeHEIC(file)) as Blob)
            : await getFileData(file);
        addImage({ path, width, height, data });
      });
    },
    [images]
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]): void => {
      const errors = new Set();
      fileRejections.forEach(file =>
        errors.add(file.errors.map(error => error.message).toString())
      );
      alert([...errors].toString());
    },
    []
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/jpeg, image/png, image/heic, image/heif',
    maxFiles,
    maxSize: Math.pow(2, 20) * maxSizeInMB, // 25 MB
    onDrop,
    onDropRejected
  });

  return (
    <DragAndDropContainer {...getRootProps()}>
      <input
        {...getInputProps()}
        type="file"
        disabled={images.length >= maxFiles}
      />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <Fragment>
          <CameraIcon />
          <ActionTitle>Add Photos</ActionTitle>
          <ActionDescription>
            Select upto {maxFiles} photos, file size maximum {maxSizeInMB} mb
          </ActionDescription>
        </Fragment>
      )}
    </DragAndDropContainer>
  );
};

export default ImageSelector;
