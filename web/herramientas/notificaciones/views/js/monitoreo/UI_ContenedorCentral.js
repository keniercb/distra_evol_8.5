Ext.ns("Ext.notificaciones.monitoreo");
Ext.notificaciones.monitoreo.mostraravisos = new Ext.data.JsonStore({
    url: '/herramientas/notificaciones/index.php/monitoreo/listaravisosenviados',
    fields: ['idaviso', 'denominacion', 'tipo', 'creadopor', 'fechacreacion', 'ideventodespachado', 'idtarea', 'fechaenvio'],
    root: 'datos',
    totalProperty: 'total',
    listeners: {
                'load': function() {
                    if(Ext.notificaciones.monitoreo.mostraravisos.totalLength==0){
                        mostrarMensaje(7,'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.');
                    }
                },
                scope: this
            }
});

/**
 * @class Ext.notificaciones.monitoreo.SearchToolbar
 * @inherits Ext.ToolBar.searchToolBar
 * @description Barra de herramientas para la búsqueda de avisos enviados.
 * @namespace Ext.notificaciones.monitoreo
 * @autor Ernesto Herrera
 **/
Ext.notificaciones.monitoreo.SentNotificationsSearchToolbar = Ext.extend(Ext.ToolBar.searchToolBar, {
    listeners: {
        render: function() {            
            this.elementos[0].focus(false, 100);
        }
    },
    initComponent: function() {
        this.defaultEndDate = new Date();
        var nameFilter = new Ext.form.TextField({
            fieldLabel: this.labels.lbNotificationName,
            filterId: 'nombre',
            emptyText: this.labels.lbCriteria,
            id: 'filtro-nombre-aviso',
            colWidth: .30,
            anchor: '90%',
            vtype: 'alphanum',
            vtypeText: 'Este campo solo admite n&uacute;meros, letras y el caracter gui&oacute;n bajo.'
                    //width: 150
        });
        var iniDateFilter = new Ext.form.DateField({
            filterId: 'desde',
            id: 'filtro-desde-fecha',
            fieldLabel: this.labels.lbFrom,
            emptyText: this.labels.lbSelect,
            maxText: this.labels.lbMaxDateText,
            format: 'd/m/Y',
            vtype: 'daterange',
            maxValue: this.defaultEndDate,
            colWidth: .25,
            endDateField: 'filtro-hasta-fecha',
            anchor: '90%'
                    //width: 125

        });
        var endDateFilter = new Ext.form.DateField({
            id: 'filtro-hasta-fecha',
            filterId: 'hasta',
            //allowBlank: false,
            fieldLabel: this.labels.lbTo,
            format: 'd/m/Y',
            emptyText: this.labels.lbSelect,
            minText: this.labels.lbMinDateText,
            vtype: 'daterange',
            startDateField: 'filtro-desde-fecha',
            maxValue: this.defaultEndDate,
            //value: this.defaultEndDate,
            colWidth: .2,
            anchor: '90%'
                    //width: 125
        });
        this.elementos = [nameFilter, iniDateFilter, endDateFilter];
        this.botones = [{
                xtype: 'button',
                //icon: perfil.dirImg + 'buscar.png',
                iconCls: 'buscar',
                colWidth: .15,
                tooltip: this.labels.ttSearchSendingNot,
                text: this.labels.actions.search,
                handler: this.buscarAvisosEnviadosPorFiltros.createDelegate(this),
                scope: this
            }, {
                xtype: 'button',
                //icon: perfil.dirImg + 'limpiar.png',
                iconCls: 'limpiar',
                tooltip: this.labels.ttCleanFilter,             
                colWidth: .15,
                nextTab: 'btnAyuda',
                text: this.labels.actions.clean,
                handler: this.limpiarFiltro.createDelegate(this),
                scope: this
            }];
        this.storeReference = this.gridReference.getStore() || null;
        Ext.notificaciones.monitoreo.SentNotificationsSearchToolbar.superclass.initComponent.call(this);
    },
    limpiarFiltro: function() {
        Ext.notificaciones.monitoreo.SentNotificationsSearchToolbar.superclass.limpiarFiltro.call(this);
        //Ext.getCmp('filtro-hasta-fecha').setValue(this.defaultEndDate);
        if (this.storeReference) {
            this.storeReference.baseParams.filtros = null;
            this.storeReference.load({
                params: {
                    start: 0,
                    limit: 20
                }
            });
            
        }
    },
    buscarAvisosEnviadosPorFiltros: function() {
        if (this.storeReference) {
            var flag=true;
            var filtros = {};
            Ext.each(this.elementos, function(el) {
                if(!el.isValid()){
                    flag=false;                    
                }
                filtros[el.filterId] = el.getValue();
            }, this);
            if (filtros['desde'] == "" && filtros['hasta'] == "" && filtros['nombre'] == "") {
                mostrarMensaje(6,"Debe introducir algún criterio de búsqueda. Verifique por favor.");
            }else if(flag==false){
                mostrarMensaje(6,'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
            }
            else {
                this.storeReference.baseParams.filtros = Ext.encode(filtros);               
                this.storeReference.load({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });                
                
            }

        }
    },
    getItems: function() {
        return this.elementos;
    },
    getBtns: function() {
        return this.botones;
    }
});

/**
 * @class Ext.notificaciones.monitoreo.ListarAvisos
 * @inherits Ext.grid.GridPanel
 * @description Lista los avisos que se han desencadenado por la ejecución de un evento.
 * @namespace Ext.notificaciones.monitoreo
 * @author Ernesto Herrera
 */
Ext.notificaciones.monitoreo.ListarAvisos = Ext.extend(Ext.grid.GridPanel, {
    store: Ext.notificaciones.monitoreo.mostraravisos,
    cls: 'x-toolbar',
    height: 500,
    minHeight: 500,
    disabled: true,
    selModel: new Ext.grid.RowSelectionModel({
        singleSelect: true
    }),
    autoExpandColumn: 'nombre-aviso',
    initComponent: function() {
        this.title = this.labels.pAvisosDespachados,
                this.loadMask = {
                    msg: this.labels.lbLoading,
                    store: this.store
                };
        this.columns = [new Ext.grid.RowNumberer(),
            {
                id: 'nombre-aviso',
                dataIndex: 'denominacion',
                header: this.labels.lbNotificationName,
                sortable: true,
                width: 150
            }, {
                dataIndex: 'tipo',
                header: this.labels.lbNotificationType,
                sortable: true,
                width: 80
            }, {
                dataIndex: 'creadopor',
                header: this.labels.lbCreator,
                sortable: true,
                width: 150
            }, {
                dataIndex: 'fechacreacion',
                header: this.labels.lbCreationDate,
                sortable: true,
                width: 120
            }, {
                dataIndex: 'fechaenvio',
                header: this.labels.lbSendDate,
                sortable: true,
                width: 120
            }
        ];
        this.bbar = new Ext.PagingToolbar({
            pageSize: 20,
            store: Ext.notificaciones.monitoreo.mostraravisos,
            displayInfo: true,
            displayMsg: this.labels.displayMsg,
            emptyMsg: this.labels.emptyMsg
        });
        Ext.notificaciones.monitoreo.ListarAvisos.superclass.initComponent.call(this);
    }
});

/**
 * @class Ext.notificaciones.monitoreo.WindowContenidoAviso
 * @inherits Ext.Window
 * @description Ventana que muestra el contenido de los avisos
 * @namespace Ext.notificaciones.monitoreo
 * @author Ernesto Herrera
 */
Ext.notificaciones.monitoreo.WindowContenidoAviso = Ext.extend(Ext.Window, {
    modal: true,
    frame: true,
    layout: 'form',
    width: 500,    
    resizable: false,
    closeAction: 'destroy',
    initComponent: function() {
        var items = [];
        this.title = this.labels.lbNotContent + this.via + ')';
        if (this.contenido.asunto) {
            this.tfAsunto = new Ext.form.TextField({
                fieldLabel: this.labels.lbSubject,
                anchor: '100%',
                readOnly: true,
                value: this.contenido.asunto
            });
            items.push(this.tfAsunto);
        }
        if (this.contenido.cuerpo) {
            this.taCuerpo = new Ext.form.TextArea({
                fieldLabel: this.labels.lbContent,
                anchor: '100%',
                readOnly: true,
                value: this.contenido.cuerpo
            });
            items.push(this.taCuerpo);
        }
        var form = new Ext.form.FormPanel({
            labelWidth: 200,
            labelPad: 20,
            bodyStyle: 'padding:10px',
            frame: true,
            labelAlign: 'top',
            items: items
        });
        this.items = [form];
        this.buttons = [{
                xtype: 'button',
                tooltip: this.labels.ttCloseWindow,
                text: this.labels.actions.accept,
                //icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                handler: function() {
                    this.destroy();
                },
                scope: this
            }];
        Ext.notificaciones.monitoreo.WindowContenidoAviso.superclass.initComponent.call(this);
    }
});


