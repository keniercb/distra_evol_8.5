/**
 * Nomenclador de la persona Aptitud Física
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.Nomcargodefensa');

PVD.Persona.Nomcargodefensa.Lang = {
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar cargo en la defensa',
    titleWindMod: 'Modificar cargo en la adefensa',
    titleGrid: 'Listado de cargos en la defensa',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar cargo en la defensa <b>(Alt+I)</b>',

    ttBtnChange: 'Modificar cargo en la defensa <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar cargo en la defensa <b>(DEL)</b>',
    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar cargo(s) en la defensa <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(los) cargo(s) en la defensa ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El(los) cargo(s) en la defensa seleccionado(s) no se puede(n) eliminar debido a que está(n) en uso.',
    msgAdd: 'El cargo en la defensa ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El cargo en la defensa que quiere adicionar ya existe.',
    msgNotMod: 'El cargo en la defensa ya existe.',
    msgMod: 'El cargo en la defensa ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del cargo en la defensa',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) cargo(s) en la defensa  seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el cargo en la defensa seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los cargos en la defensa seleccionados?',
    msgDelS: 'El cargo en la defensa ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los  cargos en la defensa han sido eliminados satisfactoriamente.'
}

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.Nomcargodefensa.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.Nomcargodefensa.Lang;
        this.referencia = 'nomcargodefensa';
        this.mapping = [
            {name: 'idcargodefensa'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomcargodefensa/getCargoDefensa',
            add: '/pvd/persona/index.php/nomcargodefensa/addCargoDefensa',
            mod: '/pvd/persona/index.php/nomcargodefensa/modCargoDefensa',
            del: '/pvd/persona/index.php/nomcargodefensa/delCargoDefensa',
            expt: '/pvd/persona/index.php/nomcargodefensa/showReport'
        };
        this.title = this.lang.titleGrid;
        PVD.Persona.Nomcargodefensa.ViewGrid.superclass.initComponent.call(this);
    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.Nomcargodefensa.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomcargodefensa/getCargoDefensa',
    mapping: [
        {name: 'idcargodefensa'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcargodefensa';
        this.displayField = 'denominacion';
        this.name = 'idcargodefensa';
        this.hiddenName = 'idcargodefensa';
        PVD.Persona.Nomcargodefensa.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_cargodefensa', PVD.Persona.Nomcargodefensa.ViewCombo);