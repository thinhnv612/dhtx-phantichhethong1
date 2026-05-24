import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class OrdersSseService {
  private subject = new Subject<any>();

  get event$() {
    return this.subject.asObservable();
  }

  emit(order: any) {
    this.subject.next(order);
  }
}
