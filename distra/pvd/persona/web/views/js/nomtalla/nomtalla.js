/**
 * Nomenclador de la persona Size
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTalla');
PVD.Persona.NomTalla.Lang = {
    titleGrid: 'Listado de tallas',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar talla',
    titleWindMod: 'Modificar talla',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar talla <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar talla <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar talla <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar talla(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) talla(s) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La talla seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La talla ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La talla que quiere adicionar ya existe.',
    msgNotMod: 'La talla ya existe.',
    msgMod: 'La talla ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la talla',
    msgSendServer: 'Enviando datos al servidor.',

    msgAskDelS: '¿Está seguro que quiere eliminar la talla seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las tallas seleccionadas?',
    msgDelS: 'La talla ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las tallas han sido eliminadas satisfactoriamente.'

};


/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTalla.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        this.lang = PVD.Persona.NomTalla.Lang;
        this.referencia = 'nomtalla';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idtalla'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomtalla/getSize',
            add: '/pvd/persona/index.php/nomtalla/addSize',
            mod: '/pvd/persona/index.php/nomtalla/modSize',
            del: '/pvd/persona/index.php/nomtalla/delSize',
            expt: '/pvd/persona/index.php/nomtalla/showReport'
        };
        PVD.Persona.NomTalla.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTalla.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtalla/getTalla',
    mapping: [
        {name: 'idtalla'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'},
        {name: 'idprenda'}
    ],
    initComponent: function () {
        this.valueField = 'idtalla';
        this.displayField = 'denominacion';
        this.hiddenName = 'idtalla';
        PVD.Persona.NomTalla.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_talla', PVD.Persona.NomTalla.ViewCombo);

