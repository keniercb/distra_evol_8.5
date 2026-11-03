Ext.ns('LOG.lb.task');
/**
 * Componente para la gestión de tareas programadas.
 * @type LOG.util.UITemplate
 */
LOG.lb.task.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.busquedaBasica = true;
        this.modoSeleccion = 3;
        this.dirController = '/logistica/utiles/taskprogramer/index.php/task';
        config.urlBusquedaGridPrincipal = 'cargarTask';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.lb.taskprogramer.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        this.tablameta = {esquema: '', tabla: '', columnaref: '', datoref: ''};
        this.textBusquedaSimple = this.idioma.cgDenominacion;
        LOG.lb.task.View.superclass.constructor.call(this, config);
        this.modelo = new LOG.lb.task.Model({
            idioma: config.idioma
        });
        this.autoExpandColumn = 'iddenominacion';
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            width: 300,
            default: true
        });
        this.addGridColumn({dataIndex: 'idnomtarea'});
        this.addGridColumn({dataIndex: 'clase'});
        this.addGridColumn({dataIndex: 'json'});
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonAdicionar({
            tooltip: this.idioma.ttBtnAdicionar,
            idItem: 'btnAddTask',
            scope: _this,
            handler: function () {
                _this.winAddTask = new LOG.lb.task.VentanaAddTask({
                    idioma: this.idioma,
                    width: 650,
                    height: 175,
                    title: _this.idioma.tlAddTask,
                    modelo: _this.modelo
                });
                _this.winAddTask.show();
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonModificar({
            tooltip: this.idioma.ttBtnModificar,
            idItem: 'btnModTask',
            scope: _this,
            handler: function () {
                _this.winAddTask = new LOG.lb.task.VentanaAddTask({
                    idioma: this.idioma,
                    width: 650,
                    height: 175,
                    title: _this.idioma.tlModTask,
                    modelo: _this.modelo
                });
                _this.winAddTask.prepareForm(_this.getSmPrincipal().getSelected());
                _this.winAddTask.show();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RModificar')) {
                    b.setVisible(true);
                } else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonEliminar({
            tooltip: this.idioma.ttBtnEliminar,
            idItem: 'btnDelTask',
            scope: _this,
            handler: function () {
                _this.modelo.eliminar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                    b.setVisible(true);
                } else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() >= 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
    },

    postGuardar: function (tablameta) {
        Ext.Ajax.request({
            url: '/logistica/utiles/taskprogramer/index.php/task/savePropiedades',
            params: {
                esquema: tablameta.esquema,
                tabla: tablameta.tabla,
                columnaref: tablameta.columnaref,
                datoref: tablameta.datoref
            }
        });
    },

    init: function () {
        var _this = this;
        var vista = LOG.lb.task.View.superclass.init.call(this);
        // ******** plugin ***************
        this.treeAgrupacion = new LOG.lb.plugin.TreeAgrupaciones({
            idioma: this.idioma,
            scope: _this
        });
        this.getPanelPrincipal().add(_this.treeAgrupacion);
        //****************************************
    },

    render: function () {
        var _this = this;
        var vista = LOG.lb.task.View.superclass.render.call(this);
        //********************** plugin ******************
        _this.tablameta.esquema = 'mod_lognotificacion';
        _this.tablameta.tabla = 'nom_tarea';
        _this.tablameta.columnaref = 'idnomtarea';
        this.getSmPrincipal().on({
            selectionchange: function (sm) {
                if (this.getCount() > 0) {
                    _this.tablameta.datoref = sm.selections.items[0].data.idnomtarea;
                    _this.treeAgrupacion.recargarTree(_this.tablameta);
                    _this.treeAgrupacion.setValores(_this.postGuardar, _this.getStorePrincipal());
                }
            }
        });
        //******************* plugin **************************
        return vista;
    }

});








