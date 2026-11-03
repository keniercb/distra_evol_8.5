function construirPreparacion(idTab)
{
		var panelGestion = new Nomenclador.Panel.Gestion({
				id               : idTab,
				title            : 'Preparación',
				name             : 'preparacion',
				clase            : 'preparacion',
				elemento         : 'preparación',
				idTipoNomenclador: 14,
				mensajeEvento    : 'la preparación seleccionada',
				mensajeCargando  : 'de la preparación',
				store            : new Ext.data.Store({
						url   : 'mostrarValores',
						remoteSort:true,
						reader: new Ext.data.JsonReader({
								root         : 'datos',
								totalProperty: 'cant'
						}, [
								{ name: 'id' },
								{ name: 'idpreparacion' },
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
								id       : 'denominacion',
								dataIndex: 'denominacion',
								header   : "Denominación",
								sortable : true,
								renderer :  Go.Column.Ttip.ToolTipColumn,
								width    : Go.Column.Config.Width('denominacioncargo')
						},
						{
								dataIndex: 'abreviatura',
								header   : 'Abreviatura',
								sortable : true,
								renderer :  Go.Column.Ttip.ToolTipColumn,
								width    : Go.Column.Config.Width('abreviatura')
						},
						{
								dataIndex: 'fechainicio',
								header   : 'Fecha inicio',
								sortable : true,
								renderer :  Go.Column.Ttip.ToolTipColumn,
								width    : Go.Column.Config.Width('abreviatura'),
								align    : 'center'
						},
						{
								dataIndex: 'fechafin',
								header   : 'Fecha fin',
								sortable : true,
								renderer :  Go.Column.Ttip.ToolTipColumn,
								width    : Go.Column.Config.Width('abreviatura'),
								align    : 'center'
						},
						{
								dataIndex: 'actual',
								header   : "Actual",
								sortable : false,
								renderer :Go.Column.Render.changeValor,
								width    : Go.Column.Config.Width('actual'),
								align    : 'center'
						},
						{
								dataIndex: 'visible',
								header   : "Visible",
								sortable : false,
								renderer :Go.Column.Render.changeValor,
								width    : Go.Column.Config.Width('visible'),
								align    : 'center'
						}
				]
		})
		return panelGestion;
}