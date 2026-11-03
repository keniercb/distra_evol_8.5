/**
 * Nomenclador de la persona nivel educacional
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomNivelEducacional');

PVD.Persona.NomNivelEducacional.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de niveles educacionales',
    /**
     * Título del comboBox
     */
    cbxNivelEduc: 'Nivel educacional',
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
    titleWindAdd: 'Adicionar nivel educacional',
    titleWindMod: 'Modificar nivel educacional',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar nivel educacional <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar nivel educacional <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar nivel educacional <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt + L)</b>',
    ttBuscar:'Buscar nivel(es) educuacional <b>(Alt + B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) nivel educacional(es) se ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El nivel educacional seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El nivel educacional ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El nivel educacional que quiere adicionar ya existe.',
    msgNotMod: 'El nivel educacional ya existe.',
    msgMod: 'El nivel educacional ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminando datos de nivel educacional',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) nivel(es) educacional(es) seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el nivel educacional seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los niveles educacionales seleccionados?',
    msgDelS: 'El nivel educacional se ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los nivel educacionales se han sido eliminados  satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomNivelEducacional.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function ()
    {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomNivelEducacional.Lang;
        this.referencia = 'nomniveleducacional';
        this.mapping = [
            {name: 'idniveleducacional'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomniveleducacional/getEducationalLevel',
            add: '/pvd/persona/index.php/nomniveleducacional/addEducationalLevel',
            mod: '/pvd/persona/index.php/nomniveleducacional/modEducationalLevel',
            del: '/pvd/persona/index.php/nomniveleducacional/delEducationalLevel',
            expt: '/pvd/persona/index.php/nomniveleducacional/showReport'
        };
        this.title = this.lang.gpTitle;
        PVD.Persona.NomNivelEducacional.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomNivelEducacional.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    fieldLabel: PVD.Persona.NomNivelEducacional.Lang.cbxNivelEduc,
    url: '/pvd/persona/index.php/nomniveleducacional/getEducationalLevel',
    mapping: [
        {name: 'idniveleducacional'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function ()
    {
        this.valueField = 'idniveleducacional';
        this.hiddenName = 'idniveleducacional';
        this.name = 'idniveleducacional';
        this.displayField = 'denominacion';
        PVD.Persona.NomNivelEducacional.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_niveleducacional', PVD.Persona.NomNivelEducacional.ViewCombo);





