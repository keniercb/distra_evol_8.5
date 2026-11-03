Ext.ns('Ext.erp.analizador');
Ext.erp.analizador = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
   
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/analizador';
        config.urlBusquedaGridPrincipal = 'cargarDatos';
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        _this.tiposmedios = 3;
        config.idioma = {};
        Ext.erp.analizador.superclass.constructor.call(this, config);
        //LOG.util.UIManager.apply(this.idioma, LOG.aft.analizador.Idioma);
        _this.concepto = '';
        _this.textBusquedaSimple = ''/*this.idioma.txtBusquedaSimple*/;
    },



    initDefaultColumns: function () {
        this.addGridColumn({
            header: 'Denominación',
            width: 350,
            dataIndex: 'nombre',
            default: true,
            renderer: function(value,metadata,record){
            console.info(record)
            var newStr= '<b>Detalles:</b></br>'+record.json['detalles']
            metadata.tdAttr = 'data-qtip="' + newStr + '"';
            metadata.attr = 'ext:qtip="' + newStr + '"';
            return value;
        }        
        });
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: 'Cantidad',
            width: 100,
            dataIndex: 'cantidad',
            align: 'right',
            default: true
        }));
        this.addGridColumn({
            dataIndex: 'id',
            default: false,
            hidden: true
        });
    },
    init: function () {
        var _this = this;
        Ext.erp.analizador.superclass.init.call(this);
        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {
            Ext.apply(_this.gpPrincipal, {
                viewConfig: {
                    getRowClass: function (rec, index, rowParams, store) {
                        if (rec.data.cantidad > 0) {
                            return 'redrow-text';
                        } else {
                            return 'greenrow-text';
                        }
                    }}
            });
            _this.panelActivos = new Ext.erp.analizador.panelactivos({
                idioma: this.idioma,
                panelActivos : this,
                _parent: _this
            });
            _this.panelActivos.init();
            var vistaActivos = _this.panelActivos.view();
            _this.panelDerecho = LOG.util.UIManager.initPanel({
                title: 'Productos',
                width: window.innerWidth / 2,
                layout: 'fit',
                region: 'east',
                animCollapse: false,
                collapsible: true,
                collapsed: false,
                split: true,
                titleCollapse: true,
                collapseMode: 'mini',
                items: [vistaActivos]
            });
            _this.getPanelGrid().add(_this.panelDerecho);

            _this.panelActivos.getStorePrincipal().on({
                'beforeload': function () {
                    if (_this.getSmPrincipal().getSelected()) {
                        console.info( _this.panelActivos.tfBusqueda.getValue());
                        this.initBaseParams.idmedidor =  _this.getSmPrincipal().getSelected().data.id,
                        this.initBaseParams.criterio = _this.panelActivos.tfBusqueda.getValue()
                    } else {
                        this.initBaseParams.idmedidor = -1;
                        this.initBaseParams.criterio = -1
                    }

                    if (_this.getSmPrincipal().getSelected()) {
                        if(_this.getSmPrincipal().getSelected().data.id == 6){

                            console.info( _this.panelActivos.cmGridPrincipal)
                            _this.panelActivos.cmGridPrincipal.config[1].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[2].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[3].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[4].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[5].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[6].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[7].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[8].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[9].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[10].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[11].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[12].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[13].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[14].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[15].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[16].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[17].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[18].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[18].width = 50;

                           /* _this.panelActivos.cmGridPrincipal.config[11].width = 50;
                            _this.panelActivos.cmGridPrincipal.config[12].width = 50;
                            _this.panelActivos.cmGridPrincipal.config[13].width = 50;
                            _this.panelActivos.cmGridPrincipal.config[14].width = 50;
                            _this.panelActivos.cmGridPrincipal.config[15].width = 50;
                            _this.panelActivos.cmGridPrincipal.config[16].width = 50;
                            _this.panelActivos.cmGridPrincipal.config[16].width = 90;
                            _this.panelActivos.cmGridPrincipal.config[17].width = 120;*/

                        }else{
                            _this.panelActivos.cmGridPrincipal.config[11].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[12].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[13].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[14].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[15].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[16].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[17].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[18].hidden = true;

                            _this.panelActivos.cmGridPrincipal.config[1].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[2].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[3].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[4].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[5].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[6].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[7].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[8].hidden = false;
                            _this.panelActivos.cmGridPrincipal.config[9].hidden = false;
                            
                   
                        }
                        this.initBaseParams.idmedidor =  _this.getSmPrincipal().getSelected().data.id
                    } else {
                        this.initBaseParams.idmedidor = -1;
                    }
                }
            });
            _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                if (e == 'selectionchange' && this.getCount() == 1) {
                    console.info(_this)
                   _this.panelActivos.gpPrincipal.filters.clearFilters();
                    _this.panelActivos.getStorePrincipal().load();
                } else {
                    _this.panelActivos.getStorePrincipal().removeAll();
                    _this.panelActivos.getGridPrincipal().getView().refresh();
                }
            });

        });
    },
    render: function () {
        var _this = this;
        var vista =  Ext.erp.analizador.superclass.render.call(this);
     
        this.getStorePrincipal().load();
        return vista;
    },
    
    onLoadMask: function(msg) {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: msg});
        myMask.show();
    },
    onUnMask: function() {
       var myMask = new Ext.LoadMask(Ext.getBody());
       myMask.hide();
    }
  
});


