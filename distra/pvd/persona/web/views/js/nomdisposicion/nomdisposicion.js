/**
 * Nomenclador de la persona Disposición
 *
 * @author Ing. Yaricel Guerra Velazquez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2018
 */

Ext.ns('PVD.Persona.NomDisposicion');

PVD.Persona.NomDisposicion.Lang = {
    titleGrid: 'Listado de disposiciones',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar disposici&oacute;n',
    titleWindMod: 'Modificar disposici&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar disposici&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar disposici&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar disposici&oacute;n <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar disposici&oacute;n <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgNotDel: 'La disposici&oacute;n seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La disposici&oacute;n ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La disposici&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'La disposici&oacute;n ya existe.',
    msgMod: 'La disposici&oacute;n ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la disposici&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',

    msgAskDelS: '¿Está seguro que quiere eliminar la disposici&oacute;n seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las disposiciones seleccionadas?',
    msgDelS: 'La disposici&oacute;n ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las disposiciones han sido eliminadas satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomDisposicion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomDisposicion.Lang;
        this.referencia = 'nomdisposicion';
        this.mapping = [
            {name: 'iddisposicion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'},
            {name: 'gestion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomdisposicion/getDisposicion',
            add: '/pvd/persona/index.php/nomdisposicion/addDisposicion',
            mod: '/pvd/persona/index.php/nomdisposicion/modDisposicion',
            del: '/pvd/persona/index.php/nomdisposicion/delDisposicion',
            expt: '/pvd/persona/index.php/nomdisposicion/showReport'
        };
        this.title = this.lang.titleGrid;
        PVD.Persona.NomDisposicion.ViewGrid.superclass.initComponent.call(this);
    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomDisposicion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomdisposicion/getDisposicion',
    mapping: [
        {name: 'iddisposicion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'iddisposicion';
        this.displayField = 'denominacion';
        this.hiddenName = 'iddisposicion';
        PVD.Persona.NomDisposicion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_disposicion', PVD.Persona.NomDisposicion.ViewCombo);





