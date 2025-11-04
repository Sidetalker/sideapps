import type { Metadata } from 'next';
import { MainSiteTable } from '@/components/arcgis/MainSiteTable';
import { siteSummaries } from '@/data/arcgis';

export const metadata: Metadata = {
  title: 'ArcGIS Operations Overview',
  description:
    'Explore operational data for regional infrastructure, reorganize columns, apply fuzzy filters, and hide fields directly in the table.',
};

export default function ArcgisOverviewPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <MainSiteTable sites={siteSummaries} />
    </div>
  );
}
