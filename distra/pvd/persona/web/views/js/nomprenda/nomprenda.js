/**
 * Nomenclador de la persona Wear
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomPrenda');
PVD.Persona.NomPrenda.Lang = {
    titleGrid: 'Listado de prendas',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar prenda',
    titleWindMod: 'Modificar prenda',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar prenda <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar prenda <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar prenda <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar prenda(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) prenda(s) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La prenda seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La prenda ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La prenda que quiere adicionar ya existe.',
    msgNotMod: 'La prenda ya existe.',
    msgMod: 'La prenda ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la prenda',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) prenda(s) seleccionada(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar la prenda seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar la prendas seleccionadas?',
    msgDelS: 'La prenda ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las prendas han sido eliminadas satisfactoriamente.'

};


/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomPrenda.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        this.lang = PVD.Persona.NomPrenda.Lang;
        this.referencia = 'nomprenda';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idprenda'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomprenda/getWear',
            add: '/pvd/persona/index.php/nomprenda/addWear',
            mod: '/pvd/persona/index.php/nomprenda/modWear',
            del: '/pvd/persona/index.php/nomprenda/delWear',
            expt: '/pvd/persona/index.php/nomprenda/showReport'
        };
        PVD.Persona.NomPrenda.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomPrenda.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomprenda/getWear',
    mapping: [
        {name: 'idprenda'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idprenda';
        this.displayField = 'denominacion';
        this.hiddenName = 'idprenda';
        PVD.Persona.NomPrenda.ViewCombo.superclass.initComponent.call(this);
    },
    listeners: {
        select: function (cmb, rec, numb) {
        }
    }
});
Ext.reg('combo_prenda', PVD.Persona.NomPrenda.ViewCombo);

