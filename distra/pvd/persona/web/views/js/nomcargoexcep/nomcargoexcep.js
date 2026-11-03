/**
 * Nomenclador de la persona  Cargo Situacion excepcional
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomCargoExcep');

PVD.Persona.NomCargoExcep.Lang = {

    /**
     * Títulos de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar cargo situaci&oacute;n excepcional',
    titleWindMod: 'Modificar cargo situaci&oacute;n excepcional',
    titleGrid: 'Listado de cargo de situaci&oacute;n excepcional',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar cargo de situaci&oacute;n excepcional <b>(Alt+I)</b>',

    ttBtnChange: 'Modificar cargo de situaci&oacute;n excepcional <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar cargo de situaci&oacute;n excepcional <b>(DEL)</b>',
    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar cargo de situaci&oacute;n excepcional <b>(Alt+B)</b>',
    /**
     * Mensajes de las acciones.
     */
    msgDel: 'El cargo de la situaci&oacute;n excepcional se ha eliminado satisfactoriamente.',
    msgNotDel: 'El cargo de la situaci&oacute;n excepcional no se puede eliminar debido a que está en uso.',
    msgAdd: 'El cargo de la situaci&oacute;n excepcional ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'El cargo de la situaci&oacute;n excepcional que quiere adicionar ya existe.',
    msgNotMod: 'El cargo de la situaci&oacute;n excepcional ya existe.',
    msgMod: 'El cargo de la situaci&oacute;n excepcional ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del cargo de la situaci&oacute;n excepcional',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el cargo de la situaci&oacute;n excepcional seleccionado?',


    msgAskDelS: '¿Está seguro que quiere eliminar el cargo de la situaci&oacute;n excepcional seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los cargos de las situaciones excepcionales?',
    msgDelS: 'El cargo de la situaci&oacute;n excepcional ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los cargos de las situaciones excepcionales han sido eliminados satisfactoriamente.'

}

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCargoExcep.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomCargoExcep.Lang;

        this.referencia = 'nomcargoexcep';
        this.mapping = [
            {name: 'idcargoexcep'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomcargoexcep/getCargoExcep',
            add: '/pvd/persona/index.php/nomcargoexcep/addCargoExcep',
            mod: '/pvd/persona/index.php/nomcargoexcep/modCargoExcep',
            del: '/pvd/persona/index.php/nomcargoexcep/delCargoExcep',
            expt: '/pvd/persona/index.php/nomcargoexcep/showReport'
        };
        this.title = this.lang.titleGrid;
        PVD.Persona.NomCargoExcep.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCargoExcep.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomcargoexcep/getCargoExcep',
    mapping: [
        {name: 'idcargoexcep'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcargoexcep';
        this.displayField = 'denominacion';
        this.name = 'idcargoexcep';
        this.hiddenName = 'idcargoexcep';
        PVD.Persona.NomCargoExcep.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_cargoexcep', PVD.Persona.NomCargoExcep.ViewCombo);
