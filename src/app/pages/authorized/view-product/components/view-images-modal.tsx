import React from 'react';
import Modal from '../../shared/modal';

type ViewImagesModalProps = {
  images: string[];
  title: string;
  isOpen: boolean;
  onClose: () => void;
  setActiveImageIndex: (index: number) => void;
  activeImageIndex: number;
};

const ViewImagesModal = ({ images, isOpen, onClose, activeImageIndex, title, setActiveImageIndex }: ViewImagesModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      onSubmit={() => { }}
      submitButtonLabel="Done"
      width="w-[1100px]"
      mx="mx-10"
      className='max-mobile:display-none'
    >
      <div className='flex flex-row items-start justify-end h-[80vh] space-x-4 w-full'>
        <img
          src={images[activeImageIndex]}
          alt={`product-image-`}
          className="w-3/4 h-full object-contain border"
        />
        <div className='w-1/4 grid grid-cols-2 gap-1 overflow-y-auto  h-full'>
          {
            images.map((image, index) => (
              <img
                onClick={() => setActiveImageIndex(index)}
                src={image}
                alt={`product-thumbnail-${index}`}
                className={`h-[82px] w-[82px] cursor-pointer border-2 ${index === activeImageIndex ? 'border-primary-blue' : 'border-transparent'} object-cover`}
              />
            ))
          }

        </div>
      </div>

    </Modal>
  )
}

export default ViewImagesModal;