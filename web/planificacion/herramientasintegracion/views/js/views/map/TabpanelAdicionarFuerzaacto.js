/**
 * Componente para adicionar fuerzas y actos
 * @copyright XETID Cuba
 * @author Ing Grabiel Montero Coello
 * @type {void|*|Object|Queue}
 */
Planificacion.Integracion.TabpanelAdicionarFuerzaacto = Ext.extend(Ext.TabPanel, {
    activeTab: 0,
    layoutOnTabChange: true,
    plain: true,
    border: false,
    bodyBorder: false,
    defaults: {
        frame: true,
        border: false,
        bodyBorder: false,
        autoHeight: true,
        xtype: 'form',
        buttonAlign: 'right'
    },
    initComponent: function() {
        var me = this;
        var idCmp = me.id;
        me.comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MapController();
        me.etiquetas = me.controller._getLabel('Map');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        me.validatorActo = new ExtExtend.FormValidator();
        me.validatorFuerza = new ExtExtend.FormValidator();

        me.btnFCancelar = new me.comps.buttons.btnCancelar({
            handler: function() {
                me.findParentByType('window').close();
            }
        });
        me.btnFAplicar = new me.comps.buttons.btnAplicar({
            handler: function() {
                var tab = me.getActiveTab();
                me.controller.gestionarFuerza({
                    clean: true,
                    tabPanel: me,
                    accion: 'ins',
                    form: tab.getForm()
                });
            }
        });
        me.btnFAceptar = new me.comps.buttons.btnAceptar({
            handler: function() {
                var tab = me.getActiveTab();
                me.controller.gestionarFuerza({
                    win: me.win,
                    close: true,
                    tabPanel: me,
                    accion: 'ins',
                    form: tab.getForm()
                });
            }
        });

        me.btnACancelar = new me.comps.buttons.btnCancelar({
            handler: function() {
                me.findParentByType('window').close();
            }
        });
        me.btnAAplicar = new me.comps.buttons.btnAplicar({
            handler: function() {
                var tab = me.getActiveTab();
                me.controller.gestionarActo({
                    clean: true,
                    tabPanel: me,
                    accion: 'ins',
                    form: tab.getForm()
                });
            }
        });
        me.btnAAceptar = new me.comps.buttons.btnAceptar({
            handler: function() {
                var tab = me.getActiveTab();
                me.controller.gestionarActo({
                    win: me.win,
                    close: true,
                    tabPanel: me,
                    accion: 'ins',
                    form: tab.getForm()
                });
            }
        });

        me.tf_FDenominacion = new me.comps.fields.fieldDenom({
            fieldLabel: me.etiquetas.lbDenominacionfza,
            anchor: '100%',
            name: 'fzaDenominacion',
            allowBlank: false
        });
        me.ta_FDescripcion = new me.comps.fields.fieldDescripcion({
            fieldLabel: me.etiquetas.lbDescripcionfza,
            name: 'fzaDescripcion',
            anchor: '100%'
        });
        me.tf_ADenominacion = new me.comps.fields.fieldDenom({
            fieldLabel: me.etiquetas.lbDenominacionacto,
            anchor: '100%',
            name: 'actoDenominacion',
            allowBlank: false
        });
        me.ta_ADescripcion = new me.comps.fields.fieldDescripcion({
            fieldLabel: me.etiquetas.lbDescripcionacto,
            name: 'actoDescripcion',
            anchor: '100%'
        });
        me.nf_Peso = new me.comps.fields.simpleField({
            fieldLabel: me.etiquetas.lbPeso,
            anchor: '30%',
            name: 'peso',
            allowBlank: false
        });
        me.nf_FactibilidadInstitucional = new Ext.form.NumberField({
            fieldLabel: me.etiquetas.lbFactibilidadinstitucional, minValue: 0, maxValue: 1,
            name: 'institucional',
            minText: me.etiquetas.text01,
            maxText: me.etiquetas.text01
        });
        me.nf_ValorInteres = new Ext.form.NumberField({
            fieldLabel: me.etiquetas.lbValorinteres, minValue: -1, maxValue: 0,
            name: 'interes',
            minText: me.etiquetas.textN10,
            maxText: me.etiquetas.textN10
        });
        me.nf_FactibilidadHecho = new Ext.form.NumberField({
            fieldLabel: me.etiquetas.lbFactibilidadhecho, minValue: 0, maxValue: 1,
            name: 'hecho',
            minText: me.etiquetas.text01,
            maxText: me.etiquetas.text01
        });
        me.nf_EstabilidadMinima = new Ext.form.NumberField({
            fieldLabel: me.etiquetas.lbEstabilidad,
            minValue: 0,
            maxValue: 1,
            name: 'estabilidad'
        });
        me.nf_NivelCompulsion = new Ext.form.NumberField({
            fieldLabel: me.etiquetas.lbNivelcompulsion,
            minValue: 0,
            maxValue: 1,
            name: 'compulsion'
        });
        me.items = [{
                title: me.etiquetas.ttlAddFuerza,
                id: 'tab-fza',
                defaults: {
                    xtype: 'fieldset',
                    border: false,
                    bodyBorder: false,
                    autoHeight: true
                },
                items: [{
                        labelAlign: 'top',
                        style: 'padding:0;margin-bottom:5px',
                        items: [me.tf_FDenominacion, me.ta_FDescripcion]
                    }, {
                        labelWidth: 35,
                        style: 'padding:0;margin-bottom:0',
                        items: [me.nf_Peso]
                    }],
                buttons: [me.btnFCancelar, me.btnFAplicar, me.btnFAceptar]
            }, {
                title: me.etiquetas.ttlAddActo,
                id: 'tab-acto',
                defaults: {
                    xtype: 'fieldset',
                    autoHeight: true,
                    anchor: '100%'
                },
                items: [{
                        labelAlign: 'top',
                        border: false,
                        style: 'padding:0;margin-bottom:5px',
                        items: [me.tf_ADenominacion, me.ta_ADescripcion]
                    }, {
                        title: me.etiquetas.ttlVariablesviabilidad,
                        style: 'padding-right:0',
                        labelWidth: 260,
                        defaults: {anchor: '95%', allowBlank: false},
                        items: [me.nf_FactibilidadInstitucional, me.nf_ValorInteres, me.nf_FactibilidadHecho]
                    }, {
                        title: me.etiquetas.ttlVariablesestabilidad,
                        style: 'padding-right:0',
                        labelWidth: 260,
                        defaults: {
                            anchor: '95%',
                            allowBlank: false,
                            minText: me.etiquetas.text01,
                            maxText: me.etiquetas.text01
                        },
                        items: [me.nf_EstabilidadMinima, me.nf_NivelCompulsion]
                    }],
                buttons: [me.btnACancelar, me.btnAAplicar, me.btnAAceptar]
            }];

        me.keys = [
            {
                key: 'x',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    if (!me.btnACancelar.disabled)
                        me.btnACancelar.handler.call();
                    else {
                        if (!me.btnFCancelar.disabled)
                            me.btnFCancelar.handler.call();
                    }
                }
            },
            {
                key: 'p',
                ctrl: true,
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    if (!me.btnAAplicar.disabled)
                        me.btnAAplicar.handler.call();
                    else {
                        if (!me.btnFAplicar.disabled)
                            me.btnFAplicar.handler.call();
                    }
                }
            },
            {
                key: Ext.EventObject.ENTER,
                scope: me,
                stopEvent: true,
                fn: function() {
                    if (!me.btnAAceptar.disabled)
                        me.btnAAceptar.handler.call();
                    else {
                        if (!me.btnFAceptar.disabled)
                            me.btnFAceptar.handler.call();
                    }
                }
            }
        ];


        Planificacion.Integracion.TabpanelAdicionarFuerzaacto.superclass.initComponent.call(me);
    },
    listeners: {
        render: function() {
            var me = this;
            me.win = me.controller.win;
            me.initValidatorFuerza();
            me.initValidatorActo();
        }
    },
    /**
     * Función para inicializar los campos del acto
     * @copyright XETID Cuba
     * @name initValidatorActo
     * @author Ing Grabiel Montero Coello
     */
    initValidatorActo: function() {
        var me = this;
        var fields = {
            denom: me.tf_ADenominacion,
            desc: me.ta_ADescripcion,
            inst: me.nf_FactibilidadInstitucional,
            int: me.nf_ValorInteres,
            hecho: me.nf_FactibilidadHecho,
            est: me.nf_EstabilidadMinima,
            comp: me.nf_NivelCompulsion
        };
        me.controller.initValidator(me.validatorActo, fields, [me.btnAAplicar, me.btnAAceptar]);
    },
    /**
     * Función para inicializar los campos de la fuerza
     * @copyright XETID Cuba
     * @name initValidatorFuerza
     * @author Ing Grabiel Montero Coello
     */
    initValidatorFuerza: function() {
        var me = this;
        var fields = {
            denom: me.tf_FDenominacion,
            desc: me.ta_FDescripcion,
            peso: me.nf_Peso
        };
        me.controller.initValidator(me.validatorFuerza, fields, [me.btnFAplicar, me.btnFAceptar]);
    }
});