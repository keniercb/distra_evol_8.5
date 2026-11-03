<?php

class ResumenprocesoevaluativoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getEvaluadosProceso($idperiodoproceso, $idpersonaEvaluador, $query, $limit, $start)
    {
        $objEvaluado = new DatEvalpersonaevaluacion();
        $personas = $objEvaluado->getEvaluadosProceso(
            $idperiodoproceso, $idpersonaEvaluador, $query, $limit, $start
        );

        $idescalaTemp = ''; //Variable temporal para almacenar el idescala
        $valoresEscala = array();
        foreach ($personas as &$persona) {
            if (!empty($persona['idescala'])) {
                if ($idescalaTemp != $persona['idescala']) {
                    $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($persona['idescala']);
                    $idescalaTemp = $persona['idescala'];
                }

                foreach ($valoresEscala as $valorEscala) {
                    if ($valorEscala['valor'] == $persona['valor']) {
                        $persona['evaluacion'] = $valorEscala['denom'];
                        $persona['evalColor'] = $valorEscala['color'];
                        break;
                    }
                }
            }
        }
        $r->datos = $personas;
        $r->cantidad = $objEvaluado->getCantEvaluadosPeriodo($idperiodoproceso, null, $query);

        return $r;
    }

    public function getEvaluadosPersona($idpreprocesoevaluativo, $idpersonaEvaluador)
    {
        $objEvaluado = new DatEvalpersonaevaluacion();
        $personas = $objEvaluado->getEvaluadosPersona($idpreprocesoevaluativo, $idpersonaEvaluador);

        $idescalaTemp = ''; //Variable temporal para almacenar el idescala
        $valoresEscala = array();
        foreach ($personas as &$persona) {
            if (!empty($persona['idescala'])) {
                if ($idescalaTemp != $persona['idescala']) {
                    $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($persona['idescala']);
                    $idescalaTemp = $persona['idescala'];
                }
                foreach ($valoresEscala as $valorEscala) {
                    if ($valorEscala['valor'] == $persona['valor']) {
                        $persona['evaluacion'] = $valorEscala['denom'];
                        $persona['color'] = $valorEscala['color'];
                        break;
                    }
                }
            }
        }
        $r->datos = $personas;

        return $r;
    }

    /**
     * Muestra listado de personas del proceso evaluativo segun parametros
     *
     * @param type $idperiodoproceso
     * @param type $strIdCargo
     * @param type $idestadodesarrollo
     * @param type $noColumna
     * @param type $valorInicial
     * @param type $valorFinal
     * @param type $filter
     */
    public function getEvaluadosPeriodo(
        $idperiodoproceso, $strIdCargo = array(), $limit, $start, $idestadodesarrollo = null, $noColumna = null,
        $valorInicial = null, $valorFinal = null, $filtro = null
    )
    {	    
		 $ids = implode(',', $strIdCargo);

        $sqlnopersona = "SELECT eval.nopersona, eval.idpersonaevaluado
                FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                where eval.idperiodoproceso = {$idperiodoproceso} and (eval.idpersonaevaluador IN ($ids) OR eval.idpersonaevaluado IN ($ids))
                ";
        $resultnopersona = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlnopersona);

        if($resultnopersona[0]['nopersona']==0){
		
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT distinct(pev.idpersonaevaluado) as idpersona,pev.idpersonaevaluacion, pev.estado, pev.valor, pev.idmodelo, pev.idplanilla, pev.idperiodoproceso,
             pev.idpersonaevaluador, nevc.denom AS estadodesarrollo, pev.idescala,
            evc.color AS colorestadodes, pev.idpersonaevaluador as _parent, false as _is_leaf, docid.numero as numid,
            p.nombre, p.snombre, p.papel, p.sapel, p.sexo, sl.idcargo, encode(f.foto,'escape') as foto
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            LEFT JOIN  mod_evaluaciones.dat_evalescalavalorescualitativos evc ON(evc.idescalavalorescualitativos = pev.idestadodesarrollo)
            LEFT JOIN  mod_evaluaciones.nom_evalvalorescualitativos nevc ON(nevc.idvalorescualitativos = evc.idvalorescualitativos)
            INNER JOIN mod_persona.dat_persona p ON(p.idpersona = pev.idpersonaevaluado)
            LEFT JOIN mod_persona.dat_docidentidad docid ON(docid.idpersona = p.idpersona AND docid.principal = 1)
			INNER JOIN mod_persona.dat_personaentidad pe ON(pe.idpersona = p.idpersona and pe.fhasta is null)
            INNER JOIN mod_persona.dat_situacionlaboral sl ON(sl.idpersonaentidad = pe.idpersonaentidad and sl.fhasta is null)
            LEFT JOIN mod_persona.dat_foto f ON(f.idpersona = p.idpersona AND f.principal = 1)
            WHERE pev.idperiodoproceso = {$idperiodoproceso} ";

		if (count($strIdCargo) > 0) {
            $sql .= ' AND ((pev.idpersonaevaluador IN ('.$ids.')) OR (pev.idpersonaevaluado IN ('.$ids.')))';
        }

        //Adiciona filtros en dependencia del tipo de columna
        if (!empty($noColumna)) { //Caso en que hace dblclick en la celda
            if ($idestadodesarrollo) {
                if ($idestadodesarrollo != 'total') {
                    $sql .= " AND pev.idestadodesarrollo={$idestadodesarrollo}";
                }
            } else {
                $sql .= " AND pev.idestadodesarrollo IS NULL";
            }
            if ($noColumna == 3) {
                $sql .= " AND pev.estado=0";
            } //Columna de Evaluados
            else {
                if ($noColumna == 4) {
                    $sql .= " AND pev.estado=1 ";//OR pev.estado=2";
                } //Columna de No evaluados
                else {
                    if ($noColumna == 5) {
                        $sql .= " AND pev.estado=3";
                    } //Columna de personas en desacuerdo con la evaluacion
                    else {
                        if ($noColumna == 6) {
                            $sql .= " AND pev.deacuerdo=2";
                        } //Columna de personas en reclamacion con la evaluacion
                        else {
                            if ($noColumna == 6) {
                                $sql .= " AND pev.estado=2";
                            }
                        }
                    }
                }
            }
        } else {
            if (!empty($valorInicial)) { //Caso en que se selecciona un rango de evaluaciones
                //Caso en que la evaluacion se almacena en resultado
                $sql .= " AND cast(pev.valor AS numeric) >= {$valorInicial} AND
                    cast(pev.valor AS numeric) <= {$valorFinal}";
            }
        }

        if (!empty($filtro)) {
            $sql .= " AND (docid.numero='$filtro' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%'
                    OR p.sapel ILIKE '%$filtro%')";
        }

        $evaluados = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($evaluados as &$evaluado) {
            if (!empty($evaluado['idcargo'])) {
                $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($evaluado['idcargo'],true,true);
                $evaluado['cargo'] = $datosCargo[0]['denominacion'];
            }

            if (empty($evaluado['idescala'])) {
                $evaluado['evaluacion'] = $evaluado['valor'];
            } else {
                $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($evaluado['idescala']);
                foreach ($valoresEscala as $valorEscala) {
                    if ($valorEscala['valor'] == $evaluado['valor']) {
                        $evaluado['evaluacion'] = $valorEscala['denom'];
                        break;
                    }
                }
            }
        }
            return $evaluados;
        }
        else
        {
            $arraypersonacargo = array();
            $evaluados = array();
            foreach($resultnopersona as $r){
                $id = 0;
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null,null,$r['idpersonaevaluado']);
                foreach($persona->data as $p){
                    $arraypersonacargo[$id]['idpersona'] =$p['idpersona'];
                    $id++;
                }

                $strId = '-1';
                foreach ($arraypersonacargo as $cargo) {
                    if ($cargo['idpersona']) {
                        $strId .= ',' . $cargo['idpersona'];
                    }
                }
                $idestructura = $r['idpersonaevaluado'];

                $query = Doctrine_Manager::getInstance();
                $sql = "SELECT pev.idpersonaevaluacion, pev.estado, pev.valor, pev.idmodelo, pev.idplanilla, pev.idperiodoproceso,
            pev.idpersonaevaluado as idpersona, pev.idpersonaevaluador, nevc.denom AS estadodesarrollo, pev.idescala,
            evc.color AS colorestadodes, pev.idpersonaevaluador as _parent, false as _is_leaf
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            LEFT JOIN  mod_evaluaciones.dat_evalescalavalorescualitativos evc ON(evc.idescalavalorescualitativos = pev.idestadodesarrollo)
            LEFT JOIN  mod_evaluaciones.nom_evalvalorescualitativos nevc ON(nevc.idvalorescualitativos = evc.idvalorescualitativos)
            WHERE pev.idperiodoproceso = {$idperiodoproceso} AND (pev.idpersonaevaluador = {$idestructura} OR pev.idpersonaevaluado = {$idestructura} )  ";

                //Adiciona filtros en dependencia del tipo de columna
                if (!empty($noColumna)) { //Caso en que hace dblclick en la celda
                    if ($idestadodesarrollo) {
                        if ($idestadodesarrollo != 'total') {
                            $sql .= " AND pev.idestadodesarrollo={$idestadodesarrollo}";
                        }
                    } else {
                        $sql .= " AND pev.idestadodesarrollo IS NULL";
                    }
                    if ($noColumna == 3) {
                        $sql .= " AND pev.estado=0";
                    } //Columna de Evaluados
                    else {
                        if ($noColumna == 4) {
                            $sql .= " AND pev.estado=1 OR pev.estado=2";
                        } //Columna de No evaluados
                        else {
                            if ($noColumna == 5) {
                                $sql .= " AND pev.estado=3";
                            } //Columna de personas en desacuerdo con la evaluacion
                            else {
                                if ($noColumna == 6) {
                                    $sql .= " AND pev.deacuerdo=1";
                                } //Columna de personas en reclamacion con la evaluacion
                                else {
                                    if ($noColumna == 6) {
                                        $sql .= " AND pev.estado=2";
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (!empty($valorInicial)) { //Caso en que se selecciona un rango de evaluaciones
                        //Caso en que la evaluacion se almacena en resultado
                        $sql .= " AND cast(pev.valor AS numeric) >= {$valorInicial} AND
                    cast(pev.valor AS numeric) <= {$valorFinal}";
                    }
                }

                if (!empty($filtro)) {
                    $sql .= " AND (docid.numero='$filtro' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%'
                    OR p.sapel ILIKE '%$filtro%')";
                }

                $sqlpersona =  "SELECT docid.numero as numid,p.idpersona,
                                 p.nombre, p.snombre, p.papel, p.sapel, p.sexo, sl.idcargo, encode(f.foto,'escape') as foto
                                 FROM mod_persona.dat_persona p
                                 LEFT JOIN mod_persona.dat_docidentidad docid ON(docid.idpersona = p.idpersona AND docid.principal = 1)
                                 INNER JOIN mod_persona.dat_personaentidad pe ON(pe.idpersona = p.idpersona and pe.fhasta is null)
                                 INNER JOIN mod_persona.dat_situacionlaboral sl ON(sl.idpersonaentidad = pe.idpersonaentidad and sl.fhasta is null)
                                 LEFT JOIN mod_persona.dat_foto f ON(f.idpersona = p.idpersona AND f.principal = 1)
                                 WHERE p.idpersona IN ($strId)";

                $evaluados = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

                $personas = $query->getCurrentConnection()->execute($sqlpersona)->fetchAll(PDO::FETCH_ASSOC);

                for($i = 0; $i< count($evaluados) ;$i++){
                    $c = 0;
                    for($a = 0; $a< count($personas) ;$a++){
                        $evaluados[$c]['idpersonaevaluacion'] = $evaluados[$i]['idpersonaevaluacion'];
                        $evaluados[$c]['estado'] = $evaluados[$i]['estado'];
                        $evaluados[$c]['valor'] = $evaluados[$i]['valor'];
                        $evaluados[$c]['idmodelo'] = $evaluados[$i]['idmodelo'];
                        $evaluados[$c]['idplanilla'] = $evaluados[$i]['idplanilla'];
                        $evaluados[$c]['idperiodoproceso'] = $evaluados[$i]['idperiodoproceso'];
                        $evaluados[$c]['idpersona'] = $personas[$a]['idpersona'];
                        $evaluados[$c]['idpersonaevaluador'] = $evaluados[$i]['idpersonaevaluador'];
                        $evaluados[$c]['estadodesarrollo'] = $evaluados[$i]['estadodesarrollo'];
                        $evaluados[$c]['idescala'] = $evaluados[$i]['idescala'];
                        $evaluados[$c]['colorestadodes'] = $evaluados[$i]['colorestadodes'];
                        $evaluados[$c]['_parent'] = $evaluados[$i]['_parent'];
                        $evaluados[$c]['_is_leaf'] = $evaluados[$i]['_is_leaf'];
                        $evaluados[$c]['numid'] = $personas[$a]['numid'];
                        $evaluados[$c]['nombre'] =$personas[$a]['nombre'];
                        $evaluados[$c]['snombre'] = $personas[$a]['snombre'];
                        $evaluados[$c]['papel'] = $personas[$a]['papel'];
                        $evaluados[$c]['sapel'] = $personas[$a]['sapel'];
                        $evaluados[$c]['sexo'] = $personas[$a]['sexo'];
                        $evaluados[$c]['idcargo'] = $personas[$a]['idcargo'];
                        $evaluados[$c]['foto'] = $personas[$a]['foto'];
                        $c++;
                    }
                }

               /* foreach ($evaluados as &$evaluado) {
                    if (!empty($evaluado['idcargo'])) {
                        $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($evaluado['idcargo'],true,true);
                        $evaluado['cargo'] = $datosCargo[0]['denominacion'];
                    }

                    if (empty($evaluado['idescala'])) {
                        $evaluado['evaluacion'] = $evaluado['valor'];
                    } else {
                        $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($evaluado['idescala']);
                        foreach ($valoresEscala as $valorEscala) {
                            if ($valorEscala['valor'] == $evaluado['valor']) {
                                $evaluado['evaluacion'] = $valorEscala['denom'];
                                break;
                            }
                        }
                    }
                }*/


            }
            return $evaluados;
        }

    }
             /**show estructura dominio**/
	public function getEvaluadosPeriodod(
        $idperiodoproceso, $strIdCargo,$idestructuranodo , $limit, $start, $idestadodesarrollo = null, $noColumna = null,
        $valorInicial = null, $valorFinal = null, $filtro = null
    )
    {

        if($idestructuranodo){
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructuranodo);
        }

        $p = 1;
        $array[0]['idestructura']=$idestructuranodo;
        foreach($r as $i){
            $array[$p]['idestructura'] = $i->id;
            $p++;
        }
        $strId = '-1';
        foreach ($array as $cargo) {
            if ($cargo['idestructura']) {
                $strId .= ',' . $cargo['idestructura'];
            }
        }

        $sqlnopersona = "SELECT eval.nopersona, eval.idpersonaevaluado
                FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                where eval.idperiodoproceso = {$idperiodoproceso} and (eval.idpersonaevaluador IN ($strIdCargo) OR eval.idpersonaevaluado IN ($strIdCargo))
                ";
        $resultnopersona = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlnopersona);


        if($resultnopersona[0]['nopersona']==0){
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT distinct(pev.idpersonaevaluado) as idpersona,pev.idpersonaevaluacion, pev.estado, pev.valor, pev.idmodelo, pev.idplanilla, pev.idperiodoproceso,
            pev.idpersonaevaluador, nevc.denom AS estadodesarrollo, pev.idescala,
            evc.color AS colorestadodes, pev.idpersonaevaluador as _parent, false as _is_leaf, docid.numero as numid,
            p.nombre, p.snombre, p.papel, p.sapel, p.sexo, sl.idcargo, encode(f.foto,'escape') as foto
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            LEFT JOIN  mod_evaluaciones.dat_evalescalavalorescualitativos evc ON(evc.idescalavalorescualitativos = pev.idestadodesarrollo)
            LEFT JOIN  mod_evaluaciones.nom_evalvalorescualitativos nevc ON(nevc.idvalorescualitativos = evc.idvalorescualitativos)
            INNER JOIN mod_persona.dat_persona p ON(p.idpersona = pev.idpersonaevaluado)
            LEFT JOIN mod_persona.dat_docidentidad docid ON(docid.idpersona = p.idpersona AND docid.principal = 1)
			INNER JOIN mod_persona.dat_personaentidad pe ON(pe.idpersona = p.idpersona and pe.fhasta is null)
            INNER JOIN mod_persona.dat_situacionlaboral sl ON(sl.idpersonaentidad = pe.idpersonaentidad and sl.fhasta is null)
            LEFT JOIN mod_persona.dat_foto f ON(f.idpersona = p.idpersona AND f.principal = 1)
            WHERE pev.idperiodoproceso = {$idperiodoproceso} ";
           
		if (count($strIdCargo) > 0) {
            $sql .= " AND (pev.idpersonaevaluado IN ($strIdCargo))";
        }

        //Adiciona filtros en dependencia del tipo de columna
        if (!empty($noColumna)) { //Caso en que hace dblclick en la celda
            if ($idestadodesarrollo) {
                if ($idestadodesarrollo != 'total') {
                    $sql .= " AND pev.idestadodesarrollo={$idestadodesarrollo}";
                }
            } else {
                $sql .= " AND pev.idestadodesarrollo IS NULL";
            }
            if ($noColumna == 3) {
                $sql .= " AND pev.estado=0";
            } //Columna de Evaluados
            else {
                if ($noColumna == 4) {
                    $sql .= " AND pev.estado=1 ";//OR pev.estado=2" preguntar si se queda;
                } //Columna de No evaluados
                else {
                    if ($noColumna == 5) {
                        $sql .= " AND pev.estado=3";
                    } //Columna de personas en desacuerdo con la evaluacion
                    else {
                        if ($noColumna == 6) {
                            $sql .= " AND pev.deacuerdo=2";
                        } //Columna de personas en reclamacion con la evaluacion
                        else {
                            if ($noColumna == 6) {
                                $sql .= " AND pev.estado=2";
                            }
                        }
                    }
                }
            }
        } else {
            if (!empty($valorInicial)) { //Caso en que se selecciona un rango de evaluaciones
                //Caso en que la evaluacion se almacena en resultado
                $sql .= " AND cast(pev.valor AS numeric) >= {$valorInicial} AND
                    cast(pev.valor AS numeric) <= {$valorFinal}";
            }
        }

        if (!empty($filtro)) {
            $sql .= " AND (docid.numero='$filtro' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%'
                    OR p.sapel ILIKE '%$filtro%')";
        }
            if ($limit) {
                $sql .= " LIMIT $limit";
            }

            if ($start) {
                $sql .= " OFFSET $start";
            }

        $evaluados = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($evaluados as &$evaluado) {
            if (!empty($evaluado['idcargo'])) {
                $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($evaluado['idcargo'],true,true);
                $evaluado['cargo'] = $datosCargo[0]['denominacion'];
            }

            if (empty($evaluado['idescala'])) {
                $evaluado['evaluacion'] = $evaluado['valor'];
            } else {
                $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($evaluado['idescala']);
                foreach ($valoresEscala as $valorEscala) {
                    if ($valorEscala['valor'] == $evaluado['valor']) {
                        $evaluado['evaluacion'] = $valorEscala['denom'];
                        break;
                    }
                }
            }
        }

        return $evaluados;
        }
        else
        {
            $arraypersonacargo = array();
            $evaluados = array();
            foreach($resultnopersona as $r){
                $id = 0;
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null,null,$r['idpersonaevaluado']);

                foreach($persona->data as $p){
                    $arraypersonacargo[$id]['idpersona'] =$p['idpersona'];
                    $id++;
                }

                $strId = '-1';
                foreach ($arraypersonacargo as $cargo) {
                    if ($cargo['idpersona']) {
                        $strId .= ',' . $cargo['idpersona'];
                    }
                }
                $idestructura = $r['idpersonaevaluado'];

                $query = Doctrine_Manager::getInstance();
                $sql = "SELECT pev.idpersonaevaluacion, pev.estado, pev.valor, pev.idmodelo, pev.idplanilla, pev.idperiodoproceso,
            pev.idpersonaevaluado as idpersona, pev.idpersonaevaluador, nevc.denom AS estadodesarrollo, pev.idescala,
            evc.color AS colorestadodes, pev.idpersonaevaluador as _parent, false as _is_leaf
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            LEFT JOIN  mod_evaluaciones.dat_evalescalavalorescualitativos evc ON(evc.idescalavalorescualitativos = pev.idestadodesarrollo)
            LEFT JOIN  mod_evaluaciones.nom_evalvalorescualitativos nevc ON(nevc.idvalorescualitativos = evc.idvalorescualitativos)
            WHERE pev.idperiodoproceso = {$idperiodoproceso} AND (pev.idpersonaevaluador = {$idestructura} OR pev.idpersonaevaluado = {$idestructura} )  ";

                //Adiciona filtros en dependencia del tipo de columna
                if (!empty($noColumna)) { //Caso en que hace dblclick en la celda
                    if ($idestadodesarrollo) {
                        if ($idestadodesarrollo != 'total') {
                            $sql .= " AND pev.idestadodesarrollo={$idestadodesarrollo}";
                        }
                    } else {
                        $sql .= " AND pev.idestadodesarrollo IS NULL";
                    }
                    if ($noColumna == 3) {
                        $sql .= " AND pev.estado=0";
                    } //Columna de Evaluados
                    else {
                        if ($noColumna == 4) {
                            $sql .= " AND pev.estado=1 OR pev.estado=2";
                        } //Columna de No evaluados
                        else {
                            if ($noColumna == 5) {
                                $sql .= " AND pev.estado=3";
                            } //Columna de personas en desacuerdo con la evaluacion
                            else {
                                if ($noColumna == 6) {
                                    $sql .= " AND pev.deacuerdo=1";
                                } //Columna de personas en reclamacion con la evaluacion
                                else {
                                    if ($noColumna == 6) {
                                        $sql .= " AND pev.estado=2";
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (!empty($valorInicial)) { //Caso en que se selecciona un rango de evaluaciones
                        //Caso en que la evaluacion se almacena en resultado
                        $sql .= " AND cast(pev.valor AS numeric) >= {$valorInicial} AND
                    cast(pev.valor AS numeric) <= {$valorFinal}";
                    }
                }

                if (!empty($filtro)) {
                    $sql .= " AND (docid.numero='$filtro' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%'
                    OR p.sapel ILIKE '%$filtro%')";
                }

                $sqlpersona =  "SELECT docid.numero as numid,p.idpersona,
                                 p.nombre, p.snombre, p.papel, p.sapel, p.sexo, sl.idcargo, encode(f.foto,'escape') as foto
                                 FROM mod_persona.dat_persona p
                                 LEFT JOIN mod_persona.dat_docidentidad docid ON(docid.idpersona = p.idpersona AND docid.principal = 1)
                                 INNER JOIN mod_persona.dat_personaentidad pe ON(pe.idpersona = p.idpersona and pe.fhasta is null)
                                 INNER JOIN mod_persona.dat_situacionlaboral sl ON(sl.idpersonaentidad = pe.idpersonaentidad and sl.fhasta is null)
                                 LEFT JOIN mod_persona.dat_foto f ON(f.idpersona = p.idpersona AND f.principal = 1)
                                 WHERE p.idpersona IN ($strId)";

                $evaluados = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

                $personas = $query->getCurrentConnection()->execute($sqlpersona)->fetchAll(PDO::FETCH_ASSOC);

                for($i = 0; $i< count($evaluados) ;$i++){
                    $c = 0;
                    for($a = 0; $a< count($personas) ;$a++){
                        $evaluados[$c]['idpersonaevaluacion'] = $evaluados[$i]['idpersonaevaluacion'];
                        $evaluados[$c]['estado'] = $evaluados[$i]['estado'];
                        $evaluados[$c]['valor'] = $evaluados[$i]['valor'];
                        $evaluados[$c]['idmodelo'] = $evaluados[$i]['idmodelo'];
                        $evaluados[$c]['idplanilla'] = $evaluados[$i]['idplanilla'];
                        $evaluados[$c]['idperiodoproceso'] = $evaluados[$i]['idperiodoproceso'];
                        $evaluados[$c]['idpersona'] = $personas[$a]['idpersona'];
                        $evaluados[$c]['idpersonaevaluador'] = $evaluados[$i]['idpersonaevaluador'];
                        $evaluados[$c]['estadodesarrollo'] = $evaluados[$i]['estadodesarrollo'];
                        $evaluados[$c]['idescala'] = $evaluados[$i]['idescala'];
                        $evaluados[$c]['colorestadodes'] = $evaluados[$i]['colorestadodes'];
                        $evaluados[$c]['_parent'] = $evaluados[$i]['_parent'];
                        $evaluados[$c]['_is_leaf'] = $evaluados[$i]['_is_leaf'];
                        $evaluados[$c]['numid'] = $personas[$a]['numid'];
                        $evaluados[$c]['nombre'] =$personas[$a]['nombre'];
                        $evaluados[$c]['snombre'] = $personas[$a]['snombre'];
                        $evaluados[$c]['papel'] = $personas[$a]['papel'];
                        $evaluados[$c]['sapel'] = $personas[$a]['sapel'];
                        $evaluados[$c]['sexo'] = $personas[$a]['sexo'];
                        $evaluados[$c]['idcargo'] = $personas[$a]['idcargo'];
                        $evaluados[$c]['foto'] = $personas[$a]['foto'];
                        $c++;
                    }
                }

            }

            return $evaluados;
        }
    }		 
			 
           /**estructura evaluativa**/
    public function getListPersProcesoEval(
        $idperiodoproceso, $strIdCargo, $limit, $start, $idestadodesarrollo = null, $noColumna = null,
        $valorInicial = null, $valorFinal = null, $filtro = null
    )
    {

        if($strIdCargo[0]){
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($strIdCargo[0]);
        }
        $p = 1;
        $array[0]['idestructura']=$strIdCargo[0];
        foreach($r as $i){
            $array[$p]['idestructura'] = $i->id;
            $p++;
        }

        $strId = '-1';
        foreach ($array as $cargo) {
            if ($cargo['idestructura']) {
                $strId .= ',' . $cargo['idestructura'];
            }
        }

        $sqlnopersona = "SELECT eval.nopersona, eval.idpersonaevaluado
                FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                where eval.idperiodoproceso = {$idperiodoproceso} and (eval.idpersonaevaluador IN ($strId) OR eval.idpersonaevaluado IN ($strId))
                ";
        $resultnopersona = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlnopersona);


        foreach ($strIdCargo as $cargo) {
                $id[]= $cargo;
        }

        $sqlproceso = "SELECT def.denom as proceso, pp.denominacion as periodo
                FROM  mod_evaluaciones.dat_evaldefprocesoevaluativo def
                INNER JOIN mod_evaluaciones.dat_evalpreprocesoevaluativo as pr ON (pr.iddefprocesoevaluativo = def.iddefprocesoevaluativo)
                INNER JOIN mod_evaluaciones.dat_periodoproceso as pp ON (pp.idpreprocesoevaluativo = pr.idpreprocesoevaluativo)
                where pp.idperiodoproceso = $idperiodoproceso ";
        $resultproceso= Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlproceso);

        if(($resultnopersona[0]['nopersona']==0 AND $strIdCargo[0] =!null) OR $strIdCargo[0] ==null ){
            $queryObj = Doctrine_Query::create()
                ->select(
                    "pev.idpersonaevaluacion, pev.valor as valor, pev.idescala as idescala, pev.idpersonaevaluado, nvc.denom as estadodesarrollo
                    "
                )
                ->from('DatEvalpersonaevaluacion pev')
                ->leftJoin('pev.DatEvalescalavalorescualitativos ed')
                ->leftJoin('ed.NomEvalvalorescualitativos nvc')
                ->addWhere(
                    "pev.idperiodoproceso={$idperiodoproceso} "
                )
                ->whereIn("pev.idpersonaevaluado",$id);

            //Adiciona filtros en dependencia del tipo de columna
            if (!empty($noColumna)) { //Caso en que hace dblclick en la celda
                if ($idestadodesarrollo) {
                    if ($idestadodesarrollo != 'total') {
                        $queryObj->addWhere("pev.idestadodesarrollo={$idestadodesarrollo}");
                    }
                } else {
                    $queryObj->addWhere("pev.idestadodesarrollo IS NULL");
                }
                if ($noColumna == 3) {
                    $queryObj->addWhere('(pev.estado=0)');
                } //Columna de Evaluados
                else {
                    if ($noColumna == 4) {
                        $queryObj->addWhere('(pev.estado=1 OR pev.estado=2)');
                    } //Columna de No evaluados
                    else {
                        if ($noColumna == 5) {
                            $queryObj->addWhere('(pev.estado=3)');
                        } //Columna de personas en desacuerdo con la evaluacion
                        else {
                            if ($noColumna == 6) {
                                $queryObj->addWhere('pev.deacuerdo=1');
                            } //Columna de personas en reclamacion con la evaluacion
                            else {
                                if ($noColumna == 6) {
                                    $queryObj->addWhere('pev.estado=2');
                                }
                            }
                        }
                    }
                }
            } else {
                if (!empty($valorInicial)) { //Caso en que se selecciona un rango de evaluaciones
                    //Caso en que la evaluacion se almacena en resultado
                    $queryObj->addWhere(
                        "cast(pev.valor AS numeric) >= {$valorInicial} AND cast(pev.valor AS numeric) <= {$valorFinal}"
                    );
                }
            }
            //Filtro de datos personales
            if (!empty($filtro)) {
                $queryObj->addWhere(
                    "(p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%')"
                );
            }

            if ($limit) {
                $queryObj->limit($limit)->offset($start);
            }

            $sql = $queryObj->fetchArray();
            $i=0;
            foreach($sql as $idevaluado){

                $sqle[$i] = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($idevaluado['idpersonaevaluado'], $filtro = null, $limit = null, $start = 0, $identidad = null,
                $idcargo = null, $idestructura = null);
                $i++;

            }

            foreach($sql as $k=>$s){

                $evaluacion[$k]=$s['valor'];

            }
            foreach($sql as $k=>$s){

                $estado[$k]=$s['estadodesarrollo'];

            }

            foreach($sqle as $k=>$s){
                $personas[$k] = $s->data;
            }

            $idescalaTemp = ''; //Variable temporal para almacenar el idescala.
            $valoresEscala = array();
            foreach ($personas as &$persona) {
                if (empty($persona['idescala'])) {
                    $persona['evaluacion'] =   $persona['valor'];
                } else {
                    if ($idescalaTemp != $persona['idescala']) {
                        $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($persona['idescala']);
                        $idescalaTemp = $persona['idescala'];
                    }
                    foreach ($valoresEscala as $valorEscala) {
                        if ($valorEscala['valor'] == $persona['valor']) {
                            $persona['evaluacion'] = $valorEscala['denom'];
                            $persona['color'] = $valorEscala['color'];
                            break;
                        }
                    }
                }

            }
            $k =0;
            $a =0;
            $o = 0;

            foreach ($personas as $data)
            {
                $datos[$k]['no'] = $i + 1;
                $datos[$k]['nombre'] = $data[0]['nombre'];
                $datos[$k]['snombre'] = $data[0]['snombre'];
                $datos[$k]['papel'] = $data[0]['papel'];
                $datos[$k]['sapel'] = $data[0]['sapel'];
                $datos[$k]['cargo'] = $data[0]['denomcargo'];
                $datos[$k]['estadodesarrollo'] = $data[0]['estadodesarrollo'];
                $datos[$k]['periodo'] = $resultproceso[0]['periodo'];
                $datos[$k]['proceso'] = $resultproceso[0]['proceso'];
                $k++;
            }
            foreach($evaluacion as $eval){
                $datos[$a]['evaluacion'] =$eval;
                $a++;
            }
            foreach($estado as $est){
                $datos[$o]['estadodesarrollo'] =$est;
                $o++;
            }

            return $datos;

        }

        else
        {

            $arraypersonacargo = array();
            $i = 0;

            foreach($resultnopersona as $r){
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null,null,$r['idpersonaevaluado']);
                $id = 0;
                foreach($persona->data as $p){
                    $arraypersonacargo[$id]['idpersona'] =$p['idpersona'];
                    $arraypersonacargo[$id]['nombre'] =$p['nombre'];
                    $arraypersonacargo[$id]['papel'] =$p['papel'];
                    $arraypersonacargo[$id]['sapel'] =$p['sapel'];
                    $arraypersonacargo[$id]['sexo'] =$p['sexo'];
                    $arraypersonacargo[$id]['nombreapellidos'] =$p['nombreapellidos'];
                    $arraypersonacargo[$id]['numid'] =$p['numid'];
                    $arraypersonacargo[$id]['foto'] =$p['foto'];
                    $personacargo = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(array($p['idpersona']), null, null, 0, null,null,$r['idpersonaevaluado']);
                    $arraypersonacargo[$id]['idcargo'] =$personacargo->data[0]['idcargo'];
                    $arraypersonacargo[$id]['denomcargo'] =$personacargo->data[0]['denomcargo'];
                    $id++;
                }

                $cant = count($arraypersonacargo);
                $idestructura = $r['idpersonaevaluado'];

                $queryObj = Doctrine_Query::create()
                    ->select(
                        "pev.idpersonaevaluacion, pev.valor as valor, pev.idescala as idescala, nvc.denom as estadodesarrollo
                        "
                    )
                    ->from('DatEvalpersonaevaluacion pev')
                    ->leftJoin('pev.DatEvalescalavalorescualitativos ed')
                    ->leftJoin('ed.NomEvalvalorescualitativos nvc')
                    ->where(
                        "pev.idperiodoproceso = {$idperiodoproceso} AND pev.idpersonaevaluado = $idestructura "
                    );


                //Adiciona filtros en dependencia del tipo de columna
                if (!empty($noColumna)) { //Caso en que hace dblclick en la celda
                    if ($idestadodesarrollo) {
                        if ($idestadodesarrollo != 'total') {
                            $queryObj->addWhere("pev.idestadodesarrollo={$idestadodesarrollo}");
                        }
                    } else {
                        $queryObj->addWhere("pev.idestadodesarrollo IS NULL");
                    }
                    if ($noColumna == 3) {
                        $queryObj->addWhere('(pev.estado=0)');
                    } //Columna de Evaluados
                    else {
                        if ($noColumna == 4) {
                            $queryObj->addWhere('(pev.estado=1 OR pev.estado=2)');
                        } //Columna de No evaluados
                        else {
                            if ($noColumna == 5) {
                                $queryObj->addWhere('(pev.estado=3)');
                            } //Columna de personas en desacuerdo con la evaluacion
                            else {
                                if ($noColumna == 6) {
                                    $queryObj->addWhere('pev.deacuerdo=1');
                                } //Columna de personas en reclamacion con la evaluacion
                                else {
                                    if ($noColumna == 6) {
                                        $queryObj->addWhere('pev.estado=2');
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (!empty($valorInicial)) { //Caso en que se selecciona un rango de evaluaciones
                        //Caso en que la evaluacion se almacena en resultado
                        $queryObj->addWhere(
                            "cast(pev.valor AS numeric) >= {$valorInicial} AND cast(pev.valor AS numeric) <= {$valorFinal}"
                        );
                    }
                }

                if ($limit) {
                    $queryObj->limit($limit)->offset($start);
                }

                $idescalaTemp = ''; //Variable temporal para almacenar el idescala.
                $valoresEscala = array();


                $personaevaluacion = $queryObj->fetchArray();

                foreach($arraypersonacargo as $a){
                    $personas[$i]['idpersonaevaluacion'] =  $personaevaluacion[0]['idpersonaevaluacion'];
                    $personas[$i]['valor'] =  $personaevaluacion[0]['valor'];
                    $personas[$i]['idescala'] =  $personaevaluacion[0]['idescala'];
                    $personas[$i]['estadodesarrollo'] =  $personaevaluacion[0]['estadodesarrollo'];
                    $personas[$i]['idpersona'] =  $a['idpersona'];
                    $personas[$i]['nombre'] =  $a['nombre'];
                    $personas[$i]['papel'] =  $a['papel'];
                    $personas[$i]['sapel'] =  $a['sapel'];
                    $personas[$i]['sexo'] =  $a['sexo'];
                    $personas[$i]['nombreapellidos'] =  $a['nombreapellidos'];
                    $personas[$i]['numid'] =  $a['numid'];
                    $personas[$i]['foto'] =  $a['foto'];
                    $personas[$i]['idcargo'] =  $a['idcargo'];
                    $personas[$i]['denomcargo'] =  $a['denomcargo'];
                    $personas[$i]['periodo'] = $resultproceso[0]['periodo'];
                    $personas[$i]['proceso'] = $resultproceso[0]['proceso'];
                    $i++;
                }

                foreach ($personas as &$persona) {
                    if (empty($persona['idescala'])) {
                        $persona['evaluacion'] = $persona['valor'];
                    } else {
                        if ($idescalaTemp != $persona['idescala']) {
                            $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($persona['idescala']);
                            $idescalaTemp = $persona['idescala'];
                        }
                        foreach ($valoresEscala as $valorEscala) {
                            if ($valorEscala['valor'] == $persona['valor']) {
                                $persona['evaluacion'] = $valorEscala['denom'];
                                $persona['color'] = $valorEscala['color'];
                                break;
                            }
                        }
                    }
                }


            }
            return $personas;
        }
    }

    public function countListPersProcesoEval(
        $idperiodoproceso, $strIdCargo, $idestadodesarrollo = null, $noColumna = null, $valorInicial = null,
        $valorFinal = null, $filtro = null
    )
    {
        $ids = implode(',', $strIdCargo);
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT COUNT(distinct pev.idpersonaevaluacion) AS cantidad
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            INNER JOIN mod_persona.dat_persona p ON(p.idpersona = pev.idpersonaevaluado)
            INNER JOIN mod_persona.dat_personaentidad pe ON(pe.idpersona = p.idpersona)
            INNER JOIN mod_persona.dat_situacionlaboral sl ON(sl.idpersonaentidad = pe.idpersonaentidad)
            LEFT JOIN mod_persona.dat_docidentidad docid ON(docid.idpersona = p.idpersona AND docid.principal = 1)
            WHERE pev.idperiodoproceso = {$idperiodoproceso}";
        if (count($strIdCargo) > 0) {
            $sql .= ' AND (pev.idpersonaevaluador IN (' . $ids . ') OR pev.idpersonaevaluado IN (' . $ids . '))';
        }
        //Adiciona filtros en dependencia del tipo de columna
        if (!empty($noColumna)) { //Caso en que hace dblclick en la celda
            if ($idestadodesarrollo) {
                if ($idestadodesarrollo != 'total') {
                    $sql .= " AND pev.idestadodesarrollo={$idestadodesarrollo}";
                }
            } else {
                $sql .= " AND pev.idestadodesarrollo IS NULL";
            }
            if ($noColumna == 3) {
                $sql .= " AND pev.estado=0";
            } //Columna de Evaluados
            else {
                if ($noColumna == 4) {
                    $sql .= " AND pev.estado=1 ";//OR pev.estado=2";
                } //Columna de No evaluados
                else {
                    if ($noColumna == 5) {
                        $sql .= " AND pev.estado=3";
                    } //Columna de personas en desacuerdo con la evaluacion
                    else {
                        if ($noColumna == 6) {
                            $sql .= " AND pev.deacuerdo=2";
                        } //Columna de personas en reclamacion con la evaluacion
                        else {
                            if ($noColumna == 6) {
                                $sql .= " AND pev.estado=2";
                            }
                        }
                    }
                }
            }
        } else {
            if (!empty($valorInicial)) { //Caso en que se selecciona un rango de evaluaciones
                //Caso en que la evaluacion se almacena en resultado
                $sql .= " AND cast(pev.valor AS numeric) >= {$valorInicial} AND
                    cast(pev.valor AS numeric) <= {$valorFinal}";
            }
        }

        if (!empty($filtro)) {
            $sql .= " AND (docid.numero='$filtro' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%'
                    OR p.sapel ILIKE '%$filtro%')";
        }

        $evaluados = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $evaluados[0]['cantidad'];
    }
////////////////////////////////////////estrcutura dominio///////////////////////////////////////////
 public function getListPersProcesoEvald(
        $idperiodoproceso,$limit, $start, $idestadodesarrollo = null, $noColumna = null,
        $valorInicial = null, $valorFinal = null, $filtro = null, $idestructuranodo,$strIdP
    )
    {

        if($idestructuranodo){
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructuranodo);
        }

        $p = 1;
        $array[0]['idestructura']=$idestructuranodo;
        foreach($r as $i){
            $array[$p]['idestructura'] = $i->id;
            $p++;
        }

        $strId = '-1';
        foreach ($array as $cargo) {
            if ($cargo['idestructura']) {
                $strId .= ',' . $cargo['idestructura'];
            }
        }

        $sqlnopersona = "SELECT eval.nopersona, eval.idpersonaevaluado
                FROM  mod_evaluaciones.dat_evalpersonaevaluacion eval
                where eval.idperiodoproceso = {$idperiodoproceso} and (eval.idpersonaevaluador IN ($strId) OR eval.idpersonaevaluado IN ($strId))
                ";
        $resultnopersona = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlnopersona);



        if(($resultnopersona[0]['nopersona']==0 AND $idestructuranodo =!null) OR $idestructuranodo ==null ){

        $queryObj = Doctrine_Query::create()
            ->select(
                "pev.idpersonaevaluacion, pev.valor as valor, pev.idescala as idescala, nvc.denom as estadodesarrollo, pev.idpersonaevaluado, pev.idperiodoproceso
                "
            )
            ->from('DatEvalpersonaevaluacion pev')
			->leftJoin('pev.DatEvalescalavalorescualitativos ed')
			->leftJoin('ed.NomEvalvalorescualitativos nvc')
            ->where(
                "pev.idperiodoproceso = {$idperiodoproceso} AND pev.idpersonaevaluado IN ($strIdP)"
            );


        //Adiciona filtros en dependencia del tipo de columna
        if (!empty($noColumna)) { //Caso en que hace dblclick en la celda
            if ($idestadodesarrollo) {
                if ($idestadodesarrollo != 'total') {
                    $queryObj->addWhere("pev.idestadodesarrollo={$idestadodesarrollo}");
                }
            } else {
                $queryObj->addWhere("pev.idestadodesarrollo IS NULL");
            }
            if ($noColumna == 3) {
                $queryObj->addWhere('(pev.estado=0)');
            } //Columna de Evaluados
            else {
                if ($noColumna == 4) {
                    $queryObj->addWhere('(pev.estado=1 OR pev.estado=2)');
                } //Columna de No evaluados
                else {
                    if ($noColumna == 5) {
                        $queryObj->addWhere('(pev.estado=3)');
                    } //Columna de personas en desacuerdo con la evaluacion
                    else {
                        if ($noColumna == 6) {
                            $queryObj->addWhere('pev.deacuerdo=1');
                        } //Columna de personas en reclamacion con la evaluacion
                        else {
                            if ($noColumna == 6) {
                                $queryObj->addWhere('pev.estado=2');
                            }
                        }
                    }
                }
            }
        } else {
            if (!empty($valorInicial)) { //Caso en que se selecciona un rango de evaluaciones
                //Caso en que la evaluacion se almacena en resultado
                $queryObj->addWhere(
                    "cast(pev.valor AS numeric) >= {$valorInicial} AND cast(pev.valor AS numeric) <= {$valorFinal}"
                );
            }
        }


        if ($limit) {
            $queryObj->limit($limit)->offset($start);
        }

        $idescalaTemp = ''; //Variable temporal para almacenar el idescala.
        $valoresEscala = array();

        $personas = $queryObj->fetchArray();
        $result = array();
        $d = 0;

            foreach($personas as $pers){
                $idperiodo =  $pers['idperiodoproceso'];

                $p = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($pers['idpersonaevaluado'], null, null, 0, null,null,null);

                $sqlproceso = "SELECT def.denom as proceso, pp.denominacion as periodo
                FROM  mod_evaluaciones.dat_evaldefprocesoevaluativo def
                INNER JOIN mod_evaluaciones.dat_evalpreprocesoevaluativo as pr ON (pr.iddefprocesoevaluativo = def.iddefprocesoevaluativo)
                INNER JOIN mod_evaluaciones.dat_periodoproceso as pp ON (pp.idpreprocesoevaluativo = pr.idpreprocesoevaluativo)
                where pp.idperiodoproceso = $idperiodo ";
                $resultproceso= Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlproceso);

                $result[$d]['idpersona'] = $p->data[0]['idpersona'];
                $result[$d]['nombre'] = $p->data[0]['nombre'];
                $result[$d]['snombre'] =$p->data[0]['snombre'];
                $result[$d]['papel'] = $p->data[0]['papel'];
                $result[$d]['sapel'] = $p->data[0]['sapel'];
                $result[$d]['numid'] = $p->data[0]['numid'];
                $result[$d]['nombreapellidos'] = $p->data[0]['nombreapellidos'];
                $result[$d]['denomcargo'] =$p->data[0]['denomcargo'];
                $result[$d]['idpersonaevaluacion'] =$pers['idpersonaevaluacion'];
                $result[$d]['valor'] =$pers['valor'];
                $result[$d]['idescala'] =$pers['idescala'];
                $result[$d]['estadodesarrollo'] =$pers['estadodesarrollo'];
                $result[$d]['periodo'] =$resultproceso[0]['periodo'];
                $result[$d]['proceso'] =$resultproceso[0]['proceso'];
                $d++;
            }

        foreach ($result as &$persona) {
            if (empty($persona['idescala'])) {
                $persona['evaluacion'] = $persona['valor'];
            } else {
                if ($idescalaTemp != $persona['idescala']) {
                    $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($persona['idescala']);
                    $idescalaTemp = $persona['idescala'];
                }
                foreach ($valoresEscala as $valorEscala) {
                    if ($valorEscala['valor'] == $persona['valor']) {
                        $persona['evaluacion'] = $valorEscala['denom'];
                        $persona['color'] = $valorEscala['color'];
                        break;
                    }
                }
            }
        }

        return $result;

        }
        else
        {
            $arraypersonacargo = array();
            $i = 0;

            foreach($resultnopersona as $r){
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null,null,$r['idpersonaevaluado']);
                $id = 0;
                foreach($persona->data as $p){
                    $arraypersonacargo[$id]['idpersona'] =$p['idpersona'];
                    $arraypersonacargo[$id]['nombre'] =$p['nombre'];
                    $arraypersonacargo[$id]['papel'] =$p['papel'];
                    $arraypersonacargo[$id]['sapel'] =$p['sapel'];
                    $arraypersonacargo[$id]['sexo'] =$p['sexo'];
                    $arraypersonacargo[$id]['nombreapellidos'] =$p['nombreapellidos'];
                    $arraypersonacargo[$id]['numid'] =$p['numid'];
                    $arraypersonacargo[$id]['foto'] =$p['foto'];
                    $personacargo = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(array($p['idpersona']), null, null, 0, null,null,$r['idpersonaevaluado']);
                    $arraypersonacargo[$id]['idcargo'] =$personacargo->data[0]['idcargo'];
                    $arraypersonacargo[$id]['denomcargo'] =$personacargo->data[0]['denomcargo'];
                    $id++;
                }

                $cant = count($arraypersonacargo);
                $idestructura = $r['idpersonaevaluado'];

            $queryObj = Doctrine_Query::create()
                ->select(
                    "pev.idpersonaevaluacion, pev.valor as valor, pev.idescala as idescala, nvc.denom as estadodesarrollo,pev.idperiodoproceso
                    "
                )
                ->from('DatEvalpersonaevaluacion pev')
                ->leftJoin('pev.DatEvalescalavalorescualitativos ed')
                ->leftJoin('ed.NomEvalvalorescualitativos nvc')
                ->where(
                    "pev.idperiodoproceso = {$idperiodoproceso} AND pev.idpersonaevaluado = $idestructura "
                );
            //Adiciona filtros en dependencia del tipo de columna
            if (!empty($noColumna)) { //Caso en que hace dblclick en la celda
                if ($idestadodesarrollo) {
                    if ($idestadodesarrollo != 'total') {
                        $queryObj->addWhere("pev.idestadodesarrollo={$idestadodesarrollo}");
                    }
                } else {
                    $queryObj->addWhere("pev.idestadodesarrollo IS NULL");
                }
                if ($noColumna == 3) {
                    $queryObj->addWhere('(pev.estado=0)');
                } //Columna de Evaluados
                else {
                    if ($noColumna == 4) {
                        $queryObj->addWhere('(pev.estado=1 OR pev.estado=2)');
                    } //Columna de No evaluados
                    else {
                        if ($noColumna == 5) {
                            $queryObj->addWhere('(pev.estado=3)');
                        } //Columna de personas en desacuerdo con la evaluacion
                        else {
                            if ($noColumna == 6) {
                                $queryObj->addWhere('pev.deacuerdo=1');
                            } //Columna de personas en reclamacion con la evaluacion
                            else {
                                if ($noColumna == 6) {
                                    $queryObj->addWhere('pev.estado=2');
                                }
                            }
                        }
                    }
                }
            } else {
                if (!empty($valorInicial)) { //Caso en que se selecciona un rango de evaluaciones
                    //Caso en que la evaluacion se almacena en resultado
                    $queryObj->addWhere(
                        "cast(pev.valor AS numeric) >= {$valorInicial} AND cast(pev.valor AS numeric) <= {$valorFinal}"
                    );
                }
            }

            if ($limit) {
                $queryObj->limit($limit)->offset($start);
            }

            $idescalaTemp = ''; //Variable temporal para almacenar el idescala.
            $valoresEscala = array();


            $personaevaluacion = $queryObj->fetchArray();

                $sqlproceso = "SELECT def.denom as proceso, pp.denominacion as periodo
                FROM  mod_evaluaciones.dat_evaldefprocesoevaluativo def
                INNER JOIN mod_evaluaciones.dat_evalpreprocesoevaluativo as pr ON (pr.iddefprocesoevaluativo = def.iddefprocesoevaluativo)
                INNER JOIN mod_evaluaciones.dat_periodoproceso as pp ON (pp.idpreprocesoevaluativo = pr.idpreprocesoevaluativo)
                where pp.idperiodoproceso = $idperiodoproceso ";

                $resultproceso= Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlproceso);

                foreach($arraypersonacargo as $a){
                    $personas[$i]['idpersonaevaluacion'] =  $personaevaluacion[0]['idpersonaevaluacion'];
                    $personas[$i]['valor'] =  $personaevaluacion[0]['valor'];
                    $personas[$i]['idescala'] =  $personaevaluacion[0]['idescala'];
                    $personas[$i]['estadodesarrollo'] =  $personaevaluacion[0]['estadodesarrollo'];
                    $personas[$i]['idpersona'] =  $a['idpersona'];
                    $personas[$i]['nombre'] =  $a['nombre'];
                    $personas[$i]['papel'] =  $a['papel'];
                    $personas[$i]['sapel'] =  $a['sapel'];
                    $personas[$i]['sexo'] =  $a['sexo'];
                    $personas[$i]['nombreapellidos'] =  $a['nombreapellidos'];
                    $personas[$i]['numid'] =  $a['numid'];
                    $personas[$i]['foto'] =  $a['foto'];
                    $personas[$i]['idcargo'] =  $a['idcargo'];
                    $personas[$i]['denomcargo'] =  $a['denomcargo'];
                    $personas[$i]['periodo'] =  $resultproceso[0]['periodo'];
                    $personas[$i]['proceso'] =  $resultproceso[0]['proceso'];
                    $i++;
                }
            foreach ($personas as &$persona) {
                if (empty($persona['idescala'])) {
                    $persona['evaluacion'] = $persona['valor'];
                } else {
                    if ($idescalaTemp != $persona['idescala']) {
                        $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($persona['idescala']);
                        $idescalaTemp = $persona['idescala'];
                    }
                    foreach ($valoresEscala as $valorEscala) {
                        if ($valorEscala['valor'] == $persona['valor']) {
                            $persona['evaluacion'] = $valorEscala['denom'];
                            $persona['color'] = $valorEscala['color'];
                            break;
                        }
                    }
                }
            }


            }

            return $personas;
        }

    }

    /**count para estructura de dominio**/
	public function countListPersProcesoEvald(
        $idperiodoproceso, $strIdCargo, $idestadodesarrollo = null, $noColumna = null, $valorInicial = null,
        $valorFinal = null, $filtro = null
    )
    {		
	    $query = Doctrine_Manager::getInstance();
        $sql = "SELECT COUNT(distinct pev.idpersonaevaluacion) AS cantidad
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            INNER JOIN mod_persona.dat_persona p ON(p.idpersona = pev.idpersonaevaluado)
            INNER JOIN mod_persona.dat_personaentidad pe ON(pe.idpersona = p.idpersona)
            INNER JOIN mod_persona.dat_situacionlaboral sl ON(sl.idpersonaentidad = pe.idpersonaentidad)
            LEFT JOIN mod_persona.dat_docidentidad docid ON(docid.idpersona = p.idpersona AND docid.principal = 1)
            WHERE pev.idperiodoproceso = {$idperiodoproceso}";
        if (count($strIdCargo) > 0) {
            $sql .= " AND (pev.idpersonaevaluado IN ($strIdCargo))";
        }
        //Adiciona filtros en dependencia del tipo de columna
        if (!empty($noColumna)) { //Caso en que hace dblclick en la celda
            if ($idestadodesarrollo) {
                if ($idestadodesarrollo != 'total') {
                    $sql .= " AND pev.idestadodesarrollo={$idestadodesarrollo}";
                }
            } else {
                $sql .= " AND pev.idestadodesarrollo IS NULL";
            }
            if ($noColumna == 3) {
                $sql .= " AND pev.estado=0";
            } //Columna de Evaluados
            else {
                if ($noColumna == 4) {
                    $sql .= " AND pev.estado=1 ";//OR pev.estado=2";
                } //Columna de No evaluados
                else {
                    if ($noColumna == 5) {
                        $sql .= " AND pev.estado=3";
                    } //Columna de personas en desacuerdo con la evaluacion
                    else {
                        if ($noColumna == 6) {
                            $sql .= " AND pev.deacuerdo=2";
                        } //Columna de personas en reclamacion con la evaluacion
                        else {
                            if ($noColumna == 6) {
                                $sql .= " AND pev.estado=2";
                            }
                        }
                    }
                }
            }
        } else {
            if (!empty($valorInicial)) { //Caso en que se selecciona un rango de evaluaciones
                //Caso en que la evaluacion se almacena en resultado
                $sql .= " AND cast(pev.valor AS numeric) >= {$valorInicial} AND
                    cast(pev.valor AS numeric) <= {$valorFinal}";
            }
        }

        if (!empty($filtro)) {
            $sql .= " AND (docid.numero='$filtro' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%'
                    OR p.sapel ILIKE '%$filtro%')";
        }
        
        $evaluados = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
				  
        return $evaluados[0]['cantidad'];
    }
	 
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	public function getSerieIndicadoresPersona($arrIdpersonaevaluacion, $arrIndPlanilla)
    {
        $objProcEval = new DatEvalprocesoevaluados();
        $series = array();
        $persEvaluacion = $objProcEval->getResultIndicadoresPersona($arrIdpersonaevaluacion, $arrIndPlanilla);

        foreach ($persEvaluacion as $key => $evaluacion) {

            if ($evaluacion['nopersona'] == 1) {
                $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($evaluacion['idpersonaevaluado']);
                $series[$key]['name'] = $estruc[0]->text;
            } else {
                $series[$key]['name'] = $evaluacion['nombre'] . ' ' . $evaluacion['snombre'] . ' ' .
                    $evaluacion['papel'] . ' ' . $evaluacion['sapel'];
            }
            foreach ($evaluacion['DatEvalindicadoresevaluacion'] as $indicadorEvaluacion) {
                $series[$key]['data'][] = array(
                    $indicadorEvaluacion['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'],
                    intval($indicadorEvaluacion['valor']));
            }
        }

        return $series;
    }

    ///////////////////////graficar///////////////////////////
    public function getSeriePeriodoPersona($arrIdpersonaevaluacion, $arrPeriodo)
    {
        $objProcEval = new DatEvalprocesoevaluados();
        $series = array();
        $persEvaluacion = $objProcEval->getResultPeriodoPersona($arrIdpersonaevaluacion, $arrPeriodo);

        foreach ($persEvaluacion as $key => $evaluacion) {
            if ($evaluacion['nopersona'] == 1) {
                $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($evaluacion['idpersonaevaluado']);
                $series[$key]['name'] = $estruc[0]->text;
            } else {
                $series[$key]['name'] = $evaluacion['nombreapellidos'];
            }

            foreach ($evaluacion['DatEvalpersonaevaluacion'] as $periodoEvaluacion) {

                $series[$key]['data'][] = array(
                    $periodoEvaluacion['DatPeriodoproceso']['denom'],
                    intval($periodoEvaluacion['DatPeriodoproceso']['valor'])
                );
            }

        }

        return $series;
    }
	 public function sumaIndicadoresEvalTextByPersona($idpersonaevaluacion)
    {
        $query = Doctrine_Manager::getInstance();
        $sql = " SELECT sum(ie.valor) as suma
            FROM mod_evaluaciones.dat_evalindicadoresevaluacion ie
            INNER JOIN mod_evaluaciones.dat_evalindicadoresplanilla inp ON(ie.idindicadorplanilla = inp.idindicadorplanilla)
            WHERE ie.idpersonaevaluacion = {$idpersonaevaluacion}";
        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC)[0];
        return $result;
    }

    public function getSeriePersona($arrIdpersonaevaluacion,$arrIdperiodo, $arrIndicadores, $idpersona)
    {
        $objProcEval = new DatEvalprocesoevaluados();
        $series = array();
        $persEvaluacion = $objProcEval->getResultPersona($arrIndicadores, $arrIdperiodo, $idpersona);

        foreach ($persEvaluacion as $key => $evaluacion) {

                $series[$key]['name'] = $evaluacion['DatPeriodoproceso']['denominacion'] ;

            foreach ($evaluacion['DatEvalindicadoresevaluacion'] as $indicadorEvaluacion) {
                $series[$key]['data'][] = array(
                    $indicadorEvaluacion['DatEvalindicadoresplanilla']['NomEvalindicadortexto']['denom'],
                    intval($indicadorEvaluacion['valor']));
            }
        }

        return $series;
    }

    public function getSerieResumen($estructura,$strIdCargo,$idperiodoproceso,$nombrenodo)
    {
        $objProcEval = new DatEvalpersonaevaluacion();
        $series = array();

        $result = $objProcEval->resumenProcesoEvald($idperiodoproceso,$strIdCargo,$estructura);

        $arrayestructura = array();
        $arr=array();
        $arrr=array();


        foreach($result as $r){
            if($r['estadodesarrollo']=='Total'){
                $arr[]['count']=$r['porevaluar'];
                $arr[]['count']=$r['evaluado'];
                $arr[]['count']=$r['noevaluado'];
                $arr[]['count']=$r['reclamacion'];
                $arr[]['count']=$r['desacuerdo'];
                $arr[]['count']=$r['total'];
                $arr[]['count']=$r['estadodesarrollo'];
                $arr[]['count']=$r['promedio'];
            }

        }

        foreach($result as $r){
            if($r['estadodesarrollo']==''){
                $arrsinestado[]['count']=$r['porevaluar'];
                $arrsinestado[]['count']=$r['evaluado'];
                $arrsinestado[]['count']=$r['noevaluado'];
                $arrsinestado[]['count']=$r['reclamacion'];
                $arrsinestado[]['count']=$r['desacuerdo'];
                $arrsinestado[]['count']=$r['total'];
                $arrsinestado[]['count']=$r['estadodesarrollo'];
                $arrsinestado[]['count']=$r['promedio'];
            }

        }

        foreach($result as $r){
            if($r['estadodesarrollo']=='En retroceso'){
                $arrenretroceso[]['count']=$r['porevaluar'];
                $arrenretroceso[]['count']=$r['evaluado'];
                $arrenretroceso[]['count']=$r['noevaluado'];
                $arrenretroceso[]['count']=$r['reclamacion'];
                $arrenretroceso[]['count']=$r['desacuerdo'];
                $arrenretroceso[]['count']=$r['total'];
                $arrenretroceso[]['count']=$r['estadodesarrollo'];
                $arrenretroceso[]['count']=$r['promedio'];
            }

        }

        foreach($result as $r){
            if($r['estadodesarrollo']=='Avanza'){
                $arravanza[]['count']=$r['porevaluar'];
                $arravanza[]['count']=$r['evaluado'];
                $arravanza[]['count']=$r['noevaluado'];
                $arravanza[]['count']=$r['reclamacion'];
                $arravanza[]['count']=$r['desacuerdo'];
                $arravanza[]['count']=$r['total'];
                $arravanza[]['count']=$r['estadodesarrollo'];
                $arravanza[]['count']=$r['promedio'];
            }

        }
        foreach($result as $r){
            if($r['estadodesarrollo']=='Estable'){
                $arrestable[]['count']=$r['porevaluar'];
                $arrestable[]['count']=$r['evaluado'];
                $arrestable[]['count']=$r['noevaluado'];
                $arrestable[]['count']=$r['reclamacion'];
                $arrestable[]['count']=$r['desacuerdo'];
                $arrestable[]['count']=$r['total'];
                $arrestable[]['count']=$r['estadodesarrollo'];
                $arrestable[]['count']=$r['promedio'];
            }

        }
        $valores[]=['Por Evaluar','Evaluados','No Evaluados','Reclamacion', 'Desacuerdo', 'Total','Estado desarrollo','Promedio' ];
        $arraytotal[0] = 'Estado de desarrollo:' . ' '.$arr[6]['count'];
        $arraysinestado[0] = 'Estado de desarrollo:' . ' '.'Sin Estado';
        $arrayretroceso[0] = 'Estado de desarrollo:' . ' '.'En retroceso';
        $arrayavanza[0] = 'Estado de desarrollo:' . ' '.'Avanza';
        $arrayestable[0] = 'Estado de desarrollo:' . ' '.'Estable';

        foreach ($arrsinestado as $key => $cant) {
            foreach ($valores as  $v)
                $series[$key]['name'] = $v[$key];
            foreach($arraysinestado as $f){
                $nombre = $nombrenodo .'<br></br><b>'.$f.'</b>' ;
                $series[$key]['data'][] = array($nombre,intval( $cant['count']));
            }


        }

        foreach ($arrenretroceso as $key => $cant) {
            foreach ($valores as  $v)
                $series[$key]['name'] = $v[$key];
            foreach($arrayretroceso as $f){
                $nombre = $nombrenodo .'<br></br><b>'.$f.'</b>' ;
                $series[$key]['data'][] = array($nombre,intval( $cant['count']));
            }


        }
        foreach ($arravanza as $key => $cant) {
            foreach ($valores as  $v)
                $series[$key]['name'] = $v[$key];
            foreach($arrayavanza as $f){
                $nombre = $nombrenodo .'<br></br><b>'.$f.'</b>' ;
                $series[$key]['data'][] = array($nombre,intval( $cant['count']));
            }


        }
        foreach ($arrestable as $key => $cant) {
            foreach ($valores as  $v)
                $series[$key]['name'] = $v[$key];
            foreach($arrayestable as $f){
                $nombre = $nombrenodo .'<br></br><b>'.$f.'</b>' ;
                $series[$key]['data'][] = array($nombre,intval( $cant['count']));
            }


        }
        foreach ($arr as $key => $cant) {
            foreach ($valores as  $v)
                $series[$key]['name'] = $v[$key];
            foreach($arraytotal as $f){
                $nombre = $nombrenodo .'<br></br><b>'.$f.'</b>' ;
                $series[$key]['data'][] = array($nombre,intval( $cant['count']));
            }


        }

        return $series;
    }
    public function getSerieResumenevaluativa($idestructura,$idperiodoproceso,$nombrenodo)
    {
        $objProcEval = new DatEvalpersonaevaluacion();
        $series = array();

        $result = $objProcEval->resumenProcesoEval($idperiodoproceso,$idestructura);

        $arrayestructura = array();
        $arr=array();
        $arrr=array();


        foreach($result as $r){
            if($r['estadodesarrollo']=='Total'){
                $arr[]['count']=$r['porevaluar'];
                $arr[]['count']=$r['evaluado'];
                $arr[]['count']=$r['noevaluado'];
                $arr[]['count']=$r['reclamacion'];
                $arr[]['count']=$r['desacuerdo'];
                $arr[]['count']=$r['total'];
                $arr[]['count']=$r['estadodesarrollo'];
                $arr[]['count']=$r['promedio'];
            }

        }

        foreach($result as $r){
            if($r['estadodesarrollo']==''){
                $arrsinestado[]['count']=$r['porevaluar'];
                $arrsinestado[]['count']=$r['evaluado'];
                $arrsinestado[]['count']=$r['noevaluado'];
                $arrsinestado[]['count']=$r['reclamacion'];
                $arrsinestado[]['count']=$r['desacuerdo'];
                $arrsinestado[]['count']=$r['total'];
                $arrsinestado[]['count']=$r['estadodesarrollo'];
                $arrsinestado[]['count']=$r['promedio'];
            }

        }

        foreach($result as $r){
            if($r['estadodesarrollo']=='En retroceso'){
                $arrenretroceso[]['count']=$r['porevaluar'];
                $arrenretroceso[]['count']=$r['evaluado'];
                $arrenretroceso[]['count']=$r['noevaluado'];
                $arrenretroceso[]['count']=$r['reclamacion'];
                $arrenretroceso[]['count']=$r['desacuerdo'];
                $arrenretroceso[]['count']=$r['total'];
                $arrenretroceso[]['count']=$r['estadodesarrollo'];
                $arrenretroceso[]['count']=$r['promedio'];
            }

        }

        foreach($result as $r){
            if($r['estadodesarrollo']=='Avanza'){
                $arravanza[]['count']=$r['porevaluar'];
                $arravanza[]['count']=$r['evaluado'];
                $arravanza[]['count']=$r['noevaluado'];
                $arravanza[]['count']=$r['reclamacion'];
                $arravanza[]['count']=$r['desacuerdo'];
                $arravanza[]['count']=$r['total'];
                $arravanza[]['count']=$r['estadodesarrollo'];
                $arravanza[]['count']=$r['promedio'];
            }

        }
        foreach($result as $r){
            if($r['estadodesarrollo']=='Estable'){
                $arrestable[]['count']=$r['porevaluar'];
                $arrestable[]['count']=$r['evaluado'];
                $arrestable[]['count']=$r['noevaluado'];
                $arrestable[]['count']=$r['reclamacion'];
                $arrestable[]['count']=$r['desacuerdo'];
                $arrestable[]['count']=$r['total'];
                $arrestable[]['count']=$r['estadodesarrollo'];
                $arrestable[]['count']=$r['promedio'];
            }

        }
        $valores[]=['Por Evaluar','Evaluados','No Evaluados','Reclamacion', 'Desacuerdo', 'Total','Estado desarrollo','Promedio' ];
        $arraytotal[0] = 'Estado de desarrollo:' . ' '.$arr[6]['count'];
        $arraysinestado[0] = 'Estado de desarrollo:' . ' '.'Sin Estado';
        $arrayretroceso[0] = 'Estado de desarrollo:' . ' '.'En retroceso';
        $arrayavanza[0] = 'Estado de desarrollo:' . ' '.'Avanza';
        $arrayestable[0] = 'Estado de desarrollo:' . ' '.'Estable';

        foreach ($arrsinestado as $key => $cant) {
            foreach ($valores as  $v)
                $series[$key]['name'] = $v[$key];
            foreach($arraysinestado as $f){
                $nombre = $nombrenodo .'<br></br><b>'.$f.'</b>' ;
                $series[$key]['data'][] = array($nombre,intval( $cant['count']));
            }


        }

        foreach ($arrenretroceso as $key => $cant) {
            foreach ($valores as  $v)
                $series[$key]['name'] = $v[$key];
            foreach($arrayretroceso as $f){
                $nombre = $nombrenodo .'<br></br><b>'.$f.'</b>' ;
                $series[$key]['data'][] = array($nombre,intval( $cant['count']));
            }


        }
        foreach ($arravanza as $key => $cant) {
            foreach ($valores as  $v)
                $series[$key]['name'] = $v[$key];
            foreach($arrayavanza as $f){
                $nombre = $nombrenodo .'<br></br><b>'.$f.'</b>' ;
                $series[$key]['data'][] = array($nombre,intval( $cant['count']));
            }


        }
        foreach ($arrestable as $key => $cant) {
            foreach ($valores as  $v)
                $series[$key]['name'] = $v[$key];
            foreach($arrayestable as $f){
                $nombre = $nombrenodo .'<br></br><b>'.$f.'</b>' ;
                $series[$key]['data'][] = array($nombre,intval( $cant['count']));
            }


        }
        foreach ($arr as $key => $cant) {
            foreach ($valores as  $v)
                $series[$key]['name'] = $v[$key];
            foreach($arraytotal as $f){
                $nombre = $nombrenodo .'<br></br><b>'.$f.'</b>' ;
                $series[$key]['data'][] = array($nombre,intval( $cant['count']));
            }


        }

        return $series;
    }

    /**********************************************GRAFICO DE DISPERSION************************************************************/
    public function getSeriePersonadispersion($idperiodoproceso, $arrpersona, $nombre)
    {
        $objProcEval = new DatEvalprocesoevaluados();
        $series = array();
        $persEvaluacion = $objProcEval->getResultPersonadispersion($idperiodoproceso, $arrpersona);

        foreach ($persEvaluacion as $key => $evaluacion) {
            if ($evaluacion['nopersona'] == 1) {
                $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($evaluacion['idpersonaevaluado']);
                $series[$key]['name'] = 'Evaluador'.':'.'<b>'.$nombre.'</b>'.'<br></br>'.'Evaluado:'.'<b>'.$estruc[0]->text.'</b>';
            } else {
                $series[$key]['name'] = 'Evaluador'.':'.'<b>'.$nombre.'</b>'.'<br></br>'.'Evaluado:'.'<b>'.$evaluacion['nombreapellidos'].'</b>';
            }

            foreach ($evaluacion['DatEvalpersonaevaluacion'] as $periodoEvaluacion) {
                $series[$key]['data'][] = array(
                    $periodoEvaluacion['DatPeriodoproceso']['denom'],
                    intval($periodoEvaluacion['DatPeriodoproceso']['valor'])
                );
            }

        }

        return $series;
    }

    /******************************************************************************************************************************/
    public function getEvaluadosPeriodoGestor(
        $idperiodoproceso, $limit, $start, $filtro = null
    )
    {


            $query = Doctrine_Manager::getInstance();
            $sql = "SELECT distinct(pev.idpersonaevaluado) as idpersona, pev.idpersonaevaluacion, pev.valor as evaluacion, pev.idpersonaevaluador,docid.numero as numid,
            p.nombre, p.snombre, p.papel, p.sapel, p.sexo, sl.idcargo, encode(f.foto,'escape') as foto
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            INNER JOIN mod_persona.dat_persona p ON(p.idpersona = pev.idpersonaevaluado)
            LEFT JOIN mod_persona.dat_docidentidad docid ON(docid.idpersona = p.idpersona AND docid.principal = 1)
			INNER JOIN mod_persona.dat_personaentidad pe ON(pe.idpersona = p.idpersona and pe.fhasta is null)
            INNER JOIN mod_persona.dat_situacionlaboral sl ON(sl.idpersonaentidad = pe.idpersonaentidad and sl.fhasta is null)
            LEFT JOIN mod_persona.dat_foto f ON(f.idpersona = p.idpersona AND f.principal = 1)
            WHERE pev.idperiodoproceso = {$idperiodoproceso} ";

            if (!empty($filtro)) {
                $sql .= " AND (docid.numero='$filtro' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%'
                    OR p.sapel ILIKE '%$filtro%')";
            }
            if ($limit) {
                $sql .= " LIMIT $limit";
            }

            if ($start) {
                $sql .= " OFFSET $start";
            }

            $evaluados = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

            return $evaluados;


    }
    public function countListPersProcesoEvalGestor(
        $idperiodoproceso,$filtro = null
    )
    {

        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT COUNT(distinct pev.idpersonaevaluacion) AS cantidad
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            INNER JOIN mod_persona.dat_persona p ON(p.idpersona = pev.idpersonaevaluado)
            INNER JOIN mod_persona.dat_personaentidad pe ON(pe.idpersona = p.idpersona)
            INNER JOIN mod_persona.dat_situacionlaboral sl ON(sl.idpersonaentidad = pe.idpersonaentidad)
            LEFT JOIN mod_persona.dat_docidentidad docid ON(docid.idpersona = p.idpersona AND docid.principal = 1)
            WHERE pev.idperiodoproceso = {$idperiodoproceso}";


        if (!empty($filtro)) {
            $sql .= " AND (docid.numero='$filtro' OR p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%'
                    OR p.sapel ILIKE '%$filtro%')";
        }

        $evaluados = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $evaluados[0]['cantidad'];
    }
}
