const concurrently = require("concurrently");

const { result } = concurrently(
  [
    {
      command: "npm run dev:vite",
      name: "renderer",
      prefixColor: "green",
    },
    {
      command: "npm run dev:main",
      name: "main",
      prefixColor: "blue",
    },
  ],
  {
    killOthers: ["failure", "success"],
  }
);

result.then(
  () => {
    console.log("All processes exit!!!");
  },
  () => {
    console.log("All processes exit!!!");
  }
);
