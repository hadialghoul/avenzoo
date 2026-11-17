export function DeliveryNote() {
  return (
    <div className="mt-8 grid gap-4 border-t border-brand-line pt-6 sm:grid-cols-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">From</p>
        <p className="mt-2 text-sm leading-relaxed text-brand-charcoal">Tyre (Sour), South Lebanon.</p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Delivery</p>
        <p className="mt-2 text-sm leading-relaxed text-brand-charcoal">Anywhere in Lebanon. The day and the fee are confirmed on WhatsApp.</p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Payment</p>
        <p className="mt-2 text-sm leading-relaxed text-brand-charcoal">You order in the chat. We confirm the piece before it leaves the shop.</p>
      </div>
    </div>
  );
}
