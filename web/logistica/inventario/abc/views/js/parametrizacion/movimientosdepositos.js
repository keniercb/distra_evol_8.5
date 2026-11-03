/**
 Uso:Componente para mostrar los movimientos de los productos en un deposito.

 * ---------------------------------------------

 * 11 de Enero de 2021 |   ABC
 *

 * @extends Ext.Window
 * @xtype
 * @autor   Centro Logistica - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Ext.log.abc');
Ext.QuickTips.init();

Ext.log.abc.MovimientosDepositos = Ext.extend(Ext.Window, {
    id: 'MovimientosDepositos-1',
    title: 'Movimientos de los productos del dep&oacute;sito',
    region: (this.region ? this.region : 'center'),
    layout: (this.layout ? this.layout : 'border'),
    modal: true,
    height: 500,
    width: 900,
    closable: true,
    idconf: this.idconf,
    idestructura: this.idestructura,
    iddeposito: this.iddeposito,
    fechainicio: this.fechainicio,
    fechafin: this.fechafin,
    initComponent: function () {
        var self = this;
        var seleccion = null;

        this.st = new Ext.data.GroupingStore({
            url: 'obtenermovimientosdepositos',
            groupField:'producto',
            sortInfo:{field: 'producto', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [
                    {name: 'idproducto'},
                    {name: 'idindicador'},
                    {name: 'codigo'},
                    {name: 'producto'},
                    {name: 'existenciaactual'},
                    {name: 'fechacontable'},
                    {name: 'signo'},
                    {name: 'cantidad'},
                    {name: 'clasificacionabc'},
                    {name: 'minimo'},
                    {name: 'maximo'},
                    {name: 'operacion'}
                ])
        });

        this.gp = new Ext.grid.GridPanel({
            id: 'gpMDep',
            layout: 'fit',
            height: 500,
            split:true,
            width: 500,
            region: 'center',
            columns: [{
                header: 'idproducto',
                hidden: true,
                hideable: false,
                dataIndex: 'idproducto'
            },{
                header: 'idindicador',
                hidden: true,
                hideable: false,
                dataIndex: 'idindicador'
            },{
                header: 'producto',
                hidden: true,
                hideable: false,
                dataIndex: 'producto'
            }, {header: 'C&oacute;digo', width: 120, sortable: true, dataIndex: 'codigo'}
            , {header: 'Existencia actual', width: 80, sortable: true, dataIndex: 'existenciaactual', renderer: function (val) {
                        return '<p style="text-align:right">'+val+'</p>';
                    }}
            , {header: 'Fecha', width: 70, sortable: true, dataIndex: 'fechacontable'}
            , {header: 'Signo', width: 50, sortable: true, dataIndex: 'signo'}
            , {header: 'Cantidad', width: 80, sortable: true, dataIndex: 'cantidad', renderer: function (val) {
                        return '<p style="text-align:right">'+val+'</p>';
                    }}
            , {header: 'Clasificacion ABC', width: 80, sortable: true, dataIndex: 'clasificacionabc'}
            , {header: 'Operaci&oacute;n', width: 200, sortable: true, dataIndex: 'operacion'}
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
            store: this.st,
            sm: self.sm,
            loadMask: {msg: 'Cargando...'},
            //tbar: ['C&oacute;digo: ', this.cbCriteriosValoracion]
        });

        this.items = [this.gp];
        Ext.log.abc.MovimientosDepositos.superclass.initComponent.call(this);
        this.st.load({params:{
                idconf: self.idconf,
                idestructura: self.idestructura,
                iddeposito: self.iddeposito,
                fechainicio: self.fechainicio,
                fechafin: self.fechafin
        }});
    }
});
