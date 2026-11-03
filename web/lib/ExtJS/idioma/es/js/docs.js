Docs = {};

ApiPanel = function() {
    ApiPanel.superclass.constructor.call(this, {
        id:'api-tree',
        region:'west',
        split:true,
        width: 280,
        minSize: 175,
        maxSize: 500,
        collapsible: true,
        margins:'0 0 5 5',
        cmargins:'0 0 0 0',
        rootVisible:false,
        lines:false,
        autoScroll:true,
        animCollapse:false,
        animate: false,
        collapseMode:'mini',
        loader: new Ext.tree.TreeLoader({
			preloadChildren: true,
			clearOnLoad: false
		}),
        root: new Ext.tree.AsyncTreeNode({
            text:'Temas de ayuda',
            id:'root',
            expanded:true,
            children:[Docs.classData]
         }),
        collapseFirst:false
    });
    // no longer needed!
    //new Ext.tree.TreeSorter(this, {folderSort:true,leafAttr:'isClass'});

    this.getSelectionModel().on('beforeselect', function(sm, node){
        return node.isLeaf();
    });
};

Ext.extend(ApiPanel, Ext.tree.TreePanel, {
    selectClass : function(cls){
        if(cls){
            var parts = cls.split('.');
            var last = parts.length-1;
            for(var i = 0; i < last; i++){ // things get nasty - static classes can have .
                var p = parts[i];
                var fc = p.charAt(0);
                var staticCls = fc.toUpperCase() == fc;
                if(p == 'Ext' || !staticCls){
                    parts[i] = 'pkg-'+p;
                }else if(staticCls){
                    --last;
                    parts.splice(i, 1);
                }
            }
            parts[last] = cls;

            this.selectPath('/root/apidocs/'+parts.join('/'));
        }
    }
});


DocPanel = Ext.extend(Ext.Panel, {
    closable: true,
    autoScroll:true,

    initComponent : function(){
        var ps = this.cclass.split('.');
        this.title = ps[ps.length-1];

        DocPanel.superclass.initComponent.call(this);
    },

    scrollToMember : function(member){
        var el = Ext.fly(this.cclass + '-' + member);
        if(el){
            var top = (el.getOffsetsTo(this.body)[1]) + this.body.dom.scrollTop;
            this.body.scrollTo('top', top-25, {duration:.75, callback: this.hlMember.createDelegate(this, [member])});
        }
    },

	scrollToSection : function(id){
		var el = Ext.getDom(id);
		if(el){
			var top = (Ext.fly(el).getOffsetsTo(this.body)[1]) + this.body.dom.scrollTop;
			this.body.scrollTo('top', top-25, {duration:.5, callback: function(){
                Ext.fly(el).next('h2').pause(.2).highlight('#8DB2E3', {attr:'color'});
            }});
        }
	},

    hlMember : function(member){
        var el = Ext.fly(this.cclass + '-' + member);
        if(el){
            el.up('tr').highlight('#cadaf9');
        }
    }
});


MainPanel = function(){
	
    MainPanel.superclass.constructor.call(this, {
        id:'doc-body',
        region:'center',
        margins:'0 5 5 0',
        resizeTabs: true,
        minTabWidth: 135,
        tabWidth: 135,
        plugins: new Ext.ux.TabCloseMenu(),
        enableTabScroll: true,
        activeTab: 0,

        items: {
            id:'welcome-panel',
            title: 'Introducci&oacute;n',
            autoLoad: {url: dir_ayuda+'index.html', callback: this.initSearch, scope: this},
            iconCls:'icon-docs',
            autoScroll: true
        }
    });
};

