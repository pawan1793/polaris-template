import {
  Card,
  Page,
  Text,
  Box,
  BlockStack,
  Link,
  IndexTable,
  Filters,
  Pagination,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';

export default function FloHistory() {
  const [queryValue, setQueryValue] = useState('');
  const [showSyncHistory, setShowSyncHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [syncHistory] = useState([
    {
      sku: 'M482M5_CAMOSCIO',
      orderId: '11846775308670',
      orderDate: '14 May 2025 02:17 PM',
      productTitle: 'Stivali in Pelle Marlene - EBANO / 40',
      productVariantId: '49871255077156',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077156',
      syncedItems: [
        {
          title: 'Stivali in Camoscio Marlene - EBANO / 40',
          variantId: '49871244984612',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984612',
        },
      ],
      finalStock: {
        location: 'Warehouse 1',
        quantity: 5,
      },
    },
    // Add more items as needed for testing pagination
  ]);

  const handleQueryChange = useCallback((value: string) => {
    setQueryValue(value);
    setCurrentPage(1); // Reset to page 1 on search
  }, []);

  const handleQueryClear = useCallback(() => {
    setQueryValue('');
    setCurrentPage(1);
  }, []);

  const handleRevealHistory = () => setShowSyncHistory(true);

  const filteredData = syncHistory.filter(item =>
    item.sku.toLowerCase().includes(queryValue.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Page title="History">
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="0">
            <Box background="bg-fill-secondary" padding="400" borderRadius="200">
              <Text as="span" variant="bodyMd" fontWeight="medium">
                Sync History
              </Text>
              <Text as="span" variant="bodySm" tone="subdued">
                {' '} (last 6 hours)
              </Text>
            </Box>

            <Box padding="400">
              {!showSyncHistory ? (
                <Box paddingBlockStart="400">
                  <Link onClick={handleRevealHistory} removeUnderline>
                    <Text as="span" variant="bodyMd" tone="subdued">
                      No sync history found
                    </Text>
                  </Link>
                </Box>
              ) : (
                <>
                  <Box paddingBlockEnd="300">
                    <Filters
                      queryValue={queryValue}
                      queryPlaceholder="Search by SKU"
                      onQueryChange={handleQueryChange}
                      onQueryClear={handleQueryClear}
                      filters={[]}
                      onClearAll={handleQueryClear}
                    />
                  </Box>

                  {filteredData.length === 0 ? (
                    <Text as='span' tone="subdued">No SKU Found</Text>
                  ) : (
                    <>
                      <IndexTable
                        resourceName={{ singular: 'sync', plural: 'syncs' }}
                        itemCount={filteredData.length}
                        selectable={false}
                        headings={[
                          { title: 'SKU' },
                          { title: 'Details' },
                          { title: 'Final Stock' },
                        ]}
                      >
                        {paginatedData.map((item, index) => (
                          <IndexTable.Row
                            id={String(index)}
                            key={index}
                            position={index}
                          >
                            <IndexTable.Cell>
                              <Text as="span">{item.sku}</Text>
                            </IndexTable.Cell>

                            <IndexTable.Cell>
                              <Box maxWidth="450px">
                                <BlockStack gap="200">
                                  {/* Order & Product Info */}
                                  <Card padding="300">
                                    <BlockStack gap="100">
                                      <Text as='span' variant="bodySm">
                                        <Text as="span" fontWeight="medium">Order#</Text> {item.orderId} - {item.orderDate}
                                      </Text>
                                      <Text as='span' variant="bodySm">
                                        <Link url={item.productAdminLink} external>
                                          {item.productTitle}
                                        </Link>
                                      </Text>
                                      <Text as='span' tone="subdued" variant="bodySm">
                                        Variant ID -{' '}
                                        <Link
                                          url={`https://admin.shopify.com/store/your-store-name/products/${item.productVariantId}`}
                                          external
                                        >
                                          {item.productVariantId}
                                        </Link>
                                      </Text>
                                    </BlockStack>
                                  </Card>

                                  {/* Synced Items Info */}
                                  <Card padding="300">
                                    <IndexTable
                                      resourceName={{ singular: 'item', plural: 'items' }}
                                      itemCount={item.syncedItems.length}
                                      headings={[
                                        { title: '#' },
                                        { title: 'Item' },
                                        { title: 'ID' },
                                      ]}
                                      selectable={false}
                                      condensed
                                    >
                                      {item.syncedItems.map((syncedItem, idx) => (
                                        <IndexTable.Row id={String(idx)} key={idx} position={idx}>
                                          <IndexTable.Cell>{idx + 1}</IndexTable.Cell>
                                          <IndexTable.Cell>
                                            <Link url={syncedItem.variantAdminLink} external>
                                              {syncedItem.title}
                                            </Link>
                                          </IndexTable.Cell>
                                          <IndexTable.Cell>
                                            <Link
                                              url={`https://admin.shopify.com/store/your-store-name/products/${syncedItem.variantId}`}
                                              external
                                            >
                                              {syncedItem.variantId}
                                            </Link>
                                          </IndexTable.Cell>
                                        </IndexTable.Row>
                                      ))}
                                    </IndexTable>
                                  </Card>
                                </BlockStack>
                              </Box>
                            </IndexTable.Cell>

                            {/* Final Stock - UNCHANGED */}
                            <IndexTable.Cell>
                              <IndexTable
                                resourceName={{ singular: 'stock', plural: 'stocks' }}
                                itemCount={1}
                                headings={[
                                  { title: 'Location' },
                                  { title: 'Quantity' },
                                ]}
                                selectable={false}
                              >
                                <IndexTable.Row id="0" key="0" position={0}>
                                  <IndexTable.Cell>{item.finalStock.location}</IndexTable.Cell>
                                  <IndexTable.Cell>
                                    <Text
                                      as='span'
                                      tone={item.finalStock.quantity < 0 ? 'critical' : undefined}
                                    >
                                      {item.finalStock.quantity}
                                    </Text>
                                  </IndexTable.Cell>
                                </IndexTable.Row>
                              </IndexTable>
                            </IndexTable.Cell>
                          </IndexTable.Row>
                        ))}
                      </IndexTable>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <Box paddingBlockStart="400">
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                              hasPrevious={currentPage > 1}
                              onPrevious={() => setCurrentPage(prev => prev - 1)}
                              hasNext={currentPage < totalPages}
                              onNext={() => setCurrentPage(prev => prev + 1)}
                            />
                          </div>
                        </Box>


                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
