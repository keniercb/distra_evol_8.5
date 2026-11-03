/**
 * Nomenclador de la persona tipo categoria
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoCategoria');

PVD.Persona.NomTipoCategoria.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de tipos de categor&iacute;as',
    /**
     * Títulos de los componentes del formulario
     */
    tfDenomination: 'Denominación',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de categor&iacute;a',
    titleWindMod: 'Modificar tipo de categor&iacute;a',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de categor&iacute;a <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de categor&iacute;a <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de categor&iacute;a <b>(DEL)</b>',

    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar tipo(s) de categoría <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de categor&iacute;a(s) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'El tipo de categor&iacute;a seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de categor&iacute;a ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de categor&iacute;a que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de categor&iacute;a ya existe.',
    msgMod: 'El tipo de categor&iacute;a ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de categor&iacute;a(s) seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de categor&iacute;a seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de categor&iacute;as seleccionados?',
    msgDelS: 'El tipo de categor&iacute;a ha sido eliminada satisfactoriamente.',
    msgDelP: 'Los tipos de categor&iacute;as han sido eliminadas satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoCategoria.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        this.lang = PVD.Persona.NomTipoCategoria.Lang;
        this.referencia = 'nomtipocategoria';
        this.mapping = [
            {name: 'idtipocategoria'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];

        this.url = {
            getAll: '/pvd/persona/index.php/nomtipocategoria/getTipoCategoria',
            add: '/pvd/persona/index.php/nomtipocategoria/addTipoCategoria',
            mod: '/pvd/persona/index.php/nomtipocategoria/modTipoCategoria',
            del: '/pvd/persona/index.php/nomtipocategoria/delTipoCategoria',
            expt: '/pvd/persona/index.php/nomtipocategoria/showReport'
        };

        this.title = this.lang.gpTitle;

        PVD.Persona.NomTipoCategoria.ViewGrid.superclass.initComponent.call(this);
        this.on('render', function () {
            Ext.getCmp('btnHelp_' + this.referencia).setVisible(false);
        }, this);
        this.getStore().on('load',function(){
            this.btnAdd.focus(200);
        },this);

    }
});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoCategoria.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipocategoria/getTipoCategoria',
    mapping: [
        {name: 'idtipocategoria'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idtipocategoria';
        this.displayField = 'denominacion';
        this.name = 'idtipocategoria';
        this.hiddenName = 'idtipocategoria';
        PVD.Persona.NomTipoCategoria.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipocategoria', PVD.Persona.NomTipoCategoria.ViewCombo);