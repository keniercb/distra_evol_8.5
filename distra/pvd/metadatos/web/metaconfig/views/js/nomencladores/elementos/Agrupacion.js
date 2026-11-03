//NOMENCLADOR DE AGRUPACION
function construirAgrupacion(idTab)
{
		var panelGestion = new Nomenclador.Panel.Gestion({
				id               : idTab,
				title            : 'Agrupación',
				name             : 'agrupacion',
				clase            : 'agrupacion',
				elemento         : 'agrupación',
				idTipoNomenclador: 2,
				mensajeEvento    : 'la agrupación seleccionada',
				mensajeCargando  : 'de la agrupación',
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
								{name: 'idorgano'},
								{name: 'idagrupacion', mapping: 'idorgano'},
								{name: 'idnomeav'},
								{name: 'denanterior', mapping: 'denominacion'},
								{name: 'orden'},
								{name: 'fechainicio'},
								{name: 'fechafin'}

						])
				}),
				columns          : [
						{
								dataIndex: 'denominacion',
								id       : 'denominacion',
								renderer : Go.Column.Ttip.ToolTipColumn,
								sortable : true,
								header   : "Denominación",
								fixed    : true,
								width    : Go.Column.Config.Width('denagrupaciones'),
								hidden   : false},
						{
								dataIndex: 'abreviatura',
								renderer : Go.Column.Ttip.ToolTipColumn,
								sortable : true,
								header   : "Abreviatura",
								fixed    : true,
								width    : Go.Column.Config.Width('abreviatura'),
								hidden   : false},
						{
								dataIndex: 'fechainicio',
								sortable : true,
								header   : "Fecha inicio",
								renderer : Go.Column.Ttip.ToolTipColumn,
								width    : Go.Column.Config.Width('abreviatura'),
								hidden   : false,
								fixed    : true,
								align    : 'center'},
						{
								dataIndex: 'fechafin',
								sortable : true,
								header   : "Fecha fin",
								renderer : Go.Column.Ttip.ToolTipColumn,
								width    : Go.Column.Config.Width('abreviatura'),
								hidden   : false,
								fixed    : true,
								align    : 'center'},
						{
								dataIndex: 'actual',
								sortable : false,
								header   : "Actual",
								renderer : Go.Column.Render.changeValor,
								width    : Go.Column.Config.Width('actual'),
								hidden   : false,
								fixed    : true,
								align    : 'center'},
						{
								dataIndex: 'visible',
								sortable : false,
								header   : "Visible",
								renderer : Go.Column.Render.changeValor,
								width    : Go.Column.Config.Width('visible'),
								hidden   : false,
								fixed    : true,
								align    : 'center'}
				]
		})
		return panelGestion;
}