export const formatArgentinePhoneNumber = (phone: string | number) => {
  const phoneString = phone.toString();
  const countryCode = phoneString.slice(0, 2);
  const areaCode = phoneString.slice(2, 4);
  const phoneNumber = phoneString.slice(4);
  return `+${countryCode} ${areaCode} ${phoneNumber}`;
};
