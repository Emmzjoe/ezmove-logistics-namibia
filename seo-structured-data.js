// ==================== SEO STRUCTURED DATA ====================
// JSON-LD structured data for better search engine understanding

function addStructuredData() {
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EZMove",
    "url": "https://ezmove.na",
    "logo": "https://ezmove.na/icons/icon-512x512.png",
    "description": "Namibia's premier on-demand logistics and delivery platform",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Independence Avenue",
      "addressLocality": "Windhoek",
      "addressRegion": "Khomas",
      "postalCode": "9000",
      "addressCountry": "NA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -22.5609,
      "longitude": 17.0658
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+264-61-123-4567",
      "contactType": "Customer Service",
      "email": "support@ezmove.na",
      "areaServed": "NA",
      "availableLanguage": ["en", "af"]
    },
    "sameAs": [
      "https://facebook.com/ezmove",
      "https://twitter.com/ezmove",
      "https://instagram.com/ezmove"
    ],
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "EZMove Team"
      }
    ]
  };

  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "EZMove",
    "image": "https://ezmove.na/icons/icon-512x512.png",
    "@id": "https://ezmove.na",
    "url": "https://ezmove.na",
    "telephone": "+264-61-123-4567",
    "priceRange": "NAD 50 - NAD 5000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Independence Avenue",
      "addressLocality": "Windhoek",
      "addressRegion": "Khomas",
      "postalCode": "9000",
      "addressCountry": "NA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -22.5609,
      "longitude": 17.0658
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://facebook.com/ezmove",
      "https://twitter.com/ezmove",
      "https://instagram.com/ezmove"
    ]
  };

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Delivery and Logistics",
    "provider": {
      "@type": "Organization",
      "name": "EZMove"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Namibia"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Delivery Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pickup Truck Delivery",
            "description": "Delivery service using pickup trucks for small to medium loads"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Small Truck Delivery",
            "description": "Delivery service using small trucks for medium-sized loads up to 2 tons"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Flatbed Delivery",
            "description": "Flatbed truck delivery for large or unconventional loads up to 3 tons"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Large Truck Delivery",
            "description": "Large truck delivery for heavy loads up to 5 tons"
          }
        }
      ]
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "NAD",
      "lowPrice": "50",
      "highPrice": "5000",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "priceCurrency": "NAD",
        "price": "50",
        "billingIncrement": 1,
        "unitText": "per delivery"
      }
    }
  };

  // Web Application Schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EZMove",
    "url": "https://ezmove.na",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "NAD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "screenshot": "https://ezmove.na/screenshots/home-screen.png"
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does EZMove work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EZMove connects clients who need delivery services with verified drivers. Simply create a job with pickup and delivery addresses, select your vehicle type, and a nearby driver will accept your request. Track your delivery in real-time and receive photo proof upon completion."
        }
      },
      {
        "@type": "Question",
        "name": "What areas does EZMove serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EZMove currently operates throughout Namibia, with primary coverage in Windhoek, Walvis Bay, Swakopmund, and other major cities. We're continuously expanding to serve more areas."
        }
      },
      {
        "@type": "Question",
        "name": "How is pricing calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pricing is calculated based on distance (NAD 8 per km), estimated duration (NAD 2 per minute), vehicle type, and a base price of NAD 50. You'll see the total price before confirming your booking."
        }
      },
      {
        "@type": "Question",
        "name": "How do I become a driver?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Register as a driver on our platform, provide your vehicle details, driver's license, and required documentation. Our admin team will verify your information, typically within 24-48 hours."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods are accepted?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept cash payments and are integrating digital payment options including MTN MoMoPay and bank transfers for added convenience."
        }
      }
    ]
  };

  // Breadcrumb Schema (dynamic based on page)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ezmove.na"
      }
    ]
  };

  // Insert all schemas into the document
  const schemas = [
    organizationSchema,
    localBusinessSchema,
    serviceSchema,
    webAppSchema,
    faqSchema,
    breadcrumbSchema
  ];

  schemas.forEach((schema) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });

  console.log('✅ SEO: Structured data added');
}

// Add structured data when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addStructuredData);
} else {
  addStructuredData();
}

// Export for manual use
window.addStructuredData = addStructuredData;
