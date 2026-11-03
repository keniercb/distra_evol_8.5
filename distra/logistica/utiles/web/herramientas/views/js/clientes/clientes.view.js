Ext.ns('LOG.tools.Clientes');

LOG.tools.Clientes.View = Ext.extend(LOG.util.UITemplate, {
    idGridPrincipal : 'id',
    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma.init());
        /*this.modelo = new Log.lb.auditoriadocumento.Model({
            idioma: config.idioma
        });*/
        this.concepto = config.idioma.lbConcepto;
        this.textBusquedaSimple = config.idioma.lbCriterio;
        LOG.tools.Clientes.View.superclass.constructor.call(this, config);
        this.dirController = '/logistica/utiles/herramientas/index.php/clientes';
        this.urlBusquedaGridPrincipal = 'devolverClientes';
        this.modoSeleccion = 3;
        this.autoShow = true;
        this.panelBotonesVisible = true;
    },

    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.lbCmCodigoCliente,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbCmNombCliente,
            width: 120,
            dataIndex: 'nombre',
            default: true,
            autoExpand: true,
        });
        this.addGridColumn({
            header: this.idioma.lbCmAbrCliente,
            width: 100,
            dataIndex: 'abreviatura',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'id',
        });
    },

    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            text: this.idioma.lbUnificar,
            tooltip: this.idioma.lbTtUnificar,
            iconCls: 'adicionar',
            controlFn: function (b, __caller) {
                /* b.hide();
                if (_this.grantedAction('UNIF')) {
                    b.show();
                } */
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
                var modelo = new LOG.tools.Clientes.Model({
                    urlController: _this.dirController + '/',
                    idioma: _this.idioma
                });
                var cbClientes = new LOG.util.ComboBox({
                    fieldLabel: _this.idioma.lbCliente,
                    hiddenName: 'idcliente',
                    url: 'devolverClientes',
                    valueField: 'id',
                    allowBlank: false,
                    mode: 'local',
                    anchor: '98%',
                    displayField: 'text'
                });
                var formUnificar = LOG.util.UIManager.initForm({
                    region: 'center',
                    frame: true,
                    labelAlign: 'top',
                    items: [cbClientes]
                });
                modelo.bindForm(formUnificar);
                modelo.bindGridPanel(_this.getGridPrincipal());
                cbClientes.getStore().fireEvent = cbClientes.getStore().fireEvent.createSequence(function (e) {
                    if (e == 'beforeload') {
                        this.baseParams.criterio = _this.gridFilter.tfBusqueda.getValue();
                    }
                });
                var winUnificar = LOG.util.UIManager.initWindow({
                    title: _this.idioma.lbClienteDestino,
                    height: 160,
                    width: 400,
                    resizable: false,
                    usarAplicar: false,
                    aceptarFn: function () {
                        modelo.salvar({
                            data: {
                                idunificar: modelo.getSelectedId(),
                                iddestino: modelo.idcliente
                            }
                        });
                        return true;
                    },
                    items: [formUnificar]
                });
                modelo.addActionButton(winUnificar.getButton(2));
                winUnificar.show();
            }
        }));
    }
});