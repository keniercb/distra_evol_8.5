<?php

   class  ZendExt_ADT_GraphNode
   {
     private $data;
     private $pound;
     
     public function ZendExt_ADT_GraphNode ($pData = null, $pPound = null)
	 {
			$this->data = $pData;
			$this->pound = $pPound; 
	 }
	 
	 public function GetData()
	 {
	  return $this->data;
	 }
	 
	 public function SetData($pData)
	 {
	   $this->data = $pData;
	 }
	 
	 public function GetPound()
	 {
	   return $this->pound;
	 }
	 
	 public function SetPound($pPound)
	 {
	   $this->pound = $pPound;
	 }
	
  }
