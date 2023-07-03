import { FAILED, IDLE, LOADING, PRIVATE, PUBLIC, SUCCEEDED } from '../../App.constants';

export type AccessScope = typeof PUBLIC | typeof PRIVATE
export type FormStatus = typeof IDLE | typeof LOADING | typeof SUCCEEDED | typeof FAILED