/**
 * @class Ext.notificaciones.monitoreo.MensajesAviso
 * @inherits Ext.grid.GridPanel
 * @namespace Ext.notificaciones.monitoreo
 * @description Muestra los mensajes por las vías de un aviso seleccionado.
 * @author Ernesto Herrera
 */
Ext.notificaciones.monitoreo.MensajesAviso = Ext.extend(Ext.grid.GridPanel, {
    frame: true,
    height: 255,
    minHeight: 255,
    autoExpandColumn: 'via-aviso',
    initComponent: function() {
        var expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                    '<p><b> ' + this.labels.lbDetails + ': </b> {detalles}</p><br>',
                    '<p><b> ' + this.labels.lbObservation + ': </b> {observacion}</p><br>'
                    )
        });
        var withoutConfirm = this.labels.lbWithoutConfirm;
        var showDefaultState = function(state) {
            if (state == null) {
                return withoutConfirm;
            }
            return state;
        };
        this.plugins = expander;
        this.title = this.labels.lbMessages;
        this.selModel = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                'rowselect': function(a, index, record) {
                    this.getTopToolbar().items.items[0].enable();
                    this.fireEvent('mensajeseleccionado', record.data);
                },
                'rowdeselect': function(a, index, record) {
                    this.getTopToolbar().items.items[0].disable();
                    this.fireEvent('mensajedeseleccionado');
                },
                scope: this
            }
        });
        this.store = new Ext.data.JsonStore({
            url: '/herramientas/notificaciones/index.php/monitoreo/listarmensajesenviadosdeaviso',
            fields: ['via', 'idvia', 'idtarea', 'asunto', 'cuerpo', 'fechaenvio', 'estado', 'detalles', 'observacion'],
            root: 'datos',
            totalProperty: 'total',
            listeners: {
                'load': function() {
                    this.getTopToolbar().items.items[0].disable();
                },
                scope: this
            }
        });
        this.loadMask = {
            msg: this.labels.lbLoading,
            store: this.store
        };
        this.columns = [expander, {
                id: 'via-aviso',
                header: this.labels.lbVia,
                dataIndex: 'via',
                width: 120
            }, {
                header: this.labels.lbSendDate,
                dataIndex: 'fechaenvio',
                width: 100
            }, {
                header: this.labels.lbState,
                dataIndex: 'estado',
                renderer: showDefaultState,
                width: 80
            }];
        this.tbar = new Ext.Toolbar({
            xtype: 'toolbar',
            items: [{
                    xtype: 'button',
                    id: 'detalles-mensaje',
                    text: this.labels.lbShowContent,
                    tooltip: this.labels.ttShowContent,
                    disabled: true,
                    //icon: perfil.dirImg + 'ver.png',
                    iconCls: 'ver',
                    handler: this.showContentWindow,
                    scope: this
                }]
        });
        Ext.notificaciones.monitoreo.MensajesAviso.superclass.initComponent.call(this);
    },
    showContentWindow: function() {
        var data = this.getSelectionModel().getSelected().data;
        new Ext.notificaciones.monitoreo.WindowContenidoAviso({
            labels: this.labels,
            via: data.via,
            listeners: {
                show: function() {
                    this.docKeyMap.disable();
                },
                hide: function() {
                    this.docKeyMap.enable();
                },
                close: function() {
                    this.docKeyMap.enable();
                },
                destroy: function() {
                    this.docKeyMap.enable();
                },
                scope: this
            },
            contenido: {
                asunto: data.asunto,
                cuerpo: data.cuerpo
            }
        }).show();
    }
});

