

Ext.ns('PVD.Persona.NomConvivencia');
PVD.Persona.NomConvivencia.Lang = {
    titleGrid: 'Listado de convivencia',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar convivencia',
    titleWindMod: 'Modificar convivencia',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar convivencia <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar convivencia <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar convivencia <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar convivencia(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s)convivencia(s) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La convivencia seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La convivencia ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La convivencia que quiere adicionar ya existe.',
    msgNotMod: 'La convivencia ya existe.',
    msgMod: 'La convivencia ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la convivencia',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que desea eliminar la convivencia seleccionada?',


    msgAskDelS: '¿Está seguro que quiere eliminar la convivencia seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las convivencias seleccionadas?',
    msgDelS: 'La convivencia seleccionada ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las convivencias seleccionadas han sido eliminadas satisfactoriamente.'
};

PVD.Persona.NomConvivencia.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        this.lang = PVD.Persona.NomConvivencia.Lang;
        this.referencia = 'nomconvivencia';
        //this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idconvivencia'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomconvivencia/getConvivencia',
            add: '/pvd/persona/index.php/nomconvivencia/addConvivencia',
            mod: '/pvd/persona/index.php/nomconvivencia/modConvivencia',
            del: '/pvd/persona/index.php/nomconvivencia/delConvivencia',
            expt: '/pvd/persona/index.php/nomconvivencia/showReport'
        };
        PVD.Persona.NomConvivencia.ViewGrid.superclass.initComponent.call(this);
    }
});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomConvivencia.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomconvivencia/getConvivencia',
    mapping: [
        {name: 'idconvivencia'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idconvivencia';
        this.displayField = 'denominacion';
        this.hiddenName = 'idconvivencia';
        PVD.Persona.NomConvivencia.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_convivencia', PVD.Persona.NomConvivencia.ViewCombo);