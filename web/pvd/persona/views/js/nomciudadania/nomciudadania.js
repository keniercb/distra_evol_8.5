/**
 * Nomenclador de la persona ciudadania
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomCiudadania');
PVD.Persona.NomCiudadania.Lang = {
    titleGrid: 'Listado de ciudadanías',
    tfDenomination: 'Denominación',
    taDescription: 'Descripción',
    tfabr: 'Abreviatura',
    cmbFlags: 'País',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar ciudadanía',
    titleWindMod: 'Modificar ciudadanía',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar ciudadanía <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar ciudadanía <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar ciudadanía <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar ciudadanía(s) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) ciudadanía(s) ha(n) sido eliminada(s) satisfactoriamente.',
    msgNotDel: 'La ciudadanía seleccionada no se puede eliminar debido a que está en uso.',
    msgAdd: 'La ciudadanía ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La ciudadanía que quiere adicionar ya existe.',
    msgNotMod: 'La ciudadanía ya existe.',
    msgMod: 'La ciudadanía ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la ciudadanía',
    msgSendServer: 'Enviando datos la servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) ciudadanía(s) seleccionada(s)?',



    msgAskDelS: '¿Está seguro que quiere eliminar la ciudadanía seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las ciudadanías seleccionadas?',
    msgDelS: 'La ciudadanía ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las ciudadanías han sido eliminadas satisfactoriamente.'
};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCiudadania.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomCiudadania.Lang;
        this.referencia = 'nomciudadania';
        this.title = this.lang.titleGrid;
        this.tfDenomination = new Ext.form.TextField({
            id: 'tfDenomination' + self.referencia,
            nextTab: 'cmbFlags' + self.referencia,
            prevTab: 'btnAcept' + self.referencia,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
//            regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-]+([-_/.\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-])+$/,
//            regexText: 'Solo admite letras y el(los) caracter(es) especial(les) ( _-)',
            maxLength: 100,
            fieldLabel: self.lang.tfDenomination,
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
            fieldLabel: self.lang.tfabr,
            name: 'abreviatura',
            anchor: '100%',
            maxLength: 5
        });

        this.taDescription = new Ext.form.TextArea({
            id: 'taDescription' + self.referencia,
            nextTab: 'btnCancel' + self.referencia,
            prevTab: 'fhasta' + self.referencia,
            fieldLabel: self.lang.taDescription,
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
            fieldLabel: self.lang.dfFrom,
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
            fieldLabel: self.lang.dfUp,
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
            fieldLabel: self.lang.cmbFlags,
            name: 'bandera',
            emptyText:'Seleccione...',
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
            {name: 'idciudadania'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'},
            {name: 'bandera'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomciudadania/getCitizenship',
            add: '/pvd/persona/index.php/nomciudadania/addCitizenship',
            mod: '/pvd/persona/index.php/nomciudadania/modCitizenship',
            del: '/pvd/persona/index.php/nomciudadania/delCitizenship',
            expt: '/pvd/persona/index.php/nomciudadania/showReport'
        };

        PVD.Persona.NomCiudadania.ViewGrid.superclass.initComponent.call(this);

    }
});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCiudadania.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomciudadania/getCitizenship',
    mapping: [
        {name: 'idciudadania'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'},
        {name: 'bandera'}
    ],
    initComponent: function () {
        this.tpl = '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item flags_text"><div width="16" height="16" class="flags_img {bandera}"></div>  <p>{denominacion}</p></div></tpl>';
        this.valueField = 'idciudadania';
        this.hiddenName = 'idciudadania';
        this.displayField = 'denominacion';
        PVD.Persona.NomCiudadania.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_ciudadania', PVD.Persona.NomCiudadania.ViewCombo);