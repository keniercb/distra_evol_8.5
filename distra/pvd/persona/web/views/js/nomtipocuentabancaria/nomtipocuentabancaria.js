/**
 * Nomenclador de la persona TypeAcountBank
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoCuentaBancaria');
PVD.Persona.NomTipoCuentaBancaria.Lang = {
    titleGrid: 'Listado de tipos de cuentas bancarias',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de cuenta bancaria',
    titleWindMod: 'Modificar tipo de cuenta bancaria',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de cuenta bancaria <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de cuenta bancaria <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de cuenta bancaria <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar tipo(s) de cuenta bancaria <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de cuenta(s) bancaria(s) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'El tipo de cuenta bancaria seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de cuenta bancaria ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de cuenta bancaria que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de cuenta bancaria ya existe.',
    msgMod: 'El tipo de cuenta bancaria ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminando datos del tipo de cuenta bancaria',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de cuenta(s) bancaria(s) seleccionada(s)?',



    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de cuenta bancaria seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de cuentas bancarias seleccionadas?',
    msgDelS: 'El tipo de cuenta bancaria ha sido eliminada satisfactoriamente.',
    msgDelP: 'Los tipos de cuentas bancarias han sido eliminadas satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoCuentaBancaria.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

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
        this.lang = PVD.Persona.NomTipoCuentaBancaria.Lang;
        this.referencia = 'nomtipocuentabancaria';
        this.title = this.lang.titleGrid;
        this.mapping = [
            {name: 'idtipocuentabancaria'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomtipocuentabancaria/getTypeAcountBank',
            add: '/pvd/persona/index.php/nomtipocuentabancaria/addTypeAcountBank',
            mod: '/pvd/persona/index.php/nomtipocuentabancaria/modTypeAcountBank',
            del: '/pvd/persona/index.php/nomtipocuentabancaria/delTypeAcountBank',
            expt: '/pvd/persona/index.php/nomtipocuentabancaria/showReport'
        };
        PVD.Persona.NomTipoCuentaBancaria.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoCuentaBancaria.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipocuentabancaria/getTypeAcountBank',
    mapping: [
        {name: 'idtipocuentabancaria'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idtipocuentabancaria';
        this.displayField = 'denominacion';
        this.hiddenName = 'idtipocuentabancaria';
        PVD.Persona.NomTipoCuentaBancaria.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipocuentabancaria', PVD.Persona.NomTipoCuentaBancaria.ViewCombo);

