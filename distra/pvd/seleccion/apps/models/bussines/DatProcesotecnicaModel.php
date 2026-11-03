<?php
class DatProcesotecnicaModel extends ZendExt_Model
{
    function __construct()
    {
	
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }
		
	public function getTecnicaByIdProceso($idproceso)	
	{
        try{
            $tec = DatProcesotecnica::getTecnicaByProceso($idproceso);
            return $tec;
        } catch(Exception $e){
             return false;
        }
	}
	
	public function addTecnicaProceso($idproceso, $idtecnica, $idmodelo, $tiempo, $unidad, $fdesde, $fhasta, $hito,
		$condicion, $valor, $responsables)	
	{		
		try{
			$ordenmax = DatProcesotecnica::getOrdenMaximo($idproceso)[0]['ordenmaximo'];
			
			$objprocesotec = new DatProcesotecnica();
			$objprocesotec->idproceso = $idproceso;
			$objprocesotec->idtecnica = $idtecnica;
			$objprocesotec->idmodelo = $idmodelo;
            $objprocesotec->validez = $tiempo;
			$objprocesotec->unidadtiempo = $unidad;
			$objprocesotec->fdesde = $fdesde;
			$objprocesotec->fhasta = $fhasta;
			$objprocesotec->orden =  $ordenmax + 1; 
			$objprocesotec->condicion = $condicion;
			if ($hito != ''){
				$objprocesotec->hito = $hito;
			}			
			if ($valor != ''){
				$objprocesotec->valor = $valor;
			}			
			$objprocesotec->save();
			$idprocesotecnica = $objprocesotec->idprocesotecnica;
			foreach ($responsables as $i => $val) {
				$objprocesoresp = new DatResponsable();
				$objprocesoresp->idprocesotecnica = $idprocesotecnica;
				$objprocesoresp->idcomisionpersona = $val;
				$objprocesoresp->save();
			}
			return true;
		} catch(Exception $e){
            return false;            
		}
	}
	
	public function actualizarOrden($tecnicas)	
	{		
		try{			
			foreach ($tecnicas as $i => $val) {
				$objprocesotec = DatProcesotecnica::getById($val->idprocesotecnica); 
				$objprocesotec->orden = $val->orden;
				$objprocesotec->save();
			}
			return true;
		} catch(Exception $e){
            return false;            
		}	
	}	
	
	
	public function modTecnicaProceso($idprocesotecnica, $idproceso, $idtecnica, $idmodelo, $tiempo, $unidad, $fdesde, $fhasta, $hito,
		$condicion, $valor, $responsables)	
	{		
		try{
			$objprocesotec = DatProcesotecnica::getById($idprocesotecnica);
			$objprocesotec->idproceso = $idproceso;
			$objprocesotec->idtecnica = $idtecnica;
			$objprocesotec->idmodelo = $idmodelo;
            $objprocesotec->validez = $tiempo;
			$objprocesotec->unidadtiempo = $unidad;
			$objprocesotec->fdesde = $fdesde;
			$objprocesotec->fhasta = $fhasta; 
			$objprocesotec->condicion = $condicion;
			if ($hito != ''){
				$objprocesotec->hito = $hito;
			}			
			if ($valor != ''){
				$objprocesotec->valor = $valor;
			}			
			$objprocesotec->save();
			
			DatResponsable::deleteByProcTecnica($idprocesotecnica);
			
			foreach ($responsables as $i => $val) {
				$objprocesoresp = new DatResponsable();
				$objprocesoresp->idprocesotecnica = $idprocesotecnica;
				$objprocesoresp->idcomisionpersona = $val;
				$objprocesoresp->save();
			}
			return true;
		} catch(Exception $e){
            return false;            
		}	
	}	
	
	public function deleteTecnicaProceso($idprocesotecnica)
	{
		$obj = DatProcesotecnica::getById($idprocesotecnica);         		
		try{
			$obj->delete();
			return true;
		} catch(Exception $e){
			if($e->GetCode() == 23503){
                return false;
            }
		}	
	}
}
