type Position = {
  latitude: number;
  longitude: number;
};

type AddressResponse = {
  locality?: string;
  city?: string;
  postcode?: string;
  countryName?: string;
};

export async function getAddress({
  latitude,
  longitude,
}: Position): Promise<AddressResponse> {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
  );
  if (!res.ok) throw Error("Failed getting address");

  const data: AddressResponse = await res.json();
  return data;
}