Ext.erp.analizador.panelactivos = Ext.extend(LOG.util.UITemplate, {
    _parent: undefined,
    idmedidor: undefined,
    constructor: function (config) {
        var _this = this;
        this.autoShow = true;
        this.concepto = 'productos';
        this.busquedaBasica = false;
        this.autoLoad = false;
        this.autoSelect = true;
        this.idioma = config.idioma;
        this.dirController = '/logistica/inventario/recuperaciones/index.php/analizador';
        this.urlBusquedaGridPrincipal = 'getActivosByMedidor';
        this.idGridPrincipal = 'idproducto';
        this.modoSeleccion = 1;
        this.formaVisualizacion = 'panel';
        Ext.erp.analizador.panelactivos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idproducto'
        });
        this.addGridColumn({
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            dataIndex: 'iddeposito'
        });
        this.addGridColumn({
            header: 'C&oacute;digo',
            width: 100,
            dataIndex: 'codigo',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'codigo'
            }
        });
        this.addGridColumn({
            header: 'Denominaci&oacute;n',
            width: 210,
            dataIndex: 'denominacion',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });
        this.addGridColumn({
            header: 'UM',
            width: 100,
            dataIndex: 'um',
            default: true,
           
        });
        this.addGridColumn({
            header: 'Naturaleza',
            width: 100,
            dataIndex: 'naturaleza',
            default: true,
            filter: {
                type: 'combo',
                dataIndex: 'naturaleza',
                valueField: 'idnaturaleza',
                url: '/logistica/activos_fijos/movimiento/index.php/movimiento/getNaturaleza',
                displayField: 'denominacion'
            }
        });
        this.addGridColumn({
            header: 'Disponible',
            width: 100,
            dataIndex: 'disponible',
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                }
           
        });
        this.addGridColumn({
            header: 'Existencia',
            width: 100,
            dataIndex: 'existencia',
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                }
        });
        this.addGridColumn({
            header: 'Precio',
            width: 100,
            dataIndex: 'precio',
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                }
        });
        this.addGridColumn({
            header: 'Importe',
            width: 100,
            dataIndex: 'importe',
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                }
        });
        this.addGridColumn({
            header: 'Clasificaci&oacute;n contable',
            width: 100,
            dataIndex: 'clasificacioncontable',
            default: true,
            // filter: {
            //     type: 'combo',
            //     dataIndex: 'responsable',
            //     valueField: 'idresponsable',
            //     displayField: 'responsable',
            //     url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getResponsables'
            // }
        });
        this.addGridColumn({
            header: 'Depositos',
            dataIndex: 'deposito',
            width: 220,
            agrupador:true,
            hidden: true,
            default: true
        });

        this.addGridColumn({
            header: 'Cantidad de documentos',
            dataIndex: 'cantdocumentos',
            width: 220,
            agrupador:true,
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                },
        });

        this.addGridColumn({
            header: 'Cant. Elaboración',
            dataIndex: 'cantelaboracion',
            width: 220,
            agrupador:true,
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                },
        });
        this.addGridColumn({
            header: 'Cant. Preparado',
            dataIndex: 'cantpreparado',
            width: 220,
            agrupador:true,
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                },
        });
        this.addGridColumn({
            header: 'Aprobados no cumplimentados',
            dataIndex: 'aprobadosnocumplimentados',
            width: 220,
            agrupador:true,
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                },
        });
        this.addGridColumn({
            header: 'Cant.de productos',
            dataIndex: 'cantproductos',
            width: 220,
            agrupador:true,
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                },
        });
        this.addGridColumn({
            header: 'Importe inmovilizado',
            dataIndex: 'importeinmovilizado',
            width: 220,
            agrupador:true,
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                },
        });

        this.addGridColumn({
            header: 'Importe inventario',
            dataIndex: 'importeinventario',
            width: 220,
            agrupador:true,
            default: true,
            align: 'right',
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                },
        });

        this.addGridColumn(new Ext.ux.grid.ProgressColumn({
            header:'%',
            width: 300,
            dataIndex: 'porciento',
            align: 'center',
            textPst: '%',
            actionEvent: 'click',
            //precision: 2
        }));
        
