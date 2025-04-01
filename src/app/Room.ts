import { createClient } from '@liveblocks/client';
import { environment } from '../environments/environment';

const client = createClient({
  publicApiKey: environment.LIVEBLOCKS_PUBLIC_KEY,
});
