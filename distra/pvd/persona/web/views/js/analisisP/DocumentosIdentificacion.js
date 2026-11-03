/**
 * @name analisispersona.Cmp - Documentos de identificacion.
 * @package Pvd.Persona.
 * @uses Pvd.Persona.AnalisisPersona
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Eddy Santana Navarro
 * @version 1.0
 */
Ext.ns('Pvd.Persona.AnalisisPersona');
Pvd.Persona.AnalisisPersona.DocumentosIdentificacion = Ext.extend(Ext.Panel, {
    layout: 'border',
    id: 'iddocidentificacion',
    region: 'center',
    height: '100%',
    autoScroll: true,
    closable: false,
    initComponent: function () {
        var self = this;
        var filtroidestructura = null;
        var idestructuraentro = null;
        
        this.etiqueta = new Ext.form.Label({
            width: 200,
            style: "font-family:arial,serif; font-size:12px; text-align:center; color:#15428B;",
            html: "<marquee>Estructura organizativa: No definida | Tipos de documento de identificación: No definidos</marquee>"
        });

        this.checkBuscarPorEO = new Ext.form.Checkbox({
            boxLabel: 'Buscar por estructura organizativa',
            hideLabel: true,
            checked: true,
            listeners: {
                check: function(checkbox, checked) {
                    if (checked) {
                        self.cbEstructura.enable();
                    } else {
                        self.cbEstructura.disable();
                    }
                }
            }
        });
        
        this.tlEstructura = new Ext.tree.TreeLoader({
            dataUrl: 'obtenerEstructura',
            preloadChildren: false
        });
        
        this.cbEstructura = new Ext.components.TreeComboBox({
            disabled: false,
            allowBlank: false,
            anchor: '100%',
            fieldLabel: 'Estructura organizativa',
            treeConfig: {
                autoScroll: true,
                border: false,
                loader: self.tlEstructura,
                rootVisible: false
            }
        });        
        
        this.storeTiposDocumento = new Ext.data.Store({
            url: 'cargarComboTiposDocIdentidad',
            reader: new Ext.data.JsonReader({
                root: 'datos', totalProperty: 'cant', id: "idtipodocidentidad"
            }, [{
                    name: 'idtipodocidentidad'
                }, {
                    name: 'denominacion'
                }]),
            listeners: {
                load: function()
                {
                    self.cbTiposDocumento.enable();
                }
            }
        });
        this.storeTiposDocumento.load();
        this.cbTiposDocumento = new Ext.form.MultiComboSelect({
            id: 'cbTiposDocumento',
            fieldLabel: 'Tipo(s) de documento de identificaci&oacute;n',
            name: 'cbTiposDocumento',
            hideOnSelect: false,
            anchor: '100%',
            store: self.storeTiposDocumento,
            triggerAction: 'all',
            valueField: 'idtipodocidentidad',
            displayField: 'denominacion',
            mode: 'local',
            editable: false,
            allowBlank: true
        });
        
        this.formulario = new Ext.FormPanel({
            layout: 'form',
            bodyStyle: 'padding:5px 5px 0',
            frame: true,
            items: [self.checkBuscarPorEO, self.cbEstructura, self.cbTiposDocumento],
            labelAlign: 'top'
        });
        
        this.btnCancelar = new Ext.Button({            
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cancelar b&uacute;squeda',
            handler: function() {
                self.winConfig.hide();
            }
        });
        
        this.btnBuscar = new Ext.Button({            
            iconCls: 'buscar',
            text: 'Buscar',
            tooltip: 'Buscar',
            disabled: false,
            handler: function() {
                var denomestructura = null;
                if (self.checkBuscarPorEO.getValue()) {
                    if (Ext.isEmpty(self.cbEstructura.getValue())) {
                        mostrarMensaje(6, 'Debe seleccionar una estructura organizativa.');
                        return;
                    } else {
                        denomestructura = self.cbEstructura.getRawValue();
                        if (self.cbEstructura.getValue() != self.cbEstructura.getRawValue()) {
                            self.filtroidestructura = self.cbEstructura.getValue();
                        } else {
                            self.filtroidestructura = self.idestructuraentro;
                        }
                    }                    
                } else {
                    self.filtroidestructura = null;
                }
                
                var idsTiposDocIdent = self.cbTiposDocumento.getValue();
                var denomTiposDocIdent = self.cbTiposDocumento.getRawValue();
                self.stTiposDocumento.load({
                    params: {
                        idestructura: self.filtroidestructura,
                        idsTiposDocIdent: idsTiposDocIdent
                    }
                });
                ActualizarGrafica(self.filtroidestructura, idsTiposDocIdent);
                self.winConfig.hide();
                
                if (Ext.isEmpty(denomestructura)) {
                    denomestructura = 'No definida';
                }
                if (Ext.isEmpty(denomTiposDocIdent)) {
                    denomTiposDocIdent = 'No definidos';
                }
                
                self.etiqueta.setText('<marquee>Estructura organizativa: ' +  denomestructura + ' | Tipos de documento de identificación: ' + denomTiposDocIdent + '</marquee>', false);
            }
        });
        
        this.winConfig = new Ext.Window({
            buttons: [self.btnCancelar, self.btnBuscar],
            closeAction: 'hide',
            items: [self.formulario],
            modal: true,
            constrain: true,
            title: 'Configurar b&uacute;squeda'
        });        
        
        this.btnConfBusqueda = new Ext.Button({
            iconCls: 'buscaravanzada',            
            text: 'Configurar b&uacute;squeda',
            tooltip: 'Configurar b&uacute;squeda',
            handler: function() {
                self.winConfig.show();
            }
        });
        
        this.btnExportar = new Ext.Toolbar.MenuButton({
            text: 'Exportar',
            tooltip: 'Exportar datos',
            //disabled: true,
            iconCls: 'exportar',
            menu: {
                items: [
                    {
                        text: 'Exportar tipos de doc. de identificaci&oacute;n  <spam style="color: #a61120">(*.pdf)</spam>',
                        iconCls: 'registrodecomprobante',
                        disabled: false,
                        handler: onClickPDF
                    }
                ]
            }
        });
        
        //Fuente de datos del listado de tipos de documento de identificacion
        this.stTiposDocumento = new Ext.data.Store({
            url: 'getDatosDocIdentificacion',
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: 'quantity',
                    root: "data", id: "idtipodocidentidad"
                },
                [
                    {name: 'idtipodocidentidad'},
                    {name: 'tipodocumento'},
                    {name: 'cantidad'},
                    {name: 'cantidadprincipal'}
                ]
            )
        });
        
        this.smselectPro = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        
        this.gpTiposDocumento = new Ext.grid.GridPanel({
            region: 'south',
            split: true,
            collapsible: true,
            height: 400,
            title: 'Listado de tipos de documento de identificaci&oacute;n',
            autoHeight: false,
            loadMask: {msg: 'Cargando...'},
            store: self.stTiposDocumento,
            autoScroll: true,
            sm: this.smselectPro,
            columns: [
                {
                    header: 'Tipo de documento',
                    width: 300,
                    dataIndex: 'tipodocumento'
                },
                {
                    header: 'Cantidad de personas',
                    width: 200,
                    dataIndex: 'cantidad'
                },
                {
                    header: 'Como principal',
                    width: 200,
                    dataIndex: 'cantidadprincipal'
                }
            ],
            bbar: [self.etiqueta/*, '->', this.btnExportar*/],
            listeners: {
                celldblclick: function(grid, rowIndex, columnIndex, event) {
                    var selectedRecord = self.stTiposDocumento.getAt(rowIndex);
                    var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                    var data = selectedRecord.get(fieldName);
                    
                    if (columnIndex > 0 && !Ext.isEmpty(data) && !isNaN(data) && data > 0) {
                        
                        var idestructura = self.filtroidestructura;
                        var idTipoDocIdent = selectedRecord.get('idtipodocidentidad');
                        
                        var win = new Pvd.Persona.AnalisisPersona.WinPersonas({
                            constrain: true,
                            idestructura: idestructura,
                            idTipoDocIdent: idTipoDocIdent,
                            idcolumna: columnIndex
                        });
                        win.show();
                    }
                }
            }
        });

        var series = [{name: 'Cantidades', data: []}];
        this.pchar = new Ext.components.HighchartPanel({
            border: true,
            layout: 'fit',
            region: 'center',
            chartConfig: {
                chart: {type: 'line'},
                title: {text: 'Cantidades de personas por tipos de documentos'},
                xAxis: {
                    categories: [],
                    labels: {rotation: -45, align: 'right'}
                },
                yAxis: {min: 0, title: {text: 'Cantidad de personas'}},
                tooltip: {
                    headerFormat: '<span style="font-size:11px"><b>{point.key}</b></span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0;font-size:11px">{series.name}: </td>' +
                    '<td style="padding:0;font-size:11px"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: series
            }
        });
        

        self.items = [{
            region: 'center',
            xtype: 'panel',
            id: 'north-panel',
            height: '50%',
            border: false,
            collapsible: true,
            layout: 'fit',
            items: [self.pchar],
            tbar: [self.btnConfBusqueda, self.btnExportar]
        }, self.gpTiposDocumento];
    
        
        //Se cargan los datos por primera vez cuando se abra la pestanna del reporte:
        Ext.Ajax.request({
            url: 'getDatosEstructuraQueSeEntro',
            params: {},
            callback: function () {
                Ext.getBody().unmask();
            },
            success: function (r) {
                var responseData = Ext.decode(r.responseText);
                
                self.stTiposDocumento.load({
                    params: {
                        idestructura: responseData.idestructura,
                        idsTiposDocIdent: null
                    }
                });
                
                ActualizarGrafica(responseData.idestructura, null);
                
                self.cbEstructura.setValue(responseData.denomestructura);
                self.filtroidestructura = responseData.idestructura;
                self.idestructuraentro = responseData.idestructura;
                
                self.etiqueta.setText('<marquee>Estructura organizativa: ' +  responseData.denomestructura + ' | Tipos de documento de identificación: No definidos</marquee>', false);
            }
        });

        function ActualizarGrafica(idestructura, idsTiposDocIdent){            
            Ext.Ajax.request({
                url: 'getDatosDocIdentificacion',
                params: {
                    idestructura: idestructura,
                    idsTiposDocIdent: idsTiposDocIdent
                },
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    var datos = responseData.data;
                    
                    var tiposDoc = new Array();
                    var ser = new Array();
                    var ser2 = new Array();
                    
                    for (var i = 0; i < datos.length; i++) {
                        tiposDoc.push(datos[i].tipodocumento);
                        ser.push(parseInt(datos[i].cantidad));
                        ser2.push(parseInt(datos[i].cantidadprincipal));
                    }

                    while (self.pchar.chart.series.length > 0) {
                        self.pchar.chart.series[0].remove(true);
                    }

                    self.pchar.chart.xAxis[0].setCategories(tiposDoc,true);
                    self.pchar.chart.addSeries({name: 'Cantidad de personas', data: ser});
                    self.pchar.chart.addSeries({name: 'Como principal', data: ser2});
                }
            })
        }

        function onClickPDF() {            
            var idestructura = self.filtroidestructura;
            if (self.checkBuscarPorEO.getValue()) {
                if (Ext.isEmpty(self.cbEstructura.getValue())) {
                    mostrarMensaje(6, 'Debe seleccionar una estructura organizativa.');
                    return;
                } else {
                    //idestructura = self.cbEstructura.getValue();
                    idestructura = self.filtroidestructura;                    
                }                    
            }
            var idsTiposDocIdent = self.cbTiposDocumento.getValue();
            
            var params = Ext.urlEncode({
                idestructura: idestructura,
                idsTiposDocIdent: idsTiposDocIdent
            });
            var idIframe = Ext.id();

            new Ext.Window({
                title: 'Tipos de documento de identificaci&oacute;n',
                width: 800,
                height: 500,
                id: 'wintiposdocident',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/persona/index.php/analisispersona/getPDFDocIdentificacion?' + params
                    }
                }
            }).show();
            Ext.getCmp('wintiposdocident').maximize();
            Ext.getBody().mask('Por favor espere...');
            //PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando registro de altas.');
            document.getElementById(idIframe).onload = function () {
                //PVD.ocultarMascara('rep01');
                Ext.getBody().unmask();
            }
        }

        Pvd.Persona.AnalisisPersona.DocumentosIdentificacion.superclass.initComponent.call(this);
    }
});

