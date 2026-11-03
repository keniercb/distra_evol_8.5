Ext.ns('LOG.inv.rotacionlote');

LOG.inv.rotacionlote.prodOrigen = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.fdProductos;
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.modoSeleccion = 2;
        //this.autoSelect = false;
        this.urlBusquedaGridPrincipal = 'cargarCodificador';
        LOG.inv.rotacionlote.prodOrigen.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: "",
            iconCls: 'adicionar',
            tooltip:"Adicionar producto(s)",
            disabled:(_this._parent.record && (_this._parent.record.estado ==3))
            /*,
            key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'I'
            }*/,
            handler: function() {
                _this.mostrarWinProductos();
            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: "",
            iconCls: 'eliminar',
            tooltip:"Eliminar productos",
            disabled:(_this._parent.record && (_this._parent.record.estado ==3)),
            /*key: {
                key: Ext.EventObject.DELETE,
                shift: true,
                alt: false,
                ctrl: false,
            },*/
            handler: function() {
                if(_this.getSmPrincipal().hasSelection())
                {
                    _this.eliminarProducto();
                }else{
                    mostrarMensaje(1, "Debe seleccionar al menos un producto.");
                }
            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        }));
        // this.addToolbarButton(LOG.util.UIManager.createBtn({
        //     text: "",
        //     iconCls: 'lote',
        //     disabled:false/*,
        //     key: {
        //         key: Ext.EventObject.DELETE,
        //         shift: true,
        //         alt: false,
        //         ctrl: false,
        //     }*/,
        //     handler: function() {
        //     },
        //     controlFn: function(b, _caller) {
        //
        //         /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
        //             b.show();
        //         } else {
        //             b.hide();
        //         }*/
        //     }
        // }));



    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idcodificador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idmovimiento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idlineaprod',
            hidden: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCodigo,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbDenominacion,
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbUM,
            dataIndex: 'um',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbPresentacion,
            dataIndex: 'presentacion',
            default: true
        });
        // this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
        //     header: _this.idioma.lbCantidad,
        //     dataIndex: 'cantidad',
        //     default: true
        // }));
        this.addGridColumn({
            header: _this.idioma.lbClasificacion,
            dataIndex: 'clasificacion',
            renderer: function(v, _mD, _r) {
                if(v == 1)
                    return 'A';
                if(v==2)
                    return 'B';
                if(v==3)
                    return 'C';
                // return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbLineaprod,
            dataIndex: 'denomlineaprod',
            default: true
        });

    },
    render: function () {
        var _this = this;
        var r = LOG.inv.rotacionlote.prodOrigen.superclass.render.call(this);

        this.gridFilter.tfBusqueda.addClass('form-control');

        _this.getStorePrincipal().fireEvent = _this.getStorePrincipal().fireEvent.createSequence(function (e) {
            if (e === 'load') {

            }
            if (e === 'beforeload') {

                // this.initBaseParams.arrayclasificadores = Ext.encode(_this.arrayclasificadores);
                this.baseParams.idrotacionlote = (_this._parent.record.idrotacionlote)?_this._parent.record.idrotacionlote:null;
                this.baseParams.iddeposito = (_this._parent.record.idrotacionlote && _this._parent.record.idorigen)?_this._parent.record.idorigen:((_this._parent.cmbOrigen.getValue())?_this._parent.cmbOrigen.getValue():-11);
                this.baseParams.iddepositodestino = (_this._parent.record.idrotacionlote && _this._parent.record.iddestino)?_this._parent.record.iddestino:((_this._parent.cmbDestino.getValue())?_this._parent.cmbDestino.getValue():-11);
                // _this.getStorePrincipal().initBaseParams.arrayclasificadores = Ext.encode(_this.arrayclasificadores);
                // _this.getStorePrincipal().initBaseParams.asdf = 123;
            }
        });
        if(_this.autoCargar)
        {
            _this.getStorePrincipal().load();
        }
        return r;
    },
    mostrarWinProductos:function () {
        var _this = this;
        if (_this.cmbOrigen.getValue() && _this.cmbDestino.getValue()) {
            var productos = _this.getStorePrincipal().collect("idcodificador");
            var win = new LOG.inv.rotacionlote.winSeleccProd({
                idioma: _this.idioma,
                excluir: productos,
                iddeposito: _this.cmbOrigen.getValue(),
                iddepositodestino: _this.cmbDestino.getValue()
            });
            win.init();
            // win.getVistaPrincipal().constrain    = true;

            win.getVistaPrincipal().aceptarFn = function () {
                var selections = win.getSmPrincipal().getSelections();
                for(var i=0, arreglo = new Array();i<selections.length;i++)
                {
                    arreglo.push({idcodificador:selections[i].data.idcodificador, idproducto:selections[i].data.idproducto});
                }
                _this._parent.salvarDatos({idcodificadores:arreglo}, _this._parent);

            };
            win.view();
            win.getStorePrincipal().load();
        } else {
            mostrarMensaje(1, "Debe seleccionar el origen y el destino.");
        }
    },
    eliminarProducto:function () {
        var _this = this;
        mostrarMensaje(2, _this.idioma.lbMsgSeleccionar, function (b) {
            if(b === 'ok')
            {

                let arregloEnviar = new Array();
                _this.getSmPrincipal().each(function (r) {
                    arregloEnviar.push(r.data.idcodificador);
                });

                $.ajax({
                    url: 'eliminarProducto',
                    method:'POST',
                    dataType:'json',
                    beforeSend:function () {
                        _this.mask = new Ext.LoadMask(Ext.getBody(), {msg: "Eliminando datos..."}, {msgCls: 'mask-css'});
                        _this.mask.show();
                        return true;
                    },
                    success:function (resp, estatus, xhr) {
                        _this.mask.hide();
                        if (resp.success) {
                            let mensaje ="El(Los) producto(s) ha(n) sido eliminado(s) satisfactoriamente.";
                            // if(resp.contnotfound.length)
                            // {
                            //     mensaje+="\nEl(Los) contenedor(es): \n"+resp.contnotfound.join(", ")+" "+"no se encuentra(n) en el sistema.";
                            // }
                            // if(resp.actnotfound.length)
                            // {
                            //     mensaje+="\nLa(Las) actividad(es): \n"+resp.actnotfound.join(", ")+" "+"no se encuentra(n) en el sistema.";
                            // }
                            mostrarMensaje(1, mensaje);
                            _this.getStorePrincipal().load();
                            // _this.getStorePrincipal().reload();
                        }else {
                            mostrarMensaje(3, "Ocurri\xf3 un error eliminado el(los) producto(s).");
                        }
                    },
                    data:{
                        idcodificadores:arregloEnviar
                    }
                });
            }
        })
    },
    deshabilitarBotones:function () {
        this.listaBotones.each(function (b) {
            b.disable();
        })
    }

});

