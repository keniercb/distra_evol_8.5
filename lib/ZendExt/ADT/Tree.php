<?php
	/**
	* Clase para el modelamiento de los árboles usados por el ERP.
	* 
	* @author Omar Antonio Díaz Peña.
	* @copyright Centro UCID.
	* @package ZendExt
	**/

	class ZendExt_ADT_Tree 
	{
		private $root;
		
		public function ZendExt_ADT_Tree($pRootValue)
		{
			$this->root = new ZendExt_ADT_TreeNode($pRootValue); 
		}
		
		public function addNodep ($pRootValue)
		{	
			$newNode = (! $pRootValue instanceof ZendExt_ADT_Tree) ? new ZendExt_ADT_TreeNode($pRootValue)
																   : $pRootValue;
			$this->root->getChildren ()->Add ($newNode);
		}
	}
