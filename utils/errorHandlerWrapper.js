import addLog from "./addLog.js";

const errorHandlerWrapper =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      addLog("Error\n" + error);
    }
  };

export default errorHandlerWrapper;
