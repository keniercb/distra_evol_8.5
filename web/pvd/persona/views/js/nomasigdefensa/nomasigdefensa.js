/**
 * Nomenclador de la persona Asignacion defensa
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomAsigDefensa');
//alert('sgfdh');
PVD.Persona.NomAsigDefensa.Lang = {
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar asignaci&oacute;n en la defensa',
    titleWindMod: 'Modificar asignaci&oacute;n en la defensa',
    titleGrid: 'Listado de asignaci&oacute;n en la defensa',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar aptitud f&iacute;sica <b>(Alt+I)</b>',

    ttBtnChange: 'Modificar asignaci&oacute;n en la defensa <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar asignaci&oacute;n en la defensa <b>(DEL)</b>',
    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar asignaci&oacute;n(nes) en la defensa <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) asignaci&oacute;n(nes) en la defensa ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La(s) asignaci&oacute;n(nes) en la defensa seleccionada(s) no se puede(n) eliminar debido a que está(n) en uso.',
    msgAdd: 'La  asignaci&oacute;n en la defensa ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La  asignaci&oacute;n en la defensa que quiere adicionar ya existe.',
    msgNotMod: 'La  asignaci&oacute;n en la defensa ya existe.',
    msgMod: 'La  asignaci&oacute;n en la defensa ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de asignaci&oacute;n en la defensa',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) asignaci&oacute;n(nes) en la defensa seleccionada(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar la  asignaci&oacute;n en la defensa seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las  asignaciones en la defensa seleccionadas?',
    msgDelS: 'La  asignaci&oacute;n en la defensa ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las  asignaciones en la defensa han sido eliminadas satisfactoriamente.'
}

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomAsigDefensa.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomAsigDefensa.Lang;
        this.referencia = 'nomasigdefensa';
        this.mapping = [
            {name: 'idasignaciondefensa'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomasigdefensa/getAsiganacionDefensa',
            add: '/pvd/persona/index.php/nomasigdefensa/addAsiganacionDefensa',
            mod: '/pvd/persona/index.php/nomasigdefensa/modAsiganacionDefensa',
            del: '/pvd/persona/index.php/nomasigdefensa/delAsiganacionDefensa',
            expt: '/pvd/persona/index.php/nomasigdefensa/showReport'
        };
        this.title = this.lang.titleGrid;
        PVD.Persona.NomAsigDefensa.ViewGrid.superclass.initComponent.call(this);
    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomAsigDefensa.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomasigdefensa/getAsiganacionDefensa',
    mapping: [
        {name: 'idasignaciondefensa'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idasignaciondefensa';
        this.displayField = 'denominacion';
        this.name = 'idasignaciondefensa';
        this.hiddenName = 'idasignaciondefensa';
        PVD.Persona.NomAsigDefensa.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_asigdefensa', PVD.Persona.NomAsigDefensa.ViewCombo);