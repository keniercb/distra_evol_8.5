<?php
class DatProceso extends BaseDatProceso
{
	public function setUp()
    {
        parent :: setUp();
        $this->hasMany('DatProcesocargo', array('local' => 'idproceso', 'foreign' => 'idproceso'));
    }	
	
	/**
	 * Función para obtener un objeto proceso dado su id
	 * @param $idproceso Identificador del objeto del proceso.
	 * @return 
	**/
	public function getById($idproceso)
    {
        return Doctrine::getTable('DatProceso')->find($idproceso);
    }
	
	public function getProcesos($limite = 15,$inicio = 0, $denom, $cargo, $estructuras)
	{
        $idcargo = $cargo->idcargo;
        $esp = $cargo->especializacion;
		$query = new Doctrine_Query (); 
        $result = $query->select("p.*, date_part('day',p.fhasta - now()) AS cantd")
                        ->from('DatProceso p')
                        ->leftJoin('p.DatProcesocargo pc')
                        ->orderBy('p.denominacion ASC')
						->limit($limite)
						->offset($inicio);
        if ($denom != '') {
            $query->addWhere("p.denominacion ilike '%$denom%'");
        }
        if ($idcargo != '') {
            $query->addWhere("pc.idcargo = '$idcargo' and pc.homologo = '$esp'");
        }
        if ($estructuras) {
            $query->whereIn('p.idestructura',$estructuras);
        }
        return $result->execute()->toArray();
	}


    public function getProcesosById($idproceso,$limite = 15,$inicio = 0)
    {
        $query = new Doctrine_Query ();
        $result = $query->select("p.*, date_part('day',p.fhasta - now()) AS cantd")
            ->from('DatProceso p')
            ->orderBy('p.denominacion ASC')
            ->limit($limite)
            ->offset($inicio);
        if ($idproceso != '') {
            $query->addWhere("p.idproceso = '$idproceso'");
        }
        return $result->execute()->toArray();
    }


    public function cantProcesos($denom, $cargo, $estructuras)
	{
        $idcargo = $cargo->idcargo;
        $esp = $cargo->especializacion;
		$query = new Doctrine_Query (); 
        $result = $query->from('DatProceso p')
                        ->leftJoin('p.DatProcesocargo pc');
        if ($denom != '') {
            $query->addWhere("p.denominacion ilike '%$denom%'");
        }
        if ($idcargo != '') {
            $query->addWhere("pc.idcargo = '$idcargo' and pc.homologo = '$esp'");
        }
        if ($estructuras) {
            $query->whereIn('p.idestructura',$estructuras);
        }
        return count($result->execute()->toArray());
	}
	
