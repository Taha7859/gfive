export default function CancelPage() {
  return (
    <div className="h-screen flex items-center justify-center flex-col bg-red-50">
      <h1 className="text-3xl font-bold text-red-700">❌ Payment Cancelled</h1>
      <p className="mt-2 text-gray-700">You can try again anytime.</p>
    </div>
  );
}
