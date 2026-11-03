var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('gestconfigurardesglose', cargarInterfaz);
var objci = {};
var temp = 0, offsetDesg = 0, offset = 0;
var valelim = 0;
objci.acciones = [];
var esrector = false;
function cargarInterfaz() {
    Ext.Ajax.timeout = 1000000000;
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function () {
        for (i in acciones_reportes) {
            objci.acciones[acciones_reportes[i].abreviatura] = true;
        }
        esrector = ((objci.acciones.rector == undefined) ? false : true);
    })

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbEspere
    });
    Ext.apply(Ext.form.VTypes, {
        validarEspaciosEnBlanco: function (value, field) {
            return (!(/^\s+|\s+$/.test(value)));
        },
        validarEspaciosEnBlancoText: perfil.etiquetas.msgEspaciosBlancos
    });
    denominacionDesglose = new Ext.form.TextField({
        xtype: 'textfield',
        prevTab: 'btnaceptar1',
        id: 'denominacionDesglose',
        fieldLabel: perfil.etiquetas.lbDenominacion,
        anchor: '100%',
        maxLength: 100,
        maxLengthText: perfil.etiquetas.msgMaxLengthTextdenominacionDesglose,
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-])+$/,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ_-])$/, allowBlank: false,
        blankText: perfil.etiquetas.lbCampoObligatorio,
        regexText: perfil.etiquetas.lbregexText,
        vtype: 'validarEspaciosEnBlanco'
    });
    descripcionDesglose = new Ext.form.TextArea({
        xtype: 'textarea',
        id: 'descripcionDesglose',
        maxLength: 255,
        maxLengthText: perfil.etiquetas.msgMaxLengthTextdescripcionDesglose,
        anchor: '100%',
        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-])+$/,
        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ_-])$/,
        regexText: perfil.etiquetas.lbregexText,
        fieldLabel: perfil.etiquetas.lbDescripccion
    });
    btnDelDesglose = new Ext.Button({
        id: 'btnDelDesglose',
        iconCls: 'eliminar',
        disabled: true,
        tooltip: perfil.etiquetas.lbTtbtnEliminarDesglose,
        handler: function () {
            eliminarVariosDesgloses();
        }
    });
    btnSiguiente = new Ext.Button({
        disabled: true,
        id: 'btnsiguiente',
        tooltip: perfil.etiquetas.lbAsociarNomenclador,
        style: 'margin-left:11px;margin-top:120px',
        iconCls: 'siguiente',
        handler: function () {
            addnomenclador();
        }
    });
    btnAnterior = new Ext.Button({
        disabled: true,
        id: 'btnAnterior',
        tooltip: perfil.etiquetas.lbDesasociarNomenclador,
        style: 'margin-left:11px;margin-top:5px',
        iconCls: 'anterior',
        handler: function () {
            eliminarnom();
        }
    });
    btnSubir = new Ext.Button({
        disabled: true,
        id: 'btnSubir',
        style: 'margin-left:10px;margin-top:120px',
        iconCls: 'arriba',
        tooltip: perfil.etiquetas.lbAumentarOrden,
        handler: function () {
            Ordenar('up');
        }
    });
    btnBajar = new Ext.Button({
        disabled: true,
        tooltip: perfil.etiquetas.lbDisminuirOrden,
        id: 'btnBajar',
        style: 'margin-left:10px;margin-top:5px',
        iconCls: 'abajo',
        handler: function () {
            Ordenar('down');
        }
    });
    /*************TECLAS CALIENTES************/
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ll',
            alt: true,
            fn: function () {
            }
        }, {
            key: 'Ii',
            alt: true,
            fn: function () {
                if (valelim == 0)
                    winAddDesglose.show();
            }
        }, {
            key: 'Hh',
            alt: true,
            fn: function () {
                // mostrarAyuda();
            }
        }, {
            key: 46,
            fn: function () {
                eliminarVariosDesgloses();
            }
        },
    ]);
    /*************FIN TECLAS CALIENTES************/

    cmNomencladores = new Ext.grid.ColumnModel([{
        id: 'expandir',
        header: perfil.etiquetas.lbDenominacion,
        tooltip: perfil.etiquetas.lbDenominacion,
        dataIndex: 'denominacion',
        sortable: true,
        renderer: crearToolTip
    }, {
        width: 300,
        header: perfil.etiquetas.lbDescripccion,
        tooltip: perfil.etiquetas.lbDescripccion,
        sortable: true,
        dataIndex: 'descripcion',
        hidden: true,
        renderer: crearToolTip
    }]);
    smNomencladores = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    smNomencladores.on('selectionchange', function (sm) {
        btnDelDesglose.enable();
        if (smNomencladores.getSelected()) {
            btnSiguiente.enable();
        } else {
            btnSiguiente.disable();
        }
    });
    stNomen = new Ext.data.Store({
        url: 'listarTipoNomenclador',
        enableKeyEvents: true,
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idtiponomenclador'
        }, [{
            name: 'idtiponomenclador'
        }, {
            name: 'denominacion'
        }, {
            name: 'descripcion'
        }])
    });
    gpNomencladores = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.msgEspere
        },
        title: perfil.etiquetas.lbNomencladores,
        id: 'stNomencladoresUsados',
        store: stNomen,
        sm: smNomencladores,
        cm: cmNomencladores,
        region: 'east',
        autoExpandColumn: 'expandir',
        height: 295,
        width: 120,
        margins: '2 2 2 2',
        anchor: '100%',
        listeners: {
            rowdblclick: function () {
                addnomenclador();
            }
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stNomen,
            displayInfo: true
        })
    });
    cmNomencladoresUsados = new Ext.grid.ColumnModel([{
        id: 'expandir',
        header: perfil.etiquetas.lbDenominacion,
        tooltip: perfil.etiquetas.lbDenominacion,
        dataIndex: 'denominacion',
        sortable: true,
        renderer: crearToolTip
    }, {
        width: 50,
        header: perfil.etiquetas.lbOrden,
        tooltip: perfil.etiquetas.lbOrden,
        sortable: true,
        dataIndex: 'orden',
        renderer: crearToolTip
    }]);
    smNomencladoresUsados = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });
    smNomencladoresUsados.on('selectionchange', function (sm) {
        if (smNomencladoresUsados.getSelected()) {
            btnSubir.enable();
            btnBajar.enable();
            btnAnterior.enable();
        } else {
            btnSubir.disable();
            btnBajar.disable();
            btnAnterior.disable();
        }
    });

    stNomencladoresUsados = new Ext.data.Store({
        url: 'listarDatosNomConfigDesglose',
        enableKeyEvents: true,
        autoLoad: true,
        listeners: {
            beforeload: function () {
            },
            load: function () {
                siexisteNomencladoresFiltrado();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idtiponomenclador'
        }, [{
            name: 'idtiponomenclador'
        }, {
            name: 'denominacion'
        }, {
            name: 'descripcion'
        }, {
            name: 'orden'
        }])
    });

    gpNomencladoresUsados = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.msgEspere
        },
        title: perfil.etiquetas.lbNomencladoresUsados,
        id: 'gpNomencladoresUsados',
        store: stNomencladoresUsados,
        sm: smNomencladoresUsados,
        cm: cmNomencladoresUsados,
        region: 'east',
        autoExpandColumn: 'expandir',
        height: 310,
        width: 100,
        listeners: {
            rowdblclick: function () {
                eliminarnom();
            }
        },
        margins: '2 2 2 2',
        anchor: '100%'
    });
    pAddDesgloseNomencladores = new Ext.Panel({
        id: 'pAddDesgloseNomencladores',
        labelAlign: 'top',
        height: 320,
        width: 805,
        frame: true,
        anchor: '100%',
        layout: 'form',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: .45,
                layout: 'form',
                items: [gpNomencladores]
            }, {
                columnWidth: .06,
                layout: 'form',
                items: [btnSiguiente, btnAnterior],
                anchor: '50%'
            }, {
                columnWidth: .45,
                layout: 'form',
                items: [gpNomencladoresUsados]
            }, {
                columnWidth: .04,
                layout: 'form',
                items: [btnSubir, btnBajar],
                anchor: '100%'
            }]
        }]
    });
    pAddDesgloseNorte = new Ext.FormPanel({
        id: 'pAddDesgloseNorte',
        labelAlign: 'top',
        height: 470,
        width: 920,
        frame: true,
        layout: 'form',
        items: [denominacionDesglose, descripcionDesglose, pAddDesgloseNomencladores]
    });

    function showWinAddModDesglose(opcion) {
        switch (opcion) {
            case 'add':
            {
                winAddDesglose = new Ext.Window({
                    modal: true,
                    //id: 'winAddDesglose',
                    closeAction: 'hide',
                    layout: 'fit',
                    resizable: false,
                    width: 900,
                    height: 525,
                    constrain: true,
                    title: perfil.etiquetas.lbTtwinAdicionarDesglose,
                    items: [pAddDesgloseNorte],
                    listeners: {
                        'beforeshow': function () {
                            denominacionDesglose.reset();
                            descripcionDesglose.reset();
                            gpNomencladoresUsados.getStore().removeAll();
                            Ext.getCmp('denominacionDesglose').focus(true, 500);
                        },
                        'move': function (win, x, y) {
                            Ext.getCmp('denominacionDesglose').focus(true, 500);
                        }
                    },
                    buttons: [{
                        iconCls: 'cancelar',
                        tooltip: perfil.etiquetas.lbBtnttCancelar,
                        text: perfil.etiquetas.lbBtnCancelar,
                        handler: function () {
                            winAddDesglose.hide();
                            denominacionDesglose.reset();
                            descripcionDesglose.reset();
                            gpNomencladoresUsados.getStore().removeAll();
                        }
                    }, {
                        iconCls: 'aplicar',
                        text: perfil.etiquetas.lbBtnAplicar,
                        tooltip: perfil.etiquetas.lbBtnttAplicar,
                        handler: function () {
                            adicionarDesglose('aplicar');
                        }
                    }, {
                        iconCls: 'aceptar',
                        nextTab: 'denominacionDesglose',
                        id: 'btnaceptar1',
                        text: perfil.etiquetas.lbBtnAceptar,
                        tooltip: perfil.etiquetas.lbBtnttAceptar,
                        handler: function () {
                            adicionarDesglose('aceptar');
                        }
                    }]
                });
                winAddDesglose.show();
            }
                break;
            case 'mod':
            {
                winAddDesglose = new Ext.Window({
                    modal: true,
                    //id: 'winAddDesglose',
                    closeAction: 'hide',
                    layout: 'fit',
                    resizable: false,
                    width: 900,
                    height: 525,
                    constrain: true,
                    title: perfil.etiquetas.lbTtwinModificarDesglose,
                    items: [pAddDesgloseNorte],
                    listeners: {
                        'beforeshow': function () {
                            Ext.getCmp('denominacionDesglose').focus(true, 500);
                        },
                        'move': function (win, x, y) {
                            Ext.getCmp('denominacionDesglose').focus(true, 500);
                        }
                    },
                    buttons: [{
                        iconCls: 'cancelar',
                        tooltip: perfil.etiquetas.lbBtnttCancelar,
                        text: perfil.etiquetas.lbBtnCancelar,
                        handler: function () {
                            winAddDesglose.hide();
                            denominacionDesglose.reset();
                            descripcionDesglose.reset();
                            gpNomencladoresUsados.getStore().removeAll();
                        }
                    }, {
                        iconCls: 'aceptar',
                        //nextTab: 'denominacionDesglose',
                        id: 'btnaceptar1',
                        text: 'Aceptar',
                        tooltip: perfil.etiquetas.lbTtwinModificarDesglose,
                        handler: function () {
                            adicionarDesglose('modificar');
                        }
                    }]
                });
                winAddDesglose.show();
                denominacionDesglose.setValue(gpConfDesglose.getSelectionModel().getSelected().data.denominacion);
                descripcionDesglose.setValue(gpConfDesglose.getSelectionModel().getSelected().data.descripcion);
                gpNomencladoresUsados.getStore().reload({
                    params: {
                        iddesglose: smConfDesglose.getSelected().data.iddesglose
                    }
                });
            }
                break;
        }
    }

    Fila = Ext.data.Record.create([{
        name: 'idtiponomenclador',
        type: 'string'
    }, {
        name: 'denominacion',
        type: 'string'
    }, {
        name: 'descripcion',
        type: 'string'
    }, {
        name: 'orden',
        type: 'string'
    }]);
    btnAddDesglose = new Ext.Button({
        id: 'btnAddDesglose',
        iconCls: 'adicionar',
        tooltip: perfil.etiquetas.lbTtbtnAdicionarDesglose,
        handler: function () {
            showWinAddModDesglose('add');
            //winAddDesglose.show();
        }
    });
    btnModDesglose = new Ext.Button({
        id: 'btnModDesglose',
        iconCls: 'modificar',
        disabled: true,
        tooltip: perfil.etiquetas.lbTtwinModificarDesglose,
        handler: function () {
            showWinAddModDesglose('mod');
        }
    });


    /**
     * menu del click derecho del grid
     */
    menuDesglose = new Ext.menu.Menu({
        id: 'menuDesglose',
        //disabled: true,
        listeners: {},
        items: [{
            text: 'Eliminar',
            iconCls: 'eliminar',
            id: 'mdEliminarDesglose',
            tooltip: 'Eliminar desglose(s)',
            handler: function () {

            }
        }]
    });
