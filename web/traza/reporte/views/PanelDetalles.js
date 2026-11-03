
Ext.define("Traces.views.PanelDetalles", {
    require: [
        "Ext.panel.Panel"
    ],
    extend: "Ext.panel.Panel",
    alias: "widget.panelDetalles",
    title: 'Detalles',
    layout: 'border',
    margins: '5 0 0 0',
    id:'panelDetalles',
    mixins: {
        checkCombo: 'Ext.ux.CheckCombo', treeGrid: 'Ext.ux.TreeGrid'
    },
    /*store:[
        'TipoTrazaStore', 'IpStore', 'SubsistemaStore', 'UsuarioStore'
    ],*/

    initComponent: function () {
        var _this = this;
        _this.storeip = Ext.create('Traces.store.IpStore');
        _this.storesubsistema = Ext.create('Traces.store.SubsistemaStore');
        _this.storetipotraza = Ext.create('Traces.store.TipoTrazaStore');
        _this.storeusuario = Ext.create('Traces.store.UsuarioStore');
        _this.storetree = Ext.create('Traces.store.GridStore');

        this.myMask = new Ext.LoadMask(Ext.getBody(), {msg:perfil.etiquetas.texts.loadingText});

        _this.btnExportar = Ext.create('Ext.button.Button', {
            disabled: true,
            id: 'btnExportar',
            tooltip: perfil.etiquetas.tooltips.exportar,
            iconCls: 'exportar',
            prevTab: 'btnLimpiar',
            nextTab: 'btnAyuda',
            text: perfil.etiquetas.texts.exportar,
            handler: function(){
                var arreglo = [];
                arreglo.push(Ext.getCmp('grid').getSelectionModel().getSelection()[0].data.tipotraza);
                arreglo.push(Ext.getCmp('grid').getSelectionModel().getSelection()[0].data.identidad);
                window.open('exportarxml?datos=' + Ext.JSON.encode(arreglo));
            }
        });


        _this.btnAyuda = Ext.create('Ext.button.Button', {
            iconCls: 'ayuda',
            xtype: 'button',
            border: false,
            id: 'btnAyuda',
            text: 'Ayuda',
            //margin: '0 9 0 0',
            nextTab: 'iddesde',
            prevTab: 'btnExportar'

        });

        _this.tbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [_this.btnExportar, '->', _this.btnAyuda]
        });

       _this.fechaInicio = Ext.create('Ext.form.field.Date', {
            id: 'iddesde',
            fieldLabel: perfil.etiquetas.texts.lbDfDesde,
            labelAlign: 'top',
            anchor: "98%",
            //colWidth: .1,
            value: new Date(),
            maxValue: new Date(),
            regexText: perfil.etiquetas.texts.msgValorIncorrecto,
            regex: /([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})/,
            editable: false,
            format: 'd/m/Y',
            margin: '0 10 5 0',
            listeners: {

            }
        });

        var fecha = new Date();
        var addTime = 86400;
        _this.fechaFin = Ext.create('Ext.form.field.Date', {
            id: 'idhasta',
            fieldLabel: perfil.etiquetas.texts.lbDfHasta,
            labelAlign: 'top',
            regexText: perfil.etiquetas.texts.msgValorIncorrecto,
            regex: /([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})/,
            anchor: "98%",
            maxValue: new Date(fecha.setSeconds(addTime)),
            value: new Date(),
            editable: false,
            format: 'd/m/Y',
            margin: '0 10 5 0',
            listeners: {

            }
        });

        _this.combosubsistema = Ext.create('Ext.form.ComboBox', {
            id: 'combosubsistema',
            emptyText:perfil.etiquetas.texts.emptyText,
            fieldLabel:perfil.etiquetas.texts.labelSubsistema,
            editable:false,
            labelAlign: 'top',
            colWidth: .1,
            store: _this.storesubsistema,
            valueField:'subsistema',
            displayField:'subsistema',
            hiddenName:'id',
            typeAhead: true,
            triggerAction: 'all',
            selectOnFocus:true,
            anchor:'95%',
            margin: '0 10 5 0',
            listConfig: {
                loadingText: perfil.etiquetas.texts.loadingText
            }
        });

        _this.combousuario = Ext.create('Ext.ux.CheckCombo', {
            id: 'combousuario',
            emptyText: perfil.etiquetas.texts.emptyText,
            fieldLabel: perfil.etiquetas.texts.labelUsuario,
            editable:false,
            labelAlign: 'top',
            colWidth: .1,
            store: _this.storeusuario,
            valueField:'idusuario',
            displayField:'usuario',
            hiddenName:'usuario',
            anchor:'98%',
            margin: '0 10 5 0',
            listConfig: {
                loadingText: perfil.etiquetas.texts.loadingText
            }
        });

        _this.comboip = Ext.create('Ext.form.ComboBox', {
            id: 'comboip',
            emptyText:perfil.etiquetas.texts.emptyText,
            fieldLabel: perfil.etiquetas.texts.labelIP,
            editable:false,
            labelAlign: 'top',
            colWidth: .1,
            store: _this.storeip,
            valueField:'ippc',
            displayField:'ip',
            hiddenName:'ippc',
            typeAhead: true,
            triggerAction: 'all',
            selectOnFocus:true,
            anchor:'95%',
            margin: '0 10 5 0',
            listConfig: {
                loadingText: perfil.etiquetas.texts.loadingText
            }
        });

        _this.combotipo = Ext.create('Ext.ux.CheckCombo', {
            id: 'combotipo',
            emptyText:perfil.etiquetas.texts.emptyText,
            fieldLabel: perfil.etiquetas.texts.labelTipoTraza,
            labelAlign: 'top',
            editable:false,
            colWidth: .15,
            store: _this.storetipotraza,
            valueField:'idtipotraza',
            displayField:'tipotraza',
            mode: 'local',
            anchor:'98%',
            margin: '0 10 5 0',
            reloadOnExpand: false,
            listConfig: {
                loadingText: perfil.etiquetas.texts.loadingText
            }
        });

        _this.btnBuscar = Ext.create('Ext.button.Button', {
            id: 'btnBuscar',
            iconCls:'buscar',
            text: perfil.etiquetas.texts.textBtnBuscar,
            tooltip: perfil.etiquetas.tooltips.buscar,
            action: 'buscar',
            disabled: true,
            margin: '20 0 5 5'
        });

        _this.btnLimpiar = Ext.create('Ext.button.Button', {
            id: 'btnLimpiar',
            iconCls: 'limpiar',
            tooltip: perfil.etiquetas.tooltips.limpiar,
            text: perfil.etiquetas.texts.textBtnLimpiar ,
            action: 'limpiar',
            disabled: true,
            nextTab: 'btnExportar',
            margin: '20 0 5 0'
        });

        _this.filtroSearch = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            //height: 80,
            //padding: 10,
            layout: 'table',
            id: 'filtroSearch',
            items: [
                _this.fechaInicio, _this.fechaFin, _this.combousuario, _this.combosubsistema, _this.comboip, _this.combotipo, _this.btnBuscar, _this.btnLimpiar
            ],

            beforerender:function(){
                Ext.getCmp("filtroSearch").addCls("unscrollable");
            }
        });

        Ext.create('Ext.window.Window', {
            id: 'detallesWindow',
            closable : true,
            autoHeight: true,
            autoWidth : true,
            layout: 'fit',
            form: null,
            plain: true,
            modal: true,
            constrain: true,
            buttons: [{
                id: 'idcerrar',
                text: perfil.etiquetas.texts.textCerrar,
                nextTab: 'inform',
                iconCls: 'cerrar',
                handler: function(){
                    var w = this.up('window');
                    w.remove(w.form);
                    w.form = null;
                    w.hide();
                }
            }],
            beforeclose: function(t){
                t.remove(t.form);
                t.form = null;
                t.hide();
            }
        });

        _this.treegrid = Ext.create('Ext.ux.TreeGrid', {
                id: 'grid',
                region: 'center',
                forceFit: true,
                enableColumnHide: false,
                collapsible: true,
                store: _this.storetree,
                viewConfig: {
                    loadingText: 'Cargando...'
                },
                columns: {
                    items:[{
                        xtype: 'treecolumn',
                        sortable: false,
                        dataIndex: 'text',
                        width: 300
                    },{
                        text: perfil.etiquetas.texts.gridHeaderFecha,
                        sortable: true,
                        dataIndex: 'fecha',
                        align: 'center'
                    },{
                        text: perfil.etiquetas.texts.gridHeaderHora,
                        dataIndex: 'hora',
                        sortable: true,
                        align: 'center'
                    },{
                        text: perfil.etiquetas.texts.gridHeaderSubsistema,
                        sortable: true,
                        dataIndex: 'subsistema',
                        align: 'center'
                    },{
                        text: perfil.etiquetas.texts.gridHeaderFuncionalidad,
                        sortable: true,
                        align: 'center',
                        renderer: function(a, b, data){
                            if(data.data.funcionalidad_accion != null)
                                return data.data.funcionalidad_accion;
                            if(data.data.funcionalidad_integracion != null)
                                return data.data.funcionalidad_integracion;
                        }
                    },{
                        text: perfil.etiquetas.texts.gridHeaderConsumoMemoria,
                        sortable: true,
                        align: 'center',
                        renderer: function(a, b, data){
                            if(data.data.memoria_accion != null)
                                return data.data.memoria_accion;
                            if(data.data.memoria_integracion != null)
                                return data.data.memoria_integracion;
                        }
                    },{
                        text: perfil.etiquetas.texts.gridHeaderTiempoEjecucion,
                        sortable: true,
                        align: 'center',
                        renderer: function(a, b, data){
                            if(data.data.tiempoejecucion_accion != null)
                                return data.data.tiempoejecucion_accion;
                            if(data.data.tiempoejecucion_integracion != null)
                                return data.data.tiempoejecucion_integracion;
                        }
                    }
                    ]
                }
        });

        formDetallesTrazaAccion = function(){
            return Ext.create('Ext.form.Panel', {
                id: 'formDetallesTrazaAccion',
                height: 120,
                width: 500,
                labelAlign: 'top',
                frame: true,
                defaults:{
                    margin:5
                },
                border:false,
                items: [
                    {
                        xtype:'textfield',
                        fieldLabel: perfil.etiquetas.texts.labelReferencia,
                        labelAlign: top,
                        readOnly: true,
                        name: 'referencia',
                        anchor:'98%',
                        id: 'inform'
                    },
                    {
                        xtype:'textfield',
                        fieldLabel: perfil.etiquetas.texts.labelAccion,
                        labelAlign: top,
                        name: 'accion',
                        anchor: '60%',
                        readOnly: true
                    }
                ]
            });
        };

        formDetallesTrazaExcepcion = function(){
            return Ext.create('Ext.form.Panel', {
                id: 'formDetallesTrazaExcepcion',
                height: 450,
                width: 600,
                labelAlign: 'top',
                frame: true,
                defaults:{
                    margin:5
                },
                border:false,
                items: [{
                        xtype:'textfield',
                        labelAlign: top,
                        fieldLabel: perfil.etiquetas.texts.labelCodigo,
                        name: 'codigo',
                        anchor:'95%',
                        id: 'inform',
                        readOnly: true
                },
                    {
                        xtype:'textfield',
                        labelAlign: top,
                        fieldLabel: perfil.etiquetas.texts.labelIdioma,
                        name: 'idioma',
                        anchor:'95%',
                        readOnly: true

                    },
                    {

                        xtype:'textfield',
                        fieldLabel: perfil.etiquetas.texts.labelTipo,
                        labelAlign: top,
                        name: 'tipo',
                        anchor:'95%',
                        readOnly: true

                    },
                    {
                        xtype:'textfield',
                        fieldLabel: perfil.etiquetas.texts.labelMensaje,
                        labelAlign: top,
                        name: 'mensaje',
                        anchor:'95%',
                        height: 80,
                        readOnly: true
                    },
                    {
                        xtype:'textfield',
                        fieldLabel: perfil.etiquetas.texts.labelDescripcion,
                        labelAlign: top,
                        name: 'descripcion',
                        anchor:'95%',
                        height: 90,
                        readOnly: true
                    },
                    {
                        xtype:'textfield',
                        fieldLabel: perfil.etiquetas.texts.labelRegistro,
                        labelAlign: top,
                        name: 'log',
                        anchor:'95%',
                        height: 150,
                        readOnly: true
                    }]
            });
        };

        formDetallesTrazaDatos = function(){
            return Ext.create('Ext.form.Panel',{
                id: 'formDetallesTrazaDatos',
                //height: 275,
                //width: 450,
                labelAlign: 'top',
                tipo: 'detallesTrazaDatos',
                frame: true,
                autoHeight: true,
                layout: 'column',
                defaults:{
                    margin:5
                },
                border:false,
                items: [
                    {
                        xtype:'textfield',
                        fieldLabel: perfil.etiquetas.texts.labelEsquema,
                        labelAlign: top,
                        name: 'esquema',
                        anchor:'95%',
                        columnWidth:.50,
                        id: 'inform',
                        readOnly: true
                    },
                    {
                        xtype:'textfield',
                        fieldLabel: perfil.etiquetas.texts.labelTabla,
                        labelAlign: top,
                        name: 'tabla',
                        columnWidth:.50,
                        anchor:'95%',
                        readOnly: true
                    },
                    {
                        xtype:'fieldset',
                        checkboxToggle:true,
                        title: perfil.etiquetas.texts.textMostrarDatos,
                        autoHeight:true,
                        columnWidth:1,
                        collapsed: true,
                        items: [
                            Ext.create('Ext.grid.Panel', {
                                id: 'gridDatos',
                                forceFit: true,
                                store: Ext.create('Ext.data.Store', {
                                    fields:['atributo', 'valor']
                                }),
                                columns:[
                                    {header: perfil.etiquetas.texts.textColumnCampo, width: 200, sortable: true, dataIndex: 'atributo'},
                                    {header: perfil.etiquetas.texts.textColumnValor, width: 200, sortable: true, dataIndex: 'valor'},
                                ],
                                collapsible: true,
                                animCollapse: false,
                                layout: 'fit'
                            })
                        ]
                    }]
            });
        };

        formDetallesTrazaIntegracion = function(){
            return Ext.create('Ext.form.Panel', {
                id: 'formDetallesTrazaIntegracion',
                height: 100,
                width: 300,
                labelAlign: 'top',
                frame: true,
                layout: 'column',
                defaults:{
                    margin:5
                },
                border:false,
                items: [{
                    xtype:'textfield',
                    fieldLabel: perfil.etiquetas.texts.labelOrigen,
                    labelAlign: 'top',
                    name: 'origen',
                    columnWidth:.60,
                    anchor:'95%',
                    id: 'inform',
                    readOnly: true
                },{
                    xtype: 'checkbox',
                    name: 'interno',
                    columnWidth:.25,
                    boxLabel: perfil.etiquetas.texts.labelInterno,
                    labelAlign: 'top',
                    hideLabel: true,
                    readOnly: true
                }]
            });
        };

        formDetallesTrazaBloqueo = function(){
            return Ext.create('Ext.form.Panel', {
                id: 'formDetallesTrazaBloqueo',
                height: 80,
                width: 250,
                labelAlign: 'top',
                frame: true,
                defaults:{
                    margin:5
                },
                border:false,
                items: [
                    {
                        xtype:'textfield',
                        fieldLabel: perfil.etiquetas.texts.labelTipoBloqueo,
                        labelAlign: top,
                        name: 'tipobloqueo',
                        id: 'inform',
                        readOnly: true
                    }]
            });
        };

        this.items = [
            /*_this.tbar, */_this.filtroSearch, _this.treegrid
        ];


        this.callParent(arguments);
    }
});