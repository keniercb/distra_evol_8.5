Ext.ns('Ext.util');
Ext.util.FirmaView = Ext.extend(Ext.Window, {
    modal: true,
    constrain: true,
    title: 'Firmar documento(s)',
    closeAction: 'hide',
    resizable : false,
    layout:'border',
    width : 340,
    height : 350,
    documentos:[],
    variables:{},
    initComponent: function () {
        var _this = this;
        this.cmbProceso = new Ext.form.ComboBox({
            fieldLabel: 'Proceso',
            valueField: 'proceso',
            displayField: 'proceso',
            allowBlank: false,
            width: this.width * 0.92,
            editable: false,
            name: 'proceso',
            emptyText: 'Seleccione el elemento',
            mode: 'local',
            triggerAction: 'all',
            store: [
                ['Firmar y archivar documentos digitales', 'Firmar y archivar documentos digitales'],
                ['Gestión de documentos con multifirmas', 'Gestión de documentos con multifirmas'],
                ['Emisión, visto bueno y archivo de documentación digital', 'Emisión, visto bueno y archivo de documentación digital'],
                ['Firmar Evaluacion de Desempeño', 'Firmar Evaluacion de Desempeño']
            ]
        });
        this.tfNombreObjectivo = new Ext.form.TextField({
            name: "VTema",
            fieldLabel: "Objetivo",
            width: '100%',
            autoScroll: true,
            minLength: 2,
            allowBlank: false,
            maxLength: 255
        });
        this.hdDocumentos = new Ext.form.Hidden({
            name: "documentos",
            fieldLabel: "Documentos",
            width: '100%',
            autoScroll: true,
            minLength: 2,
            allowBlank: false,
            maxLength: 1000
        });
        this.hdDocumentos.setValue(Ext.encode(_this.documentos));

        this.form = new Ext.FormPanel({
            frame: true,
            region: 'north',
            height: 120,
            layout: 'form',
            labelAlign: 'top',
            items: [this.tfNombreObjectivo,this.cmbProceso,this.hdDocumentos]
        });
        var Document = Ext.data.Record.create([
            {name: 'name'},
            {name: 'relativePath'},
            {name: 'path'}
        ]);

        this.grid = new Ext.grid.GridPanel({
            frame: true,
            region: 'center',
            iconCls: 'icon-grid',
            title: 'Documentos',
            autoExpandColumn:'nombre_de_archivo',
            sm:new Ext.grid.RowSelectionModel({
                singleSelect:true
            }),
            store: this.store = new Ext.data.Store({
                reader: new Ext.data.ArrayReader({
                    idIndex: 0
                }, Document  )
            }),
            columns : [
                {header: "Nombre de archivo", id:'nombre_de_archivo',width: 150, dataIndex: 'name'}
            ],
            listeners:{
                'rowdblclick' : function ( grid, index, e ){
                    var record = grid.getStore().data.itemAt(index).data;
                    if(record){
                        console.log(record);
                       // window.open(window.location.origin + record.relativePath,'');
                        console.log( window.frameElement.clientHeight);
                        var win = new Ext.Window({
                            title :'Vista previa',
                            height: window.frameElement.clientHeight * 0.9,
                            width: window.frameElement.clientWidth * 0.9,
                            html:'<iframe style="width:100%; height: 100%; border:none;" src="'+window.location.origin + record.relativePath+'"> </iframe>'
                        });
                        win.show();
                        //window.open('/configuracion/firmadigital/index.php/configfirmadigital/descargarDocumentos?caseId' + _this.params.caseId + '&app_doc_uid=' + record.get('app_doc_uid')+ '&version=' + record.get('app_doc_version'),'');
                    }

                }
            }

        });
        for(var index in this.documentos){
            if(!(toString.apply(this.documentos[index]) === '[object Function]'))
                this.store.add(new Document(
                    this.documentos[index]
                ));
        }
        //this.store.loadData(this.documentos);

        this.items = [this.form,this.grid];
        this.buttons = [{
            text: 'Cancelar',
            iconCls:'icondistra-cancelar',
            handler:function (){
                _this.close();
            }
        },{
            text: 'Aceptar',
            iconCls:'icondistra-aceptar',
            handler:function (){
                if(_this.form.getForm().isValid()){
                    var myMask = new Ext.LoadMask(_this.getEl(), {msg:"Inicializando proceso de firma digital..."});
                    myMask.show();
                    let values = _this.form.getForm().getValues();
                    values.variables = Ext.encode(Ext.apply({ VTema: values.VTema},_this.variables));
                    console.log(values);
                    _this.form.getForm().submit({
                        url:'/configuracion/firmadigital/index.php/configfirmadigital/firmaDigital',
                        method:'POST',
                        params:values,
                        success:function(opts,response) {
                            _this.onFirmaDigital.call(_this,response.result);
                            console.log(response.result.url);
                            window.open(response.result.url,'');                            
                            mostrarMensaje(1,'Se ha inicializado el proceso de firma digital satisfactoriamente.');
                            myMask.hide();
                        },
                        failure:function(opts,response) {
                            _this.onErrorFirmaDigital.call(_this,response);
                            console.log(response.result.mensajes);
                            mostrarMensaje(3,response.result.mensajes);
                            myMask.hide();
                        }
                    });
                } else {
                    mostrarMensaje(3,'Hay campos con valores incorrectos o vacios.');
                }
            }
        }];
        Ext.util.FirmaView.superclass.initComponent.call(this);
    },
    onFirmaDigital:function(){},
    onErrorFirmaDigital:function(){},
});

