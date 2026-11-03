Ext.ns('LOG.produccion.valeproduccion.ventanaGestionDocumentos');
LOG.produccion.valeproduccion.ventanaGestionDocumentos = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    constructor: function (config) {
        LOG.produccion.valeproduccion.ventanaGestionDocumentos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumnProductos({ 
            header: _this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumnProductos({
            header: _this.idioma.cgDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumnProductos({
            header: 'Duración',
            width: 150,
            align: 'right',
            dataIndex: 'norma',
            default: true
        });

        this.addGridColumnProductos({
            header: 'Fecha inicio',
            width: 80,
            dataIndex: 'fechainicio',
            align: 'right',
            default: true
        });
        this.addGridColumnProductos({
            header: 'Fecha fin',
            width: 80,
            dataIndex: 'fechafin',
            align: 'right',
            default: true
        });
        this.addGridColumnProductos({
            dataIndex: 'idproducto'
        });
        this.addGridColumnProductos({
            dataIndex: 'idmovimiento'
        });
        this.addGridColumnProductos({
            dataIndex: 'idactividad'
        });
        this.addGridColumnProductos({
            dataIndex: 'idunidadmedida'
        });
        this.addGridColumnProductos({
            dataIndex: 'idindicador'
        });
    },
    /**
     *
     * @returns {undefined}
     */
    // initDefaultButtons: Ext.emptyFn,
    builComponent: function () {
        this.idioma = this.idioma || LOG.lb.documento.Idioma;
        var _this = this;
        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'north',
            titleCollapse: (!_this.scope.colapsed) ? false : true,
            collapsible: true,//(!_this.scope.colapsed)? false : true,
            collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            title: this.idioma.tlPanelGeneral,
            autoHeight: true,
            frame: true
        });
        this.smGridDetalles = LOG.util.UIManager.initSelectionModel(3);
        var cls = LOG.util.UIManager.proccessColumns(this.listaGridColumnsProductos);
        this.cmGridDetalles = new Ext.grid.ColumnModel(cls.columns);
        this.recStGridDetalles = Ext.data.Record.create(cls.fields);
        this.stGridDetalles = new Ext.data.Store({
            url: 'cargarProductosDocumento',
            reader: new Ext.data.JsonReader({
                id: 'idmovimiento',
                totalProperty: 'cantidad',
                root: 'datos'
            }, this.recStGridDetalles)
        });

        this.stGridDetalles.on({
            'beforeload': function () {
                _this.beforeLoadProductos();
            }
        });
        this.stGridDetalles.fireEvent = this.stGridDetalles.fireEvent.createSequence(function (e) {
            if (e == 'load') {
                _this.smGridDetalles.clearSelections();

                _this.confubicacion = _this.stGridDetalles.reader.jsonData.confubicacion;

                _this.smGridDetalles.fireEvent('rowdeselect');
                if (_this.stGridDetalles.getTotalCount() > 0) {
                    _this.smGridDetalles.selectFirstRow();
                }
            }
        });
        this.gridDetalles = LOG.util.UIManager.initEditableGridPanel(this.cmGridDetalles, this.stGridDetalles, this.smGridDetalles, {
            expanded: cls.expanded,
            nobbar: false
        });
        this.gridDetalles.on('afteredit', this.editarProducto, this);
        this.gridDetalles.on('beforeedit', this.beforeEditProducto, this);

        LOG.util.UIManager.initFilterGrid(this.gridDetalles, this.idioma.ttCriterioMov, this.idioma.ttConcepto);

        this.panelProductos = LOG.util.UIManager.initPanel({
            tbar: LOG.util.UIManager.initToolbar({
                items: this.listaBotonesProductos.getArray()
            }),
            layout: 'border',
            region: 'center',
            items: [this.gridDetalles]
        });
        this.btnSalvar = LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.ttBtnGuardar,
            handler: this.salvarHandler,
            scope: this,
            controlFn: function () {
                _this.controlFnGuardar(_this.btnSalvar);
            }
        });
        this.btnNuevo = LOG.util.Prototipos.botonNuevo({
            tooltip: this.idioma.ttBtnNuevo,
            handler: this.onResetHandler,
            scope: this,
            controlFn: function () {
                _this.controlFnGuardar(_this.btnNuevo, true);
            }
        });
        this.btnCerrar = LOG.util.Prototipos.botonCancelar({
            handler: this.onCancelarHandler,
            text: this.idioma.lbBtnCerrar,
            scope: this
        }, true);

        this.modelo.addActionButton(this.btnSalvar);

        this.comboDeposito;id
        this.productosobtenidosView = new LOG.produccion.valeproduccion.template.View({
            title: 'Productos obtenidos',
            url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarProductosObtenidos',
            idProperty: 'idvaleproducto',
            sm: this.mtSm = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false,
                listeners: {
                    'selectionchange': function (sm) {        
                       _this.productosobtenidosView.btnEliminar.setDisabled((sm.getCount() == 0 || _this.scope.smGridPrincipal.getSelected().data.estado > 1 || _this.scope.smGridPrincipal.getSelected().data.nrodocgenerado != "" || _this.scope.ordenProduccion.record &&_this.scope.ordenProduccion.record.data.estado == 9) ? true : false);
                    }
                }
            }),
            toolbar: true,
            columns: [this.mtSm,
                {header: _this.idioma.cgCodigo, width: 100, dataIndex: 'codigo'},
                {header: _this.idioma.cgDenominacion, width: 220, dataIndex: 'denominacion'},
                {header: _this.idioma.cgUM, width: 60, dataIndex: 'um'},
                LOG.util.Prototipos.columnaCantidad({
                    header: 'Cantidad', flex: 1, dataIndex: 'cantidad',
                    align: 'right',
                    renderer: function (v, md, rc) {
                        return v;
                    },
                   /* editor: new Ext.form.NumberField({
                        allowBlank: false,
                        allowNegative: false,
                        decimalPrecision: 6
                    })*/
                }),
                {header: 'Almacén destino', width: 280, dataIndex: 'deposito',
                //mandar a cargar los depositos destinos....
                    editor: this.comboDeposito = new LOG.util.ComboBox({
                        url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/depositosconfigurados',
                        hiddenName: 'idalmacen',
                        autoLoad: true,
                        valueField: 'idalmacen',
                        displayField: 'denominacion',
                        baseParams: {
                            tipoalmacen: 2,
                            start: 0,
                            limit: 100
                        }/*,
                        listeners: {
                            'select': function (combo, record, index) {
                                console.info(record.json);
                                console.info(record);
                                _this.productosobtenidosView.getSelectionModel().getSelected().set('deposito', record.json.text);
                                _this.productosobtenidosView.getSelectionModel().getSelected().set('iddeposito', record.json.idalmacen);
                            }
                        }*/
                    })},
            ],
            fields: [
                {name: 'idvaleproduccion'},
                {name: 'idvaleproducto'},
                {name: 'idindicador'},
                {name: 'codigo'},
                {name: 'denominacion'},
                {name: 'um'},
                {name: 'idumedida'},
                {name: 'cantidad'},
                {name: 'iddeposito'},
                {name: 'deposito'},
                {name: 'noeliminar'}
            ],
            editorGridPanel_onAfterEdit: function (e, o) {
                if (e.field == 'deposito') {
                    e.record.data.iddeposito = e.value;
                    e.record.data.deposito = _this.comboDeposito.getRawValue();
                }
                e.grid.view.refresh();
                _this.btnSalvar.setDisabled(false);
            },
            onAdicionar: function (btn,_caller) {
                var _this = this;
               btn.disabled();
                if (_caller.grantedAction('RAdicionar')){
                    btn.setVisible(true);
                    btn.disabled();
                    } 
                   /* else {
                        if(){
                            btn.setVisible(true);  
                        }
                    }*/
                    
                LOG.inv.maestroproductos.Loader.init(function () {
                    var v = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 1,
                        usarAplicar: true,
                        parametros: {

                            idseleccionados: Ext.encode(_this.store.collect('idindicador'))
                        },
                        doAction: function (r) {
                            var record = [];
                            var listaProd = new LOG.util.List();
                            var _idproductos = [];
                            Ext.each(r, function (obj) {
                                var objSi = obj;
                                objSi.data.idindicador = obj.id;
                                record.push(objSi);
                                listaProd.add(objSi.data);
                                _idproductos.push(obj.json.idindicador)
                            });
                            _this.addProductos(listaProd.arrayData,_this);
                            if (v.isVisible()) {
                                v.panelProductos.getStorePrincipal().reload(
                                    v.parametros.idseleccionados = Ext.encode(Ext.decode(v.panelProductos.getStorePrincipal().baseParams.idseleccionados).concat(_idproductos))
                                );
                            }
                        }
                    });
                    v.show();
                });
            },
            addProductos:function (prodcutos,parent){
                //var _that = this;
                Ext.MessageBox.wait('Adicionando producto...', 'Por favor espere...' || '...');
                Ext.Ajax.request({
                    url: '/logistica/produccion/produccion/index.php/valeproduccion/adicionarProductosExtras',
                    method: 'POST',
                    params: {
                        idvaleproduccion:_this.modelo.iddocumento,
                        productos: Ext.encode(prodcutos)
                    },
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            parent.getStore().load();
                            mostrarMensaje(1, 'El(Los) producto(s) ha(n) sido adicionado(s) satisfactoriamente.');
                        } else {
                            if (resp.codigoMsg == 'unique_violation') {
                                mostrarMensaje(3, 'Error:Los datos a guardar ya existen.');
                            } else if (resp.codigoMsg == 'not_null_violation') {
                                mostrarMensaje(3, 'Error:Hay datos con valores incorrectos o vacios.');
                            } else if (resp.codigoMsg == 'foreign_key_violation') {
                                mostrarMensaje(3, 'Error:Hay datos inconsistentes.');
                            } else {
                                mostrarMensaje(1, 'Error al eliminar el elemento seleccionado');
                            }
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    }.createDelegate(this)
                });
            },
            onEliminar: function (btn,_caller) {
                var that = this;
                btn.disabled();
                if (_caller.grantedAction('eliminar')){
                    btn.setVisible(true);
                    btn.disabled();
                    } 
               
                mostrarMensaje(2, '¿Está seguro que desea eliminar el producto seleccionado?', function (btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                        Ext.Ajax.request({
                            url: '/logistica/produccion/produccion/index.php/valeproduccion/eliminarProductosObtenidos',
                            method: 'POST',
                            params: {
                                id: Ext.encode(_this.productosobtenidosView.getSelections())
                            },
                            callback: function (o, s, r) {
                                Ext.MessageBox.hide();
                                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                if (resp.success) {
                                    _this.productosobtenidosView.getStore().load();
                                    if (s) {
                                        mostrarMensaje(1, 'El(Los) producto(s) ha(n) sido eliminado(s) satisfactoriamente.');
                                    }
                                } else {
                                    if (resp.codigoMsg == 'unique_violation') {
                                        mostrarMensaje(3, 'Error:Los datos a guardar ya existen.');
                                    } else if (resp.codigoMsg == 'not_null_violation') {
                                        mostrarMensaje(3, 'Error:Hay datos con valores incorrectos o vacios.');
                                    } else if (resp.codigoMsg == 'foreign_key_violation') {
                                        mostrarMensaje(3, 'Error:Hay datos inconsistentes.');
                                    } else {
                                        mostrarMensaje(1, 'Error al eliminar el elemento seleccionado');
                                    }
                                }
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [resp]).call();
                                }
                            }.createDelegate(this)
                        });
                    }
                }.createDelegate(this));
            }
        });


        this.productosobtenidosView.getBtnAdicionar().setDisabled(!(_this.modelo.iddocumento) || (_this.scope.smGridPrincipal.getSelected() && _this.scope.smGridPrincipal.getSelected().data.estado > 1) || _this.record.data.estado > 1);
        this.productosobtenidosView.getBtnAdicionar().setVisible()
        this.productosobtenidosView.on('beforeedit', this.habilitarDeshabilitarComponents, this);


        this.materialesView = new LOG.produccion.valeproduccion.template.View({
            title: 'Materias primas y materiales',
            url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarMateriales',
            idProperty: 'idmaterialesvaleproduccion',
            sm: this.mtSm = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false,
                listeners: {
                    'selectionchange': function (sm) {
                        _this.materialesView.btnEliminar.setDisabled((sm.getCount() == 0 || (_this.scope.smGridPrincipal.getSelected() && _this.scope.smGridPrincipal.getSelected().data.estado > 1) || _this.scope.ordenProduccion.record &&_this.scope.ordenProduccion.record.data.estado == 9) ? true : false);
                    }
                }
            }),
            toolbar: true,
            columns: [this.mtSm,
                {header: _this.idioma.cgCodigo, width: 200, dataIndex: 'codigo'},
                {header: _this.idioma.cgDenominacion, width: 200, dataIndex: 'denominacion'},
                {header: _this.idioma.cgUM, width: 100, dataIndex: 'um'},
             /*   LOG.util.Prototipos.columnaCantidad({
                    header: 'Norma', flex: 1, dataIndex: 'norma',
                    renderer: function (v, md, rc) {
                        return ((v * _this.scope.ieCantidad.getValue())/parseFloat(rc.data.cantidadun)); //parseFloat(v) * _this.scope.ieCantidad.getValue();
                    }
                }),*/
                LOG.util.Prototipos.columnaCantidad({
                    header: 'Cantidad',
                    flex: 1,
                    dataIndex: 'cantidad',
                    align: 'right',
                    width: 150,
                    default: true,
                    renderer: function (v, md, rc) {
                        if (v) {
                            return v;
                        } else {
                            v = (parseFloat(rc.data.norma) * _this.scope.ieCantidad.getValue()) / parseFloat(rc.data.cantidadun);
                            rc.set('cantidad', v);
                            _this.btnSalvar.enable();
                            return v;
                        }
                    },
                   /* editor: new Ext.form.NumberField({
                        allowBlank: false,
                        allowNegative: false
                    })*/
                })
            ],
            fields: [
                {name: 'idmaterialesvaleproduccion'},
                {name: 'idvaleproduccion'},
                {name: 'idindicador'},
                {name: 'idproducto'},
                {name: 'codigo'},
                {name: 'denominacion'},
                {name: 'um'},
                {name: 'norma'},
                {name: 'cantidadun'},
                {name: 'cantidad'}
            ],
            editorGridPanel_onAfterEdit: function () {
                _this.btnSalvar.setDisabled(false);
            },
            // onAdicionar: function (btn) {
            //     var win = this;
            //     new LOG.util.Window({
            //         title: 'Materias primas y materiales',
            //         width: 800,
            //         height: 500,
            //         items: [this.mmAll = new LOG.produccion.valeproduccion.template.View({
            //             border: false,
            //             flex: 1,
            //             header: false,
            //             region: 'center',
            //             borderBody: false,
            //             url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarMaterialesAll',
            //             idProperty: 'idproducto',
            //             toolbar: false,
            //             sm: this.sm = new Ext.grid.CheckboxSelectionModel({
            //                 singleSelect: false,
            //                 listeners: {
            //                     'selectionchange': function (sm) {
            //                         //    _this.btnAplicar.setDisabled(!sm.getCount() == 1);
            //                         //  _this.btnEliminar.setDisabled(sm.getCount() == 0);
            //                         //_this.actividadView.setDisabled(sm.getCount() == 0);
            //                     }
            //                 }
            //             }),
            //             columns: [this.sm,
            //                 {header: _this.idioma.cgCodigo, width: 200, dataIndex: 'codigo'},
            //                 {header: _this.idioma.cgDenominacion, width: 200, dataIndex: 'denominacion'},
            //                 {header: _this.idioma.cgUM, width: 100, dataIndex: 'um'},
            //                 LOG.util.Prototipos.columnaCantidad({
            //                     header: 'Norma', flex: 1, dataIndex: 'norma',
            //                     renderer: function (v, md, rc) {
            //                         return parseFloat(v) * _this.scope.ieCantidad.getValue();
            //                     }
            //                 }),
            //                 LOG.util.Prototipos.columnaCantidad({
            //                     header: 'Cantidad',
            //                     dataIndex: 'cantidad',
            //                     align: 'right',
            //                     width: 150,
            //                     default: true,
            //                     renderer: function (v, md, rc) {
            //                         if (v) {
            //                             return v;
            //                         } else {
            //                             v = (parseFloat(rc.data.norma) * _this.scope.ieCantidad.getValue()) / parseFloat(rc.data.cantidadun);
            //                             /*
            //                                                                     rc.set('cantidad', v);
            //                                                                     _this.btnSalvar.enable();*/
            //                             rc.data.cantidad = v;
            //                             return v;
            //                         }
            //                     },
            //                     /*editor: new Ext.form.NumberField({
            //                         allowBlank: false,
            //                         allowNegative: false
            //                     })*/
            //                 })
            //             ],
            //             fields: [
            //                 {name: 'idindicador'},
            //                 {name: 'idproducto'},
            //                 {name: 'codigo'},
            //                 {name: 'denominacion'},
            //                 {name: 'um'},
            //                 {name: 'norma'},
            //                 {name: 'cantidadun'},
            //                 {name: 'cantidad'}
            //             ]
            //         })],
            //         aceptarFn: function (apply) {
            //             var selections = win.mmAll.getSelectionModel().getSelections();
            //             _this.materialesView.getStore().add(selections);
            //             return apply;
            //         }
            //     }).show();
            //     this.mmAll.getStore().on({
            //         'beforeload': function (st, opts) {
            //             st.baseParams = {
            //                 idindicador: Ext.encode(_this.materialesView.getStore().collect('idindicador')),
            //                 idproducto: Ext.encode(_this.materialesView.getStore().collect('idproducto')),
            //                 idcartatecindustrial: (_this.scope.baseParams.idcartatecindustrial) ? _this.scope.baseParams.idcartatecindustrial : 0
            //             };
            //         }/*,
            //         'load': function (st, records) {
            //             console.log([st.getCount(), records]);
            //         }*/
            //     });
            //     this.mmAll.getStore().reload();
            // },
            // onEliminar: function (btn) {
            //     var that = this;
            //     mostrarMensaje(2, '¿Está seguro que desea eliminar el material seleccionado?', function (btn) {
            //         if (btn == 'ok') {
            //             Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
            //             Ext.Ajax.request({
            //                 url: '/logistica/produccion/produccion/index.php/valeproduccion/eliminarMateriales',
            //                 method: 'POST',
            //                 params: {
            //                     id: Ext.encode(_this.materialesView.getSelections())
            //                 },
            //                 callback: function (o, s, r) {
            //                     Ext.MessageBox.hide();
            //                     var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            //                     if (resp.success) {
            //                         _this.materialesView.getStore().load();
            //                         if (s) {
            //                             mostrarMensaje(1, 'El(Los) material(es) ha(n) sido eliminado(s) satisfactoriamente.');
            //                         }
            //                     } else {
            //                         if (resp.codigoMsg == 'unique_violation') {
            //                             mostrarMensaje(3, 'Error:Los datos a guardar ya existen.');
            //                         } else if (resp.codigoMsg == 'not_null_violation') {
            //                             mostrarMensaje(3, 'Error:Hay datos con valores incorrectos o vacios.');
            //                         } else if (resp.codigoMsg == 'foreign_key_violation') {
            //                             mostrarMensaje(3, 'Error:Hay datos inconsistentes.');
            //                         } else {
            //                             mostrarMensaje(1, 'Error al eliminar el elemento seleccionado');
            //                         }
            //                     }
            //                     if (typeof _fn == 'function') {
            //                         _fn.createDelegate(this, [resp]).call();
            //                     }
            //                 }.createDelegate(this)
            //             });
            //         }
            //     }.createDelegate(this));
            // }
        });

        this.materialesView.on('beforeedit', this.habilitarDeshabilitarComponents, this);

        this.maquinariaView = new LOG.produccion.valeproduccion.template.View({
            title: 'Equipos mecanizados',
            url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarMaquinaria',
            idProperty: 'idvaleequipos',
            sm: this.mqSm = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false,
                listeners: {
                    'selectionchange': function (sm) {
                        _this.maquinariaView.btnEliminar.setDisabled((sm.getCount() == 0 || _this.scope.smGridPrincipal.getSelected().data.estado > 1 || _this.scope.ordenProduccion.record &&_this.scope.ordenProduccion.record.data.estado == 9) ? true : false);
                    }
                }
            }),
            toolbar: true,
            columns: [this.mqSm,
                {
                    header: "Denominación",
                    fixed: true,
                    dataIndex: 'denominacion'
                },
                {
                    header: "No. Inventario",
                    fixed: true,
                    dataIndex: 'nroinventario',
                    editor: this.cmbMaq = new LOG.util.ComboBox({
                        name: 'nroinventario',
                        hiddenName: 'nroinventario',
                        displayField: 'nroinventario',
                        valueField: 'nroinventario',
                        autoSelect: true,
                        autoLoad: false,
                        url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarMaquinariaByIndicador',
                        listeners: {
                            'select': function (combo, record, index) {
                                _this.maquinariaView.getSelectionModel().getSelected().set('idregnumerico', record.json.idregnumerico);
                                _this.btnSalvar.enable();
                            }
                        },
                        tbar: [{
                            iconCls: 'x-tbar-loading',
                            handler: function () {
                                var win = this;
                                new LOG.util.Window({
                                    title: 'Equipos',
                                    width: 600,
                                    height: 500,
                                    items: [this.eqAll = new LOG.produccion.valeproduccion.template.View({
                                        border: false,
                                        flex: 1,
                                        header: false,
                                        region: 'center',
                                        borderBody: false,
                                        url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getactivosfijosservice',
                                        idProperty: 'idregnumerico',
                                        sm: new Ext.grid.RowSelectionModel({}),
                                        columns: [
                                            {header: "Código", flex: 1, dataIndex: 'codigo'},
                                            {header: "Denominación", flex: 1, dataIndex: 'denominacion'},
                                            {header: "No. inventario", flex: 1, dataIndex: 'nroinventario'},
                                            {header: "Área de responsabilidad", flex: 1, dataIndex: 'arearesp'},
                                            {header: "Centro costo", flex: 1, dataIndex: 'centrocosto'},
                                            {header: "Responsable", flex: 1, dataIndex: 'responsable'}
                                        ],
                                        fields: [
                                            {name: 'idregnumerico'},
                                            {name: 'idindicador'},
                                            {name: 'codigo'},
                                            {name: 'denominacion'},
                                            {name: 'nroinventario'},
                                            {name: 'arearesp'},
                                            {name: 'centrocosto'},
                                            {name: 'responsable'}
                                        ]
                                    })],
                                    aceptarFn: function (apply) {
                                        var selected = win.eqAll.getSelectionModel().getSelected();
                                        _this.maquinariaView.getSelectionModel().getSelected().set('idregnumerico', selected.id);
                                        return apply;
                                    }
                                }).show();
                                this.eqAll.getStore().on({
                                    'beforeload': function (st, opts) {
                                        st.baseParams.idregistrosExcluir = Ext.encode(_this.maquinariaView.getStore().collect('idregnumerico'));
                                        st.baseParams.idnaturaleza = _this.maquinariaView.getSelectionModel().getSelected().get('idnaturaleza');
                                        st.baseParams.idgruposubgrupo = _this.maquinariaView.getSelectionModel().getSelected().get('idgruposubgrupo');
                                    }
                                });
                                this.eqAll.getStore().reload();
                            }
                        }],
                        initList: function () {
                            if (!this.list) {
                                var cls = 'x-combo-list',
                                    listParent = Ext.getDom(this.getListParent() || Ext.getBody());

                                this.list = new Ext.Layer({
                                    parentEl: listParent,
                                    shadow: this.shadow,
                                    cls: [cls, this.listClass].join(' '),
                                    constrain: false,
                                    zindex: this.getZIndex(listParent)
                                });

                                var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
                                this.list.setSize(lw, 0);
                                this.list.swallowEvent('mousewheel');
                                this.assetHeight = 0;
                                if (this.syncFont !== false) {
                                    this.list.setStyle('font-size', this.el.getStyle('font-size'));
                                }
                                if (this.title) {
                                    this.header = this.list.createChild({cls: cls + '-hd', html: this.title});
                                    this.assetHeight += this.header.getHeight();
                                }
                                if (this.tbar) {
                                    this.toolbar = this.list.createChild({cls: cls + '-ft'});
                                    this.buttonTb = new Ext.Toolbar({
                                        items: this.tbar,
                                        renderTo: this.toolbar
                                    });
                                    this.assetHeight += this.toolbar.getHeight();
                                }

                                this.innerList = this.list.createChild({cls: cls + '-inner'});
                                this.mon(this.innerList, 'mouseover', this.onViewOver, this);
                                this.mon(this.innerList, 'mousemove', this.onViewMove, this);
                                this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

                                if (this.pageSize) {
                                    this.footer = this.list.createChild({cls: cls + '-ft'});
                                    this.pageTb = new Ext.PagingToolbar({
                                        store: this.store,
                                        pageSize: this.pageSize,
                                        renderTo: this.footer
                                    });
                                    this.assetHeight += this.footer.getHeight();
                                }

                                if (!this.tpl) {
                                    this.tpl = '<tpl for="."><div class="' + cls + '-item">{' + this.displayField + '}</div></tpl>';
                                }

                                this.view = new Ext.DataView({
                                    applyTo: this.innerList,
                                    tpl: this.tpl,
                                    singleSelect: true,
                                    selectedClass: this.selectedClass,
                                    itemSelector: this.itemSelector || '.' + cls + '-item',
                                    emptyText: this.listEmptyText,
                                    deferEmptyText: false
                                });

                                this.mon(this.view, {
                                    containerclick: this.onViewClick,
                                    click: this.onViewClick,
                                    scope: this
                                });

                                this.bindStore(this.store, true);

                                if (this.resizable) {
                                    this.resizer = new Ext.Resizable(this.list, {
                                        pinned: true, handles: 'se'
                                    });
                                    this.mon(this.resizer, 'resize', function (r, w, h) {
                                        this.maxHeight = h - this.handleHeight - this.list.getFrameWidth('tb') - this.assetHeight;
                                        this.listWidth = w;
                                        this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                                        this.restrictHeight();
                                    }, this);

                                    this[this.pageSize ? 'footer' : 'innerList'].setStyle('margin-bottom', this.handleHeight + 'px');
                                }
                            }
                        }
                    })
                },
                LOG.util.Prototipos.columnaCantidad({
                    header: "Unidades producidas",
                    fixed: true,
                    dataIndex: 'unidadesproducidas',
                    editor: new Ext.form.NumberField({})
                }),
                LOG.util.Prototipos.columnaCantidad({
                    header: "Horas trabajando",
                    fixed: true,
                    dataIndex: 'horastrabajo',
                    editor: new Ext.form.NumberField({})
                })
            ],
            fields: [
                {name: 'idvaleproduccion'},
                {name: 'idregnumerico'},
                {name: 'idindicador'},
                {name: 'idnaturaleza'},
                {name: 'idgruposubgrupo'},
                {name: 'idvaleequipos'},
                {name: 'idconfequipos'},
                {name: 'denominacion'},
                {name: 'nroinventario'},
                {name: 'unidadesproducidas'},
                {name: 'horastrabajo'}
            ],
            listeners: {
                'cellclick': function (grid, rowIndex, columnIndex, e) {
                    if (columnIndex == 2) {
                        _this.cmbMaq.getStore().removeAll();
                        _this.maquinariaView.getSelectionModel().selectRow(rowIndex);
                    }
                }
            },
            editorGridPanel_onAfterEdit: function () {
                _this.btnSalvar.setDisabled(false);
            },
            onAdicionar: function (btn) {
                var win = this;
                new LOG.util.Window({
                    title: 'Equipos mecanizados',
                    width: 800,
                    height: 500,
                    items: [this.eqAll = new LOG.produccion.valeproduccion.template.View({
                        border: false,
                        flex: 1,
                        header: false,
                        region: 'center',
                        borderBody: false,
                        url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarMaquinariaAll',
                        idProperty: 'idregnumerico',
                        toolbar: false,
                        sm: this.sm = new Ext.grid.CheckboxSelectionModel({
                            singleSelect: false,
                            listeners: {
                                'selectionchange': function (sm) {
                                    //    _this.btnAplicar.setDisabled(!sm.getCount() == 1);
                                    //  _this.btnEliminar.setDisabled(sm.getCount() == 0);
                                    //_this.actividadView.setDisabled(sm.getCount() == 0);
                                }
                            }
                        }),
                        columns: [
                            {
                                header: "Denominación",
                                fixed: true,
                                dataIndex: 'denominacion'
                            },
                            {
                                header: "No. Inventario",
                                fixed: true,
                                dataIndex: 'nroinventario',
                                editor: this.cmbMaq = new LOG.util.ComboBox({
                                    name: 'nroinventario',
                                    hiddenName: 'nroinventario',
                                    displayField: 'nroinventario',
                                    valueField: 'nroinventario',
                                    autoSelect: true,
                                    autoLoad: false,
                                    url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarMaquinariaByIndicador',
                                    listeners: {
                                        'select': function (combo, record, index) {
                                            _this.maquinariaView.getSelectionModel().getSelected().set('idregnumerico', record.json.idregnumerico);
                                            _this.btnSalvar.enable();
                                        }
                                    },
                                    tbar: [{
                                        iconCls: 'x-tbar-loading',
                                        handler: function () {
                                            var win = this;
                                            new LOG.util.Window({
                                                title: 'Equipos',
                                                width: 600,
                                                height: 500,
                                                items: [this.eqAll = new LOG.produccion.valeproduccion.template.View({
                                                    border: false,
                                                    flex: 1,
                                                    header: false,
                                                    region: 'center',
                                                    borderBody: false,
                                                    url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getactivosfijosservice',
                                                    idProperty: 'idregnumerico',
                                                    sm: new Ext.grid.RowSelectionModel({}),
                                                    columns: [
                                                        {header: "Código", flex: 1, dataIndex: 'codigo'},
                                                        {header: "Denominación", flex: 1, dataIndex: 'denominacion'},
                                                        {header: "No. inventario", flex: 1, dataIndex: 'nroinventario'},
                                                        {
                                                            header: "Área de responsabilidad",
                                                            flex: 1,
                                                            dataIndex: 'arearesp'
                                                        },
                                                        {header: "Centro costo", flex: 1, dataIndex: 'centrocosto'},
                                                        {header: "Responsable", flex: 1, dataIndex: 'responsable'}
                                                    ],
                                                    fields: [
                                                        {name: 'idregnumerico'},
                                                        {name: 'idindicador'},
                                                        {name: 'codigo'},
                                                        {name: 'denominacion'},
                                                        {name: 'nroinventario'},
                                                        {name: 'arearesp'},
                                                        {name: 'centrocosto'},
                                                        {name: 'responsable'}
                                                    ]
                                                })],
                                                aceptarFn: function (apply) {
                                                    var selected = win.eqAll.getSelectionModel().getSelected();
                                                    _this.maquinariaView.getSelectionModel().getSelected().set('idregnumerico', selected.id);
                                                    return apply;
                                                }
                                            }).show();
                                            this.eqAll.getStore().on({
                                                'beforeload': function (st, opts) {
                                                    st.baseParams.idregistrosExcluir = Ext.encode(_this.maquinariaView.getStore().collect('idregnumerico'));
                                                    st.baseParams.idnaturaleza = _this.maquinariaView.getSelectionModel().getSelected().get('idnaturaleza');
                                                    st.baseParams.idgruposubgrupo = _this.maquinariaView.getSelectionModel().getSelected().get('idgruposubgrupo');
                                                }
                                            });
                                            this.eqAll.getStore().reload();
                                        }
                                    }],
                                    initList: function () {
                                        if (!this.list) {
                                            var cls = 'x-combo-list',
                                                listParent = Ext.getDom(this.getListParent() || Ext.getBody());

                                            this.list = new Ext.Layer({
                                                parentEl: listParent,
                                                shadow: this.shadow,
                                                cls: [cls, this.listClass].join(' '),
                                                constrain: false,
                                                zindex: this.getZIndex(listParent)
                                            });

                                            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
                                            this.list.setSize(lw, 0);
                                            this.list.swallowEvent('mousewheel');
                                            this.assetHeight = 0;
                                            if (this.syncFont !== false) {
                                                this.list.setStyle('font-size', this.el.getStyle('font-size'));
                                            }
                                            if (this.title) {
                                                this.header = this.list.createChild({
                                                    cls: cls + '-hd',
                                                    html: this.title
                                                });
                                                this.assetHeight += this.header.getHeight();
                                            }
                                            if (this.tbar) {
                                                this.toolbar = this.list.createChild({cls: cls + '-ft'});
                                                this.buttonTb = new Ext.Toolbar({
                                                    items: this.tbar,
                                                    renderTo: this.toolbar
                                                });
                                                this.assetHeight += this.toolbar.getHeight();
                                            }

                                            this.innerList = this.list.createChild({cls: cls + '-inner'});
                                            this.mon(this.innerList, 'mouseover', this.onViewOver, this);
                                            this.mon(this.innerList, 'mousemove', this.onViewMove, this);
                                            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

                                            if (this.pageSize) {
                                                this.footer = this.list.createChild({cls: cls + '-ft'});
                                                this.pageTb = new Ext.PagingToolbar({
                                                    store: this.store,
                                                    pageSize: this.pageSize,
                                                    renderTo: this.footer
                                                });
                                                this.assetHeight += this.footer.getHeight();
                                            }

                                            if (!this.tpl) {
                                                this.tpl = '<tpl for="."><div class="' + cls + '-item">{' + this.displayField + '}</div></tpl>';
                                            }

                                            this.view = new Ext.DataView({
                                                applyTo: this.innerList,
                                                tpl: this.tpl,
                                                singleSelect: true,
                                                selectedClass: this.selectedClass,
                                                itemSelector: this.itemSelector || '.' + cls + '-item',
                                                emptyText: this.listEmptyText,
                                                deferEmptyText: false
                                            });

                                            this.mon(this.view, {
                                                containerclick: this.onViewClick,
                                                click: this.onViewClick,
                                                scope: this
                                            });

                                            this.bindStore(this.store, true);

                                            if (this.resizable) {
                                                this.resizer = new Ext.Resizable(this.list, {
                                                    pinned: true, handles: 'se'
                                                });
                                                this.mon(this.resizer, 'resize', function (r, w, h) {
                                                    this.maxHeight = h - this.handleHeight - this.list.getFrameWidth('tb') - this.assetHeight;
                                                    this.listWidth = w;
                                                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                                                    this.restrictHeight();
                                                }, this);

                                                this[this.pageSize ? 'footer' : 'innerList'].setStyle('margin-bottom', this.handleHeight + 'px');
                                            }
                                        }
                                    }
                                })
                            },
                            LOG.util.Prototipos.columnaCantidad({
                                header: "Unidades producidas",
                                fixed: true,
                                dataIndex: 'unidadesproducidas',
                                editor: new Ext.form.NumberField({})
                            }),
                            LOG.util.Prototipos.columnaCantidad({
                                header: "Horas trabajando",
                                fixed: true,
                                dataIndex: 'horastrabajo',
                                editor: new Ext.form.NumberField({})
                            })
                        ],
                        fields: [
                            {name: 'idregnumerico'},
                            {name: 'idindicador'},
                            {name: 'idnaturaleza'},
                            {name: 'idgruposubgrupo'},
                            {name: 'idconfequipos'},
                            {name: 'denominacion'},
                            {name: 'nroinventario'},
                            {name: 'unidadesproducidas'},
                            {name: 'horastrabajo'}
                        ],
                    })],
                    aceptarFn: function (apply) {
                        var selections = win.eqAll.getSelectionModel().getSelections();
                        _this.maquinariaView.getStore().add(selections);
                        return apply;
                    }
                }).show();
                this.eqAll.getStore().on({
                    'beforeload': function (st, opts) {
                        st.baseParams = {
                            idregistrosExcluir: Ext.encode(_this.maquinariaView.getStore().collect('idregnumerico'))
                        };
                    },
                    'load': function (st, records) {
                    }
                });
                this.eqAll.getStore().reload();
            },
            onEliminar: function (btn) {
                var that = this;
                mostrarMensaje(2, '¿Está seguro que desea eliminar el equipo seleccionado?', function (btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                        Ext.Ajax.request({
                            url: '/logistica/produccion/produccion/index.php/valeproduccion/eliminarMaquinaria',
                            method: 'POST',
                            params: {
                                id: Ext.encode(_this.maquinariaView.getSelections())
                            },
                            callback: function (o, s, r) {
                                Ext.MessageBox.hide();
                                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                if (resp.success) {
                                    _this.maquinariaView.getStore().load();
                                    if (s) {
                                        mostrarMensaje(1, 'El(Los) equipo(s) ha(n) sido eliminado(s) satisfactoriamente.');
                                    }
                                } else {
                                    if (resp.codigoMsg == 'unique_violation') {
                                        mostrarMensaje(3, 'Error:Los datos a guardar ya existen.');
                                    } else if (resp.codigoMsg == 'not_null_violation') {
                                        mostrarMensaje(3, 'Error:Hay datos con valores incorrectos o vacios.');
                                    } else if (resp.codigoMsg == 'foreign_key_violation') {
                                        mostrarMensaje(3, 'Error:Hay datos inconsistentes.');
                                    } else {
                                        mostrarMensaje(1, 'Error al eliminar el elemento seleccionado');
                                    }
                                }
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [resp]).call();
                                }
                            }.createDelegate(this)
                        });
                    }
                }.createDelegate(this));
            }
        });

        this.maquinariaView.on('beforeedit', this.habilitarDeshabilitarComponents, this);

        this.cmbMaq.getStore().on('beforeload', function (st) {
            st.baseParams.idindicador = _this.maquinariaView.getSelectionModel().getSelected().get('idindicador');
            st.baseParams.idregistrosExcluir = Ext.encode(_this.maquinariaView.getStore().collect('idregnumerico'));
        }, this);

        this.maquinariaView.getSelectionModel().on('rowselect', function (sm, rowIndex, r) {
            if (sm.getCount() == 1) {
                _this.cmbMaq.getStore().reload();
            }

        }, this);
      /*  this.btnEliminar = LOG.util.Prototipos.botonEliminar({
            itemId: 'eliminar',
            disabled: true,
            handler: function () {
                if (_this.smMano.hasSelection()) {
                    mostrarMensaje(2, '¿Está seguro que desea eliminar la mano de obra seleccionada?', function (btn) {
                        if (btn == 'ok') {
                            Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                            Ext.Ajax.request({
                                url: '/logistica/produccion/produccion/index.php/valeproduccion/eliminarManoObra',
                                method: 'POST',
                                params: {
                                    id: Ext.encode(_this.manoobraView.getSelections())
                                },
                                callback: function (o, s, r) {
                                    Ext.MessageBox.hide();
                                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                    if (resp.success) {
                                        _this.manoobraView.getStore().load();
                                        if (s) {
                                            mostrarMensaje(1, 'El(Las) mano de obra(s) ha(n) sido eliminada(s) satisfactoriamente.');
                                        }
                                    } else {
                                        if (resp.codigoMsg == 'unique_violation') {
                                            mostrarMensaje(3, 'Error:Los datos a guardar ya existen.');
                                        } else if (resp.codigoMsg == 'not_null_violation') {
                                            mostrarMensaje(3, 'Error:Hay datos con valores incorrectos o vacios.');
                                        } else if (resp.codigoMsg == 'foreign_key_violation') {
                                            mostrarMensaje(3, 'Error:Hay datos inconsistentes.');
                                        } else {
                                            mostrarMensaje(1, 'Error al eliminar el elemento seleccionado');
                                        }
                                    }
                                    if (typeof _fn == 'function') {
                                        _fn.createDelegate(this, [resp]).call();
                                    }
                                }.createDelegate(this)
                            });
                        }
                    }.createDelegate(this));
                } else {
                    mostrarMensaje(1, 'No hay ningun elemento selecionado.');
                }
            },

        });
        this.btnAplicar = LOG.util.Prototipos.botonConfirmar({
            text: 'Aplicar',
            itemId: 'aplicar',
            disabled: true,
            handler: function () {
                if (_this.manoobraView.getSelectionModel().hasSelection()) {
                    _this.manoobraView.getStore().each(function (record, index) {
                        record.set('cantidad', _this.manoobraView.getSelectionModel().getSelected().get('cantidad'));
                        _this.btnSalvar.enable();
                    });
                } else {
                    mostrarMensaje(1, 'No hay ningun elemento selecionado.');
                }
            }
        });*/

        this.btnAdicionar = LOG.util.Prototipos.botonAdicionar({
            itemId: 'adicionar',
            disabled: false,
            handler: function () {
                var win = this;
                new LOG.util.Window({
                    title: 'Trabajadores',
                    width: 500,
                    height: 500,
                    items: [this.moAll = new LOG.produccion.valeproduccion.template.View({
                        //  title: 'Trabajadores',
                        border: false,
                        flex: 1,
                        header: false,
                        region: 'center',
                        borderBody: false,
                        url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarManoObraAll',
                        idProperty: 'idpersona',
                        sm: this.sm = new Ext.grid.CheckboxSelectionModel({
                            singleSelect: false
                        }),
                        columns: [this.sm,
                            {header: "Nombre", flex: 1, dataIndex: 'nombre'},
                            {header: "Cargo", flex: 1, dataIndex: 'cargo'},
                            LOG.util.Prototipos.columnaCantidad({
                                header: 'Cantidad',
                                dataIndex: 'cantidad',
                                flex: 1,
                                align: 'right',
                                default: true,
                                editor: new Ext.form.NumberField({
                                    allowBlank: false,
                                    allowNegative: false
                                })
                            })
                        ],
                        fields: [
                            {name: 'idpersona'},
                            {name: 'nombre'},
                            {name: 'cargo'},
                            {name: 'cantidad'}
                        ]
                    })],
                    aceptarFn: function (apply) {
                        var records = win.moAll.getSelectionModel().getSelections();
                        _this.manoobraView.getStore().add(records);
                        return apply;
                    }
                }).show();
                this.moAll.getStore().on({
                    'beforeload': function (st) {
                        st.baseParams = {
                            idturnotrabajo: (_this.scope.cmbTurno.getValue()) ? _this.scope.cmbTurno.getValue() : 0,
                            idpersonas: _this.manoobraView.getStore().collect('idpersona')
                        };
                    }
                });
                this.moAll.getStore().reload();
            },

        });
       /* this.manoobraView = new LOG.produccion.valeproduccion.template.View({
            title: 'Listado de Trabajadores',
            border: false,
            region: 'center',
            borderBody: false,
            tbar: [this.btnAdicionar, this.btnAplicar, this.btnEliminar],
            url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarManoObra',
            idProperty: 'idmanoobra',
            sm: this.smMano = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false,
                listeners: {
                    'selectionchange': function (sm) {
                        _this.btnAplicar.setDisabled(!sm.getCount() == 1);
                        _this.btnEliminar.setDisabled((sm.getCount() == 0 || _this.scope.smGridPrincipal.getSelected().data.estado > 1 || _this.scope.ordenProduccion.record &&_this.scope.ordenProduccion.record.data.estado == 9) ? true : false);
                        _this.actividadView.setDisabled(sm.getCount() == 0);
                        _this.actividadView.getStore().reload();
                    }
                }
            }),
            columns: [this.smMano,
                {header: "Nombre", flex: 1, dataIndex: 'nombre'},
                {header: "Cargo", flex: 1, dataIndex: 'cargo'},
                LOG.util.Prototipos.columnaCantidad({
                    header: 'Cantidad',
                    dataIndex: 'cantidad',
                    flex: 1,
                    align: 'right',
                    default: true,
                    editor: new Ext.form.NumberField({
                        allowBlank: false,
                        allowNegative: false
                    })
                })
            ],
            fields: [
                {name: 'idmanoobra'},
                {name: 'idvaleproduccion'},
                {name: 'idpersona'},
                {name: 'nombre'},
                {name: 'cargo'},
                {name: 'cantidad'}
            ],
            editorGridPanel_onAfterEdit: function () {
                _this.btnSalvar.setDisabled(false);
            },
            listeners: {
                'cellclick': function (grid, rowIndex, columnIndex, e) {
                    grid.getSelectionModel().selectRow(rowIndex);
                }
            }
        });

        this.actividadView = new LOG.produccion.valeproduccion.template.View({
            title: 'Actividades',
            border: false,
            region: 'east',
            width: 200,
            borderBody: false,
            disabled: true,
            url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarActividad',
            idProperty: 'idmanoobraactividad',
            sm: this.smAct = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false,
                listeners: {
                    'selectionchange': function (sm) {
                        _this.actividadView.btnEliminar.setDisabled(sm.getCount() == 0);
                    }
                }
            }),
            toolbar: true,
            columns: [this.smAct,
                {header: "Código", flex: 1, dataIndex: 'codigo'},
                {header: "Actividades", flex: 1, dataIndex: 'denominacion'},
                LOG.util.Prototipos.columnaCantidad({
                    header: 'Horas',
                    flex: 1,
                    dataIndex: 'horas',
                    align: 'right',
                    default: true,
                    editor: new Ext.form.NumberField({
                        allowBlank: false,
                        allowNegative: false
                    })
                })
            ],
            fields: [
                {name: 'idmanoobraactividad'},
                {name: 'idmanoobra'},
                {name: 'idcartatecindustrialactividad'},
                {name: 'codigo'},
                {name: 'denominacion'},
                {name: 'horas'}
            ],
            editorGridPanel_onAfterEdit: function () {
                _this.btnSalvar.setDisabled(false);
            },
            onAdicionar: function (btn) {
                var win = this;
                new LOG.util.Window({
                    title: 'Actividades',
                    width: 800,
                    height: 500,
                    items: [this.actAll = new LOG.produccion.valeproduccion.template.View({
                        border: false,
                        flex: 1,
                        header: false,
                        region: 'center',
                        borderBody: false,
                        url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarActividadAll',
                        idProperty: 'idcartatecindustrialactividad',
                        toolbar: false,
                        sm: this.sm = new Ext.grid.CheckboxSelectionModel({
                            singleSelect: false
                        }),
                        columns: [this.sm,
                            {header: "Código", fixed:true, dataIndex: 'codigo'},
                            {header: "Actividades", fixed:true, dataIndex: 'denominacion'},
                            LOG.util.Prototipos.columnaCantidad({
                                header: 'Horas',
                                fixed:true,
                                dataIndex: 'horas',
                                align: 'right',
                                default: true,
                                editor: new Ext.form.NumberField({
                                    allowBlank: false,
                                    allowNegative: false
                                })
                            })
                        ],
                        fields: [
                            {name: 'idcartatecindustrialactividad'},
                            {name: 'codigo'},
                            {name: 'denominacion'},
                            {name: 'horas'}
                        ],
                    })],
                    aceptarFn: function (apply) {
                        var selections = win.actAll.getSelectionModel().getSelections();
                        _this.actividadView.getStore().add(selections);
                        return apply;
                    }
                }).show();
                this.actAll.getStore().on({
                    'beforeload': function (st, opts) {
                        st.baseParams = {
                            idcartatecindustrial: (_this.scope.baseParams.idcartatecindustrial) ? _this.scope.baseParams.idcartatecindustrial : 0,
                            idcartatecindustrialactividad: Ext.encode(_this.actividadView.getStore().collect('idcartatecindustrialactividad'))
                        };
                    },
                    'load': function (st, records) {
                    }
                });
                this.actAll.getStore().reload();
            },
            onEliminar: function (btn) {
                var that = this;
                mostrarMensaje(2, '¿Está seguro que desea eliminar la actividad seleccionada?', function (btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                        Ext.Ajax.request({
                            url: '/logistica/produccion/produccion/index.php/valeproduccion/eliminarActividad',
                            method: 'POST',
                            params: {
                                id: Ext.encode(_this.actividadView.getSelections())
                            },
                            callback: function (o, s, r) {
                                Ext.MessageBox.hide();
                                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                if (resp.success) {
                                    _this.actividadView.getStore().load();
                                    if (s) {
                                        mostrarMensaje(1, 'El(Las) actividad(es) ha(n) sido eliminada(s) satisfactoriamente.');
                                    }
                                } else {
                                    if (resp.codigoMsg == 'unique_violation') {
                                        mostrarMensaje(3, 'Error:Los datos a guardar ya existen.');
                                    } else if (resp.codigoMsg == 'not_null_violation') {
                                        mostrarMensaje(3, 'Error:Hay datos con valores incorrectos o vacios.');
                                    } else if (resp.codigoMsg == 'foreign_key_violation') {
                                        mostrarMensaje(3, 'Error:Hay datos inconsistentes.');
                                    } else {
                                        mostrarMensaje(1, 'Error al eliminar el elemento seleccionado');
                                    }
                                }
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [resp]).call();
                                }
                            }.createDelegate(this)
                        });
                    }
                }.createDelegate(this));
            }
        });*/
        _this.productosobtenidosView.getStore().on({
            'beforeload': function (st) {
                st.baseParams = {
                    iddocumento: (_this.modelo.iddocumento) ? _this.modelo.iddocumento : 0,
                    idvaleproduccion: (_this.modelo.iddocumento) ? _this.modelo.iddocumento : 0,
                    idcartatecindustrial: (_this.scope.baseParams.idcartatecindustrial) ? _this.scope.baseParams.idcartatecindustrial : 0
                };
            }
        });

        _this.materialesView.getStore().on({
            'beforeload': function (st) {
                st.baseParams = {
                    idvaleproduccion: (_this.modelo.iddocumento) ? _this.modelo.iddocumento : 0,
                    idestado: (_this.scope.smGridPrincipal.getSelected()) ? _this.scope.smGridPrincipal.getSelected().data.estado : 0,
                    idordenproduccion: (_this.scope.ordenProduccion.idDocumento) ? _this.scope.ordenProduccion.idDocumento : 0,
                    idcartatecindustrial: (_this.scope.baseParams.idcartatecindustrial) ? _this.scope.baseParams.idcartatecindustrial : 0,
                    fechacreacion: (_this.scope.smGridPrincipal.getSelected()) ? _this.scope.smGridPrincipal.getSelected().data.fechacontable:0
                };
            }
        });
       /* _this.manoobraView.getStore().on({
            'beforeload': function (st) {
                st.baseParams = {
                    iddocumento: (_this.modelo.iddocumento) ? _this.modelo.iddocumento : 0,
                    idvaleproduccion: (_this.modelo.iddocumento) ? _this.modelo.iddocumento : 0,
                    idturnotrabajo: (_this.scope.cmbTurno.getValue()) ? _this.scope.cmbTurno.getValue() : 0
                };
            }
        });*/
        _this.maquinariaView.getStore().on({
            'beforeload': function (st) {
                st.baseParams = {
                    iddocumento: (_this.modelo.iddocumento) ? _this.modelo.iddocumento : 0,
                    idvaleproduccion: (_this.modelo.iddocumento) ? _this.modelo.iddocumento : 0
                };
            }
        });

       /* _this.actividadView.getStore().on({
            'beforeload': function (st) {
                st.baseParams = {
                    iddocumento: (_this.modelo.iddocumento) ? _this.modelo.iddocumento : 0,
                    idvaleproduccion: (_this.modelo.iddocumento) ? _this.modelo.iddocumento : 0,
                    idmanoobra: (_this.manoobraView.getSelectionModel().hasSelection()) ? _this.manoobraView.getSelectionModel().getSelected().data.idmanoobra : 0,
                    idcartatecindustrial: (_this.scope.baseParams.idcartatecindustrial) ? _this.scope.baseParams.idcartatecindustrial : 0
                };
            }
        });*/
        _this.productosobtenidosView.getStore().reload();
        _this.materialesView.getStore().reload();
        _this.maquinariaView.getStore().reload();
      /*  _this.manoobraView.getStore().reload();
        _this.actividadView.getStore().reload();*/
        LOG.util.UIManager.apply(this, {
            tbar: this.listaBotonesVentana.getArray(),
            resizable: false,
            items: [this.panelSuperior,
                new Ext.TabPanel({
                    region: 'center',
                    height: 200,
                    activeTab: 0,
                    items: [                        
                        this.productosobtenidosView,
                        this.materialesView,
                        this.maquinariaView, 
                       /* this.pnManoObra = new Ext.Panel({
                            title: 'Mano de obra',
                            layout:'border',
                            defaults:{margins:'0 0 0 0'},
                            items: [
                                this.manoobraView,
                                this.actividadView
                            ]
                        })*/
                    ]/*,
                    listeners:{
                        'activate':function( p ){
                            p.getStore().reload();
                        }
                    }*/
                })],
            buttons: [this.btnCerrar, this.btnNuevo, this.btnSalvar]
        });
        //this.pnManoObra.doLayout();
        LOG.lb.documento.ventanaGestionDocumentos.superclass.initComponent.call(this);
        this.onShow = this.onShow.createSequence(this.onShowHandler, this);
    },
    getTitleDocumento: function (iddocumento) {
        var _this = this;
        _this.modelo.iddocumento = iddocumento;
        _this.idDocumento = iddocumento;
        this.modelo.cargaInicial({
            url: '/logistica/produccion/produccion/index.php/valeproduccion/cargarEncabezado',
            iddocumento: iddocumento 
        }, function (datos) {
            var encabezado = datos[0];
            encabezado.estado = LOG.lb.documento.Estado[encabezado.estado];
            _this.setTitle(encabezado.denominacion + " # " + encabezado.numero + " del " + encabezado.fecha + " en " + encabezado.estado);
        });
    },
    /**
     *
     * @param {type} p
     * @returns {unresolved}
     */
    onResetHandler: function () {
        var _this = this.scope || this;
        if (_this.fromularioGestion) {
            _this.modelo.reset();
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.record = null;
            _this.productosobtenidosView.getStore().removeAll();
            //_this.gridDetalles.getView().refresh();
            _this.setTitle(_this.idioma.tlVentanaAdicionar);
            _this.scope.habilitarElementosWindow();
            _this.onShowHandler();
            _this.scope.winGestionarDocumento.doLayout();
        }
    },
    onRenderHandler: function() {
        LOG.util.UIManager.applyKey(this.btnSalvar, this);
        LOG.util.UIManager.applyKey(this.btnCerrar, this);
        LOG.util.UIManager.applyKey(this.btnNuevo, this);
    },
    onCloseHandler: function (p) {
        var _this = this;
        if (_this.fromularioGestion) {
            _this.record = null;
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.modelo.reset();
        }
        if (_this.modelo[_this.modelo.primaryKeyField] || _this.idDocumento) {
            var id = _this.modelo[_this.modelo.primaryKeyField] || _this.idDocumento;
            _this.modelo.cargaInicial({
                cargando: true,
                url: '/logistica/utiles/documento/index.php/desbloqueo/desbloquearDocumento',
                id: Ext.encode([id])
            });
        }

        _this.fromularioGestion.getForm().reset();
        this.record = null;
        _this.productosobtenidosView.getStore().baseParams = {};
        _this.productosobtenidosView.getStore().initBaseParams = {};
        _this.maquinariaView.getStore().baseParams = {};
        _this.maquinariaView.getStore().initBaseParams = {};
        _this.materialesView.getStore().baseParams = {};
        _this.materialesView.getStore().initBaseParams = {};
        
      /*  _this.manoobraView.getStore().baseParams = {};
        _this.manoobraView.getStore().initBaseParams = {};*/

        this.productosobtenidosView.getStore().removeAll();
        this.materialesView.getStore().removeAll();
        this.maquinariaView.getStore().removeAll();
        //this.manoobraView.getStore().removeAll();
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    },
    onShowHandler:function(){
        var _this = this;
        LOG.produccion.valeproduccion.ventanaGestionDocumentos.superclass.onShowHandler.call(this);
        if(this.tipoVentana == 1){
            this.record = null;
            this.scope.getSmPrincipal().clearSelections();
            _this.productosobtenidosView.getStore().baseParams = {};
            _this.productosobtenidosView.getStore().initBaseParams = {};
            _this.materialesView.getStore().baseParams = {};
            _this.materialesView.getStore().initBaseParams = {};
            _this.maquinariaView.getStore().baseParams = {};
            _this.maquinariaView.getStore().initBaseParams = {};
           /* _this.manoobraView.getStore().baseParams = {};
            _this.manoobraView.getStore().initBaseParams = {};*/
            this.productosobtenidosView.getStore().removeAll();
            this.materialesView.getStore().removeAll();
            this.maquinariaView.getStore().removeAll();
           // this.manoobraView.getStore().removeAll();
        }else{
            this.productosobtenidosView.getStore().reload();
            this.materialesView.getStore().reload();
            this.maquinariaView.getStore().reload();
            //this.manoobraView.getStore().reload();
        }
        this.listaBotonesVentana.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
        this.listaBotonesProductos.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);

    },
    /**
     *
     * @param {Object} d
     * @param {Boolean} noCargar
     * @returns {undefined}
     */
    prepareDocModify: function (d, noCargar) {
        if (this.fromularioGestion) {
            this.fromularioGestion.getForm().loadRecord(d);
            if (d) {
                this.modelo.loadRecord();
            }
            this.record = d;
            this.productosobtenidosView.getStore().removeAll();
            this.materialesView.getStore().reload();
            this.maquinariaView.getStore().reload();
           // this.manoobraView.getStore().reload();
            //this.actividadView.getStore().reload();
            if (this.record && this.record.hasOwnProperty('data')){
                //this.fromularioGestion.setDisabled(d.data.estado == 3 || d.data.estado == 9);
                this.getTitleDocumento(this.record.get('iddocumento'));
            }
            else
                this.setTitle('Adicionar documento');
        }
    },
    /**
     *
     * @returns {undefined}
     */
    salvarHandler: function (params) {
        var _this = this.scope || this;
        var params = params || {
            idestructuracomun: _this.scope ? _this.scope.idDeposito : null
        };
        _this.modelo.iddocumento = (_this.tipoVentana == 1) ? null : _this.modelo.iddocumento;
        _this.modelo.idvaleproduccion = (_this.tipoVentana == 1) ? null : _this.modelo.iddocumento;
        _this.modelo.idordenproduccion = (_this.scope.ordenProduccion.record) ? _this.scope.ordenProduccion.record.data.iddocumento : null;
        _this.modelo.productos = _this.productosobtenidosView.collect();
        _this.modelo.materiales = _this.materialesView.collect();
        _this.modelo.maquinarias = _this.maquinariaView.collect();
       // _this.modelo.manoobra = _this.manoobraView.collect();
      //  _this.modelo.actividades = _this.actividadView.collect();
        _this.modelo.salvar(params, function (r) {
            _this.tipoVentana = 2;
            params = new Object();
            if (_this.record == null) {
                _this.record = {};
                Ext.apply(_this.record, {
                    data: {
                        iddocumento: r.iddocumento,
                        estado: "1"
                    }
                });
            }            
            _this.productosobtenidosView.getStore().reload();
            _this.materialesView.getStore().reload();
            _this.maquinariaView.getStore().reload();
           // _this.manoobraView.getStore().reload();
           // _this.actividadView.getStore().reload();
            _this.getTitleDocumento(r.iddocumento);
            _this.listaBotonesVentana.each(function (b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(_this, [b, _this]).call();
                }
            }, _this);
        });
    },
    getData: function (view) {
        var d = view.getStore().data.items;
        var v, sv, r = [], l = {};
        for(var i = 0, len = d.length; i < len; i++){
            r.push(d[i].data);
        }
        return r;
    },
    getSelections: function (view) {
        var records = view.getSelectionModel().getSelections(), v = [];
        for (var i = 0; i <= records.length; i++) {
            if (!Ext.isEmpty(records[i]))
                v.push(records[i].data);
        }
        return v;
    },    
   /* getIdSelection: function (sm, field) {
        var records = this.manoobraView.getSelectionModel().getSelections(), v = [];
        for (var i = 0; i < records.length; i++) {
            if (!Ext.isEmpty(records[i]))
                v.push(records[i].get('idmanoobra'));
        }
        return v;
    },*/
    habilitarDeshabilitarComponents: function (e) {
        var _this = this;
       if (_this.scope.ordenProduccion.record && (_this.scope.ordenProduccion.record.data.estado == 9 || (_this.record && _this.record.data.estado > 1))) {
           e.cancel = true;
       } else if (e.field == 'cantidad'){
           e.cancel = false;
       }    
    },
    onShow: function () {
        var _this = this;
        this.listaBotonesVentana.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        this.listaBotonesProductos.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));

        this.productosobtenidosView.getBtnAdicionar().setDisabled(!(_this.modelo.iddocumento) || (_this.scope.smGridPrincipal.getSelected() && _this.scope.smGridPrincipal.getSelected().data.estado > 1) || _this.record.data.estado > 1);
        this.materialesView.getBtnAdicionar().setDisabled(!(_this.modelo.iddocumento) || (_this.scope.smGridPrincipal.getSelected() && _this.scope.smGridPrincipal.getSelected().data.estado > 1) || _this.record.data.estado > 1);
        this.materialesView.getBtnAdicionar().setVisible(false);
        this.materialesView.getBtnEliminar().setVisible(false);
        this.maquinariaView.getBtnAdicionar().setDisabled(!(_this.modelo.iddocumento) || (_this.scope.smGridPrincipal.getSelected() && _this.scope.smGridPrincipal.getSelected().data.estado > 1) || _this.record.data.estado > 1);
        this.btnAdicionar.setDisabled(!(_this.modelo.iddocumento) || (_this.scope.smGridPrincipal.getSelected() && _this.scope.smGridPrincipal.getSelected().data.estado > 1) || _this.record.data.estado > 1);
    }
});

