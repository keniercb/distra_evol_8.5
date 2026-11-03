Ext.namespace('Ext.AddTarjetaIslaAzul');
Ext.AddTarjetaIslaAzul.View = Ext.extend(Ext.Window, {
    lmask: undefined,
    etiquetas: undefined,
    constructor: function (model, params) {
        Ext.apply(this, params);
        this.initializeSetsAndGets();

        this.setModel(model);
        // this.etiquetas = params.etiquetas;
        this.modo = params.action;
        var title = '(??)';
        title = this.action == 'add' ? this.idioma.lbTitleAddTarjeta : this.idioma.lbTitleModTarjeta
        // if (this.modo === 'add') {
        //     title = 'Adicionar recarga';
        // } else if (this.modo === 'mod') {
        //     title = 'Modificar recarga';
        // } else if (this.modo === 'ver') {
        //     title = 'Ver recarga';
        // }
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            layout: 'fit',
            width: Ext.lib.Dom.getViewWidth() * 0.40,
            // height: Ext.lib.Dom.getViewWidth() * 0.6,
            closeAction: 'close',
            frame: true,
            resizable: false,
            title: title,
            listeners: {
                scope: this,
                show: function () {
                    // this.scope.scope.keyMapa.disable();
                },
                close: function () {
                    // this.scope.scope.keyMapa.enable();
                }
            }
        });

        this.initializeClass();
        Ext.AddTarjetaIslaAzul.View.superclass.constructor.call(this);
        this.addEvents({
            'FormStepsCreado': true
        });
    },
    loadMask: function (message) {
        if (!(this.lmask instanceof Ext.LoadMask && message === undefined)) {
            this.lmask = new Ext.LoadMask(this.body, {
                msg: message ? message : 'Cargando...'
            });
        }
        this.lmask.show();
    },
    hideMask: function () {
        if (this.lmask instanceof Ext.LoadMask) {
            this.lmask.hide();
        }
    },
    initializeClass: function () {
        this.initializeFunctions();
        this.createButtons();
        this.setWindowItems(this.getModel());
    },
    setWindowItems: function (model) {
        this.items = [this.createForm(model)];
    },
    initializeFunctions: function () {

        this.createButtons = function () {
            this.btnNuevo = new Ext.Button({
                iconCls: 'nuevo',
                text: 'Nuevo',
                tooltip: 'Limpiar los campos',
            });

            this.btnCancelar = new Ext.Button({
                id: 'btnCancelar',
                //icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                selectOnFocus: true,
                //disabled: true,
                text: this.idioma.lbCancelar,
                tooltip: this.idioma.lbToolCancelar,
            });
            this.btnAplicar = new Ext.Button({
                id: 'btnAplicar',
                // icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'aplicar',
                disabled: true,
                text: this.idioma.lbAplicar,
                tooltip: this.idioma.lbToolAplicar
            });
            this.btnAceptar = new Ext.Button({
                id: 'btnAceptar',
                //icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                disabled: true,
                text: this.idioma.lbAceptar,
                tooltip: this.idioma.lbToolAceptar
            });
            this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];

            if (this.modo == 'add') {
                this.buttons = [this.btnCancelar, this.btnNuevo, this.btnAceptar];
            } else if(this.modo == 'mod') {
                this.buttons = [this.btnCancelar, this.btnAceptar];
            } else {
                this.buttons = [this.btnCancelar];
            }
        };

        this.createForm = function (model) {
            //Combo Moneda
            this.cbMoneda = new Ext.form.ComboBox({
                disabledClass: 'disabled-component',
                name: 'idmoneda',
                selectOnFocus: true,
                editable: true,
                disabled: true,
                emptyText: this.idioma.lbSeleccione,
                // width: 50,
                allowBlank: true,
                tabIndex: 3,
                store: model.getStoreMoneda(),
                valueField: 'idmoneda',
                displayField: 'codigoiso',
                hiddenName: 'idmoneda',
                enableKeyEvents: true,
                typeAhead: true,
                readOnly: true,
                mode: 'local',
                triggerAction: 'all',
                fieldLabel: this.idioma.lbMoneda,
                anchor: '95%',
                listeners: {
                    scope: this,
                    specialkey: function (tf, e) {
                        if (e.getCharCode() == Ext.EventObject.ENTER)
                            this.btnAceptar.focus();
                    }
                }
            });

            this.cbPersona = new Ext.form.ComboBox({
                fieldLabel: this.idioma.lbResponsable,
                store: model.getStorePersona(),
                valueField: 'idpersona',
                hiddenName: 'idpersona',
                displayField: 'nombre',
                emptyText: this.idioma.lbSeleccione, //'Seleccione...',
                disabledClass: 'disabled-component',
                //editable: true,
                forceSelection: true,
                allowBlank: true,
                resizable: true,
                //readOnly: true,
                triggerAction: 'all',
                anchor: '97%',
                minChars: 0, //Para la nueva busqueda poner contraria esta linea
                pageSize: 10, //Para la nueva busqueda poner contraria esta linea
                maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
                tpl: '<tpl for="."><div ext:qtip="{numid} {nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
                selectOnFocus: true,
                enableKeyEvents: true,
                listeners: {
                    scope: this,
                    specialkey: function (tf, e) {
                        if (e.getCharCode() == Ext.EventObject.ENTER)
                            this.cbCombustible.focus();
                    }
                }
            });

            this.cbxCuenta = new Ext.contabilidad.util.linkedCombo({
                disabledClass: 'disabled-component',
                store: model.getStoreCuenta(),
                fieldLabel: this.idioma.lbCuenta,
                displayField: 'text',
                valueField: 'idcuenta',
                allowBlank: true,
                listHeight: 200,
                tabIndex: 4,
                anchor: '97%',
                listeners: {
                    scope: this,
                    specialkey: function (tf, e) {
                        if (e.getCharCode() == Ext.EventObject.ENTER)
                            this.tfSaldoAprobado.focus();
                    }
                }
            });

//----------------------------------------

            this.cbTipo = new Ext.form.ComboBox({
                disabledClass: 'disabled-component',
                fieldLabel: 'Tipo',
                store: model.getStoreTipo(),
                valueField: 'idtipo',
                displayField: 'tipo',
                emptyText: this.idioma.lbSeleccione, //'Seleccione...',
                forceSelection: true,
                allowBlank: false,
                resizable: true,
                // readOnly: true,
                triggerAction: 'all',
                anchor: '95%',
                lazyRender: true,
                mode: 'local',
                selectOnFocus: true,
                enableKeyEvents: true,
            });

            this.firstElement = this.nfNumero = new Ext.form.TextField({
                allowBlank: false,
                disabledClass: 'disabled-component',
                anchor: '95%',
                fieldLabel: this.idioma.lbTarjeta,
                maxLength: 16,
                name: 'numero',
                // allowDecimals: false,
                // allowNegative: false,
                maskRe: /^([0-9\(1)]+ ?[0-9]*)+$/,
                regex: /^([0-9\(1)]+ ?[0-9]*)+$/,
                maxLengthText: this.idioma.lbMaxLengthText16,
            });

            this.dfFechaVence = new Ext.form.DateField({
                disabledClass: 'disabled-component',
                selectOnFocus: true,
                name: 'fechavence',
                fieldLabel: this.idioma.lbFechaVence,
                // allowBlank: false,
                // invalidText: this.idioma.lbInvalidFecha,
                format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
                anchor: '100%',
                // maxValue: new Date(),
                enableKeyEvents: true
            });
            //------Activo----
            this.ckActivo = new Ext.form.Checkbox({
                name: 'activo',
                hideLabel: true,
                boxLabel: this.idioma.lbActiva,
                checked: true
            });
            //-------------------------------------
            var formTarjeta = new Ext.FormPanel({
                frame: true,
                layout: 'form',
                autoHeight: true,
                labelWidth: 50,
                labelAlign: 'top',
                trackResetOnLoad: true,
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.nfNumero]
                    },
                        {
                            columnWidth: .38,
                            layout: 'form',
                            items: [this.dfFechaVence]
                            // items: [this.tfVehiculo]
                        },
                        {
                            style: 'margin: 10 0 0 10',
                            columnWidth: .12,
                            layout: 'form',
                            hidden: this.action == 'mod',
                            items: [this.ckActivo]
                        }
                    ]
                }]
            });

            this.setForm(formTarjeta);
            return formTarjeta;
        };

        this.crearFormSteps = function () {

            var formSteps = new CON.Util.FormSteps({
                arrForm: [this.getForm()],
                arrBtn: this.buttons
            });

            this.setFormSteps(formSteps);
            this.fireEvent('FormStepsCreado', this.getFormSteps());
            return this.getFormSteps();
        };

    },
    initializeSetsAndGets: function () {
        this.setModel = function (model) {
            this.model = model;
        };
        this.getModel = function () {
            return this.model;
        };
        this.setForm = function (form) {
            this.formConf = form;
        };
        this.getForm = function () {
            return this.formConf;
        };
        this.setFormSteps = function (formSteps) {
            this.formSteps = formSteps;
        };
        this.getFormSteps = function () {
            return this.formSteps;
        };

        this.getCkActivo = function () {
            return this.ckActivo;
        };
        this.getDfFechaVence = function () {
            return this.dfFechaVence;
        };
        this.getNfNumer = function () {
            return this.nfNumero;
        };
        this.getCbTipo = function () {
            return this.cbTipo;
        };
        this.getCbxCuenta = function () {
            return this.cbxCuenta;
        };
        this.getCbPersona = function () {
            return this.cbPersona;
        };
        this.getCbMoneda = function () {
            return this.cbMoneda;
        };

        this.getBtnNuevo = function () {
            return this.btnNuevo;
        };
        this.getBtnCancelar = function () {
            return this.btnCancelar;
        };
        this.getBtnAceptar = function () {
            return this.btnAceptar;
        };
    }
});
