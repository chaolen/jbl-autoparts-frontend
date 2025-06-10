import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ProductDetails } from 'types/inventory';
import { Status } from 'store/slices/inventorySlice';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  section: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: 1,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  },
  cell: {
    flex: 1,
    paddingRight: 4,
  },
});

type ProductPDFDocumentProps = {
  products?: ProductDetails[];
  status: Status;
}

const ProductsDocument = ({ products, status }: ProductPDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={{ fontSize: 14, marginBottom: 10 }}>{status.label} Product List</Text>

      <View style={styles.tableHeader}>
        <Text style={styles.cell}>Name</Text>
        <Text style={styles.cell}>Brand</Text>
        <Text style={styles.cell}>Part No.</Text>
        <Text style={styles.cell}>Code</Text>
        <Text style={styles.cell}>Price</Text>
        <Text style={styles.cell}>Qty</Text>
        <Text style={styles.cell}>Sold</Text>
        <Text style={styles.cell}>Status</Text>
      </View>

      {products?.map((product) => (
        <View key={product._id} style={styles.tableRow}>
          <Text style={styles.cell}>{product.name}</Text>
          <Text style={styles.cell}>{product.brand || '-'}</Text>
          <Text style={styles.cell}>{product.partNumber || '-'}</Text>
          <Text style={styles.cell}>{product.uniqueCode || '-'}</Text>
          <Text style={styles.cell}>{product.price?.toFixed(2)}</Text>
          <Text style={styles.cell}>{product.quantityRemaining}</Text>
          <Text style={styles.cell}>{product.quantitySold}</Text>
          <Text style={styles.cell}>{product.status || '-'}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default ProductsDocument;