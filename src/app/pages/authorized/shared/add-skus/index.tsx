import { useCallback, useState } from "react";
import Modal from "../modal";
import { defaultSKUForm } from "constants/default-values";
import ProductSKUForm from "./components/product-sku-form";
import { SKUForm } from "types/sku";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setIsAddSKUsModalVisible } from "store/slices/appSlice";
import toast from "react-hot-toast";
import { useCreateSKUsMutation, useLazyCheckSKUQuery } from "store/apis/skusApi";

type AddSKUsProps = {
  refreshRecord: () => void;
}

const AddSKUs = ({ refreshRecord }: AddSKUsProps) => {
  const app = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const [skuForms, setSkuForms] = useState<SKUForm[]>([defaultSKUForm]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [createSkus] = useCreateSKUsMutation();
  const [checkSKU] = useLazyCheckSKUQuery();

  const evaluateSuggestions = (updatedForms: SKUForm[]) => {
    const result = updatedForms.reduce((acc, form) => {
      if (form.saved) {
        return [...acc, ...form.fields];
      }
      return acc;
    }, [] as string[]);

    const uniqueSuggestions = Array.from(new Set(result));
    setSuggestions(uniqueSuggestions);
  };

  const getSavedSKUs = useCallback(() => {
    const savedSKUs = skuForms
      .filter((form) => form.saved)
      .map((skuForm) => skuForm.fields.join("-"));
    return savedSKUs;
  }, [skuForms]);

  const handleSaveSKU = async (skuIndex: number) => {
    const savedSKUs = getSavedSKUs();
    
    const currentForm = getCurrentForm();
    const fields = currentForm.fields;

    const currentSKU = fields.join("-");

    const isValid = fields.every((part) => part?.trim() !== "");

    const hasDuplicate = savedSKUs.includes(currentSKU);

    // checks the database record
    const checkerResponse = await checkSKU(currentSKU);

    if (isValid) {
      if (hasDuplicate || checkerResponse.data?.exists) {
        toast.error("Duplicate SKU detected.");
      } else {
        const updatedForms = skuForms.map((form, i) => {
          if (i === skuIndex) {
            return {
              ...form,
              saved: true,
            };
          }
          return form;
        });
        setSkuForms(updatedForms);
        evaluateSuggestions(updatedForms);
      }
    } else {
      toast.error("Please fill out the empty parts before saving.");
    }
  };

  const closeModal = () => {
    dispatch(setIsAddSKUsModalVisible(false));
  };

  const handleChange = (skuIndex: number, partIndex: number, value: string) => {
    setSkuForms((forms) =>
      forms.map((form, i) => {
        if (i === skuIndex) {
          const updatedFields = [...form.fields];
          updatedFields[partIndex] = value;
          return {
            ...form,
            fields: updatedFields,
          };
        }
        return form;
      })
    );
  };

  const addOrRemovePartFromSKU = (
    skuIndex: number,
    partToRemoveIndex?: number
  ) => {
    setSkuForms((forms) =>
      forms.map((form, i) => {
        if (i === skuIndex) {
          if (partToRemoveIndex !== undefined) {
            return {
              ...form,
              fields: form.fields.filter((_, j) => j !== partToRemoveIndex),
            };
          } else {
            return {
              ...form,
              fields: [...form.fields, ""],
            };
          }
        }
        return form;
      })
    );
  };

  const getCurrentForm = useCallback(() => {
    const lastFormIndex = skuForms.length === 0 ? 0 : skuForms.length - 1;
    const lastForm = skuForms[lastFormIndex];
    return lastForm;
  }, [skuForms]);

  const handleRemoveSKU = (skuIndex: number) => {
    setSkuForms((forms) => forms.filter((_, i) => skuIndex !== i));
  };

  const handleAddSKUForm = () => {
    const currentForm = getCurrentForm();

    if (!currentForm.saved) {
      toast.error(
        "Please save the current active SKU Fields before adding a new one."
      );
      return;
    }

    const hasUnfinishedEntry = currentForm.fields.some(
      (field) => field.trim() === ""
    );

    if (!hasUnfinishedEntry) {
      setSkuForms((forms) => [...forms, defaultSKUForm]);
    } else {
      toast.error(
        "Please fill out the current SKU field before adding a new one."
      );
    }
  };

  const onSubmit = async () => {
    const hasCompletedAllSKUForms = skuForms.every((form) => form.saved);

    if (hasCompletedAllSKUForms) {
      const savedSKUs = getSavedSKUs();
      try {
        await createSkus({ skus: savedSKUs });
        setSkuForms([defaultSKUForm]);
        refreshRecord();
        closeModal();
        toast.success("SKUs created successully.");
      } catch (error) {
        toast.success("Sorry, Something went wrong.");
      }
    } else {
      toast.error("Please complete all forms before submitting.");
    }
  };

  return (
    <div>
      <Modal
        isOpen={app.isAddSKUsModalVisible}
        title="Add SKUs"
        onClose={closeModal}
        onSubmit={onSubmit}
        submitButtonLabel="Submit"
        width="w-screen"
        mx="mx-5"
      >
        <div className="h-[500px] overflow-y-auto">
          <ProductSKUForm
            handleChange={handleChange}
            handleRemoveSKU={handleRemoveSKU}
            handleSaveSKU={handleSaveSKU}
            addOrRemovePartFromSKU={addOrRemovePartFromSKU}
            handleAddSKUForm={handleAddSKUForm}
            skuForms={skuForms}
            suggestions={suggestions}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AddSKUs;
