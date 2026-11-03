Ext.ns('Ext.LOG.RegNumOperativo');
arrVisor = new Array();
Ext.LOG.RegNumOperativo.panelCargarImagenes = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        var _this = this;
        _this.idioma = config.idioma;
        _this.autoScroll = true;
        _this.region = config.region;
        _this.title = _this.idioma.lbImagenes;
        _this.border = false;
        _this.bodyBorder = false;
        _this.frame = true;
        _this.layout = 'border';
        _this.arregloImagenesEliminar = new Array();
        _this.arregloImagenes = new Array();
        _this.arregloImagenesVisor = new Array();
        idImagenSeleccionada = null;
        _this.listeners = {
            'activate': function() {
                imagenparaBtnMaximisar = null;
                idImagenSeleccionada = null;
                arrVisor = _this.arregloImagenesVisor;
            }
        }
        Ext.apply(this, config);
        Ext.LOG.RegNumOperativo.panelCargarImagenes.superclass.constructor.call(this, config);
    },
    initComponent: function() {
        var _this = this;
        _this.setTitle('Im&aacute;genes'/*, 'image-add-log'*/);
        _this.idnewimg = 0;
        this.stImagenes = new Ext.data.JsonStore({
            //url: 'getImagenes',
            root: 'data',
            fields: ['src', 'idimagen'],
            listeners: {
                'add': function(store, records, index) {
                    if (records[0].data.idimagen && records[0].data.idimagen != "") {
                        _this.arregloImagenesVisor.push(records[0].data.idimagen);
                    }
                }
            }
        });
        if (_this.arrImagenesRegistro) {
            for (var i = 0; i < _this.arrImagenesRegistro.length; i++) {
                _this.stImagenes.insert(0, new _this.stImagenes.recordType({
                    idimagen: _this.arrImagenesRegistro[i]['idimagen'],
                    src: _this.arrImagenesRegistro[i]['src']
                }));
            }
        }

        _this.fileUploadForm = new Ext.form.FormPanel({
            fileUpload: true,
            hideLabel: true,
            width:63,
            trackResetOnLoad: true,
            defaults: {
                allowBlank: true,
                msgTarget: 'side'
            },
            items: [
                {
                    hideLabel: true,
                    xtype: 'logfileuploadfield',
                    buttonOnly: true,
                    name: 'foto',
                    buttonText: _this.idioma.btnImportar,
                    buttonCfg: {
                        tooltip: _this.idioma.lbTtBtnImportar,
                        iconCls: 'importar'
                    },
                    listeners: {
                        'fileselected': function(fs, v) {
                            _this.fs = fs;
                            _this.visor = new Ext.Window({
                                height: 500,
                                width: 600,
                                constrain: true,
                                modal: true,
                                html: '<img id="idImagenLogoCM" title="imagen" style="width: 100%; height: 100%;">',
                                buttons: [
                                    {
                                        text: _this.idioma.btnCancelar,
                                        tooltip: _this.idioma.btnCancelar,
                                        iconCls: 'cancelar',
                                        handler: function() {
                                            _this.visor.close();
                                        }
                                    },
                                    {
                                        tooltip: _this.idioma.btnAceptar,
                                        text: _this.idioma.btnAceptar,
                                        iconCls: 'aceptar',
                                        handler: function() {
                                            _this.visor.close();
                                            _this.idnewimg++;
                                            _this.stImagenes.insert(0, new _this.stImagenes.recordType({
                                                idimagen: _this.incrementoID + _this.idnewimg,
                                                src: _this.objImg.src
                                            }));
                                        }
                                    }
                                ],
                                listeners: {
                                    'show': function() {

                                        _this.oFReader = new FileReader();
                                        _this.objImg = document.getElementById("idImagenLogoCM");
                                        _this.oFReader.onload = function(oFREvent) {
                                            _this.objImg.src = oFREvent.target.result;
                                        };
                                        var obj = _this.fs.fileInput.dom.files[0];
                                        _this.oFReader.readAsDataURL(obj);
                                    }
                                }
                            })
                            _this.visor.show();
                            _this.visor.doLayout();
                        }
                    }
                }
            ]
        });
        _this.items = [
            {
                region: 'north',
                xtype: 'panel',
                layout: 'column',
                baseCls: 'x-toolbar',
                height: 28,
                items: [
                    {
                        columnWidth: .0,
                        style: 'margin-top: 0px;',
                        items: [_this.fileUploadForm]
                    },
                    {
                        columnWidth: .0,
                        items: [
                            {
                                xtype: 'button',
                                text: _this.idioma.btnEliminar,
                                tooltip: _this.idioma.lbTtBtnEliminar,
                                //icon: perfil.dirImg + 'eliminar.png',
                                iconCls: 'eliminar',
                                handler: function() {
                                    if (idImagenSeleccionada) {
                                        if (idImagenSeleccionada != undefined) {
                                            _this.eliminarImagen();
                                        }
                                    }
                                    else {
                                        mostrarMensaje(1, "Debe seleccionar una imagen.")
                                    }
                                }
                            }
                        ]
                    },
                    {
                        columnWidth: .0,
                        items: [
                            {
                                xtype: 'button',
                                text: _this.idioma.btnMaximizar,
                                tooltip: _this.idioma.lbTtBtnMaximizar,
                                iconCls: 'maximizar',
                                handler: function() {
                                    if (idImagenSeleccionada) {
                                        if (idImagenSeleccionada != undefined) {
                                            getVisorImagenes({
                                                id: idImagenSeleccionada
                                            });
                                        }
                                    }
                                    else {
                                        mostrarMensaje(1, "Debe seleccionar una imagen.")
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                region: 'center',
                layout: 'border',
                xtype: 'panel',
                autoScroll: true,
                style: "background: white; font: 11px Arial, Helvetica, sans-serif;",
                items: [new Ext.DataView({
                        region: 'center',
                        multiSelect: true,
                        overClass: 'x-view-over',
                        itemSelector: 'div.thumb-wrap',
                        emptyText: '',
                        store: _this.stImagenes,
                        tpl: new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap" id="{name}">', '<div class="thumb" width=100 height=100><img onClick ="marcarImagen(this)" onDblClick="getVisorImagenes(this)" src="{src}" id="{idimagen}" /></div>', '<span class="x-editable">{shortName}</span></div>', '</tpl>', '<div class="x-clear"></div>'),
                        plugins: [new Ext.DataView.DragSelector(), new Ext.DataView.LabelEditor({
                                dataIndex: 'name'
                            })]
                    })]
            }
        ]
        Ext.LOG.RegNumOperativo.panelCargarImagenes.superclass.initComponent.call(this);
    },
    eliminarImagen: function() {
        var _this = this;
        var record = null;
        for (var i = 0; i < _this.stImagenes.getCount(); i++) {
            var imagen = _this.stImagenes.data.items[i].data;
            if (typeof imagen.idimagen == 'string') {
                if (imagen.idimagen === idImagenSeleccionada) {
                    _this.arregloImagenesEliminar.push(idImagenSeleccionada);
                    record = _this.stImagenes.data.items[i];
                    break
                }
            } else {
                if (imagen.idimagen == idImagenSeleccionada) {
                    record = _this.stImagenes.data.items[i];
                    break
                }
            }
        }
        _this.stImagenes.remove(record);
    },
    retornarValoresCmp: function() {
        var _this = this;
        for (var i = 0; i < _this.stImagenes.getCount(); i++) {
            var sr = _this.stImagenes.data.items[i].data;
            if (typeof sr.idimagen == 'number') {
                _this.arregloImagenes.push(sr.src);
            }
        }
        var boolRegistroImg = (_this.arrImagenesRegistro && _this.arrImagenesRegistro.length == 0);
        var paraModificar = (boolRegistroImg && (_this.arregloImagenes.length == 0 && _this.arregloImagenesEliminar.length == 0));
        if(_this.modificar && paraModificar)
        {
            console.info("fue panel imagenes");
            return -1;
        }
         return {
            imagenesInsertar: _this.arregloImagenes,
            imagenesEliminar: _this.arregloImagenesEliminar
        }
    },
    LimpiarValoresCmp: function() {
        this.stImagenes.removeAll();
    }
});
function marcarImagen(imagen) {
    idImagenSeleccionada = imagen.id;
}
function getVisorImagenes(imagen) {
    var tamnnoInicialFijo = new Array();
    tamnnoInicialFijo[0] = 960;
    tamnnoInicialFijo[1] = 550.4;
    var LoadMask = new Ext.LoadMask(Ext.getCmp('idwingestregnumeric').getEl(), {msg: "Cargando..."});
    LoadMask.show();
    //visorImagenes(arrVisor, idimagen, arrTamanoInicialFijo, LoadMask)
    visorImagenes(arrVisor, imagen.id,/* '../../../../utiles/', */tamnnoInicialFijo, LoadMask);
}