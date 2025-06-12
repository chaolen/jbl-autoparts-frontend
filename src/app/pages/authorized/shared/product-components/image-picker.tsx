import { useDropzone } from "react-dropzone";
import { addCloudinaryTransform } from "utils/transform-image";

type ImagePickerProps = {
  images: any[];
  setImages: (images: any) => void;
  isMobile?: boolean;
};

const ImagePicker = ({ images, setImages, isMobile }: ImagePickerProps) => {
  const onDrop = (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setImages([...images, ...newImages]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const onRemoveImage = (index: number) => {
    setImages(images.filter((_: any, i: number) => index !== i));
  };

  return (
    <div className="">
      <div className="flex items-center justify-center flex-col">
        <label className="block cursor-pointer text-primary underline center font-medium text-md">
          Take Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                const file = e.target.files[0];
                setImages([...images, { url: URL.createObjectURL(file), file }]);
              }
            }}
          />
        </label>
        <span className="text-xs text-gray-500 my-2">OR</span>
      </div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-10 text-center cursor-pointer rounded-lg hover:bg-gray-50"
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">
          {isMobile
            ? "Click to upload images"
            : "Drag & drop images or click to upload"}
        </p>
      </div>

      {/* Display Selected Images */}
      {images.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-1">
          {images.map((image, index) => (
            <div
              className="h-32 rounded-md shadow bg-cover bg-center"
              style={{ backgroundImage: `url(${addCloudinaryTransform(image.url, 'w_300,h_300,c_thumb')})` }}
            >
              <button
                className="z-10 bg-white m-1 p-1 rounded"
                onClick={() => onRemoveImage(index)}
              >
                <img
                  src="/images/trash-2.svg"
                  alt="trash"
                  className="h-[15px] w-[15px]"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
