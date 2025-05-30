import React, { useState, useEffect } from 'react';
import {
  Page,
  BlockStack,
  InlineGrid,
  Box,
  Card,
  Text,
  Button,
  Icon,
  Divider,
  Banner
} from '@shopify/polaris';
import { CheckIcon, ChannelsIcon } from '@shopify/polaris-icons';

const Plans: React.FC = () => {
  // Use a more descriptive plan type naming
  type ShopifyPlanCategory = 'FREE' | 'BASIC' | 'ESTABLISHED' | 'HIGH_VOLUME';
  
  // Map plan categories to actual Shopify plans
  const planCategoryMapping: Record<ShopifyPlanCategory, string[]> = {
    'FREE': ['Shopify staff', 'Shopify partner', 'Shopify trial', 'Pause and Build'],
    'BASIC': ['Basic Shopify'],
    'ESTABLISHED': ['Shopify', 'Advanced Shopify'],
    'HIGH_VOLUME': ['Shopify Plus']
  };
  
  // State to store the plan category
  const [planCategory, setPlanCategory] = useState<ShopifyPlanCategory>('BASIC');
  
  // Get the actual Shopify plan based on category
  const getShopifyPlan = (category: ShopifyPlanCategory): string => {
    return planCategoryMapping[category][0]; // Just use the first plan in each category
  };
  
  // Function to determine plan prices based on plan category
  const getPlanPricesByCategory = (category: ShopifyPlanCategory) => {
    switch (category) {
      case 'FREE':
        return { basic: '$0', pro: '$0' };
      case 'BASIC':
        return { basic: '$5', pro: '$10' };
      case 'ESTABLISHED':
        return { basic: '$12', pro: '$24' };
      case 'HIGH_VOLUME':
        return { basic: '$20', pro: '$40' };
      default:
        return { basic: '$5', pro: '$10' };
    }
  };

  // Get current pricing based on plan category
  const planPrices = getPlanPricesByCategory(planCategory);
  const isFreeEligible = planCategory === 'FREE';
  const shopifyPlan = getShopifyPlan(planCategory);

  // Define plan data with dynamically calculated prices
  const plans = [
    {
      name: 'Basic Plan',
      price: planPrices.basic,
      isCurrentPlan: true,
      features: [
        { name: 'Unlimited SKUs', included: true },
        { name: 'Unlimited Syncs', included: true },
        { name: 'Sync History', included: true },
        { name: '1-click Restock', included: true },
        { name: 'Multi Location Support', included: true },
        { name: 'Full Sync', included: false },
      ],
    },
    {
      name: 'Pro Plan',
      price: planPrices.pro,
      isCurrentPlan: false,
      features: [
        { name: 'Unlimited SKUs', included: true },
        { name: 'Unlimited Syncs', included: true },
        { name: 'Sync History', included: true },
        { name: '1-click Restock', included: true },
        { name: 'Multi Location Support', included: true },
        { name: 'Full Sync', included: true },
      ],
    }
  ];
  
  // Handler for plan category change
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPlanCategory(event.target.value as ShopifyPlanCategory);
  };

  // Get plan description for the dropdown
  const getPlanDescription = (category: ShopifyPlanCategory): string => {
    switch(category) {
      case 'FREE':
        return "Free - Shopify staff, partner, trial, & Pause and Build";
      case 'BASIC':
        return "Basic - Basic Shopify";
      case 'ESTABLISHED':
        return "Established - Shopify & Advanced Shopify";
      case 'HIGH_VOLUME':
        return "High Volume - Shopify Plus";
    }
  };

  return (
    <Page
      title="Pricing Plans"
      subtitle="Choose the plan that best fits your business needs"
      fullWidth
    >
      <BlockStack gap="500"> {/* Changed from 800 to 500 to match other pages */}
        {/* Demo controls - remove in production */}
        <Box padding="400" background="bg-surface-secondary" borderRadius="300">
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">Demo Controls</Text>
            <div style={{ maxWidth: "400px" }}>
              <label htmlFor="planCategory">Select your Shopify plan tier: </label>
              <select 
                id="planCategory"
                value={planCategory}
                onChange={handleCategoryChange}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  marginTop: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd"
                }}
              >
                <option value="FREE">{getPlanDescription('FREE')}</option>
                <option value="BASIC">{getPlanDescription('BASIC')}</option>
                <option value="ESTABLISHED">{getPlanDescription('ESTABLISHED')}</option>
                <option value="HIGH_VOLUME">{getPlanDescription('HIGH_VOLUME')}</option>
              </select>
            </div>
          </BlockStack>
        </Box>
        
        <div style={{ maxWidth: "800px", marginLeft: "0", marginRight: "auto" }}>
          <InlineGrid columns={{ xs: 1, sm: 1, md: 2 }} gap="500">
            {plans.map((plan, index) => (
              <div key={index} style={{ position: "relative", maxWidth: "300px" }}>
                {!plan.isCurrentPlan && (
                  <div style={{
                    position: "absolute",
                    top: "-10px",
                    right: "20px",
                    backgroundColor: "#2C6ECB",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    zIndex: 1
                  }}>
                    Most Popular
                  </div>
                )}
                <Card padding="500">
                  <BlockStack gap="400">
                    <Box paddingBlockEnd="400">
                      <BlockStack gap="200">
                        <Text as="h2" variant="headingLg" fontWeight="semibold" alignment="center">
                          {plan.name}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                          Monthly billing
                        </Text>
                        <Text as="p" variant="headingXl" fontWeight="bold" alignment="center">
                          {plan.price}
                          <Text as="span" variant="bodyMd">/month</Text>
                        </Text>
                      </BlockStack>
                    </Box>

                    <Divider />

                    <BlockStack gap="300">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Icon
                              source={feature.included ? CheckIcon : ChannelsIcon}
                              tone={feature.included ? 'success' : 'critical'}
                            />
                          </div>
                          <Text as="span" variant="bodyMd" 
                            tone={feature.included ? undefined : 'subdued'} 
                            textDecorationLine={feature.included ? undefined : 'line-through'}>
                            {feature.name}
                          </Text>
                        </div>
                      ))}
                    </BlockStack>

                    <Box paddingBlockStart="400">
                      <Button
                        variant="primary"
                        tone={plan.isCurrentPlan ? "success" : undefined}
                        disabled={plan.isCurrentPlan}
                        fullWidth
                      >
                        {plan.isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                      </Button>
                    </Box>
                  </BlockStack>
                </Card>
              </div>
            ))}
          </InlineGrid>
        </div>
        
        {/* Add bottom spacing to match Shopify admin UI */}
        <Box paddingBlockEnd="600">
          {/* This provides the standard 24px bottom spacing using Polaris tokens */}
        </Box>
      </BlockStack>
    </Page>
  );
};

export default Plans;