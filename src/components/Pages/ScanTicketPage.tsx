import { CommonHeader } from "@/components/Header/CommonHeader";
import { RequiredAuthLayout } from "@/components/layout/AuthLayout";
import { MainLayout } from "@/components/layout/MainLayout";

export default function ScanTicketPage() {
  return (
    <>
      <RequiredAuthLayout>
        <MainLayout>
          <CommonHeader title="Scan QR-Code" isShowBack={true} isShowTrailing={false} />
          <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
            
          </div>
        </MainLayout>
      </RequiredAuthLayout>
    </>
  );
}