Ext.ns('LOG.produccion.valeproduccion.template');
LOG.produccion.valeproduccion.template.View = Ext.extend(Ext.grid.EditorGridPanel, {
    title: 'Nuevo componente',
    clicksToEdit: 2,
    toolbar: false,
    constructor: function (config) {
        var store = new Ext.data.Store({
            autoDestroy: true,
            url: config.url,
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                successProperty: 'success',
                idProperty: config.idProperty,
                root: 'datos',
                messageProperty: 'message'
            }, config.fields)
        });
        if (config.toolbar) {
            config.tbar = [
                this.btnAdicionar = LOG.util.Prototipos.botonAdicionar({
                    itemId: 'adicionar',
                    disabled: false,
                    listeners: {
                        'click': {
                            scope: this,
                            fn: config.onAdicionar
                        }
                    },

                }),
                this.btnEliminar = LOG.util.Prototipos.botonEliminar({
                    itemId: 'eliminar',
                    disabled: true,
                    listeners: {
                        'click': {
                            scope: this,
                            fn: config.onEliminar
                        }
                    },
                   
                    
                })
            ];

            //  _this.btnEliminar.setDisabled(sm.getCount() == 0);
        }
        config.columns = [new Ext.grid.RowNumberer({width: 30, header: 'Nº'})].concat(config.columns),
            Ext.apply(config, {
                store: store,
                columns: config.columns,
                frame: true,
                clicksToEdit: 1,
                bbar: new Ext.PagingToolbar({
                    store: store,
                    pageSize: 25,
                    displayInfo: true
                })
            });
        LOG.produccion.valeproduccion.template.View.superclass.constructor.call(this, config);
        this.on({
            'afteredit': {
                scope: this,
                fn: this.editorGridPanel_onAfterEdit
            }
        });
    },
    getBtnAdicionar: function () {
        return this.btnAdicionar;
    },
    getBtnEliminar: function () {
        return this.btnEliminar;
    },
    editorGridPanel_onAfterEdit: function () {
    },
    getSelections: function () {
        var records = this.getSelectionModel().getSelections(), v = [];
        for (var i = 0; i <= records.length; i++) {
            if (!Ext.isEmpty(records[i]))
                v.push(records[i].id);
        }
        return v;
    },
    collect : function(){
        var d = this.getStore().data.items;
        var r = [];
        for(var i = 0, len = d.length; i < len; i++){
            r.push(d[i].data);
        }
        return r;
    },
    onAdicionar: Ext.emptyFn,
    onEliminar: Ext.emptyFn
});
