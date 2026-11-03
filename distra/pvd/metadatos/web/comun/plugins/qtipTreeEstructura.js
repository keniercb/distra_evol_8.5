/**
 *@Author: Ing. Angel R. Sanchez Napoles
 *@Name: Ext.tree.TreeNode (Override)
 *@Tipo: Clase
 *@Description:Poner Qtip a los nodos
 **/
Ext.override(Ext.tree.TreeNodeUI, {
		firstRender: true,
		render     : Ext.tree.TreeNodeUI.prototype.render.createInterceptor(function ()
		{
				var owner_Tree = this.node.getOwnerTree();
				if (this.dropable || owner_Tree.dropable) {
						if (this.node.attributes.leaf == true) {
								this.node.leaf = false;
								this.node.attributes.leaf = false;
								this.node.children = [];
								this.node.expanded = true;
						}
				}
				if (this.node.attributes.html) {
						this.node.attributes.qtip = this.node.attributes.html;
						var tipo = '';
						if (this.node.attributes.tipo_concepto != undefined) {
								tipo = this.node.attributes.tipo_concepto + ": ";
						}
						var title = this.node.text;
						if (title.length > 60) {
								title = title.slice(0, 60);
								title = title.slice(0, title.lastIndexOf(' '));
								if (title.toLowerCase(title.slice(title.length - 2, title.length)) == "de") {
										title = title.slice(0, title.length - 2) + " ...";
								} else {
										title += " ...";
								}
						}
						this.node.attributes.qtipTitle = (tipo + title);
				} else {
						if (!this.firstRender) {
								this.node.attributes.qtipCfg = {
										//target:this.node.id,
										title: this.node.text
								};
						} else {
								if (this.firstRender) {
										this.firstRender = false;
								}
						}
				}
		})
});
Ext.override(Ext.ToolTip, {
		autoHide  : false,
		autoWidth : true,
		trackMouse: true
});