/*---------------------------------------------------------------------*/
/*----------------------Liván A Capote Valdéz--------------------------*/
/*---------------------------------------------------------------------*/
var winIns, winMod, winRegular;
var idconceptonivel, busquedaNivel;
var cambio = false;

var isOpenW = false;
UCID.portal.cargarEtiquetas('gestconceptonivel', cargarInterfaz);
// 1. Inicializo el singlenton QuickTips
Ext.QuickTips.init();
// 2.funcion para cargar la interfaz
function cargarInterfaz(perfil, labels) {
    var filtrodenominacion, filtrofechaini, filtrofechafin;
    var busquedaNivelEstructural = false;
    var filter, action,winKeyMap;

    actionValidate.validate();

    /*----------------------------------------------------------------------------*/
    /*--------------------------El ProgressBar------------------------------------*/
    var pbLoad = new Ext.ProgressBar({
        text: labels.ldgMsg, // perfil.etiquetas.lbPbLoad,
        id: 'pbar2',
        cls: 'custom'
    });
    /*----------------------------------------------------------------------------*/
    /*-----------------La ventana  que tiene el ProgressBar-----------------------*/
    var wnLoad = new Ext.Window({
        title: labels.lbLoading, // perfil.etiquetas.lbTitWnLoad,
        layout: 'fit',
        width: 300,
        height: 50,
        constrain:true,
        closable: false,
        resizable: false,
        modal: true,
        items: [pbLoad],
        closeAction: 'hide',
        listeners: {
            show: function () {
                pbLoad.text = labels.lbLoading // perfil.etiquetas.lbPbLoad;
                pbLoad.wait({
                    interval: 200,
                    increment: 15,
                    fn: function () {
                    }
                });

            },
            hide: function () {
                pbLoad.reset();
            }
        }
    });

    /* HotKeys */
    mapDel = new Ext.KeyMap(document, [{
        key: Ext.EventObject.DELETE,
        fn: function () {
            var btn = btnEliminar;
            if (sm.hasSelection() && !btn.disabled && !btn.hidden)
                btn.handler.call();
        }
    }]);

    mapAll = new Ext.KeyMap(document, [{
        key: 'm',
        alt: true,
        fn: function () {
            var btn = btnModificar;
            if (!isOpenW && sm.hasSelection() && !btn.disabled && !btn.hidden)
                btn.handler.call()   }
    }, {
        key: 'i',
        alt: true,
        fn: function () {
            var btn = btnAdicionar;
            if (!isOpenW && !btn.disabled && !btn.hidden) {
                btn.handler.call();
            }
        }
    }/*, {
        key: 'h',
        alt: true,
        fn: function () {
            if (!isOpenW) {
                var title = labels.title1;
                var referencia = 'confin/Configuracion/DP/nivelestructural';
                help.show(title, referencia);
            }
        }
    }*/, {
        key: 'b',
        alt: true,
        fn: function () {
            if (!isOpenW && !btn_Buscar.disabled) {
                btn_Buscar.handler.call();
            }
        }
    }, {
        key: 'l',
        alt: true,
        fn: function () {
            if (!btnLimpiar.disabled && btnLimpiar.isVisible()) {
                btnLimpiar.handler.call();
            }
        }
    }]);

    /*---------------------------------------------------------------------*/
    /*-----------------------Declaración de botones------------------------*/
    var btnAdicionar = new Ext.Button({
        id: 'btnAddNivelEstructural',
        iconCls: 'adicionar',
        hidden: true,
        text: labels.lbBtnAdicionar,
        tooltip: labels.ttBtnAdicionar,
        handler: function () {
            isOpenW = true;
            winForm('Ins');
        }
    });

    var btnModificar = new Ext.Button({
        disabled: true,
        id: 'btnModNivelEstructural',
        iconCls: 'modificar',
        hidden: true,
        text: labels.lbBtnModificar,
        tooltip: labels.ttBtnModificar,
        handler: function () {
            isOpenW = true;
            winForm('Mod');
        }
    });
    var btnEliminar = new Ext.Button({
        disabled: true,
        hidden: true,
        id: 'btnDelNivelEstructural',
        iconCls: 'eliminar',
        text: labels.lbBtnEliminar,
        tooltip: labels.ttBtnEliminar,
        handler: function () {
            isOpenW = true;
            eliminarAplicacion();
        }
    });

    var btnAyuda = new Ext.Button({
        disabled: false,
        id: 'btnAyudaConceptonivel',
        tooltip: labels.toolAyuda,
        nextTab: 'tfFiltroNombre',
        iconCls: 'ayuda',
        text: labels.lbBtnAyuda
        /*handler: function () {
            var title = labels.title2;
            var referencia = 'CG/dpa/gestnivelestructural';
            help.show(title, referencia);
        }*/
    });

    /*---------------------------------------------------------------------*/
    /*----------Establesco modo de seleccion de grid (single)--------------*/
    var sm = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        defaultSortable: true,
        listeners: {
            selectionchange: function () {
                if (sm.hasSelection()) {
                    btnModificar.enable();
                    btnEliminar.enable();

                } else {
                    btnModificar.disable();
                    btnEliminar.disable();

                }
            },
            rowselect: function (selectioModel, rowIndex, record) {
                Ext.getCmp('idgpConcepto').getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (selectioModel, rowIndex, record) {
                Ext.getCmp('idgpConcepto').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });
    /*---------------------------------------------------------------------*/
    /*--------------------Store del Grid de Aplicaciones-------------------*/
    var stConcepto = new Ext.data.Store({
        url: 'cargardatos',
        autoFilter: 'btnAddNivelEstructural',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "root",
            id: "idconceptonivel"
        }, [{
            name: 'idconceptonivel'
        }, {
            name: 'denominacion'
        }, {
            name: 'descripcion'
        }, {
            name: 'fechaini'
        }, {
            name: 'fechafin'
        }])
    });


    /*----------------------------------------------------------------------------*/
    /*------------------------Declaración de los filtros-------------------------*/
    var btn_Buscar = new Ext.Button({
        iconCls: 'buscar',
        id: "btn_Buscarr",
        disabled: true,
        nextTab: "btn_Limpiar",
        tooltip: labels.ttBtnSearch,
        text: labels.lbBtnSearch,
        handler: function () {
            /*if (btn_Buscar.disabled == false) {
             if (!(dfFiltroFechainicio.getRawValue()) && !(dfFiltroFechafin.getRawValue()) && tfFiltroNombre.getValue().length == 0) {
             Ext.getCmp('btn_Buscarr').enable();
             Ext.getCmp('btn_Limpiar').hide();
             dfFiltroFechainicio.reset();
             dfFiltroFechainicio.blur();
             dfFiltroFechainicio.clearInvalid();
             dfFiltroFechafin.reset();
             dfFiltroFechafin.blur();
             dfFiltroFechafin.clearInvalid();
             } else
             {
             isOpenW = true;
             busquedaNivelEstructural = true;
             searchFiltroo();
             }

             }*/
            isOpenW = true;
            filter = true;
            busquedaNivelEstructural = true;
            searchFiltroo();
        }
    });

    var btnLimpiar = new Ext.Button({
        iconCls: 'limpiar',
        id: "btn_Limpiar",
        hidden: true,
        disabled: false,
        nextTab: "btnAddNivelEstructural",
        tooltip: labels.ttBtnClean,
        text: labels.lbBtnClean,
        handler: function () {
            isOpenW = true;
            btnAdicionar.focus();
            busquedaNivelEstructural = false;
            limpiarFiltro();
            filter = false;
        }
    });


    function limpiarFiltro() {
        dfFiltroFechainicio.reset();
        dfFiltroFechafin.reset();
        tfFiltroNombre.reset();
        filtrodenominacion = '';
        filtrofechaini = dfFiltroFechainicio.getRawValue();
        filtrofechafin = dfFiltroFechafin.getRawValue();
        if (filter) {
            stConcepto.load();
        }
        Ext.getCmp('btn_Limpiar').hide();
        Ext.getCmp('btn_Buscarr').disable();
        isOpenW = false;
    }


    var tfFiltroNombre = new Ext.form.TextField({
        fieldLabel: labels.lbNomencladorName,
        name: 'tfFiltroNombre',
        id: 'tfFiltroNombre',
        nextTab: "dfFiltroFechainicio",
        width: 200,
        emptyText: labels.lbCriteria,
        anchor: '95%',
        colWidth: .2,
        vtype: 'vtnombre',
        maxLength: 255,
        enableKeyEvents: true

    });
    var dfFiltroFechafin = new Ext.form.DateField({
        fieldLabel: labels.lbEndDate,
        width: 200,
        colWidth: .2,
        startDateField: 'dfFiltroFechainicio',
        minText: labels.valid1,
        nextTab: "btn_Buscarr",
        format: 'd/m/Y',
        anchor: '95%',
        name: 'dfFiltroFechafin',
        id: 'dfFiltroFechafin',
        emptyText: labels.lbSelect,
        enableKeyEvents: true,
        maskRe: /^[\d\/]$/,
        invalidText: [labels.textFormato].join(""),
        parseDate: function (v) {
            return (!v || v instanceof Date) ? v : ((v.length == 6 || v.length == 8 || v.length == 10)
            && (Date.parseDate(v, 'd/m/y') || Date.parseDate(v, 'd/m/Y')));
        }
    });

    var dfFiltroFechainicio = new Ext.form.DateField({
        fieldLabel: labels.lbBeginDate,
        width: 200,
        colWidth: .2,
        anchor: '95%',
        endDateField: 'dfFiltroFechafin',
        maxText: labels.valid2,
        nextTab: "dfFiltroFechafin",
        emptyText: labels.lbSelect,
        vtype: 'daterange',
        format: 'd/m/Y',
        name: 'dfFiltroFechainicio',
        id: 'dfFiltroFechainicio',
        maskRe: /^[\d\/]$/,
        enableKeyEvents: true,
        invalidText: [labels.textFormato].join(""),
        parseDate: function (v) {
            return (!v || v instanceof Date) ?
                v : ((v.length == 6 || v.length == 8 || v.length == 10)
            && (Date.parseDate(v, 'd/m/y') || Date.parseDate(v, 'd/m/Y')));
        }
    });

    function searchFiltroo() {
        stConcepto.load();
        isOpenW = false;
    }

    tfFiltroNombre.on({
        keyup: onKeyUp,
        specialkey: function (xfield, xevent) {
            if (Ext.EventObject.getKey() == Ext.EventObject.ENTER && checkSearch()) {
                btn_Buscar.handler.call();
            }
        }
    });
    dfFiltroFechainicio.on(
        {
            keyup: onKeyUp,
            change: onKeyUp,
            specialkey: function (xfield, xevent) {
                if (Ext.EventObject.getKey() == Ext.EventObject.ENTER && checkSearch()) {
                    btn_Buscar.handler.call();
                }
            }
        });


    dfFiltroFechafin.on({
        keyup: onKeyUp,
        change: onKeyUp,
        specialkey: function (xfield, xevent) {
            if (Ext.EventObject.getKey() == Ext.EventObject.ENTER && checkSearch()) {
                btn_Buscar.handler.call();
            }
        }, focus: function () {
            {
                mapDel.disable();
            }
        }
    });


    stConcepto.on({
        load: function (store, records, options) {
            if (store.getTotalCount() != 0) {
                if (!sm.getSelected()) {
                    sm.selectFirstRow();
                }
                Ext.getCmp('btnModNivelEstructural').enable();
                Ext.getCmp('btnDelNivelEstructural').enable();
            } else {
                if (busquedaNivelEstructural) {
                    function recargar(btn) {
                        if (btn == 'ok') {
                            store.load({
                                params: {
                                    start: 0,
                                    limit: 11
                                }
                            });
                            sm.selectFirstRow();
                            busquedaNivelEstructural = false;
                        }
                    }

//                      notifyEvent(gpConcepto.el.dom, labels.lbTtlInformacion, labels.msgNoresult, recargar);
                } else {
//                      notifyEvent(gpConcepto.el.dom, labels.lbTtlInformacion, labels.lbTtlMsgInfo);
                }
                Ext.getCmp('btnModNivelEstructural').disable();
                Ext.getCmp('btnDelNivelEstructural').disable();
            }
        }, beforeload: function (store) {
            if (busquedaNivelEstructural) {
                store.baseParams.filtrodenominacion = tfFiltroNombre.getValue().length > 0 ? tfFiltroNombre.getValue() : null;
                store.baseParams.filtrofechafin = (dfFiltroFechafin.getRawValue()) ? dfFiltroFechafin.getRawValue() : null;
                store.baseParams.filtrofechaini = (dfFiltroFechainicio.getRawValue()) ? dfFiltroFechainicio.getRawValue() : null;
            }
            else {
                store.baseParams.filtrodenominacion = null;
                store.baseParams.filtrofechafin = null;
                store.baseParams.filtrofechaini = null;
            }


        }
    });


    /*---------------------------------------------------------------------*/
    /*-----------------Se define el grid de conceptos-------------------*/
    var expanderNomenclador = new Ext.grid.RowExpander({
        tpl: new Ext.Template(
            '<div style="word-wrap:break-word;white-space:normal;"><p><b>' + labels.lbDescription + '</b>: {descripcion}</p><br/></div>'
        )
    });
    var gpConcepto = new Ext.grid.GridPanel({
        frame: true,
        height: 580,
        border: false,
        stripeRows: true,
        //title: labels.title3,
        id: 'idgpConcepto',
        region: 'center',
        plugins: expanderNomenclador,
        autoScroll: false,
        store: stConcepto,
        autoExpandColumn: 'expandir',
        sm: sm,
        viewConfig: {
            forceFit: true
        },
        loadMask: {
            msg: labels.lbLoading
        },
        columns: [expanderNomenclador, {
            hidden: true,
            hideable: false,
            dataIndex: 'idconceptonivel'
        }, {
            header: labels.lbNomencladorName,
            id: 'expandir',
            width: 200,
            dataIndex: 'denominacion'
        }, {
            header: labels.lbBeginDate,
            width: 85,
            dataIndex: 'fechaini'
        }, {
            header: labels.lbEndDate,
            width: 85,
            dataIndex: 'fechafin'
        }],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: stConcepto,
            displayInfo: true,
            displayMsg: labels.lbDisplayMsg,
            emptyMsg: '0 Resultado a mostrar',//labels.lbEmptyMsg,
            firstText: 'Primera P&aacute;gina',
            lastText: '&Uacute;ltima P&aacute;gina'
        })
    });
    /*---------------------------------------------------------------------*/
    /*------------------------Se define el panel--------------------------*/

    var formfiltro = new Ext.FormPanel({
        layout: 'column',
        region: 'north',
        cls: 'x-toolbar',
        frame: true,
        defaults: {
            layout: 'form',
            border: false,
            labelAlign: 'top',
            labelWidth: 50,
            buttonAlign: 'right'
        },
        height: 65,
        bodyBorder: false,
        border: false,
        autoShow: true,
        hideBorders: true,
        items: [{
            layout: 'form',
            columnWidth: .2,
            items: [tfFiltroNombre]
        }, {
            style: 'margin:0 0 0 10',
            columnWidth: .2,
            layout: 'form',
            items: [dfFiltroFechainicio]
        }, {
            style: 'margin:0 0 0 10',
            layout: 'form',
            columnWidth: .2,
            items: [dfFiltroFechafin]
        }, {
            columnWidth: '35px',
            layout: 'form',
            style: 'margin:19 0 0 5',
            items: [btn_Buscar]
        }, {
            columnWidth: '35px',
            layout: 'form',
            style: 'margin:19 0 0 5',
            items: [btnLimpiar]
        }]
    });

    var panel = new Ext.Panel({
        //frame : true,
        layout: 'border',
        listeners: {
            render: function () {
                btnAdicionar.focus(false, 1000);
            }
        },
        items: [/*new Ext.ToolBar.searchToolBar({
         elementos: [tfFiltroNombre, dfFiltroFechainicio, dfFiltroFechafin],
         botones: [btn_Buscar, btnLimpiar]
         }),*/formfiltro, gpConcepto],
        tbar: [btnAdicionar, btnModificar, btnEliminar, /*'-',*/ '->', btnAyuda]
    });
    /*---------------------------------------------------------------------*/
    /*------------------------Se define el viwport--------------------------*/
    var vpGestSistema = new Ext.Viewport({
        layout: 'fit',
        items: [panel]
    });
    /*---------------------------------------------------------------------*/
    /*--------------------Se manda a cargar el store----------------------*/
    stConcepto.load();
    /*----------------------------------------------------------------------------*/
    /*------------------------Componentes del formulario--------------------------*/
    var fechainicio = new Ext.form.DateField({
        fieldLabel: labels.lbBeginDate,
        anchor: '95%',
        name: 'fechaini',
        id: 'fechaini',
        format: 'd/m/Y',
        emptyText: labels.lbSelect,
        endDateField: 'fechafin',
        vtype: 'daterange',
        maxText: labels.valid3,
        allowBlank: false,
        maskRe: /^[\d\/]$/,
        value: new Date(),
        invalidText: [labels.textFormato].join(""),
        enableKeyEvents: true,
        parseDate: function (v) {
            return (!v || v instanceof Date) ? v : ((v.length == 6
            || v.length == 8 || v.length == 10) && (Date
                .parseDate(v, 'd/m/y') || Date
                .parseDate(v, 'd/m/Y')));
        },
        listeners: {
            change: checkWindow,
            keyup: checkWindow
        }
    });
    var fechafin = new Ext.form.DateField({
        fieldLabel: labels.lbEndDate,
        anchor: '95%',
        name: 'fechafin',
        id: 'fechafin',
        startDateField: 'fechaini',
        minText: labels.valid4,
        format: 'd/m/Y',
        readOnly: false,
        enableKeyEvents: true,
        emptyText: labels.lbSelect,
        maskRe: /[\d\/]/,
        invalidText: [labels.textFormato].join(""),
        //---------------------
        parseDate: function (v) {
            return (!v || v instanceof Date) ? v : ((v.length == 6
            || v.length == 8 || v.length == 10) && (Date
                .parseDate(v, 'd/m/y') || Date
                .parseDate(v, 'd/m/Y')));
        },
        listeners: {
            change: checkWindow,
            keyup: checkWindow
        }
    });
    var nombre = new Ext.form.TextField({
        xtype: 'textfield',
        id: 'denominacion',
        fieldLabel: labels.lbNomencladorName,
        name: 'denominacion',
        allowBlank: false,
        vtype: 'vtnombre',
        maxLength: 255,
        anchor: '95%',
        enableKeyEvents: true,
        listeners: {
            keyup: checkWindow
        }
    });
    var col1_FormNomenclador = {
        columnWidth: .80,
        layout: 'form',
        items: [{
            xtype: 'hidden',
            id: 'idconceptonivel',
            name: 'idconceptonivel'
        },nombre, {
            xtype: 'textarea',
            fieldLabel: labels.lbNomencladorDescription,
            name: 'descripcion',
            allowBlank: false,
            vtype: 'vtdescripciones',
            height: 200,
            maxLength: 255,
            anchor: '95%',
            id: 'descripcion',
            enableKeyEvents: true,
            listeners: {
                keyup: checkWindow
            }
        }, fechainicio, fechafin]
    };

    /*---------------------------------------------------------------------*/
    /*--------Se define el formulario para adicionar una situación--------*/
    var fpSituacion = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        height: 390,
        bodyStyle: 'padding:5px 5px 0',
        items: [col1_FormNomenclador]

    });
    /*----------------------------------------------------------------------------*/
    /*------------------------------Se define las ventanas------------------------*/
    var winIns, winMod;

    /*----------------------------------------------------------------------------*/
    /*--Switch para cargar las ventanas en dependencia de lo que pida el usuario--*/
    function winForm(opcion) {
        if (!winKeyMap) {
            winKeyMap = new Ext.KeyMap(Ext.getBody(), [
                {
                    key: Ext.EventObject.ENTER,
                    fn: function () {
                        if (action == 'adicionar') {
                            if (isOpenW && !Ext.getCmp('idAddAceptar').disabled) {
                                Ext.getCmp('idAddAceptar').handler.call();
                            }
                        } else {
                            if (isOpenW && !Ext.getCmp('idModAceptar').disabled) {
                                Ext.getCmp('idModAceptar').handler.call();
                            }
                        }
                    }
                }/*, {
                    key: "p",
                    alt: true,
                    ctrl: true,
                    fn: function () {
                        if (action == 'adicionar' && isOpenW && !Ext.getCmp('idAddAplicar').disabled) {
                            Ext.getCmp('idAddAplicar').handler.call();
                        }
                    }
                }, {
                    key: "x",
                    alt: true,
                    fn: function () {
                        if (isOpenW) {
                            winKeyMap.disable();
                            if (action == 'adicionar') {
                                Ext.getCmp('idAddCancelar').handler.call();
                            } else {
                                Ext.getCmp('idModCancelar').handler.call();
                            }
                        }
                    }
                }*/
            ]);
        } else {
            winKeyMap.enable();
        }
        commonListeners = {
            hide: function () {
                btnAdicionar.focus();
                mapAll.enable();
                mapDel.enable();
                isOpenW = false
                if (action == 'adicionar') {
                    Ext.getCmp('idAddAplicar').disable();
                    Ext.getCmp('idAddAceptar').disable();
                } else {
                    Ext.getCmp('idModAceptar').disable();
                }
            },
            show: function () {
                mapAll.disable();
                mapDel.disable();
                if (action == 'adicionar') {
                    winIns.focus();
                } else {
                    winMod.focus();
                }
            }
        };
        switch (opcion) {
            /*-------------Caso para insertar un concepto----------*/
            case 'Ins' :
            {
                action = 'adicionar';
                if (!winIns) {
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: labels.lbAddNomenclador,
                        firstElement:nombre,
                        listeners: commonListeners,
                        constrain:true,
                        keys:winKeyMap,
                        width: 390,
                        height: 480,
                        defaultButton: 'idAddCancelar',
                        buttons: [{
                            iconCls: 'cancelar',
                            id: 'idAddCancelar',
                            text: labels.lbBtnCancel,
                            tooltip: labels.ttBtnCancel,
                            handler: function () {
                                winIns.hide();
                            }
                        }, {
                            iconCls: 'aplicar',
                            id: 'idAddAplicar',
                            tooltip: labels.ttBtnApply,
                            disabled: true,
                            handler: function () {
                                crearSituacion(true);
                            },
                            text: labels.lbBtnApply
                        }, {
                            iconCls: 'aceptar',
                            id: 'idAddAceptar',
                            disabled: true,
                            tooltip: labels.ttBtnAccept,
                            handler: function () {
                                crearSituacion(false);
                            },
                            text: labels.lbBtnAccept
                        }]
                    });
                }
                winIns.show();
                fpSituacion.getForm().reset();
                winIns.add(fpSituacion);
                winIns.doLayout();
            }
                break;
            /*---------------Caso para modificar una situación-------------*/
            case 'Mod' :
            {
                action = 'modificar';
                if (!winMod) {
                    winMod = new Ext.Window({
                        modal: true,
                        closeAction: 'hide',
                        layout: 'fit',
                        title: labels.lbUpdNomenclador,
                        firstElement:nombre,
                        listeners: commonListeners,
                        keys:winKeyMap,
                        constrain:true,
                        width: 390,
                        height: 480,
                        defaultButton: 'idModCancelar',
                        buttons: [{
                            iconCls: 'cancelar',
                            id: 'idModCancelar',
                            text: labels.lbBtnCancel,
                            tooltip: labels.ttBtnCancel,
                            handler: function () {
                                winMod.hide();
                            }
                        },
                            {
                                iconCls: 'aceptar',
                                id: 'idModAceptar',
                                disabled: true,
                                tooltip: labels.ttBtnAccept,
                                handler: function () {
                                    modificarsituacion();
                                },
                                text: labels.lbBtnAccept
                            }]
                    });
                }
                winMod.show();
                winMod.add(fpSituacion);
                winMod.doLayout();
                fpSituacion.getForm().loadRecord(sm.getSelected());
                fpSituacion.getForm().setValues({
                    'denominacion': fpSituacion.getForm().getValues().denominacion.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                    'fechaini': sm.getSelected().data.fechaini.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                    'fechafin': sm.getSelected().data.fechafin ? sm.getSelected().data.fechafin.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') : null
                });
            }
                break;

        }
    }

    /*----------------------------------------------------------------------------*/
    /*------------------Función para buscar una situación-------------------------*/
    function buscarSituacion(aAlias) {
        stConcepto.load({
            params: {
                alias: aAlias,
                start: 0,
                limit: 20
            }
        });
    }

    /*----------------------------------------------------------------------------*/
    /*-------------Función para mostrar todas las conceptos-----------------------*/
    function mostrarTodos() {
        stConcepto.load({
            params: {
                start: 0,
                limit: 20
            }
        });
        sm.clearSelections();
    }

    /*----------------------------------------------------------------------------*/
    /*---------------------Función para insertar una concepto--------------------*/
    function crearSituacion(apl) {

        if (fpSituacion.getForm().isValid()) {
            //Secodena.mostrarMascara('mask-add-nom', labels.lbPeaseWait, labels.waitSavingNom);
            Ext.Msg.wait(labels.waitSavingNom, labels.lbPeaseWait);
            panel.disable();
            delSpaces();
            fpSituacion.getForm().submit({
                url: 'adicionar',
                failure: function (form, action) {
                    panel.enable();
                    Ext.Msg.hide();
                    switch (action.result.codMsg) {
                        case -1 :
                            mostrarMensaje(1, labels.msgNivelEstructuralAdd);
                            stConcepto.reload();
                            fpSituacion.getForm().reset();
                            sm.clearSelections();
                            panel.enable();
                            btnAdicionar.focus();
                            if (!apl){
                                winIns.hide();
                            }else{
                                Ext.getCmp('idAddAplicar').disable();
                                Ext.getCmp('idAddAceptar').disable();
                            }
                            break;
                        case -2 :
                            mostrarMensaje(1, labels.msgNivelEstrucExiste);
                            break;
                        default:
                            mostrarMensaje(1, labels.msgLlenarCampoDenominacion);
                            break;
                    }
                }
            });
        }
        else {
            mostrarMensaje(1, labels.msgCamposIncorrectos);
        }


    }

    /*----------------------------------------------------------------------------*/
    /*------------------------Función para modificar un concepto------------------*/
    function modificarsituacion() {
        if (fpSituacion.getForm().isValid()) {
            //Secodena.mostrarMascara('mask-add-nom', labels.lbPeaseWait, labels.waitSavingNomenclador);
            Ext.Msg.wait(labels.waitSavingNom, labels.lbPeaseWait);
            delSpaces();
            panel.disable();
            fpSituacion.getForm().submit({
                url: 'modificar',
                failure: function (form, action) {
                    panel.enable();
                    Ext.Msg.hide();
                    switch (action.result.codMsg) {
                        case -1 :
                            mostrarMensaje(1, labels.msgNivelEstructuralMod);
                            stConcepto.reload();
                            winMod.hide();
                            sm.clearSelections();
                            panel.enable();
                            btnAdicionar.focus();
                            break;
                        case -2 :
                            mostrarMensaje(1, labels.msgNivelEstrucExiste);
                            break;
                        default:
                            mostrarMensaje(action.result.codMsg, labels.msgNivelEstructuralDel);
                            break;
                    }
                }
            });
        }
        else {
            mostrarMensaje(1, labels.msgCamposIncorrectos);
        }
    }

    /*----------------------------------------------------------------------------*/
    /*--------------------Función para eliminar un concepto-----------------------*/
    function eliminarAplicacion() {
        mostrarMensaje(2, labels.lbConfirmDelNom, eliminar)
        function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {
                //Secodena.mostrarMascara('mask-del-nom', labels.lbPeaseWait, labels.waitDeletingNom);
                Ext.Msg.wait(labels.waitDeletingNom, labels.lbPeaseWait);
                panel.disable();
                Ext.Ajax.request({
                    url: 'eliminar',
                    method: 'POST',
                    params: {
                        idconceptonivel: sm.getSelected().id
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        Ext.Msg.hide();
                        stConcepto.reload();
                        sm.clearSelections();
                        panel.enable();
                        btnAdicionar.focus();
                        if (responseData.codMsg == -1)
                            mostrarMensaje(1, labels.msgNivelEstrucDel);
                        if (responseData.codMsg == -2)
                            mostrarMensaje(1, labels.msNivelEstructuralDelEnUso);
                        if (responseData.codMsg == -3)
                            mostrarMensaje(1, labels.msgNivelEstructuralDel);

                    }
                });
            } else {
                btnAdicionar.focus();
            }
            isOpenW = false;
        }
    }

    function checkSearch() {
        var valido = false;
        if (formfiltro.getForm().isValid() && ((tfFiltroNombre.getValue() != '') ||
            (dfFiltroFechainicio.getValue() != '') || (dfFiltroFechafin.getValue() != ''))) {
            valido = true;
        }
        return valido;
    }

    function onKeyUp() {
        if (checkSearch()) {
            btn_Buscar.enable();
            btnLimpiar.show();
        } else {
            btn_Buscar.disable();
            btnLimpiar.hide();
            if (filter) {
                btnLimpiar.handler.call();
            }
        }
    }

    function changedForm() {
        var newValues = fpSituacion.getForm().getValues();
        var oldValues = sm.getSelected().data;
        var changed = false;
        for (k in newValues) {
            /*console.log(k);
             console.log(newValues[k]);
             console.log(oldValues[k]);
             console.log(newValues[k]);*/
            if ((!Ext.isEmpty(newValues[k]) && !Ext.isEmpty(oldValues[k])) || (!Ext.isEmpty(newValues[k]) && Ext.isEmpty(oldValues[k]) && newValues[k] != 'Seleccione...') || (Ext.isEmpty(newValues[k]) && !Ext.isEmpty(oldValues[k]) && newValues[k] != 'Seleccione...')) {
                if (newValues[k] != oldValues[k].replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')) {
                    changed = true;
                    break;
                }
            }
        }
        return changed;
    }

    function checkWindow() {
        if (fpSituacion.getForm().isValid()) {
            if (action == 'modificar' && changedForm()) {
                Ext.getCmp('idModAceptar').enable();
            } else if (action == 'adicionar') {
                Ext.getCmp('idAddAceptar').enable();
                Ext.getCmp('idAddAplicar').enable();
            } else {
                Ext.getCmp('idModAceptar').disable();
            }
        } else {
            if (action == 'adicionar') {
                Ext.getCmp('idAddAplicar').disable();
                Ext.getCmp('idAddAceptar').disable();
            }else{
                Ext.getCmp('idModAceptar').disable();
            }

        }
    }

    function delSpaces() {
        fpSituacion.getForm().setValues({
            denominacion: Ext.getCmp('denominacion').getValue().trim(),
            descripcion: Ext.getCmp('descripcion').getValue(),
            fechafin: fechafin.getValue(),
            fechaini: fechainicio.getValue(),
            idconceptonivel: Ext.getCmp('idconceptonivel').getValue()
        });
    }

    function notifyEvent(animateTarget, title, msg, icon, time, callback) {
        var notification = new Ext.Cont.Notification({
            animateTarget: animateTarget,
            fnc: (callback) ? callback : Ext.emptyFn,
            iconbox: icon,
            iconCls: "icon-waiting",
            title: title,
            html: msg,
            hideDelay: (time) ? time : 5000
        });
        notification.box();
    }

    btnAdicionar.focus();


}