//////aki esta el primer column model
    cmConfDesglose = new Ext.grid.ColumnModel([{
        width: 250,
        header: perfil.etiquetas.lbDenominacion,
        tooltip: perfil.etiquetas.lbDenominacion,
        dataIndex: 'denominacion',
        sortable: true,
        renderer: crearToolTip
    }, {
        width: 180,
        id: 'expandir',
        header: perfil.etiquetas.lbDescripccion,
        tooltip: perfil.etiquetas.lbDescripccion,
        sortable: true,
        dataIndex: 'descripcion',
        renderer: crearToolTip
    }, {
        header: perfil.etiquetas.lbAsociado,
        tooltip: perfil.etiquetas.lbAsociado,
        dataIndex: 'asociado',
        align: 'center',
        width: 60,
        sortable: true,
        renderer: modificarEstado
    }]);
    filterDesgloses = new Ext.grid.GridFilters({
        filters: [{
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'string',
            dataIndex: 'descripcion'
        }, {
            type: 'list',
            options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo],
            dataIndex: 'asociado'
        }]
    });
    smConfDesglose = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function () {
                btnDelDesglose.disable();
                btnModDesglose.disable();
                var long = smConfDesglose.getSelections().length;
                if (long > 1) {
                    btnDelDesglose.enable();
                    btnModDesglose.disable();
                } else {
                    if (smConfDesglose.getSelected().data.asociado != null) {
                        btnDelDesglose.disable();
                        btnModDesglose.disable();
                    } else {
                        btnDelDesglose.enable();
                        btnModDesglose.enable();
                    }
                    if (smConfDesglose.getSelected()) {
                        gpConfNomencladores.getStore().reload({
                            params: {
                                iddesglose: smConfDesglose.getSelected().data.iddesglose
                            }
                        });
                    }
                }
            },
            rowdeselect: function (s, n, r) {
                btnDelDesglose.disable();
                btnModDesglose.disable();
                var long = smConfDesglose.getSelections().length;
                if (long > 1 || long == 1) {
                    btnDelDesglose.enable();
                } else {
                    btnDelDesglose.disable();
                }
                if (long == 1 && smConfDesglose.getSelected().data.asociado != null) {
                    btnDelDesglose.disable();
                    btnModDesglose.disable();
                } else {
                    btnDelDesglose.enable();
                    btnModDesglose.enable();
                }
                if (long == 1 && smConfDesglose.getSelected()) {
                    gpConfNomencladores.getStore().reload({
                        params: {
                            iddesglose: smConfDesglose.getSelected().data.iddesglose
                        }
                    });
                }
                if (long < 1) {
                    btnDelDesglose.disable();
                    btnModDesglose.disable();
                }
            }
        }
    });
    btnLimpiar = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            accionLimpiar();
        }
    });
    stConfDesglose = new Ext.data.Store({
        url: 'listarConfigDesglose',
        enableKeyEvents: true,
        autoLoad: true, listeners: {
            beforeload: function () {
                stConfDesglose.baseParams.start = offsetDesg;
            },
            load: function () {
                siexisteDesgloseFiltrado();
                if (smConfDesglose.getSelections().length != 1)
                    gpConfNomencladores.getStore().removeAll();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'iddesglose'
        }, [{
            name: 'iddesglose'
        }, {
            name: 'denominacion'
        }, {
            name: 'descripcion'
        }, {
            name: 'asociado'
        }])
    });
    gpConfDesglose = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.msgEspere
        },
        title: perfil.etiquetas.lbDesgloses,
        id: 'gpConfDesglose',
        store: stConfDesglose,
        sm: smConfDesglose,
        cm: cmConfDesglose,
        md: menuDesglose,
        plugins: filterDesgloses,
        region: 'west',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        height: 425,
        width: 600,
        margins: '2 2 2 2',
        anchor: '95%',
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'pDesg',
            store: stConfDesglose,
            displayInfo: true,
            items: [btnLimpiar],
            listeners: {
                beforechange: function (p, e) {
                    offsetDesg = e.start;
                }
            }
        }),
        listeners: {
            rowdblclick: function (_this, row_index, record) {
            },
            rowcontextmenu: function (g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());

            }
        }
    });
    cmConfNomencladores = new Ext.grid.ColumnModel([
        {
            width: 300,
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            sortable: true,
            renderer: crearToolTip
        }, {
            width: 60,
            header: perfil.etiquetas.lbOrden,
            tooltip: perfil.etiquetas.lbOrden,
            sortable: true,
            dataIndex: 'orden',
            renderer: crearToolTip
        }, {
            width: 300,
            id: 'expandir',
            header: perfil.etiquetas.lbDescripccion,
            tooltip: perfil.etiquetas.lbDescripccion,
            sortable: true,
            dataIndex: 'descripcion',
            renderer: crearToolTip
        }]);
    smConfNomencladores = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    stConfNomencladores = new Ext.data.Store({
        url: 'listarDatosNomConfigDesglose',
        enableKeyEvents: true,
        //autoLoad: true,
        listeners: {
            beforeload: function () {
                stConfNomencladores.baseParams.start = offset;
                stConfNomencladores.baseParams.iddesglose = smConfDesglose.getSelected().data.iddesglose;
            }, load: function () {
                siexisteNomencladoresFiltrado();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idtiponomenclador'
        }, [{
            name: 'idtiponomenclador'
        }, {
            name: 'denominacion'
        }, {
            name: 'descripcion'
        }, {
            name: 'orden'
        }])
    });
    btnAyu = new Ext.Button({
        disabled: false,
        id: 'btnAyudaConfigurarDesglose',
        iconCls: 'ayuda',
        tooltip: perfil.etiquetas.lbTtbtnAyu,
        text: perfil.etiquetas.lbBtnAyuda
    });
    btnLimpiar2 = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            accionLimpiar2();
        }
    });
    filterDesglosess = new Ext.grid.GridFilters({
        filters: [{
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'string',
            dataIndex: 'descripcion'
        }, {
            type: 'numeric',
            dataIndex: 'orden'
        }]
    });
    gpConfNomencladores = new Ext.grid.GridPanel({
        loadMask: {
            msg: perfil.etiquetas.msgEspere
        },
        title: perfil.etiquetas.lbNomencladores,
        id: 'gpConfNomencladores',
        plugins: filterDesglosess,
        store: stConfNomencladores,
        sm: smConfNomencladores,
        cm: cmConfNomencladores,
        region: 'center',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        height: 425,
        width: 450,
        margins: '2 2 2 2',
        anchor: '100%',
        bbar: new Ext.PagingToolbar({
            //pageSize: 20,
            id: 'pConfNom',
            store: stConfNomencladores,
            displayInfo: true,
            items: [btnLimpiar2],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        })
    });
    pGestDesglose = new Ext.Panel({
        id: 'pGestDesglose',
        height: 450,
        width: 880,
        layout: 'border',
        tbar: [btnAddDesglose, btnModDesglose, btnDelDesglose, '->', btnAyu],
        items: [gpConfNomencladores, gpConfDesglose]
    });
    btnAdicionarDesglose = new Ext.Button({
        id: 'btnAdicionarDesglose',
        iconCls: 'adicionar',
        disabled: true,
        tooltip: perfil.etiquetas.lbTtbtnAdicionarDesglose
    });
    btnEliminarDesglose = new Ext.Button({
        disabled: true,
        id: 'btnEliminarDesglose',
        iconCls: 'eliminar',
        tooltip: perfil.etiquetas.lbTtbtnEliminarDesglose
    });
    btnGuardarDesglose = new Ext.Button({
        disabled: true,
        id: 'btnGuardarDesglose',
        iconCls: 'guardar',
        tooltip: perfil.etiquetas.lbGuardardesglose
    });
    // *********Ayuda****************
    panelEnt = new Ext.Panel({
        id: 'panelEnt',
        region: 'center',
        split: true,
        width: 270,
        layout: 'fit',
        items: [pGestDesglose]
    });
    myView = new Ext.Viewport({
        layout: 'fit',
        listeners: {
            'afterlayout': function () {
                Ext.getCmp('btnAyudaConfigurarDesglose').focus();
            }
        },
        items: new Ext.Panel({
            layout: 'fit',
            items: [panelEnt]
        })
    });
}
//function mostrarAyuda(referencia, title) {
//    var title = perfil.etiquetas.lbTituloAyuda;
//    var referencia = 'Configurar desglose';
//    help.show(title, referencia);
//}
function addnomenclador() {
    var recordsSel = gpNomencladores.getSelectionModel().getSelections();
    if (recordsSel.length > 0 && (Number(stNomencladoresUsados.getCount()) + recordsSel.length) <= 20) {
        temp = 0;
        for (var i = 0; i < recordsSel.length; i++) {
            var p = new Fila({
                idtiponomenclador: recordsSel[i].data.idtiponomenclador,
                denominacion: recordsSel[i].data.denominacion,
                descripcion: recordsSel[i].data.descripcion,
                orden: stNomencladoresUsados.getCount() + 1
            });
            if (!buscarRecord(recordsSel[i].data.idtiponomenclador)) {
                stNomencladoresUsados.add(p);
            } else {
                temp++;
            }
        }
        if (temp > 1)
            mostrarMensaje(1, perfil.etiquetas.msgNomencladoresYaExisten);
        else {
            if (temp == 1) {
                mostrarMensaje(1, perfil.etiquetas.msgNomencladorYaExiste);
            }
        }
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgLimiteNomencladores);
    }
    smNomencladores.clearSelections();
}
function eliminarnom() {
    var recordsSel = gpNomencladoresUsados.getSelectionModel().getSelections();
    if (recordsSel.length > 0) {
        for (var i = 0; i < recordsSel.length; i++) {
            stNomencladoresUsados.remove(recordsSel[i]);
        }
    }
    var index = 0;
    stNomencladoresUsados.data.each(function () {
        stNomencladoresUsados.getAt(index).data.orden = index + 1;
        stNomencladoresUsados.getAt(index).commit();
        index++;
    });
}

