import commandSchema from "../jsons/schemas/schema1.json";
import commandInstance from "../jsons/instances/instance1.json";
import errorValidator from "../coreFunctions/core.js";

errorValidator(commandInstance, commandSchema);