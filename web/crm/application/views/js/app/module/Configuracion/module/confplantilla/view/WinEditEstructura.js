Ext.define('ConfPlantilla.view.WinEditEstructura', {
    extend: 'Ext.window.Window',
    alias: 'widget.wineditestructura',
    frame: false,
    margin: false,
    border: false,
    width: 480,
    closable : true,
    closeAction: 'hide',
    modal: true,
    actionInsert: true,
    resizable: false,
    estructype: 0,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.initBody();

        me.initButtons();

        me.callParent();

        Ext.TaskManager.start({
            run: this.checkWindow.bind(me),
            interval: 100,
            scope: this
        });
    },
    initBody: function(){
        var me = this;

        var storeRegion = Ext.create('Ext.data.ArrayStore',{
            fields: ['identificador', 'denominacion'],
            data : [
                ['t', 'Encabezado'],
                ['b', 'Pie de página']
            ]
        });

        var storePosicion = Ext.create('Ext.data.ArrayStore',{
            fields: ['identificador', 'denominacion'],
            data : [
                ['h', 'Horizontal'],
                ['l', 'Izquierda'],
                ['c', 'Centro'],
                ['r', 'Derecha']
            ]
        });

        me.formEstructura = Ext.create('Ext.form.Panel', {
            border: false,
            bodyStyle : {padding: '10px 10px 10px 10px'},
            frame: true,
            fieldDefaults: {
                labelAlign: 'top'
            },
            items: [
                {
                    layout: 'column',
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [{
                            xtype: 'combobox',
                            fieldLabel: this.etiquetas.lbRegion,
                            store: storeRegion,
                            valueField: 'identificador',
                            displayField: 'denominacion',
                            hiddenName: 'identificador',
                            triggerAction: 'all',
                            forceSelection: true,
                            name: 'region',
                            mode: 'local',
                            emptyText: me.etiquetas.lbEmptyText,
                            columnWidth: 0.54,
                            anchor: '90%',
                            margin: '0 10 0 0',
                            allowBlank: false
                        },{
                            xtype: 'combobox',
                            fieldLabel: this.etiquetas.lbPosicion,
                            store: storePosicion,
                            valueField: 'identificador',
                            displayField: 'denominacion',
                            hiddenName: 'identificador',
                            triggerAction: 'all',
                            forceSelection: true,
                            name: 'posicion',
                            mode: 'local',
                            emptyText: me.etiquetas.lbEmptyText,
                            columnWidth: 0.46,
                            anchor: '100%',
                            allowBlank: false
                        }
                    ]
                },
                Ext.create('ConfPlantilla.view.TextoEditor', {
                    fieldLabel: this.etiquetas.lbContenidoTexto,
                    allowBlank: false,
                    name: 'texto',
                    height: 180,
                    anchor: '100%'
                }),{
                xtype: 'filefield',
                name: 'imagen',
                editable: false,
                fieldLabel: me.etiquetas.lbContenidoImagen,
                allowBlank: false,
                buttonConfig: {
                    text: false,
                    tooltip: me.etiquetas.lbTtpBtnSearch,
                    iconCls : 'icondistra-buscar'
                },
                anchor: '100%',
                regex: /.+\.(jpg|png|jpeg)/i,
                regexText : me.etiquetas.onlyFileExtension,
                cls: 'pr-btn-upload',
                getFileSize: function(sizebyte){
                    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
                        fSize = sizebyte,
                        i=0;

                    while(fSize>900){fSize/=1024;i++;}

                    return (Math.round(fSize*100)/100)+' '+fSExt[i];
                },
                validator: function(val){
                    if(val && this.rendered){
                        var file = this.getEl().down('input[type=file]').dom.files[0],
                            maxSize = 300,
                            unidadSize = 'KB',
                            fileSize, isValid;
                        
                        if(file){
                            fileSize = this.getFileSize(file.size).split(' ');
                            isValid = (fileSize[0] <= maxSize && fileSize[1] == unidadSize)?true: false;
                            return (isValid)?true: me.etiquetas.maxSizeFile;
                        }
                    }
                    return true;
                }
            },{
                xtype: 'hidden',
                name: 'img',
                value: ''
            },{
                xtype: 'hidden',
                name: 'idestructura',
                value: 0
            }]
        });

        me.items = [me.formEstructura];
    },
    initButtons: function(){
        var me = this;

        me.buttons = [
            {
                text: me.etiquetas.lbBtnCancel,
                iconCls: 'icondistra-cancelar',
                tooltip: me.etiquetas.qtipCancel,
                action: 'cerrar'
            },{
                text: me.etiquetas.lbBtnApply,
                iconCls: 'icondistra-aplicar',
                tooltip: me.etiquetas.qtipApply,
                disabled: true,
                action: 'aplicar'
            },{
                text: me.etiquetas.lbBtnAccept,
                iconCls: 'icondistra-aceptar',
                tooltip: me.etiquetas.qtipAccept,
                disabled: true,
                action: 'aceptar'
            }
        ];
    },
    initState: function(){
        var me = this;
        me.setTitle( me.etiquetas[(me.actionInsert)?'titleWinAdicionarEstructura':'titleWinModificarEstructura'] );
        me.down('button[action=aplicar]').setVisible(me.actionInsert);
    },
    resetComponents: function(){
        var me = this;
        me.formEstructura.getForm().reset();
        me.formEstructura.down('field:first').focus(false, 500);
    },
    loadValues: function(val){
        var me = this;
        me.formEstructura.getForm().loadRecord(val);
    },
    setActionInsert: function(action){
        this.actionInsert = !!action;
    },
    getActionInsert: function(){
        return this.actionInsert;
    },
    show:function(estructype){
        var me = this;

        me.initState();

        me.callParent();

        me.updateFieldsByEstructuraType(estructype);
        me.resetComponents();
    },
    checkWindow: function () {
        var me= this,
            form = me.formEstructura.getForm(),
            invalid = form.hasInvalidField();

        me.down('button[action=aplicar]').setDisabled(invalid);
        me.down('button[action=aceptar]').setDisabled(invalid);
    },
    updateFieldsByEstructuraType: function(estructype){
        var me = this,
            form = me.formEstructura,
            fieldText = form.down('field[name=texto]'),
            fieldImg = form.down('field[name=imagen]'),
            isEstructText = estructype == 1;

        me.estructype = estructype;

        fieldText.setDisabled(!isEstructText);
        fieldText.setVisible(isEstructText);

        fieldImg.setDisabled(isEstructText || !me.actionInsert);
        fieldImg.setVisible(!isEstructText && me.actionInsert);

        me.center();
    }
});
