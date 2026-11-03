/**
 * Nomenclador de la persona tipo centro de estudio
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomTipoCentroEstudio');

PVD.Persona.NomTipoCentroEstudio.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de tipos de centros de estudios',
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
    titleWindAdd: 'Adicionar tipo de centro de estudio',
    titleWindMod: 'Modificar tipo de centro de estudio',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar tipo de centro de estudio <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar tipo de centro de estudio <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar tipo de centro de estudio <b>(DEL)</b>',


    ttLimpiar: 'Limpiar filtro <b>(Alt+L)</b>',
    ttBuscar: 'Buscar tipo(s) centro de estudio <b>(Alt+B)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) tipo(s) de centro(s) de estudio(s) ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'El tipo de centro de estudio seleccionado no se puede eliminar debido a que está en uso.',
    msgAdd: 'El tipo de centro de estudio ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El tipo de centro de estudio que quiere adicionar ya existe.',
    msgNotMod: 'El tipo de centro de estudio ya existe.',
    msgMod: 'El tipo de centro de estudio ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) tipo(s) de centro(s) de estudio(s) seleccionado(s)?',


    msgAskDelS: '¿Está seguro que quiere eliminar el tipo de centro de estudio seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los tipos de centros de estudio seleccionados?',
    msgDelS: 'El tipo de centro de estudio ha(n) sido eliminado satisfactoriamente.',
    msgDelP: 'Los tipos de centros de estudio han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomTipoCentroEstudio.ViewGrid = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        this.lang = PVD.Persona.NomTipoCentroEstudio.Lang;
        this.referencia = 'nomtipocentroestudio';
        this.mapping = [
            {name: 'idtipocentroestudio'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];

        this.url = {
            getAll: '/pvd/persona/index.php/nomtipocentroestudio/getTipoCentroEstudio',
            add: '/pvd/persona/index.php/nomtipocentroestudio/addTipoCentroEstudio',
            mod: '/pvd/persona/index.php/nomtipocentroestudio/modTipoCentroEstudio',
            del: '/pvd/persona/index.php/nomtipocentroestudio/delTipoCentroEstudio',
            expt: '/pvd/persona/index.php/nomtipocentroestudio/showReport'
        };

        this.title = this.lang.gpTitle;

        PVD.Persona.NomTipoCentroEstudio.ViewGrid.superclass.initComponent.call(this);
        this.on('render', function (cmp) {
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
PVD.Persona.NomTipoCentroEstudio.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomtipocentroestudio/getTipoCentroEstudio',
    mapping: [
        {name: 'idtipocentroestudio'},
        {name: 'denominacion'},
        {name: 'abreviatura'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idtipocentroestudio';
        this.displayField = 'denominacion';
        this.name = 'idtipocentroestudio';
        this.hiddenName = 'idtipocentroestudio';
        PVD.Persona.NomTipoCentroEstudio.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_tipocentroestudio', PVD.Persona.NomTipoCentroEstudio.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
/**
 * Nomenclador de la persona centro estudio
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @package PVD
 * @subpackage Persona
 * @copyright XETID 2014
 */

Ext.ns('PVD.Persona.NomCentroEstudio');

PVD.Persona.NomCentroEstudio.Lang = {
    /**
     * Título del grid
     */
    gpTitle: 'Listado de centros de estudios',
    /**
     * Títulos de los componentes del formulario
     */
    tfDenomination: 'Denominación',
    tfabr: 'Abreviatura',
    taDescription: 'Descripción',
    dfFrom: 'Fecha inicio',
    dfUp: 'Fecha fin',
    tpCentroEstudio: 'Tipo de centro de estudio',

    ttBuscar: 'Buscar centro de estudio <b>(Alt+B)</b>',
    /**
     * Títulos de la venta de acuerdo a la acción.
     */
    titleWindAdd: 'Adicionar centro de estudio',
    titleWindMod: 'Modificar centro de estudio',
    /**
     * Tooltip de los botones.
     */
    ttBtnAdd: 'Adicionar centro de estudio <b>(Alt+I)</b>',
    ttBtnChange: 'Modificar centro de estudio <b>(Alt+M)</b>',
    ttBtnRemove: 'Eliminar centro de estudio <b>(DEL)</b>',
    /**
     * Mensages de las acciones.
     */
    msgDel: 'El(Los) centro(s) de estudio(s) ha(n) sido eliminado(s) satisfactoriamente.',
    msgNotDel: 'EL(Los) centro(s) de estudio(es) seleccionado(s) no se puede(n) eliminar debido a que está(n) en uso.',
    msgAdd: '¨El centro de estudio ha sido adicionado satisfactoriamente.',
    msgNotAdd: 'El centro de estudio que quiere adicionar ya existe.',
    msgNotMod: 'El centro de estudio ya existe.',
    msgMod: 'El centro de estudio ha sido modificado satisfactoriamente.',
    msgWait: 'Por favor espere...',
    msgWaitDel: 'Eliminado datos de centro estudio',
    msgSendServer: 'Enviando datos al servidor.',
    msgAskDel: '¿Está seguro que quiere eliminar el(los) centro(s) de estudio(s) seleccionado(s)?',

    msgAskDelS: '¿Está seguro que quiere eliminar el centro de estudio seleccionado?',
    msgAskDelP: '¿Está seguro que quiere eliminar los centros de estudios seleccionados?',
    msgDelS: 'El centro de estudio ha sido eliminado satisfactoriamente.',
    msgDelP: 'Los centros de estudios han sido eliminados satisfactoriamente.'

};

