import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import useColors from "../../theme/useColors";
import { useBLE } from "../../bluetooth/BLEProvider";
import {
  anglesType,
  displayAnglesType,
  sensorStatusType,
} from "../../bluetooth/dataTypes";

interface WheelchairAngleDiagramProps {
  angles: anglesType;
  displayAngles: displayAnglesType;
  sensorStatuses: sensorStatusType;
}

const WheelchairAngleDiagram = ({
  angles,
  displayAngles,
  sensorStatuses,
}: WheelchairAngleDiagramProps) => {
  const colors = useColors();

  //    leg angle is the angle UP from horizontal (poitive angle mean leg rest is above horizontal)
  //    seat angle is the angle DOWN from horizontal (poitive angle mean seat rest is angled forwards/sloping down to RIGHT)
  //    back angle is the angle UP from the orizontal (the angle up from the "outside of the wheelchair")
  const [adjustedLegAngle, setAdjustedLegAngle] = useState(angles.legAngle);
  const [adjustedSeatAngle, setAdjustedSeatAngle] = useState(-angles.seatAngle);
  const [adjustedBackAngle, setAdjustedBackAngle] = useState(angles.backAngle);

  // adjust the angles to be in correct form for the diagram
  useEffect(() => {
    setAdjustedLegAngle(angles.legAngle);
    setAdjustedSeatAngle(-angles.seatAngle);
    setAdjustedBackAngle(angles.backAngle);
  }, [angles]);

  // Segment lengths
  const segmentLength = 100;
  const segmentWidth = 20;
  const backSegmentLength = 90;
  const seatSegmentLength = 90;
  const legSegmentLength = 80;

  //#####################################################
  // Segment Positioning Computations
  //#####################################################

  const centerX = 160; // Center point
  const centerY = 150;

  // Convert angles to radians (absolute to horizontal)
  const radiansSeat = (adjustedSeatAngle * Math.PI) / 180;
  const radiansBack = (adjustedBackAngle * Math.PI) / 180;
  const radiansLeg = (adjustedLegAngle * Math.PI) / 180;

  // Calculate the seat line endpoints
  const seatX1 = centerX - (seatSegmentLength / 2) * Math.cos(radiansSeat);
  const seatY1 = centerY - (seatSegmentLength / 2) * Math.sin(radiansSeat);
  const seatX2 = centerX + (seatSegmentLength / 2) * Math.cos(radiansSeat);
  const seatY2 = centerY + (seatSegmentLength / 2) * Math.sin(radiansSeat);

  // Calculate the endpoints for the back and leg segments based on absolute angles
  const backX1 = seatX1 - backSegmentLength * Math.cos(radiansBack);
  const backY1 = seatY1 - backSegmentLength * Math.sin(radiansBack);

  const legX2 = seatX2 + legSegmentLength * Math.cos(radiansLeg);
  const legY2 = seatY2 - legSegmentLength * Math.sin(radiansLeg);

  //#####################################################
  // Back and Seat Segment Angle Arc
  //#####################################################

  // Angle between middle and left lines
  // let backSeatAngleBetween = Math.abs(
  //   180 + adjustedSeatAngle - adjustedBackAngle
  // );
  // if (backSeatAngleBetween > 180)
  //   backSeatAngleBetween = 360 - backSeatAngleBetween; // Keep within [0,180]

  const backSeatAngleBetween = displayAngles.backSeatAngle;

  // Arc for angle visualization
  const backSeatArcRadius = 30;
  const backSeatArcStartX = seatX1 - backSeatArcRadius * Math.cos(radiansBack);
  const backSeatArcStartY = seatY1 - backSeatArcRadius * Math.sin(radiansBack);
  const backSeatArcEndX = seatX1 + backSeatArcRadius * Math.cos(-radiansSeat);
  const backSeatArcEndY = seatY1 - backSeatArcRadius * Math.sin(-radiansSeat);
  const backSeatLargeArcFlag = backSeatAngleBetween > 180 ? 1 : 0;

  const backSeatArcPath = `M ${backSeatArcStartX} ${backSeatArcStartY} A ${backSeatArcRadius} ${backSeatArcRadius} 0 ${backSeatLargeArcFlag} 1 ${backSeatArcEndX} ${backSeatArcEndY}`;

  const backSeatAngleDistance = 50;
  const backSeatTextX =
    seatX1 -
    20 +
    backSeatAngleDistance *
      Math.cos(-radiansSeat + (backSeatAngleBetween * Math.PI) / 180 / 2);
  const backSeatTextY =
    seatY1 -
    backSeatAngleDistance *
      Math.sin(-radiansSeat + (backSeatAngleBetween * Math.PI) / 180 / 2);

  //#####################################################
  // Leg and Seat Segment Angle Arc
  //#####################################################

  //Angle between middle and left lines
  // let legSeatAngleBetween = Math.abs(
  //   180 + adjustedLegAngle + adjustedSeatAngle
  // );

  // if (legSeatAngleBetween > 180)
  //   legSeatAngleBetween = 360 - legSeatAngleBetween; // Keep within [0,180]

  const legSeatAngleBetween = displayAngles.legSeatAngle;

  // Arc for angle visualization
  const legSeatArcRadius = 30;
  const legSeatArcStartX = seatX2 + legSeatArcRadius * Math.cos(radiansLeg);
  const legSeatArcStartY = seatY2 - legSeatArcRadius * Math.sin(radiansLeg);
  const legSeatArcEndX = seatX2 - legSeatArcRadius * Math.cos(-radiansSeat);
  const legSeatArcEndY = seatY2 + legSeatArcRadius * Math.sin(-radiansSeat);
  const legSeatLargeArcFlag = legSeatAngleBetween > 180 ? 1 : 0;

  const legSeatArcPath = `M ${legSeatArcStartX} ${legSeatArcStartY} A ${legSeatArcRadius} ${legSeatArcRadius} 0 ${legSeatLargeArcFlag} 1 ${legSeatArcEndX} ${legSeatArcEndY}`;

  // Position angle text near the arc
  const legSeatAngleDistance = 55;
  const legSeatTextX =
    seatX2 -
    10 -
    legSeatAngleDistance *
      Math.sin(
        -radiansLeg + (legSeatAngleBetween * Math.PI) / 180 / 2 - Math.PI / 2
      );
  const legSeatTextY =
    seatY2 +
    legSeatAngleDistance *
      Math.cos(
        -radiansLeg + (legSeatAngleBetween * Math.PI) / 180 / 2 - Math.PI / 2
      );

  //#####################################################
  // Seat Segment Angle Arc
  //#####################################################

  // Angle between middle and left lines
  let seatAngleBetween = Math.abs(180 + adjustedLegAngle + adjustedSeatAngle);

  if (seatAngleBetween > 180) seatAngleBetween = 360 - seatAngleBetween; // Keep within [0,180]

  // Arc for angle visualization
  const seatArcRadius = 40;
  const seatArcStartX = seatX1 + seatArcRadius * Math.cos(-radiansSeat);
  const seatArcStartY =
    seatY1 - seatArcRadius * Math.sin(-radiansSeat) + segmentWidth / 2;
  const seatArcEndX = seatX1 + seatArcRadius;
  const seatArcEndY = seatY1 + segmentWidth / 2;
  const seatLargeArcFlag = legSeatAngleBetween > 180 ? 1 : 0;

  const seatArcPath = `M ${seatArcStartX} ${seatArcStartY} A ${seatArcRadius} ${seatArcRadius} 0 ${seatLargeArcFlag} 1 ${seatArcEndX} ${seatArcEndY}`;

  return (
    <View style={styles.container}>
      <Svg height="300" width="300">
        {/* back to seat angle indicator */}
        <Path d={backSeatArcPath} stroke="black" strokeWidth="3" fill="none" />
        <SvgText
          x={backSeatTextX}
          y={backSeatTextY}
          fill="black"
          fontSize="14"
          fontWeight="bold"
        >
          {backSeatAngleBetween.toFixed(0)}°
        </SvgText>

        {/* leg to seat angle indicator */}
        <Path d={legSeatArcPath} stroke="black" strokeWidth="3" fill="none" />
        <SvgText
          x={legSeatTextX}
          y={legSeatTextY}
          fill="black"
          fontSize="14"
          fontWeight="bold"
        >
          {legSeatAngleBetween.toFixed(0)}°
        </SvgText>

        {/* Seat angle indicator */}
        <Path d={seatArcPath} stroke="black" strokeWidth="3" fill="none" />
        <SvgText
          x={seatArcEndX - 15}
          y={seatArcEndY + 15}
          fill="black"
          fontSize="14"
          fontWeight="bold"
        >
          {displayAngles.seatAngle.toFixed(0)}°
        </SvgText>

        {/* Back Segment */}
        <Line
          x1={backX1}
          y1={backY1}
          x2={seatX1}
          y2={seatY1}
          stroke={sensorStatuses.legSensor ? "black" : colors.error.primary}
          strokeWidth={segmentWidth}
          strokeLinecap="round"
        />

        {/* Seat Segment */}
        <Line
          x1={seatX1}
          y1={seatY1}
          x2={seatX2}
          y2={seatY2}
          stroke={sensorStatuses.legSensor ? "black" : colors.error.primary}
          strokeWidth={segmentWidth}
          strokeLinecap="round"
        />

        {/* Leg Segment */}
        <Line
          x1={seatX2}
          y1={seatY2}
          x2={legX2}
          y2={legY2}
          stroke={sensorStatuses.legSensor ? "black" : colors.error.primary}
          strokeWidth={segmentWidth}
          strokeLinecap="round"
        />

        {/* seat angle line */}
        <Line
          x1={seatX1}
          y1={seatY1 + segmentWidth / 2}
          x2={seatX1 + segmentLength / 2}
          y2={seatY1 + segmentWidth / 2}
          stroke="black"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* foot */}
        <Line
          x1={legX2}
          y1={legY2}
          x2={legX2 + 15 * Math.cos(radiansLeg + Math.PI / 2)}
          y2={legY2 - 15 * Math.sin(radiansLeg + Math.PI / 2)}
          stroke={sensorStatuses.legSensor ? "black" : colors.error.primary}
          strokeWidth={segmentWidth}
          strokeLinecap="round"
        />

        {/* head */}
        <Circle
          cx={backX1}
          cy={backY1}
          r={20}
          fill={sensorStatuses.backSensor ? "black" : colors.error.primary}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WheelchairAngleDiagram;
