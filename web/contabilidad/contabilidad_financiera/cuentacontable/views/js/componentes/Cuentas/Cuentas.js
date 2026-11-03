Ext.QuickTips.init();
    new Ext.Viewport({
        items: [{}], 
        listeners : {
            render: function(component) {
                    new Ext.Cont.Cuentas({
                        id: 'cpmCuentas',
//                        types: [8032, 8034],
                        levels: false,
                        loadLeaf: false,
                        selectionType: 2,
                        addIn: component
                    });
                }
        }
    });
	


