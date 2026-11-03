function construirComplemento(idTab) {
    var panelGestion = new Nomenclador.Panel.Gestion({
        id: idTab,
        title: 'Complemento salarial',
        name: 'complementosalarial',
        clase: 'complemento_domain',
        elemento: 'complemento',
        idTipoNomenclador: 23,
        mensajeEvento: 'los complementos salariales',
        mensajeCargando: 'de los complementos salariales',
        gestionable: false,
        rowCheckeable: true,
        store: new Ext.data.Store({
            url: 'mostrarComplementos',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant'
            }, [
                {name: 'id'},
                {name: 'denominacion'},
                {name: 'abreviatura'},
                {name: 'checkeado'}
            ])
        }),
        columns: [
            {
                id: 'codigo',
                dataIndex: 'id',
                header: "Código",
                sortable: true,
                renderer: Go.Util.convertCodcargos,
                width: Go.Column.Config.Width('codigo'),
                hidden: true
            },
            {
                id: 'denominacion',
                dataIndex: 'denominacion',
                header: "Denominación",
                sortable: true,
                renderer: Go.Column.Ttip.ToolTipColumn,
                width: Go.Column.Config.Width('denominacioncargo')
            },
            {
                id: 'abreviatura',
                dataIndex: 'abreviatura',
                header: 'Abreviatura',
                sortable: true,
                renderer: Go.Column.Ttip.ToolTipColumn,
                width: Go.Column.Config.Width('abreviatura')
            },
            {
                dataIndex: 'checkeado',
                sortable: false,
                header: "Activado",
                renderer: Go.Column.Render.changeValor,
                width: Go.Column.Config.Width('visible'),
                tooltip: 'Para activar/desactivar el complemento, accione doble click sobre la imagen',
                hidden: false,
                fixed: true,
                align: 'center',
            }
        ]
    });
    // panelGestion.gridPanel.id = 'gridComplemento';
    panelGestion.gridPanel.on('celldblclick', function (g, row, column, e) {
        if (column == 3) {
            var record = g.selModel.selections.items[0];
            if (!record.data.checkeado) {
                enviar('insertar', parseInt(record.data.id), record);
            } else {
                enviar('eliminar', parseInt(record.data.id), record);
            }
        }

    })
    var activeLoading = function (record, add) {
        var filas = $('#gridComplemento .x-grid3-row .x-grid3-td-codigo div');
        filas.each(function (idx, el) {
            if (parseInt($(el).html()) == record.data.id) {
                if (add) {
                    $(el).parent().siblings('.x-grid3-td-denominacion').addClass('loadingState');
                } else {
                    $(el).parent().siblings('.x-grid3-td-denominacion').removeClass('loadingState');
                }
            }
        })
    }
    var enviar = function (accion, idcomplemento, record) {
        activeLoading(record, true);
        Ext.Ajax.request({
            url: 'gestionarComplementosSalariales',
            params: {
                accion: accion,
                idcomplemento: idcomplemento
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                var codMsg = (responseData.codMsg == 4) ? 6 : responseData.codMsg;
                var msg = responseData.mensaje;
                // activeLoading(record, false);
                mostrarMensaje(codMsg, msg);

                panelGestion.gridPanel.store.reload();
            }
        })
    }
    return panelGestion;
}