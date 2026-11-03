<?php
class ConfTecnica extends BaseConfTecnica
{
	public function setUp()
    {
        parent :: setUp();
    }
	
	/**
	* Función que devuelve todas las planillas evaluativas que pueden ser empleadas como técnica de selección.
	*
	* @return array
	*/
	public function getPlanillaActiva()
	{
		$sql = "SELECT
		          dpe.idplanilla
				, dpe.denom AS denominacion
				, dpe.descripcion
				, dpe.fechainicio AS fdesde
				, dpe.fechafin AS fhasta
				, date_part('day',dpe.fechafin - now()) AS cantd
				FROM
				mod_evaluaciones.dat_evalplanillasevaluativas AS dpe
				WHERE dpe.idestado = 1 AND ((dpe.fechafin > now()) OR (dpe.fechafin IS NULL))
				AND dpe.idplanilla NOT IN (SELECT ct.idplanilla FROM mod_seleccion.conf_tecnica AS ct)";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}
	
	/**
	* Función que devuelve todas las planillas evaluativas que son empleadas como técnicas de selección.
	*
	* @return array
	*/
	public function getTecnica()
	{
		$sql = "SELECT
		          ct.idtecnica
				, dpe.idplanilla
				, dpe.denom AS denominacion
				, dpe.descripcion
				, dpe.fechainicio AS fdesde
				, dpe.fechafin AS fhasta
				, date_part('day',dpe.fechafin - now()) AS cantd
				FROM
				  mod_seleccion.conf_tecnica AS ct
				INNER JOIN mod_evaluaciones.dat_evalplanillasevaluativas AS dpe ON (dpe.idplanilla = ct.idplanilla)
				WHERE dpe.idestado = 1 AND ((dpe.fechafin > now()) OR (dpe.fechafin IS NULL))";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}
	
	public function getTecnicaNoProceso($idproceso)
	{
		$sql = "SELECT
		          ct.idtecnica
				, dpe.idplanilla
				, dpe.denom AS denominacion
				FROM
				  mod_seleccion.conf_tecnica AS ct
				INNER JOIN mod_evaluaciones.dat_evalplanillasevaluativas AS dpe ON (dpe.idplanilla = ct.idplanilla)
				WHERE dpe.idestado = 1 AND ((dpe.fechafin > now()) OR (dpe.fechafin IS NULL)) 
				AND dpe.idplanilla NOT IN (SELECT
											  ct.idtecnica as idplanilla
											FROM
											  mod_seleccion.dat_procesotecnica AS ct
											WHERE ct.idproceso = $idproceso)";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}
	
	/**
	* Función que devuelve todas las planillas evaluativas que no tienen vigencia y estan siendo usadas en selección.
	*
	* @return array
	*/
	public function getPlanillaNoActiva()
	{
		$sql = "SELECT
		          ct.idtecnica
				, dpe.idplanilla
				, dpe.denom AS denominacion
				, dpe.descripcion
				, dpe.fechainicio AS fdesde
				, dpe.fechafin AS fhasta
				, date_part('day',dpe.fechafin - now()) AS cantd
				FROM
				  mod_seleccion.conf_tecnica AS ct
				INNER JOIN mod_evaluaciones.dat_evalplanillasevaluativas AS dpe ON (dpe.idplanilla = ct.idplanilla)
				WHERE dpe.idestado != 1 OR ((dpe.fechafin < now()))";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}
	
	/**
	* Función que devuelve la técnica de selección que posee este idtecnica.
	*
	* @return idtecnica
	*/
	public function getById($idtecnica)
	{
		return Doctrine::getTable('ConfTecnica')->find($idtecnica);
	}
	
	/**
	* Función que devuelve los valores de una escala numerica.
	*
	* @return $idescala
	*/
	public function getValorEscalaNumerica($idescala)
	{
		$sql = "SELECT
		          idvaloresnumericos as id
				, de.idescala  
				, nvn.denom AS denominacion
				FROM
				  mod_evaluaciones.nom_evalvaloresnumericos AS nvn
				INNER JOIN mod_evaluaciones.dat_evalescalarangonumerico AS drn ON (nvn.idescalarangonumerico = drn.idescalarangonumerico)
				INNER JOIN mod_evaluaciones.dat_evalescala AS de ON (drn.idescala = de.idescala)
				WHERE de.tipoescala = 0 AND de.idescala = $idescala";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}

	/**
	* Función que devuelve los valores de una escala cualitativa.
	*
	* @return $idescala
	*/
	public function getValorEscalaCualitativa($idescala)
	{
		$sql = "SELECT 
                    nvc.idvalorescualitativos as id
				  , de.idescala
				  , nvc.denom AS denominacion
				  , dvc.color
				FROM
				  mod_evaluaciones.nom_evalvalorescualitativos AS nvc
				INNER JOIN mod_evaluaciones.dat_evalescalavalorescualitativos AS dvc ON (nvc.idvalorescualitativos = dvc.idvalorescualitativos)
				INNER JOIN mod_evaluaciones.dat_evalescala AS de ON (dvc.idescala = de.idescala)
				WHERE de.tipoescala = 1 AND de.idescala = $idescala";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}

	/**
	* Función que devuelve el tipo de valores que usa la escala.
	*
	* @return $idescala
	*/
	public function getTipoEscala($idescala)
	{
		$sql = "SELECT
		          de.tipoescala
				FROM
				  mod_evaluaciones.dat_evalescala AS de
				WHERE de.idescala = $idescala";
		$dm = Doctrine_Manager::getInstance();
		$cnx = $dm->getCurrentConnection();
		return $cnx->fetchAll($sql);
	}

    public function activarPlanilla($idplanilla, $fechafin)
    {
        $sql = "UPDATE
				  mod_evaluaciones.dat_evalplanillasevaluativas";
        if ($fechafin) {
            $sql = $sql." SET fechafin = '$fechafin'";
        } else {
            $sql = $sql." SET fechafin = null";
        }
        $sql = $sql." WHERE idplanilla = $idplanilla";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }
}