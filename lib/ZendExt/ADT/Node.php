<?php
	class ZendExt_ADT_Node 
	{
		private $data;
		private $next;
		
		
		public function getData ()
		{
			return $this->data;
		}
		
		public function getNext ()
		{
			return $this->next;
		}
		
		public function setNext ($pNext)
		{
			$this->next = $pNext;
		}
		
		public function setData ($pData)
		{
			$this->data = $pData;
		}
		
		public function Zend_ADT_Node ($pData = null, $pNext = null)
		{
			$this->data = $pData;
			$this->next = $pNext; 
		}
	}
