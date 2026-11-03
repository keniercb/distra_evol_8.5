//NOMENCLADOR DE SECTOR
function construirSector(idTab) {
    var panelGestion = new Nomenclador.Panel.Gestion({
        id: idTab,
        idTipoNomenclador: 23,
        title: 'Sector',
        name: 'sector',
        clase: 'sector',
        elemento: 'sector',
        mensajeEvento: 'el sector seleccionado',
        mensajeCargando: 'del sector',
        store: new Ext.data.Store({
            url: 'mostrarValores',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant'
            }, [
                {name: 'id'},
                {name: 'idsector'},
                {name: 'denominacion'},
                {name: 'abreviatura'},
                {name: 'actual'},
                {name: 'visible'},
                {name: 'idnomeav'},
                {name: 'denanterior', mapping: 'denominacion'},
                {name: 'orden'}
            ])
        }),
        columns: [
            {
                dataIndex: 'idsector',
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