Ext.util.DocumentosView = Ext.extend(Ext.Window,{
    modal: true,
    constrain: true,
    title: 'Detalles del caso',
    closeAction: 'hide',
    resizable : false,
    layout:'border',
    bodyCls: 'detallessolicitud',
 //   width : window.innerWidth * 0.6,
 //   height : window.innerHeight * 0.7,
    width : 600,
    height : 430,
    params: {
        caseId:null
    },
    statusValues:{
        "DRAFT":"Borrador",
        "TO_DO":"Por hacer",
        "COMPLETED":"Completado",
        "CANCELLED":"Cancelado"
    },
    initComponent: function () {
        var _this = this;
        this.tplInfo = new Ext.XTemplate(
            '<div>',
            '<div class="solicitudneogico-block solicitudneogico-allrow">',
            '<div class="solicitudneogico-item">',
            '<label>Nombre:</label><span>{app_name}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>N&uacute;mero del Caso:</label><span>{app_number}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>Proceso:</label><span>{pro_name}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>Estado:</label><span>{app_status}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>Usuario actual:</label><span>{usr_name}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>Tarea en proceso:</label><span>{tas_title}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>Fecha de creado:</label><span>{app_create_date}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block">',
            '<div class="solicitudneogico-item">',
            '<label>Creado por:</label><span>{app_init_usr_username}</span>',
            '</div>',
            '</div>',
            '<div class="solicitudneogico-block solicitudneogico-allrow">',
            '<div class="solicitudneogico-item">',
            '<span class="icondistra-mostrar"><a style="width: 574px !important;" href="{url}" target="_blank">Mostrar caso</a></span>',
            '</div>',
            '</div>',
            '</div>'
        );
        this.tplInfo.compile();
        this.info = new Ext.form.FieldSet({
            region:'north',
            height: 200,
            layout: 'anchor',
            defaults: {flex:1},
            cls: 'detallessolicitud-general',
            frame:false,
            tpl: this.tplInfo,
            bodyStyle: {
                padding: '10px'
            },
            listeners:{
                'render':function(fp){
                    _this.body.mask('Cargando datos...');
                    Ext.Ajax.request({
                        method: 'POST',
                        url:'/configuracion/firmadigital/index.php/configfirmadigital/mostrarCaso',
                        params:{
                            caseId: _this.params.caseId
                        },
                        waitMsg:'Cargando datos...',
                        success:function(response,opt) {
                            console.log(response.responseText);
                            var responseData = Ext.decode(response.responseText);
                            if(responseData.data['current_task'] && responseData.data['current_task'].length > 0){
                                responseData.data['tas_title']= responseData.data['current_task'][0]['tas_title'];
                                responseData.data['usr_name'] = responseData.data['current_task'][0]['usr_name'];
                            }
                            responseData.data['app_status'] = _this.statusValues[responseData.data['app_status']];
                            _this.tplInfo.overwrite(_this.info.body, responseData.data);
                            _this.body.unmask();
                        },
                        failure:function(response,opt) {
                            _this.body.unmask();
                            console.log(response.result);
                            mostrarMensaje(3,response.result.mensajes);
                        }
                    });
                }
            }
        });

        this.grid = new Ext.grid.GridPanel({
            frame: true,
            region: 'center',
            iconCls: 'icon-grid',
            title: 'Documentos',
            sm:new Ext.grid.RowSelectionModel({
                singleSelect:true
            }),
            store: this.store = new Ext.data.Store({
                url:'/configuracion/firmadigital/index.php/configfirmadigital/listarDocumentosPorCaso',
                autoLoad:true,
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'id',
                    root: 'data',
                    messageProperty: 'mensajes'
                }, [
                    {name: 'app_doc_uid'},
                    {name: 'doc_uid'},
                    {name: 'app_doc_index'},
                    {name: 'app_doc_version'},
                    {name: 'app_doc_filename'},
                    {name: 'app_doc_link'},
                    {name: 'app_doc_create_user'},
                    {name: 'app_doc_create_date'},
                    {name: 'tas_title'},
                    {name: 'usr_name'},
                ]),

                listeners:{
                    'beforeload' : function(st,opts){
                        st.baseParams.caseId = _this.params.caseId;
                    },
                    'loadexception' : function(misc){
                        var jsonData = _this.store.reader.jsonData;
                        mostrarMensaje(3,jsonData.mensajes);
                    },
                }
            }),
            columns : [
                {header: "Nombre de archivo", width: 200, dataIndex: 'app_doc_filename'},
                {header: "Versión", width: 50, dataIndex: 'app_doc_version'},
                {header: "Creado por", width: 170, dataIndex: 'app_doc_create_user'},
                {header: "Fecha de creación", width: 130, dataIndex: 'app_doc_create_date'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: this.store,
                displayInfo: true
            }),
            listeners : {
                'rowdblclick': function (grid, rowIndex, e ){
                    _this.onDownload(grid , rowIndex);
                },
                'rowcontextmenu': function(grid , rowIndex, eventObj){
                    let menu = new Ext.menu.Menu({
                        items: [{
                            text:'Descargar',
                            iconCls:'icondistra-guardar',
                            handler: function(){
                                _this.onDownload(grid , rowIndex);
                            }
                        } ]
                    });
                    menu.showAt(eventObj.getXY());
                    eventObj.stopEvent();
                },
                'loadexception' : function(misc){
                    var jsonData = _this.store.reader.jsonData;
                    mostrarMensaje(3,jsonData.mensajes);
                },
            }
        });
        this.items = [this.info,this.grid];
        Ext.util.DocumentosView.superclass.initComponent.call(this);
    },
    onDownload:function(grid , rowIndex){
        var _this = this;
        var record = grid.getStore().getAt( rowIndex );
        if(record){
            var jsonData = grid.getStore().reader.jsonData;
            var url = jsonData.serverName + '/sys' + jsonData.workspace + '/es-ES/xetid/' + record.get('app_doc_link');

            window.open('/configuracion/firmadigital/index.php/configfirmadigital/descargarDocumentos?caseId=' + _this.params.caseId + '&app_doc_uid=' + record.get('app_doc_uid') + '&app_doc_filename=' + record.get('app_doc_filename') + '&version=' + record.get('app_doc_version'),'');
        }
    }
})



