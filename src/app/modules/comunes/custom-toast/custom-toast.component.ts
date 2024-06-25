import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-toast',
  templateUrl: './custom-toast.component.html',
  styleUrls: ['./custom-toast.component.css'],
})
export class CustomToastComponent implements OnDestroy, OnInit {
  @Input() success = true;
  @Input() resultMessage = '';
  @Output() toastFinished = new EventEmitter();

  readonly defaultTimeout = 5000;

  showModal = false;
  modalTimeoutsIds: any[] = [];

  ngOnInit(): void {
    this.showModal = true;
    this.modalTimeoutsIds.push(
      setTimeout(() => {
        this.showModal = false;
        this.resultMessage = '';
        this.toastFinished.emit();
      }, this.defaultTimeout)
    );
  }
  ngOnDestroy(): void {
    this.modalTimeoutsIds.forEach((id) => clearTimeout(id));
  }

  closeModal() {
    this.showModal = false;
  }
}
