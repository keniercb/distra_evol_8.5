var perfil = window.parent.UCID.portal.perfil;
//var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('calculoraciones', cargarInterfaz);
var wnGestionarTipos, wnGestionarBalance, sm, wnGestionarSubTipos, winComun, treeclick, cbComponente, cbEjercicio, stGpAsociarAct;
var stTipobalance, stSubtipobalance, smgeneral, gestor, gestorOLD, identidad, haySubtipos, valor, hoja, is_leaf, idfiltroentidad, btnDesasociarBalance, idconftiponomesp;
var msjasociacion, cmbSubtipobalance, cmbTipobalance, idconftiponomesp, activof = 2;
var msjasociacionact;
var _this = this;

function cargarInterfaz() {

    btnAyuda = new Ext.Toolbar.Button({
        id: 'btnAyudaCalculoRaciones',
        // icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'ayuda',
        tooltip: 'Ayuda (<b>Alt+H</b>)',
        // text: 'Ayuda'
    });

    btnAsociarBalance = new Ext.Button({
        //text: perfil.etiquetas.lbBtnAsociar,
        id: 'btnAsociarBalance',
        //  icon: perfil.dirImg + 'asociar.png',
        iconCls: 'asociar',
        tooltip: 'Asociar' + ' (<b>Alt+K</b>)',
        disabled: true,
        handler: function () {
            msjasociacion = 1;
            AsociarBalace(true);
        }
    });

    filtrostipocodif = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'string',
                dataIndex: 'codigo'}
        ]
    });

    btnDesasociarBalance = new Ext.Button({
        //  text: perfil.etiquetas.lbBtnDesasociar,
        id: 'btnDesasociarBalance',
        //icon: perfil.dirImg + 'deshacer.png',
        iconCls: 'deshacer',
        tooltip: 'Desasociar' + ' (<b>Alt+U</b>)',
        disabled: true,
        handler: function () {
            msjasociacion = 2;
            AsociarBalace(false);
        }
    });

    myMask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ii',
            alt: true,
            fn: function () {
                adicionarElemento();

            }

        },
        {
            key: 'Mm',
            alt: true,
            fn: function () {
                modificarElemento();

            }

        }, {
            key: 46,
            fn: function () {
                eliminarComun();
            }

        },
        {
            key: 'Ll',
            alt: true,
            fn: function () {
                if (!btnLimpiar.hidden) {
                    if (!btnLimpiar.disabled)
                        limpiar();

                }

            }

        }, {
            key: 'Hh',
            alt: true,
            fn: function () {
//                if (!btnAyuda.hidden) {
//                    if (!btnAyuda.disabled)
//                        mostrarAyuda('calculo de niveles');
//
//                }

            }

        }, {
            key: 'Gg',
            alt: true,
            fn: function () {
                if (!btnGuardar.hidden) {
                    if (!btnGuardar.disabled)
                        if (stRaciones.getModifiedRecords().length > 0) {
                            adicionarModRecordAlServer();
                        }

                }

            }

        }, {
            key: 'Aa',
            alt: true,
            fn: function () {
                if (!btnrecargar.hidden) {
                    if (!btnrecargar.disabled) {

                        if (cmbTipobalance.getValue() && cmbSubtipobalance.getValue())
                            mymask.show();
                        stSubtipobalance.removeAll();
                        stRaciones.reload({
                            params: {
                                hoja: hoja,
                                start: 0,
                                limit: 20,
                                idejercicio: cbEjercicio.getValue(),
                                idtipobalhojaance: cmbTipobalance.getValue(),
                                idsubtipobalance: cmbSubtipobalance.getValue(),
                                todos: Ext.getCmp('chktodos').getValue(),
                                data: Ext.encode(rcdatamod),
                                identidad: identidad,
                                idconftiponomesp: idconftiponomesp
                            }

                        });
                    }


                }

            }

        }, {
            key: 'Tt',
            alt: true,
            ctrl: true,
            fn: function () {
                if (!btnGestionarTipos.hidden) {
                    if (!btnGestionarTipos.disabled)
                    {
                        gestor = 'tipos';
                        importarJS('../../views/js/calculoraciones/comun.js');
                    }

                }

            }

        }, {
            key: 'Ss',
            alt: true,
            ctrl: true,
            fn: function () {
                if (!btnGestionarSubTipos.hidden) {
                    if (!btnGestionarSubTipos.disabled)
                    {
                        gestor = 'subtipos';
                        importarJS('../../views/js/calculoraciones/comun.js');
                    }

                }

            }

        }, {
            key: 'Bb',
            alt: true,
            ctrl: true,
            fn: function () {
                if (!btnGestionarBalances.hidden) {
                    if (!btnGestionarBalances.disabled)
                    {
                        gestor = 'balances';
                        importarJS('../../views/js/calculoraciones/comun.js');
                    }

                }

            }

        }, {
            key: 'Kk',
            alt: true,
            fn: function () {
                if (!btnAsociarBalance.hidden) {
                    if (!btnAsociarBalance.disabled)
                    {
                        AsociarBalace(true);
                    }

                }

            }

        }, {
            key: 'Uu',
            alt: true,
            fn: function () {
                if (!btnDesasociarBalance.hidden) {
                    if (!btnDesasociarBalance.disabled)
                    {
                        AsociarBalace(false);
                    }

                }

            }

        }, {
            key: 'Aa',
            alt: true,
            ctrl: true,
            fn: function () {
                if (!btnAsociarCN.hidden) {
                    if (!btnAsociarCN.disabled)
                    {
                        msjasociacionact = 1;
                        AsociarCN(true);
                    }

                }

            }

        },
        {
            key: 'Dd',
            alt: true,
            ctrl: true,
            fn: function () {
                if (!btnDesasociarCN.disabled)
                {
                    msjasociacionact = 2;
                    AsociarCN(false);
                }

            }

        }, {
            key: 'Nn',
            alt: true,
            ctrl: true,
            fn: function () {
                if (!btnAuxAsociarActividades.hidden) {
                    this.CalculodeNiveles2(sm);
                }
            }

        }, {
            key: 'Ff',
            alt: true,
            fn: function () {
                if (btnIntegrarActivoFijo.enable()) {
                    IntegrarAF();
                }

            }
        }
    ]);
    btnLimpiar = new Ext.Toolbar.Button({
        id: 'btnLimpiarFcr',
        //  icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'limpiar',
        tooltip: "Limpiar filtros (s)" + ' (<b>Alt+L</b>)',
        //  text: perfil.etiquetas.lbLimpiar,
        handler: function () {
            limpiar();
        }
    });


    btnrecargar = new Ext.Toolbar.Button({
        id: 'btnrecargar',
        // icon: perfil.dirImg + 'actualizar.png',
        iconCls: 'actualizar',
        tooltip: 'Actualizar (<b>Alt+A</b>)',
        //  text: perfil.etiquetas.lbRecargar,
        handler: function () {

            if (cmbTipobalance.getValue() && cmbSubtipobalance.getValue())
                mymask.show();
            stSubtipobalance.removeAll();
            stRaciones.reload({
                params: {
                    hoja: hoja,
                    start: 0,
                    limit: 20,
                    idejercicio: cbEjercicio.getValue(),
                    idtipobalhojaance: cmbTipobalance.getValue(),
                    idsubtipobalance: cmbSubtipobalance.getValue(),
                    todos: Ext.getCmp('chktodos').getValue(),
                    data: Ext.encode(rcdatamod),
                    identidad: identidad,
                    idconftiponomesp: idconftiponomesp
                }

            });
        }


    });

    tftotalparcialniv = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'totalparcial',
        width: 110,
        align: 'right',
        readOnly: true,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0000'
    });
    tftotalgeneral = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'totalgeneral',
        width: 110,
        align: 'right',
        readOnly: true,
        maskRe: /^([0-9.,]+ ?[0-9.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0000'
    });





    stComportamiento = new Ext.data.Store({
        url: 'cargarCombocomp',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [{
                name: 'idconftiponomesp'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'idtiponomenclador'
            }])
    });

    cbComponente = new Ext.form.ComboBox({
        emptyText: 'Seleccione...',
        width: 120,
        listWidth: 310,
        store: stComportamiento,
        displayField: 'denominacion',
        valueField: 'idconftiponomesp',
        id: 'idconftiponomesp',
        typeAhead: true,
        disabled: false,
        mode: 'remote',
        loadingText: 'Cargando...',
        readOnly: true,
        fieldLabel: 'Componente',
        forceSelection: true,
        selectOnFocus: true,
        triggerAction: 'all',
        listeners: {
            select: function (c, r, i) {
                idconftiponomesp = cbComponente.getValue();
                Ext.getCmp('cbEjercicio').enable();
                tpEntidades.expand(true);
                Ext.getCmp('tpEntidades').enable();
                Ext.getCmp('btnGestionarTipos').enable();
                Ext.getCmp('btnGestionarSubTipos').enable();
                Ext.getCmp('btnGestionarBalances').enable();
                treeLoader.baseParams.idconftiponomesp = r.data.idtiponomenclador;
                treeLoader.load(tpEntidades.getRootNode());
                stTipobalance.reload({
                    params: {
                        idconftiponomesp: c.getValue(),
                        activof: activof,
                        tipoaf: (activof == 1) ? cbTipobalance.getValue() : 0,
                        subaf: (activof == 1) ? cbTipobalance.getValue() : 0
                    }
                });
                cmbSubtipobalance.reset();
                cmbTipobalance.reset();
            }
        }
    });

    //Para la gestion del ejercicio actual
    stCbejercicio = new Ext.data.Store({
        url: 'gestEjercicios',
        listeners: {
            load: function (t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }])
    });

    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        width: 100,
        listWidth: 100,
        disabled: true,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'remote',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        readOnly: true,
        forceSelection: true,
        selectOnFocus: true,
        listeners: {
            select: function (c, r, i) {
                idejercicio = c.getValue();
                stRaciones.reload({
                    params: {
                        hoja: hoja,
                        idejercicio: cbEjercicio.getValue(),
                        idtipobalhojaance: cmbTipobalance.getValue(),
                        idsubtipobalance: cmbSubtipobalance.getValue(),
                        todos: Ext.getCmp('chktodos').getValue(),
                        idconftiponomesp: idconftiponomesp,
                        identidad: identidad
                    }
                });
            }
        }
    });
    stCbejercicio.reload();

    btnIntegrarActivoFijo = new Ext.Button({
        // text: perfil.etiquetas.lbBtnIntegrarActivoFijo,
        id: 'btnIntegrarActivoFijo',
        // icon: perfil.dirImg + 'asociar.png',
        tooltip: 'Obtener informacion' + ' (<b>Alt+F</b>)',
        disabled: true,
        iconCls: 'asociar',
        handler: function () {

            _this.IntegrarAF();
        }
    });

    this.IntegrarAF = function IntegrarAF() {


        storeSubtipobalance = new Ext.data.Store({
            url: 'cargartbcombosubtipobalanceAF',
            autoload: true,
            listeners: {
                load: function (cmb, rc) {
                    myMask.hide();
                },
                beforeload: function (s) {
                    s.baseParams.idetapa = cbTipobalance.getValue() ? cbTipobalance.getValue() : 0;
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: "data"
            }, [{
                    name: 'idtabla'
                }, {
                    name: 'denominacion'
                }])
        });
        cbTipobalance = new Ext.form.ComboBox({
            width: 150,
            store: storeSubtipobalance,
            displayField: 'denominacion',
            valueField: 'idtabla',
            fieldLabel: perfil.etiquetas.lbtipobalance,
            typeAhead: true,
            mode: 'local',
            region: 'center',
            disabled: false,
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            listeners: {
                select: function (cmb, rc) {
                    cbSubtipobalance.enable();
                    storeSubtipobalance.reload();
                }
            }
        });



        cbSubtipobalance = new Ext.form.ComboBox({
            width: 150,
            store: storeSubtipobalance,
            displayField: 'denominacion',
            valueField: 'idtabla',
            fieldLabel: perfil.etiquetas.lbsubtipobalance,
            typeAhead: true,
            mode: 'local',
            region: 'center',
            disabled: false,
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            listeners: {
                select: function (cmb, rc) {
                    Ext.getCmp('btnAceptar').enable();
                }
            }
        });

        storeSubtipobalance.reload();
        fpComun = new Ext.FormPanel({
            id: 'fpComunAF',
            region: 'center',
            height: 300,
            width: 300,
            autoHeight: true,
            frame: true,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            layout: 'form',
                            items: [cbTipobalance]
                        },
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [cbSubtipobalance]
                        }]
                }]
        });


        btnAceptar = new Ext.Button({
            // text: perfil.etiquetas.lbBtnAceptar,
            id: 'btnAceptar',
            // icon: perfil.dirImg + 'aceptar.png',
            tooltip: 'Aceptar',
            iconCls: 'aceptar',
            disabled: true,
            handler: function () {
                Ext.Ajax.request({
                    url: ' guardarTS',
                    params: {
                        identidad: identidad,
                        idtipobalhojaance: cbTipobalance.getValue(),
                        idsubtipobalance: cbSubtipobalance.getValue()
                    },
                    callback: function (options, success, response) {
                        winIntegrarAF.hide();

                    }
                });
                activof = 1;
            }
        });

        // Ventana integracion
        winIntegrarAF = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            width: 190,
            constrain: true,
            height: 180,
            layout: 'fit',
            items: fpComun,
            title: perfil.etiquetas.lbIntegrarAF,
            buttons: [btnAceptar,
                {
                    // icon: perfil.dirImg + 'cancelar.png',
                    tooltip: perfil.etiquetas.lbBtnCancelar,
                    iconCls: 'cancelar',
                    text: perfil.etiquetas.lbBtnCancelar,
                    handler: function () {
                        winIntegrarAF.hide();
                    }
                }
            ]
        });
        winIntegrarAF.show();
    };

    treeLoader = new Ext.tree.TreeLoader({
        dataUrl: 'cargarEntidades',
        listeners: {
            load: function () {
                if (is_leaf) {
                    grid.getStore().reload({
                        params:
                                {
                                    hoja: hoja,
                                    start: 0,
                                    limit: 20,
                                    idconftiponomesp: idconftiponomesp,
                                    identidad: identidad
                                }
                    });
                }

            },
            beforeload: function (tree, node, res) {
                tree.baseParams.valor = Ext.getCmp('idfiltroentidad').getValue();
            }

        }
    });




    tpEntidades = new Ext.tree.TreePanel({
        title: 'Entidades',
        autoScroll: true,
        collapsible: true,
        width: 220,
        region: 'west',
        height: 600,
        collapsed: true,
        id: 'tpEntidades',
        useArrows: true,
        disabled: true,
        loader: treeLoader,
        listeners: {
            click: function (n) {
                stTipobalance.reload(
                        {
                            params: {
                                hoja: hoja,
                                start: 0,
                                limit: 20,
                                todos: Ext.getCmp('chktodos').getValue(),
                                idconftiponomesp: idconftiponomesp,
                                identidad: identidad,
                                activof: activof,
                                tipoaf: (activof == 1) ? cbTipobalance.getValue() : 0,
                                subaf: (activof == 1) ? cbTipobalance.getValue() : 0
                            }
                        }
                );
                stRaciones.removeAll();
                if (n.id != 0) {
                    is_leaf = n.leaf;
                    if (is_leaf != 0) {
                        grid.getColumnModel().setEditable(3, false);
                        grid.getColumnModel().setEditable(2, true);
                        hoja = true;
                        Ext.getCmp('btnDesasociarBalance').disable();
                        Ext.getCmp('chktodos').disable();
                        identidad = n.id;
                        Ext.getCmp('chktodos').setValue(false);
                        Ext.getCmp('idtipobalance').enable();
                        Ext.getCmp('btnIntegrarActivoFijo').enable();
                    } else {
                        grid.getColumnModel().setEditable(2, false);
                        grid.getColumnModel().setEditable(3, true);

                        hoja = false;
                        Ext.getCmp('btnDesasociarBalance').disable();
                        identidad = n.id;
                        Ext.getCmp('chktodos').enable();
                        Ext.getCmp('idtipobalance').enable();
                        Ext.getCmp('idsubtipobalance').enable();
                        Ext.getCmp('btnIntegrarActivoFijo').enable();
                    }
                    if (cmbSubtipobalance.getValue() && cmbTipobalance.getValue()) {
                        stRaciones.reload({
                            params: {
                                hoja: hoja,
                                start: 0,
                                limit: 20,
                                idejercicio: cbEjercicio.getValue(),
                                idtipobalhojaance: cmbTipobalance.getValue(),
                                idsubtipobalance: cmbSubtipobalance.getValue(),
                                todos: Ext.getCmp('chktodos').getValue(),
                                idconftiponomesp: idconftiponomesp,
                                identidad: identidad
                            }
                        });
                        grid.setTitle('Balances ');
                    }
                    cmbTipobalance.clearValue();
                    cmbSubtipobalance.clearValue();
                }
            }
        },
        tbar: [{
                iconCls: 'icon-expand-all',
                tooltip: 'Expandir todas las entidades',
                icon: perfil.dirImg + 'expand-all.gif',
                handler: function () {
                    tpEntidades.root.expand(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Colapsar todas las entidades',
                icon: perfil.dirImg + 'collapse-all.gif',
                handler: function () {
                    tpEntidades.root.collapse(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Refrescar todas las entidades',
                icon: perfil.dirImg + 'table_refresh.png',
                handler: function () {
                    actualizararbol(tpEntidades);
                }
            }, '-', {
                xtype: 'textfield',
                emptyText: 'Filtrar entidad...',
                width: 110,
                id: 'idfiltroentidad',
                listeners: {
                    specialkey: function (t, e) {
                        if (e.getKey() == '13') {
                            actualizararbol(tpEntidades);
                        }
                    }
                }
            }],
        root: new Ext.tree.AsyncTreeNode({
            text: "Entidades",
            tipo: 0,
            expanded: false,
            editable: false,
            draggable: true,
            expandable: true,
            id: '0',
            idconftiponomesp: idconftiponomesp
        })


    });

    btnGuardar = new Ext.Toolbar.Button({
        id: 'btnGuardar',
        //   icon: perfil.dirImg + 'guardar.png',
        iconCls: 'guardar',
        tooltip: 'Guardar datos (<b>Alt+G</b>)',
        //  text: perfil.etiquetas.lbGuardar,
        handler: function () {
            if (stRaciones.getModifiedRecords().length > 0) {
                adicionarModRecordAlServer();
            }
        }
    });

    btnExportar = new Ext.Button({
        // text: perfil.etiquetas.lbBtnExportar,
        id: 'btnExportar',
        // icon: perfil.dirImg + 'exportar.png',
        iconCls: 'exportar',
        tooltip: 'Exportar' + ' (<b>Alt+E</b>)',
        disabled: false,
        handler: function () {
            filtros = filtroscalculoraciones.getFilterData();
            var win = window.open('exportar?componente=' + cbComponente.getRawValue() +
                    '&tipobalance=' + cmbTipobalance.getRawValue() +
                    '&idtipobalance=' + cmbTipobalance.getRawValue() +
                    '&subtipobalance=' + cmbSubtipobalance.getRawValue() +
                    '&idsubtipobalance=' + cmbSubtipobalance.getValue() +
                    '&entidad=' + tpEntidades.selModel.getSelectedNode().text +
                    '&filtros=' + Ext.encode(filtros) +
                    '&hoja=' + hoja +
                    '&todos=' + Ext.getCmp('chktodos').getValue() +
                    '&identidad=' + identidad +
                    '&idconftiponomesp=' + idconftiponomesp);
        }

    });

    Actividad = {
        xtype: 'textfield',
        id: 'actividad',
        width: 250,
        anchor: '95%'
    };
    Coeficiente = {
        xtype: 'textfield',
        name: 'coeficiente',
        anchor: '95%'
    };

    // *** Creando el store
    stTipobalance = new Ext.data.Store({
        url: ' cargartbcombotipobalance',
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [{
                name: 'idtipobalance'
            }, {
                name: 'denominacion'
            }])
    });



    cmbTipobalance = new Ext.form.ComboBox({
        width: 150,
        listWidth: 310,
        store: stTipobalance,
        displayField: 'denominacion',
        valueField: 'idtipobalance',
        id: 'idtipobalance',
        typeAhead: true,
        mode: 'local',
        disabled: true,
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Seleccione...',
        selectOnFocus: true,
        listeners: {
            select: function (cmb, rc) {
                stSubtipobalance.reload({
                    params: {
                        hoja: hoja,
                        idtipobalance: rc.data.idtipobalance,
                        idconftiponomesp: idconftiponomesp,
                        identidad: identidad,
                        activof: activof,
                        tipoaf: (activof == 1) ? cbTipobalance.getValue() : 0,
                        subaf: (activof == 1) ? cbTipobalance.getValue() : 0
                    }
                });
                cmbSubtipobalance.reset();
                cmbSubtipobalance.enable();
                stRaciones.removeAll();
                if (cmbSubtipobalance.getValue() == 0) {

                    haySubtipos = false;
                } else
                {

                    haySubtipos = true;
                }
            }
        }
    });
    stSubtipobalance = new Ext.data.Store({
        url: 'cargartbcombosubtipobalance',
        listeners: {
            load: function (cmb, rc) {
                myMask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [{
                name: 'idsubtipobalance'
            }, {
                name: 'denominacion'
            }])
    });

    cmbSubtipobalance = new Ext.form.ComboBox({
        width: 150,
        listWidth: 310,
        store: stSubtipobalance,
        displayField: 'denominacion',
        disabled: true,
        valueField: 'idsubtipobalance',
        id: 'idsubtipobalance',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Seleccione...',
        selectOnFocus: true,
        listeners: {
            select: function (cmb, rc) {
                stRaciones.reload(
                        {
                            params: {
                                hoja: hoja,
                                start: 0,
                                limit: 20,
                                idejercicio: cbEjercicio.getValue(),
                                idtipobalance: cmbTipobalance.getValue(),
                                idsubtipobalance: rc.data.idsubtipobalance,
                                todos: Ext.getCmp('chktodos').getValue(),
                                idconftiponomesp: idconftiponomesp,
                                identidad: identidad
                            }
                        }
                );
                grid.setTitle('Balances ');
            }

        }
    });


    // *** Acceso directo alias
    var frm = Ext.form;
    // *** Column Model del Grid
    var cm = new Ext.grid.ColumnModel([
        {
            id: 'denominacion',
            header: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            tooltip: 'Denominación',
            renderer: crearToolTip,
            width: 100,
            sortable: true
        }, {
            header: perfil.etiquetas.lbDescripcion,
            dataIndex: 'descripcion',
            tooltip: 'Descripción',
            renderer: crearToolTip,
            width: 250
        }, {
            header: perfil.etiquetas.lbCantidad,
            dataIndex: 'total',
            align: 'right',
            tooltip: 'Cantidad total',
            width: 100,
            sortable: true,
            renderer: llenarCampos,
            editor: new frm.NumberField({
                decimalPrecision: 6,
                listeners: {
                    focus: function () {
                        this.focus(true);
                    }
                }
            })
        }, {
            header: perfil.etiquetas.lbCoeficiente,
            dataIndex: 'coeficiente',
            align: 'right',
            tooltip: 'Coeficiente',
            width: 100,
            sortable: false,
            renderer: llenarCampos,
            editor: new frm.NumberField({
                decimalPrecision: 6,
                listeners: {
                    focus: function () {
                        this.focus(true);
                    }
                }
            })
        }, {
            header: "Niveles",
            dataIndex: 'racion',
            align: 'right',
            tooltip: 'Niveles',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        }]);
    // *** Formato de una fila nueva a insertar en el grid
    var Fila = Ext.data.Record.create([{
            name: 'actividad',
            type: 'string'
        }, {
            name: 'coeficiente',
            type: 'string'
        }, {
            name: 'cantidad',
            type: 'string'
        }, {
            name: 'total',
            type: 'string'
        }
    ]);



    stRaciones = new Ext.data.Store({
        url: "listarRaciones",
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idsubtipobalancebalance',
            totalProperty: 'total'
        }, [{
                name: 'idsubtipobalancebalance'
            }, {
                name: 'idbalance'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'total'
            }, {
                name: 'coeficiente'
            }, {
                name: 'racion'
            }, {
                name: 'totalparcial'
            }, {
                name: 'totalgeneral'
            }]),
        listeners: {
            load: function (st, rc, obj) {

                if (stRaciones.getAt(0)) {
                    tftotalgeneral.setRawValue(stRaciones.getAt(0).data.totalgeneral);
                    tftotalparcialniv.setRawValue(stRaciones.getAt(0).data.totalparcial);
                } else {
                    tftotalgeneral.setRawValue(0);
                    tftotalparcialniv.setRawValue(0);
                }
            },
            beforeload: function () {
                stRaciones.baseParams.start = 0;
                stRaciones.baseParams.limit = 20;
                grid.getSelectionModel().clearSelections();
                filtroscalulo();

            }
        }
    });
    paginado = new Ext.PagingToolbar({
        pageSize: 20,
        store: stRaciones,
        id: 'paginado',
        // displayInfo: true,
        items: ['-', btnLimpiar, '-', {
                xtype: 'tbtext',
                text: '&nbsp;&nbsp;<b>' + 'Total Parcial:&nbsp;' + '</b>'
            }, tftotalparcialniv, {
                xtype: 'tbtext',
                text: '&nbsp;&nbsp;<b>' + 'Total General:&nbsp;' + '</b>'
            }, tftotalgeneral]
    });

    //Trabajando en el selection model del grid de calculo de raciones para validar que el btn asociar se activará cuando escoja solo 1 CN
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (x, y, w) {

                if (x.getCount() == 1 && x.getSelections()[0].data.racion != 0) {
                    Ext.getCmp('btnAuxAsociarActividades').enable();
                    habilitarDesabilitar(true);
                } else {
                    Ext.getCmp('btnAuxAsociarActividades').disable();
                    habilitarDesabilitar(true);
                }
            },
            rowdeselect: function (s, n, r) {
                if (sm.getSelections().length == 0)
                    habilitarDesabilitar(false);
                else if (sm.getSelections().length == 1 && sm.getSelections()[0].data.racion != 0) {
                    habilitarDesabilitar(true);
                    Ext.getCmp('btnAuxAsociarActividades').enable();
                } else {
                    habilitarDesabilitar(true);
                    Ext.getCmp('btnAuxAsociarActividades').disable();
                }
            }
        }
    });


    filtroscalculoraciones = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'numeric',
                dataIndex: 'total'
            }, {
                type: 'numeric',
                dataIndex: 'coeficiente'

            }, {
                type: 'numeric',
                dataIndex: 'racion'

            }]
    });


    //boton auxiliar lisney para visualizar interfaz asociar actividades
    btnAuxAsociarActividades = new Ext.Button({
        //  text: perfil.etiquetas.lbBtnAsociarActividades,
        id: 'btnAuxAsociarActividades',
        // icon: perfil.dirImg + 'asociar.png',
        tooltip: 'Asociar a actividades' + ' (<b>Ctrl+Alt+N</b>)',
        disabled: true,
        iconCls: 'asociar',
        handler: function () {
            _this.CalculodeNiveles2(sm);
        }
    });


    // *** Definicion del grid editable
    grid = new Ext.grid.EditorGridPanel({
        title: 'Balances',
        master_column_id: 'exp',
        root_title: perfil.etiquetas.lbDenominacion,
        width: 900,
        plugins: filtroscalculoraciones,
        height: 600,
        region: 'center',
        autoExpandColumn: 'denominacion',
        store: stRaciones,
        cm: cm,
        sm: sm,
        loadMask: {
            store: stRaciones
        },
        listeners: {
            afteredit: function (e) {

            }
        },
        frame: true,
        tbar: [{
                xtype: 'tbseparator'
            }, {
                xtype: 'tbtext',
                text: 'Tipo balance'
            }, cmbTipobalance, {
                xtype: 'tbseparator'
            }, {
                xtype: 'tbtext',
                text: 'Sub tipo balance'
            }, cmbSubtipobalance, {
                xtype: 'tbseparator'
            }, {
                xtype: 'tbtext',
                text: 'Listar todos los balances: '
            }, {
                xtype: 'checkbox',
                id: 'chktodos',
                disabled: true,
                listeners: {
                    check: function (ck, t) {
                        if (cmbTipobalance.getValue() && cmbSubtipobalance.getValue())
                            stRaciones.reload({
                                params: {
                                    idconftiponomesp: idconftiponomesp,
                                    start: 0,
                                    limit: 20,
                                    idejercicio: cbEjercicio.getValue(),
                                    idtipobalance: cmbTipobalance.getValue(),
                                    idsubtipobalance: cmbSubtipobalance.getValue(),
                                    identidad: identidad,
                                    todos: t,
                                    hoja: hoja
                                }
                            });
                        grid.setTitle('Balances ');

                    }
                }
            }, {
                xtype: 'tbseparator'
            },
            {
                xtype: 'tbseparator'
            }, btnAuxAsociarActividades],
        tbars:
                ['->', btnLimpiar, btnrecargar, btnGuardar, {
                        xtype: 'tbtext',
                        text: perfil.etiquetas.lbSubtotalraciones
                    }, {
                        xtype: 'textfield',
                        name: 'subtotalraciones',
                        id: 'subtotalraciones',
                        width: 400,
                        anchor: '95%'
                    }, {
                        xtype: 'tbseparator'
                    }, {
                        xtype: 'tbtext',
                        text: perfil.etiquetas.lbTotalraciones
                    }, {
                        xtype: 'textfield',
                        name: 'totalraciones',
                        id: 'totalraciones',
                        width: 800,
                        anchor: '95%'
                    }, {
                    }],
        bbar: paginado
    });

    //aqui esta el boton GestionarTipos
    btnGestionarTipos = new Ext.Button({
        //  text: 'Gestionar tipos de balances',
        id: 'btnGestionarTipos',
        tooltip: 'Gestionar Tipos de balances (<b>Ctrl+Alt+T</b>)',
        //  icon: perfil.dirImg + 'nuevo.png',
        iconCls: 'gestionarsistemas',
        disabled: true,
        handler: function () {
            gestor = 'tipos';
            importarJS('../../views/js/calculoraciones/comun.js');

        }
    });
    btnGestionarSubTipos = new Ext.Button({
        //  text: 'Gestionar subtipos de balances',
        id: 'btnGestionarSubTipos',
        //icon: perfil.dirImg + 'nuevo.png',
        tooltip: 'Gestionar Subtipos de balances (<b>Ctrl+Alt+S</b>)',
        iconCls: 'gestionarsubsistema',
        disabled: true,
        handler: function () {
            gestor = 'subtipos';
            importarJS('../../views/js/calculoraciones/comun.js');
        }
    });
    btnGestionarBalances = new Ext.Button({
        // text: 'Gestionar balances',
        id: 'btnGestionarBalances',
        // icon: perfil.dirImg + 'nuevo.png',
        tooltip: 'Gestionar balances (<b>Ctrl+Alt+B</b>)',
        iconCls: 'gestionarcamposcontables ',
        disabled: true,
        handler: function () {
            gestor = 'balances';
            importarJS('../../views/js/calculoraciones/comun.js');
        }
    });




    this.CalculodeNiveles2 = function CalculodeNiveles2(sm) {
        smgeneral = _this.sm.getSelections()[0].data;
        idejercicio = cbEjercicio.getValue();
        smCN = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (x, y, w) {

                    habilitarDeshabilitarCN(true);

                },
                rowdeselect: function (s, n, r) {
                    if (smCN.getSelections().length == 0)
                        habilitarDeshabilitarCN(false);
                    else
                        habilitarDeshabilitarCN(true);
                }
            }
        });

        btnAsociarCN = new Ext.Button({
            text: perfil.etiquetas.lbBtnAsociar,
            id: 'btnAsociarCN',
            // icon: perfil.dirImg + 'asociar.png',
            iconCls: 'asociar',
            tooltip: 'Asociar' + ' (<b>Ctrl+Alt+A</b>)',
            disabled: true,
            handler: function () {
                msjasociacionact = 1;
                AsociarCN(true);
            }
        });

        btnDesasociarCN = new Ext.Button({
            text: perfil.etiquetas.lbBtnDesasociar,
            id: 'btnDesasociarCN',
            // icon: perfil.dirImg + 'deshacer.png',
            iconCls: 'deshacer',
            tooltip: 'Desasociar' + ' (<b>Ctrl+Alt+D</b>)',
            disabled: true,
            handler: function () {
                msjasociacionact = 2;
                AsociarCN(false);
            }
        });

        // FILTROS POR COLUMNA asociar a actividades**********
        filtrosasociaractividades = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    idTextField: 'filtrocodigo',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'descripcion'
                }, {
                    type: 'numeric',
                    dataIndex: 'nivelactividadmanual'
                }]
        });

        cmGpAddAsociacion = new Ext.grid.ColumnModel([{
                id: 'master',
                header: perfil.etiquetas.lbCodigo,
                width: 100,
                sortable: true,
                dataIndex: 'codigo',
                tooltip: 'Código',
                renderer: crearToolTip
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                sortable: true,
                dataIndex: 'denominacion',
                tooltip: 'Denominación',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbDescripcion,
                sortable: true,
                dataIndex: 'descripcion',
                tooltip: 'Descripcion',
                renderer: crearToolTip
            },
            {
                header: "Niveles Actividad",
                dataIndex: 'nivelactividadmanual',
                tooltip: 'Niveles',
                width: 100,
                sortable: true,
                renderer: crearToolTip
            }
        ]);

        //Store de asociar calculo de niveles a actividades Arreglar
        stGpAsociarAct = new Ext.data.Store({
            autoload: true,
            url: 'listarActAAsociar',
            listeners: {
                load: function () {
                    siexisteactividades();
                    if (filtrosasociaractividades.getFiltrosActivos().length > 0 && stGpAsociarAct.getCount() == 0) {
                        mostrarMensaje(1, perfil.etiquetas.tlexiste);
                    }
                },
                beforeload: function (s) {
                    s.baseParams.idsubtipobalancebalance = smgeneral.idsubtipobalancebalance;
                    s.baseParams.identidad = identidad;
                    s.baseParams.todasact = Ext.getCmp('chktodasact').getValue();
                    s.baseParams.idejercicio = Ext.getCmp('cbEjercicio').getValue();
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data'
            }, [{
                    name: 'idactividad'
                }, {
                    name: 'identidad'
                }, {
                    name: 'denominacion'
                }, , {
                    name: 'descripcion'
                }, {
                    name: 'codigo'
                },
                {
                    name: 'idactividadentidad'
                }, {
                    name: 'nivelactividadmanual'
                }, {
                    name: 'idsubtipobalancebalance'
                },
                {
                    name: 'idejercicio'
                }
            ])
        });

        btnLimpiarfiltrosCN = new Ext.Toolbar.Button({
            id: 'btnLimpiarfiltrosCN',
            //  icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'limpiar',
            tooltip: "Limpiar filtros (s)",
            text: perfil.etiquetas.lbLimpiar,
            handler: function () {
                limpiarfiltrosCN();
            }
        });


        paginadoCN = new Ext.PagingToolbar({
            pageSize: 20,
            store: stGpAsociarAct,
            id: 'paginadoCN',
            displayInfo: true,
            items: ['-', btnLimpiarfiltrosCN, '-']
        });

        //grid panel asociar actividades
        gpAsociarAct = new Ext.grid.GridPanel({
            id: 'gpAsociarAct',
            frame: true,
            store: stGpAsociarAct,
            master_column_id: 'mscolumn',
            sm: smCN,
            region: 'center',
            root_title: perfil.etiquetas.lbActividades,
            autoExpandColumn: 'expandir',
            cm: cmGpAddAsociacion,
            plugins: filtrosasociaractividades,
            loadMask: {
                msg: perfil.etiquetas.lbCargando
            },
            tbar: [{
                    xtype: 'tbseparator'
                }, {
                    xtype: 'tbtext',
                    text: 'Listar todas las actividades: '
                }, {
                    xtype: 'checkbox',
                    id: 'chktodasact',
                    enable: true,
                    listeners: {
                        check: function (ck, t) {
                            stGpAsociarAct.reload({
                                params: {
                                    idsubtipobalancebalance: smgeneral.idsubtipobalancebalance,
                                    racion: smgeneral.racion,
                                    identidad: identidad,
                                    todasact: false,
                                    actividades: Ext.getCmp('gpAsociarAct').getSelectionModel().getSelections(),
                                    idejercicio: Ext.getCmp('cbEjercicio').getValue(),
                                    start: 0,
                                    limit: 20

                                }
                            });
                            grid.setTitle('Actividades');

                        }
                    }
                }, {
                    xtype: 'tbseparator'
                }, {
                    xtype: 'tbseparator'
                }, btnAsociarCN, btnDesasociarCN
            ],
            tbars:
                    ['->', btnLimpiarfiltrosCN],
            bbar: paginadoCN
        });



        // Asociar act
        winAsociarAct = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            width: 960,
            constrain: true,
            layout: 'fit',
            items: gpAsociarAct,
            height: 500,
            title: perfil.etiquetas.lbActividades,
            buttons: [
                {
                    //  icon: perfil.dirImg + 'cancelar.png',
                    tooltip: perfil.etiquetas.lbBtnCancelar,
                    iconCls: 'cancelar',
                    text: perfil.etiquetas.lbBtnCancelar,
                    handler: function () {
                        winAsociarAct.hide();
                        gpAsociarAct.getSelectionModel().clearSelections();
                    }
                }
            ]
        });
        winAsociarAct.show();
        stGpAsociarAct.load({
            params: {
                start: 0,
                limit: 20
            }
        });
    };

    pAux = new Ext.Panel({
        layout: 'border',
        width: 400,
        height: 500,
        items: [tpEntidades, grid],
        tbar: [btnGestionarTipos, btnGestionarSubTipos, btnGestionarBalances, btnAsociarBalance, btnDesasociarBalance, btnIntegrarActivoFijo, btnGuardar, btnExportar, 'Componente', cbComponente, '-', 'Ejercicio', cbEjercicio, '->', btnAyuda]


    });

    myView = new Ext.Viewport({
        layout: 'fit',
        items: pAux
    });

} //fin de la funcion cargarInterfaz

