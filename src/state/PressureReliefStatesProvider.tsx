import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useBLE } from "../bluetooth/BLEProvider";
import { useAppSettings } from "../app-settings/AppSettingProvider";

interface PressureReliefStatesContextType {
  pressureReliefMode: boolean;
  setPressureReliefState: (state: boolean) => void;
  setStateLock: (lock: boolean) => void;
}

interface PressureReliefStatesProviderProps {
  children?: React.ReactNode | undefined;
}

interface DataBufferType {
  sensor1: number[];
  sensor2: number[];
  sensor3: number[];
}

const MAX_BUFFER_SIZE = 5;
const TIMEOUT_SEC = 60;

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
    sensor1: [] as number[],
    sensor2: [] as number[],
    sensor3: [] as number[],
  });

  const { sensorData } = useBLE();
  const { appSettings } = useAppSettings();

  const [pressureReliefMode, setPressureReliefMode] = useState<boolean>(false);
  const [previousState, setPreviousState] = useState<boolean>();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [stateLock, setStateLock] = useState<boolean>(false);

  const sensor1Index = 0;
  const sensor2Index = 1;
  const sensor3Index = 2;

  const thresholds = {
    sensor1: 15,
    sensor2: 15,
    sensor3: 15,
  };

  useEffect(() => {
    if (sensorData)
      setDataBuffer((prevBuffer) => {
        const updatedBuffer = {
          sensor1: [...prevBuffer?.sensor1, sensorData[sensor1Index]].slice(
            -MAX_BUFFER_SIZE
          ),
          sensor2: [...prevBuffer?.sensor1, sensorData[sensor2Index]].slice(
            -MAX_BUFFER_SIZE
          ),
          sensor3: [...prevBuffer?.sensor1, sensorData[sensor3Index]].slice(
            -MAX_BUFFER_SIZE
          ),
        };
        return updatedBuffer;
      });
  }, [sensorData]);

  useEffect(() => {
    if (!stateLock && !pressureReliefMode) {
      setPressureReliefState(checkForPressureRelief());
    }
  }, [dataBuffer]);

  // if the lock gets cleared manually, then make sure to clear the timeout
  useEffect(() => {
    console.log(stateLock);
    if (!stateLock) clearTimeout(timeoutId);
  }, [stateLock]);

  useEffect(() => {
    if (previousState && !pressureReliefMode) {
      // lock the state so when done with pressure releif and wheelchair is
      // still tilted is does not immeditely go back into pressure relief routine mode
      setStateLock(true);

      clearTimeout(timeoutId);
      const id = setTimeout(() => {
        setStateLock(false);
      }, (appSettings.reliefDurationSeconds + TIMEOUT_SEC) * 1000);

      setTimeoutId(id);
    }
  }, [pressureReliefMode]);

  const checkForPressureRelief = (): boolean => {
    const bufferFilled = Object.values(dataBuffer).every(
      (sensorData) => sensorData.length === 5
    );

    // Do nothing if buffer is not filled
    if (!bufferFilled) return false;

    // check if all the values in the sensor buffers are above the set threshold
    return Object.entries(dataBuffer).every(([sensor, values]) =>
      values.every(
        (value: number) => value > thresholds[sensor as keyof typeof thresholds]
      )
    );
  };

  const setPressureReliefState = (value: boolean) => {
    const prevState = pressureReliefMode;
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
