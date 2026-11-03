/**
 * Nomenclador de la persona motivo sancion
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomMotivoSancion');

PVD.Persona.NomMotivoSancion.Lang = {
    titleGrid: 'Listado de motivos de sanci&oacute;n',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar motivo de sanci&oacute;n',
    titleWindMod: 'Modificar motivo de sanci&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar motivo de sanci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar motivo de sanci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar motivo de sanci&oacute;n <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar motivo(s) de sanción <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) motivo(s) de sanci&oacute;n ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El motivo de sanci&oacute;n seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El motivo de sanci&oacute;n ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El motivo de sanci&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'El motivo de sanci&oacute;n ya existe.',
    msgMod: 'El motivo de sanci&oacute;n ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del motivo de sanci&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) motivo(s) de sanci&oacute;n seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el motivo de sanci&oacute;n seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los motivos de sanci&oacute;n seleccionados?',
    msgDelS: 'El motivo de sanci&oacute;n ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los motivos de sanci&oacute;n han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomMotivoSancion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomMotivoSancion.Lang;
        this.referencia = 'nommotivosancion';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idmotivosancion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nommotivosancion/getMotiveOfSanction',
            add: '/pvd/persona/index.php/nommotivosancion/addMotiveOfSanction',
            mod: '/pvd/persona/index.php/nommotivosancion/modMotiveOfSanction',
            del: '/pvd/persona/index.php/nommotivosancion/delMotiveOfSanction',
            expt: '/pvd/persona/index.php/nommotivosancion/showReport'
        };
        PVD.Persona.NomMotivoSancion.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomMotivoSancion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nommotivosancion/getMotiveOfSanction',
    mapping: [
        {name: 'idmotivosancion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idmotivosancion';
        this.displayField = 'denominacion';
        PVD.Persona.NomMotivoSancion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_motivosancion', PVD.Persona.NomMotivoSancion.ViewCombo);





