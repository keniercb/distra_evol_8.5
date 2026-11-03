Ext.ns('Pvd.ControlAsistencia.ParteDiario');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.ParteDiario.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        
        this.stListado = new Ext.data.GroupingStore({
            url: 'getReporteNominal',
            reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name:'idasistencia'},{name:'idpersona'},{name:'nombreapellidos'},
                    {name:'denomentidad'},{name:'denomcargo'},
                    {name: 'fecharegistro'},{name:'causa'},{name:'idcausa'},{name:'gradocategoriallamado'},{name:'observacion'}]
            ),
            sortInfo:{field: 'denomentidad', direction: "ASC"},
            groupField:'denomentidad'
        });

        this.recQrElement = new Ext.data.Record.create(
            {name:'idasistencia'},{name:'idpersona'},{name:'nombreapellidos'},
            {name:'denomentidad'},{name:'denomcargo'},
            {name: 'fecharegistro'},{name:'causa'},{name:'idcausa'},{name:'gradocategoriallamado'},{name:'observacion'}
        );

        this.storeCausaasistencia = new Ext.tree.TreeLoader({
            url: 'cargacausasausencia'
        });

        this.storeCausasAusencia = new Ext.data.JsonStore({
            root: 'datos',
            fields:['idcausa','denominacion']
        });

        this.storeTurnoTrabajo = new Ext.data.JsonStore({
            root: 'datos',
            fields:['idturnotrabajo','denominacion']
        });

        this.TreePanelLoader = new Ext.tree.TreeLoader({
            dataUrl:'/pvd/regimentrabajo/index.php/partediario/cargacausasausencia',
            preloadChildren:true
        });
    }

};
