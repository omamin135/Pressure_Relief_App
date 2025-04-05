import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useBLE } from "../bluetooth/BLEProvider";
import { useAppSettings } from "../app-settings/AppSettingProvider";
import { useDatabase } from "../dataBase/DataBaseProvider";
import {
  BACK_DEFAULT_ANGLE,
  LEG_DEFAULT_ANGLE,
  SEAT_DEFAULT_ANGLE,
} from "../constants/bleConstants";

interface PressureReliefStatesContextType {
  pressureReliefMode: boolean;
  setPressureReliefState: (state: boolean) => void;
  setStateLock: (lock: boolean) => void;
}

interface PressureReliefStatesProviderProps {
  children?: React.ReactNode | undefined;
}

interface DataBufferType {
  backAngle: number[];
  seatAngle: number[];
  legAngle: number[];
}

const MAX_BUFFER_SIZE = 5;
const TIMEOUT_SEC = 10;

const PressureReliefStatesContext =
  createContext<PressureReliefStatesContextType>({
    pressureReliefMode: false,
    setPressureReliefState: (): void => {
      throw new Error("Function not implemented.");
    },
    setStateLock: (): void => {
      throw new Error("Function not implemented.");
    },
  });

export const PressureReliefStatesProvider = ({
  children,
}: PressureReliefStatesProviderProps) => {
  const [dataBuffer, setDataBuffer] = useState<DataBufferType>({
    backAngle: [] as number[],
    seatAngle: [] as number[],
    legAngle: [] as number[],
  });

  const { sensorData, angles } = useBLE();
  const { appSettings } = useAppSettings();
  const { storeStateChangeData } = useDatabase();

  const [pressureReliefMode, setPressureReliefMode] = useState<boolean>(false);
  const [previousState, setPreviousState] = useState<boolean>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [stateLock, setStateLock] = useState<boolean>(false);

  const sensor1Index = 1;
  const sensor2Index = 3;
  const sensor3Index = 5;

  const thresholds = {
    sensor1: 60,
    sensor2: 60,
    sensor3: 60,
  };

  useEffect(() => {
    if (angles)
      setDataBuffer((prevBuffer) => {
        const updatedBuffer = {
          backAngle: [...prevBuffer?.backAngle, angles.backAngle].slice(
            -MAX_BUFFER_SIZE
          ),
          seatAngle: [...prevBuffer?.seatAngle, angles.seatAngle].slice(
            -MAX_BUFFER_SIZE
          ),
          legAngle: [...prevBuffer?.legAngle, angles.legAngle].slice(
            -MAX_BUFFER_SIZE
          ),
        };
        return updatedBuffer;
      });
  }, [angles]);

  useEffect(() => {
    //console.log(stateLock);
    console.log("Buffer: ");
    console.log(dataBuffer);

    if (stateLock) return;
    if (!appSettings.sensorControlledState) return;

    if (checkForPressureRelief()) {
      setPressureReliefState(true);
    } else if (checkIfExitPressureRelief()) {
      setPressureReliefState(false);
    }

    // if (!stateLock) {
    //   setPressureReliefState(checkForPressureRelief());
    // }

    // if (!pressureReliefMode) {
    //   setPressureReliefState(checkForPressureRelief());
    //   //setStateLock(true);
    // } else {
    //   //setPressureReliefState(checkIfExitPressureRelief());
    // }

    // console.log(checkForPressureRelief());
    // console.log(checkIfExitPressureRelief());

    // if (!stateLock && !pressureReliefMode) {
    //   setPressureReliefState(checkForPressureRelief());
    // }

    // if (pressureReliefMode && checkIfExitPressureRelief()) {
    //   setStateLock(false);
    //   setPressureReliefMode(false);
    // }
  }, [dataBuffer]);

  // if the lock gets cleared manually, then make sure to clear the timeout
  // useEffect(() => {
  //   console.log(stateLock);
  //   // if (!stateLock) clearTimeout(timeoutId); #################
  // }, [stateLock]);

  useEffect(() => {
    // if (previousState && !pressureReliefMode) {
    //   // lock the state so when done with pressure releif and wheelchair is
    //   // still tilted is does not immeditely go back into pressure relief routine mode
    //   setStateLock(true);
    //   // ##################################################
    //   // clearTimeout(timeoutId);
    //   // const id = setTimeout(() => {
    //   //   setStateLock(false);
    //   // }, (appSettings.reliefDurationSeconds + TIMEOUT_SEC) * 1000);

    //   // setTimeoutId(id);
    // }

    //when change in pressure releif state, log into database
    storeStateChangeData(pressureReliefMode);
  }, [pressureReliefMode]);

  const checkForPressureRelief = (): boolean => {
    const bufferFilled = Object.values(dataBuffer).every(
      (sensorData) => sensorData.length === MAX_BUFFER_SIZE
    );

    // Do nothing if buffer is not filled
    if (!bufferFilled) return false;

    const { backAngle, seatAngle, legAngle } = dataBuffer;

    // check if all the values in the buffer are above the set threshold
    const backCheck = backAngle.every(
      (angle) => angle <= BACK_DEFAULT_ANGLE - appSettings.tiltThreshold
    );
    const seatCheck = seatAngle.every(
      (angle) => angle >= SEAT_DEFAULT_ANGLE + appSettings.tiltThreshold
    );
    const legCheck = legAngle.every(
      (angle) => angle >= LEG_DEFAULT_ANGLE + appSettings.tiltThreshold
    );

    return backCheck && seatCheck && legCheck;
  };

  const checkIfExitPressureRelief = (): boolean => {
    const bufferFilled = Object.values(dataBuffer).every(
      (sensorData) => sensorData.length === MAX_BUFFER_SIZE
    );

    // Do nothing if buffer is not filled
    if (!bufferFilled) return false;

    const { backAngle, seatAngle, legAngle } = dataBuffer;

    // check if all the values in the buffer are above the set threshold
    const backCheck = backAngle.every(
      (angle) => angle > BACK_DEFAULT_ANGLE - appSettings.tiltThreshold
    );
    const seatCheck = seatAngle.every(
      (angle) => angle < SEAT_DEFAULT_ANGLE + appSettings.tiltThreshold
    );
    const legCheck = legAngle.every(
      (angle) => angle < LEG_DEFAULT_ANGLE + appSettings.tiltThreshold
    );

    return backCheck && seatCheck && legCheck;
  };

  const setPressureReliefState = (value: boolean) => {
    const prevState = pressureReliefMode;
    //setStateLock(false);
    setPreviousState(prevState);
    setPressureReliefMode(value);
  };

  return (
    <PressureReliefStatesContext.Provider
      value={{ pressureReliefMode, setPressureReliefState, setStateLock }}
    >
      {children}
    </PressureReliefStatesContext.Provider>
  );
};

export const usePressureReliefStates = () => {
  return useContext(PressureReliefStatesContext);
};
