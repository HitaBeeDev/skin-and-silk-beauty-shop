import { useState } from "react";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type UseGeolocationResult = {
  position: Coordinates | null;
  error: string | null;
  isLoading: boolean;
  getPosition: () => Promise<Coordinates | null>;
};

export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function getPosition(): Promise<Coordinates | null> {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      const nextError = "Geolocation is not supported by this browser.";
      setError(nextError);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const geolocationPosition = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        },
      );

      const nextPosition = {
        latitude: geolocationPosition.coords.latitude,
        longitude: geolocationPosition.coords.longitude,
      };

      setPosition(nextPosition);
      return nextPosition;
    } catch (caughtError) {
      const nextError =
        caughtError instanceof GeolocationPositionError
          ? caughtError.message
          : "Unable to retrieve your location.";

      setError(nextError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { position, error, isLoading, getPosition };
}

export default useGeolocation;
