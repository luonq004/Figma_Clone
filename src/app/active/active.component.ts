import { Component, OnInit } from '@angular/core';
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
export class ActiveComponent implements OnInit {
  private room: Room | null = null;
  displayUser: readonly User<Presence, BaseUserMeta>[] | null = null;
  others: readonly User<Presence, BaseUserMeta>[] | null = null;
  currentUser: User<Presence, BaseUserMeta> | null = null;
  genRandomName = generateRandomName();

  constructor(private liveblocksService: LiveblocksService) {}

  ngOnInit() {
    this.room = this.liveblocksService.getRoom();

    if (this.room) {
      this.room.subscribe('others', (others) => {
        this.displayUser = others.slice(0, 3).map((user) => user);

        this.others = others;

        this.currentUser = this.room?.getSelf() ?? null;
      });
    }
  }
}
