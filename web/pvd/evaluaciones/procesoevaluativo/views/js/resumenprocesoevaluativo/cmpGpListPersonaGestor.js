Ext.ns('Pvd.Evaluaciones');
Ext.QuickTips.init();
Pvd.Evaluaciones.cmpGpListPersonaGestor = new Ext.extend(Ext.grid.GridPanel, {
    iconCls: 'icon-grid',
    autoscroll: true,    
    initComponent: function () {
        var self = this;
		
        this.store = new Ext.data.Store({
            url: this.url,
            baseParams: this.params,
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {name: 'idpersona'},
                {name: 'foto'},				
                {name: 'nombre'},
                {name: 'snombre'},
                {name: 'papel'},
                {name: 'sapel'},				
                {name: 'evaluacion'},

            ])
        });
        this.loadMask = {msg: 'Cargando...'};
        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: {
                    fn: function (sm) {
                        if (sm.hasSelection()) {
                            if(self.getSelectionModel().getSelected().data.evaluacion!=null){
                                self.btnVerdocumentos.enable();
                            }
                            else
                            {
                                self.btnVerdocumentos.disable();
                            }
                            Ext.getCmp('menuImprimir').enable();
                            var selectedRec = sm.getSelections();
                            if (selectedRec.length > 1) {
                                Ext.getCmp('menuImprimir').setText('Imprimir la evaluaci&oacute;n de las personas seleccionadas');
                            }
                            else {
                                Ext.getCmp('menuImprimir').setText('Imprimir la evaluaci&oacute;n de la persona seleccionada');
                            }
                        } else {
                            Ext.getCmp('menuImprimir').disable();
                        }
                    }
                }
            }

        });
        this.cm = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            this.sm,
            { header: 'Foto', dataIndex: 'foto', sortable: false, renderer: this.showFoto, width: 75},
            { header: 'Nombre', dataIndex: 'nombre', sortable: true},
            { header: 'Segundo nombre', dataIndex: 'snombre', sortable: true},
            { header: '1er Apellido', dataIndex: 'papel', sortable: true},
            { header: '2do Apellido', dataIndex: 'sapel', sortable: true},
            { header: 'Evaluación', dataIndex: 'evaluacion', sortable: true, renderer: color}			
        ]);

        function color(val, metadata, record) {
            if(val){
                if (record.get('color')) {
                    return "<div style='height:15px;color:" + record.get('color') + "'><b>" + val + "</b></div>";
                }
                return  "<b>" + val + "</b>";
            }else{
                return '';
            }
        };        
		
        this.tfBuscar = new Ext.app.SearchField({
            store: this.store,
            emptyText: 'Criterio a buscar...'
        });


        this.btnExportar = new Ext.Button({
            id: this.id + 'btnExportar',
            text: 'Exportar',
            tooltip: 'Exportar',
            iconCls: 'exportar',
            handler: function () {				
                var win = new Ext.components.winReporte({
                    params: {
                        url: 'obtenerReporte',
                        tiporeporte: 'listpersona',
                        columns: this.getHeader(),
                        params: this.params
                    }
                });
                win.show();
            }.createDelegate(this)
        });

        this.btnVerdocumentos = new Ext.Button({
            id: this.id + 'btnVerdocumentos',
            text: 'Ver documentos',
            tooltip: 'Ver documentos asociados',
            iconCls: 'ver',
            disabled:true,
            handler: function () {

                this.winG = new Pvd.Evaluaciones.windGestDoc({
                    title: 'Gestionar documentos',
                    idpersona: self.getSelectionModel().getSelected().data.idpersona,
                    valor: self.getSelectionModel().getSelected().data.evaluacion
                });
                this.winG.show();
            }.createDelegate(this)
        });
        
        this.btnImprimir = new Ext.Toolbar.MenuButton({
            text: 'Imprimir',
            tooltip: 'Imprimir la evaluaci&oacute;n de todas las personas',
            iconCls: 'imprimir',
            menu: {
                items: [
                {
                    text: 'Imprimir la evaluaci&oacute;n de las personas seleccionadas',
                    iconCls: 'imprimir',
                    id: 'menuImprimir',
                    //disabled: self.getSelectionModel().getSelections() > 0 ? false : true,
                    handler: function () {
                        var arrRec = self.getSelectionModel().getSelections();
                        var arrIdPers = new Array();
                        Ext.each(arrRec, function (rec) {
                            arrIdPers.push(rec.get('idpersona'));
                        });
                        self.imprimirPersonas(arrIdPers);
                    }
                }
            ]
            },
            handler: function () {
                var arrRec = self.getStore().data.items;
                var arrIdPers = new Array();
                for (var i = 0; i < arrRec.length; i++) {
                    arrIdPers.push(arrRec[i].data.idpersona);
                }
                self.imprimirPersonas(arrIdPers);
            }
        });

        this.tbar = [this.btnVerdocumentos,this.btnExportar,this.btnImprimir , this.tfBuscar];

        this.bbar = new Ext.PagingToolbar({
            store: this.store,
            displayInfo: true,
            pageSize: 15
        });
        Pvd.Evaluaciones.cmpGpListPersonaGestor.superclass.initComponent.call(this);
        this.on('render', function () {
            this.store.load({
                params: {
                    limit: 15,
                    start: 0
                }
            });
        }, this);
    },


   imprimirPersonas: function (pArrIdPers)
    {

    var arrIdPers = pArrIdPers ? pArrIdPers : new Array();
    var params = Ext.urlEncode({
        idperiodoproceso: this.params.idperiodoproceso,
        idestructura : this.params.idestructuranodo,
        fechainicio: this.params.fechainicio,
        fechafin: this.params.fechafin,
        arridpersona: Ext.encode(arrIdPers)
    });

    var idIframeResolucion = Ext.id();
    new Ext.Window({
        title: 'Resumen',
        width: 800,
        height: 500,
        maskDisabled: false,
        animCollapse: false,
        maximizable: true,
        constrainHeader: true,
        border: false,
        modal: true,
        items: {
            xtype: 'component',
            autoEl: {
                tag: 'iframe',
                id: idIframeResolucion,
                style: 'height: 100%; width: 100%; border: none',
                src: document.location.protocol + '//' + document.location.host +
                    '/pvd/evaluaciones/procesoevaluativo/index.php/resumenprocesoevaluativo/printEval?' + params
            }
        }
    }).show();
    PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando la evaluación en formato PDF.');
    document.getElementById(idIframeResolucion).onload = function () {
        PVD.ocultarMascara('rep01');
    }
},

    showFoto: function (val, meta, record) {
		
                var srcImg = 'data:image/png;base64,' + record.get('foto');
                return html = '<table width="90%" border="0" cellspacing="0" cellpadding="1" style="text-align: center;' +
                    ' font-size: 11px">' + '<tr>' + '<td>' + '<table width="100%" border="0" cellspacing="0" cellpadding="4">' + '<tr>' + '<td width="10%" style="text-align: center; ' +
                    'vertical-align: top">' + '<img src="' + srcImg + '" width="70" height="70" border="0" style="padding-right: 4px;padding-bottom: 3px">' + '</td>' + '</tr>' + '</table>' + '</td>' + '</tr></table>';
       
    },
    getHeader: function () {
        var arrHeader = new Array();		
        var cant = this.getColumnModel().getColumnCount();		
        for (var i = 1; i < cant; i++) {
            arrHeader[i] = this.getColumnModel().getColumnHeader(i);
        }
        return arrHeader;
    },

    verEvaluacion: function () {
//
    }
});

