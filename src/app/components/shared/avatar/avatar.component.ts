import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MATERIAL_STANDALONE_MODULES } from '../material-standalone';

@Component({
  selector: 'avatar',
  standalone: true,
  imports: [CommonModule, MATERIAL_STANDALONE_MODULES],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
})
export class AvatarComponent implements OnInit {
  @Input() otherStyles?: string;
  @Input() name?: string;

  avatarUrl = '';

  ngOnInit() {
    const rand = Math.floor(Math.random() * 30);
    this.avatarUrl = `https://liveblocks.io/avatars/avatar-${rand}.png`;
  }

  IMAGE_SIZE = 48;
}
