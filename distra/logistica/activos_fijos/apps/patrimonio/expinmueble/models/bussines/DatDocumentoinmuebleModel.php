<?php
class DatDocumentoinmuebleModel extends ZendExt_Model
 {
   public function setUp()
    {
        parent::ZendExt_Model();
    }

   public function Actualizar(DatDocumentoinmueble $DatDocumentoinmueble)
    {
            $DatDocumentoinmueble->save();
    }

    public function ArregloExpedienteAsociados($id, $start, $limite)
    {
		return DatDocumentoInmuebles::GetArrayIdAsociados($id, $start, $limite);
	}

	public function CantidadExpedienteAsociados($id)
    {
		$datos = DatDocumentoInmuebles::GetArrayIdAsociadosTodos($id);
		return count($datos);
	}

	public function Adicionar($idinmueble, $idsdocumentos)
	{
		try{
			$obj = new Doctrine_Collection('DatDocumentoInmuebles');
			foreach($idsdocumentos as $i => $id){
				$obj[$i]->idexpediente = $id;
				$obj[$i]->idnumeroserieactivo = $idinmueble;
			}
			//print_r()
			$obj->save();
			return true;
		}
		catch(Doctrine_Exception $e){
			return false;
		}
	}

	public function AdicionarTodos($idinmueble)
	{
		$iddocumentos = DatDocumentoInmuebles::dameTodosDocumentos();
		foreach($iddocumentos as $iddoc){
			$iddocs[] = $iddoc['idexpediente'];
		}

		$eliminar = DatDocumentoInmuebles::EliminarTodosDocumentosDelInmueble();
		if($eliminar)
			return $this->Adicionar($idinmueble, $iddocs);
	}

	public function Eliminar($idinmueble ,$arreglo)
	{
		return DatDocumentoInmuebles::Eliminar($idinmueble, $arreglo);
	}

	public function EliminarTodos($idinmueble)
	{
		return DatDocumentoInmuebles::EliminarTodosDocumentosDelInmueble($idinmueble);
	}

	public function CantInmueblesQueTieneDocumentoX($iddocumento)
	{
		$query = Doctrine_Query::create ();
		return $query ->select('count(doc.idinmueble)')
					  ->from ('DatDocumentoInmuebles doc')
				      ->where('idexpediente = ?',$iddocumento)
				      ->setHydrationMode( Doctrine :: HYDRATE_ARRAY )
				      ->execute();
	}

	public function DocumentosAQuitar($idinmueble){
		$array = DatDocumentoInmuebles::GetArrayIdAsociadosTodos($idinmueble);
		foreach($array as $data){
			$quitar[] = $data['idexpediente'];
		}
		return $quitar;
	}
 }