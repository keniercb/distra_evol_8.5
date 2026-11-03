/**
 * @author Ing. José Adrian Iglesias Ruiz
 * @package Comun
 * @version 1.0
 * @date 30-05-2019
 * @description Componente para visualizar el espacio de trabajo de Alfresco 5.
 *
 * Ejemplo de uso
 *
 *     this.documentos = new Ext.components.BrowseWorkspace({
            constrain: true,
            width: 600,
            height: 480,
            modal: true,
            title: 'Espacio de trabajo',
            maximizable: true,
            //bodyStyle: 'background:white;cursor:pointer;',
            layout: 'fit',
            autoScroll: true,
            //ctCls: 'dropzone',
            idRootWorkSpace: 'd69513a4-d319-4f7e-8ea1-daf6dcb0429b',//Identificador del espacio de trabajo raiz dentro del cual se guardaran los otros espacios de trabajo o documentos
            denomRootWorkSpace: 'Asistencia Social',//Denominacion del espacio de trabajo raiz dentro del cual se guardaran los otros espacios de trabajo o documentos
            initialPath: 'Asistencia Social',//Direccion inicial en la cual iniciará abierto el componente Ej: 'La Habana/Playa/Siboney'
            //actualPath: this.initialPath,//Direccion donde se encuentra actualmente el navegador'
            browseLevel: 'full',//directorio temporal desde la cual se subiran los archivos a alfresco
            temporalDirectory: '/pvd/asistenciasocial/documentos',
            showUploadButton: true
        });

 *
 */

