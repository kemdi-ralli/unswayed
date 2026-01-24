// hooks/useGoogleAutocomplete.js
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GOOGLE_MAPS_API_KEY = "AIzaSyBEREiN-vfh4N5pGUgAsY2nRYNQARP-oUI";

export const useGoogleAutocomplete = (onPlaceSelected) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (!inputRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["geocode"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) return;

        const selectedAddress = place.formatted_address || "";

        // Extract zip code
        const zipCode = place.address_components?.find((comp) =>
          comp.types.includes("postal_code")
        )?.long_name || "";

        // Update the input field value with the selected address
        if (inputRef.current) {
          inputRef.current.value = selectedAddress;
        }

        // Call the callback with all the data
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
  }, [onPlaceSelected]);

  return inputRef;
};