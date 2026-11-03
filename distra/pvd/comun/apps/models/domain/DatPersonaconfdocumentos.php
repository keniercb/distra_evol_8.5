<?php 
class DatPersonaconfdocumentos extends BaseDatPersonaconfdocumentos{ 

	public function setUp(){
		parent::setUp();
		$this->hasMany("DatPersona",array('local'=>'idpersona','foreign'=>'idpersona'));
	}
 
	public function Obtenerconfdocumento($idpersona){
		$query = new Doctrine_Query (); 
		$result = $query->from('DatPersonaconfdocumentos')
					->where("idpersona = ?", $idpersona)
					->setHydrationMode(Doctrine::HYDRATE_ARRAY)
					->execute (); 
		return $result;
	}
 }//fin clase 
?>