Pvd.Evaluaciones.windGestDoc = Ext.extend(Ext.Window, {
    width: 700,
    layout: 'border',
    height: 600,
    closeAction: 'close',
    modal: true,
    constrain: true,
    initComponent: function() {
        var self = this;
        this.accion = "ADD";

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function() {
              self.close();
            }
        });


        this.panelDocumentos = new Pvd.Evaluaciones.gpDocumentos({
            id: 'panelDocumentos',
            border: true,
            region: 'center',
            singleSelect: true,
            split: true,
            idpersona: self.idpersona,
            valor: self.valor
        });
        self.panelDocumentos.getSelectionModel().on('selectionchange', function(ssm, indiceFila, record) {
            if (ssm.getSelections().length == 1) {
                    self.panelDocumentos.btnAsociarDoc.enable();
                    if (self.panelDocumentos.getSelectionModel().getSelected().get('iddocumentogestordocumental') != null &&
                        self.panelDocumentos.getSelectionModel().getSelected().get('iddocumentogestordocumental') != '') {
                        self.panelDocumentos.btnVerDoc.enable();
                    }

            } else {
                self.panelDocumentos.btnAsociarDoc.disable();
                self.panelDocumentos.btnVerDoc.disable();
            }
        });
        this.items = [self.panelDocumentos];

        Pvd.Evaluaciones.windGestDoc.superclass.initComponent.call(this);
    }

});