/**
 * @class Ext.notificaciones.monitoreo.DestinatariosAviso
 * @inherits Ext.grid.GridPanel
 * @namespace Ext.notificaciones.monitoreo
 * @description Muestra los destinatarios de un mensaje.
 * @author: Ernesto Herrera
 */
Ext.notificaciones.monitoreo.DestinatariosMensajes = Ext.extend(Ext.grid.GridPanel, {
    frame: true,
    height: 255,
    minHeight: 255,
    minWidth: 255,
    autoExpandColumn: 'nombre-destinatario',
    selModel: new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            'rowselect': function(a, index, record) {
                //this.tbar.items[0].enable();                
            },
            'rowdeselect': function(a, index, record) {
                //this.tbar.items[0].disable();                
            }
        }
    }),
    initComponent: function() {
        var expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                    '<p><b> ' + this.labels.lbDetails + ': </b> {detalles}</p><br>',
                    '<p><b> ' + this.labels.lbDate + ': </b> {fecha}</p><br>'
                    )
        });
        var successFailureImg = function(success) {
            return '<img src="' + perfil.dirImg + (Util.str2Boolean(success) ? 'validaryaceptar' : 'cerrar') + '.png"/>';
        };
        this.plugins = expander;
        this.title = this.labels.pDestinatary;
        this.store = new Ext.data.JsonStore({
            url: '/herramientas/notificaciones/index.php/monitoreo/listardestinatariosdemensaje',
            fields: ['iddestinatario', 'nombre', 'contacto', 'exito', 'fecha', 'detalles'],
            root: 'datos',
            totalProperty: 'total'
        });
        this.loadMask = {
            msg: this.labels.lbLoading,
            store: this.store
        };
        this.columns = [expander, {
                id: 'nombre-destinatario',
                header: this.labels.lbFirstName,
                dataIndex: 'nombre',
                width: 100
            }, {
                header: this.labels.lbContactAddress,
                dataIndex: 'contacto',
                width: 150
            }, {
                header: this.labels.lbSuccess,
                dataIndex: 'exito',
                renderer: successFailureImg,
                width: 40
            }];
        /*this.tbar = new Ext.Toolbar({
         xtype : 'toolbar',
         items : [{
         xtype: 'button',
         id: 'detalles-contacto',
         text: this.labels.lbShowDetails,
         disabled: true,
         icon: perfil.dirImg + 'ver.png',
         iconCls: 'btn'
         }]
         });*/
        this.bbar = new Ext.PagingToolbar({
            pageSize: 10,
            store: this.store,            
        });
        Ext.notificaciones.monitoreo.DestinatariosMensajes.superclass.initComponent.call(this);
    }
});