this.onGridDobleClick = function () {
    if(_this._parent.getSmPrincipal().getSelected().data.id == 6){
        var winVentana = new Ext.erp.analizador.WinDocumentosyProductos({
            idioma: _this.idioma,
            _parent: _this,
            windocprod : this,
        });
    
    
    winVentana.init();
    _this.vistaVentana = winVentana.view();
    _this.vistaVentana.show();
    }

};
    },
    
    initDefaultButtons: function () {
        var _this = this;
   
        
   this.addToolbarButton(this.tfBusqueda = new Ext.form.TextField({
    width: 200,
    maxLength: 35,
    hidden:true,
    enableKeyEvents: true,
    emptyText: 'Denominaci\xf3n',
       listeners: {
        'specialkey': function(cmp, e) {
            if (e.getKey() == Ext.EventObject.ENTER) {
                _this.btnBuscarProductos();
            }
        }
    },
    controlFn: function (b, _caller) {
        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
            console.info(e)
            if (e == 'rowselect') {
                if (this.getCount() == 1 && _this._parent.getSmPrincipal().getSelected().data.id != 6) {
                    b.enable();
                    
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                    b.disable();
                }
            }
        });
    }
}));
this.addToolbarButton( new LOG.util.Prototipos.botonBuscar({
    text: 'Buscar',
    tooltip: 'Buscar',
    hidden:true,
    handler: function() {
        _this.btnBuscarProductos();
     },
     controlFn: function (b, _caller) {
        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
            console.info(e)
            if (e == 'rowselect') {
                if (this.getCount() == 1 && _this._parent.getSmPrincipal().getSelected().data.id != 6) {
                    b.enable();
                    
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                    b.disable();
                }
            }
        });
    }
}));

this.addToolbarButton('-');
this.addToolbarButton(LOG.util.Prototipos.botonLimpiar({
    tooltip: 'Limpiar',
    text: 'Limpiar',
    hidden:true,
    handler: function () {
        _this.btnLimpiar();
     },
    controlFn: function (b, _caller) {
        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
            console.info(e)
            if (e == 'rowselect') {
                if (this.getCount() == 1 && _this._parent.getSmPrincipal().getSelected().data.id != 6) {
                    b.enable();
                    
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                    b.disable();
                }
            }
        });
    }
}));
this.addToolbarButton(LOG.util.Prototipos.botonAbrir({
    tooltip: 'Abrir para ver documentos',
    hidden:true,
    scope: this,
    handler: function () {
        _this.onGridDobleClick();
    },
    controlFn: function (b, _caller) {
        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
            if (e == 'selectionchange') {
                if (this.getCount() == 1 && _this._parent.getSmPrincipal().getSelected().data.id == 6) {
                    b.enable();
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                    b.disable();
                }
            }
        });
    }
}));
this.addToolbarButton('->');
this.addToolbarButton('Depósitos');
   this.addToolbarButton(this.comboDepositos = new LOG.util.LovCombo({
    fieldLabel:'Depósitos',
    mode: 'local',
    url:'/logistica/utiles/plugin/index.php/plugincombodeposito/cargardepositos',
    displayField: 'deposito',
    valueField: 'iddeposito',
    autoLoad: true,
    multiSelect:false,
    editable:false,
    width:280,
    listeners:{
        blur: function (cb) {
            if(cb.getValue()!= ''){
                _this.getStorePrincipal().initBaseParams.iddepositos = cb.getValue();
                _this.getStorePrincipal().reload();
            }
            else{
                _this.getStorePrincipal().initBaseParams.iddepositos = '';
                _this.getStorePrincipal().reload();
            }
        }
    }
}));

    },
    render: function () {
        var render = Ext.erp.analizador.panelactivos.superclass.render.call(this);
 
        return render;
    },
    btnLimpiar:function(){
        var _this=this;
        _this.tfBusqueda.reset();
        _this.comboDepositos.reset();
        _this.storePrincipal.removeAll();
        _this.gpPrincipal.filters.clearFilters();
        _this.getStorePrincipal().initBaseParams.iddepositos = '';
        _this.getStorePrincipal().initBaseParams.criterio = '';
        _this.getStorePrincipal().load();
        _this.getStorePrincipal().filtrado = false;
    
    },
    btnBuscarProductos:function(){
        var _this = this;
        var nrovaleentrega = _this.tfBusqueda.getValue();
        _this.getStorePrincipal().filtrado = true;
        _this.getStorePrincipal().load();
    
    }
   
});

