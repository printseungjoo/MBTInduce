import "dotenv/config";
import { app } from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`MBTInduce backend listening on port ${PORT}`);
});