Pvd.Evaluaciones.gpDocumentos = Ext.extend(Ext.grid.GridPanel, {
    split: true,
    stripeRows: true,
    loadMask: true,
    initComponent: function() {
        var _this = this;

        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template('<div style="word-wrap:break-word;margin-left:20px;"><b>Detalles</b>:</br></b>{detalles}</p></div>'),
            enableCaching: false
        });

        this.store = new Ext.data.Store({
            url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/cargarDocumentos',
            reader: new Ext.data.JsonReader({
                totalProperty: 'quantity',
                root: 'data',
                id: 'iddocumentopersona'
            }, [
                {name: 'iddocumentopersona'},
                {name: 'fechacreacion'},
                {name: 'detalles'},
                {name: 'tipodocumento'},
                {name: 'calificadores'},
                {name: 'iddocumentogestordocumental'},
                {name: 'nombredocumento'}
            ])
        });
        this.store.load({
            params: {
                idPersona: _this.idpersona,
                valor: _this.valor,
                start: 0,
                limit: 15
            }
        });

        this.cm = new Ext.grid.ColumnModel([_this.expander,
            {
                hidden: true,
                dataIndex: 'iddocumentopersona',
                hideable: false
            }, {
                hidden: true,
                dataIndex: 'iddocumentogestordocumental',
                hideable: false
            }, {
                header: 'Tipo de documento',
                dataIndex: 'tipodocumento',
                width: 120,
                sortable: true
            }, {
                header: 'Fecha de creaci&oacute;n',
                dataIndex: 'fechacreacion',
                width: 110,
                sortable: true
            }, {
                header: 'Calificador(es)',
                dataIndex: 'calificadores',
                width: 270,
                sortable: true
            }, {
                header: 'Nombre del documento',
                dataIndex: 'nombredocumento',
                width: 150,
                sortable: true
            }
        ]);



        this.btnAsociarDoc = new Ext.Button({
            text: 'Asociar documento',
            tooltip: 'Asociar documento',
            id: 'btnAsociarDoc' + _this.id,
            iconCls: 'asociar',
            disabled: true,
            handler: function()
            {
                var iddocpersona = (_this.idpersona) ? _this.idpersona : _this.getSelectionModel().getSelected().get('iddocumentopersona');
                var objetoContenido = new personalizacionalfresco.gestionarchivos.gestionContenido();
                PVD.mostrarMascara('cargarEspacioTrabajo', 'Por favor espere...', 'Cargando espacio de trabajo');
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/cargarEspacioTrabajo',
                    method: 'POST',
                    params: {id: iddocpersona},
                    callback: function(options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('cargarEspacioTrabajo');
                        if (responseData.success) {
                            if (responseData.workspace != null) {
                                objetoContenido.inicializarComponente(true, responseData.workspace);
                            } else {
                                mostrarMensaje(8, 'Error interno al obtener el espacio de trabajo.');
                            }
                        }
                    }
                });
                var temp = true;
                objetoContenido.on('obtenerContenidoOK', function()
                {
                    if (temp) {
                        objetoContenido.winContenido.setTitle('Gestor documental');
                        //Oculto el boton Aplicar porque no hace falta:
                        objetoContenido.winContenido.buttons[1].hide();
                        //Cambio la seleccion para que sea unica:
                        objetoContenido.winContenido.items.items[0].items.items[1].items.items[1].getSelectionModel().singleSelect = true;
                        //Cambio el handler al boton cancelar para que no dispare el evento 'nodeSelected':
                        objetoContenido.winContenido.buttons[0].setHandler(function()
                        {
                            objetoContenido.winContenido.destroy();
                        });
                        objetoContenido.winContenido.show();
                        temp = false;
                    }
                });
                objetoContenido.on("obtenerContenidoEx", function()
                {
                    mostrarMensaje(8, 'Error interno al obtener los archivos del servidor.');
                });
                objetoContenido.on("nodeSelected", function(node)
                {
                    var iddocpersona = _this.getSelectionModel().getSelected().get('iddocumentopersona');
                    if (node[0] != undefined) {
                        var idgestdoc = node[0].id;
                        PVD.mostrarMascara('asociarDocumento', 'Por favor espere...', 'Asociando documento');
                        Ext.Ajax.request({
                            url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/asociarDocumento',
                            method: 'POST',
                            params: {
                                iddocpersona: iddocpersona, idgestdoc: idgestdoc
                            },
                            callback: function(options, success, response)
                            {
                                var responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('asociarDocumento');
                                if (responseData.success) {
                                    Ext.MessageBox.show({
                                        title: 'Informaci&oacute;n',
                                        msg: 'El documento ha sido asociado satisfactoriamente.',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                }
                                _this.getStore().load({
                                    params: {
                                        idPersona: _this.idpersona,valor:_this.valor, start: 0, limit: 15
                                    }
                                });
                            }
                        });
                    } else {
                        mostrarMensaje(6, 'Debe escoger un documento.');
                    }
                });
            }
        });
        this.btnVerDoc = new Ext.Button({
            text: 'Ver documento',
            tooltip: 'Asociar documento',
            id: 'btnVerDoc' + _this.id,
            iconCls: 'ver',
            disabled: true,
            handler: function()
            {
                var iddocumentogestordocumental = _this.getSelectionModel().getSelected().get('iddocumentogestordocumental');
                PVD.mostrarMascara('verDocumento', 'Por favor espere...', 'Cargando documento');
                Ext.Ajax.request({
                    url: '/pvd/evaluaciones/documentos/index.php/gestionardocumentos/verDocumento',
                    method: 'POST',
                    params: {
                        iddocumentogestordocumental: iddocumentogestordocumental
                    },
                    callback: function(options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('verDocumento');
                        if (responseData.success == 1) {
                            window.open(responseData.url);
                        }
                    }
                });
            }
        });

        this.sm = new Ext.grid.RowSelectionModel({singleSelect: true});

        this.plugins = this.expander;

        var qtip = null;

        _this.on('mouseover', function(e) {
            var t = e.getTarget();
            var v = this.getView();
            var rowIndex = v.findRowIndex(t);

            if (rowIndex !== false) {
                var rec = this.getStore().getAt(rowIndex);

                var detalles = '<div style="word-wrap:break-word;margin-left:5px;"><b>Detalles</b>:</br></b>' + rec.get('detalles') + '</p></div>';

                qtip = new Ext.ToolTip({
                    target: t,
                    autoWidth: false,
                    maxWidth: 500,
                    minWidth: 40,
                    html: detalles,
                    trackMouse: true
                });
            }
        }, this);

        this.tbar = [this.btnAsociarDoc, this.btnVerDoc];

        this.bbar = new Ext.PagingToolbar({
            store: _this.store,
            displayInfo: true,
            displayMsg: 'Mostrando {0} - {1} de {2} ',
            emptyMsg: 'No existen datos que mostrar.',
            pageSize: 15
        });

        Pvd.Evaluaciones.gpDocumentos.superclass.initComponent.call(this);

    }

});


