condi = true;
count = 0;
initlistar = function() {
    /*Para el grid de cartas tecnologicas*/
    selCartas = new Ext.grid.CheckboxSelectionModel({
    });
    /*Store del grid*/
    stCartas = new Ext.data.Store({
        url: 'listarcartasTecnologicas',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idcartatecnologica'
        },
        [{
                name: 'idcartatecnologica'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            beforeload: function() {
                this.baseParams.idcartastecnologicas = Ext.encode(id_cartas_tec);
            }
        }
    });
    colModelCartas = new Ext.grid.ColumnModel([selCartas,
        {
            header: "Codigo",
            width: 50,
            sortable: true,
            dataIndex: 'codigo'
        },
        {
            id: 'expandir',
            header: "Denominacion",
            width: 240,
            sortable: true,
            dataIndex: 'denominacion'
        }]);

    gpCartas = new Ext.grid.GridPanel({
        store: stCartas,
        autoExpandColumn: 'expandir',
        sm: selCartas,
        cm: colModelCartas,
        height: 220,
        frame: true,
        loadMask: {
            store: stCartas
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: stCartas,
            displayInfo: true
        })
    });
    winCartas = new Ext.Window({
        id: 'winCartas',
        width: 650,
        height: 400,
        constrain: true,
        closeAction: 'hide',
        layout: 'fit',
        title: 'Cartas Tecnologicas',
        items: gpCartas,
        buttons: [{
                text: 'Aplicar',
                handler: function() {
                    guardarCartasSel();
                    stCartas.reload({
                        params: {
                            start: 0,
                            limit: 20
                        }
                    });
                }
            }, {
                text: 'Cancelar',
                handler: function() {
                    winCartas.hide();
                }
            }, {
                text: 'Aceptar',
                handler: function() {
                    guardarCartasSel();
                    gpCartas.getSelectionModel().clearSelections();
                    winCartas.hide();
                }
            }]
    })
    function guardarCartasSel() {
        var existe = false;
        var idcartas = null;
        var codigo = null;
        var deno = null;
        for (i = 0; i < gpCartas.getSelectionModel().getCount(); i++) {
            idcartas = gpCartas.getSelectionModel().getSelections()[i].data.idcartatecnologica;
            for (j = 0; j < id_cartas_tec.length; j++) {
                if (id_cartas_tec[j] == idcartas) {
                    existe = true;
                }
            }
            if (!existe) {
                id_cartas_tec.push(idcartas);
                codigo = gpCartas.getSelectionModel().getSelections()[i].data.codigo + ' - ';
                deno = gpCartas.getSelectionModel().getSelections()[i].data.denominacion + '\n';
                cartas_sel.push(++count + '-) ' + codigo + deno);
                existe = false;
            }
        }
        if (gpCartas.getSelectionModel().getCount() != 0) {
            var values = '';
            for (i = 0; i < cartas_sel.length; i++)
                values += cartas_sel[i];
            cartas.setValue(values);
        }
    }
    /* ***************************** GRID PARA LOS PRODUCTOS ***************************** */
    selIndicadores = new Ext.grid.CheckboxSelectionModel({
    });

    cmIndicadores = new Ext.grid.ColumnModel([selIndicadores, {
            id: 'mscolumn',
            header: 'Codigo',
            width: 80,
            sortable: true,
            dataIndex: 'codigo'
        }, {
            id: 'expandir',
            header: 'Denominacion',
            sortable: true,
            dataIndex: 'denominacion'
        }, {
            id: 'umedida',
            header: 'U medida',
            sortable: true,
            dataIndex: 'umedida'
        }, {
            id: 'precio',
            header: 'Precio',
            width: 80,
            sortable: true,
            dataIndex: 'precio'
        }, {
            header: 'Numero Pieza',
            width: 120,
            sortable: true,
            dataIndex: 'numeropieza'
        }, {
            id: 'centrobalance',
            header: 'Centro Balance',
            sortable: true,
            dataIndex: 'centrobalance'
        }]);

    // Store grid stGpCT
    stIndicadores = new Ext.data.Store({
        url: 'listarIndicadores',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idindicador'
        }, [{
                name: 'idindicador'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'codigo'
            }, {
                name: '_parent'
            }, {
                name: 'idformato'
            }, {
                name: 'idcentrobalance'
            }, {
                name: 'centrobalance'
            }, {
                name: '_is_leaf'
            }, {
                name: 'precio'
            }, {
                name: 'umedida'
            }, {
                name: 'numeropieza'
            }])
    });

    gpIndicadores = new Ext.grid.GridPanel({
        store: stIndicadores,
        autoExpandColumn: 'expandir',
        sm: selIndicadores,
        cm: cmIndicadores,
        region: 'center',
        frame: true,
        loadMask: {
            store: stIndicadores
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: stIndicadores,
            displayInfo: true
        })
    });
    winIndicadores = new Ext.Window({
        id: 'winProductos',
        width: 650,
        height: 400,
        constrain: true,
        closeAction: 'hide',
        layout: 'fit',
        title: 'Indicadores',
        items: gpIndicadores,
        buttons: [{
                text: 'Aplicar',
                handler: function() {
                    guardarIndicadoresSel();
                    gpIndicadores.getSelectionModel().clearSelections();
                }
            }, {
                text: 'Cancelar',
                handler: function() {
                    winIndicadores.hide();
                }
            }, {
                text: 'Aceptar',
                handler: function() {
                    guardarIndicadoresSel();
                    gpIndicadores.getSelectionModel().clearSelections();
                    winIndicadores.hide();
                }
            }]
    });

    function guardarIndicadoresSel() {
        var existe = false;
        for (i = 0; i < gpIndicadores.getSelectionModel().getCount(); i++) {
            var idindicador = gpIndicadores.getSelectionModel().getSelections()[i].data.idindicador;
            for (j = 0; j < id_indicadore.length; j++) {
                if (id_indicadore[j] == idindicador) {
                    existe = true;
                    break;
                }
            }
            if (!existe) {
                id_indicadore.push(idindicador);
                var codigo = gpIndicadores.getSelectionModel().getSelections()[i].data.codigo + ' - ';
                var deno = gpIndicadores.getSelectionModel().getSelections()[i].data.denominacion + '\n';

                indic_sel.push(++count + '-) ' + codigo + deno);
            }
        }
        if (gpIndicadores.getSelectionModel().getCount() != 0) {
            var values = '';
            for (i = 0; i < indic_sel.length; i++)
                values += indic_sel[i];
            indicadores.setValue(values);
        }
    }
}

