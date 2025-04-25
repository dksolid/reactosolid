import { TypeGlobals } from 'models';
import { transformers } from 'compSystem/transformers';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StoreContext = transformers.createContext(undefined as unknown as TypeGlobals);
