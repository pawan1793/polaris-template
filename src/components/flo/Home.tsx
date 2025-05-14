import React, { useState } from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  Banner,
  Button,
  Select,
  InlineStack,
  Link,
  Box,
  Popover,
  ActionList,
  TextContainer,
  Icon
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';

const Home: React.FC = () => {
  const [skuSync, setSkuSync] = useState('OFF');
  const skuSyncOptions = [
    { label: 'OFF', value: 'OFF' },
    { label: 'Limited sync', value: 'limited' },
    { label: 'Full sync', value: 'full' },
  ];

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = () => setPopoverActive((active) => !active);

  const locationOptions = ['Warehouse A', 'Warehouse B', 'Storefront'];

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const handleSelectLocation = (location: string) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations((prev) => [...prev, location]);
    }
    setPopoverActive(false);
  };

  const handleRemoveLocation = (location: string) => {
    setSelectedLocations((prev) => prev.filter((loc) => loc !== location));
  };

  const locationActions = locationOptions.map((loc) => ({
    content: loc,
    onAction: () => handleSelectLocation(loc),
  }));

  return (
    <Page>
      <BlockStack gap="400">
        {/* App Title */}
        <Box paddingBlockEnd="200">
          <Text as="h1" variant="headingLg" fontWeight="bold">
            Flo App
          </Text>
        </Box>

        {/* Info Banner */}
        <Banner tone="info">
          <InlineStack align="space-between" blockAlign="center">
            <Text as="span" variant="bodyMd">
              The app helps to keep the duplicate SKUs in sync
            </Text>
            <Button url="#" variant="primary" size="slim">
              Getting Started Guide
            </Button>
          </InlineStack>
        </Banner>

        {/* Duplicate SKU Sync */}
        <Card>
          <InlineStack align="space-between" blockAlign="center" wrap={false}>
            <Text as="span" variant="bodyMd" fontWeight="medium">
              Duplicate SKU Sync
            </Text>
            <Box minWidth="200px" maxWidth="300px">
              <Select
                options={skuSyncOptions}
                value={skuSync}
                onChange={setSkuSync}
                label="Duplicate SKU Sync"
                labelHidden
              />
            </Box>
          </InlineStack>
        </Card>

        {/* Blacklisted Locations */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <Box>
                <Text as="span" variant="bodyMd" fontWeight="medium">
                  Blacklisted Locations
                </Text>
              </Box>
              <Popover
                active={popoverActive}
                activator={
                  <Button
                    variant="secondary"
                    onClick={togglePopoverActive}
                    disclosure
                  >
                    Add Location
                  </Button>
                }
                onClose={togglePopoverActive}
              >
                <ActionList items={locationActions} />
              </Popover>
            </InlineStack>

            <BlockStack gap="050">
  <Text as="p" variant="bodySm" tone="subdued">
    Inventory at these locations will not be synced.
  </Text>
  <Text as="p" variant="bodySm">
    <Link url="#" removeUnderline>
      More info
    </Link>
  </Text>
</BlockStack>


            {/* Table to show selected locations */}
            {selectedLocations.length > 0 && (
              <BlockStack gap="100">
                {/* Table Header */}
                <InlineStack align="space-between" blockAlign="center">
                  <Box width="70%">
                    <Text as="span" variant="bodySm" fontWeight="bold">Location</Text>
                  </Box>
                  <Box width="30%">
                    <Text as="span" variant="bodySm" fontWeight="bold">Action</Text>
                  </Box>
                </InlineStack>

                <Box borderBlockEndWidth="050" borderColor="border" />

                {/* Table Rows */}
                {selectedLocations.map((loc) => (
                  <InlineStack
                    key={loc}
                    align="space-between"
                    blockAlign="center"
                    wrap={false}
                  >
                    <Box width="70%">
                      <Text as="span" variant="bodySm">{loc}</Text>
                    </Box>
                    <Box width="30%">
                      <Button
                        onClick={() => handleRemoveLocation(loc)}
                        variant="tertiary"
                        icon={DeleteIcon}
                      >
                        Remove
                      </Button>
                    </Box>
                  </InlineStack>
                ))}
              </BlockStack>
            )}


          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
};

export default Home;