LOG.inv.rotacionlote.winSeleccLote = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.busquedaBasica = true;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.autoLoad = false;
        // this.dirController = '/logistica/farmacia/farmacia/index.php/tarjetamedicamento';
        this.urlBusquedaGridPrincipal = 'cargarLotes';
        this.concepto = config.idioma.tlBtnBuscar;
        this.textBusquedaSimple = config.idioma.fdLotesW;
        this.idcodificador = config.idcodificador;
        LOG.inv.rotacionlote.winSeleccLote.superclass.constructor.call(this, config);
        this.getVistaPrincipal().setSize(750, 400);
        this.getVistaPrincipal().setTitle(config.idioma.tSellotes);
        this.gridEditable = true;
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idlote',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproductodestino',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrolote',
            header: this.idioma.lbNroLote,
            width: 120,
            autoExpand: true
        });
        this.addGridColumn({
            dataIndex: 'fechafabricacion',
            header: this.idioma.lbFechaFabricacion,
            width: 120
        });
        this.addGridColumn({
            dataIndex: 'fechavencimiento',
            header: this.idioma.lbFechaVencimiento,
            width: 120
        });
        this.cantidadarotar = new LOG.util.Prototipos.inputEntero({//inputDecimal
            width: 100,
            maxLength: '19'
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'cantidad',
            header: this.idioma.lbCantidad,
            width: 120,
            editor:_this.cantidadarotar
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'existencia',
            header: this.idioma.lbExistencia,
            width: 120
        }));
        this.addGridColumn({
            dataIndex: 'entregadopor',
            header: this.idioma.lbUbicacion,
            width: 120
        });

    },

    render:function() {
        var _this = this;
        var vista = LOG.inv.rotacionlote.winSeleccLote.superclass.render.call(this);

        this.getStorePrincipal().on({
            beforeload:function (st, obj) {
                console.info(_this.iddepositodestino);
                obj.params.activo = 1;
                obj.params.idcodificador = _this.idcodificador;
                obj.params.iddeposito = _this.iddeposito;
                obj.params.iddepositodestino = _this.iddepositodestino;
                obj.params.ventana = 1;
                obj.params.excluir = Ext.encode(_this.excluir);
            }
        });
        this.getGridPrincipal().fireEvent = this.getGridPrincipal().fireEvent.createSequence(function(e){
            if(e == 'afteredit')
            {
                let record = _this.getSmPrincipal().getSelected();
                if ((record.data.cantidad > record.data.existencia) || (record.data.cantidad < 0))
                {
                    _this.getSmPrincipal().getSelected().data.cantidad = record.data.existencia;
                }else{
                    _this.getSmPrincipal().getSelected().data.cantidad = record.data.cantidad;
                }
                this.getView().refresh(true);

            }
        });
        this.gridFilter.tfBusqueda.addClass('form-control');
        return vista;
    },
    initDefaultButtons: function() {
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
    }
});

