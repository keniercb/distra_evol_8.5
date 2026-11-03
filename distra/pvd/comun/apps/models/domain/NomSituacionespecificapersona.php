<?php 
class NomSituacionespecificapersona extends BaseNomSituacionespecificapersona
 { 
   public function setUp() 
    {   parent::setUp(); 

    } 
 
   public function Buscar($idsituacionespecificapersona) 
    { 
          $temp = $this->conn->getTable('NomSituacionespecificapersona')->find($idsituacionespecificapersona); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomSituacionespecificapersona')->execute (); 
          return $result->toArray(); 

    } 
 

   public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomSituacionespecificapersona')->limit($limite = 10)->offset($inicio = 0)->execute (); 
          return $result->toArray(); 

    } 
	
	
	public function obtenerSituacionEspecificaById($node){ 
		try {
			if($node==1)$where= "nsep.idsituacionpersona= $node and nsep.idpadre=nsep.idsituacionespecificapersona";
			else if($node==2)$where= "nsep.idsituacionpersona= $node and nsep.idpadre=nsep.idsituacionespecificapersona";
			else if($node==3)$where= "nsep.idsituacionpersona= $node and nsep.idpadre=nsep.idsituacionespecificapersona";
			else $where= "nsep.idpadre= $node and nsep.idpadre<>nsep.idsituacionespecificapersona";
			//$where=($node==0)?"nsep.idsituacionespecificapersona=nsep.idpadre":"nsep.idpadre=$node and nsep.idpadre<>nsep.idsituacionespecificapersona";
		    $query = new Doctrine_Query(); 
			$result = $query
			->from('NomSituacionespecificapersona nsep')
			->where($where)			
			->setHydrationMode (Doctrine::HYDRATE_ARRAY)
			->execute();
			return $result;
		} 
		catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	
	public function obtenerHijosByIdPadre($idsituacion){ 
		try {
			$where= "nsep.idpadre = $idsituacion and nsep.idpadre<>nsep.idsituacionespecificapersona";
			//if($node==1)$where= "nsep.idsituacionpersona= $node and nsep.idpadre=nsep.idsituacionespecificapersona";
			//else if($node==2)$where= "nsep.idsituacionpersona= $node and nsep.idpadre=nsep.idsituacionespecificapersona";
			//else if($node==3)$where= "nsep.idsituacionpersona= $node and nsep.idpadre=nsep.idsituacionespecificapersona";
			//else $where= "nsep.idpadre= $node and nsep.idpadre<>nsep.idsituacionespecificapersona";
			//$where=($node==0)?"nsep.idsituacionespecificapersona=nsep.idpadre":"nsep.idpadre=$node and nsep.idpadre<>nsep.idsituacionespecificapersona";
			//echo $where;die;
		    $query = new Doctrine_Query(); 
			$result = $query
			->from('NomSituacionespecificapersona nsep')
			->where($where)			
			->setHydrationMode (Doctrine::HYDRATE_ARRAY)
			->execute();
			return $result;
		} 
		catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
    
    public function obtenerCaminoXidhijo($idsituacion){ 
		try {
		    $query = new Doctrine_Query(); 
			$resultH = $query
			->from('NomSituacionespecificapersona nsep')
			->where("nsep.idsituacionespecificapersona = $idsituacion")			
			->setHydrationMode (Doctrine::HYDRATE_ARRAY)
			->execute();
			$izq = $resultH[0]['lft'];
            $resultP = $query->select("nsp.idsituacionespecificapersona as id, nsp.denom as situacion")
			->from('NomSituacionespecificapersona nsp')
			->where("nsp.lft <= $izq and nsp.rgt > $izq")
            ->orderBy("nsp.codigo")			
			->setHydrationMode (Doctrine::HYDRATE_ARRAY)
			->execute();
			return $resultP;
		} 
		catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}    
	
	public function obtenerArrCaminoXidhijo($idsituacion){ 
		try {			
		    $query = new Doctrine_Query(); 
			$resultH = $query
			->from('NomSituacionespecificapersona nsep')
			->whereIn("nsep.idsituacionespecificapersona",$idsituacion)		
			->setHydrationMode (Doctrine::HYDRATE_ARRAY)
			->execute();
			//$izq = $resultH[0]['lft'];				
			for($i=0; $i<count($resultH); $i++){
				$relft=$resultH[$i]['lft'];
				 $resultP = $query->select("nsp.idsituacionespecificapersona as id, nsp.denom as situacion")
				->from('NomSituacionespecificapersona nsp')
				->where("nsp.lft <= $relft and nsp.rgt > $relft")
	            ->orderBy("nsp.codigo")			
				->setHydrationMode (Doctrine::HYDRATE_ARRAY)
				->execute();
				$res[$i]['idsituacionespecificapersona']=$resultH[$i]['idsituacionespecificapersona']; 
				$res[$i]['datos']=$resultP; 
			}
			//print_r($res);die;
			return $res;
		} 
		catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
    public function obtenersituacionesespecificas(){
        $query = new Doctrine_Query(); 
			$result = $query->select("nsep.idsituacionespecificapersona as id, nsep.idpadre, nsep.denom")
			->from('NomSituacionespecificapersona nsep')
			->setHydrationMode (Doctrine::HYDRATE_ARRAY)
			->execute();
			return $result;
    }
 
}//fin clase 
?>


