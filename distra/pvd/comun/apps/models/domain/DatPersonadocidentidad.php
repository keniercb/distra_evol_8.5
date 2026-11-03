<?php 
class DatPersonadocidentidad extends BaseDatPersonadocidentidad
{ 
 
   public function Buscar($idpersonaidentidad) 
    { 
		try {
		$query = new Doctrine_Query (); 
          $result = $query->from('DatPersonadocidentidad')
						  ->where('idpersonaidentidad =?', $idpersonaidentidad)
						  ->execute (); 
          return $result->toArray(); 
          }
		catch(Doctrine_Exception $e) { 
			return $e; 
		}
    } 
	public function BuscarActual($idpersonaidentidad) 
    { 
		try {
		$query = new Doctrine_Query (); 
          $result = $query->from('DatPersonadocidentidad')
						  ->where('idpersonaidentidad =? and actual=?', array($idpersonaidentidad,'1'))
						  ->execute (); 
          return $result; 
          }
		catch(Doctrine_Exception $e) { 
			return $e; 
		}
    }
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatPersonadocidentidad')->execute(); 
          return $result->toArray();
    }   
	
	public function GetTodosById($idp) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatPersonadocidentidad')->where('idpersona =?', $idp)->execute ();
          return $result->toArray();
    } 
 
   public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatPersonadocidentidad')->limit($limite = 10)->offset($inicio = 0)->execute (); 
          return $result->toArray(); 

    }
	
	public function BuscarObj($idpersonaidentidad) 
    {
          $temp = Doctrine::getTable('DatPersonadocidentidad')->find($idpersonaidentidad); 
           return $temp; 

    }
	
	static public function GetNumIdentByPersona($idpersona,$limit,$start)
    { 
      $q = Doctrine_Query::create();
       try{
          $result = $q->select('idpersonaidentidad, idpersona, numeroidentidad,pci.idtipodocidentidad, denom as tipoidentidad,actual, activo, serie,fechainicio, fechafin')
            ->from('DatPersonadocidentidad pci')
			->innerjoin('pci.NomTipodocidentidad ntci')			
			 ->where("pci.idpersona=? ",array($idpersona))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
			->limit($limit)
			->offset($start)
            ->execute();
		  return $result;
        }
               catch(Doctrine_Exception $ee){die($ee);}
    }
}//fin clase 
?>


