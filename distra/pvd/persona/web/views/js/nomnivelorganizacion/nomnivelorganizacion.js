/**
 * Nomenclador de la persona nivel organizacion
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomNivelOrganizacion');
PVD.Persona.NomNivelOrganizacion.Lang = {
    titleGrid: 'Listado de niveles en la organizaci&oacute;n',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar nivel en la organizaci&oacute;n',
    titleWindMod: 'Modificar nivel en la organizaci&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar nivel en la organizaci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar nivel en la organizaci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar nivel en la organizaci&oacute;n <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar nivel(es) de la organización <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) nivel(es) de la organizaci&oacute;n ha(n) sido eliminado(s) satisfactoriamente',
    msgNotDel: 'El nivel de la organizaci&oacute;n seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El nivel de la organizaci&oacute;n ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El nivel de la organizaci&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'El nivel de la organizaci&oacute;n ya existe.',
    msgMod: 'El nivel de la organizaci&oacute;n ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del nivel de la organizaci&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) nivel(es) de la organizaci&oacute;n seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el nivel en la organizaci&oacute;n seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los niveles en la organizaci&oacute;n seleccionados?',
    msgDelS: 'El nivel de la organizaci&oacute;n ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los niveles de la organizaci&oacute;n han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomNivelOrganizacion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomNivelOrganizacion.Lang;
        this.referencia = 'nomnivelorganizacion';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idnivelorganizacion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomnivelorganizacion/getLevelInOrganization',
            add: '/pvd/persona/index.php/nomnivelorganizacion/addLevelInOrganization',
            mod: '/pvd/persona/index.php/nomnivelorganizacion/modLevelInOrganization',
            del: '/pvd/persona/index.php/nomnivelorganizacion/delLevelInOrganization',
            expt: '/pvd/persona/index.php/nomnivelorganizacion/showReport'
        };
        PVD.Persona.NomNivelOrganizacion.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomNivelOrganizacion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomnivelorganizacion/getLevelInOrganization',
    mapping: [
        {name: 'idnivelorganizacion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idnivelorganizacion';
        this.displayField = 'denominacion';
        PVD.Persona.NomNivelOrganizacion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_nivelorganizacion', PVD.Persona.NomNivelOrganizacion.ViewCombo);





