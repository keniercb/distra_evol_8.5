/**
 * Created by Rubier on 22/07/2015.
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.MatrizPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    frame: false,
    pnTbar: this.pnTbar ? this.pnTbar : true,
    pnBbar: this.pnBbar ? this.pnBbar : true,
    layout: this.layout ? this.layout : 'fit',
    pnTitle: this.pnTitle ? this.pnTitle : true,
    region: this.region ? this.region : 'center',
    idestudio: this.idestudio ? this.idestudio : false,
    denominacion: this.denominacion ? this.denominacion : null,

    initComponent: function() {
        var me = this;
        me.idCmp = this.id;
        var comps = ExtExtend.Components;

        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.ImpactocruzadoController();
        me.etiquetas = me.controller._getLabel('Impactocruzado');

        me.title = (me.pnTitle) ? me.etiquetas.titleMatriz : '';

        if (me.pnTbar) {
            me.btngenerar = new comps.Button({
                iconCls: 'extExtend_generar',
                text: 'Generar resultado',
                tooltip: "Generar resultado de la matriz de impacto cruzado",
                handler: function() {
                    var btnExportar = new comps.buttons.btnExportar({
                        text:'<u>E</u>xportar',
                        tooltip: 'Eportar resultado de matriz de impacto cruzado',
                        handler: function() {
                            var windexportar = new Planificacion.Integracion.ExportarWindowImpacto({
                                controller: me.controller,
                                store: me.stmatriz,
                                denominacion: 'Resultado matriz de impacto cruzado',
                                closable: true
                            });

                            windexportar.show();
                        }
                    });
                    var btnCerrar = new comps.buttons.btnCerrar({
                        handler: function() {
                            resultados.close();
                        }
                    });
                    var resultados = new Ext.Window({
                        height: 400,
                        title: me.etiquetas.titleResultado,
                        width: 700,
                        minWidth: 700,
                        resizable: true,
                        modal: true,
                        closeAction: 'destroy',
                        constrain: true,
                        layout: 'border',
                        maximizable: true,
                        items: [new Planificacion.Integracion.ResultadoPanel({
                                controller: me.controller,
                                region: 'center',
                                objproyecto: me.objproyecto
                            })],
                        buttons: [btnCerrar, btnExportar],
                        listeners: {
                            show: function(c) {
                                new ExtExtend.FormValidator({
                                    buttonsRegister: [btnCerrar],
                                    keyMapContainer: c
                                });
                            }
                        }
                    });
                    resultados.show();
                }
            });
            me.btnGrafica = new comps.Button({
                text: me.etiquetas.lbdiagramafc,
                iconCls: 'extExtend_graficar',
                tooltip: "Diagrama de flujos causales de la matriz de impacto cruzado",
                handler: function() {
                    me.diagramaflujocausal();
                }
            });

            me.btnExportar = new comps.buttons.btnExportar({
                handler: function() {

                     params = {
                         idestudio: me.idestudio ? me.idestudio : me.objproyecto.get('idestudiomatrizimpactocruzado'),
                         denominacion: me.denominacion,
                         type: 'matriz'

                     }
                    me.controller.obtenerReporte(params);

                }
            });
        }

        if (me.pnBbar) {
            me.btnActMatriz = new comps.buttons.btnActualizar({
                tooltip: 'Actualizar matriz de impacto cruzado',
                key: {},
                handler: function() {
                    me.stmatriz.reload({
                        params: {
                            idestudio: me.idestudio ? me.idestudio : me.objproyecto.get('idestudiomatrizimpactocruzado')
                        }
                    });
                }
            });
        }

        me.btnAyuda = new comps.buttons.btnAyuda({
            tooltip: 'Mostrar ayuda de la funcionalidad ',
            handler: function() {
                me.controller.mostrarAyuda('impacto_cruzado');
            }
        });

        me.stmatriz = new Ext.data.JsonStore({
            url: '/planificacion/herramientasintegracion/index.php/impactocruzado/obtenerdatosmatrizimpactocruzado',
            totalProperty: 'results',
            root: 'data', fields: [],
            listeners: {
                'beforeload': function() {
                    return false;
                }
            }
        });

        me.gridmatriz = new Ext.grid.LockingEditorGridPanel({
            region: 'center',
            id: 'gpeditormatriz',
            autoScroll: true,
            clicksToEdit: 1,
            columnLines: true,
            border: false,
            iconCls: 'icon-grid',
            store: me.stmatriz,
            columns: [],
            sm: new Ext.grid.CellSelectionModel({singleSelect: false}),
            stripeRows: true,
            loadMask: true,
            plugins: [],
            viewConfig: {
                getRowClass: function(rec, idx, p, store) {
                    return 'anchoFilas';
                }
            },
            listeners: {
                beforeedit: function(e) {
                    if (e.record.data.idvariable === e.field)
                        return false;
                    else
                        return true;
                },
                afteredit: function(e) {
                    var record = {
                        idvariablefila: e.record.data.idvariable,
                        idvariablecolumna: e.field,
                        idimpacto: e.value
                    };
                    me.controller.guardarImpacto({record: record, accion: 'ins'});
                    e.record.commit();
                },
                mouseover: function(e) {
                    //Obtengo el item al que se le aplicara el tooltip
                    var t = e.getTarget();
                    //Obtengo la vista del gridpanel
                    var v = this.getView();
                    //Obtengo la posicion de la fila
                    var rowIndex = v.findRowIndex(t);
                    //Obtener la posicion de la columna
                    var cellColumn = v.findCellIndex(t);
                    //Para que distinga bien entre 0 y false
                    if (rowIndex !== false && cellColumn === 0) {
                        //Obtengo el record de la fila
                        var rec = this.getStore().getAt(rowIndex);
                        //Creo el contenido del tooltip
                        var html = rec.get('denominacion');
                        //Creo el tooltip
                        new Ext.ToolTip({
                            target: t,
                            Width: 250,
                            html: html,
                            trackMouse: true,
                            frame: true,
                            bodyStyle: 'padding: 2.5px'
                        });
                    }
                }
            }
        });

        /**
         * Store del ComboBox Impacto
         * @type {Std.Base.Componentes.Svn.Views.Data.Store}
         */
        me.stImapcto = new Ext.data.Store({
            autoLoad: true,
            url: Planificacion.Integracion.UrlModulo + 'impactocruzado/obtenerimpacto',
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idimpacto'
            }, [
                {name: 'idimpacto'},
                {name: 'denominacion'}
            ])
        });

        me.on('render', function() {
            me.mostrarMatriz({
                idestudio: me.idestudio ? me.idestudio : me.objproyecto.get('idestudiomatrizimpactocruzado')
            });
        });

        me.tbar = (me.pnTbar) ? (me.diagrama) ? [me.btngenerar, me.btnGrafica, me.btnExportar, '->', me.btnAyuda] : [me.btngenerar, '->', me.btnAyuda] : ['->', me.btnAyuda];
        me.items = [me.gridmatriz];
        me.bbar = (me.pnBbar) ? ['->', me.btnActMatriz] : null;

        me.keys = [
            {
                key: 'h',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnAyuda.handler.call();
                }
            },
            {
                key: 'e',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnExportar.handler.call();
                }
            }
        ];

        Planificacion.Integracion.MatrizPanel.superclass.initComponent.call(me);
    },
    mostrarMatriz: function(ob) {
        var me = this;
        me.controller._insertItem('objeto', me);
        me.controller.obtenerConfiguracionMatriz({
            idestudio: ob.idestudio
        });
    },
    reconfigureGrid: function(items) {
        var me = this;

        function colorfn(c, metaData, record, rowIndex, colIndex, store) {
            var num = me.stImapcto.find('idimpacto', c);
            var valor = '';
            var dataIndex = me.gridmatriz.getColumnModel().getDataIndex(colIndex);
            if (num >= 0)
                valor = me.stImapcto.getAt(num).data.denominacion;

            if (record.get('idvariable') === dataIndex) {
                return '<div style="background-color:#fef9ce; border-style: none; padding: 0px 0px 0px 0px; height: 40;"></div>';
            } else {
                return '<div style="background-color:#RRGGBB; border-style: none; padding: 10px 0px 0px 0px; font-size: 12; height: 30"><i>' + valor + '</i></div>';
            }
        }

        function colorfn1(c, metaData, record, rowIndex, colIndex, store) {
            return '<div style="background-color:#fef9ce; border-style: none; padding: 10px 0px 0px 0px; font-size: 14; height: 30 ; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><b><i>' + c + '</b></i></div>';
        }

        var st = me.gridmatriz.getStore();
        var col = [
            {
                header: "<b>" + items[1].header + "</b>",
                locked: true,
                hideable: false,
                menuDisabled: true,
                dataIndex: items[1].name,
                align: 'center',
                width: 180,
                id: 'colVariables',
                renderer: colorfn1,
                tooltip: items[1].header
            }
        ];
        for (var i = 2; i < items.length; i++) {
            column = {
                header: "<b>" + items[i].header + "</b>",
                hideable: false,
                dataIndex: items[i].name,
                menuDisabled: true,
                align: 'center',
                editable: true,
                editor: new Ext.form.ComboBox({
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                    name: 'idimpacto',
                    hiddenName: 'idimpacto',
                    store: me.stImapcto,
                    displayField: 'denominacion',
                    valueField: 'idimpacto',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    emptyText: me.etiquetas.msgCombos,
                    selectOnFocus: true
                }),
                width: 100,
                renderer: colorfn,
                tooltip: items[i].header
            };
            col.push(column);
        }
        me.stmatriz = new Ext.data.JsonStore({
            url: st.url,
            totalProperty: st.totalProperty,
            root: st.root,
            fields: items,
            listeners: {
                'load': function() {
                    me.gridmatriz.getView().refresh();
                }
            }
        });
        var columnas = new Ext.grid.LockingColumnModel(col);
        me.gridmatriz.reconfigure(me.stmatriz, columnas);
        me.stmatriz.reload({
            params: {
                idestudio: me.idestudio ? me.idestudio
                        : me.objproyecto.get('idestudiomatrizimpactocruzado')
            }
        });
    },
    diagramaflujocausal: function() {
        var me = this;
        me.btnExportarFlujo = new Ext.Button({
            icon: perfil.dirImg + 'exportar.png',
            text: '<u>E</u>xportar',
            tooltip: 'Eportar diagrama de flujos casuales <b>(Alt+E)</b>',
            iconCls: 'btn',
            id: 'btnExportarFlujo',
            handler: function() {

                selections = me.controller._getItem('flujocausalvariables').smVariables.getSelections();
                var data = [];
                Ext.each(selections, function(rd){
                    data.push({'denominacion':rd.json.denominacion, 'descripcion': rd.json.descripcion});
                });

                images = [];
                var leyenda = 'data:image/png;base64,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';
                var diagrama = me.controller.obtenerImageBase64();
                images.push(leyenda);
                images.push(diagrama);

                params = {
                    data: data,
                    image: images,
                    denominacion: me.denominacion,
                    type: 'flujocausal'
                }
                me.controller.obtenerReporte(params);
            }
        });

        var btnCerrar = new comps.buttons.btnCerrar({
            handler: function() {
                resultados.close();
            }
        });

        var resultados = new Ext.Window({
            height: 500,
            title: me.etiquetas.lbdiagramafc,
            width: 850,
            minWidth: 700,
            resizable: true,
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'border',
            maximizable: true,
            items: [new Planificacion.Integracion.FlujosCausalesPanel({
                    region: 'center',
                    idestudio: me.idestudio,
                    controller: me.controller,
                    objproyecto: me.objproyecto
                })],
            buttons: [btnCerrar, me.btnExportarFlujo],
            listeners: {
                show: function(c) {
                    new ExtExtend.FormValidator({
                        buttonsRegister: [btnCerrar],
                        keyMapContainer: c
                    });
                }
            }
        });

        me.controller._insertItem('wresultado', resultados);
        resultados.show();
    }
});
Ext.reg('Planificacion.Integracion.MatrizPanel', Planificacion.Integracion.MatrizPanel);