LOG.inv.rotacionlote.lotesOrigen = Ext.extend(LOG.util.UITemplate, {

    constructor: function(config) {
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.fdProductos;
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.modoSeleccion = 2;
        //this.autoSelect = false;
        this.urlBusquedaGridPrincipal = 'cargarLotes';
        LOG.inv.rotacionlote.lotesOrigen.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: "",
            iconCls: 'adicionar',
            tooltip:"Adicionar lote(s)",
            disabled:(_this._parent.record && (_this._parent.record.estado ==3)),
            /*key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'I'
            },*/
            handler: function() {
                _this.mostrarWinLotes();
            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: "",
            iconCls: 'eliminar',
            tooltip:"Eliminar lote(s)",
            disabled:(_this._parent.record && (_this._parent.record.estado ==3)),
            /*key: {
                key: Ext.EventObject.DELETE,
                shift: true,
                alt: false,
                ctrl: false,
            },*/
            handler: function() {
                if(_this.getSmPrincipal().hasSelection())
                {
                    mostrarMensaje(2, "\xbfEst\xe1 seguro que desea eliminar el(los) lote(s) seleccionado(s).\x3f", function (b) {
                        if (b === 'ok') {
                            let arregloEnviar = new Array();
                            _this.getSmPrincipal().each(function (r) {
                                arregloEnviar.push(r.data.idlote);
                            });
                            $.ajax({
                                url: 'eliminarLote',
                                dataType: 'json',
                                method: 'POST',
                                data: {idlotes: arregloEnviar},
                                beforeSend: function () {
                                    _this.mask = new Ext.LoadMask(_this._parent.getEl(), {msg: "Eliminando datos..."}, {msgCls: 'mask-css'});
                                    _this.mask.show();
                                    return true;
                                },
                                success: function (resp) {
                                    _this.mask.hide();
                                    mostrarMensaje(1, "El(Los) lote(s) seleccionado(s) ha(n) sido eliminado satisfactoriamente.");
                                    _this.getStorePrincipal().reload();

                                }
                            });
                        }
                    });
                }else{
                    mostrarMensaje(1, "Debe seleccionar al menos un lote.");
                }
            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        }));



    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'iddepositodestino',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idlote',
            hidden: true
        });
        this.addGridColumn({
            header: _this.idioma.lbNroLote,
            dataIndex: 'nrolote',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbFechaVencimiento,
            dataIndex: 'fechavencimiento',
            autoExpand: true,
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'cantidad',
            header: this.idioma.lbCantidad,
            width: 120
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'existencia',
            header: this.idioma.lbExistencia,
            width: 120
        }));
        // this.addGridColumn({
        //     header: _this.idioma.lbCantidad,
        //     dataIndex: 'cantidad',
        //     default: true
        // });
        // this.addGridColumn({
        //     header: _this.idioma.lbUbicacion,
        //     autoExpand: true,
        //     dataIndex: 'ubicacion',
        //     default: true
        // });

    },
    render: function() {
        var _this = this;
        var render = LOG.inv.rotacionlote.lotesOrigen.superclass.render.call(this);

        this.gridFilter.tfBusqueda.addClass('form-control');
        _this.getStorePrincipal().fireEvent = this.getStorePrincipal().fireEvent.createSequence(function(e) {
            if (e === 'load') {

            }
            if(e ==='beforeload')
            {
                this.baseParams.idrotacionlote = (_this._parent.record && _this._parent.record.idrotacionlote)?_this._parent.record.idrotacionlote:-11;
                this.baseParams.tipo = 1;
                this.baseParams.idcodificador = (_this._parent.gridProdOrigen.getSmPrincipal().hasSelection())?_this._parent.gridProdOrigen.getSmPrincipal().getSelected().data.idcodificador:-11;
            }
        });

        if(_this.autoCargar)
        {
            _this.getStorePrincipal().load();
        }
        return render;
    },
    mostrarWinLotes:function () {
        let _this = this;
        let seleccion = _this._parent.gridProdOrigen.getSmPrincipal();
        let idorigen = (_this._parent.record && _this._parent.record.idorigen)?_this._parent.record.idorigen:_this._parent.cmbOrigen.getValue();
        let iddestino = (_this._parent.record && _this._parent.record.iddestino)?_this._parent.record.iddestino:_this._parent.cmbDestino.getValue();

        if (seleccion.hasSelection() && idorigen) {
            let winGridLote = new LOG.inv.rotacionlote.winSeleccLote({
                idioma: _this.idioma,
                idcodificador:seleccion.getSelected().data.idcodificador,
                iddeposito:idorigen,
                iddepositodestino:iddestino,
                excluir:_this.getStorePrincipal().collect('idlote'),
                iddepositodestino:iddestino
            });
            winGridLote.init();
            winGridLote.getVistaPrincipal().aceptarFn = function () {
                let idlotesorigen = new Array();
                let dataSelec = seleccion.getSelected().data;
                winGridLote.getSmPrincipal().each(function (r) {
                    idlotesorigen.push({idlote:r.data.idlote,
                        idproductodestino:r.data.idproductodestino,
                        existencia:r.data.existencia,
                        cantidad:r.data.cantidad,
                        idcodificador:dataSelec.idcodificador,
                        tipo:1,
                        idrotacionlote:_this._parent.record.idrotacionlote});
                });
                $.ajax({
                    url: 'salvarLotes',
                    method:'POST',
                    dataType:'json',
                    beforeSend:function () {
                        _this.mask = new Ext.LoadMask(_this._parent.getEl(), {msg: "Guardando datos..."}, {msgCls: 'mask-css'});
                        _this.mask.show();
                        return true;
                    },
                    success:function (resp, estatus, xhr) {
                        _this.mask.hide();
                        if (resp.success) {
                            let mensaje ="El(los) lote(s) ha(n) sido guardado(s) satisfactoriamente.";
                            // if(resp.contnotfound.length)
                            // {
                            //     mensaje+="\nEl(Los) contenedor(es): \n"+resp.contnotfound.join(", ")+" "+"no se encuentra(n) en el sistema.";
                            // }
                            // if(resp.actnotfound.length)
                            // {
                            //     mensaje+="\nLa(Las) actividad(es): \n"+resp.actnotfound.join(", ")+" "+"no se encuentra(n) en el sistema.";
                            // }
                            mostrarMensaje(1, mensaje);
                            _this.getStorePrincipal().load();
                            // _this.getStorePrincipal().reload();
                        }else {
                            // mostrarMensaje(3, "Ocurri\xf3 un error importando movimientos.");
                        }
                    },
                    data:{
                        idlotes:idlotesorigen

                    }
                });

            };
            winGridLote.view();
            winGridLote.getStorePrincipal().load();
        } else {
            mostrarMensaje(1, "Debe seleccionar un producto y un origen");
        }
    },
    deshabilitarBotones:function () {
        this.listaBotones.each(function (b) {
            b.disable();
        })
    }
});

