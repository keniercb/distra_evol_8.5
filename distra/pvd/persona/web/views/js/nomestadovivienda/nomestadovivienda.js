

Ext.ns('PVD.Persona.NomEstadoVivienda');
PVD.Persona.NomEstadoVivienda.Lang = {
    titleGrid: 'Listado de estados de vivienda',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar estado de vivienda',
    titleWindMod: 'Modificar estado de vivienda',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar estado de vivienda <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar estado de vivienda <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar estado de vivienda <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar estado(s) de vivienda <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'Lo(s) estado(s) de vivienda ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El estado de vivienda seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El estado de vivienda ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El estado de vivienda que quiere adicionar ya existe.',
    msgNotMod: 'El estado de vivienda ya existe.',
    msgMod: 'El estado de vivienda ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la estado de vivienda',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que desea eliminar el estado de vivienda seleccionado?',


    msgAskDelS: '¿Está seguro que quiere eliminar el estado de vivienda seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los estados de vivienda seleccionados?',
    msgDelS: 'El estado de vivienda seleccionado ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los estados de vivienda seleccionados han sido eliminados satisfactoriamente.'
};

PVD.Persona.NomEstadoVivienda.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        this.lang = PVD.Persona.NomEstadoVivienda.Lang;
        this.referencia = 'nomestadovivienda';
        //this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idestadovivienda'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomestadovivienda/getEstadoVivienda',
            add: '/pvd/persona/index.php/nomestadovivienda/addEstadoVivienda',
            mod: '/pvd/persona/index.php/nomestadovivienda/modEstadoVivienda',
            del: '/pvd/persona/index.php/nomestadovivienda/delEstadoVivienda',
            expt: '/pvd/persona/index.php/nomestadovivienda/showReport'
        };
        PVD.Persona.NomEstadoVivienda.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomEstadoVivienda.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomestadovivienda/getEstadoVivienda',
    mapping: [
        {name: 'idestadovivienda'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idestadovivienda';
        this.displayField = 'denominacion';
        this.hiddenName = 'idestadovivienda';
        PVD.Persona.NomEstadoVivienda.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_estadovivienda', PVD.Persona.NomEstadoVivienda.ViewCombo);