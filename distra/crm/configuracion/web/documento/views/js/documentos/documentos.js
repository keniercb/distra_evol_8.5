/* 
 * Gestionar documentos por subsistema.
 * 
 * @author Ing. Maikel Garcia Valdes.
 * @package ERP-Cuba.
 * @subpackage Configuraci&oacute;n General.
 * @namespace Ext.ConfGnral.Documento
 * @copyright XETID.
 * @version 1.0-0
 */
Ext.namespace('Ext.ConfGnral.Documento');
var perfil = window.parent.UCID.portal.perfil;
Ext.ConfGnral.Documento.DocumentoSubsit = Ext.extend(Ext.Component, {
    perfil: window.parent.UCID.portal.perfil,
    etiquetas: 'undefined',
    constructor: function () {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        DocumentoSubsit = this;
        DocumentoSubsit.isOpenW = false;
        DocumentoSubsit.isOpenWGD = false;
        cont = 0;
        DocumentoSubsit.keys = 'undefined';
        DocumentoSubsit.action = 'adicionar';
        DocumentoSubsit.existeJasper = (function () {
            //this, corresponde al objeto global window
            return this.existe_jasper;
        })();
        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            params: {
                vista: 'documentos'
            },
            callback: function (options, success, response) {
                DocumentoSubsit.etiquetas = Ext.decode(response.responseText);
                DocumentoSubsit.onloadMessageBox(DocumentoSubsit.etiquetas.lbmsgPFE, DocumentoSubsit.etiquetas.lbCargando);
                DocumentoSubsit.verificarIntegracion(DocumentoSubsit.perfil, DocumentoSubsit.etiquetas);
            }
        });
    },
    onloadMessageBox: function (agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 500);
        }
    },
    verificarIntegracion: function (agTtl, agMsg) {
        Ext.Ajax.request({
            method: "POST",
            url: "integradoGestorDocumental",
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData == -1)
                    DocumentoSubsit.cargarInterfaz(agTtl, agMsg, true);
                else
                    DocumentoSubsit.cargarInterfaz(agTtl, agMsg, false);

            }
        });
    },
    cargarInterfaz: function (perfil, etiquetas, gestorDocumental) {
        DocumentoSubsit.lMask = new Ext.LoadMask(Ext.getBody(), {
            msg: DocumentoSubsit.etiquetas.lbCargando
        });

        DocumentoSubsit.btnAdicionar = new Ext.Button({
            text: etiquetas.lbBtnAdicionarp,
            tooltip: etiquetas.lbAdicionarpt,
            disabled: false,
            id: 'btnAdicionar',
            iconCls: 'adicionar',
            hidden: true,
            handler: function () {
                DocumentoSubsit.btnModificar.disable();
                DocumentoSubsit.btnEliminar.disable();
                DocumentoSubsit.isOpenW = true;
                winFp('Add');
            }
        });
        DocumentoSubsit.btnModificar = new Ext.Button({
            text: DocumentoSubsit.etiquetas.lbBtnModificarp,
            tooltip: DocumentoSubsit.etiquetas.lbModificarpt,
            disabled: true,
            id: 'btnModificar',
            iconCls: 'modificar',
            hidden: true,
            handler: function () {
                DocumentoSubsit.isOpenW = true;
                winFp('Mod');
            }
        });
        DocumentoSubsit.btnEliminar = new Ext.Button({
            text: DocumentoSubsit.etiquetas.lbEliminarp,
            tooltip: DocumentoSubsit.etiquetas.lbEliminarpt,
            disabled: true,
            id: 'btnEliminar',
            iconCls: 'eliminar',
            hidden: true,
            handler: function () {
                DocumentoSubsit.btnAdicionar.disable();
                DocumentoSubsit.btnModificar.disable();
                DocumentoSubsit.isOpenW = true;
                eliminarDocumento();
            }
        });

        //esto es solo para una prueba
        DocumentoSubsit.btnPruebaService = new Ext.Button({
            text: 'PruebaService',
            hidden: true,
            id: 'PruebaService',
            iconCls: 'abrir',
            handler: function () {
                //Para levantar la interfaz completa con todo detalles y todo {splash:false}
                if (objetoContenido) {
                    objetoContenido.destroy();
                }
                var objetoContenido = new personalizacionalfresco.gestionarchivos.gestionContenido();
                objetoContenido.inicializarComponente(true);
                //DocumentoSubsit.objetoContenido.winContenido.show();
                var tmp = true;//4bddb922-a93d-4232-93f4-e750be244a81 documento
                //objetoContenido.obtenervtnModificarDocumento('4bddb922-a93d-4232-93f4-e750be244a81');
                objetoContenido.on("obtenerContenidoOK", function (scope) {
                    if (tmp) {
                        objetoContenido.EspacioTrabajoActual.identificador = 'd03133d4-32a8-4381-b51d-0a904bc15eba';
                        objetoContenido.obtenerVtnAdicionarDocumento();
                        //objetoContenido.winContenido.show();
                        //console.log(objetoContenido.EspacioTrabajoActual.identificador);

                        /*var contenidos = new Ext.Panel({
                         items: [objetoContenido.barra2PC*/
                        /*objetoContenido.barra2PC, objetoContenido.panelCentral*/
                        /*]
                         });
                         Ext.getCmp('btnAdministrarReglasMA').disable();
                         var win = new Ext.Window({
                         layout: 'fit',
                         height: 500,
                         width: 850,
                         items: [
                         contenidos
                         ]
                         });
                         win.show();*/
                        tmp = false;
                    }
                    //eventName.observer.removeListener("obtenerContenidoOK", eventName);
                    //DocumentoSubsit.objetoContenido.observer.removeListener("obtenerContenidoOK");
                });
                objetoContenido.on("obtenerContenidoEx", function (eventName) {
                    mostrarMensaje(1, DocumentoSubsit.etiquetas.lbObtenerEspacioEx);
                });
            }
        });

        DocumentoSubsit.btnAyuda = new Ext.Button({
            text: DocumentoSubsit.etiquetas.lbBtnAyuda,
            id: 'btnAyudaDocumentosXsubsistemas',
            iconCls: 'ayuda',
            tooltip: DocumentoSubsit.etiquetas.lntooltipWindAyuda/*,
             handler: function () {
             help.show(etiquetas.lnTitleWindAyuda, 'CG/documentos_primarios');
             }*/
        });

        btnHeredar = new Ext.Button({
            text: etiquetas.lbHeredar,
            tooltip: etiquetas.toolHeredar,
            id: 'btnHeredar',
            iconCls: 'heredar',
            hidden: true,
            handler: function () {
                DocumentoSubsit.isOpenW = true;
                windowHeredar();
            }
        });

        actionValidate.validate();

        function windowHeredar() {
            var entrePress = false;
            var keys = new Ext.KeyMap(Ext.getBody(), [
                {
                    key: Ext.EventObject.ENTER,
                    fn: function () {
                        if (!entrePress && DocumentoSubsit.isOpenW && !Ext.Ajax.isLoading() && Ext.getCmp('aceptarHeredar') && !Ext.getCmp('aceptarHeredar').disabled) {
                            Ext.getCmp('aceptarHeredar').handler.call();
                            enterPress = true;
                        }
                    }
                }, /* {
                 key: "p",
                 alt: true,
                 ctrl: true,
                 fn: function () {
                 if (!Ext.Ajax.isLoading() && Ext.getCmp('aplicarHeredar') && !Ext.getCmp('aplicarHeredar').disabled) {
                 Ext.getCmp('aplicarHeredar').handler.call();
                 }
                 }
                 }, {
                 key: "x",
                 alt: true,
                 fn: function () {
                 Ext.getCmp('cancelarHeredar').handler.call();
                 }
                 }*/
            ]);

            DocumentoSubsit.lMask.show();
            btnCancelarHeredar = new Ext.Button({
                id: 'cancelarHeredar',
                iconCls: 'cancelar',
                tooltip: etiquetas.tooltipCancelar,
                text: etiquetas.lbCancelar,
                handler: function () {
                    DocumentoSubsit.isOpenW = false;
                    wHeredar.close();
                }
            });
            btnAplicarHeredar = new Ext.Button({
                id: 'aplicarHeredar',
                iconCls: 'aplicar',
                disabled: true,
                minWidth: 75,
                tooltip: etiquetas.tooltipAplicar,
                text: etiquetas.lbAplicar,
                handler: function () {
                    selected();
                    adicionarDocumentosHeredar(seleccions, 'apl');
                }
            });
            btnAceptarHeredar = new Ext.Button({
                id: 'aceptarHeredar',
                iconCls: 'aceptar',
                disabled: true,
                tooltip: etiquetas.tooltipAceptar,
                minWidth: 75,
                text: etiquetas.lbAceptar,
                handler: function () {
                    heredar = true;
                    selected();
                    adicionarDocumentosHeredar(seleccions, 'add');
                }
            });

            function selected() {
                seleccions = [];
                for (var i = 0; i < smHeredar.getCount(); i++)
                    seleccions.push(smHeredar.getSelections()[i].json);
            }

            function adicionarDocumentosHeredar(seleccions, add) {
                var msg = (seleccions.length > 1) ? etiquetas.msgInsMany : etiquetas.messloadIns;
                Ext.Msg.wait(etiquetas.lbmsgAddDP, etiquetas.lbmsgPFE);
                Ext.Ajax.request({
                    url: 'insertardocumentoHeredar',
                    params: {
                        seleccions: Ext.encode(seleccions)
                    },
                    method: 'POST',
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        Ext.Msg.hide();
                        if (add === 'add') {
                            DocumentoSubsit.gpDocumento.getStore().reload();
                            wHeredar.close();
                        } else {
                            smHeredar.clearSelections();
                        }
                        if (responseData.retorno == 1) {
                            if (seleccions.length > 1)
                                mostrarMensaje(1, etiquetas.Msgdocsinsertados);
                            else
                                mostrarMensaje(1, etiquetas.Msgdocinsertado);
                            DocumentoSubsit.stgpdocumentos.reload();
                        } else if (responseData.retorno == 2) {
                            mostrarMensaje(1, etiquetas.lbssmExisteSigAdd);
                        }
                    }
                });
            }

            stgpHeredar = new Ext.data.JsonReader({
                totalProperty: 'cant',
                root: 'datos'
            }, [
                {
                    name: 'iddoc'
                },
                {
                    name: 'iddocumentos'
                },
                {
                    name: 'denominacion',
                    mapping: 'NomDocprim.denominacion'
                },
                {
                    name: 'codigo',
                    mapping: 'NomDocprim.codigo'
                },
                {
                    name: 'concepto',
                    mapping: 'NomDocprim.concepto'
                },
                {
                    name: 'sigla'
                },
                {
                    name: 'numinicial'
                },
                {
                    name: 'version'
                },
                {
                    name: 'idestructurasubsist'
                },
                {
                    name: 'nombresubsistema'
                }]);

            stHeredar = new Ext.data.GroupingStore({
                url: 'cargardocumentosHeredar',
                baseParams: {
                    start: 0,
                    limit: 20
                },
                reader: stgpHeredar,
                sortInfo: {
                    field: 'denominacion',
                    direction: "ASC"
                },
                groupField: 'nombresubsistema'
            });

            stHeredar.load({
                callback: function (options, success, response) {
                    DocumentoSubsit.lMask.hide();
                    if (!response)
                        mostrarMensaje(1, etiquetas.noHeredar);
                }
            });
            smHeredar = new Ext.grid.CheckboxSelectionModel();
            smHeredar.on({
                rowselect: function () {
                    if (this.hasSelection()) {
                        btnAplicarHeredar.enable();
                        btnAceptarHeredar.enable();
                    }
                    else {
                        btnAplicarHeredar.disable();
                        btnAceptarHeredar.disable();
                    }
                },
                rowdeselect: function () {
                    if (this.hasSelection()) {
                        btnAplicarHeredar.enable();
                        btnAceptarHeredar.enable();
                    }
                    else {
                        btnAplicarHeredar.disable();
                        btnAceptarHeredar.disable();
                    }
                }
            });

            gpHeredar = new Ext.grid.GridPanel({
                store: stHeredar,
                margins: '2 2 2 -4',
                id: 'gridHeredar',
                sm: smHeredar,
                viewConfig: {forceFit: true},
                enableColumnHide: true,
                autoExpandColumn: 'expandir',
                floating: false,
                stripeRows: true,
                loadMask: DocumentoSubsit.etiquetas.lbCargando,
                columns: [
                    smHeredar,
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'iddoc',
                        sortable: false
                    },
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'iddocumentos',
                        sortable: false
                    },
                    {
                        id: 'expandir',
                        header: etiquetas.lbDenominacion,
                        width: 114,
                        dataIndex: 'denominacion',
                        sortable: true
                    },
                    {
                        header: etiquetas.lbCodigo,
                        width: 105,
                        dataIndex: 'codigo',
                        sortable: true
                    },
                    {
                        header: etiquetas.lbConcepto,
                        width: 100,
                        dataIndex: 'concepto',
                        sortable: true
                    },
                    {
                        header: etiquetas.lbSiglas,
                        width: 100,
                        id: 'datasigla',
                        dataIndex: 'sigla',
                        sortable: true
                    },
                    {
                        header: etiquetas.lbSubsistemas,
                        width: 250,
                        hidden: true,
                        dataIndex: 'nombresubsistema',
                        sortable: true
                    },
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'idestructurasubsist',
                        sortable: false
                    },
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'numinicial',
                        sortable: false
                    },
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'version',
                        sortable: false
                    }],
                tbar: [new Ext.Cont.SearchField({
                    id: 'sfHeredar',
                    width: 250,
                    regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
                    maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
                    emptyText: etiquetas.lbCriterioBuscar,
                    searchTooltip: etiquetas.lbsearchTooltip,
                    fnOnSearch: function () {
                        buscarDocHeredar();
                    },
                    fnOnClear: function () {
                        limpiarDocHeredar();
                    }
                })],
                bbar: new Ext.Cont.PagingToolbar({
                    pageSize: 20,
                    displayInfo: true,
                    displayMsg: etiquetas.lbDisplayMsg,
                    emptyMsg: etiquetas.lbEmptyMsg,
                    store: stHeredar,
                    firstText: etiquetas.lbPrimeraPagina,
                    lastText: etiquetas.lbUltimaPagina
                }),
                view: new Ext.grid.GroupingView({
                    startCollapsed: false,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "en total" : "en total"]})'
                }),
                frame: true,
                collapsible: true,
                animCollapse: false
            });

            wHeredar = new Ext.Window({
                id: 'wHeredar',
                title: etiquetas.titleWinHeredar,
                width: 890,
                height: 500,
                resizable: false,
                constrain: true,
                layout: 'fit',
                defaultButton: 'cancelarHeredar',
                closeAction: 'close',
                modal: true,
                items: [gpHeredar],
                buttons: [btnCancelarHeredar, btnAplicarHeredar, btnAceptarHeredar],
                listeners: {
                    show: function () {
                        this.focus();
                    }, close: function () {
                        DocumentoSubsit.btnAdicionar.focus();
                    }
                }
            });
            wHeredar.show();
        }

        function select(sm) {
            if (sm.getCount() == 1) {
                DocumentoSubsit.btnModificar.enable();
                DocumentoSubsit.btnEliminar.enable();
            } else if (sm.getCount() > 1) {
                DocumentoSubsit.btnModificar.disable();
                DocumentoSubsit.btnEliminar.enable();
            } else {
                DocumentoSubsit.btnModificar.disable();
                DocumentoSubsit.btnEliminar.disable();
            }
        }

        DocumentoSubsit.sm = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    select(sm);
                },
                rowdeselect: function (sm, indiceFila, record) {
                    select(sm);
                }
            }
        });

        DocumentoSubsit.stgpdocreader = new Ext.data.JsonReader({
            totalProperty: 'cant',
            root: 'datos',
            id: 'iddoc'
        }, [
            {
                name: 'iddoc'
            },
            {
                name: 'iddocumentos'
            },
            {
                name: 'denominacion',
                mapping: 'NomDocprim.denominacion'
            },
            {
                name: 'codigo',
                mapping: 'NomDocprim.codigo'
            },
            {
                name: 'concepto',
                mapping: 'NomDocprim.concepto'
            },
            {
                name: 'sigla'
            },
            {
                name: 'numinicial'
            },
            {
                name: 'version'
            },
            {
                name: 'idestructurasubsist'
            },
            {
                name: 'nombresubsistema'
            },
            {
                name: 'espacioTrabajo'
            },
            {
                name: 'idgestordocumental'
            },
            {
                name: 'dirreporte'
            }]);

        DocumentoSubsit.stgpdocumentos = new Ext.data.GroupingStore({
            url: 'cargardocumentos',
            autoLoad: true,
            baseParams: {
                start: 0,
                limit: 20
            },
            reader: DocumentoSubsit.stgpdocreader,
            sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            },
            groupField: 'nombresubsistema'
        });

        DocumentoSubsit.stgpdocumentos.on('beforeload', function () {
            DocumentoSubsit.btnModificar.disable();
            DocumentoSubsit.btnEliminar.disable();
            cont++;
            if (cont > 1)
                DocumentoSubsit.lMask.show();
        });

        DocumentoSubsit.stgpdocumentos.on('load', function () {
            DocumentoSubsit.lMask.hide();
            DocumentoSubsit.sm.selectFirstRow();
            Ext.MessageBox.hide();
            if (DocumentoSubsit.stgpdocumentos.getTotalCount() == 0) {
                DocumentoSubsit.btnModificar.disable();
                DocumentoSubsit.btnEliminar.disable();
                if (DocumentoSubsit.sfDocumentos.hasSearch) {
                    mostrarMensaje(1, etiquetas.NoExisDQM);
                } else {
                    mostrarMensaje(1, etiquetas.NoResultados);
                }
            }

        });

        DocumentoSubsit.cmDocumento = [
            {hidden: true, hideable: false, dataIndex: 'iddoc', sortable: false},
            {hidden: true, hideable: false, dataIndex: 'iddocumentos', sortable: false},
            {
                id: 'expandir',
                header: DocumentoSubsit.etiquetas.lbDenominacion,
                width: 114,
                dataIndex: 'denominacion',
                sortable: true
            },
            {header: DocumentoSubsit.etiquetas.lbCodigo, width: 105, dataIndex: 'codigo', sortable: true},
            {header: DocumentoSubsit.etiquetas.lbConcepto, width: 100, dataIndex: 'concepto', sortable: true},
            {
                header: DocumentoSubsit.etiquetas.lbSiglas,
                width: 150,
                id: 'datasigla',
                dataIndex: 'sigla',
                sortable: true
            },
            {
                header: DocumentoSubsit.etiquetas.lbSubsistemas,
                width: 250,
                hidden: true,
                dataIndex: 'nombresubsistema',
                sortable: true
            },
            {hidden: true, hideable: false, dataIndex: 'idestructurasubsist', sortable: false},
            {hidden: true, hideable: false, dataIndex: 'numinicial', sortable: false},
            {hidden: true, hideable: false, dataIndex: 'version', sortable: false}
        ];

        if (gestorDocumental) {
            var colTipo = {
                    header: DocumentoSubsit.etiquetas.lbGestDoc,
                    width: 200,
                    id: 'gDocumenatal',
                    dataIndex: 'idgestordocumental',
                    sortable: true
                },
                colEspacio = {
                    header: DocumentoSubsit.etiquetas.lbEspTrab,
                    width: 200,
                    id: 'eTrabajo',
                    dataIndex: 'espacioTrabajo',
                    sortable: true
                };
            DocumentoSubsit.cmDocumento.push(colTipo);
            DocumentoSubsit.cmDocumento.push(colEspacio);
        }

        if (DocumentoSubsit.existeJasper) {
            var dirReporte = {
                header: DocumentoSubsit.etiquetas.lbDirReporte,
                width: 200,
                dataIndex: 'dirreporte',
                sortable: true
            };
            DocumentoSubsit.cmDocumento.push(dirReporte);
        }

        DocumentoSubsit.gpDocumento = new Ext.grid.GridPanel({
            store: DocumentoSubsit.stgpdocumentos,
            margins: '2 2 2 -4',
            id: 'grid_panel_documentos',
            sm: DocumentoSubsit.sm,
            viewConfig: {forceFit: true},
            enableColumnHide: true,
            autoExpandColumn: 'expandir',
            floating: false,
            stripeRows: true,
            columns: DocumentoSubsit.cmDocumento,
            tbar: [DocumentoSubsit.sfDocumentos = new Ext.Cont.SearchField({
                id: 'sfDocumentos',
                width: 250,
                regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
                maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
                emptyText: DocumentoSubsit.etiquetas.lbCriterioBuscar,
                searchTooltip: DocumentoSubsit.etiquetas.lbsearchTooltip,
                fnOnSearch: function () {
                    buscarDoc();
                },
                fnOnClear: function () {
                    limpiarDoc();
                }
            })],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: true,
                displayMsg: DocumentoSubsit.etiquetas.lbDisplayMsg,
                emptyMsg: DocumentoSubsit.etiquetas.lbEmptyMsg,
                store: DocumentoSubsit.stgpdocumentos,
                firstText: etiquetas.lbPrimeraPagina,
                lastText: etiquetas.lbUltimaPagina
            }),
            view: new Ext.grid.GroupingView({
                startCollapsed: true,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "en total" : "en total"]})'
            }),
            frame: false,
            border: false,
            collapsible: true,
            animCollapse: false
        });

        DocumentoSubsit.cmbOrganos = new Ext.CmbOrganos({
            idioma: etiquetas,
            gridStore: DocumentoSubsit.stgpdocumentos
        });

        DocumentoSubsit.tbar = [DocumentoSubsit.btnAdicionar, DocumentoSubsit.btnModificar, DocumentoSubsit.btnEliminar, btnHeredar, DocumentoSubsit.btnPruebaService, '->', DocumentoSubsit.cmbOrganos, DocumentoSubsit.btnAyuda];

        DocumentoSubsit.template = new Ext.CmpTemplate({
            tabparent: DocumentoSubsit.tbar,
            position: 4,
            createurl: 'crearPlantilla',
            useurl: 'usarPlantilla',
            idioma: etiquetas
        });

        DocumentoSubsit.template.on({
            confirm: function (action) {
                if (action == 'use') {
                    DocumentoSubsit.gpDocumento.getStore().load();
                }
            }
        });

        DocumentoSubsit.panel = new Ext.Panel({
            layout: 'fit',
            loadMask: DocumentoSubsit.etiquetas.lbCargando,
            listeners: {
                render: function () {
                    DocumentoSubsit.btnAdicionar.focus();
                }
            },
            items: [DocumentoSubsit.gpDocumento],
            tbar: DocumentoSubsit.tbar
        });
        var kmTeclasCalientes = new Ext.KeyMap(Ext.getBody(), [
            {
                key: 'i',
                alt: true,
                fn: function () {
                    var btn = DocumentoSubsit.btnAdicionar;
                    if (!btn.disabled && !btn.hidden && DocumentoSubsit.isOpenW == false)
                        btn.handler.call();
                }
            }, {
                key: 'm',
                alt: true,
                fn: function () {
                    var btn = DocumentoSubsit.btnModificar;
                    if (!btn.disabled && !btn.hidden && DocumentoSubsit.isOpenW === false)
                        btn.handler.call();
                }
            }, {
                key: Ext.EventObject.DELETE,
                fn: function () {
                    var btn = DocumentoSubsit.btnEliminar;
                    if (!btn.disabled && !btn.hidden && DocumentoSubsit.isOpenW === false)
                        btn.handler.call();
                }
            }, {
                key: 'b',
                alt: true,
                fn: function () {
                    if (Ext.getCmp('sfDocumentos').getRawValue().length > 0) {
                        Ext.getCmp('sfDocumentos').onTrigger2Click();
                    } else {
                        Ext.getCmp('sfDocumentos').focus();
                    }
                }
            }, {
                key: 'l',
                alt: true,
                fn: function () {
                    if (Ext.getCmp('sfDocumentos').getRawValue().length > 0) {
                        Ext.EventObject.stopEvent();
                        Ext.getCmp('sfDocumentos').onTrigger1Click();
                    }
                }
            }, /*{
             key: 'h',
             alt: true,
             fn: function () {
             if (!Ext.EventObject.ctrlKey && DocumentoSubsit.isOpenW === false)
             DocumentoSubsit.btnAyuda.handler.call();
             }
             },*/ {
                key: 'h',
                alt: true,
                ctrl: true,
                fn: function () {
                    var btn = btnHeredar;
                    if (!btn.hidden && DocumentoSubsit.isOpenW === false)
                        btn.handler.call();
                }
            }
        ]);

        vpDocumento = new Ext.Viewport({
            layout: 'fit',
            items: DocumentoSubsit.panel
        });

        DocumentoSubsit.stSubsistema = new Ext.data.Store({
            url: 'cargarsubsistemas',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idestructurasubsist"
            }, [{
                name: 'idestructurasubsist'
            }, {
                name: 'nombresubsistema'
            }])/*,
             listeners: {
             load: function(store) {
             console.info(store);
             var id = store.data.items[0].get('idestructurasubsist');
             var nombre = store.data.items[0].get('nombresubsistema');

             console.info(id);
             console.info(nombre);

             DocumentoSubsit.subsistema.setRawValue(nombre);
             DocumentoSubsit.subsistema.setValue(id);
             }
             }*/
        });

        DocumentoSubsit.subsistema = new Ext.form.ComboBox({
            fieldLabel: DocumentoSubsit.etiquetas.lbSubsistemas,
            emptyText: DocumentoSubsit.etiquetas.emptyText,
            forceSelection: true,
            blankText: DocumentoSubsit.etiquetas.campoObligatorio,
            allowBlank: false,
            typeAhead: true,
            store: DocumentoSubsit.stSubsistema,
            name: 'idestructurasubsist',
            displayField: 'nombresubsistema',
            valueField: 'idestructurasubsist',
            triggerAction: 'all',
            hiddenName: 'idestructurasubsist',
            mode: 'local',
            tpl: '<tpl for="."><div ext:qtip="{nombresubsistema}" class="x-combo-list-item">{nombresubsistema}</div></tpl>',
            anchor: '95%'

        });
        DocumentoSubsit.subsistema.on('select', cargarnomdoc);

        DocumentoSubsit.stDocumentos = new Ext.data.Store({
            url: 'cargarnomdoc',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cant',
                root: 'datos',
                id: 'iddocumentos'
            }, [
                {
                    name: 'iddocumentos'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'codigo'
                },
                {
                    name: 'sigla'
                },
                {
                    name: 'numinicial'
                },
                {
                    name: 'tituloDocumento'
                },
                {
                    name: 'abreviatura'
                },
                {
                    name: 'idDocumento'
                },
                {
                    name: 'nombreEspTrabajo'
                },
                {
                    name: 'idEspTrabajo'
                },
                {
                    name: 'idespaciotrabajo'
                },
                {
                    name: 'dirreporte'
                }
            ])
        });

        function cargarnomdoc() {
            DocumentoSubsit.fpDocumento.enable();
            DocumentoSubsit.sm1.clearSelections();
            DocumentoSubsit.stDocumentos.load({
                params: {
                    idestructurasubsist: DocumentoSubsit.subsistema.getValue(),
                    start: 0,
                    limit: 20
                }
            });
        }

        DocumentoSubsit.stDocumentos.on('load', function () {
            Ext.getCmp('panelNomenclador').enable();
            if (DocumentoSubsit.stDocumentos.getTotalCount() == 0) {
                mostrarMensaje(1, etiquetas.NoExisDQM);
                Ext.getCmp('panelNomenclador').disable();
            }
        });

        DocumentoSubsit.sm1 = new Ext.grid.CheckboxSelectionModel({
            listeners: {
                rowselect: function (sm) {
                    checkWindow();
                },
                rowdeselect: function () {
                    checkWindow();
                }
            }
        });
