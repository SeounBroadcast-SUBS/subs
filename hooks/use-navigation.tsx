"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

export default function useNavigation() {
  const pathname = usePathname();
  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isSongRequestActive, setIsSongRequestActive] = useState(false);
  const [isMorningSongRequestActive, setIsMorningSongRequestActive] =
    useState(false);
  const [isSuggestionActive, setIsSuggestionActive] = useState(false);
  const [isNewCrewActive, setIsNewCrewActive] = useState(false);

  useEffect(() => {
    setIsHomeActive(false);
    setIsSongRequestActive(false);
    setIsMorningSongRequestActive(false);
    setIsSuggestionActive(false);
    setIsNewCrewActive(false);

    switch (pathname) {
      case "/":
        setIsHomeActive(true);
        break;
      case "/song-request":
        setIsSongRequestActive(true);
        break;
      case "/morning-song-request":
        setIsMorningSongRequestActive(true);
        break;
      case "/suggestion-request":
        setIsSuggestionActive(true);
        break;
      case "/new-crew":
        setIsNewCrewActive(true);
        break;
      default:
        break;
    }
  }, [pathname]);

  return {
    isHomeActive,
    isSongRequestActive,
    isMorningSongRequestActive,
    isSuggestionActive,
    isNewCrewActive,
  };
}
