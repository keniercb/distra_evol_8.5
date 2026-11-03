
var perfil = window.parent.UCID.portal.perfil
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('gestunidadmedida', cargarInterfaz);
var mss = Ext.MessageBox.show({
    title: 'Por favor espere...',
    msg: 'Cargando...',
    width: 300,
    progress: true,
    closable: false
});
//Secodena.mostrarMascara('idmask_um', 'Por favor espere...', 'Cargando...');
var etiquetasEst = {};
//var gpGestMagnitud
//var pnlGestMagnitud;
var opcion;
var isOpenW = false;
var opciones;
//var tfNombreBuscar;
//var buscar;
//var gpGestUM;
/////TEXT PARA VER SI REPLICA

function cargarInterfaz(perfil, etiquetas) {
    etiquetasEst = etiquetas;
    initMagnitud();
    initUM();
    mask = new Ext.LoadMask(Ext.getBody(), {
        msg: etiquetasEst.lbCargando
    });
    map_um = new Ext.KeyMap(document, [
        /*{
            key: 'h',
            alt: true,
            fn: function() {
                help.show(etiquetasEst.lbTitleAyuda, 'confin/CG/nomenG/unidadmedida');
            }
        }, */{
            key: 'i',
            alt: true,
            fn: function() {
                if (!btnAdicionarMagnitud.disabled
                        && !btnAdicionarMagnitud.hidden && isOpenW == false) {
                    btnAdicionarMagnitud.handler.call();


                }
            }
        },
        {
            key: 'i',
            ctrl: true,
            fn: function() {
                if (btnAdicionarUM.isVisible() && !btnAdicionarUM.disabled && isOpenW == false)
                    btnAdicionarUM.handler.call();
            }
        }, {
            key: 'm',
            alt: true,
            fn: function() {
                if (!btnModificarMagnitud.disabled
                        && !btnModificarMagnitud.hidden && isOpenW == false) {
                    if (smGpGestMagnitud.hasSelection()) {
                        btnModificarMagnitud.handler.call();
                    }
                }
            }
        }, {
            key: 'm',
            ctrl: true,
            fn: function() {
                if (btnModificarUM.isVisible() && !btnModificarUM.disabled && isOpenW == false)
                    btnModificarUM.handler.call();
            }
        }, {
            key: Ext.EventObject.DELETE,
            fn: function() {
                if (!btnEliminarMagnitud.disabled && !btnEliminarMagnitud.hidden && isOpenW == false && Ext.EventObject.ctrlKey != 1)
                    btnEliminarMagnitud.handler.call();
            }

            ///...Teclas calientes de Unidades de Medidas...///
        }, {
            key: Ext.EventObject.DELETE,
            ctrl: true,
            fn: function() {
                if (btnEliminarUM.isVisible() && !btnEliminarUM.disabled && isOpenW == false)
                    btnEliminarUM.handler.call();
            }
        }, {
            key: 'm',
            alt: true,
            fn: function() {
                if (btnModificarUM.isVisible() && !btnModificarUM.disabled && isOpenW == false)
                    btnModificarUM.handler.call();
            }
        }, {
            key: 'b',
            alt: true,
            fn: function() {
                if(Ext.getCmp('tfNombreBuscar').getRawValue().length > 0){
                    Ext.getCmp('tfNombreBuscar').onTrigger2Click();
                }else{
                    Ext.getCmp('tfNombreBuscar').focus();
                }
            }
        }, {
            key: 'l',
            alt: true,
            fn: function() {
                if(Ext.getCmp('tfNombreBuscar').getRawValue().length > 0) {
                    Ext.EventObject.stopEvent();
                    Ext.getCmp('tfNombreBuscar').onTrigger1Click();
                }
            }
        }
    ]);
    pbLoad = new Ext.ProgressBar({
        text: etiquetasEst.lbEspere,
        id: 'pbar2',
        cls: 'custom'
    });
    wnLoad = new Ext.Window({
        title: etiquetasEst.lbEspere,
        layout: 'fit',
        width: 320,
        height: 50,
        closable: false,
        resizable: false,
        plain: true,
        modal: true,
        items: [pbLoad],
        closeAction: 'hide',
        listeners: {
            show: function() {
                map_um.disable();
                pbLoad.text = etiquetasEst.lbCargandodatos;
                pbLoad.wait({
                    interval: 200,
                    increment: 15,
                    fn: function() {
                    }
                });
            },
            hide: function() {
                pbLoad.reset();
                map_um.enable();
            }
        }
    });

    btnAdicionarMagnitud = new Ext.Button({
        handler: function() {
            fpMagnitud.getForm().reset();
            opcion = 'add';
            isOpenW = true;///...para comprobar que alguna ventana este abierta...///
            winAddMagnitud.show('btnAdicionarMagnitud');
            winAddMagnitud.add(fpMagnitud);
            winAddMagnitud.doLayout();
            Ext.getCmp('denominacion').focus();
        },
        nextTab: 'btnModificarMagnitud',
        prevTab: 'btnAyuMagnitud',
        hidden: true,
        text: etiquetasEst.lbBtnAdicionarMag,
        tooltip: etiquetasEst.lbTtbtnAdicionarMag,
        disabled: false,
        id: 'btnAdicionarMagnitud',
        iconCls: 'adicionar'

    });

    btnModificarMagnitud = new Ext.Button({
        handler: function() {
            if (smGpGestMagnitud.hasSelection()) {
                isOpenW = true;///...para comprobar que alguna ventana este abierta...///
                opcion = 'mod';



                winModMagnitud.show('btnModificarTP');
                winModMagnitud.add(fpMagnitud);
                winModMagnitud.doLayout();
                fpMagnitud.getForm().setValues({
                    'denominacionmagnitud': gpGestMagnitud.getSelectionModel().getSelected().data.denominacionmagnitud.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')
                });
                setTimeout(function(){
                    Ext.getCmp('denominacion').focus();
                }, 800)

                //                Ext.getCmp('denominacion').setValue(gpGestMagnitud.getSelectionModel().getSelected().data.denominacionmagnitud);
                //                Ext.getCmp('finicio').setValue(gpGestMagnitud.getSelectionModel().getSelected().data.fechainicio);
                //                Ext.getCmp('ffin').setValue(gpGestMagnitud.getSelectionModel().getSelected().data.fechafin);
                //                Ext.getCmp('descripcionmagnitud').setValue(gpGestMagnitud.getSelectionModel().getSelected().data.descripcionmagnitud); //                Ext.getCmp('idmagnitud_n').setValue(gpGestMagnitud.getSelectionModel().getSelected().data.idmagnitud);
            }
        },
        nextTab: 'btnEliminarMagnitud',
        prevTab: 'btnAdicionarMagnitud',
        hidden: true,
        text: etiquetasEst.lbBtnModificarMag,
        tooltip: etiquetasEst.lbTtbtnModificarMag,
        disabled: true,
        id : 'btnModificarMagnitud',
        iconCls: 'modificar'
    });
    btnEliminarMagnitud = new Ext.Button({
        handler: function() {
            isOpenW = true;///...para comprobar que alguna ventana este abierta...///
            eliminarMF();
        }
        //        ,
        //        enableKeyEvents: true,
//        listeners: {
        //            keypress: function(field, event) {
        //                if (event.getKey() == 13) {
//
//                }
//
        //            }
//        }
        ,
        nextTab: 'btnAdicionarUM',
        prevTab: 'btnModificarMagnitud',
        text: etiquetasEst.lbBtnEliminar,
        hidden: true,
        tooltip: etiquetasEst.lbTtbtnEliminarMag,
        disabled: true,
        id: 'btnEliminarMagnitud',
        iconCls: 'eliminar'
    });

    btnAyuMagnitud = new Ext.Button({
        /*handler: function() {
            // CargarAyuda('gestionar_nombre_de_categoria');

            help.show(etiquetasEst.lbTitleAyuda, 'confin/CG/nomenG/unidadmedida');
        },*/
        text: etiquetasEst.lbBtnAyuda,
        tooltip: etiquetasEst.lbTtbtnAyu,
        id: 'btnAyuMagnitud',
        nextTab: 'btnAdicionarMagnitud',
        prevTab: 'btnEliminarUM',
        iconCls: 'ayuda'});

    btnVistaPrevia = new Ext.Button({
        id: 'btnVistReportUM',
        hidden: true,
        iconCls: 'vistareporte',
        tooltip: etiquetas.tooltipVistaReporte,
        text: etiquetas.lbVistaReporte,
        handler: function() {
            fObtenerDatosImprimirReporte();
        }
    });

    function fObtenerDatosImprimirReporte() {
        var ms = Ext.MessageBox.show({
            title: 'Por favor espere...',
            msg: etiquetas.lbCargando,
            width: 300,
            progress: true,
            closable: false
        });
        //loadMessageBox(etiquetas.lbCargando);
        Ext.Ajax.request({
            url: 'obtenerDatosImprimirReporte',
            method: 'POST',
            callback: function(options, success, response) {
                ms.hide();
                var responseData = Ext.decode(response.responseText);
                if (responseData.datoCuerpo.length > 0)
                    fOpenWindowReport(responseData);
                else
                    mostrarMensaje(1, etiquetas.msgNoDatosReporte);
            }
        });
    }

    function fOpenWindowReport(requestDataSources) {
        printView = new SCFPrintView(requestDataSources, "/configuracion/reportes/", {
            paperSize: "FOLIO",
            orientation: "Horizontal",
            reportType: "HTML"
        });
        printView.show();
    }


    // Store grid stGpMagnitud
    stGpMagnitud = new Ext.data.Store({
        url: 'listarMagnitud',
        listeners: {
            'load': function(st, recordArray, opt) {
                mss.hide();
                //Secodena.ocultarMascara('idmask_um');
            }
        },
        baseParams: {
            start: 0,
            limit: 20,
            filtro: null
        },
        sortInfo: {
            field: 'denominacionmagnitud',
            direction: 'ASC'
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idmagnitud"
        }, [{
                name: 'idmagnitud'
            }, {
                name: 'denominacionmagnitud'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'descripcionmagnitud'
            }, {name: 'urimagnitud'
            }, {
                name: 'red'
            }])
    });
    stGpMagnitud.load({
        params: {
            start: 0,
            limit: 20
        }
    });
    // Selection Model grid smGpGestMagnitud
    smGpGestMagnitud = new Ext.grid.RowSelectionModel(
            {singleSelect: true,
                listeners: {
                    rowselect: function(selectioModel, rowIndex, record) {
                        Ext.getCmp('gpGestMagnitud').getView().addRowClass(rowIndex, "negrita");
                    },
                    rowdeselect: function(selectioModel, rowIndex, record) {
                        Ext.getCmp('gpGestMagnitud').getView().removeRowClass(rowIndex, "negrita");
                    }
                }
//        ,
                //        listeners: {
                //            rowselect: function(sm, row, rec) {
                //
                //
//            }
//        }
            });
    var expander_magnitud = new Ext.grid.RowExpander({
        tpl: '<p><b>Descripción:</b> {descripcionmagnitud}</p><br>',
        // lazyRender : false,
        enableCaching: false
    });
    var expander_unidadmedida = new Ext.grid.RowExpander({
        tpl: '<p><b>Descripción:</b> {descripcionunidadmedida}</p><br>',
        // lazyRender : false,
        enableCaching: false
    });

    tfNombreBuscar = new Ext.Cont.SearchField({
        id: 'tfNombreBuscar',
        width: 250,
        maxLength: 70,
        emptyText: etiquetasEst.lbCriterioBuscar,
        searchTooltip: etiquetasEst.lbsearchTooltip,
        regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
        maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
        fnOnSearch: function() {
            buscar();

        },
        fnOnClear: function() {
            buscar();
        }
    });

    buscar = function() {
        stGpMagnitud.baseParams.filtro = Ext.getCmp('tfNombreBuscar').getRawValue();
        stGpMagnitud.load({
            callback: function(record, options, success) {
                if (record.length === 0) {
                    mostrarMensaje(1, etiquetasEst.msgFiltroVacio);
                }
            }
        });
    };
    // Grid gestion gpGestMagnitud
    gpGestMagnitud = new Ext.grid.GridPanel({
        tbar: [tfNombreBuscar],
        frame: true,
        id: 'gpGestMagnitud',
        stripeRows: true,
        region: 'center',
        title: etiquetasEst.lbTitGridMagnitud,
        autoExpandColumn: 'expandir',
        loadMask: {
            msg: etiquetasEst.lbCargando
        },
        cls: 'x-toolbar',
        store: stGpMagnitud,
        titleCollapse: true,
        root_title: 'Columnas',
        listeners: {
            dblclick: function() {
                gpGestUM.expand();
            }
        },
        // stripeRows : true,
        // forceFit: false,
        plugins: expander_magnitud,
        viewConfig: {
            forceFit: true,
            enableRowBody: true
        },
        enableDragDrop: true,
        split: true,
        sm: smGpGestMagnitud,
        columns: [expander_magnitud, {
                id: 'expandir',
                header: etiquetasEst.lbDenominacionDeLaManitud,
                width: 200,
                sortable: true,
                dataIndex: 'denominacionmagnitud'
            }, {
                header: etiquetasEst.lbFefchaI,
                width: 50,
                sortable: true,
                dataIndex: 'fechainicio'
            }, {
                header: etiquetasEst.lbFefchaF,
                sortable: true,
                width: 50,
                dataIndex: 'fechafin'
            }],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: stGpMagnitud,
            displayInfo: true,
            displayMsg: etiquetasEst.lbDisplayMsg,
            emptyMsg: etiquetasEst.lbEmptyMsg,
            prevText: etiquetasEst.beforePageText,
            nextText: etiquetasEst.afterPageText,
            firstText: etiquetasEst.firstPageText,
            lastText: etiquetasEst.lastPageText
        })
    });
    gpGestMagnitud.getView().getRowClass = function(record, index, rowParams,
            store) {
        if (record.data.red)
            return 'inactivo';
    };

    // ****************  Unidad de medida ***************
    btnAdicionarUM = new Ext.Button({
        handler: function() {
            isOpenW = true;
            opciones = 'add';
            Ext.getCmp('idmagnitud').setValue(Ext
                    .getCmp('gpGestMagnitud').getSelectionModel()
                    .getSelected().data.idmagnitud);
            mask.show();
            stConversiones.load({
                params: {
                    idmagnitud: Ext.getCmp('idmagnitud')
                            .getValue()
                }, callback: function() {
                    mask.hide();
                    winAddUM.show('btnAdicionarUM');
                    winAddUM.add(fpUM);
                    winAddUM.doLayout();

                }
            });

        },
        text: etiquetasEst.lbBtnAdicionar,
        tooltip: etiquetasEst.lbTtbtnAdicionarUnidaddeMedida,
        disabled: true,
        hidden: true,
        id: 'btnAdicionarUM',
        nextTab: 'btnModUM',
        prevTab: 'btnEliminarMagnitud',
        iconCls: 'adicionar'
    });
    btnModificarUM = new Ext.Button({
        handler: function() {
            isOpenW = true;
            opciones = 'mod';
            winModUM.show('btnModificarUM');
            winModUM.add(fpUM);
            winModUM.doLayout();
            fpUM.getForm().reset();

            Ext.getCmp('denominacionum').setValue(gpGestUM.getSelectionModel()
                    .getSelected().data.denominacionunidadmedida);
            Ext.getCmp('descripcionum').setValue(gpGestUM.getSelectionModel()
                    .getSelected().data.descripcionunidadmedida);
            Ext.getCmp('idunidadmedida').setValue(gpGestUM.getSelectionModel()
                    .getSelected().data.idunidadmedida);
            Ext.getCmp('idmagnitud').setValue(gpGestUM.getSelectionModel()
                    .getSelected().data.idmagnitud);
            Ext.getCmp('abreviaturaum').setValue(gpGestUM.getSelectionModel()
                    .getSelected().data.abreviaturaunidadmedida);
            Ext.getCmp('finicioum').setValue(gpGestUM.getSelectionModel().getSelected().data.fechainicio);
            Ext.getCmp('ffinum').setValue(gpGestUM.getSelectionModel()
                    .getSelected().data.fechafin);
            Ext.getCmp('checkdecimales').setValue(gpGestUM.getSelectionModel()
                .getSelected().data.decimales);
            stConversiones.load({
                params: {
                    idmagnitud: Ext.getCmp('idmagnitud').getValue(),
                    idumed: gpGestUM.getSelectionModel().getSelected().data.idunidadmedida
                }
            });
        },
        text: etiquetasEst.lbBtnModificar,
        tooltip: etiquetasEst.lbTtbtnModificarUnidaddeMedida,
        disabled: true,
        id: 'btnModUM',
        hidden: true,
        nextTab: 'btnEliminarUM',
        prevTab: 'btnAdicionarUM',
        iconCls: 'modificar'
    });
    btnEliminarUM = new Ext.Button({
        handler: function() {
            isOpenW = true;
            eliminarUM();
        },
        text: etiquetasEst.lbBtnEliminar,
        tooltip: etiquetasEst.lbTtbtnEliminarUnidaddeMedida,
        disabled: true,
        id: 'btnEliminarUM',
        hidden: true,
        nextTab: 'btnAyuMagnitud',
        prevTab: 'btnModUM',
        iconCls: 'eliminar'
    });








    UCID.portal.cargarAcciones(window.frameElement.id, function() {
        Ext.getCmp('btnAdicionarMagnitud').focus(true, 200);
    });
    // Store grid stGpGestUM
    stGpGestUM = new Ext.data.Store({
        url: 'listarum',
        listeners: {
            beforeload: function(st, opt) {
                stGpGestUM.baseParams.idmagnitud = smGpGestMagnitud
                        .getSelected().data.idmagnitud;
            }
        },
        sortInfo: {
            field: 'denominacionunidadmedida',
            direction: 'ASC'
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data", id: "idunidadmedida"
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }, {
                name: 'abreviaturaunidadmedida'
            },{
                name: 'decimales'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'idmagnitud'
            }, {
                name: 'iddominionumerico'
            }, {
                name: 'descripcionunidadmedida'
            }, {
                name: 'NomMagnitud'
            }, {
                name: 'red'
            }])
    });
    // Selection Model grid smGpGestUM
    smGpGestUM = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(selectioModel, rowIndex, record) {
                Ext.getCmp('idgpGestUM').getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function(selectioModel, rowIndex, record) {
                Ext.getCmp('idgpGestUM').getView().removeRowClass(rowIndex, "negrita");
            }
        }
    });

    cmgpGestUM = new Ext.grid.ColumnModel({
        defaults: {
            width: 20,
            sortable: true
        },
        columns: [expander_unidadmedida, {
                id: 'expandir',
                header: etiquetasEst.lbDenominacionUnidadMedida,
                width: 150,
                sortable: true,
                dataIndex: 'denominacionunidadmedida'

            }, {
                header: etiquetasEst.lbAbreviatura,
                width: 150,
                sortable: true,
                dataIndex: 'abreviaturaunidadmedida'
            }, {
                header: etiquetasEst.lbFefchaI,
                width: 150,
                sortable: true,
                dataIndex: 'fechainicio'
            }, {
                header: etiquetasEst.lbFefchaF,
                width: 150,
                sortable: true,
                dataIndex: 'fechafin'
            },{
                header: etiquetasEst.lbDecimales,
                width: 20,
                sortable: true,
                dataIndex: 'decimales',
                renderer:function(value,metaData){
                    var img = "true verde";
                    if (value == 0) {
                        img = "false rojo";
                    }
                    metaData.css = "icondistra-" + img;
                }
            }]
    });
    // Grid gestion gpGestUM
    gpGestUM = new Ext.grid.GridPanel({
        id: 'idgpGestUM',
        keyMapGroup: true,
        frame: true,
        //cls: 'x-toolbar',
        stripeRows: true,
        title: etiquetasEst.lbTitGridGestUM,
        autoExpandColumn: 'expandir',
        collapsible: true,
        collapsed: true,
        split: true,
        loadMask: {
            msg: etiquetasEst.lbCarg
        },
        plugins: expander_unidadmedida,
        viewConfig: {
            forceFit: true,
            enableRowBody: true
        },
        store: stGpGestUM,
        region: 'south',
        height: 300,
        titleCollapse: true,
        enableDragDrop: true,
        // forceFit: false,
        sm: smGpGestUM,
        cm: cmgpGestUM,
        tbar: [btnAdicionarUM, btnModificarUM, btnEliminarUM],
        bbar: new Ext.Cont.PagingToolbar({
            pageSize: 20,
            store: stGpGestUM,
            displayInfo: true,
            displayMsg: etiquetasEst.lbDisplayMsg,
            emptyMsg: etiquetasEst.lbEmptyMsg,
            prevText: etiquetasEst.beforePageText,
            nextText: etiquetasEst.afterPageText,
            firstText: etiquetasEst.firstPageText,
            lastText: etiquetasEst.lastPageText
        })
    });
    gpGestUM.getView().getRowClass = function(record, index, rowParams, store) {
        if (record.data.red)
            return 'inactivo';
    };

    pnlGestMagnitud = new Ext.Panel({
        layout: 'border',
        floating: false,
        border: false,
        items: [gpGestMagnitud, gpGestUM],
        tbar: [btnAdicionarMagnitud, btnModificarMagnitud, btnEliminarMagnitud, btnVistaPrevia,'->', btnAyuMagnitud]

    });

    // viewport de la plantilla
    vpUM = new Ext.Viewport({
        layout: 'fit',
        items: [pnlGestMagnitud],
        listeners: {afterlayout: function() {
                btnAdicionarMagnitud.focus();
            }
        }
    })
    //smGpGestMagnitud.dblclick(function(){
    // gpGestUM.expand(); 
    //});

    smGpGestMagnitud.on('selectionchange', function(smodel, rowIndex, record) {
        // aqui especificamos los botones que se activan, al seleccionar una
        // columna        
        if (smGpGestMagnitud.getSelected()) {
            //if(gpGestUM.expand()==false)
            //gpGestUM.expand();        
            if (gpGestMagnitud.getSelectionModel().getSelected().data.urimagnitud == 'tiempo') {
                stGpGestUM.load({
                    params: {
                        start: 0,
                        limit: 20
                    },
                    callback: function() {
                        Ext.getCmp('btnAdicionarUM').focus();
                    }
                });
                btnEliminarMagnitud.enable();// se habilitó
                btnModificarMagnitud.enable();//se habilitó
//              btnAdicionarUM.disable();//se quito preguntar pq se encontraba implementado asi especificamente para la magnitud tiempo....
                btnAdicionarUM.enable();//se agregó..A
                btnEliminarUM.disable();
                btnModificarUM.disable();
                // stGpGestUM.reload();
            } else if (gpGestMagnitud.getSelectionModel().getSelected().data.red == 1) {
                stGpGestUM.load({
                    params: {
                        start: 0,
                        limit: 20
                    },
                    callback: function() {
                        Ext.getCmp('btnAdicionarUM').focus();
                    }
                });
                // btnEliminarMagnitud.disable();
                // btnModificarMagnitud.disable();
                btnAdicionarUM.disable();
                btnEliminarUM.disable();
                btnModificarUM.disable();
                btnEliminarMagnitud.disable();
                btnModificarMagnitud.disable();
                // stGpGestUM.reload();
            } else {
                stGpGestUM.load({
                    params: {
                        start: 0,
                        limit: 20
                    },
                    callback: function() {
                        Ext.getCmp('btnAdicionarUM').focus();
                    }
                });
                btnEliminarMagnitud.enable();
                btnModificarMagnitud.enable();
                btnAdicionarUM.enable();
                btnEliminarUM.disable();
                btnModificarUM.disable();
                // stGpGestUM.reload();
            }
        } else {

            btnEliminarMagnitud.disable();// se habilitó
            btnModificarMagnitud.disable();//se habilitó


        }
        /*
         * else { btnEliminarCategoriaTD.enable();
         * btnModificarCategoriaTD.enable(); }
         */
    }, this);

    smGpGestUM.on('selectionchange', function(smodel, rowIndex, record) {
        // aqui especificamos los botones que se activan, al seleccionar una
        // columna
        if (smGpGestUM.getSelected()) {
            /* if (gpGestUM.getSelectionModel().getSelected().data.NomMagnitud.urimagnitud == 'tiempo') {
             btnEliminarUM.disable();
             btnModificarUM.disable();
             btnAdicionarUM.disable();
             } else */if (gpGestMagnitud.getSelectionModel().getSelected().data.red == 1) {
                // btnEliminarMagnitud.disable();
                // btnModificarMagnitud.disable();
                btnAdicionarUM.disable();
                btnEliminarUM.disable();
                btnModificarUM.disable();
// stGpGestUM.reload();
            } else {
                // stGpGestUM.load({params:{start:0,limit:20}});
                btnEliminarUM.enable();
                btnModificarUM.enable();
                if (gpGestUM.getSelectionModel().getSelected().data.red == 1) {
                    btnEliminarUM.disable();
                    btnModificarUM.disable();
                }
                // btnAdicionarUM.enable();
                // stGpGestUM.reload();
            }

        } else {
            btnEliminarUM.disable();
            btnModificarUM.disable();
        } /*          * else { btnEliminarCategoriaTD.enable();
         * btnModificarCategoriaTD.enable(); }
         */
    }, this);
}

