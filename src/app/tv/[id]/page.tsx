import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getTVDetail } from '@/lib/data-source';
import { DEFAULT_REGION, REGION_COOKIE } from '@/lib/constants';
import { DetailView } from '@/components/media/DetailView';

export const dynamic = 'force-dynamic';

function parseId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = parseId(params.id);
  if (id === null) return { title: 'Not found' };
  const region =
    cookies().get(REGION_COOKIE)?.value?.slice(0, 2).toUpperCase() ??
    DEFAULT_REGION;
  const detail = await getTVDetail(id, region);
  return { title: detail ? detail.title : 'Not found' };
}

export default async function TVPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseId(params.id);
  if (id === null) notFound();

  const region =
    cookies().get(REGION_COOKIE)?.value?.slice(0, 2).toUpperCase() ??
    DEFAULT_REGION;

  const detail = await getTVDetail(id, region);
  if (!detail) notFound();

  return <DetailView detail={detail} />;
}
