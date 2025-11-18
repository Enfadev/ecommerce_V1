import { Suspense } from "react";
import { AnalyticsWrapper } from "@/components/admin/analytics/AnalyticsWrapper";
import { getInitialAnalyticsData } from "@/lib/actions";
import Loading from "./loading";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analytics - Admin",
  description: "View comprehensive analytics and insights for your e-commerce store",
};

export default async function AdminAnalytics() {
  const initialData = await getInitialAnalyticsData();

  return (
    <Suspense fallback={<Loading />}>
      <AnalyticsWrapper initialData={initialData} />
    </Suspense>
  );
}