/*
 * function CargarAyuda(opcion) { var urlayuda =
 * "../../../comun/templates/plantillas/" + opcion + "/" + opcion + ".html";
 * window.open(urlayuda, "Ayuda",
 * "width=650,height=400,menubar=yes,scrollbars=yes,resizable=yes"); }
 */

function eliminarMF() {
    if (smGpGestMagnitud.hasSelection())
        mostrarMensaje(2, etiquetasEst.msgSeguro, elimina);
    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.Msg.wait("Eliminando datos de la magnitud...", "Por favor espere...");
            //Secodena.mostrarMascara('maskEliminar', etiquetasEst.lbEspere,
            //etiquetasEst.msgLoadMaskEliminandoDatos);
            // wnLoad.show();
            Ext.Ajax.request({
                url: 'eliminarmagnitud',
                // waitMsg : etiquetasEst.msgGuardandodatosdelamagnitud,
                params: {
                    idmagnitud: gpGestMagnitud.getSelectionModel()
                            .getSelected().data.idmagnitud
                },
                success: function(response, options) {
                    //Secodena.ocultarMascara('maskEliminar');
                    responseData = Ext.decode(response.responseText);
                    Ext.Msg.hide();
                    gpGestMagnitud.getStore().reload({
                        callback: function() {
                            if (responseData.cod == 1) {
                                mostrarMensaje(1, etiquetasEst.msgEliminado);

                                btnEliminarMagnitud.disable();
                                btnModificarMagnitud.disable();
                            } else {
                                if (responseData.mensaje == 'use') {
                                    mostrarMensaje(1, etiquetasEst.msgUsadoMag);
                                    btnEliminarMagnitud.disable();
                                    btnModificarMagnitud.disable();
                                }

                                else {
                                    mostrarMensaje(1, etiquetasEst.msgErrorAction);
                                    btnEliminarMagnitud.disable();
                                    btnModificarMagnitud.disable();
                                }
                            }
                        }
                    });
                    gpGestUM.getStore().removeAll();
                    btnAdicionarUM.disable();
                    btnModificarUM.disable();
                    btnEliminarUM.disable();
                    smGpGestMagnitud.clearSelections();
                }
            });
        } else {
            btnAdicionarMagnitud.focus();
        }
        isOpenW = false;///...para comprobar que alguna ventana este abierta...///
    }
}

