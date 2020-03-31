import playgroundSchema from "../jsons/schemas/schema2.json";
import playgroundInstance from "../jsons/instances/instance2.json";
import errorValidator from "../coreFunctions/core.js";

errorValidator(playgroundInstance, playgroundSchema);