LOG.inv.rotacionlote.lotesDestino = Ext.extend(LOG.util.UITemplate, {

    constructor: function(config) {
        this.concepto = config.idioma.ttBtnBuscarProducto;
        this.textBusquedaSimple = config.idioma.fdProductos;
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.autoLoad = false;
        this.modoSeleccion = 2;
        //this.autoSelect = false;
        this.urlBusquedaGridPrincipal = 'cargarLotes';
        LOG.inv.rotacionlote.lotesDestino.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: "",
            iconCls: 'adicionar',
            tooltip:"Adicionar lote(s)",
            disabled:(_this._parent.record && (_this._parent.record.estado ==3)),
            /*key: {
                alt: true,
                ctrl: false,
                shift: false,
                key: 'I'
            },*/
            handler: function() {
                _this.mostrarWinLotes();
            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: "",
            iconCls: 'eliminar',
            tooltip:"Eliminar lote(s)",
            disabled:(_this._parent.record && (_this._parent.record.estado ==3)),
            /*key: {
                key: Ext.EventObject.DELETE,
                shift: true,
                alt: false,
                ctrl: false,
            },*/
            handler: function() {

                if(_this.getSmPrincipal().hasSelection())
                {
                    mostrarMensaje(2, "\xbfEst\xe1 seguro que desea eliminar el(los) lote(s) seleccionado(s).\x3f", function (b) {
                        if (b === 'ok') {
                            let arregloEnviar = new Array();
                            _this.getSmPrincipal().each(function (r) {
                                arregloEnviar.push(r.data.idlote);
                            });
                            $.ajax({
                                url: 'eliminarLote',
                                dataType: 'json',
                                method: 'POST',
                                data: {idlotes: arregloEnviar},
                                beforeSend: function () {
                                    _this.mask = new Ext.LoadMask(_this._parent.getEl(), {msg: "Eliminando datos..."}, {msgCls: 'mask-css'});
                                    _this.mask.show();
                                    return true;
                                },
                                success: function (resp) {
                                    _this.mask.hide();
                                    mostrarMensaje(1, "El(Los) lote(s) seleccionado(s) ha(n) sido eliminado satisfactoriamente.");
                                    _this.getStorePrincipal().reload();

                                }
                            });
                        }
                    });

                }else{
                    mostrarMensaje(1, "Debe seleccionar al menos un lote.");
                }
            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        }));



    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idproducto',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'iddepositodestino',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idlote',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbNroLote,
            dataIndex: 'nrolote',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbFechaVencimiento,
            dataIndex: 'fechavencimiento',
            autoExpand: true,
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'cantidad',
            header: this.idioma.lbCantidad,
            width: 120
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'existencia',
            header: this.idioma.lbExistencia,
            width: 120
        }));
        // this.addGridColumn({
        //     header: _this.idioma.lbCantidad,
        //     dataIndex: 'cantidad',
        //     default: true
        // });
        /*this.addGridColumn({
            header: _this.idioma.lbUbicacion,
            autoExpand: true,
            dataIndex: 'ubicacion',
            default: true
        });*/

    },
    render: function() {
        var _this = this;
        var render = LOG.inv.rotacionlote.lotesDestino.superclass.render.call(this);

        this.gridFilter.tfBusqueda.addClass('form-control');

            _this.getStorePrincipal().fireEvent = this.getStorePrincipal().fireEvent.createSequence(function(e) {
                if (e === 'load') {

                }
                if(e ==='beforeload')
                {
                    this.baseParams.idrotacionlote = (_this._parent.record && _this._parent.record.idrotacionlote)?_this._parent.record.idrotacionlote:-11;
                    this.baseParams.tipo =2;
                    this.baseParams.idcodificador = (_this._parent.gridProdOrigen.getSmPrincipal().hasSelection())?_this._parent.gridProdOrigen.getSmPrincipal().getSelected().data.idcodificador:-11;
                }
            });

            if(_this.autoCargar)
            {
                _this.getStorePrincipal().load();
            }

        return render;
    },
    mostrarWinLotes:function () {
        let _this = this;
        let seleccion = _this._parent.gridProdOrigen.getSmPrincipal();
        let idorigen = (_this._parent.record && _this._parent.record.idorigen)?_this._parent.record.idorigen:_this._parent.cmbOrigen.getValue();
        let iddestino = (_this._parent.record && _this._parent.record.iddestino)?_this._parent.record.iddestino:_this._parent.cmbDestino.getValue();

        if (seleccion.hasSelection() && idorigen && iddestino) {
            let winGridLote = new LOG.inv.rotacionlote.winSeleccLote({
                idioma: _this.idioma,
                excluir:_this.getStorePrincipal().collect('idlote'),
                iddeposito:iddestino,
                idcodificador:seleccion.getSelected().data.idcodificador,
                iddepositodestino:idorigen
            });
            winGridLote.init();
            winGridLote.getVistaPrincipal().aceptarFn = function () {
                let idlotesdestino = new Array();
                winGridLote.getSmPrincipal().each(function (r) {
                    idlotesdestino.push({idlote:r.data.idlote,
                        idproductodestino:r.data.idproductodestino,
                        cantidad:r.data.existencia,
                        existencia:r.data.existencia,
                        cantidad:r.data.cantidad,
                        idcodificador:seleccion.getSelected().data.idcodificador,
                        tipo:2,
                        idrotacionlote:_this._parent.record.idrotacionlote}
                        );
                });
                $.ajax({
                    url: 'salvarLotes',
                    method:'POST',
                    dataType:'json',
                    beforeSend:function () {
                        _this.mask = new Ext.LoadMask(_this._parent.getEl(), {msg: "Guardando datos..."}, {msgCls: 'mask-css'});
                        _this.mask.show();
                        return true;
                    },
                    success:function (resp, estatus, xhr) {
                        _this.mask.hide();
                        if (resp.success) {
                            let mensaje ="El(los) lote(s) ha(n) sido guardado(s) satisfactoriamente.";
                            // if(resp.contnotfound.length)
                            // {
                            //     mensaje+="\nEl(Los) contenedor(es): \n"+resp.contnotfound.join(", ")+" "+"no se encuentra(n) en el sistema.";
                            // }
                            // if(resp.actnotfound.length)
                            // {
                            //     mensaje+="\nLa(Las) actividad(es): \n"+resp.actnotfound.join(", ")+" "+"no se encuentra(n) en el sistema.";
                            // }
                            mostrarMensaje(1, mensaje);
                            _this.getStorePrincipal().load();
                        }else {
                            // mostrarMensaje(3, "Ocurri\xf3 un error importando movimientos.");
                        }
                    },
                    data:{
                        idlotes:idlotesdestino

                    }
                });

            };
            winGridLote.view();
            winGridLote.getStorePrincipal().load();
        } else {
            mostrarMensaje(1, "Debe seleccionar un producto y un destino");
        }
    },
    deshabilitarBotones:function () {
        this.listaBotones.each(function (b) {
            b.disable();
        })
    }
});