/**
 * @class Ext.notificaciones.monitoreo.PanelDetallesAviso
 * @inherits Ext.Panel
 * @description Panel que muestra los detalles de un aviso seleccionado.
 * @namespace Ext.notificaciones.monitoreo
 * @author Ernesto Herrera 
 */
Ext.notificaciones.monitoreo.PanelDetallesAviso = Ext.extend(Ext.Panel, {
    layout: 'column',
    disabled: true,
    autoScroll: true,
    cls: 'x-toolbar',
    frame: true,
    height: 300,
    minHeight: 300,
    listeners: {
        resize: function(aw, ah, rw, rh) {
            if (rw != this.height) {
                this.mensajesAviso.setHeight(rw - 45);
                this.destinatariosMensajes.setHeight(rw - 45);
            }
        }
    },
    initComponent: function() {
        var defaultBaseParams = {
            params: {
                start: 0,
                limit: 10
            }
        };
        this.title = this.labels.lbNotificationDetails;
        this.mensajesAviso = new Ext.notificaciones.monitoreo.MensajesAviso({
            columnWidth: .5,            
            labels: this.labels,
            docKeyMap: this.docKeyMap,
            listeners: {
                'mensajeseleccionado': function(o) {
                    var st = this.destinatariosMensajes.getStore();
                    st.baseParams.idtarea = o.idtarea;
                    st.baseParams.via = o.idvia;
                    st.load(defaultBaseParams);
                },
                'mensajedeseleccionado': function() {
                    var st = this.destinatariosMensajes.getStore();
                    st.baseParams.idtarea = null;
                    st.baseParams.via = null;
                    st.load(defaultBaseParams);
                },
                scope: this
            }
        });
        this.mensajesAviso.getStore().on('load', function() {
            var st = this.destinatariosMensajes.getStore();
            st.baseParams.idtarea = null;
            st.baseParams.via = null;
            this.destinatariosMensajes.getStore().load();
        }, this);
        this.destinatariosMensajes = new Ext.notificaciones.monitoreo.DestinatariosMensajes({
            columnWidth: .5,            
            labels: this.labels
        });
        this.items = [this.mensajesAviso, this.destinatariosMensajes];
        Ext.notificaciones.monitoreo.PanelDetallesAviso.superclass.initComponent.call(this);
    },
    getMensajesAviso: function() {
        return this.mensajesAviso;
    },
    getDestinatariosMensajes: function() {
        return this.destinatariosMensajes;
    }
})


