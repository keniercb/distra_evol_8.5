Ext.namespace('Ext.ExpDuo');
Ext.ExpDuo.Controller = Ext.extend(Ext.Component, {
    fechaInicioPeriodo: undefined,
    fechaContablePeriodo: undefined,
    fechaFinPeriodo: undefined,
    view: undefined,
    constructor: function(params)
    {
        this.crearSetsAndGets();

        this.setView(params.view);
        this.setIdDuo(params.idderechouobligacion);
        this.setEstadoDuo(params.idestadoduo);
        this.setFechasPeriodoContable(
            params.fechaInicial,
            params.fechaActual,
            params.fechaFin,
        );

        this.loadDataComponent();

        Ext.ExpDuo.Controller.superclass.constructor.call(this);
    },
    loadDataComponent: function()
    {
        this.initializeClass();
    },
    initializeClass: function () {
        var view = this.getView();
        var model = view.getModel();
        this.initializeFunctions(view, model);
        this.initializeEvents(view, model);
        if (this.getEstadoDuo() === 1) {
            view.getBtnAdd().enable();
        } else {
            view.getBtnAdd().disable();
        }
    },
    initializeEvents: function(view, model) {
        var me = this;

        view.getGridExp().getSelectionModel().on({
            selectionchange: this.gridSelectionChange
        });

        view.getBtnAdd().on({
            scope: this,
            click: function () {
                var winadd = new Ext.AddExpDuo.Gest({
                    idderechouobligacion: me.getIdDuo(),
                    idestadoduo: me.getEstadoDuo(),
                    fechaInicial: me.getPeriodoConFechaInicial(),
                    fechaActual: me.getPeriodoConFechaActual(),
                    fechaFin: me.getPeriodoConFechaFin(),
                });

                winadd.on({
                    addExpDuo: function () {
                        mostrarMensaje(1, 'Se ha adicionado correctamente.');
                        winadd.close();
                        view.getGridExp().getStore().reload();
                    }
                });

                winadd.show();
            }
        });

        view.getBtnMod().on({
            scope: this,
            click: function () {
                var record = view.getGridExp().getSelectionModel().getSelected();
                var winadd = new Ext.AddExpDuo.Gest({
                    idderechouobligacion: me.getIdDuo(),
                    idexp: record.get('id'),
                    idestadoduo: me.getEstadoDuo(),
                    fechaInicial: me.getPeriodoConFechaInicial(),
                    fechaActual: me.getPeriodoConFechaActual(),
                    fechaFin: me.getPeriodoConFechaFin(),
                    datos: {
                        tipoDoc: record.get('idtipodoc'),
                        fecha: record.get('fecha'),
                        fechavencimiento: record.get('fechavencimiento'),
                        descripcion: record.get('descripcion'),
                    }
                });

                winadd.on({
                    addExpDuo: function () {
                        mostrarMensaje(1, 'Se ha adicionado correctamente.');
                        winadd.close();
                        view.getGridExp().getStore().reload();
                    }
                });

                winadd.show();
            }
        });

        view.getBtnDel().on({
            scope: this,
            click: function () {
                var record = view.getGridExp().getSelectionModel().getSelected();
                me.eliminarExpediente(record.get('id'));
            }
        });

        view.actVerExp.on({
            scope: this,
            action: function (grid, recordarray, icon, rowindex, colindex) {
                this.fShowDocumento(recordarray.get('refdoc'));
            },
            beforeaction: function (grid, rowIndex) {
            }
        });

    },
    initializeFunctions: function(view, model) {
        var me = this;

        this.funcionesGenerales = function () {
            this.loadMessageBox = function (msg = 'Cargando...', title = 'Por favor espere...') {
                Ext.MessageBox.show({
                    title: title,
                    msg: msg,
                    width: 300,
                    progress: true,
                    closable: false
                });
                var f = function (v) {
                    return function () {
                        var i = v / 11;
                        Ext.MessageBox.updateProgress(i);
                    };
                };
                for (var i = 1; i < 12; i++)
                    setTimeout(f(i), i * 500);
            };

            this.hideMessageBox = function () {
                Ext.MessageBox.hide();
            };

        };

        this.funcionesGrid = function () {

            this.gridSelectionChange = function (sm) {
                var records = sm.getSelections();
                if (records.length == 1 && me.getEstadoDuo() === 1) {
                    me.habilitarModificacion();
                } else {
                    me.desHabilitarModificacion();
                }
            };

            this.habilitarModificacion = function () {
                view.getBtnMod().enable();
                view.getBtnDel().enable();
            };

            this.desHabilitarModificacion = function () {
                view.getBtnMod().disable();
                view.getBtnDel().disable();
            };

        };

        this.fShowDocumento = function (refdoc) {
            // this.loadMessageBox();

            window.open('/contabilidad/cobros_pagos/derechouobligacion/index.php/expduo/showDocumento?idalfresco='+refdoc);
        };

        this.eliminarExpediente = function (idexpediente) {
            this.loadMessageBox();

            model.eliminarExp({
                params: {idexpediente: idexpediente}
            }, function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                me.hideMessageBox();
                if (responseData.codMsg === 1) {
                    mostrarMensaje(1, 'Se ha eliminado correctamente.');
                    view.getGridExp().getStore().reload();
                }
            });
        };

        this.funcionesGenerales.call(this);
        this.funcionesGrid.call(this);
    },
    crearSetsAndGets: function () {

        this.setFechasPeriodoContable = function (fechaInicial, fechaActual, fechaFin) {
            this.fechaInicioPeriodo = fechaInicial;
            this.fechaContablePeriodo = fechaActual;
            this.fechaFinPeriodo = fechaFin;
        };

        this.getPeriodoConFechaInicial = function () {
            return this.fechaInicioPeriodo;
        };

        this.getPeriodoConFechaActual = function () {
            return this.fechaContablePeriodo;
        };

        this.getPeriodoConFechaFin = function () {
            return this.fechaFinPeriodo;
        };

        this.setView = function (view) {
            this.view = view;
        };

        this.getView = function () {
            return this.view;
        };

        this.setIdDuo = function (id) {
            this.idderechouobligacion = id;
        };

        this.getIdDuo = function () {
            return this.idderechouobligacion;
        };

        this.setEstadoDuo = function (id) {
            this.idestadoduo = id;
        };

        this.getEstadoDuo = function () {
            return this.idestadoduo;
        };

    }
});