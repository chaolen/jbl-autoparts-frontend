import React, { useCallback, useEffect, useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import { Transaction } from 'types/transaction';
import { useLazyGetAllTransactionsQuery } from 'store/apis/transactionsApi';
import toast from 'react-hot-toast';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  header: {
    fontSize: 14,
    marginBottom: 10,
  },
  transactionSection: {
    marginBottom: 12,
    borderBottom: 1,
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  label: {
    width: 80,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  itemsHeader: {
    marginTop: 4,
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  itemCell: {
    flex: 1,
  },
});

type TransactionsDocumentProps = {
  transactions?: Transaction[];
}

const TransactionsDocument = ({ transactions }: TransactionsDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Transaction List as of {moment().format("MMMM DD YYYY")}</Text>

      {transactions?.map((tx: any) => (
        <View key={tx._id} style={styles.transactionSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice:</Text>
            <Text style={styles.value}>{tx.invoiceId || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cashier:</Text>
            <Text style={styles.value}>{tx.cashier?.name || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Partsman:</Text>
            <Text style={styles.value}>{tx.partsman?.name || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{tx.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total:</Text>
            <Text style={styles.value}>{tx.total.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discount:</Text>
            <Text style={styles.value}>{(tx.discount).toFixed(0)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{moment(tx.createdAt).format('D-M-YYYY')}</Text>
          </View>

          <Text style={styles.itemsHeader}>Items:</Text>
          {tx.items.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemCell}>{item._id?.name || 'Unknown product'}</Text>
              <Text style={styles.itemCell}>x {item.count}</Text>
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

type ExportTransactionsPDFProps = {
  transactions?: Transaction[];
}
const ExportTransactionsPDF = ({ }: ExportTransactionsPDFProps) => {
  const [getAllTransactions] = useLazyGetAllTransactionsQuery();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await getAllTransactions();
      if (response?.error) {
        toast.error(response.error?.data?.message ?? "");
        return;
      }
      setTransactions(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <button disabled className='px-4 py-2 rounded-lg bg-secondary-medium text-black font-medium'>Loading...</button>;

  if (error) return <button disabled className='px-4 py-2 rounded-lg bg-secondary-medium text-black font-medium'>Export Unavailable</button>;

  return (
    <PDFDownloadLink
      document={<TransactionsDocument transactions={transactions} />}
      fileName={`transactions-${moment().format('D-M-YYYY')}.pdf`}
      className='px-4 py-2 rounded-lg bg-secondary-medium text-black font-medium'
    >
      {({ loading }) =>
        loading ? <span>Generating PDF...</span> : <span>Download PDF</span>
      }
    </PDFDownloadLink>
  )
};

export default ExportTransactionsPDF;