function limpiar()
{
    if ((filtroscalculoraciones.getFiltrosActivos()[0] != undefined || filtroscalculoraciones.getFiltrosActivos().length != 0))
        filtroscalculoraciones.clearFilters();

}

function limpiarfiltrosCN()
{
    if ((filtrosasociaractividades.getFiltrosActivos()[0] != undefined || filtrosasociaractividades.getFiltrosActivos().length != 0))
        filtrosasociaractividades.clearFilters();

}

//function mostrarAyuda(referencia, title) {
//    var title = perfil.etiquetas.lbTituloAyuda;
//    var referencia = 'Calculo de niveles';
//    help.show(title, referencia);
//}

// Funcion para adicionar un record
function addNewRecord() {
    var p = new Fila({
        actividad: '',
        coeficiente: '',
        id: '',
        total: '',
        insertado: true
    });
    grid.stopEditing();
    stRaciones.insert(grid.getStore().getCount(), p);
    grid.startEditing(grid.getStore().getCount() - 1, 0);
}
// Para adicionar un record pasÃ¡ndole una celda seleccionada.
function adicionarModRecordAlServer(rc) {
    grid.setTitle('Balances ');
    if (stRaciones.getModifiedRecords()) {

        recmod = stRaciones.getModifiedRecords();
        rcdatamod = [];
        for (var i = 0; i < recmod.length; i++) {
            rcdatamod[i] = recmod[i].getChanges();
            (recmod[i].data.idsubtipobalancebalance) ? rcdatamod[i].idsubtipobalancebalance = recmod[i].data.idsubtipobalancebalance : '';
            rcdatamod[i].idsubtipobalance = cmbSubtipobalance.getValue();
            rcdatamod[i].idbalance = recmod[i].data.idbalance;
            if (rcdatamod[i].racion == '')
                rcdatamod[i].racion = 0;
            if (rcdatamod[i].coeficiente == '')
                rcdatamod[i].coeficiente = 0;
        }

        Ext.Ajax.request({
            url: 'asociarBalance',
            params: {
                hoja: hoja,
                start: 0,
                limit: 20,
                idtipobalhojaance: cmbTipobalance.getValue(),
                idsubtipobalance: cmbSubtipobalance.getValue(),
                todos: Ext.getCmp('chktodos').getValue(),
                data: Ext.encode(rcdatamod),
                identidad: identidad,
                idconftiponomesp: idconftiponomesp,
                idejercicio: cbEjercicio.getValue(),
            },
            callback: function (options, success, response) {

                responseData = Ext.decode(response.responseText);
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgA == 1) {
                    mostrarMensaje(1, 'El(los) balance(s) ha(n) sido guardado(s) satisfactoriamente.');
                    stRaciones.reload({
                        params: {
                            idtipobalance: cmbTipobalance.getValue(),
                            idsubtipobalance: cmbSubtipobalance.getValue(),
                            todos: Ext.getCmp('chktodos').getValue(),
                            identidad: identidad,
                            hoja: hoja,
                            start: 0,
                            idejercicio: cbEjercicio.getValue(),
                            limit: 20,
                            data: Ext.encode(rcdatamod),
                            idconftiponomesp: idconftiponomesp
                        }
                    });

                    grid.setTitle('Balances ');
                } else
                    mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                stRaciones.commitChanges();
                myMask.hide();
                stRaciones.reload({
                    params: {
                        idtipobalance: cmbTipobalance.getValue(),
                        idsubtipobalance: cmbSubtipobalance.getValue(),
                        todos: Ext.getCmp('chktodos').getValue(),
                        identidad: identidad,
                        hoja: hoja,
                        start: 0,
                        limit: 20,
                        idejercicio: cbEjercicio.getValue(),
                        idconftiponomesp: idconftiponomesp
                    }
                });
                grid.setTitle('Balances ');
            }
        });
        grid.setTitle('Balances ');
    }

}
//Para poner los campos vacÃ­os en cero
function llenarCampos(val, m) {
    if (val == null || val == '0.000' || val == '') {
        return 0;
        m.attr = 'ext:qtip="0"';
    }
    m.attr = 'ext:qtip="' + val + '"';
    return val;


}

