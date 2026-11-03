Ext.ns('LOG.lb.plugin');

LOG.lb.plugin.EstadoEjecucion = function() {
    function initWindowEstadoEjecucion(v, scope) {
        scope.EstadoEjecucion = Ext.extend(LOG.util.Window, {
            usarAplicar: false,
            usarAceptar: false,
            cerrarAceptar: true,
            listacolumnascodigo: undefined,
            constructor: function(config) {
                config.idioma = LOG.util.UIManager.apply(config.Idioma, LOG.lb.estadoejecucion.Idioma);
                scope.EstadoEjecucion.superclass.constructor.call(this, config);
            },
            initComponent: function() {
                var _this = this;

                Ext.apply(this.listaBotones.getItem(0), {
                    text: this.idioma.BtnCerrar,
                    key: {
                        key: 'X',
                        ctrl: true,
                        alt: true
                    }
                });
                this.gridEstadoEjecucion = new LOG.util.UITemplate({
                    busquedaBasica: true,
                    autoSelect: false,
                    autoLoad: false,
                    modoSeleccion: 1,
                    dirController: '/logistica/utiles/plugin/index.php/pluginestadoejecucion',
                    urlBusquedaGridPrincipal: 'cargarDocumentosGenerados',
                    idGridPrincipal: 'iddocumento',
                    formaVisualizacion: 'panel'
                });
                this.gridEstadoEjecucion.addGridColumn({
                    header: this.idioma.cgEntregarA,
                    dataIndex: 'cliente',
                    autoExpand: true,
                    agrupador: true
                });
                this.gridEstadoEjecucion.addGridColumn({
                    header: this.idioma.cgTipoDocumento,
                    width: 180,
                    dataIndex: 'tipodocumento'
                });
                this.gridEstadoEjecucion.addGridColumn({
                    header: this.idioma.cgNumeroDocumento,
                    width: 100,
                    dataIndex: 'nrodoc'
                });
                this.gridEstadoEjecucion.addGridColumn({
                    header: this.idioma.cgNroRef,
                    width: 100,
                    dataIndex: 'numeroref'
                });
                this.gridEstadoEjecucion.addGridColumn({
                    header: this.idioma.cgEstado,
                    width: 100,
                    dataIndex: 'estado',
                    renderer: function(v) {
                        return LOG.lb.documento.Estado[v];
                    }
                });
                this.gridEstadoEjecucion.addGridColumn({
                    header: this.idioma.cgFechaEmision,
                    width: 100,
                    dataIndex: 'fechacontable'
                });
                this.gridEstadoEjecucion.addGridColumn({
                    dataIndex: 'idcliente'
                });
                this.gridEstadoEjecucion.addGridColumn({
                    dataIndex: 'iddocumentocliente'
                });
                this.gridEstadoEjecucion.addGridColumn({
                    dataIndex: 'iddocumento'
                });
                this.gridEstadoEjecucion.addGridColumn({
                    dataIndex: 'iddoc'
                });
                this.gridEstadoEjecucion.init();
                this.items = [this.gridEstadoEjecucion.view()];
                //this.setTitle(this.idioma.tlVentanaEstadoEjecucion+scope.view.getSmPrincipal().getSelected().data.denominacion);
                this.setTitle(String.format(this.idioma.tlVentanaEstadoEjecucion, scope.view.getSmPrincipal().getSelected().data.nrodoc, scope.view.getSmPrincipal().getSelected().data.fechacontable, LOG.lb.documento.Estado[scope.view.getSmPrincipal().getSelected().data.estado]));
                var _this = this;
                this.gridEstadoEjecucion.getSmPrincipal().on({
                    'rowselect': function(sm, pos, rec) {

                    },
                    'rowdeselect': function(sm, pos, rec) {

                    }
                });

                this.gridEstadoEjecucion.getStorePrincipal().on({
                    'beforeload': function(st) {
                        st.initBaseParams.iddocumento = (scope.view.getSmPrincipal().getSelected()) ? scope.view.getSmPrincipal().getSelected().data.iddocumento : -1;
                        st.baseParams.iddocumento = (scope.view.getSmPrincipal().getSelected()) ? scope.view.getSmPrincipal().getSelected().data.iddocumento : -1;
                    }
                });

                scope.EstadoEjecucion.superclass.initComponent.call(this, arguments);
            },
            aceptarFn: function() {

            }
        });
    }
    return {
        init: function (v) {
            v.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'estado',
                text: LOG.lb.estadoejecucion.Idioma.lbBtnEstadoEjecucion,
                tooltip: LOG.lb.estadoejecucion.Idioma.ttBtnEstadoEjecucion,
                isContextual: true,
                view: v,
                handler: function (v) {
                    initWindowEstadoEjecucion(v, this);
                    this.winEstadoEjecucion = new this.EstadoEjecucion({
                        idioma: LOG.lb.estadoejecucion.Idioma
                    });
                    this.winEstadoEjecucion.show();
                    this.winEstadoEjecucion.maximize();
                    this.winEstadoEjecucion.gridEstadoEjecucion.getStorePrincipal().load();
                    this.winEstadoEjecucion.doLayout();
                },
                controlFn: function (btn, vista) {
                    /*if (vista.grantedAction('RGESTI') || vista.grantedAction('RASOCIAR')) {
                        btn.setVisible(true);
                    } else {
                        btn.setVisible(false);
                    }*/
                    btn.disable();

                    vista.getSmPrincipal().fireEvent = v.getSmPrincipal().fireEvent.createSequence(function (e, args) {
                        if (e == 'rowselect' ) {
                            btn.enable();
                        }
                        if (e == 'rowdeselect') {
                            btn.disable();
                        }
                    });
                }
            }), v.listaBotones.count() - 3);
        }
    }
};