	public function getCargos($filtro)
    {
        if ($filtro == '') {
            $sql = "(SELECT nc.idnomcargo AS idcargo, nc.denominacion as denominacion, 0 AS especializacion
				 FROM mod_estructuracomp.nom_cargo AS nc INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (nc.idnomcargo = dc.idnomcargo))
				UNION
				(SELECT ch.idespcargo AS idcargo, ch.denominacion as denominacion, 1 AS especializacion
				 FROM mod_rrhhmaestro.conf_espcargo AS ch) ORDER BY denominacion ASC";
        } else {
            $sql = "(SELECT nc.idnomcargo AS idcargo, nc.denominacion as denominacion, 0 AS especializacion
				 FROM mod_estructuracomp.nom_cargo AS nc INNER JOIN mod_estructuracomp.dat_cargo AS dc ON (nc.idnomcargo = dc.idnomcargo)
				 WHERE nc.denominacion ILIKE '%$filtro%')
				UNION
				(SELECT ch.idespcargo AS idcargo, ch.denominacion as denominacion, 1 AS especializacion
				 FROM mod_rrhhmaestro.conf_espcargo AS ch WHERE ch.denominacion ILIKE '%$filtro%') ORDER BY denominacion ASC";
        }

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);        //print_r($sql);die;
        return $result; 
    }
	
	/**
	 * Función para obtener los modelos de una planillas.
	 * @param idplanilla: Identificador de la planilla.
	 * @return array
	**/
	public function getModeloByPlanilla($idplanilla)
    {    
		$sql = "SELECT
		          dm.idmodelo
				, dm.denom AS denominacion
				, dm.descripcion
				, dm.fechainicio AS fdesde
				, dm.fechafin AS fhasta
				, dm.idplanilla
				, dm.idescala
			    FROM
				  mod_evaluaciones.dat_evalmodelo AS dm
				WHERE dm.idplanilla = $idplanilla;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);
        return $result; 
    }
	
	public function getDataGrafica($idproceso)
	{
		$sql = "SELECT
					-- TOTAL DE EXCLUIDOS
					(SELECT
					  count(dc1.idcandidato)
					 FROM
					  mod_seleccion.dat_candidato AS dc1
					 INNER JOIN mod_seleccion.dat_excluido AS de1 ON (dc1.idcandidato = de1.idcandidato AND de1.freincorporacion IS NULL)
					 WHERE (de1.tipo = 1 OR de1.tipo = 2) AND dc1.idproceso = $idproceso) AS total_excluido,
					-- EXCLUIDOS POR USUARIO
					(SELECT
					  count(dc2.idcandidato)
					 FROM
					  mod_seleccion.dat_candidato AS dc2
					 INNER JOIN mod_seleccion.dat_excluido AS de2 ON (dc2.idcandidato = de2.idcandidato AND de2.freincorporacion IS NULL)
					 WHERE de2.tipo = 2 AND dc2.idproceso = $idproceso) AS excluido_usuario,
					-- EXCLUIDOS POR PROCESO
					(SELECT
					  count(dc3.idcandidato)
					 FROM
					  mod_seleccion.dat_candidato as dc3
					 INNER JOIN mod_seleccion.dat_excluido AS de3 ON (dc3.idcandidato = de3.idcandidato AND de3.freincorporacion IS NULL)
					 WHERE de3.tipo = 1 AND dc3.idproceso = $idproceso) AS excluido_proceso,
					-- TOTAL EN PROCESO
					(SELECT
					  count(dc4.idcandidato)
					 FROM
					  mod_seleccion.dat_candidato as dc4
					 WHERE dc4.idproceso = $idproceso AND dc4.contratado = 0
					  AND dc4.idcandidato NOT IN (SELECT de4.idcandidato FROM mod_seleccion.dat_excluido as de4
					                              WHERE de4.freincorporacion IS NULL)
					  AND dc4.idcandidato NOT IN (SELECT rs4.idcandidato FROM mod_seleccion.dat_resultadoseleccion AS rs4)) AS total_en_proceso,
					-- TOTAL PRESELECCIONADO
					(SELECT
					   count(dc5.idcandidato)
					 FROM
					   mod_seleccion.dat_resultadoseleccion AS rs5
					 INNER JOIN mod_seleccion.dat_candidato AS dc5 ON (rs5.idcandidato = dc5.idcandidato AND dc5.contratado = 0)
					 WHERE dc5.idproceso = $idproceso AND rs5.seleccion = 0 AND rs5.fseleccion IS NULL) AS total_preseleccionado,
					-- TOTAL SELECCIONADO
					(SELECT
					   count(dc6.idcandidato)
					 FROM
					   mod_seleccion.dat_resultadoseleccion AS rs6
					 INNER JOIN mod_seleccion.dat_candidato AS dc6 ON (rs6.idcandidato = dc6.idcandidato AND dc6.contratado = 0)
					 WHERE dc6.idproceso = $idproceso AND rs6.seleccion = 1 AND rs6.fseleccion IS NOT NULL) AS total_seleccionado
				FROM mod_seleccion.dat_proceso AS dp
				WHERE dp.idproceso = $idproceso";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}

    public function getPlanillaNoActiva($idproceso)
    {
        $sql = "SELECT
		          pt.idproceso
				FROM
				  mod_seleccion.dat_procesotecnica AS pt
				INNER JOIN mod_seleccion.conf_tecnica AS ct ON (pt.idtecnica = ct.idplanilla)
				INNER JOIN mod_evaluaciones.dat_evalplanillasevaluativas AS dpe ON (dpe.idplanilla = ct.idplanilla)
				WHERE pt.idproceso = $idproceso AND dpe.fechafin < now()";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }

    public function getPersonaMiembroComiteProceso($idproceso, $idpersona)
    {
        $sql = "SELECT d.idpersona
                FROM mod_rrhhmaestro.dat_comisionmiembro d
                INNER JOIN mod_seleccion.dat_procesocomite pc ON (d.idcomision = pc.idcomision)
                WHERE pc.idproceso = $idproceso AND d.idpersona = $idpersona";
        $dm = Doctrine_Manager::getInstance();
        $cnx = $dm->getCurrentConnection();
        return $cnx->fetchAll($sql);
    }
	
	//Funcion que devuelve los datos para construir la gráfica
	public function getDatosGrafica() {
		$sql = "SELECT
		          sdp.denominacion,
                  (SELECT count(de1.idcandidato)
                  FROM mod_seleccion.dat_excluido AS de1
                  INNER JOIN mod_seleccion.dat_candidato AS dc1 ON (de1.idcandidato = dc1.idcandidato AND dc1.idproceso = sdp.idproceso)
                  WHERE de1.freincorporacion IS NULL) AS excluido,
                  (SELECT count(sdc_2.idcandidato)
                  FROM mod_seleccion.dat_candidato AS sdc_2
                  INNER JOIN mod_seleccion.dat_proceso AS sdp_2 ON (sdc_2.idproceso = sdp_2.idproceso)
                  LEFT JOIN mod_seleccion.dat_resultadoseleccion AS srs_2 ON (sdc_2.idcandidato = srs_2.idcandidato)
                  WHERE sdp_2.idproceso = sdp.idproceso
                  AND sdc_2.idcandidato NOT IN (SELECT de2.idcandidato FROM mod_seleccion.dat_excluido AS de2 WHERE de2.freincorporacion IS NULL)
                  AND srs_2.seleccion = 0) AS preseleccionado,
                  (SELECT count(sdc_2.idcandidato)
                  FROM mod_seleccion.dat_candidato AS sdc_2
                  INNER JOIN mod_seleccion.dat_proceso AS sdp_2 ON (sdc_2.idproceso = sdp_2.idproceso)
                  LEFT JOIN mod_seleccion.dat_resultadoseleccion AS srs_2 ON (sdc_2.idcandidato = srs_2.idcandidato)
                  WHERE sdp_2.idproceso = sdp.idproceso AND sdc_2.idcandidato NOT IN (SELECT de3.idcandidato FROM mod_seleccion.dat_excluido AS de3 WHERE de3.freincorporacion IS NULL)
                  AND srs_2.seleccion = 1) AS seleccionado,
                  (SELECT count(sdc_2.idcandidato)
                  FROM mod_seleccion.dat_candidato AS sdc_2
                  INNER JOIN mod_seleccion.dat_proceso AS sdp_2 ON (sdc_2.idproceso = sdp_2.idproceso)
                  LEFT JOIN mod_seleccion.dat_resultadoseleccion AS srs_2 ON (sdc_2.idcandidato = srs_2.idcandidato)
                  WHERE sdp_2.idproceso = sdp.idproceso AND sdc_2.idcandidato NOT IN (SELECT de4.idcandidato FROM mod_seleccion.dat_excluido AS de4 WHERE de4.freincorporacion IS NULL) AND srs_2.seleccion IS NULL) AS proceso
              FROM mod_seleccion.dat_proceso AS sdp
              WHERE sdp.fhasta IS NULL OR sdp.fhasta < now()
              ORDER BY sdp.denominacion";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
	//Función que devuelve los procesos de selección activos
	public function getProcesoActivo()
	{
		$query = new Doctrine_Query(); 
        $result = $query->select("p.idproceso, p.denominacion")
                        ->from('DatProceso p')
						->execute(); 
        return $result->toArray(); 
	}

    //Función que devuelve los procesos de selección activos
    public function getProcesoByEstructuraCargos($idestructura, $arrayCargos, $idprocesoactual)
    {
        $query = new Doctrine_Query();
        $result = $query->select("p.*, p.idestructura as identidad")
            ->from('DatProceso p')
            ->innerJoin('p.DatProcesocargo dpc')
            ->where("p.idestructura = '$idestructura' AND (p.fdesde <= now() AND (p.fhasta is null OR p.fhasta > now()))");
        if (count($arrayCargos)>0) {
            $query->whereIn('dpc.idcargo',$arrayCargos);
        }
        if (!empty($idprocesoactual)) {
            $query->addwhere("p.idproceso <> '$idprocesoactual'");
        }
        return $result->fetchArray();
    }

    public function getCompetenciasCargo($cargos, $especializaciones)
    {
        $mg   = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if (count($cargos) > 0) {
            $sql  = " SELECT DISTINCT nc.denominacion AS competencia, nc.idcompetencia
                  FROM mod_competencia.dat_competencia dc
                  INNER JOIN mod_competencia.dat_competenciacargo dcc ON (dcc.iddcompetencia  = dc.iddcompetencia)
                  INNER JOIN mod_competencia.nom_competencia nc ON (nc.idcompetencia = dc.idcompetencia)
                  INNER JOIN mod_estructuracomp.dat_cargo dcargo ON (dcc.idcargo  = dcargo.idcargo)
                  INNER JOIN mod_estructuracomp.nom_cargo ncargo ON (ncargo .idnomcargo  = dcargo.idnomcargo)
                  WHERE ncargo.idnomcargo in (" . implode(',', $cargos) . ")
                  ORDER BY nc.denominacion ASC";
            $competenciasCargo = $conn->fetchAll($sql);
        }
        if (count($especializaciones) > 0) {
            $sql  = " SELECT DISTINCT nc.denominacion AS competencia, nc.idcompetencia
                  FROM mod_competencia.dat_competencia dc
                  INNER JOIN mod_competencia.dat_competenciacargo dcc ON (dcc.iddcompetencia  = dc.iddcompetencia)
                  INNER JOIN mod_competencia.nom_competencia nc ON (nc.idcompetencia = dc.idcompetencia)
                  INNER JOIN mod_estructuracomp.dat_cargo dcargo ON (dcc.idcargo  = dcargo.idcargo)
                  INNER JOIN mod_estructuracomp.nom_cargo ncargo ON (ncargo .idnomcargo  = dcargo.idnomcargo)
                  INNER JOIN mod_rrhhmaestro.conf_espcargo esp ON (ncargo .idnomcargo  = esp.idcargo)
                  WHERE esp.idespcargo in (" . implode(',', $especializaciones) . ")
                  ORDER BY nc.denominacion ASC";
            $competenciasEsp = $conn->fetchAll($sql);
            $res = array_merge($competenciasCargo, $competenciasEsp);
            return $res;
        } else {
            return $competenciasCargo;
        }
    }
}
