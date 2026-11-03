/**
 * Created by adrian on 3/11/14.
 */
Ext.define('Controlpanel.view.addPack', {
    extend: 'Ext.window.Window',
    alias: 'widget.winaux',

    initComponent: function () {

        this.form = Ext.create('Ext.form.Panel', {
            id:'formInstall',
            frame: true,
            layout:'fit',
            items: [{

                xtype:'fieldset',
                title: Zeolides.etiquetas.textInformacion,
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items: [
                    {xtype:'fieldset',html: "<img src='"+this.logo+"' width='90%' height='15%'>", flex:1,border:0, style: 'border-width: 0px',margin : '1 1 1 1'},
                    {xtype:'fieldset',border:0, style: 'border-width: 0px', width:250,margin : '1 1 1 1',
                        items:[
                            {xtype: 'label', text : this.textLabel},
                            {xtype:'fieldset', title: Zeolides.etiquetas.titlePackInstall,width:230,html:this.install,hidden : (this.install == false) ? true : false},
                            {xtype:'fieldset', title: Zeolides.etiquetas.titlePackDesintal,width:230,html:this.uninstall,hidden : (this.uninstall == false) ? true : false},
                            {xtype:'fieldset', title: Zeolides.etiquetas.titlePackActual,width:230,html:this.update,hidden : (this.update == false) ? true : false},
                            {xtype:'fieldset', title: Zeolides.etiquetas.labelDescrip,width:230,html:this.desc}
                        ]},
                    {xtype:'fieldset', id:'fieldsetCnx',title: Zeolides.etiquetas.titlePackCnx, flex:2,margin : '1 1 10 1',defaults: {width: 170,labelAlign: 'top',disabled : !this.check},
                        items:[
                            {
                                xtype: 'textfield',
                                fieldLabel: Zeolides.etiquetas.labelServidor,
                                name: 'servidor',
                                id: 'servidor',
                                allowBlank: false,
                                value: this.connection_date.host,
                                padding :'5 0 0 0',
                                blankText: Zeolides.etiquetas.blankText,
                                regexText: Zeolides.etiquetas.regexTextServidor,
                                regex: /^(([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
                                maskRe : /^[0-9.]$/
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: Zeolides.etiquetas.labelBD,
                                name: 'bd',
                                id: 'bd',
                                allowBlank: false,
                                value: this.connection_date.bd,
                                padding :'5 0 0 0',
                                blankText: Zeolides.etiquetas.blankText,
                                maxLengthText : Zeolides.etiquetas.maxLengthText,
                                regexText: Zeolides.etiquetas.regexTextBd,
                                regex: /^[a-zA-Z\d _.-]*[a-zA-Z0-9]*$/,
                                maxLength: 30,
                                maxLengthText: Zeolides.etiquetas.maxLengthText
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: Zeolides.etiquetas.labelPuerto,
                                name: 'puerto',
                                id: 'puerto',
                                allowBlank: false,
                                editable : true,
                                maxValue : 65535,
                                //maxLength: 5,
                                //maxLengthText: Zeolides.etiquetas.maxLengthText,
                                maxText : Zeolides.etiquetas.maxTextL,
                              /*  hideTrigger: true,*/
                                value: this.connection_date.port,
                                padding :'5 0 0 0',
                                blankText: Zeolides.etiquetas.blankText,
                                regexText: Zeolides.etiquetas.regexTextpuerto,
                                nanText: Zeolides.etiquetas.nanTextWinAux
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: Zeolides.etiquetas.labelUsuario,
                                name: 'usuario',
                                id: 'usuario',
                                allowBlank: false,
                                value: 'postgres',
                                padding :'5 0 0 0',
                                blankText: Zeolides.etiquetas.blankText,
                                maxLengthText : Zeolides.etiquetas.maxLengthText,
                                regexText: Zeolides.etiquetas.regexTextUsuario,
                                regex: /^([a-zA-Z_.-]+[a-zA-Z\d]*)$/,
                                maxLength: 30
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: Zeolides.etiquetas.labelPass,
                                name: 'password',
                                id: 'password',
                                inputType: 'password',
                                allowBlank: false,
                                value: 'postgres',
                                padding :'5 0 10 0',
                                blankText: Zeolides.etiquetas.blankText,
                                maxLength: 30,
                                maxLengthText: Zeolides.etiquetas.maxLengthText
                            }
                        ]}

                ]
            }],
            buttons: [{
                text: Zeolides.etiquetas.textCancelar,
                iconCls: 'cancelar',
                tooltip : Zeolides.etiquetas.tooltipCancelar,
                action:'closeWin'
            },{
                text: Zeolides.etiquetas.textAceptar,
                iconCls: 'aceptar',
                name: 'aceptarApp',
                id: 'aceptarApp',
                formBind: true,
                tooltip : Zeolides.etiquetas.tooltipAceptar,
                action:   (this.uninstall != false) ? 'unistallApp' : 'aceptarApp'
            }]
        });
        this.listeners = {
            beforedestroy:function(){
                Ext.getCmp('gridPacked').getSelectionModel().deselect(Ext.getCmp('gridPacked').getSelectionModel().getLastSelected());
            }
        },
        this.layout = 'fit',
            //this.autoShow = true,
            this.modal = true,
            this.resizable = false,
            this.closable = true,
            this.constrain = true,
            this.closeAction = 'destroy',
            this.id = 'winAux',
            this.name = 'winAux',
            this.items = [this.form],

            this.callParent(arguments);
    }
});