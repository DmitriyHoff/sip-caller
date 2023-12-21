import { mdiCoffee, mdiPhoneOutgoing, mdiPhoneIncoming, mdiPen } from '@mdi/js'

class UserStatusGroup {
    static _status = {
        Online: [1],
        Work: [-1, -2, -3, -4],
        LunchBreak: [2, 3],
        Offline: [null, 0]
    }
    static isOnline(statusId) {
        return this._status.Online.includes(statusId)
    }
    static isWork(statusId) {
        return this._status.Work.includes(statusId)
    }
    static isLanchBreak(statusId) {
        return this._status.LunchBreak.includes(statusId)
    }
    static isOffline(statusId) {
        return this._status.Offline.includes(statusId)
    }
    static getStatusCaption(statusGroupId) {
        switch (this.getStatusGroup(statusGroupId)) {
            case 1:
                return 'Присутствуют'
            case 2:
                return 'Заняты'
            case 3:
                return 'На обеде/перерыв'
            case 4:
                return 'Отсутствуют'
        }
    }
    static getStatusGroup(statusId) {
        if (UserStatusGroup.isOnline(statusId)) return 1
        if (UserStatusGroup.isWork(statusId)) return 2
        if (UserStatusGroup.isLanchBreak(statusId)) return 3
        if (UserStatusGroup.isOffline(statusId)) return 4
    }
    static getStatusIcon(statusId) {
        switch (this.getStatusGroup(statusId)) {
            case 1:
            case -1:
            case -2:
            case -3:
            case -4:
            case 2:
            case 3:
            case 0:
            case null:
        }
    }
}

export { UserStatusGroup }
