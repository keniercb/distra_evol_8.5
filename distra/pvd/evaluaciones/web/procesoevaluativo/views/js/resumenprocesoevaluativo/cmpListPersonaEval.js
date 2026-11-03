Ext.ns("Pvd.Evaluaciones.Resumenprocesoevaluativo");

Pvd.Evaluaciones.Resumenprocesoevaluativo.ListadoPersonasEval = Ext.extend(Ext.Window, {
    title: 'Listado de Personas evaluadas',
    closeAction: 'hide',   
    maximizable: true,
    modal: true,
    layout:'fit',
    initComponent: function() {
        var self = this;

        this.stListPersonaEval = new Ext.data.Store({
            url: '/pvd/comun/index.php/resumenprocesoevaluativo/obtenerListadoPersonaEval',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cant",
                    root: "datos",
                    id: "ideval" },
                [
                    {name:  'idpersona'},
                    {name:  'nombreyapellidos'},
                    {name:  'fechaevaluado'},
                    {name:  'estado'},
                    {name:  'evaluacion'},
                ])
        });

        //Colunmodel del grid de cargos ocupados historico.
        this.cmListPersonaEval = [{
            header: 'Nombre y apellidos',
            width: 150,
            dataIndex: 'nombreyapellidos'
        },{
            header: 'Fecha evaluado',
            type: 'date',
            width: 60,
            dataIndex: 'fechaevaluado'
        },{
            header: 'Estado',
            width: 80,
            dataIndex: 'estado'
        },{
            header: 'Evaluaci&oacute;n',
            width: 80,
            dataIndex: 'evaluacion'
        }];

        this.ptbListPersonaEval = new Ext.PagingToolbar({
            pageSize: 15,
            store: this.stListPersonaEval,
            displayInfo: true
        });

        this.smListPersonaEval = new Ext.grid.RowSelectionModel({
            singleSelect: true
        })

        this.gpListPersonaEval = new Ext.grid.GridPanel({
            id:'idgpListPersonaEval',
            columns:  this.cmListPersonaEval,
            autoScroll:true,
            border: false,
            sm: this.smListPersonaEval,
            viewConfig: {
                forceFit: true
            },
            store: this.stListPersonaEval,
            iconCls: 'icon-grid',
            bbar: this.ptbListPersonaEval,
            loadMask:{
                store: this.stListPersonaEval
            }
        });

        this.items = [this.gpListPersonaEval];
        Pvd.Evaluaciones.Resumenprocesoevaluativo.ListadoPersonasEval.superclass.initComponent.call(this);
    }
})
