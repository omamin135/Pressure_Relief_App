import { Appearance } from "react-native";

import { colors } from "../constants/colors";

const useColors = () => {
  const colorScheme = Appearance.getColorScheme() ?? "light";

  return colorScheme === "light" ? colors.light : colors.dark;
};

export default useColors;
