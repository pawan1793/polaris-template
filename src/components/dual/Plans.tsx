// src/pages/Plans.tsx

import React from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  Box
} from '@shopify/polaris';

const Plans: React.FC = () => {
  return (
    <Page title="Plans">
      <Box padding="100">
        <div style={{ maxWidth: '200px', textAlign: 'center' }}>
          <Card >
            <BlockStack gap="100" align="center">
              <Text variant="headingMd" as="h2">Basic Plan</Text>
              <Text variant="heading2xl" as="p">$45</Text>
              <Text variant="bodyMd" as="p" tone="subdued">per year</Text>
              <Text variant="bodyMd" as="p">All features</Text>
              <Text variant="bodyMd" tone="success" fontWeight="semibold" as="p">
                Current Plan
              </Text>
            </BlockStack>
          </Card>
        </div>
      </Box>
    </Page>
  );
};

export default Plans;
