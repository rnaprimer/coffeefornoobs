import PageHeader from '@/components/admin/ui/PageHeader';
import MerchantForm from '@/components/admin/forms/MerchantForm';

export const metadata = {
  title: 'New Merchant - Admin',
};

export default function NewMerchantPage() {
  return (
    <>
      <PageHeader title="New Merchant" />
      <MerchantForm />
    </>
  );
}
