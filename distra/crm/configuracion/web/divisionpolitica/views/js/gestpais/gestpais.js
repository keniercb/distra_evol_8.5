/*
 * Componente para gestinar el nomenclador de paises.
 * 
 * @package configsecodena @copyright UCID Cuba @author Livan A Capote Valdes
 * 
 * @version 1.0-0
 */
//var winIns, winMod, winRegular;
//var isOpenW = false;
//var PaisModificado = false;
//if (window.parent.parent.UCID.portal.perfil)
//    var perfil = window.parent.parent.UCID.portal.perfil;
//else
//    perfil = {};
//etiquetas = Object();
//var idconceptoestructural;
//UCID.portal.cargarEtiquetas('gestpais', cargarInterfaz);
//// 1. Inicializo el singlenton QuickTips
//Ext.QuickTips.init();
//var auxDel;
//var record;
//banderabuscar = 0;
//// 2.funcion para cargar la interfaz
//function cargarInterfaz(perfil, etiquetas) {
//
//    /*----------------------------------------------------------------------------*/
//    /*--------------------------El ProgressBar------------------------------------*/
//    var pbLoad = new Ext.ProgressBar({
//        text: etiquetas.msg,
//        id: 'pbar2',
//        cls: 'custom'
//    });
//    /*----------------------------------------------------------------------------*/
//    /*-----------------La ventana  que tiene el ProgressBar-----------------------*/
//    var wnLoad = new Ext.Window({
//        title: etiquetas.msg,
//        layout: 'fit',
//        width: 300,
//        height: 50,
//        closable: false,
//        resizable: false,
//        modal: true,
//        items: [pbLoad],
//        closeAction: 'hide',
//        listeners: {
//            show: function() {
//                pbLoad.text = etiquetas.msg;
//                pbLoad.wait({
//                    interval: 200,
//                    increment: 15,
//                    fn: function() {
//                    }
//                });
//
//            },
//            hide: function() {
//                pbLoad.reset();
//            }
//        }
//    });
//
//    /*---------------------------------------------------------------------*/
//    /*-----------------------Declaración de botones------------------------*/
//    var btnAdicionar = new Ext.Button({
//        id: 'btnAgr',
//        icon: perfil.dirImg + 'adicionar.png',
//        tooltip: etiquetas.lbttipAddPais,
//        iconCls: 'btn',
//        text: etiquetas.adicionar,
//        handler: function() {
//            isOpenW = true;
//            winForm('Ins');
//        }
//    });
//
//    var btnModificar = new Ext.Button({
//        disabled: true,
//        id: 'btnMod',
//        tooltip: etiquetas.lbttipSetPais,
//        icon: perfil.dirImg + 'modificar.png',
//        iconCls: 'btn',
//        text: etiquetas.modificar,
//        handler: function() {
//            isOpenW = true;
//            winForm('Mod');
//        }
//    });
//    var btnEliminar = new Ext.Button({
//        disabled: true,
//        id: 'btnEli',
//        tooltip: etiquetas.lbttipDelPais,
//        icon: perfil.dirImg + 'eliminar.png',
//        iconCls: 'btn',
//        text: etiquetas.eliminar,
//        handler: function() {
//            isOpenW = true;
//            eliminarAplicacion();
//        }
//    });
//
//    var btnAyuda = new Ext.Button({
//        disabled: false,
//        id: 'btnAyu',
//        nextTab: 'tfFiltroNombre',
//        tooltip: etiquetas.lbttipHelp,
//        icon: perfil.dirImg + 'ayuda.png',
//        iconCls: 'btn',
//        text: etiquetas.ayuda,
//        handler: function() {
//            var title = etiquetas.title1;
//            var referencia = 'cg/dpa/nomenclador_paises';
//            help.show(title, referencia);
//        }
//    });
//
//    /*---------------------------------------------------------------------*/
//    /*----------Establesco modo de seleccion de grid (single)--------------*/
//    var sm = new Ext.grid.RowSelectionModel({
//        singleSelect: true,
//        listeners: {
//            selectionchange: function() {
//                if (sm.hasSelection()) {
//                    btnModificar.enable();
//                    btnEliminar.enable();
//
//                } else {
//                    btnModificar.disable();
//                    btnEliminar.disable();
//
//                }
//            },
//            rowselect: function(selectioModel, rowIndex, record) {
//                Ext.getCmp('gpsituaciones').getView().addRowClass(rowIndex, "negrita");
//            },
//            rowdeselect: function(selectioModel, rowIndex, record) {
//                Ext.getCmp('gpsituaciones').getView().removeRowClass(rowIndex, "negrita");
//            }
//
//        }
//    });
//
//    /*---------------------------------------------------------------------*/
//    /*--------------------Store del Grid de Aplicaciones-------------------*/
//    var stSituacion = new Ext.data.Store({
//        url: 'cargardatos',
//        baseParams: {
////            tipoduo: this.tipoDuo,
//            start: 0,
//            limit: 20
////            params: undefined
//        },
//        reader: new Ext.data.JsonReader({
//            totalProperty: "cantidad_filas",
//            root: "root",
//            id: "idpais"
//        }, [{
//                name: 'idpais'
//            }, {
//                name: 'nombrepais'
//            }, {
//                name: 'codigopais'
//            }, {
//                name: 'siglas'
//            }, {
//                name: 'nacionalidad'
//            }, {
//                name: 'fechainicio'
//            }, {
//                name: 'fechafin'
//            }]), listeners: {
//            load: function(options) {
//                if (stSituacion.getCount() == 0) {
//                    //if (dfFiltroFechainicio.getValue() != null || tfFiltroNombre.getValue() != null
//                    //       || tfCodigo.getValue() != null || tfSiglas.getValue() != null || dfFiltroFechafin.getValue() != null) {
//                    auxDel = false;
//
//                    if (banderabuscar == 1) {
//                        notifyEvent(gpSituaciones.el.dom, etiquetas.lbmsgInfo4, etiquetas.lbmsgInfo5);
//                        banderabuscar = 0;
//                    }
//                    // }else{
//                    //if (dfFiltroFechainicio.getValue() == null && tfFiltroNombre.getValue() == null
//                    //      && tfCodigo.getValue() == null && tfSiglas.getValue() == null && dfFiltroFechafin.getValue() == null) {
//                    // auxDel = false;
//
//                    // Ext.Msg.alert(etiquetas.lbmsgInfo4, etiquetas.lbmsgInfo6);
//                    if (banderabuscar == 0) {
//                        notifyEvent(gpSituaciones.el.dom, etiquetas.lbmsgInfo4, etiquetas.lbmsgInfo6);
//                    }
//                    // }
//                }
//
//
//            }
//
////            ,
////            beforeload: function(store, options) {
////
////                store.baseParams = {
////                    filtrocodigo: tfCodigo.getValue(),
////                    fitrosiglas: tfSiglas.getValue(),
////                    filtrodenominacion: tfFiltroNombre.getValue(),
////                    filtrofechainicio: dfFiltroFechainicio.getRawValue(),
////                    filtrofechafin: dfFiltroFechafin.getRawValue()
////
////                };
////            }
//        }
//    });
//    /*----------------------------------------------------------------------------*/
//    /*------------------------Declaración de los filtros-------------------------*/
//    var btn_Buscar = new Ext.Button({
//        icon: perfil.dirImg + 'buscar.png',
//        iconCls: 'btn',
//        id: "btn_Buscar",
//        disabled: false,
//        tooltip: etiquetas.tooltipbuscar,
//        handler: searchFiltro
//    });
//    var btnLimpiar = new Ext.Button({
//        tooltip: etiquetas.tooltipclean,
//        id: 'btnAll',
//        icon: perfil.dirImg + 'limpiar.png',
//        iconCls: 'btn',
//        nextTab: 'btnAgr',
//        handler: function() {
//            formfiltro.getForm().reset();
//            banderabuscar = 0;
////            stSituacion.load();
//            searchFiltro();
//        }
//    });
//    var tfFiltroNombre = new Ext.form.TextField({
//        name: 'tfFiltroNombre',
//        id: 'tfFiltroNombre',
//        vtype: 'vtnombre',
//        maxLength: 255,
//        emptyText: etiquetas.criterio,
//        fieldLabel: etiquetas.lbfieldLabelDeno,
//        anchor: '100%',
//        allowBlank: true,
//        enableKeyEvents: true,
//        listeners: {
//            change: function(tField, newT, oldT) {
//                filtrodenominacion = tfFiltroNombre.getValue();
//                if (newT != '' && tField.isValid()) {
//                    btn_Buscar.enable();
//                }
//            }
//        }
//    });
//    var tfCodigo = new Ext.form.TextField({
//        name: 'tfCodigo',
//        anchor: '100%',
//        vtype: 'vtalfanumerico',
//        maxLength: 3,
//        emptyText: etiquetas.criterio,
//        fieldLabel: etiquetas.lbfieldLabelCod,
//        id: 'tfCodigo',
//        enableKeyEvents: true,
//        allowBlank: true
//    });
//    var tfSiglas = new Ext.form.TextField({
//        name: 'tfSiglas',
//        id: 'tfSiglas',
//        vtype: 'vtnombre',
//        maxLength: 10,
//        minLength: 3,
//        anchor: '100%',
//        enableKeyEvents: true,
//        emptyText: etiquetas.criterio,
//        fieldLabel: etiquetas.lbfieldLabelSig,
//        allowBlank: true
//    });
//    var dfFiltroFechafin = new Ext.form.DateField({
//        fieldLabel: etiquetas.lbfieldLabelFFin,
//        vtype: 'daterange',
//        emptyText: etiquetas.seleccione,
//        startDateField: 'dfFiltroFechainicio',
//        minText: etiquetas.lbminText,
//        anchor: '100%',
//        name: 'dfFiltroFechafin',
//        id: 'dfFiltroFechafin',
//        format: 'd/m/Y',
//        readOnly: true,
//        enableKeyEvents: true,
//        maskRe: /[\d\/]/,
//        invalidText: ['Formato: dd/mm/aaaa.'].join(""),
//        parseDate: function(v) {
//            return (!v || v instanceof Date) ? v : ((v.length == 6
//                    || v.length == 8 || v.length == 10) && (Date
//                    .parseDate(v, 'd/m/y') || Date
//                    .parseDate(v, 'd/m/Y')));
//        }
//    });
//    var dfFiltroFechainicio = new Ext.form.DateField({
//        fieldLabel: etiquetas.lbfieldLabelFIni,
//        emptyText: etiquetas.seleccione,
//        endDateField: 'dfFiltroFechafin',
//        maxText: etiquetas.lbmaxText,
//        vtype: 'daterange',
//        anchor: '100%',
//        name: 'dfFiltroFechainicio',
//        id: 'dfFiltroFechainicio',
//        format: 'd/m/Y',
//        readOnly: true,
//        enableKeyEvents: true,
//        maskRe: /[\d\/]/,
//        invalidText: ['Formato: dd/mm/aaaa.'].join(""),
//        parseDate: function(v) {
//            return (!v || v instanceof Date) ? v : ((v.length == 6
//                    || v.length == 8 || v.length == 10) && (Date
//                    .parseDate(v, 'd/m/y') || Date
//                    .parseDate(v, 'd/m/Y')));
//        }
//    });
//
//    /**
//     * *************************** formulario de los
//     * filtros*********************************************
//     */
//    var formfiltro = new Ext.FormPanel({
//        layout: 'column',
//        region: 'north',
//        cls: 'x-toolbar',
//        frame: true,
//        defaults: {
//            layout: 'form',
//            border: false,
//            labelAlign: 'top',
//            labelWidth: 50,
//            buttonAlign: 'right'
//        },
//        height: 65,
//        bodyBorder: false,
//        border: false,
//        //autoScroll: true,
//        autoShow: true,
//        hideBorders: true,
//        items: [{
//                layout: 'form',
//                columnWidth: .2,
//                items: [tfFiltroNombre]
//            }, {
//                style: 'margin:0 0 0 10',
//                columnWidth: .15,
//                layout: 'form',
//                items: [tfCodigo]
//            }, {
//                style: 'margin:0 0 0 10',
//                layout: 'form',
//                columnWidth: .2,
//                items: [tfSiglas]
//            }, {
//                style: 'margin:0 0 0 10',
//                layout: 'form',
//                columnWidth: .2,
//                items: [dfFiltroFechainicio]
//            }, {
//                style: 'margin:0 0 0 10',
//                layout: 'form',
//                columnWidth: .2,
//                items: [dfFiltroFechafin]
//            }, {
////                columnWidth: '35px',
////                bodyStyle: 'padding:19px 0 0 0;',
////                layout: 'form',
//                style: 'margin:19 0 0 5',
//                items: [btn_Buscar]
//            }, {
////                columnWidth: '35px',
////                bodyStyle: 'padding:19px 0 0 0;',
////                layout: 'form',
//                style: 'margin:19 0 0 5',
//                items: [btnLimpiar]
//            }]
//    })
//    /*---------------------------------------------------------------------*/
//    /*-----------------Se define el grid de aplicaciones-------------------*/
//    var gpSituaciones = new Ext.grid.GridPanel({
//        frame: true,
//        height: 580,
//        region: 'center',
//        id: 'gpsituaciones',
//        title: etiquetas.lbtitleGridPaises,
//        autoScroll: false,
//        store: stSituacion,
//        stripeRows: true,
//        autoExpandColumn: 'expandir1',
//        sm: sm,
//        loadMask: {
//            msg: etiquetas.msg
//        },
//        columns: [{
//                hidden: true,
//                hideable: false,
//                dataIndex: 'idpais'
//            }, {
//                header: etiquetas.lbfieldLabelDeno,
//                id: 'expandir1',
//                width: 200,
//                dataIndex: 'nombrepais',
//                sortable: true
//            }, {
//                header: etiquetas.lbfieldLabelCod,
//                id: 'expandir',
//                width: 100,
//                dataIndex: 'codigopais',
//                sortable: true
//            }, {
//                header: etiquetas.lbfieldLabelSig,
//                id: 'expandir',
//                width: 100,
//                dataIndex: 'siglas',
//                sortable: true
//            }, {
//                header: etiquetas.lbfieldLabelFIni,
//                id: 'expandir',
//                width: 100,
//                dataIndex: 'fechainicio',
//                sortable: true
//            }, {
//                header: etiquetas.lbfieldLabelFFin,
//                id: 'expandir',
//                width: 100,
//                dataIndex: 'fechafin',
//                sortable: true
//
//            }],
//        bbar: new Ext.Cont.PagingToolbar({
//            pageSize: 20,
//            store: stSituacion,
//            displayInfo: true,
//            displayMsg: etiquetas.displayMsg,
//            emptyMsg: etiquetas.emptyMsg
//        })
//    });
//    /*---------------------------------------------------------------------*/
//    /*------------------------Se define el panel--------------------------*/
//    var panel = new Ext.Panel({
//        layout: 'border',
//        tbar: [btnAdicionar, btnModificar, btnEliminar, '->', btnAyuda],
//        items: [formfiltro, gpSituaciones],
//        keys: [new Ext.KeyMap(document, [{
//                    key: Ext.EventObject.DELETE,
//                    fn: function() {
//
//
//                        if (sm.getSelected() && isOpenW == false && btnEliminar.disabled == false) {
//                            isOpenW = true;
//                            eliminarAplicacion();
//                        }
//                    }
//                }, {
//                    key: "i",
//                    alt: true,
//                    fn: function() {
//                        if (isOpenW == false) {
//                            isOpenW = true;
//                            winForm('Ins');
//                        }
//
//                    }
//                }, {
//                    key: "b",
//                    alt: true,
//                    fn: function() {
//                        if (isOpenW == false) {
//                            isOpenW = true;
//                            btn_Buscar.handler.call();
//                        }
//                    }
//                }, {
//                    key: "l",
//                    alt: true,
//                    fn: function() {
//                        formfiltro.getForm().reset();
//                        btnLimpiar.handler.call();
//
//                    }
//                }, {
//                    key: "m",
//                    alt: true,
//                    fn: function() {
//                        if (sm.getSelected() && isOpenW == false && btnModificar.disabled == false) {
//
//                            isOpenW = true;
//                            winForm('Mod');
//                        }
//                    }
//                }, {
//                    key: "h",
//                    alt: true,
////                stopEvent: true,
//                    fn: function() {
//                        cargarAyuda();
//                    }
//                }])]
//    });
//    panel.on('afterlayout', function() {
//        btnAdicionar.focus();
//    })
//    /*---------------------------------------------------------------------*/
//    /*------------------------Se define el viwport--------------------------*/
//    var vpGestSistema = new Ext.Viewport({
//        layout: 'fit',
//        items: panel
//    });
//    /*---------------------------------------------------------------------*/
//    /*--------------------Se manda a cargar el store----------------------*/
//    stSituacion.load();
//    /*----------------------------------------------------------------------------*/
//    /*------------------------Componentes del formulario--------------------------*/
//    var fechainicio = new Ext.form.DateField({
//        fieldLabel: etiquetas.lbfieldLabelFIni,
//        anchor: '97%',
//        name: 'fechainicio',
//        id: 'fechainicio',
//        value: new Date(),
//        endDateField: 'fechafin',
//        maxText: etiquetas.lbmaxText,
//        vtype: 'daterange',
//        format: 'd/m/Y',
//        readOnly: false,
//        allowBlank: false,
//        maskRe: /[\d\/]/,
//        invalidText: ['Formato: dd/mm/aaaa.'].join(""),
//        parseDate: function(v) {
//            return (!v || v instanceof Date) ? v : ((v.length == 6
//                    || v.length == 8 || v.length == 10) && (Date
//                    .parseDate(v, 'd/m/y') || Date
//                    .parseDate(v, 'd/m/Y')));
//        },
//        listeners: {change: function() {
//                PaisModificado = true;
//            }
//        }
//
//    });
//    var fechafin = new Ext.form.DateField({
//        fieldLabel: etiquetas.lbfieldLabelFFin,
//        anchor: '97%',
//        name: 'fechafin',
//        id: 'fechafin',
//        startDateField: 'fechainicio',
//        minText: etiquetas.lbminText,
//        format: 'd/m/Y',
//        readOnly: false,
//        maskRe: /[\d\/]/,
//        invalidText: ['Formato: dd/mm/aaaa.'].join(""),
//        parseDate: function(v) {
//            return (!v || v instanceof Date) ? v : ((v.length == 6
//                    || v.length == 8 || v.length == 10) && (Date
//                    .parseDate(v, 'd/m/y') || Date
//                    .parseDate(v, 'd/m/Y')));
//        },
//        listeners: {change: function() {
//                PaisModificado = true;
//            }
//        }
//    });
//
//    /*---------------------------------------------------------------------*/
//    /*--------Se define el formulario para adicionar una situación--------*/
//    var fpSituacion = new Ext.FormPanel({
//        labelAlign: 'top',
//        frame: true,
//        items: [{
//                layout: 'column',
//                border: 'false',
//                items: [{
//                        xtype: 'hidden',
//                        name: 'idpais',
//                        id: 'idpais'
//                    }
//
//                ]
//            }, {
//                xtype: 'textfield',
//                fieldLabel: etiquetas.lbfieldLabelDeno,
//                name: 'nombrepais',
//                id: 'nombrepais',
//                vtype: 'vtnombre',
//                maxLength: 50,
//                anchor: '99%',
//                allowBlank: false,
//                listeners: {change: function() {
//                        PaisModificado = true;
//                    }
//                }
//            }, {
//                columnWidth: '.5',
//                layout: 'column',
//                items: [{
//                        columnWidth: '.5',
//                        layout: 'form',
//                        items: [{
//                                xtype: 'textfield',
//                                fieldLabel: etiquetas.lbfieldLabelCod,
//                                vtype: 'vtalfanumerico',
//                                maxLength: 3,
//                                name: 'codigopais',
//                                id: 'codigopais',
//                                anchor: '97%',
//                                listeners: {change: function() {
//                                        PaisModificado = true;
//                                    }
//                                }
//
//                            }]
//                    }, {
//                        columnWidth: '.5',
//                        layout: 'form',
//                        items: [{
//                                xtype: 'textfield',
//                                fieldLabel: etiquetas.lbfieldLabelSig,
//                                vtype: 'vtnombre',
//                                maxLength: 10,
//                                minLength: 3,
//                                name: 'siglas',
//                                id: 'siglas',
//                                anchor: '97%',
//                                listeners: {change: function() {
//                                        PaisModificado = true;
//                                    }
//                                }
//
//                            }]
//                    }]
//            }, {
//                xtype: 'textfield',
//                fieldLabel: etiquetas.lbfieldLabelNac,
//                name: 'nacionalidad',
//                maxLength: 255,
//                vtype: 'vtnombre',
//                id: 'nacionalidad',
//                anchor: '99%',
//                allowBlank: false,
//                listeners: {change: function() {
//                        PaisModificado = true;
//                    }
//                }
//            }, {
//                columnWidth: '.5',
//                layout: 'column',
//                items: [{
//                        columnWidth: '.5',
//                        layout: 'form',
//                        items: [fechainicio]
//                    }, {
//                        columnWidth: '.5',
//                        layout: 'form',
//                        items: [fechafin]
//                    }]
//            }]
//
//    });
//
//
//    /*---Validando que la fecha de fin sea mayor que la fecha de inicio---*/
//
//    /*----------------------------------------------------------------------------*/
//    /*------------------------------Se define las ventanas------------------------*/
//    var winIns, winMod;
//    /*----------------------------------------------------------------------------*/
//    /*--Switch para cargar las ventanas en dependencia de lo que pida el usuario--*/
//    function winForm(opcion) {
//        switch (opcion) {
//            /*-------------Caso para insertar un pais----------*/
//            case 'Ins' :
//                {
//                    if (!winIns) {
//                        winIns = new Ext.Window({
//                            modal: true,
//                            closeAction: 'hide',
//                            layout: 'fit',
//                            title: etiquetas.lbtitleAddPais,
//                            width: 390,
//                            height: 300,
//                            listeners: {hide: function() {
//                                    isOpenW = false;
//                                }},
//                            buttons: [{
//                                    icon: perfil.dirImg
//                                            + 'cancelar.png',
//                                    iconCls: 'btn',
//                                    tooltip: etiquetas.ttipbtnCancelar,
//                                    text: etiquetas.cancelar,
//                                    handler: function() {
//                                        winIns.hide();
//                                        sm.clearSelections();
//                                    }
//                                }, {
//                                    icon: perfil.dirImg
//                                            + 'aplicar.png',
//                                    iconCls: 'btn',
//                                    tooltip: etiquetas.ttipbtnAplicar,
//                                    handler: function() {
//                                        crearSituacion('apl');
//
//                                    },
//                                    text: etiquetas.aplicar
//                                }, {
//                                    icon: perfil.dirImg
//                                            + 'aceptar.png',
//                                    iconCls: 'btn',
//                                    tooltip: etiquetas.ttipbtnAceptar,
//                                    nextTab: 'nombrepais',
//                                    handler: function() {
//                                        crearSituacion('add');
//
//                                    },
//                                    text: etiquetas.aceptar
//                                }]
//                        });
//                    }
//                    winIns.show();
//                    fpSituacion.getForm().reset();
//                    winIns.add(fpSituacion);
//                    winIns.doLayout();
//                    Ext.getCmp('nombrepais').focus(false, 10)
//                }
//                break;
//                /*---------------Caso para modificar un pais-------------*/
//            case 'Mod' :
//                {
//                    if (!winMod) {
//                        winMod = new Ext.Window({
//                            modal: true,
//                            closeAction: 'hide',
//                            layout: 'fit',
//                            title: etiquetas.lbtitleSetPais,
//                            width: 390,
//                            listeners: {hide: function() {
//                                    PaisModificado = false;
//                                    isOpenW = false;
//                                }},
//                            height: 300,
//                            buttons: [{
//                                    icon: perfil.dirImg
//                                            + 'cancelar.png',
//                                    iconCls: 'btn',
//                                    tooltip: etiquetas.ttipbtnCancelar,
//                                    text: etiquetas.cancelar,
//                                    handler: function() {
////                                        if (fpSituacion.getForm().isValid())
//                                        winMod.hide();
//                                    }
//
//                                },
//                                {
//                                    icon: perfil.dirImg
//                                            + 'aceptar.png',
//                                    iconCls: 'btn',
//                                    nextTab: 'nombrepais',
//                                    tooltip: etiquetas.ttipbtnAceptar,
//                                    handler: function() {
//
//                                        modificarsituacion();
//
//                                    },
//                                    text: etiquetas.aceptar
//                                }]
//                        });
//                    }
//                    winMod.show();
//                    winMod.add(fpSituacion);
//                    winMod.doLayout();
//                    record = sm.getSelected();
//                    fpSituacion.getForm().loadRecord(record);
//                    Ext.getCmp('nombrepais').focus(false, 10)
//
//                }
//                break;
//
//        }
//    }
//    /*----------------------------------------------------------------------------*/
//    /*------------------Función para buscar una situación-------------------------*/
//    function buscarSituacion(aAlias) {
//        stSituacion.load();
//    }
//    /*----------------------------------------------------------------------------*/
//    /*-------------Función para mostrar todas las conceptos-----------------------*/
//    function mostrarTodos() {
//        stSituacion.load();
//        sm.clearSelections();
//    }
//    /*----------------------------------------------------------------------------*/
//    /*---------------------Función para insertar un pais--------------------------*/
//    function crearSituacion(apl) {
//        if (fpSituacion.getForm().isValid()) {
//            fpSituacion.getForm().submit({
//                url: 'adicionar',
//                waitMsg: etiquetas.lbmsginfo1,
//                failure: function(form, action) {
//                    switch (action.result.codMsg) {
//                        case -1 :
//                            mostrarMensaje(1, etiquetas.lbInfoAddPais, fAceptarCambios(apl));
//                            break;
//                        case -2 :
//                            mostrarMensaje(1, etiquetas.lbInfoAddExistePais, function() {
//                            });
//                            break;
//                        case -3 :
//                            mostrarMensaje(1, etiquetas.lbInfoAddExistePais, function() {
//                            });
//                            break;
//                        case -4 :
//                            mostrarMensaje(1, etiquetas.lbInfoAddExistePaisCodigo, function() {
//                            });
//                            break;
//                        default:
//                            mostrarMensaje(action.result.codMsg, action.result.mensaje, fAceptarCambios(apl));
//                            break;
//                    }
//                    function fAceptarCambios(apl) {
//                        stSituacion.reload();
//                        fpSituacion.getForm().reset();
//                        sm.clearSelections();
//                        if (apl != 'apl') {
//                            winIns.hide();
//                        }
//                    }
//                }
//
//            });
//        }
//        else {
//            mostrarMensaje(1, etiquetas.camposMal);
//        }
//    }
//
//    /*----------------------------------------------------------------------------*/
//    /*------------------------Función para modificar un pais----------------------*/
//    function modificarsituacion() {
//
//
//        if (PaisModificado) {
//            if (fpSituacion.getForm().isValid()) {
////                panel.disable();
//                fpSituacion.getForm().submit({
//                    url: 'modificar',
//                    waitMsg: etiquetas.lbmsginfo1,
//                    failure: function(form, action) {
//
//                        switch (action.result.codMsg) {
//                            case -1 :
//                                mostrarMensaje(1, etiquetas.lbInfoModPais, fAceptarCambios);
//                                break;
//                            case -5 :
//                                mostrarMensaje(1, etiquetas.lbInfoModExistePais, function() {
//                                });
//                                break;
//                            case -3 :
//                                mostrarMensaje(1, etiquetas.lbInfoModExistePaisCodigo, function() {
//                                });
//                                break;
//                            case -6 :
//                                mostrarMensaje(1, etiquetas.lbInfoModExistePais, function() {
//                                });
//                                break;
//                            default:
//                                mostrarMensaje(action.result.codMsg, action.result.mensaje, fAceptarCambios);
//                                break;
//                        }
//                        function fAceptarCambios() {
//                            stSituacion.reload();
//                            winMod.hide();
//                            sm.clearSelections();
//                            panel.enable();
//                        }
//                    }
//                });
//            }
//            else {
//                mostrarMensaje(1, etiquetas.camposMal);
//            }
//        } else {
//            mostrarMensaje(1, etiquetas.textNoCamposModific, function() {
//            });
//
//        }
//
//
//
//    }
//    /*----------------------------------------------------------------------------*/
//    /*--------------------Función para eliminar un pais---------------------------*/
//    function eliminarAplicacion() {
//
//        mostrarMensaje(2, etiquetas.lbmsginfo2 + '?', eliminar)
//        function eliminar(btnPresionado) {
//            if (btnPresionado == 'ok') {
//                panel.disable();
//                Ext.Msg.wait(etiquetas.lbmsginfo3, etiquetas.porfavor);
//                Ext.Ajax.request({
//                    url: 'eliminar',
//                    method: 'POST',
//                    params: {
//                        idpais: sm.getSelected().id
//                    },
//                    callback: function(options, success, response) {
//                        responseData = Ext.decode(response.responseText);
//                        Ext.Msg.hide();
//                        switch (responseData.codMsg) {
//                            case -1:
//                                mostrarMensaje(1, etiquetas.lbInfoDelPais, function() {
//                                    stSituacion.reload();
//                                    sm.clearSelections();
//                                });
//                                break;
//                            case -2:
//                                mostrarMensaje(1, etiquetas.lbInfoDelPaisUsado, function() {
//                                });
//                                break;
//                            default:
//                                break;
//                        }
//                        panel.enable();
//                    }
//                });
//            }
//            isOpenW = false;
//        }
//    }
//    /**
//     * *************************funcion para
//     * filtrar**************************************************
//     */
//    function searchFiltro() {
//        stSituacion.baseParams.start = '';
//        stSituacion.baseParams.limit = '';
//
//        stSituacion.baseParams.filtrocodigo = tfCodigo.getValue();
//        stSituacion.baseParams.fitrosiglas = tfSiglas.getValue();
//        stSituacion.baseParams.filtrodenominacion = tfFiltroNombre.getValue();
//        stSituacion.baseParams.filtrofechainicio = dfFiltroFechainicio.getRawValue();
//        stSituacion.baseParams.filtrofechafin = dfFiltroFechafin.getRawValue();
//        stSituacion.load();
//        banderabuscar = 1;
//
//        // mostrarMensaje(3, etiquetas.camposMal);
//
//    }
//    function cargarAyuda() {
//        help.show(etiquetas.lbTitleAyuda, 'confin/CG/DP/getpais');
//    }
//    function notifyEvent(animateTarget, title, msg, icon, time, callback) {
//        var notification = new Ext.Cont.Notification({
//            animateTarget: animateTarget,
//            fnc: (callback) ? callback : Ext.emptyFn,
//            iconbox: icon,
//            iconCls: "icon-waiting",
//            title: title,
//            html: msg,
//            hideDelay: (time) ? time : 5000
//        });
//        notification.box();
//    }
//
//
//
//    tfFiltroNombre.on({
//        specialkey: function(xfield, xevent) {
//            if (Ext.EventObject.getKey() == Ext.EventObject.ENTER) {
//                btn_Buscar.handler.call();
//            }
//        }
//
//    });
//    tfCodigo.on({
//        specialkey: function(xfield, xevent) {
//            if (Ext.EventObject.getKey() == Ext.EventObject.ENTER) {
//                btn_Buscar.handler.call();
//            }
//        }
//
//    });
//    tfSiglas.on({
//        specialkey: function(xfield, xevent) {
//            if (Ext.EventObject.getKey() == Ext.EventObject.ENTER) {
//                btn_Buscar.handler.call();
//            }
//        }
//
//    });
//    dfFiltroFechainicio.on({
//        specialkey: function(xfield, xevent) {
//            if (Ext.EventObject.getKey() == Ext.EventObject.ENTER) {
//                btn_Buscar.handler.call();
//            }
//        }
//        , keyup: function(t, e) {
//            if (e.getKey() == 13) {
//                if (t.getValue().length > 0) {
//                    btn_Buscar.handler.call();
//                } else {
//                    t.reset();
//                    t.blur();
//                    t.clearInvalid();
//                }
//            }
//        }, focus: function() {
//
//
//        }
//
//    });
//    dfFiltroFechafin.on({
//        specialkey: function(xfield, xevent) {
//            if (Ext.EventObject.getKey() == Ext.EventObject.ENTER) {
//                btn_Buscar.handler.call();
//            }
//        }
//        , keyup: function(t, e) {
//            if (e.getKey() == 13) {
//                if (t.getValue().length > 0) {
//                    btn_Buscar.handler.call();
//                } else {
//                    t.reset();
//                    t.blur();
//                    t.clearInvalid();
//                }
//            }
//        }, focus: function() {
//
//        }
//
//    });
//}

Ext.QuickTips.init();
var etiquetas = Conf.NomPais.etiquetas
loadMessageBox(etiquetas.lbPlease, etiquetas.lbMsgCargando);
function loadMessageBox(title, msg) {
    var mss = Ext.MessageBox.show({
        title: title,
        msg: msg,
        width: 300,
        progress: true,
        closable: false
    });
    var f = function(v) {
        return function() {
            var i = v / 11;
            Ext.MessageBox.updateProgress(i);
            if (i == 1) {
                cargarInterfaz();
                mss.hide();
            }

        };
    };
    for (var i = 1; i < 12; i++) {
        setTimeout(f(i), i * 500);
    }
}
;


function cargarInterfaz() {
   var componentNomPais=new Ext.Configuracion_General_Nomencladores.NomencladorPais({
    layout:'fit'
    //frame:true
});
var view_port=new Ext.Viewport({
    layout:'fit',
    items:componentNomPais
});
}
;

