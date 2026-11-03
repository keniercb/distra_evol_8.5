﻿
/**
 Uso:Componente para realizar la busqueda de personas.

  * ---------------------------------------------

  * 23 de Agosto 2011 |   Persona
  *

  * @extends Ext.Panel
  * @xtype
  * @autor   Linea Capital Humano - Ing. Yadir Martinez Vergara
  * @version 1.0.0
  */
Ext.ns('Ext.pvd.persona.buscarestructura');
Ext.QuickTips.init();
Ext.pvd.persona.buscarestructura.Utils = function() {
    return {
        loadMask : function(msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg : msj
            });
            this.lMask.show();
        },
        hideMask : function() {
            this.lMask.hide();
        }
    }
};
var utilsbuscarestructura = new Ext.pvd.persona.buscarestructura.Utils();

/*Componente panelBuscarestructura*/
Ext.pvd.persona.buscarestructura.panelBuscarestructura = Ext.extend(Ext.Panel,{
    region:(this.region ? this.region : 'center'),
    layout:(this.layout ? this.layout : 'fit'),
    frame:false,
    border: false,
    nivel: this.nivel,
    padre: this.padre,
    tipocargo: this.tipocargo,
    nivelachequear: this.nivelachequear,
    idpadresub: this.idpadresub,
    idsub: this.idsub,
    cargarsubordinacion: false,
    url:'/pvd/comun/index.php/buscarestructuracomp/cargarestructura',
    initComponent: function() {
        this.seleccion = null;
        this.nodosseleccionados = new Array();
        var idCmp = this.id;
        var self = this;

        this.tfbuscarestructura = new Ext.form.TextField({
            id:'tfbuscarestructura'+idCmp,
            allowBlank : true,
            minLength: 3,
            hideLabel: true,
            fieldLabel: 'Buscar estructura',
            enableKeyEvents: true, 
            regexp : /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            anchor:'98%',
            emptyText: 'Criterio a buscar',
            name : 'tfbuscador',
            listeners: {
                specialkey: function(t, e){
                    if(e.keyCode == 13){} this.Buscarestructura();
                }.createDelegate(this) 
            }
        });
		
        this.btnBuscarestructura = new Ext.Button({
            disabled : false,
            id : 'btnBuscarestructura'+idCmp,
            icon : perfil.dirImg + 'buscar.png',
            iconCls : 'btn',
            //text: '<u>B</u>uscar',
            tooltip: 'Buscar estructura <b>(Alt+B)</b>',
            handler : function() {
                this.Buscarestructura();
            }.createDelegate(this)
        });
		
        this.formulario = new Ext.FormPanel({
            layout : 'form',
            frame : true,
            border: false,
            region: 'north',
            labelAlign : 'top',
            trackResetOnLoad : true,
            height : 50,
            bodyStyle : 'padding: 3px 0px 0px 5px',
            width : '100%',
            items: [{
                layout : 'column',
                items:[{
                    columnWidth : .91,
                    layout : 'form',
                    border : false,
                    items : [this.tfbuscarestructura]
                }, {
                    columnWidth : .09,
                    layout : 'form',
                    border : false,
                    bodyStyle : 'padding: 5px 0px 0px 0px',
                    items : [this.btnBuscarestructura]
                }]
            }]
        });
		
        this.nodoraiz = new Ext.tree.AsyncTreeNode({
            text:'',
            id: 'idraiz',
            checked: (this.nivelachequear ? false : null)
        });
		
        this.smArbol = new Ext.tree.DefaultSelectionModel({
            listeners: {
                selectionchange: function( defsm, nodo){
                    if(this.cargarsubordinacion){
                        nodo.attributes.id = (nodo.attributes.realid) ? nodo.attributes.realid : nodo.id; 
                    }
                    if(defsm.getSelectedNode() != null){
                        this.fireEvent('estructuraselecionada',this, nodo);
                    } else {
                        this.fireEvent('estructuranoselecionada', this,-1);
                    }
                }.createDelegate(this)
            }
        });
		
        this.arbol = new Ext.tree.TreePanel({
            region: 'center',
            rootVisible:true,
            autoScroll:true,
            border: false,
            layout: 'fit',
            loader: new Ext.tree.TreeLoader({
                url:'/pvd/comun/index.php/buscarestructuracomp/cargarestructura',
                baseParams: {
                    esbuscar:'0', 
                    denominacion:'', 
                    nivel: (this.nivel ? this.nivel : '') , 
                    padre: (this.padre ? this.padre : ''),
                    tipocargo: (this.tipocargo ? this.tipocargo : ''),
                    nivelachequear: (this.nivelachequear ? this.nivelachequear : -1)
                    }
            }),
            selModel: this.smArbol,
            root: this.nodoraiz,
            listeners: {
                beforerender: function(){
                    this.disable();
                    var mascara = new Ext.LoadMask(this.el, {
                        msg:"Cargando..."
                    });
                    mascara.show();
                    // if(this.cargarsubordinacion)
                    // Ext.Ajax.request({
                    //     url:'/pvd/comun/index.php/buscarestructuracomp/obtenerSubordinacion',
                    //     method:'POST',
                    //     callback: function(options,success,response){
                    //         respuesta = Ext.decode(response.responseText);console.log(respuesta)
                    //         if(respuesta != false){
                    //             this.idsub = respuesta;
                    //             this.arbol.getLoader().url = '/metadatos/estructura/index.php/estructura/buscarSubordinacion';
                    //         }else{
                    //             this.arbol.getLoader().url = '/pvd/comun/index.php/buscarestructuracomp/cargarestructura';
                    //         }
                            
                    //         //console.log(this.arbol.getLoader())
                    //     }.createDelegate(this)
                    // })

                    Ext.Ajax.request({
                        url: '/pvd/comun/index.php/buscarestructuracomp/obtenerraiz',
                        method:'POST',
                        params: {
                            nivel: (this.nivel ? this.nivel : ''), 
                            padre: (this.padre ? this.padre : ''),
                            nivelachequear : (this.nivelachequear ? Ext.encode(this.nivelachequear) : '')
                            },
                        callback: function (options,success,response){
                            respuesta = Ext.decode(response.responseText);
                            if(respuesta.expandable!='false'){
                                this.nodoraiz.id = respuesta.id;
                                this.nodoraiz.setText(respuesta.text);
                                this.nodoraiz.attributes.tipoestructura = respuesta.tipoestructura;
                                this.nodoraiz.attributes.id = respuesta.id;

                                this.enable();
                                this.nodoraiz.expand();
                                this.fireEvent('raizseleccionda', 'true');
                                this.smArbol.select(this.nodoraiz);
                            }else{
                                this.nodoraiz.id = respuesta.id;
                                this.nodoraiz.setText(respuesta.text);
                                this.nodoraiz.attributes.tipoestructura = respuesta.tipoestructura;
                                this.nodoraiz.attributes.id = respuesta.id;

                                this.enable();
                                this.nodoraiz.leaf  =true;
                                // this.nodoraiz.expand();
                                this.fireEvent('raizseleccionda', 'true');
                                this.smArbol.select(this.nodoraiz);										
                            }
                            mascara.hide();
										
                        }.createDelegate(this)			
                    });
                }.createDelegate(this),
                load: function(nodocargado){
                    this.arbol.getLoader().baseParams.esbuscar = 0;
                    this.nodoraiz.expand();
                }.createDelegate(this),
                beforeload: function(nodocargado){
                    this.arbol.getLoader().baseParams.idpadre = (nodocargado.attributes.realid ? nodocargado.attributes.realid : '');
                    this.arbol.getLoader().baseParams.idsub = (this.idsub ? this.idsub : '');
                }.createDelegate(this),
                 checkchange: function(node,check){
                     if(check){
                        this.nodosseleccionados.push(node.attributes.id);
                        this.fireEvent('checkednode',this, node);
                    }
                    else
                        if(!check){
                            this.fireEvent('uncheckednode',this, node);
                        }
                 }.createDelegate(this)     
            }
        });

                
        this.items = [this.formulario, this.arbol];
        Ext.pvd.persona.buscarestructura.panelBuscarestructura.superclass.initComponent.call(this);
    //this.tfbuscarestructura.focus(true,300); 
    },
    getSeleccion: function(){
        return this.smArbol.getSelectedNode();
    },
    arrayChequeados: function(){
        return this.nodosseleccionados;
    },
    getSeleccionados: function(){
        return this.arbol.getChecked();
    },	
    nivelChecked: function(val){
        this.nivelachequear=val;
    },
    Recargar: function(){
        this.arbol.getRootNode().reload();
    },	
    Buscarestructura: function(){      
        if(this.tfbuscarestructura.getValue() != ''){	
            this.arbol.getLoader().baseParams.esbuscar = 1;
            this.arbol.getLoader().baseParams.denominacion = this.tfbuscarestructura.getValue();
            this.arbol.getLoader().baseParams.nivel = (this.nivel ? this.nivel : '');
            this.arbol.getLoader().baseParams.padre = (this.padre ? this.padre : '');
            this.arbol.getLoader().baseParams.tipocargo = (this.tipocargo ? this.tipocargo : '');			
        }
        else{
            this.arbol.getLoader().baseParams.esbuscar = 0;
            this.arbol.getLoader().baseParams.denominacion = '';
            this.arbol.getLoader().baseParams.nivel = (this.nivel ? this.nivel : '');
            this.arbol.getLoader().baseParams.padre = (this.padre ? this.padre : '');
            this.arbol.getLoader().baseParams.tipocargo = (this.tipocargo ? this.tipocargo : '');
        }
        var nodoseleccionado = this.getSeleccion();
        if(nodoseleccionado != null){
            this.arbol.getLoader().baseParams.node = nodoseleccionado.id;
            this.arbol.getLoader().baseParams.nivel = (this.nivel ? this.nivel : '');
            this.arbol.getLoader().baseParams.padre = (this.padre ? this.padre : '');
            this.arbol.getLoader().baseParams.tipocargo = (this.tipocargo ? this.tipocargo : '');
            this.arbol.getLoader().load(nodoseleccionado, function(){
            });
        }
        else{
            this.arbol.getLoader().baseParams.node = this.nodoraiz.id;
            this.arbol.getLoader().baseParams.nivel = (this.nivel ? this.nivel : '');
            this.arbol.getLoader().baseParams.padre = (this.padre ? this.padre : '');
            this.arbol.getLoader().baseParams.tipocargo = (this.tipocargo ? this.tipocargo : '');
            this.arbol.getLoader().load(this.nodoraiz, function(){
            });
        }
    }
});
