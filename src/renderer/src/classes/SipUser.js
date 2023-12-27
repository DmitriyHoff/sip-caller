/* eslint-disable prettier/prettier */
export class SipUser {
    /** Идентификатор пользователя */
    id_user
    /** Фамилия */
    last_name
    /** Имя */
    first_name
    /** Отчество */
    middle_name
    /** Номер телефона */
    phone_number
    /** email */
    email
    /** Идентификатор отдела */
    id_ref_catalog_subdivision
    /** Идентификатор категории */
    id_ref_catalog_category
    /** Идентификатор должности */
    id_ref_catalog_position
    /** Идентификатор статуса */
    status_id
    /** Время установки статуса */
    status_dttmcr
    /** Наименование отдела */
    subdivision
    /** Наименование должности */
    position

    constructor(data) {
        ({
            id_user: this.id_user,
            last_name: this.last_name,
            first_name: this.first_name,
            middle_name: this.middle_name,
            phone_number: this.phone_number,
            email: this.email,
            id_ref_catalog_subdivision: this.id_ref_catalog_subdivision,
            id_ref_catalog_category: this.id_ref_catalog_category,
            id_ref_catalog_position: this.id_ref_catalog_position,
            status_id: this.status_id,
            status_dttmcr: this.status_dttmcr,
            subdivision: this.subdivision,
            position: this.position
        } = data)
    }

    get fullName() {
        return this.last_name + ' ' + this.first_name
    }
}
