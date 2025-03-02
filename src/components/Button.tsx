import { Button } from "react-native";

interface StyledButtonProps {
  title: string;
  color: string;
}

const StyledButton = ({ title, color }: StyledButtonProps) => {
  return <Button title={title} color={color}></Button>;
};

export default StyledButton;
