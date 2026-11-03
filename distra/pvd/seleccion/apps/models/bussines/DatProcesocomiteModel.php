<?php
class DatProcesocomiteModel extends ZendExt_Model
{
  
    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	public function addComiteProceso($idproceso, $arrCom)
	{
		try {
			DatProcesocomite::deleteByIdProceso($idproceso);
			foreach($arrCom as $k => $v) {
				$obj = new DatProcesocomite();
				$obj->idcomision = $v->idcomision;
				$obj->idproceso = $idproceso;
				$obj->save();
			}
			return true;
		} catch (Exception $e) {
			return false;
		}
	}
	
	public function getComiteByIdProceso($idproceso)
	{	
		return DatProcesocomite::getDatosByIdProceso($idproceso);
	}

    public function desasociarComiteProceso($idproceso, $arrCom)
    {
       try {
            //Eliminado la asociación entre el proceso y los comites y los responsables que pertenecen a estos comites
            foreach($arrCom as $v) {
                DatProcesocomite::deleteByIdProcesoIdcomite($idproceso, $v->idcomision);
                DatResponsable::deleteByComiteProceso($v->idcomisionpersona, $idproceso);
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
	
}