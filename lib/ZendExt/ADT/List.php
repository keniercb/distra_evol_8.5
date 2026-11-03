<?php
	/**
	* Zend ADT List 
	* 
	* Clase para la modelación del TDA Lista en el ERP.
	* 
	* @author Omar Antonio Díaz Peña.
	* @package Zend.
	* @copyright Centro UCID.
	***/

	class ZendExt_ADT_List 
	{
		private $head;
		private $count;

		private function MoveTo ($pPos)
		{
			if ($pPos > $this->count)
				throw new ZendExt_ADT_Exception_ListOverflow();
				
			$resp = $this->head; 
			
			for ($i = 0; $i < $pPos; $i++)
				$resp = $resp->getNext ();
				
			return $resp;
		}
		
		public function Find ($pNode)
		{
			for ($i = 0; $i < $this->count; $i++)
				if ($this->Get($i)->getData () == $pNode)
					return $i;
					
			return -1;
		}
		
		public function ZendExt_ADT_List()
		{
			$this->head = new ZendExt_ADT_Node();
			$this->count = 0;
		}
		
		public function Add ($pValue)
		{
			if ($this->count == 0)
			{
				$this->head = new ZendExt_ADT_Node($pValue);
			} else 
			{
				$pos = $this->MoveTo($this->count - 1);
				$pos->setNext(new ZendExt_ADT_Node($pValue));
			}
			
			$this->count ++;
		}
		
		public function Remove ($pPos)
		{
			if ($pPos == 0)
			{
				$this->head = $this->head->getNext ();
			} else if ($pPos == $this->count - 1)
			{
				$prev = $prev = $this->MoveTo($pPos - 1);
				$prev->setNext (new ZendExt_ADT_Node());
			} else 
			{
				$prev = $this->MoveTo($pPos - 2);
				$next = $this->MoveTo($pPos);
				$prev->setNext($next);
			}
			
			$this->count --;
		}
		
		public function Insert ($pPos, $pValue)
		{	
			if ($pPos == 0)
			{
				$next = $this->head;
				$nuevo = new ZendExt_ADT_Node($pValue, $next);
				$this->head = $nuevo;
			} else if ($pPos == $this->count - 1)
			{
				$this->Add($pValue);
				return;
			} else
			{
				$prev = $this->MoveTo($pPos - 2);
				$next = $this->MoveTo($pPos - 1);	
				$prev->setNext ($nuevo);
			}
			
			$this->count ++;
		}
		
		public function Get ($pPos)
		{
			return $this->MoveTo($pPos - 1)->getData ();
		}
		
		public function Count ()
		{
			return $this->count;
		}
	}
