
Ext.define("Traces.view.PanelGrafica", {
    extend: "Ext.panel.Panel",
    alias: "widget.panelGrafica",
    requires: [
        'Traces.view.graficasTrazas.ReporteTrazas',
    ],
    frame: false,
    layout: 'border',
    border: false,

    title: 'Gráfica',
    margins: '5 0 0 0',
    id:'panelGrafica',

    initComponent: function () {
        var _this = this;

        this.items = [

            {
                region: 'center',
                //title: 'Reportes Trazas',
                xtype: 'graficasTrazas.ReporteTrazas'// Referencia a ReporteTraza.js
            }
        ];

        this.tbar = [
            {
                xtype: 'container',
                collapsible: true,
                layout: 'column',
                border: false,
                //id: 'filtroGraficas',
                defaults: {
                    margin: '3 0 2 9'
                },
                items: [
                    {
                        columnWidth: 0.30,
                        fieldLabel: perfil.etiquetas.panelgraf.desde,//'Desde',
                        id: 'fecha_desde',
                        name: 'fecha_desde',
                        prevTab: 'ayuda',
                        xtype: 'datefield',
                        labelPad: 5,
                        labelAlign: "top",
                        format: 'd/m/Y',
                        monthNames: perfil.etiquetas.date.monthNames,
                        monthYearText : perfil.etiquetas.date.monthYearText,
                        editable: false,
                        value: Ext.Date.add(new Date(), Ext.Date.YEAR, 0),
                        maxValue: Ext.Date.add(new Date(), Ext.Date.YEAR, 0),
                        maxText: perfil.etiquetas.panelgraf.maxText,//'La fecha en el campo debe ser menor o igual a {0}',
                        showToday: false
                        //vtype: 'date'
                    },
                    {
                        columnWidth: 0.30,
                        fieldLabel: perfil.etiquetas.panelgraf.hasta,//'Hasta',
                        xtype: 'datefield',
                        labelPad: 5,
                        labelAlign: "top",
                        format: 'd/m/Y',
                        monthNames: perfil.etiquetas.date.monthNames,
                        monthYearText : perfil.etiquetas.date.monthYearText,
                        id: 'fecha_hasta',
                        name: 'fecha_hasta',
                        editable: false,
                        value: Ext.Date.add(new Date(), Ext.Date.YEAR, 0),
                        minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, 0),
                        minText: perfil.etiquetas.panelgraf.minText,//'La fecha en el campo debe ser mayor o igual a {0}',
                        showToday: false
                        //vtype: 'date'
                    },
                    {
                        columnWidth: 0.20,
                        fieldLabel: perfil.etiquetas.panelgraf.combo,//'Tipo de gráfica',
                        xtype: 'combo',
                        labelPad: 5,
                        labelAlign: "top",
                        width: 50,
                        id: 'combo_TipoGrafica',
                        mode: 'local',
                        triggerAction: 'all',
                        forceSelection: true,
                        editable: false,
                        name: 'combo_TipoGrafica',
                        displayField: 'name',
                        valueField: 'value',
                        queryMode: 'local',
                        value: 'pie',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: [
                                {name: perfil.etiquetas.panelgraf.pastel, value: 'pie'},
                                {name: perfil.etiquetas.panelgraf.barra, value: 'bar'},
                                {name: perfil.etiquetas.panelgraf.curva, value: 'line'}
                            ]
                        })
                    },
                    {
                        columnWidth: 0.20,
                        xtype: 'checkbox',
                        itemsAlign: 'center',

                        fieldLabel: perfil.etiquetas.panelgraf.timereal,//'Tiempo real',
                        boxLabel: 'Activo',
                        labelAlign: "lefth",
                        margin: '0 0 0 9',                        
                        id: 'tiempoReal',
                        name: 'tiempoReal',
                        inputValue: 'Activo'
                    }
                ]
            },
            {

                iconCls: 'buscar',
                xtype: 'button',
                border: false,
                id: 'buscar',
                text: perfil.etiquetas.general.textBuscar,//'Buscar',
                tooltip: perfil.etiquetas.general.tooltipBuscar,//'Buscar traza <b>(Alt+B)</b>',
                action: 'buscarTrazas'

            },
            {
                iconCls: 'limpiar',
                xtype: 'button',
                border: false,
                id: 'limpiar',
                text: perfil.etiquetas.general.textLimpiar, //'Limpiar',
                tooltip: perfil.etiquetas.general.tooltipLimpiar,//'Limpiar filtro(s) <b>(Alt+L)</b>',
                action: 'LimpiarFiltro'
                //nextTab: 'ayuda'

            },

            '->',

            {
                iconCls: 'ayuda',
                xtype: 'button',
                border: false,
                id: 'ayudaGraficas',// se pone en la administradcion de la ayuda reporte/ayudaGraficas
                text: perfil.etiquetas.general.textAyuda,//'Ayuda',
                margin: '0 9 0 0',
                //tooltip: 'Limpiar filtro(s) <b>(Alt+L)</b>',
                //action: 'LimpiarFiltro',
                nextTab: 'fecha_desde'

            }
        ]

        this.callParent(arguments);
    }
});



