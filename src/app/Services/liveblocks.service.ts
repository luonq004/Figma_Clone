import { Injectable } from '@angular/core';
import { createClient, Room } from '@liveblocks/client';
import { environment } from '../../environments/environment';

@Injectable()
export class LiveblocksService {
  private room: Room | null = null;

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
