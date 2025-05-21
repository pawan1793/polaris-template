import React, { useCallback, useState } from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineGrid,
  Box,
  Icon,
  Banner,
  Divider,
  Button,
  Collapsible
} from '@shopify/polaris';
import {
  EmailIcon,
  ChatIcon,
  QuestionCircleIcon,
  InfoIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@shopify/polaris-icons';

// TypeScript interface for Tawk_API
declare global {
  interface Window {
    Tawk_API?: {
      toggle?: () => void;
      maximize?: () => void;
    };
  }
}

const ContactSupport: React.FC = () => {
  // Add state to track which FAQs are open
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  // Toggle FAQ open/closed state
  const toggleFaq = useCallback((index: number) => {
    setOpenFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  }, []);

  const openLiveChat = useCallback(() => {
    if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
      window.Tawk_API.maximize();
    } else {
      console.error('Tawk.to chat widget not available');
      // Fallback to external link
      window.open('https://tawk.to', '_blank');
    }
  }, []);

  const supportOptions = [
    {
      title: 'Email Support',
      description: 'Get answers to all your account and technical questions.',
      icon: EmailIcon,
      action: {
        content: 'Send an email',
        onAction: () => window.open('mailto:support@example.com', '_blank'),
        primary: false
      },
      color: 'var(--p-color-bg-success-subdued)'
    },
    {
      title: 'Live Chat',
      description: 'Connect with our support team in real-time for immediate assistance.',
      icon: ChatIcon,
      action: {
        content: 'Start live chat',
        onAction: openLiveChat,
        primary: false
      },
      color: 'var(--p-color-bg-highlight-subdued)'
    },
    {
      title: 'Knowledge Base',
      description: 'Browse our comprehensive guides, tutorials, and frequently asked questions.',
      icon: QuestionCircleIcon,
      action: {
        content: 'Browse articles',
        onAction: () => window.open('https://thaliaapps.freshdesk.com/a/solutions/categories/29000035439/folders/29000057923', '_blank'),
        primary: false
      },
      color: 'var(--p-color-bg-info-subdued)'
    },
  ];

  const faqs = [
    {
      question: "Does the app support syncing across multiple product variants?",
      answer: "Yes, the app can detect and synchronize the quantities for variants that share the same SKU. If you have multiple variants with the same SKU, the app will sync their quantities as needed."
    },
    {
      question: "Can I undo a sync if something goes wrong?",
      answer: "No, the app does not offer an undo feature for syncing. If something goes wrong, you will need to manually adjust the quantity either within the app or directly from your Shopify store."
    },
    {
      question: "How frequently does the app check for duplicate SKUs?",
      answer: "The app scans your store inventory for duplicate SKUs each time you manually trigger a scan. We recommend running a scan after making significant inventory changes or at least once a week to ensure all duplicates are identified and synchronized properly."
    }
  ];

  return (
    <Page
      title="Support Center"
      subtitle="We're here to help you succeed with our app"
      fullWidth
    >
      <BlockStack gap="800">
        <Banner
          title="Need help?"
          tone="info"
          icon={InfoIcon}
        />        

        <InlineGrid columns={{ xs: 1, sm: 1, md: 3 }} gap="500">
          {supportOptions.map((option, index) => (
            <Card key={index} padding="0">
              {/* Wrap everything in a div with height 100% */}
              <div style={{ height: '100%' }}>
                {/* Remove style prop from Box */}
                <Box 
                  borderColor="border" 
                  borderRadius="300"
                  paddingInlineStart="0"
                  paddingInlineEnd="0"
                >
                  <BlockStack gap="400">
                    <div
                      style={{
                        padding: "var(--p-space-500)",
                        paddingBlockEnd: 0,
                        display: "flex",
                        alignItems: "center"
                        // Remove justifyContent: "space-between" since we don't need to display availability
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: option.color,
                          borderRadius: "var(--p-border-radius-full)",
                          padding: "var(--p-space-300)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: "40px",
                          minHeight: "40px"
                        }}
                      >
                        <Icon
                          source={option.icon}
                          accessibilityLabel={option.title}
                        />
                      </div>
                    </div>
                    
                    <Box padding="400" paddingBlockStart="0" paddingBlockEnd="0">
                      <BlockStack gap="200">
                        <Text as="h2" variant="headingMd" fontWeight="semibold">
                          {option.title}
                        </Text>
                        <Text as="p" variant="bodyMd">
                          {option.description}
                        </Text>
                      </BlockStack>
                    </Box>
                    
                    <Box padding="400" paddingBlockStart="0" paddingBlockEnd="400">
                      <Button
                        onClick={option.action.onAction}
                        variant={option.action.primary ? "primary" : "secondary"}
                        fullWidth
                      >
                        {option.action.content}
                      </Button>
                    </Box>
                  </BlockStack>
                </Box>
              </div>
            </Card>
          ))}
        </InlineGrid>

        <Divider />
      </BlockStack>
    </Page>
  );
};

export default ContactSupport;
