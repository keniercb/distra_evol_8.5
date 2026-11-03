/**
 * Nomenclador de la persona Tipo de misión
 *
 * @author Ing. Yoan Uría Rodríguez
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoMision');

PVD.Persona.NomTipoMision.Lang = {
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar tipo de misi&oacute;n',
    titleWindMod: 'Modificar tipo de misi&oacute;n',
    titleGrid: 'Listado de tipos de misiones',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de misi&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de misi&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de misi&oacute;n <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar tipo(s) de misión <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de misi&oacute;n se ha(n) sido eliminado(s) satisfactoriamente',
    msgNotDel: 'El(Los) tipo(s) de misi&oacute;n seleccionado(s) no se puede(n) eliminar debido a que está(n) en uso.',
    msgAdd: 'El tipo de misi&oacute;n ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de misi&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de misi&oacute;n ya existe.',
    msgMod: 'El tipo de misi&oacute;n ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos del tipo de misi&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de misi&oacute;n(es) seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de misi&oacute;n seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de misiones seleccionados?',
    msgDelS: 'El tipo de misi&oacute;n  ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los tipos de misiones han sido eliminados satisfactoriamente.'
};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoMision.TipoMisiones = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function ()
    {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomTipoMision.Lang;
        this.referencia = 'nomtipomision';
        this.mapping = [
            {name: 'idtipomision'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nomtipomision/getTiposMision',
            add: '/pvd/persona/index.php/nomtipomision/addTipoMision',
            mod: '/pvd/persona/index.php/nomtipomision/modTipoMision',
            del: '/pvd/persona/index.php/nomtipomision/delTipoMision',
            expt: '/pvd/persona/index.php/nomtipomision/showReport'
        };
        this.title = this.lang.titleGrid;
        PVD.Persona.NomTipoMision.TipoMisiones.superclass.initComponent.call(this);
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
PVD.Persona.NomTipoMision.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipomision/getTiposMision',
    mapping: [
        {name: 'idtipomision'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function ()
    {
        this.valueField = 'idtipomision';
        this.displayField = 'denominacion';
        this.name = 'idtipomision';
        this.hiddenName = 'idtipomision';
        PVD.Persona.NomTipoMision.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipomision', PVD.Persona.NomTipoMision.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
/**
 * Nomenclador de la persona mision
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomMision');

PVD.Persona.NomMision.Lang = {
    /**
     * Títulos del formulario
     */
    tfDenomination: 'Denominaci&oacute;n',
    tfabr: 'Abreviatura',
    taDescription: 'Descripci&oacute;n',
    tpMision: 'Tipo de misi&oacute;n',
    dfFrom: 'Desde',
    dfUp: 'Hasta',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar misi&oacute;n',
    titleWindMod: 'Modificar misi&oacute;n',
    titleGrid: 'Listado de misiones',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar misi&oacute;n <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar misi&oacute;n <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar misi&oacute;n <b>(DEL)</b>',

    ttLimpiar:'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar:'Buscar misión(es) <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'La(s) misi&oacute;n(es) se ha(n) sido eliminada(s) satisfactoriamente',
    msgNotDel: 'La(s) misi&oacute;n(es) seleccionada(s) no se puede(n) eliminar debido a que está(n) en uso.',
    msgAdd: 'La misi&oacute;n ha sido adicionada satisfactoriamente.',
    msgNotAdd: 'La misi&oacute;n que quiere adicionar ya existe.',
    msgNotMod: 'La misi&oacute;n ya existe.',
    msgMod: 'La misi&oacute;n ha sido modificada satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de la misi&oacute;n',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar la(s) misión(es) seleccionada(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar la misión seleccionada?',
    msgAskDelP: '¿Está seguro que quiere eliminar las misiones seleccionadas?',
    msgDelS: 'La misi&oacute;n ha sido eliminada satisfactoriamente.',
    msgDelP: 'Las misiones han sido eliminadas satisfactoriamente.'
}

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomMision.Misiones = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function ()
    {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomMision.Lang;
        this.referencia = 'nommision';
        this.tfDenomination = new Ext.form.TextField({
            id: 'tfDenomination' + self.referencia,
            nextTab: 'tfMision' + self.referencia,
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
            fieldLabel: self.lang.tfabr,
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
            prevTab: 'tfMision' + self.referencia,
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

        this.cmbTipoMision = new PVD.Persona.NomTipoMision.ViewCombo({
            id: 'tfMision' + self.referencia,
            nextTab: 'fdesde' + self.referencia,
            prevTab: 'tfDenomination' + self.referencia,
            emptytext:'Seleccione...',
            fieldLabel: this.lang.tpMision,
            anchor: '100%',
            enableKeyEvents:true,
            allowBlank: false,
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
                this.tfDenomination, this.tfAbbreviation, this.cmbTipoMision,
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
            {name: 'idmision'},
            {name: 'idtipomision'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];
        this.url = {
            getAll: '/pvd/persona/index.php/nommision/getMision',
            add: '/pvd/persona/index.php/nommision/addMision',
            mod: '/pvd/persona/index.php/nommision/modMision',
            del: '/pvd/persona/index.php/nommision/delMision',
            expt: '/pvd/persona/index.php/nommision/showReport'
        };

        this.title = this.lang.titleGrid;

        PVD.Persona.NomMision.Misiones.superclass.initComponent.call(this);
    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomMision.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nommision/getMision',
    mapping: [
        {name: 'idmision'},
        {name: 'idtipomision'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function ()
    {
        this.valueField = 'idmision';
        this.displayField = 'denominacion';
        this.name = 'idmision';
        this.hiddenName = 'idmision';
        PVD.Persona.NomMision.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_mision', PVD.Persona.NomMision.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
PVD.Persona.NomMision.ViewGrid = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function ()
    {
        this.referencia = 'nommision';
        var ref=this;
        this.misiones = new PVD.Persona.NomMision.Misiones({
            region: 'east',
            margins: '5 5 5 0',
            split: true,
            border: true,
            width: '50%'
        });

        this.tpMisiones = new PVD.Persona.NomTipoMision.TipoMisiones({
            region: 'center',
            margins: '5 0 5 5',
            border: true
        });

        this.misiones.on('settear',function(){
            ref.misiones.cmbTipoMision.setValue(ref.tpMisiones.getSelectionModel().getSelected().data.idtipomision);

        });

        this.misiones.cmbTipoMision.bindStore(this.tpMisiones.getStore(), true);

        this.items = [this.misiones, this.tpMisiones];

        this.tpMisiones.getSelectionModel().on('selectionchange', function (sm)
        {
            if (sm.getCount() == 1) {
                this.misiones.getStore().baseParams.idtipomision = sm.getSelected().get('idtipomision');
                this.misiones.getStore().reload();
            } else {
                this.misiones.getStore().baseParams.idtipomision = '';
                this.misiones.getStore().reload();
            }
        }, this);

        ref.misiones.cmbTipoMision.on('keypress', function (text,obj) {
            this.tpMisiones.getStore().baseParams.query = text.getRawValue();
            this.tpMisiones.getStore().reload();

        }, this);


        PVD.Persona.NomMision.ViewGrid.superclass.initComponent.call(this);
    },
    listeners: {
        resize: function ()
        {
            this.misiones.setWidth('50%');
        }
    },
    enfocar: function ()
    {

    }
});
