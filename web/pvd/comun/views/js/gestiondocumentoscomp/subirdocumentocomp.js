/**
 * @author Ing. José Adrian Iglesias Ruiz
 * @package Comun
 * @version 1.0
 * @date 21-05-2019
 * @description Componente para subir documentos hacia Alfresco 5.
 */
/**
 * EJEMPLO DE USO
 *  this.documentos = new Ext.components.UploadDocument({
            constrain: true,
            width: 500,
            height: 480,
            modal: true,
            title: 'Seleccionar fichero',
            maximizable: true,
            bodyStyle: 'background:white;cursor:pointer;',
            layout: 'fit',
            autoScroll: true,
            ctCls: 'dropzone',
            idRootWorkSpace: 'd69513a4-d319-4f7e-8ea1-daf6dcb0429b',//Identificador del espacio de trabajo raiz dentro del cual se guardaran los otros espacios de trabajo o documentos
            denomRootWorkSpace: 'Asistencia Social',//Denominacion del espacio de trabajo raiz dentro del cual se guardaran los otros espacios de trabajo o documentos
            documentSavePath: 'La Habana/Playa/Siboney/exp-12',//direccion donde se guardará en alfresco el documento que se subirá
            temporalDirectory: '/pvd/asistenciasocial/documentos'//directorio temporal desde la cual se subiran los archivos a alfresco
        });
 */
Ext.ns('Ext.components');
Ext.components.UploadDocument = Ext.extend(Ext.Window, {
    constrain: true,
    minWidth: 580,
    minHeight: 480,
    modal: true,
    closeAction:'hide',
    title: 'Seleccionar fichero',
    maximizable: true,
    bodyStyle: 'background:white;cursor:pointer;',
    layout: 'fit',
    autoScroll: true,
    ctCls: 'dropzone',
    maxFileSize: (this.maxFileSize)? this.maxFileSize: 20,
    idRootWorkSpace: '27c43074-415a-413a-a9d3-978d6c9e17bb',//Identificador del espacio de trabajo raiz dentro del cual se guardaran los otros espacios de trabajo o documentos
    denomRootWorkSpace: 'Asistencia Social',//Denominacion del espacio de trabajo raiz dentro del cual se guardaran los otros espacios de trabajo o documentos
    documentSavePath: (this.documentSavePath)? this.documentSavePath : this.denomRootWorkSpace,//path donde se guardará el archivo dentro del rootWorkSpace en alfresco
    temporalDirectory: (this.temporalDirectory)? this.temporalDirectory : '/pvd/comun/documentos',//direccion donde se copiara el fichero temporalmente antes de subirlo a alfresco
    initComponent: function() {
        var self = this;
        this.myDropzone = null;
        this.documentsData = new Array();

        //Renderiza el grafico
        this.on('show', this.renderUploadForm, this);

        this.btnClose = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function() {
                self.hide();
            }
        });

        this.btnClear = new Ext.Button({
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Eliminar todos los ficheros',
            handler: function() {
                self.myDropzone.removeAllFiles();
                self.tfTotalFiles.setValue(0);
            }
        });

        this.tfTotalFiles = new Ext.form.TextField({
            value: 0,
            readOnly: true,
            width: 30
        });

        this.html = '<div class="dz-message">Arrastrar y soltar aquí o click para subir.</div>';
        this.buttons = [this.btnClose];

        this.bbar = [
             '->', this.btnClear
        ];
        Ext.components.UploadDocument.superclass.initComponent.call(this);

    },
    renderUploadForm: function(cmp) {
        var me = this;
        this.myDropzone = new Dropzone(this.body.dom, {
            url: '/pvd/comun/index.php/gestiondocumentos/uploadDocument',
            paramName: "nombreFichero", // The name that will be used to transfer the file
            maxFilesize: this.maxFileSize, // MB
            dictFileTooBig: "El archivo es demasiado grande ({{filesize}}MB). Tamaño máximo: {{maxFilesize}}MB.",
            // maxFiles: 10, //Cantidad maxima de archivos que se pueden subir.
            // dictMaxFilesExceeded: 'No puede subir más de 10 ficheros.',
            params:{
                idRootWorkSpace: this.idRootWorkSpace,
                denomRootWorkSpace: this.denomRootWorkSpace,
                documentSavePath: this.documentSavePath,
                temporalDirectory: this.temporalDirectory
            },

            acceptedFiles: '',
            accept: function(file, done) {
                cmp.tfTotalFiles.setValue(me.myDropzone.files.length);
                PVD.mostrarMascara('uplDoc', 'Por favor espere...', 'Subiendo documento(s) al servidor.');
                done();
            }
        });
        this.myDropzone.on('dragenter', function(evt) {
            cmp.body.stopFx();
            cmp.body.highlight();
        });

        var _this = this;
        this.myDropzone.on('success', function(file, response) {
            response = Ext.decode(response);
            PVD.ocultarMascara('uplDoc');
            if (response.codigo == 1){
                _this.mostrarMensajePropio('Archivo(s) subido(s) satisfactoriamente.');
                _this.documentsData.push({iddocumento: response.iddocumento, nombredocumento: response.nombredocumento});
                _this.fireEvent('documentUploaded',{iddocumento: response.iddocumento, nombredocumento: response.nombredocumento});
            }
            else {
                _this.mostrarMensajePropio(response.mensaje);
            }

        });

        this.mostrarMensajePropio = function(message){
            var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
            var msg = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgOk"></div><div onclick="this.parentNode.remove()" id="closePopup"></div><h3>Informaci&oacute;n</h3><p>' + message + '</p></div>', true);
            msg.slideIn('t').pause(10).ghost("t", {remove: true});
        };

    },
    setDocumentSavePath: function(path){
        this.documentSavePath = path;
        if(this.myDropzone != null)
            this.myDropzone.options.params.documentSavePath = path;
    },
    listeners: {
        show: function(){
            if(this.myDropzone != null)
                this.myDropzone.removeAllFiles();
            this.tfTotalFiles.setValue(0);
            this.documentsData = new Array();
        }
    },
    getDocumentsData: function(){
        return this.documentsData;
    }
});