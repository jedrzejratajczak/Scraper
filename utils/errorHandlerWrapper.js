import addLog from "./addLog.js";

const errorHandlerWrapper =
  (fn, callback) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      callback();
      addLog("Error\n" + error);
    }
  };

export default errorHandlerWrapper;
