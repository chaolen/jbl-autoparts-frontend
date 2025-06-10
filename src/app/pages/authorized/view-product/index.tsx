import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "store/store";
import ImageSlider from "./components/image-slider";
import ViewImagesModal from "./components/view-images-modal";
import { formatAmount, getImageUrl } from "helpers";
import { useLazyGetProductByIdQuery } from "store/apis/productsApi";
import { ProductDetails } from "types/inventory";
import toast from "react-hot-toast";
import LoadingComponent from "app/pages/shared/loading.component";
import { clearData } from "store/slices/viewProductSlice";
import { setEditProductId } from "store/slices/editProductSlice";
import ProductStatus from "../search-products/components/product-status";

const productSpecificationRows = [
  {
    label: "Part Number",
    key: "partNumber",
  },
  {
    label: "Brand",
    key: "brand",
  },
  {
    label: "Stock",
    key: "quantityRemaining",
  },
  {
    label: "SKU",
    key: "sku",
  },
];

const inventoryDetailsRows = [
  {
    label: "Quantity Sold",
    key: "quantitySold",
  },
];

const ViewProduct = () => {
  const state = useSelector((state: RootState) => state);
  const productId = state.viewProduct._id;
  const role = state.user.role;
  const isAdmin = role === "admin";
  const app = useSelector((state: RootState) => state.app);
  const isThresholdResponsive = app.isThresholdResponsive;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<ProductDetails | undefined>();

  const [getProductById] = useLazyGetProductByIdQuery();

  const goBack = () => {
    dispatch(clearData());
    navigate(-1);
  };

  const fetchProduct = async (productId?: string) => {
    setIsLoading(true);
    if (!productId) return;
    try {
      const response = await getProductById({ productId }).unwrap();
      const product = response.data.product;
      setProduct({
        ...product,
        hasParentId: !!product.parentId,
        images: product.images.map((url: any) => getImageUrl(url)),
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Failed to fetch product details.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  const openImagesModal = (index?: number) => {
    if (index !== undefined) {
      setActiveImageIndex(index);
    }
    setIsImagesModalOpen(true);
  };

  const images = product?.images as string[];

  const renderProductSpecifications = () => {
    if (!product) return null;

    return (
      <div className="mt-4 mb-8">
        <p className="bg-opacity-white rounded px-2 py-4 font-medium text-primary text-xl">
          Product Specifications
        </p>
        {productSpecificationRows.map((row, index) => {
          const key = row.key as keyof typeof product;
          const spec = product[key];
          if (!spec) return null;
          return (
            <div
              key={index}
              className="flex px-2 flex-row items-center max-mobile:justify-between mt-2"
            >
              <p className="w-1/3 max-mobile:w-auto ">{row.label}</p>
              <p className="w-2/3 max-mobile:w-auto font-semibold text-primary text-lg">
                {spec}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading && !product) return <LoadingComponent />;

  if (!product?._id) return null;

  const renderDescription = () => (
    <div className="mt-4 mb-8">
      <p className="bg-opacity-white rounded px-2 py-4 font-medium text-primary text-xl">
        Product Description
      </p>
      <p className="px-2 mt-2">{product?.description}</p>
    </div>
  );

  const renderInventoryDetails = () => (
    <div className="mt-4 mb-8">
      <p className="bg-opacity-white rounded px-2 py-4 font-medium text-primary text-xl">
        Inventory Details
      </p>
      {inventoryDetailsRows.map((row, index) => {
        const key = row.key as keyof typeof product;
        const spec = product[key];
        if (!spec) return null;
        return (
          <div
            key={`i.${index}`}
            className="flex px-2 flex-row items-center max-mobile:justify-between mt-2"
          >
            <p className="w-1/3 max-mobile:w-auto ">{row.label}</p>
            <p className="w-2/3 max-mobile:w-auto font-semibold text-primary text-lg">
              {spec}
            </p>
          </div>
        );
      })}
    </div>
  );

  const renderTags = () => (
    <div className="mt-4 mb-8">
      <p className="bg-opacity-white rounded px-2 py-4 font-medium text-primary text-xl">
        Tags
      </p>
      <div className="flex flex-wrap w-full mt-2 space-x-2">
        {product?.tags?.map((tag, index) => (
          <span
            key={`product.tag.${index}`}
            className="text-sm bg-gray-700 text-white px-3 py-1 w-fit rounded-full flex text-center items-center capitalize"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const renderAmount = () => (
    <p className="text-primary-green font-bold text-xl">
      {formatAmount(product?.price ?? 0)}
    </p>
  );

  const renderTitle = () => (
    <div className="flex flex-row items-left mt-4 ">
      <p className="text-primary font-semibold text-2xl mr-2">
        {product?.name}
      </p>
      <ProductStatus status={product?.status} />
    </div>
  );

  const handleEdit = () => {
    dispatch(setEditProductId(productId));
    navigate(`/${role}/edit-product`);
  };

  const isVariant = !!product.parentId;

  return (
    <div className="flex flex-col p-5 py-4 max-w-screen">
      <div className="flex my-[12px] flex-row items-center justify-between text-2xl text-primary mt-2 max-lg-custom:mt-0">
        <div className="flex flex-row items-center">
          <button onClick={goBack} className="py-2">
            <img
              src="/images/arrow-left-long.svg"
              alt=""
              className="h-[32px] w-[32px] mr-3"
            />
          </button>
          <p className="text-primary font-semibold text-2xl">Product Details</p>
          {isAdmin && isVariant && (
            <div className="flex flex-row items-center border border-primary ml-2 rounded-md px-2 relative top-0">
              <img
                src="/images/share-2.svg"
                alt="variant"
                className="h-3 w-3"
              />
              <p className="font-semibold text-xs">Variant</p>
            </div>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium"
          >
            Edit
          </button>
        )}
      </div>
      <div className="">
        <ImageSlider
          activeIndex={activeImageIndex}
          setActiveIndex={setActiveImageIndex}
          images={images}
          openImagesModal={openImagesModal}
        />
        {renderTitle()}
        {renderAmount()}
        {isAdmin && renderInventoryDetails()}
        {renderProductSpecifications()}
        {renderDescription()}
        {renderTags()}
      </div>
      <ViewImagesModal
        images={images}
        isOpen={isImagesModalOpen && !isThresholdResponsive}
        onClose={() => setIsImagesModalOpen(false)}
        setActiveImageIndex={setActiveImageIndex}
        activeImageIndex={activeImageIndex}
        title={product?.name || "Product Images"}
      />
    </div>
  );
};

export default ViewProduct;
