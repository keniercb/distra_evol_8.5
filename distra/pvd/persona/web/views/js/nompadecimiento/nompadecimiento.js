/**
 * Nomenclador de la persona Suffering
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomPadecimiento');
PVD.Persona.NomPadecimiento.Lang = {
    titleGrid: 'Listado de padecimientos',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar padecimiento',
    titleWindMod: 'Modificar padecimiento',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar padecimiento <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar padecimiento <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar padecimiento <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar padecimiento(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) padecimiento(s) ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El padecimiento seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El padecimiento ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El padecimiento que quiere adicionar ya existe.',
    msgNotMod: 'El padecimiento ya existe.',
    msgMod: 'El padecimiento ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del padecimiento',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) padecimiento(s) seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el padecimiento seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los padecimientos seleccionados?',
    msgDelS: 'El padecimiento ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los padecimientos han sido eliminados satisfactoriamente.'

};


/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomPadecimiento.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        var self=this;
        this.tfDenomination = this.tfDenomination || new Ext.form.TextField({
            id: 'tfDenomination' + self.referencia,
            nextTab: 'fdesde' + self.referencia,
            prevTab: 'btnAcept' + self.referencia,
//                maskRe: /^([ a-zA-ZÁÉÍÓÚáéíóúñüÑ\s_-]+ ?[ a-zA-ZÁÉÍÓÚáéíóúñüÑ\s-_]*)+$/,
//                regex: /^([ a-zA-ZÁÉÍÓÚáéíóúñüÑ\s_-]+ ?[ a-zA-ZÁÉÍÓÚáéíóúñüÑ\s-_]*)+$/,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            //regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-]+([-_/.\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-])+$/,
            //regexText: 'Solo admite letras y el(los) caracter(es) especial(les) ( _-)',
            fieldLabel: 'Denominación',
            itemCls: '.required .x-form-item-label {font-weight:bold;color:red;}',
            maxLength: 255,
            name: 'denominacion',
            allowBlank: false,
            anchor: '100%',
            enableKeyEvents: true,
            vtype: 'denominacion',
            listeners: {
                keyup: function (tf, e) {
                    if (e.getKey() != 9) {
                        if (self.form.getForm().isValid()) {
                            self.btnApply.enable();
                            self.btnAcept.enable();
                        } else {
                            self.btnApply.disable();
                            self.btnAcept.disable();
                        }
                    }
                }
            }
        });

        this.lang = PVD.Persona.NomPadecimiento.Lang;
        this.referencia = 'nompadecimiento';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idpadecimiento'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nompadecimiento/getSuffering',
            add: '/pvd/persona/index.php/nompadecimiento/addSuffering',
            mod: '/pvd/persona/index.php/nompadecimiento/modSuffering',
            del: '/pvd/persona/index.php/nompadecimiento/delSuffering',
            expt: '/pvd/persona/index.php/nompadecimiento/showReport'
        };
        PVD.Persona.NomPadecimiento.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomPadecimiento.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nompadecimiento/getSuffering',
    mapping: [
        {name: 'idpadecimiento'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idpadecimiento';
        this.displayField = 'denominacion';
        this.hiddenName = 'idpadecimiento';
        PVD.Persona.NomPadecimiento.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_padecimiento', PVD.Persona.NomPadecimiento.ViewCombo);

