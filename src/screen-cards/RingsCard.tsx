import { View, StyleSheet } from "react-native";
import Rings from "../components/rings-display/Rings";
import Card from "../components/Card";
import RingStats from "../components/rings-display/RingStats";
import IonIcon from "react-native-vector-icons/Ionicons";
import useColors from "../theme/useColors";
import { useDatabase } from "../dataBase/DataBaseProvider";
import { useEffect, useState } from "react";
import { useAppSettings } from "../app-settings/AppSettingProvider";

const RingsCard = () => {
  const colors = useColors();
  const { appSettings } = useAppSettings();
  const { dbStateTableStoreSignal, dataBase } = useDatabase();

  const [numPressureReliefsToday, setNumPressureReliefsToday] = useState(0);
  const [numPressureReliefsOnTimeToday, setNumPressureReliefsOnTimeToday] =
    useState(0);

  const [goalNumberDailyRoutines, setGoalNumberDailyRoutines] = useState(
    appSettings.goalNumberDailyRoutines
  );

  // useEffect(() => {
  //   setGoalNumberDailyRoutines(appSettings.goalNumberDailyRoutines);
  // }, [appSettings.goalNumberDailyRoutines]);

  // when a new record is stored into state table then update the ring values
  useEffect(() => {
    getStateChangesForToday()
      .then((completedPressureReliefs) =>
        setNumPressureReliefsToday(completedPressureReliefs)
      )
      .catch((error) => console.error("Query Error: ", error));

    getOnTimePressureReliefsToday()
      .then((count) => {
        setNumPressureReliefsOnTimeToday(count);
      })
      .catch((error) => console.error("Query Error:", error));
  }, [dbStateTableStoreSignal, appSettings.onTimeToleranceSec]);

  const getStateChangesForToday = async (): Promise<number> => {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString(); // Current time in ISO format
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0); // Set to 12:00 AM
      const startOfDayISO = startOfDay.toISOString(); // Convert start of day to ISO format

      const query = `
        SELECT COUNT(*) AS recordCount 
        FROM StateChange 
        WHERE IsPressureReliefState = 1 AND Timestamp BETWEEN ? AND ?
      `;

      dataBase.transaction((tx) => {
        tx.executeSql(
          query,
          [startOfDayISO, now],
          (_, results) => {
            resolve(results.rows.item(0).recordCount);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  const getOnTimePressureReliefsToday = async (): Promise<number> => {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString(); // Current time in ISO format
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0); // Set to 12:00 AM
      const startOfDayISO = startOfDay.toISOString(); // Convert start of day to ISO format

      //   const query2 = `
      //     SELECT *
      //     FROM StateChange s
      //     JOIN PressureReliefTimes t
      //     ON ABS(strftime('%s', s.Timestamp) - strftime('%s', t.PressureReliefTime)) <= ${10};
      //     WHERE Timestamp BETWEEN ? AND ?
      //   `;

      //   const query3 = `
      //   SELECT  *
      //   FROM StateChange s
      //   JOIN PressureReliefTimes t
      //   ON ABS(strftime('%s', s.Timestamp) - strftime('%s', t.PressureReliefTime)) <= ${appSettings.onTimeToleranceSec}
      //   WHERE  s.Timestamp BETWEEN ? AND ?
      // `;

      // const query = `
      //   SELECT COUNT(*) AS recordCount
      //   FROM StateChange s
      //   JOIN PressureReliefTimes t
      //   ON ABS(strftime('%s', s.Timestamp) - strftime('%s', t.PressureReliefTime)) <= ${appSettings.onTimeToleranceSec};
      //   WHERE s.Timestamp BETWEEN datetime('start of day') AND datetime('now');
      // `;

      const query = `
      SELECT  COUNT(DISTINCT t.id) AS recordCount
      FROM StateChange s
      JOIN PressureReliefTimes t
      ON ABS(strftime('%s', s.Timestamp) - strftime('%s', t.PressureReliefTime)) <= ${appSettings.onTimeToleranceSec}
      WHERE s.IsPressureReliefState = 1 AND s.Timestamp BETWEEN ? AND ?
    `;

      dataBase.transaction((tx) => {
        tx.executeSql(
          query,
          [startOfDayISO, now],
          (_, results) => {
            resolve(results.rows.item(0).recordCount);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  return (
    <Card>
      <Rings
        ringProgress={[
          appSettings.goalNumberDailyRoutines > numPressureReliefsToday
            ? numPressureReliefsToday / appSettings.goalNumberDailyRoutines
            : 1,
          appSettings.goalNumberDailyRoutines > numPressureReliefsOnTimeToday
            ? numPressureReliefsOnTimeToday /
              appSettings.goalNumberDailyRoutines
            : 1,
        ]}
        displayLabel={
          appSettings.goalNumberDailyRoutines > numPressureReliefsToday
            ? `${
                appSettings.goalNumberDailyRoutines - numPressureReliefsToday
              } More pressure reliefs today`
            : "Pressure reliefs complete for the day!"
        }
      ></Rings>
      <View
        style={{
          ...styles.ringStatsContainer,
          backgroundColor: colors.background.secondary,
        }}
      >
        <RingStats
          icon={<IonIcon name={"time"} size={30} color={colors.primary.dark} />}
          message={`${numPressureReliefsToday} pressure reliefs complete today`}
          messageColor={colors.primary.dark}
        ></RingStats>
        <RingStats
          icon={
            <IonIcon name={"time"} size={30} color={colors.secondary.dark} />
          }
          message={`${numPressureReliefsOnTimeToday} Pressure reliefs on time today`}
          messageColor={colors.secondary.dark}
        ></RingStats>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  ringStatsContainer: {
    display: "flex",
    width: "100%",
    padding: 10,
    borderRadius: 20,
  },
});

export default RingsCard;
