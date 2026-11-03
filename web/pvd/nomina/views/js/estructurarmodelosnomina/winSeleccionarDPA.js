/**
 * Arbol con conceptos RM y conceptos PD.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.Configuraciones.form.FormSeleccionarDPA
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.Configuraciones.form');
Pvd.Nomina.Configuraciones.form.FormSeleccionarDPA = Ext.extend(Ext.form.FormPanel, {
    region:'center',
    layout: 'form',
    labelAlign:'top',
    //frame:true,
    //border:true,
    autoScroll:true,
    initComponent: function() {   
        var self          = this;
        var idtiponomina = (this.idtiponomina) ? this.idtiponomina : '';
        var idestructura = (this.idestructura) ? this.idestructura : '';
        var accion = (this.accion) ? this.accion : '';
        var arrnodos = (this.arrnodos) ? this.arrnodos : new Array();
        
        var url = '/pvd/nomina/index.php/estructurarmodelosnomina/cargarArbolSistemasPago';
        this.root = new Ext.tree.AsyncTreeNode({
            text: 'Arbol de conceptos y sistemas de pago',
            draggable: false,
            id: 'idpadre'
        });

        var tree = new classTree({
            url: url,
            dependiente:true,
            baseparams:{
                idestructura:idestructura,
                idtiponomina:idtiponomina,
                accion:accion,
                arrnodos:arrnodos
            },
            root : self.root, 
            rootVisible : true
        });
        tree.on("checkchange",function(obj){
			if(obj.node.attributes.sistemapago == 1){
			  tree.sistemapago = obj.node.attributes.sistemapago;
			}
        }
            );
        this.items = [{
            xtype:'hidden',
            id:'idconceptopd',
            name:'idconceptopd'
        },tree.getTree()
        ];
        Pvd.Nomina.Configuraciones.form.FormSeleccionarDPA.superclass.initComponent.call(this);
    },
    pertenece:function (valor,arreglo){
        for(var j = 0 ; j < arreglo.length ; j++){
            if(arreglo[j])
                if(valor == arreglo[j][0])
                    return true;
        }
        return false;
    },
    checkAllChilds:function(node){
        var that = this;
        node.getLoader().baseParams.checked = 1;
        this.cantChilds ++;
        node.getLoader().load(node,function(){
            that.checkSum(node);
        });
        
    },
    checkSum:function(node){
        node.expand();
        if(node.hasChildNodes()){            
            for(var i = 0 ; i < node.childNodes.length ; i ++){
                if(!node.childNodes[i].isLeaf()){                    
                    this.checkAllChilds(node.childNodes[i]);
                }
            }
        }
        this.cantChilds --;
        if(this.cantChilds == 0){
            node.getLoader().baseParams.checked = 0;
            this.loock = false;
        }else{
            node.getLoader().baseParams.checked = 1;
            this.loock = true;
        }
    },    
    unCheckAllChilds:function(node){
        if(node.hasChildNodes()){            
            for(var i = 0 ; i < node.childNodes.length ; i ++){
                if(node.childNodes[i].getUI().isChecked()){
                    node.childNodes[i].getUI().toggleCheck(false);
                }
              }
        }
    },
    checkAllParents:function(node){
        var self = this;
        node.getUI().toggleCheck(true);
        if(node.parentNode){
            if(node.parentNode != self.root){
                //node.parentNode.disable();
                this.checkAllParents(node.parentNode);
            }
        }        
    }
});



