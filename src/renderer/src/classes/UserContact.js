import { SipUser } from './SipUser'
import { UserStatusGroup } from './UserStatusGroup'
// eslint-disable-next-line no-unused-vars
import { SocketMessage } from './SocketMessage'

export class UserContact extends SipUser {
    /** Идентификатор группы статусов */
    status_group_id

    /** Идентификатор рабочего места */
    wp

    /** Строковое обозначение рабочего места */
    wp_name

    /** IP-адрес */
    ip

    constructor(data) {
        super(data)
        this.status_group_id = UserStatusGroup.getStatusGroup(data.status_id)
    }

    /**
     * Обновить контакт из сообщения WS
     * @param {SocketMessage} socketMessage Данные из WS-сообщения
     */
    update(socketMessage) {
        this.setStatus(socketMessage.id_status)
        this.status_dttmcr = socketMessage.dttmcr
        this.wp = socketMessage.wp
        this.wp_name = socketMessage.wp_name
        this.ip = socketMessage.ip
    }

    /** Устанавливает статус и идентификатор группы статуса */
    setStatus(statusId) {
        // console.log(`${this.last_name} ${this.first_name} | ${this.status_id} --> ${statusId}`)
        this.status_id = statusId
        this.status_group_id = UserStatusGroup.getStatusGroup(statusId)
    }
}