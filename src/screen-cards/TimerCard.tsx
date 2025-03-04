import { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import useColors from "../theme/useColors";
import { TouchableOpacity, View, Text, StyleSheet, Switch } from "react-native";
import { useAppSettings } from "../app-settings/AppSettingProvider";
import { schedulePushNotification } from "../notifications/scheduleNotifications";
import { usePressureReliefStates } from "../state/PressureReliefStatesProvider";

const TimerCard = () => {
  const colors = useColors();
  const { appSettings, setSettings } = useAppSettings();
  const { pressureReliefMode, setPressureReliefState, setStateLock } =
    usePressureReliefStates();

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

  return (
    <Card color={colors.background}>
      <View style={styles.container}>
        <Text style={styles.header}>
          {paused
            ? "Tracking Paused"
            : appSettings.reliefIntervalMin * 60 - time < 0 &&
              !pressureReliefMode
            ? "Start Routine Now"
            : pressureReliefMode
            ? "Routine Started"
            : "Resting"}
        </Text>
        {pressureReliefMode ? (
          <>
            <Text style={styles.timeText}>
              {formatTime(appSettings.reliefDurationSeconds - time)}
            </Text>
            <Text style={styles.subHeader}>Left of Pressure Relief</Text>
          </>
        ) : (
          <>
            <Text style={styles.timeText}>
              {formatTime(appSettings.reliefIntervalMin * 60 - time)}
            </Text>
            <Text style={styles.subHeader}>Until Next Pressure Relief</Text>
          </>
        )}
        <View style={styles.buttonContainer}>
          <>
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={togglePressureReliefState}
              disabled={paused}
            >
              <Text style={styles.buttonText}>
                {pressureReliefMode ? "Stop Timer" : "Start Timer"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetTimer}
              disabled={paused}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </>
          <Switch
            value={paused}
            onValueChange={(paused) => {
              togglePausedState();
              if (paused) {
                pauseTimer();
              } else {
                resumeTimer();
              }
            }}
          />

          {/* {!running && (
            <TouchableOpacity
              style={[styles.button, styles.resumeButton]}
              onPress={resumeStopwatch}
            >
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>
          )} */}
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
  },
  header: {
    fontSize: 30,
    color: "green",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: "blue",
  },
  timeText: {
    fontSize: 48,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
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
