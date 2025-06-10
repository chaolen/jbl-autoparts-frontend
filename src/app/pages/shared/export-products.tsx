// components/ExportPDFButton.js
import React, { useCallback, useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ProductPDFDocument from './product-pdf-document';
import { ProductDetails } from 'types/inventory';
import { Status } from 'store/slices/inventorySlice';
import { useLazyGetProductByStatusQuery } from 'store/apis/productsApi';
import toast from 'react-hot-toast';
import moment from 'moment';

type ExportPDFButtonProps = {
  products?: ProductDetails[];
  status: Status;
}

const ExportProductsPDFButton = ({ status }: ExportPDFButtonProps) => {

  const [getProductsByStatus] = useLazyGetProductByStatusQuery();

  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await getProductsByStatus(status.value);
      if (response?.error) {
        toast.error(response.error?.data?.message ?? "");
        return;
      }
      setProducts(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }, [status])

  useEffect(() => {
    loadData();
  }, [status]);

  if (loading) return <button disabled className='px-4 py-2 rounded-lg bg-secondary-medium text-black font-medium'>Loading...</button>;

  if (error || products.length === 0) return <button disabled className='px-4 py-2 rounded-lg bg-secondary-medium text-black font-medium'>Export Unavailable</button>;

  const statusString = status?.label?.replace(' ', '-');
  return (
    <PDFDownloadLink
      document={<ProductPDFDocument status={status} products={products} />}
      fileName={`${moment().format('D-M-YYYY')}-${statusString}-Products.pdf`}
      className="px-4 py-2 rounded-lg bg-secondary-medium text-black font-medium"
    >
      {({ loading }) =>
        loading ? <span>Generating PDF...</span> : <span>Download PDF</span>
      }
    </PDFDownloadLink>
  )
};

export default ExportProductsPDFButton;
