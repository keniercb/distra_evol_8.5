Ext.namespace('Contabilidad.Reporte.Principal');

Ext.onReady(function () {
    var controller = new Contabilidad.Reporte.Principal.Controller();
    controller.cargarIdioma();
});

Contabilidad.Reporte.Principal.View = Ext.extend(Ext.Viewport, {
    layout: 'fit',
    initComponent: function (params) {
        this.crearCuerpo();

        Contabilidad.Reporte.Principal.View.superclass.initComponent.call(this);
    },

    crearCuerpo: function () {

        this.crearTbarAcciones();

        this.crearGrid();

        this.crearFormEvaluacion();

        this.items = [{
            layout: 'border',
            tbar: this.tbarAcciones,
            items: [this.grid, this.formevaluacion]
        }];
    },

    crearGrid: function () {

        this.crearTbarFiltros();

        this.sm = new Ext.grid.CheckboxSelectionModel();

        this.store = new Ext.data.Store({
            url: 'cargarReportesFinancieros',
            baseParams: {
                start: 0,
                limit: 20
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                id: 'idreportefinanciero'
            }, [
                {
                    name: 'idreportefinanciero'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'codigo'
                },
                {
                    name: 'filas'
                },
                {
                    name: 'columnas'
                },
                {
                    name: 'cuerpo'
                }
            ])
        });

        this.filters = new Ext.grid.GridFilters({
            filtersText: this.etiquetas.lbFiltro,
            paramPrefix: 'filtro',
            filters: [
                {type: 'string', dataIndex: 'denominacion'},
                {type: 'string', dataIndex: 'codigo'}
            ]
        });

        this.grid = new Ext.grid.GridPanel({
            tbar: this.tbarFiltros,
            loadMask: this.etiquetas.lbCargando,
            region: 'center',
            frame: false,
            border: false,
            stripeRows: true,
            autoExpandColumn: 'expandir',
            store: this.store,
            sm: this.sm,
            width: 3000,
            viewConfig: {
                emptyText: this.etiquetas.lbNoResults,
                forceFit: true
            },
            plugins: this.filters,
            columns: [
                {
                    header: this.etiquetas.lbCodigo,
                    width: 200,
                    dataIndex: 'codigo',
                    sortable: true,
                    fixed: true
                },
                {
                    header: this.etiquetas.lbDenominacion,
                    dataIndex: 'denominacion',
                    id: 'expandir',
                    sortable: true
                }
            ],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: false,
                displayMsg: this.etiquetas.lbDisplayMsg,
                emptyMsg: this.etiquetas.lbNoResults,
                store: this.store,
                firstText: this.etiquetas.lbPrimeraPagina,
                lastText: this.etiquetas.lbUltimaPagina
            })
        });
    },

    crearFormEvaluacion: function () {

        this.crearCmbEntidad();

        this.crearCmbEjercicio();

        this.crearCmbPeriodo();

        this.fecha = new Ext.form.DateField({
            fieldLabel: this.etiquetas.lbHasta,
            name: 'fechafin',
            format: 'd/m/Y',
            anchor: '100%',
            disabled: true,
            allowBlank: false
        });

        this.btnEvaluar = new Ext.Button({
            text: this.etiquetas.lbBtnEvaluar,
            tooltip: this.etiquetas.lbTtEvaluar,
            iconCls: 'evaluar',
            accion: 'evaluar',
            disabled: true
        });

        this.btnExportar = new Ext.Button({
            text: 'Exportar',
            // tooltip: this.etiquetas.lbTtEvaluar,
            iconCls: 'exportar',
            accion: 'exportar',
            disabled: true,
            // hidden: true
        });

        this.formevaluacion = new Ext.form.FormPanel({
            title: this.etiquetas.lbTtEvaluar,
            region: 'east',
            width: 300,
            labelAlign: 'top',
            autoExpand: true,
            defaults: {
                anchor: '98%'
            },
            frame: true,
            border: false,
            collapsible: true,
            collapsed: true,
            split: 'true',
            items: [this.cmbEntidad, this.cmbEjercicio, this.cmbPeriodo, this.fecha],
            buttons: [this.btnEvaluar, this.btnExportar]
        });
    },

    crearCmbEntidad: function () {

        this.smTreeEntidad = new Ext.grid.RowSelectionModel({
            /*listeners: {
             scope: this,
             rowselect: function (sm, index, record) {
             this.cmbEntidad.setValue(record.data.id);
             this.cmbEntidad.setRawValue(record.data.text);
             this.cmbEntidad.fireEvent('select', this.cmbEntidad, record);
             this.cmbEntidad.collapse();
             }
             }*/
        });

        this.stTreeEntidad = new Ext.Cont.TreeGrid.AdjacencyListStore({
            autoLoad: false,
            url: 'cargarEntidadesEconomicas',
            reader: new Ext.data.JsonReader({
                id: '_id',
                root: 'datos',
                successProperty: 'success'
            }, [
                {name: 'id'},
                {name: '_id'},
                {name: 'idestructurae'},
                {name: 'descripcion'},
                {name: 'text'},
                {name: 'codigo'},
                {name: 'leaf'},
                {name: '_is_leaf'},
                {name: '_parent'}
            ])
        });

        this.treeEntidad = new Ext.Cont.TreeGrid.GridPanel({
            region: 'center',
            autoScroll: true,
            stripeRows: true,
            border: false,
            frame: false,
            loadMask: true,
            sm: this.smTreeEntidad,
            store: this.stTreeEntidad,
            enableColumnMove: false,
            hideHeaders: true,
            columns: [
                {
                    dataIndex: 'text',
                    sortable: true,
                    //id: 'expandir',
                    width: 260,
                    header: 'Denominacion',
                    renderer: function (value, metaData, record) {
                        metaData.attr = 'ext:qtip="<b>' + value + '</b>"';
                        return value;
                    }
                }
            ]
        });

        this.pEntidad = new Ext.Panel({
            layout: 'fit',
            border: false,
            frame: false,
            height: 200,
            items: [this.treeEntidad]
        });

        this.cmbEntidad = new Ext.form.ComboBox({
            fieldLabel: this.etiquetas.lbEntidad,
            emptyText: this.etiquetas.lbSeleccione,
            displayField: 'descripcion',
            valueField: 'idestructurae',
            name: 'idestructurae',
            mode: 'local',
            tpl: '<div id = \"cmbentidad\" style = \"height:200px; !important;\"></div>',
            store: new Ext.data.SimpleStore({
                fields: [{name: 'idestructurae'}, {name: 'descripcion'}],
                data: [[]]
            }),
            editable: false,
            triggerAction: 'all',
            anchor: '100%',
            allowBlank: false,
            readOnly: true,
            listeners: {
                scope: this,
                expand: function (combo) {
                    if (!this.pEntidad.rendered) {
                        this.pEntidad.render('cmbentidad');
                        //this.stTreeEntidad.load();
                    }
                }
            }
        });
    },

    crearCmbEjercicio: function () {

        this.stEjercicio = new Ext.data.Store({
            url: 'cargarEjerciciosContables',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idejercicio'
            }, [{name: 'idejercicio'}, {name: 'nombre'}])
        });

        this.cmbEjercicio = new Ext.form.ComboBox({
            name: 'ejercicio',
            anchor: '100%',
            valueField: 'idejercicio',
            displayField: 'nombre',
            triggerAction: 'all',
            editable: true,
            forceSelection: true,
            typeAhead: true,
            disabled: true,
            allowBlank: false,
            store: this.stEjercicio,
            emptyText: this.etiquetas.lbSeleccione,
            loadingText: this.etiquetas.lbCargando,
            fieldLabel: this.etiquetas.lbEjercicio,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>'
        });
    },

    crearCmbPeriodo: function () {
        this.stPeriodo = new Ext.data.Store({
            url: 'cargarPeriodosContables',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idperiodo'
            }, [{name: 'idperiodo'}, {name: 'nombre'}, {name: 'inicio'}, {name: 'fin'}])
        });

        this.cmbPeriodo = new Ext.form.ComboBox({
            name: 'periodo',
            anchor: '100%',
            valueField: 'idperiodo',
            displayField: 'nombre',
            triggerAction: 'all',
            editable: true,
            forceSelection: true,
            typeAhead: true,
            disabled: true,
            allowBlank: false,
            store: this.stPeriodo,
            emptyText: this.etiquetas.lbSeleccione,
            loadingText: this.etiquetas.lbCargando,
            fieldLabel: this.etiquetas.lbPeriodo,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>'
        });
    },

    crearTbarAcciones: function () {

        this.btnAdicionar = new Ext.Button({
            text: this.etiquetas.lbBtnAdicionar,
            tooltip: this.etiquetas.lbTtAdicionar,
            iconCls: 'adicionar',
            accion: 'adicionar',
            keyMap: {
                key: 'i',
                alt: true,
                event: 'click'
            }
        });

        this.btnModificar = new Ext.Button({
            text: this.etiquetas.lbBtnModificar,
            tooltip: this.etiquetas.lbTtModificar,
            iconCls: 'modificar',
            accion: 'modificar',
            disabled: true,
            keyMap: {
                key: 'm',
                alt: true,
                event: 'click'
            }
        });

        this.btnEliminar = new Ext.Button({
            text: this.etiquetas.lbBtnEliminar,
            tooltip: this.etiquetas.lbTtEliminar,
            iconCls: 'eliminar',
            accion: 'eliminar',
            disabled: true,
            keyMap: {
                key: Ext.EventObject.DELETE,
                event: 'click'
            }
        });

        this.btnConfigurar = new Ext.Button({
            id: 'btnConfigurarRepFinanciero',
            text: 'Configurar',
            tooltip: 'Configurar estados financieros',
            iconCls: 'configurar',
            disabled: this.controller.esRectora != 1,
            hidden: this.controller.esRectora != 1
        });

        this.btnReplicar = new Ext.Button({
            id: 'btnReplicarRepFinanciero',
            text: 'Replicar',
            tooltip: 'Replicar estados financieros',
            iconCls: 'aceptar',
            disabled: true,
            hidden: this.controller.esRectora != 1
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaRepFinanciero',
            text: this.etiquetas.lbBtnAyuda,
            tooltip: this.etiquetas.lbTtAyuda,
            iconCls: 'ayuda'
        });

        this.tbarAcciones = new Ext.Toolbar({
            items: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnConfigurar, this.btnReplicar, '->', this.btnAyuda]
        });
    },

    crearTbarFiltros: function () {

        this.filtro = new Ext.Cont.SearchField({
            lbTtlElement: 'reportes financieros',
            width: 250,
            hideLabel: true,
            fnOnClear: function () {
                this.fireEvent('onclear', this, this.getValue());
            },
            fnOnSearch: function () {
                this.fireEvent('onsearch', this, this.getValue());
            },
            keyMap: [
                {
                    key: 'b',
                    alt: true,
                    function: 'fnOnSearch'
                },
                {
                    key: 'l',
                    alt: true,
                    function: 'fnOnClear'
                }
            ]
        });

        this.tbarFiltros = new Ext.Toolbar({
            items: [this.filtro]
        });
    }
});

