Ext.ns('LOG.lb.taskprogramer');
/**
 * Componente para la gestión de tareas programadas.
 * @type LOG.util.UITemplate
 */
LOG.lb.taskprogramer.View = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.urlBusquedaGridPrincipal = 'cargarTareas';
        this.idioma = Ext.apply(LOG.util.Idioma.init(), LOG.lb.taskprogramer.Idioma);
        this.concepto = this.idioma.ttBtnBuscarTarea;
        this.busquedaBasica = true;
        this.textBusquedaSimple = this.idioma.lbBuscar;
        this.modelo = new LOG.lb.taskprogramer.Model({
            idioma: this.idioma
        });
        LOG.lb.taskprogramer.View.superclass.constructor.call(this, config);
        this.winTask = new LOG.lb.taskprogramer.addTask({
            idioma: this.idioma,
            modelo: this.modelo
        });
    },
    /**
     * Inicializa los botones del componente.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: this.idioma.ttBtnAdicionar,
            hidden: true,
            handler: function() {
               _this.winTask.initVentana();
            },
            controlFn: function(b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonModificar({
            tooltip: this.idioma.ttBtnModificar,
            hidden: true,
            isContextual: true,
            handler: function() {
                _this.winTask.initVentana(_this.getSmPrincipal().getSelected());
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'editarTarea');
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttBtnEliminar,
            hidden: true,
            isContextual: true,
            handler: function() {
                _this.modelo.eliminar();
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'eliminarTarea');
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnActivar,
            tooltip: this.idioma.ttBtnActivar,
            iconCls: 'activar',
            hidden: true,
            isContextual: true,
            handler: function() {
                _this.modelo.activar(true);
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RActivar')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '1') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'activarTarea');
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnDesactivar,
            tooltip: this.idioma.ttBtnDesactivar,
            iconCls: 'activar',
            hidden: true,
            isContextual: true,
            handler: function() {
                _this.modelo.activar();
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RActivar')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '2') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'desactivarTarea');
                } else {
                    b.hide();
                }
            }
        }));
    },
    /**
     * Inicializa las columnas del grid.
     * @returns {undefined}
     */
    initDefaultColumns: function() {
        this.addGridColumn({dataIndex: 'idtarea'});
        this.addGridColumn({dataIndex: 'code'});
        this.addGridColumn({dataIndex: 'jsondata'});
        this.addGridColumn({dataIndex: 'horas'});
        this.addGridColumn({dataIndex: 'min'});
        this.addGridColumn({dataIndex: 'descripcion'});
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 80,
            dataIndex: 'estado',
            renderer: function(_v) {
                return LOG.lb.taskprogramer.Estado[_v];
            },
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUltimaEjecucion,
            width: 100,
            dataIndex: 'ultimaejecucion',
            default: true
        });
    },
    /**
     * Reprograma los eventos.
     * @returns {vistaPrincipal}
     */
    render: function() {
        var render = LOG.lb.taskprogramer.View.superclass.render.call(this);
        var _this = this;
        this.getStorePrincipal().on({
            load: function() {
                this.each(function(_t, index) {
                    var css = _t.data.estado == '1' ? 'redrow-text' : '';
                    Ext.fly(_this.getGridPrincipal().getView().getRow(index)).addClass(css);
                });
            }
        });
        this.getGridPrincipal().on({
            dblclick: function() {
                _this.winTask.initVentana(_this.getSmPrincipal().getSelected());
            }
        });
        return render;
    }
});



/**
 * 
 * @type LOG.util.Window
 */