function habilitarDesabilitar(bandera)
{
    if (bandera) {
        if (Ext.getCmp('chktodos').getValue() && is_leaf == false)
        {
            btnDesasociarBalance.disable();
            btnAsociarBalance.enable();
        } else if (is_leaf == false) {
            btnAsociarBalance.disable();
            btnDesasociarBalance.enable();
        }
    } else {
        btnAsociarBalance.disable();
        btnDesasociarBalance.disable();
    }
}

function AsociarBalace(asociar)
{
    var urlAsociar;
    (asociar) ? urlAsociar = 'asociarBalance' : urlAsociar = 'desasociarBalance';
    var aux = sm.getSelections();
    var arreglo = [];
    for (var cant = 0; cant < aux.length; cant++) {
        arreglo.push(aux[cant].data.idbalance)
    }
    recmod = stRaciones.getModifiedRecords();
    rcdatamod = [];
    for (var i = 0; i < recmod.length; i++) {
        rcdatamod[i] = recmod[i].getChanges();
        (recmod[i].data.idsubtipobalancebalance) ? rcdatamod[i].idsubtipobalancebalance = recmod[i].data.idsubtipobalancebalance : '';
        rcdatamod[i].idsubtipobalance = cmbSubtipobalance.getValue();
        rcdatamod[i].idbalance = recmod[i].data.idbalance;
        if (rcdatamod[i].racion == '')
            rcdatamod[i].racion = 0;
        if (rcdatamod[i].coeficiente == '')
            rcdatamod[i].coeficiente = 0;
    }
    if (arreglo.length > 0) {
        myMask.show();
        Ext.Ajax.request({
            url: urlAsociar,
            params: {
                idsubtipobalance: cmbSubtipobalance.getValue(),
                idbalance: Ext.encode(arreglo),
                identidad: identidad,
                idconftiponomesp: idconftiponomesp,
                start: 0,
                limit: 20,
                data: Ext.encode(rcdatamod),
            },
            callback: function (options, success, response) {
                myMask.hide();
                responseData = Ext.decode(response.responseText);
                if (msjasociacion == 1) {

                    mostrarMensaje(1, 'El balance ha sido asociado satisfactoriamente.');
                    stRaciones.reload({
                        params: {
                            start: 0,
                            limit: 20,
                            idejercicio: cbEjercicio.getValue(),
                            idtipobalance: cmbTipobalance.getValue(),
                            idconftiponomesp: idconftiponomesp,
                            idsubtipobalance: cmbSubtipobalance.getValue(),
                            todos: Ext.getCmp('chktodos').getValue(),
                            identidad: identidad

                        }
                    });
                    grid.setTitle('Balances ');
                } else if (msjasociacion == 2) {
                    mostrarMensaje(1, 'El balance ha sido desasociado satisfactoriamente.');
                    stRaciones.reload({
                        params: {
                            start: 0,
                            limit: 20,
                            idejercicio: cbEjercicio.getValue(),
                            idtipobalance: cmbTipobalance.getValue(),
                            idconftiponomesp: idconftiponomesp,
                            idsubtipobalance: cmbSubtipobalance.getValue(),
                            todos: Ext.getCmp('chktodos').getValue(),
                            identidad: identidad
                        }
                    });
                    grid.setTitle('Balances ');
                } else
                    mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        });

    }
}
function filtroscalulo() {
    var filtrado_por = "";
    var sep = "/";
    if (filtroscalculoraciones.getFiltrosActivos() == undefined || filtroscalculoraciones.getFiltrosActivos().length == 0) {
        grid.setTitle(perfil.etiquetas.lbSinFiltradoTitle);
    } else {
        for (i = 0; i < filtroscalculoraciones.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtroscalculoraciones.getFiltrosActivos()[i].dataIndex == "denominacion") {//
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtroscalculoraciones.getFiltrosActivos()[i].dataIndex == "descripcion") {//
                aux = perfil.etiquetas.lbDescripcion;
            } else if (filtroscalculoraciones.getFiltrosActivos()[i].dataIndex == "total") {//
                aux = perfil.etiquetas.lbCantidad;
            } else if (filtroscalculoraciones.getFiltrosActivos()[i].dataIndex == "coeficiente") {
                aux = perfil.etiquetas.lbCoeficiente;
            } else if (filtroscalculoraciones.getFiltrosActivos()[i].dataIndex == "racion") {
                aux = 'Nivel';
            }
            if (i == filtroscalculoraciones.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        grid.setTitle('Balances filtrados por : ' + filtrado_por);
        filtrado_por = "";
    }
}

function AbilitarCombos() {
    if ((cbEjercicio.selectIndex() != 0)) {
        cbComponente.disable = false;
    }


}

function actualizararbol(arbol, valor) {

    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
            arbol.getSelectionModel().getSelectedNode().reload({
                params: {
                    valor: valor
                }
            });
        }
    } else
        arbol.root.reload({
            params: {
                valor: valor
            }
        });
}


