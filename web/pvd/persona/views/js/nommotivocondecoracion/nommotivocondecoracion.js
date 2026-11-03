/**
 * Nomenclador de la persona motivo condecoracion
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomMotivoCondecoracion');

PVD.Persona.NomMotivoCondecoracion.Lang = {
    titleGrid: 'Listado de motivos de condecoraci&oacute;n',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar motivo de condecoraci&oacute;n',
    titleWindMod: 'Modificar motivo de condecoraci&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar motivo de condecoraci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar motivo de condecoraci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar motivo de condecoraci&oacute;n <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar motivo(s) de condecoración <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) motivo(s) de condecoraci&oacute;n ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El motivo de condecoraci&oacute;n seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El motivo de condecoraci&oacute;n ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El motivo de condecoraci&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'El motivo de condecoraci&oacute;n ya existe.',
    msgMod: 'El motivo de condecoraci&oacute;n ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del motivo de condecoraci&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) motivo(s) de condecoraci&oacute;n seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el motivo de condecoraci&oacute;n seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los motivos de condecoraci&oacute;n seleccionados?',
    msgDelS: 'El motivo de condecoraci&oacute;n ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los motivos de condecoraci&oacute;n han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomMotivoCondecoracion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomMotivoCondecoracion.Lang;
        this.referencia = 'nommotivocondecoracion';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idmotivocondecoracion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nommotivocondecoracion/getMotiveOfDecoration',
            add: '/pvd/persona/index.php/nommotivocondecoracion/addMotiveOfDecoration',
            mod: '/pvd/persona/index.php/nommotivocondecoracion/modMotiveOfDecoration',
            del: '/pvd/persona/index.php/nommotivocondecoracion/delMotiveOfDecoration',
            expt: '/pvd/persona/index.php/nommotivocondecoracion/showReport'
        };
        PVD.Persona.NomMotivoCondecoracion.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomMotivoCondecoracion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nommotivocondecoracion/getMotiveOfDecoration',
    mapping: [
        {name: 'idmotivocondecoracion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idmotivocondecoracion';
        this.displayField = 'denominacion';
        PVD.Persona.NomMotivoCondecoracion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_motivocondecoracion', PVD.Persona.NomMotivoCondecoracion.ViewCombo);





