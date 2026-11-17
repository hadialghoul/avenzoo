import type { OrderStatus } from "@/lib/types";
import { statusLabel } from "@/lib/format";

const tones: Record<OrderStatus, string> = {
  new: "border border-gold/40 text-gold",
  confirmed: "border border-gold/70 text-gold",
  preparing: "border border-ivory/30 text-ivory",
  out_for_delivery: "border border-gold text-gold",
  delivered: "border border-gold-deep bg-gold-deep text-[#140f09]",
  cancelled: "border border-white/15 text-white/50",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${tones[status]}`}>
      {statusLabel(status)}
    </span>
  );
}