Ext.erp.analizador.WinDocumentosyProductos = Ext.extend(LOG.util.UITemplate, {
    record: undefined,
    constructor: function (config) {
        this.busquedaBasica = false;
       this.urlBusquedaGridPrincipal = '/logistica/inventario/recuperaciones/index.php/analizador/listarDocumentos';
        this.autoLoad = false;
        this.modoSeleccion = 1;
        this.autoSelect = true;
        this.formaVisualizacion = 'ventana';
        LOG.util.UIManager.apply(LOG.util.Idioma);
        this.record = config.record;
        Ext.erp.analizador.WinDocumentosyProductos.superclass.constructor.call(this, config);
        this.setTitulo();
         
     
    },
    init: function () {
        var _this = this;
        Ext.erp.analizador.WinDocumentosyProductos.superclass.init.call(this);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {

            _this.PanelEste = new Ext.erp.analizador.PanelProductosDocumentos({
                idioma: this.idioma,
                model: this.modelo,
                panelAgrupado: this,
                _padre: _this
            });
            _this.PanelEste.init();
            var vistaEste = _this.PanelEste.view();

            _this.PanelRegionEste = LOG.util.UIManager.initPanel({
                layout: 'fit',
                region: 'east',
                width: '50%',
                frame: true,
                collapsible: true,
                collapsed: true,
                split: true,
                items: [vistaEste],
                listeners: {
                    'collapse': function () {
                        this.hide();
                        _this.getPanelGrid().doLayout();
                    },
                    'beforeexpand': function () {
                        this.show();
                        _this.getPanelGrid().doLayout();
                    }
                }
            });
            _this.getPanelGrid().add(_this.PanelRegionEste);

         

            _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                if (e == 'selectionchange' && this.getCount() == 1) {
                    _this.PanelRegionEste.expand();
                    _this.PanelEste.getStorePrincipal().load();
                } else {
                    _this.PanelEste.getStorePrincipal().removeAll();
                    _this.PanelEste.getGridPrincipal().getView().refresh();
                }
            });
        });

        LOG.util.UIManager.apply(_this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
            text: 'Cerrar'
        }, true));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().resizable = false;
    },
    render: function () {
        var _this = this;
        var render =  Ext.erp.analizador.WinDocumentosyProductos.superclass.render.call(this);

       
        this.getStorePrincipal().on({
            beforeload:function(st, obj){
                console.info(_this.tfBusqueda.getValue())
                Ext.apply(obj.params,  {data:Ext.encode(_this.params),
                   iddeposito:_this._parent.gpPrincipal.selModel.selections.items[0].json.idestructuraop,
                  criterio:(_this.tfBusqueda.getValue())?_this.tfBusqueda.getValue():null
                   
                });
            }
        });

        this.getStorePrincipal().load();
        return render;
    },
    initDefaultButtons: function () {
        var _this = this;
    this.addToolbarButton(this.tfBusqueda = new Ext.form.TextField({
        width: 200,
        maxLength: 35,
        enableKeyEvents: true,
        emptyText: 'Nro.documento',
        listeners: {
            'specialkey': function(cmp, e) {
                if (e.getKey() == Ext.EventObject.ENTER) {
                    _this.getStorePrincipal().load();
                }
            }
        },
    }));
    this.addToolbarButton( new LOG.util.Prototipos.botonBuscar({
        text: 'Buscar',
        tooltip: 'Buscar',
        handler: function() {
            _this.getStorePrincipal().load();
        }
    }));
    this.addToolbarButton('-');
    this.addToolbarButton(LOG.util.Prototipos.botonLimpiar({
        tooltip: 'Limpiar',
        text: 'Limpiar',
        handler: function () {
            _this.btnLimpiarDocumentos();
        }
    }));
    this.addToolbarButton('-');
    this.addToolbarButton('Estado');
    this.addToolbarButton(  this.comboEstado = new LOG.util.ComboBox({
        fieldLabel: 'Estado',
        mode: 'local',
        displayField: 'estado',
        valueField: 'idestado',
        autoload: true,
        editable: false,
        store: new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [
                [1, LOG.lb.documento.Estado[1]],
                [2, LOG.lb.documento.Estado[2]],
                [3, LOG.lb.documento.Estado[3]],
                [5, LOG.lb.documento.Estado[5]]
            
            ]
        }),listeners:{
            select: function (cb) {
                if(cb.getValue() > 0){
                    _this.getStorePrincipal().initBaseParams.estado = cb.getValue();
                    _this.getStorePrincipal().load();
                    
                }else{
                    _this.getStorePrincipal().initBaseParams.estado = '';
                
                }
            }
        }

    }));
    },
    initDefaultColumns: function () {
     
                this.addGridColumn({
                    dataIndex: 'iddocumento'
                });
                this.addGridColumn({
                    header: 'Nro.documento',
                    width: 100,
                    dataIndex: 'numeroref',
                    default: true,
                    filter: {
                        type: 'numeric',
                        dataIndex: 'numeroref'
                    }
                });
                this.addGridColumn({
                    header: 'Fecha',
                    width: 100,
                    dataIndex: 'fecha',
                    default: true
                });
                this.addGridColumn({
                    header: 'Estado',
                    width: 100,
                    dataIndex: 'estado',
                    default: true,
                    filter: {
                        type: 'string',
                        dataIndex: 'estado'
                    }
                });
                this.addGridColumn({
                    header: 'Estado ejecuci&oacute;n',
                    width: 200,
                    dataIndex: 'estadoejecucion',
                    default: true
                });
                this.addGridColumn({
                    header: 'Importe',
                    width: 210,
                    dataIndex: 'importe',
                    default: true,
                    renderer: function (v) {
                        return Ext.util.Format.number(v, '0,000.00');
                        },
                    filter: {
                        type: 'numeric',
                        dataIndex: 'importe'
                    }
                });
               
       
     },
     btnLimpiarDocumentos:function(){
        var _this=this;
        _this.tfBusqueda.reset();
        _this.comboEstado.reset();
        _this.storePrincipal.removeAll();
        _this.gpPrincipal.filters.clearFilters();
       // _this.getStorePrincipal().initBaseParams.iddeposito= '';
        _this.getStorePrincipal().initBaseParams.criterio = '';
        _this.getStorePrincipal().load();
        _this.getStorePrincipal().filtrado = false;
    
    },
    setTitulo: function () {
        var _this = this;
        this.getVistaPrincipal().setTitle(String.format('Documentos del depósito ' + _this._parent.gpPrincipal.selModel.selections.items[0].json.deposito));
    }
});


