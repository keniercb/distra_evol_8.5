<?php
class DatResultadoseleccion extends BaseDatResultadoseleccion
{
	public function setUp()
    {
        parent :: setUp();
    }
	
	public function getById($idresultadoseleccion)
    {
        return Doctrine::getTable('DatResultadoseleccion')->find($idresultadoseleccion);
    }	
	
	public function getCandidatosPreseleccionados($idproceso, $start = 0, $limit = 15, $filtro)
	{
		$sql = "SELECT 
				    rs.idresultadoseleccion
  	              , dc.idcandidato
				  , dc.idproceso
				  , dc.idpersona
				  , dc.observacion
				  , dp.nombre
				  , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombre			  
				  , ddi.numero as numid
				FROM
				  mod_seleccion.dat_resultadoseleccion AS rs
				INNER JOIN mod_seleccion.dat_candidato AS dc ON (rs.idcandidato = dc.idcandidato)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)  				
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                                             AND  ddi.principal = 1
                                                             AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
				WHERE
				  dc.idproceso = $idproceso	
				  AND rs.seleccion = 0
				  AND dc.contratado = 0
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
	
	public function getCandidatosSeleccionados($idproceso, $start = 0, $limit = 15, $filtro)
	{
		$sql = "SELECT 
  	                rs.idresultadoseleccion
  	              , rs.ubicacion
  	              , dc.idcandidato
				  , dc.idproceso
				  , dc.idpersona
				  , dc.observacion				  
				  , ddi.numero as numid
				  , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreapellidos
				FROM
				  mod_seleccion.dat_resultadoseleccion AS rs
				INNER JOIN mod_seleccion.dat_candidato AS dc ON (rs.idcandidato = dc.idcandidato)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)  				
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                                             AND  ddi.principal = 1
                                                             AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
				WHERE
				  dc.idproceso = $idproceso	
				  AND rs.seleccion = 1
				  AND dc.contratado = 0
				  AND dc.fhasta IS NULL";
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

