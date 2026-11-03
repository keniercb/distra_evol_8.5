<?php
class DatResponsable extends BaseDatResponsable
{
	public function setUp()
    {
        parent :: setUp();
    }
	
	public function getRespByTecnica($idprocesotecnica)
    {
		$sql = "SELECT
		          r.*
				, c.idcomision
				, c.denominacion as comision
				, cm.idpersona
				, cc.denominacion as cargocomision
				FROM
				  mod_seleccion.dat_responsable AS r
				INNER JOIN mod_rrhhmaestro.dat_comisionmiembro AS cm ON (r.idcomisionpersona = cm.idcomisionpersona)
                LEFT JOIN mod_rrhhmaestro.nom_cargocomision AS cc ON (cm.idcargocomision = cm.idcargocomision)
				INNER JOIN mod_rrhhmaestro.dat_comision AS c ON (cm.idcomision = c.idcomision)
				WHERE r.idprocesotecnica = $idprocesotecnica";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);		
    }
	
	public function deleteByProcTecnica($idprocesotecnica)
    {
		$q = Doctrine_Query::create()
				->delete('DatResponsable r')
				->where("r.idprocesotecnica = '$idprocesotecnica'")
				->execute();			
    }

    public function deleteByComiteProceso($idcomisionpersona, $idproceso)
    {
        $sql = "DELETE
				FROM
				  mod_seleccion.dat_responsable AS r
				  WHERE r.idresponsable IN
				(SELECT resp.idresponsable
				 FROM mod_seleccion.dat_responsable AS resp
				 INNER JOIN mod_seleccion.dat_procesotecnica AS pt ON (resp.idprocesotecnica = pt.idprocesotecnica)
				 WHERE pt.idproceso = $idproceso and resp.idcomisionpersona = $idcomisionpersona)";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        $cnx->fetchAll($sql);
    }
	
	public function getById($idresponsable)
    {
        return Doctrine::getTable('DatResponsable')->find($idresponsable);
    }

    public function getPersonaMiembroComiteProcesotecnica($idprocesotecnica, $idpersona)
    {
        $sql = "SELECT r.idresponsable
                FROM mod_seleccion.dat_responsable r
                INNER JOIN mod_rrhhmaestro.dat_comisionmiembro c ON (c.idcomisionpersona = r.idcomisionpersona)
                WHERE r.idprocesotecnica = $idprocesotecnica AND c.idpersona = $idpersona";

        $sqlResp = "SELECT r.idresponsable
                FROM mod_seleccion.dat_responsable r
                INNER JOIN mod_rrhhmaestro.dat_comisionmiembro c ON (c.idcomisionpersona = r.idcomisionpersona)
                WHERE r.idprocesotecnica = $idprocesotecnica";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        $res->estaid = $cnx->fetchAll($sql);
        $res->tieneresp = $cnx->fetchAll($sqlResp);
        return $res;
    }
}