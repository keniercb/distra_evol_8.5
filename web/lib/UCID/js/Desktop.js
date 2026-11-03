/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
  Ext.ns('Ext.portal.comun.windows');
 Ext.portal.comun.windows = {
	opened : null,
	removeWindow : function(id,close){
		if(this.opened && this.opened[id]){
			if(close)
				this.opened[id].close();
			delete(this.opened[id]);
		}
	},
	addWindow : function(win){
		var id = win.id;
		if(!this.opened){
			this.opened = {};
		}
		this.opened[id] = win;
		win.on('close',function(w){
			Ext.portal.comun.windows.removeWindow(w.id);
		});
	},
	reloadIFrame:function(id){
		var iframeId = id.replace('win','');
		if(this.opened){
			document.getElementById(iframeId).src = document.getElementById(iframeId).src+'3';
		}
	},
	reloadAllIFrames:function(){
		if(this.opened){
			for(var i in this.opened){
				var id = this.opened[i].id
				this.reloadIFrame(id);
			}
		}
	},
	hasOpenenWindow : function(){
		if(!this.opened)
			return false;
		else{
			for(var i in this.opened){
				if(this.opened[i])
					return true;
			}
			return false;
		}		
	}
 }
 

Ext.Desktop = function(app){
    this.taskbar = new Ext.ux.TaskBar(app);
	var taskbar = this.taskbar;
	
	var desktopEl = Ext.get('x-desktop');
    var taskbarEl = Ext.get('ux-taskbar');
    var shortcuts = Ext.get('x-shortcuts');

    var windows = new Ext.WindowGroup();
    var activeWindow;
		
    function minimizeWin(win){
        win.hide();
    }

    function markActive(win){
        if(activeWindow && activeWindow != win){
            markInactive(activeWindow);
        }
        taskbar.setActiveButton(win.taskButton);
        activeWindow = win;
        Ext.fly(win.taskButton.el).addClass('active-win');
        win.minimized = false;

    }

    function markInactive(win){
        if(win == activeWindow){
            activeWindow = null;
            Ext.fly(win.taskButton.el).removeClass('active-win');
        }
    }

    function removeWin(win){
    	taskbar.removeTaskButton(win.taskButton);
        layout();
    }

    function layout(){
        desktopEl.setHeight(Ext.lib.Dom.getViewHeight()-taskbarEl.getHeight());
    }
    Ext.EventManager.onWindowResize(layout);

    this.layout = layout;

    this.createWindow = function(config, cls){
    	var win = new (cls||Ext.Window)(
            Ext.applyIf(config||{}, {
                manager: windows,
                minimizable: true,
                maximizable: true
            })
        );
        win.render(desktopEl);
        var addWinToTbar = (typeof(win.showFlag) == 'undefined') ? false : win.showFlag;
        if(addWinToTbar){
            win.taskButton = taskbar.addTaskButton(win);
            taskbar.hideTaskButton(win);

        }else {
            win.taskButton = taskbar.addTaskButton(win);
        }


        win.cmenu = new Ext.menu.Menu({
            items: [

            ]
        });

        win.animateTarget = win.taskButton.el;
        
        win.on({
        	'activate': {
        		fn: markActive
        	},
        	'beforeshow': {
        		fn: markActive
        	},
        	'deactivate': {
        		fn: markInactive
        	},
        	'minimize': {
        		fn: minimizeWin
        	},
        	'close': {
        		fn: removeWin
        	}
        });
        
        layout();
        Ext.portal.comun.windows.addWindow(win);


        return win;
    };

    this.getManager = function(){
        return windows;
    };

    this.getWindow = function(id){
        return windows.get(id);
    }
    
    this.getWinWidth = function(){
		var width = Ext.lib.Dom.getViewWidth();
		return width < 200 ? 200 : width;
	}
		
	this.getWinHeight = function(){
		var height = (Ext.lib.Dom.getViewHeight()-taskbarEl.getHeight());
		return height < 100 ? 100 : height;
	}
		
	this.getWinX = function(width){
		return (Ext.lib.Dom.getViewWidth() - width) / 2
	}
		
	this.getWinY = function(height){
		return (Ext.lib.Dom.getViewHeight()-taskbarEl.getHeight() - height) / 2;
	}

    layout();

    if(shortcuts){
        shortcuts.on('click', function(e, t){
            if(t = e.getTarget('dt', shortcuts)){
                e.stopEvent();
                var module = app.getModule(t.id.replace('-shortcut', ''));
                if(module){
                    module.createWindow();
                }
            }
        });
    }
};
