// import { Injectable, NgZone } from '@angular/core';
// import { createClient, LiveMap, Room } from '@liveblocks/client';
// import { BehaviorSubject } from 'rxjs';
// import { environment } from '../../environments/environment';

// type Cursor = {
//   cursor: { x: number; y: number };
// };

// @Injectable({
//   providedIn: 'root',
// })
// export class LiveblocksService {
//   private room: Room | null = null;
//   cursor: Cursor | null = null;
//   canvasObjects$ = new BehaviorSubject<LiveMap<string, any> | null>(null);

//   constructor(private ngZone: NgZone) {
//     const client = createClient({
//       publicApiKey: environment.LIVEBLOCKS_PUBLIC_KEY,
//     });

//     const { room } = client.enterRoom('my-room', {
//       initialStorage: () => ({
//         canvasObjects: new LiveMap<string, any>(),
//       }),
//       initialPresence: { cursor: null, cusorColor: null, editingText: null },
//     });
//     this.room = room;

//     // Load storage nếu cần
//     room.getStorage().then((storage) => {
//       const canvasObjects = storage.root.get('canvasObjects') as LiveMap<
//         string,
//         any
//       >;
//       this.canvasObjects$.next(canvasObjects);

//       room.subscribe(
//         canvasObjects,
//         (updates) => {
//           // Đảm bảo thay đổi đẩy vào Angular Zone để detect update UI
//           this.ngZone.run(() => {
//             this.canvasObjects$.next(canvasObjects);
//           });
//         },
//         {
//           isDeep: true,
//         }
//       );
//     });
//   }

//   getRoom(): Room | null {
//     return this.room;
//   }

//   handleRedo(): void {
//     this.room?.history.redo();
//   }

//   handleUndo(): void {
//     this.room?.history.undo();
//   }
// }

import { Injectable, NgZone } from '@angular/core';
import { createClient, LiveMap, Room } from '@liveblocks/client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

type Cursor = {
  cursor: { x: number; y: number };
};

function generateRandomName(): string {
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  return names[Math.floor(Math.random() * names.length)];
}

@Injectable({
  providedIn: 'root',
})
export class LiveblocksService {
  private client = createClient({
    publicApiKey: environment.LIVEBLOCKS_PUBLIC_KEY,
  });

  private room: Room | null = null;
  cursor: Cursor | null = null;
  canvasObjects$ = new BehaviorSubject<LiveMap<string, any> | null>(null);

  constructor(private ngZone: NgZone) {}

  enterRoomOnce(): Room {
    if (this.room) return this.room;

    const { room } = this.client.enterRoom('my-room', {
      initialStorage: () => ({
        canvasObjects: new LiveMap<string, any>(),
      }),
      initialPresence: {
        cursor: null,
        cusorColor: null,
        editingText: null,
        name: generateRandomName(),
      },
    });

    this.room = room;

    room.getStorage().then((storage) => {
      const canvasObjects = storage.root.get('canvasObjects') as LiveMap<
        string,
        any
      >;
      this.canvasObjects$.next(canvasObjects);

      room.subscribe(
        canvasObjects,
        () => {
          this.ngZone.run(() => {
            this.canvasObjects$.next(canvasObjects);
          });
        },
        { isDeep: true }
      );
    });

    return room;
  }

  getRoom(): Room | null {
    return this.room;
  }

  handleRedo(): void {
    this.room?.history.redo();
  }

  handleUndo(): void {
    this.room?.history.undo();
  }
}