/**
 * Vista en forma de grid
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCentroEstudio.NomCentroEstudio = Ext.extend(PVD.Persona.CmpNomenclador.ViewGrid, {
    initComponent: function () {
        //Variables
        var self = this;
        this.lang = PVD.Persona.NomCentroEstudio.Lang;
        this.referencia = 'nomcentroestudio';
        this.tfDenomination = new Ext.form.TextField({
            id: 'tfDenomination' + self.referencia,
            nextTab: 'tpCentroEstudio' + self.referencia,
            prevTab: 'btnAcept' + self.referencia,
            fieldLabel: this.lang.tfDenomination,
            name: 'denominacion',
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
//            regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-]+([-_/.\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ_-])+$/,
//            regexText: 'Solo admite letras y el(los) caracter(es) especial(les) ( _-)',
            allowBlank: false,
            maxLength: 100,
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

        this.dfFrom = new Ext.form.DateField({
            name: 'fdesde',
            id: 'fdesde' + self.referencia,
            nextTab: 'fhasta' + self.referencia,
            prevTab: 'tpCentroEstudio' + self.referencia,
            fieldLabel: this.lang.dfFrom,
            anchor: '98%',
            allowBlank: false,
            format: 'd/m/Y',
            value: new Date().format('d/m/Y'),
            vtype: 'daterange',
            endDateField: 'fhasta' + self.referencia,
            enableKeyEvents: true,
            listeners: {
                keypress: function (tf, e) {
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
                keypress: function (tf, e) {
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

        this.cmbTipoCentroEstudio = new PVD.Persona.NomTipoCentroEstudio.ViewCombo({
            id: 'tpCentroEstudio' + self.referencia,
            nextTab: 'fdesde' + self.referencia,
            prevTab: 'tfDenomination' + self.referencia,
            fieldLabel: this.lang.tpCentroEstudio,
            emptyText: 'Seleccione...',
            enableKeyEvents:true,
            anchor: '100%',
            allowBlank: false,
            listeners: {
                select: function (combo, record, index) {
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
                this.tfDenomination, this.tfAbbreviation, this.cmbTipoCentroEstudio,
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
            {name: 'idcentroestudio'},
            {name: 'idtipocentroestudio'},
            {name: 'denominacion'},
            {name: 'abreviatura'},
            {name: 'fdesde'},
            {name: 'fhasta'},
            {name: 'descripcion'}
        ];

        this.url = {
            getAll: '/pvd/persona/index.php/nomcentroestudio/getCentroEstudio',
            add: '/pvd/persona/index.php/nomcentroestudio/addCentroEstudio',
            mod: '/pvd/persona/index.php/nomcentroestudio/modCentroEstudio',
            del: '/pvd/persona/index.php/nomcentroestudio/delCentroEstudio',
            expt: '/pvd/persona/index.php/nomcentroestudio/showReport'
        };

        this.title = this.lang.gpTitle;

        PVD.Persona.NomCentroEstudio.NomCentroEstudio.superclass.initComponent.call(this);

    }

});

/**
 * Vista en forma de combo
 * @type {extend|*|void|extend|extend|extend}
 */
PVD.Persona.NomCentroEstudio.ViewCombo = Ext.extend(PVD.Persona.CmpNomenclador.ViewCombo, {
    url: '/pvd/persona/index.php/nomcentroestudio/getCentroEstudio',
    mapping: [
        {name: 'idcentroestudio'},
        {name: 'idtipocentroestudio'},
        {name: 'denominacion'},
        {name: 'fdesde'},
        {name: 'fhasta'},
        {name: 'descripcion'}
    ],
    initComponent: function () {
        this.valueField = 'idcentroestudio';
        this.hiddenName = 'idcentroestudio';
        this.name = 'idcentroestudio';
        this.displayField = 'denominacion';
        PVD.Persona.NomCentroEstudio.ViewCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('combo_centroestudio', PVD.Persona.NomCentroEstudio.ViewCombo);

//--------------------------------------------------------------------------------------------------------------------//
PVD.Persona.NomCentroEstudio.ViewGrid = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {
        this.referencia = 'nomcentroestudio';
        var ref=this;
        this.centroestudio = new PVD.Persona.NomCentroEstudio.NomCentroEstudio({
            region: 'east',
            margins: '5 5 5 0',
            split: true,
            border: true,
            width: '50%'
        });

        this.tpCentroEstudio = new PVD.Persona.NomTipoCentroEstudio.ViewGrid({
            region: 'center',
            margins: '5 0 5 5',
            border: true
        });


        ref.centroestudio.on('settear',function(){
            ref.centroestudio.cmbTipoCentroEstudio.setValue(ref.tpCentroEstudio.getSelectionModel().getSelected().data.idtipocentroestudio);

        });


        this.centroestudio.cmbTipoCentroEstudio.bindStore(this.tpCentroEstudio.getStore(), true);

        this.items = [this.centroestudio, this.tpCentroEstudio];

        this.tpCentroEstudio.getSelectionModel().on('selectionchange', function (sm) {
            if (sm.getCount() == 1) {
                this.centroestudio.getStore().baseParams.idtipocentroestudio = sm.getSelected().get('idtipocentroestudio');
                this.centroestudio.getStore().reload();
            } else {
                this.centroestudio.getStore().baseParams.idtipocentroestudio = '';
                this.centroestudio.getStore().reload();
            }
        }, this);

        ref.centroestudio.cmbTipoCentroEstudio.on('keypress', function (text,obj) {
            this.tpCentroEstudio.getStore().baseParams.query = text.getRawValue();
            this.tpCentroEstudio.getStore().reload();

        }, this);

        PVD.Persona.NomCentroEstudio.ViewGrid.superclass.initComponent.call(this);
    },
    listeners: {
        resize: function () {
            this.centroestudio.setWidth('50%');
        }
    },
    enfocar: function () {

    }
});