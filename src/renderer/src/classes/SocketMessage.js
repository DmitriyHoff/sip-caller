/* eslint-disable prettier/prettier */
export class SocketMessage {
    /** Время создания */
    dt
    /** Время создания записи в БД */
    dttmcr
    /** ФИО */
    fio
    /** Идентификатор группы */
    id_group
    /** Идентификатор отдела */
    id_ref_subdiv
    /** Идентификатор статуса */
    id_status
    /** Идентификатор пользователя */
    id_user
    /** Обозначение статуса */
    image_status
    /** IP-адрес */
    ip
    /** Строковое представление статуса */
    status
    /** Телефон пользователя */
    user_phone
    /** Идентификатор рабочего места */
    wp
    /** Строковое обозначение рабочего места */
    wp_name

    constructor(data) {
        ({
            dt: this.dt,
            dttmcr: this.dttmcr,
            fio: this.fio,
            id_group: this.id_group,
            id_ref_subdiv: this.id_ref_subdiv,
            id_status: this.id_status,
            id_user: this.id_user,
            image_status: this.image_status,
            ip: this.ip,
            status: this.status,
            user_phone: this.user_phone,
            wp: this.wp,
            wp_name: this.wp_name
        } = data)
    }
}
