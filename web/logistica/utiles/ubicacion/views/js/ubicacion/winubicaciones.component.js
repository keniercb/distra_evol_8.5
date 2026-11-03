Ext.ns('LOG.lb.ubicacion');
LOG.lb.ubicacion.winUbicaciones = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.longGridInicio = 0;
        this.dirController = '/logistica/utiles/ubicacion/index.php/ubicacion';
        this.urlBusquedaGridPrincipal = 'cargarUbicacionesProducto';
        this.modoSeleccion = 1;
         
        this.formaVisualizacion = 'ventana';
        config.idioma = {};
        config.idioma = LOG.util.UIManager.apply(LOG.lb.ubicacion.Idioma, LOG.util.Idioma);
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
        LOG.lb.ubicacion.winUbicaciones.superclass.constructor.call(this, config);
        this.textBusquedaSimple = config.idioma.textBusquedaUbicaciones,
        this.modelo = new LOG.lb.ubicacion.Model({
            idioma: config.idioma,
            urlController: '/logistica/utiles/ubicacion/index.php/ubicacion/'
        });
        this.concepto = this.idioma.tlConceptoBusquedaA;
        this.getVistaPrincipal().title = this.idioma.tlVentanaUbicaciones;
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 350;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'cambiar',
            text: this.idioma.lbBtnCambiarUbicacion,
            tooltip: this.idioma.ttBtnCambiarUbicacion,
            disabled: true,
            handler: function() {
                var cambiarUbicacion = new LOG.lb.ubicacion.winCambiarUbicaciones({
                    vista: _this,
                    idioma: _this.idioma,
                    idproducto: _this.idproducto,
                    datos: _this.datos.getSelected(),
                    iddeposito: _this.iddeposito,
                    nomDeposito: _this.nomDeposito,
                    proceso: _this.proceso,
                    modelo: _this.modelo,
                    idmovubicacion: _this.getSmPrincipal().getSelected().data.idmovubicacion,
                    confubicacion: _this.confubicacion,
                    datosUbicaciones: _this.getGridPrincipal().getSelectionModel().getSelected().data,
                    idmovimiento: _this.idmovimiento
                });
                cambiarUbicacion.setTitle(_this.idioma.tlVentanaCambiarUbicaciones);
                cambiarUbicacion.show();
            },
           controlFn: function(b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                     b.disable();
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1 && _this.datos.getSelected().json.tienelote != 1 && _this.datos.getSelected().json.equipo != 1
                                && _this.datos.getSelected().json.municion != 1 && this.getSelected().data.disponible > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'wcambiarUbic');
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            text: this.idioma.lbBtnEliminarUbicacion,
            tooltip: this.idioma.ttBtnEliminarUbicacion,
            disabled: true,
            handler: function() {
                
                _this.modelo.eliminar({
                    idareaproducto: _this.getSmPrincipal().getSelected().data.idareaproducto,
                    idubicacionproducto: _this.getSmPrincipal().getSelected().data.idubicacionproducto,
                    cantidad: _this.getSmPrincipal().getSelected().data.cantidad,
                    idubicacion: _this.getSmPrincipal().getSelected().data.idubicacion,
                    proceso: _this.proceso,
                    idmovubicacion: _this.getSmPrincipal().getSelected().data.idmovubicacion,//_this.idmovimiento,
                    idarea: _this.getSmPrincipal().getSelected().data.idarea,
                    bandUbicar: false
                }, function() {
                    if (!_this.proceso) {
                        _this.vista.storePrincipal.load();
                    }
                });
            },
            controlFn: function(b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                    b.disable();
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1 && _this.datos.getSelected().json.tienelote != '1'
                            && _this.datos.getSelected().json.equipo != '1' && _this.datos.getSelected().json.municion != 1
                            && this.getSelected().json.idubicacion != '-1'
                            && parseFloat(_this.getSmPrincipal().getSelected().data.cantidad) == parseFloat(_this.getSmPrincipal().getSelected().data.disponible)) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'welimUbic');
            }
            
        }));

        // Bloque de botones de función de la ventana.
        this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);
        this.getVistaPrincipal().listaBotones.getItem(2).setVisible(false);
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(0), {
            text: _this.idioma.lbBtnCerrar,
            key : {
                key: 'X',
                ctrl: true,
                alt: true
            }
        });        
        if(_this.campoXUbicar){
            
         this.getVistaPrincipal().listaBotones.getItem(0).handler = this.getVistaPrincipal().listaBotones.getItem(0).handler.createSequence(function() {
            if(_this.proceso){ 
              _this.cargaInicial();
             }else{
             _this.campoXUbicar.setValue( _this.vista.getGridPrincipal().getSelectionModel().getSelected().data.cantidad);
         }
         });
     }
        // Fin del bloque
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgArea,
            name: 'area',
            dataIndex: 'area',
            width: 120,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUbicacion,
            name: 'ubicacion',
            autoExpand: true,
            dataIndex: 'ubicacion',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidad,
            name: 'cantidad',
            dataIndex: 'cantidad',
            align: 'right',
            width: 120,
            default: true
        }));
        if (!this.proceso) {
            this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                header: this.idioma.cgDisponible,
                dataIndex: 'disponible',
                align: 'right',
                width: 120,
                default: true
            }));
        }
        this.addGridColumn({dataIndex: 'idubicacionproducto'});
        this.addGridColumn({dataIndex: 'idmovubicacion'});
        this.addGridColumn({dataIndex: 'idarea'});
        this.addGridColumn({dataIndex: 'idareaproducto'});
        this.addGridColumn({dataIndex: 'idubicacion'});
    },
    render: function(config) {
        var vista = LOG.lb.ubicacion.winUbicaciones.superclass.render.call(this, config);
       LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            idproducto: this.idproducto,
            idmovimiento: (this.idmovimiento)? this.idmovimiento : null,
            movUbicacion: this.proceso || null,
        });
        this.getStorePrincipal().load();
        return vista;
    }
});