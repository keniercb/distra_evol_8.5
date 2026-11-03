
Ext.ns('Copa.Configuracion.CondicionPago');
Copa.Configuracion.CondicionPago.View = {
    init: function(perfil, etiquetas, model) {
        var scope = this;
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdic',
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            tooltip: etiquetas.tooltipAdicionar,
            text: etiquetas.lbAdicionar,
            abreviatura: 'add_condicionespago'
        });
        validate.addButton(this.btnAdicionar);

        this.btnModificar = new Ext.Button({
            disabled: true,
            id: 'btnMod',
//            icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            tooltip: etiquetas.tooltipModificar,
            text: etiquetas.lbModificar,
            abreviatura: 'add_condicionespago'
        });
        validate.addButton(this.btnModificar);

        this.btnEliminar = new Ext.Button({
            disabled: true,
            id: 'btnEli',
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            tooltip: etiquetas.tooltipEliminar,
            text: etiquetas.lbEliminar,
            abreviatura: 'del_condicionespago'
        });
        validate.addButton(this.btnEliminar);

        this.btnVer = new Ext.Button({
            disabled: true,
            hidden: true, // quitar esto cuando se implemente la funcionalidad
            id: 'btnVer',
//            icon: perfil.dirImg + 'ver.png',
            iconCls: 'ver',
            tooltip: etiquetas.tooltipVer,
            text: etiquetas.lbVer
        });
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
//            icon: perfil.dirImg + 'buscaravanzada.png',
            iconCls: 'buscaravanzada',
            tooltip: etiquetas.tooltipBuscar,
            text: etiquetas.lbBuscar,
            abreviatura: 'busqueda_condicionespago'
        });
        validate.addButton(this.btnBuscar);

        this.btnActivar = new Ext.Button({
            id: 'btnActivar',
            disabled: true,
//            icon: perfil.dirImg + 'estado.png',
            iconCls: 'estado',
            tooltip: etiquetas.tooltipActivar,
            text: etiquetas.lbActivar,
            abreviatura: 'predeterminar_condicionespago'
        });
        validate.addButton(this.btnActivar);

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaCondicionPago',
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            tooltip: etiquetas.tooltipAyuda,
            text: etiquetas.lbAyuda
        });
        
        //Probando el adicionar
        this.btnPrueba = new Ext.Button({
            id: 'btnAdic',
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            tooltip: 'Adicionar condicion de pago',
            text: 'Prueba'
        });

        // Para el menu contextual	
        this.menuItemActivar = new Ext.menu.Item({
            text: etiquetas.lbActivar,
            hidden: true,
//            icon: perfil.dirImg + 'estado.png'
            iconCls: 'estado'
        });
        this.menuItemEliminar = new Ext.menu.Item({
            text: etiquetas.lbEliminar,
            hidden: true,
//            icon: perfil.dirImg + 'eliminar.png'
            iconCls: 'eliminar'
        });
        this.menuItemModificar = new Ext.menu.Item({
            text: etiquetas.lbModificar,
            hidden: true,
//            icon: perfil.dirImg + 'modificar.png'
            iconCls: 'modificar'
        });

        this.menuContextual = new Ext.menu.Menu({
            floating: false,
            shadow: "drop",
            hideBorders: true,
            items: [this.menuItemActivar, this.menuItemModificar, this.menuItemEliminar]
        });

        this.smPayCondition = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.paginToolbar = new Ext.Cont.PagingToolbar({
            pageSize: 20,
            displayInfo: true,
            clearFilter: true,
            displayMsg: etiquetas.displayMsg,
            emptyMsg: etiquetas.emptyMsg,
            store: model.payConditionStore
        });

        this.grid = new Ext.grid.GridPanel({
            id: 'gridcondiciones',
            store: model.payConditionStore,
            frame: false,
            border: false,
            sm: this.smPayCondition,
            stripeRows: true,
            //loadMask: true,
            viewConfig: {
                autoFill: true
            },
            autoExpandColumn: 'denominacion',
            columns: [
                {
                    id: 'idcondicionpago',
                    hidden: true,
                    hideable: false,
                    sortable: true,
                    header: etiquetas.lbIdentificador,
                    dataIndex: 'idcondicionpago'
                }, {
                    id: 'denominacion',
                    width: 300,
                    sortable: true,
                    header: etiquetas.lbDenominacion,
                    dataIndex: 'denominacion',
                    renderer: function(value, metadata, record) {
                        return scope.BuildInfoTooltip(value, metadata, record);
                    }
                }, {
                    id: 'plazo',
                    //align: 'right',
                    width: 100,
                    sortable: true,
                    header: etiquetas.lbfPlazo,
                    dataIndex: 'plazo',
                    renderer: function(value, metadata, record) {
                        return scope.BuildInfoTooltip(value, metadata, record);
                    }
                }, {
                    id: 'dpp',
                    align: 'right',
                    width: 100,
                    sortable: true,
                    header: etiquetas.lbfDescuento,
                    dataIndex: 'dpp',
                    renderer: function(value, metadata, record) {
                        return scope.BuildInfoTooltip(value, metadata, record);
                    }
                }, {
                    id: 'mora',
                    align: 'right',
                    width: 100,
                    sortable: true,
                    header: etiquetas.lbfMora,
                    dataIndex: 'mora',
                    renderer: function(value, metadata, record) {
                        return scope.BuildInfoTooltip(value, metadata, record);
                    }
                }, {
                    id: 'activo',
                    width: 100,
                    align: 'center',
                    sortable: true,
                    header: etiquetas.lbActivo,
                    dataIndex: 'activo',
                    renderer: function(value, metadata, record) {
                        if (value == '1') {
                            metadata.attr = 'style="color:#f00"';
                        }
                        value = (value == '1') ? etiquetas.lbYes : etiquetas.lbNo;
                        return scope.BuildInfoTooltip(value, metadata, record);
                    }
                }],
            bbar: this.paginToolbar
        });
        this.panel = new Ext.Panel({
            //title: etiquetas.lbTitPanelPrincipal,
            layout: 'fit',
            border: false,
            items: [this.grid], // aqui se debe poner el grid o el componente con lo de las condiciones de pago
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnActivar, this.btnVer, this.btnBuscar, /*this.btnPrueba,*/ '->', this.btnAyuda]
        });
        new Ext.Viewport({
            layout: 'fit',
            items: [this.panel]
        });
        
        this.BuildInfoTooltip = function(value, metadata, record) {
            metadata.attr += ' ext:qtip="';
            if (!isNaN(parseFloat(record.json.plazo)))
                metadata.attr += etiquetas.lbTooltipTitle.replace('<#field>', etiquetas.lbPlazo).replace('<#value>', record.json.plazo) + ' ' + etiquetas.lbDias + '</br>';
            if (!isNaN(parseFloat(record.json.dpp)))
                metadata.attr += etiquetas.lbTooltipTitle.replace('<#field>', etiquetas.lbDescuento).replace('<#value>', record.json.dpp) + ' ' + etiquetas.lbPorciento + '</br>';
            if (!isNaN(parseFloat(record.json.mora)))
                metadata.attr += etiquetas.lbTooltipTitle.replace('<#field>', etiquetas.lbMora).replace('<#value>', record.json.mora) + ' ' + etiquetas.lbPorciento + '</br>';
            if (!isNaN(parseFloat(record.json.iva)))
                metadata.attr += etiquetas.lbTooltipTitle.replace('<#field>', etiquetas.lbIva).replace('<#value>', record.json.iva) + ' ' + etiquetas.lbPorciento + '</br>';
            metadata.attr += '"';
            return value;
        };
    },
    BuildWindows: function(etiquetas, action) {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            tooltip: (action === 'search') ? etiquetas.tooltipCancelarBuscar : etiquetas.tooltipCancelar,
            tabIndex: 104,
            text: etiquetas.lbCancelar
        });
        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            disabled: true,