LOG.lb.taskprogramer.addTask = Ext.extend(LOG.util.Window, {
    width: 700,
    height: 490,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.tablameta = {esquema: 'mod_lognotificacion', denominacion: '', columnaref: 'code', datoref: ''};
        LOG.lb.taskprogramer.addTask.superclass.constructor.call(this, config);
        this.title = this.idioma.tlConfigurarTarea;
        this.resizable = false;
        this.modelo.addActionButton(this.listaBotones.getItem(1));
        this.modelo.addActionButton(this.listaBotones.getItem(2));
    },
    /**
     * Inicializa los campos de entrada de datos del componente.
     * @returns {undefined}
     */
    initComponent: function() {
        var _this = this;
        LOG.lb.taskprogramer.addTask.superclass.initComponent.call(this);
        // Combo de NomTarea.
        this.cbNomTareas = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbTarea,
            hiddenName: 'code',
            valueField: 'code',
            displayField: 'denominacion',
            url: 'cargarComboNomTareas',
            anchor: '100%',
            allowBlank: false,
            listeners: {
                select: function (cb, _r) {
                    if (_r) {
                        if (_r.data)
                            _this.modelo.denominacion = _r.data.denominacion;
                        _this.fsParametros.reconfigurePanel(_r.code, function(v) {
                            _this.fsParametros.setValues(Ext.decode(_this.modelo.json));
                            _this.fsParametros.getVistaPrincipal().setVisible(v);
                            _this.fsParametros.getVistaPrincipal().doLayout();
                        });
                    }
                }
            }
        });

        // Parametros dinamicos.
        this.fsParametros = new LOG.lb.plugin.VistaAgrupaciones({
            model: this.modelo,
            tablameta: this.tablameta,
            columnas: 2,
            height: 96,
            anchor: '100%'
        });
        
        // Dias.
        this.clsDias = new LOG.util.ColumnForm({columnas: 7});
        this.clsDias.addComponent(new Ext.form.Checkbox({
            fieldLabel: this.idioma.lbChLunes,
            name: 'lunes',
            dias: true,
            valor: 1,
            listeners: {
                check: function() {
                    _this.checkDay();
                }
            }
        }));
        this.clsDias.addComponent(new Ext.form.Checkbox({
            fieldLabel: this.idioma.lbChMartes,
            name: 'martes',
            dias: true,
            valor: 2,
            listeners: {
                check: function() {
                    _this.checkDay();
                }
            }
        }));
        this.clsDias.addComponent(new Ext.form.Checkbox({
            fieldLabel: this.idioma.lbChMiercoles,
            name: 'miercoles',
            dias: true,
            valor: 3,
            listeners: {
                check: function() {
                    _this.checkDay();
                }
            }
        }));
        this.clsDias.addComponent(new Ext.form.Checkbox({
            fieldLabel: this.idioma.lbChJueves,
            name: 'jueves',
            dias: true,
            valor: 4,
            listeners: {
                check: function() {
                    _this.checkDay();
                }
            }
        }));
        this.clsDias.addComponent(new Ext.form.Checkbox({
            fieldLabel: this.idioma.lbChViernes,
            name: 'viernes',
            dias: true,
            valor: 5,
            listeners: {
                check: function() {
                    _this.checkDay();
                }
            }
        }));
        this.clsDias.addComponent(new Ext.form.Checkbox({
            fieldLabel: this.idioma.lbChSabado,
            name: 'sabado',
            dias: true,
            valor: 6,
            listeners: {
                check: function() {
                    _this.checkDay();
                }
            }
        }));
        this.clsDias.addComponent(new Ext.form.Checkbox({
            fieldLabel: this.idioma.lbChDomingo,
            name: 'domingo',
            dias: true,
            valor: 0,
            listeners: {
                check: function() {
                    _this.checkDay();
                }
            }
        }));
        this.fsDias = new Ext.form.FieldSet({
            items: [this.clsDias]
        });
        
        // Horas.
        this.clsHorario = new LOG.util.ColumnForm({columnas: 4});
        this.clsHorario.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.lbTfHoras,
            name: 'horas'
        }));
        this.clsHorario.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.lbTfMinutos,
            name: 'min'
        }));
        this.clsHorario.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.lbTfDias,
            name: 'dom'
        }));
        this.clsHorario.addComponent(LOG.util.Prototipos.inputTexto({
            fieldLabel: this.idioma.lbTfMes,
            name: 'mes'
        }));
        this.fsHoras = new Ext.form.FieldSet({
            items: [this.clsHorario]
        });
        
        this.fsGeneral = new Ext.form.FieldSet({
            items: [
                this.cbNomTareas, this.fsDias, this.fsHoras,
                new Ext.form.TextArea({
                    fieldLabel: this.idioma.lbTaDescripcion,
                    name: 'descripcion',
                    anchor: '100%',
                    height: 50
                }),
                this.fsParametros.getVistaPrincipal()
            ]
        });
        
        this.fsNotificacion = new Ext.form.FieldSet({
            items: [
                LOG.util.Prototipos.inputTexto({
                    fieldLabel: this.idioma.lbTfNotificarA,
                    name: 'dinotificar',
                    anchor: '100%',
                    disabled: true,
                    allowBlank: false,
                    notificacion: true
                }),
                new Ext.form.TextArea({
                    fieldLabel: this.idioma.lbTaNotificacion,
                    name: 'notificacion',
                    anchor: '100%',
                    height: 260,
                    disabled: true,
                    allowBlank: false,
                    notificacion: true
                }),
                new Ext.form.Checkbox({
                    fieldLabel: this.idioma.lbChNotificar,
                    name: 'notificar',
                    listeners: {
                        check: function(_ch, _v) {
                            Ext.each(_this.fsNotificacion.find('notificacion', true), function(item) {
                                if (_v) {
                                    item.enable();
                                    if (item.name == 'dinodificar') {
                                        item.focus();
                                    }
                                } else {
                                    item.setValue(null);
                                    _this.modelo[item.name] = null;
                                    item.disable();
                                }
                            });
                        }
                    }
                })
            ]
        });
        this.clsGeneral = new LOG.util.ColumnForm({});
        this.clsGeneral.addComponent(this.fsGeneral);
        this.clsGeneral.addComponent(this.fsNotificacion);
        this.clsGeneral.getColumn(0).columnWidth = 0.6;
        this.clsGeneral.getColumn(1).columnWidth = 0.4;
        this.formulario = LOG.util.UIManager.initForm({
            frame: true,
            region: 'center',
            labelAlign: 'top',
            items: [this.clsGeneral]
        });
        this.add(this.formulario);
        this.modelo.bindForm(this.formulario);
    },
    /**
     * @param {Ext.data.Record} datos
     * @returns {undefined}
     */
    initVentana: function(datos) {
        if (datos) {
            this.modelo.loadRecord();
            this.modelo.dow = this.modelo.dow || '';
            Ext.each(this.clsDias.find('dias', true), function(d) {
                d.checked = false;
                if (this.modelo.dow.includes(d.valor) || this.modelo.dow == '*') {
                    d.checked = true;
                }
                datos.data[d.name] = datos.json[d.name] = d.checked;
            }, this);
            this.formulario.getForm().loadRecord(datos);
            this.cbNomTareas.fireEvent('select', this.cbNomTareas, this.cbNomTareas.getStore().getById(this.modelo.idnomtarea));
        } else {
            this.modelo.reset();
            this.formulario.getForm().reset();
            this.cbNomTareas.fireEvent('select', this.cbNomTareas, {});
        }
        this.show();
        this.cbNomTareas.focus(true);
    },
    /**
     * @returns {undefined}
     */
    checkDay: function() {
        this.modelo.dow = null;
        Ext.each(this.clsDias.find('dias', true), function(d) {
            if (d.checked) {
                this.modelo.dow = this.modelo.dow || '';
                this.modelo.dow += d.valor + '';
            }
            if (this.modelo.dow && this.modelo.dow.length == 7) {
                this.modelo.dow = '*';
            }
        }, this);
    },
    /**
     * @returns {undefined}
     */
    aceptarFn: function() {
        this.modelo.json = Ext.encode(this.fsParametros.getFieldValues(true));
        this.modelo.salvar();
    }
});