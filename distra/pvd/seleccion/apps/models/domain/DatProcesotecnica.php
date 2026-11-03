<?php
class DatProcesotecnica extends BaseDatProcesotecnica
{
	public function setUp()
    {
        parent :: setUp();
    }	
	
	
	public function getById($idprocesotecnica)
    {
        return Doctrine::getTable('DatProcesotecnica')->find($idprocesotecnica);
    }
	
	/**
	* Función para obtener las tecnicas de selección dado un proceso.
	* @param idproceso
	* @return array
	*/
	public function getTecnicaByProceso($idproceso) {
		$sql = "SELECT
		          pt.idprocesotecnica
				, pt.idproceso
				, pt.idtecnica
				, dpe.denom AS planilla
				, dm.idmodelo
				, dm.denom AS modelomatematico
				, dm.idescala
				, pt.validez
				, pt.unidadtiempo as unidad
				, pt.hito
				, pt.fdesde
				, pt.fhasta
				, pt.condicion
				, pt.valor
				, pt.orden
				, date_part('day',pt.fhasta - now()) AS cantd
				FROM
				  mod_seleccion.dat_procesotecnica AS pt
				INNER JOIN mod_seleccion.conf_tecnica AS ct ON (pt.idtecnica = ct.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalplanillasevaluativas AS dpe ON (dpe.idplanilla = ct.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalmodelo AS dm ON (dpe.idplanilla = dm.idplanilla)
				WHERE pt.idmodelo = dm.idmodelo AND pt.idproceso = $idproceso ORDER BY pt.orden";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}

    public function getTecnicaExpiradasByProceso($idproceso) {
        $sql = "SELECT
		          pt.idprocesotecnica
				FROM
				  mod_seleccion.dat_procesotecnica AS pt
				WHERE pt.idproceso = $idproceso and pt.fhasta < now()";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }
	
	public function getOrdenMaximo($idproceso) {
		$sql = "SELECT
		        MAX(pt.orden) AS ordenmaximo
				FROM mod_seleccion.dat_procesotecnica AS pt
				WHERE pt.idproceso = $idproceso";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}
	
	/**
	* Función que devuelve los procesos de dado una técnica y un modelo.
	*
	* @param $tecnica   Identificador de la técnica de selección.
	* @param $idmodelo  Identificador del modelo de la técnica de selección.
	* @param $start     Número inicial de la tupla a obtener.
	* @param $limit     Límite de tuplas a obtener en la consulta.
	*
	* @return array
	*/
	public function getProcesoByTecnicaModelo($tecnica, $idmodelo, $start, $limit) {
		$sql = "SELECT
		            dp. idproceso
				  , dp.denominacion
				  , dp.recurso
				  , dp.fdesde
				  , dp.fhasta
				FROM
				  mod_seleccion.dat_proceso AS dp
				INNER JOIN mod_seleccion.dat_procesotecnica AS dpt ON (dp.idproceso = dpt.idproceso)
				WHERE dpt.idtecnica = $tecnica AND dpt.idmodelo = $idmodelo
				OFFSET $start LIMIT $limit";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}
	
	/**
	* Función que devuelve la cantidad de procesos de dado una técnica y un modelo.
	*
	* @param $tecnica   Identificador de la técnica de selección.
	* @param $idmodelo  Identificador del modelo de la técnica de selección.
	*
	* @return integer
	*/
	public function getCantProcesoByTecnicaModelo($tecnica, $idmodelo) {
		$sql = "SELECT
		            dp. idproceso
				FROM
				  mod_seleccion.dat_proceso AS dp
				INNER JOIN mod_seleccion.dat_procesotecnica AS dpt ON (dp.idproceso = dpt.idproceso)
				WHERE dpt.idtecnica = $tecnica AND dpt.idmodelo = $idmodelo";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return count($cnx->fetchAll($sql));
	}
	
	public function getTecnicaById($idprocesotecnica)
    {
        $query = new Doctrine_Query (); 
        $result = $query->from('DatProcesotecnica p')
						->where("p.idprocesotecnica = '$idprocesotecnica'")
						->execute(); 
        $obj = $result->toArray(); 
		return $obj[0];
    }
	
	public function getEscalaByProcTec($idprocesotecnica) 
	{
		$sql = "SELECT 
					ee.*
				FROM
					mod_seleccion.dat_procesotecnica AS pt
				INNER JOIN mod_seleccion.conf_tecnica AS ct ON (pt.idtecnica = ct.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalplanillasevaluativas AS dpe ON (dpe.idplanilla = ct.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalmodelo AS dm ON (dpe.idplanilla = dm.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalescala AS ee ON (dm.idescala = ee.idescala)
				WHERE pt.idmodelo = dm.idmodelo and pt.idprocesotecnica = $idprocesotecnica";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return count($cnx->fetchAll($sql));
	}
	
	public function getTipoEscalaByProcTec($idprocesotecnica) 
	{
		$sql = "SELECT 
					ee.tipoescala
				FROM
					mod_seleccion.dat_procesotecnica AS pt
				INNER JOIN mod_seleccion.conf_tecnica AS ct ON (pt.idtecnica = ct.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalplanillasevaluativas AS dpe ON (dpe.idplanilla = ct.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalmodelo AS dm ON (dpe.idplanilla = dm.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalescala AS ee ON (dm.idescala = ee.idescala)
				WHERE pt.idmodelo = dm.idmodelo and pt.idprocesotecnica = $idprocesotecnica";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}

    public function tienePlanillaNoActiva($idprocesotecnica)
    {
        $sql = "SELECT
		          pt.idprocesotecnica
				FROM
				  mod_seleccion.dat_procesotecnica AS pt
				INNER JOIN mod_seleccion.conf_tecnica AS ct ON (pt.idtecnica = ct.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalplanillasevaluativas AS dpe ON (dpe.idplanilla = ct.idplanilla)
				WHERE pt.idprocesotecnica = $idprocesotecnica AND dpe.fechafin < now()";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        $result = $cnx->fetchAll($sql);
        $r = ($result)?1:0;
        return $r;
    }
}