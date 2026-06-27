import { getHomepageData } from "@/lib/queries/homepage";
import HomepageEditor from "./HomepageEditor";

export default async function HomepageCMSPage() {
  const data = await getHomepageData(true);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-brand-dark mb-2">Homepage CMS</h1>
            <p className="text-gray-500 font-medium">Manage all content on the CoffeeForNoobs homepage.</p>
          </div>
          <a href="/" target="_blank" className="px-4 py-2 bg-brand-dark text-brand-white font-bold text-sm uppercase hover:bg-brand-lime hover:text-brand-dark transition-colors">
            View Live
          </a>
        </div>
        
        <HomepageEditor data={data} />
      </div>
    </div>
  );
}