Contabilidad.Reporte.Principal.Controller = function () {
    this.perfil = window.parent.UCID.portal.perfil;
    this.idfuncionalidad = window.frameElement.id;
    this.idestructuraeactual = this.idestructurae = undefined;
    this.setidestructurae = true;

    this.cargarIdioma = function () {
        var idioma = this.perfil.idioma,
            text = (idioma === 'es') ? 'Cargando...' : 'Loading...',
            title = (idioma === 'es') ? 'Por favor espere...' : 'Please wait...',
            me = this;

        this.mostrarMensajeEspera(title, text);

        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            params: {
                vista: 'gestionarreportefinanciero'
            },
            scope: this,
            callback: function (options, success, response) {
                this.etiquetas = Ext.decode(response.responseText);

                this.cargarAcciones();
            }
        });
    };

    this.cargarAcciones = function () {

        Ext.Ajax.request({
            url: 'cargaracciones',
            method: 'POST',
            params: {
                idfuncionalidad: this.idfuncionalidad
            },
            scope: this,
            callback: function (opts, success, response) {
                if (success) {
                    /*_this.grantedActions = Ext.decode(response.responseText);

                     var codMsg = _this.grantedActions.codMsg;

                     _this.showGrantedActions();
                     if (!codMsg) {
                     }*/
                }
                Ext.MessageBox.hide();

                this.cargarDatosGeneral();
            }
        });
    };

    this.cargarDatosGeneral = function () {

        Ext.Ajax.request({
            url: 'cargarDatosGeneral',
            method: 'POST',
            scope: this,
            callback: function (opts, success, response) {
                var res = Ext.decode(response.responseText);
                this.esRectora = res.estructuraRectora;
                Ext.MessageBox.hide();

                this.inicializarComponente();
            }
        });
    };

    this.mostrarMensajeEspera = function (titulo, mensaje) {

        Ext.MessageBox.show({
            title: titulo,
            msg: mensaje,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    };

    this.inicializarComponente = function () {
        this.view = new Contabilidad.Reporte.Principal.View({
            etiquetas: this.etiquetas,
            controller: this
        });
        this.inicializarEventos();

        this.view.grid.getStore().load();
    };

    this.inicializarEventos = function () {

        this.view.btnAdicionar.on({
            scope: this,
            click: this.crearVentanaReporte
        });

        this.view.btnModificar.on({
            scope: this,
            click: this.crearVentanaReporte
        });

        this.view.btnEliminar.on({
            scope: this,
            click: this.eliminarReporteFinanciero
        });

        this.view.btnConfigurar.on({
            scope: this,
            click: this.configurarReporteFinanciero
        });

        this.view.btnReplicar.on({
            scope: this,
            click: this.replicarReporteFinanciero
        });

        this.view.btnEvaluar.on({
            scope: this,
            click: this.evaluarReporteFinanciero
        });

        this.view.btnExportar.on({
            scope: this,
            click: this.exportarReporteFinanciero
        });

        this.view.filtro.on({
            scope: this,
            onclear: function (f) {
                f.setValue('');
                f.blur();
                this.view.grid.filters.clearFilters();
                this.view.store.baseParams.search = '';
                this.view.store.reload();
            },
            onsearch: function (f, valor) {
                var filters = this.view.grid.filters;
                if (valor) {
                    //filters.getFilter('denominacion').setValue(valor);
                    //filters.getFilter('denominacion').setActive(true);
                    this.view.store.baseParams.search = valor;
                    this.view.store.reload();
                } else {
                    f.focus(false, 100);
                }

            }
        });

        this.view.sm.on({
            scope: this,
            selectionchange: this.onSelectReporte
        });

        this.view.grid.on({
            scope: this,
            rowdblclick: function () {
                var btn = this.view.btnModificar;
                btn.fireEvent('click', btn);
            },
            rowclick: function (grid) {
                var cantidad = this.view.grid.getSelectionModel().getCount();
                if (cantidad == 1) {
                    if (this.view.formevaluacion.autoExpand) {
                        this.view.formevaluacion.expand();
                    }
                } else {
                    if (this.view.formevaluacion.autoExpand) {
                        this.view.formevaluacion.collapse();
                    }
                }

            },
            click: function (grid) {
                if (this.view.grid.getSelectionModel().getCount() != 1) {
                    this.view.formevaluacion.collapse();
                }
            }
        });

        this.view.grid.store.on({
            scope: this,
            load: function () {
                if (this.view.store.getTotalCount() == 0)
                    mostrarMensaje(1, 'No existen datos que se correspondan con el criterio de búsqueda especificado.');
                if (!this.keyMap) {
                    this.crearKeyMap();
                }
            }
        });

        this.view.formevaluacion.on({
            scope: this,
            expand: function () {
                var task = {
                    scope: this,
                    run: this.comprobarFormEvaluacion,
                    interval: 100
                };

                Ext.TaskMgr.start(task);
                if (!this.view.cmbEntidad.getValue()) {
                    this.view.cmbEntidad.disable();
                    this.view.stTreeEntidad.load({
                        scope: this,
                        callback: function () {
                            this.view.cmbEntidad.enable()
                        }
                    });
                }
            }
        });

        this.view.stTreeEntidad.on({
            scope: this,
            load: this.onLoadEntidad
        });

        this.view.stEjercicio.on({
            scope: this,
            load: this.onLoadEjercicio
        });

        this.view.stPeriodo.on({
            scope: this,
            load: this.onLoadPeriodo
        });

        this.view.cmbEntidad.on({
            scope: this,
            select: this.onSelectEntidad,
            disable: function () {
                this.view.cmbEjercicio.disable();
            }
        });

        this.view.cmbEjercicio.on({
            scope: this,
            select: this.onSelectEjercicio,
            disable: function () {
                this.view.cmbPeriodo.disable();
                this.view.cmbEjercicio.reset();
            }
        });

        this.view.cmbPeriodo.on({
            scope: this,
            select: this.onSelectPeriodo,
            disable: function () {
                this.view.fecha.disable();
                this.view.cmbPeriodo.reset();
            }
        });

        this.view.fecha.on({
            scope: this,
            disable: function () {
                this.view.fecha.reset();
            }
        });

        this.view.smTreeEntidad.on({
            scope: this,
            selectionchange: function (sm, index, record) {
                var records = sm.getSelections(),
                    resultado = this.obtenerEntidadesSeleccionadas(records);
                this.view.cmbEntidad.ids = resultado.ids;
                this.view.cmbEntidad.setRawValue(resultado.names_toString);
                this.view.cmbEntidad.fireEvent('select', this.view.cmbEntidad, records);
                //this.view.cmbEntidad.collapse();
            }
        });

        Ext.Ajax.on({
            scope: this,
            beforerequest: function (conn, options) {
                var me = this;
                if (!this.setidestructurae) {
                    return;
                }
                /*if (this.keyMap) {//Comentariado porque se sahabilitaba el kayMap antes de comenzar cualquier peticion
                    this.keyMap.disable();
                }*/
                if (!options.params) {
                    options.params = {};
                }
                if (typeof options.params != 'object') {
                    options.params += "&idestructurae=" + this.idestructurae;
                } else {
                    options.params.idestructurae = this.idestructurae;
                }
            },
            /*requestcomplete: function () {//Comentariado porque se habilitaba el kayMap cuando terminaba cualquier peticion
                if (this.keyMap) {
                    this.keyMap.enable();
                }
            },
            requestexception: function () {
                if (this.keyMap) {
                    this.keyMap.enable();
                }
            }*/
        });

    };

    this.crearVentanaReporte = function (btn) {
        if (btn.accion == 'modificar') {
            var record = this.view.grid.getSelectionModel().getSelected();
        }

        this.ventanareporte = new Contabilidad.Reporte.VentanaReporte.View({
            etiquetas: this.etiquetas,
            accion: btn.accion,
            record: record
        });

        this.ventanareporte.on({
            scope: this,
            show: function () {
                this.keyMap.disable();
            },
            destroy: function () {
                this.view.grid.getStore().load();
                this.keyMap.enable();
            }
        });

        this.ventanareporte.show();
    };

    this.eliminarReporteFinanciero = function () {
        var me = this,
            sm = this.view.grid.getSelectionModel(),
            cantidad = sm.getCount(),
            mensaje = cantidad > 1 ? this.etiquetas.lbConfirmEliminarPluMas : this.etiquetas.lbConfirmEliminarSingMas,
            concepto = cantidad > 1 ? 'estados financieros' : 'estado financiero',
            mensaje = mensaje.replace(/<#>/g, concepto),
            records = sm.getSelections(),
            texto = cantidad > 1 ? this.etiquetas.msgEliminandoPlu : this.etiquetas.msgEliminandoSing,
            titulo = this.etiquetas.msgEspere,
            ids = [];
        if (this.keyMap) {
            this.keyMap.disable();
        }
        mostrarMensaje(2, mensaje, function (btn) {
            if (btn == 'ok') {
                Ext.each(records, function (record) {
                    ids.push(record.id);
                });

                me.mostrarMensajeEspera(titulo, texto);

                Ext.Ajax.request({
                    url: 'eliminarReporteFinanciero',
                    params: {
                        reportes: Ext.encode(ids)
                    },
                    callback: function (options, success, respuesta) {
                        me.tratarRespuesta(respuesta);
                        me.view.grid.getStore().load();
                    }
                })
            } else {
                if (me.keyMap) {
                    me.keyMap.enable();
                }
            }
        });
    };

    this.configurarReporteFinanciero = function () {
        var me = this,
            store = this.view.grid.getStore(),
            cantidad = store.getCount(),
            mensaje = 'Esta seguro que desea cargar los estados financieros por defecto?',
            texto = 'Cargando estados financieros',
            titulo = this.etiquetas.msgEspere;
        if (cantidad > 0) {
            mostrarMensaje(1, 'Los estados financieros se encuentran configurados en la entidad.');
            return;
        }
        if (this.keyMap) {
            this.keyMap.disable();
        }
        mostrarMensaje(2, mensaje, function (btn) {
            if (btn == 'ok') {

                me.mostrarMensajeEspera(titulo, texto);

                Ext.Ajax.request({
                    url: 'configurarReporteFinanciero',
                    callback: function (options, success, respuesta) {
                        var respuesta = Ext.decode(respuesta.responseText);
                        me.view.grid.getStore().load();
                        Ext.MessageBox.hide();
                    }
                })
            } else {
                if (me.keyMap) {
                    me.keyMap.enable();
                }
            }
        });
    };

    this.replicarReporteFinanciero = function () {
        var me = this,
            store = this.view.grid.getStore(),
            cantidad = store.getCount(),
            mensaje = 'Esta seguro que desea replicar los estados financieros?',
            texto = 'Replicando estados financieros',
            titulo = this.etiquetas.msgEspere,
            records = this.view.sm.getSelections();
        if (cantidad == 0) {
            mostrarMensaje(1, 'No hay estados financieros que replicar');
            return;
        }
        if (this.keyMap) {
            this.keyMap.disable();
        }
        var arrDatos = new Array();
        Ext.each(records, function (record) {
            arrDatos.push({
                'idreportefinanciero': record.data.idreportefinanciero,
                'codigo': record.data.codigo,
                'denominacion': record.data.denominacion,
                'text': record.data.codigo + ' ' + record.data.denominacion,
            });
        });
        me.mostrarMensajeEspera(titulo, 'Espere');
        requireJS.loadJsArray([
            {url: '/contabilidad/contabilidad_financiera/reportesfinancieros/views/js/gestionarreportefinanciero/replicarreportes/ClassReplicarReporte', id: 'ClassReplicarReporte'},
            {url: '/contabilidad/contabilidad_financiera/reportesfinancieros/views/js/gestionarreportefinanciero/replicarreportes/UIReplicarReporte', id: 'UIReplicarReporte'},
        ], function () {
            Ext.MessageBox.hide();
            var rp = new Ext.ClassReplicarReporte(arrDatos);
        });

        // mostrarMensaje(2, mensaje, function (btn) {
        //     if (btn == 'ok') {
        //
        //         me.mostrarMensajeEspera(titulo, texto);
        //
        //         Ext.Ajax.request({
        //             url: 'replicarReporteFinanciero',
        //             callback: function (options, success, respuesta) {
        //                 var respuesta = Ext.decode(respuesta.responseText);
        //                 // me.view.grid.getStore().load();
        //                 Ext.MessageBox.hide();
        //                 if (success && respuesta.codMsg == 1) {
        //                     mostrarMensaje(1, 'Los estados financieros han sido replicados satisfactoriamente.');
        //                 }
        //             }
        //         })
        //     } else {
        //         if (me.keyMap) {
        //             me.keyMap.enable();
        //         }
        //     }
        // });
    };

    this.tratarRespuesta = function (respuesta) {
        var cantidad = this.view.grid.getSelectionModel().getCount(),
            respuesta = Ext.decode(respuesta.responseText),
            mensaje = cantidad == 1 ? this.etiquetas.msgEliminadoSing : this.etiquetas.msgEliminadoPlu;

        if (respuesta.codigo == 1) {
            mostrarMensaje(1, mensaje);
        } else {
            mostrarMensaje(3, 'Ocurrió un error durante la operacion.');
        }

        Ext.MessageBox.hide();
    };

    this.comprobarFormEvaluacion = function () {
        if (this.view.formevaluacion.collapsed) {
            return false;
        }

        var cantidad = this.view.grid.getSelectionModel().getCount(),
            datoscompletos = this.datosCompletos(),
            valid = this.view.formevaluacion.getForm().isValid() && cantidad == 1 && datoscompletos;
        this.view.btnEvaluar.setDisabled(!valid);
        this.view.btnExportar.setDisabled(!valid);

    };

    this.evaluarReporteFinanciero = function (val = 0, sistema, formato) {
        var reporte = this.view.grid.getSelectionModel().getSelected(),
            estructuras = this.view.cmbEntidad.ids && Ext.isArray(this.view.cmbEntidad.ids)
            && this.view.cmbEntidad.ids.length != 0 ? this.view.cmbEntidad.ids : this.view.cmbEntidad.getValue() ? [this.view.cmbEntidad.getValue()] : null,
            parametros = {
                idestructurae: Ext.encode(estructuras),
                idejercicio: this.view.cmbEjercicio.getValue(),
                idperiodo: this.view.cmbPeriodo.getValue(),
                fechafin: this.view.fecha.getRawValue(),
                idreportefinanciero: reporte.data.idreportefinanciero,
                sistema: sistema,
                formato: formato,
            },
            titulo = this.etiquetas.msgEspere,
            mensaje = this.etiquetas.msgEvaluando;

        this.mostrarMensajeEspera(titulo, mensaje);
        this.setidestructurae = false;
        //Ext.MessageBox.hide();
        Ext.Ajax.request({
            url: val !== 1 ? 'evaluarReporteFinanciero' : 'exportarReporteFinanciero',
            params: parametros,
            scope: this,
            timeout: 3600000,
            callback: function (options, success, respuesta) {
                Ext.MessageBox.hide();
                var respuesta = Ext.decode(respuesta.responseText);
                if (val !== 1) {
                    if (!respuesta) {
                        mostrarMensaje(6, this.etiquetas.msgNoRepsuesta);
                        return;
                    }
                    if (respuesta.codigo == 1) {
                        this.mostrarVentanaVistaReporte(respuesta);
                    } else if (respuesta.codigo == 333) {
                        mostrarMensaje(6, this.etiquetas.msgBucle);
                    } else {
                        mostrarMensaje(6, this.etiquetas.msgError)
                    }
                    this.setidestructurae = true;
                } else {
                    if (respuesta.success) {
                        var save = document.createElement('a');
                        save.href = respuesta.url;
                        save.target = '_blank';
                        save.download = respuesta.fileName
                        var clickEvent = new MouseEvent('click', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });
                        save.dispatchEvent(clickEvent);

                    }
                }
            }
        })
    };

    this.exportarReporteFinanciero = function () {
        var parametros = {
            sistemas: {sglite: ['txt', 'xml']}
        };
        var ventanaOpciones = new Ext.SCFPChoseOpt(parametros);
        ventanaOpciones.show();

        ventanaOpciones.on({
            scope: this,
            envioDatos: function (sistema, formato) {
                this.evaluarReporteFinanciero(1, sistema, formato);
            }
        });

    };

    this.mostrarVentanaVistaReporte = function (datos) {
        var configuracion = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            },
            datos = [{
                "datoGeneral": datos.datosGenerales,
                "datoCuerpo": datos.datosCuerpo,
                "datoPie": datos.datoPie,
                "reporte": "40004"
            }];

        var ventanaReporte = new SCFPrintView(datos, "/contabilidad/comun/SCFPrintView/", configuracion);
        ventanaReporte.show();
    };

    this.crearKeyMap = function () {
        var me = this,
            acciones = this.view.tbarAcciones.items.items;
        acciones = acciones.concat(this.view.tbarFiltros.items.items);

        if (!this.keyMap) {
            this.keyMap = new Ext.KeyMap(Ext.getBody(), []);
        }

        for (var k = 0; k < acciones.length; k++) {
            var cmp = acciones[k];
            if (cmp.keyMap) {
                var keyMap = cmp.keyMap;
                if (!Ext.isArray(keyMap)) {
                    keyMap = [cmp.keyMap]
                }
                for (var i in keyMap) {
                    var binding = keyMap[i];
                    binding.scope = me;
                    binding.fn = function (cmp) {
                        if (!cmp.disabled && !cmp.hidden) {
                            if (this.event) {
                                cmp.fireEvent(this.event, cmp);
                            } else if (this.fn) {
                                cmp[this.function].call(cmp);
                            }
                        }
                    }.bind(binding, cmp);
                    this.keyMap.addBinding(binding);
                }
            }
        }
    };

    this.deshabilitarbotones = function () {
        this.view.btnAdicionar.disable();
        this.view.btnModificar.disable();
        this.view.btnEliminar.disable();
        this.view.btnReplicar.disable();
    };

    this.onSelectReporte = function (sm) {
        var cantidad = sm.getCount(),
            entidadactual = this.idestructuraeactual == this.idestructurae;

        if (!entidadactual) {
            return;
        }

        if (cantidad == 1) {
            this.view.btnModificar.enable();
            this.view.btnEliminar.enable();
            if (!this.view.btnReplicar.hidden) {
                this.view.btnReplicar.enable();
            }
        } else if (cantidad > 1) {
            this.view.btnModificar.disable();
            this.view.btnEliminar.enable();
            if (!this.view.btnReplicar.hidden) {
                this.view.btnReplicar.enable();
            }
        } else {
            this.view.btnModificar.disable();
            this.view.btnEliminar.disable();
            this.view.btnReplicar.disable();
        }
    };

    this.onLoadEntidad = function (store, records, options) {
        var values = {
            idestructurae: store.reader.jsonData.idestructuraeactual,
            descripcion: store.reader.jsonData.nombreestructuraeactual
        };
        this.idestructuraeactual = values.idestructurae;
        if (!this.view.cmbEntidad.getValue()) {
            this.view.cmbEntidad.setValue(values.idestructurae);
            this.view.cmbEntidad.setRawValue(values.descripcion);
            this.view.cmbEntidad.ids = [values.idestructurae];
            var record = this.crearRecord(this.view.cmbEntidad.store, values);
            this.view.cmbEntidad.fireEvent('select', this.view.cmbEntidad, [record]);
        }
    };

    this.onLoadEjercicio = function (store, records, options) {
        var idejercicio = store.reader.jsonData.idejercicioactual,
            record = this.view.stEjercicio.getById(idejercicio);
        if (record) {
            this.view.cmbEjercicio.setValue(record.data.idejercicio);
            this.view.cmbEjercicio.setRawValue(record.data.nombre);
            this.view.cmbEjercicio.fireEvent('select', this.view.cmbEjercicio, record);
            this.view.cmbEjercicio.enable();

        } else {
            mostrarMensaje(8, this.etiquetas.msgNoEjercicio);
        }
    };

    this.onLoadPeriodo = function (store, records, options) {
        var idactual = store.reader.jsonData.idperiodoactual,
            idprimero = store.reader.jsonData.idprimerperiodo,
            recordActual = this.view.stPeriodo.getById(idactual),
            recordPrimero = this.view.stPeriodo.getById(idprimero),
            record = recordActual ? recordActual : recordPrimero;
        if (record) {
            this.view.cmbPeriodo.setValue(record.data.idperiodo);
            this.view.cmbPeriodo.setRawValue(record.data.nombre);
            this.view.cmbPeriodo.enable();
            this.view.cmbPeriodo.fireEvent('select', this.view.cmbPeriodo, record);

        }
    };

    this.onSelectEntidad = function (cmb, records) {
        var idestructuras = new Array();
        Ext.each(records, function (record) {
            idestructuras.push(record.data.id || record.data.idestructurae)
        });
        if (!Ext.isArray(records) || (Ext.isArray(records) && records.length != 1)) {
            return;
        }
        var record = records[0];
        this.idestructurae = record.data.id || record.data.idestructurae;
        if (this.idestructuraeactual != this.idestructurae) {
            this.deshabilitarbotones();
        } else {
            this.view.btnAdicionar.enable();
        }
        this.view.cmbEjercicio.disable();
        //this.view.store.load();
        this.view.stEjercicio.load();
    };

    this.onSelectEjercicio = function (cmb, record) {
        this.view.stPeriodo.baseParams.idejercicio = record.data.idejercicio;
        this.view.stPeriodo.baseParams.idestructurae = this.view.stEjercicio.baseParams.idestructurae;
        this.view.cmbPeriodo.disable();
        this.view.fecha.disable();
        this.view.stPeriodo.load();
    };

    this.onSelectPeriodo = function (cmb, record) {
        this.view.fecha.setMinValue(record.data.inicio);
        this.view.fecha.setMaxValue(record.data.fin);
        this.view.fecha.setValue(record.data.fin);
        this.view.fecha.enable();
    };

    this.crearRecord = function (store, values) {
        var arrTemp = [];
        var objTemp = {};
        Ext.each(store.fields.keys, function (key) {
            arrTemp.push({name: key});
            objTemp[key] = values[key];
        });
        var RecordDinamico = Ext.data.Record.create(arrTemp);
        return new RecordDinamico(objTemp);
    };

    this.obtenerEntidadesSeleccionadas = function (records) {
        var obj = {};
        obj.ids = new Array();
        obj.names = new Array();
        Ext.each(records, function (record) {
            obj.ids.push(record.data.id);
            obj.names.push(record.data.text);
        });
        obj.ids_toString = obj.ids.join(',');
        obj.names_toString = obj.names.join(',');
        return obj;
    }

    this.datosCompletos = function () {
        var cont = 0,
            me = this.view;
        if (me.cmbEntidad.ids && me.cmbEntidad.ids.length != 0) {
            cont++;
        }
        if (me.cmbEjercicio.getValue()) {
            cont++;
        }
        if (me.cmbPeriodo.getValue()) {
            cont++;
        }
        if (me.fecha.getValue()) {
            cont++;
        }
        return cont == 4;
    }
};
