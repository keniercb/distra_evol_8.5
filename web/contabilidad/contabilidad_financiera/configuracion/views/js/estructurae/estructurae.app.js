Ext.ns('Contabilidad.Estructurae');
Ext.QuickTips.init();
Ext.onReady(function() {
    new Contabilidad.Estructurae.Viewport();
});

Contabilidad.Estructurae.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function(params) {
        this.idioma = Contabilidad.Estructurae.idioma;
        this.perfil = window.parent.perfil;

        Ext.MessageBox.wait(this.idioma.lbCargando, this.idioma.lbEspere);
        this.cargarInterfaz();
        this.initEvents();
        this.initGlobalsKeys();
        Ext.MessageBox.hide();
        Contabilidad.Estructurae.Viewport.superclass.constructor.call(this, params);
        //Ocultando primero todos los botones
        //Validando permisos de acceso a los recurdos en los botones
        validate.checkPermisos();
    },
    cargarInterfaz: function() {
        this.layout = 'fit';
        this.menuBar = new Contabilidad.Estructurae.Toolbar({
            idioma: this.idioma,
            perfil: this.perfil,
            border: false
        });
        this.form = new Contabilidad.Estructurae.EditForm({
            idioma: this.idioma,
            perfil: this.perfil,
            border: false
        });
        this.treeEstructurae = new Contabilidad.Estructurae.TreeEstructuraE({
            idioma: this.idioma,
            perfil: this.perfil
        });
        this.items = [{
                xtype: 'panel',
                layout: 'border',
                border: false,
                tbar: this.menuBar,
                items: [this.treeEstructurae, this.form]
            }];
    },
    initEvents: function() {
        var me = this;

        me.treeEstructurae.btnActualizar.on({
            click: function() {
                me.treeEstructurae.sField.fnOnClear();
                me.treeEstructurae.sField.triggers[0].hide();

                var parentNode = me.treeEstructurae.getNodeById(0);
                me.treeEstructurae.selModel.select(parentNode);
                me.treeEstructurae.fireEvent('click', parentNode);
            }
        });

        me.refreshNodeColumns = function (n) {
            var t = n.getOwnerTree();
            var a = n.attributes;
            var cols = t.columns;
            var el = n.ui.getEl().firstChild; // <div class="x-tree-el">
            var cells = el.childNodes;

            for (var i = 1, len = cols.length; i < len; i++) {
                var d = cols[i].dataIndex;
                var v = (a[d]!=null)? a[d] : '';
                if (cols[i].renderer) v = cols[i].renderer(v);
                cells[i].firstChild.innerHTML = v;
            }
        }

        me.treeEstructurae.btnGeneracionComprobante.on({
            click: function() {
                var record = me.treeEstructurae.getSelectionModel().getSelectedNode();
                var habilitar = record.attributes.habilitar == 'Habilitado' ? 0 : 1;
                Ext.MessageBox.wait(me.idioma.lbCargando, me.idioma.lbEspere);
                Ext.Ajax.request({
                    url: 'generarComprobanteEstructura',
                    method: 'POST',
                    params: {
                        idestructurae: record.attributes.id,
                        habilitar: habilitar
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (success && responseData == true) {
                            if (habilitar == 1) {
                                record.attributes.habilitar = 'Habilitado';
                            } else {
                                record.attributes.habilitar = 'Deshabilitado';
                            }
                            me.refreshNodeColumns(record);
                        }
                        Ext.MessageBox.hide();
                    }
                });
            }
        });

        me.treeEstructurae.btnAsentarComprobante.on({
            click: function() {
                var record = me.treeEstructurae.getSelectionModel().getSelectedNode();
                var asentar = record.attributes.asentar == 'Habilitado' ? 0 : 1;
                Ext.MessageBox.wait(me.idioma.lbCargando, me.idioma.lbEspere);
                Ext.Ajax.request({
                    url: 'generarComprobanteEstructura',
                    method: 'POST',
                    params: {
                        idestructurae: record.attributes.id,
                        asentar: asentar
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        if (success && responseData == true) {
                            if (asentar == 1) {
                                record.attributes.asentar = 'Habilitado';
                            } else {
                                record.attributes.asentar = 'Deshabilitado';
                            }
                            me.refreshNodeColumns(record);
                        }
                        Ext.MessageBox.hide();
                    }
                });
            }
        });

        me.treeEstructurae.on({
            resize: function(cmp, adjWidth, adjHeight, rawWidth, rawHeight) {
                me.treeEstructurae.sField.setWidth(adjWidth - 4);
                cmp.doLayout();
            },
            beforeload: function(n) {
                me.treeEstructurae.body.mask(me.idioma.lbCargando, 'x-mask-loading');
            },
            load: function(n) {
                me.treeEstructurae.body.unmask();
                if (me.treeEstructurae.getRootNode().hasChildNodes()) {
                    me.menuBar.btnCargarconf.hide();
                } else {
                    if (!me.treeEstructurae.sField.hasSearch)
                        me.menuBar.btnCargarconf.show();
                }
                me.treeEstructurae.btnActualizar.focus(true, 1000);
            },
            bodyresize: function(p, w, h) {
                me.treeEstructurae.columns[0].width = parseInt(w * 0.57);
                me.treeEstructurae.columns[1].width = parseInt(w * 0.20);
                me.treeEstructurae.columns[2].width = parseInt(w * 0.20);
            },
            click: function(n, e) {
                me.form.nodeSelect = n;
                me.form.gpFormatos.maskDisabled = false;
                if (n.attributes.id != 0) {
                    me.form.enable();
                    me.form.setEstEconomica(n.attributes.id, n.attributes._parent);
                    me.form.loadDataEstEconomica(n.attributes.id, n.attributes.idcriterioe);
                    me.form.btnEliminar.setDisabled((n.attributes.leaf) ? false : true);
                    //me.form.btnNuevo.enable();
                    me.form.btnGuardar.disable();
                    me.treeEstructurae.btnGeneracionComprobante.enable();
                    me.treeEstructurae.btnAsentarComprobante.enable();

                } else {
//                      if(me.treeEstructurae.getRootNode().hasChildNodes()) {
//                          me.form.disable();
//                      }else{
//                          me.form.enable();
//                      }

                    me.form.enable();
                    me.treeEstructurae.btnGeneracionComprobante.disable();
                    me.treeEstructurae.btnAsentarComprobante.disable();
                    // me.form.disable();
                    me.form.setEstEconomica(0, 0);
                    me.form.btnNuevo.fireEvent('click');
                    //me.form.btnNuevo.disable();
                   // me.form.btnGuardar.disable();


                }
            }
        });

        me.form.on({
            beforeAction: function(node) {
                me.treeEstructurae.beforeAction(node);
            },
            bodyresize: function(p, width, height) {
                me.form.gpFormatos.setSize(width - 35, height - 320);
            }
        });
    },
    initGlobalsKeys: function() {
        var me = this;
        this.map = new Ext.KeyMap(document, [
            {
                key: "r",
                alt: true,
                fn: function() {
                    if (me.menuBar.btnCargarconf.isVisible())
                        me.menuBar.btnCargarconf.fireEvent('click');
                }
            }, {
                key: "z",
                ctrl: true,
                alt: true,
                fn: function() {
                    me.treeEstructurae.btnActualizar.fireEvent('click');
                }
            }, {
                key: "h",
                alt: true,
                fn: function() {
                    me.menuBar.btnAyuda.fireEvent('click');
                }
            }
        ]);
    }
});
