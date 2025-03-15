import { View, StyleSheet } from "react-native";

interface CardProps {
  color: string;
  children?: JSX.Element;
}

const Card = ({ color, children }: CardProps) => {
  return (
    <View style={{ ...styles.card, backgroundColor: color }}>{children}</View>
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