Ext.ns('Ext.components');
Ext.components.BrowseWorkspace = Ext.extend(Ext.Window, {
    constrain: true,
    minHeight: 480,
    minWidth: 600,
    modal: true,
    closeAction:'hide',
    title: 'Espacio de trabajo',
    maximizable: true,
    layout: 'fit',
    autoScroll: true,
    idRootWorkSpace: '27c43074-415a-413a-a9d3-978d6c9e17bb',//Identificador del espacio de trabajo raiz dentro del cual se guardaran los otros espacios de trabajo o documentos
    denomRootWorkSpace: 'Asistencia Social',//Denominacion del espacio de trabajo raiz dentro del cual se guardaran los otros espacios de trabajo o documentos
    initialPath: (this.initialPath) ? this.denomRootWorkSpace+'/'+this.initialPath : this.denomRootWorkSpace,//Direccion inicial en la cual iniciará abierto el componente Ej: 'La Habana/Playa/Siboney'
    actualPath: (this.initialPath) ? this.denomRootWorkSpace+'/'+this.initialPath : this.denomRootWorkSpace,//Direccion donde se encuentra actualmente el navegador'
    browseLevel: (this.browseLevel) ? this.browseLevel : 'none',//Nivel de permiso de navegacion dentro del espacio de trabajo(full - puede navegar hacia arriba y abajo del initialPath,
                              // restricted - solo navegacion dentro del initialPath y carpetas interiores, none - navegacion solo en el initialPath)
    temporalDirectory: (this.temporalDirectory) ? this.temporalDirectory :'/pvd/comun/documentos',
    showUploadButton: (this.showUploadButton) ? this.showUploadButton : false,
    initComponent: function() {
         var self = this;

        this.btnClose = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function() {
                self.hide();
            }
        });

        this.UploadDocument = new Ext.components.UploadDocument({
            constrain: true,
            width: 580,
            height: 480,
            minWidth: 580,
            modal: true,
            title: 'Seleccionar fichero',
            maximizable: true,
            bodyStyle: 'background:white;cursor:pointer;',
            layout: 'fit',
            autoScroll: true,
            ctCls: 'dropzone',
            idRootWorkSpace: this.idRootWorkSpace,//Identificador del espacio de trabajo raiz dentro del cual se guardaran los otros espacios de trabajo o documentos
            denomRootWorkSpace: this.denomRootWorkSpace,//Denominacion del espacio de trabajo raiz dentro del cual se guardaran los otros espacios de trabajo o documentos
            documentSavePath: this.initialPath,//direccion donde se guardará en alfresco el documento que se subirá
            temporalDirectory: this.temporalDirectory//directorio temporal desde la cual se subiran los archivos a alfresco
        });

        this.UploadDocument.on('beforeshow', function(th){
            th.setDocumentSavePath(self.actualPath);
        });

        this.UploadDocument.on('documentUploaded', function(id,name){
            self.loadFolder(self.actualPath);
        });

        this.btnUpload = new Ext.Button({
            iconCls: 'importar',
            text: 'Importar archivo',
            hidden: false,
            tooltip: 'Importar archivo.',
            handler: function() {
                self.UploadDocument.show();
            }
        });

        this.btnUpdateFF = new Ext.Button({
            iconCls: 'actualizar',
            text: 'Actualizar directorio',
            tooltip: 'Actualizar directorio.',
            handler: function() {
                self.loadFolder(self.actualPath);
            }
        });

        this.btnDeleteFF = new Ext.Button({
            iconCls: 'eliminar',
            text: 'Eliminar',
            tooltip: 'Eliminar archivo o directorio.',
            disabled: true,
            handler: function() {
                var arriddocumento = new Array();
                var elementtype = new Array();
                Ext.each(self.documentView.getSelectedIndexes(), function(ind){
                    arriddocumento.push(self.store.getAt(ind).data.iddocumento);
                    elementtype.push(self.store.getAt(ind).data.type);
                });
                self.deleteDocumentFolder(arriddocumento, elementtype);
            }
        });

        this.btnRenameFF = new Ext.Button({
            iconCls: 'editar',
            text: 'Cambiar nombre',
            disabled: true,
            tooltip: 'Cambiar nombre de archivo o directorio.',
            handler: function() {
                self.winRename.show();
            }
        });

        //ventana para cambiar el nombre del documento
        this.btnCancelarRename = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cancelar los cambios y cerrar la ventana.',
            handler: function() {
                self.winRename.hide();
            }
        });

        this.btnAceptarRename = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar los cambios y cerrar la ventana.',
            handler: function() {
                self.renameDocument(self.store.getAt(self.documentView.getSelectedIndexes()[0]).data.iddocumento, self.tfRename.getValue());
            }
        });

        this.tfRename = new Ext.form.TextField({
            id: 'tfRename',
            fieldLabel: 'Nuevo nombre',
            allowBlank: false,
            anchor: '98%',
            name: 'tfRename'
        });

        this.formRename = new Ext.FormPanel({
            labelWidth: 75, // label settings here cascade unless overridden
            frame:true,
            labelAlign: 'top',
            width: 350,
            items: [this.tfRename],
            listeners: {
                show: function(){
                    self.tfRename.setValue(self.store.getAt(self.documentView.getSelectedIndexes()[0]).data.nombredocumento);
                }
            }
        });

        this.winRename = new Ext.Window({
            layout      : 'fit',
            title       : 'Renombrar archivo o carpeta',
            width       : 250,
            height      : 140,
            closeAction :'hide',
            plain       : true,
            items       : [this.formRename],
            buttons: [this.btnCancelarRename,this.btnAceptarRename]
        });
        //ventana para cambiar el nombre del documento

        this.btnGoUp = new Ext.Button({
            iconCls: 'arriba',
            disabled: (self.actualPath === self.denomRootWorkSpace),
            text: 'Directorio superior',
            tooltip: 'Ir al directorio superior',
            handler: function() {
                if(self.browseLevel === 'full' || self.browseLevel === 'restricted'){
                    var newPath = self.createUpPath(self.actualPath);
                    if(self.browseLevel === 'full' || (self.browseLevel === 'restricted' && newPath !== self.initialPath)){
                         self.loadFolder(newPath);
                    }
                    else{
                        mostrarMensaje(3, 'Usted no tiene permiso para acceder al la carpeta superior.');
                    }
                }
                else{
                    mostrarMensaje(3, 'Usted no tiene permiso para acceder al la carpeta superior.');
                }
            }
        });

        this.store = new Ext.data.JsonStore({
            url: '/pvd/comun/index.php/gestiondocumentos/browseWorkSpace',
            root: 'documents',
            fields: ['nombredocumento', 'iddocumento', 'type', 'imageurl']
        });


        this.tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap" id="{iddocumento}" type="{type}">',
            '<div class="thumb"><img src="{imageurl}" title="{nombredocumento}"></div>',
            '<span class="">{shortName}</span></div>',
            '</tpl>',
            '<div class="x-clear"></div>'
        );

        this.documentView = new Ext.DataView({
            store: this.store,
            tpl: this.tpl,
            autoHeight:true,
            multiSelect: true,
            overClass:'x-view-over',
            itemSelector:'div.thumb-wrap',
            emptyText: 'Directorio vacío.',
            prepareData: function(data){
                 data.shortName = Ext.util.Format.ellipsis(data.nombredocumento, 15);
                return data;
            },
            listeners: {
                selectionchange: function(dv, nodes){
                    if(nodes.length > 0){
                        self.btnDeleteFF.enable();
                        if(nodes.length > 1){
                            self.btnRenameFF.disable();
                        }
                        else{
                            self.btnRenameFF.enable();
                        }
                    }
                    else{
                        self.btnDeleteFF.disable();
                        self.btnRenameFF.disable();
                    }
                },
                dblclick: function(th, ind, htmlEl, eventObj){
                    if(th.store.getAt(ind).data.type == 'folder'){
                        if(self.browseLevel == 'full' || self.browseLevel == 'restricted'){
                            var newPath = self.createDownPath(th.store.getAt(ind).data.nombredocumento);
                            self.loadFolder(newPath);
                        }
                        else{
                            mostrarMensaje(3, 'Usted no tiene permiso para acceder al directorio inferior.');
                        }
                    }
                    else{
                        if(th.store.getAt(ind).data.type == 'document'){
                            self.openDocument(th.store.getAt(ind).data.iddocumento);
                        }
                        else{
                            console.log('el tipo de elemento no es correcto')
                        }
                    }

                }
            }
        });

        this.panel = new Ext.Panel({
            id: 'images-view',
            layout: 'fit',
            items: [this.documentView]
        });

        this.statusBar = new Ext.StatusBar({
            id: 'statusBar',
            defaultText: 'Default status text',
            defaultIconCls: 'default-icon',
            text: this.initialPath
        });

        this.items = [this.panel ];

        this.buttons = [this.btnClose];

        this.tbar = [this.btnGoUp, this.btnUpdateFF, this.btnUpload, this.btnRenameFF , this.btnDeleteFF];

        this.bbar = [this.statusBar];

        Ext.components.BrowseWorkspace.superclass.initComponent.call(this);

    },
    loadFolder: function(path){
        var _this = this;
        this.store.baseParams.folderpath = path;
        Ext.getBody().mask('Cargando directorio...');
        this.store.load({callback:function(recs, opt, succ){
                Ext.getBody().unmask();
                if(succ){
                    _this.actualPath = path;
                    _this.documentView.refresh();
                    if(_this.denomRootWorkSpace != path)
                        _this.btnGoUp.enable();
                    else
                        _this.btnGoUp.disable();

                    _this.statusBar.setStatus({
                        text: path,
                    });
                }
                else {
                    mostrarMensaje(3, 'Ha ocurrido un error al cargar el directorio.');
                }
            }});

    },
    openDocument: function(iddocumento){
        Ext.getBody().mask('Abriendo documento...');
        Ext.Ajax.request({
            method: "POST",
            url: '/pvd/comun/index.php/gestiondocumentos/viewDocument',
            params: {
                iddocumento:iddocumento
            },
            callback: function (options, success, response) {
                Ext.getBody().unmask();
                var responseData = Ext.decode(response.responseText);
                if(!responseData.error)
                    window.open(responseData.url);
                else
                    mostrarMensaje(3, responseData.msg);

            }.createDelegate(this),
            success: function () {

            }
        });
    },
    listeners: {
        show: function(th){
            th.actualPath = th.initialPath;
            th.loadFolder(th.actualPath);
            th.btnUpload.show();
        }
    },
    createUpPath: function(actPath){
        var arrActPath = actPath.split('/');
        var newArrPath = new Array();
        for(i = 0; i < arrActPath.length - 1; i++){
            newArrPath.push(arrActPath[i]);
        }

        var newPath = newArrPath.join('/');

        if(newPath === this.denomRootWorkSpace){

            this.btnGoUp.disable();
        }
        // this.UploadDocument.setDocumentSavePath()
       return newPath;
    },
    createDownPath: function(newFolder){
        return this.actualPath+'/'+newFolder;
    },
    deleteDocumentFolder: function(arriddocumento, elementtype){
        Ext.getBody().mask('Eliminando elemento(s)...');
        Ext.Ajax.request({
            method: "POST",
            url: '/pvd/comun/index.php/gestiondocumentos/deleteDocument',
            params: {
                arriddocumento:Ext.encode(arriddocumento),
                elementtype: Ext.encode(elementtype)
            },
            callback: function (options, success, response) {
                Ext.getBody().unmask();
                var responseData = Ext.decode(response.responseText);
                if(!responseData.error){
                    mostrarMensaje(1,'El documento ha sido eliminado satisfactoriamente.');
                    this.loadFolder(this.actualPath);
                }
                else
                    mostrarMensaje(3, responseData.msg);

            }.createDelegate(this),
            success: function () {

            }
        });
    },
    renameDocument: function(iddocumento, newName){
        Ext.getBody().mask('Cambiando nombre del elemento...');
        Ext.Ajax.request({
            method: "POST",
            url: '/pvd/comun/index.php/gestiondocumentos/changeName',
            params: {
                iddocumento: iddocumento,
                newname:newName
            },
            callback: function (options, success, response) {
                Ext.getBody().unmask();
                var responseData = Ext.decode(response.responseText);
                if(!responseData.error){
                    mostrarMensaje(1,'El nombre del elemento ha sido cambiado satisfactoriamente.');
                    this.loadFolder(this.actualPath);
                    this.winRename.hide();
                    this.tfRename.reset();
                }
                else
                    mostrarMensaje(3, responseData.msg);

            }.createDelegate(this),
            success: function () {

            }
        });
    }

});