import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserAddress = {
  fullName?: string;
  phone?: string;
  line1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

export type User = {
  token: string;
  name?: string;
  address?: UserAddress;
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          setUser(null);
          return;
        }

        // We DON'T call /auth/me anymore
        // Token existence = authenticated
        setUser({ token });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { user, setUser, loading };
};
