import { Component, OnDestroy } from '@angular/core';
import { LiveblocksService } from '../../Services/liveblocks.service';
import { getShapeInfo } from '../../../lib/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
})
export class LeftSidebarComponent implements OnDestroy {
  allShapes: Array<any> = [];
  private subscription!: Subscription;

  constructor(private liveBlocksService: LiveblocksService) {
    this.subscription = this.liveBlocksService.canvasObjects$.subscribe(
      (data) => {
        this.allShapes = Array.from(data ?? []);
      }
    );
  }

  getShapeInfo(type: string) {
    return getShapeInfo(type);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