Ext.extend(MainPanel, Ext.TabPanel, {

    initEvents : function(){
        MainPanel.superclass.initEvents.call(this);
        this.body.on('click', this.onClick, this);
    },

    onClick: function(e, target){
        if(target = e.getTarget('a:not(.exi)', 3)){
            var cls = Ext.fly(target).getAttributeNS('ext', 'cls');
            e.stopEvent();
            if(cls){
                var member = Ext.fly(target).getAttributeNS('ext', 'member');
                this.loadClass(target.href, cls, member);
            }else if(target.className == 'inner-link'){
                this.getActiveTab().scrollToSection(target.href.split('#')[1]);
            }else{
                window.open(target.href);
            }
        }else if(target = e.getTarget('.micon', 2)){
            e.stopEvent();
            var tr = Ext.fly(target.parentNode);
            if(tr.hasClass('expandable')){
                tr.toggleClass('expanded');
            }
        }
    },

    loadClass : function(href, cls, member){
        var id = 'docs-' + cls;
        var tab = this.getComponent(id);
        if(tab){
            this.setActiveTab(tab);
            if(member){
                tab.scrollToMember(member);
            }
        }else{
            var autoLoad = {url: href};
            if(member){
                autoLoad.callback = function(){
                    Ext.getCmp(id).scrollToMember(member);
                }
            }
            var p = this.add(new DocPanel({
                id: id,
                cclass : cls,
                autoLoad: autoLoad,
                iconCls: Docs.icons[cls]
            }));
            this.setActiveTab(p);
        }
    }
});


Ext.onReady(function(){

    Ext.QuickTips.init();

    var api = new ApiPanel();
    var mainPanel = new MainPanel();

    api.on('click', function(node, e){
         if(node.isLeaf()){
            e.stopEvent();
            mainPanel.loadClass(node.attributes.href, node.id);
         }
    });

    mainPanel.on('tabchange', function(tp, tab){
        api.selectClass(tab.cclass); 
    });

    var hd = new Ext.Panel({
        border: false,
        layout:'anchor',
        region:'north',
        cls: 'docs-header',
        height:60,
        items: [{
            xtype:'box',
            el:'header',
            border:false,
            anchor: 'none -25'
        },
        new Ext.Toolbar({
            cls:'top-toolbar',
            items:[ ' ',
			new Ext.form.TextField({
				width: 200,
				emptyText:'Buscar un tema de ayuda',
				listeners:{
					render: function(f){
						f.el.on('keydown', filterTree, f, {buffer: 350});
					}
				}
			}), ' ', ' ',
			{
                iconCls: 'icon-expand-all',
				tooltip: 'Expandir todos',
                handler: function(){ api.root.expand(true); }
            }, '-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Contraer todos',
                handler: function(){ api.root.collapse(true); }
            }/*, '->', {
                tooltip:'Hide Inherited Members',
                iconCls: 'icon-hide-inherited',
                enableToggle: true,
                toggleHandler : function(b, pressed){
                     mainPanel[pressed ? 'addClass' : 'removeClass']('hide-inherited');
                }
            }, '-', {
                tooltip:'Expand All Members',
                iconCls: 'icon-expand-members',
                enableToggle: true,
                toggleHandler : function(b, pressed){
                    mainPanel[pressed ? 'addClass' : 'removeClass']('full-details');
                }
            }*/]
        })]
    })

    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ hd, api, mainPanel ]
    });

    api.expandPath('/root/apidocs');

    // allow for link in
    var page = window.location.href.split('?')[1];
    if(page){
        var ps = Ext.urlDecode(page);
        var cls = ps['class'];
        mainPanel.loadClass('output/' + cls + '.html', cls, ps.member);
    }
    
    viewport.doLayout();
	
	setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);
	
	var filter = new Ext.tree.TreeFilter(api, {
		clearBlank: true,
		autoClear: true
	});
	var hiddenPkgs = [];
	function filterTree(e){
		var text = e.target.value;
		Ext.each(hiddenPkgs, function(n){
			n.ui.show();
		});
		if(!text){
			filter.clear();
			return;
		}
		api.expandAll();
		
		var re = new RegExp('^' + Ext.escapeRe(text), 'i');
		filter.filterBy(function(n){
			return !n.attributes.isClass || re.test(n.text);
		});
		
		// hide empty packages that weren't filtered
		hiddenPkgs = [];
		api.root.cascade(function(n){
			if(!n.attributes.isClass && n.ui.ctNode.offsetHeight < 3){
				n.ui.hide();
				hiddenPkgs.push(n);
			}
		});
	}
	
});