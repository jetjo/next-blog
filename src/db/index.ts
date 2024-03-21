import { createCollectionEndpoint } from "@/utils/mongoose";

const createEndpoint = createCollectionEndpoint.bind(
  null,
  "mongodb://localhost:27017",
  { dbName: "test" }
);

export default createEndpoint;
