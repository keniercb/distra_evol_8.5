/**
 * @class Ext.DatMaest.ClientProveed
 * @extends Ext.panel
 * @author Ing. Alberto Mesa Martínez
 */
Ext.ns('Ext.DatMaest.ClientProveed');
Ext.DatMaest.ClientProveed.EspacioTrabajo = Ext.extend(Ext.Window, {
    layout: 'border',
    modal: true,
    constrain: true,
    perfil: window.parent.UCID.portal.perfil,
    height: 450,
    width: 600,
    constructor: function (params) {
        this.etiquetas = params.etiquetas || {};
        this.title = "Configurar espacios de trabajo";
        this.createItems(params);
        Ext.DatMaest.ClientProveed.EspacioTrabajo.superclass.constructor.call(this, params);
        this.addEvents('espaciotrabajoconfigurado');
        this.createEvents();
    },
    createItems: function (params) {
        var me = this;

        this.idclienteproveedorespacio = new Ext.form.Hidden({
            name: 'idclienteproveedorespacio',
            allowBlank: false
        });

        this.idclienteproveedorentidad = new Ext.form.Hidden({
            name: 'idclienteproveedorentidad',
            allowBlank: false
        });

        this.idespaciotrabajo = new Ext.form.Hidden({
            name: 'idespaciotrabajo',
            allowBlank: false
        });

        this.nombreespaciotrabajo = new Ext.form.TextField({
            fieldLabel: 'Espacio de trabajo',
            name: 'nombreespaciotrabajo',
            anchor: '100%',
            allowBlank: false,
            readOnly: true
        });

//         this.form = new Ext.form.FormPanel({
        this.panelprinc = new Ext.form.FieldSet({
            title: 'Espacio de trabajo cliente',
            region: 'north',
            trackResetOnLoad: true,
            height: 90,
            labelAlign: 'top',
            margin: '0 0 30 0',
            items: [this.idclienteproveedorespacio, this.idclienteproveedorentidad, this.idespaciotrabajo, this.nombreespaciotrabajo]
        });

        this.loader = new Ext.tree.TreeLoader({
            dataUrl: 'obtenerEspaciosTrabajo',
            autoLoad: false
        });

        this.tree = new Ext.tree.TreePanel({
            autoScroll: true,
            region: 'west',
            width:250,
            split: true,
            title: 'Espacios de trabajo',
            border: false,
            layoutConfig: {
                animate: true
            },
            enableDD: true,
            loader: this.loader,
            rootVisible: false
        });

        this.treeSort = new Ext.tree.TreeSorter(this.tree, {
            folderSort: true,
            dir: "asc",
            caseSensitive: true
        });

        this.root = new Ext.tree.AsyncTreeNode({
            text: 'Espacios de trabajo',
            draggable: false,
            id: '0',
            expanded: true
        });

        this.tree.setRootNode(this.root);
        
        this.idespaciotrabajocontrato = new Ext.form.TextField({
            fieldLabel: 'Espacio de trabajo contrato',
            name: 'contrato',
            anchor: '100%',
            readOnly: true,
            columnWidth: 0.90
        });

        this.buttonLimpiarContrato=new Ext.Button({
            iconCls: 'limpiar',
//             text: this.etiquetas.lbTtLimpiar,
            tooltip: this.etiquetas.qtipTtLimpiar,
            columnWidth: 0.10,
            style: 'margin:17 0 0 0',
            handler: function () {
                me.idespaciotrabajocontrato.valorLimpiado=me.idespaciotrabajocontrato.getValue();
                me.idespaciotrabajocontrato.setValue('');
            }
        });

        this.idespaciotrabajooferta = new Ext.form.TextField({
            fieldLabel: 'Espacio de trabajo oferta',
            name: 'oferta',
            anchor: '100%',
            readOnly: true,
            columnWidth: 0.90
        });

        this.buttonLimpiarOferta=new Ext.Button({
            iconCls: 'limpiar',
//             text: this.etiquetas.lbTtLimpiar,
            tooltip: this.etiquetas.qtipTtLimpiar,
            columnWidth: 0.10,
            style: 'margin:17 0 0 0',
            handler: function () {
                me.idespaciotrabajooferta.valorLimpiado=me.idespaciotrabajooferta.getValue();
                me.idespaciotrabajooferta.setValue('');
            }
        });

        this.idespaciotrabajosolicitud = new Ext.form.TextField({
            fieldLabel: 'Espacio de trabajo solicitud',
            name: 'solicitud',
            anchor: '100%',
            readOnly: true,
            columnWidth: 0.90
        });

        this.buttonLimpiarSolicitud=new Ext.Button({
            iconCls: 'limpiar',
//             text: this.etiquetas.lbTtLimpiar,
            tooltip: this.etiquetas.qtipTtLimpiar,
            columnWidth: 0.10,
            style: 'margin:17 0 0 0',
            handler: function () {
                me.idespaciotrabajosolicitud.valorLimpiado=me.idespaciotrabajosolicitud.getValue();
                me.idespaciotrabajosolicitud.setValue('');
            }
        });


        this.mensajeLabel=new Ext.form.Label({
            hidden: params.idclienteproveedorentidad!=null,
//             anchor: '100%',
            columnWidth:1,
            html: '<span style="color:red;">Debe seleccionar un cliente/proveedor para ver los datos</span>'
        })

        this.panelaux = new Ext.form.FieldSet({
            title: 'Espacios de trabajo auxiliares',
//             frame: true,
//             border: false,
            disabled: params.idclienteproveedorentidad==null,
            region: 'center',
            trackResetOnLoad: true,
            height: 70,
            layout:'column',
//             labelAlign: 'top',
            items: [
                {
                    anchor:'100%',
                    layout:'form',
                    columnWidth:0.90,
                    items:[this.idespaciotrabajocontrato]    
                },
                {
                    anchor:'100%',
                    layout:'form',
                    columnWidth:0.10,
                    items:[this.buttonLimpiarContrato]    
                },
                {
                    anchor:'100%',
                    layout:'form',
                    columnWidth:0.90,
                    items:[this.idespaciotrabajooferta]    
                },
                {
                    anchor:'100%',
                    layout:'form',
                    columnWidth:0.10,
                    items:[this.buttonLimpiarOferta]    
                },
                {
                    anchor:'100%',
                    layout:'form',
                    columnWidth:0.90,
                    items:[this.idespaciotrabajosolicitud]    
                },
                {
                    anchor:'100%',
                    layout:'form',
                    columnWidth:0.10,
                    items:[this.buttonLimpiarSolicitud]    
                },
                this.mensajeLabel
            ]
        });

        this.form = new Ext.form.FormPanel({
            region: 'center',
            layout: 'border',
            trackResetOnLoad: true,
            frame:true,
            labelAlign: 'top',
            items:[this.panelprinc, this.panelaux]
        });

        this.items=[this.tree, this.form];

//         this.items = [this.form, this.tree];

        this.defaultButton = this.btnCancel = new Ext.Button({
            iconCls: 'cancelar',
            text: this.etiquetas.lbBtnCancelar,
            tooltip: this.etiquetas.lbTtCancelar,
            handler: function () {
                me.destroy();
            }
        });

        this.btnAccept = new Ext.Button({
            iconCls: 'aceptar',
            disabled: true,
            text: this.etiquetas.lbBtnAceptar,
            tooltip: this.etiquetas.lbTtAceptar
        });

        this.buttons = [this.btnCancel, this.btnAccept];
    },
    createEvents: function () {
        this.tree.on({
            scope: this,
            render: function () {
                if (this.loader.isLoading()) {
                    this.showMask();
                }
            }
        });
        this.tree.getSelectionModel().on(
            {
                scope: this,
                selectionchange: function (sm, node) {
                    if (node && node.id!='msgError') {
                        this.idespaciotrabajo.setValue(node.id);
                        this.nombreespaciotrabajo.setValue(node.text);
                    }
                }
            }
        );

        this.loader.on({
            scope: this,
            beforeload: function () {
                this.showMask();
            },
            load: function () {
                if (this.loadMask) {
                    this.loadMask.hide();
                }
            }
        });

        this.on({
            show: function () {
                this.closed = false;
                Ext.TaskMgr.start({
                    run: this.checkWindow.bind(this),
                    interval: 100,
                    scope: this
                });
                if (this.espaciotrabajo) {
                    if(this.espaciostrabajoauxiliares){
                        var espacios=Ext.decode(this.espaciostrabajoauxiliares);
                        for(i in espacios){
                            this.espaciotrabajo[i]=espacios[i];
                        }
                    }
                    if(this.idclienteproveedorentidad){
                        this.espaciotrabajo['idclienteproveedorentidad']=this.idclienteproveedorentidad;
                    }
                    this.form.getForm().setValues(this.espaciotrabajo);
                }
            },
            destroy: function () {
                this.closed = true;
            }
        });

        this.btnAccept.on({
            scope: this,
            click: this.salvarEspacioTrabajo
        });
    },
    showMask: function (msg) {
        var msg = msg || this.etiquetas.lbCargando;
        this.loadMask = new Ext.LoadMask(this.tree.el, {msg: msg});
        this.loadMask.show();
    },
    showMessageBox: function (title, msg) {
        title = title || this.etiquetas.lbEsperando;
        msg = msg || this.etiquetas.msgWaitConfEspacioTrabajo;

        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    },
    checkWindow: function () {
        if (!this.closed) {
            var form = this.form.getForm();
//             console.log(form.isValid(), form.isDirty());
            if (form.isValid() && form.isDirty()) {
                this.btnAccept.enable();
            } else {
                this.btnAccept.disable();
            }
        } else {
            return false;
        }

    },
    salvarEspacioTrabajo: function () {
        var me = this;
        this.showMessageBox();
        this.form.getForm().submit({
            url: 'salvarEspacioTrabajo',
            success: function (form, action) {
                me.setOriginalValue();
                mostrarMensaje(1, me.etiquetas.msgConfEspacioTrabajoOk);
                // if(me.idclienteproveedorentidad && me.gridPrincipal){
                me.gridPrincipal.store.load();
                // }
                me.destroy();
                me.fireEvent('espaciotrabajoconfigurado');
                Ext.MessageBox.hide();
            },
            failure: function (form, action) {
                mostrarMensaje(6, me.etiquetas.msgDefaultError);
                Ext.MessageBox.hide();
            }
        })
    },
    setOriginalValue: function () {
        this.idclienteproveedorespacio.originalValue = this.idclienteproveedorespacio.getValue();
        this.idespaciotrabajo.originalValue = this.idespaciotrabajo.getValue();
        this.nombreespaciotrabajo.originalValue = this.nombreespaciotrabajo.getValue();
    }

});
