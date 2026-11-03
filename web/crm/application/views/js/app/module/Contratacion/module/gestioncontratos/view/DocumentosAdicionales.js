Ext.define('GestionContrato.view.DocumentosAdicionales', {
    extend: 'Ext.form.Panel',
    alias: 'widget.fpdocumentosadicionales',
    autoScroll: true,
    bodyStyle: {
        padding: '5px 10px 10px 10px',
        background: '#DFE9F6'
    },
    fieldDefaults: {labelAlign: 'top'},
    trackResetOnLoad: true,
    documentosFijos: false,
    // nombresDocumentosFijos:'Contrato original',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);

        me.msgExist = me.etiquetas.msgExistDocument || 'Ya existe un anexo con este nombre.';

        this.removedRecords = new Array();

        me.title = me.etiquetas.titleDocumentosAdicionales || 'Anexos';

        var items = [this.getRowConfig(Ext.id(null, 'new'))];

        if (me.documentosFijos) {
            items.splice(0, 0, {
                layout: 'column',
                border: 2,
                bodyStyle: 'background:#DFE9F6;',
                itemId: 'contrato_original',
                rowDocument: true,
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: me.etiquetas.lbName,
                        name: 'nombre_newcontratooriginal',
                        itemId: 'nombre_newcontratooriginal',
                        value: 'Contrato original',
                        readOnly: true,
                        maxLength: 30,
                        maxLengthText: me.etiquetas.validationMaxLength_30,
                        columnWidth: 0.5,
                        margin: '0 10 5 5'
                    }, {
                        layout: 'column',
                        columnWidth: 0.5,
                        border: false,
                        bodyStyle: 'background:#DFE9F6;',
                        margin: '0 5 5 0',
                        items: [
                            {
                                xtype: 'filefield',
                                fieldLabel: me.etiquetas.lbdocumento,
                                truefieldipload: true,
                                columnWidth: 1,
                                hidden: false,
                                name: 'file_newcontratooriginal',
                                itemId: 'file_newcontratooriginal',
                                buttonText: '',
                                buttonConfig: {
                                    iconCls: 'icondistra-subirfichero icon-fileupload'
                                }
                            }, {
                                xtype: 'button',
                                tooltip: me.etiquetas.lbVerDocumento,
                                iconCls: 'icondistra-descargar icon-medium',
                                action: 'showfile',
                                hidden: true,
                                margin: '18 0 0 2',
                                style: {
                                    borderWidth: '1px !important;'
                                }
                            }, {
                                xtype: 'button',
                                tooltip: me.etiquetas.lbEliminarDocumento,
                                iconCls: 'icondistra-eliminar icon-medium',
                                action: 'delfile',
                                hidden: true,
                                margin: '18 0 0 2',
                                style: {
                                    borderWidth: '1px !important;'
                                }
                            }
                        ]
                    }
                ]
            })
        }
        me.items = items;


        this.callParent();
        this.originalValue = Ext.encode(this.getForm().getValues());
    },
    insertRow: function () {
        if (!this.existEmptyRow())
            return this.add(this.getRowConfig(Ext.id(null, 'new')));

    },
    existEmptyRow: function () {
        var empty = false;

        this.cascade(function (elem) {
            if (elem.getXType() == 'filefield' && Ext.isEmpty(elem.getValue()) && elem.name != 'file_newcontratooriginal')
                empty = true;
        }, this);

        return empty;
    },
    deleteRow: function (itemId) {
        var row = this.down('[itemId=' + itemId + ']'),
            idfile = row.down('[name^=file_]').idfile;

        if (idfile) {
            this.removedRecords.push(idfile);
        }
        this.remove(itemId);
    },
    removeAllRow: function () {
        var me = this;

        me.items.each(function (item, index) {
            me.deleteRow(item.itemId);
        }, me);
    },
    getRowConfig: function (iddocumento) {
        var me = this;

        return {
            layout: 'column',
            border: false,
            bodyStyle: 'background:#DFE9F6;',
            itemId: iddocumento,
            rowDocument: true,
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: me.etiquetas.lbName,
                    name: 'nombre_' + iddocumento,
                    /*regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
                     regexText: me.etiquetas.validationOnlyAlphaSpacer,*/
                    maxLength: 100,
                    maxLengthText: me.etiquetas.validationMaxLength_100,
                    columnWidth: 0.5,
                    margin: '0 10 0 0'
                }, {
                    layout: 'column',
                    columnWidth: 0.5,
                    border: false,
                    bodyStyle: 'background:#DFE9F6;',
                    items: [
                        {
                            xtype: 'filefield',
                            fieldLabel: me.etiquetas.lbdocumento,
                            truefieldipload: true,
                            columnWidth: 1,
                            hidden: false,
                            name: 'file_' + iddocumento,
                            buttonText: '',
                            buttonConfig: {
                                iconCls: 'icondistra-subirfichero icon-fileupload'
                            }
                        }, {
                            xtype: 'button',
                            tooltip: me.etiquetas.lbVerDocumento,
                            iconCls: 'icondistra-descargar icon-medium',
                            action: 'showfile',
                            hidden: true,
                            margin: '18 0 0 2',
                            style: {
                                borderWidth: '1px !important;'
                            }
                        }, {
                            xtype: 'button',
                            tooltip: me.etiquetas.lbEliminarDocumento,
                            iconCls: 'icondistra-eliminar icon-medium',
                            action: 'delfile',
                            hidden: true,
                            margin: '18 0 0 2',
                            style: {
                                borderWidth: '1px !important;'
                            }
                        }
                    ]
                }
            ]
        }
    },
    loadDocuments: function (documents) {
        var me = this;
        Ext.each(documents, function (document, index) {
            var auxindex = index;
            if (document.nombre != 'Contrato original' && this.documentosFijos) auxindex = index + 1;
            if (document.nombre == 'Contrato original' && this.documentosFijos){
                //file_newcontratooriginal  file_newcontratooriginal
                var panel=me.down('#contrato_original'),
                    filefield=panel.down('#file_newcontratooriginal'),
                    textfield=panel.down('#nombre_newcontratooriginal');
                console.log('b1', panel.down('button[action=delfile]'))
                console.log('b2', panel.down('button[action=showfile]'))
                textfield.originalValue = document.nombre;
                panel.down('button[action=delfile]').show();
                panel.down('button[action=showfile]').show();
                filefield.setRawValue(document.nombre);
                filefield.urlfile = document.url;
                filefield.idfile = document.idnodo;
                filefield.nombre = document.nombre;
                filefield.hide();
            }else {
                var panel = this.getComponent(auxindex);
                if (panel) {
                    var filefield = panel.down('[name^=file_]'),
                        textfield = panel.down('[name^=nombre_]');
                    textfield.setValue(document.nombre);
                    textfield.originalValue = document.nombre;
                    panel.down('button[action=delfile]').show();
                    panel.down('button[action=showfile]').show();

                    filefield.setRawValue(document.nombre);
                    filefield.urlfile = document.url;
                    filefield.idfile = document.idnodo;
                    filefield.nombre = document.nombre;
                    filefield.hide();
                }
                me.insertRow();
            }
        }, this);
        this.originalValue = Ext.encode(this.getForm().getValues());
    },
    isDirty: function () {
        var value = Ext.encode(this.getForm().getValues());
        if (value != this.originalValue) {
            this.getModifiedRecords();
            return true;
        }
        return false;
    },
    getModifiedRecords: function () {
        var textfields = Ext.ComponentQuery.query('fpdocumentosadicionales textfield[name^=nombre_]'),
            modified = new Array();
        Ext.each(textfields, function (tf, index) {
            filefield = tf.up('[rowDocument=true]').down('[name^=file_]');
            if (tf.originalValue != undefined && filefield.idfile && tf.originalValue != tf.getValue()) {
                modified.push({
                    idnodo: filefield.idfile,
                    nombre: tf.getValue()
                });
            }
        }, this);

        return modified;
    },
    existEqualsRecords: function () {
        var textfields = Ext.ComponentQuery.query('fpdocumentosadicionales textfield[name^=nombre_]'),
            all = new Array(),
            exist = false;
        for (k in textfields) {
            var tf = textfields[k],
                value = tf.getValue();
            if (value) {
                if (all.indexOf(value) == -1) {
                    all.push(value);
                } else {
                    tf.markInvalid(this.msgExist);
                    exist = true;
                    break;
                }
            }
        }
        return exist;
    },
    getRemovedRecords: function () {
        return this.removedRecords;
    },
    hasInvalidField: function () {
        var exist = this.existEqualsRecords();
        if (exist) {
            return exist;
        }
        return this.callParent();
    }
});