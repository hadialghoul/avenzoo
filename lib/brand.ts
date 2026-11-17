export const brand = {
  name: "Avenzo",
  place: "Tyre",
  placeLine: "Tyre (Sour), South Lebanon",
  phoneDisplay: "+961 76 775 038",
  phoneTel: "+96176775038",
  whatsapp: "96176775038",
  email: "Ah0706404@gmail.com",
  mapUrl: "https://maps.google.com/?q=33.269417,35.198719",
};

export const deliveryCities = [
  "Tyre",
  "Sidon",
  "Nabatieh",
  "Beirut",
  "Jounieh",
  "Byblos",
  "Batroun",
  "Tripoli",
  "Zahle",
  "Baalbek",
  "Aley",
  "Baabda",
  "Hazmieh",
  "Antelias",
  "Zgharta",
];

export const orderCities = [...deliveryCities, "Other"];

export function whatsappLink(message: string) {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const generalWhatsApp = whatsappLink(
  "Hello Avenzo, I would like to ask about a piece and delivery in Lebanon.",
);
