Ext.ns('Pvd.Fuerzatrabajo.Movimientoslaborales');

Pvd.Fuerzatrabajo.Movimientoslaborales.windBuscarPersona = Ext.extend(Ext.Window, {
    width: '30%',
    layout: 'fit',
    height: 225,
    initComponent: function () {
        var me = this;

        this.nfNumid = new Ext.form.TextField({
            name: 'nfNumid',
            id: 'nfNumid',
            fieldLabel: me.idioma.flNumid, //"No. de identidad",
            anchor: '100%',
            emptyText: me.idioma.emptyText, //'Criterio a buscar',
            allowBlank: true,
            enableKeyEvents: true,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: me.idioma.rtNumid,
            maxLength: 11,
            maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerdio es 11 d&iacute;gitos.',
            value: me.accion == 'MOD' ? me.numidmod : '',
            listeners: {
                keyup: function () {

                }
            }
        });

        this.tfNombre = new Ext.form.TextField({
            name: 'nombre',
            id: 'tfNombre',
            fieldLabel: me.idioma.flNombre, //"Nombre",
            anchor: '100%',
            allowBlank: true,
            emptyText: me.idioma.emptyText, //'Criterio a buscar',
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ ]*)+$/,
            regexText: me.idioma.rtSololetras, //'Solo admite letras y el caracter especial ( ).',
            value: me.accion == 'MOD' ? me.nombremod : '',
            listeners: {
                keyup: function () {

                }
            }
        });

        this.tfPapel = new Ext.form.TextField({
            name: 'papel',
            id: 'tfPapel',
            fieldLabel: me.idioma.flPrimerApellido, //"Primer apellido",
            anchor: '100%',
            allowBlank: true,
            emptyText: me.idioma.emptyText, //'Criterio a buscar',
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ ]*)+$/,
            regexText: me.idioma.rtSololetras, //'Solo admite letras y el caracter especial ( ).',
            value: me.accion == 'MOD' ? me.papelmod : '',
            listeners: {
                keyup: function () {

                }
            }
        });

        this.tfSapel = new Ext.form.TextField({
            name: 'sapel',
            id: 'tfSapel',
            fieldLabel: me.idioma.flSegundoApellido, //"Segundo apellido",
            anchor: '100%',
            allowBlank: true,
            emptyText: me.idioma.emptyText, //'Criterio a buscar',
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ ]*)+$/,
            regexText: me.idioma.rtSololetras, //'Solo admite letras y el caracter especial ( ).',
            value: me.accion == 'MOD' ? me.sapelmod : '',
            listeners: {
                keyup: function () {

                }
            }
        });

        this.cbTipoFiltro = new Ext.form.ComboBox({
            store: me.modelo.sttipoFiltro,
            displayField: 'tipo',
            valueField: 'id',
            hiddenName: 'id',
            forceSelection: true,
            typeAhead: true,
            allowBlank: false,
            hidden: false,
            anchor: '100%',
            mode: 'local',
            triggerAction: 'all',
            emptyText: me.idioma.lbSeleccione,
            editable: false,
            fieldLabel: me.idioma.flFiltro,
            value: me.accion == 'MOD' ? me.altamod : 3,
            listeners: {
                select: {
                    fn: function (sm, record, index) {
                        if (record.data.id == 4) {
                            me.nfNumid.disable();
                            me.tfNombre.disable();
                            me.tfPapel.disable();
                            me.tfSapel.disable();
                        } else {
                            me.nfNumid.enable();
                            me.tfNombre.enable();
                            me.tfPapel.enable();
                            me.tfSapel.enable();
                        }
                    }
                }
            }
        });

        this.fpCriteriosBusqueda = new Ext.FormPanel({
            layout: 'form',
            frame: true,
            labelAlign: 'top',
            width: '100%',
            items: [me.cbTipoFiltro, {
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    border: false,
                    items: [me.nfNumid],
                    bodyStyle: 'padding: 0px 5px 0px 0px'
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    border: false,
                    items: [me.tfNombre]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    border: false,
                    items: [me.tfPapel],
                    bodyStyle: 'padding: 0px 5px 0px 0px'
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    border: false,
                    items: [me.tfSapel]
                }]
            }]
        });

        this.items = [this.fpCriteriosBusqueda];

        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: me.idioma.ttBtnCancelar,//'Cerrar ventana sin guardar los datos <b>(Alt + X)</b>',
            handler: function () {
                me.close();
            }
        });
        this.btnAceptarCritBusq = new Ext.Button({
            id: 'btnAceptarCritBusq',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: me.idioma.ttBtnAceptar,//'Guardar datos y cerrar ventana <b>(Enter)</b>',
            disabled: true,
            handler: function () {

                if (me.cbTipoFiltro.getValue() != 4) { /*Reserva*/
                    if (me.fpCriteriosBusqueda.getForm().isValid()) {
                        /*Valido los criterios de busqueda*/
                        var cantidadCriterios = 0;
                        var peso = 0;

                        if (me.nfNumid.getValue() != '') {
                            peso = peso + me.nfNumid.getValue().length * 10;
                            cantidadCriterios++;
                        }
                        if (me.tfNombre.getValue() != '') {
                            peso = peso + me.tfNombre.getValue().length * 7;
                            cantidadCriterios++;
                        }
                        if (me.tfPapel.getValue() != '') {
                            peso = peso + me.tfPapel.getValue().length * 7;
                            cantidadCriterios++;
                        }
                        if (me.tfSapel.getValue() != '') {
                            peso = peso + me.tfSapel.getValue().length * 7;
                            cantidadCriterios++;
                        }

                        /*Compruebo que los campos no esten vacios*/
                        if (me.nfNumid.getValue().length < 1) {
                            if (cantidadCriterios < 2) {
                                mostrarMensaje(6, 'Debe seleccionar como m&iacute;nimo 2 criterios de b&uacute;squeda.');
                                return;
                            }
                            if (peso < 75) {
                                mostrarMensaje(6, 'No se han introducido caracteres suficientes para realizar la b&uacute;squeda.');
                                return;
                            }
                        }

                        var numid = me.nfNumid.getValue();
                        var nombre = me.tfNombre.getValue();
                        var papel = me.tfPapel.getValue();
                        var sapel = me.tfSapel.getValue();
                        var tipoFiltro = me.cbTipoFiltro.getValue();

                        me.fireEvent('critbusqaceptado', numid, nombre, papel, sapel, tipoFiltro);
                        me.close();
                    }

                }else{
                    me.fireEvent('critbusreserva');
                    me.close();
                }
            }
        });

        var winshow = false;

        this.on('show', function(){
            winshow = true;
        });

        this.on('hide', function(){
            winshow = false;
        });

        this.documentKeyMap = new Ext.KeyMap(document, [{
            key: 13,
            alt: false,
            shift: false,
            ctrl: false,
            fn: function () {
                if (winshow == true && me.btnAceptarCritBusq.isVisible()) {
                    me.btnAceptarCritBusq.handler();
                }
            }
        }, {
            key: 'x',
            alt: true,
            shift: false,
            ctrl: false,
            fn: function () {
                if (winshow == true && me.btnCancelar.isVisible) {
                    me.btnCancelar.handler();
                }
            }
        }
        ]);

        this.buttons = [this.btnCancelar, this.btnAceptarCritBusq];

        Pvd.Fuerzatrabajo.Movimientoslaborales.windBuscarPersona.superclass.initComponent.call(this);

    }

});