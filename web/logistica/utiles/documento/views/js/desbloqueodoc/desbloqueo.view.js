Ext.ns('log.lb.desbloqueo');

LOG.lb.desbloqueo.View = Ext.extend(LOG.util.UITemplate, {
    usuarios: undefined,
    documentos: undefined,
    constructor: function(config) {
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma.init());
        this.modelo = new Log.lb.desbloqueo.Model({
            idioma: config.idioma
        });
        LOG.lb.desbloqueo.View.superclass.constructor.call(this, config);

        this.dirController = (config.dirController) ? config.dirController : '/logistica/utiles/documento/index.php/desbloqueo';
        this.urlBusquedaGridPrincipal = 'cargarDocumentoBloqueados';
        this.modoSeleccion = 3;
        this.autoShow = true;
        this.panelBotonesVisible = true;
        this.baseParams = {
            administrador : this.grantedAction('R_ADMIN')
        };

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgNro,
            width: 120,
            dataIndex: 'nrodoc',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgTdoc,
            width: 270,
            dataIndex: 'iddoc',
            default: true,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                _this.documentos = store.reader.jsonData.documentos;
                return _this.getTipoDocById(value);
            }
        });

        this.addGridColumn({
            header: this.idioma.cgUser,
            width: 100,
            dataIndex: 'idusuario',
            default: true,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                _this.usuarios = store.reader.jsonData.usuarios;
                return _this.getUsuarioById(value);
            }
        });

        this.addGridColumn({
            header: this.idioma.cgfecha,
            width: 190,
            dataIndex: 'fechacontable',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idbloqueo'
        });

        this.addGridColumn({
            dataIndex: 'iddocumento'
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'desbloqueardocumento',
            text: this.idioma.tBotonDesbloquear,
            tooltip: this.idioma.tBotonEliminar,
            handler: function() {
                _this.modelo.eliminar();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('btnDesbloquear')) {
                    b.setVisible(true);
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });

                } else {
                    b.setVisible(false);
                }

            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'traza',
            text: this.idioma.tBotonTrazas,
            isContextual: true,
            handler: function() {
                var recors = _this.getGridPrincipal().getSelectionModel().getSelections();

                var ids = new Array();
                for (var i = 0; i < recors.length; i++) {
                    ids[i] = recors[i].data.iddocumento;
                }
                var win = new LOG.lb.trazas.View({
                    iddocumento: ids
                });
                win.init();
                win.view();

            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('btnTraza')) {
                    b.setVisible(true);
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });

                } else {
                    b.setVisible(false);
                }

            }

        }));

        this.addToolbarButton("->");
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            text: '',
            tooltip: this.idioma.tBotonAyuda,
        }));


    },
    getUsuarioById: function(id) {
        var _this = this;
        for (var i = 0; i < _this.usuarios.length; i++) {
            if (_this.usuarios[i].idusuario == id) {
                return _this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },
    getTipoDocById: function(id) {
        var _this = this;
        for (var i = 0; i < _this.documentos.length; i++) {
            if (_this.documentos[i].iddoc == id) {
                return _this.documentos[i].denominacion;
            }
        }
        return '-';
    }
});
