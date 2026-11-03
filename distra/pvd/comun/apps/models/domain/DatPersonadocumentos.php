<?php 
class DatPersonadocumentos extends BaseDatPersonadocumentos{ 

	public function setUp(){
		parent::setUp();
		$this->hasMany("DatPersona",array('local'=>'idpersona','foreign'=>'idpersona'));
	}
 
	public function Obtenerdocumentos($idpersona){
		$query = new Doctrine_Query (); 
		$result = $query->from('DatPersonadocumentos')
					->where("idpersona = ?", $idpersona)
					->setHydrationMode(Doctrine::HYDRATE_ARRAY)
					->execute (); 
		return $result;
	}
	public function Buscar($idpersonadocumento){
		try {			
			return Doctrine::getTable('DatPersonadocumentos')->find($idpersonadocumento);
		} 
		catch(Doctrine_Exception $e) { 
			return $e; 
		}
	}
 }//fin clase 
?>

