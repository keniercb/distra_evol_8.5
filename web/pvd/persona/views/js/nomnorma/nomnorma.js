/**
 * Nomenclador de la persona Norm
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomNorma');
PVD.Persona.NomNorma.Lang = {
    titleGrid: 'Listado de normas',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar norma',
    titleWindMod: 'Modificar norma',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar norma <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar norma <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar norma <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar norma(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) norma(s) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La norma seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La norma ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La norma que quiere adicionar ya existe.',
    msgNotMod: 'La norma ya existe.',
    msgMod: 'La norma ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la norma',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) norma(s) seleccionada(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar la norma seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las normas seleccionadas?',
    msgDelS: 'La norma ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las normas han sido eliminadas satisfactoriamente.'

};


/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomNorma.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        this.lang = PVD.Persona.NomNorma.Lang;
        this.referencia = 'nomnorma';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idnorma'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomnorma/getNorm',
            add: '/pvd/persona/index.php/nomnorma/addNorm',
            mod: '/pvd/persona/index.php/nomnorma/modNorm',
            del: '/pvd/persona/index.php/nomnorma/delNorm',
            expt: '/pvd/persona/index.php/nomnorma/showReport'
        };
        PVD.Persona.NomNorma.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomNorma.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomnorma/getNorm',
    mapping: [
        {name: 'idnorma'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'},
        {name: 'idprenda'}
    ],
    initComponent: function () {
        this.valueField = 'idnorma';
        this.displayField = 'denominacion';
        this.hiddenName = 'idnorma';
        PVD.Persona.NomNorma.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_norma', PVD.Persona.NomNorma.ViewCombo);

