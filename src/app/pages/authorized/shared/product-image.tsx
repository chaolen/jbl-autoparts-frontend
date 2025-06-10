import { getImageUrl } from "helpers";
import React, { useEffect, useState } from "react";
import { ProductDetails } from "types/inventory";

const isValidImage = (url: string) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

const getFirstValidImage = async (imageUrls: any[]) => {
  for (const url of imageUrls) {
    const imageUrl = url.startsWith('uploads') ? getImageUrl(url) : url;
    const isValid = await isValidImage(imageUrl);
    if (isValid) {
      return imageUrl;
    }
  }
  return null;
};

type ProductImageProps = {
  product: ProductDetails;
  children?: any;
  height?: string;
  width?: string;
  borderRadius?: string;
};

const ProductImage = ({
  product,
  children,
  height,
  width,
  borderRadius,
}: ProductImageProps) => {
  const [validImageUrl, setImageUrl] = useState<any>(null);

  useEffect(() => {
    const findValidImage = async () => {
      const validUrl = await getFirstValidImage(product?.images ?? []);
      if (validUrl) {
        setImageUrl(validUrl);
      } else {
        setImageUrl("/images/no-image.jpg");
      }
    };
    findValidImage();
  }, [product]);

  if (!validImageUrl) return <div></div>;

  return (
    <div
      className={`${height ?? "h-[150px]"} ${width ??
        "w-full"} ${borderRadius ?? 'rounded-t-xl'} bg-cover bg-center`}
      style={{ backgroundImage: `url(${validImageUrl})` }}
    >
      {children}
    </div>
  );
};

export default ProductImage;
