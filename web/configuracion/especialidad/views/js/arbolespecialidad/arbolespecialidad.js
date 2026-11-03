
if (window.idcomboiframe) var comboParent = window.parent.Ext.getCmp(window.idcomboiframe);

function cargarInterfaz(){
   
    var nodopadre = new Ext.tree.AsyncTreeNode({
        text: 'Especialidades',
        draggable: false,
        expanded:true,
        id: '0'       
    });
        
    var treeLoader  =  new Ext.tree.TreeLoader({
        dataUrl:'cargararbolespecialidades'
    });
    var tpEspecialidades = new Ext.tree.TreePanel({
        autoScroll:true,
        id:'tpespecialidades',        
        enableDD:false,
        loadMask:true,
        border:false,
        root:nodopadre,
        loader: treeLoader,
        enableKeyEvents:true,
        keys: new Ext.KeyMap(document,[{
            key:Ext.EventObject.ENTER,
            fn: function(key) {
                node = tpEspecialidades.getSelectionModel().selNode;
                tpEspecialidades.fireEvent("dblclick",node,this)               
            }
        }
        ]),
        listeners:{
            expandnode :function(nodo){
                nodo.select();
            }
        }
    });  
   
    //viewPort
    var vpArbolespecialidad = new Ext.Viewport({
        layout:'fit',
        items:tpEspecialidades        
    });
   
    // tpEspecialidades.show();
    if (comboParent) Ext.UCID.integraInterfaz(tpEspecialidades,comboParent);

}// Endof cargarInterfaz
cargarInterfaz();

