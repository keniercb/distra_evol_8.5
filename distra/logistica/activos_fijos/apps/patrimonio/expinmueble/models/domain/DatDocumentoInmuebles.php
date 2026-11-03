<?php
class DatDocumentoInmuebles extends BaseDatDocumentoInmuebles {

   public function setUp()
    {   parent::setUp();
         //$this->hasOne('DatActivofijotangible', array('local'=>'idinmueble','foreign'=>'idactivofijotangiblegeneral'));
         $this->hasMany('NomExpediente', array('local'=>'idexpediente','foreign'=>'idexpediente'));
         $this->hasMany('DatNumeroserieactivo', array('local'=>'idnumeroserieactivo','foreign'=>'idnumeroserieactivo'));
    }

    public function GetArrayIdAsociados($id, $start, $limite)
    {
		$query = Doctrine_Query::create ();
		return $query->select ( 'ng.idexpediente, nexp.*')
					 ->from ( 'DatDocumentoInmuebles ng' )
					 ->innerJoin('ng.NomExpediente nexp')
					 ->where('ng.idnumeroserieactivo = ?',$id)
					 ->offset($start)
					 ->limit($limite)
					 ->setHydrationMode ( Doctrine::HYDRATE_ARRAY )
					 ->execute ();
	}

	public function GetArrayIdAsociadosTodos($id)
    {
		$query = Doctrine_Query::create ();
		return $query->select ( 'ng.idexpediente')
					 ->from ( 'DatDocumentoInmuebles ng' )
					 ->innerJoin('ng.NomExpediente nexp')
					 ->where('ng.idnumeroserieactivo = ?',$id)
					 ->setHydrationMode ( Doctrine::HYDRATE_ARRAY )
					 ->execute ();
	}

	public function Eliminar($idinmueble, $array)
    {
		$str  = '';
		$con = 0;

		foreach($array as $key){
			$str .= ($con == 0)? $key : ' , '.$key;
			$con ++;
		}

		$query = Doctrine_Query::create ();
		return $query ->delete()
					  ->from ('DatDocumentoInmuebles')
				      ->where("idnumeroserieactivo = $idinmueble and idexpediente in ($str)")
				      ->execute();
	}

	public function EliminarTodosDocumentosDelInmueble($idinmueble)
    {
    	try{
	    	$query = Doctrine_Query::create ();
			$query  ->delete()
					->from ('DatDocumentoInmuebles')
					->where('idnumeroserieactivo = ?',$idinmueble)
					->execute();
			return true;
    	}
    	catch(Doctrine_Exception $e){
    		return false;
    	}
	}

	//Aqui cuento de uno en uno la cantidad de documentos de un inmueble dado
	public function CantidadDocumentos($idinmueble,$idexpediente){

		$query = Doctrine_Query::create ();
		return $query ->select('count(doc.idexpediente)')
					  ->from ('DatDocumentoInmuebles doc')
				      ->where("idinmueble = $idinmueble and idexpediente = $idexpediente")
				      ->execute();
	}

	public function dameTodosDocumentos(){
		$query = new Doctrine_Query();
		$documentos = $query->select('ne.idexpediente')
							->from('NomExpediente ne')
							->setHydrationMode ( Doctrine::HYDRATE_ARRAY )
							->execute();
		return $documentos;
	}
} //fin clase