function Ordenar(orden) {
    var validacion1, validacion2;
    var decremento, aumento, posicion;
    if (orden == 'up') {
        posicion = -1;
        aumento = -1;
        decremento = 1;
        validacion1 = 'stNomencladoresUsados.getAt(j).data.orden > 1';
        validacion2 = 'j > 0';
    } else {
        posicion = 1;
        aumento = 1;
        decremento = -1;
        validacion1 = 'stNomencladoresUsados.getAt(j).data.orden < stNomencladoresUsados.getCount()';
        validacion2 = 'j < stNomencladoresUsados.getCount()';
    }
    var recordsSel = gpNomencladoresUsados.getSelectionModel().getSelections();
    if (recordsSel.length > 0) {
        for (var i = 0; i < recordsSel.length; i++) {
            for (var j = 0; j < stNomencladoresUsados.getCount(); j++) {
                if (stNomencladoresUsados.getAt(j).data.idtiponomenclador == recordsSel[i].data.idtiponomenclador) {
                    if (eval(validacion1)) {
                        stNomencladoresUsados.getAt(j).set('orden', (Number(stNomencladoresUsados.getAt(j).data.orden) + aumento));
                        if (eval(validacion2))
                            stNomencladoresUsados.getAt(j + posicion).set('orden', (Number(stNomencladoresUsados.getAt(j + posicion).data.orden) + decremento));
                    }
                }
            }
        }
    }
    stNomencladoresUsados.sort('orden', 'ASC');
}

