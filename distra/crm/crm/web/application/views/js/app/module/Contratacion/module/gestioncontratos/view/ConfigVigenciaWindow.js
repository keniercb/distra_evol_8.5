Ext.define('GestionContrato.view.ConfigVigenciaWindow', {
    // extend: 'Ext.window.Window',
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.configvigenciawindow',
    margin: false,
    width: 400,
    minWidth: 400,
    // height: 350,
    maxHeight: 500,
    closable: true,
    closeAction: 'hide',
    modal: true,
    resizable: false,
    defectoExcederse:'#FFF4c2',
    defectoExcedido:'#ffe2e2',
    defectoDias:30,
    // bodyStyle: {
    //     padding: '10px',
    //     background: 'white'
    // },
    // bodyCls: 'detallessolicitud',
    // autoScroll: true,
    initComponent: function () {
        var self=this;
        self.etiquetas = LangMgr.getLang(self);
        // console.log('construct', self, self.etiquetas)

        self.title=self.etiquetas.qtipConfigVigencia;
        // var colores=[
        //     {'id':'#FFFF99','nombre':'Amarillo claro'},
        //     {'id':'#FFFF66','nombre':'Amarillo medio'},
        //     {'id':'yellow','nombre':'Amarillo oscuro'},
        //     {'id':'#FFF4c2','nombre':'Naranja claro'},
        //     {'id':'#ffcf99','nombre':'Naranja medio'},
        //     {'id':'#ff9c33','nombre':'Naranja oscuro'},
        //     {'id':'#ffe2e2','nombre':'Rosado claro'},
        //     {'id':'#FF99FF','nombre':'Rosado medio'},
        //     {'id':'#ff82ab','nombre':'Rosado oscuro'},
        //     // {'id':'#ff6a6a','nombre':'Rojo claro'},
        //     {'id':'#FF5050','nombre':'Rojo claro'},
        //     {'id':'#B41E3C','nombre':'Rojo medio'},
        //     {'id':'#CC0000','nombre':'Rojo oscuro'},
        // ],
        var colores=[
                {'id':'#FFF4c2','nombre':'Color  1'},//defecto a excederse
                // {'id':'#B4B478','nombre':'Color  1,2'},
                {'id':'#ffe2e2','nombre':'Color  2'},// defecto excedido
                {'id':'#FFFF99','nombre':'Color 3'},
                {'id':'#FFFF66','nombre':'Color 4'},
                {'id':'#ffcf99','nombre':'Color  5'},
                // {'id':'#FFFFCC','nombre':'Color  4.9'},
                {'id':'#FFCC99','nombre':'Color  6'},
                {'id':'yellow','nombre':'Color  7'},
                {'id':'#FF9966','nombre':'Color  8'},
                {'id':'#ff9c33','nombre':'Color  9'},
                {'id':'#CC6600','nombre':'Color  10'},
            {'id':'#FF99FF','nombre':'Color  11'},
                {'id':'#CC99FF','nombre':'Color  12'},
                {'id':'#FF99CC','nombre':'Color  13'},
                {'id':'#ff82ab','nombre':'Color  14'},
                {'id':'#FF6699','nombre':'Color  15'},
                // {'id':'#FF6666','nombre':'Color  15'},
                {'id':'#F05A78','nombre':'Color  16'},
                {'id':'#FF5050','nombre':'Color  17'},
                {'id':'#F03C78','nombre':'Color  18'},
        ],
            // colorAExederse='#FFF4c2',
            // colorExcedido='#ffe2e2',
        formato=Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<div class="x-boundlist-item">' +
            // '<div style="background-color:{id};">&nbsp;&nbsp;&nbsp;&nbsp;</div>' +
            '<b style="background-color:{id}; width:80px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>' +
            '&nbsp;{nombre}' +
            '</div>',
            '</tpl>'
        );
        // var cssCampoColorAExcederse=document.createElement('style');
        // var cssCampoColorExcedida=document.createElement('style');
        // cssCampoColorAExcederse.id='cssCampoColorAExcederse';
        // cssCampoColorExcedida.id='cssCampoColorExcedida';
        // cssVigenciaAExcederse.innerHTML='.'
        self.items=
            {
            xtype:'form',
            frame:true,
                trackResetOnLoad:true,
            items:[
                {
                    xtype:'fieldset',
                    title:self.etiquetas.lbAproxVigencia,
                    layout:'hbox',
                    defaults:{flex:1, margin:'0 3 10 3'},
                    items:[
                        {
                            xtype:'checkbox',
                            checked:true,
                            boxLabel:'Activado',
                            itemId:'activadoexpiracion',
                            name:'activadoexpiracion',
                            flex:null,
                            margin:'18 3 0 0',
                            // hidden:true,
                            listeners:{
                                change: function(yo, valor){
                                    // console.log('cambio activado', valor)
                                    self.down('#vercoloraexcederse').setDisabled(!valor);
                                    self.down('#colorfilaaexcederse').setDisabled(!valor);
                                    self.down('#cantidaddiasaviso').setDisabled(!valor);
                                    self.down('#colorfilaaexcederse').allowBlank=!valor;
                                    self.down('#cantidaddiasaviso').allowBlank=!valor;
                                    self.down('#colorfilaaexcederse').validate();
                                    self.down('#cantidaddiasaviso').validate();
                                    // console.log(self.down('#defecto').getValue(), self.down('#colorfilaaexcederse').anterior)
                                    self.down('#colorfilaaexcederse').setValue(
                                        valor?self.down('#colorfilaaexcederse').originalValue:'');
                                    self.down('#cantidaddiasaviso').setValue(
                                        valor?self.down('#cantidaddiasaviso').originalValue:'');

                                }
                            }
                        },
                        {
                            xtype:'textfield',
                            margin:'18 -3 10 3',
                            itemId:'vercoloraexcederse',
                            readOnly:true,
                            cls:'vigencia_a_excederse',
                            flex:null,
                            width:20
                        },
                        {
                            xtype:'combo',
                            itemId:'colorfilaaexcederse',
                            name:'colorfilaaexcederse',
                            labelAlign:'top',
                            editable:false,
                            fieldLabel:'Color',
                            displayField:'nombre',
                            valueField:'id',
                            store:Ext.create('Ext.data.Store',{
                                fields:['id','nombre'],
                                data:colores
                            }),
                            tpl:formato,
                            allowBlank:false,
                            validator:function(valor){
                                // console.log(self.down('#colorfilaexpiracion').getValue(), valor)
                                if(self.down('#colorfilaexpiracion').getValue()==
                                    self.down('#colorfilaaexcederse').getValue() && valor)
                                    return self.etiquetas.msgNoCoincideColorExpirado;;
                                return true;
                            },
                            listeners:{
                                select:function(yo){
                                    // console.log('selecttt2:', document.getElementById('cssVigenciaAExcederse').innerHTML)
                                    document.getElementById('cssVigenciaAExcederse').innerHTML=
                                        '.vigencia_a_excederse .x-grid-cell, .vigencia_a_excederse input{' +
                                        '    background: '+yo.getValue()+' !important;' +
                                        // '    color: #CC6600;' +
                                        '}'
                                    self.down('#colorfilaexpiracion').validate();
                                    // console.log('selecttt2:', document.getElementById('cssVigenciaAExcederse').innerHTML)
                                }
                            }
                        },
                        {
                            xtype:'numberfield',
                            itemId:'cantidaddiasaviso',
                            name:'cantidaddiasaviso',
                            labelAlign:'top',
                            fieldLabel:'Dias aviso',
                            allowExponential:false,
                            allowDecimals:false,
                            // value:15,
                            minValue:1,
                            maxValue:9999,
                            allowBlank:false,
                            listeners:{
                                change:function(yo){
                                    // console.log(me.getView())
                                    // me.getView();
                                }
                            }
                        },

                    ]
                },
                {
                    xtype: 'fieldset',
                    title: self.etiquetas.lbExpVigencia,
                    layout: {type:'hbox',  pack:'end'},
                    // layout: 'column',
                    defaults:{margin:'0 3 10 3', flex:1},
                    items: [
                        {
                            xtype:'checkbox',
                            checked:true,
                            boxLabel:'Activado',
                            itemId:'activadoexpirado',
                            name:'activadoexpirado',
                            // width:60,
                            margin:'18 3 0 0',
                            flex:null,
                            // hidden:true,
                            listeners:{
                                change: function(yo, valor){
                                    self.down('#activadoexpiracion').setValue(valor);
                                    self.down('#activadoexpiracion').setDisabled(!valor);
                                    self.down('#vercoloraexcdido').setDisabled(!valor);
                                    self.down('#colorfilaexpiracion').setDisabled(!valor);
                                    self.down('#colorfilaaexcederse').allowBlank=!valor;
                                    self.down('#cantidaddiasaviso').allowBlank=!valor;
                                    self.down('#colorfilaaexcederse').validate();
                                    self.down('#cantidaddiasaviso').validate();
                                    self.down('#colorfilaexpiracion').allowBlank=!valor;
                                    self.down('#colorfilaexpiracion').validate();
                                    self.down('#colorfilaexpiracion').setValue(
                                        valor?self.down('#colorfilaexpiracion').originalValue:'');
                                    self.down('#defecto').setDisabled(!valor);
                                }
                            }
                        },
                        {
                            xtype:'textfield',
                            margin:'18 -3 10 3',
                            itemId:'vercoloraexcdido',
                            readOnly:true,
                            cls:'vigencia_excedida',
                            flex:null,
                            width:20
                        },
                        {
                            xtype: 'combo',
                            itemId:'colorfilaexpiracion',
                            name:'colorfilaexpiracion',
                            labelAlign: 'top',
                            fieldLabel: 'Color',
                            editable:false,
                            displayField: 'nombre',
                            valueField: 'id',
                            // flex:0.5,
                            // columnWidth:0.5,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['id', 'nombre'],
                                data: colores
                            }),
                            tpl: formato,
                            allowBlank:false,
                            validator:function(valor){
                                if(self.down('#colorfilaexpiracion').getValue()==
                                    self.down('#colorfilaaexcederse').getValue() && valor)
                                    return self.etiquetas.msgNoCoincideColorExpiracion;
                                return true;
                            },
                            listeners: {
                                select: function (yo) {
                                    console.log('selecttt2:', document.getElementById('cssVigenciaExcedida').innerHTML)
                                    document.getElementById('cssVigenciaExcedida').innerHTML =
                                        '.vigencia_excedida .x-grid-cell, .vigencia_excedida input{' +
                                        '    background: ' + yo.getValue() + ' !important;' +
                                        // '    color: #CC6600;' +
                                        '}'
                                    self.down('#colorfilaaexcederse').validate();
                                    // console.log('selecttt2:', document.getElementById('cssVigenciaExcedida').innerHTML)
                                }
                            }
                        },
                        {
                            xtype:'checkbox',
                            boxLabel:'Valores por defecto',
                            itemId:'defecto',
                            margin:'18 3 0 3',
                            listeners:{
                                change:function(yo, valor){

                                    self.down('#cantidaddiasaviso').setReadOnly(valor);
                                    self.down('#colorfilaexpiracion').setReadOnly(valor);
                                    self.down('#colorfilaaexcederse').setReadOnly(valor);
                                    self.down('#activadoexpiracion').setReadOnly(valor);
                                    self.down('#activadoexpirado').setReadOnly(valor);
                                    if(valor){
                                        self.down('#activadoexpiracion').setValue(true);
                                        self.down('#cantidaddiasaviso').anterior=self.down('#cantidaddiasaviso').getValue();
                                        self.down('#cantidaddiasaviso').setValue(self.defectoDias);
                                        self.down('#colorfilaaexcederse').anterior=self.down('#colorfilaaexcederse').getValue();
                                        self.down('#colorfilaaexcederse').setValue(self.defectoExcederse);
                                        self.down('#colorfilaexpiracion').anterior=self.down('#colorfilaexpiracion').getValue();
                                        self.down('#colorfilaexpiracion').setValue(self.defectoExcedido);
                                    }else{
                                        self.down('#cantidaddiasaviso').setValue(self.down('#cantidaddiasaviso').anterior);
                                        self.down('#colorfilaaexcederse').setValue(self.down('#colorfilaaexcederse').anterior);
                                        self.down('#colorfilaexpiracion').setValue(self.down('#colorfilaexpiracion').anterior);
                                    }
                                    self.down('#colorfilaaexcederse').fireEvent('select', self.down('#colorfilaaexcederse'));
                                    self.down('#colorfilaexpiracion').fireEvent('select', self.down('#colorfilaexpiracion'));
                                    self.down('#colorfilaaexcederse').validate();
                                    self.down('#colorfilaexpiracion').validate();
                                }
                            }
                        }
                    ]
                },
                {
                    xtype:'textfield',
                    hidden:true,
                    itemId:'idconfig',
                    name:'idconfig',
                }
            ]
        };
        console.log('3')
        self.callParent();
        console.log('4')
    }
});