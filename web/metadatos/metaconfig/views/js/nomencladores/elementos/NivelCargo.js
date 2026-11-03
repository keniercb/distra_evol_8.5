//NOMENCLADOR DE SECTOR
function construirNivelcargo(idTab) {
    var panelGestion = new Nomenclador.Panel.Gestion({
        id: idTab,
        idTipoNomenclador: 25,
        title: 'Nivel del cargo',
        name: 'nivelcargo',
        clase: 'nivelcargo',
        elemento: 'nivel del cargo',
        mensajeEvento: 'el nivel del cargo seleccionado',
        mensajeCargando: 'del nivel del cargo',
        store: new Ext.data.Store({
            url: 'mostrarValores',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant'
            }, [
                {name: 'id'},
                {name: 'idnivelcargo'},
                {name: 'denominacion'},
                {name: 'abreviatura'},
                {name: 'actual'},
                {name: 'visible'},
                {name: 'denanterior', mapping: 'denominacion'},
                {name: 'orden'}
            ])
        }),
        columns: [
            {
                dataIndex: 'idnivelcargo',
                sortable: true,
                header: "Código",
                renderer: convertCod,
                width: configuracion('codigo'),
                hidden: true
            },
            {
                dataIndex: 'denominacion',
                id: 'denominacion',
                renderer: crearToolTip,
                sortable: true,
                header: "Denominación",
                width: configuracion('denagrupaciones'),
                hidden: false
            },
            {
                dataIndex: 'abreviatura',
                renderer: crearToolTip,
                sortable: true,
                header: "Abreviatura",
                width: configuracion('abreviatura'),
                hidden: false
            },
            {
                dataIndex: 'actual',
                sortable: true,
                header: "Actual",
                renderer: changeValor,
                width: configuracion('actual'),
                hidden: false,
                align: 'center'
            },
            {
                dataIndex: 'visible',
                sortable: true,
                header: "Visible",
                renderer: changeValor,
                width: configuracion('visible'),
                hidden: false,
                align: 'center'
            }
        ]
    })
    return panelGestion;
}
