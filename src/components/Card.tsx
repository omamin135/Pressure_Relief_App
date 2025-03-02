import { View } from "react-native";

interface CardProps {
  color: string;
  children?: JSX.Element;
}

const Card = ({ color, children }: CardProps) => {
  return <View style={{ backgroundColor: color }}>{children}</View>;
};

export default Card;
