<?php 
class DatEvalseguridadaccesoentidades extends BaseDatEvalseguridadaccesoentidades
 { 
	public function setUp() {   
		parent::setUp(); 
    } 
	//Ordenar ...
	public function GetTodos() { 
		$query = new Doctrine_Query (); 
		$result = $query->from('DatEvalseguridadaccesoentidades')->orderBy('idevalseguridadaccesoentidades DESC')->execute (); 
		return $result->toArray();
    }
	
	public function getCantTotal(){
		$query = new Doctrine_Query (); 
		$result = $query->select('idevalseguridadaccesoentidades')
			->from('DatEvalseguridadaccesoentidades')
			->count();
		return $result;
	}
	
	public function Buscar($idevalseguridadaccesoentidades)
	{
		return $DatEvalregla = Doctrine::getTable( 'DatEvalseguridadaccesoentidades' )->find ( $idevalseguridadaccesoentidades );		
	} 
	
	public function GetPorLimite($limite = 15,$inicio = 0) 
    { 
		$query = new Doctrine_Query (); 
		$result = $query->from('DatEvalseguridadaccesoentidades')->limit($limite)->offset($inicio)->execute (); 
		return $result->toArray();
    } 
	
	public function existePersonaSegAccesoEnt($idpersona){
		$query = new Doctrine_Query (); 
		$result = $query->from('DatEvalseguridadaccesoentidades se')->where('se.idpersona = ?', $idpersona)->setHydrationMode( Doctrine:: HYDRATE_ARRAY )->execute(); 
		return $result;
	}
	public function getSeguridadAccesoEntidades($idevalseguridadaccesoentidades){
		return $DatEvalseguridadaccesoentidades = Doctrine::getTable( 'DatEvalseguridadaccesoentidades' )->find( $idevalseguridadaccesoentidades );
	}
	
 
}//fin clase 
?>


