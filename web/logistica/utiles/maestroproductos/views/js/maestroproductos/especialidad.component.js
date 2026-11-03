Ext.ns('LOG.lb.maestroproductos');
LOG.lb.maestroproductos.CompartimentacionEspecialidad = Ext.extend(LOG.util.Window, {
    usarAceptar: false,
    cerrarAceptar: false,
    resizable: false,
    height: 370,
    width: 530,
    constructor: function(config) {
        config.idioma = LOG.util.UIManager.apply(LOG.util.Idioma, LOG.lb.maestroproductos.Especialidad.Idioma);
        LOG.lb.maestroproductos.CompartimentacionEspecialidad.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        this.arrayMarcados = new LOG.util.List();
        this.arrayDesmarcados = new LOG.util.List();
        this.cbUsuarios = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbUsuario,
            valueField: 'idusuario',
            displayField: 'nombreusuario',
            anchor: '50%',
            url: 'getallusers'
        });
        this.gridEspecialidad = new LOG.util.UITemplate({
            concepto: this.idioma.lbEspecialidad,
            textBusquedaSimple: this.idioma.lbEspecialidad,
            busquedaBasica: true,
            autoSelect: false,
            urlBusquedaGridPrincipal: 'getallespecialidad',
            idGridPrincipal: 'idespecialidad',
            formaVisualizacion: 'panel'
        });
        this.gridEspecialidad.addGridColumn({
            header: this.idioma.lbEspecialidad,
            dataIndex: 'denespecialidad',
            autoExpand: true
        });
        this.gridEspecialidad.addGridColumn({
            dataIndex: 'idespecialidad'
        });
        this.gridEspecialidad.addGridColumn({
            dataIndex: 'selected'
        });
        this.gridEspecialidad.init();
        this.items = [{
                region: 'north',
                labelAlign: 'top',
                frame: true,
                layout: 'form',
                height: 80,
                items: [this.cbUsuarios]
            }, this.gridEspecialidad.view()];
        this.setTitle(this.idioma.lbCompartimentacion);
        var _this = this;
        this.gridEspecialidad.getSmPrincipal().on({
            'rowselect': function(sm, pos, rec) {
                var esta = false;
                _this.arrayDesmarcados.each(function(id, pos) {
                    if (id == rec.id) {
                        _this.arrayDesmarcados.delete(pos);
                    }
                });
                _this.arrayMarcados.each(function(id) {
                    if (id == rec.id) {
                        esta = true;
                    }
                });
                if (!esta) {
                    _this.arrayMarcados.add(rec.id);
                }
            },
            'rowdeselect': function(sm, pos, rec) {
                var esta = false;
                _this.arrayMarcados.each(function(id, pos) {
                    if (id == rec.id) {
                        _this.arrayMarcados.delete(pos);
                    }
                });
                _this.arrayDesmarcados.each(function(id) {
                    if (id == rec.id) {
                        esta = true;
                    }
                });
                if (!esta) {
                    _this.arrayDesmarcados.add(rec.id);
                }
            }
        });
        LOG.util.UIManager.encadenaFn(this.gridEspecialidad.getStorePrincipal(), 'fireEvent', function(e, st, rec) {
            if (e == 'load') {
                var marcado = new Array();
                var desmarcado = new Array();
                Ext.each(rec, function(it, index) {
                    _this.arrayMarcados.each(function(id) {
                        if (id == it.id) {
                            marcado.push(index);
                        }
                    });
                    var _flagMarcado = true;
                    _this.arrayDesmarcados.each(function(id) {
                        if (id == it.id) {
                            _flagMarcado = false;
                            desmarcado.push(index);
                        }
                    });
                    if (it.data.selected == 'true' && _flagMarcado) {
                        marcado.push(index);
                    }
                });
                _this.gridEspecialidad.getSmPrincipal().selectRows(marcado);
                //_this.gridEspecialidad.getSmPrincipal().deselectRows(desmarcado);
            }
        });
        LOG.util.UIManager.encadenaFn(this.cbUsuarios, 'fireEvent', function(e, cb) {
            if (e == 'select') {
                _this.gridEspecialidad.getSmPrincipal().clearSelections();
                _this.arrayMarcados.deleteAll();
                _this.arrayDesmarcados.deleteAll();
                _this.gridEspecialidad.getStorePrincipal().load({
                    params : {
                        start : 0,
                        idusuario : cb.getValue()
                    }
                });
            }
        });
        LOG.lb.maestroproductos.CompartimentacionEspecialidad.superclass.initComponent.call(this, arguments);
    },
    aceptarFn: function() {
        if (this.arrayMarcados.count() > 0 || this.arrayDesmarcados.count() > 0) {
            Ext.MessageBox.wait(this.idioma.msgSalvandoObjeto, this.idioma.msgEspere || '...');
            var objSubmit = {
                idusuario: this.cbUsuarios.getValue(),
                marcados: Ext.encode(this.arrayMarcados.getArray()),
                desmarcados: Ext.encode(this.arrayDesmarcados.getArray())
            };
            Ext.Ajax.request({
                url: 'adicionarCompartimentacionEsp',
                method: 'POST',
                params: objSubmit,
                callback: function(o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, this.idioma.lbMsgObjetoSalvado);
                        }
                    }
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(3, this.idioma.msgDatosIncorrectos);
        }
    }
});
