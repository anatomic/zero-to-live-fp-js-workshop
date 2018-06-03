// logEnv :: () -> ()
const logEnv = () => console.log("process.env.MY_ENV = %s", process.env.MY_ENV);

const interval = setInterval(logEnv, 2000);