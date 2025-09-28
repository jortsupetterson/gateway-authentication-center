import { handleDefault } from '../handlers/default/handler.js';
import { handleInitialization } from '../handlers/initialization/handler.js';
export default {
	default: handleDefault,
	initialization: handleInitialization,
};
