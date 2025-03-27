import { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import useColors from "../theme/useColors";
import { View, Text, StyleSheet } from "react-native";
import { useAppSettings } from "../app-settings/AppSettingProvider";
import { schedulePushNotification } from "../notifications/scheduleNotifications";
import { usePressureReliefStates } from "../state/PressureReliefStatesProvider";
import CircularProgress from "../components/CircularProgress";
import StyledButton from "../components/StyledButton";
import StyledSwitch from "../components/StyledSwitch";
import { useDatabase } from "../dataBase/DataBaseProvider";

const TimerCard = () => {
  const colors = useColors();
  const { appSettings, setSettings } = useAppSettings();
  const { pressureReliefMode, setPressureReliefState, setStateLock } =
    usePressureReliefStates();
  const [radialTimePercentage, setRadialTimePercentage] = useState(0);
  const { storePressureReliefTime } = useDatabase();

  const [time, setTime] = useState(0);
  // const [pressureReliefState, setPressureReliefState] =
  //   useState(pressureReliefMode);
  const [paused, setPaused] = useState(false);

  const intervalRef = useRef<any>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    startTimer();
  }, []);

  useEffect(() => {
    clearInterval(intervalRef.current);
    startTimer();
  }, [pressureReliefMode]);

  useEffect(() => {
    if (
      !pressureReliefMode &&
      appSettings.reliefIntervalMin * 60 - time === 0
    ) {
      if (appSettings.notificationsEnabled) {
        schedulePushNotification({
          title: "Reminder",
          body: "Reminder to perform your pressure relief routine",
        });
      }
      storePressureReliefTime();
    } else if (
      pressureReliefMode &&
      appSettings.reliefDurationSeconds - time === 0
    ) {
      if (appSettings.notificationsEnabled) {
        schedulePushNotification({
          title: "Routine Complete",
          body: "You may stop your pressure relief routine",
        });
      }
      setPressureReliefState(false);
    }

    if (pressureReliefMode) {
      updateRadialPercentage(time, appSettings.reliefDurationSeconds);
    } else {
      updateRadialPercentage(time, appSettings.reliefIntervalMin * 60);
    }
  }, [time]);

  const togglePressureReliefState = () => {
    // clear the stat lock if manually returnign back to resting state
    if (pressureReliefMode) setStateLock(false);
    setPressureReliefState(!pressureReliefMode);
  };

  const togglePausedState = () => {
    setPaused(!paused);
  };

  const startTimer = () => {
    clearInterval(intervalRef.current);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    startTimeRef.current = Date.now();
  };

  const resumeTimer = () => {
    startTimeRef.current = Date.now() - time * 1000;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  const formatTime = (time: number) => {
    if (time <= 0) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const updateRadialPercentage = (time: number, totalTime: number) => {
    if (totalTime - time >= 0) setRadialTimePercentage(time / totalTime);
  };

  return (
    <Card>
      <View style={styles.container}>
        <Text style={{ ...styles.header, color: colors.text.primary }}>
          {paused
            ? "Tracking Paused"
            : appSettings.reliefIntervalMin * 60 - time < 0 &&
              !pressureReliefMode
            ? "Start Routine Now"
            : pressureReliefMode
            ? "Routine Started"
            : "Upright"}
        </Text>
        <CircularProgress
          progress={radialTimePercentage}
          size={220}
          strokeWidth={12}
          disabled={paused}
          color={
            pressureReliefMode ? colors.secondary.main : colors.primary.main
          }
          backgroundColor={colors.background.secondary}
        >
          <View style={styles.timeContainer}>
            {pressureReliefMode ? (
              <>
                <Text
                  style={{
                    ...styles.timeText,
                    color: colors.text.primary,
                    opacity: paused ? 0.4 : 1,
                  }}
                >
                  {formatTime(appSettings.reliefDurationSeconds - time)}
                </Text>
                <Text
                  style={{
                    ...styles.timeSubHeader,
                    color: colors.text.supporting,
                    opacity: paused ? 0.4 : 1,
                  }}
                >
                  Left of Pressure Relief
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{
                    ...styles.timeText,
                    color: colors.text.primary,
                    opacity: paused ? 0.4 : 1,
                  }}
                >
                  {formatTime(appSettings.reliefIntervalMin * 60 - time)}
                </Text>
                <Text
                  style={{
                    ...styles.timeSubHeader,
                    color: colors.text.supporting,
                    opacity: paused ? 0.4 : 1,
                  }}
                >
                  Until Next Pressure Relief
                </Text>
              </>
            )}
          </View>
        </CircularProgress>
        <View
          style={{
            ...styles.inputContainer,
            backgroundColor: colors.background.secondary,
          }}
        >
          <View style={styles.buttonContainer}>
            <StyledButton
              title={pressureReliefMode ? "Stop Routine" : "Start Routine"}
              assessabilityHint={
                pressureReliefMode
                  ? "Stops pressure relief routine timer"
                  : "Starts pressure relief routine timer"
              }
              disabled={paused}
              color={colors.primary.main}
              onPress={togglePressureReliefState}
            />
            <StyledButton
              title="Reset"
              assessabilityHint=""
              disabled={paused}
              color={colors.secondary.main}
              onPress={resetTimer}
            />
          </View>
          <StyledSwitch
            value={paused}
            label="Pause Tracking"
            color={colors.primary.main}
            accessibilityLabel="Pause Tracking"
            assessabilityHint="Pauses the tracking state"
            onToggle={(paused) => {
              togglePausedState();
              if (paused) {
                pauseTimer();
              } else {
                resumeTimer();
              }
            }}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "AlbertSans",
  },
  header: {
    fontSize: 30,
    marginBottom: 10,
  },
  timeContainer: {
    display: "flex",
    alignItems: "center",
    width: 160,
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  timeSubHeader: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    marginTop: 15,
    padding: 20,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 25,
    marginBottom: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  startButton: {
    backgroundColor: "#2ecc71",
    marginRight: 10,
  },
  resetButton: {
    backgroundColor: "#e74c3c",
    marginRight: 10,
  },
  pauseButton: {
    backgroundColor: "#f39c12",
  },
  resumeButton: {
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default TimerCard;