Ext.erp.analizador.PanelProductosDocumentos  = Ext.extend(LOG.util.UITemplate, {
    idmedidor: undefined,
    constructor: function (config) {
        var _this = this;
        this.autoShow = true;
        this.concepto = 'productosdocumentos';
        this.busquedaBasica = false;
        this.autoLoad = false;
        this.autoSelect = false;
        this.idioma = config.idioma;
        this.dirController = '/logistica/inventario/recuperaciones/index.php/analizador';
        this.urlBusquedaGridPrincipal = 'listarproductos';
        this.idGridPrincipal = 'iddocumento';
        this.modoSeleccion = 1;
        this.formaVisualizacion = 'panel';
        Ext.erp.analizador.PanelProductosDocumentos .superclass.constructor.call(this, config);
    },
    
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idproducto'
        });
        this.addGridColumn({
            dataIndex: 'iddocumento'
        });
        this.addGridColumn({
            header: 'C&oacute;digo',
            width: 100,
            dataIndex: 'codigo',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'codigo'
            }
        });
        this.addGridColumn({
            header: 'Denominaci&oacute;n',
            width: 210,
            dataIndex: 'denominacion',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });
        this.addGridColumn({
            header: 'UM',
            width: 100,
            dataIndex: 'um',
            default: true
          
        });
        this.addGridColumn({
            header: 'Cantidad',
            width: 100,
            dataIndex: 'cantidad',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                }
           
        });
        this.addGridColumn({
            header: 'Importe',
            width: 210,
            dataIndex: 'importe',
            default: true,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
                },
        
        });
       
    },
    initDefaultButtons: function () {
        var _this = this;
   
        
   this.addToolbarButton(this.tfBusqueda = new Ext.form.TextField({
    width: 200,
    maxLength: 35,
    enableKeyEvents: true,
    emptyText: 'Código o Denominación',
    listeners: {
        'specialkey': function(cmp, e) {
            if (e.getKey() == Ext.EventObject.ENTER) {
                _this.getStorePrincipal().load();
            }
        }
    },
}));
this.addToolbarButton( new LOG.util.Prototipos.botonBuscar({
    text: 'Buscar',
    tooltip: 'Buscar',
    // disabled: true,
    handler: function() {
        _this.getStorePrincipal().load();
    }
}));
this.addToolbarButton('-');
this.addToolbarButton(LOG.util.Prototipos.botonLimpiar({
    tooltip: 'Limpiar',
    text: 'Limpiar',
    handler: function () {
        _this.btnLimpiarProductos();
    }
}));
    },
    render: function () {
        var _this = this;
        var render =  Ext.erp.analizador.PanelProductosDocumentos.superclass.render.call(this);



        this.getStorePrincipal().on({
            beforeload:function(st, obj){
                console.info(_this.tfBusqueda.getValue())
                Ext.apply(obj.params,  {data:Ext.encode(_this.params),
                  iddocumento:_this._padre.gpPrincipal.selModel.selections.items[0].data.iddocumento,
                  criterio:(_this.tfBusqueda.getValue())?_this.tfBusqueda.getValue():null
                   
                });
            }
        });

        return render;
    },
    btnLimpiarProductos:function(){
        var _this=this;
        _this.tfBusqueda.reset();
        _this.storePrincipal.removeAll();
        _this.gpPrincipal.filters.clearFilters();
        _this.getStorePrincipal().initBaseParams.criterio = '';
        _this.getStorePrincipal().load();
        _this.getStorePrincipal().filtrado = false;
    
    },
   
});
Ext.namespace('Ext.ux.grid');
Ext.ux.grid.ProgressColumn = Ext.extend(Ext.util.Observable, {
    /**
     * @cfg {String} colored determines whether use special progression coloring
     *      or the standard Ext.ProgressBar coloring for the bar (defaults to
     *      false)
     */
    textPst: '%',
    /**
     * @cfg {String} colored determines whether use special progression coloring
     *      or the standard Ext.ProgressBar coloring for the bar (defaults to
     *      false)
     */
    colored: false,
    /**
     * @cfg {String} actionEvent Event to trigger actions, e.g. click, dblclick,
     *      mouseover (defaults to 'dblclick')
     */
    actionEvent: 'dblclick',

    constructor: function (config) {
        Ext.apply(this, config);
        this.renderer = this.renderer.createDelegate(this);
        this.addEvents('action');
        Ext.ux.grid.ProgressColumn.superclass.constructor.call(this);
    },
    init: function (grid) {
        this.grid = grid;
        this.view = grid.getView();

        if (this.editor && grid.isEditor) {
            var cfg = {
                scope: this
            };
            cfg[this.actionEvent] = this.onClick;
            grid.afterRender = grid.afterRender.createSequence(function () {
                this.view.mainBody.on(cfg);
            }, this);
        }
    },

    onClick: function (e, target) {
        var rowIndex = e.getTarget('.x-grid3-row').rowIndex;
        var colIndex = this.view.findCellIndex(target.parentNode.parentNode);

        var t = e.getTarget('.x-progress-text');
        if (t) {
            this.grid.startEditing(rowIndex, colIndex);
        }
    },

    renderer: function (v, p, record) {
        var style = '';
        var textClass = (v < 55) ? 'x-progress-text-back' : 'x-progress-text-front' + (Ext.isIE6 ? '-ie6' : '');
        if (v == 0)
            textClass = 'x-progress-text-wrong';
        //ugly hack to deal with IE6 issue
        var text = String.format('</div><div class="x-progress-text {0}" style="width:100%;" id="{1}">{2}</div></div>',
            textClass, Ext.id(), v + this.textPst
        );
        text = (v < 96) ? text.substring(0, text.length - 6) : text.substr(6);

        if (this.colored == true) {
            if (v <= 50 && v >= 0)
                style = '-red';
            if (v < 70 && v > 50)
                style = '-orange';
            if (v > 70)
                style = '-green';
        }
        p.css += ' x-grid3-progresscol';
        return String.format(
            '<div class="x-progress-wrap"><div class="x-progress-inner"><div class="x-progress-bar{0}" style="width:{1}%;">{2}</div>' +
            '</div>', style, v, text
        );
    }
});


