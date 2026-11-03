<?php 
class NomEvalindicadorimagen extends BaseNomEvalindicadorimagen
 { 
   public function setUp() 
    { 
       parent::setUp();
    } 
 
   public function Buscar($idindicadorimagen) 
    { 
          $temp = $this->conn->getTable('NomEvalindicadorimagen')->find($idindicadorimagen); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvalindicadorimagen')->execute (); 
          return $result->toArray(); 

    } 
	
	public function GetCantTotal() {
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(idindicadorimagen)')->from ('NomEvalindicadorimagen')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}  
/*
public function cargarNomenclador($idbd, $tablaNom){
		$query = Doctrine_Manager::getInstance();
		$sql="SELECT $idbd as idvalor, denom FROM $tablaNom";
		return  $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
	}
*/	
	public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
        $dirimgs = "../../../plantillas/nomvalindimgs/";		
		$query = Doctrine_Manager::getInstance();
		$sql = "SELECT ii.idindicadorimagen,ii.codigo,ii.denom,ii.extension,ii.descripcion,ii.fechainicio,
				       ii.fechafin,ii.iddominioevaluativo,ii.nombre,de.iddominioevaluativo,de.denom as dominio
				FROM mod_evaluaciones.nom_evalindicadorimagen ii 
				INNER JOIN mod_evaluaciones.dat_evaldominioevaluativo de
				ON ii.iddominioevaluativo = de.iddominioevaluativo";
		$result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        $arrTmp = $result;
		$imgs = array();
		foreach($arrTmp as $a)
			$imgs[] = array('idindicadorimagen'=>$a['idindicadorimagen'], 'imagen'=>$dirimgs.''.$a['idindicadorimagen'].$a['extension'],
							'codigo'=>$a['codigo'], 'nombre'=>$a['nombre'], 'dominio'=>$a['dominio'],'iddominioevaluativo'=>$a['iddominioevaluativo'],
							'fechainicio'=>$a['fechainicio'], 'fechafin'=>$a['fechafin'],'descripcion'=>$a['descripcion'], 'extension'=>$a['extension']);
		  return $imgs;	
    } 
	
	public function getArrIndicadoresPorId($arrIndImagen) {
		$varAux = "";
		$bandera = false;
		for($i =0; $i<count($arrIndImagen); $i++){
			$varAux .= ($bandera ? ", ":"").$arrIndImagen[$i];
			$bandera = true;
		}
		$query = new Doctrine_Query();
		$arrResult = $query->select ('im.nombre as denom, im.denom as imagen, im.descripcion, im.codigo, im.idindicadorimagen')
			->from ('NomEvalindicadorimagen im')
			->where ("im.idindicadorimagen = any (array[$varAux])")
			->setHydrationMode( Doctrine:: HYDRATE_ARRAY )
			->execute();		
		return $arrResult;
	}
	
	public function ExisteCodIndicadorI($cod) 
    { 	
        $query = new Doctrine_Query (); 
          $result = $query->from('NomEvalindicadorimagen')
						  ->where("codigo = '$cod'")
						  ->execute (); 
          return $result->toArray();
    }
	
	public function IndicadorIEnUso($idindicadorimagen) 
    { 
		$query = new Doctrine_Query (); 
          $result = $query->from('DatEvalindicadoresplanilla')
						  ->where("idindicador = '$idindicadorimagen'")
						  ->execute (); 
          return $result->toArray();
    }
	
	public  function contarcodigo($cod)
    {
		$query = Doctrine_Query::create();
		$cantCod = $query->from('NomEvalindicadorimagen')->where("codigo = ?",$cod)->count();
		
    return $cantCod;
    }
	 
}