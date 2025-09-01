import { useCallback, useEffect, useRef } from "react";

export const useStorePersistedState = () => {
  const db = useRef<Promise<IDBDatabase>>();

  useEffect(() => {
    db.current = new Promise<IDBDatabase>((resolve, reject) => {
      const request = window.indexedDB.open("ImageResizer");
      request.onerror = () => {
        console.error("Why didn't you allow my web app to use IndexedDB?!");
      };
      request.onsuccess = (event: Event) => {
        if (!event.target || !("result" in event.target)) {
          reject();
          return;
        }
        resolve(event.target.result as IDBDatabase);
      };

      request.onupgradeneeded = (event) => {
        if (!event.target || !("result" in event.target)) {
          reject();
          return;
        }
        const db = event.target.result as IDBDatabase;
        db.createObjectStore("files", { autoIncrement: true });
        resolve(db);
      };
    });
  }, []);

  const addFile = useCallback((file: File, key: string) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      if (!db.current) {
        console.error("Db is not defined");
        return;
      }
      const dbInstance = await db.current;
      const transaction = dbInstance.transaction(["files"], "readwrite");
      const objectStore = transaction.objectStore("files");
      const request = objectStore.add(reader.result, key);

      request.onsuccess = () => {
        console.log("File saved successfully.");
      };

      request.onerror = createOnErrorHandler();
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const getAllFiles = useCallback(async (): Promise<{ key: IDBValidKey; value: unknown }[]> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!db.current) {
        console.error("Db is not defined");
        return;
      }
      const dbInstance = await db.current;
      const transaction = dbInstance.transaction(["files"], "readonly");
      const objectStore = transaction.objectStore("files");
      const request = objectStore.openCursor();

      const result: { key: IDBValidKey; value: unknown }[] = [];

      request.onsuccess = (event) => {
        if (!event.target || !("result" in event.target)) {
          reject("target is empty");
          return;
        }

        const cursor = event.target.result as IDBCursorWithValue;
        if (cursor) {
          const key = cursor.primaryKey;
          const value = cursor.value;

          result.push({ key, value });

          cursor.continue();
        } else {
          resolve(result);
        }
      };

      request.onerror = createOnErrorHandler(reject);
    });
  }, []);

  const removeFile = useCallback(async (key: string): Promise<void> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!db.current) {
        console.error("Db is not defined");
        return;
      }
      const dbInstance = await db.current;
      const transaction = dbInstance.transaction(["files"], "readwrite");
      const objectStore = transaction.objectStore("files");
      const request = objectStore.delete(key);

      request.onsuccess = () => {
        console.log("File removed successfully.");
        resolve();
      };

      request.onerror = createOnErrorHandler(reject);
    });
  }, []);

  return {
    addFile,
    getAllFiles,
    removeFile,
  };
};

function createOnErrorHandler(callback?: () => void) {
  return (event: Event) => {
    const { target } = event;
    const error = target && "error" in target ? target.error : event;
    console.error("Error while retrieving file.", error);
    callback?.();
  };
}
