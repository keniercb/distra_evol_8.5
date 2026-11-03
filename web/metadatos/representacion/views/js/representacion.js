/**
 * @Created with PhpStorm.
 * @Author: Daymel
 * @package Beta
 * @subpackage Wand
 * @Date: 7/15/15
 * @Version:1.0
 */
Ext.onReady(function ()
{
		Ext.ns("sisgo.gis");
		sisgo.gis.map = new GIS({
				project:'erpintegracion',
				indexURL:'/gis/index.php/mapa/displayGenesig',
				iframeLoadedTime:5000,
				ventana:{
						border:false,
						maximized:true,
						closable:false
				}

		}).show();
})
