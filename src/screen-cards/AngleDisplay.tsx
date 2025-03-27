import { View, Text } from "react-native";
import { useBLE } from "../bluetooth/BLEProvider";
import WheelchairAngleDiagram from "../components/angle-display/WheelchairAngleDiagram";
import { useEffect, useState } from "react";
import AngleDisplayTable from "../components/angle-display/AngleDisplayTable";
import Card from "../components/Card";
import { useAppSettings } from "../app-settings/AppSettingProvider";

// leg angle is the angle UP from horizontal (poitive angle mean leg rest is above horizontal)
// seat angle is the angle UP from horizontal (poitive angle mean seat rest is angled backwards/sloping down to LEFT)
// back angle is the angle UP from the orizontal (the angle up from the "outside of the wheelchair")
const AngleDisplayCard = () => {
  const { angles, displayAngles, sensorStatuses } = useBLE();
  const { appSettings } = useAppSettings();

  return (
    // <View>
    //   <View>
    //     <Text>Back Rest</Text>
    //     <Text>{sensorData ? sensorData[1] : "no data"}</Text>
    //     {/* <View>Status</View> */}
    //   </View>
    //   <View>
    //     <Text>Seat</Text>
    //     <Text>{sensorData ? sensorData[3] : "no data"}</Text>
    //   </View>
    //   <View>
    //     <Text>Leg Rest</Text>
    //     <Text>{sensorData ? sensorData[5] : "no data"}</Text>
    //   </View>
    // </View>

    <Card>
      <View>
        <WheelchairAngleDiagram
          angles={angles}
          displayAngles={displayAngles}
          sensorStatuses={sensorStatuses}
          tiltThreshold={appSettings.tiltThreshold}
        ></WheelchairAngleDiagram>
        <AngleDisplayTable
          displayAngles={displayAngles}
          sensorStatuses={sensorStatuses}
        ></AngleDisplayTable>
      </View>
    </Card>
  );
};

export default AngleDisplayCard;
