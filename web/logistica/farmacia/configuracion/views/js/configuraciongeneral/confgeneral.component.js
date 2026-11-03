Ext.ns('Ext.erp.configuraciongeneral');

Ext.erp.configuraciongeneral = Ext.extend(LOG.util.Panel, {
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.doFocus = true;
        this.layout = 'border';
        this.idioma = LOG.farm.confgeneral.Idioma;
        this.camposfield = this.getDatosFielSetIdq();
        this.camposfieldder = this.getDatosFielSetDer();
        this.camposfieldinferior = this.getdatosFieldSetInf();
        var clsGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 2,
            autoHeight: true
        });

        var clsContenedor = LOG.util.UIManager.initColumnForm({
            columnas: 1

        });

        var clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.filsetIzq = new Ext.form.FieldSet({
            title: this.idioma.filsetIzq,
            anchor: '90%',
            items: [
                this.camposfield[0],
                this.camposfield[1],
                this.camposfield[2],
                this.camposfield[3],
                this.camposfield[4],
                this.camposfield[5],
            ]
        });

        this.filsetDer = new Ext.form.FieldSet({
            title: this.idioma.filsetDer,
            anchor: '90%',

            items: [
                this.camposfieldder[0],
                this.camposfieldder[1],
                this.camposfieldder[2],
                this.camposfieldder[3],
                this.camposfieldder[4],
            ]
        });

        var clsContenedorInferior = LOG.util.UIManager.initColumnForm({
            columnas: 2

        });

        clsContenedorInferior.addComponent(this.camposfieldinferior[0]);
        clsContenedorInferior.addComponent(this.camposfieldinferior[4]);
        clsContenedorInferior.addComponent(this.camposfieldinferior[1]);
        clsContenedorInferior.addComponent(this.camposfieldinferior[5]);
        clsContenedorInferior.addComponent(this.camposfieldinferior[2]);
        clsContenedorInferior.addComponent(this.camposfieldinferior[6]);
        clsContenedorInferior.addComponent(this.camposfieldinferior[3]);


        this.filsetInferior = new Ext.form.FieldSet({
            title: this.idioma.filsetAreasOpert,
            style: '-moz-border-radius:10px',
            anchor: '90%',
            autoHeight: true,
            autoWidth: true,
            items: [clsContenedorInferior]
        });

        var filsetInferiorInert = new Ext.form.FieldSet({
            anchor: '90%',
            border: false,
            items: [this.filsetInferior]
        });

        clsSuperior.addComponent(this.filsetIzq);
        clsSuperior.addComponent(this.filsetDer);
        clsContenedor.addComponent(filsetInferiorInert);
        clsGeneral.addComponent(clsContenedor);

        this.formPanelPrincipal = LOG.util.UIManager.initForm({
            autoScroll: true,
            frame: false,
            region: 'center',
            border: false,
            items: [clsGeneral]
        });

        this.btnGuardar = new Ext.Button({
            iconCls: 'guardar',
            disabled: true,
            text: this.idioma.lbbtnGuardar,
            tooltip: this.idioma.lbbtnGuardarConf,
            handler: function () {
                var params = {};
                Ext.each(_this.formPanelPrincipal.getForm().items.items, function (e) {
                    if (e.isDirty()) {
                        if (e.getValue() == "") {
                            params[e.getName()] = null;
                        } else
                            params[e.getName()] = e.getValue();
                    }
                });

                var lotevencido = _this.formPanelPrincipal.getForm().items.items[10].getValue();
                params['lotevencido'] = (lotevencido) ? 1 : 0;

                var ptoreposicion = _this.formPanelPrincipal.getForm().items.items[5].getValue();
                params['ptoreposicion'] = (ptoreposicion) ? 1 : 0;


                _this.getGuardarDatos(params);

            }
        });

        this.btnlimpiar = new Ext.Button({
            iconCls: 'limpiar',
            disabled: false,
            text: this.idioma.lbbtnLipiar,
            tooltip: this.idioma.ttLimpiar,
            handler: function () {

                Ext.each(_this.formPanelPrincipal.getForm().items.items, function (e) {
                    e.setValue(null);
                    e.setRawValue(null);
                    e.originalValue = null;
                });
            }
        });


        Ext.apply(this, {
            bbar: ['->', this.btnlimpiar, this.btnGuardar],
            layout: 'border',
            autoScroll: true,
            items: [this.formPanelPrincipal]
        });
        Ext.erp.configuraciongeneral.superclass.constructor.call(this, config);
        _this.cargaInicial();
        LOG.util.UIManager.encadenaFn(_this.formPanelPrincipal, 'fireEvent', function (e) {
            if (e == "clientvalidation") {

                if (_this.formPanelPrincipal.getForm().isDirty() && _this.formPanelPrincipal.getForm().isValid()) {
                    _this.btnGuardar.enable();
                } else
                    _this.btnGuardar.disable();
            }
        });

    },

    getDatosFielSetIdq: function () {

        this.minimomaximo = new LOG.util.Prototipos.inputDecimal({
            anchor: '95%',
            name: 'minimo',
            maxValue: 100,
            decimalPrecision: 2,
            disabled: false,
            fieldLabel: this.idioma.lbMinimo,
            allowBlank: false,
            maxLength: 100,
            maxLengthText: 'El valor m&aacute;ximo para este campo es de 100.',
            regexText: 'El valor m&aacute;ximo para este campo es de 100.',
            listeners: {
                'change': function (field, newValue, oldValue) {
                }
            }
        });


        this.fondofijo = new LOG.util.Prototipos.inputDecimal({
            anchor: '95%',
            name: 'fondofijo',
            maxValue: 100,
            decimalPrecision: 2,
            disabled: false,
            fieldLabel: this.idioma.lbFondoFijo,
            autoCreate: true,
            allowBlank: false,
            maxLength: 100,
            maxLengthText: 'El valor m&aacute;ximo para este campo es de 100.',
            regexText: 'El valor m&aacute;ximo para este campo es de 100.',
            enableKeyEvents: true,
            listeners: {
                'change': function (field, newValue, oldValue) {
                }
            }
        });

        this.reserva = new LOG.util.Prototipos.inputDecimal({
            anchor: '95%',
            name: 'reserva',
            maxValue: 100,
            decimalPrecision: 2,
            disabled: false,
            fieldLabel: this.idioma.lbReserva,
            autoCreate: true,
            allowBlank: false,
            maxLengthText: 'El valor m&aacute;ximo para este campo es de 100.',
            regexText: 'El valor m&aacute;ximo para este campo es de 100.',
            enableKeyEvents: true,
            listeners: {
                'change': function (field, newValue, oldValue) {
                }
            }
        });

        this.normaabast = new LOG.util.Prototipos.inputEntero({
            anchor: '95%',
            name: 'normabast',
            maxValue: 365,
            disabled: false,
            fieldLabel: this.idioma.lbNormaAbast,
            autoCreate: true,
            allowBlank: false,
            maxLengthText: 'El valor m&aacute;ximo para este campo es de 365.',
            regexText: 'El valor m&aacute;ximo para este campo es de 365.',
            enableKeyEvents: true,
            listeners: {
                'change': function (field, newValue, oldValue) {
                }
            }
        });

        this.minimaarea = new LOG.util.Prototipos.inputDecimal({
            anchor: '95%',
            name: 'minarea',
            maxValue: 100,
            decimalPrecision: 2,
            disabled: false,
            fieldLabel: this.idioma.lbMinimoArea,
            autoCreate: true,
            allowBlank: true,
            maxLengthText: 'El valor m&aacute;ximo para este campo es de 100.',
            regexText: 'El valor m&aacute;ximo para este campo es de 100.',
            enableKeyEvents: true,
            listeners: {
                'change': function (field, newValue, oldValue) {

                }
            }
        });

        this.checkPuntoRepo = new Ext.form.Checkbox({
            fieldLabel: '',
            boxLabel: this.idioma.checkPuntoRepo,
            name: 'ptoreposicion'
        });

        return [
            this.minimomaximo,
            this.fondofijo,
            this.reserva,
            this.normaabast,
            this.minimaarea,
            this.checkPuntoRepo,

        ]
    },
    getDatosFielSetDer: function () {

        this.diasconsig = new LOG.util.Prototipos.inputEntero({
            anchor: '95%',
            name: 'diaconsignado',
            maxValue: 365,
            disabled: false,
            fieldLabel: this.idioma.lbdiasconsig,
            autoCreate: true,
            allowBlank: true,
            maxLengthText: 'El valor m&aacute;ximo para este campo es de 365.',
            regexText: 'El valor m&aacute;ximo para este campo es de 365.',
            enableKeyEvents: true,
            listeners: {
                'change': function (field, newValue, oldValue) {

                }
            }
        });

        this.diasminven = new LOG.util.Prototipos.inputEntero({
            anchor: '95%',
            name: 'diaminvencido',
            maxValue: 365,
            disabled: false,
            fieldLabel: this.idioma.lbDiasMinVen,
            autoCreate: true,
            allowBlank: true,
            maxLengthText: 'El valor m&aacute;ximo para este campo es de 365.',
            regexText: 'El valor m&aacute;ximo para este campo es de 365.',
            enableKeyEvents: true,
            listeners: {
                'change': function (field, newValue, oldValue) {

                }
            }
        });

        this.diasminventarje = new LOG.util.Prototipos.inputEntero({
            anchor: '95%',
            name: 'diamintarjeta',
            maxValue: 365,
            disabled: false,
            fieldLabel: this.idioma.lbDiasMinVenTarge,
            autoCreate: true,
            allowBlank: true,
            maxLengthText: 'El valor m&aacute;ximo para este campo es de 365.',
            regexText: 'El valor m&aacute;ximo para este campo es de 365.',
            enableKeyEvents: true,
            listeners: {
                'change': function (field, newValue, oldValue) {

                }
            }
        });

        this.diasprox = new LOG.util.Prototipos.inputEntero({
            anchor: '95%',
            name: 'diaproxvencer',
            maxValue: 365,
            disabled: false,
            fieldLabel: this.idioma.lbDiasProx,
            autoCreate: true,
            allowBlank: true,
            enableKeyEvents: true,
            maxLengthText: 'El valor m&aacute;ximo para este campo es de 365.',
            regexText: 'El valor m&aacute;ximo para este campo es de 365.',
            listeners: {
                'change': function (field, newValue, oldValue) {
                }
            }
        });

        this.checkLotesVens = new Ext.form.Checkbox({
            fieldLabel: '',
            boxLabel: this.idioma.checkLotesVens,
            name: 'lotevencido'
        });

        return [
            this.diasconsig,
            this.diasminven,
            this.diasminventarje,
            this.diasprox,
            this.checkLotesVens
        ]
    },
    getdatosFieldSetInf: function () {
        var _this = this;

        this.comboAlmacen = new LOG.util.ComboBox({
            url: '/logistica/farmacia/configuracion/index.php/configuraciongeneral/cargarDeposito',
            name: 'idalmacen',
            autoLoad: true,
            combo: true,
            hiddenName: 'idalmacen',
            valueField: 'idfila',
            disabled: false,
            displayField: 'text',
            mode: 'local',
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            anchor: '80%',
            typeAhead: true,
            resizable: true,
            emptyText: this.idioma.lbSeleccione,
            fieldLabel: this.idioma.comboAlmacen,
            listeners: {
                'select': function (cmb, rec) {
                    var esta = _this.getExcluirCombos(cmb.hiddenName, cmb.getValue());
                    if (esta) {
                        mostrarMensaje(3, LOG.farm.confgeneral.Idioma.msgErrorSelecCombo);
                    }

                }
            }
        });

        this.comboAreaVenta = new LOG.util.ComboBox({
            url: '/logistica/farmacia/configuracion/index.php/configuraciongeneral/cargarDeposito',
            name: 'idareaventa',
            autoLoad: true,
            combo: true,
            hiddenName: 'idareaventa',
            valueField: 'idfila',
            disabled: false,
            displayField: 'text',
            mode: 'local',
            autoCreate: true,
            allowBlank: false,
            triggerAction: 'all',
            anchor: '80%',
            typeAhead: true,
            selectOnFocus: true,
            resizable: true,
            emptyText: this.idioma.lbSeleccione,
            fieldLabel: this.idioma.comboAreaVenta,
            listeners: {
                'select': function (cmb, rec) {
                    var esta = _this.getExcluirCombos(cmb.hiddenName, cmb.getValue());
                    if (esta) {
                        mostrarMensaje(3, LOG.farm.confgeneral.Idioma.msgErrorSelecCombo);
                        cmb.reset();
                    }
                }
            }

        });

        this.comboReserva = new LOG.util.ComboBox({
            url: '/logistica/farmacia/configuracion/index.php/configuraciongeneral/cargarDeposito',
            name: 'idreserva',
            autoLoad: true,
            combo: true,
            hiddenName: 'idreserva',
            valueField: 'idfila',
            disabled: false,
            displayField: 'text',
            mode: 'local',
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            anchor: '80%',
            typeAhead: true,
            resizable: true,
            emptyText: this.idioma.lbSeleccione,
            fieldLabel: this.idioma.comboRserva,
            selectOnFocus: true,
            listeners: {
                'select': function (cmb, rec) {
                    var esta = _this.getExcluirCombos(cmb.hiddenName, cmb.getValue());
                    if (esta) {
                        mostrarMensaje(3, LOG.farm.confgeneral.Idioma.msgErrorSelecCombo);
                        cmb.reset();
                    }
                }
            }
        });

        this.comboRetenido = new LOG.util.ComboBox({
            url: '/logistica/farmacia/configuracion/index.php/configuraciongeneral/cargarDeposito',
            name: 'idretenido',
            combo: true,
            autoLoad: true,
            hiddenName: 'idretenido',
            valueField: 'idfila',
            disabled: false,
            displayField: 'text',
            mode: 'local',
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            anchor: '80%',
            typeAhead: true,
            resizable: true,
            emptyText: this.idioma.lbSeleccione,
            fieldLabel: this.idioma.comboRetenido,
            selectOnFocus: true,
            listeners: {
                'select': function (cmb, rec) {
                    var esta = _this.getExcluirCombos(cmb.hiddenName, cmb.getValue());
                    if (esta) {
                        mostrarMensaje(3, LOG.farm.confgeneral.Idioma.msgErrorSelecCombo);
                        cmb.reset();
                    }
                }
            }
        });

        this.comboAlmacenUsufructo = new LOG.util.ComboBox({
            url: '/logistica/farmacia/configuracion/index.php/configuraciongeneral/cargarDeposito',
            name: 'idalmacenusuf',
            autoLoad: true,
            combo: true,
            hiddenName: 'idalmacenusuf',
            valueField: 'idfila',
            disabled: false,
            displayField: 'text',
            mode: 'local',
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            anchor: '80%',
            typeAhead: true,
            resizable: true,
            emptyText: this.idioma.lbSeleccione,
            fieldLabel: this.idioma.comboAlmacenUsufructo,
            selectOnFocus: true,
            listeners: {
                'select': function (cmb, rec) {
                    var esta = _this.getExcluirCombos(cmb.hiddenName, cmb.getValue());
                    if (esta) {
                        mostrarMensaje(3, LOG.farm.confgeneral.Idioma.msgErrorSelecCombo);
                        cmb.reset();
                    }
                }
            }
        });

        this.comboDispensario = new LOG.util.ComboBox({
            url: '/logistica/farmacia/configuracion/index.php/configuraciongeneral/cargarDeposito',
            name: 'iddispensario',
            autoLoad: true,
            combo: true,
            hiddenName: 'iddispensario',
            valueField: 'idfila',
            disabled: false,
            displayField: 'text',
            mode: 'local',
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            anchor: '80%',
            typeAhead: true,
            resizable: true,
            emptyText: this.idioma.lbSeleccione,
            fieldLabel: this.idioma.comboDispensario,
            selectOnFocus: true,
            listeners: {
                'select': function (cmb, rec) {
                    var esta = _this.getExcluirCombos(cmb.hiddenName, cmb.getValue());
                    if (esta) {
                        mostrarMensaje(3, LOG.farm.confgeneral.Idioma.msgErrorSelecCombo);
                        cmb.reset();
                    }
                }
            }
        });

        this.comboReservaMov = new LOG.util.ComboBox({
            url: '/logistica/farmacia/configuracion/index.php/configuraciongeneral/cargarDeposito',
            name: 'idreservmob',
            autoLoad: true,
            combo: true,
            hiddenName: 'idreservmob',
            valueField: 'idfila',
            disabled: false,
            displayField: 'text',
            mode: 'local',
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            anchor: '80%',
            typeAhead: true,
            resizable: true,
            emptyText: this.idioma.lbSeleccione,
            fieldLabel: this.idioma.comboReservaMov,
            selectOnFocus: true,
            listeners: {
                'select': function (cmb, rec) {
                    var esta = _this.getExcluirCombos(cmb.hiddenName, cmb.getValue());
                    if (esta) {
                        mostrarMensaje(3, LOG.farm.confgeneral.Idioma.msgErrorSelecCombo);
                        cmb.reset();
                    }
                }
            }

        });


        return [
            this.comboAlmacen,
            this.comboAreaVenta,
            this.comboReserva,
            this.comboRetenido,
            this.comboAlmacenUsufructo,
            this.comboDispensario,
            this.comboReservaMov
        ]

    },
    getExcluirCombos: function (hiddenName, verificar) {
        var arrayDatosEsta = false;
        Ext.each(this.formPanelPrincipal.getForm().items.items, function (e) {
            if (e.combo && e.hiddenName != hiddenName && e.getValue() == verificar) {
                arrayDatosEsta = true;
            }
        });

        if (arrayDatosEsta) {
            return true;
        } else {
            return false;
        }

    },
    getGuardarDatos: function (params) {
        var _this = this;
        Ext.each(_this.formPanelPrincipal.getForm().items.items, function (e) {
            e.originalValue = e.getValue();
        });
        var idioma = LOG.farm.confgeneral.Idioma;
        Ext.MessageBox.wait(idioma.msgGuardando, idioma.msgEspere || '...');

        Ext.Ajax.request({
            url: '/logistica/farmacia/configuracion/index.php/configuraciongeneral/getGuardarDatos',
            method: 'POST',
            params: {
                datos: Ext.encode(params)
            },

            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var resp = Ext.decode(response.responseText);

                if (resp.success) {

                    mostrarMensaje(2, "Los datos han sido guardados satisfactaoriamente.");

                }
            }
        });
    },
    cargaInicial: function () {
        var _this = this;
        var idioma = LOG.farm.confgeneral.Idioma;
        Ext.MessageBox.wait(idioma.msgDatosIniciales, idioma.msgEspere || '...');
        window.setTimeout(function () {
            Ext.Ajax.request({
                url: '/logistica/farmacia/configuracion/index.php/configuraciongeneral/cargaInicial',
                method: 'POST',
                callback: function (options, success, response) {

                    var resp = Ext.decode(response.responseText);
                    var record = new Ext.data.Record(resp.datos);
                    _this.formPanelPrincipal.getForm().loadRecord(record);
                    Ext.each(_this.formPanelPrincipal.getForm().items.items, function (e) {
                        e.originalValue = e.getValue();
                    });

                    Ext.MessageBox.hide();

                }
            });
        }, 2800);

    }

});