//Seleccionar Producto
LOG.inv.rotacionlote.winSeleccProd = Ext.extend(LOG.util.UITemplate, {
    excluir:undefined,
    idtransfinterna:undefined,
    autoLoad:false,

    constructor: function(config) {
        this.busquedaBasica = true;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 2;
        config.urlBusquedaGridPrincipal = 'cargarCodificador';
        this.concepto = 'productos';
        LOG.inv.rotacionlote.winSeleccProd.superclass.constructor.call(this, config);
        this.getVistaPrincipal().setSize(700, 400);
        this.getVistaPrincipal().setTitle(config.idioma.tSelProductos);
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idcodificador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idmovimiento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idlineaprod',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'codigo',
            header: _this.idioma.lbCodigo,
            width: 100,
            autoExpand: true
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.lbDenominacion,
            width: 200,
            id:'descripcion'
        });
        // this.addGridColumn({
        //     dataIndex: 'uemb',
        //     header: _this.idioma.lbUEmd,
        //     width: 130,
        //     // editor: new Ext.form.DateField({}),
        //     /*renderer:function(value , c , record){
        //      return _this.formatDate(value, c , record)
        //      }*/
        // });
        // this.addGridColumn({
        //     dataIndex: 'presentacion',
        //     header: _this.idioma.lbPresentacion,
        //     width: 130,
        //     // editor: new Ext.form.DateField({}),
        //     /* renderer:function(value , c , record){
        //      return _this.formatDate(value, c , record)
        //      },*/
        // });
        this.addGridColumn({
            dataIndex: 'cantidad',
            header: _this.idioma.lbCantidad,
            width: 130,
            // editor: new Ext.form.DateField({}),
            /* renderer:function(value , c , record){
             return _this.formatDate(value, c , record)
             },*/
        });
        this.addGridColumn({
            dataIndex: 'precioventa',
            header: _this.idioma.lbPrecioVenta,
            width: 130,
            // editor: new Ext.form.DateField({}),
            /* renderer:function(value , c , record){
             return _this.formatDate(value, c , record)
             },*/
        });
        // this.addGridColumn({
        //     dataIndex: 'importeventa',
        //     header: _this.idioma.lbImporteVenta,
        //     width: 130,
        //     // editor: new Ext.form.DateField({}),
        //     /* renderer:function(value , c , record){
        //      return _this.formatDate(value, c , record)
        //      },*/
        // });
        this.addGridColumn({
            dataIndex: 'preciocosto',
            header: _this.idioma.lbPreciocosto,
            width: 130,
            // editor: new Ext.form.DateField({}),
            /* renderer:function(value , c , record){
             return _this.formatDate(value, c , record)
             },*/
        });
        this.addGridColumn({
            dataIndex: 'existenciaactual',
            header: _this.idioma.lbExistencia,
            width: 130,
            // editor: new Ext.form.DateField({}),
            /* renderer:function(value , c , record){
             return _this.formatDate(value, c , record)
             },*/
        });
        this.addGridColumn({
            dataIndex: 'denomlineaprod',
            header: this.idioma.lbLineaprod,
            width: 130,
            // editor: new Ext.form.DateField({}),
            /* renderer:function(value , c , record){
             return _this.formatDate(value, c , record)
             },*/
        });
    },
    render:function() {
        var _this = this;
        var vista =  LOG.inv.rotacionlote.winSeleccProd.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload:function (st, obj) {
                obj.params.activo = 1;
                obj.params.excluir = Ext.encode(_this.excluir);
                obj.params.iddeposito = _this.iddeposito;
                obj.params.iddepositodestino = _this.iddepositodestino;
            }
        });
        this.gridFilter.tfBusqueda.addClass('form-control');
        return vista;
    },
    initDefaultButtons: function() {
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
    }
});

