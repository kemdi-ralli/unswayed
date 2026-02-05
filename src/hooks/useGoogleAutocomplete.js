// hooks/useGoogleAutocomplete.js
import { useEffect, useRef } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyBEREiN-vfh4N5pGUgAsY2nRYNQARP-oUI";

export const useGoogleAutocomplete = (onPlaceSelected) => {
  const inputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    import("@googlemaps/js-api-loader").then(({ Loader }) => {
      if (cancelled) return;
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
      });
      loader.load().then(() => {
        if (cancelled || !inputRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["geocode"] }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();

          if (!place.geometry) return;

          const selectedAddress = place.formatted_address || "";

          const zipCode = place.address_components?.find((comp) =>
            comp.types.includes("postal_code")
          )?.long_name || "";

          if (inputRef.current) {
            inputRef.current.value = selectedAddress;
          }

          if (onPlaceSelected) {
            onPlaceSelected({
              address: selectedAddress,
              components: place.address_components,
              location: place.geometry?.location?.toJSON(),
              zipCode,
            });
          }
        });
      });
    });
    return () => { cancelled = true; };
  }, [onPlaceSelected]);

  return inputRef;
};