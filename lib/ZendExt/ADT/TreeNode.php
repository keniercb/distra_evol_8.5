<?php
	/**
	* Clase para el modelamiento de los nodos de los árboles usados por el ERP.
	* 
	* @author Omar Antonio Díaz Peña.
	* @copyright Centro UCID.
	* @package ZendExt
	**/
	
	class ZendExt_ADT_TreeNode
	{
		/**
		* @var mixed value Valor del nodo.
		* */
		private $value;
		
		/**
		* @var ZendExt_ADT_List children Árboles hijos.
		* */
		private $children;
		
		public function ZendExt_ADT_TreeNode($pValue, $pChildren = null)
		{
			$this->value = $pValue;
			$this->children = ($this->children == null) ? new ZendExt_ADT_List()
														: $pChildren;
		}
		
		public function getValue ()
		{
			return $this->value;
		}
		
		public function getChildren ()
		{
			return $this->children;
		}
	}
	
