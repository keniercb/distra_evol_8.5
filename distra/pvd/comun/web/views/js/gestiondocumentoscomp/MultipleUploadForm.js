/**
 * Componente para la carga masiva de ficheros
 */
Ext.ns('Ext.components');
Ext.components.MultipleUploadForm = Ext.extend(Ext.Window, {
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
    initComponent: function() {
        var self = this;
        this.myDropzone = null;

        //Renderiza el grafico
        this.on('render', this.renderUploadForm, this);

        this.btnClose = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar ventana',
            handler: function() {
                self.close();
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
            /*'Total de ficheros: ', this.tfTotalFiles,*/ '->', this.btnClear
        ];
        Ext.components.MultipleUploadForm.superclass.initComponent.call(this);

    },
    renderUploadForm: function(cmp) {
        var me = this;
        this.myDropzone = new Dropzone(this.body.dom, {
            url: 'cargardatosexcel',
            paramName: "nombreFichero", // The name that will be used to transfer the file
            maxFilesize: 20, // MB
            maxFiles: 1, //Cantidad maxima de archivos que se pueden subir.
            dictMaxFilesExceeded: 'No puede subir más de 1 fichero.',
            //acceptedFiles: 'image/jpeg',
            //acceptedFiles: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv',  
            acceptedFiles: '',
            //dictInvalidFileType: 'Solo puede subir ficheros de formato JPG',
            accept: function(file, done) {
                cmp.tfTotalFiles.setValue(me.myDropzone.files.length);
                PVD.mostrarMascara('importarPerso', 'Por favor espere...', 'Procesando informaci&oacute;n');
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
            PVD.ocultarMascara('importarPerso');
            
            if (response.codigo == 'EXTINVALID') {
                mostrarMensaje(6, 'Solo se pueden subir ficheros en formato XLS.');
            }
            
//            if(response.codigo == 'EXISTEELARCHIVO'){
//                mostrarMensaje(6, 'El archivo ya existe.');
//            }
            
            if (response.codigo == 'OK'){
                _this.mostrarMensajePropio('La carga se realiz&oacute; satisfactoriamente. <p> </p> <b>Adicionados: '+response.datos.adicionados+'  <b>Modificados:</b> '+response.datos.modificados+'   <b>No procesados:</b> '+response.datos.noprocesados+'   <b>L&iacute;neas incorrectas:</b> '+response.datos.noprocesadoslineasincorrectas+'  <b>Total:</b> '+response.datos.total);
                me.btnLimpiarFechaCarga.handler();
            }
            
        });
        
        this.mostrarMensajePropio = function(message){
            var msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
            var msg = Ext.DomHelper.append(msgCt, '<div class="msg"><div id="imgOk"></div><div onclick="this.parentNode.remove()" id="closePopup"></div><h3>Informaci&oacute;n</h3><p>' + message + '</p></div>', true);
            msg.slideIn('t').pause(300).ghost("t", {remove: true});
        };
        
    }
});