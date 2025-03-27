import { View, Text, StyleSheet } from "react-native";

interface RingStatsProps {
  icon: JSX.Element;
  message: string;
  messageColor: string;
}

const RingStats = ({ icon, message, messageColor }: RingStatsProps) => {
  return (
    <View style={styles.container}>
      <View>{icon}</View>
      <Text style={{ ...styles.text, color: messageColor }}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
    padding: 10,
    width: "80%",
  },
  icon: {
    marginRight: 10, // Adds spacing between icon and text
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default RingStats;
