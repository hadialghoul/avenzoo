import { whatsappLink } from "./brand";
import { money } from "./format";

export type BagLine = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

export type BagDraft = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity?: number;
};

export function lineId(productId: string, size: string, color: string) {
  return `${productId}::${size}::${color}`;
}

export function isBagLine(value: unknown): value is BagLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<BagLine>;
  return (
    typeof line.productId === "string" &&
    typeof line.slug === "string" &&
    typeof line.name === "string" &&
    typeof line.price === "number" &&
    Number.isFinite(line.price) &&
    typeof line.image === "string" &&
    typeof line.size === "string" &&
    typeof line.color === "string" &&
    typeof line.quantity === "number" &&
    line.quantity >= 1 &&
    line.quantity <= 5
  );
}

function photoUrl(image: string, origin: string) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${origin}${image}`;
}

export function orderWhatsApp(lines: BagLine[], origin: string) {
  const blocks = lines.map((line, index) => {
    const photo = photoUrl(line.image, origin);
    return [
      `${index + 1}. ${line.name}`,
      `Price: ${money(line.price)}`,
      line.size ? `Size: ${line.size}` : "",
      line.color ? `Color: ${line.color}` : "",
      `Quantity: ${line.quantity}`,
      `${origin}/product/${line.slug}`,
      photo ? `Photo: ${photo}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  });
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const text = [
    "Hello Avenzo,",
    "",
    "I would like to order:",
    "",
    blocks.join("\n\n"),
    "",
    `Subtotal: ${money(subtotal)}`,
    "",
    "Please confirm availability and delivery in Lebanon.",
  ].join("\n");
  return whatsappLink(text);
}
