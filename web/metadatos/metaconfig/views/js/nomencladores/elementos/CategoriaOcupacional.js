function construirCategoriaOcupacional(idTab)
{
    var panelGestion = new Nomenclador.Panel.Gestion({
        id               : idTab,
        title            : 'Subcategoría ocupacional',
        name             : 'categoria',
        clase            : 'categoria',
        elemento         : 'categoría ocupacional',
        idTipoNomenclador: 10,
        mensajeEvento    : 'la categoría ocupacional seleccionada',
        mensajeCargando  : 'de la categoría ocupacional',
        store            : new Ext.data.GroupingStore({
            url       : 'mostrarValores',
            remoteSort: true,
            groupField: 'categoria',
            sortInfo  : {field: 'orden', direction: "ASC"},
            reader    : new Ext.data.JsonReader({
                root         : 'datos',
                totalProperty: 'cant'
            }, [
                { name: 'id' },
                { name: 'idcategoria' },
                { name: 'idcategocup' },
                { name: 'categoria' },
                { name: 'denominacion' },
                { name: 'abreviatura' },
                { name: 'orden' },
                { name: 'actual' },
                { name: 'visible' },
                { name: 'fechainicio' },
                { name: 'fechafin' },
                { name: 'denanterior', mapping: 'denominacion'}
            ])
        }),
        columns          : [
            {
                id       : 'categoria',
                dataIndex: 'categoria',
                header   : "Categoría",
                sortable : true,
                hidden   : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('denominacioncargo')
            },
            {
                id       : 'denominacion',
                dataIndex: 'denominacion',
                header   : "Denominación",
                sortable : true,
                renderer : Go.Column.Ttip.ToolTipColumn,
                width    : Go.Column.Config.Width('denominacioncargo')
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