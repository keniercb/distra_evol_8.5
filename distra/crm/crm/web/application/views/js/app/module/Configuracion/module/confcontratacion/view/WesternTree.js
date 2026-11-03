/**
 * Created by alberto on 30/07/2015.
 */
Ext.define('ConfContratacion.view.WesternTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.confwesterntree',
    rootVisible: false,
    region: 'west',
    flex: 0.2,
    minWidth: 200,
    maxWidth: 245,
    collapsible: true,
    split: true,
    layout: 'fit',
    loadMask: true,
    collapseFirst: false,
    hideHeaders: true,
    border: false,
    initComponent: function () {
        this.etiquetas = LangMgr.getLang(this);
        this.emptyText = this.etiquetas.msgNoDataLoaded;
        this.title = this.etiquetas.titleModule;

        this.createStore();
        this.callParent();
    },
    createStore: function () {
        var me = this;
        Ext.define('Modulo', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'text', type: 'string'},
                {name: 'module', type: 'string'}
            ]
        });

        this.store = Ext.create('Ext.data.TreeStore', {
            model: 'Modulo',
            root: {
                text: me.etiquetas.titleModule,
                expanded: true,
                children: [
                    {
                        leaf: false,
                        text: me.etiquetas.lbConfG,
                        expanded: true,
                        children: [
                            {
                                leaf: true,
                                text: me.etiquetas.lbArchivoPHP,
                                id: 'confarchivophp'
                            },
                            {
                                leaf: true,
                                text: 'Archivos temporales',
                                id: 'confcache'
                            }
                        ]
                    },
                    {
                        leaf: false,
                        text: me.etiquetas.titleGestContrato,
                        module: 'GestionContrato',
                        expanded: true,
                        children: [
                        	{
                                leaf: true,
                                text: me.etiquetas.lbGeneral,
                                id: 'confcontratogeneral'
                            },
                            {
                                leaf: true,
                                text: me.etiquetas.lbGestorDocumental,
                                id: 'confcontratogd'
                            },
                            {
                                leaf: true,
                                text: me.etiquetas.lbPlanificacion,
                                id: 'confcontratoplanif'
                            },
                            {
                                leaf: true,
                                text: me.etiquetas.lbContabilidad,
                                id: 'confcontratocontabilidad'
                            },
                            {
                                leaf: true,
                                text: me.etiquetas.lbCompartimentacion,
                                id: 'confcontratocompart'
                            }
                        ]
                    },
                    {
                        leaf: false,
                        text: me.etiquetas.titleGestContratoImportacion,
                        module: 'GestionContratoImportacion',
                        expanded: true,
                        children: [
                            {
                                leaf: true,
                                text: me.etiquetas.lbGestorDocumental,
                                id: 'confcontratoimportaciongd'
                            }
                        ]
                    },
                    {
                        leaf: false,
                        text: me.etiquetas.titleComite,
                        module: 'Comite',
                        expanded: true,
                        children: [
                            {
                                leaf: true,
                                text: 'Configurar comites',
                                id: 'confcomitegeneral'
                            },
                            {
                                leaf: true,
                                text: me.etiquetas.lbTransiciones,
                                id: 'confcomitetran'
                            },
                            {
                                leaf: true,
                                text: me.etiquetas.lbGestorDocumental,
                                id: 'confcomitegd'
                            }
                        ]
                    },
                    {
                        leaf: false,
                        text: me.etiquetas.lbOfertaNegocio,
                        module: 'OfertaNegocio',
                        expanded: true,
                        children: [
                            {
                                leaf: true,
                                text: me.etiquetas.lbGeneral,
                                id: 'confofertanegociog'
                            },
                            {
                                leaf: true,
                                text: me.etiquetas.lbCompartimentacion,
                                id: 'confofertacompart'
                            }
                        ]
                    },
                    {
                        leaf: false,
                        text: me.etiquetas.lbSolicitudNegocio,
                        module: 'SolicitudNegocio',
                        expanded: true,
                        children: [
                            {
                                leaf: true,
                                text: me.etiquetas.lbGeneral,
                                id: 'confsolicitudnegocio'
                            },
                            {
                                leaf: true,
                                text: me.etiquetas.lbCompartimentacion,
                                id: 'confsolicitudcompart'
                            }
                        ]
                    },
                    {
                        leaf: false,
                        text: me.etiquetas.lbSolicitudPago,
                        module: 'SolicitudPago',
                        expanded: true,
                        children: [
                            {
                                leaf: true,
                                text: me.etiquetas.lbGestorDocumental,
                                id: 'confsolicitudpagogd'
                            }
                        ]
                    },
                    {
                        leaf: false,
                        text: me.etiquetas.lbClientesProvedores,
                        module: 'Clientesproveedores',
                        expanded: true,
                        children: [
                            {
                                leaf: true,
                                text: me.etiquetas.lbGeneral,
                                id: 'confclientesproveedores'
                            }
                        ]
                    },
                    {
                        leaf: false,
                        text: 'Proforma'  ,
                        module: 'Proformas',
                        expanded: true,
                        children: [
                            {
                                leaf: true,
                                text: 'Proforma',
                                id: 'confproforma'
                            },
                            {
                                leaf: true,
                                text: 'Variables',
                                id: 'confproformavariables'
                            }
                        ]
                    },
                ]

            }
        });
    }
});