

Ext.ns('PVD.Persona.NomEstAlimentacion');
PVD.Persona.NomEstAlimentacion.Lang = {
    titleGrid: 'Listado de estructuras de alimentaci&oacute;n',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar estructura de alimentaci&oacute;n',
    titleWindMod: 'Modificar estructura de alimentaci&oacute;n',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar estructura de alimentaci&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar estructura de alimentaci&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar estructura de alimentaci&oacute;n <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar estructura(s) de alimentaci&oacute;n <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) estructura(s) de alimentaci&oacute;n ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La estructura de alimentaci&oacute;n seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La estructura de alimentaci&oacute;n ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La estructura de alimentaci&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'La estructura de alimentaci&oacute;n ya existe.',
    msgMod: 'La estructura de alimentaci&oacute;n ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la estructura de alimentaci&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) estructura(s) de alimentaci&oacute;n seleccionada(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar la estructura de alimentaci&oacute;n seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las estructuras de alimentaci&oacute;n seleccionadas?',
    msgDelS: 'La estructura de alimentaci&oacute;n ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las estructuras de alimentaci&oacute;n han sido eliminadas satisfactoriamente.'
};

PVD.Persona.NomEstAlimentacion.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        this.lang = PVD.Persona.NomEstAlimentacion.Lang;
        this.referencia = 'nomestalimentacion';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idestalimentacion'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomestalimentacion/getEstAlimentacion',
            add: '/pvd/persona/index.php/nomestalimentacion/addEstAlimentacion',
            mod: '/pvd/persona/index.php/nomestalimentacion/modEstAlimetacion',
            del: '/pvd/persona/index.php/nomestalimentacion/delEstAlimetacion',
            expt: '/pvd/persona/index.php/nomestalimentacion/showReport'
        };
        PVD.Persona.NomEstAlimentacion.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomEstAlimentacion.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomestalimentacion/getEstAlimentacion',
    mapping: [
        {name: 'idestalimentacion'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idestalimentacion';
        this.displayField = 'denominacion';
        this.hiddenName = 'idestalimentacion';
        PVD.Persona.NomEstAlimentacion.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_estalimentacion', PVD.Persona.NomEstAlimentacion.ViewCombo);

