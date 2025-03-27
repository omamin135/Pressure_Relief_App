import { Text, StyleSheet } from "react-native";
import useColors from "../theme/useColors";

interface PageHeaderProps {
  headerText: string;
}

const PageHeader = ({ headerText }: PageHeaderProps) => {
  const colors = useColors();

  return (
    <Text style={{ ...styles.headerText, color: colors.text.primary }}>
      {headerText}
    </Text>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "AlbertSans",
    marginTop: 15,
    fontSize: 25,
    fontWeight: "700",
  },
});

export default PageHeader;
