/**
 * Nomenclador de la persona color ojos
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomColorOjos');
PVD.Persona.NomColorOjos.Lang = {
    titleGrid: 'Listado de colores de ojos',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar color de ojos',
    titleWindMod: 'Modificar color de ojos',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar color de ojos <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar color de ojos <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar color de ojos <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar color(es) de ojos <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) color(es) de ojos ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El color de los ojos seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El color de ojos ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El color de ojos que quiere adicionar ya existe.',
    msgNotMod: 'El color de ojos ya existe.',
    msgMod: 'El color de ojos ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del color de ojos',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) color(es) de ojos seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el color de ojos seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los colores de ojos seleccionados?',
    msgDelS: 'El colores de ojos ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los colores de ojos han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomColorOjos.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomColorOjos.Lang;
        this.referencia = 'nomcolorojos';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idcolorojos'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'},
            {name: 'gestion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomcolorojos/getColorEyes',
            add: '/pvd/persona/index.php/nomcolorojos/addEyecolor',
            mod: '/pvd/persona/index.php/nomcolorojos/modEyecolor',
            del: '/pvd/persona/index.php/nomcolorojos/delEyecolor',
            expt: '/pvd/persona/index.php/nomcolorojos/showReport'
        };
        PVD.Persona.NomColorOjos.ViewGrid.superclass.initComponent.call(this);

    }
});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomColorOjos.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomcolorojos/getColorEyes',
    mapping: [
        {name: 'idcolorojos'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcolorojos';
        this.displayField = 'denominacion';
        PVD.Persona.NomColorOjos.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_colorojos', PVD.Persona.NomColorOjos.ViewCombo);