    public function getCandidatosSelecc($estructura,$provincia,$municipio,$idestructura)
    {

        $sql = "SELECT
  	                rs.idresultadoseleccion
  	              , rs.ubicacion
  	              , dc.idcandidato
				  , dc.idproceso
				  , dc.idpersona
				  , dc.observacion
				  , dp.nombre
				  , dp.snombre
				  , dp.papel
				  , dp.sapel
				  , ddi.numero as numid
				  ,dir.direccion
				  ,pm.denominacion as provincia
                  ,pmp.denominacion as municipio
				  , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.nombre || ' ' || dp.papel
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.nombre || ' ' || dp.snombre || ' ' || dp.papel
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN  dp.nombre || ' ' || dp.papel || ' ' || dp.sapel
						 ELSE dp.nombre || ' ' || dp.snombre || ' ' || dp.papel || ' ' || dp.sapel
					END AS nombreapellidos
					,CASE WHEN dc.idcandidato IN (SELECT de.idcandidato FROM mod_seleccion.dat_excluido AS de WHERE de.freincorporacion IS NULL) THEN 'Excluido'
                        WHEN rs.seleccion = 0 THEN 'Preseleccionado'
                        WHEN rs.seleccion = 1 THEN 'Seleccionado'
                        ELSE 'En proceso' END AS estado
				FROM
				  mod_seleccion.dat_resultadoseleccion AS rs
				INNER JOIN mod_seleccion.dat_candidato AS dc ON (rs.idcandidato = dc.idcandidato)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                                             AND  ddi.principal = 1
                                                             AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
                 LEFT JOIN mod_persona.dat_direccion AS dir ON (dp.idpersona = dir.idpersona)
                 LEFT JOIN mod_seleccion.dat_proceso AS proc ON (proc.idproceso = dc.idproceso)
                 LEFT JOIN mod_datosmaestros.nom_dpt AS pm ON (pm.iddpt = dir.idprovincia)
                 LEFT JOIN mod_datosmaestros.nom_dpt AS pmp ON (pmp.iddpt = dir.idmunicipio)


				WHERE
				 rs.seleccion = 1 AND proc.idestructura=$idestructura

				";

        if($estructura) {
            $f = " AND (cast(proc.idestructura AS VARCHAR) ILIKE '%$estructura%')";
            $sql = $sql.$f;
        }

        if($provincia) {
            $f = " AND (cast(pm.iddpt  AS VARCHAR )ILIKE '%$provincia%')";
            $sql = $sql.$f;
        }

        if($municipio) {
            $f = " AND (cast(pmp.iddpt  AS VARCHAR )ILIKE '%$municipio%')";
            $sql = $sql.$f;
        }

        $f = "ORDER BY proc.idproceso ASC";

        $sql = $sql.$f;
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
	
	public function cantCandidatosPreseleccionados($idproceso, $filtro)
	{
		$sql = "SELECT 
  	                dc.idcandidato				 
				FROM
				  mod_seleccion.dat_resultadoseleccion AS rs
				INNER JOIN mod_seleccion.dat_candidato AS dc ON (rs.idcandidato = dc.idcandidato)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)
  				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                                             AND  ddi.principal = 1
                                                             AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
				WHERE
				  dc.idproceso = $idproceso	
				  AND rs.seleccion = 0
				  AND dc.contratado = 0
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
	
	public function cantCandidatosSeleccionados($idproceso, $filtro)
	{
		$sql = "SELECT 
  	                dc.idcandidato				 
				FROM
				  mod_seleccion.dat_resultadoseleccion AS rs
				INNER JOIN mod_seleccion.dat_candidato AS dc ON (rs.idcandidato = dc.idcandidato)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)  
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                                             AND  ddi.principal = 1
                                                             AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
				WHERE
				  dc.idproceso = $idproceso	
				  AND rs.seleccion = 1
				  AND dc.contratado = 0
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
	
	public function totalPreseleccionados($idproceso)
	{
		$sql = "SELECT
				  count(dc.idcandidato)
				FROM
				  mod_seleccion.dat_resultadoseleccion AS rs
				INNER JOIN mod_seleccion.dat_candidato AS dc ON (rs.idcandidato = dc.idcandidato)
				WHERE
				  dc.idproceso = $idproceso
				  AND rs.seleccion = 0
				  AND rs.fseleccion IS NULL";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
	public function totalSeleccionados($idproceso)
	{
		$sql = "SELECT
				  count(dc.idcandidato)
				FROM
				  mod_seleccion.dat_resultadoseleccion AS rs
				INNER JOIN mod_seleccion.dat_candidato AS dc ON (rs.idcandidato = dc.idcandidato)
				WHERE
				  dc.idproceso = $idproceso
				  AND rs.seleccion = 1
				  AND rs.fseleccion IS NOT NULL";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
	public function getIdByCandidato($idcandidato) {
		$sql = "SELECT
					srs.idresultadoseleccion
				FROM
					mod_seleccion.dat_resultadoseleccion AS srs
				WHERE
					srs.idcandidato = $idcandidato";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}

    public function getCandidatosSeleccionadosByUbicacion($start = 0, $limit = 15, $ubicaciones, $idcargo, $numid, $nombre, $papel, $sapel)
    {
        $sql = "SELECT
  	                DISTINCT dc.idcandidato, dc.idpersona, rs.idresultadoseleccion, rs.ubicacion, dc.observacion, dp.nombre, dp.snombre, dp.papel, dp.sapel, ddi.numero as numid
					, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreyapellidos
				FROM
				  mod_seleccion.dat_resultadoseleccion AS rs
				INNER JOIN mod_seleccion.dat_resultadotecnica AS rt ON (rs.idcandidato = rt.idcandidato)
				INNER JOIN mod_seleccion.dat_procesotecnica AS pt ON (pt.idprocesotecnica = rt.idprocesotecnica)
				INNER JOIN mod_seleccion.dat_proceso AS p ON (pt.idproceso = p.idproceso)
				INNER JOIN mod_seleccion.dat_candidato AS dc ON (rs.idcandidato = dc.idcandidato)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona AND dc.contratado = 0)
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                                             AND  ddi.principal = 1
                                                             AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
				WHERE rs.seleccion = 1 AND p.contratar = 1
				  AND dc.fhasta IS NULL AND dp.feliminado IS NULL
				 ";
        if ($numid) {
            $sql = $sql." AND ddi.numero ILIKE '%$numid%'";
        }
        if ($nombre) {
            $sql = $sql." AND dp.nombre ILIKE '%$nombre%'";
        }
        if ($papel) {
            $sql = $sql." AND dp.papel ILIKE '%$papel%'";
        }
        if ($sapel) {
            $sql = $sql." AND dp.sapel ILIKE '%$sapel%'";
        }
        if($ubicaciones) {
            $sql = $sql." AND rs.ubicacion is null OR rs.ubicacion in (".$ubicaciones.")";
        }
        if ($idcargo) {
            $sql = $sql." AND pt.idproceso IN ((SELECT pc.idproceso FROM mod_seleccion.dat_procesocargo pc
																	INNER JOIN mod_rrhhmaestro.conf_espcargo chc ON (chc.idespcargo = pc.idcargo)
																	INNER JOIN mod_estructuracomp.dat_cargo dc ON (chc.idcargo = dc.idnomcargo)
																	WHERE pc.homologo = 1 AND dc.idcargo = $idcargo)UNION ALL
																(SELECT pcargo.idproceso FROM mod_seleccion.dat_procesocargo pcargo
																	INNER JOIN mod_estructuracomp.dat_cargo datc ON (pcargo.idcargo = datc.idnomcargo)
																	WHERE pcargo.homologo = 0 AND datc.idcargo = $idcargo))";
        }
        $sql = $sql." OFFSET $start LIMIT $limit";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function cantCandidatosSeleccionadosByUbicacion($ubicaciones, $idcargo, $numid, $nombre, $papel, $sapel)
    {
        $sql = "SELECT DISTINCT
  	                dc.idcandidato
				FROM
				  mod_seleccion.dat_resultadoseleccion AS rs
				INNER JOIN mod_seleccion.dat_resultadotecnica AS rt ON (rs.idcandidato = rt.idcandidato)
				INNER JOIN mod_seleccion.dat_procesotecnica AS pt ON (pt.idprocesotecnica = rt.idprocesotecnica)
				INNER JOIN mod_seleccion.dat_proceso AS p ON (pt.idproceso = p.idproceso)
				INNER JOIN mod_seleccion.dat_candidato AS dc ON (rs.idcandidato = dc.idcandidato AND dc.contratado = 0)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                                             AND  ddi.principal = 1
                                                             AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
				WHERE rs.seleccion = 1 AND p.contratar = 1
				  AND dc.fhasta IS NULL
				  AND dp.feliminado IS NULL";
        if ($numid) {
            $sql = $sql." AND ddi.numero ILIKE '%$numid%'";
        }
        if ($nombre) {
            $sql = $sql." AND dp.nombre ILIKE '%$nombre%'";
        }
        if ($papel) {
            $sql = $sql." AND dp.papel ILIKE '%$papel%'";
        }
        if ($sapel) {
            $sql = $sql." AND dp.sapel ILIKE '%$sapel%'";
        }
        if($ubicaciones) {
            $sql = $sql." AND rs.ubicacion is null OR rs.ubicacion in (".$ubicaciones.")";
        }
        if ($idcargo) {
            $sql = $sql." AND pt.idproceso IN ((SELECT pc.idproceso FROM mod_seleccion.dat_procesocargo pc
																	INNER JOIN mod_rrhhmaestro.conf_espcargo chc ON (chc.idespcargo = pc.idcargo)
																	INNER JOIN mod_estructuracomp.dat_cargo dc ON (chc.idcargo = dc.idnomcargo)
																	WHERE pc.homologo = 1 AND dc.idcargo = $idcargo)UNION ALL
																(SELECT pcargo.idproceso FROM mod_seleccion.dat_procesocargo pcargo
																	INNER JOIN mod_estructuracomp.dat_cargo datc ON (pcargo.idcargo = datc.idnomcargo)
																	WHERE pcargo.homologo = 0 AND datc.idcargo = $idcargo))";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return count($conn->fetchAll($sql));
    }
}
