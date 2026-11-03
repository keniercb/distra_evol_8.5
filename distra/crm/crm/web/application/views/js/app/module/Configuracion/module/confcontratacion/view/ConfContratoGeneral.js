Ext.define('ConfContratacion.view.ConfContratoGeneral', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confcontratogeneral',
    layout:'border',
    frame: true,
    border: false,
    trackResetOnLoad: true,
    defaults: {
        style: 'margin:5px 5px;',
        bodyStyle: 'background:#DFE9F6;padding:5px;',
        border: false
    },
    fieldDefaults: {labelAlign: 'top'},
    initComponent: function () {
        this.getLang();
        this.idcontratogeneral = Ext.create('Ext.form.field.Hidden',{
            name:'idcontratogeneral'
        });
        this.active = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'activopersona',
            allowBlank: true,
            labelWidth: 230,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',
            fieldLabel: this.etiquetas.lbPersona
        }; 
        
        //Configuracion de Contrato

        this.mostrar_hitos_areas = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'mostrar_hitos_areas',
            fieldLabel: "Mostrar hitos propios",
            allowBlank: true,
            labelWidth: 230,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',
            listeners:{
                afterrender: function(yo){
                    tip = Ext.create('Ext.tip.ToolTip', {
                        target: yo.getEl(),
                        html: 'Activo: Muestra los contratos que esten en el dominio o tengan al menos un hito en el dominio Inactivo:  Muestra los contratos que esten en el dominio  ',
                        autoDestroy: true
                    });
                    // campo.tip.showBy(campo.getEl());
                }
            }
                       
        };

        this.mostrar_todos = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'mostrar_todos',
            fieldLabel: "Mostrar suplementos",
            allowBlank: true,
            labelWidth: 230,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',
            listeners:{
                afterrender: function(yo){
                    console.log('afterrender', yo)
                    tip = Ext.create('Ext.tip.ToolTip', {
                        target: yo.getEl(),
                        html: 'Activo:  Muestra todos los contratos incluyendo original y cada uno de los suplementos Inactivo:  Muestra solo el ultimo contrato o suplemento  ',
                        autoDestroy: true
                    });
                    // campo.tip.showBy(campo.getEl());
                }
            }
                     
        };

        this.increment_sign = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'increment_sign',
            fieldLabel: "Incrementar al firmar",
            allowBlank: true,
            labelWidth: 230,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',
            listeners:{
                afterrender: function(yo){
                    console.log('afterrender', yo)
                    tip = Ext.create('Ext.tip.ToolTip', {
                        target: yo.getEl(),
                        html: 'Activo: El número consecutivo se genera al firmar el contrato Inactivo: El número consecutivo se genera al crear el contrato  ',
                        autoDestroy: true
                    });
                    // campo.tip.showBy(campo.getEl());
                }
            }
                
        };

        this.numero_manual = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'numero_manual',
            fieldLabel: "Numero manual",
            allowBlank: true,
            labelWidth: 230,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',
            listeners:{
                afterrender: function(yo){
                    console.log('afterrender', yo)
                    tip = Ext.create('Ext.tip.ToolTip', {
                        target: yo.getEl(),
                        html: 'Activo: El número de contrato se introduce manualmente Inactivo: El número de contrato es generado por el sistema ',
                        autoDestroy: true
                    });
                    // campo.tip.showBy(campo.getEl());
                }
            }
        };
        

        this.mostrar_todas_area = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'mostrar_todas_area',
            fieldLabel: "Mostrar todas las áreas",
            allowBlank: true,
            labelWidth: 230,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',
            listeners:{
                afterrender: function(yo){
                    console.log('afterrender', yo)
                    tip = Ext.create('Ext.tip.ToolTip', {
                        target: yo.getEl(),
                        html: 'Activo:  muestra las áreas a partir de la entidad logueada Inactivo:  muestra todas ',
                        autoDestroy: true
                    });
                    // campo.tip.showBy(campo.getEl());
                }
            }
                       
        };

        this.mostrar_filtro_area = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'mostrar_filtro_area',
            fieldLabel: "Mostrar todas áreas en filtro",
            allowBlank: true,
            labelWidth: 230,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',
            listeners:{
                afterrender: function(yo){
                    console.log('afterrender', yo)
                    tip = Ext.create('Ext.tip.ToolTip', {
                        target: yo.getEl(),
                        html: ' muestra todos las áreas para el filtro',
                        autoDestroy: true
                    });
                    // campo.tip.showBy(campo.getEl());
                }
            }
                        
        };

        this.estructura_persona_nomenclador = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'estructura_persona_nomenclador',
            fieldLabel: "Estructura y persona por nomenclador",
            allowBlank: true,
            labelWidth: 230,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',
            listeners:{
                afterrender: function(yo){
                    console.log('afterrender', yo)
                    tip = Ext.create('Ext.tip.ToolTip', {
                        target: yo.getEl(),
                        html: 'Activo: Carga estructura y persona desde el nomenclador CRM Inactivo: Carga estructura y persona desde el nomenclador de RHH',
                        autoDestroy: true
                    });
                    // campo.tip.showBy(campo.getEl());
                }
            }
                    
        }; 

        this.cliente_tipocontrato = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'cliente_tipocontrato',
            fieldLabel: "Un cliente por tipo de contrato",
            allowBlank: true,
            labelWidth: 230,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',
            listeners:{
                afterrender: function(yo){
                    console.log('afterrender', yo)
                    tip = Ext.create('Ext.tip.ToolTip', {
                        target: yo.getEl(),
                        html: 'Activo: Solo puede haber activo un cliente por tipo de contrato (por cada clase) Inactivo:  No hay asociación entre cliente tipo contrato',
                        autoDestroy: true
                    });
                    // campo.tip.showBy(campo.getEl());
                }
            }
                      
        };   

        this.cbEstadoOfertaInsert = Ext.create('Ext.form.field.ComboBox',{
            fieldLabel: this.etiquetas.lbEstadoOfertaInsert,
            validateOnBlur: false,
            enableKeyEvents: true,
            multiSelect: false,
            queryMode: 'local',
            name: 'idestadooferta',
            listEmptyText: 'No existen datos que mostrar.',
            displayField: 'denominacion',
            valueField: 'idestado',
            width: 400,
            store: Ext.create('ConfContratacion.store.Estado'),
            allowBlank:true,

            labelAlign: 'left',
            labelWidth: 230,
            labelStyle: 'color:hsl(214, 74%, 31%); font-weight: bold', 

        });

        //Configuracion DataSource Jasper

        this.hdjasper = Ext.create('Ext.form.field.Hidden',{
            name:'jasper', 
           
        });

        this.datasource = Ext.create('Ext.form.field.Text', {
            fieldLabel: "Data Source",
            name: 'datasource',
            labelAlign: 'left',
            localId:'mail',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            allowBlank:true,
            width: 500,
            margin: '10 5 0 0'
            
        });

         //Configuracion de mail

         this.hdcorreo = Ext.create('Ext.form.field.Hidden',{
            name:'correo'
         });

         this.active_correo = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'activo_correo',
            allowBlank: true,            
            labelWidth: 230,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: true,
            labelAlign: 'left',
            fieldLabel: "Correo Electronico",
         }


         this.hdconfcorreo = Ext.create('Ext.form.field.Hidden', {
            name:'confcorreo'
         })         
   
        this.username = Ext.create('Ext.form.field.Text', {
            fieldLabel: "Nombre usuario",
            name: 'username',
            labelAlign: 'left',
            localId:'mail',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            allowBlank:false,
            
        });

        this.password = Ext.create('Ext.form.field.Text', {
            fieldLabel: "Contraseña",
            inputType: 'password',
            name: 'password',
            labelAlign: 'left',
            localId:'mail',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            allowBlank:false
        });       

        this.from = Ext.create('Ext.form.field.Text', {
            fieldLabel: "Remitente",
            name: 'from',
            labelAlign: 'left',
            localId:'mail',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            allowBlank:false
        });

        this.fromname = Ext.create('Ext.form.field.Text', {
            fieldLabel: "Alias",
            name: 'fromname',
            labelAlign: 'left',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            localId:'mail',
            value: 'Gestion comercial',
            allowBlank:false
        });

        this.mailer = Ext.create('Ext.form.field.Text', {
            fieldLabel: "Mailer",
            name: 'mailer',
            labelAlign: 'left',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            localId:'mail',
            allowBlank:true,
            value: "smtp",
        });

        this.host = Ext.create('Ext.form.field.Text', {
            fieldLabel: "Host",
            name: 'host',
            labelAlign: 'left',
            localId:'mail',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            value: 'smtp.xetid.cu',
            allowBlank:true
        });

        this.port = Ext.create('Ext.form.field.Text', {
            fieldLabel: "Port",
            name: 'port',
            labelAlign: 'left',
            localId:'mail',
            allowBlank:true,
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            value: "25"
        });

        this.template = Ext.create('Ext.form.field.Text', {
            fieldLabel: "Template",
            name: 'template',
            labelAlign: 'left',
            localId:'mail',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            allowBlank:true,
            value:"plantilla.html",
            disabled:true
        });

        this.send_attachement = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'send_attachement',
            fieldLabel: "send_attachement",
            allowBlank: false,
            labelWidth: 130,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',           
        }

        this.check_attachement  = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'check_attachement',
            fieldLabel: "check_attachement",
            allowBlank: true,
            labelWidth: 130,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',           
        }

        this.enabled   = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'enabled',
            fieldLabel: "enabled",
            allowBlank: true,
            labelWidth: 130,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',           
        }

        this.smtpdebug  = Ext.create('Ext.form.field.Text', {
            fieldLabel: "smtpdebug",
            name: 'smtpdebug',
            labelAlign: 'left',
            localId:'mail',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            allowBlank:true,
            value:"0"
        });

        this.smtpsecure  = Ext.create('Ext.form.field.Text', {
            fieldLabel: "smtpsecure",
            name: 'smtpsecure',
            labelAlign: 'left',
            localId:'mail',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            allowBlank:true,
            value:"none"
        });

        this.charset  = Ext.create('Ext.form.field.Text', {
            fieldLabel: "charset",
            name: 'charset',
            labelAlign: 'left',
            localId:'mail',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            allowBlank:true,
            value:"UTF-8"
        });

        this.smtpauth  = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'smtpauth',
            fieldLabel: "smtpauth",
            labelWidth: 130,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'left',
            allowBlank: false 
        };

        this.timeout  = Ext.create('Ext.form.field.Text', {
            fieldLabel: "timeout",
            name: 'timeout',
            labelAlign: 'left',
            localId:'mail',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',
            allowBlank:true,
            value:"50"
        });

        this.subject  = Ext.create('Ext.form.field.Text', {
            fieldLabel: "Asunto",          
            name: 'subject',
            labelAlign: 'left',
            labelStyle: 'margin:5px ; color:hsl(214, 74%, 31%); font-weight: bold',                      
            localId:'mail',
            allowBlank:true,            
           
            
        });

      
     

     

        this.items = [

            {
                region:'center',                
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },                
             
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Configuración de Contrato', 
                        frame: true,
                        border: false,    
                        flex:1,
                        layout: 'vbox',
                        items:[
                            this.idcontratogeneral,
                            this.cbEstadoOfertaInsert,
                            this.active,
                            this.mostrar_hitos_areas,
                            this.mostrar_todos ,
                            this.increment_sign , 
                            this.numero_manual,
                            this.mostrar_todas_area,
                            this.mostrar_filtro_area,
                            this.estructura_persona_nomenclador,
                            this.cliente_tipocontrato ,
                            this.hdjasper,
                            this.datasource

                            
                        ]
                    },
                    
                    {
                        xtype: 'fieldset',
                        frame: true,
                        title: 'Configuración email',  
                        border: false,                                                                
                        layout:'form',
                        flex:1,
                        margin: '0 5 0 20',
                        
                        items:[
                            {
                                region:'north',
                                layout:'form',
                                border:false,
                                bodyStyle: 'background-color: transparent;', 
                                height:60,
                                items:[this.hdcorreo, this.active_correo]
                                
                            },
                            {
                                xtype: 'form',                               
                                itemId: 'formemail',
                                border:false,
                                bodyPadding:0,  
                                width:800,                                 
                                bodyStyle: 'background-color: transparent;', 
                                name:'fpcorreo',
                                region:'center',
                                items:[
                                    this.hdconfcorreo ,                                   
                                    this.username,
                                    this.password,
                                    this.from,
                                    this.fromname,
                                    this.mailer,
                                    this.host,
                                    this.port,
                                    this.template,                                  
                                    this.smtpdebug,
                                    this.smtpsecure ,
                                    this.charset,                                    
                                    this.timeout ,
                                    this.subject,
                                    this.smtpauth ,
                                    this.send_attachement,
                                    this.check_attachement,
                                    this.enabled                                                                      
                                ]
                            }
                        ]
                        
                    }

                ]
            }
                    
        ];

            //this.hdspace, this.sfspace

        

        this.btnSave = Ext.create('Ext.Button', {
            text: this.etiquetas.lbSave,
            tooltip: this.etiquetas.qtipApply,
            iconCls: 'guardar',
            disabled: false,
            action: 'save'
        });

        this.btnCancel = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnCancel,
            tooltip: this.etiquetas.qtipCancel,
            iconCls: 'cancelar',
            action: 'cancel'
        });

        this.buttons = [this.btnCancel, this.btnSave];

        this.callParent();       
        
    }
});
