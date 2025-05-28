import { useActionData, Form } from '@remix-run/react';

type ActionData = {
  error?: string;
  success?: boolean;
};

export default function NewsletterForm() {
  const actionData = useActionData<ActionData>();

  return (
    <Form method="post" className="space-y-4 max-w-md mx-auto mt-8">
      <input
        type="email"
        name="email"
        required
        placeholder="Tu correo electrónico"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded w-full">
        Suscribirme
      </button>
      {actionData?.success && <p className="text-green-600">¡Gracias por suscribirte!</p>}
      {actionData?.error && <p className="text-red-600">{actionData.error}</p>}
    </Form>
  );
}