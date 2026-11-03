function construirAgrupacionInterna(idTab)
{
		var panelGestion = new Nomenclador.Panel.Gestion({
				id               : idTab,
				title            : 'Agrupación interna',
				name             : 'agrupacioni',
				clase            : 'agrupacioni',
				elemento         : 'agrupación interna',
				idTipoNomenclador: 6,
				mensajeEvento    : 'la agrupación interna seleccionada',
				mensajeCargando  : 'de la agrupación interna',
				store            : new Ext.data.Store({
						remoteSort:true,
						url   : 'mostrarValores',
						reader: new Ext.data.JsonReader({
								root         : 'datos',
								totalProperty: 'cant'
						}, [
								{name: 'id'},
								{name: 'denominacion'},
								{name: 'abreviatura'},
								{name: 'actual'},
								{name: 'visible'},
								{name: 'denanterior', mapping: 'denominacion'},
								{name: 'idorgano'},
								{name: 'idagrupacion', mapping: 'idorgano'},
								{name: 'orden'},
								{name: 'fechainicio'},
								{name: 'fechafin'}
						])
				}),
				columns          : [
						{
								dataIndex: 'denominacion',
								renderer : Go.Column.Ttip.ToolTipColumn,
								sortable : true,
								header   : "Denominación",
								id       : 'denominacion',
								width    : Go.Column.Config.Width('denagrupaciones'),
								hidden   : false},
						{
								dataIndex: 'abreviatura',
								renderer : Go.Column.Ttip.ToolTipColumn,
								sortable : true,
								header   : "Abreviatura",
								width    : Go.Column.Config.Width('abreviatura'),
								id       : 'abrev',
								hidden   : false},
						{
								dataIndex: 'fechainicio',
								sortable : true,
								header   : "Fecha inicio",
								renderer : Go.Column.Ttip.ToolTipColumn,
								width    : Go.Column.Config.Width('abreviatura'),
								hidden   : false,
								align    : 'center'},
						{
								dataIndex: 'fechafin',
								sortable : true,
								header   : "Fecha fin",
								renderer : Go.Column.Ttip.ToolTipColumn,
								width    : Go.Column.Config.Width('abreviatura'),
								hidden   : false,
								align    : 'center'},
						{
								dataIndex: 'actual',
								sortable : true,
								header   : "Actual",
								renderer : Go.Column.Render.changeValor,
								width    : Go.Column.Config.Width('actual'),
								id       : 'actual',
								hidden   : false,
								align    : 'center'},
						{
								dataIndex: 'visible',
								sortable : false,
								header   : "Visible",
								renderer : Go.Column.Render.changeValor,
								width    : Go.Column.Config.Width('visible'),
								id       : 'visible',
								hidden   : false,
								align    : 'center'}
				]
		})
		return panelGestion;
}