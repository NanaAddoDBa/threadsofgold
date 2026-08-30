export {
  applicationEnvironmentSchema,
  hostSchema,
  isDeployedEnvironment,
  isLocalOrUnspecifiedOrigin,
  portSchema,
  webOriginSchema,
  type ApplicationEnvironment,
} from "./common.js";
export {
  EnvironmentValidationError,
  parseEnvironment,
} from "./parse-environment.js";
