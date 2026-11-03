/**
 * @name analisisft.CmpResumen - Componente Resumen Estadístico.
 * @package Pvd.MovimientosLaborales.
 * @uses Pvd.MovimientosLaborales.Analisisft
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Orestes Rodríguez Lorenzo
 * @version 1.0
 */
Ext.ns('Pvd.MovimientosLaborales.Analisisft.Resumen');
//Definiendo idioma del componente
Pvd.MovimientosLaborales.Analisisft.Resumen.Idioma = {
    cmpResumen_title: 'Resumen estad&iacute;stico',
    gpResumenEst_indicador: 'Indicador',
    gpResumenEst_cant: 'Cantidad'

};
//Definiendo panel del componente
Pvd.MovimientosLaborales.Analisisft.Resumen = Ext.extend(Ext.Panel,{
    id: 'panelResumen',
    layout: 'fit',
    region: 'center',
    height: '100%',
    closable: true,
    initComponent: function () {
        var self = this;
        /*** Filtros del Reporte ***/
        this.tlEstructura = new Ext.tree.TreeLoader({
            dataUrl: 'obtenerEstructura',
            preloadChildren: false
        });
        this.tcbEstructuraOrganizativa = new Ext.components.TreeComboBox({
            allowBlank: true,
            anchor: '100%',
            fieldLabel: 'idioma.lbCargo',
            id: 'tcbEstructuraOrganizativa',
            treeConfig: {
                autoScroll: true,
                border: false,
                loader: this.tlEstructura,
                rootVisible: false
            },
            width: 400
        });
        this.btnBuscar = new Ext.Button({
            text: 'Buscar',
            iconCls: 'buscar',
            handler: function ()
            {
                self.stResumenEst.load({params:{idestructura: self.tcbEstructuraOrganizativa.getValue()}});
            }.createDelegate(this)
        });
        this.btnLimpiar = new Ext.Button({
            text: 'Limpiar',
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tcbEstructuraOrganizativa.setRawValue('');
                self.stResumenEst.load();
            }.createDelegate(this)
        });
        /*** Resumen estadístico ***/
        //Store
        self.stResumenEst = new Ext.data.GroupingStore({
            url: 'getResumenEstadistico',
            reader: new Ext.data.JsonReader(
                {root: "", id: ""},
                [{name:'agrupador'}, {name: 'tipo'}, {name:'indicador'}, {name:'cantidad'}]
            ),
            sortInfo   : {
                field: 'agrupador',
                direction: "DESC"
            },
            groupField : 'agrupador'
        });
        self.stResumenEst.load(); //Cargando datos
        //
        function setAgrupador(val, metaData, record, rowIndex, colIndex, store){
            var totaltrab = 0;
            store.each(function(obj){
                if(obj.data.tipo == 1) {
                    totaltrab += parseInt(obj.data.cantidad);
                }
            },this);
            if(record.data.tipo == 1)
                return val + " (" + totaltrab + ")";
            else
                return val;
        }
        //
        function setIndicador(val, metaData, record, rowIndex, colIndex, store){
            if(record.data.tipo == 2)
                return "<b>" + val + "</b>";
            else if(record.data.tipo == 3)
                return "&nbsp;&nbsp;&nbsp;&nbsp;" + val;
            else
                return val;

        }
        //
        function setCantidad(val, metaData, record, rowIndex, colIndex, store){
            if(record.data.tipo == 2)
                return "<center><b>" + val + "</b></center>";
            else
                return "<center>" + val + "</center>";
        }
        //Gridthis.tbar = ['Estructura organizativa:',this.tcbEstructuraOrganizativa, this.btnBuscar];
        self.gpResumenEst = new Ext.grid.GridPanel({
            tbar: ['Estructura organizativa:', this.tcbEstructuraOrganizativa, this.btnBuscar, this.btnLimpiar],
            id: 'gpResumenEst',
            store: self.stResumenEst,
            loadMask: {msg: 'Cargando...'},
            view: new Ext.grid.GroupingView({
                forceFit       : true,
                startCollapsed : false,
                groupTextTpl   : '{group}'
            }),
            columns: [
                {dataIndex: 'agrupador', hidden: true, renderer: setAgrupador},
                {dataIndex: 'indicador', header: 'Indicador', width:200, renderer: setIndicador},
                {dataIndex: 'cantidad', header: 'Cantidad', width:65, renderer: setCantidad}
            ]
        });

        self.items = [self.gpResumenEst];
        Pvd.MovimientosLaborales.Analisisft.Resumen.superclass.initComponent.call(this);
    }
});
