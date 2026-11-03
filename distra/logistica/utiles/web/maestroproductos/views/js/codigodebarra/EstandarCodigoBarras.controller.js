Ext.namespace('Ext.EstandarCodigoBarras');
Ext.EstandarCodigoBarras.controller = Ext.extend(Ext.util.Observable, {
    constructor: function (model, view) {
        Ext.EstandarCodigoBarras.controller.superclass.constructor.call(this);
        this.crearEventos(model, view);
        this.model = model;
        this.view = view;
    },
    loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
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
    },
    hideMessageBox: function () {
        Ext.MessageBox.hide();
    },
    crearEventos: function (model, view) {
        view.getBtnAdicionar().setHandler(this.onClickAdicionar, this);
        view.getBtnModificar().setHandler(this.onClickModificar, this);
        view.getBtnEliminar().setHandler(this.onClickEliminar, this);
        view.getBtnModSequencia().setHandler(this.onClickModSequencia, this);
        view.btnProbar.setHandler(this.onClickProbar, this);

        view.getGridPrincipal().getSelectionModel().on({
            selectionchange: function (sm) {
                if (sm.getCount() === 1) {
                    view.getBtnModificar().enable();
                    view.getBtnEliminar().enable();
                    view.getBtnModSequencia().enable();
                } else {
                    view.getBtnModificar().disable();
                    view.getBtnEliminar().disable();
                    view.getBtnModSequencia().disable();
                }
            }
        });
    },
    onClickAdicionar: function (btn) {
        console.log('Click add');
        let win = new Ext.AddModEstandarCodigoBarras.window();
        let me = this;
        win.on({
            scope: this,
            aceptar: function (datos) {
                this.loadMessageBox();
                this.model.addModEstandarCodigoBarras(datos, function () {
                    me.hideMessageBox();
                    this.getStoreGridPrincipal().load();
                });
            }
        });
        win.show();
    },
    onClickModificar: function (btn) {
        console.log('Click mod');
        let win = new Ext.AddModEstandarCodigoBarras.window();
        let me = this;
        win.on({
            scope: this,
            aceptar: function (datos) {
                this.loadMessageBox();
                this.model.addModEstandarCodigoBarras(datos, function () {
                    me.hideMessageBox();
                    this.getStoreGridPrincipal().load();
                });
            }
        });
        let datos = this.view.getGridPrincipal().getSelectionModel().getSelected().data;
        win.show();
        win.loadDatosAModificar(datos);
    },
    onClickEliminar: function (btn) {
        console.log('Click eliminar');
        let me = this;
        let data = this.view.getGridPrincipal().getSelectionModel().getSelected().data;
        this.loadMessageBox();
        this.model.eliminarEstandarCodigoBarras(data, function () {
            me.hideMessageBox();
            this.getStoreGridPrincipal().load();
        });
    },
    onClickProbar: function (btn) {
        let data = this.view.getGridPrincipal().getSelectionModel().getSelected().data;
        this.model.probarEstandarCodigoBarras(data, function (res) {
            if (res.codigoMsg == -1) {
                mostrarMensaje(1, res.msg, function () {
                    
                });
            } else if (res.codigoMsg == 1) {
                this.getStoreGridPrincipal().load();
                mostrarMensaje(1, res.codigoBarras, function () {
                    
                });
            }
        });
    },
    onClickModSequencia: function (btn) {
        let data = this.view.getGridPrincipal().getSelectionModel().getSelected().data;
        let idestandarcodigobarra = data.idestandarcodigobarra;
        let me = this;

        let btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            selectOnFocus: true,
            text: 'Cancelar',
            handler: function () {
                win.close();
            }
        });

        let btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            scope: this,
            handler: function () {
                this.loadMessageBox();
                let datos = form.getForm().getValues();
                datos.idestandarcodigobarra = idestandarcodigobarra;
                this.model.setearSequenciaEstandarCodigoBarras(datos, function (res) {
                    me.hideMessageBox();
                    win.close();
                    this.getStoreGridPrincipal().load();
                });
            }
        });

        let nfNumeroSecuencia = new Ext.form.NumberField({
            fieldLabel: 'Numero secuencia',
            name: 'numero',
            allowBlank: true,
            allowDecimals: false,
            anchor: '100%',
            minValue: 1,
            value: 1
        });

        let form = new Ext.FormPanel({
            // labelWidth: 50,
            // labelAlign: 'top',
            //region: 'center',
            autoHeight: true,
            frame: true,
            border: false,
            buttonAlign: 'right',
            layout: 'form',
            items: [
                {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            style: 'margin: 0 0 0 5',
                            items: [nfNumeroSecuencia]
                        }
                    ]
                }
            ]
        });

        let win = new Ext.Window({
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.30,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            layout: 'fit',
            buttons: [btnCancelar, btnAceptar],
            items: [form]
        });

        win.show();
    }
});