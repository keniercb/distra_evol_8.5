/**
 * Nomenclador de la persona color piel
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomColorPiel');
PVD.Persona.NomColorPiel.Lang = {
    titleGrid: 'Listado de colores de piel',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar color de piel',
    titleWindMod: 'Modificar color de piel',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar color de piel <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar color de piel <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar color de piel <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar color(es) de piel <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) color(es) de piel ha(n) sido eliminado(s) satisfactoriamente',
    msgNotDel: 'El color de piel seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El color de piel ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El color de piel que quiere adicionar ya existe.',
    msgNotMod: 'El color de piel ya existe.',
    msgMod: 'El color de piel ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del color de piel',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) color(es) de piel seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el color de piel seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los colores de piel seleccionados?',
    msgDelS: 'El color de piel ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los colores de piel han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomColorPiel.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomColorPiel.Lang;
        this.referencia = 'nomcolorpiel';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idcolorpiel'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'},
            {name: 'gestion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomcolorpiel/getSkinColor',
            add: '/pvd/persona/index.php/nomcolorpiel/addSkincolor',
            mod: '/pvd/persona/index.php/nomcolorpiel/modSkincolor',
            del: '/pvd/persona/index.php/nomcolorpiel/delSkincolor',
            expt: '/pvd/persona/index.php/nomcolorpiel/showReport'
        };

        PVD.Persona.NomColorPiel.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomColorPiel.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomcolorpiel/getSkinColor',
    mapping: [
        {name: 'idcolorpiel'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcolorpiel';
        this.displayField = 'denominacion';
        PVD.Persona.NomColorPiel.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_colorpiel', PVD.Persona.NomColorPiel.ViewCombo);




