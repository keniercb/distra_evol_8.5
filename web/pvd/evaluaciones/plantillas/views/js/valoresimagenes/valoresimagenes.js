Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('valoresimagenes', Interfaz);
var SelectorImagen;
var idimagen;
var fecha = new Date();
var accion, boton, nombretemp, extension = '.jpg';
var plantillaTemp = new Ext.XTemplate(
    '<div class="details">',
    '<tpl for=".">',
    '<img src="{imagen}" height=100 width=120 /><div class="details-info">',
    '</tpl>',
    '</div>'
    );
plantillaTemp.compile();
function Interfaz(){
    perfil = arguments[0];
    labels = arguments[1];

    var btnSubirImagen = new Ext.Button({
        id: 'btnSubirImagen',
        text:labels.lbBtnSubirImagen,
        iconCls:'incluir',
        disabled: false,
        handler : function(){
            if(fpImagen.getForm().isValid()){
                var valor = Ext.getCmp('tfimagen').getValue();
                extension = valor.substr(valor.lastIndexOf('.'));
                fpImagen.getForm().submit({
                    url: 'temporalimagen',
                    params: {
                        extension:extension
                    },
                    waitMsg: labels.lbEnviandoImagen,
                    success: function(formPwindow, o){
                        Ext.getCmp('tfimagen').setValue(o.result.imagen);
                        var detalleElTemp = Ext.getCmp('img-detalle-temp-panel').body;
                        if(o.result.codigo == 1){
                            fpdatosImagen.enable();
                            nombretemp = o.result.nombretemp;
                            plantillaTemp.overwrite(detalleElTemp, o.result);
                            detalleElTemp.slideIn('l', {
                                stopFx:true,
                                duration:.5
                            });
                        }else {
                            mostrarMensaje(3, "La imagen seleccionada debe tener como máximo 200 x 200 pixeles.");
                            detalleElTemp.update('');
                        }
                    },
                    callback: function (options,success,response){
                        fpdatosImagen.enable();
                        Ext.getCmp('tfimagen').reset();
                    }
                });

            }
        }
    });

    var dfFIImagen = new Ext.form.DateField({
        id: 'dfFIImagen',
        fieldLabel: labels.lbbtdfFIImagen,
        width: 176,
        value: fecha.format('d/m/Y'),
        format:'d/m/Y',
        vtype: 'daterange',
        endDateField: 'dfFFImagen',
        allowBlank:false
    //   invalidText: labels.lbtextoformatofechasI,
    //   blankText:labels.lbbtdfBlankFIImagen
    });

    var dfFFImagen = new Ext.form.DateField({
        id: 'dfFFImagen',
        //   invalidText: labels.lbtextoformatofechasF,
        fieldLabel: labels.lbbtdfFFImagen,
        vtype: 'daterange',
        width: 176,
        startDateField: 'dfFIImagen',
        format:'d/m/Y'
    });

    var heDescripcion = new Ext.form.TextArea({
        name:'descripcion',
        height: 110,
        enableLists: false,
        anchor:'100%',
        id:'heDescripcion',
        enableSourceEdit: false,
        enableLinks: false,
        maxLength: 255,
        fieldLabel:labels.lbheDescripcion,        
    });

    var fpImagen = new Ext.FormPanel({
        fileUpload : true,
        frame:true,
        border : false,
        bodyBorder: false,
        id : 'fpImagen',
        labelAlign : 'top',
        labelWidth : 100,
        height: 130,
        region: 'north',
        margins: '5 5 0 5',
        bodyStyle : 'padding: 10px',
        items : [{
            layout:'column',
            items:[{
                bodyBorder : true,
                border : false,
                columnWidth:.55,
                layout: 'form',
                items: [{
                    xtype : 'fileuploadfield',
                    anchor : '100%',
                    id : 'tfimagen',
                    padding:'0 0 0 0',
                    margins: '5 0 5 5',
                    emptyText : 'Seleccione...',
                    fieldLabel : labels.lbBtnImagen,
                    regex : /^.+\.(jpg|png|jpeg|gif|bmp)$/i,
                    regexText : 'Solo imagen de formato jpg, png, jpeg, gif o bmp.',
                    name : 'nombreimagen',
                    prevTab:'btnAceptar',					
                    buttonCfg : {
                        iconCls : 'buscar',
                        text: ''
                    }
                },btnSubirImagen]
            },{
                bodyBorder : false,
                border : false,
                columnWidth:.15,
                layout: 'form',
                items:[{
                    id: 'id-temp-panel',
                    height: 100,
                    anchor: '100%',
                    border: false
                }]
            },{
                bodyBorder : false,
                border : false,
                columnWidth:.30,
                layout: 'form',
                items:[{
                    id: 'img-detalle-temp-panel',
                    height: 100,
                    anchor: '100%',
                    border: false
                }]
            }]
        }]
    });

    var fpdatosImagen = new Ext.FormPanel({
        title:'Detalles',
        id : 'fpdatosImagen',
        frame:true,
        region: 'center',
        disabled:true,
        labelAlign : 'top',
        baseParams:{
            extension:extension
        },
        labelWidth : 100,
        height: 220,
        margins: '5 5 5 5',
        bodyStyle: 'padding: 10px',

        items : [{
            layout:'column',
            items:[{
                bodyBorder : true,
                border : false,
                columnWidth:.50,
                layout: 'form',
                items: [dfFIImagen]
            },{
                bodyBorder : true,
                border : false,
                columnWidth:.50,
                layout: 'form',
                items: [dfFFImagen]
            }]
        },heDescripcion
        ]
    });

    function LimpiarForm(){
        fpImagen.getForm().reset();
        fpdatosImagen.getForm().reset();
        fpdatosImagen.disable();
        heDescripcion.setValue('');
        dfFIImagen.setValue('');
        dfFFImagen.setValue('');
        dfFIImagen.setValue(fecha.format('d/m/Y'));
    }

    function mostrarVentana(accion){
        LimpiarForm();
        fpdatosImagen.enable();
        if(accion == 'ADD'){
            Ext.getCmp('tfimagen').enable();
            btnSubirImagen.enable();
            fpdatosImagen.disable();
            Ext.getCmp('btnAplicar').show();
            winImagen.setTitle(labels.lbwinAddImagen);
        }
        else{
            fpdatosImagen.enable();
            Ext.getCmp('btnAplicar').hide();
            Ext.getCmp('tfimagen').disable();
            btnSubirImagen.disable();
            winImagen.setTitle(labels.lbwinModImagen);
            heDescripcion.setValue(record.descripcion);
            dfFFImagen.setValue(record.fechafin);
            dfFIImagen.setValue(record.fechainicio);

            Ext.Ajax.request({
                url: 'mostrarimagen',
                method:'POST',
                params: {
                    idimagen: idimagen,
                    extension:record.extension
                },
                callback: function (options,success,response){
                    responseData = Ext.decode(response.responseText);
                    var detalleElTemp = Ext.getCmp('img-detalle-temp-panel').body;
                    nombretemp = responseData.nombretemp;
                    plantillaTemp.overwrite(detalleElTemp, responseData);
                    detalleElTemp.slideIn('l', {
                        stopFx:true,
                        duration:.5
                    });

                }
            });
        }
        winImagen.show();
    }

    var btnCancelar = new Ext.Button({
        id: 'btnCancelar',
        text : labels.lbbtnCancelar,
        tooltip : 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',//labels.ttpBtnCancelar,
        iconCls : 'cancelar',
        handler : function() {
            winImagen.hide();
            var detalleElTemp = Ext.getCmp('img-detalle-temp-panel').body;
            detalleElTemp.update('');
        }
    });
    var btnAplicar = new Ext.Button({
        id: 'btnAplicar',
        text : labels.lbbtnAplicar,
        iconCls : 'aplicar',
        tooltip : 'Guardar datos y limpiar los campos (<b>Ctrl+Alt+P</b>)',//labels.ttpBtnAplicar,
        handler : function() {
            boton = 'APLI';
            AddModDatosImagen(boton);
            var detalleElTemp = Ext.getCmp('img-detalle-temp-panel').body;
            detalleElTemp.update('');
        }
    });

    var btnAceptar = new Ext.Button({
        id: 'btnAceptar',
        text : labels.lbbtnAceptar,
        tooltip : 'Guardar datos y cerrar ventana (<b>Enter</b>)',//labels.ttpBtnAceptar,
        iconCls : 'aceptar',
        prevTab:'btnAplicar',
        nextTab: 'tfimagen',
        handler : function() {
            boton = 'ACEP';
            AddModDatosImagen(boton);
            var detalleElTemp = Ext.getCmp('img-detalle-temp-panel').body;
            detalleElTemp.update('');
        }
    });
    var keysR= [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelar.hidden) {
                btnCancelar.handler();
            }
        }
    }, {
        key: 'p',
        ctrl: true,
        alt: true,
        fn: function() {
            if (!btnAplicar.hidden) {
                btnAplicar.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptar.hidden) {
                btnAceptar.handler();
            }
        }
    }
    ];

    var winImagen = new Ext.Window({
        title : labels.lbtituloventanaAdd,
        bodyBorder: true,
        closeAction: 'hide',
        modal: true,
        keys:keysR,
        hideBorders: true,
        width: 460,
        height: 440,
        layout: 'border',
        bodyStyle: 'padding: 10px',
        resizable: false,
        items : [fpImagen, fpdatosImagen],
        buttons : [btnCancelar,btnAplicar,btnAceptar]
    });
    winImagen.on('show', function(cmp){
        Ext.getCmp('tfimagen').focus(false, 300);
    });

    winImagen.on('hide', function(cmp){
        objSelectorImg.btnAdicionar.focus();
    });

    function AddModDatosImagen(boton){
        var valor = Ext.getCmp('tfimagen').getValue();
        extension = valor.substr(valor.lastIndexOf('.'));
        var url = 'adicionarimagen';
        if(accion == 'ADD')
            url = 'adicionarimagen';
        else
            url = 'modificarimagen';

        if(fpdatosImagen.getForm().isValid() && fpdatosImagen.disabled == false){
            fpdatosImagen.getForm().submit({
                url: url,
                waitMsg: labels.lbEnviandodatosImagen,
                params: {
                    extension:extension,
                    idimagen: idimagen,
                    nombretemp:nombretemp
                },
                failure: function(form, action){
                    if(action.result.codMsg != 3){
                        if(boton == 'ACEP')
                            winImagen.hide();
                        else{
                            LimpiarForm();
                        }
                    }
                    mostrarMensaje(action.result.codMsg, action.result.mensaje, function(btn){
                        objSelectorImg.cargarImagenes(30, 0);
                    });
                }
            });
        }// if(fpdatosImagen.getForm().isValid())

    }


    SelectorImagen = function(objconfig){
        this.objconfig = objconfig;
    }

    SelectorImagen.prototype = {
        imgs : {},
        renderizar : function(contenedor){
            this.initPlantillas();
            var self = this;
            this.stSelector = new Ext.data.Store({
                url: this.objconfig.url,
                reader:new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    root: "datos",
                    id: "idvaloresimagenes"
                }, [{
                    name: 'idvaloresimagenes'
                },

                {
                    name: 'denom'
                },

                {
                    name: 'descripcion'
                },

                {
                    name: 'extension'
                },

                {
                    name: 'fechainicio'
                },

                {
                    name: 'fechafin'
                }
                ]),
                listeners:{
                    load: function(){
                        self.visor.select(0);
                        self.btnAdicionar.focus();
                    }
                }
            });

            this.ptb = new Ext.PagingToolbar({
                pageSize: 30,
                store: this.stSelector,
                displayInfo: true,
                items:['-']
            });

            this.btnAdicionar = new Ext.Button({
                id: 'btnAdicionar',
                text: 'Ad<u>i</u>cionar',//labels.lbBtnAdicionar,
                tooltip: labels.lbToolTipBtnAdicionar,
                iconCls:'adicionar',
                disabled: false,
                handler : function(){
                    accion = 'ADD';
                    mostrarVentana(accion);
                }
            });

            this.btnModificar = new Ext.Button({
                id:'btnModificar',
                text:labels.lbBtnModificar,
                tooltip: 'Modificar imagen (<b>Alt+M</b>)',
                disabled: true,
                iconCls:'modificar',
                handler : function(){
                    accion = 'MOD';
                    mostrarVentana(accion);
                }

            });
            this.btnEliminar = new Ext.Button({
                id:'btnEliminar',
                text:labels.lbBtnEliminar,
                tooltip:labels.lbToolTipBtnEliminar,
                disabled: true,
                iconCls:'eliminar',
                handler : function(){
                    mostrarMensaje(2,labels.lbBtnMsgEliminar,function(btn){
                        if(btn == "ok"){
                            PVD.mostrarMascara('mskdeleteimage', labels.lbPleaseWait, labels.msgDeletingImage);
                            var varRecords = self.visor.getSelectedRecords();
                            Ext.Ajax.request({
                                url: 'eliminarimagen',
                                method:'POST',
                                params: {
                                    idimagen: idimagen,
                                    extension: varRecords[0].get('extension')
                                },
                                callback: function (options,success,response){
                                    PVD.ocultarMascara('mskdeleteimage');
                                    responseData = Ext.decode(response.responseText);
                                        if (responseData.exception == 1) {
                                            Ext.MessageBox.show({
                                            title: 'Información',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO,
                                            msg: labels.lbConceptoEnUso,
                                            fn: function() {
                                                btnAdicionar.focus();
                                            }
                                        });
                                    }else{                                    
                                    mostrarMensaje(responseData.codMsg,responseData.mensaje, function(btn){
                                        objSelectorImg.cargarImagenes(30, 0);
                                    });
                                    }
                                }
                            });
                        }
                    });
                }
            });

            this.btnAyudaTP = new Ext.Button({
                id: 'btnAyudaValoresdeimagenes',
                text:labels.lbBtnAyuda,
                tooltip:labels.lbToolTipBtnAyuda,
                iconCls:'ayuda'
              /*  handler : function(){
                    var title	= 'Ayuda del sistema de evaluaciones';
                    var referencia	= 'evaluaciones/valimagenes';
                    help.show(title,referencia);
                }*/
            });
            var formatData = function(data){
                data.idvaloresimagenes = data.idvaloresimagenes;
                data.imagen = data.imagen;
                data.descripcion = data.descripcion;
                data.fechainicio = data.fechainicio;
                data.fechafin = data.fechafin;
                this.imgs[data.idvaloresimagenes] = data;
                return data;
            };

            this.visor = new Ext.DataView({
                tpl: this.thumbPlantilla,
                singleSelect: true,
                anchor:'100%',
                overClass:'x-view-over',
                itemSelector: 'div.thumb-wrap',
                loadingText: labels.lbGridLoading,
                emptyText : '<div style="padding:10px;">No imagen que mostrar.</div>',
                store: this.stSelector,
                listeners: {
                    'selectionchange': {
                        fn:this.MostrarImagen,
                        scope:this,
                        buffer:100
                    },
                    'loadexception'  : {
                        fn:this.onLoadException,
                        scope:this
                    },
                    'beforeselect'   : {
                        fn:function(view){
                            return view.store.getRange().length > 0;
                        }
                    }
                },
                prepareData: formatData.createDelegate(this)
            });
            this.visor.on('click',function(d,i,n,e){
                idimagen = d.getRecord(n).data.idvaloresimagenes;
                record = d.getRecord(n).data;
            });

            var kmIndicadorImagen = [{
                key: 'i',
                alt:true,
                fn: function(){
                    self.btnAdicionar.handler();
                }
            },{
                key: 'm',
                alt:true,
                fn: function(){
                    if(!self.btnModificar.disabled ){
                        self.btnModificar.handler();
                    }
                }
            },{
                key: 46,
                fn: function(){
                    if(!self.btnEliminar.disabled ){
                        self.btnEliminar.handler();
                    }
                }
            },{
                key: 'h',
                alt:true,
                fn: function(){
                    self.btnAyudaTP.handler();
                }
            }
            ];
            var cfg = {
                id:'idgpImagen',
                tbar:[this.btnAdicionar, this.btnModificar, this.btnEliminar, '->', this.btnAyudaTP],
                sm: this.Selector,
                columns: this.cmSelector,
                stripeRows: true,
                autoScroll:true,
                store: this.stSelector,
                loadMask:{
                    msg : labels.lbGridLoading
                },
                padding:'0 0 0 0',
                margins: '5 5 5 5',
                width: '100%',
                layout:'border',
                items:[{
                    id: 'img-panel-view',
                    region: 'center',
                    autoScroll: true,
                    items: this.visor,
                    layout:'fit',
                    title: this.objconfig.titulo,
                    margins: '5 0 5 5'
                },{
                    id: 'img-detalle-panel',
                    region: 'east',
                    split: true,
                    height: 300,
                    width: 400,
                    margins: '5 5 5 0',
                    minWidth: 200,
                    maxWidth: 420
                }],
                bbar:this.ptb,
                keys: kmIndicadorImagen
            };


            Ext.apply(cfg, this.objconfig);
            this.pImagen = new Ext.Panel(cfg);
            contenedor.add(this.pImagen);
            contenedor.doLayout();

        },
        cargarImagenes : function(limite, inicio){
            this.stSelector.load({
                params:{
                    limit:limite,
                    start:inicio
                }
            });
        },

        initPlantillas : function(){
            this.thumbPlantilla = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{idvaloresimagenes}">',
                '<div class="thumb"><img src="{denom}" width="50" height="50" /></div>',
                '</div>',
                '</tpl>'
                );
            this.thumbPlantilla.compile();

            this.detailsPlantilla = new Ext.XTemplate(
                '<div class="details">',
                '<tpl for=".">',
                '<img src="{denom}" /><div class="details-info">',
                '<b>Descripción:</b>',
                '<span>{descripcion}</span>',
                '</tpl>',
                '</div>'
                );
            this.detailsPlantilla.compile();
        },

        MostrarImagen: function(){
            var nodo = this.visor.getSelectedNodes();
            var detalleElement = Ext.getCmp('img-detalle-panel').body;
            if(nodo && nodo.length > 0){
                this.btnModificar.enable();
                this.btnEliminar.enable();
                nodo = nodo[0];
                var data = this.imgs[nodo.id];
                detalleElement.hide();
                this.detailsPlantilla.overwrite(detalleElement, data);
                detalleElement.slideIn('l', {
                    stopFx:true,
                    duration:.2
                });
            }else{
                this.btnModificar.disable();
                this.btnEliminar.disable();
                detalleElement.update('');
            }
        },
        onLoadException : function(v,o){
            this.visor.getEl().update('<div style="padding:10px;">Error al cargar las imagenes.</div>');
        }
    };

    var vpValoresImagen = new Ext.Viewport({
        layout:'fit',
        defaults: {
            split: true
        }
    });

    var objSelectorImg = new SelectorImagen({
        titulo: labels.lbGridTitulo,
        url: 'todasimagenes',
        bodyStyle: 'padding: 10px',
        padding: '5 5 5 5'
    });

    objSelectorImg.renderizar(vpValoresImagen);
    objSelectorImg.cargarImagenes(30, 0);
}
