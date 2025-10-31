import React from 'react';
import './RowComponent.css';
import type { ImageModel } from '../types/image';


interface RowComponentProps {
  images?: ImageModel[];
  title?: string;
}

const RowComponent: React.FC<RowComponentProps> = ({ images, title }) => {
  

  return (
      <div className='row-container container'>
        {title && <div className='title-row'>{title}</div>}
        <div className='images-row'>{images?.map((image) => (
          <div key={image.id} className='image-item'>
            <img src={image.image} alt={image.name} className='img-fluid img-item' loading='lazy' />
          </div>
        ))}</div>
      </div>
  );
};

export default RowComponent;
