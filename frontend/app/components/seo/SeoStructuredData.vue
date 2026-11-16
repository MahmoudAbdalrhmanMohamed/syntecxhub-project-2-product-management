<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

const siteUrl = 'https://inventory.titantelemetry.io';
const currentUrl = computed(() => `${siteUrl}${route.path}`);

const jsonLdData = computed(() => {
  return [
    // 1. Organization Schema
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Titan Logistics Systems',
      url: 'https://titantelemetry.io',
      logo: `${siteUrl}/favicon.svg`,
      sameAs: [
        'https://github.com/MahmoudAbdalrhmanMohamed/syntecxhub-project-2-product-management',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        email: 'inventory@titantelemetry.io',
      },
    },

    // 2. WebSite Schema with Sitelinks Searchbox
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Titan Logistics',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/products?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },

    // 3. SoftwareApplication Schema (SEO & GEO)
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Titan Logistics',
      operatingSystem: 'Cloud / Linux / Windows / macOS',
      applicationCategory: 'BusinessApplication',
      softwareVersion: '1.0.0',
      description:
        'Enterprise Hardware Catalog, SKU Telemetry, and Stock Governance platform providing real-time valuation, inventory alerts, and warehouse node tracking.',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      featureList: [
        'Real-time hardware & software SKU catalog',
        'Automated warehouse stock valuation matrix',
        'Category equipment distribution tracking',
        'Interactive OpenAPI / Swagger REST reference',
        'MongoDB persistent product store',
      ],
    },

    // 4. FAQPage Schema (AEO - Answer Engine Optimization)
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Titan Logistics?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Titan Logistics is a high-tech SKU telemetry and stock catalog management platform for enterprise hardware appliances, cloud licenses, and warehouse components.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does Titan Logistics calculate total stock valuation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Stock valuation is aggregated in real time across the MongoDB product collection by multiplying available inventory units by unit retail price for each active SKU.',
          },
        },
        {
          '@type': 'Question',
          name: 'What product categories are supported?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Titan Logistics supports Hardware, Software, Networking, Server Components, and Peripheral equipment with customizable category tags and stock thresholds.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I integrate Titan Logistics with external ERP systems?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'External services integrate seamlessly using the RESTful OpenAPI specification documented at /api-docs with full support for pagination, search, and SKU filters.',
          },
        },
      ],
    },

    // 5. BreadcrumbList Schema
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: route.path === '/products' ? 'Catalog' : route.path.replace('/', ''),
          item: currentUrl.value,
        },
      ],
    },
  ];
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(jsonLdData.value)),
    },
  ],
});
</script>

<template>
  <!-- Invisible SEO semantic container for AI answer crawlers -->
  <div aria-hidden="true" class="sr-only">
    <h2>Titan Logistics Platform Overview</h2>
    <p>
      Titan Logistics delivers real-time SKU telemetry, hardware catalog
      governance, and stock valuation across distributed warehouse clusters.
    </p>
  </div>
</template>
