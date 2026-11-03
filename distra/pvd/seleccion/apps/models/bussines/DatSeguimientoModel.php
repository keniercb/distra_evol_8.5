<?php
class DatSeguimientoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	public function getCandidatosSeguimiento($idproceso, $limite, $inicio, $filtro)	
	{
		$cand = DatSeguimiento::getCandidatosSeguimiento($idproceso, $limite, $inicio, $filtro);
		foreach ($cand as $i => $val) {			
            if ($val['cantd'] == null || $val['cantd'] >= 0) {
                $cand[$i]['estado'] = 'Actual';
            } else {
                $cand[$i]['estado'] = 'Histórico';
            }
		}
		$r->datos = $cand;
		$r->cantidad = DatSeguimiento::getCantCandidatosSeguimiento($idproceso, $filtro);
		return $r;
	}
	
	public function addSeguimiento($idcandidato, $idmotivoseguimiento, $fdesde, $fhasta)	
	{		
		try{
            $obj = DatSeguimiento::existeCandidato($idcandidato);
            if (count($obj) == 0) {
                $obj = new DatSeguimiento();
                $obj->idcandidato = $idcandidato;
                $obj->idmotivoseguimiento = $idmotivoseguimiento;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->save();
                return true;
            } else {
                return false;
            }
		} catch(Exception $e){
            return false;            
		}
	}
	
	public function modSeguimiento($idseguimiento, $idcandidato, $idmotivoseguimiento, $fdesde, $fhasta, $concluir)	
	{		
		try{
			$obj = DatSeguimiento::getById($idseguimiento);
			if ($concluir == 2) {
				$obj->idcandidato = $idcandidato;
				$obj->idmotivoseguimiento = $idmotivoseguimiento;
				$obj->fdesde = $fdesde;
			}			
			$obj->fhasta = ($fhasta == '')?null:$fhasta;
			$obj->save();					
			return true;
		} catch(Exception $e){
            return false;            
		}	
	}
	
	public function delSeguimiento($idseguimiento)
	{
		$obj = DatSeguimiento::getById($idseguimiento);         		
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
