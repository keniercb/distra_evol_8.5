<?php
class ConfComptecnica extends BaseConfComptecnica
{
	public function setUp()
    {
        parent :: setUp();
    }
	
	/**
	* Función que devuelve las configuraciones dado un id.
	* @param $id
	*/
	public function getById($id)
    {
        return Doctrine::getTable('ConfComptecnica')->find($id);
    }
	
	/**
	* Función que devuelve los modelos de dado una técnica.
	* @param $idtecnica
	* @return array
	*/
	public function getModeloByTecnica($idtecnica)
	{
		$sql = "SELECT DISTINCT
		            dm.idmodelo
			      , dm.denom AS denominacion
				FROM
				  mod_evaluaciones.dat_evalmodelo AS dm
				INNER JOIN mod_evaluaciones.dat_evalplanillasevaluativas AS dpe ON (dm.idplanilla = dpe.idplanilla)
				INNER JOIN mod_seleccion.conf_tecnica AS ct ON (dpe.idplanilla = ct.idplanilla)
				INNER JOIN mod_seleccion.dat_procesotecnica AS dpt ON (ct.idplanilla = dpt.idtecnica)
				WHERE dm.fechainicio < now() AND (dm.fechafin > now() OR dm.fechafin IS NULL) AND dpt.idtecnica = $idtecnica";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}
	
	/**
	* Función que devuelve los identificadores las tuplas dado una técnica y el modelo.
	*
	* @param $idtecnica Identificador de la técnica
	* @param $idmodelo Identificador del modelo.
	*
	* @return array
	*/
	public function getIdByTecnicaModelo($idtecnica, $idmodelo)
	{
		$sql = "SELECT
		          idcomptecnica
				FROM
				  mod_seleccion.conf_comptecnica AS cct
				WHERE cct.idtecnica = $idtecnica AND cct.idmodelo = $idmodelo";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}
	
	/**
	* Función que devuelve los identificadores de los procesos dado una técnica y el modelo.
	*
	* @param $idtecnica Identificador de la técnica
	* @param $idmodelo Identificador del modelo.
	*
	* @return array
	*/
	public function getIdProcesoByTecnicaModelo($idtecnica, $idmodelo)
	{
		$sql = "SELECT
		          idproceso
				FROM
				  mod_seleccion.conf_comptecnica AS cct
				WHERE cct.idtecnica = $idtecnica AND cct.idmodelo = $idmodelo";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}
	
	/**
	* Función que devuelve los identificadores de los procesos que comparten tecnica con un proceso determinado.
	*
	* @param $idtecnica Identificador de la técnica
	* @param $idmodelo Identificador del modelo.
	*
	* @return array
	*/
	public function getIdProcTecByTecnicaModelo($idproceso, $idtecnica, $idmodelo)
	{
		$sql = "SELECT
		          cct.idproceso
				FROM
				  mod_seleccion.conf_comptecnica cct
				WHERE cct.idproceso = $idproceso AND cct.idtecnica = $idtecnica AND cct.idmodelo = $idmodelo";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		$pro = $cnx->fetchAll($sql);
		if ($pro) {
			$sql = "SELECT
					  cct.idproceso,
					  pt.idprocesotecnica
					FROM
					  mod_seleccion.conf_comptecnica cct
					INNER JOIN mod_seleccion.dat_procesotecnica pt ON (cct.idproceso = pt.idproceso AND
																		pt.idtecnica = $idtecnica AND 
																		pt.idmodelo = $idmodelo)  
					WHERE cct.idproceso <> $idproceso AND cct.idtecnica = $idtecnica AND cct.idmodelo = $idmodelo";
			$dm = Doctrine_Manager::getInstance();
			$cnx = $dm->getCurrentConnection();
			return $cnx->fetchAll($sql);
		} else {
			return Array();
		}		
	}
	
	public function getIdResTecByTecnicaModelo($idprocesotecnica, $idtecnica, $idmodelo)
	{		
		$sql = "SELECT		          
				  distinct r.idresultadotecnica
				FROM
				  mod_seleccion.conf_comptecnica cct
				INNER JOIN mod_seleccion.dat_procesotecnica pt ON (cct.idproceso = pt.idproceso)
				INNER JOIN mod_seleccion.dat_resultadotecnica r ON	(pt.idprocesotecnica=r.idprocesotecnica)
				WHERE pt.idprocesotecnica = $idprocesotecnica AND pt.idtecnica = $idtecnica AND pt.idmodelo = $idmodelo";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		$pro = $cnx->fetchAll($sql);
		if ($pro) {
			$sql = "SELECT		          
				  distinct r.idresultadotecnica
				FROM
				  mod_seleccion.conf_comptecnica cct
				INNER JOIN mod_seleccion.dat_procesotecnica pt ON (cct.idproceso = pt.idproceso)
				INNER JOIN mod_seleccion.dat_resultadotecnica r ON	(pt.idprocesotecnica=r.idprocesotecnica)
				WHERE pt.idprocesotecnica <> $idprocesotecnica AND pt.idtecnica = $idtecnica AND pt.idmodelo = $idmodelo";
			$dm = Doctrine_Manager::getInstance();
			$cnx = $dm->getCurrentConnection();
			return $cnx->fetchAll($sql);
		} else {
			return Array();
		}		
	}
	
	public function getIdIndicByTecnicaModelo($idprocesotecnica, $idtecnica, $idmodelo, $idindicadorplanilla)
	{		
		$sql = "SELECT		          
				  i.idindicadortecnica
				FROM
				  mod_seleccion.conf_comptecnica cct
				INNER JOIN mod_seleccion.dat_procesotecnica pt ON (cct.idproceso = pt.idproceso)
				INNER JOIN mod_seleccion.dat_resultadotecnica r ON	(pt.idprocesotecnica=r.idprocesotecnica)
				INNER JOIN mod_seleccion.dat_indicadortecnica i ON	(i.idresultadotecnica=r.idresultadotecnica)
				WHERE pt.idprocesotecnica = $idprocesotecnica AND pt.idtecnica = $idtecnica AND pt.idmodelo = $idmodelo 
				  AND i.idindicadorplanilla = $idindicadorplanilla";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		$pro = $cnx->fetchAll($sql);
		if ($pro) {
			$sql = "SELECT		          
				  i.idindicadortecnica
				FROM
				  mod_seleccion.conf_comptecnica cct
				INNER JOIN mod_seleccion.dat_procesotecnica pt ON (cct.idproceso = pt.idproceso)
				INNER JOIN mod_seleccion.dat_resultadotecnica r ON	(pt.idprocesotecnica=r.idprocesotecnica)
				INNER JOIN mod_seleccion.dat_indicadortecnica i ON	(i.idresultadotecnica=r.idresultadotecnica)
				WHERE pt.idprocesotecnica <> $idprocesotecnica AND pt.idtecnica = $idtecnica AND pt.idmodelo = $idmodelo 
				  AND i.idindicadorplanilla = $idindicadorplanilla";
			$dm = Doctrine_Manager::getInstance();
			$cnx = $dm->getCurrentConnection();
			return $cnx->fetchAll($sql);
		} else {
			return Array();
		}		
	}
}