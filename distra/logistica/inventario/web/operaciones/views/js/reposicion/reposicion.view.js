Ext.ns('LOG.inv.reposicion');
LOG.inv.reposicion.View = Ext.extend(LOG.util.UITemplate, {

    constructor: function (config) {
        this.dirController = '/logistica/inventario/operaciones/index.php/reposicionproducto';
        this.urlBusquedaGridPrincipal = 'getProductosReposicion';
        this.textBusquedaSimple = config.idioma.lbBusquedaProducto;
        this.concepto = config.idioma.txtBusquedaProducto;
        this.idGridPrincipal = 'idproducto';
        this.gridEditable = true;
        this.modelo = new LOG.inv.reposicion.Model({
            idioma:config.idioma
        });
        LOG.inv.reposicion.View.superclass.constructor.call(this, config);
    },

    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonGuardar({
            controlFn: function (b, __caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RReponer')) {
                    b.show();
                } else {
                    b.hide();
                }
                /*b.disable();
                LOG.util.UIManager.encadenaFn(__caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });*/
            },
            handler: function () {
                var datos =  new Array();
                var allRecord = _this.getStorePrincipal().getModifiedRecords();
                if(allRecord.length>0) {
                    Ext.each(allRecord, function (rm, index) {
                        if (rm.dirty) {
                            datos.push(rm.data);
                        }
                    });
                    _this.modelo.guardarCantidad({valoresareponer: Ext.encode(datos)}, function(){
                        _this.getStorePrincipal().load();
                        //Se quedan los record modificados y trae problema al adicionar nuevos.
                        Ext.apply(_this.getStorePrincipal(),{modified:new Array()});
                    });
                } else {
                    mostrarMensaje(1, 'No se ha modificado alguna cantidad para guardar.');
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            text: this.idioma.lbBtnRep,
            tooltip: this.idioma.lbBtnRep,
            iconCls : 'sincronizar',
            controlFn: function (b, __caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RReponer')) {
                    b.show();
                } else {
                    b.hide();
                }
                b.disable();
                LOG.util.UIManager.encadenaFn(__caller.getSmPrincipal(), 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            },
            handler: function () {
                mostrarMensaje(2, '\xbfEst\xe1 seguro que desea realizar la reposici\xf3n', function (btn) {
                    if (btn == 'ok') {
                        var datos = new Array();
                        //var allRecord = _this.getSmPrincipal().getSelections();
                        //if (allRecord.length > 0) {
                            /*Ext.each(allRecord, function (rm, index) {
                                if (rm.dirty && rm.data.cantidadrep > 0) {
                                    datos.push(rm.data);
                                }
                            });*/
                            //if (datos.length > 0) {
                                _this.modelo.reponer({/*productos: Ext.encode(datos)*/}, function (resp) {
                                    _this.getStorePrincipal().reload();
                                    if (resp['msg']) {
                                        mostrarMensaje(1, resp['msg']);
                                    }
                                });
                            //}
                            //else mostrarMensaje(1, 'Debe seleccionar un producto con cantidad mayor que cero y que no est\xe9 siendo modificado.');
                        /*} else {
                            mostrarMensaje(1, ' Seleccione al menos un producto para reponer.');
                        }*/
                    }
                });
            }
        }));
    },
    initDefaultColumns: function () {
        
        this.addGridColumn({
            dataIndex: 'idestructura'
        });
        this.addGridColumn({
            dataIndex: 'idindicador'
        });        
        this.addGridColumn({
            dataIndex: 'idproducto'
        });
        this.addGridColumn({
            dataIndex: 'iddeposdestino'
        });
        this.addGridColumn({
            dataIndex: 'iddeposorigen'
        });
        this.addGridColumn({
            dataIndex: 'idreposicion'
        });
        this.addGridColumn({
            dataIndex: 'codigo',
            header: this.idioma.lbCodigo,
            width: 170,
            default: true
        });
        
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.lbDenominacion,
            width: 320,
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'cantidad',
            header: this.idioma.lbCantVenta,
            width: 120,
            align:'right'
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'cantalmacen',
            header: this.idioma.lbCantAlm,
            width: 125,
            align:'right'
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidadEntera({
            dataIndex: 'minimoventa',
            header: this.idioma.lbMinVenta,
            width: 120,
            align:'right'
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidadEntera({
            dataIndex: 'fondofijo',
            header: this.idioma.lbFF,
            width: 120,
            align:'right'
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'cantreponercalculada',
            header: this.idioma.lbPropuestaRep,
            width: 120,
            align:'right',
            renderer:function(val,x,rec){
                /*if(parseFloat(rec.data.cantidad) >= parseFloat(rec.data.minimoventa)) {
                    return 0;
                }
                else*/ if( parseFloat(rec.data.cantalmacen) > (parseFloat(rec.data.fondofijo)  - parseFloat(rec.data.cantidad))) {
                    return (parseFloat(rec.data.fondofijo)  - parseFloat(rec.data.cantidad));
                }
                else {
                    return parseFloat(rec.data.cantalmacen);
                }
            }
        }));
        
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            dataIndex: 'cantidadrep',
            header: this.idioma.lbRep,
            width: 120,
            align:'right',
            editor : LOG.util.Prototipos.inputEntero({
                name  : 'cantidadrep',
                allowBlank : false
            }),
            renderer:function(val,x,rec){
                if(!val)return 0;
                return val;
        }
        }));

    },
    render:function(){
        var vista =  LOG.inv.reposicion.View.superclass.render.call(this);
        this.getGridPrincipal().fireEvent = this.getGridPrincipal().fireEvent.createSequence(function(e,obj) {
            if (e == 'afteredit') {
                var rec = obj.record;
                if (obj.field == 'cantidadrep') {
                    if (rec.data.cantalmacen < obj.value) {
                        obj.value = obj.originalValue;
                        rec.data.cantidadrep = obj.originalValue;
                        obj.cancel = true;
                        rec.dirty = false;
                        obj.grid.getView().refresh();
                        mostrarMensaje(1, ' La cantidad debe ser menor o igual que la cantidad en almac\xe9n.');
                    }
                }
            }
        });
        return vista;
    }

});

LOG.inv.reposicion.Model = Ext.extend(LOG.util.Model , {
    gridEditado:false,
    constructor: function (config) {
        //config.urlController = '/logistica/farmacia/farmacia/index.php/tarjetamedicamento/';
        if (!config.fields) {
            config.fields = [];
        }

        LOG.inv.reposicion.Model.superclass.constructor.call(this, config);
    },

    guardarCantidad: function(parametros, _fn, loadStore) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = parametros ||{};
        Ext.Ajax.request({
            url: _this.urlController + 'guardarReposicion',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, this.idioma.lbMsgObjetoSalvado);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    },
    reponer: function(parametros, _fn, loadStore) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = parametros ||{};
        Ext.Ajax.request({
            url: _this.urlController + 'reponer',
            method: 'POST',
            params: objSubmit,
            callback: function(o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        if(resp['nrodoc']){
                            mostrarMensaje(1, 'La reposici\xf3n se ha realizado satisfactoriamente. Nro de transferencia ' + resp['nrodoc'] + ' de la fecha ' + resp['fechacontable']);
                        }
                        else
                            mostrarMensaje(1, this.idioma.lbMsgObjetoSalvado);
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)

        });
    }
});