//            icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
//            disabled: true,
            tooltip: etiquetas.tooltipAplicar,
            tabIndex: 105,
            text: etiquetas.lbAplicar
        });
        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: /*(action === 'search') ? false : */true,
            tooltip: (action === 'search') ? etiquetas.tooltipAceptarBuscar : etiquetas.tooltipAceptar,
            tabIndex: 106,
            nextTab: 'idDenominacion',
            text: etiquetas.lbAceptar
        });

        this.hnid = new Ext.form.Hidden({
            name: 'idcondicionpago',
            id: 'idcondicionpago',
            value: '-1'
        });

        this.tfDenominacion = new Ext.form.TextField({
            id: 'idDenominacion',
            name: 'tfDenominacion',
            anchor: '100%',
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda _\-\s]*$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+([--_\s{1}]?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+)*)+$/,
            regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales (-,_).',
            maxLength: 100,
            maxLengthText: etiquetas.maxLengthText.replace("<#>", '100'),
//            fieldLabel: (action === 'add' || action === 'modify') ? etiquetas.lbDenominacion + etiquetas.lbMarcaCampoObligatorio : etiquetas.lbDenominacion,
            fieldLabel: etiquetas.lbDenominacion,
            allowBlank: (action === 'add' || action === 'modify') ? false : true,
            //blankText: etiquetas.blankText,
            tabIndex: 100,
            enableKeyEvents: true
        });

        this.tfplazo = new Ext.form.TextField({
            id: 'plazo',
//            fieldLabel: (action === 'add' || action === 'modify') ? etiquetas.lbfPlazo + etiquetas.lbMarcaCampoObligatorio : etiquetas.lbfPlazo,
            fieldLabel: etiquetas.lbfPlazo,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            regexText: 'Solo admite n&uacute;meros enteros positivos de hasta 4 d&iacute;gitos.',
            //regexText: etiquetas.regexText,
            width: '100%',
            name: 'plazo',
            validator: function() {
                if (this.getValue() > 9999)
                    return false;
                return true;
            },
            allowBlank: (action === 'add' || action === 'modify') ? false : true,
            //selectOnFocus: true,
            minValue: 1,
            minText: etiquetas.minTextPlazo,
            //blankText: etiquetas.blankText,
            maxLength: 4,
            maxLengthText: etiquetas.maxLengthText.replace("<#>", '4'),
            invalidText: etiquetas.maxLengthText.replace("<#>", '4'),
            editable: false,
            enableKeyEvents: true,
            tabIndex: 101,
            listeners: {
                blur: function(tf) {
                    if (isNaN(tf.getValue()))
                        tf.setValue('');
                }
            }
        });

        this.tfdescuento = new Ext.form.TextField({
            id: 'dpp',
            regexText: 'Solo admite n&uacute;meros reales enteros entre 0 y 100.',//etiquetas.regexText,
//            fieldLabel: (action === 'add' || action === 'modify') ? etiquetas.lbfDescuento + etiquetas.lbMarcaCampoObligatorio : etiquetas.lbfDescuento,
            fieldLabel: etiquetas.lbfDescuento,
            width: '100%',
            name: 'dpp',
            validator: function() {
                if (this.getValue() > 100)
                    return false;
                return true;
            },
            selectOnFocus: true,
            allowBlank: (action === 'add' || action === 'modify') ? false : true,
            //blankText: etiquetas.blankText,
            maxValue: 100,
            maxText: 'Solo admite n&uacute;meros reales enteros entre 0 y 100.',//etiquetas.maxText.replace('<#>', '100'),
            maskRe: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            invalidText: 'Solo admite n&uacute;meros reales enteros entre 0 y 100.',//etiquetas.maxText.replace('<#>', '100'),
            regex: /^((\d{1,3}(\.\d+)?)|((\d{1,3}\.)?\d+))$/,
//            maxLength: 6,
//            maxLengthText: etiquetas.maxLengthText.replace("<#>", '6'),
            enableKeyEvents: true,
            tabIndex: 102,
            editable: false
        });

        this.tfmora = new Ext.form.TextField({
            id: 'mora',
//            fieldLabel: (action === 'add' || action === 'modify') ? etiquetas.lbfMora + etiquetas.lbMarcaCampoObligatorio : etiquetas.lbfMora,
            fieldLabel: etiquetas.lbfMora,
            regexText: 'Solo admite n&uacute;meros reales enteros entre 0 y 100.',//etiquetas.regexText,
            allowBlank: (action === 'add' || action === 'modify') ? false : true,
            width: '100%',
            validator: function() {
                if (this.getValue() > 100)
                    return false;
                return true;
            },
            name: 'mora',
            maxValue: 100,
            maxText: 'Solo admite n&uacute;meros reales enteros entre 0 y 100.',//etiquetas.maxText.replace("<#>", '100'),
            invalidText: 'Solo admite n&uacute;meros reales enteros entre 0 y 100.',//etiquetas.maxText.replace("<#>", '100'),
            maskRe: /^([0-9 \-\xf3\xf1\xe1\xe9\xed\xfa\xd1.]+ ?[0-9.]*)+$/,
            regex: /^((\d+(\.\d+)?)|((\d*\.)?\d+))$/,
//            maxLength: 6,
//            maxLengthText: etiquetas.maxLengthText.replace("<#>", '6'),
            enableKeyEvents: true,
            selectOnFocus: true,
            tabIndex: 103,
            editable: false
        });

        this.panelGest = new Ext.form.FormPanel({
            layout: 'form',
            frame: true,
            autoHeight: true,
            width: 300,
            items: (action === 'add' || action === 'modify') ? [this.hnid, this.tfDenominacion, this.tfplazo, this.tfdescuento, this.tfmora] : [this.tfDenominacion, this.tfplazo, this.tfdescuento, this.tfmora]
        });

        this.windows = new Ext.Window({
            title: (action === 'add') ? etiquetas.titleAdicionar : ((action === 'modify') ? etiquetas.titleModificar : etiquetas.titleBuscar),
            modal: true,
            defaultButton: 'btnCancelar',
            resizable: false,
            constrain: true,
            layout: 'fit',
            autoValidate: false,
            closeAction: (action === 'add' || action === 'modify') ? 'close' : 'hide',
            items: [this.panelGest],
            buttons: (action ==='add') ? [this.btnCancelar, this.btnAplicar, this.btnAceptar] : [this.btnCancelar, this.btnAceptar]
        });
    },
    Prueba: function(etiquetas) {
        this.btnCancelarPrueba = new Ext.Button({
            id: 'btnCancelarPrueba',
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            tooltip: etiquetas.tooltipCancelar,
            nextTab: 'tfDenominacion',
            text: etiquetas.lbCancelar
        });
        this.btnAplicarPrueba = new Ext.Button({
            id: 'btnAplicarPrueba',
            disabled: true,
//            icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            tooltip: etiquetas.tooltipAplicar,
            text: etiquetas.lbAplicar
        });
        this.btnAceptarPrueba = new Ext.Button({
            id: 'btnAceptarPrueba',
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            tooltip: etiquetas.tooltipAceptar,
            text: etiquetas.lbAceptar
        });

        this.tfDenominacionPrueba = new Ext.form.TextField({
            name: 'tfDenominacion',
            anchor: '100%',
            maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            maxLength: 255,
            maxLengthText: etiquetas.maxLengthText.replace("<#>", '100'),
            fieldLabel: etiquetas.lbDenominacion,
            blankText: etiquetas.blankText,
            width: 200,
            enableKeyEvents: true
        });
        this.tfPlazoPrueba = new Ext.form.NumberField({
            name: 'tfPlazoPrueba',
            labelAlign: 'top',
            anchor: '100%',
//            maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
//            regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            maxLength: 255,
            maxLengthText: etiquetas.maxLengthText.replace("<#>", '100'),
            //fieldLabel: etiquetas.lbDenominacion,
            fieldLabel: 'Plazo de vencimiento total',
            blankText: etiquetas.blankText,
            width: 200,
            enableKeyEvents: true
        });
        this.chPlazo = new Ext.form.Checkbox({
            id: 'chPlazo',
            //boxLabel: etiquetas.lbPlazo,
            boxLabel: 'Pago a plazo',
            hideLabel: true,
            name: 'plazo',
            selectOnFocus: true,
            enableKeyEvents: true
        });
        this.chDiaFijo = new Ext.form.Checkbox({
            id: 'chDiaFijo',
            //boxLabel: etiquetas.lbPlazo,
            boxLabel: 'Dia fijo',
            hideLabel: true,
            name: 'diaFijo',
            selectOnFocus: true,
            enableKeyEvents: true
        });
        this.dfDia = new Ext.form.DateField({
            id: 'dfDia',
            name: 'fechaDia',
            hideLabel: true,
            readOnly: false,
            editable: true,
            hidden: true,
            anchor: '91%',
            format: 'd/m/Y',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });
        this.chDescuentoVentas = new Ext.form.Checkbox({
            id: 'chDescuentoVentas',
            //boxLabel: etiquetas.lbPlazo,
            boxLabel: 'Descuentos en venta',
            hideLabel: true,
            name: 'descuentoVenta',
            selectOnFocus: true,
            enableKeyEvents: true
        });
        this.chDescuentoPago = new Ext.form.Checkbox({
            id: 'chDescuentoPago',
            //boxLabel: etiquetas.lbPlazo,
            boxLabel: 'Descuento por pronto pago',
            hideLabel: true,
            name: 'descuentoPago',
            selectOnFocus: true,
            enableKeyEvents: true
        });
        this.fsDescuento = new Ext.form.FieldSet({
            title: 'Descuentos',
            collapsible: true,
            collapsed: false,
            autoHeight: true,
            //layout: 'anchor',
            anchor: '90%',
            items: [this.chDescuentoVentas, this.chDescuentoPago]
        });
        

        this.panelGestPrueba = new Ext.form.FormPanel({
            layout: 'form',
            frame: true,
            border: false,
            autoHeight: true,
            autoWidth: true,
            width: 1000,
            items: [{
                    items: {
                        layout: 'column',
                        labelAlign: 'top',
                        items: [{
                                style: 'margin: 0 0 0 10',
                                columnWidth: .30,
                                layout: 'form',
                                items: [this.tfDenominacionPrueba, this.chPlazo]
                            }, {
                                style: 'margin: 0 0 0 40',
                                columnWidth: .30,
                                layout: 'form',
                                items: [this.tfPlazoPrueba, this.chDiaFijo, this.dfDia]
                            }, {
                                style: 'margin: 8 0 0 60',
                                columnWidth: .40,
                                layout: 'form',
                                items: [this.fsDescuento]
                            }
                        ]
                    }
                }
            ]
        });
        
        this.panel2 = new Ext.Panel({
            id: 'panel2',
            layout: 'fit',
            border: false
        }); 
        
        this.panelOtro = new Ext.Panel({
            id: 'panelOtro',
            layout: 'fit',
            border: false,
            width: 500,
            tbar: this.panelGestPrueba,
            items: [this.panel2]
        });

        this.windowsPrueba = new Ext.Window({
            title: etiquetas.titleAdicionar,
            width: 890,
            height: 500,
            resizable: false,
            layout: 'fit',
            items: [this.panelOtro],
            buttons: [this.btnCancelarPrueba, this.btnAplicarPrueba, this.btnAceptarPrueba]
        });
    }
};

//Inicializando la vista.
Ext.QuickTips.init();
var perfil = window.parent.perfil;
perfil.etiquetas = Object();
//var etiquetas = Object();   

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function(options, success, response)
    {
        var etiquetas = Ext.decode(response.responseText);
        //Inicializar el modelo
        model = Copa.Configuracion.CondicionPago.Model;
        model.init();

        //Inicializar la vista.
        var view = Copa.Configuracion.CondicionPago.View;
        view.init(perfil, etiquetas, model);

        //Inicializar controlador.
        var controller = Copa.Configuracion.CondicionPago.Controller;
        controller.init(perfil, etiquetas, view, model);

        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();
    }
});