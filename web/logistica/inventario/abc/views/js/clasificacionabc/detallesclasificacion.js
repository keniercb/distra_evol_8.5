/**
 Uso:Componente para mostrar el detalle de la clasificacion ABC y su análisis.

 * ---------------------------------------------

 * 2 de Diciembre 2020 |   ABC
 *

 * @extends Ext.Window
 * @xtype
 * @autor   Centro Logistica - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Ext.log.abc');
Ext.QuickTips.init();

Ext.log.abc.DetallesClasificacionABC = Ext.extend(Ext.Window, {
    id: 'DetallesClasificacionABC-1',
    title: 'Detalles de la clasificaci&oacute;n ABC',
    region: (this.region ? this.region : 'center'),
    layout: (this.layout ? this.layout : 'border'),
    modal: true,
    height: 500,
    width: 900,
    closable: true,
    idconf: this.idconf,
    uebs: this.uebs,
    initComponent: function () {
        var self = this;
        var seleccion = null;

        this.smUEBNat = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.smUEBNat.on('rowselect', function (sm, index, store) {
            self.stPareto.removeAll();
            self.stTotal.removeAll();
            self.nfValorTotal.setValue(0);
            seleccion = self.stUEBNat.getAt(index);

            self.stPareto.load({
                params:{
                    tipo: 1,
                    idconf: self.idconf,
                    idestructura: seleccion.data.idestructura,
                    idnaturaleza: seleccion.data.idnaturaleza,
                    idcriterio: self.cbCriteriosValoracion.getValue()
                }
            });

            self.stTotal.load({
                params:{
                    tipo: 2,
                    idconf: self.idconf,
                    idestructura: seleccion.data.idestructura,
                    idnaturaleza: seleccion.data.idnaturaleza
                }
            });
        });

        this.smUEBNat.on('rowdeselect', function (sm, index, store) {
            self.stPareto.removeAll();
            self.stTotal.removeAll();
            self.nfValorTotal.setValue(0);
            seleccion = null;
        });

        this.stUEBNat = new Ext.data.GroupingStore({
            url: 'obtenerDetallesClasificacionABC',
            groupField:'estructura',
            sortInfo:{field: 'estructura', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "id"},
                [
                    {name: 'id'},
                    {name: 'idestructura'},
                    {name: 'estructura'},
                    {name: 'idnaturaleza'},
                    {name: 'naturaleza'}
                ])
        });

        this.gpUEBNat = new Ext.grid.GridPanel({
            id: 'gpUEBNat',
            layout: 'fit',
            height: 500,
            split:true,
            width: 250,
            title: 'Estructuras y naturalezas',
            region: 'center',
            columns: [{
                header: 'id',
                hidden: true,
                hideable: false,
                dataIndex: 'id'
            },{
                header: 'idestructura',
                hidden: true,
                hideable: false,
                dataIndex: 'idestructura'
            },{
                header: 'idnaturaleza',
                hidden: true,
                hideable: false,
                dataIndex: 'idnaturaleza'
            }, {header: 'Naturaleza', width: 150, sortable: true, dataIndex: 'naturaleza'}
            , {header: 'Estructura', width: 150, sortable: true, dataIndex: 'estructura',hidden: true, hideable: false}
            ],
            stripeRows: true,
            autoScroll: true,
            border: true,
            hideBorders: false,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit    : true,
                groupTextTpl: '{gvalue}'
            }),
            store: this.stUEBNat,
            sm: self.smUEBNat,
            loadMask: {msg: 'Cargando...'}
        });

        this.cmPareto = new Ext.grid.ColumnModel([
            {
                header: "idindicador",
                dataIndex: 'idindicador',
                hidden: true,
                hideable: false,
                width: 100
            },{
                header: "C&oacute;digo",
                dataIndex: 'codigo',
                width: 100
            }, {
                header: "Producto",
                dataIndex: 'producto',
                width: 200
            }, {
                header: "Valor",
                dataIndex: 'valor',
                width: 80,
                summaryType: 'sum'
            }, {
                header: "% Acumulado",
                dataIndex: 'porciento',
                width: 80
            }, {
                header: "Clasificaci&oacute;n",
                dataIndex: 'clasificacion',
                width: 80,
                renderer:  function(v){
                    var val = parseInt(v);
                    if(val == 1){
                        return 'A';
                    }else if(val == 2){
                        return 'B';
                    }else if(val == 3){
                        return 'C';
                    }else {
                        return 'NC';
                    }
                }
            }, {
                header: "Peso",
                dataIndex: 'peso',
                width: 80
            }
        ]);

        this.stPareto = new Ext.data.Store({
            url: '/logistica/inventario/abc/index.php/clasificacionabc/obtenerPareto',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idindicador"},
                [
                    {name: 'idindicador'},
                    {name: 'codigo'},
                    {name: 'producto'},
                    {name: 'valor'},
                    {name: 'porciento'},
                    {name: 'clasificacion'},
                    {name: 'peso'}
                ]),
            listeners: {
                load : function( Store, records, options ){
                    var total = 0;
                    for(var i = 0; i < records.length; i++){
                        total = total + parseFloat(records[i].data.valor);
                    }
                    self.nfValorTotal.setValue(total);
                }
    }
        });

        this.smPareto = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.stCriteriosValoracion = new Ext.data.SimpleStore({
            fields:[
                    {name: 'idcriteriovaloracion'},
                    {name: 'denominacion'}
                ]
        });
        var c = [[1, 'Popularidad'], [2, 'Cantidad de unidades vendidas'], [3, 'Importe en ventas']];
        this.stCriteriosValoracion.loadData(c);


        this.cbCriteriosValoracion = new LOG.util.ComboBox({
            valueField: 'idcriteriovaloracion',
            displayField: 'denominacion',
            hiddenName: 'idcriteriovaloracion',
            allowBlank: false,
            mode: 'local',
            anchor: '100%',
            store: this.stCriteriosValoracion,
            emptyText: 'Seleccione...',
            blankText: 'Este campo es obligatorio.',
            readOnly: false,
            listeners: {
                select: function (v) {
                    if(seleccion != null){
                        self.stPareto.removeAll();
                        self.nfValorTotal.setValue(0);
                        self.stPareto.load({
                            params:{
                                idconf: self.idconf,
                                idestructura: seleccion.data.idestructura,
                                idnaturaleza: seleccion.data.idnaturaleza,
                                idcriterio: self.cbCriteriosValoracion.getValue()
                            }
                        });
                    }
                }
            }
        });

        this.nfValorTotal = new Ext.form.NumberField({
            allowBlank: true,
            anchor: '100%',
            allowDecimals: true,
            decimalPrecision: 6,
            allowNegative: false,
            minValue: 0,
            value: 0
        });

        this.gpParetoCriterios = new Ext.grid.GridPanel({
            id:'gpParetoCriteriosClasificacionABC',
            title: 'Detalles por criterios',
            layout: 'fit',
            store: this.stPareto,
            region: 'east',
            autoScroll: true,
            autoFit: true,
            stripeRows: true,
            cm: this.cmPareto,
            sm: this.smPareto,
            width: 600,
            height: 500,
            border: false,
            forceFit: true,
            hideBorders: true,
            loadMask: {msg: 'Cargando...'},
            tbar: ['Criterio: ', this.cbCriteriosValoracion, '->', 'Valor total: ', this.nfValorTotal]
        });


        this.cmTotal = new Ext.grid.ColumnModel([
            {
                header: "idindicador",
                dataIndex: 'idindicador',
                hidden: true,
                hideable: false,
                width: 100
            },{
                header: "C&oacute;digo",
                dataIndex: 'codigo',
                width: 100
            }, {
                header: "Producto",
                dataIndex: 'producto',
                width: 200
            }, {
                header: "Popularidad",
                dataIndex: 'clasificacion1',
                width: 70,
                renderer:  function(v){
                    var val = parseInt(v);
                    if(val == 1){
                        return 'A';
                    }else if(val == 2){
                        return 'B';
                    }else if(val == 3){
                        return 'C';
                    }else {
                        return 'NC';
                    }
                }
            }, {
                header: "U. vendidas",
                dataIndex: 'clasificacion2',
                width: 70,
                renderer:  function(v1){
                    var val1 = parseInt(v1);
                    if(val1 == 1){
                        return 'A';
                    }else if(val1 == 2){
                        return 'B';
                    }else if(val1 == 3){
                        return 'C';
                    }else {
                        return 'NC';
                    }
                }
            }, {
                header: "Importe",
                dataIndex: 'clasificacion3',
                width: 70,
                renderer:  function(v2){
                    var val2 = parseInt(v2);
                    if(val2 == 1){
                        return 'A';
                    }else if(val2 == 2){
                        return 'B';
                    }else if(val2 == 3){
                        return 'C';
                    }else {
                        return 'NC';
                    }
                }
            }, {
                header: "Peso total",
                dataIndex: 'pesototal',
                width: 70
            }, {
                header: "Clasificaci&oacute;n ABC",
                dataIndex: 'clasificaciontotal',
                width: 100,
                renderer:  function(v){
                    var val = parseInt(v);
                    if(val == 1){
                        return 'A';
                    }else if(val == 2){
                        return 'B';
                    }else if(val == 3){
                        return 'C';
                    }else {
                        return 'NC';
                    }
                }
            }
        ]);

        this.stTotal = new Ext.data.Store({
            url: '/logistica/inventario/abc/index.php/clasificacionabc/obtenerPareto',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idindicador"},
                [
                    {name: 'idindicador'},
                    {name: 'codigo'},
                    {name: 'producto'},
                    {name: 'clasificacion1'},
                    {name: 'clasificacion2'},
                    {name: 'clasificacion3'},
                    {name: 'pesototal'},
                    {name: 'clasificaciontotal'}
                ])
        });

        this.smTotal = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpTotal = new Ext.grid.GridPanel({
            id:'gpTotalClasificacionABC',
            title: 'Resumen general',
            layout: 'fit',
            store: this.stTotal,
            region: 'east',
            autoScroll: true,
            autoFit: true,
            stripeRows: true,
            cm: this.cmTotal,
            sm: this.smTotal,
            width: 600,
            height: 500,
            border: false,
            forceFit: true,
            hideBorders: true,
            loadMask: {msg: 'Cargando...'}
        });



        this.tpPareto = new Ext.TabPanel({
            region: 'east',
            enableTabScroll: true,
            defaults: {
                autoScroll: true
            },
            resizeTabs: true,
            width: 650,
            height: 500,
            split:true,
            minTabWidth: 100,
            tabWidth: 140,
            resizeTabs: true,
            //frame: true,
            activeTab: 0,
            layoutOnTabChange: true,
            items: [this.gpParetoCriterios, this.gpTotal]
        });

        this.items = [this.gpUEBNat, this.tpPareto];
        Ext.log.abc.DetallesClasificacionABC.superclass.initComponent.call(this);
        this.stUEBNat.load({params:{
                idconf: self.idconf,
                uebs: Ext.encode(self.uebs)
        }});
        this.cbCriteriosValoracion.setValue(1);
    }
});
