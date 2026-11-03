/**
 * Nomenclador de la persona color pelo
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomColorPelo');
PVD.Persona.NomColorPelo.Lang = {
    titleGrid: 'Listado de colores de pelo',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar color de pelo',
    titleWindMod: 'Modificar color de pelo',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar color de pelo <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar color de pelo <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar color de pelo <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar color(es) de pelo <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) color(es) de los pelo ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El color de los pelo seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El color de pelo ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El color de pelo que quiere adicionar ya existe.',
    msgNotMod: 'El color de pelo ya existe.',
    msgMod: 'El color de pelo ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del color de pelo',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) color(es) de pelo seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el color de pelo seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los colores de pelo seleccionados?',
    msgDelS: 'El color de pelo ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los colores de pelo han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomColorPelo.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomColorPelo.Lang;
        this.referencia = 'nomcolorpelo';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idcolorpelo'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'},
            {name: 'gestion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomcolorpelo/getHairColor',
            add: '/pvd/persona/index.php/nomcolorpelo/addHaircolor',
            mod: '/pvd/persona/index.php/nomcolorpelo/modHaircolor',
            del: '/pvd/persona/index.php/nomcolorpelo/delHaircolor',
            expt: '/pvd/persona/index.php/nomcolorpelo/showReport'
        };

        PVD.Persona.NomColorPelo.ViewGrid.superclass.initComponent.call(this);

    }
});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomColorPelo.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomcolorpelo/getHairColor',
    mapping: [
        {name: 'idcolorpelo'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcolorpelo';
        this.displayField = 'denominacion';
        PVD.Persona.NomColorPelo.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_colorpelo', PVD.Persona.NomColorPelo.ViewCombo);