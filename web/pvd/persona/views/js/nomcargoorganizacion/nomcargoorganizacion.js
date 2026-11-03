/**
 * Nomenclador de la persona motivo organizacion
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomCargoOrganizacion');

PVD.Persona.NomCargoOrganizacion.Lang = {
    titleGrid: 'Listado de cargos en la organizaci&oacute;n',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar cargo en la organización',
    titleWindMod: 'Modificar cargo en la organización',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar cargo en la organización <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar cargo en la organización <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar cargo en la organización <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar cargo(s) en la organización <b>((Alt+B))</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) cargo(s) en la organización ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El cargo en la organización seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El cargo en la organización ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El cargo en la organización que quiere adicionar ya existe.',
    msgNotMod: 'El cargo en la organización ya existe.',
    msgMod: 'El cargo en la organización ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del cargo en la organización',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) cargo(s) en la organización seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el cargo en la organización seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los cargos en la organización seleccionados?',
    msgDelS: 'El cargo en la organización ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los cargos en la organización han sido eliminados satisfactoriamente.'
};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCargoOrganizacion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomCargoOrganizacion.Lang;
        this.referencia = 'nomcargoorganizacion';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idcargoorganizacion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomcargoorganizacion/getPositionInOrganization',
            add: '/pvd/persona/index.php/nomcargoorganizacion/addPositionInOrganization',
            mod: '/pvd/persona/index.php/nomcargoorganizacion/modPositionInOrganization',
            del: '/pvd/persona/index.php/nomcargoorganizacion/delPositionInOrganization',
            expt: '/pvd/persona/index.php/nomcargoorganizacion/showReport'
        };
        PVD.Persona.NomCargoOrganizacion.ViewGrid.superclass.initComponent.call(this);
    }
});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCargoOrganizacion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomcargoorganizacion/getPositionInOrganization',
    mapping: [
        {name: 'idcargoorganizacion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcargoorganizacion';
        this.displayField = 'denominacion';
        PVD.Persona.NomCargoOrganizacion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_cargoorganizacion', PVD.Persona.NomCargoOrganizacion.ViewCombo);




