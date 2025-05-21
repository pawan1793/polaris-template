import {
  Card,
  BlockStack,
  Box,
  Text,
  Page
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';

export default function FlowInventory() {
  const navigate = useNavigate();

  const ClickableCard = ({
    title,
    description,
    onClick
  }: {
    title: string;
    description: string;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        flex: '1 1 300px',
        minWidth: '280px',
        maxWidth: '100%',
      }}
    >
      <Card>
        <Box padding="400">
          <BlockStack gap="200">
            <Text as="h3" variant="bodyMd" fontWeight="semibold">
              {title}
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              {description}
            </Text>
          </BlockStack>
        </Box>
      </Card>
    </div>
  );

  return (
    <Page>
      {/* Heading */}
      <Box padding="400">
        <Text as="h1" variant="headingLg" fontWeight="bold">
          Inventory Overview
        </Text>
      </Box>

      {/* Card Row */}
      <Box paddingInline="400">
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'flex-start'
          }}
        >
          <ClickableCard
            title="Quick View"
            description="Get a quick overview of your inventory status."
            onClick={() => navigate('/flo/inventory-quick-view')}
          />
          <ClickableCard
            title="Detail View"
            description="Access detailed inventory information and analytics."
            onClick={() => navigate('/flo/inventory-detail-view')}
          />
        </div>
      </Box>
    </Page>
  );
}
