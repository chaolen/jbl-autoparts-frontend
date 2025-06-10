import React from 'react'
import Modal from '../../shared/modal';
import * as Yup from "yup";
import { Formik } from 'formik';
import { defaultVariant } from 'constants/default-values';
import TagInput from '../../shared/product-components/tag-input';
import QuantityInput from '../../shared/product-components/quantity-input';
import ImagePicker from '../../shared/product-components/image-picker';
import { ProductDetails } from 'types/inventory';

type AddProductVariantModalProps = {
  isOpen: boolean;
  toggleModal: () => void;
  onSubmit: (details: any, helpers: any) => void;
  product?: any;
};

const validationSchema = Yup.object({
  name: Yup.string().required("Variant name is required"),
  partNumber: Yup.string(),
  brand: Yup.string(),
  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  sku: Yup.string(),
  quantityRemaining: Yup.number()
    .min(1, "Cannot be zero")
    .required("Remaining quantity required"),
  tags: Yup.array().min(1, "At least one tag required"),
  description: Yup.string(),
});

const EditProductVariantModal = ({
  isOpen,
  toggleModal,
  onSubmit,
  product,
}: AddProductVariantModalProps) => {

  if (!product) {
    return null;
  }

  return (
    <Formik
      initialValues={product ?? defaultVariant}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange={true}
      validateOnBlur={false}
    >
      {({
        values,
        handleChange,
        setFieldValue,
        handleBlur,
        touched,
        errors,
        handleSubmit,
      }) => {
        const renderError = (name: string) => (
          <>
            {touched[name] && errors && errors[name] && (
              <p className="text-red-500 text-[10px] mt-1">
                {errors[name]?.toString()}
              </p>
            )}
          </>
        )

        const renderSection = (fullWidth: boolean, label: string, name: string, placeholder: string, fieldType?: string) => {
          return (
            <div className={fullWidth ? "w-full" : "w-1/2"}>
              <label className="tracking-wide text-gray-400 text-xs text-medium bg-white relative px-1 top-[12px] left-3 w-auto">
                {label}
              </label>
              <input
                type={fieldType || "text"}
                className="appearance-none block text-[14px] w-full text-gray-700 border rounded py-4 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
                value={values[name]}
                name={name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
              />
              {renderError(name)}
            </div>
          )
        }

        const renderDescription = () => {
          return (
            <div className="w-full">
              <label className="tracking-wide text-gray-400 text-xs text-medium bg-white relative px-1 top-[12px] left-3 w-auto">
                Product Description
              </label>
              <textarea
                placeholder="Enter product description here..."
                className="appearance-none block text-[14px] w-full text-gray-700 border rounded py-4 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
                onChange={handleChange}
                onBlur={handleBlur}
                name="description"
                value={values.description}
                rows={8}
                cols={30}
              />
              {renderError('description')}
            </div>
          )
        }

        const renderTags = () => {
          return (
            <TagInput tags={values.tags} setTags={(tags: string[]) => setFieldValue("tags", tags)} errorMessage={
              touched.tags && errors.tags ? errors.tags?.toString() : undefined
            } />
          )
        }

        const renderQuantityInput = () => {
          return (
            <QuantityInput
              isRequired
              touched={touched}
              error={errors}
              label="Remaining Quantity"
              name="quantityRemaining"
              value={values.quantityRemaining}
              setValue={setFieldValue}
            />
          )
        }

        const renderImages = () => {
          return (
            <div className="w-full flex flex-col shadow-lg border bg-white rounded-lg p-4 mt-4">
              <ImagePicker
                images={values.images}
                setImages={(imgs: File[]) => setFieldValue("images", imgs)}
              />
            </div>
          )
        }

        return (
          <Modal
            isOpen={isOpen}
            title={"Edit Product Variant"}
            onClose={toggleModal}
            onSubmit={handleSubmit}
            submitButtonLabel="Save"
            width="w-[1100px]"
            mx="mx-10"
            className='max-mobile:display-none'
          >
            <div className="h-[600px] overflow-y-auto">
              <div>
                {renderSection(true, "Variant Name", "name", "Type variant name")}
                <div className="w-full flex space-x-4">
                  {renderSection(false, "Part Number", "partNumber", "Type part number")}
                  {renderSection(false, "Brand", "brand", "Type brand name")}
                </div>
                <div className="w-full flex space-x-4">
                  {renderSection(false, "SKU", "sku", "Select SKU")}
                  {renderSection(false, "Price", "price", "Type price", "number")}
                </div>
                {renderDescription()}
                <div className="w-full flex space-x-4">
                  {renderTags()}
                  {renderQuantityInput()}
                </div>
                {renderImages()}
              </div>
            </div>
          </Modal>
        )
      }
      }
    </Formik>
  )
}
export default EditProductVariantModal;