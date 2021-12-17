/** ts global types */
import { Opaque } from 'type-fest';
declare global {
  type UnixTimestamp = Opaque<number, 'UnixTimestamp'>;
}
