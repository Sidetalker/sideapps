import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteDetailContent } from '@/components/arcgis/SiteDetailContent';
import { getSiteDetail, siteDetails } from '@/data/arcgis';

interface ArcgisDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return siteDetails.map((site) => ({ id: site.id }));
}

export function generateMetadata({ params }: ArcgisDetailPageProps): Metadata {
  const site = getSiteDetail(params.id);
  if (!site) {
    return {
      title: 'Site not found',
    };
  }
  return {
    title: `${site.name} | ArcGIS Operations`,
    description: site.description,
  };
}

export default function ArcgisDetailPage({ params }: ArcgisDetailPageProps) {
  const site = getSiteDetail(params.id);

  if (!site) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SiteDetailContent site={site} />
    </div>
  );
}
