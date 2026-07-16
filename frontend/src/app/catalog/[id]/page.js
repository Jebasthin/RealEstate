import React from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import PropertyDetailsClient from '../../../components/PropertyDetailsClient';

async function getProperty(id) {
  try {
    const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.data?.property;
  } catch (error) {
    console.error('Error fetching property details on server:', error);
    return null;
  }
}

// Generate dynamic metadata for search engine indexing (SEO)
export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  const property = await getProperty(unwrappedParams.id);
  
  if (!property) {
    return {
      title: 'Property Not Found | Jose Estate',
      description: 'The requested property listing could not be found.',
    };
  }

  const titleText = `${property.title} in ${property.areaLocality?.name}, ${property.city?.name} | Jose Estate`;
  const descText = `${property.description.substring(0, 150)}... Buy ${property.bedrooms} BHK ${property.propertyType.toLowerCase()} at ₹${property.price.toLocaleString('en-IN')}. View details on Jose Estate.`;

  return {
    title: titleText,
    description: descText,
    openGraph: {
      title: titleText,
      description: descText,
      images: property.images && property.images.length > 0 ? [{ url: property.images[0].url }] : [],
    }
  };
}

export default async function PropertyDetailsPage({ params }) {
  const unwrappedParams = await params;
  const property = await getProperty(unwrappedParams.id);

  if (!property) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center flex-col gap-4 text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-brownie">Oops! Listing Unavailable</h2>
          <p className="text-coffee font-medium text-sm">The listing you are searching for is not available or has been removed.</p>
          <Link href="/catalog" className="px-6 py-3 bg-brownie hover:bg-caramel text-cream font-bold rounded-xl transition-colors">
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col selection:bg-caramel/30 selection:text-brownie">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <nav className="text-xs font-semibold text-coffee/80 flex gap-2 items-center">
          <Link href="/catalog" className="hover:text-brownie">Catalog</Link>
          <span>/</span>
          <span className="text-coffee uppercase">{property.propertyType}</span>
          <span>/</span>
          <span className="text-brownie line-clamp-1">{property.title}</span>
        </nav>

        <PropertyDetailsClient property={property} />

      </main>

      <Footer />
    </div>
  );
}
