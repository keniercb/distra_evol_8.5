<?php

class DatEvalpersonaevaluacionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvalpersonaevaluacion $DatEvalpersonaevaluacion)
    {
        $DatEvalpersonaevaluacion->save();
    }

    public function Actualizar(DatEvalpersonaevaluacion $DatEvalpersonaevaluacion)
    {
        $DatEvalpersonaevaluacion->save();
    }

    public function getPersonaEvaluacion($idpersonaevaluacion)
    {
        return $objAux = DatEvalpersonaevaluacion::Buscar($idpersonaevaluacion);
    }

    public function existePersonaEvaluacion($idpersona, $identidad, $idpreprocesoevaluativo)
    {
        $existe = DatEvalpersonaevaluacion::existePersonaEvaluacion($idpersona, $identidad, $idpreprocesoevaluativo);
        if ($existe)
            return true;
        return false;
    }

    public function obtenerPersonaEvaluacion($idpersona, $identidad, $idpreprocesoevaluativo)
    {
        $varAux = DatEvalpersonaevaluacion::obtenerPersonaEvaluacion($idpersona, $identidad, $idpreprocesoevaluativo);
        return $varAux;
    }

    public function getIndicadoresEvalByPersona($idpersonaevaluacion)
    {
        $objIndEval = new DatEvalindicadoresevaluacion();
        $arrInd = $objIndEval->getIndicadoresByPersonEvaluacion($idpersonaevaluacion);
        return $arrInd;
    }

    public function eliminarPorPeriodo($idperiodoproceso)
    {
        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('DatEvalpersonaevaluacion')
                ->where('idperiodoproceso = ?', $idperiodoproceso)
                ->execute();
            return $r;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {
                $r->exception = 1;
                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

    public function getEvaluadosPeriodo($idPeriodoProceso, $idPersonaEvaluador, $firstParent , $filtro, $limit = 25 , $start = 0)
    {

        $query = Doctrine_Manager::getInstance();

        $parent = $firstParent ? 'null' : 'pev.idpersonaevaluador';

        $sql = "SELECT pev.idpersonaevaluacion, pev.estado, pev.valor, pev.idmodelo, pev.idplanilla, pev.idperiodoproceso,
            pev.idescala, pev.idpersonaevaluado as idpersona, pev.idpersonaevaluador, nevc.denom AS estadodesarrollo,pe.planilla,
            evc.color AS colorestadodes, {$parent} as _parent, false as _is_leaf, pev.nopersona as nopersona, p.nombre,p.sapel,p.papel,p.snombre,pev.deacuerdo,pev.idcaso
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            INNER JOIN  mod_evaluaciones.dat_periodoproceso pe ON(pe.idperiodoproceso = pev.idperiodoproceso)
            LEFT JOIN  mod_evaluaciones.dat_evalescalavalorescualitativos evc ON(evc.idescalavalorescualitativos = pev.idestadodesarrollo)
            LEFT JOIN  mod_evaluaciones.nom_evalvalorescualitativos nevc ON(nevc.idvalorescualitativos = evc.idvalorescualitativos)
            LEFT JOIN  mod_persona.dat_persona p ON(p.idpersona = pev.idpersonaevaluado)
            WHERE pev.idperiodoproceso = {$idPeriodoProceso} AND pev.idpersonaevaluador = {$idPersonaEvaluador}";
        if($filtro){
           $sql.= "AND (p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%') AND pev.idpersonaevaluador = $idPersonaEvaluador AND pev.idperiodoproceso = $idPeriodoProceso  ";
        }

        $evaluados = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($evaluados as &$evaluado) {		

		    $data = array();
            switch ($evaluado['nopersona']) {
                case 1:
                    $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($evaluado['idpersona']);
                    $ruta = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($evaluado['idpersona']));
                    if (!empty($estruc)) {
                        $data['foto'] = $estruc[0]->icon;
                        $evaluado['icon'] = $estruc[0]->icon;
                        $evaluado['nombre'] = $estruc[0]->text;
                        $data['nombreapellidos'] = $ruta[0]['rutaDenominacion'];
                    }
                    break;
                default:
                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($evaluado['idpersona'],null,null,null,null,null,null);

					$data['foto'] = $persona->data[0]['foto'] ? 'data:image/png;base64,' . $persona->data[0]['foto'] : null;
                    $data['nombreapellidos'] = $persona->data[0]['nombreapellidos'];
                    $evaluado['numid'] = $persona->data[0]['numid'];
                    $evaluado['nombre'] = $persona->data[0]['nombre'];
                    $evaluado['snombre'] = $persona->data[0]['snombre'];
                    $evaluado['papel'] = $persona->data[0]['papel'];
                    $evaluado['sapel'] = $persona->data[0]['sapel'];
                    $evaluado['sexo'] = $persona->data[0]['sexo'];
                    $evaluado['denomsexo'] = $persona->data[0]['denomsexo'];
					$evaluado['cargo'] = $persona->data[0]['denomcargo'];

                    break;
            }
            $evaluado['foto'] = $data['foto'];
            $evaluado['nombrecompleto'] = $data['nombreapellidos'];
			if (empty($evaluado['idescala'])) {
                $evaluado['evaluacion'] = $evaluado['valor'];
            } else {
                $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($evaluado['idescala']);
                foreach ($valoresEscala as $valorEscala) {
                    if ($valorEscala['valor'] == $evaluado['valor']) {
                        $evaluado['evaluacion'] = $valorEscala['denom'];
                        $evaluado['color'] = $valorEscala['color'];
                        break;
                    }
                }
            }

        }	

		return $evaluados;
    }

    /**************************************reclamacion*************************************************/
    public function getEvaluadosPeriodorec($idPeriodoProceso, $idPersonaEvaluador, $firstParent = true, $limit = 25, $start = 0)
    {
        $query = Doctrine_Manager::getInstance();

        $parent = $firstParent ? 'null' : 'pev.idpersonaevaluador';
        $sql = "SELECT pev.idpersonaevaluacion, pev.estado, pev.valor, pev.idmodelo, pev.idplanilla, pev.idperiodoproceso,pev.idescala,
            pev.idpersonaevaluado as idpersona, pev.idpersonaevaluador, nevc.denom AS estadodesarrollo,
            evc.color AS colorestadodes, {$parent} as _parent, false as _is_leaf,rec.idreclamacion,rec.fecha,rec.opinion, res.procede, res.respuesta, n.tiemporeclamacion, n.tiemporespuesta
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            LEFT JOIN  mod_evaluaciones.dat_evalescalavalorescualitativos evc ON(evc.idescalavalorescualitativos = pev.idestadodesarrollo)
            LEFT JOIN  mod_evaluaciones.dat_reclamacion rec ON(rec.idpersonaevaluacion = pev.idpersonaevaluacion)
            LEFT JOIN  mod_evaluaciones.dat_respuestareclamacion res ON(res.idresponsable = pev.idpersonaevaluador)
            LEFT JOIN  mod_evaluaciones.dat_nivelreclamacion n ON(n.idnivelreclamacion = res.idnivelreclamacion)
            LEFT JOIN  mod_evaluaciones.nom_evalvalorescualitativos nevc ON(nevc.idvalorescualitativos = evc.idvalorescualitativos)
            WHERE pev.idperiodoproceso = {$idPeriodoProceso} AND pev.idpersonaevaluador = {$idPersonaEvaluador} AND pev.hareclamado=1";

        $evaluados = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        foreach ($evaluados as &$evaluado) {
            $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($evaluado['idpersona']);

            $evaluado['foto'] = $persona->data[0]['foto'];
            $evaluado['numid'] = $persona->data[0]['numid'];
            $evaluado['nombre'] = $persona->data[0]['nombre'];
            $evaluado['snombre'] = $persona->data[0]['snombre'];
            $evaluado['papel'] = $persona->data[0]['papel'];
            $evaluado['sapel'] = $persona->data[0]['sapel'];
            $evaluado['nombrecompleto'] = $persona->data[0]['nombreapellidos'];
            $evaluado['sexo'] = $persona->data[0]['sexo'];
            if (!empty($persona->data[0]['idcargo'])) {
                $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($persona->data[0]['idcargo'],true,true);
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

///////////////////////////////resumen reclamacion/////////////////////////////////////////////////////
    public function getResumenReclamacion($idpersona, $idpersonaevaluacion, $idPeriodoProceso, $limit = 10, $start = 0)
    {
        $query = Doctrine_Manager::getInstance();
        $parent = $firstParent ? 'null' : 'pev.idpersonaevaluador';
        $sql = "SELECT pev.idpersonaevaluacion, pev.estado, pev.valor, pev.idmodelo, pev.idplanilla, pev.idperiodoproceso,pev.idescala,
            pev.idpersonaevaluado as idpersona, pev.idpersonaevaluador, nevc.denom AS estadodesarrollo,
            evc.color AS colorestadodes, {$parent} as _parent, false as _is_leaf,rec.fecha, rec.opinion, res.procede, res.respuesta, n.tiemporeclamacion, n.tiemporespuesta,
			n.idnivelreclamacion, n.denominacion, n.nivel
            FROM mod_evaluaciones.dat_evalpersonaevaluacion pev
            LEFT JOIN  mod_evaluaciones.dat_evalescalavalorescualitativos evc ON(evc.idescalavalorescualitativos = pev.idestadodesarrollo)
            LEFT JOIN  mod_evaluaciones.dat_reclamacion rec ON(rec.idpersonaevaluacion = pev.idpersonaevaluacion)
            LEFT JOIN  mod_evaluaciones.dat_respuestareclamacion res ON(res.idresponsable = pev.idpersonaevaluador)
            LEFT JOIN  mod_evaluaciones.dat_nivelreclamacion n ON(n.idnivelreclamacion = res.idnivelreclamacion)
            LEFT JOIN  mod_evaluaciones.nom_evalvalorescualitativos nevc ON(nevc.idvalorescualitativos = evc.idvalorescualitativos)
            WHERE pev.idperiodoproceso = {$idPeriodoProceso} AND pev.idpersonaevaluado = {$idpersona} AND pev.hareclamado=1 AND pev.idpersonaevaluacion={$idpersonaevaluacion}";

        $evaluados = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($evaluados as &$evaluado) {
            $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($evaluado['idpersona']);

            $evaluado['foto'] = $persona->data[0]['foto'];
            $evaluado['numid'] = $persona->data[0]['numid'];
            $evaluado['nombre'] = $persona->data[0]['nombre'];
            $evaluado['snombre'] = $persona->data[0]['snombre'];
            $evaluado['papel'] = $persona->data[0]['papel'];
            $evaluado['sapel'] = $persona->data[0]['sapel'];
            $evaluado['nombrecompleto'] = $persona->data[0]['nombreapellidos'];
            $evaluado['sexo'] = $persona->data[0]['sexo'];
            if (!empty($persona->data[0]['idcargo'])) {
                $datosCargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($persona->data[0]['idcargo'],true,true);
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

    public function agregarOpinion($idpersonaevaluacion, $acuerdo, $opinion)
    {
        $PersonaEval = Doctrine::getTable('DatEvalpersonaevaluacion')->find($idpersonaevaluacion);
        if ($acuerdo == 'deacuerdo') {
            $PersonaEval->estado = 1;
            $PersonaEval->deacuerdo = 1;
        } else {
            $PersonaEval->estado = 2;
            $PersonaEval->deacuerdo = 2;
            $PersonaEval->hareclamado = 1;
        }

        //Almacena la reclamacion
        $PersonaEval->DatReclamacion->opinion = $opinion;
        //Almacena quien debe ser el responsable en dar respuesta a la reclamacion
        $PersonaEval->DatReclamacion->DatRespuestareclamacion[0]->idresponsable = $PersonaEval->idpersonaevaluador;
        $objNivelRec = new DatNivelreclamacion();
        $niveles = $objNivelRec->getNiveles($PersonaEval->idperiodoproceso);
        if (!empty($niveles)) {
            $PersonaEval->DatReclamacion->DatRespuestareclamacion[0]->idnivelreclamacion = $niveles[0]['idnivelreclamacion'];
        }
        $PersonaEval->save();
    }

   /* public function updValorfinal($idpersonaevaluacion,$idpersona,$valor){

        return DatEvalpersonaevaluacion::updValorfinal($idpersonaevaluacion,$idpersona,$valor);

    }*/
    public function updValorfinal($persona,$valor){

        return DatEvalpersonaevaluacion::updValorfinal($persona,$valor);

    }

    public function updOpinionEval($opinion,$idpersonaevaluacion){
        return DatEvalpersonaevaluacion::updOpinionEval($opinion,$idpersonaevaluacion);
    }


}
