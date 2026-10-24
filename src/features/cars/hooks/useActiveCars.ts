import { useEffect, useState } from "react";
import { fetchActiveCars } from "@/features/cars/services/carService";
import { errorMessage } from "@/lib/utils";
import type { Car } from "@/types/car.types";

interface CarsState {
  cars: Car[];
  loading: boolean;
  error: string | null;
}

/**
 * Plain effect rather than TanStack Query because the data is synchronous demo JSON in this
 * phase. Phase 3 swaps this for query hooks when /cars starts paginating Firestore.
 */
export function useActiveCars(): CarsState {
  const [state, setState] = useState<CarsState>({ cars: [], loading: true, error: null });

  useEffect(() => {
    let active = true;
    fetchActiveCars()
      .then((cars) => {
        if (active) setState({ cars, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) setState({ cars: [], loading: false, error: errorMessage(error) });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
