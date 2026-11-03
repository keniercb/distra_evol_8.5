<?php
	/**
	* ZendExt ADT Graph
	* 
	* Clase para el modelado de los grafos del ERP.
	* 
	* @author Omar Antonio Díaz Peña
	* @package ZendExt
	* @copyright Centro UCID.
	* */
	
	class ZendExt_ADT_Graph
	{
		const INFINITE = 99999;
		
		private $matrix;
		private $vertex_list;
		private $visited;
		
		
		private function GetVertexPos ($pVertex)
		{
			$pos = $this->vertex_list->Find ($pVertex);
			return $pos;
		}
		
		public function ZendExt_ADT_Graph()
		{
			$this->vertex_list = new ZendExt_ADT_List();
		}
		
		public function IsEmpty  ()
		{
			return $this->vertex_list->Count () == 0;
		}
		
		public function CountVertex ()
		{
			return $this->vertex_list->Count ();			 
		}
		
		public function CountArcs ()
		{
			$count = 0;

			for ($i = 0; $i < $this->vertex_list->Count (); $i++)
				for ($j = 0; $j < $this->vertex_list->Count (); $j++)
					if ($this->matrix [$i][$j] != INFINITE)
						$count ++;
			
			return $count;
		}
		
		public function IsVertex ($pVertex)
		{
			return $this->vertex_list->Find ($pVertex) != -1;
		}
		
		public function IsArc ($pSource, $pTarget)
		{
			$posSource = $this->GetVertexPos($pSource);
			$posTarget = $this->GetVertexPos($pTarget);
						
			if ($posSource == -1)
				throw new ZendExt_Exception('002');
			
			if ($posTarget == -1)
				throw new ZendExt_Exception('003');
				
			return ($this->matrix [$posSource][$posTarget] != INFINITE);									  
		}
		
		public function AddArc ($pSource, $pTarget, $pCost)
		{
			if (! $this->IsArc($pSource, $pTarget))
			{
				if ($this->IsVertex($pSource))	
				{
					if ($this->IsVertex($pTarget))	
					{
						$posSource = $this->GetVertexPos($pSource);
						$posTarget = $this->GetVertexPos($pTarget);
						
						$this->matrix [$posSource][$posTarget] = $pCost;
					} else throw new ZendExt_Exception('A003');														
				} else throw new ZendExt_Exception('A002');				
			} else throw new ZendExt_Exception('A001');
		}
		
		public function AddVertex ($pVertex)
		{
			$this->vertex_list->Add ($pVertex);
		}
		
		public function RemoveVertex ($pVertex)
		{
			if ($this->IsVertex($pVertex))
			{
				$posVertex = $this->GetVertexPos($pVertex);

				for ($i = 0; $i < $this->vertex_list->Count (); $i++)
				{
					$this->matrix [$i][$posVertex] = INFINITE;
					$this->matrix [$posVertex][$i] = INFINITE;	
				}
				
				$this->vertex_list->Remove ($posVertex);
			} else throw new ZendExt_Exception('A004');
		}
		
		public function RemoveArc ($pSource, $pTarget)
		{
			if ($this->IsArc($pSource, $pTarget))
			{
				if ($this->IsVertex($pSource))	
				{
					if ($this->IsVertex($pTarget))	
					{
						$posSource = $this->GetVertexPos($pSource);
						$posTarget = $this->GetVertexPos($pTarget);
						
						$this->matrix [$posSource][$posTarget] = INFINITE;
					} else throw new ZendExt_Exception('A007');														
				} else throw new ZendExt_Exception('A006');				
			} else throw new ZendExt_Exception('A005');
		}
		
		public function Near ($pVertex)
		{
			$posVertex = $this->GetVertexPos($pVertex);
			$list = $this->matrix [$posVertex];
				
			$result = new ZendExt_ADT_List();
			foreach ($list as $tmp)
				$result->Add($this->vertex_list [$tmp]);
			return $result;		
		}
		
		public function BFS (& $pResultList)
		{
			
		}
		
		public function DFS (& $pResultList, $pVertex)
		{	
			if ($pResultList->Count () != $this->CountVertex())
			{
				$pos = $this->GetVertexPos($pVertex);				
				$this->visited [$pos] = true;
				
				for ($i = 0; $i < $this->CountVertex(); $i++)
					if (! $this->visited [$i])					
					{
						$vertex = $this->vertex_list->Get ($i);
						$pResultList->Add ($vertex);	
						$this->DFS($pResultList, $vertex);	
					}
			}
		}
	}
