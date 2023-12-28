import {
    mdiHeadset,
    mdiPhoneOutgoing,
    mdiPhoneIncoming,
    mdiPen,
    mdiFood,
    mdiClockOutline,
    mdiHeadsetOff
} from '@mdi/js'

class UserStatusGroup {
    /** Статусы пользователей */
    static Status = {
        Online: 1,
        IncomingCall: -1,
        OutgoingCall: -2,
        PostCallWorkOutgoing: -4,
        PostCallWorkIncoming: -3,
        Lunch: 2,
        Break: 3,
        Offline: 0
    }

    /** Группы статусов */
    static StatusGroup = {
        Online: 1,
        Work: 2,
        LunchBreak: 3,
        Offline: 4
    }

    static StatusGroupValues = {
        Online: [this.Status.Online],
        Work: [
            this.Status.IncomingCall,
            this.Status.OutgoingCall,
            this.Status.PostCallWorkIncoming,
            this.Status.PostCallWorkOutgoing
        ],
        LunchBreak: [this.Status.Lunch, this.Status.Break],
        Offline: [null, this.Status.Offline]
    }

    static isOnline(statusId) {
        return this.StatusGroupValues.Online.includes(statusId)
    }

    static isWork(statusId) {
        return this.StatusGroupValues.Work.includes(statusId)
    }

    static isLanchBreak(statusId) {
        return this.StatusGroupValues.LunchBreak.includes(statusId)
    }

    static isOffline(statusId) {
        return this.StatusGroupValues.Offline.includes(statusId)
    }

    static getStatusGroupTitle(statusGroupId) {
        switch (this.getStatusGroup(statusGroupId)) {
            case this.StatusGroup.Online:
                return 'Присутствуют'
            case this.StatusGroup.Work:
                return 'Заняты'
            case this.StatusGroup.LunchBreak:
                return 'На обеде/перерыв'
            case this.StatusGroup.Offline:
                return 'Отсутствуют'
        }
    }

    static getStatusGroup(statusId) {
        if (UserStatusGroup.isOnline(statusId)) return this.StatusGroup.Online
        if (UserStatusGroup.isWork(statusId)) return this.StatusGroup.Work
        if (UserStatusGroup.isLanchBreak(statusId)) return this.StatusGroup.LunchBreak
        if (UserStatusGroup.isOffline(statusId)) return this.StatusGroup.Offline
    }

    static getStatusIcon(statusId) {
        switch (statusId) {
            case this.Status.Online:
                return mdiHeadset
            case this.Status.IncomingCall:
                return mdiPhoneIncoming
            case this.Status.OutgoingCall:
                return mdiPhoneOutgoing
            case this.Status.PostCallWorkIncoming:
                return mdiPen
            case this.Status.PostCallWorkOutgoing:
                return mdiPen
            case this.Status.Lunch:
                return mdiFood
            case this.Status.Break:
                return mdiClockOutline
            case this.Status.Offline:
            case null:
                return mdiHeadsetOff
            default:
                return 'undefined'
        }
    }

    static getStatusDescription(statusId) {
        switch (statusId) {
            case this.Status.Online:
                return 'На месте'
            case this.Status.IncomingCall:
                return 'Входящий звонок'
            case this.Status.OutgoingCall:
                return 'Исходящий звонок'
            case this.Status.PostCallWorkIncoming:
                return 'Обработка. Входящий'
            case this.Status.PostCallWorkOutgoing:
                return 'Обработка. Исходящий'
            case this.Status.Lunch:
                return 'Обед'
            case this.Status.Break:
                return 'Перерыв'
            case this.Status.Offline:
            case null:
                return 'Отсутствует'
            default:
                return null
        }
    }
}

export { UserStatusGroup }