//        DocumentoSubsit.sm1.on({
//            rowselect: function() {
//                if (this.hasSelection()) {
//                    btnAplicarHeredar.enable();
//                    btnAceptarHeredar.enable();
//                }
//                else {
//                    btnAplicarHeredar.disable();
//                    btnAceptarHeredar.disable();
//                }
//            },
//            rowdeselect: function() {
//                if (this.hasSelection()) {
//                    btnAplicarHeredar.enable();
//                    btnAceptarHeredar.enable();
//                }
//                else {
//                    btnAplicarHeredar.disable();
//                    btnAceptarHeredar.disable();
//                }
//            }
//        });

        DocumentoSubsit.texteditor = new Ext.form.TextField({
            id: 'tfeditor',
            name: 'texteditor',
            allowBlank: false,
            maxLength: 50,
            maxLengthText: DocumentoSubsit.etiquetas.lbMaxLengthText,
            regex: /^[\w\s\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\+\-\/\*\_]+$/,
            maskRe: /^[\w\s\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\+\-\/\*\_]+$/,
            regexText: DocumentoSubsit.etiquetas.textAlfaNum
        });

        DocumentoSubsit.texteditorNumInicial = new Ext.form.TextField({
            id: 'tfinicial',
            name: 'numinicial',
            allowBlank: true,
            maxLength: 19,
            maxLengthText: DocumentoSubsit.etiquetas.lbMaxLengthNum,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            regexText: DocumentoSubsit.etiquetas.lbNumeros
        });

        DocumentoSubsit.texteditorDirReport = new Ext.form.TextField({
            allowBlank: true,
            maxLength: 255
        });

        DocumentoSubsit.stDocument = new Ext.data.Store({
            reader: new Ext.data.DataReader({
                id: 'idDocument'
            }, [{
                name: 'idTipoDocumento'
            }, {
                name: 'tituloDocumento'
            }
            ])
        });
        DocumentoSubsit.cbGestDocumental = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'cbGestDocumental',
            resizable: true,
            mode: 'local',
            hideTrigger: true,
            editable: true,
            value: 'sad',
            store: DocumentoSubsit.stDocument,
            valueField: 'idTipoDocumento',
            displayField: 'tituloDocumento',
            hiddenName: 'idTipoDocumento',
            forceSelection: true,
            anchor: '100%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: true,
            allowBlank: false,
            readOnly: true
        });
        DocumentoSubsit.cbGestDocumental.on(
            'focus', function (e) {
                windowDocGestDocumental('GD');
            }
        );

        DocumentoSubsit.stEspTrabajo = new Ext.data.Store({
            reader: new Ext.data.DataReader({
                id: 'stEspTrabajo'
            }, [{
                name: 'idEspTrabajo'
            }, {
                name: 'nombreEspTrabajo'
            }
            ])
        });
        DocumentoSubsit.cbEspTrabajo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'cbEspTrabajo',
            resizable: true,
            mode: 'local',
            hideTrigger: true,
            editable: true,
            store: DocumentoSubsit.stEspTrabajo,
            valueField: 'idEspTrabajo',
            displayField: 'nombreEspTrabajo',
            hiddenName: 'idEspTrabajo',
            forceSelection: true,
            anchor: '100%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: true,
            allowBlank: false,
            readOnly: true
        });
        DocumentoSubsit.cbEspTrabajo.on(
            'focus', function (e) {
                windowDocGestDocumental('GD');
            }
        );

        function windowDocGestDocumental(parametro) {
            if (!keysGD) {
                var keysGD = new Ext.KeyMap(Ext.getBody(), [
                    {
                        key: Ext.EventObject.ENTER,
                        fn: function () {
                            if (DocumentoSubsit.isOpenWGD && Ext.getCmp('aceptarGestDocumental') && !Ext.getCmp('aceptarGestDocumental').disabled) {
                                enterPress = true;
                                onAcept();
                            }
                        }
                    }/*, {
                     key: "x",
                     alt: true,
                     fn: function () {
                     if (DocumentoSubsit.isOpenWGD) {
                     onCancel();
                     }
                     }
                     }*/
                ]);
            } else {
                keysGD.enable();
            }

            btnCancelarGestDocumental = new Ext.Button({
                id: 'cancelarGestDocumental',
                iconCls: 'cancelar',
                minWidth: 75,
                tooltip: etiquetas.tooltipCancelar,
                text: etiquetas.lbCancelar,
                handler: function () {
                    onCancel();
                }

            });
            btnAceptarGestDocumental = new Ext.Button({
                id: 'aceptarGestDocumental',
                iconCls: 'aceptar',
                minWidth: 75,
                tooltip: etiquetas.tooltipAceptar,
                disabled: true,
                text: etiquetas.lbAceptar,
                handler: function () {
                    onAcept();
                }

            });

            function documentosEspTrabajo() {
                documento = smGestDocumental.getSelected().data.tituloDocumento;
                idDocumento = smGestDocumental.getSelected().data.idTipoDocumento;
                nombreEspTrabajo = treeEspTrabajo.getSelectionModel().getSelectedNode().attributes.text;
                idEspTrabajo = treeEspTrabajo.getSelectionModel().getSelectedNode().attributes.id;
                winDocGestDocumental.destroy();
                var record = DocumentoSubsit.stDocumentos.getAt(row);
                record.set('tituloDocumento', documento);
                record.set('idDocumento', idDocumento);
                record.set('nombreEspTrabajo', nombreEspTrabajo);
                record.set('idEspTrabajo', idEspTrabajo);
                DocumentoSubsit.cbGestDocumental.setValue(idDocumento);
                DocumentoSubsit.cbGestDocumental.setRawValue(documento);
                DocumentoSubsit.cbEspTrabajo.setValue(idEspTrabajo);
                DocumentoSubsit.cbEspTrabajo.setRawValue(nombreEspTrabajo);
            }

            function documentosEspTrabajoModificar() {
                if (smGestDocumental.hasSelection()) {
                    var documento = smGestDocumental.getSelected().data.tituloDocumento;
                    var idDocumento = smGestDocumental.getSelected().data.idTipoDocumento;
                    DocumentoSubsit.cbGestDocumentalModificar.setValue(documento);
                    DocumentoSubsit.cbGestDocumentalModificar.setRawValue(documento);
                    DocumentoSubsit.cbGestDocumentalModificar.fireEvent('setValue', documento, documento);

                }
                if (treeEspTrabajo.getSelectionModel().getSelectedNode()) {
                    var espacioId = treeEspTrabajo.getSelectionModel().getSelectedNode().attributes.id;
                    var espacioText = treeEspTrabajo.getSelectionModel().getSelectedNode().attributes.text;
                    DocumentoSubsit.cbEspTrabajoModificar.setValue(espacioId);
                    DocumentoSubsit.cbEspTrabajoModificar.setRawValue(espacioText);
                    DocumentoSubsit.cbEspTrabajoModificar.fireEvent('setValue', espacioId, espacioText);
                }
                winDocGestDocumental.destroy();
            }

            function onCancel() {
                winDocGestDocumental.destroy();
            }

            function onAcept() {
                if (parametro === 'GD') {
                    documentosEspTrabajo();
                }
                else {
                    documentosEspTrabajoModificar();
                }
            }

            stGestDocumental = new Ext.data.Store({
                url: 'cargarGestDocumental',
                autoLoad: true,
                reader: new Ext.data.JsonReader({
                    totalProperty: "total",
                    root: "data",
                    id: "idGestDocumental"
                }, [{
                    name: 'idTipoDocumento'
                }, {
                    name: 'tituloDocumento'
                }
                ])
            });
            smGestDocumental = new Ext.grid.RowSelectionModel({
                singleSelect: true
            });
            smGestDocumental.on({
                rowselect: function () {
                    if (parametro === 'GD') {
                        if (treeEspTrabajo.getSelectionModel().getSelectedNode() && treeEspTrabajo.getSelectionModel().getSelectedNode().attributes.id != 0)
                            btnAceptarGestDocumental.enable();
                        else
                            btnAceptarGestDocumental.disable();
                    }
                    else {
                        btnAceptarGestDocumental.enable();
                    }
                },
                rowdeselect: function () {
                    if (parametro === 'GD')
                        btnAceptarGestDocumental.disable();
                    else if (treeEspTrabajo.getSelectionModel().getSelectedNode())
                        btnAceptarGestDocumental.enable();
                }
            });
            gridGestDocumental = new Ext.grid.GridPanel({
                id: 'docGestDocumental',
                title: etiquetas.titleGridGestDocumental,
                store: stGestDocumental,
                region: 'center',
                viewConfig: {forceFit: true},
                margins: '2 2 2 -4',
                sm: smGestDocumental,
                autoExpandColumn: 'expandir',
                loadMask: 'Cargando...',
                floating: false,
                stripeRows: true,
                border: false,
                columns: [
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'idTipoDocumento',
                        sortable: false
                    },
                    {
                        id: 'expandir',
                        header: etiquetas.lbtipoDoc,
                        width: 114,
                        dataIndex: 'tituloDocumento',
                        sortable: true
                    }
                ],
                bbar: new Ext.Cont.PagingToolbar({
                    pageSize: 20,
                    store: stGestDocumental
                })
            });

            treeLoaderEspTrabajo = new Ext.tree.TreeLoader({
                dataUrl: 'cargarTreeEspTrabajo'
            });

            treeEspTrabajo = new Ext.tree.TreePanel({
                region: 'east',
                width: 300,
                autoScroll: true,
                split: true,
                layoutConfig: {
                    animate: true
                },
                enableDD: true,
                loader: treeLoaderEspTrabajo,
                loadMask: function (msg) {
                    this.mask = new Ext.LoadMask(this.body, {
                        msg: msg
                    });
                    this.mask.show();
                }
            });

            function loadMask(message) {
                lMask = new Ext.LoadMask(Ext.getBody(), {
                    msg: message
                });
                lMask.show();
            }

            treeLoaderEspTrabajo.on('load', function (This, node, response) {
                try {
                    lMask.hide();
                } catch (e) {

                }
            });

            treeSort = new Ext.tree.TreeSorter(treeEspTrabajo, {
                folderSort: true,
                dir: "asc",
                caseSensitive: true
            });

            nodoPadre = new Ext.tree.AsyncTreeNode({
                text: etiquetas.titleTreeEspTrabajo,
                draggable: false,
                id: '0',
                expanded: true
            });

            treeEspTrabajo.setRootNode(nodoPadre);

            treeEspTrabajo.getSelectionModel().on(
                {
                    selectionchange: function (sm, node) {
                        if (node) {
                            nombre = node.text;
                            id = node.id;
                            if (parametro === 'GD') {
                                if (this.getSelectedNode() && smGestDocumental.hasSelection() && id != 0) {
                                    btnAceptarGestDocumental.enable();
                                } else {
                                    btnAceptarGestDocumental.disable();
                                }
                            }
                            else if (this.getSelectedNode() && id != 0) {
                                btnAceptarGestDocumental.enable();
                            } else {
                                btnAceptarGestDocumental.disable();
                            }
                        }
                    }
                }
            );

            treeEspTrabajo.on('contextmenu', function (n, e) {
                if (gestorDocumental) {
                    var itemsMenu = new Array,
                        showmenu = false;
                    if (actionValidate.actions['btnAdicionarET']) {
                        itemsMenu.push({
                            text: etiquetas.lbAdicionarEspacio,
                            id: 'btnAdicionarET',
                            iconCls: 'adicionar',
                            handler: function () {
                                var objetoContenido = new personalizacionalfresco.gestionarchivos.gestionContenido({splash: false});
                                objetoContenido.inicializarComponente(true, n.attributes.id == 0 ? 'raiz' : n.attributes.id);
                                var tmp = true;
                                objetoContenido.on("obtenerContenidoOK", function (eventName) {
                                    if (tmp) {
                                        objetoContenido.obtenerVtnAdicionarEspacioTrabajo();
                                        tmp = false;
                                    }
                                });
                                objetoContenido.on("obtenerContenidoEx", function (eventName) {
                                    mostrarMensaje(1, DocumentoSubsit.etiquetas.lbObtenerEspacioEx);
                                });
                                objetoContenido.on("addEspacioW", function (eventName) {
                                    loadMask(DocumentoSubsit.etiquetas.lbCargando);
                                    treeEspTrabajo.getLoader().load(n, function () {
                                        treeEspTrabajo.expandPath(n.getPath());
                                    });
                                });
                            }
                        });
                        showmenu = true;
                    }
                    if (n.attributes.id != 0) {
                        if (actionValidate.actions['btnModificarET']) {
                            itemsMenu.push({
                                text: etiquetas.lbModificarEspacio,
                                iconCls: 'modificar',
                                id: 'btnModificarET',
                                handler: function () {
                                    var objetoContenido = new personalizacionalfresco.gestionarchivos.gestionContenido({splash: false});
                                    objetoContenido.inicializarComponente(true);
                                    objetoContenido.obtenerVtnModificarEspacioTrabajo(n.attributes.id);
                                    objetoContenido.on("modEspacioW", function (eventName) {
                                        loadMask(etiquetas.lbTEliminando);
                                        /*treeEspTrabajo.getRootNode().reload();
                                         treeEspTrabajo.expandPath(n.getPath());*/
                                        var tmp = n.parentNode;
                                        treeEspTrabajo.getLoader().load(n.parentNode, function () {
                                            tmp.expand();
                                        });
                                    });
                                    objetoContenido.vtnModificarEspacioTrabajo.on('hide', function () {
                                        objetoContenido.vtnModificarEspacioTrabajo.destroy();
                                    });
                                    objetoContenido.vtnModificarEspacioTrabajo.on('close', function () {
                                        objetoContenido.vtnModificarEspacioTrabajo.destroy();
                                    });
                                }
                            });
                            showmenu = true;
                        }
                        if (actionValidate.actions['btnEliminarET']) {
                            itemsMenu.push({
                                text: etiquetas.lbEliminarEspacio,
                                iconCls: 'eliminar',
                                id: 'btnEliminarET',
                                handler: function () {
                                    mostrarMensaje(2, DocumentoSubsit.etiquetas.lbEliminarEspacioConfirmacion, function (response) {
                                        if (response == 'ok') {
                                            nodoPadreEspW = n.parentNode;
                                            loadMask(etiquetas.lbTEliminando);
                                            Ext.Ajax.request({
                                                url: 'eliminarEspTrabajo',
                                                method: 'POST',
                                                params: {
                                                    idEspW: n.attributes.id
                                                },
                                                callback: function (options, success, response) {
                                                    responseData = Ext.decode(response.responseText);
                                                    Ext.Msg.hide();
                                                    if (responseData.codMsg == -2) {
                                                        mostrarMensaje(1, etiquetas.textEliminarEspTrabajoEx);
                                                    } else {
                                                        mostrarMensaje(1, etiquetas.textEliminarEspTrabajo);
                                                        treeEspTrabajo.getLoader().load(nodoPadreEspW, function () {
                                                            treeEspTrabajo.expandPath(nodoPadreEspW.getPath());
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                            showmenu = true;
                        }

                    }
                    if (showmenu) {
                        contextMenu = new Ext.menu.Menu({
                            items: itemsMenu
                        });
                        contextMenu.showAt(e.getXY());
                    }
                }
            });


            winDocGestDocumental = new Ext.Window({
                title: etiquetas.titleWindocGestDocumental,
                width: 700,
                height: 500,
                resizable: false,
                closeAction: 'destroy',
                constrain: true,
                keys: keysGD,
                id: 'winDocGestDocumental',
                layout: 'border',
                modal: true,
                defaultButton: 'cancelarGestDocumental',
                items: [gridGestDocumental, treeEspTrabajo],
                buttons: [btnCancelarGestDocumental, btnAceptarGestDocumental],
                listeners: {
                    show: function () {
                        DocumentoSubsit.isOpenWGD = true;
                        winDocGestDocumental.focus();
                    },
                    destroy: function () {
                        DocumentoSubsit.isOpenWGD = false;
                        keysGD.disable();
                        if (treeLoaderEspTrabajo.isLoading()) {
                            Ext.Ajax.abort(treeLoaderEspTrabajo.transId);
                        }
                        if (Ext.Ajax.isLoading()) {
                            Ext.Ajax.abort();
                        }
                    }
                }
            });


            winDocGestDocumental.show();
        }

        DocumentoSubsit.cmfpDocumento = [
            DocumentoSubsit.sm1,
            {hidden: true, dataIndex: 'iddocumentos', hideable: false},
            {
                id: 'expandir',
                header: DocumentoSubsit.etiquetas.lbDenominacion,
                width: 200,
                dataIndex: 'denominacion',
                sortable: true
            },
            {header: DocumentoSubsit.etiquetas.lbCodigo, width: 100, dataIndex: 'codigo', sortable: true},
            {
                header: DocumentoSubsit.etiquetas.lbSiglas,
                width: 100,
                dataIndex: 'abreviatura',
                editor: DocumentoSubsit.texteditor,
                sortable: true
            },
            {
                header: DocumentoSubsit.etiquetas.lbNumInicial,
                width: 100,
                dataIndex: 'numinicial',
                editor: DocumentoSubsit.texteditorNumInicial,
                sortable: true
            }
        ];

        if (gestorDocumental) {
            var colTipo = {
                    header: DocumentoSubsit.etiquetas.lbGestDoc,
                    width: 150,
                    id: 'gDocumenatal',
                    dataIndex: 'tituloDocumento',
                    editor: DocumentoSubsit.cbGestDocumental,
                    sortable: true
                },
                colidDoc = {hidden: true, hideable: false, dataIndex: 'idDocumento'},
                colNomEsp = {
                    header: DocumentoSubsit.etiquetas.lbEspTrab,
                    width: 130,
                    id: 'eTrabajo',
                    dataIndex: 'nombreEspTrabajo',
                    editor: DocumentoSubsit.cbEspTrabajo,
                    sortable: true
                },
                colIdEsp = {hidden: true, hideable: false, dataIndex: 'idEspTrabajo'};
            DocumentoSubsit.cmfpDocumento.push(colTipo);
            DocumentoSubsit.cmfpDocumento.push(colidDoc);
            DocumentoSubsit.cmfpDocumento.push(colNomEsp);
            DocumentoSubsit.cmfpDocumento.push(colIdEsp);
        }

        if (DocumentoSubsit.existeJasper) {
            var dirReporte = {
                header: DocumentoSubsit.etiquetas.lbDirReporte,
                width: 200,
                dataIndex: 'dirreporte',
                sortable: true,
                editor: DocumentoSubsit.texteditorDirReport
            };
            DocumentoSubsit.cmfpDocumento.push(dirReporte);
        }

        DocumentoSubsit.fpDocumento = new Ext.grid.EditorGridPanel({
            disabled: true,
            frame: true,
            autoExpandColumn: 'expandir',
            store: DocumentoSubsit.stDocumentos,
            margins: '2 2 2 -4',
            viewConfig: {forceFit: true},
            stripeRows: true,
            sm: DocumentoSubsit.sm1,
            loadMask: DocumentoSubsit.etiquetas.lbCargando,
            enableColumnHide: true,
            floating: false,
            clicksToEdit: 1,
            columns: DocumentoSubsit.cmfpDocumento,
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: true,
                displayMsg: DocumentoSubsit.etiquetas.lbDisplayMsg,
                emptyMsg: DocumentoSubsit.etiquetas.lbEmptyMsg,
                store: DocumentoSubsit.stDocumentos,
                firstText: etiquetas.lbPrimeraPagina,
                lastText: etiquetas.lbUltimaPagina
            })
        });

        DocumentoSubsit.fpDocumento.on({
            beforeedit: function (e) {
                column = e.column;
                row = e.row;
            }
        });

        DocumentoSubsit.fpventana = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            border: false,
            id: 'fpDocAdic',
            layout: 'column',
            bodyStyle: 'padding:2px 2px 0',
            waitMsgTarget: false,
            items: [{
                columnWidth: 0.25,
                layout: 'form',
                items: [DocumentoSubsit.subsistema]
            }, {
                columnWidth: 0.50,
                layout: 'form',
                items: [new Ext.form.Label({text: '\x7F'})]
            }, {
                columnWidth: 0.25,
                layout: 'form',
                items: [new Ext.Cont.SearchField({
                    id: 'sfBuscar',
                    anchor: '100%',
                    regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
                    maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
                    emptyText: etiquetas.lbCriterioBuscar,
                    labelSeparator: ' ',
                    searchTooltip: etiquetas.lbsearchTooltip,
                    fnOnSearch: function () {
                        buscarDocSubsistema();
                    },
                    fnOnClear: function () {
                        limpiarDocSubsistema();
                    }
                })]
            }, {
                columnWidth: 1,
                layout: 'form',
                items: [{
                    xtype: 'panel',
                    id: 'panelNomenclador',
                    layout: 'fit',
                    height: 265,
                    items: DocumentoSubsit.fpDocumento
                }]
            }]
        });

        DocumentoSubsit.stDocumentModificar = new Ext.data.Store({
            reader: new Ext.data.DataReader({
                id: 'stDocumentModificar'
            }, [{
                name: 'idTipoDocumento'
            }, {
                name: 'tituloDocumento'
            }
            ])
        });

        /*DocumentoSubsit.cbGestDocumentalModificar = new Ext.form.TextField({
         name: 'idgestordocumental',
         fieldLabel: 'Documentos',
         editable: false,
         name:'idgestordocumental',
         anchor: '100%',
         allowBlank: true
         });*/
        DocumentoSubsit.cbGestDocumentalModificar = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'cbGestDocumentalModificar',
            name: 'idgestordocumental',
            fieldLabel: etiquetas.lbGestDoc,
            resizable: true,
            mode: 'local',
            hideTrigger: true,
            editable: true,
            store: DocumentoSubsit.stDocumentModificar,
            valueField: 'idTipoDocumento',
            displayField: 'tituloDocumento',
            //hiddenName: 'idTipoDocumento',
            hiddenName: 'idgestordocumental',
            forceSelection: true,
            anchor: '100%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: true,
            allowBlank: true,
            readOnly: true
        });
        DocumentoSubsit.cbGestDocumentalModificar.addEvents('setValue');
        DocumentoSubsit.cbGestDocumentalModificar.on(
            {
                focus: function (e) {
                    windowDocGestDocumental('MOD');
                },
                setValue: function () {
                    checkWindow();
                }
            },
            {}
        );
        DocumentoSubsit.stEspTrabajoModificar = new Ext.data.Store({
            reader: new Ext.data.DataReader({
                id: 'stEspTrabajoModificar'
            }, [{
                name: 'idEspTrabajo'
            }, {
                name: 'nombreEspTrabajo'
            }
            ])
        });

        /*DocumentoSubsit.cbEspTrabajoModificar = new Ext.form.TextField({
         fieldLabel: 'Espacio de trabajo',
         editable: false,
         name:'espacioTrabajo',
         anchor: '100%',
         allowBlank: true
         });*/

        DocumentoSubsit.cbEspTrabajoModificar = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'cbEspTrabajoModificar',
            fieldLabel: 'Espacio de trabajo',
            resizable: true,
//            disabled: true,
            mode: 'local',
            hideTrigger: true,
            editable: true,
            store: DocumentoSubsit.stEspTrabajoModificar,
            valueField: 'idEspTrabajo',
            displayField: 'nombreEspTrabajo',
            //hiddenName: 'idEspTrabajo',
            hiddenName: 'espacioTrabajo',
            forceSelection: true,
            anchor: '100%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: true,
            allowBlank: true,
            readOnly: true
        });
        DocumentoSubsit.cbEspTrabajoModificar.addEvents('setValue');
        DocumentoSubsit.cbEspTrabajoModificar.on(
            {
                focus: function (e) {
                    windowDocGestDocumental('MOD');
                },
                setValue: function () {
                    //console.log('setValue');
                    checkWindow();
                }
            }
        );

        DocumentoSubsit.tfDirReporteModificar = new Ext.form.TextField({
            fieldLabel: etiquetas.lbDirReporte,
            allowBlank: true,
            maxLength: 255,
            anchor: '100%',
            name: 'dirreporte',
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    checkWindow();
                }
            }
        });

        DocumentoSubsit.documento = new Ext.form.TextField({
            name: 'denominacion',
            fieldLabel: etiquetas.lbDocumentoprim,
            disabled: true,
            anchor: '100%'
        });

        DocumentoSubsit.sigla = new Ext.form.TextField({
            name: 'sigla',
            fieldLabel: etiquetas.lbSiglas,
            allowBlank: false,
            regex: /^[\w\s\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\+\-\/\*\_]+$/,
            maskRe: /^[\w\s\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\+\-\/\*\_]+$/,
            regexText: etiquetas.textAlfaNum,
            maxLength: 50,
            maxLengthText: etiquetas.lbMaxLengthText,
            enableKeyEvents: true,
            anchor: '98%',
            listeners: {
                keyup: function () {
                    checkWindow();
                }
            }
        });

        DocumentoSubsit.inicial = new Ext.form.TextField({
            name: 'numinicial',
            fieldLabel: etiquetas.lbNumInicial,
            allowBlank: true,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            regexText: etiquetas.lbNumeros,
            maxLength: 19,
            maxLengthText: etiquetas.lbMaxLengthText,
            enableKeyEvents: true,
            anchor: '98%',
            listeners: {
                keyup: function () {
                    checkWindow();
                }
            }
        });


        var fpHeight = 200,
            fpItems = [
                {xtype: 'hidden', name: 'iddoc'},
                {xtype: 'hidden', name: 'version'},
                DocumentoSubsit.documento,
                {
                    layout: 'column',
                    items: [
                        {columnWidth: 0.5, layout: 'form', items: DocumentoSubsit.sigla},
                        {columnWidth: 0.5, layout: 'form', items: DocumentoSubsit.inicial}
                    ]
                }];

        if (gestorDocumental) {
            fpHeight += 100;
            fpItems.push(DocumentoSubsit.cbGestDocumentalModificar);
            fpItems.push(DocumentoSubsit.cbEspTrabajoModificar);
        }

        if (DocumentoSubsit.existeJasper) {
            fpHeight += 40;
            fpItems.push(DocumentoSubsit.tfDirReporteModificar);
        }

        DocumentoSubsit.fpmodDoc = new Ext.FormPanel({
            id: 'fpmodDoc',
            layout: 'form',
            labelAlign: 'top',
            bodyStyle: 'padding:5px 15px 0',
            frame: true,
            trackResetOnLoad: true,
            items: fpItems
        });
        //
        function winFp(opcion) {

            var keys = new Ext.KeyMap(Ext.getBody(), [
                {
                    key: 13,
                    fn: function () {
                        if (!DocumentoSubsit.isOpenWGD && DocumentoSubsit.isOpenW && !Ext.Ajax.isLoading() && Ext.getCmp('btnAceptarVnom') && !Ext.getCmp('btnAceptarVnom').disabled) {
                            if (DocumentoSubsit.action == 'adicionar') {
                                crearListaDatos();
                            } else {
                                modificarDocumento();
                            }
                        }
                    }
                }, /*{
                 key: "p",
                 alt: true,
                 ctrl: true,
                 fn: function () {
                 if (!DocumentoSubsit.isOpenWGD && DocumentoSubsit.isOpenW && !Ext.Ajax.isLoading() && Ext.getCmp('btnAplicarVnom') && !Ext.getCmp('btnAplicarVnom').disabled) {
                 crearListaDatos('apl');
                 }
                 }
                 }, {
                 key: "x",
                 alt: true,
                 fn: function () {
                 if (!DocumentoSubsit.isOpenWGD && DocumentoSubsit.isOpenW) {
                 if (DocumentoSubsit.action == 'adicionar') {
                 DocumentoSubsit.fpventana.getForm().reset();
                 DocumentoSubsit.stDocumentos.removeAll();
                 DocumentoSubsit.winAdd.hide();
                 } else {
                 DocumentoSubsit.winMod.hide();
                 }
                 }
                 }
                 }*/
            ]);

            switch (opcion) {
                case 'Add':
                {
                    DocumentoSubsit.action = 'adicionar';
                    if (!DocumentoSubsit.winAdd) {
                        DocumentoSubsit.winAdd = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            id: 'wAdDp',
                            layout: 'fit',
                            keys: keys,
                            defaultButton: 'btnCancelarVnom',
                            firstElement: DocumentoSubsit.subsistema,
                            constrain: true,
                            title: DocumentoSubsit.etiquetas.lbTitWinInsDoc,
                            width: 800,
                            height: 400,
                            resizable: false,
                            buttons: [{
                                iconCls: 'cancelar',
                                id: 'btnCancelarVnom',
                                text: DocumentoSubsit.etiquetas.lbBtnCancelar,
                                tooltip: DocumentoSubsit.etiquetas.lbBtnTooltipCancelar,
                                handler: function () {
                                    DocumentoSubsit.fpventana.getForm().reset();
                                    DocumentoSubsit.stDocumentos.removeAll();
                                    DocumentoSubsit.winAdd.hide();
                                }
                            }, {
                                iconCls: 'aplicar',
                                id: 'btnAplicarVnom',
                                disabled: true,
                                text: DocumentoSubsit.etiquetas.lbBtnAplicar,
                                tooltip: DocumentoSubsit.etiquetas.lbBtnTooltipAplicar,
                                handler: function () {
                                    crearListaDatos('apl');
                                }
                            }, {
                                iconCls: 'aceptar',
                                id: 'btnAceptarVnom',
                                disabled: true,
                                text: DocumentoSubsit.etiquetas.lbBtnAceptar,
                                tooltip: DocumentoSubsit.etiquetas.lbBtnTooltipAceptar,
                                handler: function () {
                                    crearListaDatos();
                                }
                            }
                            ],
                            listeners: {
                                hide: function () {
                                    DocumentoSubsit.action = undefined;
                                    DocumentoSubsit.btnAdicionar.focus();
                                    DocumentoSubsit.fpDocumento.disable();
                                    DocumentoSubsit.subsistema.reset();
                                    Ext.getCmp('btnAceptarVnom').disable();
                                    Ext.getCmp('btnAplicarVnom').disable();
                                    if (DocumentoSubsit.gpDocumento.getSelectionModel().getCount() == 0) {
                                        DocumentoSubsit.btnModificar.disable();
                                        DocumentoSubsit.btnEliminar.disable();
                                    }
                                    else {
                                        DocumentoSubsit.btnModificar.enable();
                                        DocumentoSubsit.btnEliminar.enable();
                                    }
                                    DocumentoSubsit.sm1.clearSelections();
                                    DocumentoSubsit.isOpenW = false;
                                }
                            }
                        });
                    }
                    DocumentoSubsit.winAdd.show();
                    DocumentoSubsit.winAdd.add(DocumentoSubsit.fpventana);
                    DocumentoSubsit.winAdd.doLayout();
                    cargarSubsistemas(DocumentoSubsit.winAdd, function () {
                        DocumentoSubsit.winAdd.focus();
                        if (DocumentoSubsit.subsistema.rendered) {
                            selectFirst(cargarnomdoc);
                        }
                    });
                }
                    break;
                case 'Mod':
                {
                    DocumentoSubsit.action = 'modificar';
                    if (!DocumentoSubsit.sm.getSelected())
                        mostrarMensaje(1, DocumentoSubsit.etiquetas.lbDebeSDM);
                    else if (DocumentoSubsit.sm.getSelections().length > 1)
                        mostrarMensaje(1, DocumentoSubsit.DocumentoSubsit.etiquetas.lbDebeSUDM);
                    else {
                        DocumentoSubsit.btnAdicionar.disable();
                        DocumentoSubsit.btnEliminar.disable();
                        if (!DocumentoSubsit.winMod) {
                            DocumentoSubsit.winMod = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                keys: keys,
                                constrain: true,
                                title: DocumentoSubsit.etiquetas.lbTitWinModDoc,
                                defaultButton: 'btnCancelarVnom',
                                firstElement: DocumentoSubsit.sigla,
                                width: 350,
                                height: fpHeight,
                                buttons: [{
                                    iconCls: 'cancelar',
                                    id: 'btnCancelarVnom',
                                    text: DocumentoSubsit.etiquetas.lbBtnCancelar,
                                    tooltip: DocumentoSubsit.etiquetas.lbBtnTooltipCancelar,
                                    handler: function () {
                                        DocumentoSubsit.winMod.hide();
                                    }
                                }, {
                                    id: 'btnAceptarVnom',
                                    iconCls: 'aceptar',
                                    disabled: true,
                                    text: DocumentoSubsit.etiquetas.lbBtnAceptar,
                                    tooltip: DocumentoSubsit.etiquetas.lbBtnTooltipAceptar,
                                    handler: function () {
                                        modificarDocumento();
                                    }
                                }],
                                listeners: {
                                    hide: function () {
                                        DocumentoSubsit.btnAdicionar.focus();
                                        DocumentoSubsit.btnAdicionar.enable();
                                        DocumentoSubsit.btnEliminar.enable();
                                        DocumentoSubsit.action = undefined;
                                        Ext.getCmp('btnAceptarVnom').disable();
                                        DocumentoSubsit.isOpenW = false;
                                    }, show: function () {
                                        DocumentoSubsit.winMod.focus();
                                    }
                                }
                            });

                        }
                        DocumentoSubsit.winMod.show();
                        DocumentoSubsit.fpmodDoc.getForm().reset();
                        DocumentoSubsit.winMod.add(DocumentoSubsit.fpmodDoc);
                        DocumentoSubsit.winMod.doLayout();
                        DocumentoSubsit.fpmodDoc.getForm().loadRecord(DocumentoSubsit.sm.getSelected());
                        DocumentoSubsit.fpmodDoc.getForm().setValues({
                            'denominacion': DocumentoSubsit.sm.getSelected().data.denominacion.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')
                        });
                        //DocumentoSubsit.inicial.setValue(DocumentoSubsit.sm.getSelected().json.numinicial);
                        DocumentoSubsit.cbGestDocumentalModificar.setValue(DocumentoSubsit.sm.getSelected().json.idgestordocumental);
                        //DocumentoSubsit.cbGestDocumentalModificar.setRawValue(DocumentoSubsit.sm.getSelected().json.idgestordocumental);
                        //DocumentoSubsit.cbEspTrabajoModificar.setRawValue(DocumentoSubsit.sm.getSelected().json.idespaciotrabajo);
                        DocumentoSubsit.cbEspTrabajoModificar.setValue(DocumentoSubsit.sm.getSelected().json.espacioTrabajo);

                        /*valueDocumento = DocumentoSubsit.cbGestDocumentalModificar.getRawValue();
                         valueEspTrabajo = DocumentoSubsit.cbEspTrabajoModificar.getRawValue();*/
                        valueDocumento = DocumentoSubsit.cbGestDocumentalModificar.getValue();
                        valueEspTrabajo = DocumentoSubsit.cbEspTrabajoModificar.getValue();
                    }
                }
                    break;
            }
        }

        function crearListaDatos(apl) {
            var nomdocs = '',
                valid = true,
                siglas = '',
                numInicial = '',
                idET = '',
                idGD = '',
                dirReporte = '',
                longitud = DocumentoSubsit.sm1.getCount(),
                selecciones = DocumentoSubsit.sm1.getSelections();

            for (var i = 0; i < longitud; i++) {
                if (i != longitud - 1) {
                    nomdocs += DocumentoSubsit.sm1.getSelections()[i].get('iddocumentos') + ',';
                    siglas += DocumentoSubsit.sm1.getSelections()[i].get('abreviatura') + ',';
                    idET += DocumentoSubsit.sm1.getSelections()[i].get('idEspTrabajo') + ',';
                    idGD += DocumentoSubsit.sm1.getSelections()[i].get('tituloDocumento') + ',';
                    numInicial += DocumentoSubsit.sm1.getSelections()[i].get('numinicial') ? DocumentoSubsit.sm1.getSelections()[i].get('numinicial') : 0 + ',';
                    dirReporte += DocumentoSubsit.sm1.getSelections()[i].get('dirreporte') + ',';
                }
                else {
                    nomdocs += DocumentoSubsit.sm1.getSelections()[i].get('iddocumentos');
                    siglas += DocumentoSubsit.sm1.getSelections()[i].get('abreviatura');
                    idET += DocumentoSubsit.sm1.getSelections()[i].get('idEspTrabajo');
                    idGD += DocumentoSubsit.sm1.getSelections()[i].get('tituloDocumento');
                    numInicial += DocumentoSubsit.sm1.getSelections()[i].get('numinicial') ? DocumentoSubsit.sm1.getSelections()[i].get('numinicial') : 0;
                    dirReporte += DocumentoSubsit.sm1.getSelections()[i].get('dirreporte');
                }
            }

            if (!DocumentoSubsit.fpventana.getForm().isValid()) {
                mostrarMensaje(1, etiquetas.camposMal);
            } else if (longitud == 0)
                mostrarMensaje(1, DocumentoSubsit.etiquetas.Seleccdocs);
            else if (valid)
                adicionarDocumento(apl, nomdocs, siglas, idET, idGD, numInicial,dirReporte);
            else {
                mostrarMensaje(1, DocumentoSubsit.etiquetas.camposMal);
            }
        }

        function adicionarDocumento(apl, nomdocs, siglas, idET, idGD, numInicial,dirReporte) {
            var nomdocsF = nomdocs.split(',');
            var msg = (nomdocsF.length > 1) ? DocumentoSubsit.etiquetas.msgInsMany : DocumentoSubsit.etiquetas.messloadIns;
            Ext.Msg.wait(DocumentoSubsit.etiquetas.lbmsgAddDP, DocumentoSubsit.etiquetas.lbmsgPFE);
            Ext.Ajax.request({
                url: 'insertardocumento',
                params: {
                    iddocumentos: nomdocs,
                    sigla: siglas,
                    idestructurasubsist: DocumentoSubsit.subsistema.getValue(),
                    idgestordocumental: idGD,
                    idespaciotrabajo: idET,
                    numinicial: numInicial,
                    dirreporte:dirReporte
                },
                method: 'POST',
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    Ext.Msg.hide();
                    if (responseData.retorno == 1) {
                        if (nomdocsF.length > 1)
                            mostrarMensaje(1, DocumentoSubsit.etiquetas.Msgdocsinsertados);
                        else
                            mostrarMensaje(1, DocumentoSubsit.etiquetas.Msgdocinsertado);

                        DocumentoSubsit.stgpdocumentos.reload();
                        DocumentoSubsit.btnModificar.disable();
                        DocumentoSubsit.btnEliminar.disable();
                        if (!apl) {
                            DocumentoSubsit.winAdd.hide();
                        } else {
                            DocumentoSubsit.stDocumentos.removeAll();
                            selectFirst();
                            DocumentoSubsit.stDocumentos.load({
                                params: {
                                    idestructurasubsist: DocumentoSubsit.subsistema.getValue(),
                                    start: 0,
                                    limit: 20
                                }, callback: function () {
                                    checkWindow();
                                }
                            });
                        }
                    } else if (responseData.retorno == 2) {
                        mostrarMensaje(1, DocumentoSubsit.etiquetas.lbssmExisteSigAdd);
                    }
                }
            });
        }

        function modificarDocumento() {
            DocumentoSubsit.sigla.setValue(DocumentoSubsit.sigla.getValue().trim());
            if (!DocumentoSubsit.inicial.getValue()) {
                DocumentoSubsit.inicial.setValue(0);
            }
            DocumentoSubsit.fpmodDoc.getForm().submit({
                url: 'modificardocumento',
                params: {},
                waitMsg: etiquetas.messloadIns,
                failure: function (form, action) {
                    if (action.result.codMsg == -1) {
                        mostrarMensaje(1, etiquetas.MsgdocMod);
                        DocumentoSubsit.gpDocumento.getStore().reload();
                        DocumentoSubsit.btnModificar.disable();
                        DocumentoSubsit.btnEliminar.disable();
                        DocumentoSubsit.winMod.hide();
                    } else if (action.result.codMsg == -2) {
                        mostrarMensaje(1, etiquetas.lbssmExisteMod);
                    } else if (action.result.codMsg == -11) {
                        mostrarMensaje(1, etiquetas.lbssmExisteSig);
                    }
                }
            });
        }

        function cargarSubsistemas(window, fn) {
            var mask = new Ext.LoadMask(window.el, {msg: 'Cargando...'});
            mask.show();
            DocumentoSubsit.stSubsistema.load({
                callback: function () {
                    mask.hide();
                    if (typeof fn == 'function') {
                        fn.call(DocumentoSubsit);
                    }
                }
            })
        }

        function eliminarDocumento() {
            if (!DocumentoSubsit.sm.getSelected() || !DocumentoSubsit.sm.getSelections())
                mostrarMensaje(1, etiquetas.lbDebeSDE);
            else {
                if (DocumentoSubsit.sm.getSelections().length == 1)
                    mostrarMensaje(2, etiquetas.preguntaElim, elimina)
                else
                    mostrarMensaje(2, etiquetas.preguntaElimPlural, elimina)
            }
            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    if (DocumentoSubsit.sm.getSelections().length == 1)
                        Ext.Msg.wait("Eliminando datos del documento primario...", "Por favor espere...");
                    else
                        Ext.Msg.wait("Eliminando datos de los documentos primarios...", "Por favor espere...");
                    var id = "";
                    var cant = DocumentoSubsit.sm.getSelections().length;
                    for (var i = 0; i < cant; i++)
                        if (i < cant - 1)
                            id += DocumentoSubsit.sm.getSelections()[i].get('iddoc') + ",";
                        else
                            id += DocumentoSubsit.sm.getSelections()[i].get('iddoc');
                    Ext.Ajax.request({
                        url: 'eliminardocumento',
                        method: 'POST',
                        params: {
                            iddoc: id
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            Ext.Msg.hide();
                            if (responseData.codMsg == -3) {
                                mostrarMensaje(3, etiquetas.lbErrorElim);
                            } else if (responseData.codMsg == -1) {
                                mostrarMensaje(1, etiquetas.lbexitoElim);
                                DocumentoSubsit.stgpdocumentos.load();
                            } else if (responseData.codMsg == -2) {
                                mostrarMensaje(1, etiquetas.lbexitoElimMu)

                                DocumentoSubsit.stgpdocumentos.load();

                            } else if (responseData.codMsg == -4) {
                                mostrarMensaje(1, etiquetas.lbEsdeUso);
                                DocumentoSubsit.stgpdocumentos.load();
                            }
                        }
                    });
                }
                else {
                    DocumentoSubsit.btnAdicionar.focus();
                }
                DocumentoSubsit.btnAdicionar.enable();
                if (DocumentoSubsit.sm.getSelections().length == 1)
                    DocumentoSubsit.btnModificar.enable();
                else
                    DocumentoSubsit.btnModificar.disable();
                DocumentoSubsit.isOpenW = false;
            }
        }

        function buscarDoc() {
            DocumentoSubsit.stgpdocumentos.baseParams.start = '';
            DocumentoSubsit.stgpdocumentos.baseParams.limit = '';
            DocumentoSubsit.stgpdocumentos.baseParams.sfFiltro = Ext.getCmp('sfDocumentos').getRawValue();
            DocumentoSubsit.stgpdocumentos.load();
        }

        function limpiarDoc() {
            DocumentoSubsit.stgpdocumentos.baseParams = {
                start: 0,
                limit: 20
            };
            DocumentoSubsit.stgpdocumentos.load();
        }

        function buscarDocHeredar() {
            stHeredar.baseParams.start = '';
            stHeredar.baseParams.limit = '';
            stHeredar.baseParams.sfFiltro = Ext.getCmp('sfHeredar').getRawValue();
            stHeredar.load({
                callback: function () {
                    if (stHeredar.getTotalCount() === 0)
                        mostrarMensaje(1, etiquetas.NoExisDQM);
                }
            });
        }

        function buscarDocSubsistema() {
            DocumentoSubsit.stDocumentos.baseParams.start = 0;
            DocumentoSubsit.stDocumentos.baseParams.limit = 20;
            DocumentoSubsit.stDocumentos.baseParams.sfFiltro = Ext.getCmp('sfBuscar').getRawValue();
            DocumentoSubsit.stDocumentos.load({
                callback: function () {
                    if (DocumentoSubsit.stDocumentos.getTotalCount() === 0)
                        mostrarMensaje(1, etiquetas.NoExisDQM);
                }
            });
        }

        function isDirtyForm(idForm, smodel, decimalPrecision) {
            var objValuesForm = Ext.getCmp(idForm).getForm().getValues(false);
            var smodelData = smodel.getSelected().data;
            decimalPrecision = decimalPrecision || 2;
            var arrValuesForm = new Array();
            for (var name in objValuesForm) {
                arrValuesForm[name] = objValuesForm[name];
            }

            var arrValuesRecord = new Array();
            for (var valueRecord in smodelData) {
                arrValuesRecord[valueRecord] = smodelData[valueRecord];
            }

            for (var propValuesForm in arrValuesForm) {
                for (var propValuesRecord in arrValuesRecord) {
                    if (propValuesForm == propValuesRecord) {
                        var valuef = arrValuesForm[propValuesForm];
                        var valuer = arrValuesRecord[propValuesRecord];
                        if ((!isNaN(valuef)) && !isNaN(valuer)) {
                            if (parseFloat(valuef).toFixed(decimalPrecision) != parseFloat(valuer).toFixed(decimalPrecision)) {
                                return true;
                            }
                            if (parseInt(valuef, 10) != (parseInt(valuer, 10))) {
                                return true;
                            }
                        }
                        else {
                            if (valuef != valuer) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

        function limpiarDocHeredar() {
            stHeredar.baseParams = {
                start: 0,
                limit: 20
            };
            stHeredar.load();
        }

        function limpiarDocSubsistema() {
            DocumentoSubsit.stDocumentos.baseParams = {
                start: 0,
                limit: 20
            };
            DocumentoSubsit.stDocumentos.load();
        }

        function selectFirst(fn) {
            DocumentoSubsit.stSubsistema.clearFilter();
            var id = DocumentoSubsit.stSubsistema.data.items[0].get('idestructurasubsist');
            var nombre = DocumentoSubsit.stSubsistema.data.items[0].get('nombresubsistema');
            DocumentoSubsit.subsistema.setRawValue(nombre);
            DocumentoSubsit.subsistema.setValue(id);
            if (fn && typeof fn == 'function') {
                fn.call(DocumentoSubsit);
                ;
            }
        }

        function checkWindow() {
            var selected = DocumentoSubsit.sm1.getCount();
            if (DocumentoSubsit.action != 'modificar') {
                if (selected >= 1) {
                    Ext.getCmp('btnAplicarVnom').enable();
                    Ext.getCmp('btnAceptarVnom').enable();
                } else {
                    Ext.getCmp('btnAplicarVnom').disable();
                    Ext.getCmp('btnAceptarVnom').disable();
                }
            } else {
                if (DocumentoSubsit.fpmodDoc.getForm().isValid() && changedForm()) {
                    Ext.getCmp('btnAceptarVnom').enable();
                } else {
                    Ext.getCmp('btnAceptarVnom').disable();
                }
            }
        }

        function changedForm() {
            var newValues = DocumentoSubsit.fpmodDoc.getForm().getValues();
            var oldValues = DocumentoSubsit.sm.getSelected().data;
            var changed = false;
            for (k in newValues) {
                if (!Ext.isEmpty(oldValues[k])) {
                    oldValues[k] = oldValues[k].replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '');
                }
                if ((!Ext.isEmpty(newValues[k]) && !Ext.isEmpty(oldValues[k])) || (!Ext.isEmpty(newValues[k]) && Ext.isEmpty(oldValues[k])) || (Ext.isEmpty(newValues[k]) && !Ext.isEmpty(oldValues[k]))) {
                    if (newValues[k] != oldValues[k]) {
                        changed = true;
                        break;
                    }
                }
            }
            //console.log(changed);
            return changed;
        }

        /*function changedForm() {
         var newValues = scopeNomDocumento.fpDocumento.getForm().getValues();
         var oldValues = scopeNomDocumento.documento;
         var changed = false;
         for (k in newValues) {
         if (newValues[k] != oldValues[k]) {
         changed = true;
         break;
         }
         }
         return changed;
         }*/

    }
});
new Ext.ConfGnral.Documento.DocumentoSubsit();
