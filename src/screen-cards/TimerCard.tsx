import Card from "../components/Card";
import useColors from "../theme/useColors";

interface TimerCardProps {
  children: JSX.Element;
}

const TimerCard = ({ children }: TimerCardProps) => {
  const colors = useColors();

  return <Card color={colors.success.background}>{children}</Card>;
};

export default TimerCard;