/**
 * @class Ext.notificaciones.monitoreo.UI_ContenedorCentral
 * @inherits Ext.Panel
 * @description Contenedor del listado de avisos y el panel de detalles de los avisos.
 * @namespace Ext.notificaciones.monitoreo
 * @author Ernesto Herrera 
 */
Ext.notificaciones.monitoreo.UI_ContenedorCentral = Ext.extend(Ext.Panel, {
    layout: 'border',
    width: 600,
    height: 600,
    minHeight: 600,
    initComponent: function() {
        this.listarAvisos = new Ext.notificaciones.monitoreo.ListarAvisos({
            region: 'center',
            split: true,
            labels: this.labels
        });
        this.pDetallesAviso = new Ext.notificaciones.monitoreo.PanelDetallesAviso({
            region: 'south',
            docKeyMap: this.docKeyMap,
            collapsible: true,
            split: true,
            titleCollapse: true,
            collapsed: true,
            labels: this.labels
        });
        this.listarAvisos.getSelectionModel().on('selectionchange', function(sm) {
            if (sm.getCount() > 0) {
                this.pDetallesAviso.enable();
                this.pDetallesAviso.expand();
                this.pDetallesAviso.getMensajesAviso().getStore().load({
                    params: {
                        ideventodespachado: sm.getSelected().data.ideventodespachado
                    }
                });
            }
            else {
                this.pDetallesAviso.disable();
                //this.pDetallesAviso.collapse();
            }
        }, this);
        this.listarAvisos.addListener('filtering', function() {
            this.pDetallesAviso.collapse();
        }, this);
        this.items = [this.listarAvisos, this.pDetallesAviso];
        Ext.notificaciones.monitoreo.UI_ContenedorCentral.superclass.initComponent.call(this);
    },
    getGridListarAvisos: function() {
        return this.listarAvisos;        
    },
    getPanelDetallesAviso: function() {
        return this.pDetallesAviso;
    }
});