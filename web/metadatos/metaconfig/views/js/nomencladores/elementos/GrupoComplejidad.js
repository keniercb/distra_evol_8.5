//NOMENCLADOR DE Grupo de Complejidad
function construirGrupoComplejidad(idTab)
{
		var panelGestion = new Nomenclador.Panel.Gestion({
				id               : idTab,
				title            : 'Grupo de escala',
				name             : 'grupo',
				clase            : 'grupo',
				elemento         : 'grupo de escala',
				idTipoNomenclador: 13,
				mensajeEvento    : 'el grupo de escala seleccionado',
				mensajeCargando  : 'del grupo de escala',
				store            : new Ext.data.Store({
						url   : 'mostrarValores',
						remoteSort:true,
						reader: new Ext.data.JsonReader({
								root         : 'datos',
								totalProperty: 'cant'
						}, [
								{name: 'denominacion'},
								{name: 'id'},
								{name: 'idgrupocomplejidad'},
								{name: 'abreviatura'},
								{name: 'orden'    },
								{name: 'actual'},
								{name: 'visible'},
								{name: 'fechainicio'},
								{name: 'fechafin'},
								{name: 'denanterior', mapping: 'denominacion'}
						])
				}),
				columns          : [
						{dataIndex: 'idgrupocomplejidad', sortable: true, header: "Código", renderer: Go.Util.convertCod, width: Go.Column.Config.Width('codigo'), hidden: true},
						{dataIndex: 'denominacion', id: 'denominacion', renderer:  Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Denominación", width: Go.Column.Config.Width('denagrupaciones'), hidden: false},
						{dataIndex: 'abreviatura', renderer:  Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Abreviatura", width: Go.Column.Config.Width('abreviatura'), hidden: false},
						{dataIndex: 'fechainicio', renderer:  Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Fecha inicio", width: Go.Column.Config.Width('abreviatura'), hidden: false,align : 'center'},
						{dataIndex: 'fechafin', renderer:  Go.Column.Ttip.ToolTipColumn, sortable: true, header: "Fecha fin", width: Go.Column.Config.Width('abreviatura'), hidden: false,align : 'center'},
						{dataIndex: 'actual', sortable: false, header: "Actual", renderer:Go.Column.Render.changeValor, width: Go.Column.Config.Width('actual'), hidden: false, align: 'center'},
						{dataIndex: 'visible', sortable: false, header: "Visible", renderer:Go.Column.Render.changeValor, width: Go.Column.Config.Width('visible'), hidden: false, align: 'center'}
				]
		})
		return panelGestion;
}