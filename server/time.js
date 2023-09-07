function logQueryExecutionTime(queryName, startTime) {
  const endTime = Date.now();
  const executionTime = endTime - startTime;
  console.log(`Query '${queryName}' took ${executionTime} ms to execute`);
}

module.exports = {
  logQueryExecutionTime,
};