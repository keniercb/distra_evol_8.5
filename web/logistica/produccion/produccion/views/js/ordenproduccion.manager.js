Ext.ns('LOG.produccion.ordenproduccion.ventanaGestionDocumentos');
LOG.produccion.ordenproduccion.ventanaGestionDocumentos = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    
    constructor: function (config) {
        LOG.produccion.ordenproduccion.ventanaGestionDocumentos.superclass.constructor.call(this, config);
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
            handler:this.onCancelarHandler,
            text: this.idioma.lbBtnCerrar,
            scope: _this , 
        }, true);
      
        Ext.apply(this.listaBotonesVentana.getItem(3), {
                    tooltip:this.idioma.ttBtnAprobar,
                    isContextual: true,
                    itemId:'aprobar',
                    disabled: true,
                    handler: function () {
                        _this.modelo.aprobar({iddocumento: _this.scope.winGestionarDocumento.record.data.iddocumento}, function(r){
                         _this.gridMateriaPrima.getStorePrincipal().reload(); 
                         if (_this.scope.winGestionarDocumento.record == null) {
                            _this.scope.winGestionarDocumento.record = {};
                            Ext.apply(_this.scope.winGestionarDocumento.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "3"
                                }
                            });
                        } else {
                            _this.scope.winGestionarDocumento.record.data.estado = "3";
                        }
                        _this.scope.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.scope.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.scope.winGestionarDocumento, [b, _this.scope.winGestionarDocumento]).call();
                            }
                        }, _this.scope.winGestionarDocumento);
                        _this.scope.winGestionarDocumento.listaBotonesProductos.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.scope.winGestionarDocumento, [b, _this.scope.winGestionarDocumento]).call();
                            }
                        }, _this.scope.winGestionarDocumento);
                        _this.scope.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);                 
                        }); 
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.scope.grantedAction('CT') || _caller.scope.grantedAction('RAprobar')) {
                            b.setVisible(true);
                           
                                b.show();
                                if (_this.scope.winGestionarDocumento.record && (_this.scope.winGestionarDocumento.record.data.estado == '2' || _this.scope.winGestionarDocumento.record.data.estado == '10')) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        
                    }              
                });

        this.modelo.addActionButton(this.btnSalvar);
        this.materialesView = new LOG.produccion.ordenproduccion.comun.View({
            dirController: '/logistica/produccion/produccion/index.php/ordenproduccion',
            urlBusquedaGridPrincipal: 'cargarMateriales',
            modoSeleccion: 1,
            autoLoad: false,
            idioma: _this.idioma,
            gridEditable:(_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.estado != 9 : true,
            idProperty:'idordenmateriales',
            scope: _this.scope,
            initDefaultColumns: function () {
                this.addGridColumn({
                    width: 120,
                    dataIndex: 'iddocumento',
                    default: true
                });
                this.addGridColumn({
                    width: 120,
                    dataIndex: 'idordenproduccion',
                    default: true
                });
                this.addGridColumn({
                    width: 120,
                    dataIndex: 'idordenmateriales',
                    default: true
                });
                this.addGridColumn({
                    width: 120,
                    dataIndex: 'idordenproductosust',
                    default: true
                });
                this.addGridColumn({
                    width: 120,
                    dataIndex: 'idnorma',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'idindicador',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'idproducto',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'idumedida',
                    default: true
                });
                this.addGridColumn({
                    width: 120,
                    dataIndex: 'cantidadun',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgCodigo,
                    width: 120,
                    dataIndex: 'codigo',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgDenominacion,
                    width: 250,
                    dataIndex: 'denominacion',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgUM,
                    width: 100,
                    dataIndex: 'um',
                    default: true
                });    
                this.addGridColumn({
                    header: 'Norma',
                    width: 120,
                    dataIndex: 'norma',
                    default: true,
                      editor: new LOG.util.Prototipos.inputDecimal({value: 0}),
                    //default: true,
                    renderer: function(_v, _mD, _r) {
                        if( _v) {//_r.modified != null && _v == 0
                            return _v;/*parseFloat(_v).toFixed(6);*/
                        }           
                    
                         else {
                            return _r.data.norma;/*parseFloat(_r.data.norma).toFixed(6); */
                        }  
                    },
                    
                });
                this.addGridColumn({
                    header: 'Norma total',//(Norma * Cant. a Producir) / Cantidad Planificada',
                    width: 110,
                    align: 'right',
                    dataIndex: 'cantidad',
                    default: true,                   
                   // editor: LOG.util.Prototipos.inputDecimal({value: 0}),
                    renderer: function(_v, _mD, _r) {
                     if(Ext.isEmpty(_r.data.idordenmateriales)){
                            var cantidad = (Ext.isEmpty(_r.data.cantidad) || _r.data.cantidad == 0) ? (_this.scope.ieCantidad.getValue() * _r.data.norma) : _r.data.cantidad;          
                            _r.data.cantidad = cantidad;   
                            return parseFloat(cantidad).toFixed(6);
                        }else if(_r.data.idordenmateriales == 0){
                            var cantidad =_this.scope.ieCantidad.getValue() * _r.data.norma;
                            return parseFloat(cantidad).toFixed(6);
                        }
                            
                        
                    },
                });

                this.addGridColumn({
                    header: 'Total solicitada',//(Norma * Cant. a Producir) / Cantidad Planificada',
                    width: 110,
                    align: 'right',
                    dataIndex: 'solicitada',
                    default: true
                });
                this.addGridColumn({
                    header: 'Total entregada',//(Norma * Cant. a Producir) / Cantidad Planificada',
                    width: 110,
                    align: 'right',
                    dataIndex: 'entregada',
                    default: true,
                    renderer: function (v,md,r) {
                        return v;
                    }
                });

            },   
          
            render: function () {
                var p = LOG.produccion.ordenproduccion.comun.View.superclass.render.call(this);                
                LOG.util.UIManager.encadenaFn(this.getGridPrincipal(), 'fireEvent', function (eventName, eventObject) {

                    if(eventObject.field == 'cantidad'){
                        if (eventName == 'beforeedit') {
                            if (_this.record && _this.record.data.estado != 1) {
                                eventObject.cancel = true;
                            } else {
                                eventObject.cancel = false;
                            }
                        }
                        if (eventName == 'validateedit') {
                            if( eventObject.value <= parseFloat(eventObject.record.data.solicitada) && eventObject.value != 0){
                                mostrarMensaje(3,"La cantidad a consumir tiene que ser mayor que la cantidad solicitada.");
                                eventObject.cancel = true;
                                return false;            
                    
                            }
                           
                        }
                        if (eventName == 'afteredit') {
                            _this.modelo.adicionarProducto(eventObject.record.data);
                            _this.btnSalvar.enable();
                        }
                    }
                }, 'ACTIVATEBTN'); 
                
               if(_this.materialesView.getStorePrincipal().getModifiedRecords().length > 0){
                  _this.btnSalvar.enable();
               } else{
                _this.btnSalvar.disable();
               }
               Ext.apply(this.gpPrincipal, {
                viewConfig: {
                    getRowClass: function(rec, index, rowParams, store) {
                        if( rec.data.idproducto == 0 ) {
                            return 'redrow-text';
                        }
                      else  
                       return 'greenrow-text'; 
                    } 
                }
            });
                return p;
            },
            

        });

        var materialesPanel = this.materialesView.show();
        this.maquinariaView = new LOG.produccion.ordenproduccion.comun.View({
            dirController: '/logistica/produccion/produccion/index.php/ordenproduccion',
            urlBusquedaGridPrincipal: 'cargarMaquinaria',
            modoSeleccion: 1,
            autoLoad: false,
            gridEditable: (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.estado != 9 : true,
            idioma: _this.idioma,
            baseParams: {
                iddocumento: (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.iddocumento : 0,
                idvaleproduccion: (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.iddocumento : 0
            },
            initDefaultButtons: Ext.emptyFn,            
            idProperty:'idconfequipos',
            initDefaultColumns: function () {
                this.addGridColumn({
                    dataIndex: 'idconfequipos',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'idregistronumerico',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'idordenproduccion',
                    default: true
                });
                this.addGridColumn({
                    header: 'Denominación',
                    width: 250,
                    dataIndex: 'denominacion',
                    default: true
                });
                this.addGridColumn({
                    header: 'No. Inventario',
                    width: 120,
                    dataIndex: 'nroinventario',
                    default: true
                });
                this.addGridColumn({
                    header: 'Cant total producida',
                    width: 250,
                    dataIndex: 'unidadesproducidas',
                    default: true
                });
                this.addGridColumn({
                    header: 'Total horas',
                    width: 250,
                    align: 'right',
                    dataIndex: 'horastrabajo',
                    default: true
                });
            },
            onCreate: function () {
                var ma = new LOG.produccion.ordenproduccion.comun.View({
                    dirController: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod',
                    urlBusquedaGridPrincipal: 'cargarequipos',
                    modoSeleccion: 2,
                    autoLoad: true,
                    idioma: _this.idioma,
                    title: 'Equipo',
                    idGridPrincipal: 'idregnumerico',
                    formaVisualizacion: 'ventana',
                    width: 600,
                    height: 400,
                    initDefaultButtons: Ext.emptyFn,
                    initDefaultColumns: function () {
                        this.addGridColumn({
                            dataIndex: 'idregnumerico',
                            default: true
                        });
                        this.addGridColumn({
                            header: _this.idioma.cgCodigo,
                            width: 120,
                            dataIndex: 'codigo',
                            default: true
                        });
                        this.addGridColumn({
                            header: _this.idioma.cgDenominacion,
                            width: 250,
                            dataIndex: 'denominacion',
                            default: true
                        });
                        this.addGridColumn({
                            header: 'No. Inventario',
                            width: 120,
                            dataIndex: 'nroinventario',
                            default: true
                        });
                    },
                    aceptarFn: function () {
                        Ext.MessageBox.wait('Adicionando equipo', _this.idioma.msgEspere || '...');
                        Ext.Ajax.request({
                            url: '/logistica/produccion/produccion/index.php/ordenproduccion/eliminarConfig',
                            method: 'POST',
                            params: {},
                            callback: function (o, s, r) {
                                Ext.MessageBox.hide();
                                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                if (resp.success) {
                                    if (s) {
                                        mostrarMensaje(1, this.idioma.msgObjetoEliminadoMov);
                                    }
                                } else {
                                    if (resp.codigoMsg == 'unique_violation') {
                                        mostrarMensaje(3, 'Error:Los datos a guardar ya existen.');
                                    } else if (resp.codigoMsg == 'not_null_violation') {
                                        mostrarMensaje(3, 'Error:Hay datos con valores incorrectos o vacios.');
                                    } else if (resp.codigoMsg == 'foreign_key_violation') {
                                        mostrarMensaje(3, 'Error:Hay datos inconsistentes.');
                                    } else {

                                    }
                                }
                                if (typeof _fn == 'function') {
                                    _fn.createDelegate(this, [resp]).call();
                                }
                            }.createDelegate(this)
                        });
                    }
                });
                ma.show();
            },
        });
        var maquinariaPanel = this.maquinariaView.show();
        
        this.valeView = new LOG.produccion.valeproduccion.View({
            busquedaBasica: true,
            autoLoad: false,
            modoSeleccion: 1,
            baseParams:{
                //idordenproduccion: (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.iddocumento : _this.scope.getSmPrincipal().getSelected().data.iddocumento,
                idcartatecindustrial: (_this.scope.cmbCartaTecnologica.getValue()) ? _this.scope.cmbCartaTecnologica.getValue() : 0,
                estado: (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.estado : 1,
            },
            acciones: this.acciones,
            usuarios: this.usuarios,
            ordenProduccion:this,
            formaVisualizacion: 'panel',
            busquedaAvanzada: false
        });
        this.valeView.init();
        var valePanel = this.valeView.view();
        this.entregaView = new LOG.produccion.ordenproduccion.comun.View({
            //dirController: '/logistica/inventario/salida/salida/index.php/documentosalida',
            dirController: '/logistica/produccion/produccion/index.php/ordenproduccion',
            //urlBusquedaGridPrincipal: 'cargarDocumentos',
            urlBusquedaGridPrincipal: 'cargarDocumentosGenerados',
            modoSeleccion: 1,
            autoLoad: false,
            idioma: _this.idioma,
            gridEditable: (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.estado != 9 : true,
            baseParams: {
                idpadre: (_this.record && _this.record.data.iddocumento) ? _this.record.data.iddocumento : (_this.scope.getSmPrincipal().getSelected() ? _this.scope.getSmPrincipal().getSelected().data.iddocumento : -1),
                tipo: 2,
                valeentrega: 1
            },
            idGridPrincipal: 'iddocumento',
            initDefaultButtons: Ext.emptyFn,
            initDefaultColumns: function () {
                this.addGridColumn({
                    dataIndex: 'iddocumento',
                    default: true
                });
                this.addGridColumn({
                    header: 'No. Documento',
                    width: 250,
                    dataIndex: 'nrodoc',
                    default: true
                });
                this.addGridColumn({
                    header: 'Fecha',
                    width: 120,
                    dataIndex: 'fechacontable',
                    default: true
                });
                this.addGridColumn({
                    header: 'Depósito',
                    width: 100,
                    dataIndex: 'deposito',
                    default: true,
                    autoExpand: true
                });
            }
        });
        var entregaPanel = this.entregaView.show();
        
        this.gastosView = new LOG.produccion.ordenproduccion.comun.View({
            dirController: '/logistica/produccion/produccion/index.php/ordenproduccion',
            urlBusquedaGridPrincipal: 'cargarGasto',
            modoSeleccion: 1,
            autoLoad: false,
            gridEditable: (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.estado != 9 : true,
            idGridPrincipal: 'idgasto',
            idioma: _this.idioma,
            pruneModifiedRecords: true,
            /*baseParams: {
                iddocumento: (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.iddocumento : 0,
                idordenproduccion: (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.iddocumento : 0,
                idcartatecindustrial: (_this.record && _this.record.hasOwnProperty('data')) ? _this.scope.cmbCartaTecnologica.originalValue : 0,
            },*/
            
            initDefaultButtons: function () {
                var that = this;
                that.addToolbarButton(this.botonAdicionar = LOG.util.Prototipos.botonAdicionar({
                    tooltip: this.idioma.ttBtnAdicionar,
                   
                    handler: function () {
                       
                        that.onCreate.call(that, false);
                    },
                    controlFn: function (b, _caller) {
                        LOG.util.UIManager.encadenaFn(_this.gastosView.getStorePrincipal(), 'fireEvent', function (e) {
                            if (e == 'beforeload') {
                                b.setDisabled((_this.record && _this.record.data.estado == 9) ? true : false);
                            }
                        }, 'nuevo');
                    }
                }));
                that.addToolbarButton(this.botonEliminar = LOG.util.Prototipos.botonEliminar({
                    disabled: true,
                    handler: function () {
                        that.onDelete.call(that);
                    },
                    controlFn: function (b, _caller) {
                        LOG.util.UIManager.encadenaFn(_this.gastosView.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                b.setDisabled(this.getCount() < 1);
                            }
                        }, 'eliminar');
                    }
                }));
                that.addToolbarButton('->');
            },
                

            initDefaultColumns: function () {
                this.addGridColumn({
                    dataIndex: 'idgasto'
                });
                this.addGridColumn({
                    dataIndex: 'idordenproduccion'
                });
                this.addGridColumn({
                    dataIndex: 'idnorma'
                });
                this.addGridColumn({
                    dataIndex: 'idtipogasto'
                });
                this.addGridColumn({
                    header: 'Denominación',
                    width: 250,
                    dataIndex: 'denominacion',
                    default: true
                });
                this.addGridColumn({
                    header: 'UM',
                    width: 250,
                    dataIndex: 'um',
                    default: true
                });
                this.addGridColumn({
                    header: 'Valor',
                    width: 120,
                    dataIndex: 'valor',
                    editor: new LOG.util.Prototipos.inputDecimal({}),
                    default: true,
                    renderer: function(_v, _mD, _r) {
                            if(_r.modified != null && _v != 0 ) {
                                return _v;
                            }           
                           else {
                            return _v;
                                //return _r.data.valor;
                            }  
                        },
                });
                this.addGridColumn({
                    header: 'Precio',
                    width: 120,
                    dataIndex: 'precio',
                    editor: new LOG.util.Prototipos.inputDecimal({}),
                    default: true,
                    hidden:true,
                    renderer: function(_p, _mD, _r) {
                            if(_r.modified != null ) {
                                return _p;
                               
                            }           
                           else {
                             return _r.data.precio;
                            }  
                        },
                });
                this.addGridColumn({
                    header: 'Saldo',
                    width: 120,
                    hidden: true,
                    dataIndex: 'saldo',
                    default: true
                });
            },
            render: function () {
                var p = LOG.produccion.ordenproduccion.comun.View.superclass.render.call(this);
                LOG.util.UIManager.encadenaFn(this.getGridPrincipal(), 'fireEvent', function (e, rd) {
                    if (e == 'afteredit') {
                        _this.btnSalvar.enable();
                    }
                }, 'ACTIVATEBTN');
                return p;
            },
            
            onCreate: function () {
                var form;
                var win = new LOG.util.Window({
                    //   layout: 'fit',
                    title: 'Gasto',
                    width: 500,
                    height: 600,
                    resizable: false,
                    constrain: true,
                    modal: true,
                    autoScroll: true,
                    closeAction: 'hide',
                    items: form = new Ext.FormPanel({
                        frame: true,
                        itemId: 'form',
                        labelAlign: 'right',
                        labelWidth: 85,
                        autoHeight: true,
                        bodyStyle: 'padding: 5px',
                        defaults: {
                            anchor: '0'
                        },
                        region: 'center',
                        items: [
                            new LOG.util.ComboBox({
                                fieldLabel: 'Gasto',
                                name: 'idtipogasto',
                                hiddenName: 'idtipogasto',
                                displayField: 'denominacion',
                                valueField: 'idtipocontrolcalidad',
                                autoSelect: true,
                                autoLoad: true,
                                pageSize: 10,
                                baseParams: {
                                    modelo: "NomTipoControlCalidad",
                                    idnom: "idtipocontrolcalidad"
                                },
                               // url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomenclador',
                               url:'/logistica/produccion/produccion/index.php/ordenproduccion/cargarGastosEntidad',
                                disabled: false
                            }),
                            {
                                fieldLabel: 'Valor',
                                xtype: 'numberfield',
                                name: 'valor',
                                width: 190
                            },
                            {
                                fieldLabel: 'Precio',
                                xtype: 'numberfield',
                                name: 'precio',
                                width: 190
                            },
                            {
                                xtype: 'hidden',
                                name: 'idordenproduccion',
                                value: (_this.record && _this.record.hasOwnProperty('data'))? _this.record.data.iddocumento : null,
                                width: 190
                            }
                        ]
                    }),
                    aceptarFn: function (close) {
                        if (form.getForm().isValid()) {
                            form.getEl().mask();
                            form.getForm().submit({
                                url: '/logistica/produccion/produccion/index.php/ordenproduccion/adicionarGasto',
                                waitMsg: 'Guardando...',
                                submitEmptyText: false,
                                success: function () {
                                    _this.gastosView.getStorePrincipal().load();
                                    mostrarMensaje(1, 'El/Los dato/s se ha guardado satisfactoriamente.');
                                    form.getEl().unmask();
                                },
                                failed: function () {
                                    mostrarMensaje(1, 'El gasto que desea adicionar ya existe.');
                                    form.getEl().unmask();
                                }
                            });
                        }
                        return close;
                    }
                });
                win.show();
            },
            onDelete: function () {
                var that = this;
                mostrarMensaje(2, '¿Está seguro que desea eliminar el gasto seleccionado?', function (btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                        Ext.Ajax.request({
                            url: '/logistica/produccion/produccion/index.php/ordenproduccion/eliminarGasto',
                            method: 'POST',
                            params: {
                                id: that.getSmPrincipal().getSelected().get('idgasto')
                            },
                            callback: function (o, s, r) {
                                Ext.MessageBox.hide();
                                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                if (resp.success) {
                                    _this.gastosView.getStorePrincipal().load();
                                    if (s) {
                                        mostrarMensaje(1, 'El(Los) gasto(s) ha(n) sido eliminado(s) satisfactoriamente.');
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
        var gastosPanel = this.gastosView.show();


        _this.materialesView.getStorePrincipal().on({
            'beforeload': function (st) {
                st.initBaseParams.idcartatecindustrial = (_this.record) ? _this.record.data.idcartatecnologica : (_this.scope.idcartatecnologica ? _this.scope.idcartatecnologica : (_this.scope.getSmPrincipal().getSelected() ? _this.scope.getSmPrincipal().getSelected().data.idcartatecnologica : -1));
                st.initBaseParams.idordenproduccion = (_this.record) ? _this.record.data.iddocumento : (_this.scope.getSmPrincipal().getSelected() ? _this.scope.getSmPrincipal().getSelected().data.iddocumento : -1);
            }
        });

        _this.materialesView.getGridPrincipal().on({
            'beforeedit': function (e) {
                if (_this.materialesView.smGridPrincipal.getSelected().data.idordenproductosust != 0 && _this.scope.grantedAction('RAdicionarMaestro')) {
                    e.cancel = false;
                } else {
                    e.cancel = true;
                }
                if(_this.materialesView.getStorePrincipal().getModifiedRecords()){
                   _this.btnSalvar.enable();
                } else{
                 _this.btnSalvar.disable();
                }

            }
        });

        _this.maquinariaView.getStorePrincipal().on({
            'beforeload': function (st) {
                if((_this.record && _this.record.hasOwnProperty('data'))){
                    st.initBaseParams.iddocumento = (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.iddocumento : (_this.idDocumento)?_this.idDocumento :0;
                    st.initBaseParams.idordenproduccion = (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.iddocumento : (_this.idDocumento)?_this.idDocumento :0;
                } else {
                    return false;
                }
            }
        });

        _this.valeView.getStorePrincipal().on({
            'beforeload': function (st) {
                if((_this.record && _this.record.hasOwnProperty('data'))){                  
                    st.initBaseParams = {
                        //idordenproduccion:  (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.iddocumento : (_this.idDocumento)?_this.idDocumento :0,
                        idordenproduccion:  (_this.record) ? _this.record.data.iddocumento : (_this.idDocumento)?_this.idDocumento : _this.scope.getSmPrincipal().getSelected().data.iddocumento,
                        idcartatecindustrial: (_this.scope.cmbCartaTecnologica.getValue()) ? _this.scope.cmbCartaTecnologica.getValue() : 0
                    };
                    Ext.apply(_this.valeView.baseParams, st.initBaseParams);
                } else {
                    return false;
                }
            }
        });
        _this.entregaView.getStorePrincipal().on({
            'beforeload': function (st) {
                if((_this.record && _this.record.hasOwnProperty('data'))){                                   
                    st.initBaseParams.idpadre = (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.iddocumento : 0;
                    st.initBaseParams.estado = (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.estado : 0;
                    st.initBaseParams.valeentrega = 1;
                } else {
                    return false;
                } 
            }
        });

        _this.gastosView.getStorePrincipal().on({
            'beforeload': function (st) {
                if((_this.record && _this.record.hasOwnProperty('data'))){                 
                    st.initBaseParams.iddocumento = (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.iddocumento : (_this.idDocumento)?_this.idDocumento :_this.scope.getSmPrincipal().getSelected().data.iddocumento;
                    st.initBaseParams.idordenproduccion = (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.iddocumento : (_this.idDocumento)?_this.idDocumento :_this.scope.getSmPrincipal().getSelected().data.iddocumento;
                    st.initBaseParams.idactividad = _this.gridActividad.smGridPrincipal.getSelected() ?_this.gridActividad.smGridPrincipal.getSelected().json.idactividad: 0;
                    st.initBaseParams.idcartatecindustrial = (_this.record && _this.record.hasOwnProperty('data')) ? _this.record.data.idcartatecnologica : _this.scope.cmbCartaTecnologica.getValue();
                } else {
                    return false;
                } 
            }
        });

       //Grid actividad
        this.gridActividad = new LOG.produccion.ordenproduccion.gridActividad({
            scope: _this,
            idioma: _this.idioma
        });
        this.gridActividad.init();
        this.actividad = this.gridActividad.view();
        this.actividad.setHeight(732);
        //this.actividad.setWidth(250);


         //Grid Materia primas
         this.gridMateriaPrima = new LOG.produccion.ordenproduccion.gridMateriaPrima({
            scope: _this,
            idioma: _this.idioma
        });
        this.gridMateriaPrima.init();
        this.materiaprima = this.gridMateriaPrima.view();
        this.materiaprima.setHeight(320);

        //Grid operarios
        this.gridOperarios = new LOG.produccion.ordenproduccion.gridOperarios({
            scope: _this,
            idioma: _this.idioma
        });
        this.gridOperarios.init();
        this.operarios = this.gridOperarios.view();
        this.operarios.setHeight(320);

         //Panel actividad
        this.panelAct = new LOG.util.Panel({
            items: [this.actividad],
            width: '35%'
            
        });
        //Panel materia prima
        this.panelMateriaPrima = new LOG.util.Panel({
            frame:true,
            items: [this.materiaprima],
            title: 'Materia prima'
        });
       
        //Panel operarios
        this.panelOperarios = new LOG.util.Panel({
            frame:true,
            items: [this.operarios],
            title: 'Operarios'                                                                                        
        });

        this.colEst = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
 ///aki agrego los dos paneles al panel colEst
        this.colEst.addComponent(this.panelMateriaPrima);
        this.colEst.addComponent( this.panelOperarios);

        //Panel este
        this.panelEast = new LOG.util.Panel({
            frame:true,
            items: [this.colEst],
            width: '65%'
        });

        this.tab2P = LOG.util.UIManager.initPanel({
            region: 'center',
            layout: 'column',
            //autoload: true,
           // animCollapse: false,
            name: 'tab2',
           // animate: false,
            resizable: true,
            title: 'Actividades a realizar',
            //autoHeight: true,
            frame: true,
            items: [this.panelAct, this.panelEast]
           // disabled: (this.record  && _this.record.hasOwnProperty('data')) ? (( idcartatecindustrial? _this.scope.cmbCartaTecnologica.getValue() ? _this.scope.cmbCartaTecnologica.getValue() ,
        });
        this.tab1P = LOG.util.UIManager.initPanel({
            frame: true,
            tbar: this.listaBotonesVentana.getArray(),
            title: 'Datos generales',
            //autoHeight: true,
            name: 'tab1',
            resizable: false,
            region:'east',
            autoHeight:true,
            items: [this.panelSuperior, 
                this.tabPanel = new Ext.TabPanel({
                    region: 'center',
                   // autoHeight: true,
                   height: 483,
                   activeTab: 0,
                    items: [
                        {
                            title: 'Materias primas y materiales',
                            layout: 'fit',
                            items: materialesPanel
                        },{
                            title: 'Equipos mecanizados',
                            layout: 'fit',
                            items: maquinariaPanel
                        }, {
                            title: 'Vales de producción',
                            layout: 'fit',
                            itemId: 'vale',
                            //disabled: (this.record  && _this.record.hasOwnProperty('data')) ? ((this.record.data.estado == 3 ) ? false : true) : true,
                            disabled: (this.record && this.record.data.estado == 3) ? false  : true,
                            items: valePanel
                        }, {
                            title: 'Vales de entrega',
                            layout: 'fit',
                           itemId: 'entrega',
                            disabled: (this.record  && _this.record.hasOwnProperty('data')) ? ((this.record.data.estado == 3 ) ? false : true) : true,
                            items: entregaPanel
                        }, {
                            title: 'Otros gastos',
                            layout: 'fit',
                            itemId: 'gasto',
                            disabled: (this.record  && _this.record.hasOwnProperty('data')) ? ((this.record.data.estado == 3 ) ? false : true) : true,
                            items: gastosPanel
                        }
                    ]
                })],
            
        });
        this.tabPanelActividades = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            anchor: '98%',
            items: [this.tab1P,this.tab2P],
          listeners: {
               tabchange: function (p, t) {
                    if (t.name == 'tab2') {
                         _this.gridMateriaPrima.cmbAlmacen.setValue(null);
                        _this.gridMateriaPrima.getStorePrincipal().removeAll();
                         _this.gridActividad.gpPrincipal.getStore().reload();
                    }
                
                }
           }
        });

        _this.arrayActividad = new Array();

       
        this.gridActividad.getSmPrincipal().on({
            'rowselect': function (sm, rowIndex, record) {  
               
                var selecciones = sm.getSelections();
               Ext.each(selecciones, function(dat) {    
                if (selecciones.length == 1 ) {
                    _this.arrayActividad.push(dat.json.idactividad);

                } else {
                        for (var i= 0; i <  _this.arrayActividad.length; i++) {
                            if (dat.json.idactividad != _this.arrayActividad[i]) {
                                _this.arrayActividad.push(dat.json.idactividad);
                            }                 
                        }
                    
                    }              
               });
                _this.gridOperarios.listaBotones.arrayData[1].enable();
                _this.gridMateriaPrima.getStorePrincipal().baseParams = {};
                _this.gridMateriaPrima.getStorePrincipal().initBaseParams = {};
                _this.gridMateriaPrima.getStorePrincipal().load();
                _this.gridOperarios.getStorePrincipal().reload();  
            },
            'rowdeselect': function (sm, rowIndex, record) {
                _this.arrayActividad = new Array();
                if (sm.getSelections().length > 0) {
                    Ext.each(sm.getSelections(), function(sel) {
                        _this.arrayActividad.push(sel.json.idactividad);    
                    });
                    _this.gridMateriaPrima.getStorePrincipal().reload();
                } else {
                    _this.gridOperarios.listaBotones.arrayData[1].disable();
                    _this.gridMateriaPrima.getStorePrincipal().removeAll();
                }
               
            }
        });    

        this.gridActividad.gpPrincipal.getStore().on({
            'beforeload': function (st) {
                _this.arrayActividad = new Array();
                st.initBaseParams.idcartatecindustrial = (_this.record) ? _this.record.data.idcartatecnologica : -1;
            }
         });


         this.gridMateriaPrima.gpPrincipal.getStore().on({
            'beforeload': function (st) {
                 st.initBaseParams.arrayActividad = _this.gridActividad.smGridPrincipal.getSelections() ? Ext.encode( _this.arrayActividad) : 0;
                 st.initBaseParams.idordenproduccion = (_this.record) ? _this.record.data.iddocumento : ((_this.idDocumento)?_this.idDocumento : _this.scope.getSmPrincipal().getSelected().data.iddocumento);
            }
         });

         this.gridOperarios.gpPrincipal.getStore().on({
            'beforeload': function (st) {
                 st.initBaseParams.idactividad = _this.gridActividad.smGridPrincipal.getSelected() ?_this.gridActividad.smGridPrincipal.getSelected().json.idcartatecindustrialactividad: 0; 
                 st.initBaseParams.idordenactividad = (_this.scope.record) ? _this.scope.record.data.iddocumento : ((_this.scope.smGridPrincipal.getSelected() ? _this.scope.smGridPrincipal.getSelected().data.idordenproduccion : -1)); 
            }
            
           
         });

        LOG.util.UIManager.apply(this, {
            tbar: this.listaBotonesVentana.getArray(),
            resizable: false,
            items:  [this.tabPanelActividades],
            buttons: [this.btnCerrar, this.btnNuevo, this.btnSalvar]
        });

        LOG.lb.documento.ventanaGestionDocumentos.superclass.initComponent.call(this);
    },
    cargarProductos:Ext.emptyFn,
    /**
     *
     * @returns {undefined}
     */
    salvarHandler: function (params) {
        var _this = this.scope || this;
        _this.arrayProdSust = new Array();
        // var modificados =_this.materialesView.getStorePrincipal().getModifiedRecords();
        var modificados =_this.gridMateriaPrima.getStorePrincipal().getModifiedRecords();
        console.log(_this.modificados);
        //console.log(_this.materialesView.getStorePrincipal().getModifiedRecords())
        if (modificados.length > 0  ) {
            Ext.each(modificados, function(dat) {    
                _this.arrayProdSust.push({
                    idordenproductosust: dat.data.idordenproductosust,
                    norma: dat.data.norma,
                    idactividad: dat.data.idactividad,
                    idindicador: dat.data.idindicador,
                    idordenproduccion: (_this.tipoVentana == 1)? null : (_this.idDocumento)?_this.idDocumento :_this.modelo.iddocumento,
                });
            })
        }
        
        var params = params || {
            idestructuracomun: _this.scope ? _this.scope.idDeposito : null,
            arrayProdSust: Ext.encode(_this.arrayProdSust)

        };
        _this.modelo.iddocumento = (_this.tipoVentana == 1)? null : (_this.idDocumento)?_this.idDocumento :_this.modelo.iddocumento;
        _this.modelo.idordenproduccion = (_this.tipoVentana == 1)? null : (_this.idDocumento)?_this.idDocumento :_this.modelo.iddocumento;
        _this.modelo.gastos = _this.getModified(_this.gastosView);
        _this.modelo.gridMateriaPrima = _this.getModified(_this.gridMateriaPrima);
       
        _this.modelo.salvar(params, function (r) {
            params = new Object();
            _this.tipoVentana = 2;
            if (_this.record == null) {
                _this.record = {};
                Ext.apply(_this.record, {
                    data: {
                        iddocumento: r.iddocumento,
                        estado: "1",
                        idcartatecnologica: r.idcartatecnologica/*_this.scope.cmbCartaTecnologica.getValue()*/
                    }
                });

            }     
            _this.fireEvent('save',_this.record);
            _this.getTitleDocumento(r.iddocumento);
            _this.valeView.getStorePrincipal().reload();
            _this.materialesView.getStorePrincipal().reload();
            _this.maquinariaView.getStorePrincipal().reload();
            _this.gastosView.getStorePrincipal().reload();
            _this.gridMateriaPrima.getStorePrincipal().reload();
            if (_this.gridMateriaPrima && _this.tab2P.activeTab == true) {
                _this.gridMateriaPrima.getStorePrincipal().reload();
            }
            _this.listaBotonesVentana.each(function (b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(_this, [b, _this]).call();
                }
            }, _this);
        });
    },
    onResetHandler: function () {
        var _this = this.scope || this;
        if (_this.fromularioGestion) {
            _this.modelo.reset();
            _this.scope.idcartatecnologica = null;
            //_this.scope.newidcartatecindustrial = null;
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.scope.slentidad.setValue(null);
           //_this.materialesView.cmbAlmacen.setValue(null);
             _this.record = null;
            _this.materialesView.getStorePrincipal().removeAll();
            _this.materialesView.getGridPrincipal().getView().refresh();   
            _this.gridMateriaPrima.cmbAlmacen.setValue(null);
            _this.gridMateriaPrima.getStorePrincipal().removeAll();
            _this.gridActividad.getStorePrincipal().removeAll();
          //  _this.gridActividad.getView().refresh();
            _this.setTitle(_this.idioma.tlVentanaAdicionar);
            _this.onShowHandler();
        }
    },
    /**
     *
     * @param {type} p
     * @returns {unresolved}
     */
    onRenderHandler: function() {
        LOG.util.UIManager.applyKey(this.btnSalvar, this);
        LOG.util.UIManager.applyKey(this.btnCerrar, this);
        LOG.util.UIManager.applyKey(this.btnNuevo, this);
    },
    ponerEnColumna: function (elemento1, elemento2) {
        var columna = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        columna.addComponent(elemento1);
        columna.addComponent(elemento2);
        return columna;
    },
    onCloseHandler: function (p) {
        var _this = this;
        if (_this.fromularioGestion) {
            _this.record = null;
            _this.fromularioGestion.getForm()._record = null;
            _this.scope.idcartatecnologica = null; 
            //_this.scope.newidcartatecindustrial = null;
            _this.fromularioGestion.getForm().reset();
            _this.modelo.reset();
            if (_this.materialesView.getStorePrincipal()) {
                _this.materialesView.getStorePrincipal().baseParams = {};
                _this.materialesView.getStorePrincipal().initBaseParams = {};
                _this.materialesView.getStorePrincipal().removeAll();
                _this.materialesView.getGridPrincipal().getView().refresh();
            }
            /*if (_this.gridMateriaPrima.getStorePrincipal()) {
                _this.gridMateriaPrima.getStorePrincipal().baseParams = {};
                _this.gridMateriaPrima.getStorePrincipal().initBaseParams = {};
                _this.gridMateriaPrima.getStorePrincipal().removeAll();
                _this.gridMateriaPrima.getGridPrincipal().getView().refresh();
            }*/
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
        _this.scope.ieCantidad.setValue(null);
      // _this.materialesView.cmbAlmacen.setValue(null);
        _this.gridMateriaPrima.cmbAlmacen.setValue(null);
        this.record = null;
        _this.arrayActividad = new Array();
        _this.valeView.baseParams = {};
        _this.valeView.initBaseParams = {};
        _this.materialesView.getStorePrincipal().baseParams = {};
        _this.materialesView.getStorePrincipal().initBaseParams = {};
        _this.maquinariaView.getStorePrincipal().baseParams = {};
        _this.maquinariaView.getStorePrincipal().initBaseParams = {};
        _this.entregaView.getStorePrincipal().baseParams = {};
        _this.entregaView.getStorePrincipal().initBaseParams = {};
        _this.gastosView.getStorePrincipal().baseParams = {};
        _this.gastosView.getStorePrincipal().initBaseParams = {};
        _this.gridActividad.getStorePrincipal().baseParams = {};
        _this.gridActividad.getStorePrincipal().initBaseParams = {};
       // _this.gridActividad.getSmPrincipal().clearSelections();
        _this.gridMateriaPrima.getStorePrincipal().baseParams = {};
        _this.gridMateriaPrima.getStorePrincipal().initBaseParams = {};
        _this.gridOperarios.getStorePrincipal().baseParams = {};
        _this.gridOperarios.getStorePrincipal().initBaseParams = {};
        this.tabPanelActividades.setActiveTab(0);

        this.materialesView.getStorePrincipal().removeAll();
        this.maquinariaView.getStorePrincipal().removeAll();
        this.valeView.getStorePrincipal().removeAll();
        this.entregaView.getStorePrincipal().removeAll();
        this.gastosView.getStorePrincipal().removeAll();
        this.gridActividad.getStorePrincipal().removeAll();
        this.gridMateriaPrima.getStorePrincipal().removeAll();
        this.gridOperarios.getStorePrincipal().removeAll();
       
        this.habilitarItems();
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    },
    onShowHandler:function(){  
        var _this = this;
        LOG.produccion.ordenproduccion.ventanaGestionDocumentos.superclass.onShowHandler.call(this);
        if(this.tipoVentana == 1){
            this.record = null;
         // _this.materialesView.cmbAlmacen.setValue(null);
            _this.gridMateriaPrima.cmbAlmacen.setValue(null);
            this.scope.getSmPrincipal().clearSelections();
            _this.valeView.getStorePrincipal().baseParams = {};
            _this.valeView.getStorePrincipal().initBaseParams = {};
            _this.materialesView.getStorePrincipal().baseParams = {};
            _this.materialesView.getStorePrincipal().initBaseParams = {};
            _this.maquinariaView.getStorePrincipal().baseParams = {};
            _this.maquinariaView.getStorePrincipal().initBaseParams = {};
            _this.entregaView.getStorePrincipal().baseParams = {};
            _this.entregaView.getStorePrincipal().initBaseParams = {};
            _this.gastosView.getStorePrincipal().baseParams = {};
            _this.gastosView.getStorePrincipal().initBaseParams = {};
            _this.gridActividad.getStorePrincipal().baseParams = {};
        _this.gridActividad.getStorePrincipal().initBaseParams = {};
        _this.gridMateriaPrima.getStorePrincipal().baseParams = {};
        _this.gridMateriaPrima.getStorePrincipal().initBaseParams = {};
        _this.gridOperarios.getStorePrincipal().baseParams = {};
        _this.gridOperarios.getStorePrincipal().initBaseParams = {};
        
            this.materialesView.getStorePrincipal().removeAll();
            this.maquinariaView.getStorePrincipal().removeAll();
            this.valeView.getStorePrincipal().removeAll();
            this.entregaView.getStorePrincipal().removeAll();
            this.gastosView.getStorePrincipal().removeAll();
            this.gridActividad.getStorePrincipal().removeAll();
            this.gridMateriaPrima.getStorePrincipal().removeAll();
            this.gridOperarios.getStorePrincipal().removeAll();
            this.gastosView.getStorePrincipal().removeAll();
            this.setTitle("Adicionar documento");
            this.scope.ieCantidad.setValue(null);
        }else{
            this.valeView.getStorePrincipal().reload();
            this.entregaView.getStorePrincipal().reload();
            this.gastosView.getStorePrincipal().reload();
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
    getTitleDocumento: function (iddocumento) {
        var _this = this;
        _this.modelo.iddocumento = iddocumento;
        _this.idDocumento = iddocumento;
        this.habilitarItems();
        this.modelo.cargaInicial({
            url: 'cargarEncabezado',
            iddocumento: iddocumento
        }, function (datos) {
            _this.habilitarItems();
            var encabezado = datos[0];
            encabezado.estado = LOG.lb.documento.Estado[encabezado.estado];
            _this.setTitle(encabezado.denominacion + " # " + encabezado.numero + " del " + encabezado.fecha + " en " + encabezado.estado);
        });
    },
    habilitarItems:function(){
        this.tabPanel.get('vale').setDisabled(!(this.record && this.record.hasOwnProperty('data') && (this.record.data.estado == "3" || this.record.data.estado == "9")));
        this.tabPanel.get('entrega').setDisabled(!(this.record && this.record.hasOwnProperty('data') && (this.record.data.estado == "3" || this.record.data.estado == "9")));
        this.tabPanel.get('gasto').setDisabled(!(this.record && this.record.hasOwnProperty('data') && (this.record.data.estado == "3" || this.record.data.estado == "9")));       
    },
    getModified: function (view) {
        var _this = this;
        var records = view.getStorePrincipal().getModifiedRecords(), v = [];
        for (var i = 0; i <= records.length; i++) {
            if (!Ext.isEmpty(records[i]))
                v.push({
                   idgasto: (records[i].data.idgasto) ? records[i].data.idgasto : null,
                   idnorma: (records[i].data.idnorma != 0) ? records[i].data.idnorma : null,
                   idordenproduccion: (records[i].data.idordenproduccion) ? records[i].data.idordenproduccion : ((_this.idDocumento) ?_this.idDocumento :_this.modelo.iddocumento),
                   idtipogasto: (records[i].data.idtipogasto) ? records[i].data.idtipogasto : null,
                   valor: (records[i].data.valor) ? records[i].data.valor : null,
                   precio: (records[i].data.precio) ? records[i].data.precio : 0/*,
                   cantidadsolicitada:(records[i].data.cantidadsolicitada) ? records[i].data.cantidadsolicitada : null*/
                });
        }
        return v;
    },    
    /**
     * 
     * @param {Object} d
     * @param {Boolean} noCargar
     * @returns {undefined}
     */
    prepareDocModify: function(d, noCargar) {
        if (this.fromularioGestion) {
            this.fromularioGestion.getForm().loadRecord(d);
            if (!noCargar) {
                this.modelo.loadRecord();
            }
            this.record = d;
            this.getTitleDocumento(this.record.data.iddocumento);
        }
    },
});

Ext.ns('LOG.produccion.ordenproduccion.comun');
LOG.produccion.ordenproduccion.comun.View = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'panel',
    autoLoad: true,
    autoSelect: true,
    modoSeleccion: 3,
    gridEditable : true,
    pruneModifiedRecords: true,
    constructor: function (config) {
        this.autoSelect = true;
        this.idioma = config.idioma;
        this.busquedaBasica = true;
        this.busquedaAvanzada =  true;
        this.textBusquedaSimple = this.ttNomenclador;
        
        LOG.produccion.ordenproduccion.comun.View.superclass.constructor.call(this, config);
        this.getVistaPrincipal().setTitle(this.ttNomenclador);
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(this.width, this.height);
        this.getVistaPrincipal().setAutoScroll(true);
        this.getVistaPrincipal().aceptarFn = this.aceptarFn;
    },
    initDefaultButtons: function () {
        var _this = this;
        
       
    },
    show: function () {
        this.init();
        return this.view();
    },
    onCreate: Ext.emptyFn,
    onDelete: Ext.emptyFn
});


Ext.ns('LOG.produccion.ordenproduccion.template');
LOG.produccion.ordenproduccion.template.View = Ext.extend(Ext.grid.EditorGridPanel, {
    clicksToEdit: 1,
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
        LOG.produccion.ordenproduccion.template.View.superclass.constructor.call(this, config);
    }
});

//Ext.erp.gridActividad = Ext.extend(LOG.util.UITemplate, {
Ext.ns('LOG.produccion.ordenproduccion');
LOG.produccion.ordenproduccion.gridActividad = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'panel',
    dirController: '/logistica/produccion/produccion/index.php/ordenproduccion',
    urlBusquedaGridPrincipal: 'cargarActividades',
    autoLoad: false,
    autoSelect: true,
    modoSeleccion: 3,
    gridEditable : false,
    pruneModifiedRecords: true,
    constructor: function (config) {
        this.autoSelect = true;
        this.idioma = config.idioma;
        this.busquedaBasica = true;
       // this.textBusquedaSimple = this.ttNomenclador;
        LOG.produccion.ordenproduccion.gridActividad.superclass.constructor.call(this, config);
        this.getVistaPrincipal().setTitle(this.ttNomenclador);
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(this.width, this.height);
        this.getVistaPrincipal().setAutoScroll(true);
        this.getVistaPrincipal().aceptarFn = this.aceptarFn;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            width: 120,
            dataIndex: 'idcartatecindustrial',
            default: true
        });
        this.addGridColumn({
            width: 120,
            header:'Denominación',
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            width: 120,
            header:'Área',
            dataIndex: 'area',
            default: true
        });
        this.addGridColumn({
            width: 120,
            header:'Centro de costo',
            dataIndex: 'centrocosto',
            default: true
        });
       /*/ this.addGridColumn({
            width: 120,
            header:'Vale de entrega',
            dataIndex: 'vale',
            default: true
        });*/
    },
 
    show: function () {
        this.init();
        return this.view();
    },

   render: function(){
    var _this = this;
       var render = LOG.produccion.ordenproduccion.gridActividad.superclass.render.call(this);
        return render;
    },
    onCreate: Ext.emptyFn,
     onDelete: Ext.emptyFn
 });

Ext.ns('LOG.produccion.ordenproduccion');
LOG.produccion.ordenproduccion.gridMateriaPrima = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'panel',
    dirController: '/logistica/produccion/produccion/index.php/ordenproduccion',
    urlBusquedaGridPrincipal: 'cargarMateriaPrima',
    autoLoad: false,
    modoSeleccion: 3,
    gridEditable : true,
    scope: undefined,
    pruneModifiedRecords: true,
    constructor: function (config) {
        this.autoSelect = false;
        this.idioma = config.idioma;
        this.busquedaBasica = false;
        this.acciones = config.scope.acciones;
        console.log(config)
        LOG.produccion.ordenproduccion.gridMateriaPrima.superclass.constructor.call(this, config);
       
      
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            width: 120,
            dataIndex: 'idmateriaprima',
            default: true
        });  
       
        this.addGridColumn({
            width: 120,
            header:'Código',
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            width: 120,
            header:'Denominación',
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            width: 120,
            header:'UM',
            dataIndex: 'um',
            default: true
        });
        this.addGridColumn({
            width: 120,
            header:'Norma',
            align: 'right',
            dataIndex: 'norma',
            default: true,
            editor: new LOG.util.Prototipos.inputDecimal({value: 0}),
        });
        this.addGridColumn({
            width: 120,
            header:'Cantidad',
            dataIndex: 'cantidad',
            align: 'right',
            renderer: function(v,md,record){
                return  parseFloat(v).toFixed(6);
            }
            
        });
        this.addGridColumn({
            header: 'Cantidad solicitada',//(Norma * Cant. a Producir) / Cantidad Planificada',
            width: 110,
            align: 'right',
            dataIndex: 'cantidadsolicitada',
            default: true,  
            editor: LOG.util.Prototipos.inputDecimal({value: 0}),
            renderer: function(_v, _mD, _r) {
                if(_r.modified != null && _v == 0 ) {
                    return parseFloat(_v).toFixed(6);
                }           
                else if (_r.modified != null && _v <= _r.data.cantidadsolicitada) {
                    var cantidad = (Ext.isEmpty(_r.data.cantidadsolicitada) /*|| _r.data.cantidadsolicitada == 0*/) ? (_r.data.cantidad) : _r.data.cantidadsolicitada;          
                    _r.data.idordenproduccion = (_this.scope.record ? _this.scope.record.data.iddocumento : (_this.scope.scope.getSmPrincipal().getSelected() ? _this.scope.scope.getSmPrincipal().getSelected().data.iddocumento : _this.scope.idDocumento));  
                    _r.data.iddocumento = (_this.scope.record ? _this.scope.record.data.iddocumento : (_this.scope.scope.getSmPrincipal().getSelected() ? _this.scope.scope.getSmPrincipal().getSelected().data.iddocumento : _this.scope.idDocumento));  
                    _r.data.cantidadsolicitada = cantidad;          
                   _this.scope.modelo.adicionarProducto(_r.data);       
                    return parseFloat(cantidad).toFixed(6);;
                } else {
                    return parseFloat(_r.data.cantidadsolicitada).toFixed(6); 
                }  
            },
        });
        this.addGridColumn({
            width: 120,
            header:'Cantidades pendientes',
            dataIndex: 'pendiente',
            align: 'right',
            renderer: function(v,md,record){
                return  parseFloat(v).toFixed(6);
            }
            
        });
      /*  this.addGridColumn({
            width: 120,
            header:'Cantidad solicitada',
            dataIndex: 'cantidad',
            default: true,
            editor: LOG.util.Prototipos.inputDecimal({
                listeners: {
                    focus: function (t) {
                        t.selectText(0, t.getValue().length);
                    },
                }
            })
          
        });*/
        /*this.addGridColumn({
            width: 120,
            header:'Disponibilidad',
            dataIndex: 'disponible',
            align: 'right'
            
        });*/
        this.addGridColumn({
            width: 120,
            header:'Cant.entregada',
            dataIndex: 'cantentregada',
            align: 'right'
            
        });
        this.addGridColumn({
            width: 120,
            header:'Vale de entrega',
            dataIndex: 'vale',
            default: true, 
            align: 'right'
          
        });
        this.addGridColumn({
            width: 120,
            header:'Vale de devolución',
            dataIndex: 'valedev',
            default: true, 
            align: 'right'
         
        });

        this.addGridColumn({
            dataIndex: 'idproducto',   
        });
        this.addGridColumn({
            dataIndex: 'idactividad',   
        });
        this.addGridColumn({
            dataIndex: 'existencia',   
        });
        this.addGridColumn({
            dataIndex: 'idindicador',   
        });
        this.addGridColumn({
            dataIndex: 'idordenmateriales',   
        });
        this.addGridColumn({
            dataIndex: 'idordenproductosust',   
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        _this.addToolbarButton(
            LOG.util.Prototipos.botonNuevo({
            text: 'Adicionar Producto',    
            hidden: !_this.grantedAction('AdMatPrim') ,
            handler: function () {
            _this.onAdicionar()
            },
            controlFn: function (b, _caller) {
                if ((_caller.grantedAction('CT') || _caller.grantedAction('AdMatPrim'))) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.setDisabled(!(this.getCount() == 1 && this.getSelected().data.estado == 2));
                        }
                    }, 'nuevo');
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.setDisabled((_this.scope.scope.winGestionarDocumento.record && _this.scope.scope.winGestionarDocumento.record.data.iddocumento != null && _this.scope.scope.winGestionarDocumento.record.data.estado != 9) ? false : true);
                        }
                    }, 'imprimir');
                    LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            b.setDisabled((_this.scope.scope.winGestionarDocumento.record && _this.scope.scope.winGestionarDocumento.record.data.iddocumento != null && _this.scope.scope.winGestionarDocumento.record.data.estado != 9) ? false : true);
                        }
                    }, 'imprimir'); 

                } else {
                    b.setVisible(false);
                    
                }
            }
            // controlFn: function (b, _caller) {
            //     LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function (e) {
            //         if (e == 'selectionchange') {
            //             b.setDisabled((_this.scope.scope.winGestionarDocumento.record && _this.scope.scope.winGestionarDocumento.record.data.iddocumento != null && _this.scope.scope.winGestionarDocumento.record.data.estado != 9) ? false : true);
            //         }
            //     }, 'imprimir');
            //     LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
            //         if (e == 'load') {
            //             b.setDisabled((_this.scope.scope.winGestionarDocumento.record && _this.scope.scope.winGestionarDocumento.record.data.iddocumento != null && _this.scope.scope.winGestionarDocumento.record.data.estado != 9) ? false : true);
            //         }
            //     }, 'imprimir');      
            // // }
        })
    );


        _this.addToolbarButton(LOG.util.Prototipos.botonEliminar({  
            tooltip: _this.idioma.lbTtBtnEliminar,
            text: _this.idioma.lbBtnEliminar,
            disabled: false,
             hidden: !_this.grantedAction('RmpEliminar') ,
            
            handler: function () {
                    if(_this.getSmPrincipal().getSelected()){
                        var valor = _this.getSmPrincipal().getSelected().get('idordenproductosust');
                             if (   valor != 0) {
                                 _this.onDelete();
                             }           
     
                     }
                
            },
            controlFn: function (b, _caller) {
                var _this = this ;
                if ((_caller.grantedAction('CT') || _caller.grantedAction('RmpEliminar'))) {
                    b.setVisible(true);

                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && (_this.scope.scope.winGestionarDocumento.record &&_this.scope.scope.winGestionarDocumento.record.data.estado != 9)) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                   
                } else {
                    b.setVisible(false);
                    
                }
         
                
                
            }
        }));

       _this.addToolbarButton('->');
        _this.addToolbarButton(new Ext.form.Label({
            text: 'Depósito:'
        }));
        _this.addToolbarButton(this.cmbAlmacen = new LOG.util.ComboBox({
            name: 'idalmacendorigen',
            hiddenName: 'idalmacen',
            displayField: 'denominacion',
            valueField: 'idalmacen',
            autoLoad: true,
            width: 200,
            pageSize: 10,
            allowBlank: true,
            disabled: true,
            campo: true,
            mode: 'local',
            url: '/logistica/produccion/maestros/configuracion/index.php/configuracionprod/depositosconfigurados',
            baseParams:{
                tipoalmacen:1,
                start:0,
                limit:100,
                filtrar:1
            },
            listeners: {
                select: function (cmb, rd) {
                    _this.getGridPrincipal().getStore().load({
                        params: {
                            idalmacenorigen: cmb.getValue() ? cmb.getValue() : -1
                        }
                       
                    });
                    if(cmb.getValue() != -1){
                        _this.botonNuevaSol.enable();
                    }
                }
            },
                controlFn: function (b, _caller) {
                    if (_this.scope.scope.grantedAction('CT') || _this.scope.scope.grantedAction('GSolEntrega')) {
                        b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                        if ((e == 'load')) {   
                            if ((_this.scope.record) && (_this.scope.record.data.estado == 3)) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'solicitudentrega');
                }  else {
                    b.setVisible(false);
                }
                   
                }
        }));
        _this.addToolbarButton('');
       
        _this.addToolbarButton(this.botonNuevaSol = LOG.util.Prototipos.botonNuevo({
            text: 'Generar solicitud',
            tooltip: 'Crear solicitud de entrega',
            disabled: true,
            handler: function () {
                var cantidades  = new Array();
                var storeMaterias = _this.getStorePrincipal().getModifiedRecords();
                var selecciones = _this.getSmPrincipal().getSelections();

                if (selecciones) {
                    Ext.each(selecciones, function(rec){  
                        if (rec.data.cantidadsolicitada > 0 && rec.data.idproducto != 0 /*&& parseInt(rec.data.cantidadsolicitada) <= rec.data.existencia*/ && (_this.storePrincipal.getModifiedRecords().length == 0)) {
                            cantidades.push({
                                cantidad: rec.data.cantidadsolicitada,
                                idproducto: rec.data.idproducto
                            });
                        } else{
                            if(_this.storePrincipal.getModifiedRecords().length != 0){
                            mostrarMensaje(1, 'Debe guardar la nueva cantidad solicitada.');
                            }
                         //mostrarMensaje(1, 'No existe disponibilidad para la(s) cantidad(es) de la(s) materia(s) prima(s) solicitada(s).');        
                        }
                         
                    });
                    
                }    
                if (cantidades.length > 0 ) {
                    mostrarMensaje(2, _this.idioma.msgAdicionarSolicitud, function (btn) {
                        if (btn == 'ok') {
                          
                            Ext.MessageBox.wait(_this.idioma.msgAdicionandoSolicitud, _this.idioma.msgEspere || '...');
                            Ext.Ajax.request({ 
                                url: '/logistica/produccion/produccion/index.php/ordenproduccion/adicionarSolicitudEntrega',
                        
                                method: 'POST',
                                params: {
                                    idestructuracomun: _this.cmbAlmacen.getValue(),
                                    idalmacenorigen: _this.scope.gridActividad.smGridPrincipal.getSelected().json.idcentrocosto,
                                    idactividad:_this.scope.gridActividad.smGridPrincipal.getSelected() ?_this.scope.gridActividad.smGridPrincipal.getSelected().json.idcartatecindustrialactividad: 0,
                                    idordenproduccion: (_this.scope.record) ? _this.scope.record.data.iddocumento : (_this.scope.smGridPrincipal.getSelected() ? _this.scope.smGridPrincipal.getSelected().data.idordenproduccion : -1),
                                    actividades: true,
                                    idvaleproduccion: _this.scope.valeView.smGridPrincipal.getSelected() ? _this.scope.valeView.smGridPrincipal.getSelected().json.idvaleproduccion:0,
                                    idproductos: Ext.encode(cantidades)/*(_this.scope.record) ? _this.scope.record.data.cantsolicitada : (_this.scope.smGridPrincipal.getSelected() ? _this.scope.smGridPrincipal.getSelected().data.cantsolicitada : -1)*/
                                },
                                callback: function (o, s, r) {
                                    Ext.MessageBox.hide();
                                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                    if (resp.success) {
                                        if (s) {
                                            mostrarMensaje(1, 'La Solicitud de Entrega #'+resp.numeroref+' con fecha '+resp.fechacontable+' se ha creado correctamente');
                                            cantidades = 0;
                                            _this.getStorePrincipal().reload();
                                        }
                                    } else {
                                        if (resp.codigoMsg == 'unique_violation') {
                                            mostrarMensaje(3, 'Error:Los datos a guardar ya existen.');
                                        } else if (resp.codigoMsg == 'not_null_violation') {
                                            mostrarMensaje(3, 'Error:Hay datos con valores incorrectos o vacios.');
                                        } else if (resp.codigoMsg == 'foreign_key_violation') {
                                            mostrarMensaje(3, 'Error:Hay datos inconsistentes.');
                                        } else {
    
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
            },
            controlFn: function (b, _caller) {
                if (_this.scope.scope.grantedAction('CT') || _this.scope.scope.grantedAction('GSolEntrega')) {
                    b.setVisible(true);
                LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                    if ((e == 'load')) {   
                        if ((_this.scope.record) && (_this.scope.record.data.estado == 3) && (_this.cmbAlmacen.getValue()) && (_this.cmbAlmacen.getValue() != -1)) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'solicitudentrega');
            }  else {
                b.setVisible(false);
            }
               
            }
        }));
      
        _this.addToolbarButton('');
    },
    render: function () {
        var _this = this;
        var p = LOG.produccion.ordenproduccion.comun.View.superclass.render.call(this);                
        LOG.util.UIManager.encadenaFn(this.getGridPrincipal(), 'fireEvent', function (eventName, eventObject) {
            if(eventObject.field == 'cantsolicitada'){
                if (eventName == 'beforeedit') {
                    if (_this.record && _this.record.data.estado != 1) {
                        eventObject.cancel = true;
                    } else {
                        eventObject.cancel = false;
                    }
                }
                if (eventName == 'validateedit') {
                    if( eventObject.value > parseFloat(eventObject.record.data.cantidad) && eventObject.value != 0){
                        mostrarMensaje(3,"La cantidad solicitada tiene que ser menor que la cantidad a consumir.");
                        eventObject.cancel = true;
                        return false;            
            
                    }
                    /*if( rd.record.data.cantidad >= (rd.record.data.norma * _this.scope.ieCantidad.getValue())){
                        mostrarMensaje(3,"La cantidad a consumir tiene que ser mayor que la (Norma * Cantidad a producir).");
                        rd.cancel = true;
                        return false;            
            
                    }*/
                }
                if (eventName == 'afteredit') {
                    _this.modelo.adicionarProducto(eventObject.record.data);
                    if (_this.storePrincipal.getModifiedRecords().length > 0) {
                        _this.botonNuevaSol.disable();
                    }
                    console.log(eventObject);
                    //_this.btnSalvar.enable();
                }
            }
            
            if (eventObject.field == 'norma') {
                if (eventName == 'afteredit') {
                    console.log(eventObject);
                    // var index = _this.scope.materialesView.getStorePrincipal().find('idordenproductosust', eventObject.record.get('idordenproductosust'));
                    // var index = _this.scope.materialesView.getStorePrincipal().find('idproducto', eventObject.record.get('idproducto'));
                    // if (index !== -1) {
                    //     _this.scope.materialesView.getStorePrincipal().getAt(index).set('norma', eventObject.value);
                    // }

                    if(_this.scope.materialesView.getStorePrincipal().getModifiedRecords()){
                         if(_this.storePrincipal.getModifiedRecords().length > 0){
                            _this.scope.btnSalvar.enable();
                        }
                       
                     } else{
                      _this.scope.btnSalvar.disable();
                     }
                }
                if (eventName == 'beforeedit') {
                    console.log(eventObject);
                   var variable =_this.scope.materialesView.getStorePrincipal().find('idordenproductosust', eventObject.record.get('idordenproductosust'));
                    if (variable >= 0) { //eventObje(ct.record.get('idordenproductosust')!=0)

                            eventObject.cancel = false;
                               
                    } /* else {
                        eventObject.cancel = true;
                    } */
                }
                
                
            }
            ///
            
        }, 'ACTIVATEBTN'); 
        Ext.apply(this.gpPrincipal, {
            viewConfig: {
                getRowClass: function(rec, index, rowParams, store) {
                    if( rec.data.idproducto == 0 ) {
                        return 'redrow-text';
                    } else 
                    if(parseFloat(rec.data.cantentregada) > parseFloat(rec.data.cantidad)){
                    return 'yelowgreen-text';
                  }
                  else  
                   return 'greenrow-text'; 
                } 
            }
        });
        return p;
    },
    
    show: function () {
        this.init();
        return this.view();
    },
    grantedAction: function(idAccion) {
        var existe = false;
        Ext.each(this.acciones, function(a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    generarSolicitud: function(datos) {
        var _this = this;

        mostrarMensaje(2, _this.idioma.msgAdicionarSolicitud, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(_this.idioma.msgAdicionandoSolicitud, _this.idioma.msgEspere || '...');
                Ext.Ajax.request({
                    url: '/logistica/produccion/produccion/index.php/ordenproduccion/adicionarSolicitudEntrega',
                    method: 'POST',
                    params: {
                        idestructuracomun: _this.cmbAlmacen.getValue(),
                         idalmacenorigen: _this.scope.gridActividad.smGridPrincipal.getSelected().json.idcentrocosto,
                        datosSolicitud: Ext.encode(datos),
                        idordenproduccion:  (_this.record) ? _this.record.data.iddocumento : (_this.idDocumento)?_this.idDocumento : _this.scope.getSmPrincipal().getSelected().data.iddocumento
                       
                    },
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, 'La Solicitud de Entrega #'+resp.numeroref+' con fecha '+resp.fechacontable+' se ha creado correctamente');
                                _this.getStorePrincipal().reload();
                            }
                        } else {
                            if (resp.codigoMsg == 'unique_violation') {
                                mostrarMensaje(3, 'Error:Los datos a guardar ya existen.');
                            } else if (resp.codigoMsg == 'not_null_violation') {
                                mostrarMensaje(3, 'Error:Hay datos con valores incorrectos o vacios.');
                            } else if (resp.codigoMsg == 'foreign_key_violation') {
                                mostrarMensaje(3, 'Error:Hay datos inconsistentes.');
                            } else {

                            }
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    }.createDelegate(this)
                });
            }  
        }.createDelegate(this));                 
    },
    habilitarBotones: function () {
        var _this = this;
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            //this.getVistaPrincipal().listaBotones.getItem(2).enable();
            _this.scope.btnSalvar.enable();
        }
    },
   
    onAdicionar: function (b,_caller) {
        var _this = this;
        var objSubmit = {};
        console.info(_this)
        var arrayNotInidnaturaleza = new Array();
        arrayNotInidnaturaleza.push(-8,-7);
        var _p = new LOG.lb.documento.VentanaProductos({
            idioma: _this.idioma,
            _parent: _this,
            usarFiltroArea: false,
            usarFiltroDeposito: true,
            parametros: { 
                
                idseleccionados: Ext.encode(_this.getStorePrincipal().collect('idproducto')),
                identidad: idEntidad,
               
            },
            doAction: function (r) {
        
                var record = [];
                var listaProd = new LOG.util.List();
                var _idproductos = [];
                Ext.each(r, function (obj) {
                    console.log(obj);
                    var objSi = obj;
                    record.push(objSi);
                    listaProd.add(objSi.data);
                    _idproductos.push(obj.json.idproducto)
                });
                _this.addProductos(listaProd.arrayData,_this);
                
                
            },
           postSalvar: function (r, _idProdSelecc) {
            if (_this.record == null) {
                _this.record = {};
                Ext.apply(_this.record, {
                    data: {
                        cant_productos: r.cantproductos,
                        cant_clientes: r.cantclientes
                    }
                });
            } else {
                _this.record.data.cant_productos = r.cantproductos;
                _this.record.data.cant_clientes = r.cantclientes;
            }

            _this.getStorePrincipal().load();
            _this.model.getStore().reload();

            if (_p) {
             _p.getStorePrincipal().reload(
             _p.getStorePrincipal().initBaseParams.idseleccionados = Ext.encode(Ext.decode(_p.getStorePrincipal().baseParams.idseleccionados).concat(_idProdSelecc)),
            _p.getStorePrincipal().baseParams.idseleccionados = Ext.encode(Ext.decode(_p.getStorePrincipal().baseParams.idseleccionados).concat(_idProdSelecc))
                                );
                 }
            }
        });
        _p.init();
        _p.urlBusquedaGridPrincipal = '/logistica/produccion/produccion/index.php/ordenproduccion/cargarproductos'
        _this.vistaProductos = _p.view();
        _this.vistaProductos.show();
    }, 

    addProductos:function (prodcutos,parent){ 
        var _this = this;
       Ext.MessageBox.wait('Adicionando producto...', 'Por favor espere...' || '...');
       Ext.Ajax.request({
           url: '/logistica/produccion/produccion/index.php/ordenproduccion/adicionarProductosExtrasOrden',
           method: 'POST',
              params: {                
              idordenproduccion:_this.getStorePrincipal().initBaseParams.idordenproduccion,
               productos: Ext.encode(prodcutos),
               idactividad : _this.getStorePrincipal().initBaseParams.arrayActividad,
           },
           callback: function (o, s, r) {
               Ext.MessageBox.hide();
               var resp = LOG.util.UIManager.decodeAjaxResponse(r);
               if (resp.success) {
                   _this.getStorePrincipal().load();
                   _this.scope.materialesView.getStorePrincipal().load();
                   mostrarMensaje(1, 'El(Los) producto(s) ha(n) sido adicionado(s) satisfactoriamente.');
               } else {
                   if (resp.codigoMsg == 'unique_violation') {
                       mostrarMensaje(3, 'Error:Los datos a guardar ya existen.');
                   } else if (resp.codigoMsg == 'not_null_violation') {
                       mostrarMensaje(3, 'Error:Hay datos con valores incorrectos o vacios.');
                   } else if (resp.codigoMsg == 'foreign_key_violation') {
                       mostrarMensaje(3, 'Error:Hay datos inconsistentes.');
                   } else {
                       mostrarMensaje(1, 'Error al adicionar el elemento seleccionado');
                   }
               }
               if (typeof _fn == 'function') {
                   _fn.createDelegate(this, [resp]).call();
               }
           }.createDelegate(this)
       });
   },
  
    onDelete:function(b,_caller){
        var _this = this;
            mostrarMensaje(2, '¿Está seguro que desea eliminar la(s) materia(s) prima(s) seleccionada(s)?', function (btn) {
                if (btn == 'ok') {
                    Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                    Ext.Ajax.request({
                        url: '/logistica/produccion/produccion/index.php/ordenproduccion/eliminarProductosExtrasOrden',
                        method: 'POST',
                        params: {
                            idordenproduccion: _this.getStorePrincipal().initBaseParams.idordenproduccion,
                            idordenproductosust: _this.getSmPrincipal().getSelected().get('idordenproductosust'),
                            idactividad : _this.getStorePrincipal().initBaseParams.arrayActividad,
                        },
                        callback: function (o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success) {
                                _this.getStorePrincipal().load();
                                if (s) {
                                    mostrarMensaje(1, 'La(Las) materia(s) ha(n) sido eliminada(s) satisfactoriamente.');
                                }
                            } else {
                                if (resp.codigoMsg == 'unique_violation') {
                                    mostrarMensaje(3, 'Error:Los datos a guardar ya existen.');
                                } else if (resp.codigoMsg == 'not_null_violation') {
                                    mostrarMensaje(3, 'Error:Hay datos con valores incorrectos o vacios.');
                                } else if (resp.codigoMsg == 'foreign_key_violation') {
                                    mostrarMensaje(3, 'Error:Hay datos inconsistentes.');
                                } /*else {
                                    mostrarMensaje(1, 'Error al eliminar el elemento seleccionado');
                                }*/
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }.createDelegate(this)
                    });
                }
            }.createDelegate(this));
        

    },
    onCreate: Ext.emptyFn,
    //onDelete: Ext.emptyFn
});

Ext.ns('LOG.produccion.ordenproduccion');
LOG.produccion.ordenproduccion.gridOperarios = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'panel',
    dirController: '/logistica/produccion/produccion/index.php/ordenproduccion',
    urlBusquedaGridPrincipal:'cargarPersonas',
    autoLoad: true,
    autoSelect: true,
    modoSeleccion: 3, 
    gridEditable : false,
    scope: undefined,
    constructor: function (config) {
        this.autoSelect = true;
        this.idioma = config.idioma;
        this.busquedaBasica = false;
        LOG.produccion.ordenproduccion.gridOperarios.superclass.constructor.call(this, config);
       
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idpersona',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idoperarioactividad',
            hidden: true
        });
        this.addGridColumn({
            header: 'CI',
            width: 120,
            dataIndex: 'numid',
            default: true
        });
        this.addGridColumn({
            header: 'Nombre',
            width: 250,
            dataIndex: 'nombreapellidos',
            id: 'nombreapellidosCA',
            default: true
        });
        this.addGridColumn({
            header: 'Cargo',
            width: 200,
            dataIndex: 'cargo',
            id: 'denominacionCA',
            default: true
        });
        /*this.addGridColumn({
            header: 'Cantidad',
            width: 200,
            dataIndex: 'cantidad',
            id: 'cantidad',
            default: true
        });*/
    },
    initDefaultButtons: function () {
        var _this = this; 
        _this.addToolbarButton('');

        _this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'adicionar',
            disabled: true,
            text:'Adicionar',
            tooltip: this.idioma.ttBtnAdicionarOperario,
            handler: function () { 
              var venta = new LOG.produccion.ordenproduccion.GridSelectPersona({
                    modelo: _this.modelo,
                   scope: _this.scope,
                }); 
                venta.init();
                venta.view();
                venta.getStorePrincipal().load();
                venta.getVistaPrincipal().aceptarFn = function (r) {
                    var arrayPersonas = new Array();
                    var seleccionados = venta.getSmPrincipal().getSelections();
                    Ext.each(seleccionados, function (rec) {
                        arrayPersonas.push({
                            idcliente: rec.get('idpersona')
                        });
                    });
                    _this.adicionarPersona({
                        personas: Ext.encode(arrayPersonas),
                        idactividad:_this.scope.gridActividad.smGridPrincipal.getSelected() ?_this.scope.gridActividad.smGridPrincipal.getSelected().json.idcartatecindustrialactividad: 0,
                        idordenactividad: (_this.scope.record) ? _this.scope.record.data.iddocumento : (_this.scope.smGridPrincipal.getSelected() ? _this.scope.smGridPrincipal.getSelected().data.idordenproduccion : -1)
                    });
                }
            },
            
            controlFn: function (b, _caller) {
                b.enable();
            if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
               b.setVisible(true);
            b.enable();
                } else 
                b.setVisible(true);
             }
        }));
      
        this.addToolbarButton(this.botonEliminar = LOG.util.Prototipos.botonEliminar({
            disabled: true,
            handler: function () {
                //this.onDelete.call(this);
                mostrarMensaje(2, '¿Está seguro que desea eliminar el (los) operario(s) seleccionado(s)?', function (btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait('Eliminando operario(s)...', 'Por favor espere' || '...');
                        Ext.Ajax.request({
                            url: '/logistica/produccion/produccion/index.php/ordenproduccion/eliminarOperario',
                            method: 'POST',
                            params: {
                                id: _this.smGridPrincipal.getSelected().json.idpersona
                            },
                            callback: function (o, s, r) {
                                Ext.MessageBox.hide();
                                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                                if (resp.success) {
                                    if (s) {
                                        mostrarMensaje(1, 'El(Los) operarios(s) ha(n) sido eliminado(s) satisfactoriamente.');
                                        _this.storePrincipal.reload();
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
            },
         controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        b.setDisabled(this.getCount() < 1);
                    }
                }, 'eliminar');
            }
        }));
        
    },
    
     
    render: function () {
        var _this = this;
        var vista = LOG.produccion.ordenproduccion.gridOperarios.superclass.render.call(this);
        
        return vista;

    },
    setOrdenActividad: function (idordenactividad) {
        this.idordenactividad = idordenactividad;
    },
    getOrdenActividad: function () {
        return this.idordenactividad;
    }, 
    
    adicionarPersona: function (parametros, _fn) {
        var _this = this;
        Ext.MessageBox.wait(_this.idioma.msgSalvandoObjeto, _this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
       // objSubmit.id = (objSubmit.iddocumento) ? Ext.encode([objSubmit.iddocumento]) : Ext.encode(_this.getSelectedId());
        Ext.Ajax.request({
            url: '/logistica/produccion/produccion/index.php/ordenproduccion/adicionarPersona',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);

                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1,'El (los) operario(s) ha(han) sido adicionado(s) satisfactoriamente');
                        _this.storePrincipal.reload();
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    show: function () {
        this.init();
        return this.view();
    },
    onCreate: Ext.emptyFn,
    onDelete: Ext.emptyFn
});

LOG.produccion.ordenproduccion.GridSelectPersona = Ext.extend(LOG.util.UITemplate, {
    idArea: '',
    //scope = undefined,
    constructor: function (config) {
        this.idArea = config.idArea;
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = false;
        this.scope = undefined
        this.dirController = '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres';
        config.urlBusquedaGridPrincipal = 'cargarPersonasAreaInterna';
        this.busquedaBasica = true;
        this.idioma = config.idioma;
        LOG.produccion.ordenproduccion.GridSelectPersona.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = 'Adicionar personas';
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idpersona',
            hidden: true
        });
        this.addGridColumn({
            header: 'Codigo',
            width: 120,
            dataIndex: 'numid',
            default: true
        });
        this.addGridColumn({
            header: 'Nombre',
            dataIndex: 'nombreapellidos',
            id: 'nombreapellidosCA',
            default: true
        });
        this.addGridColumn({
            header: 'Cargo',
            width: 200,
            dataIndex: 'denomcargo',
            id: 'denominacionCA',
            default: true
        });

    },
 
    render: function () {
        var _this = this;
        var vista = LOG.produccion.ordenproduccion.GridSelectPersona.superclass.render.call(this);
        this.storePrincipal.on('beforeload', function (store) {
            store.initBaseParams = {
                idarea: _this.idArea
            };
        });
        
        this.gpPrincipal.autoExpandColumn = 'nombreapellidosCA';
        return vista;
    }
});

