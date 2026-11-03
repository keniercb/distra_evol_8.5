Ext.namespace('Caja.Reportes.CbEstados');
Caja.Reportes.CbEstados = function (filter, listeners)
{
    var arrayEstados = [{idestado: 8, estado: 'Guardado', _is_leaf: true}, {
        idestado: 2,
        estado: 'Aprobado',
        _is_leaf: true
    }, {idestado: 5, estado: 'Confirmado', _is_leaf: true}, {idestado: 7, estado: 'Cancelado', _is_leaf: true},
        {idestado: 6, estado: 'Posteado', _is_leaf: true}, {
            idestado: 9,
            estado: 'Liquidado',
            _is_leaf: true
        }, {idestado: 4, estado: 'Depositado', _is_leaf: true}, {
            idestado: 3,
            estado: 'Reembolsado',
            _is_leaf: true
        }];
    var arrayFilter = filter;

    // switch (idReporte) {
    //     case '14009': //RECIBO DE EFECTIVO
    //         arrayFilter = [8, 5, 6, 7, 4];
    //         break;
    //     case '14006': //VALE PARA PAGOS MENORES
    //         arrayFilter = [8, 5, 6, 7, 3];
    //         break;
    //     case '14003': //ANTICIPO Y LIQUIDACION DE GASTOS DE VIAJE
    //     case '14031': //CONTROL DE ANTICIPOS A JUSTIFICAR (VIAJE NACIONAL)
    //     case '14032': //CONTROL DE ANTICIPOS A JUSTIFICAR (VIAJE AL EXTRANJERO)
    //         arrayFilter = [8, 2, 6, 7, 9, 3];
    //         break;
    //     case '14010': //REEMBOLSO DE FONDOS PARA PAGOS MENORES
    //         arrayFilter = [8, 5, 7];
    //         break;
    //     case '14007': //ARQUEO DEL EFECTIVO EN CAJA
    //         arrayFilter = [8, 5, 6, 7];
    //         break;
    // }

    //--------------------------------
    var cbxEstado = new Ext.CONT.UIXCombo({
        emptyText: 'Seleccione...',
    }, {
        identificador: 'Estado',
        displayText: 'Estado',
        url: '',
        autoLoad: false,
        singleSelect: false,
        reader: new Ext.data.JsonReader({
            id: 'idestado',
        }, [{
            name: '_parent'
        }, {
            name: '_is_leaf'
        }, {
            name: 'idestado'
        }, {
            name: 'codigo',
            mapping: 'estado'
        }, {
            name: 'text',
            mapping: 'estado'
        }])
    });

    Ext.getCmp('gpEstado').getStore().loadData(arrayEstados);

    var temp = Ext.apply(
        {
            expand: function () {
                Ext.getCmp('gpEstado').getStore().clearFilter(true);
                Ext.getCmp('gpEstado').getStore().filterBy(function (record) {
                    return (arrayFilter.indexOf(record.data.idestado) != -1 ? true : false);
                });
            }
        },
        listeners
    );

    cbxEstado.on(temp);

    return cbxEstado;
};