export const useGetAddressFromGeo = async (lat, lng, locale) => {
  try {
    const response = await useFetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDuuMp_q2HijskSPUzTcB3_wOiSubL1LV0&language=${locale}&region=ar&location_type=APPROXIMATE`,
      { method: "get" }
    );

    const addressComponents = response.data.value.results[0].address_components;
    let detailedAddress = "";

    // Construct the detailed address by excluding the country component, starting from the last
    for (let i = 0; i <= addressComponents.length - 1; i++) {
      const component = addressComponents[i];
      if (!component.types.includes("country")) {
        detailedAddress = `${component.long_name} - ${detailedAddress}`;
      }
    }

    // Remove the last hyphen and space if present
    if (detailedAddress.endsWith(" - ")) {
      detailedAddress = detailedAddress.slice(0, -3);
    }

    console.log(detailedAddress);
    return detailedAddress;

    // return response.data.value.results[0].formatted_address
  } catch (error) {
    console.error("Error fetching city name:", error);
    return 0;
  }
};
