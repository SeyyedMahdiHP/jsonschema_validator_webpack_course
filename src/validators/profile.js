import profileSchema from "../jsons/schemas/schema3.json";
import profileInstance from "../jsons/instances/instance3.json";
import errorValidator from "../coreFunctions/core.js";

errorValidator(profileInstance, profileSchema);