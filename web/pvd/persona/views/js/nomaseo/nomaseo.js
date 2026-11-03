/**
 * Nomenclador de la persona Aseo
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomAseo');

PVD.Persona.NomAseo.Lang = {
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar aseo',
    titleWindMod: 'Modificar aseo',
    titleGrid: 'Listado de aseos',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar aseo <b>(Alt+I)</b>',

    ttBtnChange: 'Modificar aseo <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar aseo <b>(DEL)</b>',
    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar aseo <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El o lo(s) aseo(s) ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El o lo(s) aseo(s) seleccionado(s) no se puede(n) eliminar debido a que está(n) en uso.',
    msgAdd: 'El aseo ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El aseo que quiere adicionar ya existe.',
    msgNotMod: 'El aseo ya existe.',
    msgMod: 'El aseo ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de aseos',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar los aseos seleccionados?',


    msgAskDelS: '¿Está seguro que quiere eliminar el aseo seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los aseos seleccionados?',
    msgDelS: 'El aseo ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los aseos han sido eliminados satisfactoriamente.'
}

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomAseo.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomAseo.Lang;
        this.referencia = 'nomaseo';
        this.mapping = [
            {name: 'idaseo'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomaseo/getAseo',
            add: '/pvd/persona/index.php/nomaseo/addAseo',
            mod: '/pvd/persona/index.php/nomaseo/modAseo',
            del: '/pvd/persona/index.php/nomaseo/delAseo',
            expt: '/pvd/persona/index.php/nomaseo/showReport'
        };
        this.title = this.lang.titleGrid;
        PVD.Persona.NomAseo.ViewGrid.superclass.initComponent.call(this);
    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomAseo.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomaseo/getAseo',
    mapping: [
        {name: 'idaseo'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idaseo';
        this.displayField = 'denominacion';
        this.name = 'idaseo';
        this.hiddenName = 'idaseo';
        PVD.Persona.NomAseo.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_aseo', PVD.Persona.NomAseo.ViewCombo);