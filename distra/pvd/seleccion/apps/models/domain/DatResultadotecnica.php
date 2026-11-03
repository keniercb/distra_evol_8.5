<?php
class DatResultadotecnica extends BaseDatResultadotecnica
{
	public function setUp()
    {
        parent :: setUp();
    }
	
	public function getById($idresultadotecnica)
    {
        return Doctrine::getTable('DatResultadotecnica')->find($idresultadotecnica);
    }
	
	public function getResultadoById($idresultadotecnica)
    {
        $query = new Doctrine_Query (); 
        $result = $query->from('DatResultadotecnica p')
						->where("p.idresultadotecnica = '$idresultadotecnica'")
						->execute(); 
        $obj = $result->toArray(); 
		return $obj[0];
    }
	
	public function getResultadoByIdproctecnica($idprocesotecnica, $idcandidato)
    {
        $query = new Doctrine_Query (); 
        $result = $query->from('DatResultadotecnica p')
						->where("p.idprocesotecnica = '$idprocesotecnica' and p.idcandidato = '$idcandidato' and p.resultado is not null")
						->execute(); 
        $obj = $result->toArray();
		return $obj;
    }

    public function getResByIdproctecnicaCandTodo($idprocesotecnica, $idcandidato)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatResultadotecnica p')
            ->where("p.idprocesotecnica = '$idprocesotecnica' and p.idcandidato = '$idcandidato'")
            ->execute();
        $obj = $result->toArray();
        return $obj;
    }
	
	public function getProcesoTecById($idresultadotecnica)
    {
        $sql = "SELECT 
  	                t.idmodelo,
					t.idtecnica,
					t.idprocesotecnica,
					t.hito
				FROM
				  mod_seleccion.dat_resultadotecnica AS r
				INNER JOIN mod_seleccion.dat_procesotecnica AS t ON (r.idprocesotecnica = t.idprocesotecnica)
				WHERE r.idresultadotecnica = $idresultadotecnica";
				
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
    }
	
	public function getCandidatos($idproceso, $idprocesotecnica, $start = 0, $limit = 15, $filtro)
	{
		$sql = "SELECT 
  	                dc.idcandidato
				  , dc.idproceso
				  , dc.idpersona
				  , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombre
				  , dc.observacion
				  , case when dp.sexo = 1 then 'Masculino' else 'Femenino' end as sexo
				  , ddi.numero as numid
				  , drt.idprocesotecnica
				  , drt.idresultadotecnica
				  , drt.fdesde
				  , drt.fhasta
				  , drt.resultado
				  , pt.idtecnica as idplanilla
				  , pt.idmodelo
				  , CASE WHEN (drt.fhasta IS NULL AND drt.fdesde IS NOT NULL) THEN date_part('day', now() - drt.fdesde) ELSE NULL END AS plazo
				  , ee.tipoescala
				  , encode(df.foto, 'escape') AS foto
				FROM
				  mod_seleccion.dat_candidato AS dc
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)  				
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                                             AND  ddi.principal = 1
                                                             AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_foto AS df ON (dp.idpersona = df.idpersona
                                                    AND  df.principal = 1
                                                    AND (df.fhasta > now() OR df.fhasta IS NULL))
				LEFT JOIN mod_seleccion.dat_resultadotecnica AS drt ON (dc.idcandidato = drt.idcandidato AND drt.idprocesotecnica = $idprocesotecnica)
                LEFT JOIN mod_seleccion.dat_procesotecnica AS pt ON (pt.idprocesotecnica = drt.idprocesotecnica)
				LEFT JOIN mod_seleccion.conf_tecnica AS ct ON (pt.idtecnica = ct.idplanilla)
                LEFT JOIN mod_evaluaciones.dat_evalmodelo AS em ON (pt.idmodelo = em.idmodelo AND ct.idplanilla = em.idplanilla)
                LEFT JOIN mod_evaluaciones.dat_evalescala AS ee ON (em.idescala = ee.idescala)
			   WHERE
				  dc.idproceso = $idproceso	
				  AND dc.contratado = 0
				  AND dc.fhasta IS NULL
				  AND dp.feliminado IS NULL
				  AND dc.idcandidato NOT IN (SELECT a3_rs.idcandidato FROM mod_seleccion.dat_resultadoseleccion AS a3_rs)";
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
	
	public function getResultado($idresultadotecnica, $tipoescala) {
		if ($tipoescala == 1) {
			$sql = "SELECT
					    vc.denom AS valor
					  , evc.color
					  , evc.idvalorescualitativos AS idvalor
					FROM
					  mod_seleccion.dat_resultadotecnica AS rt
					INNER JOIN mod_seleccion.dat_procesotecnica AS pt ON (rt.idprocesotecnica = pt.idprocesotecnica)
					INNER JOIN mod_seleccion.conf_tecnica AS ct ON (pt.idtecnica = ct.idplanilla)
					INNER JOIN mod_evaluaciones.dat_evalmodelo AS em ON (pt.idmodelo = em.idmodelo AND ct.idplanilla = em.idplanilla)
					INNER JOIN mod_evaluaciones.dat_evalescala AS ee ON (em.idescala = ee.idescala)
					INNER JOIN mod_evaluaciones.dat_evalhecho AS eh ON (pt.idmodelo = eh.idmodelo)
					INNER JOIN mod_evaluaciones.nom_evalvalorescualitativos AS vc ON (eh.idvalorescualitativos = vc.idvalorescualitativos)
					INNER JOIN mod_evaluaciones.dat_evalescalavalorescualitativos AS evc ON (vc.idvalorescualitativos = evc.idvalorescualitativos AND rt.resultado = evc.peso)
					WHERE rt.idresultadotecnica = $idresultadotecnica";
		} else {
			$sql = "SELECT
					    evn.denom AS valor
					  , evc.idvaloresnumericos AS idvalor
					FROM
					  mod_seleccion.dat_resultadotecnica AS rt
					INNER JOIN mod_seleccion.dat_procesotecnica AS pt ON (rt.idprocesotecnica = pt.idprocesotecnica)
					INNER JOIN mod_seleccion.conf_tecnica AS ct ON (pt.idtecnica = ct.idplanilla)
					INNER JOIN mod_evaluaciones.dat_evalmodelo AS em ON (pt.idmodelo = em.idmodelo AND ct.idplanilla = em.idplanilla)
					INNER JOIN mod_evaluaciones.dat_evalescala AS ee ON (em.idescala = ee.idescala)
					INNER JOIN mod_evaluaciones.dat_evalescalarangonumerico AS ern ON (ee.idescala = ern.idescala)
					INNER JOIN mod_evaluaciones.nom_evalvaloresnumericos AS evn ON (ern.idescalarangonumerico = evn.idescalarangonumerico)
					WHERE rt.idresultadotecnica = $idresultadotecnica";
		}
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
	public function getCantCandidatos($idproceso, $filtro)
	{
		$sql = "SELECT 
  	                dc.idcandidato
				FROM
				  mod_seleccion.dat_candidato AS dc
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                                             AND  ddi.principal = 1
                                                             AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
                WHERE
				      dc.idproceso = $idproceso	
					  AND dc.contratado = 0
					  AND dc.fhasta IS NULL
					  AND dp.feliminado IS NULL
					  AND dc.idcandidato NOT IN (SELECT a3_rs.idcandidato FROM mod_seleccion.dat_resultadoseleccion AS a3_rs)";
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
	
	public function getEscalaByIdTecnicaproc($idprocesotecnica)
	{
		$sql = "SELECT 
  	                dm.idescala
				FROM
				  mod_seleccion.dat_procesotecnica AS pt
				INNER JOIN mod_seleccion.conf_tecnica AS ct ON (pt.idtecnica = ct.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalplanillasevaluativas AS dpe ON (dpe.idplanilla = ct.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalmodelo AS dm ON (dpe.idplanilla = dm.idplanilla)
				WHERE pt.idmodelo = dm.idmodelo and pt.idprocesotecnica = $idprocesotecnica";
				
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
	public function getDenomEscalaById($idvalor, $tipoescala)
	{
		if ($tipoescala == 0) {
			$sql = "SELECT
		         nvn.denom AS denominacion
				FROM
				  mod_evaluaciones.nom_evalvaloresnumericos AS nvn
				WHERE idvaloresnumericos = $idvalor";
		} else {
			$sql = "SELECT 
                    nvc.denom AS denominacion
				FROM
				  mod_evaluaciones.nom_evalvalorescualitativos AS nvc
				WHERE idvalorescualitativos = $idvalor";
		}
		
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}	
	
	public function getIndicadoresEvalTextByResultTec($idresultadotecnica)
    {
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT
		            dip.idindicador
                  , case when dit.resultado is null then 0 else dit.resultado end as valor
				FROM
				  mod_seleccion.dat_resultadotecnica AS drt
				INNER JOIN mod_seleccion.dat_procesotecnica AS dpt ON (drt.idprocesotecnica = dpt.idprocesotecnica)
				INNER JOIN mod_evaluaciones.dat_evalmodelo AS dm ON (dpt.idmodelo = dm.idmodelo)
				INNER JOIN mod_seleccion.dat_indicadortecnica dit ON (drt.idresultadotecnica = dit.idresultadotecnica)
				INNER JOIN mod_evaluaciones.dat_evalindicadoresplanilla AS dip ON (dit.idindicadorplanilla = dip.idindicadorplanilla)
				WHERE drt.idresultadotecnica = $idresultadotecnica";
        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }
	
	/**
	 * Función para obtener los candidatos que han finalizado todas las técnicas del proceso.
	 * @param idproceso: Identificador del proceso.
	 * @return array
	**/
	public function getCandidatosConTecnicasFinalizadas($idproceso)
    {    
		$sql = "SELECT DISTINCT
					dc.idcandidato
				  , dp.idpersona
				  , ct.idplanilla
				  , vc.idvalorescualitativos AS resultado
				  , drt.resultado AS valor
				FROM
				  mod_seleccion.dat_candidato dc
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)
				INNER JOIN mod_seleccion.dat_resultadotecnica AS drt ON (dc.idcandidato = drt.idcandidato)
				INNER JOIN mod_seleccion.dat_procesotecnica AS dpt ON (drt.idprocesotecnica = dpt.idprocesotecnica)
				INNER JOIN mod_seleccion.conf_tecnica AS ct ON (dpt.idtecnica = ct.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalmodelo AS em ON (dpt.idmodelo = em.idmodelo AND ct.idplanilla = em.idplanilla)
				LEFT JOIN mod_evaluaciones.dat_evalescala AS ee ON (em.idescala = ee.idescala)
				LEFT JOIN mod_evaluaciones.dat_evalhecho AS eh ON (dpt.idmodelo = eh.idmodelo)
				LEFT JOIN mod_evaluaciones.nom_evalvalorescualitativos AS vc ON (eh.idvalorescualitativos = vc.idvalorescualitativos)
				LEFT JOIN mod_evaluaciones.dat_evalescalavalorescualitativos AS evc ON (vc.idvalorescualitativos = evc.idvalorescualitativos AND drt.resultado = evc.peso)
				WHERE dc.fhasta IS NULL AND dpt.idproceso = $idproceso AND dc.contratado = 0
				  AND (SELECT count(a1_dpt.idtecnica) FROM mod_seleccion.dat_procesotecnica AS a1_dpt WHERE a1_dpt.idproceso = $idproceso)
					= (SELECT count(a2_dc.idcandidato) FROM mod_seleccion.dat_candidato AS a2_dc
					   INNER JOIN mod_persona.dat_persona AS a2_dp ON (a2_dc.idpersona = a2_dp.idpersona)
					   INNER JOIN mod_seleccion.dat_resultadotecnica AS a2_drt ON (a2_dc.idcandidato = a2_drt.idcandidato)
					   INNER JOIN mod_seleccion.dat_procesotecnica AS a2_dpt ON (a2_drt.idprocesotecnica = a2_dpt.idprocesotecnica)
					   WHERE a2_dpt.idproceso = $idproceso AND a2_dc.idcandidato = dc.idcandidato AND a2_drt.fhasta IS NOT NULL)
				  AND dc.idcandidato NOT IN (SELECT a3_rs.idcandidato FROM mod_seleccion.dat_resultadoseleccion AS a3_rs)
				  AND dc.idcandidato NOT IN (SELECT e.idcandidato FROM mod_seleccion.dat_excluido e
											WHERE e.freincorporacion IS NULL)";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);
        return $result; 
    }

    public function getCandidatosResultadoTecnicaNoValido()
    {
        $sql = "SELECT rs.idresultadoseleccion, rt.idresultadotecnica, pt.idprocesotecnica,rt.idcandidato, pt.validez, date_part('day',now() - rt.fhasta) AS cantd
                FROM mod_seleccion.dat_resultadotecnica rt
                INNER JOIN mod_seleccion.dat_procesotecnica pt ON (rt.idprocesotecnica = pt.idprocesotecnica)
                LEFT JOIN mod_seleccion.dat_resultadoseleccion rs ON (rs.idcandidato = rt.idcandidato)
                WHERE date_part('day',now() - rt.fhasta) > pt.validez and rt.resultado is not null";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}
