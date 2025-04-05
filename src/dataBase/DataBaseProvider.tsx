import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SQLite from "react-native-sqlite-storage";

interface DatabaseContextType {
  storeAngleData: (
    backAngle: number,
    seatAngle: number,
    legAngle: number
  ) => void;
  storeStateChangeData: (isPressureReliefState: boolean) => void;
  storePressureReliefTime: () => void;
  getAngles: () => void;
  deleteAngles: () => void;
  dbStateTableStoreSignal: number;
  dataBase: SQLite.SQLiteDatabase;
}

interface DatabaseProviderProps {
  children?: React.ReactNode | undefined;
}

// Open the SQLite database
const db = SQLite.openDatabase(
  { name: "AppDatabase.db", location: "default" },
  () => console.log("Database opened"),
  (error) => console.error("Database error:", error)
);

const DatabaseContext = createContext<DatabaseContextType>({
  storeAngleData: (): void => {
    throw new Error("Function not implemented.");
  },
  storeStateChangeData: (): void => {
    throw new Error("Function not implemented.");
  },
  storePressureReliefTime: (): void => {
    throw new Error("Function not implemented.");
  },
  getAngles: (): void => {
    throw new Error("Function not implemented.");
  },
  deleteAngles: (): void => {
    throw new Error("Function not implemented.");
  },
  dbStateTableStoreSignal: 0,
  dataBase: db,
});

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
  //number of days after data should be dropped from tables
  const CUTOFF_DAYS = 7;

  const [dbStateTableStoreSignal, setDbStateTableStoreSignal] = useState(0);

  useEffect(() => {
    createTables();
  }, []);

  // Create the angle data table if it doesn't exist
  const setupAngleDataDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS AngleData (
          Id INTEGER PRIMARY KEY AUTOINCREMENT, 
          BackSeatAngle INTEGER, 
          SeatAngle INTEGER, 
          LegSeatAngle INTEGER,
          LegAngle INTEGER,
          BackAngle INTEGER,
          Timestamp TEXT
        )`,
        [],
        () => console.log("AngleData table created"),
        (error) => console.error("Table creation error:", error)
      );
    });
  };

  const setupStateChangeDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS StateChange (
          Id INTEGER PRIMARY KEY AUTOINCREMENT, 
          IsPressureReliefState INTEGER, 
          Timestamp TEXT
        )`,
        [],
        () => console.log("StateChange table created"),
        (error) => console.error("Table creation error:", error)
      );
    });
  };

  //table to store when pressure reliefs should happen
  const setupPressureReliefTimesDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS PressureReliefTimes (
          Id INTEGER PRIMARY KEY AUTOINCREMENT,  
          PressureReliefTime TEXT
        )`,
        [],
        () => console.log("PressureReliefTimes table created"),
        (error) => console.error("Table creation error:", error)
      );
    });
  };

  const createTables = () => {
    setupAngleDataDatabase();
    setupStateChangeDatabase();
    setupPressureReliefTimesDatabase();
  };

  // Function to insert angle data into SQLite database
  const storeAngleData = (
    backAngle: number,
    seatAngle: number,
    legAngle: number
  ) => {
    const timestamp = new Date().toISOString();
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO AngleData (BackAngle, SeatAngle, LegAngle, Timestamp) VALUES (?, ?, ?, ?)",
        [backAngle, seatAngle, legAngle, timestamp],
        () => {
          console.log("Data stored:", {
            backAngle,
            seatAngle,
            legAngle,
            timestamp,
          });
        },
        (error) => console.error("Data insertion error:", error)
      );
    });
    //drop any old angle records
    dropOldAngleData();
  };

  const storeStateChangeData = (isPressureReliefState: boolean) => {
    const timestamp = new Date().toISOString();
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO StateChange (IsPressureReliefState, Timestamp) VALUES (?, ?)",
        [isPressureReliefState ? 1 : 0, timestamp],
        () => {
          console.log("Data stored:", {
            isPressureReliefState,
            timestamp,
          });

          // modify this value to signal that a new record was inserted into the table
          setDbStateTableStoreSignal(dbStateTableStoreSignal + 1);
        },
        (error) => console.error("Data insertion error:", error)
      );
    });

    //drop any old state data
    dropOldStateData();
  };

  const storePressureReliefTime = () => {
    const timestamp = new Date().toISOString();
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO PressureReliefTimes (PressureReliefTime) VALUES (?)",
        [timestamp],
        () => {
          console.log("Data stored:", {
            timestamp,
          });
        },
        (error) => console.error("Data insertion error:", error)
      );
    });

    //drop any old data
    dropOldPressureReliefTimes();
  };

  // Cleanup function: Remove data older than 7 days
  const dropOldAngleData = () => {
    const cutoffDays = new Date();
    cutoffDays.setDate(cutoffDays.getDate() - CUTOFF_DAYS);
    const formattedDate = cutoffDays.toISOString();

    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM AngleData WHERE Timestamp < ?",
        [formattedDate],
        (_, result) =>
          console.log(`Deleted ${result.rowsAffected} old records`),
        (error) => console.error("Cleanup error:", error)
      );
    });
  };

  // Cleanup function: Remove data older than 7 days
  const dropOldStateData = () => {
    const cutoffDays = new Date();
    cutoffDays.setDate(cutoffDays.getDate() - CUTOFF_DAYS);
    const formattedDate = cutoffDays.toISOString();

    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM StateChange WHERE Timestamp < ?",
        [formattedDate],
        (_, result) =>
          console.log(`Deleted ${result.rowsAffected} old records`),
        (error) => console.error("Cleanup error:", error)
      );
    });
  };

  // Cleanup function: Remove data older than 7 days
  const dropOldPressureReliefTimes = () => {
    const cutoffDays = new Date();
    cutoffDays.setDate(cutoffDays.getDate() - CUTOFF_DAYS);
    const formattedDate = cutoffDays.toISOString();

    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM PressureReliefTimes WHERE PressureReliefTime < ?",
        [formattedDate],
        (_, result) =>
          console.log(`Deleted ${result.rowsAffected} old records`),
        (error) => console.error("Cleanup error:", error)
      );
    });
  };

  // Fetch stored angle data from SQLite database
  //   const fetchStoredData = () => {
  //     db.transaction((tx) => {
  //       tx.executeSql(
  //         "SELECT * FROM AngleData ORDER BY id DESC",
  //         [],
  //         (_, results) => {
  //           const rows = results.rows;
  //           let fetchedData: {
  //             angle_x: number;
  //             angle_y: number;
  //             angle_z: number;
  //             timestamp: string;
  //           }[] = [];
  //           for (let i = 0; i < rows.length; i++) {
  //             fetchedData.push(rows.item(i));
  //           }
  //           setData(fetchedData);
  //         },
  //         (error) => console.error("Data retrieval error:", error)
  //       );
  //     });
  //   };

  const getAngles = () => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM AngleData;", [], (tx, results) => {
        const rows = results.rows;
        const csvData = [];
        csvData.push("Id,SeatAngle,LegAngle,BackAngle,Timestamp");
        for (let i = 0; i < rows.length; i++) {
          const row = rows.item(i);
          console.log(row);
          csvData.push(
            `${row.Id},${row.SeatAngle},${row.LegAngle},${row.BackAngle},${row.Timestamp}`
          );
        }

        console.log(csvData);
      });
    });

    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM StateChange;", [], (tx, results) => {
        const rows = results.rows;
        const csvData = [];
        csvData.push("Id,IsPressureReliefState,Timestamp");
        for (let i = 0; i < rows.length; i++) {
          const row = rows.item(i);
          console.log(row);
          csvData.push(
            `${row.Id},${row.IsPressureReliefState},${row.Timestamp}`
          );
        }
        console.log(csvData);
      });
    });
  };

  const deleteAngles = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DROP TABLE IF EXISTS AngleData;",
        [],
        (_, result) => {
          console.log("Table dropped successfully.");
          alert("Table dropped successfully.");
        },
        (error) => {
          console.error("Error dropping table:", error);
        }
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "DROP TABLE IF EXISTS StateChange;",
        [],
        (_, result) => {
          console.log("Table dropped successfully.");
          alert("Table dropped successfully.");
        },
        (error) => {
          console.error("Error dropping table:", error);
        }
      );
    });

    setupAngleDataDatabase();
    setupStateChangeDatabase();
  };

  return (
    <DatabaseContext.Provider
      value={{
        storeAngleData,
        storeStateChangeData,
        storePressureReliefTime,
        getAngles,
        deleteAngles,
        dbStateTableStoreSignal,
        dataBase: db,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

// Hook to use Database Context
export const useDatabase = () => {
  return useContext(DatabaseContext);
};
