
Ext.ns('Copa.Configuracion.CondicionPago');
Copa.Configuracion.CondicionPago.View = {
    init: function(perfil, etiquetas, model) {
        var scope = this;

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            tooltip: etiquetas.tooltipAyuda,
            text: etiquetas.lbAyuda
        });

        // Linares
        this.btnPrueba = new Ext.Button({
            id: 'btnAdic',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: 'Adicionar t&eacute;rmino de pago <b>(Alt+I)</b>',
            text: 'Adicionar'
        });
        this.btnModificarPrueba = new Ext.Button({
            id: 'btnMod',
            icon: perfil.dirImg + 'modificar.png',
            iconCls: 'btn',
            tooltip: 'Modificar t&eacute;rmino de pago <b>(Alt+M)</b>',
            text: 'Modificar'
        });
        this.btnEliminarPrueba = new Ext.Button({
            id: 'btnDel',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: 'Eliminar t&eacute;rmino de pago <b>(DEL)</b>',
            text: 'Eliminar'
        });
        this.btnActivarPrueba = new Ext.Button({
            id: 'btnActivar',
            disabled: true,
            icon: perfil.dirImg + 'estado.png',
            iconCls: 'btn',
            tooltip: /*'Activar t&eacute;rmino de pago <b>(Alt+A)</b>',*/etiquetas.tooltipActivar,
            text: etiquetas.lbActivar
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

        this.sfDenominacion = new Ext.Cont.SearchField({
            id: 'sfDenominacion',
            width: 250,
            emptyText: 'Criterio a buscar...',
            searchTooltip: 'Buscar t&eacute;rmino de pago <b>(Alt+B)</b>',
            //regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+$/,
            //maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+$/,
            fnOnSearch: function() {
                scope.buscarTerminoPago();
            },
            fnOnClear: function() {
                scope.limpiarBuscar();
            }
        })

        /*this.expander = new Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<p><b>Denominacion:</b> {nombre}</p><br>',
                '<p><b>Mora:</b><br> {construirMora}</p><br>',
                '<p><b>Dpp:</b><br> {construirDpp}</p><br>',
                '<p><b>Descuento en venta:</b><br> {construirDV}</p><br>',
                '<p><b>Pago a plazos:</b><br> {construirCuotas}</p><br>'
            )
        });*/

        this.grid = new Ext.grid.GridPanel({
            id: 'gridcondiciones',
            store: model.payConditionStore,
            frame: false,
            border: false,
            sm: this.smPayCondition,
            stripeRows: true,
            //plugins: this.expander,
            //loadMask: true,
            viewConfig: {
                autoFill: true
            },
            autoExpandColumn: 'nombre',
            columns: [
                //this.expander,
                {
                    id: 'idterminodepago',
                    hidden: true,
                    hideable: false,
                    sortable: true,
                    header: etiquetas.lbIdentificador,
                    dataIndex: 'idterminodepago'
                }, {
                    id: 'nombre',
                    width: 300,
                    sortable: true,
                    header: etiquetas.lbDenominacion,
                    dataIndex: 'nombre'/*,
                    renderer: function(value, metadata, record) {
                        return scope.BuildInfoTooltip(value, metadata, record);
                    }*/
                }, {
                    id: 'plazo',
                    //align: 'center',
                    width: 80,
                    sortable: true,
                    header: 'Plazo',//etiquetas.lbfPlazo,
                    dataIndex: 'plazo',
                    renderer: function(value, metadata, record) {
                        if(value != null)
                            if(record.json.idumplazo == 1 )
                                return value + ' dia(s)';
                            else if(record.json.idumplazo == 2)
                                return value + ' semana(s)';
                            else if(record.json.idumplazo == 3)
                                return value + 'mes(es)';
                            else
                                return value + ' año(s)';
                        else
                            return '';
                    }
                }, {
                    id: 'mora',
                    align: 'center',
                    width: 100,
                    sortable: true,
                    header: etiquetas.lbfMora,
                    dataIndex: 'mora',
                    renderer: function(value, metadata, record) {
                        if(value == 0)
                            return '<img src = /lib/ExtJS/temas/default/images/iconos/cierreno.png>';
                        else
                            return '<img src = /lib/ExtJS/temas/default/images/iconos/cierresi.png>';
                    }
                }, {
                    id: 'dpp',
                    align: 'center',
                    width: 100,
                    sortable: true,
                    header: etiquetas.lbfDescuento,
                    dataIndex: 'dpp',
                    renderer: function(value, metadata, record) {
                        if(value == 0)
                            return '<img src = /lib/ExtJS/temas/default/images/iconos/cierreno.png>';
                        else
                            return '<img src = /lib/ExtJS/temas/default/images/iconos/cierresi.png>';
                    }
                }, {
                    id: 'descuentoVenta',
                    align: 'center',
                    width: 100,
                    sortable: true,
                    header: 'Descuento en venta',//etiquetas.lbfDescuento,
                    dataIndex: 'descventa',
                    renderer: function(value, metadata, record) {
                        if(value == 0)
                            return '<img src = /lib/ExtJS/temas/default/images/iconos/cierreno.png>';
                        else
                            return '<img src = /lib/ExtJS/temas/default/images/iconos/cierresi.png>';
                    }
                }, {
                    id: 'pagoPlazo',
                    align: 'center',
                    width: 50,
                    sortable: true,
                    header: 'Pago a plazo',//etiquetas.lbfPlazo,
                    dataIndex: 'aplazos',
                    renderer: function(value, metadata, record) {
                        if(value == 0)
                            return '<img src = /lib/ExtJS/temas/default/images/iconos/cierreno.png>';
                        else
                            return '<img src = /lib/ExtJS/temas/default/images/iconos/cierresi.png>';
                    }
                }, {
                    id: 'activo',
                    width: 100,
                    align: 'center',
                    sortable: true,
                    header: etiquetas.lbActivo,
                    dataIndex: 'predeterminado',
                    renderer: function(value, metadata, record) {
                        if (value == '1') {
                            metadata.attr = 'style="color:#f00"';
                        }
                        return value = (value == '1') ? etiquetas.lbYes : etiquetas.lbNo;
                        //return scope.BuildInfoTooltip(value, metadata, record);
                    }
                }, {
                    id: 'construirMora',
                    hidden: true,
                    hideable: true,
                    dataIndex: 'construirMora'
                }, {
                    id: 'construirDpp',
                    hidden: true,
                    hideable: true,
                    dataIndex: 'construirDpp'
                }, {
                    id: 'construirDV',
                    hidden: true,
                    hideable: true,
                    dataIndex: 'construirDV'
                }, {
                    id: 'construirCuotas',
                    hidden: true,
                    hideable: true,
                    dataIndex: 'construirCuotas'
                }],
            tbar: ['Denominaci&oacute;n', this.sfDenominacion],
            bbar: this.paginToolbar
        });
        this.panel = new Ext.Panel({
            //title: etiquetas.lbTitPanelPrincipal,
            layout: 'fit',
            border: false,
            items: [this.grid], // aqui se debe poner el grid o el componente con lo de las condiciones de pago
            tbar: [/*this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnActivar, this.btnVer, this.btnBuscar, */this.btnPrueba, this.btnModificarPrueba, this.btnEliminarPrueba, this.btnActivarPrueba, '->', this.btnAyuda]
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
        this.buscarTerminoPago = function() {
            model.payConditionStore.baseParams.start = 0;
            model.payConditionStore.baseParams.limit = 20;
            model.payConditionStore.baseParams.denominacion = scope.sfDenominacion.getValue();
            model.payConditionStore.load({
                callback: function() {
                    scope.sfDenominacion.focus(true, 10);
                }
            });
        };
        this.limpiarBuscar = function() {
            model.payConditionStore.baseParams = {};
            model.payConditionStore.reload();
        };
    },
    Prueba: function(etiquetas, action) {
        this.btnCancelarPrueba = new Ext.Button({
            id: 'btnCancelarPrueba',
            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'btn',
            tooltip: etiquetas.tooltipCancelar,
            nextTab: 'tfDenominacion',
            text: etiquetas.lbCancelar
        });
        this.btnAplicarPrueba = new Ext.Button({
            id: 'btnAplicarPrueba',
            disabled: true,
            icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'btn',
            tooltip: etiquetas.tooltipAplicar,
            text: etiquetas.lbAplicar
        });
        this.btnAceptarPrueba = new Ext.Button({
            id: 'btnAceptarPrueba',
            disabled: true,
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn',
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
            allowBlank: false,
            blankText: etiquetas.blankText,
            width: 200,
            enableKeyEvents: true
        });

        this.cbTiempoPlazo = new Ext.form.ComboBox({
            mode: 'local',
            hiddenName: 'id',
            hideLabel: true,
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            emptyText:'Seleccione...',
            store: model.payStore,
            valueField: 'id',
            displayField: 'denominacion',
            resizable: true,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            typeAhead: true,
            forceSelection: true,
            editable: true,
            anchor: '100%',
            triggerAction: 'all',
            enableKeyEvents: true
        });

        this.tfPlazoPrueba = new Ext.form.NumberField({
            name: 'tfPlazoPrueba',
            labelAlign: 'top',
            anchor: '80%',
//            maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
//            regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
            maxLength: 255,
            maxLengthText: etiquetas.maxLengthText.replace("<#>", '100'),
            //fieldLabel: etiquetas.lbDenominacion,
            fieldLabel: 'Plazo',
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
            //hidden: true,
            disabled: true,
            //anchor: '100%',
            width: 132,
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
            boxLabel: 'Descuento por pronto pago (DPP)',
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
            layout: 'column',
            items: [{
                style: 'margin: 0 0 0 10',
                columnWidth: .5,
                items: [this.chDescuentoVentas]
            }, {
                style: 'margin: 0 10 0 10',
                columnWidth: .5,
                items: [this.chDescuentoPago]
            }]
        });

        // Para todos los grid
        this.rowactionEliminar = new Ext.grid.RowActions({
            id: 'rowactionEliminar',
            align: 'center',
            actions: [
                {
                    id: 'eliminar',
                    tooltip: 'Eliminar mora',//this.idioma.lbDelTalonario,
                    icon: perfil.dirImg + 'eliminar.png',
                    align: 'center',
                    width: 40
                }
            ]
        });

        this.btnAdicionarPrueba = new Ext.Button({
            id: 'btnAdicionarPrueba',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: etiquetas.tooltipCancelar,
            text: 'Adicionar'//etiquetas.lbCancelar
        });

        this.panelGestPrueba = new Ext.form.FormPanel({
            layout: 'form',
            frame: true,
            border: false,
            autoHeight: true,
            autoWidth: true,
            width: 1000,
            items: [{
                border: false,
                items: [{
                    layout: 'form',
                    //labelAlign: 'top',
                    items: [{
                        style: 'margin: 10 10 0 10',
                        //columnWidth: .5,
                        layout: 'form',
                        items: [this.tfDenominacionPrueba]
                    }]
                }, {
                    layout: 'column',
                    items: [
                        {
                            style: 'margin: 10 0 0 10',
                            columnWidth: .4,
                            layout: 'form',
                            items: [this.tfPlazoPrueba]
                        }, {
                            style: 'margin: 10 10 0 -30',
                            columnWidth: .3,
                            layout: 'form',
                            items: [this.cbTiempoPlazo]
                        }, {
                            style: 'margin: 11 0 0 50',
                            columnWidth: .3,
                            layout: 'form',
                            items: [this.chPlazo]
                        }]
                },{
                    items: [{
                        style: 'margin:15 10 0 10',
                        layout: 'form',
                        items: [this.fsDescuento]
                    }]
                }]
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
            title: (action === 'add') ? 'Adicionar t&eacute;rmino de pago' : 'Modificar t&eacute;rmino de pago',
            width: 490,
            height: 500,
            modal: true,
            autoValidate: false,
            resizable: false,
            constrain: true,
            layout: 'fit',
            items: [this.panelOtro],
            buttons: (action === 'add') ? [this.btnCancelarPrueba, this.btnAplicarPrueba, this.btnAceptarPrueba] : [this.btnCancelarPrueba, this.btnAceptarPrueba]
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
    }
});