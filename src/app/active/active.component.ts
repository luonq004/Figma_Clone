import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseUserMeta, Room, User } from '@liveblocks/client';
import { Presence } from '../../types/type';
import { LiveblocksService } from '../Services/liveblocks.service';
import { AvatarComponent } from '../components/shared/avatar/avatar.component';
import { generateRandomName } from '../../lib/utils';

@Component({
  selector: 'app-active',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './active.component.html',
  styleUrl: './active.component.css',
})
export class ActiveComponent implements OnInit, OnDestroy {
  private room: Room | null = null;
  displayUser: readonly User<Presence, BaseUserMeta>[] | null = null;
  others: readonly User<Presence, BaseUserMeta>[] | null = null;
  currentUser: User<Presence, BaseUserMeta> | null = null;
  genRandomName = generateRandomName();
  nameMap: { [id: number]: string } = {};
  private unsubscribeOthers?: () => void;

  constructor(private liveblocksService: LiveblocksService) {}

  ngOnInit() {
    this.room = this.liveblocksService.enterRoomOnce();

    if (this.room) {
      this.unsubscribeOthers = this.room.subscribe('others', (others) => {
        this.displayUser = others
          .filter(
            (user) => user?.connectionId !== this.room?.getSelf()?.connectionId
          )
          .slice(0, 3)
          .map((user) => {
            if (user.connectionId && !this.nameMap[user.connectionId]) {
              this.nameMap[user.connectionId] = generateRandomName();
            }
            return user;
          });

        this.others = others;
        this.currentUser = this.room?.getSelf() ?? null;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribeOthers?.(); // dọn dẹp
  }
}