function habilitarDeshabilitarCN(x)
{
    if (x) {
        if (Ext.getCmp('chktodasact').getValue())
        {
            btnDesasociarCN.disable();
            btnAsociarCN.enable();
        } else {
            btnAsociarCN.disable();
            btnDesasociarCN.enable();
        }
    } else {
        btnAsociarCN.disable();
        btnDesasociarCN.disable();
    }
}

function AsociarCN(asociar)
{
    var urlAsociarCN;
    (asociar) ? urlAsociarCN = 'asociarCN' : urlAsociarCN = 'desasociarCN';
    var aux = gpAsociarAct.getSelectionModel().getSelections();
    var arreglo = new Array();
    for (var i = 0; i < aux.length; i++) {
        arreglo.push(aux[i].data.idactividad);
    }
    if (arreglo.length > 0) {
        myMask.show();
        Ext.Ajax.request({
            url: urlAsociarCN,
            params: {
                idsubtipobalancebalance: smgeneral.idsubtipobalancebalance,
                racion: smgeneral.racion,
                identidad: identidad,
                todos: Ext.getCmp('chktodasact').getValue(),
                actividades: Ext.encode(arreglo),
                idEjercicio: Ext.getCmp('cbEjercicio').getValue()
            },
            callback: function (options, success, response) {
                myMask.hide();
                responseData = Ext.decode(response.responseText);
                if (msjasociacionact == 1) {
                    mostrarMensaje(1, 'El resultado del cálculo de niveles ha sido asociado satisfactoriamente.');
                    stGpAsociarAct.reload({
                        params: {
                            idsubtipobalancebalance: smgeneral.idsubtipobalancebalance,
                            racion: smgeneral.racion,
                            identidad: identidad,
                            todos: Ext.getCmp('chktodasact').setValue(false),
                            actividades: Ext.getCmp('gpAsociarAct').getSelectionModel().getSelections(),
                            idEjercicio: Ext.getCmp('cbEjercicio').getValue()
                        }
                    });
                    grid.setTitle('Asociar a actividades');
                } else if (msjasociacionact == 2) {
                    mostrarMensaje(1, 'El resultado del cálculo de niveles ha sido desasociado satisfactoriamente.');
                    stGpAsociarAct.reload({
                        params: {
                            idsubtipobalancebalance: smgeneral.idsubtipobalancebalance,
                            racion: smgeneral.racion,
                            identidad: identidad,
                            todos: Ext.getCmp('chktodasact').setValue(false),
                            actividades: Ext.getCmp('gpAsociarAct').getSelectionModel().getSelections(),
                            idEjercicio: Ext.getCmp('cbEjercicio').getValue()
                        }
                    });
                    grid.setTitle('Asociar a actividades');
                } else
                    mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        });

    }
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function siexisteactividades() {
    if (stGpAsociarAct.getCount() == 0 && Ext.getCmp('chktodasact').getValue()) {
        mostrarMensaje(1, 'La entidad no posee actividades normadas, aprobadas o activas en el año en curso.');
    }
}

