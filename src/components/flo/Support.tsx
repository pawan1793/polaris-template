import React from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineGrid,
  TextContainer,
} from '@shopify/polaris';

const ContactSupport: React.FC = () => {
  const cards = [
    {
      title: 'Email us',
      description: 'Send us an email via Gmail.',
      link: 'https://mail.google.com',
    },
    {
      title: 'Chat with us',
      description: 'Start a live chat on Tawk.to.',
      link: 'https://tawk.to',
    },
    {
      title: 'Documentation',
      description: 'Access guides and FAQs.',
      link: 'https://thaliaapps.freshdesk.com/a/solutions/categories/29000035439/folders/29000057923',
    },
  ];

  return (
    <Page title="Contact Support">
      <InlineGrid
        columns={{ xs: '1fr', sm: '1fr', md: ['oneThird', 'oneThird', 'oneThird'] }}
        gap="400"
      >
        {cards.map((card, index) => (
          <a
            key={index}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Card padding="500">
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  {card.title}
                </Text>
                <TextContainer>
                  <Text as="p" variant="bodyMd">
                    {card.description}
                  </Text>
                </TextContainer>
              </BlockStack>
            </Card>
          </a>
        ))}
      </InlineGrid>
    </Page>
  );
};

export default ContactSupport;
