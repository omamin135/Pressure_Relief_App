import { View, StyleSheet } from "react-native";
import useColors from "../theme/useColors";

interface CardProps {
  children?: JSX.Element;
}

const Card = ({ children }: CardProps) => {
  const colors = useColors();
  return (
    <View style={{ ...styles.card, backgroundColor: colors.background.main }}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 340,
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default Card;
