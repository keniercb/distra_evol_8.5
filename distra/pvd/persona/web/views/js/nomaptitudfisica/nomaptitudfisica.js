/**
 * Nomenclador de la persona Aptitud Física
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomAptitudFisica');

PVD.Persona.NomAptitudFisica.Lang = {
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar aptitud f&iacute;sica',
    titleWindMod: 'Modificar aptitud f&iacute;sica',
    titleGrid: 'Listado de aptitudes f&iacute;sicas',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar aptitud f&iacute;sica <b>(Alt+I)</b>',

    ttBtnChange: 'Modificar aptitud f&iacute;sica <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar aptitud f&iacute;sica <b>(DEL)</b>',
    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar aptitud(es) física(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) aptitud(es) f&iacute;sica(s) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La(s) aptitud(es) f&iacute;sica(s) seleccionada(s) no se puede(n) eliminar debido a que está(n) en uso.',
    msgAdd: 'La aptitud f&iacute;sica ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La aptitud f&iacute;sica que quiere adicionar ya existe.',
    msgNotMod: 'La aptitud f&iacute;sica ya existe.',
    msgMod: 'La aptitud f&iacute;sica ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de aptitudes f&iacute;sicas',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) aptitud(es) f&iacute;sica(s) seleccionada(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar la aptitud f&iacute;sica seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las aptitudes f&iacute;sicas seleccionadas?',
    msgDelS: 'La aptitud f&iacute;sica ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las aptitudes f&iacute;sicas han sido eliminadas satisfactoriamente.'
}

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomAptitudFisica.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomAptitudFisica.Lang;
        this.referencia = 'nomaptitudfisica';
        this.mapping = [
            {name: 'idaptitudfisica'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomaptitudfisica/getAptitudesFisicas',
            add: '/pvd/persona/index.php/nomaptitudfisica/addAptitudFisica',
            mod: '/pvd/persona/index.php/nomaptitudfisica/modAptitudFisica',
            del: '/pvd/persona/index.php/nomaptitudfisica/delAptitudFisica',
            expt: '/pvd/persona/index.php/nomaptitudfisica/showReport'
        };
        this.title = this.lang.titleGrid;
        PVD.Persona.NomAptitudFisica.ViewGrid.superclass.initComponent.call(this);
    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomAptitudFisica.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomaptitudfisica/getAptitudesFisicas',
    mapping: [
        {name: 'idaptitudfisica'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idaptitudfisica';
        this.displayField = 'denominacion';
        this.name = 'idaptitudfisica';
        this.hiddenName = 'idaptitudfisica';
        PVD.Persona.NomAptitudFisica.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_aptitudesfisicas', PVD.Persona.NomAptitudFisica.ViewCombo);