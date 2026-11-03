/**
 * Nomenclador de la persona motivo tipo organizacion
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoOrganizacion');

PVD.Persona.NomTipoOrganizacion.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de tipos de organizaci&oacute;n',
    /**
     * Títulos de los componentes del formulario
     */
    tfDenomination: 'Denominación',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de organizaci&oacute;n',
    titleWindMod: 'Modificar tipo de organizaci&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de organizaci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de organizaci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de organizaci&oacute;n <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt + L)</b>',
    ttBuscar:'Buscar tipo(s) de organización <b>(Alt + B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de organizaci&oacute;n(es) se ha(n) sido eliminado(s) satisfactoriamente',
    msgNotDel: 'El tipo de organizaci&oacute;n seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de organizaci&oacute;n ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de organizaci&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de organizaci&oacute;n ya existe.',
    msgMod: 'El tipo de organizaci&oacute;n ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de organizaci&oacute;n seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de organizaci&oacute;n seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de organizaci&oacute;nes seleccionadas?',
    msgDelS: 'El tipo de organizaci&oacute;n se ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los tipos de organizaci&oacute;nes se han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoOrganizacion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function ()
    {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomTipoOrganizacion.Lang;
        this.referencia = 'nomtipoorganizacion';
        this.mapping = [
            {name: 'idtipoorganizacion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomtipoorganizacion/getTypeOfOrganization',
            add: '/pvd/persona/index.php/nomtipoorganizacion/addTypeOfOrganization',
            mod: '/pvd/persona/index.php/nomtipoorganizacion/modTypeOfOrganization',
            del: '/pvd/persona/index.php/nomtipoorganizacion/delTypeOfOrganization',
            expt: '/pvd/persona/index.php/nomtipoorganizacion/showReport'
        };
        PVD.Persona.NomTipoOrganizacion.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoOrganizacion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipoorganizacion/getTypeOfOrganization',
    mapping: [
        {name: 'idtipoorganizacion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function ()
    {
        this.valueField = 'idtipoorganizacion';
        this.displayField = 'denominacion';
        PVD.Persona.NomTipoOrganizacion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipoorganizacion', PVD.Persona.NomTipoOrganizacion.ViewCombo);





