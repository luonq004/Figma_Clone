import { Injectable } from '@angular/core';
import { createClient, Room } from '@liveblocks/client';
import { environment } from '../../environments/environment';

type Cursor = {
  cursor: { x: number; y: number };
};

@Injectable()
export class LiveblocksService {
  private room: Room | null = null;
  cursor: Cursor | null = null;

  constructor() {
    const client = createClient({
      publicApiKey: environment.LIVEBLOCKS_PUBLIC_KEY,
    });

    const { room } = client.enterRoom('my-room');
    this.room = room;
  }

  getRoom(): Room | null {
    return this.room;
  }
}