function adicionarDesglose(tipo) {
    //tipo = 'aplicar','aceptar','modificar'
    if (pAddDesgloseNorte.getForm().isValid()) {
        if (stNomencladoresUsados.getCount() != 0) {
            mymask.show();
            array_nomencladores = [];
            for (var i = 0; i < stNomencladoresUsados.getCount(); i++) {
                array_nomencladores.push({
                    idtiponomenclador: stNomencladoresUsados.getAt(i).data.idtiponomenclador,
                    orden: stNomencladoresUsados.getAt(i).data.orden
                })
            }
            iddesglose = null;
            if (tipo == 'modificar')
                iddesglose = gpConfDesglose.getSelectionModel().getSelected().data.iddesglose;
            Ext.Ajax.request({
                url: 'adicionarConfigDesglose',
                params: {
                    iddesglose: iddesglose,
                    denominacion: denominacionDesglose.getValue(),
                    descripcion: descripcionDesglose.getValue(),
                    tiponomencladores_orden: Ext.encode(array_nomencladores)
                },
                callback: function (options, success, response) {
                    gpNomencladoresUsados.getStore().removeAll();
                    mymask.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgM == 2) {
                        mostrarMensaje(1, perfil.etiquetas.msgExiste);
                    } else if (responseData.codMsgM == 1) {
                        mostrarMensaje(1, perfil.etiquetas.msgOk);
                        pAddDesgloseNorte.getForm().reset();
                        if (tipo != 'aplicar')
                            winAddDesglose.hide();
                        stConfDesglose.reload();
                        smNomencladores.deselectRange(0, stNomen.getCount());
                        stNomencladoresUsados.removeAll();
                    } else if (responseData.codMsgM == 3) {
                        mostrarMensaje(1, perfil.etiquetas.msgOkActualizado);
                        pAddDesgloseNorte.getForm().reset();
                        winAddDesglose.hide();
                        stConfDesglose.reload();
                        smNomencladores.deselectRange(0, stNomen.getCount());
                        stNomencladoresUsados.removeAll();
                    } else if (responseData.mensaje != null)
                        mostrarMensaje(1, responseData.mensaje);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgError);
                }
            });
        } else {
            mostrarMensaje(1, perfil.etiquetas.msgAlMenosUnNomenclador);
        }
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgValInc);
    }
}

