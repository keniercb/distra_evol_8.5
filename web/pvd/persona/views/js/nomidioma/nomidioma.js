/**
 * Nomenclador de la persona idioma
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomIdioma');
PVD.Persona.NomIdioma.Lang = {
    titleGrid: 'Listado de idiomas',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar idioma',
    titleWindMod: 'Modificar idioma',
    /**
     * Labels del Formulario
     */
    tfDenomination: 'Denominación',
    tfAbr: 'Abreviatura',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar idioma <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar idioma <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar idioma <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar idioma(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) idioma(s) ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El idioma seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El idioma ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El idioma que quiere adicionar ya existe.',
    msgNotMod: 'El idioma ya existe.',
    msgMod: 'El idioma ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del idioma',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) idioma(s) seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el idioma seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los idiomas seleccionados?',
    msgDelS: 'El idioma ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los idiomas han sido eliminados satisfactoriamente.'

};


/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomIdioma.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {

    initComponent: function () {
        var self = this;
        this.lang = PVD.Persona.NomIdioma.Lang;
        this.referencia = 'nomidioma';
        this.title = this.lang.titleGrid;

        this.tfDenomination = new Ext.form.TextField({
            id: 'tfDenomination' + self.referencia,
            nextTab: 'cmbFlags' + self.referencia,
            prevTab: 'btnAcept' + self.referencia,
            fieldLabel: this.lang.tfDenomination,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
//            regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-]+([-_/.\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-])+$/,
//            regexText: 'Solo admite letras y el(los) caracter(es) especial(les) ( _-)',
            maxLength: 100,
            name: 'denominacion',
            allowBlank: false,
            anchor: '100%',
            enableKeyEvents: true,
            vtype: 'denominacion',
            listeners: {                    
                keyup: function(tf, e) {
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

        this.tfAbbreviation = new Ext.form.TextField({
            id: 'tfAbbreviation' + self.referencia,
            nextTab: 'tpOrganizacion' + self.referencia,
            prevTab: 'tfDenomination' + self.referencia,
            fieldLabel: self.lang.tfAbr,
            name: 'abreviatura',
            anchor: '100%',
            maxLength: 5
        });

        this.taDescription = new Ext.form.TextArea({
            id: 'taDescription' + self.referencia,
            nextTab: 'btnCancel' + self.referencia,
            prevTab: 'fhasta' + self.referencia,
            fieldLabel: this.lang.taDescription,
            name: 'descripcion',
            anchor: '100%',
            height: 90,
            maxLength: 255,
            enableKeyEvents: true,
            listeners: {                    
                keyup: function(tf, e) {
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

        this.dfFrom = new Ext.form.DateField({
            name: 'fdesde',
            id: 'fdesde' + self.referencia,
            nextTab: 'fhasta' + self.referencia,
            prevTab: 'cmbFlags' + self.referencia,
            fieldLabel: this.lang.dfFrom,
            anchor: '98%',
            allowBlank: false,
            format: 'd/m/Y',
            value: new Date().format('d/m/Y'),
            vtype: 'daterange',
            endDateField: 'fhasta' + self.referencia,
            enableKeyEvents: true,
            listeners: {
                keypress: function(tf, e) {
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

        this.dfUp = new Ext.form.DateField({
            name: 'fhasta',
            id: 'fhasta' + self.referencia,
            nextTab: 'taDescription' + self.referencia,
            prevTab: 'fdesde' + self.referencia,
            fieldLabel: this.lang.dfUp,
            anchor: '100%',
            format: 'd/m/Y',
            value: '',
            vtype: 'daterange',
            startDateField: 'fdesde' + self.referencia,
            enableKeyEvents: true,
            listeners: {
                keypress: function(tf, e) {
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

        this.cmbFlags = new Ext.components.ViewComboFlags({
            id: 'cmbFlags' + self.referencia,
            nextTab: 'fdesde' + self.referencia,
            prevTab: 'tfDenomination' + self.referencia,
            fieldLabel: 'País',
            emptyText:'Seleccione...',
            name: 'bandera',
            anchor: '100%',
            listeners: {
                select: function(combo, record, index) {
                    if (self.form.getForm().isValid()) {
                        self.btnApply.enable();
                        self.btnAcept.enable();
                    } else {
                        self.btnApply.disable();
                        self.btnAcept.disable();
                    }
                }
            }
        });

        this.newConf = {
            //width: '70%',
            itemsForm: [
                this.tfDenomination, this.tfAbbreviation, this.cmbFlags,
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfFrom]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfUp]
                        }
                    ]
                }, this.taDescription
            ]
        };

        this.mapping = [
            {name: 'ididioma'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'},
            {name: 'bandera'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomidioma/getLanguage',
            add: '/pvd/persona/index.php/nomidioma/addLanguage',
            mod: '/pvd/persona/index.php/nomidioma/modLanguage',
            del: '/pvd/persona/index.php/nomidioma/delLanguage',
            expt: '/pvd/persona/index.php/nomidioma/showReport'
        };
        PVD.Persona.NomIdioma.ViewGrid.superclass.initComponent.call(this);

    }

});

/**
 * Vista de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomIdioma.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomidioma/getLanguage',
    mapping: [
        {name: 'ididioma'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'bandera'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.tpl = '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item flags_text"><div width="16" height="16" class="flags_img {bandera}"></div>  <p>{denominacion}</p></div></tpl>';
        this.valueField = 'ididioma';
        this.displayField = 'denominacion';
        this.hiddenName = 'ididioma';
        PVD.Persona.NomIdioma.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_idioma', PVD.Persona.NomIdioma.ViewCombo);

