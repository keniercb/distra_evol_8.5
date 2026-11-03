Ext.define("Traces.view.PanelCronologia", {
   /* require: [
        "Ext.panel.Panel",
        "Ext.form.*"
    ],*/
    extend: "Ext.panel.Panel",
    alias: "widget.panelCronologia",
    title: 'Cronología',
    layout: 'fit',
    margins: '5 0 0 0',
    id:'panelCronologia',
    mixins: {
        checkCombo: 'Ext.ux.CheckCombo'
    },

    initComponent: function () {

        var me = this;

        me.storeip = Ext.create('Traces.store.IpStore');
        me.storetipotraza = Ext.create('Traces.store.TipoTrazaStore');
        me.storeusuario = Ext.create('Traces.store.UsuarioStore');
        me.gridpanel = Ext.widget('gridpanelCronologia');

        this.myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando datos..."});

        /*Fecha inicio*/
        me.fechaInicio = Ext.create('Ext.form.field.Date', {
            fieldLabel: 'Desde',
            id: 'fechainicio_cronologia',
            name: 'fechainicio_cronologia',
            labelAlign: 'top',
            editable: false,
            anchor: "98%",
            format: 'd/m/Y',
            maxLength: 10,
            prevTab: 'btnAyuda_cronologia',
            //margin: '0 10 5 0',
            ///////
            value: Ext.Date.add(new Date(), Ext.Date.YEAR, 0),
            maxValue: Ext.Date.add(new Date(), Ext.Date.YEAR, 0),
            maxText: 'La fecha en el campo debe ser mayor o igual a {0}',
            altFormats: 'd/m/Y|d-m-Y|Y-m-d',
            action: 'accChange'
        });

        /*Fecha fin*/
        me.fechaFin = Ext.create('Ext.form.field.Date', {
            fieldLabel: 'Hasta',
            id: 'fechafin_cronologia',
            name: 'fechafin_cronologia',
            colWidth: .1,
            anchor: "98%",
            labelAlign: 'top',
            editable: false,
            format: 'd/m/Y',
            maxLength: 10,
            //margin: '0 10 5 0',
            altFormats: 'd/m/Y|d-m-Y|Y-m-d',
            value: Ext.Date.add(new Date(), Ext.Date.YEAR, 0),
            minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, 0),
            minText: 'La fecha en el campo debe ser mayor o igual a {0}',
            action: 'accChange'
        });

        /*Usuarios*/
        me.comboUsuario = Ext.create('Ext.ux.CheckCombo', {
            id:'usuario_cronologia',
            emptyText: '[-Seleccione-]',
            listConfig: {
                loadingText: 'Cargando...'
            },
            fieldLabel: 'Usuarios',
            editable: false,
            labelAlign: 'top',
            colWidth: .1,
            store: me.storeusuario,
            valueField: 'idusuario',
            displayField: 'usuario',
            hiddenName: 'usuario',
            //margin: '0 10 5 0',
            mode: 'local',
            anchor: '98%',
            action: 'accChange'
        });

        /*Tipos de trazas*/
        me.comboTipoTrazas = Ext.create('Ext.ux.CheckCombo', {
            id:'tipoTraza_cronologia',
            emptyText: '[-Seleccione-]',
            listConfig: {
                loadingText: 'Cargando...'
            },
            fieldLabel: 'Tipos de trazas',
            labelAlign: 'top',
            editable: false,
            colWidth: .15,
            store: me.storetipotraza,
            valueField: 'idtipotraza',
            displayField: 'tipotraza',
            //margin: '0 10 5 0',
            mode: 'local',
            anchor: '98%',
            action: 'accChange'
        });

        /*IP*/
        me.comboIps = Ext.create('Ext.form.ComboBox', {
            id:'comboIP_cronologia',
            emptyText: '[-Seleccione-]',
            listConfig: {
                loadingText: 'Cargando...'
            },
            fieldLabel: 'IP',
            editable: false,
            labelAlign: 'top',
            colWidth: .1,
            store: me.storeip,
            valueField: 'ippc',
            displayField: 'ip',
            hiddenName: 'ippc',
            typeAhead: true,
            triggerAction: 'all',
            selectOnFocus: true,
            //margin: '0 10 5 0',
            anchor: '95%',
            action: 'accChange'
        });

        /*Buscar*/
        me.buscar = Ext.create('Ext.Button', {
            id:'btnBuscar_cronologia',
            text: '<u>B</u>uscar',
            iconCls: 'buscar',
            tooltip: 'Buscar traza <b>(Alt+B)</b>',
            margin: '22 3 2 5',
            action:'cronologiaBuscar',

            border:false
        });

        /*Limpiar*/
        me.limpiar = Ext.create('Ext.Button', {
            id:'btnLimpiar_cronologia',
            text: '<u>L</u>impiar',
            tooltip: 'Limpiar filtro(s) <b>(Alt+L)</b>',
            iconCls: 'limpiar',
            margin: '22 0 2 0',
            action:'cronologiaLimpiar',
            border: false

        });

        me.ayuda = Ext.create('Ext.Button', {
            iconCls: 'ayuda',
            id:'btnAyuda_cronologia',
            text: 'Ayuda',
            nextTab: 'fechainicio_cronologia',
            //margin: '22 0 2 10',
            border: false
        });
        /*Toolbar*/
        me.tbar = [
            {
                xtype:'container',
                layout: 'column',
                defaults: {
                    margin: '3 0 2 9',
                    frame:false,
                    border:false
                },

                items:[
                    me.fechaInicio,
                    me.fechaFin,
                    me.comboUsuario,
                    me.comboTipoTrazas,
                    me.comboIps
                ]
            },
            {
                xtype:'buttongroup',
                layout: 'column',
                border: false,
                frame: false,
                items:[
                    me.buscar,
                    me.limpiar
                ]
            },
            '->',
            me.ayuda
        ];

        me.items = [me.gridpanel],
        //this.html = 'Codigo de cronología aqui...',
        me.callParent(arguments);
    }
});
