/**
 * Ext.ux.PanelToolbarSrollerPlugin plugin for Ext.Panel and its subclasses
 * A plugin that provide scroll for top toolbar
 * Compatible with Ext Js 2.1 - 2.3
 * Support browsers: Firefox 3.5.7, IE 7, Opera 10.10 and Coogle Chrome 4
 *
 * @author  Spring
 * @date    February 15, 2010
 * @version 0.0.1
 *
 * @class Ext.ux.PanelToolbarSrollerPlugin
 * @extends Ext.util.Observable
 */
Ext.namespace("Ext.ux");
Ext.ux.PanelToolbarSrollerPlugin = Ext.extend(Ext.util.Observable, {
		init                          : function (panel)
		{
				var topToolbar = panel.topScrollingToolbar;
				if (!panel.topScrollingToolbar) {
						return;
				}
				if (Ext.isArray(topToolbar)) {
						panel.topScrollingToolbar = new Ext.Toolbar(panel.topScrollingToolbar);
				}
				panel.elements += ',tbar';
				panel.onRender = panel.onRender.createSequence(function ()
				{
						if (panel.tbar && topToolbar) {
								this.renderScrollingToolbar(panel);
								topToolbar.firstVisibleItem = 0;
								this.renderScrollButton(topToolbar, 'left');
								this.renderScrollButton(topToolbar, 'right');
						}
				}, this);
				panel.afterRender = panel.afterRender.createSequence(function ()
				{
						this.correctToolbarWidth(panel.tbar, topToolbar);
						panel.on("bodyresize", function (panel)
						{
								this.correctToolbarWidth(panel.tbar, topToolbar);
						}, this);
						this.correctAddingToolbarItems(topToolbar);
				}, this);
		},
		correctAddingToolbarItems     : function (toolbar)
		{
				var correctToolbarAfterAdd = function ()
				{
						this.disableRightScrollBasedOnWidth(toolbar);
				}.createDelegate(this);
				toolbar.addItem = toolbar.addItem.createSequence(correctToolbarAfterAdd);
				toolbar.addElement = toolbar.addElement.createSequence(correctToolbarAfterAdd);
				toolbar.addButton = toolbar.addButton.createSequence(correctToolbarAfterAdd);
				toolbar.addField = toolbar.addField.createSequence(correctToolbarAfterAdd);
				toolbar.addSeparator = toolbar.addSeparator.createSequence(correctToolbarAfterAdd);
				toolbar.addSpacer = toolbar.addSpacer.createSequence(correctToolbarAfterAdd);
				toolbar.addFill = toolbar.addFill.createSequence(correctToolbarAfterAdd);
				toolbar.insertButton = toolbar.insertButton.createSequence(correctToolbarAfterAdd);
		},
		correctToolbarWidth           : function (tbarEl, toolbar)
		{
				var leftElWidth = Ext.fly("left" + toolbar.tbId).getWidth();
				var rightElWidth = Ext.fly("right" + toolbar.tbId).getWidth();
				Ext.fly("center" + toolbar.tbId).setStyle("width", (tbarEl.getWidth(true) - leftElWidth - rightElWidth) + "px");
				toolbar.initialX = Ext.fly("left" + toolbar.tbId).getX() + leftElWidth;
				toolbar.firstVisibleItem = 0;
				Ext.fly(toolbar.id).setX(toolbar.initialX);
		},
		disableLeftScrollBasedOnWidth : function (toolbar)
		{
				var leftButton = Ext.getCmp("left" + toolbar.id);
				if (!leftButton) {
						return;
				}
				if (toolbar.items.itemAt(0).el.getX() >= Ext.fly("left" + toolbar.tbId).getX() + Ext.fly("left" + toolbar.tbId).getWidth()) {
						leftButton.disable();
				} else {
						leftButton.enable();
				}
		},
		disableRightScrollBasedOnWidth: function (toolbar)
		{
				var rightButton = Ext.getCmp("right" + toolbar.id);
				if (!rightButton) {
						return;
				}
				var lastTbEl = toolbar.items.itemAt(toolbar.items.getCount() - 1).el;
				if (lastTbEl.getX() + lastTbEl.getWidth() <= Ext.fly("right" + toolbar.tbId).getX()) {
						rightButton.disable();
				} else {
						rightButton.enable();
				}
		},
		renderScrollingToolbar        : function (panel)
		{
				var myWidth = 5000;
				Ext.apply(panel.topScrollingToolbar, {frame: true, width: myWidth, style: 'overflow-x: hidden; border-left: 0 none'});
				var tbId = Ext.id();
				panel.topScrollingToolbar.tbId = tbId;
				panel.tbar.createChild({
						id  : tbId,
						html: '<table cellspacing=0 cellpadding=0><tr>' + '<td><div class="x-toolbar" style="padding-bottom:3px;position:static; border-right: 0 none;" id="left' + tbId + '"></div></td>' + '<td><div id="center' + tbId + '" style="border-left: 0 none; width:10px;"></div></td>' + '<td><div class="x-toolbar" style="padding-bottom:3px;position:static; border-left: 0 none;" id="right' + tbId + '"></div></td>' + '</tr></table>'
				});
				panel.topScrollingToolbar.render("center" + tbId);
				Ext.fly("center" + tbId).setStyle("overflow-x", "hidden");
				panel.topScrollingToolbar.ownerCt = panel;
		},
		renderScrollButton            : function (toolbar, dir)
		{
				var text;
				var getNewVisibleItem;
				switch (dir) {
						case 'left':
								//								text = '&lt;';
								text = 'left';
								getNewVisibleItem = function (oldVisibleItem)
								{
										return oldVisibleItem > 0 ? oldVisibleItem - 1 : 0;
								};
								break;
						case 'right':
								//								text = '&gt;';
								text = 'right';
								getNewVisibleItem = function (oldVisibleItem)
								{
										return oldVisibleItem < toolbar.items.getCount() - 1 ? oldVisibleItem + 1 : toolbar.items.getCount() - 1;
								};
								break;
						default:
								return;
				}
				new Ext.Toolbar.Button({
						iconCls : 'btn',
						icon    : "/metadatos/comun/plugins/toolbar/toolbar-" + text + ".png",
						renderTo: dir + toolbar.tbId,
						id      : dir + toolbar.id,
						disabled: dir == 'left',
						scope   : this,
						handler : function ()
						{
								var itemEl;
								do { // define first not separator
										toolbar.firstVisibleItem = getNewVisibleItem(toolbar.firstVisibleItem);
										itemEl = toolbar.items.itemAt(toolbar.firstVisibleItem).el;
								} while (itemEl.className == 'ytb-sep');
								var toolbarEl = Ext.get(toolbar.id);
								toolbarEl.setX(toolbarEl.getX() + toolbar.initialX - itemEl.getX());
								this.disableLeftScrollBasedOnWidth(toolbar);
								this.disableRightScrollBasedOnWidth(toolbar);
						}
				});
		}
});