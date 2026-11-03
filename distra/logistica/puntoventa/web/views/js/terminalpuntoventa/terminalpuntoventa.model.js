Ext.ns('LOG.fac.puntoventa');
LOG.fac.puntoventa.Model = Ext.extend(LOG.util.Model, {
    cNumber: '',
    constructor: function (config) {
        this.urlController = '/logistica/facturacion/puntoventa/index.php/terminalpuntoventa';
        this.urlIniciarSecionAction = 'iniciarSesion';
        this.urlRealizarVentaAction = 'realizarVenta';
        this.urlCerrarSesionAction = 'cerrarSesion';
        this.urlCargaInicialAction = 'cargaInicial';
        this.listProductos = new LOG.util.List();
        this.listServicios = new LOG.util.List();
        LOG.fac.puntoventa.Model.superclass.constructor.call(this, config);
    },
    iniciarSesion: function (parametros, _fn, _fnfail) {
        Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        var me = this;
        objSubmit.data = Ext.encode(this.encode());        
        console.info('aqui poner noobligatorio 1');
        console.info(me);
        Ext.Ajax.request({
            url: this.urlController + this.urlIniciarSecionAction,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        if (this.st) {
                            this.st.reload();
                        }
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    cerrarSesion: function (parametros, _fn, _fnfail) {
        var me = this;
        var objSubmit = parametros || {};
        mostrarMensaje(2, this.idioma.msgCerrarSesion, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgCerrandoSesion, this.idioma.msgEspere || '...');
                Ext.Ajax.request({
                    url: me.urlController + me.urlCerrarSesionAction,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        me.apply(resp);
                        if (resp.success) {
                            mostrarMensaje(1, this.idioma.msgCierreSesion);
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(me, [resp]).call();
                            }
                        } else {
                            if (typeof _fnfail == 'function') {
                                _fnfail.createDelegate(me, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        });
    },
    addProducts: function (parametros) {
        var selections = parametros.selections.split(','), noExist = true, me = this;
        var importetotal = 0;
        if (selections[2].split(':')[1] != 0) {
            this.listProductos.each(function (r) {
                if (selections[0].split(':')[1] == r.idproducto) {
                    r.cantidad = parseFloat(r.cantidad) + 1;
                    r.importetotal = parseFloat(r.cantidad) * parseFloat(r.precio);
                    noExist = false;
                }
            });
            if (noExist) {
                var producto = {};
                for (var i = 0; i < selections.length; i++) {
                    producto[selections[i].split(':')[0]] = selections[i].split(':')[1];
                }
                producto.cantidad = 1;
                //producto.descuento = '0';
                producto.importetotal = parseFloat(producto.cantidad) * parseFloat(producto.precio);
                producto[''] = '';               
                this.listProductos.add(producto);
            }
            this.st.removeAll();
            let importeProductos = 0;
            let importeServicios = 0;
            this.listProductos.each(function (r) {
                me.st.add(new Ext.data.Record(r));
                importeProductos += parseFloat(r.importetotal);
            });
            if (this.listProductos.count() > 0) {
                me.st.add(new Ext.data.Record({
                    text: 'Total productos:',
                    idindicador: -1,
                    importetotal: importeProductos
                }));
            }
            this.listServicios.each(function (r) {
                me.st.add(new Ext.data.Record(r));
                importeServicios += parseFloat(r.importetotal);
            });
            if (this.listServicios.count() > 0) {
                me.st.add(new Ext.data.Record({
                    text: 'Total servicios:',
                    idindicador: -1,
                    importetotal: importeServicios
                }));
            }
            parametros.stDtView.each(function (r) {
                if (selections[0].split(':')[1] == r.data.idproducto && r.data.disponible >= 0) {
                    r.data.disponible = parseFloat(r.data.disponible) - 1;
                    r.commit();
                }
            });
            this.sm.selectLastRow();
        }
    },
    addServicios: function (parametros) {
        var selections = parametros.selections.split(','), noExist = true, me = this;
        var importetotal = 0;
        this.listServicios.each(function (r) {
            if (selections[1].split(':')[1] == r.idindicador) {
                r.cantidad = parseFloat(r.cantidad) + 1;
                r.importetotal = parseFloat(r.cantidad) * parseFloat(r.precio);
                noExist = false;
            }
        });
        if (noExist) {
            var service = {};
            for (var i = 0; i < selections.length; i++) {
                service[selections[i].split(':')[0]] = selections[i].split(':')[1];
            }
            service.cantidad = 1;
            //producto.descuento = '0';
            service.importetotal = parseFloat(service.cantidad) * parseFloat(service.precio);

            service[''] = '';
            this.listServicios.add(service);
        }
        this.st.removeAll();
        let importeProductos = 0;
        let importeServicios = 0;
        this.listProductos.each(function (r) {
            me.st.add(new Ext.data.Record(r));
            importeProductos += parseFloat(r.importetotal);
        });
        if (this.listProductos.count() > 0) {
            me.st.add(new Ext.data.Record({
                text: 'Total productos:',
                idindicador: -1,
                importetotal: importeProductos
            }));
        }
        this.listServicios.each(function (r) {
            me.st.add(new Ext.data.Record(r));
            importeServicios += parseFloat(r.importetotal);
        });
        if (this.listServicios.count() > 0) {
            me.st.add(new Ext.data.Record({
                text: 'Total servicios:',
                idindicador: -1,
                importetotal: importeServicios
            }));
        }
        /*parametros.stDtView.each(function (r) {
            if (selections[0].split(':')[1] == r.data.idproducto && r.data.disponible >= 0) {
                r.data.disponible = parseFloat(r.data.disponible) - 1;
                r.commit();
            }
        });*/
        this.sm.selectLastRow();
    },
    deleteProducts: function (selected, stDatView) {
        var me = this;
        stDatView.each(function (r) {
            if (selected.data.idproducto == r.data.idproducto) {
                r.set('disponible', parseFloat(r.data.disponible) + parseFloat(selected.data.cantidad));
                r.commit();
            }
        });
        this.listProductos.each(function (r, i) {
            if (selected.data.idproducto == r.idproducto) {
                me.listProductos.delete(i);
                return;
            }
        });
        this.st.removeAll();
        let importeProductos = 0;
        let importeServicios = 0;
        this.listProductos.each(function (r) {
            me.st.add(new Ext.data.Record(r));
            importeProductos += parseFloat(r.importetotal);
        });
        if (this.listProductos.count() > 0) {
            me.st.add(new Ext.data.Record({
                text: 'Total productos:',
                idindicador: -1,
                importetotal: importeProductos
            }));
        }
        this.listServicios.each(function (r) {
            me.st.add(new Ext.data.Record(r));
            importeServicios += parseFloat(r.importetotal);
        });
        if (this.listServicios.count() > 0) {
            me.st.add(new Ext.data.Record({
                text: 'Total servicios:',
                idindicador: -1,
                importetotal: importeServicios
            }));
        }
        this.sm.selectFirstRow();
    },
    deleteServicios: function (selected, stDatView) {
        var me = this;
        this.listServicios.each(function (r, i) {
            if (selected.data.idindicador == r.idindicador) {
                me.listServicios.delete(i);
                return;
            }
        });
        this.st.removeAll();
        let importeProductos = 0;
        let importeServicios = 0;
        this.listProductos.each(function (r) {
            me.st.add(new Ext.data.Record(r));
            importeProductos += parseFloat(r.importetotal);
        });
        if (this.listProductos.count() > 0) {
            me.st.add(new Ext.data.Record({
                text: 'Total productos:',
                idindicador: -1,
                importetotal: importeProductos
            }));
        }
        this.listServicios.each(function (r) {
            me.st.add(new Ext.data.Record(r));
            importeServicios += parseFloat(r.importetotal);
        });
        if (this.listServicios.count() > 0) {
            me.st.add(new Ext.data.Record({
                text: 'Total servicios:',
                idindicador: -1,
                importetotal: importeServicios
            }));
        }
        this.sm.selectFirstRow();
    },
    calculator: function (cBtn, operacion, stDtView) {
        if (this.sm.hasSelection()) {
            var selection = this.sm.getSelected(), num = parseFloat(cBtn.value), disponible = 0, modified = false;
            selection.beginEdit();
            if (!isNaN(num)) {
                if (typeof selection.get(operacion) == 'number') {
                    var numero = selection.get(operacion).toString();
                    numero = numero.split('.')
                    if (numero.length == 2 && numero[1].length == 2) {
                        return;
                    }
                }
                if (operacion == 'cantidad') {
                    var newCantidad = String.format('{0}{1}', selection.get(operacion), cBtn.value);
                    if (parseFloat(newCantidad) <= parseFloat(selection.get('disponible'))) {
                        selection.set(operacion, parseFloat(newCantidad));
                        disponible = parseFloat(selection.get('disponible')) - parseFloat(selection.get(operacion));
                        modified = true;
                    } else {
                        mostrarMensaje(1, this.idioma.msgFailRegistarCantidad);
                    }
                } /*else if (operacion == 'descuento') {
                    var descuento = selection.get(operacion).split('%')[0];
                    var arrayDescuento = descuento.toString();
                    for (var i = 0; i < arrayDescuento.length; i++) {
                        if (arrayDescuento.charAt(i) == '.') {
                            arrayDescuento = arrayDescuento.slice(i);
                            break;
                        }
                    }
                    var newDescuento = descuento + cBtn.value;
                    if (parseFloat(newDescuento) >= 0 && parseFloat(newDescuento) <= 100 && arrayDescuento.length <= 2) {
                        selection.set(operacion, newDescuento);
                    } else {
                        mostrarMensaje(1, this.idioma.msgFailRegistarDescuento);
                    }
                }*/
            } else if (cBtn.value == '.') {
                var selectionToString = selection.get(operacion).toString();
                if (selectionToString.indexOf('.') == -1) {
                    var descuento = operacion == 'cantidad' ? selection.get(operacion) : selection.get(operacion).split('%')[0];
                    selection.set(operacion, String.format('{0}{1}', descuento, '.'));
                }
            } else if (cBtn.value == 'CE') {
                disponible = selection.get('disponible');
                modified = true;
                selection.set(operacion, operacion == 'cantidad' ? '0' : '0%');
            }
            selection.endEdit();
            selection.commit();
            if (operacion == 'cantidad' && modified) {
                stDtView.each(function (r) {
                    if (selection.data.idproducto == r.data.idproducto) {
                        r.set('disponible', parseFloat(disponible));
                        r.commit();
                    }
                });
            }
        }
    },
    updateCantidad: function (stDtView) {
        var selection = this.sm.getSelected();
        stDtView.each(function (r) {
            if (selection.data.idproducto == r.data.idproducto) {
                var disponible = selection.data.disponible - selection.data.cantidad;
                r.set('disponible', (selection.data.cantidad <= selection.data.disponible) ? parseFloat(disponible).toFixed(2) : 0);
                r.commit();
            }
        }); 
    },
    updateDatosVenta: function (stProductos,datos) {
        var me = this, importeTotal = 0, subtotal = 0, descTotal = 0;
        if(stProductos.data.length > 0){
            stProductos.each(function (rd) {
                if (rd.get('idindicador') != -1) {
                    var importe = parseFloat(rd.get('precio')) * parseFloat(rd.get('cantidad')), descuento = 0;
                    subtotal = parseFloat(subtotal) + parseFloat(importe);
                    if (parseFloat(rd.get('descuento')) != 0) {
                        descuento = (rd.get('descuento'))? (parseFloat(importe) * parseFloat(rd.get('descuento')) / 100):0;
                        importe = parseFloat(importe) - parseFloat(descuento);
                    }
                    descTotal = parseFloat(descTotal) + parseFloat(descuento);
                    importeTotal = parseFloat(importeTotal) + parseFloat(importe);
                }
            });
        }
        if (datos.tipoconceptoventa == 1) {
            descTotal = descTotal + (importeTotal*datos.valorconcepto/100);
            importeTotal = (datos.conceptoventa == '+') ? importeTotal + descTotal : importeTotal - descTotal ;
        }

        document.getElementById('idvalorsubtotal').innerHTML = Ext.util.Format.number(parseFloat(subtotal).toFixed(2), '0,000.00');
        document.getElementById('idvalordescuento').innerHTML = Ext.util.Format.number(parseFloat(descTotal).toFixed(2), '0,000.00'); //;
        document.getElementById('idvalortotal').innerHTML = Ext.util.Format.number(parseFloat(importeTotal).toFixed(2), '0,000.00')+' '+datos.monedaventa; //;
    },
    cancelarVenta: function () {
        //var me = this;
        /*stDtView.each(function (rd) {
            me.listProductos.each(function (r, i) {
                if (rd.data.idproducto == r.idproducto) {
                    rd.set('disponible', r.disponible);
                    rd.commit();
                }
            });
        });*/
        this.listProductos.deleteAll();
        this.listServicios.deleteAll();
        this.st.removeAll();
    },
    realizarVenta: function (parametros, _fn, _fnfail) {
        Ext.MessageBox.wait(this.idioma.msgRealizarVenta, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {}, me = this;
        objSubmit.data = Ext.encode(this.encode());
        Ext.Ajax.request({
            url: this.urlController + this.urlRealizarVentaAction,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    me.listProductos.deleteAll();
                    me.listServicios.deleteAll();
                    me.st.removeAll();
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    insertarDatosPosVenta: function (parametros, _fn, _fnfail){
        Ext.MessageBox.wait(this.idioma.msgRealizarVenta, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {}, me = this;
        objSubmit.data = Ext.encode(this.encode());
        Ext.Ajax.request({
            url: this.urlController + 'insertarDatosPosVenta',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    //me.listProductos.deleteAll();
                    //me.st.removeAll();
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    testFUC: function (){
        Ext.MessageBox.wait('Probando ...');
        Ext.Ajax.request({
            url: this.urlController + 'testFUC',
            method: 'POST',
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
            }.createDelegate(this)
        });
    },
    cargaInicial: function (_fn, _fnfail) {
        var me = this;
        Ext.Ajax.request({
            url: this.urlController + this.urlCargaInicialAction,
            callback: function (o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                //console.info('aqui poner noobligatorio 2');
                //console.info(me);
                if (resp.success) {
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    convertirImporte: function (idmonedabase, monto, idmonedacambio, tasa, importeTotal){
        var me = this;
        var cambio = 0;
        tasa.forEach(function (r) {
            if(idmonedacambio == idmonedabase){
                cambio = (parseFloat(monto) - parseFloat(importeTotal)).toFixed(2);
            }else if((idmonedabase == r.idmonedabase || idmonedabase == r.idmonedacambio) &&  
                        (idmonedacambio == r.idmonedabase || idmonedacambio == r.idmonedacambio)){
                if(idmonedacambio == r.idmonedabase){
                    cambio = (parseFloat(monto / r.venta) - parseFloat(importeTotal)).toFixed(2);
                }else{
                    cambio = (parseFloat(monto * r.venta) - parseFloat(importeTotal)).toFixed(2);
                }

            }
        });
        return cambio;
    },
    registrarEfectivo: function (parametros, _fn, _fnfail){
        Ext.MessageBox.wait(this.idioma.msgRealizarVenta, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {}, me = this;
        objSubmit.data = Ext.encode(this.encode());
        Ext.Ajax.request({
            url: this.urlController + 'registrarEfectivo',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {                    
                    mostrarMensaje(1, this.idioma.msgExitosaSave);
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    }
});