Pvd.Persona.AnalisisPersona.WinPersonas = Ext.extend(Ext.Window, {
    layout: 'border',
    modal: true,
    height: 520,
    width: 850,
    title: 'Listado de personas',
    initComponent: function() {
        var self = this;
        
        this.btnExportarPer = new Ext.Button({
            iconCls: 'exportar',            
            text: 'Exportar',
            tooltip: 'Exportar personas',
            handler: function() {

                var params = Ext.urlEncode({
                    idestructura: self.idestructura,
                    idTipoDocIdent: self.idTipoDocIdent,
                    idcolumna: self.idcolumna
                });
                var idIframe = Ext.id();

                new Ext.Window({
                    title: 'Listado de personas',
                    width: 800,
                    height: 500,
                    id: 'winlistpersonas',
                    maskDisabled: false,
                    animCollapse: false,
                    maximizable: true,
                    constrain: true,
                    border: false,
                    modal: true,
                    items: {
                        xtype: 'component',
                        autoEl: {
                            tag: 'iframe',
                            id: idIframe,
                            style: 'height: 100%; width: 100%; border: none',
                            src: document.location.protocol + '//' + document.location.host +
                            '/pvd/persona/index.php/analisispersona/getPDFListadoPersonas?' + params
                        }
                    }
                }).show();
                Ext.getCmp('winlistpersonas').maximize();
                Ext.getBody().mask('Por favor espere...');
                //PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando registro de altas.');
                document.getElementById(idIframe).onload = function () {
                    //PVD.ocultarMascara('rep01');
                    Ext.getBody().unmask();
                }
            }
        });

        this.stPersonas = new Ext.data.Store({
            url: 'getPersonasPorTipoDeDoc',
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: 'quantity',
                    root: "data", id: "idpersona"
                },
                [
                    {name: 'docident'},
                    {name: 'nombre'},
                    {name: 'snombre'},
                    {name: 'papel'},
                    {name: 'sapel'}
                ]
            )
        });
        
        this.smPersona = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        
        this.gpPersona = new Ext.grid.GridPanel({
            region: 'center',
            //height: 400,
            autoHeight: false,
            loadMask: {msg: 'Cargando...'},
            store: self.stPersonas,
            autoScroll: true,
            sm: self.smPersona,
            tbar: [self.btnExportarPer],
            columns: [
                {
                    header: 'Doc. de ident.',
                    width: 150,
                    dataIndex: 'docident'
                },
                {
                    header: 'Nombre',
                    width: 150,
                    dataIndex: 'nombre'
                },
                {
                    header: 'Segundo nombre',
                    width: 150,
                    dataIndex: 'snombre'
                },
                {
                    header: 'Primer apellido',
                    width: 150,
                    dataIndex: 'papel'
                },
                {
                    header: 'Segundo apellido',
                    width: 150,
                    dataIndex: 'sapel'
                }
            ],
            bbar: new Ext.PagingToolbar({
                store: self.stPersonas,
                displayInfo: true,
                pageSize: this.pageSize || 20
            })
        });   
        
       self.gpPersona.getStore().baseParams = {
            idestructura: self.idestructura,
            idTipoDocIdent: self.idTipoDocIdent,
            idcolumna: self.idcolumna
        };
        
        this.gpPersona.getStore().load({
            params: {                
                limit: 20,
                start: 0
            }
        });
        
        this.items = [this.gpPersona];
        Pvd.Persona.AnalisisPersona.WinPersonas.superclass.initComponent.call(this);
    }
});