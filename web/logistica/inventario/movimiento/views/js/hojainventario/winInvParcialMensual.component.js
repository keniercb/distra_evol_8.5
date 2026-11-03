Ext.ns('LOG.inv.hojainventario');
LOG.inv.hojainventario.winInvParcialMensual = Ext.extend(LOG.util.Window, {
    listaBotones: undefined,
    proceso: false,
    cancelado: true,
    constructor: function(config) {
        LOG.util.UIManager.apply(this, config);
        config.width = 400;
        config.height = 130;
        config.resizable = false;
        this.usarAplicar = false;
        this.modelo = new LOG.util.Model({idioma: this.idioma});
        LOG.inv.hojainventario.winInvParcialMensual.superclass.constructor.call(this, config);
        this.setTitle(this.idioma.tlInvParcialMensual);
        this.panelDatos();
    },
    initComponent: function() {
        var _this = this;
        Ext.apply(this.listaBotones.getItem(0), {
            handler: function() {
                _this.cmbTipoInventario.setValue(null);
                _this.model.porciento = null;
                _this.model.idperiodo = null;
                _this.close();
            }
        });
        Ext.apply(this.listaBotones.getItem(2), LOG.util.Prototipos.botonGuardar({
            disabled: true,
            handler: function() {
                _this.cancelado = false;
                _this.obtenerPorCiento();
                _this.close();
            }
        }));
        LOG.inv.hojainventario.winInvParcialMensual.superclass.initComponent.call(this);
    },
    panelDatos: function() {
        var _this = this;
        this.cmbAnnosPlanes = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cmbEjercicio,
            url: 'cargarAnnosInventariar',
            hiddenName: 'idannoinv',
            valueField: 'idannoinv',
            displayField: 'anno',
            disabled: true,
            editable: false,
            allowBlank: false
        });
        this.cmbMeses = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cmbPeriodo,
            url: 'cargarMesesInventariar',
            autoLoad: false,
            hiddenName: 'mes',
            valueField: 'mes',
            displayField: 'dmes',
            editable: false,
            allowBlank: false
        });

        this.fpPanelSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.fpPanelSuperior.addComponent(this.cmbAnnosPlanes);

        this.fpPanelSuperior.addComponent(this.cmbMeses);

        this.fpDatos = LOG.util.UIManager.initForm({
            items: [this.fpPanelSuperior]
        });

        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'center',
            layout: 'fit',
            height: 60,
            frame: true,
            items: [this.fpDatos]
        });

        this.modelo.bindForm(this.fpDatos);
        this.modelo.addActionButton(this.listaBotones.getItem(2));

        this.add(this.panelSuperior);

        this.cmbMeses.getStore().on({
            'beforeload': function(st, objeto) {
                st.baseParams.idestructuracomun = _this.iddeposito;
            },
            'load': function(st, objeto) {
                if (st.getCount() == 1) {
                    _this.cmbMeses.setValue(st.getAt(0).data.mes);
                }
                if (st.getCount() == 0) {
                    mostrarMensaje(1, _this.idioma.lbMsgMesesAprobados);
                }
                if (st.getCount() > 0) {
                    st.each(function(item) {
                        item.data.dmes = LOG.lb.meses.Periodos[item.data.mes];
                    });
                }
            }
        });

        this.cmbMeses.getStore().load();
        
        this.cmbAnnosPlanes.getStore().on({
            'load': function(st, objeto) {
                if (st.getCount() == 1) {
                    _this.cmbAnnosPlanes.setValue(st.getAt(0).data.idannoinv);
                }
            }
        });
    },
    obtenerPorCiento: function() {
        var _this = this;
        var items = _this.cmbMeses.getStore().data.items;
        Ext.each(items, function(valor, index, rec) {
            if (_this.cmbMeses.getValue() == valor.json.mes) {
                _this.model.porciento = valor.json.porciento;
                _this.model.idperiodo = valor.json.mes;
            }
        });
    },
    closeFn: function() {
        if (this.cancelado) {
            this.cmbTipoInventario.setValue(null);
            this.model.porciento = null;
            this.model.idperiodo = null;
        }
    }
});