LOG.inv.rotacionlote.winAddRotacionLote = Ext.extend(LOG.util.Window, {
    modelo:undefined,
    record:{},

    initComponent: function () {
        var _this = this;
        this.listaBotones.deleteAll();
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            text: _this.idioma.lbBtnCerrar,
            tooltip: _this.idioma.ttBtnCerrar,
            key: {
                key: 'X',
                ctrl: true,
                alt: true
            },
            scope: this,
            handler: function () {
                _this.close();
                _this._parent.getStorePrincipal().load();
            }
        }, true)));
        this.btnGuardar = new LOG.util.Prototipos.botonGuardar({
            tooltip: _this.idioma.ttBtnGuardar,
            disabled:true,
            handler: function () {
                _this.salvarDatos();

            }
        });
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(this.btnGuardar));
        LOG.inv.rotacionlote.winAddRotacionLote.superclass.initComponent.call(this);

    },
    constructor: function (config) {
        var _this = this;
        config.frame = true;
        Ext.apply(this, config);
        let estadoTitle = ((this.record && this.record.estado == 3))?" en rotado":" en elaboraci\xf3n";
        this.title = this.idioma.ttitle + ((this.record && this.record.fecharotacionlote)?this.record.fecharotacionlote:fechasub) + estadoTitle;

        this.btnEliminar = new LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.lbBtnEliminar,
            tooltip: _this.idioma.ttBtnEliminar,
            disabled:((_this.record && _this.record.estado == 3) || !_this.record.idrotacionlote),
            handler: function() {

                _this._parent.eliminarRotacion(_this._parent, function () {
                    _this.close();
                }, _this, _this.getEl(),_this.record.idrotacionlote);

            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        });
        this.btnRotar = LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnRotar,
            iconCls: 'cambiar',
            tooltip:_this.idioma.ttBtnRotar,
            disabled:!(_this.record && _this.record.estado == 1)
            /*,
            key: {
                alt: true,
                ctrl: true,
                shift: false,
                key: 'I'
            }*/,
            handler: function() {
                LOG.inv.rotacionlote.fnRotarLote(_this.record.idrotacionlote, _this, _this.actualizarInterfaz, _this.getEl());
            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        });
        this.btnImprimir = LOG.util.UIManager.createBtn({
            text: "Imprimir modelo",
            tooltip: _this.idioma.ttBtnImprimir,
            iconCls: 'imprimir',
            disabled:!(_this.record && _this.record.estado == 3),
            handler: function() {
                LOG.inv.rotacionlote.fnImprimirRotaciones(_this.record.idrotacionlote, _this.idioma);
            },
            controlFn: function(b, _caller) {

                /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }*/
            }
        });

        this.tbar = [this.btnEliminar, this.btnRotar, this.btnImprimir];


        //Field set del encabezado de la ventana
        var frmDatosGenerales = LOG.util.UIManager.initForm({
            frame: true,
            layout:'border',
            region:'center'
        });
        //Field set del encabezado de la ventana
        var fsEncabezado = new Ext.form.FieldSet({
            // labelAlign: 'top',
            // region:'center',
            autoHeight:true,
            region:'north',
            height:200,
            defaults: {bodyStyle: 'padding:0px 0px 10px 0px'}
        });
        //Panel que va a contener los campos del encabezado de la ventana
        let cfmEncabezadoGeneral = LOG.util.UIManager.initColumnForm({columnas:(2)});

        let cfmEncabezadoTROD = LOG.util.UIManager.initColumnForm({columnas:(1), defaultsAnchor:'90%'});
        let cfmTipoRotacion = LOG.util.UIManager.initColumnForm({columnas:(1), defaultsAnchor:'95%'});
        let cfmEncabezadoOD = LOG.util.UIManager.initColumnForm({columnas:(2), defaultsAnchor:'90%'});
        this.cmbTipoRotacion = new Ext.erp.comboNomenclador({
            fieldLabel: _this.idioma.lbTipoRotacion,
            controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
            modelo: 'NomTiporotacion',
            idnom: 'idtiporotacion',
            name: 'idtiporotacion',
            cls:'form-control',
            autoCargar: true,
            allowBlank: false,
            editable: false,
            disabled:(_this.record.estado ==3),
            emptyText: _this.idioma.tvacio,
            campo: true,
            listeners: {
                select: function (_cb, _r) {
                    // cmbOrigen.enable();
                    _this.cmbOrigen.clearValue();
                    _this.cmbOrigen.getStore().load({params:{idtiporotacion:_r.data.idtiporotacion}});
                    _this.cmbDestino.disable();
                },
                change:function (cmb, nuevo, old) {
                    if((old !== nuevo) && _this.record.estado !=3)
                    {
                        _this.btnGuardar.enable();
                    }

                }
            }
        });
        this.storeTRnoCarga = true;
        this.storeOnoCarga = true;
        this.storeDnoCarga = true;
        this.cmbTipoRotacion.store.fireEvent = this.cmbTipoRotacion.store.fireEvent.createSequence(function (e) {
            if(e==='beforeload'){
                _this.storeTRnoCarga = false;
                _this.cmbTipoRotacion.disable();
            }
            if(e==='load'){
                if ((_this.record.estado !=3)) {
                    _this.cmbTipoRotacion.enable();
                }
                if (_this.cmbTipoRotacion.store.getCount()>0 && _this.record.idtiporotacion) {
                    var idtprotacion = _this.record.idtiporotacion;
                    _this.cmbTipoRotacion.originalValue = idtprotacion;
                    _this.cmbTipoRotacion.setValue(idtprotacion);
                    _this.storeOnoCarga = false;
                    _this.cmbOrigen.getStore().load({params:{idtiporotacion:idtprotacion}});

                }
                _this.storeTRnoCarga = true;
                _this.verificarCargaInicial();
            }
        });

        this.cmbOrigen = new LOG.util.ComboBox({
            url: 'cargarOrigenDestino',
            cls:'form-control',
            emptyText:_this.idioma.tvacio,
            autoLoad: false,
            baseParams:{
                nomen:'2'
            },
            displayField: 'text',
            valueField: 'id',
            lastQuery: '',
            anchor: '90%',
            allowBlank: true,
            disabled:true,
            hiddenName:'idorigen',
            fieldLabel:_this.idioma.tOrigen,
            listeners:{
                select: function (cmb, rec, index) {
                    _this.cmbDestino.clearValue();
                    if (_this.cmbDestino.disabled) {
                        _this.cmbDestino.getStore().load({
                            params: {idtiporotacion: _this.cmbTipoRotacion.getValue()},
                            callback: function () {
                                _this.cmbDestino.enable();
                                _this.cmbDestino.store.filterBy(function (item, id) {
                                    return id !== rec.data.id;
                                });
                            }
                        });
                    } else {
                        _this.cmbDestino.store.filterBy(function (item, id) {
                            return id !== rec.data.id;
                        });
                    }


                },
                change:function (cmb, nuevo, old) {
                    if((old !== nuevo) && _this.record.estado !=3)
                    {
                        _this.btnGuardar.enable();
                    }

                }
            }
        });

        this.cmbOrigen.store.fireEvent = this.cmbOrigen.store.fireEvent.createSequence(function (e) {
            if(e==='load'){

                if ((_this.record.estado !=3)) {
                    _this.cmbOrigen.enable();
                }
                if (_this.cmbOrigen.store.getCount()>0 && _this.record.idtiporotacion) {
                    var idorigen = _this.record.idorigen;
                    _this.cmbOrigen.originalValue = idorigen;
                    _this.cmbOrigen.setValue(idorigen);
                    _this.storeDnoCarga = false;
                    _this.cmbDestino.getStore().load({params:{idtiporotacion:_this.record.idtiporotacion}});
                }
                _this.storeOnoCarga = true;
                _this.verificarCargaInicial();
            }
            if(e==='beforeload'){
                _this.storeOnoCarga = false;
                _this.cmbOrigen.disable();
            }
        });
        this.cmbDestino = new LOG.util.ComboBox({
            url: 'cargarOrigenDestino',
            cls:'form-control',
            emptyText:_this.idioma.tvacio,
            autoLoad: false,
            baseParams:{
                nomen:'2'
            },
            displayField: 'text',
            valueField: 'id',
            lastQuery: '',
            anchor: '90%',
            allowBlank: true,
            disabled:true,
            hiddenName:'iddestino',
            fieldLabel:_this.idioma.tDestino,
            listeners:{
                select:function (cmb, rec, oldV) {
                    _this.cmbOrigen.store.filterBy(function (item, id) {
                        return id !== rec.data.id;
                    });
                },
                change:function (cmb, nuevo, old) {
                    if((old !== nuevo) && _this.record.estado !=3)
                    {
                        _this.btnGuardar.enable();
                    }

                }
            }
        });

        this.cmbDestino.store.fireEvent = this.cmbDestino.store.fireEvent.createSequence(function (e) {
            if(e==='load'){

                if ((_this.record.estado !=3)) {
                    _this.cmbDestino.enable();
                }
                if (_this.cmbDestino.store.getCount()>0 && _this.record.idtiporotacion) {
                    var iddestino = _this.record.iddestino;
                    _this.cmbDestino.originalValue = iddestino;
                    _this.cmbDestino.setValue(iddestino);
                }
                _this.storeDnoCarga = true;
                _this.verificarCargaInicial();
            }
            if(e==='beforeload'){
                _this.storeDnoCarga = false;
                _this.cmbDestino.disable();
            }
        });
        this.textObservaciones = new Ext.form.TextArea({
            anchor:"100%",
            cls:'form-control',
            fieldLabel:_this.idioma.tObservaciones,
            height:70,
            disabled:(_this.record.estado ==3),
            value:(_this.record.observaciones)?_this.record.observaciones:"",
            name:"observacion",
            listeners:{
            change:function (cmb, nuevo, old) {
                if((old !== nuevo) && _this.record.estado !=3)
                {
                    _this.btnGuardar.enable();
                }
            }
            }

        });

        cfmTipoRotacion.addComponent(this.cmbTipoRotacion);
        cfmEncabezadoTROD.addComponent(cfmTipoRotacion);
        cfmEncabezadoOD.addComponent(this.cmbOrigen);
        cfmEncabezadoOD.addComponent(this.cmbDestino);
        cfmEncabezadoTROD.addComponent(cfmEncabezadoOD);
        cfmEncabezadoGeneral.addComponent(cfmEncabezadoTROD);
        cfmEncabezadoGeneral.addComponent(this.textObservaciones);
        fsEncabezado.add(cfmEncabezadoGeneral);
        frmDatosGenerales.add(fsEncabezado);


        this.gridProdOrigen = new LOG.inv.rotacionlote.prodOrigen({
            idioma:_this.idioma,
            autoLoadPlugins:false,
            autoLoad : false,
            autoCargar : (_this.record.idrotacionlote),
            _parent:_this,
            cmbOrigen:_this.cmbOrigen,
            cmbDestino:_this.cmbDestino
        });
        this.gridProdOrigen.init();
        var panelProdOrigen = this.gridProdOrigen.view();
        this.gridProdOrigen.getSmPrincipal().fireEvent = this.gridProdOrigen.getSmPrincipal().fireEvent.createSequence(function(e) {
            if (e === 'selectionchange') {
                _this.gridLotOrigen.getStorePrincipal().load();
                _this.gridLotDestino.getStorePrincipal().load();
            }
        });
        this.storeGpnoCarga = true;
        this.gridProdOrigen.getStorePrincipal().fireEvent = this.gridProdOrigen.getStorePrincipal().fireEvent.createSequence(function(e) {
            if (e === 'beforeload') {
                _this.storeGpnoCarga = false;
            }
            if (e === 'load') {
                _this.storeGpnoCarga = true;
                _this.verificarCargaInicial();
            }
        });
        Ext.apply(panelProdOrigen, {flex:1, region:'center'/*,height:_this.height-300*/});
        var fsProdOrigen = new Ext.form.FieldSet({
            title:_this.idioma.tProdOrigen,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            layout:'border',
            flex:1,
            items:[panelProdOrigen]
        });
        this.gridLotOrigen = new LOG.inv.rotacionlote.lotesOrigen({
            idioma:_this.idioma,
            autoCargar:(_this.record.idrotacionlote),
            _parent:_this
        });
        this.gridLotOrigen.init();
        var panelLotOrigen = this.gridLotOrigen.view();
        Ext.apply(panelLotOrigen, {title:_this.idioma.tLotesOrigen});
        this.storeGonoCarga = true;
        this.gridLotOrigen.getStorePrincipal().fireEvent = this.gridLotOrigen.getStorePrincipal().fireEvent.createSequence(function(e) {
            if (e === 'beforeload') {
                _this.storeGonoCarga = false;
            }
            if (e === 'load') {
                _this.storeGonoCarga = true;
                _this.verificarCargaInicial();
            }
        });

        this.gridLotDestino = new LOG.inv.rotacionlote.lotesDestino({
            idioma:_this.idioma,
            autoCargar:(_this.record.idrotacionlote),
            _parent:_this
        });
        this.gridLotDestino.init();
        var panelLotDestino = this.gridLotDestino.view();
        this.storeGdnoCarga = true;
        this.gridLotDestino.getStorePrincipal().fireEvent = this.gridLotDestino.getStorePrincipal().fireEvent.createSequence(function(e) {
            if (e === 'beforeload') {
                _this.storeGdnoCarga = false;
            }
            if (e === 'load') {
                _this.storeGdnoCarga = true;
                console.info("si cargo:" + _this.storeGdnoCarga);
                _this.verificarCargaInicial();
            }
        });
        Ext.apply(panelLotDestino, {title:_this.idioma.tLotesDestino});
        // var fsLotDestino = new Ext.form.FieldSet({
        //     title:_this.idioma.tLotesDestino,
        //     style: '-moz-border-radius:5px',
        //     labelAlign: 'top',
        //     autoScroll:true,
        //     flex:1,
        //     collapsible: true,
        //     autoHeight: true,
        //     items:[panelLotDestino]
        // });

        this.lotesTab = new Ext.TabPanel({
            // minTabWidth: 115,
            activeTab: 0,
            // tabWidth: 135,
            frame: true,
            flex:1,
            // resizable: false,
            // draggable: false,
            region: 'center',
            enableTabScroll: true,
            // height:_this.height-350,
            defaults: {autoScroll: true},
            items:[panelLotOrigen, panelLotDestino]
        });

        var panProdOrigen = {
            layout: {
                type:'hbox',
                padding:'5',
                align:'stretch'
            },
            region:'center',
            items:[{
                columnWidth:.5,
                flex:1,
                html: '',
                layout: {
                    type:'hbox',
                    padding:'5',
                    align:'stretch'
                },
                // bodyStyle: 'padding:0px 10px 0px 0px',
                defaults: {
                    anchor: '90%'
                },
                items:[fsProdOrigen]
            },{
                columnWidth:.5,
                html: '',
                flex:1,
                layout: {
                    type:'hbox',
                    padding:'5',
                    align:'stretch'
                }/*,
                defaults: {
                    anchor: '90%'
                }*/,
                items:[_this.lotesTab]
            }]
        };



        frmDatosGenerales.add(panProdOrigen);

        this.items = [frmDatosGenerales];

        LOG.inv.rotacionlote.winAddRotacionLote.superclass.constructor.call(this, config);
    },
    verificarCargaInicial:function(){
        let nocargando = this.storeTRnoCarga && this.storeOnoCarga && this.storeDnoCarga &&
            this.storeGpnoCarga && this.storeGonoCarga && this.storeGdnoCarga;
        console.info("storeTRnoCarga: "+this.storeTRnoCarga);
        console.info("storeOnoCarga: "+this.storeOnoCarga);
        console.info("storeDnoCarga: "+this.storeDnoCarga);
        console.info("storeGpnoCarga: "+this.storeGpnoCarga);
        console.info("storeGonoCarga: "+this.storeGonoCarga);
        console.info("storeGdnoCarga: "+this.storeGdnoCarga);
        console.info("--------------------------------------------");
        if(nocargando && this.maskGlobal)
        {
            this.maskGlobal.hide();
        }
    },
    onShowHandler:function () {
        var _this = this;
        this.maximize();
        if (this.record.idrotacionlote) {
            this.maskGlobal = new Ext.LoadMask(this.getEl(), {msg: "Cargando datos..."}, {msgCls: 'mask-css'});
            this.maskGlobal.show();
            window.setTimeout(function(){
                _this.maskGlobal.hide();
                console.info("cierre forzado");
            }, 15000);

        }
    },
    salvarDatos:function (params, scope) {
        var _this = scope || this;
        let val = true;
        if(!_this.cmbTipoRotacion.getValue()){
            _this.cmbTipoRotacion.markInvalid();
            val = false;
        }
        if(!_this.cmbOrigen.getValue()){
            _this.cmbOrigen.markInvalid();
            val = false;
        }
        if(!_this.cmbDestino.getValue()){
            _this.cmbDestino.markInvalid();
            val = false;
        }
        if(!val)
        {
            mostrarMensaje(3, "Existen campos con valores incorrectos.");
            return;
        }
        var data = {
            idtiporotacion:_this.cmbTipoRotacion.getValue(),
            idorigen:_this.cmbOrigen.getValue(),
            iddestino:_this.cmbDestino.getValue(),
            idrotacionlote:_this.record.idrotacionlote,
            observaciones:_this.textObservaciones.getValue(),
            // idcodificadores:idcodificadores,
            // idlotesorigen:idlotesorigen,
            // idlotesdestino:idlotesdestino
        };
        (params)?Ext.apply(data, params):data;

        // var idcodificadores = _this.gridProdOrigen.getStorePrincipal().collect("idcodificador");
        // var idlotesorigen = _this.gridLotOrigen.getStorePrincipal().collect("idlote");
        // var idlotesdestino = _this.gridLotDestino.getStorePrincipal().collect("idlote");
        let mask = new Ext.LoadMask(this.getEl(), {msg: "Guardando datos..."}, {msgCls: 'mask-css'});
        $.ajax({
            url: 'salvarDatos',
            method:'POST',
            dataType:'json',
            beforeSend:function () {
                mask.show();
                return true;
            },
            success:function (resp, estatus, xhr) {
                mask.hide();
                if (resp.success) {
                    _this.record.idrotacionlote = resp.idrotacionlote;
                    _this.record.estado = resp.estado;
                    let mensaje ="La rotaci\xf3n de lotes ha sido guardada satisfactoriamente.";
                    mostrarMensaje(1, mensaje);
                    (data.idcodificadores)?_this.gridProdOrigen.getStorePrincipal().load():true;
                    _this.btnGuardar.disable();
                    if(resp.estado == 1)
                    {
                        _this.btnRotar.enable();
                        _this.btnEliminar.enable();
                    }
                }else {
                    mostrarMensaje(3, "Ocurri\xf3 un error guardando los datos.");
                }
            },
            error:function()
            {
                mostrarMensaje(3, "Ocurri\xf3 un error guardando los datos.");
            },
            data:data
        });

    },
    validarRotar:function(){
        return (this.gridProdOrigen.getStorePrincipal().getTotalCount() &&
            this.gridLotOrigen.getStorePrincipal().getTotalCount() &&
            this.gridLotDestino.getStorePrincipal().getTotalCount());
    },
    actualizarInterfaz:function () {
        this.record.estado = 3;
        this.btnRotar.disable();
        this.btnEliminar.disable();
        this.btnImprimir.enable();
        this.btnGuardar.disable();
        this.cmbTipoRotacion.disable();
        this.cmbDestino.disable();
        this.cmbOrigen.disable();
        this.gridProdOrigen.deshabilitarBotones();
        this.gridProdOrigen.getStorePrincipal().load();
        this.gridProdOrigen.deshabilitarBotones();
        this.gridLotDestino.deshabilitarBotones();
        this.gridLotOrigen.deshabilitarBotones();
        let title = this.idioma.ttitle + ((this.record && this.record.fecharotacionlote)?this.record.fecharotacionlote:fechasub) + " en rotado";
        this.setTitle(title);


    }

});

