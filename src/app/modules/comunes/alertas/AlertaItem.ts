import { UserRoles } from 'src/app/constants';
import {
  AlertaEstadoIds,
  AlertaMotivosIds,
  AlertasElementId,
} from 'src/models/alertas/Alerta';
import { format } from 'timeago.js';

export enum AlertaItemCategory {
  Ckbs,
  Motivos,
}

export interface ManageNotificationEvent {
  path: string;
  args: any;
}

export class AlertaItem {
  keyName: string;
  id: number;
  value: number;
  hidden: boolean;
  seen: boolean;
  lastUpdated: Date;
  category: AlertaItemCategory;

  constructor(
    keyName: string,
    id: number,
    value: number,
    category: AlertaItemCategory
  ) {
    this.keyName = keyName;
    this.id = id;
    this.value = value;
    this.category = category;

    this.hidden = false;
    this.seen = false;
    this.lastUpdated = new Date();
  }

  get renderCasosStr(): string {
    let casosStr = '';
    if (this.category === AlertaItemCategory.Ckbs) {
      casosStr = this.value > 1 ? 'casos' : 'caso';
    } else {
      casosStr = this.value > 1 ? 'motivos' : 'motivo';
    }
    return `${this.value} ${casosStr} por gestionar`;
  }

  get renderSection(): string {
    const words = this.keyName.split('_');
    const capitalizedWords = words.map((word) =>
      word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    );
    return capitalizedWords.join(' ');
  }

  update(newValue: number): void {
    if (newValue === this.value) {
      return;
    }
    this.value = newValue;
    this.hidden = false;
    this.seen = false;
    this.lastUpdated = new Date();
  }

  get updatedAt(): string {
    return format(this.lastUpdated, 'es');
  }

  marAsSeen() {
    this.seen = true;
  }

  manageEventOutput(rol: UserRoles): ManageNotificationEvent {
    let path: string = '';
    let args: any = undefined;
    if (this.category === AlertaItemCategory.Ckbs) {
      args = { estados: AlertaEstadoIds[this.id] };
      // caso particular: el servicio entrega motivos no encontrado
      // como alerta de tipo estado. Si el usuario es analista
      // aca deberia llevarlo a la vista de gestion de motivos
      if (
        this.id === AlertasElementId.MotivosNoEncontrados &&
        rol === UserRoles.Analista
      ) {
        path = 'mcf-bts-contra-cargo/motivos';
      } else {
        path = 'mcf-bts-contra-cargo/contracargos';
      }
    } else {
      let baseUrl = 'mcf-bts-contra-cargo/motivos';
      path = baseUrl + (rol === UserRoles.Admin ? '-admin' : '');
      args = { estados: AlertaMotivosIds[this.id] };
    }
    return { path, args };
  }
}
