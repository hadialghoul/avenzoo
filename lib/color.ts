const swatches: Record<string, string> = {
  cognac: "#8B4518",
  camel: "#C19A6B",
  blue: "#2F5D8C",
  azure: "#3E7CB1",
  stone: "#B7A99A",
  black: "#111111",
  white: "#F7F7F7",
  navy: "#1C2B3A",
  indigo: "#2C3E6B",
  brown: "#6B3E26",
  grey: "#8A8A8A",
  gray: "#8A8A8A",
  green: "#2F5D45",
  red: "#8E2F2F",
  beige: "#D9CBB8",
  olive: "#5C5A32",
  cream: "#E8E0D0",
  sand: "#D8C3A5",
};

export function colorSwatch(name: string) {
  return swatches[name.trim().toLowerCase()] ?? "#D0D0D0";
}