LOG.inv.rotacionlote.fnRotarLote = function (idrotacionlote, scope, fn, el) {
    let mask = new Ext.LoadMask(el, {msg: "Rotando los lotes..."}, {msgCls: 'mask-css'});
    if(/*_this.validarRotar() && */idrotacionlote){
        mostrarMensaje(2, "\xbfEst\xe1 seguro que desea rotar la rotaci\xf3n de lotes seleccionada\x3f", function (b) {
            if (b ==='ok') {
                $.ajax({
                    url: 'rotarLotes',
                    dataType: 'json',
                    method: 'POST',
                    data: {idrotacionlote: idrotacionlote},
                    beforeSend: function () {
                        mask.show();
                    },
                    success: function (resp) {
                        mask.hide();
                        if (resp.success) {
                            if (resp.men == -3) {
                                mostrarMensaje(3, "El documento no contiene lotes.");
                            } else {
                                mostrarMensaje(1, "Los lotes han sido rotados satisfactoriamente.");
                                if (fn instanceof Function) {
                                    fn.call(scope);
                                }
                            }
                        } else {
                            mostrarMensaje(3, "Ocurri\xf3 un error mientras se rotaban el lotes.");
                        }


                    },
                    error: function () {
                        mask.hide();
                        mostrarMensaje(3, "Ocurri\xf3 un error mientras se rotaban el lotes.");
                    }
                });
            }
        });
    }else{
        mostrarMensaje(1, "Debe llenar toda la informaci\xf3n necesaria para el proceso de rotar.");
    }
};
LOG.inv.rotacionlote.fnImprimirRotaciones = function (idrotacionlote, idioma) {
    /*this.control = new Distra.util.report.ViewController({
        // sm: _this.getGridPrincipal().getSelectionModel(),
        useFirma:false, //(usarPki && typeof pki == 'object'),
        // idioma: this.idioma,
        reportList: [
            {
                name: 'Vista principal',
                params: {
                    idrotacionlote: idrotacionlote,
                    idestructura: idestructura
                },
                dirReports: '/distra/logistica/farmacia/rotacionlote/ModeloRotacionLotes'
            }
        ]

    }).view();*/
    let  repo = new LOG.util.Report({
        reports: [
            {
                typeView: 3,
                isList: true,
                name: 'Vista principal',
                params: {
                    idrotacionlote: idrotacionlote,
                    idestructura: idestructura
                },
                dirReport: '/distra/logistica/farmacia/rotacionlote/ModeloRotacionLotes'
            }
        ]
    }).view();
};