function eliminarUM() {
    mostrarMensaje(2, etiquetasEst.msgSeguroUM, elimina);
    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            //Secodena.mostrarMascara('maskEliminar', etiquetasEst.lbEspere, etiquetasEst.msgLoadMaskEliminandoDatosUM);
            Ext.Msg.wait("Eliminando datos de la unidad de medida...", "Por favor espere...");
            Ext.Ajax.request({
                url: 'eliminarum',
                params: {
                    idunidadmedida: gpGestUM.getSelectionModel().getSelected().data.idunidadmedida
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    Ext.Msg.hide();
                    //Secodena.ocultarMascara('maskEliminar');
                    gpGestUM.getStore().reload({
                        callback: function() {
                            if (responseData.cod == 1) {
                                mostrarMensaje(1, etiquetasEst.msgEliminadoUM);
                                btnModificarUM.disable();
                                btnEliminarUM.disable();
                            } else {
                                if (responseData.mensaje == 'use')
                                    mostrarMensaje(1, etiquetasEst.msgUsado);
                                else
                                    mostrarMensaje(1, etiquetasEst.msgErrorAction);

                            }
                            btnModificarUM.disable();
                            btnEliminarUM.disable();
                            smGpGestUM.clearSelections();
                        }
                    });

                }
            });
        } else {
            btnAdicionarUM.focus();
        }
        isOpenW = false;

    }
}