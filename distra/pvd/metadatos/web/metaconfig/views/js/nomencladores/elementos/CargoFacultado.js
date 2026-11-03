function construirCargoFacultado(idTab) {
    var panelGestion = new Nomenclador.Panel.Gestion({
        id               : idTab,
        title            : 'Cargo facultado',
        name             : 'cargofacultado',
        clase            : 'cargofacultado',
        elemento         : 'cargo facultado',
        idTipoNomenclador: 26,
        mensajeEvento    : 'el cargo facultado seleccionado',
        mensajeCargando  : 'del cargo facultado',

        store  : new Ext.data.Store({
            url       : 'mostrarValores',
            remoteSort: true,
            reader    : new Ext.data.JsonReader({
                root         : 'datos',
                totalProperty: 'cant'
            }, [
                {name: 'id'},
                {name: 'idcargofacultado'},
                {name: 'denominacion'},
                {name: 'abreviatura'},
                {name: 'orden'},
                {name: 'actual'},
                {name: 'visible'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'denanterior', mapping: 'denominacion'}
            ])
        }),
        columns: [

            {
                id       : 'denominacion',
                dataIndex: 'denominacion',
                header   : "Denominación",
                sortable : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('denagrupaciones')
            },
            {
                dataIndex: 'abreviatura',
                header   : 'Abreviatura',
                sortable : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('abreviatura')
            },
            {
                dataIndex: 'fechainicio',
                header   : 'Fecha inicio',
                sortable : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('abreviatura'),
                align    : 'center'
            },
            {
                dataIndex: 'fechafin',
                header   : 'Fecha fin',
                sortable : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('abreviatura'),
                align    : 'center'
            },
            {
                dataIndex: 'actual',
                header   : "Actual",
                sortable : false,
                renderer : Go.Column.Render.changeValor,
                width    : Go.Column.Config.Width('actual'),
                align    : 'center'
            },
            {
                dataIndex: 'visible',
                header   : "Visible",
                sortable : false,
                renderer : Go.Column.Render.changeValor,
                width    : Go.Column.Config.Width('visible'),
                align    : 'center'
            }
        ]
    })

    return panelGestion;
}