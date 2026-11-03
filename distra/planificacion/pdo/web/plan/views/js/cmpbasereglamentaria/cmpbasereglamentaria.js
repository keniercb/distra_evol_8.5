Utilidades.Cmp.Cmpbasereglamentaria = function (opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();


    this.ImportarBaseReglamentaria = function () {

        //campo para la denominacion de la actividad
        _this.denominacion = new Ext.form.TextField({
            id: 'denominacion',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            fieldLabel: 'Denominación',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,.:/()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            anchor: '95%'
        });

        _this.fpImportarBaseReglamentaria = new Ext.FormPanel({
            labelAlign: 'top',
            fileUpload: true,
            frame: true,
            items: [
                {
                    xtype: 'panel',
                    border: true,
                    margin: '5 5 5 5',
                    cmargin: '5 5 5 5',
                    frame: true,
                    html: '<div style = "text-align:justify text-format: 3px">' +
                        '<img align = "left" src="../../../comun/recursos/images/default/window/icon-info.gif" style="width:40px;height:40px;">' +
                        '<h4>Tenga en cuenta que en el proceso de insertar el archivo; ' +
                        'en el caso de que ya exista el fichero en el sistema, este ser&aacute; ' +
                        'reemplazado.</h4>' +
                        '</div>'
                }, {
                    html: '<br>'
                },
                _this.denominacion,
                {
                xtype: 'fileuploadfield',
                fieldLabel: 'Buscar archivo',
                id: 'form-file-basereglamentaria',
                emptyText: 'Seleccione el archivo (docx,doc,pdf)...',
                name: 'file',
                anchor: '95%',
                buttonCfg: {
                    text: '',
                    anchor: '95%',
                    iconCls: 'buscar'
                },
                allowBlank: false
            }],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    if(valid){
                        var extension=fm.items.items[3].value.split('.')[fm.items.items[3].value.split('.').length-1];
                        if(extension!=""){
                            if(extension!="docx" && extension!="pdf" && extension!="doc"){
                                fm.items.items[3].setValue("");
                            }
                        }
                        _this.btnGuardarBaseReglamentaria.enable();
                    }else{
                        _this.btnGuardarBaseReglamentaria.disable();
                    }
                }
            }
        });

        _this.btnCancelarBaseReglamentaria = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.wImportarBaseReglamentaria.destroy();
            }
        });

        _this.btnGuardarBaseReglamentaria = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                _this.importarBaseReglamentaria(1);
            }
        });

        _this.btnAplicarBaseReglamentaria = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                _this.importarBaseReglamentaria(2);
            }
        });

        _this.importarBaseReglamentaria = function (accion) {
            _this.BarraProgreso.show('Espere por favor, subiendo archivo...');

            _this.fpImportarBaseReglamentaria.getForm().submit(
                {
                    method: 'POST',
                    url: 'Salvarbasesreglamentarias',
                    timeout: 3600000,
                    params: {
                        denominacion: _this.denominacion.getValue()
                    },
                    failure: function (form, action) {
                        _this.BarraProgreso.hide();
                        if (action.result.mensaje == 1) {
                            mostrarMensaje(1, 'El archivo fue guardado satisfactoriamente.');
                        }else if (action.result.mensaje == 2) {
                            mostrarMensaje(1, 'Error cargando archivo de base reglamentaria.');

                        }else if (action.result.mensaje == 3) {
                            mostrarMensaje(1, 'El fichero ya existía, ha sido remplazado.');

                        }else if (action.result.success == false) {
                            mostrarMensaje(1, 'Error cargando archivo de base reglamentaria.');
                        }

                        if(accion==1){
                            if (action.result.mensaje == 1 || action.result.mensaje == 3) {
                                _this.wImportarBaseReglamentaria.destroy();
                                _this.storePrincipal.reload();
                            }
                        }else{
                            if (action.result.mensaje == 1 || action.result.mensaje == 3) {
                                _this.fpImportarBaseReglamentaria.getForm().reset();
                                _this.storePrincipal.reload();
                            }
                        }


                    }
                }
            );
        }

        _this.wImportarBaseReglamentaria = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            resizable: false,
            layout: 'fit',
            title: 'Adicionar archivo de base reglamentaria',
            width: 420,
            height: 270,
            items: [_this.fpImportarBaseReglamentaria],
            buttons: [_this.btnCancelarBaseReglamentaria, _this.btnAplicarBaseReglamentaria,_this.btnGuardarBaseReglamentaria]
        });
        _this.wImportarBaseReglamentaria.show();

    }


    //botones para la gestion

    this.btnUploadFile = new Ext.Button({
        handler: function () {
            /***
             * Subir archivos
             * ***/
            _this.ImportarBaseReglamentaria();
        },
        disabled: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar archivo',
        id: 'btnUploadFile',
        key: {
            alt: true,
            key: 'A'
        },
        scope: this
    });

    this.btnDownloadFile = new Ext.Button({
        handler: function () {
            /***
             * Descargar archivos
             * ***/
            var seleccion = _this.smPrincipal.getSelections();
            if(seleccion.length==1){
                window.open('../../resources/basereglamentaria/'+seleccion[0].data.nombrearchivo);
            }else{
                var idselementos = [];
                Ext.each(seleccion, function (r) {
                    idselementos.push(r.data.idbase);
                });
                var sms = 'Eliminando elementos';
                _this.BarraProgreso.show(sms);
                Ext.Ajax.request({
                    url: 'Descargarbasesreglamentarias',
                    params: {
                        idselementos: Ext.encode(idselementos)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        var responseData = Ext.decode(response.responseText);
                        if(responseData.archivo!=""){
                            window.open('../../resources/basereglamentaria/'+responseData.archivo);
                        }else{
                            mostrarMensaje(1, "Error descargando las bases reglamentarias");
                        }

                    }
                });
            }
        },
        disabled: true,
        iconCls: 'exportar',
        tooltip: 'Descargar archivo',
        id: 'btnDownloadFile',
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });

    this.btnEliminarFile = new Ext.Button(

        {
        handler: function () {
            var seleccion = _this.smPrincipal.getSelections();
            var msg = "el elemento seleccionado";
            var msgeliminado = "Se ha eliminado el elemento satisfactoriamente.";
            if (seleccion.length > 1){
                msg = "los elementos seleccionados";
                msgeliminado = "Se han eliminado los elementos satisfactoriamente.";
            }

            mostrarMensaje(2, '¿Está seguro que quiere eliminar ' + msg + '?', ejecuta);

            function ejecuta(btnPresionado) {
                if (btnPresionado == 'ok') {
                    var idselementos = [];
                    Ext.each(seleccion, function (r) {
                        idselementos.push(r.data.idbase);
                    });
                    var sms = 'Eliminando elementos';
                    _this.BarraProgreso.show(sms);
                    Ext.Ajax.request({
                        url: 'Eliminarbasesreglamentarias',
                        params: {
                            idselementos: Ext.encode(idselementos)
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 1) {
                                mostrarMensaje(1, msgeliminado);
                                _this.storePrincipal.reload();
                            }
                        }
                    });
                }
            }
        },
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar archivo',
        id: 'btnEliminarFile',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });


    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaCmpBaseReglamentaria',
        text: 'Ayuda',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });

    this.startPrincipal=0;
    this.storePrincipal = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpbasereglamentaria/Cargarbasesreglamentarias',
        listeners: {
            beforeload: function (st) {
                st.baseParams.start=_this.startPrincipal;
            }
        },
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idbase',
            root: "campos"
        }, [{
            name: 'idbase'
        }, {
            name: 'denominacion'
        }, {
            name: 'nombrearchivo'
        }, {
            name: 'fechacreacion'
        }, {
            name: 'nombreautor'
        }])
    });

    this.filtrosPrincipal = new Ext.grid.GridFilters({
        filters: [{
            type: 'string',
            dataIndex: 'denominacion'
        },{
            type: 'string',
            dataIndex: 'nombrearchivo'
        }, {
            type: 'string',
            dataIndex: 'autor'
        }]
    });

    this.smPrincipal = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {

            },
            rowdeselect: function (sm, indiceFila, record) {
            },
            selectionchange:function (sm) {
                if(sm.getSelections().length>0){
                    _this.btnEliminarFile.enable();
                    _this.btnDownloadFile.enable();
                }else{
                    _this.btnEliminarFile.disable();
                    _this.btnDownloadFile.disable();
                }
            }
        }
    });
    //Grid gestion gpGpProductos
    this.gpPrincipal = new Ext.grid.GridPanel({
        frame: true,
        region: 'center',
        width:100,
        height:200,
        stripeRows: true,
        store: _this.storePrincipal,
        sm: _this.smPrincipal,
        plugins: _this.filtrosPrincipal,
        columns: [
            _this.smPrincipal,
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idbase'
            }, {
                header: 'Denominación',
                tooltip: 'Denominación',
                sortable: true,
                dataIndex: 'denominacion',
                width: 300,
                renderer: function (valor, m, p) {
                    if(valor!="")
                        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
                    return valor;
                }

            }, {
                header: 'Nombre de archivo',
                tooltip: 'Nombre de archivo',
                sortable: true,
                dataIndex: 'nombrearchivo',
                width: 300,
                renderer: function (valor, m, p) {
                    if(valor!="")
                        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
                    return valor;
                }

            },{
                header: 'Fecha',
                tooltip: 'Fecha de creación',
                sortable: true,
                dataIndex: 'fechacreacion',
                width: 480,

            }, {
                header: 'Autor',
                tooltip: 'Usuario autor',
                sortable: true,
                dataIndex: 'nombreautor',
                width: 350,
                renderer: function (valor, m, p) {
                    if(valor!="")
                        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
                    return valor;
                }

            }
        ],
        loadMask: {
            store: _this.storePrincipal
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.storePrincipal,
            displayInfo: true,
            listeners: {
                beforechange: function (p, e) {
                    _this.startPrincipal = e.start;
                }
            }
        }),

    });

    //panel principal de la vista
    this.PanPrincipal = new Ext.Panel({
        region: 'center',
        layout: 'border',
        usarKeymap: true,
        botonesKeymap: [_this.btnUploadFile, _this.btnDownloadFile, _this.btnEliminarFile, _this.btnAyuda],
        tbar: [_this.btnUploadFile, '-', _this.btnDownloadFile, '-', _this.btnEliminarFile, '->', _this.btnAyuda],
       items: [_this.gpPrincipal]
    });

    this.WinPrincipal = new Ext.Window({
        layout: 'border',
        constrain: true,
        closable: false,
        graggable: false,
        maximized: true,
        noTitle: true,
        modal: true,
        width: 1000,
        height: 510,
        items: [_this.PanPrincipal]
    });



    this.CargarCmpBaseReglamentaria = function () {
       _this.WinPrincipal.show();
    };


};
