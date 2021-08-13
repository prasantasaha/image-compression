import React, { useRef, useState } from 'react';
import {
  ReactCompareSlider,
  ReactCompareSliderImage
} from 'react-compare-slider';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%
  height: auto
  cursor: pointer
`;

const CompareSlider = (props: { images: string[] }): JSX.Element => {
  const elementRef = useRef(null);

  return (
    <Container ref={elementRef}>
      <ReactCompareSlider
        onClick={() => {
          const docElm = elementRef.current;
          if (docElm.requestFullscreen) docElm.requestFullscreen();
        }}
        itemOne={<ReactCompareSliderImage src={props.images[0]} />}
        itemTwo={<ReactCompareSliderImage src={props.images[1]} />}
      />
    </Container>
  );
};

export default CompareSlider;
