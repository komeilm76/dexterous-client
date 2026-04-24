import { Subject } from "rxjs";

export const appStatus = new Subject<{ disabled: boolean }>();
