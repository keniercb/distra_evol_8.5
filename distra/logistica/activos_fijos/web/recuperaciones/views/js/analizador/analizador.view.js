Ext.ns('LOG.aft.analizador');
LOG.aft.analizador.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/activos_fijos/recuperaciones/index.php/analizador';
        config.urlBusquedaGridPrincipal = 'cargarDatos';
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        _this.tiposmedios = 3;
        config.autoSelect = false;
        config.idioma = {};
        this.acciones = config.acciones;
        LOG.aft.analizador.view.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, LOG.aft.analizador.Idioma);
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
            var newStr= '<b>Detalles:</b></br>'+record.json['detalles']+'<br><b>Problemas:</b></br>'+record.json['problemas']+'<b>Solución:</b></br>'+record.json['solucion'];
            //var newStr=record.json['detalles']+record.json['problemas']
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
    initDefaultButtons: function () {
        var _this = this;
    },
    init: function () {
        var _this = this;
        LOG.aft.analizador.view.superclass.init.call(this);
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
            _this.panelActivos = new LOG.aft.analizador.panelactivos({
                idioma: _this.idioma,
                panelActivos: _this,
                acciones : _this.acciones
            });
            _this.panelActivos.init();
            var vistaActivos = _this.panelActivos.view();
            _this.panelDerecho = LOG.util.UIManager.initPanel({
                title: 'Medios',
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
                    _this.panelActivos.cmGridPrincipal.config[1].hidden = false;
                    _this.panelActivos.cmGridPrincipal.config[0].width = 30;
                    _this.panelActivos.cmGridPrincipal.config[3].hidden = false;
                    _this.panelActivos.cmGridPrincipal.config[4].hidden = false;
                    _this.panelActivos.cmGridPrincipal.config[5].hidden = false;
                    _this.panelActivos.cmGridPrincipal.config[6].width = 100;
                    _this.panelActivos.cmGridPrincipal.config[7].hidden = false;
                    _this.panelActivos.cmGridPrincipal.config[8].hidden = false;
                    _this.panelActivos.cmGridPrincipal.config[9].hidden = false;

                    if (_this.getSmPrincipal().getSelected()) {
                        if(_this.getSmPrincipal().getSelected().data.id == 14){

                            _this.panelActivos.cmGridPrincipal.config[1].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[0].width = 9;
                            _this.panelActivos.cmGridPrincipal.config[3].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[4].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[5].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[6].width = 200;
                            _this.panelActivos.cmGridPrincipal.config[7].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[8].hidden = true;
                            _this.panelActivos.cmGridPrincipal.config[9].hidden = true;
                        }
                        this.initBaseParams.idmedidor =  _this.getSmPrincipal().getSelected().data.id;
                        this.initBaseParams.idestructura = _this.panelActivos.comboEstructura.getValue();
                    } else {
                        this.initBaseParams.idmedidor = -1;
                    }

                  
                },

                'load' : function (t,r,o) {
                    if ( _this.panelActivos.flag == 1) {
                        _this.gpPrincipal.store.on({
                            'beforeload' : function () {
                                this.initBaseParams.idestructura = _this.panelActivos.comboEstructura.getValue();
                            }
                        })
                        _this.gpPrincipal.store.load();
                        _this.panelActivos.flag = 0;
                    }
                   
                }


            });
            _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                if (e == 'selectionchange' && this.getCount() == 1 ) {
                    _this.panelActivos.getStorePrincipal().load();
                }
                //  else {
                //     _this.panelActivos.getStorePrincipal().removeAll();
                //     _this.panelActivos.getGridPrincipal().getView().refresh();
                // } 
            });

        });
    },
    render: function () {
        var _this = this;
        var vista = LOG.aft.analizador.view.superclass.render.call(this);
        this.getStorePrincipal().load();
        return vista;
    }
});
LOG.aft.analizador.panelactivos = Ext.extend(LOG.util.UITemplate, {
    idmedidor: undefined,
    constructor: function (config) {
        var _this = this;
        this.autoShow = true;
        this.concepto = 'activos';
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.autoSelect = false;
        this.idioma = config.idioma; 
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/analizador';
        this.urlBusquedaGridPrincipal = 'getActivosByMedidor';
        this.idGridPrincipal = 'idregnumerico';
        this.modoSeleccion = 1;
        this.formaVisualizacion = 'panel';
        this.listaBotones = new LOG.util.List();
        this.acciones = config.acciones;
        this.flag = 0;
        this.comboEstructura = new LOG.util.LovCombo({
            mode:'remote',
            width: 300,
            url:'/logistica/activos_fijos/recuperaciones/index.php/analizador/getEstructuras',
            disabled: !_this.grantedAction('ESTRUCT'),
            displayField : 'denominacion',
            valueField : 'idestructura',
            queryParam: 'criterio',
            pageSize: 10,
            resizable:true,
            listeners : {
                'select': function(c,r,i) {
                    _this.flag = 1;
                    _this.getStorePrincipal().initBaseParams.idestructura = c.getValue();
                    _this.getStorePrincipal().load();
                }
            }
        });  
        this.comboEstructura.store.load({
          
            scope: this,
            callback : function () {
                this.comboEstructura.setValue(estaestructura);
            }
            
        });
        config.items = [{
            region:'north',
            tbar: _this.listaBotones.getArray(),
           bbar: [
                new Ext.form.Label({text: 'Entidad:'}),
                ' ',
                _this.comboEstructura, 
                ' ']
        },
            this.panelGeneral
        ];
        LOG.aft.analizador.panelactivos.superclass.constructor.call(this, config);
        
    },
    render: function () {
        var render = LOG.aft.analizador.panelactivos.superclass.render.call(this);
        this.gridFilter.grid.getTopToolbar().add('-', new Ext.form.Label({text: 'Entidad:'}), this.comboEstructura)

        return render;
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
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idregnumerico'
        });
        this.addGridColumn({
            dataIndex: 'idindicador'
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
            header: 'Estructura',
            width: 100,
            dataIndex: 'estructura',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'estructura'
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
            header: 'Nro. inventario',
            width: 100,
            dataIndex: 'nroinventario',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'nroinventario'
            }
        });
        this.addGridColumn({
            header: 'Área',
            width: 100,
            dataIndex: 'area',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'area'
            }
        });
        this.addGridColumn({
            header: 'Grupo',
            width: 100,
            dataIndex: 'grupo',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'grupo'
            }
        });
        this.addGridColumn({
            header: 'Tasa',
            width: 100,
            dataIndex: 'tasafiscal',
            default: true,
            align: 'right',

            filter: {
                type: 'numeric',
                dataIndex: 'tasafiscal'
            }
        });
        this.addGridColumn({
            header: 'Responsable',
            width: 100,
            dataIndex: 'responsable',
            default: true,
            filter: {
                type: 'combo',
                dataIndex: 'responsable',
                valueField: 'idresponsable',
                displayField: 'responsable',
                url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getResponsables'
            }});

            
    }
    
})
;

LOG.aft.analizador.detalles = Ext.extend(Ext.Window, {
    constructor: function(config){
        this.data = config.data;
        this.title = config.data.nombre;
        this.layout = 'fit';
        this.autoHeight = true;
        this.crearContenidoVentana();
        LOG.aft.analizador.detalles.superclass.constructor.call(this, config);
    }, 
    crearContenidoVentana: function() {
        var _this = this;
        var html = "<h2>Detalles</h2>";
        html += "<p>"+ _this.data.detalles +"</p>";

        html += "<h2>Posibles problemas</h2>";
        html += "<p>"+ _this.data.problemas +"</p>";

        html += "<h2>Posibles soluciones</h2>";
        html += "<p>"+ _this.data.solucion +"</p>";

        _this.items = [{
            xtype: 'panel',
            autoHeight:true,
            frame: true,
            items: [
                new Ext.form.Label({
                    html: html
                })
            ]
        }];
}})