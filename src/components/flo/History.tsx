import {
  Card,
  Page,
  Text,
  Box,
  BlockStack,
  InlineStack,
  Link,
  IndexTable,
  Filters,
  Pagination,
  Divider,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';

export default function FloHistory() {
  // Add the CSS for hover effect
  const linkStyle = `
    <style>
      .product-title-link:hover {
        text-decoration: underline !important;
      }
    </style>
  `;

  const [queryValue, setQueryValue] = useState('');
  const [showSyncHistory, setShowSyncHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [syncHistory] = useState([
    {
      sku: 'M482M5_CAMOSCIOM482M5_CAMOSCIO',
      orderId: '11846775308670',
      orderDate: '14 May 2025 02:17 PM',
      productTitle: 'Stivali in Pelle Marlene - EBANO  Stivali in Pelle Marlene - EBANO Stivali in Pelle Marlene - EBANO/ 40',
      productVariantId: '49871255077156',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077156',
      syncedItems: [
        {
          title: 'Stivali in Camoscio Marlene - EBANO Stivali in Camoscio Marlene - EBANO  / 40',
          variantId: '49871244984612',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984612',
        },
        {
          title: 'Stivali in Pelle Marlene - EBANO / 41',
          variantId: '49871244984613',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984613',
        },
        {
          title: 'Stivali in Pelle Marlene - EBANO / 42',
          variantId: '49871244984614',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984614',
        },
      ],
      finalStock: [
        { location: 'Warehouse 1', quantity: 5 },
        { location: 'Outlet Store', quantity: 2 },
        { location: 'Main Store', quantity: 1 },
      ],
    },
    {
      sku: 'CAM123_NERO',
      orderId: '11846775308671',
      orderDate: '15 May 2025 03:25 PM',
      productTitle: 'Sneakers Classic - NERO / 42',
      productVariantId: '49871255077157',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077157',
      syncedItems: [
        {
          title: 'Sneakers Classic - NERO / 42',
          variantId: '49871244984615',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984615',
        },
        {
          title: 'Sneakers Classic - NERO / 43',
          variantId: '49871244984616',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984616',
        },
      ],
      finalStock: [
        { location: 'Warehouse 2', quantity: -2 },
        { location: 'Flagship Store', quantity: 3 },
        { location: 'Distribution Center', quantity: 8 },
      ],
    },
    {
      sku: 'TEST_SKU_1',
      orderId: '11846775308672',
      orderDate: '16 May 2025 04:35 PM',
      productTitle: 'Test Product 1',
      productVariantId: '49871255077158',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077158',
      syncedItems: [
        {
          title: 'Test Product 1 - Variant A',
          variantId: '49871244984617',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984617',
        },
        {
          title: 'Test Product 1 - Variant B',
          variantId: '49871244984618',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984618',
        },
        {
          title: 'Test Product 1 - Variant C',
          variantId: '49871244984619',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984619',
        },
        {
          title: 'Test Product 1 - Variant D',
          variantId: '49871244984620',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984620',
        },
      ],
      finalStock: {
        location: 'Warehouse 3',
        quantity: 10,
      },
    },
    {
      sku: 'TEST_SKU_2',
      orderId: '11846775308673',
      orderDate: '17 May 2025 05:45 PM',
      productTitle: 'Test Product 2',
      productVariantId: '49871255077159',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077159',
      syncedItems: [
        {
          title: 'Test Product 2 - Variant B',
          variantId: '49871244984615',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984615',
        },
      ],
      finalStock: {
        location: 'Warehouse 4',
        quantity: 0,
      },
    },
    {
      sku: 'TEST_SKU_3',
      orderId: '11846775308674',
      orderDate: '18 May 2025 06:55 PM',
      productTitle: 'Test Product 3',
      productVariantId: '49871255077160',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077160',
      syncedItems: [
        {
          title: 'Test Product 3 - Variant C',
          variantId: '49871244984616',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984616',
        },
      ],
      finalStock: {
        location: 'Warehouse 5',
        quantity: 3,
      },
    },
    {
      sku: 'TEST_SKU_4',
      orderId: '11846775308675',
      orderDate: '19 May 2025 08:05 PM',
      productTitle: 'Test Product 4',
      productVariantId: '49871255077161',
      productAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871255077161',
      syncedItems: [
        {
          title: 'Test Product 4 - Variant D',
          variantId: '49871244984617',
          variantAdminLink: 'https://admin.shopify.com/store/your-store-name/products/49871244984617',
        },
      ],
      finalStock: {
        location: 'Warehouse 6',
        quantity: 7,
      },
    },
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
    <Page 
      fullWidth 
      title="History"
    >
      {/* Insert the style tag */}
      <div dangerouslySetInnerHTML={{ __html: linkStyle }} />
      
      <BlockStack gap="500"> {/* Using space-500 (20px) for spacing between cards */}
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
                          { title: 'Details', alignment: 'center' },
                          { title: 'Final Stock', alignment: 'center' },
                        ]}
                      >
                        {paginatedData.map((item, index) => (
                          <IndexTable.Row
                            id={String(index)}
                            key={index}
                            position={index}
                          >
                            {/* Details Column - Full width table */}
                            <IndexTable.Cell>
                              <div style={{ width: "100%" }}>
                                {/* Add heading to SKU display above the table */}
                                <Box paddingBlockStart="200" paddingBlockEnd="200">
                                  <InlineStack align="start" gap="200">
                                    <Text variant="headingSm" fontWeight="semibold" as="span">
                                      SKU:
                                    </Text>
                                    <Text variant="headingSm" fontWeight="medium" as="span">
                                      {item.sku}
                                    </Text>
                                  </InlineStack>
                                </Box>
                                
                                <Box paddingBlockStart="0">
                                  <table style={{ 
                                    width: '100%', 
                                    borderCollapse: 'collapse',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: 'var(--p-color-border)',
                                    borderRadius: '8px',
                                    overflow: 'hidden'
                                  }}>
                                    <thead>
                                      {/* Table header row */}
                                      <tr style={{ 
                                        borderBottom: '1px solid var(--p-color-border)',
                                        background: 'var(--p-color-bg-surface-secondary)'
                                      }}>
                                        <th style={{ 
                                          padding: '12px 16px', 
                                          textAlign: 'left',
                                          width: '30%',
                                          fontWeight: 'normal'
                                        }}>
                                          <Text as="span" variant="bodySm" fontWeight="semibold">
                                            Order ID
                                          </Text>
                                        </th>
                                        <th style={{ 
                                          padding: '12px 16px', 
                                          textAlign: 'left',
                                          width: '70%',
                                          fontWeight: 'normal'
                                        }}>
                                          <Text as="span" variant="bodySm" fontWeight="semibold">
                                            Product Title
                                          </Text>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* Order information data row */}
                                      <tr style={{ borderBottom: '1px solid var(--p-color-border)' }}>
                                        <td style={{ 
                                          padding: '12px 16px', 
                                          textAlign: 'left',
                                          verticalAlign: 'top'
                                        }}>
                                          <Text as="span" variant="bodySm" fontWeight="medium">
                                            {item.orderId}
                                            <br />
                                            <Text as="span" variant="bodySm" tone="subdued" fontWeight="regular">
                                              {item.orderDate}
                                            </Text>
                                          </Text>
                                        </td>
                                        <td style={{ 
                                          padding: '12px 16px', 
                                          textAlign: 'left',
                                          verticalAlign: 'top',
                                          wordBreak: 'break-word',
                                          whiteSpace: 'pre-wrap',
                                          maxWidth: '0' // Forces td to respect the table layout
                                        }}>
                                          <Text as="span" variant="bodySm" fontWeight="medium" breakWord>
                                            <Link
                                              url={item.productAdminLink}
                                              external
                                              removeUnderline
                                              monochrome
                                            >
                                              {item.productTitle}
                                            </Link>
                                            <br />
                                            <Text as="span" variant="bodySm" tone="subdued" fontWeight="regular">
                                              Variant ID: {item.productVariantId}
                                            </Text>
                                          </Text>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Box>
                                
                                {/* Synced Items table */}
                                <Box paddingBlockStart="400">
                                  <table style={{ 
                                    width: '100%', 
                                    borderCollapse: 'collapse',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: 'var(--p-color-border)',
                                    borderRadius: '8px',
                                    overflow: 'hidden'
                                  }}>
                                    <tbody>
                                      {/* Table header row */}
                                      <tr style={{ 
                                        borderBottom: '1px solid var(--p-color-border)',
                                        background: 'var(--p-color-bg-surface-secondary)'
                                      }}>
                                        <th style={{ 
                                          padding: '12px 16px', 
                                          textAlign: 'left',
                                          width: '100%',
                                          fontWeight: 'normal'
                                        }}>
                                          <Text as="span" variant="bodySm" fontWeight="semibold">
                                            Synced Items
                                          </Text>
                                        </th>
                                      </tr>
                                      
                                      {/* Synced product data rows - one for each synced item */}
                                      {item.syncedItems.map((syncedItem, idx) => (
                                        <tr key={idx} style={{ borderBottom: idx < item.syncedItems.length - 1 ? '1px solid var(--p-color-border)' : 'none' }}>
                                          <td style={{ 
                                            padding: '12px 16px', 
                                            textAlign: 'left',
                                            verticalAlign: 'top'
                                          }}>
                                            <Text as="span" variant="bodySm" fontWeight="medium">
                                              <Link 
                                                url={syncedItem.variantAdminLink}
                                                external
                                                removeUnderline
                                                monochrome
                                              >
                                                {syncedItem.title}
                                              </Link>
                                              <br />
                                              <Text as="span" variant="bodySm" tone="subdued" fontWeight="regular">
                                                Variant ID: {syncedItem.variantId}
                                              </Text>
                                            </Text>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </Box>
                              </div>
                            </IndexTable.Cell>
                      
                            {/* Final Stock Column */}
                            <IndexTable.Cell>
                              <Box paddingInlineStart="400" paddingBlockStart="200">
                                <Card padding="0" background="bg-surface">
                                  <Box paddingBlockStart="0" paddingBlockEnd="0" paddingInlineStart="0" paddingInlineEnd="0">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                      <thead>
                                        <tr style={{ 
                                          borderBottom: '1px solid var(--p-color-border)',
                                          background: 'var(--p-color-bg-surface-secondary)'
                                        }}>
                                          <th style={{ padding: '12px', textAlign: 'left' }}>
                                            <Text as="span" variant="bodySm" fontWeight="semibold">Location</Text>
                                          </th>
                                          <th style={{ padding: '12px', textAlign: 'right' }}>
                                            <Text as="span" variant="bodySm" fontWeight="semibold">Quantity</Text>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {/* Map through all locations */}
                                        {Array.isArray(item.finalStock) ? (
                                          item.finalStock.map((stock, idx) => (
                                            <tr key={idx}>
                                              <td style={{ padding: '12px', textAlign: 'left' }}>
                                                <Text as="span" variant="bodySm">{stock.location}</Text>
                                              </td>
                                              <td style={{ padding: '12px', textAlign: 'right' }}>
                                                <Text as="span" variant="bodySm">{stock.quantity}</Text>
                                              </td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td style={{ padding: '12px', textAlign: 'left' }}>
                                              <Text as="span" variant="bodySm">{item.finalStock.location}</Text>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                              <Text as="span" variant="bodySm">{item.finalStock.quantity}</Text>
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </Box>
                                </Card>
                              </Box>
                            </IndexTable.Cell>
                          </IndexTable.Row>
                        ))}
                      </IndexTable>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <Box paddingBlockStart="400" paddingBlockEnd="200">
                          <Pagination
                            hasPrevious={currentPage > 1}
                            onPrevious={() => setCurrentPage(prev => prev - 1)}
                            hasNext={currentPage < totalPages}
                            onNext={() => setCurrentPage(prev => prev + 1)}
                            type="table"
                            label={`Page ${currentPage} of ${totalPages}`}
                            accessibilityLabel={`Pagination navigation, current page ${currentPage} of ${totalPages}`}
                          />
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </BlockStack>
        </Card>
        
        {/* Bottom spacing using Polaris tokens instead of arbitrary pixel value */}
        <Box paddingBlockEnd="600">
          {/* This empty Box provides the standard bottom spacing of 24px */}
        </Box>
      </BlockStack>
    </Page>
  );
}
