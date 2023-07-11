import { FAILED, IDLE, LOADING, MODE_ACTIVE, MODE_SIMPLE, PRIVATE, PUBLIC, SUCCEEDED } from '../../App.constants';

export type DISPLAY_MODE = typeof MODE_SIMPLE | typeof MODE_ACTIVE
export type AccessScope = typeof PUBLIC | typeof PRIVATE
export type FormStatus = typeof IDLE | typeof LOADING | typeof SUCCEEDED | typeof FAILED