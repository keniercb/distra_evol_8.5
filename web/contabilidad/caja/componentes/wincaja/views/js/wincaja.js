//--Componete Window Caja-Fondo
Ext.ns('Caja.Componentes');
Caja.Componentes.WindowCaja = Ext.extend(Ext.Window, {
    ifuncionalidad: window.parent.idFuncionalidad,
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            width: 300,
            modal: true,
            autoValidate: true,
            constrain: true,
            closable: false,
            layout: 'fit',
            closeAction: 'close',
            frame: true,
            resizable: false,
            title: 'Definir caja',
            // idioma: params.idioma,
            // perfil: params.perfil,
            listeners: {
                scope: this,
                show: function (){
                    this.cbCaja.focus(true, true);
                }
            }
        });
        this.addEvents('loadData');
        this.createButtons();
        this.createForm();
        this.initEventos();

        Caja.Componentes.WindowCaja.superclass.constructor.call(this);
    },
    initEventos: function () {

        this.btnCancelar.on({
            scope: this,
            click: function () {
                if (Ext.isEmpty(this.idCajaOld))
                    window.parent.Ext.getCmp('win' + this.ifuncionalidad).close();
                else {
                    this.close();
                }
            }
        });

        this.on({
            scope: this,
            loadData: function (data) {
                this.idCaja = this.cbCaja.getValue();
                this.nomCaja = this.cbCaja.getRawValue();
            }
        });

        this.stCaja.on({
            scope: this,
            load: function (store, records, options) {
                if (records.length == 0)
                    mostrarMensaje(1, 'No existen cajas configuradas para su usuario.');
                if (records.length == 1) {
                    this.cbCaja.setValue(records[0].data.idcaja);
                    if (Ext.isEmpty(this.idCajaOld)) {
                        this.fireEvent('loadData');
                        this.close();
                    }
                }
                this.lMask.hide();
            },
            beforeload: function () {
                this.lMask = new Ext.LoadMask(this.body, {
                    msg: 'Cargando...'
                });
                this.lMask.show();
            }
        });

        this.btnAceptar.on({
            scope: this,
            click: function () {
                if (this.formCaja.getForm().isValid()) {
                    this.fireEvent('loadData');
                    this.close();
                }
            }
        });

    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            selectOnFocus: true,
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin cargar las cajas',
            scope: this,
            handler: function () {
                this.close();
            }
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Cargar las cajas y cerrar ventana',
        });
        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    createForm: function () {

        this.stCaja = new Ext.data.Store({
            url: '/contabilidad/caja/componentes/cajafondo/index.php/cajafondo/cargarCaja',
            method: 'POST',
            reader: new Ext.data.JsonReader({
                root: 'data',
            }, [{
                name: 'denominacion'
            }, {
                name: 'idcaja'
            }]),
            autoLoad: true
        });

        this.firstElement = this.cbCaja = new Ext.form.ComboBox({
            id: 'cbCaja',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            forceSelection: true,
            emptyText: 'Seleccione...',
            fieldLabel: 'Caja',
            store: this.stCaja,
            valueField: 'idcaja',
            displayField: 'denominacion',
            hiddenName: 'idcaja',
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            enableKeyEvents: true,
            anchor: '100%'
        });

        this.formCaja = new Ext.FormPanel({
            frame: true,
            labelAlign: 'top',
            width: 285,
            autoHeight: true,
            trackResetOnLoad: true,
            items: [{
                layout: 'column',
                autoHeight: true,
                anchor: '100%',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.cbCaja]
                }]
            }]
        });

        this.items = this.formCaja;
    }
});