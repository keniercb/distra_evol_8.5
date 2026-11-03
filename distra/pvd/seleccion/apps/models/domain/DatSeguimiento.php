<?php
class DatSeguimiento extends BaseDatSeguimiento
{
	public function setUp()
    {
        parent :: setUp();
    }
	
	public function getById($idseguimiento)
    {
        return Doctrine::getTable('DatSeguimiento')->find($idseguimiento);
    }
	
	public function getCandidatosSeguimiento($idproceso, $limit = 15, $start = 0, $filtro)
	{
		$sql = "SELECT 
  	                ds.idseguimiento
				  , ds.idcandidato	
				  , ds.idmotivoseguimiento
				  , ds.fdesde
				  , ds.fhasta
				  , nms.denominacion as motivoseguimiento
				  , date_part('day',ds.fhasta - now()) AS cantd
                  , dc.idproceso
                  , dc.idpersona
                  , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombre               
				  , ddi.numero AS numid
				FROM mod_seleccion.dat_seguimiento AS ds
				INNER JOIN mod_seleccion.dat_candidato AS dc ON (ds.idcandidato = dc.idcandidato)
				INNER JOIN mod_seleccion.nom_motivoseguimiento AS nms ON (ds.idmotivoseguimiento = nms.idmotivoseguimiento)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                              AND ddi.principal = 1
                                              AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
				WHERE
				  dc.idproceso = $idproceso 
				  AND dc.fhasta IS NULL
				  AND dp.feliminado IS NULL";
		if($filtro != null) {
			$f = " AND ((cast(dc.idpersona AS VARCHAR) ILIKE '%$filtro%')
                     OR (ddi.numero ILIKE '%$filtro%')
					 OR (dp.nombre ILIKE '%$filtro%')
					 OR (dp.snombre ILIKE '%$filtro%')
					 OR (dp.papel ILIKE '%$filtro%')
					 OR (dp.sapel ILIKE '%$filtro%'))";
			$sql = $sql.$f;
		}
		$sql = $sql." OFFSET $start LIMIT $limit";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
	public function getCantCandidatosSeguimiento($idproceso, $filtro)
	{
		$sql = "SELECT 
  	                ds.idseguimiento
				FROM mod_seleccion.dat_seguimiento AS ds
				INNER JOIN mod_seleccion.dat_candidato AS dc ON (ds.idcandidato = dc.idcandidato)
				INNER JOIN mod_seleccion.nom_motivoseguimiento AS nms ON (ds.idmotivoseguimiento = nms.idmotivoseguimiento)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                              AND ddi.principal = 1
                                              AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
				WHERE
				  dc.idproceso = $idproceso
				  AND dc.fhasta IS NULL
				  AND dp.feliminado IS NULL";
		if($filtro != null) {
			$f = " AND ((cast(dc.idpersona AS VARCHAR) ILIKE '%$filtro%')
                     OR (ddi.numero ILIKE '%$filtro%')
					 OR (dp.nombre ILIKE '%$filtro%')
					 OR (dp.snombre ILIKE '%$filtro%')
					 OR (dp.papel ILIKE '%$filtro%')
					 OR (dp.sapel ILIKE '%$filtro%'))";
			$sql = $sql.$f;
		}
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return count($conn->fetchAll($sql));
	}

    public function existeCandidato($idcandidato)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.idcandidato')
            ->from('DatSeguimiento m')
            ->where("m.idcandidato = '$idcandidato' AND m.fdesde <= now() AND (m.fhasta is null OR m.fhasta > now())");
        return $queryObj->fetchArray();
    }
}
