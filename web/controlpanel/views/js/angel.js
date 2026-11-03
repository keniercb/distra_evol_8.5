Ext.ns("controlpanel.views.angel");
controlpanel.views.angel.MyRegion4 =
    Ext.extend(Ext.Panel, {
    constructor:function (config) {
        config = config || {};
        
        this.button9 = new Ext.Button({
            text:"My button",
            x:373, y:-7,
            xtype:"button"
        });
        this.text3 = new Ext.form.field.Text({
            x:211, y:-5,
            xtype:"textfield"
        });
        this.button7 = new Ext.Button({
            text:"My button",
            x:362, y:18,
            xtype:"button"
        });
        this.button5 = new Ext.Button({
            text:"My button",
            x:214, y:21,
            xtype:"button"
        });
        this.button3 = new Ext.Button({
            text:"My button",
            x:57, y:21,
            xtype:"button"
        });
        this.toolbar3 = new Ext.toolbar.Toolbar({
            height:30, x:0, y:0,
            xtype:"toolbar",
            items:[
                this.button3, this.button5, this.button7, this.text3, this.button9
            ]
        });
        this.fieldset3 = new Ext.form.FieldSet({
            title:"Mi grupo de componentes:",
            layout:"absolute",
             x:15,
             y:20,
            xtype:"fieldset",
            width:582,
            height:102,
            items:[
                this.button3, this.button5, this.button7
            ]
        });

        this.MyRegion4Panel2 = new Ext.Panel({
            xtype:"panel",
            region:"center",
            title:"Panel 3",
            layout:"absolute",
            width:598,
            x:0,
            y:195,
            height:179,
            items:[
                this.fieldset3
            ]
        });
        this.gridpanel3 = new Ext.grid.Panel({
            title:"grid",
            width:602,
            heigth:100,
            border:true,
            columns:[
                {"header":"Atributo", "width":120, "sortable":true, "dataIndex":"data", "triStateSort":false}
            ],
            x:0, y:30,
            xtype:"gridpanel",
            height:143
        });
        this.MyRegion4Panel1 = new Ext.Panel({
            xtype:"panel",
            title:"Panel 2",
            region:"north",
            height:194,
            width:598,
            layout:"absolute",
            x:1, y:1,
            items:[
                this.toolbar3, this.gridpanel3
            ]
        });


        Ext.apply(config, {
            title:"Region4",
            width:600,
            height:400,
            layout:"border",
            xtype:"panel",
            items:[
                this.MyRegion4Panel1, this.MyRegion4Panel2
            ]
        });

       controlpanel.views.angel.MyRegion4.superclass.constructor.call(this, config);
    }

});
