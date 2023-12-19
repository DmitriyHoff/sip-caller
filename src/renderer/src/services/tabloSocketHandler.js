import moment from 'moment'

export default async (msg) => {
    try {
        const parseJSON = JSON.parse(msg.data)
        const { type } = parseJSON
        const { dt, data } = parseJSON
        const dataJSON = data || dt

        if (type.app === 'all') {
            if (type.module === 'case_change_status') {
                return
            }

            if (type.module === 'activity') {
                console.log('USERS_SET_LAST_ACTION', dataJSON)
            }
        }

        if (type.app === 'tablo') {
            const oKeys = Object.keys(dataJSON)

            if (oKeys.includes('image_status')) {
                console.log('USERS_SET_STATUS_CC', dataJSON)
            }

            if (type.module === 'current_call_v2') {
                const { id_user, tg_op, type_call } = dataJSON

                if (type_call === 'in') {
                    const { linkedid_end } = dataJSON

                    if (tg_op === 'insert') {
                        console.log('TABLO_CALLS_ADD', dataJSON)
                    }

                    if (tg_op === 'update') {
                        if (id_user) {
                            console.log('TABLO_CALL_ANSWER', dataJSON)
                        }

                        if (!id_user && linkedid_end) {
                            console.log('TABLO_CALL_ADD_MISSING', dataJSON)
                        }
                        console.log('TABLO_CALL_UPDATE', dataJSON)
                    }
                }

                if (type_call === 'out') {
                    if (this.USER_ID !== id_user) return
                    const currentCall = this.CC_GET_CURRENT_CALL
                    const { id_record, dttmcr } = dataJSON

                    if (tg_op === 'insert') {
                        // this.CC_SET_CURRENT_CALL_LOG({
                        //     msg: `Звонок найден #${id_record}`,
                        //     id_ref_catalog: 843,
                        //     date: moment(dttmcr).format('DD.MM.YYYY HH:mm:ss')
                        // })
                    }

                    if (tg_op === 'update') {
                        const {
                            answer_date,
                            linkedid_end // uuid,
                        } = dataJSON

                        // if (uuid) {
                        //     this.CC_SET_CURRENT_CALL_LOG({ msg: 'Звонок сохранен' });
                        //     return;
                        // }

                        if (answer_date && !linkedid_end) {
                            // this.CC_SET_CURRENT_CALL_LOG({
                            //     msg: `Произошел ответ на звонок: ${moment(answer_date).format(
                            //         'DD.MM.YYYY HH:mm:ss'
                            //     )}`,
                            //     id_ref_catalog: 842,
                            //     date: moment(answer_date).format('DD.MM.YYYY HH:mm:ss')
                            // })
                        }

                        if (answer_date && linkedid_end) {
                            // this.CC_SET_CURRENT_CALL_LOG({
                            //     msg: `Звонок окончен: ${moment(linkedid_end).format(
                            //         'DD.MM.YYYY HH:mm:ss'
                            //     )}`,
                            //     id_ref_catalog: 841,
                            //     date: moment(linkedid_end).format('DD.MM.YYYY HH:mm:ss')
                            // })
                        }

                        if (!answer_date && linkedid_end) {
                            // this.CC_SET_CURRENT_CALL_LOG({
                            //     msg: `Звонок окончен без ответа: ${moment(linkedid_end).format(
                            //         'DD.MM.YYYY HH:mm:ss'
                            //     )}`,
                            //     id_ref_catalog: 840,
                            //     date: moment(linkedid_end).format('DD.MM.YYYY HH:mm:ss')
                            // })
                        }
                    }
                    this.CC_SET_CURRENT_CALL({ ...currentCall, ...dataJSON })
                }

                if (id_user) {
                    console.log('USERS_SET_CC_SET_PHONE', dataJSON)
                }
            }
        }

        // if (type.app === 'case') {
        //     if (type.module === 'case_organization') {
        //         const { apiCaseGetOrganizer } = this.$serviceApi
        //         const { id_claim_case_organization } = dataJSON
        //         const { data: httpData } = await this.$http.post(
        //             apiCaseGetOrganizer + id_claim_case_organization
        //         )
        //         console.log('M_SEN_ORG_UPSERT', httpData)
        //     }
        // }
    } catch (error) {
        console.log(error)

        console.log(msg)
    }
}