function eliminarVariosDesgloses() {
    if (gpConfDesglose.getSelectionModel().getSelections().length <= 0) {
        mostrarMensaje(1, perfil.etiquetas.msgSelDes);
    } else {
        var recordsSel = gpConfDesglose.getSelectionModel().getSelections(), desElim = [];
        var uso = true;
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++) {
                if (recordsSel[i].data.asociado != null) {
                    uso = false;
                } else {
                    desElim.push({
                        iddesglose: recordsSel[i].data.iddesglose
                    });
                }
            }
        }
        if (uso == false) {
            mostrarMensaje(1, perfil.etiquetas.msgUtil);
        } else {
            if (recordsSel.length == 1) {
                mostrarMensaje(2, perfil.etiquetas.msgSegElim, eliminarDesglosesSeleccionados);
                valelim = 1;
            } else {
                mostrarMensaje(2, perfil.etiquetas.msgSegElimV, eliminarDesglosesSeleccionados);
                valelim = 1;
            }
        }
    }

    function eliminarDesglosesSeleccionados(btnPresionado) {
        if (btnPresionado == 'ok') {
            mymask.show();
            Ext.Ajax.request({
                url: 'eliminarConfigDesglose',
                params: {
                    conf_desgloses: Ext.encode(desElim)
                },
                callback: function (options, success, response) {
                    mymask.hide();
                    stConfDesglose.reload();
                    stConfNomencladores.reload();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgM == 1) {
                        if (desElim.length == 1)
                            mostrarMensaje(1, perfil.etiquetas.msgElOk);
                        else
                            mostrarMensaje(1, perfil.etiquetas.msgElOkV);
                    } else if (responseData.mensaje != null)
                        mostrarMensaje(1, responseData.mensaje);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgError);
                }
            });
        }
        valelim = 0;
    }
}

function buscarRecord(idtipo) {
    var bandera = false;
    for (var i = 0; i < stNomencladoresUsados.getCount(); i++) {
        if (stNomencladoresUsados.getAt(i).data.idtiponomenclador == idtipo) {
            bandera = true;
            break;
        }
    }
    return bandera;
}
function renderEstInicial(value, m) {
    if (value == 1) {
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        return '<span><center><img src=' + perfil.dirImg + 'tick.png' + '></center></span>';
    }
}
function modificarEstado(val, metaData) {
    if (val == null) {
        metaData.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
        metaData.css = 'icondistra-false rojo';
    } else {
        metaData.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
        metaData.css = 'icondistra-true verde';
    }
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function siexisteDesgloseFiltrado() {
    if (filterDesgloses.getFiltrosActivos().length > 0 && stConfDesglose.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgNoDatos);
}
function siexisteNomencladoresFiltrado() {
    if (filterDesglosess.getFiltrosActivos().length > 0 && stConfNomencladores.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgNoDatos);
}
function accionLimpiar() {
    filterDesgloses.clearFilters();
}
function accionLimpiar2() {
    filterDesglosess.clearFilters();
}