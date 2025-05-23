import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: any) {
  return <ResetPasswordForm token={params.token} />;
} 