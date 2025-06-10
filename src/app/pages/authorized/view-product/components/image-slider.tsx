import React, { useState } from "react";

type ImageSliderProps = {
  images: any[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  openImagesModal: (index?: number) => void;
};

const ImageSlider = ({
  images,
  activeIndex,
  setActiveIndex,
  openImagesModal,
}: ImageSliderProps) => {
  if (images.length === 0)
    return (
      <img
        src={"/images/no-image.jpg"}
        alt="no-image"
        className="h-[450px] w-full max-lg-custom:h-[350px] object-contain"
      />
    );

  return (
    <div className="flex flex-col items-center">
      <img
        onClick={() => openImagesModal()}
        src={images[activeIndex]}
        className="h-[450px] w-full max-lg-custom:h-[350px] object-contain"
        alt="p-image"
      />
      <div className="flex flex-row items-center justify-start w-full overflow-x-auto space-x-2 py-4">
        {images.map((image, index) => {
          return (
            <img
              key={index}
              onClick={() => openImagesModal(index)}
              src={image}
              alt={`product-image-${index}`}
              className={`h-[82px] w-[82px] cursor-pointer border-2 ${
                index === activeIndex
                  ? "border-primary-blue"
                  : "border-transparent"
              } object-cover`}
              onMouseEnter={() => setActiveIndex(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ImageSlider;
