import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnInit,
  Output
} from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { UserRoles } from 'src/app/constants';
import {
  AlertaKeyIdMap,
  AlertasEstados,
  AlertasMotivos,
  getDefaultAlertasEstados,
  getDefaultAlertasMotivos,
} from 'src/models/alertas/Alerta';
import { ParamsGetAlertas } from 'src/models/alertas/GetAlertas';
import { AlertasService } from '../services/alertas.service';
import {
  AlertaItem,
  AlertaItemCategory,
  ManageNotificationEvent,
} from './AlertaItem';

const DEFAULT_DURATION = 300;
const DEFAULT_NOTIFICATION_POLLING_MS = 600000;

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css'],
  animations: [
    trigger('collapse', [
      state('void', style({ opacity: AUTO_STYLE, height: AUTO_STYLE })),
      transition(
        ':enter',
        animate(
          DEFAULT_DURATION + 'ms ease-in',
          style({ opacity: AUTO_STYLE, height: AUTO_STYLE })
        )
      ),
      transition(':leave', [
        animate(
          DEFAULT_DURATION + 'ms ease-out',
          style({ opacity: '0', height: '0' })
        ),
      ]),
    ]),
  ],
})
export class AlertasComponent implements OnInit {
  private notificationSubscription: Subscription | undefined;
  constructor(private alertasService: AlertasService, private ngZone: NgZone) {
    this.startNotificationTimer();
  }

  private startNotificationTimer(): void {
    this.ngZone.runOutsideAngular(() => {
      this.notificationSubscription = interval(
        DEFAULT_NOTIFICATION_POLLING_MS
      ).subscribe(() => {
        this.ngZone.run(() => {
          this.updateNotificationList();
        });
      });
    });
  }

  private stopNotificationTimer(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  resetTimer(): void {
    this.stopNotificationTimer();
    this.startNotificationTimer();
  }

  @Input() currentRole!: UserRoles;
  @Output() notificationClicked: EventEmitter<ManageNotificationEvent> =
    new EventEmitter();

  readonly placeholderNotifications = [
    new AlertaItem('a', 0, 0, 0),
    new AlertaItem('b', 1, 0, 0),
    new AlertaItem('c', 2, 0, 0),
    new AlertaItem('d', 3, 0, 0),
  ];

  userRole = UserRoles.Ejecutivo;
  hasUnreadNotifications: boolean = false;
  showNotifications: boolean = false;
  loadingNotifications: boolean = false;
  paramsGetAlertas: ParamsGetAlertas = {};
  justKilledAMan: boolean = false;

  async ngOnInit(): Promise<void> {
    this.userRole = this.currentRole;
    this.cbkNotificationsState = [];
    this.updateNotificationList();
  }

  private cbkNotificationsState: Array<AlertaItem> = [];

  get visibleCbkNotifications() {
    return this.cbkNotificationsState.filter(
      (ele) => !ele.hidden && ele.value > 0
    );
  }

  get unseenCbkNotifications() {
    return this.visibleCbkNotifications.filter((ele) => !ele.seen);
  }

  private _alertasEstados: AlertasEstados = getDefaultAlertasEstados();
  private _alertasMotivos: AlertasMotivos = getDefaultAlertasMotivos();

  private updateEstadoAlertas() {
    let cbkAlertas: Array<AlertaItem> = Object.keys(this._alertasEstados).map(
      (k) => {
        let val = this._alertasEstados[k as keyof typeof this._alertasEstados];
        return new AlertaItem(
          k,
          AlertaKeyIdMap[k],
          val,
          AlertaItemCategory.Ckbs
        );
      }
    );
    let motivAlertas = Object.keys(this._alertasMotivos).map((k) => {
      let val = this._alertasMotivos[k as keyof typeof this._alertasMotivos];
      return new AlertaItem(
        k,
        AlertaKeyIdMap[k],
        val,
        AlertaItemCategory.Motivos
      );
    });
    if (this.cbkNotificationsState.length === 0) {
      this.cbkNotificationsState = [...cbkAlertas, ...motivAlertas];
    } else {
      for (const newEle  of cbkAlertas) {
        const idx = this.cbkNotificationsState.findIndex(
          (ele) => ele.id === newEle.id
        );
        if (idx < 0) continue;
        this.cbkNotificationsState[idx].update(newEle.value);
      }
      for (const newEle  of motivAlertas) {
        const idx = this.cbkNotificationsState.findIndex(
          (ele) => ele.id === newEle.id
        );
        if (idx < 0) continue;
        this.cbkNotificationsState[idx].update(newEle.value);
      }
    }
  }

  get noPendingActions(): boolean {
    return false;
  }

  get notificationBellTitle(): string {
    if (!this.hasVisibleItems){
      return  'Sin tareas pendientes'
    }
    let nuevas = ''
    if (this.hasUnreadItems){
      nuevas = 'nuevas '
    }
    return `Hay ${nuevas}tareas por atender`
  }

  get hasVisibleItems() {
    return this.visibleCbkNotifications.length > 0;
  }
  get hasUnreadItems() {
    return this.unseenCbkNotifications.length > 0;
  }

  async updateNotificationList() {
    this.loadingNotifications = true;

    if (this.userRole === UserRoles.Admin) {
      let resp = await this.alertasService.getAlertasAdmin(
        this.paramsGetAlertas
      );
      this._alertasEstados = resp.alertas_estados;
      this._alertasMotivos = resp.alertas_motivos;
    } else {
      let resp = await this.alertasService.getAlertasAnalista(
        this.paramsGetAlertas
      );
      this._alertasEstados = resp.alertas_estados;
    }
    this.updateEstadoAlertas();
    this.loadingNotifications = false;
  }

  toggleNotificationsModal() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.resetTimer();
      this.updateNotificationList();
    }
  }

  trackByFn(index: number, item: AlertaItem) {
    return item.id;
  }

  hideNotificationElement(event: { id: number }) {
    let idx = this.cbkNotificationsState.findIndex(
      (ele) => ele.id === event.id
    );
    if (idx < 0) return;
    this.cbkNotificationsState[idx].hidden = true;
    if (!this.hasVisibleItems) {
      // MAMAAAAAAA uuuuuuuuuuuuuuuu
      this.justKilledAMan = true;
      setTimeout(() => {
        this.justKilledAMan = false;
      }, 100);
    }
  }

  manageNotificationElement(event: { id: number }) {
    let item = this.cbkNotificationsState.find((ele) => ele.id === event.id);
    if (!item) {
      return;
    }
    this.notificationClicked.emit(item.manageEventOutput(this.userRole));
  }

  markAllAsRead() {
    for (const element of this.cbkNotificationsState) {
      element.seen = true;
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.showNotifications) return;

    const clickedElement = event.target as HTMLElement;
    if (!clickedElement) return;

    const isClickedOnNotificationsElement = clickedElement.classList.contains(
      'notifications-button'
    );
    const isClickedInsideContainer = this.isDescendantOf(
      clickedElement,
      'modal-notificaciones'
    );
    if (!isClickedInsideContainer && !isClickedOnNotificationsElement) {
      if (!this.justKilledAMan) {
        // didnt mean to make you cry
        this.showNotifications = false;
      }
    }
    return true;
  }

  isDescendantOf(element: HTMLElement | null, className: string): boolean {
    while (element) {
      if (element.classList.contains(className)) {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }
}
