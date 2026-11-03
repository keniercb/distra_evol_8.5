<?php
class DatIndicadortecnicaModel extends ZendExt_Model
{
    
    public function setUp()
    {
        parent::ZendExt_Model();
    }

	public function addIndicadoTecnica($idresultadotec, $idindicadorplan)
	{ 
		try {
			$proctec = DatResultadotecnica::getProcesoTecById($idresultadotec);	
			$comp = Array();
			$comp = ConfComptecnica::getIdResTecByTecnicaModelo($proctec[0]['idprocesotecnica'], $proctec[0]['idtecnica'], $proctec[0]['idmodelo']);
			//print_r($comp);			
			$comp[count($comp)]['idresultadotecnica'] = $idresultadotec;
			foreach ($comp as $rest) {
				$obj = new DatIndicadortecnica();
				$obj->idresultadotecnica = $rest['idresultadotecnica'];
				$obj->idindicadorplanilla = $idindicadorplan;
				$obj->save();
				if($idresultadotec = $rest['idresultadotecnica']){
					$idindicadortecnica = $obj->idindicadortecnica;
				}						
			}									
			return $idindicadortecnica;
		} catch (Exception $e) {
			return false;
		}
	}
	
	public function updateIndicadoTecnica($idindicadortecnica, $resultado, $compl)
	{
		try {	
			$ind = DatIndicadortecnica::getDatosIndicadorById($idindicadortecnica);
			$proctec = DatResultadotecnica::getProcesoTecById($ind['idresultadotecnica']);
			$comp = Array();
			$comp = ConfComptecnica::getIdIndicByTecnicaModelo($proctec[0]['idprocesotecnica'],$proctec[0]['idtecnica'], $proctec[0]['idmodelo'], $ind['idindicadorplanilla']);
			$comp[count($comp)]['idindicadortecnica'] = $idindicadortecnica;
			foreach ($comp as $rest) {
				$obj = DatIndicadortecnica::getById($rest['idindicadortecnica']);
				$obj->resultado = $resultado;
				$obj->complemento = $compl;
				$obj->save();						
			}			
			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function getIndicadorSeleccion($idresultadotecnica, $idindicadorplanilla)
    {        
		return DatIndicadortecnica::getIndicadorSeleccion($idresultadotecnica, $idindicadorplanilla);
    }
}