<?php
class DatCandidato extends BaseDatCandidato
{
	public function setUp()
    {
        parent :: setUp();
		$this->hasMany('DatExcluido', array('local' => 'idcandidato', 'foreign' => 'idcandidato'));
    }
	
	public function getById($idcandidato)
    {
        return Doctrine::getTable('DatCandidato')->find($idcandidato);
    }


	public function getByIdcandidato($idcandidato, $inArray = true)
	{
		try {
			$query = Doctrine_Query::create()->from('DatCandidato')->whereIn(
				'idcandidato', Utiles::reflectArray($idcandidato)
			)->execute();

			return ($inArray) ? $query->toArray() : $query;
		} catch (Doctrine_Exception $e) {
			throw $e;
		}
	}

	public function getCandidatos($idproceso, $start = 0, $limit = 15, $filtro)
	{

		$sql = "SELECT 
  	                dc.idcandidato
                  , dc.idproceso
                  , dc.idprocesoorigen
                  , dc.idpersona
                  , dc.fdesde
                  , dc.observacion
                  , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombre
				  , ddi.numero AS numid
				  , encode(df.foto, 'escape') AS foto
				  , drs.seleccion
				  , nv.denominacion
				  , dc.idviareclutamiento
				  , dpro.denominacion as procesoorigen
				FROM
				  mod_seleccion.dat_candidato AS dc
				LEFT JOIN mod_seleccion.dat_proceso AS dpro ON (dc.idprocesoorigen = dpro.idproceso)
				LEFT JOIN mod_seleccion.nom_viareclutamiento AS nv ON (dc.idviareclutamiento = nv.idviareclutamiento)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                              AND ddi.principal = 1
                                              AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
				LEFT JOIN mod_persona.dat_foto AS df ON (dp.idpersona = df.idpersona
                                     AND df.principal = 1
                                     AND (df.fhasta > now() OR df.fhasta IS NULL))
				LEFT JOIN mod_seleccion.dat_resultadoseleccion AS drs ON (dc.idcandidato = drs.idcandidato)
				WHERE
				  dc.idproceso = $idproceso
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
	
	public function getCantCandidatos($idproceso, $filtro)
	{
		$sql = "SELECT 
  	                dc.idcandidato
				FROM
				  mod_seleccion.dat_candidato AS dc
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ddi ON (dp.idpersona = ddi.idpersona
                                              AND ddi.principal = 1
                                              AND (ddi.fhasta > now() OR ddi.fhasta IS NULL))
				WHERE
				  dc.idproceso = $idproceso
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
	
	public function existeCandidatoProceso($idproceso, $idpersona, $idprocesotecnica)
    {
        $query = new Doctrine_Query (); 
        $result = $query->from('DatCandidato c')
						->where("c.idpersona = '$idpersona' AND c.idproceso = '$idproceso'
						 AND c.idcandidato NOT IN (SELECT e.idcandidato FROM DatExcluido e
										  			WHERE e.freincorporacion IS NULL)
						 AND c.idcandidato not in (SELECT rt.idcandidato FROM DatResultadotecnica rt
						                            WHERE rt.idprocesotecnica = '$idprocesotecnica')")
						->execute();
        $obj = $result->toArray();
		return $obj[0];
    }
	
	public function getExcluidos($idproceso, $start = 0, $limit = 15, $filtro)
	{
		$sql = "SELECT 
					dc.idcandidato
				  , dp.idpersona
				  , di.numero AS numid
				  , CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL) THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL) THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombre
				  , dc.fhasta
				  , de.tipo AS exc_user
				  , de.tipo AS exc_proceso
				  , de.idexcluido
				  , me.denominacion as motivo
				FROM
				  mod_seleccion.dat_candidato AS dc
				INNER JOIN mod_seleccion.dat_excluido AS de ON (dc.idcandidato = de.idcandidato AND de.freincorporacion IS NULL)
				LEFT JOIN mod_seleccion.nom_motivoexclusion AS me ON (me.idmotivoexclusion = de.idmotivoexclusion)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona AND dp.feliminado IS NULL)
				LEFT JOIN mod_persona.dat_docidentidad AS di ON (dp.idpersona = di.idpersona AND di.principal = 1 AND (di.fhasta > now() OR di.fhasta IS NULL))
				WHERE dc.fhasta IS NOT NULL AND idproceso = $idproceso AND dc.contratado = 0";
		if($filtro != null) {
			$f = " AND ((cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%')
                     OR (di.numero ILIKE '%$filtro%')
					 OR (dp.nombre ILIKE '%$filtro%')
					 OR (dp.snombre ILIKE '%$filtro%')
					 OR (dp.papel ILIKE '%$filtro%')
					 OR (dp.sapel ILIKE '%$filtro%'))";
			$sql = $sql.$f;
		}
		$sql = $sql." ORDER BY dc.fhasta DESC OFFSET $start LIMIT $limit";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
	public function getCantExcluidos($idproceso, $filtro)
	{
		$sql = "SELECT 
					dc.idcandidato
				FROM
				  mod_seleccion.dat_candidato AS dc
				INNER JOIN mod_seleccion.dat_excluido AS de ON (dc.idcandidato = de.idcandidato AND de.freincorporacion IS NULL)
				INNER JOIN mod_persona.dat_persona AS dp ON (dc.idpersona = dp.idpersona AND dp.feliminado IS NULL)
				LEFT JOIN mod_persona.dat_docidentidad AS di ON (dp.idpersona = di.idpersona AND di.principal = 1 AND (di.fhasta > now() OR di.fhasta IS NULL))
				WHERE dc.fhasta IS NOT NULL AND idproceso = $idproceso AND dc.contratado = 0";
		if($filtro != null) {
			$f = " AND ((cast(dp.idpersona AS VARCHAR) ILIKE '%$filtro%')
                     OR (di.numero ILIKE '%$filtro%')
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
	
	//Funcion que devuelve todos las personas (id) que son candidatos activos dado un proceso
	public function getIdPersActByProceso($idproceso)
	{
		$sql = "SELECT 
				  dc.idpersona
				FROM 
				  mod_seleccion.dat_candidato AS dc
				WHERE dc.idproceso = $idproceso AND dc.fhasta IS NULL AND dc.contratado = 0
				AND dc.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
	//Función que devuelve todos los candidatos para la recuperación general
	public function getRecCandidato($start, $limit, $filtro = null, $idproceso, $idestado, $personas)
	{
		$sql = "SELECT
					sdc.idcandidato,
					CASE WHEN (pdp.sapel IS NULL AND pdp.snombre IS NULL) THEN pdp.papel || ', ' || pdp.nombre
						 WHEN (pdp.sapel IS NULL AND pdp.snombre IS NOT NULL)
						  THEN pdp.papel || ', ' || pdp.nombre || ' ' || pdp.snombre
						 WHEN (pdp.sapel IS NOT NULL AND pdp.snombre IS NULL)
						  THEN pdp.papel || ' ' || pdp.sapel || ', ' || pdp.nombre
						 ELSE pdp.papel || ' ' || pdp.sapel || ', ' || pdp.nombre || ' ' || pdp.snombre
					END AS nombreyapellidos,
					CASE WHEN (pdp.sapel IS NULL AND pdp.snombre IS NULL AND pdi.numero IS NULL)
							THEN '[No. Registro: ' || pdp.idpersona || ' - No. Identidad: S/N] ' || pdp.papel || ', ' || pdp.nombre
						 WHEN (pdp.sapel IS NOT NULL AND pdp.snombre IS NULL AND pdi.numero IS NULL)
							THEN '[No. Registro: ' || pdp.idpersona || ' - No. Identidad: S/N] ' || pdp.papel || ' ' || pdp.sapel || ', ' || pdp.nombre
						 WHEN (pdp.sapel IS NULL AND pdp.snombre IS NOT NULL AND pdi.numero IS NULL)
							THEN '[No. Registro: ' || pdp.idpersona || ' - No. Identidad: S/N] ' || pdp.papel || ', ' || pdp.nombre || ' ' || pdp.snombre
						 WHEN (pdp.sapel IS NULL AND pdp.snombre IS NULL AND pdi.numero IS NOT NULL)
							THEN '[No. Registro: ' || pdp.idpersona || ' - No. Identidad: ' ||  pdi.numero || '] ' || pdp.papel || ', ' || pdp.nombre
						 WHEN (pdp.sapel IS NOT NULL AND pdp.snombre IS NULL AND pdi.numero IS NOT NULL)
							THEN '[No. Registro: ' || pdp.idpersona || ' - No. Identidad: ' ||  pdi.numero || '] ' || pdp.papel || ' ' || pdp.sapel || ', ' || pdp.nombre
						 WHEN (pdp.sapel IS NOT NULL AND pdp.snombre IS NOT NULL AND pdi.numero IS NULL)
							THEN '[No. Registro: ' || pdp.idpersona || ' - No. Identidad: S/N ] ' || pdp.papel || ' ' || pdp.sapel || ', ' || pdp.nombre || ' ' || pdp.snombre
							ELSE '[No. Registro: ' || pdp.idpersona || ' - No. Identidad: ' ||  pdi.numero || '] ' || pdp.papel || ' ' || pdp.sapel || ', ' || pdp.nombre || ' ' || pdp.snombre
					END AS nombre,
					sdp.denominacion AS proceso,
					sdc.fdesde AS fregistro,
					CASE WHEN de.freincorporacion IS NULL AND de.fexclusion IS NOT NULL THEN 'Excluido'
						 WHEN srs.seleccion = 0 THEN 'Preseleccionado'
						 WHEN srs.seleccion = 1 THEN 'Seleccionado'
					ELSE 'En proceso' END AS estado
				FROM mod_seleccion.dat_candidato sdc
				LEFT JOIN mod_seleccion.dat_excluido AS de ON (sdc.idcandidato = de.idcandidato AND de.freincorporacion IS NULL)
				INNER JOIN mod_persona.dat_persona AS pdp ON (sdc.idpersona = pdp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS pdi ON (pdp.idpersona = pdi.idpersona AND pdi.principal = 1)
				INNER JOIN mod_seleccion.dat_proceso AS sdp ON (sdc.idproceso = sdp.idproceso)
				LEFT JOIN mod_seleccion.dat_resultadoseleccion AS srs ON (sdc.idcandidato = srs.idcandidato)
				WHERE
					pdp.feliminado IS NULL AND sdc.contratado = 0";
		if($filtro != null) {
			$f = " AND ((cast(pdp.idpersona AS VARCHAR) ILIKE '%$filtro%')
                     OR (pdi.numero ILIKE '%$filtro%')
					 OR (pdp.nombre ILIKE '%$filtro%')
					 OR (pdp.snombre ILIKE '%$filtro%')
					 OR (pdp.papel ILIKE '%$filtro%')
					 OR (pdp.sapel ILIKE '%$filtro%'))";
			$sql = $sql.$f;
		}
		if($idproceso != null) {
			$sql = $sql." AND sdp.idproceso = $idproceso";
		}
		if($idestado != null) {
			switch($idestado) {
				case 0  : $sql = $sql." AND srs.seleccion IS NULL AND sdc.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
				case 1  : $sql = $sql." AND srs.seleccion = 0 AND sdc.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
				case 2  : $sql = $sql." AND srs.seleccion = 1 AND sdc.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
				default : $sql = $sql." AND srs.seleccion IS NULL AND sdc.idcandidato IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
			}
		}
		if(count($personas)>0) {
			$sql = $sql." AND pdp.idpersona in (" . implode(',', $personas) . ")";
		}
		$sql = $sql." ORDER BY pdp.idpersona DESC";
		if($start != null && $limit != null) {
			$sql = $sql." OFFSET $start LIMIT $limit";
		}
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}

	public function getCandidatosRe($idproceso, $idestado,$idestructura)
	{
		$sql = "SELECT
					sdc.idcandidato, ( pdp.nombre|| ' ' || pdp.sapel || ' ' ||  pdp.papel ) AS nombre,doc.numero,
					sdp.denominacion AS proceso,sdp.idestructura,sdp.fdesde,sdp.fhasta,sdp.idproceso,
					sdc.fdesde AS fregistro,
					CASE WHEN de.freincorporacion IS NULL AND de.fexclusion IS NOT NULL THEN 'Excluido'
						 WHEN srs.seleccion = 0 THEN 'Preseleccionado'
						 WHEN srs.seleccion = 1 THEN 'Seleccionado'
					ELSE 'En proceso' END AS estado
				FROM mod_seleccion.dat_candidato sdc
				LEFT JOIN mod_seleccion.dat_excluido AS de ON (sdc.idcandidato = de.idcandidato AND de.freincorporacion IS NULL)
				INNER JOIN mod_persona.dat_persona AS pdp ON (sdc.idpersona = pdp.idpersona)
				INNER JOIN mod_persona.dat_docidentidad AS doc ON (doc.idpersona = pdp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS pdi ON (pdp.idpersona = pdi.idpersona AND pdi.principal = 1)
				INNER JOIN mod_seleccion.dat_proceso AS sdp ON (sdc.idproceso = sdp.idproceso)
				LEFT JOIN mod_seleccion.dat_resultadoseleccion AS srs ON (sdc.idcandidato = srs.idcandidato)
				WHERE
					pdp.feliminado IS NULL AND sdc.contratado = 0 and sdp.idestructura=$idestructura";

		if($idproceso != null) {
			$sql = $sql." AND sdp.idproceso = $idproceso";
		}
		if($idestado != null) {
			switch($idestado) {
				case 0  : $sql = $sql." AND srs.seleccion IS NULL AND sdc.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
				case 1  : $sql = $sql." AND srs.seleccion = 0 AND sdc.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
				case 2  : $sql = $sql." AND srs.seleccion = 1 AND sdc.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
				default : $sql = $sql." AND srs.seleccion IS NULL AND sdc.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
			}
		}
		$sql = $sql." ORDER BY 	sdp.idproceso ASC";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
	//Función que devuelve la cantidad de candidatos para la recuperación general
	public function getCantRecCandidato($filtro = null, $idproceso, $idestado, $personas) {
		$sql = "SELECT
					sdc.idcandidato
				FROM mod_seleccion.dat_candidato sdc
				INNER JOIN mod_persona.dat_persona AS pdp ON (sdc.idpersona = pdp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS pdi ON (pdp.idpersona = pdi.idpersona AND pdi.principal = 1)
				INNER JOIN mod_seleccion.dat_proceso AS sdp ON (sdc.idproceso = sdp.idproceso)
				LEFT JOIN mod_seleccion.dat_resultadoseleccion AS srs ON (sdc.idcandidato = srs.idcandidato)
				WHERE
					pdp.feliminado IS NULL AND sdc.contratado = 0";
		if($filtro != null) {
			$f = " AND ((cast(pdp.idpersona AS VARCHAR) ILIKE '%$filtro%')
                     OR (pdi.numero ILIKE '%$filtro%')
					 OR (pdp.nombre ILIKE '%$filtro%')
					 OR (pdp.snombre ILIKE '%$filtro%')
					 OR (pdp.papel ILIKE '%$filtro%')
					 OR (pdp.sapel ILIKE '%$filtro%'))";
			$sql = $sql.$f;
		}
		if($idproceso != null) {
			$sql = $sql." AND sdp.idproceso = $idproceso";
		}
		if($idestado != null) {
			switch($idestado) {
				case 0  : $sql = $sql." AND srs.seleccion IS NULL AND sdc.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
				case 1  : $sql = $sql." AND srs.seleccion = 0 AND sdc.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
				case 2  : $sql = $sql." AND srs.seleccion = 1 AND sdc.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
				default : $sql = $sql." AND srs.seleccion IS NULL AND sdc.idcandidato IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
											WHERE freincorporacion IS NULL)"; break;
			}
		}
		if(count($personas)>0) {
			$sql = $sql." AND pdp.idpersona in (" . implode(',', $personas) . ")";
		}
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return count($conn->fetchAll($sql));
	}
	
	//Función que devuelve los datos (Personales y del proceso) de un candidato dado el id.
	public function getDatosRecById($idcandidato) {
		$sql = "SELECT
					sdc.idcandidato,
					sdc.idpersona,
					pdp.sexo,
					-- Datos personales
					CASE WHEN (pdp.sapel IS NULL AND pdp.snombre IS NULL)
							THEN pdp.papel || ', ' || pdp.nombre
						 WHEN (pdp.sapel IS NULL AND pdp.snombre IS NOT NULL)
							THEN pdp.papel || ', ' || pdp.nombre || ' ' || pdp.snombre
						 WHEN (pdp.sapel IS NOT NULL AND pdp.snombre IS NULL)
							THEN pdp.papel || ' ' || pdp.sapel || ', ' || pdp.nombre
							ELSE pdp.papel || ' ' || pdp.sapel || ', ' || pdp.nombre || ' ' || pdp.snombre
					END AS nombre,
					pdi.numero AS numid,
					encode(pdf.foto, 'escape') AS foto,
					-- Estado
					CASE WHEN de.freincorporacion IS NULL AND de.fexclusion IS NOT NULL THEN 'Excluido'
						 WHEN srs.seleccion = 0 THEN 'Preseleccionado'
						 WHEN srs.seleccion = 1 THEN 'Seleccionado'
						 ELSE 'En proceso' END AS estado,
					-- Fechas
					sdc.fdesde AS fregistro,
					srs.faplicacion AS fpreseleccion,
					srs.fseleccion,
					de.fexclusion AS fexcluido,
					sdp.denominacion AS proceso
				FROM mod_seleccion.dat_candidato sdc
				LEFT JOIN mod_seleccion.dat_excluido AS de ON (sdc.idcandidato = de.idcandidato AND de.freincorporacion IS NULL)
				INNER JOIN mod_persona.dat_persona AS pdp ON (sdc.idpersona = pdp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS pdi ON (pdp.idpersona = pdi.idpersona AND pdi.principal = 1)
				LEFT JOIN mod_persona.dat_foto AS pdf ON (pdp.idpersona = pdf.idpersona AND pdf.principal = 1)
				INNER JOIN mod_seleccion.dat_proceso AS sdp ON (sdc.idproceso = sdp.idproceso)
				LEFT JOIN mod_seleccion.dat_resultadoseleccion AS srs ON (sdc.idcandidato = srs.idcandidato)
				WHERE
					pdp.feliminado IS NULL AND sdc.idcandidato = $idcandidato AND sdc.contratado = 0";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
	public function existePersCdtoActivo($idproceso, $idpersona)
    {
		$sql = "SELECT c.*
				FROM mod_seleccion.dat_candidato AS c
				WHERE c.idpersona = '$idpersona' AND c.idproceso = '$idproceso' AND c.contratado = 0
				AND c.idcandidato NOT IN (SELECT idcandidato FROM mod_seleccion.dat_excluido
										  WHERE freincorporacion IS NULL)";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return count($conn->fetchAll($sql));
    }

	public function getProcesosByPersona($idpersona)
	{
		$sql = "SELECT
  	                dc.*
				  , nv.denominacion as denomvia
				  , dpro.denominacion as denomproceso
				FROM
				  mod_seleccion.dat_candidato AS dc
				LEFT JOIN mod_seleccion.dat_proceso AS dpro ON (dc.idproceso = dpro.idproceso)
				LEFT JOIN mod_seleccion.nom_viareclutamiento AS nv ON (dc.idviareclutamiento = nv.idviareclutamiento)
				WHERE
				  dc.idpersona = $idpersona";
					$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}

	public function delProcesoActivo(array $idRow, $idPersona)
	{
		try {
			if (count($idRow) > 0) {
				$query = Doctrine_Query::create()->delete('DatCandidato')->whereIn('idcandidato', $idRow);
				if ($idPersona) {
					$query->andWhere('idpersona = ?', $idPersona);
				}
				$query->execute();
			}
		} catch (Doctrine_Exception $e) {
			throw $e;
		}
	}
}
