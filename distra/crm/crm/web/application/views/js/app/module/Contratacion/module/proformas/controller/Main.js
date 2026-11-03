Ext.define('Proformas.controller.Main', {
    extend: 'Ext.app.Controller',
    views: ['Main'],

    refs: [
        {ref: 'Main', selector: 'pro_main'},
        {ref: 'MainWindowProforma', selector: 'MainWindowProforma'},
        {ref: 'westernTree', selector: 'pro_westerntree'}
    ],

    init: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                'pro_main': {
                    render: this.onRenderAll,
                },
                'pro_main centergrid': {
                    render: this.onRendergrid,
                    selectionchange: this.onItemSelect
                },
                'pro_main gridpanel[itemId=griddocumentos]': {
                    selectionchange: this.onDocumentSelect
                },
                'pro_main button[action=print],menuitem[action=print]': {
                    click: this.printTemplate
                },
                'pro_main button[action=clone],menuitem[action=clone]': {
                    click: this.cloneTemplate
                },
                'pro_main button[action=heredar],menuitem[action=heredar]': {
                    click: this.heredarProforma
                },
                'heredarwindow[itemId=heredarproformas] button[action=acept]': {
                    click: this.guardarHerencia
                },
                'pro_main button[action=export],menuitem[action=export]': {
                    click: this.exportarProforma
                },
                'pro_main button[action=adicionardocumento],menuitem[action=adicionardocumento]': {
                    click: this.adicionarDocumento
                },
                'pro_main button[action=eliminardocumentos],menuitem[action=eliminardocumentos]': {
                    click: this.eliminarDocumentos
                },
            }
        });
    },
    onRendergrid: function (grid) {
        if (grid.modelName) {
            grid.fireEvent('onadded', grid);
        }
    },
    onRenderAll: function (grid) {
        console.log('onRenderAll')
        var me = this,
            mask = new Ext.LoadMask(grid, {msg: this.etiquetas.msgLoadConf});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getConfiguraciones'}, this),
            scope: this,
            callback: function (options, success, response) {
                mask.hide();
                var response = Ext.decode(response.responseText);
                // if(true){
                if(response.length>0 && response[0]['activo']){
                    grid.down('#griddocumentos').setDisabled(false);
                    grid.down('#griddocumentos').getStore().load();
                }
            }
        });
    },
    onItemSelect: function (sm) {
        var grid = this.getMain();
        if (!grid.noactions) {
            var count = sm.getCount(),
                print = grid.btnPrint,
                exportar = grid.btnExport,
                duplicar = grid.btnDuplicar;

            if (count == 1) {
                print.enable();
                exportar.enable();
                duplicar.enable();
            } else {
                print.disable();
                exportar.disable();
                duplicar.disable();
            }
        }
    },
    onDocumentSelect: function(sm, records){
        var grid = sm.view.up('#griddocumentos');
        grid.down('#eliminardocumentos').setDisabled(records.lenght==0)
    },
    printTemplate: function (cmp) {
        // console.log('printTemplate')
        var me = this,
            recordSelected = me.getMain().down('centergrid').getSelectionModel().getSelection()[0],
            id = recordSelected.get('idproforma'),
            idplantilla = recordSelected.get('idplantilla');

        var config = {
            nombrereporte: 'proformaA4Vertical',
            idplantilla: idplantilla,
            params: [
                {name: 'idproforma', value: id, datatype: 'int'}
            ]
        };
        Ext.create('Ext.ux.Report', config).show();

    },
    cloneTemplate: function (cmp) {
        if (cmp.disabled) {
            return;
        }
        cmp.modelName = cmp.up('centergrid').modelName;
        ModuleMgr.get('BaseModule').getMainWindowController().showWindow(cmp);
    },

    heredarProforma: function(button){
        var me=this;
        var win=Ext.create('BaseModule.view.HeredarWindow',{
            title:'Heredar proformas',
            itemId:'heredarproformas',
            grid: button.up('grid')
        }).show();
    },

    guardarHerencia: function(button){
        var me=this, winheredar=button.up('window');
        // console.log('HEREdar proforma', me.getMain().down('pro_westerntree').getSelectionModel().getSelection()[0])
        Ext.MessageBox.show({
            msg: me.etiquetas.lbGuardando,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        // var idprocesos=winheredar.down('#idproceso').getValue().trim().replace(' ', ',');
//             me.down('#form_heredar').submit({
        winheredar.down('#form_heredar').submit({
            url: UtilsFn.buildUrl({action: 'guardarHerenciaProforma'}, me),
            params:{
                idestructura: winheredar.down('#tree_estructura').getSelectionModel().getSelection()[0].get('id'),
                denominacion: me.getMain().down('pro_westerntree').getSelectionModel().getSelection()[0].get('text'),
                id:  me.getMain().down('pro_westerntree').getSelectionModel().getSelection()[0].get('id'),
            },
            success: function (form, action) {
                Ext.MessageBox.hide();
                var response = Ext.decode(action.response.responseText);
                // console.log(response)
                if(response['success']==true){
                    if(response['code']==1){
                        mostrarMensaje(1, me.etiquetas.msgProformasHeredadas);
                        if(winheredar.grid)winheredar.grid.getStore().load();
                        winheredar.close();
                    }else if(response['code']==2){
                        mostrarMensaje(8, me.etiquetas.msgSinProformas);
                    }else if(response['code']==3){
                        mostrarMensaje(8, me.etiquetas.msgEntidadActual);
                    }
                }else{
                    mostrarMensaje(6, response['msg'])
                }
            },
            failure:function(form, action){
                Ext.MessageBox.hide();
//                     mostrarMensaje(7, 'Ha ocurrido un error.')
            }
        });
    },
    exportarProforma: function() {
        var me = this,
            recordSelected = me.getMain().down('centergrid').getSelectionModel().getSelection()[0],
            id = recordSelected.get('idproforma'),
            idplantilla = recordSelected.get('idplantilla');
        console.log('Ajax 9', id)
        window.open(me.urlExport(id));
        // Ext.Ajax.request({
        //     url: UtilsFn.buildUrl({action: 'exportarProforma'}, me),
        //     params:{
        //         idproforma: id
        //     },
        //     // success: function (form, action) {
        //     //     alert('Que si')
        //     // }
        // })

    },
    exportarProforma1: function(){
        var me=this;
        // Ext.Ajax.request({
        //     url: UtilsFn.buildUrl({action: 'exportarProforma'}, me),
        //     // params:{
        //     // },
        //     success: function (form, action) {
        //         alert('Que si')
        //     }
        // })
        console.log('6')
        var idIframe = Ext.id();
        var win=Ext.create('Ext.window.Window', {
            title: 'Exportada',
            width: 800,
            height: 500,
            maskDisabled: false,
            animCollapse: false,
            maximizable: true,
            constrain: true,
            border: false,
            modal: true,
            layout: 'fit',
            items:[
                {
                    xtype: 'form',
                    html: '<iframe id="idframe" name="idframe" frameborder="0" width="100%" height="100%" onload="Proformas.controller.Main.prototype.onLoadReport(this.id)" ></iframe>',
                    listeners: {
                        afterrender: function (panel) {
                            panel.fromHidden=panel.getEl().createChild(
                                {tag: 'form', cls: 'x-hidden', method: 'POST', action: me.urlExport(), target: 'idframe'}
                            );
                            // panel.fromHidden.createChild("<input name='datas' type='text' class='u-datas' style='display:none' hidden='true' value='{0}'/>");
                            // me.configReport['isAttachment']=false;
                            panel.fromHidden.dom.action = me.urlExport();
                            panel.fromHidden.dom.method = "POST";
                            panel.fromHidden.dom.target = 'idframe';
                            panel.fromHidden.dom.enctype = "multipart/form-data";
                            panel.fromHidden.dom.submit();
                            // me.loadReport(me.configReport);
                        }
                    }
                }
            ]
            // items: {
            //     xtype: 'component',
            //     autoEl: {
            //         tag: 'iframe',
            //         id: idIframe,
            //         style: 'height: 100%; width: 100%; border: none',
            //         src: document.location.protocol + '//' + document.location.host +
            //         'crm/contratacion/index.php/gestionproformas/exportarProforma'
            //     }
            // }
        }).show();
        // Ext.getCmp('winmovimientonomina').maximize();
        // PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte de movimiento de nómina');
        // document.getElementById(idIframe).onload = function () {
        //     alert('Mostrado')
        // }
    },
    onLoadReport: function (id) {
        // console.log('PERO que load')
        // Ext.select(".x-panel-report .ext-el-mask").remove();
        Ext.select(".x-panel-report .x-mask").remove();
        Ext.select(".x-panel-report .ext-el-mask-msg").remove();
        Ext.select(".x-panel-report .x-mask-loading").remove();
        document.getElementById(id).style = "width:100%; height:100%; border:0;";
    },
    urlExport: function(idproforma){
        return document.location.protocol + '//' + document.location.host +
                 '/crm/contratacion/index.php/gestionproformas/exportarProforma?idproforma='+idproforma;
    },
    adicionarDocumento: function(btn){
        console.log('adicionarDocumento for real')
        var me=this;
        var win=Ext.create('Ext.window.Window',{
            title: 'Adicionar documento',
            width: 350,
            items: [
                {
                    xtype: 'form',
                    frame:true,
                    defaults:{
                        anchor: '100%',
                        labelWidth: 100,
                        allowBlank: false
                    },
                    // layout: 'column',
                    items:[
                        Ext.create('Ext.form.field.Hidden', {
                            name: 'idestructuracomun',
                        }),
                        Ext.create('Ext.form.field.Hidden', {
                            name: 'idespaciotrabajo',
                        }),
                        Ext.create('Ext.form.field.Hidden', {
                            name: 'idtipocontrato',
                        }),
                        Ext.create('Ext.ux.CmbSelectField', {
                            fieldLabel: me.etiquetas.lbtipocontrato,
                            name: 'tipocontrato',
                            mapping: 'DatTipoContrato.denominacion',
                            localId: 'idtipocontrato',
                            module: 'TipoContrato',
                            noactions: true,
                            // context: 'gestioncontratomainwindowcontrato',
                            allowBlank: false,
                            // controller: 'gestioncontratomainwindow',
                            flex: 1,
                            // forceSelection: true,
                            listeners:{
                                select: function(combo, records){
                                    console.log('select:')
                                    win.down('form').getForm().findField(combo.localId).setValue(records.get('idtipocontrato'));
                                    win.down('form').getForm().findField('idespaciotrabajo').setValue(records.get('idespaciotrabajo'));
                                }
                            }
                        }),
                        {
                            xtype: 'textfield',
                            fieldLabel: me.etiquetas.lbdenominacion,
                            name: 'nombre',
                            itemId: 'nombre',
                            anchor: '100%',
                            flex: 1,
                            // value: 'Contrato original',
                            maxLength: 30,
                            maxLengthText: me.etiquetas.validationMaxLength_30,

                            // columnWidth: 0.5,
                            // margin: '0 10 5 5'
                        },
                        {
                            xtype: 'filefield',
                            fieldLabel: me.etiquetas.lbdocumento,
                            truefieldipload: true,
                            // columnWidth: 0.5,
                            hidden: false,
                            name: 'file',
                            itemId: 'file',
                            buttonText: '',
                            buttonConfig: {
                                iconCls: 'icondistra-subirfichero icon-fileupload'
                            }
                        }
                    ],
                    listeners:{
                        validitychange: function(form, valid){
                            win.down('#btnaceptar').setDisabled(!valid);
                        }
                    }
                }
            ],
            buttons:[
                {
                    text: me.etiquetas.lbCancelar,
                    iconCls: 'icondistra-cancelar',
                    tooltip: me.etiquetas.lbCancelar,
                    handler: function () {
                        win.close();
                    }
                },
                {
                    text: this.etiquetas.lbAceptar,
                    tooltip: this.etiquetas.lbAceptar,
                    disabled: true,
                    iconCls: 'aceptar',
                    itemId: 'btnaceptar',
                    handler: function(){
                        Ext.MessageBox.show({
                            msg: me.etiquetas.lbGuardandoDocumentos,
                            width: 300,
                            wait: true,
                            waitConfig: {interval: 200}
                        });
                        win.down('form').getForm().submit({
                            url: UtilsFn.buildUrl({action: 'guardarDocumento'}, me),
                            // params: params,
                            success: function (form, action) {
                                Ext.MessageBox.hide();
                                mostrarMensaje(1, me.etiquetas.msgGuardadoDocumento);
                                var record=me.getWesternTree().getSelectionModel().getSelection()[0];
                                me.getWesternTree().getStore().load({
                                    callback: function(){
                                        me.getWesternTree().getSelectionModel().select(record);
                                    }
                                });
                                win.close();
                            },
                            failure: function (form, action) {
                                Ext.MessageBox.hide();
                                mostrarMensaje(7, me.etiquetas.msgError);
                            }
                        });
                    }
                }
            ]
        });
        win.show(null, function(){
            var selected=me.getWesternTree().getSelectionModel().getSelection();
            // console.log('selected:', selected)
            if(selected.length && selected[0].get('id')!=0){
                tipocontrato=win.down('form').getForm().findField('idtipocontrato');
                // win.down('form').getForm().findField('tipocontrato').select(selected[0].get('text'));
                win.down('form').getForm().findField('tipocontrato').setValue(selected[0].get('text'));
                // win.down('form').getForm().findField('tipocontrato').select(selected[0].get('text'));
                win.down('form').getForm().findField('tipocontrato').setRawValue(selected[0].get('text'));
                win.down('form').getForm().findField('idtipocontrato').setValue(selected[0].get('id'));
                win.down('form').getForm().findField('idestructuracomun').setValue(selected[0].get('idestructuracomun'));
                win.down('form').getForm().findField('idespaciotrabajo').setValue(selected[0].get('idespaciotrabajo'));
            }
        });
    },
    eliminarDocumentos: function(btn){
        var me=this;
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        var selected=me.getMain().down('#griddocumentos').getSelectionModel().getSelection(),
                            nodos=[];
                        selected.forEach(function(x){
                            nodos.push(x.get('idnodo'));
                        })
                        Ext.MessageBox.show({
                            msg: me.etiquetas.lbEliminando,
                            width: 300,
                            wait: true,
                            waitConfig: {interval: 200}
                        });
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'eliminarDocumentos'}, me),
                            params: {
                                nodos: Ext.encode(nodos)
                            },
                            scope: this,
                            callback: function (options, success, response) {
                                Ext.MessageBox.hide();
                                var response = Ext.decode(response.responseText);
                                mostrarMensaje(1, me.etiquetas.msgEliminadoDocumento);
                                dialog.close();
                            }
                        });
                    }
                },
                {
                    text: 'Cancelar',
                    iconCls: 'cancelar',
                    handler: function () {
                        dialog.close();
                    }
                }
            ]
        });
        dialog.show({
            title:me.etiquetas.lbConfirmacion,
            msg: me.etiquetas.lbConfirmEliminar,
            icon: Ext.MessageBox.QUESTION,
        });
    }

});