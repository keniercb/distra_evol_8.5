/**
 * Nomenclador de la persona Tipo de estancia en el exterior
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoEstanciaExterior');

PVD.Persona.NomTipoEstanciaExterior.Lang = {
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de estancia en el exterior',
    titleWindMod: 'Modificar tipo de estancia en el exterior',
    titleGrid: 'Listado de tipos de estancias en el exterior',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de estancia en el exterior <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de estancia en el exterior <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de estancia en el exterior <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar tipo(s) de estancia(s) en el exterior <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de estancia(s) en el exterior ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El(Los) tipo(s) de estancia en el exterior seleccionado(s) no se puede(n) eliminar debido a que está(n) en uso.',
    msgAdd: 'El tipo de estancia en el exterior ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de estancia en el exterior que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de estancia en el exterior ya existe.',
    msgMod: 'El tipo de estancia en el exterior ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del tipo de estancia en el exterior',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de estancia(s) en el exterior seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de estancia en el exterior seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de estancias en el exterior seleccionados?',
    msgDelS: 'El tipo de estancia en el exterior ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los tipos de estancias en el exterior han sido eliminados satisfactoriamente.'
}

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoEstanciaExterior.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomTipoEstanciaExterior.Lang;
        this.referencia = 'nomtipoestanciaexterior';
        this.mapping = [
            {name: 'idtipoestanciaexterior'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomtipoestanciaexterior/getTiposEstanciaExterior',
            add: '/pvd/persona/index.php/nomtipoestanciaexterior/addTipoEstanciaExterior',
            mod: '/pvd/persona/index.php/nomtipoestanciaexterior/modTipoEstanciaExterior',
            del: '/pvd/persona/index.php/nomtipoestanciaexterior/delTipoEstanciaExterior',
            expt: '/pvd/persona/index.php/nomtipoestanciaexterior/showReport'
        };
        this.title = this.lang.titleGrid;
        PVD.Persona.NomTipoEstanciaExterior.ViewGrid.superclass.initComponent.call(this);
    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoEstanciaExterior.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipoestanciaexterior/getTiposEstanciaExterior',
    mapping: [
        {name: 'idtipoestanciaexterior'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idtipoestanciaexterior';
        this.displayField = 'denominacion';
        this.name = 'idtipoestanciaexterior';
        this.hiddenName = 'idtipoestanciaexterior';
        PVD.Persona.NomTipoEstanciaExterior.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipoestanciaexterior', PVD.Persona.NomTipoEstanciaExterior.ViewCombo);
