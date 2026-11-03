initaddindicador = function() {
    filtrosindicadores = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            },
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'numeropieza'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                st: storeUM,
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'nombreum'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'listado',
                dataIndex: 'nivelarbol',
                idcombo: 'idcbnivelarbol',
                st: stCmbNiveles,
                valueFieldcb: 'nivel',
                displayFieldcb: 'nombre'

            }]
    });

    btnlimpiaraddind = new Ext.Button({
        handler: function() {
            filtrosindicadores.clearFilters();
        },
        text: perfil.etiquetas.lbBtnLimpiar,
        tooltip: 'Limpiar filtro(s)',
        disabled: false,
        id: 'btnlimpiaraddind',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn'
    });
    cbnaturalezaind = new Ext.form.ComboBox({
        id: 'cbnaturalezaind',
        emptyText: perfil.etiquetas.lbSeleccione,
        store: stnaturalezaind,
        valueField: 'idnaturalezauam',
        hiddenName: 'idnaturalezauam',
        displayField: 'denominacion',
        anchor: '100%',
        allowBlank: false,
        enableKeyEvents: true,
        mode: 'local',
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        listeners: {
            select: function() {
                gpaddindicadores.collapse();
                if (stcaracterizarind.getCount() > 0) {
                    Ext.getCmp('btnaplicarcaracter').enable();
                    Ext.getCmp('btnaceptarcaracter').enable();
                }
                ConfigurarColumnas2(gpcaracterizarind, cbnaturalezaind);
                for (i = 0; i < gpcaracterizarind.getStore().getCount(); i++) {
                    gpcaracterizarind.getStore().getAt(i).data.naturaleza = cbnaturalezaind.getRawValue();
                    gpcaracterizarind.getStore().getAt(i).commit();
                }
            }
        }
    });
    cbtipodepreciac = new Ext.ux.form.LovCombo({
        id: 'cbtipodepreciac',
        store: sttipodepreciac,
        valueField: 'idtipodepreciacion',
        hiddenName: 'idtipodepreciacion',
        displayField: 'denominacion',
        anchor: '100%',
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        listeners: {
            select: function() {
                if (cbtipodepreciac.getValue() == "") {
                    stcaracterizarind.getAt(fila).data.idtipodepreciacion = "";
                }
                ;
            }
        }
    });
    cbfuenteenergia = new Ext.form.ComboBox({
        id: 'cbfuenteenergia',
        store: storeFuenteEnergia,
        valueField: 'idfuenteenergia',
        hiddenName: 'idfuenteenergia',
        displayField: 'denominacion',
        anchor: '100%',
        mode: 'local',
        allowBlank: false,
        typeAhead: true,
        editable: true,
        triggerAction: 'all'

    });
    //******************grid******************
    cmaddindicadores = new Ext.grid.ColumnModel([{
            width: 140,
            header: 'Código',
            dataIndex: 'codigo',
            sortable: true,
            renderer: crearToolTip

        }, {
            header: 'Denominación',
            id: 'expandir',
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: 'UM',
            width: 60,
            sortable: true,
            hidden: true,
            dataIndex: 'idumedida',
            renderer: renderUM
        }, {
            width: 80,
            header: 'Precio',
            sortable: true,
            hidden: true,
            dataIndex: 'precio',
            renderer: crearToolTip
        }, {
            width: 80,
            header: 'Nivel',
            sortable: true,
            // hidden:true,
            dataIndex: 'nivelarbol',
            renderer: rendernivelarbol
        }
    ]);
    cmaddindicadores.defaultSortable = true;
    fila = -1;
    // **********SelectionModel del Grid ***************
    smaddindicadores = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(th, f) {
                fila = f;
            }
        }
    });

    staddindocadores = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'listarIndPlanif',
        listeners: {
            beforeload: function() {

                filtronivel = false;
                for (i = 0; i < filtrosindicadores.getFiltrosActivos().length; i++) {
                    if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "nivelarbol") {
                        filtronivel = true;
                        break;
                    }
                }
                if (smaddindicadores.getSelected() != undefined) {
                    if (filtronivel) {
                        staddindocadores.baseParams.anode = null;
                        staddindocadores.baseParams.idpadre = smaddindicadores.getSelected().data.idindicador;
                        staddindocadores.removeAll();
                    } else {
                        staddindocadores.baseParams.idpadre = null;
                        staddindocadores.baseParams.anode = smaddindicadores.getSelected().data.idindicador;
                    }
                } else {
                    staddindocadores.baseParams.idpadre = null;
                    staddindocadores.baseParams.anode = null;
                }
            },
            load: function() {
                cambiarTituloFiltrarAddIndicadores();
                if (staddindocadores.getCount() == 0) {
                    if (filtrosindicadores.getFiltrosActivos() == undefined || filtrosindicadores.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');

                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
            }

        },
        reader: new Ext.data.JsonReader({
            id: 'idindicador',
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'precio'
            }, {
                name: 'nivelarbol'
            }, {
                name: 'naturaleza'
            }, {
                name: 'idpadre'
            }, {
                name: 'ordender'
            }, {
                name: 'ordenizq'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }
        ])
    });

    // ***********TreeGrid ******************
    gpaddindicadores = new Ext.ux.maximgb.treegrid.GridPanel({
        loadMask: {
            msg: 'Cargando...'
        },
        autoExpandColumn: 'expandir',
        sm: smaddindicadores,
        id: 'gpaddindicadores',
        store: staddindocadores,
        collapsible: true,
        title: 'Indicadores',
        titleCollapse: true,
        width: 450,
        region: 'west',
        plugins: filtrosindicadores,
        cm: cmaddindicadores,
        stripeRows: true,
        md: new Ext.menu.Menu({
            id: 'menucaracterizar',
            items: [{
                    handler: function() {
                        CaracterizarIndicadores(gpaddindicadores);
                    },
                    text: 'Caracterizar indicador(es)',
                    tooltip: perfil.etiquetas.lbTtpCaracterizar,
                    id: 'btncaracterizar',
                    icon: perfil.dirImg + 'siguiente.png',
                    iconCls: 'btn'

                }]
        }),
        listeners: {
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());
            }
        },
        bbar:
                new Ext.ux.maximgb.treegrid.PagingToolbar({
            pageSize: 20,
            store: staddindocadores,
            displayInfo: true,
            items: ['-', btnlimpiaraddind]
        })
    });
    //*****************grid caracterizacion**************
    stcaracterizarind = new Ext.data.SimpleStore({
        fields: [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'precio'
            }, {
                name: 'idfuenteenergia'
            }, {
                name: 'naturaleza'
            }, {
                name: 'consumoenergia'
            }, {
                name: 'idtipodepreciacion'
            }, {
                name: 'depreciacion'
            }, {
                name: 'capacidad'
            }, {
                name: 'seguro'
            }, {
                name: 'nivel'
            }, {
                name: 'color'
            }],
        listeners: {
            update: function(g, r, e) {
            }
        }
    })
    cmcaracterizarind = new Ext.grid.ColumnModel([{
            width: 100,
            header: 'Código',
            dataIndex: 'codigo',
            sortable: true,
            renderer: crearToolTip
        }, {
            header: 'Denominación',
            id: 'expandir',
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: 'UM',
            renderer: renderUM,
            width: 100,
            sortable: true,
            dataIndex: 'idumedida'

        }, {
            width: 100,
            header: 'Precio',
            sortable: true,
            dataIndex: 'precio',
            renderer: crearToolTip
        }, {
            width: 100,
            header: 'Naturaleza',
            sortable: true,
            dataIndex: 'naturaleza',
            renderer: crearToolTip
        }, {
            width: 100,
            header: 'Fuente de energía',
            sortable: true,
            hidden: true,
            dataIndex: 'idfuenteenergia',
            renderer: renderFuenteenergia,
            editor: cbfuenteenergia

        }, {
            width: 100,
            header: 'Valor de consumo',
            sortable: true,
            hidden: true,
            renderer: crearToolTip,
            dataIndex: 'consumoenergia',
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                decimalPrecision: 2,
                maxValue: 99999999999999,
                invalidText: perfil.etiquetas.lbInvaliTex,
                validator: function(val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            width: 100,
            header: 'Tipo de depreciación',
            sortable: true,
            hidden: true,
            renderer: renderTipoDepreciacion,
            dataIndex: 'idtipodepreciacion',
            editor: cbtipodepreciac
        }, {
            width: 100,
            header: 'Valor de depreciación',
            sortable: true,
            hidden: true,
            renderer: crearToolTip,
            dataIndex: 'depreciacion',
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 2,
                allowBlank: false,
                maxValue: 9999,
                invalidText: perfil.etiquetas.lbInvaliTex,
                validator: function(val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            width: 100,
            header: 'Capacidad que abarca',
            sortable: true,
            hidden: true,
            renderer: crearToolTip,
            dataIndex: 'capacidad',
            editor: new Ext.form.NumberField({
                allowNegative: false,
                decimalPrecision: 5,
                allowBlank: false,
                maxValue: 9999,
                invalidText: perfil.etiquetas.lbInvaliTex,
                validator: function(val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            width: 100,
            header: 'Valor de seguro',
            sortable: true,
            hidden: true,
            renderer: crearToolTip,
            dataIndex: 'seguro',
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                decimalPrecision: 2,
                maxValue: 999999999999,
                invalidText: perfil.etiquetas.lbInvaliTex,
                validator: function(val) {
                    if (val == 0) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }, {
            width: 50,
            header: 'Color',
            sortable: true,
            hidden: true,
            dataIndex: 'color',
            align: 'center',
            renderer: rendercolor,
            editor: new Ext.form.TextField({
                id: 'tfcolor',
                allowBlank: false,
                listeners: {
                    focus: function(t) {
                        var xy = t.getPosition();
                        new Ext.menu.ColorMenu({
                            listeners: {
                                select: function(th, c) {
                                    gpcaracterizarind.getStore().getAt(fila).data.color = c;
                                    gpcaracterizarind.getStore().getAt(fila).commit();
                                }
                            }
                        }).showAt(xy);
                    }
                }
            })
        }]);

    smcaracterizarind = new Ext.grid.RowSelectionModel({});
    smcaracterizarind.on("rowselect", function(sm, rowIndex, record) {
        fila = rowIndex;
    });

    gpcaracterizarind = new Ext.grid.EditorGridPanel({
        loadMask: {
            msg: 'Por favor,espere'
        },
        id: 'gpcaracterizarind',
        store: stcaracterizarind,
        region: 'center',
        frame: true,
        sm: smcaracterizarind,
        cm: cmcaracterizarind,
        autoExpandColumn: 'expandir',
        height: 480,
        width: 750,
        md: new Ext.menu.Menu({
            id: 'menueliminar',
            items: [{
                    text: 'Eliminar indicador(es)',
                    icon: perfil.dirImg + 'eliminar.png',
                    iconCls: 'btn',
                    id: 'mneliminarnorma',
                    handler: function() {
                        var valores = gpcaracterizarind.getSelectionModel().getSelections();
                        for (i = 0; i < valores.length; i++) {
                            gpcaracterizarind.getStore().remove(gpcaracterizarind.getStore().getById(valores[i].id));
                        }
                        if (stcaracterizarind.getCount() == 0) {
                            Ext.getCmp('btnaplicarcaracter').disable();
                            Ext.getCmp('btnaceptarcaracter').disable();


                        }
                    }
                }]
        }),
        listeners: {
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());
            }
        },
        tbar: [{
                xtype: 'tbtext',
                text: 'Naturaleza:',
                id: 'naturaleza'
            }, cbnaturalezaind]

    });

    windaddindicadores = new Ext.Window({
        modal: true,
        frame: true,
        constrain: true,
        closeAction: 'hide',
        layout: 'border',
        width: 900,
        height: 550,
        title: 'Adicionar indicadores',
        items: [gpaddindicadores, gpcaracterizarind],
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                tooltip: perfil.etiquetas.lbTtpCancelar,
                text: perfil.etiquetas.lbBtnCancelar,
                handler: function() {
                    windaddindicadores.hide();

                }
            }, {
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                id: 'btnaplicarcaracter',
                tooltip: perfil.etiquetas.lbTtpAplicar,
                text: perfil.etiquetas.lbBtnAplicar,
                disabled: true,
                handler: function() {
                    AdicionarIndicadores(true);
                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                tooltip: perfil.etiquetas.lbTtpAceptar,
                text: perfil.etiquetas.lbBtnAceptar,
                id: 'btnaceptarcaracter',
                disabled: true,
                handler: function() {
                    AdicionarIndicadores(false);
                }
            }]
    });
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function cambiarTituloFiltrarAddIndicadores() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosindicadores.getFiltrosActivos() == undefined
            || filtrosindicadores.getFiltrosActivos().length == 0) {
        gpaddindicadores.setTitle('Indicadores ');
    } else {
        for (i = 0; i < filtrosindicadores.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "codigo") {
                aux = 'Código';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = 'Denominación';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "idumedida") {
                aux = 'UM';
            } else if (filtrosindicadores.getFiltrosActivos()[i].dataIndex == "precio") {
                aux = 'Precio';
            }
            else {
                aux = 'Nivel';
            }
            if (i == filtrosindicadores.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }

        gpaddindicadores.setTitle('Indicadores  <i>- Filtrado por: '
                + filtrado_por + '</i>');

        filtrado_por = "";
    }
}
