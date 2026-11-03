/**
 Uso:Componente para seleccionar un tipo de formato de hoja PDF especifico
 * 11 de Mayo 2018 | Nomina
 * @extends Ext.form.ComboBox
 * @autor   Linea Capital Humano - Ing. Dainier Velázquez Labrada
 * @version 1.0.0
 */
Ext.ns('Ext.pvd.nomina.tipoHoja');
Ext.QuickTips.init();
Ext.pvd.nomina.tipoHoja = Ext.extend(Ext.form.ComboBox, {
    id: 'cmbTipoHoja',
    displayField: 'denominacion',
    hiddenName: 'idtipohoja',
    valueField: 'idtipohoja',
    triggerAction: 'all',
    fieldLabel: 'Tipo Hoja',
    mode: 'local',
    emptyText: 'Seleccione...',
    blankText: 'Este campo es obligatorio',
    anchor: (this.anchor ? this.anchor : '100%'),
    width: (this.width ? this.width : '50%'),
    allowBlank: (this.allowBlank ? this.allowBlank : true),
    forceSelection: (this.forceSelection ? this.forceSelection : false),
    disabled: (this.disabled ? this.disabled : true),
    initComponent: function () {
        this.store = new Ext.data.SimpleStore({
            fields: [{name: 'idtipohoja'}, {name: 'denominacion'}
            ],
            data: [
                [0, 'Letter'],
                [1, 'A4'],
                [2, 'A3']
                /*[0, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;" ' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>Letter'],
                [1, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;" ' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A1'],
                [2, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A2'],
                [3, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A3'],
                [4, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A4'],
                [5, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A5'],
                [6, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A6'],
                [7, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A7']*/
            ],
            autoLoad: true
        });
        /*this.on('select', function (obj) {
            return obj.getRawValue();
            /!*var val = obj.getRawValue().split('/>');
            this.setRawValue(val[1]);*!/
        });*/

        Ext.pvd.nomina.tipoHoja.superclass.initComponent.call(this);
    }
});

Ext.ns('Ext.pvd.nomina.panelFormatoHoja');
Ext.QuickTips.init();
Ext.pvd.nomina.panelFormatoHoja = Ext.extend(Ext.Panel, {
    id: 'idPanelFormatoHoja',
    title: 'Formato Hoja',
    region: 'center',
    layout: 'fit',
    frame: (this.frame ? this.frame : false),
    border: (this.border ? this.border : true),
    width: 385,
    height: 200,
    autoScroll: (this.autoScroll ? this.autoScroll : true),
    initComponent: function () {
        var self = this;
        var store = new Ext.data.SimpleStore({
            fields: [{name: 'idtipohoja'}, {name: 'denominacion'}
            ],
            data: [
                [0, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;" ' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>Letter'],
                [1, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;" ' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A1'],
                [2, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A2'],
                [3, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A3'],
                [4, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A4'],
                [5, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A5'],
                [6, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A6'],
                [7, '<img style="margin: 0px 3px 0px 5px;width: 15px;height: 15px;"' +
                'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>A7']
            ],
            autoLoad: true
        });
        var comboFormatoHoja = new Ext.extend(Ext.form.ComboBox, {
            id: 'cmbTipoHoja',
            displayField: 'denominacion',
            hiddenName: 'idtipohoja',
            valueField: 'idtipohoja',
            triggerAction: 'all',
            mode: 'local',
            anchor: '100%',
            width: 200,
            fieldLabel: 'Tipo Hoja',
            allowBlank: true,
            forceSelection: false,
            emptyText: 'Seleccione...',
            blankText: 'Este campo es obligatorio',
            disabled: true,
            store: store,
            listeners: {
                'select': function (obj, ischeck) {
                    if (ischeck) {
                        var val = obj.getRawValue().split('/>');
                        this.setRawValue(val[1]);
                    }
                }.createDelegate(this)
            }
        });
        this.items = [{
            bodyStyle: 'padding-left:5px;',
            frame: true,
            items: {
                xtype: 'fieldset',
                title: 'Formatos',
                height: 200,
                defaultType: 'radio',
                items: [
                    {
                        xtype: 'radio',
                        id: 'radioexcel',
                        hideLabel: true,
                        align: 'center',
                        checked: true,
                        boxLabel: 'Hojas de c&aacute;lculo (<img style="margin: 0px 1px 0px 1px;width: 15px;height: 15px;" ' +
                        'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_excel.png"/>)',
                        name: 'radiotiporeporte',
                        listeners: {
                            'check': function (obj, ischeck) {
                                if (ischeck) {
                                    comboFormatoHoja.disable();
                                }
                            }.createDelegate(this)
                        }
                    },
                    {
                        xtype: 'radio',
                        id: 'radiopdf',
                        hideLabel: true,
                        align: 'center',
                        boxLabel: 'Formato de documento port&aacute;til (<img style="margin: 0px 1px 0px 1px;width: 15px;height: 15px;" ' +
                        'src="' + document.location.protocol + '//' + document.location.host + '/pvd/comun/views/js/formatohojacomp/images/img_pdf.png"/>)',
                        name: 'radiotiporeporte',
                        listeners: {
                            'check': function (obj, ischeck) {
                                if (ischeck) {
                                    comboFormatoHoja.enable();
                                }
                            }.createDelegate(this)
                        }
                    }
                ]
            }
        }];

        Ext.pvd.nomina.panelFormatoHoja.superclass.initComponent.call(this);
    }
    ,
    disableCombo: function () {
        this.comboFormatoHoja.disable();
    }
    ,

    enableCombo: function () {
        this.comboFormatoHoja.enable();
    }
});