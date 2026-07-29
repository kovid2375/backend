import { HelpCircle, Mail, MessageCircle, BookOpen } from "lucide-react";

const faqs = [
  {
    q: "How do I create a new product?",
    a: 'Go to "Create Product" in the sidebar, fill in the title, description, price, and upload up to 10 images, then click Save Product.',
  },
  {
    q: "What image formats are supported?",
    a: "You can upload PNG, JPG, or GIF images. Each file should be under 5MB.",
  },
  {
    q: "How do I view all my products?",
    a: 'Click "Products" in the sidebar to see your full product catalog with search and filters.',
  },
  {
    q: "Who can access the seller panel?",
    a: "Only accounts registered as sellers can access this panel. Make sure you registered with the seller option enabled.",
  },
];

export default function Help() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 lg:text-3xl">Help</h1>
        <p className="mt-1 text-zinc-500">
          Find answers to common questions about the seller panel.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: BookOpen, label: "Documentation", desc: "Seller guides" },
          { icon: MessageCircle, label: "Live Chat", desc: "Chat with support" },
          { icon: Mail, label: "Email Us", desc: "support@snitch.com" },
        ].map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004d30]/10">
              <Icon className="h-5 w-5 text-[#004d30]" />
            </div>
            <p className="mt-4 font-semibold text-zinc-900">{label}</p>
            <p className="mt-1 text-sm text-zinc-500">{desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <HelpCircle className="h-5 w-5 text-[#004d30]" />
          <h2 className="text-base font-bold text-zinc-900">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl border border-zinc-100 p-4"
            >
              <summary className="cursor-pointer text-sm font-semibold text-zinc-900">
                {q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
