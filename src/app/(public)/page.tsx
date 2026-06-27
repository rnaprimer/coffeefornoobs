import Homepage from "@/components/home/Homepage";
import { getHomepageData, getHomepageSettings } from "@/lib/queries/homepage";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getHomepageSettings();
  if (!settings) return {};

  return {
    title: settings.meta_title || 'CoffeeForNoobs',
    description: settings.meta_description,
    openGraph: {
      images: settings.og_media?.url ? [settings.og_media.url] : [],
    },
  };
}

export default async function Home() {
  const data = await getHomepageData();

  return (
    <div className="w-full">
      <Homepage data={data} />
    </div>
  );
}

