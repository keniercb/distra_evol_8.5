/**
 * Nomenclador de eventos de alimentacion
 *
 * @author Orestes Rodriguez Lorenzo
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2015
 */

Ext.ns('PVD.Persona.NomEventoalimentacion');
PVD.Persona.NomEventoalimentacion.Lang = {
    titleGrid: 'Listado de eventos de alimentaci&oacute;n',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar evento de alimentaci&oacute;n',
    titleWindMod: 'Modificar evento de alimentaci&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar evento de alimentaci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar evento de alimentaci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar evento de alimentaci&oacute;n <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar evento(s) de alimentaci&oacute;n <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(los) evento(s) de alimentaci&oacute;n ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El evento de alimentaci&oacute;n seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El evento de alimentaci&oacute;n ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El evento de alimentaci&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'El evento de alimentaci&oacute;n ya existe.',
    msgMod: 'El evento de alimentaci&oacute;n ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del evento de alimentaci&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) evento(s) de alimentaci&oacute;n seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el evento de alimentaci&oacute;n seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los eventos de alimentaci&oacute;n seleccionados?',
    msgDelS: 'El evento de alimentaci&oacute;n ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los eventos de alimentaci&oacute;n han sido eliminados satisfactoriamente.'
};


/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomEventoalimentacion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        this.lang = PVD.Persona.NomEventoalimentacion.Lang;
        this.referencia = 'nomeventoalimentacion';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idevento'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomeventoalimentacion/obtenerEventoAlimentacion',
            add: '/pvd/persona/index.php/nomeventoalimentacion/adicionarEventoAlimentacion',
            mod: '/pvd/persona/index.php/nomeventoalimentacion/modificarEventoAlimentacion',
            del: '/pvd/persona/index.php/nomeventoalimentacion/eliminarEventoAlimentacion',
            expt: '/pvd/persona/index.php/nomeventoalimentacion/mostrarReporte'
        };
        PVD.Persona.NomEventoalimentacion.ViewGrid.superclass.initComponent.call(this);
    }
});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomEventoalimentacion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomeventoalimentacion/obtenerEventoAlimentacion',
    mapping: [
        {name: 'idevento'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idevento';
        this.displayField = 'denominacion';
        this.hiddenName = 'idevento';
        PVD.Persona.NomEventoalimentacion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_eventoaimentacion', PVD.Persona.NomEventoalimentacion.ViewCombo);