<?php

/**
 * @author    Mairelys Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpExportarModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Nombre de la función exportarAction
     * Descripcion Funcion que se encarga de conformar los arreglos que
     * contienen los datos de los elementos seleccionados y sus relaciones
     * en dependencia de la seleccion del usuario.
     *
     * @author * Mairelys Fernandez
     */
    public function ObtenerElementosParaExportar(
        $idusuario, $arrayidelementos, $tipoelemento, $respuesta,
        $relacionEntreElem
    ) {
        $procede = 0;
        //$estainsertado = 0;
        if (isset($arrayidelementos[0])) {
            foreach ($arrayidelementos as $key => $idelemento) {
                if ($tipoelemento != 5) {
                    $existe = Doctrine::getTable('DatElementos')->find(
                        $idelemento
                    );
                    if (isset($existe->idelemento)) {
                        $tipoelemento = $existe->idtipoelemento;
                        $procede = 1;
                    }
                    if ($procede) {
                        $respuesta = $this->ExportarElementoDadoId(
                            $existe, $respuesta
                        );
                        switch ($tipoelemento) {
                            case 0:
                                $respuesta = $this->ExportarPlanDadoId(
                                    $idelemento, $respuesta, $idusuario,
                                    $relacionEntreElem
                                );
                                break;
                            case 1:
                                $respuesta = $this->ExportarObjetivoDadoId(
                                    $idelemento, $respuesta, $relacionEntreElem
                                );
                                if ($relacionEntreElem == 1) {
                                    $respuesta
                                        = $this->ExportarArcDadoIdObjetivo(
                                        $idelemento, $idusuario, $respuesta
                                    );
                                }
                                break;
                            case 2:
                                $respuesta = $this->ExportarFipDadoId(
                                    $idelemento, $respuesta
                                );
                                break;
                            case 3:
                                $respuesta = $this->ExportarActividadesDadoId(
                                    $idelemento, $idusuario, $respuesta,
                                    $relacionEntreElem
                                );
                                break;
                        }

                        $respuesta = $this->ExportarInvolucradosDadoIdElemento(
                            $idelemento, $respuesta
                        );
                        $respuesta = $this->ExportarNomencladoresDadoIdElemento(
                            $idelemento, $respuesta
                        );
                        if ($relacionEntreElem == 1) {
                            $respuesta
                                = $this->ExportarRelacionesDadoIdElemento(
                                $idelemento, $idusuario, $respuesta
                            );
                        }
                    }
                } else {

                    $respuesta = $this->ExportarArcDadoId(
                        $idelemento, $respuesta, $idusuario, $relacionEntreElem
                    );
                }
            }
        }

        return $respuesta;
    }

    public function ExportarElementoDadoId($existe, $respuesta)
    {
        if (!isset($respuesta['dat_elementos'][$existe->idelemento])) {
            $respuesta['dat_elementos'][$existe->idelemento]['idelemento']
                = $existe->idelemento;
            $respuesta['dat_elementos'][$existe->idelemento]['idtipoelemento']
                = $existe->idtipoelemento;
            $respuesta['dat_elementos'][$existe->idelemento]['denelemento']
                = $existe->denelemento;
            $respuesta['dat_elementos'][$existe->idelemento]['descelemento']
                = $existe->descelemento;
            $respuesta['dat_elementos'][$existe->idelemento]['idusuariocrea']
                = $existe->idusuariocrea;
            $respuesta['dat_elementos'][$existe->idelemento]['llevahistorial']
                = $existe->llevahistorial;
            $respuesta['dat_elementos'][$existe->idelemento]['activo']
                = $existe->activo;
            $respuesta['dat_elementos'][$existe->idelemento]['gradocumplimiento']
                = $existe->gradocumplimiento;
            $respuesta['dat_elementos'][$existe->idelemento]['privado']
                = $existe->privado;
            $respuesta['dat_elementos'][$existe->idelemento]['participante']
                = $existe->participante;
            $respuesta['dat_elementos'][$existe->idelemento]['idestadoaprob']
                = $existe->idestadoaprob;
            $respuesta['dat_elementos'][$existe->idelemento]['estadocumplimiento']
                = $existe->estadocumplimiento;
            $respuesta['dat_elementos'][$existe->idelemento]['dirigente']
                = $existe->dirigente;
        }
        return $respuesta;
    }

    public function ExportarPlanDadoId(
        $idelemento, $respuesta, $idusuario, $relacionEntreElem
    ) {
        $estainsertado = 0;
        $objdatplan = new DatPlanPdo();
        $plan = $objdatplan->GetPlanDadoId($idelemento);
        if (!isset($respuesta['dat_plan_pdo'][$idelemento])) {
            $respuesta['dat_plan_pdo'][$idelemento]['idplan'] = $plan['idplan'];
            $respuesta['dat_plan_pdo'][$idelemento]['fechainicio']
                = $plan['fechainicio'];
            $respuesta['dat_plan_pdo'][$idelemento]['fechafin']
                = $plan['fechafin'];
        }
        if ($relacionEntreElem == 1) {
            $respuesta = $this->ExportarArcDadoIdPlan(
                $plan['idplan'], $respuesta, $idusuario
            );
        }
        return $respuesta;
    }

    public function ExportarObjetivoDadoId(
        $idelemento, $respuesta, $relacionEntreElem
    ) {
        $objdatobj = new DatObjetivo();
        $objetivo = $objdatobj->existeObjetivo($idelemento);
        if (!isset($respuesta['dat_objetivo'][$idelemento])) {
            $respuesta['dat_objetivo'][$idelemento]['idobjetivo']
                = $objetivo[0]['idobjetivo'];
            $respuesta['dat_objetivo'][$idelemento]['fechainicio']
                = $objetivo[0]['fechainicio'];
            $respuesta['dat_objetivo'][$idelemento]['fechafin']
                = $objetivo[0]['fechafin'];
        }
        if ($relacionEntreElem == 1) {
            $respuesta = $this->ExportarCriterioMedidaDadoIdObjetivo(
                $idelemento, $respuesta
            );
        }
        return $respuesta;
    }

    public function ExportarCriterioMedidaDadoIdObjetivo(
        $idelemento, $respuesta
    ) {
        $objdatobj = new DatObjetivo();
        $arraycriteriosmedida = $objdatobj->datosCriterioMedida($idelemento);
        foreach ($arraycriteriosmedida as $key => $criterio) {
            if (!isset($respuesta['dat_criteriomedida'][$idelemento])) {
                $respuesta['dat_criteriomedida'][$idelemento]['idcriteriomedida']
                    = $criterio['idcriteriomedida'];
                $respuesta['dat_criteriomedida'][$idelemento]['idumedida']
                    = $criterio['idumedida'];
                $respuesta['dat_criteriomedida'][$idelemento]['idobjetivo']
                    = $criterio['idobjetivo'];
                $respuesta['dat_criteriomedida'][$idelemento]['idestadocump']
                    = $criterio['idestadocump'];
                $respuesta['dat_criteriomedida'][$idelemento]['dencriterio']
                    = $criterio['dencriterio'];
                $respuesta['dat_criteriomedida'][$idelemento]['fechainicio']
                    = $criterio['fechainicio'];
                $respuesta['dat_criteriomedida'][$idelemento]['fechafin']
                    = $criterio['fechafin'];
                $respuesta['dat_criteriomedida'][$idelemento]['valormeta']
                    = $criterio['valormeta'];
                $respuesta['dat_criteriomedida'][$idelemento]['valoreal']
                    = $criterio['valoreal'];
                $respuesta['dat_criteriomedida'][$idelemento]['participante']
                    = $criterio['participante'];
                $respuesta['dat_criteriomedida'][$idelemento]['descriterio']
                    = $criterio['descriterio'];
                $respuesta['dat_criteriomedida'][$idelemento]['gradocumplimiento']
                    = $criterio['gradocumplimiento'];
                $respuesta['dat_criteriomedida'][$idelemento]['estadocumplimiento']
                    = $criterio['estadocumplimiento'];
                $respuesta['dat_criteriomedida'][$idelemento]['idusuariocrea']
                    = $criterio['idusuariocrea'];
            }
            $respuesta = $this->ExportarInvolucradosDadoCriterioMedida(
                $arraycriteriosmedida, $respuesta
            );
            $estainsertado = 0;
        }
        return $respuesta;
    }

    public function ExportarInvolucradosDadoCriterioMedida(
        $arraycriteriosmedida, $respuesta
    ) {
        foreach ($arraycriteriosmedida as $criterio) {
            $objdatelemtdatelemt = new DatCriterioDatInvolucrados();
            $involucradosxcrit
                = $objdatelemtdatelemt->BuscarRelacionesDelCriterio(
                $criterio['idcriteriomedida']
            );
            if (isset($involucradosxcrit[0])) {
                foreach ($involucradosxcrit as $involucrado) {
                    $iddatcriteriodatinvolucrados
                        = $involucrado['idcriteriomedida'] . '-'
                        . $involucrado['idinvolucrado'];
                    if (!isset($respuesta['dat_criteriomedida_dat_involucrados'][$iddatcriteriodatinvolucrados])) {
                        $involucrado['idcriteriomedida']
                            = $involucrado['idcriteriomedida'];
                        $involucrado['idinvolucrado']
                            = $involucrado['idinvolucrado'];
                        $involucrado['llaveinvolucrado']
                            = $involucrado['llaveinvolucrado'];
                        $respuesta['dat_criteriomedida_dat_involucrados'][$iddatcriteriodatinvolucrados]
                            = $involucrado;
                    }
                }
            }
            $estainsertado = 0;
        }
        return $respuesta;
    }

    public function ExportarArcDadoIdObjetivo(
        $idelemento, $idusuario, $respuesta
    ) {
        $objdatarcdatplanobj = new DatArcDatPlanObjetivo();
        $arrayrelacionesarc = $objdatarcdatplanobj->ExisteRelacioncionArc_Obj(
            $idelemento, $idusuario
        );
        if (isset($arrayrelacionesarc[0])) {
            foreach ($arrayrelacionesarc as $relhijas) {
                $iddatarcdatplanobjetivo
                    = $relhijas['idarc'] . '-' . $relhijas['idplan'] . '-'
                    . $relhijas['idobjetivo'];
                if (!isset($respuesta['dat_arc_dat_plan_objetivo'][$iddatarcdatplanobjetivo])) {
                    $relacionesarcobj['idarc'] = $relhijas['idarc'];
                    $relacionesarcobj['idplan'] = $relhijas['idplan'];
                    $relacionesarcobj['idobjetivo'] = $relhijas['idobjetivo'];
                    $relacionesarcobj['idautor'] = $relhijas['idautor'];
                    $respuesta['dat_arc_dat_plan_objetivo'][$iddatarcdatplanobjetivo]
                        = $relacionesarcobj;
                    $array[0] = $relhijas['idarc'];
                    $respuesta = $this->ObtenerElementosParaExportar(
                        $idusuario, $array, 5, $respuesta, 1
                    );
                }
            }
            foreach ($arrayrelacionesarc as $relhijas) {
                $iddatarcdatplan
                    = $relhijas['idarc'] . '-' . $relhijas['idplan'];
                if (!isset($respuesta['dat_arc_dat_plan'][$iddatarcdatplan])) {
                    $relacionesarcplan['idarc'] = $relhijas['idarc'];
                    $relacionesarcplan['idplan'] = $relhijas['idplan'];
                    $relacionesarcplan['idautorrelacion']
                        = $relhijas['idautor'];
                    $respuesta['dat_arc_dat_plan'][$iddatarcdatplan]
                        = $relacionesarcplan;
                }
            }
            foreach ($arrayrelacionesarc as $relhijas) {
                $array[0] = $relhijas['idplan'];
                $respuesta = $this->ObtenerElementosParaExportar(
                    $idusuario, $array, 0, $respuesta, 1
                );
            }
        }
        return $respuesta;
    }

    public function ExportarFipDadoId($idelemento, $respuesta)
    {
        $objdatfip = new DatFip();
        $fip = $objdatfip->GetDatosFip($idelemento);
        if (!isset($respuesta['dat_fip'][$idelemento])) {
            $respuesta['dat_fip'][$idelemento]['idfip'] = $fip[0]['idfip'];
            $respuesta['dat_fip'][$idelemento]['emite'] = $fip[0]['emite'];
            $respuesta['dat_fip'][$idelemento]['fechaemision']
                = $fip[0]['fechaemision'];
            $respuesta['dat_fip'][$idelemento]['fechacumplimiento']
                = $fip[0]['fechacumplimiento'];
            $respuesta['dat_fip'][$idelemento]['fechacumplio']
                = $fip[0]['fechacumplio'];
            $respuesta['dat_fip'][$idelemento]['numfip'] = $fip[0]['numfip'];
            $respuesta['dat_fip'][$idelemento]['documentorigen']
                = $fip[0]['documentorigen'];
        }
        return $respuesta;
    }

    public function ExportarActividadesDadoId(
        $idelemento, $idusuario, $respuesta, $relacionEntreElem
    ) {
        $objdatact = new DatActividades();
        $act = $objdatact->GetDatosAct($idelemento);
        if (!isset($respuesta['dat_actividades'][$idelemento])) {
            $respuesta['dat_actividades'][$idelemento]['idactividad']
                = $act[0]['idactividad'];
            $respuesta['dat_actividades'][$idelemento]['tiporepeticion']
                = $act[0]['tiporepeticion'];
            $respuesta['dat_actividades'][$idelemento]['fechainicio']
                = $act[0]['fechainicio'];
            $respuesta['dat_actividades'][$idelemento]['fechafin']
                = $act[0]['fechafin'];
            $respuesta['dat_actividades'][$idelemento]['horainicio']
                = $act[0]['horainicio'];
            $respuesta['dat_actividades'][$idelemento]['horafin']
                = $act[0]['horafin'];
            $respuesta['dat_actividades'][$idelemento]['lugar']
                = $act[0]['lugar'];
            $respuesta['dat_actividades'][$idelemento]['esprincipal']
                = $act[0]['esprincipal'];
        }
        if ($relacionEntreElem == 1) {
            $respuesta = $this->ExportarArcDadoIdActividad(
                $idelemento, $idusuario, $respuesta
            );
        }

        return $respuesta;
    }

    public function ExportarArcDadoIdActividad(
        $idelemento, $idusuario, $respuesta
    ) {
        $objdatarcdatplanact = new DatArcDatPlanActividades();
        $arrayrelacionesarc = $objdatarcdatplanact->ExisteRelacioncionArc_Act(
            $idelemento, $idusuario
        );

        if (isset($arrayrelacionesarc[0])) {
            foreach ($arrayrelacionesarc as $relhijas) {
                $iddatarcdatplanactividades
                    = $relhijas['idarc'] . '-' . $relhijas['idplan'] . '-'
                    . $relhijas['idactividad'];
                if (!isset($respuesta['dat_arc_dat_plan_actividades'][$iddatarcdatplanactividades])) {
                    $relacionesarcact['idarc'] = $relhijas['idarc'];
                    $relacionesarcact['idplan'] = $relhijas['idplan'];
                    $relacionesarcact['idactividad'] = $relhijas['idactividad'];
                    $relacionesarcact['idautor'] = $relhijas['idautor'];
                    $respuesta['dat_arc_dat_plan_actividades'][$iddatarcdatplanactividades]
                        = $relacionesarcact;
                    $array[0] = $relhijas['idarc'];
                    $respuesta = $this->ObtenerElementosParaExportar(
                        $idusuario, $array, 5, $respuesta, 1
                    );
                }
            }
            foreach ($arrayrelacionesarc as $relhijasb) {
                $iddatarcdatplan
                    = $relhijasb['idarc'] . "-" . $relhijasb['idplan'];
                if (!isset($respuesta['dat_arc_dat_plan'][$iddatarcdatplan])) {
                    $relacionesarcplan['idarc'] = $relhijasb['idarc'];
                    $relacionesarcplan['idplan'] = $relhijasb['idplan'];
                    $relacionesarcplan['idautorrelacion']
                        = $relhijasb['idautor'];
                    $respuesta['dat_arc_dat_plan'][$iddatarcdatplan]
                        = $relacionesarcplan;
                }
            }
            foreach ($arrayrelacionesarc as $relhijasl) {
                $array[0] = $relhijasl['idplan'];
                $respuesta = $this->ObtenerElementosParaExportar(
                    $idusuario, $array, 0, $respuesta, 1
                );
            }
        }
        return $respuesta;
    }

    public function ExportarInvolucradosDadoIdElemento($idelemento, $respuesta)
    {
        $objinvol = new DatElementosDatInvolucrados();
        $result = $objinvol->datosRelacionElemInvol($idelemento);
        foreach ($result as $relacioneleminvol) {
            $iddatelementosdatinvolucrados
                = $relacioneleminvol['idelemento'] . '-'
                . $relacioneleminvol['idinvolucrado'];
            if (!isset($respuesta['dat_elementos_dat_involucrados'][$iddatelementosdatinvolucrados])) {
                $datosrelacion['idelemento'] = $relacioneleminvol['idelemento'];
                $datosrelacion['idinvolucrado']
                    = $relacioneleminvol['idinvolucrado'];
                $datosrelacion['llaveinvolucrado']
                    = $relacioneleminvol['llaveinvolucrado'];
                $respuesta['dat_elementos_dat_involucrados'][$iddatelementosdatinvolucrados]
                    = $datosrelacion;
            }
        }
        return $respuesta;
    }

    public function ExportarNomencladoresDadoIdElemento($idelemento, $respuesta)
    {

        $objdatelemnomenclador = new DatElementosNomNomenclador();
        $respelemnom = $objdatelemnomenclador->GetDatosDatElemenNomenclador(
            $idelemento
        );
        foreach ($respelemnom as $nom) {
            $iddatelementosnomnomenclador
                = $nom['idelemento'] . '-' . $nom['idnomenclador'];
            if (!isset($respuesta['dat_elementos_nom_nomenclador'][$iddatelementosnomnomenclador])) {
                $elementosnomnom['idelemento'] = $nom['idelemento'];
                $elementosnomnom['idnomenclador'] = $nom['idnomenclador'];
                $elementosnomnom['tiponomenclador'] = $nom['tiponomenclador'];
                $respuesta['dat_elementos_nom_nomenclador'][$iddatelementosnomnomenclador]
                    = $elementosnomnom;
            }
            $estainsertado = 0;
        }
        return $respuesta;
    }

    public function ExportarRelacionesDadoIdElemento(
        $idelemento, $idusuario, $respuesta
    ) {
        $objdatelemdatelem = new DatElementosDatElementos();
        $arrayrelacionados
            = $objdatelemdatelem->ElementosRelacionadosDadoIdElemento(
            $idelemento, $idusuario
        );
        if (isset($arrayrelacionados[0])) {
            foreach ($arrayrelacionados as $relacion) {
                $iddatelementosdatelementos = $relacion['idelementopadre'] . '-'
                    . $relacion['idelementohijo'];
                if (!isset($respuesta['dat_elementos_dat_elementos'][$iddatelementosdatelementos])) {
                    $elemelem['idelementopadre'] = $relacion['idelementopadre'];
                    $elemelem['idelementohijo'] = $relacion['idelementohijo'];
                    $elemelem['origen'] = $relacion['origen'];
                    $elemelem['idautor'] = $relacion['idautor'];
                    $elemelem['nivelrelacion'] = $relacion['nivelrelacion'];
                    $respuesta['dat_elementos_dat_elementos'][$iddatelementosdatelementos]
                        = $elemelem;
                    $array[0] = ($relacion['idelementohijo'] == $idelemento)
                        ? $relacion['idelementopadre']
                        : $relacion['idelementohijo'];
                    $respuesta = $this->ObtenerElementosParaExportar(
                        $idusuario, $array, 6, $respuesta, 1
                    );
                }
            }
        }
        return $respuesta;
    }

    public function ExportarArcDadoId(
        $idarc, $respuesta, $idusuario, $relacionEntreElem
    ) {
        $existe = Doctrine::getTable('DatArc')->find($idarc);
        if (isset($existe->idarc)) {
            $procede = 1;
        }
        if ($procede) {
            $objdatarc = new DatArc();
            $arc = $objdatarc->dameDatosARC($idarc);
            if (!isset($respuesta['dat_arc'][$idarc])) {
                $respuesta['dat_arc'][$idarc]['idarc'] = $arc[0]['idarc'];
                $respuesta['dat_arc'][$idarc]['idarcp'] = $arc[0]['idarcp'];
                $respuesta['dat_arc'][$idarc]['denarc'] = $arc[0]['denarc'];
                $respuesta['dat_arc'][$idarc]['descrip'] = $arc[0]['descrip'];
                $respuesta['dat_arc'][$idarc]['idusuariocrea']
                    = $arc[0]['idusuariocrea'];
                $respuesta['dat_arc'][$idarc]['fechacreacion']
                    = $arc[0]['fechacreacion'];
                $respuesta['dat_arc'][$idarc]['fechainicio']
                    = $arc[0]['fechainicio'];
                $respuesta['dat_arc'][$idarc]['fechafin'] = $arc[0]['fechafin'];
                $respuesta['dat_arc'][$idarc]['activo'] = $arc[0]['activo'];
                $respuesta['dat_arc'][$idarc]['caduca'] = $arc[0]['caduca'];
            }
            $respuesta = $this->ExportarInvolucradosDadoIDArc(
                $idarc, $respuesta
            );

            if ($relacionEntreElem == 1) {
                $hijos = $objdatarc->DameHijosPorIdpadre($idarc, $idusuario);
                foreach ($hijos as $h) {
                    $respuesta = $this->ExportarArcDadoId(
                        $h['idarc'], $respuesta, $idusuario, $relacionEntreElem
                    );
                }
                $respuesta = $this->ExportarPlanDadoIdArc(
                    $idarc, $respuesta, $idusuario
                );
                $respuesta = $this->ExportarActividadDadoIdArc(
                    $idarc, $respuesta, $idusuario
                );
                $respuesta = $this->ExportarObjetivoDadoIdArc(
                    $idarc, $respuesta, $idusuario
                );
            }
        }
        return $respuesta;
    }

    public function ExportarInvolucradosDadoIDArc($idarc, $respuesta)
    {
        $objdatarcdatinv = new DatArcDatInvolucrados();
        $involarc = $objdatarcdatinv->datosRelacionARCInvol($idarc);
        foreach ($involarc as $relacionarcinvol) {
            for (
                $key = 0; $key < count($respuesta['dat_arc_dat_involucrados']);
                $key++
            ) {
                if ($respuesta['dat_arc_dat_involucrados'][$key]['idarc']
                    == $relacionarcinvol['idarc']
                    && $respuesta['dat_arc_dat_involucrados'][$key]['idinvolucrado']
                    == $relacionarcinvol['idinvolucrado']
                ) {
                    $estainsertado = 1;
                }
            }
            if ($estainsertado == 0) {
                $datosrelarcinvol['idarc'] = $relacionarcinvol['idarc'];
                $datosrelarcinvol['idinvolucrado']
                    = $relacionarcinvol['idinvolucrado'];
                $datosrelarcinvol['llaveinvolucrado']
                    = $relacionarcinvol['llaveinvolucrado'];
                $contador = count($respuesta['dat_arc_dat_involucrados']);
                $respuesta['dat_arc_dat_involucrados'][$contador]
                    = $datosrelarcinvol;
            }
            $estainsertado = 0;
        }
        return $respuesta;
    }

    public function ExportarPlanDadoIdArc($idarc, $respuesta, $idusuario)
    {
        $objdatarcdatplan = new DatArcDatPlan();
        $arcplan = $objdatarcdatplan->obtenerPlanDadoArc($idarc, $idusuario);
        if (isset($arcplan[0])) {
            foreach ($arcplan as $ap) {
                $iddatarcdatplan = $ap['idarc'] . '-' . $ap['idplan'];
                if (!isset($respuesta['dat_arc_dat_plan'][$iddatarcdatplan])) {
                    $relacionesarcplan['idarc'] = $ap['idarc'];
                    $relacionesarcplan['idplan'] = $ap['idplan'];
                    $relacionesarcplan['idautorrelacion']
                        = $ap['idautorrelacion'];
                    $respuesta['dat_arc_dat_plan'][$iddatarcdatplan]
                        = $relacionesarcplan;
                    $array[0] = $ap['idplan'];
                    $respuesta = $this->ObtenerElementosParaExportar(
                        $idusuario, $array, 0, $respuesta, 1
                    );
                }
            }
        }
        return $respuesta;
    }

    public function ExportarArcDadoIdPlan($idplan, $respuesta, $idusuario)
    {
        $objdatarcdatplan = new DatArcDatPlan();
        $arcplan = $objdatarcdatplan->obtenerArcDadoPlan($idplan, $idusuario);
        if (isset($arcplan[0])) {
            foreach ($arcplan as $ap) {
                $iddatarcdatplan = $ap['idarc'] . '-' . $ap['idplan'];
                if (!isset($respuesta['dat_arc_dat_plan'][$iddatarcdatplan])) {
                    $relacionesarcplan['idarc'] = $ap['idarc'];
                    $relacionesarcplan['idplan'] = $ap['idplan'];
                    $relacionesarcplan['idautorrelacion']
                        = $ap['idautorrelacion'];
                    $respuesta['dat_arc_dat_plan'][$iddatarcdatplan]
                        = $relacionesarcplan;

                    $array[0] = $ap['idarc'];
                    $respuesta = $this->ObtenerElementosParaExportar(
                        $idusuario, $array, 5, $respuesta, 1
                    );
                }
            }
        }
        return $respuesta;
    }

    public function ExportarActividadDadoIdArc($idarc, $respuesta, $idusuario)
    {
        $model = new DatArcDatPlanActividades();
        $arcplanactividades = $model->ObtenerPlanYActividadesDadoIdArc(
            $idarc, $idusuario
        );
        if (isset($arcplanactividades[0])) {
            foreach ($arcplanactividades as $apa) {
                $iddatarcdatplanactividades
                    = $apa['idarc'] . '-' . $apa['idplan'] . '-'
                    . $apa['idactividad'];
                if (!isset($respuesta['dat_arc_dat_plan_actividades'][$iddatarcdatplanactividades])) {
                    $relacionesarcact['idarc'] = $apa['idarc'];
                    $relacionesarcact['idplan'] = $apa['idplan'];
                    $relacionesarcact['idactividad'] = $apa['idactividad'];
                    $relacionesarcact['idautor'] = $apa['idautor'];
                    $respuesta['dat_arc_dat_plan_actividades'][$iddatarcdatplanactividades]
                        = $relacionesarcact;
                    $array[0] = $apa['idactividad'];
                    $respuesta = $this->ObtenerElementosParaExportar(
                        $idusuario, $array, 3, $respuesta, 1
                    );
                }
            }
        }
        return $respuesta;
    }

    public function ExportarObjetivoDadoIdArc($idarc, $respuesta, $idusuario)
    {
        $model = new DatArcDatPlanObjetivo();
        $arcplanobjetivos = $model->ObtenerPlanYObjetivosDadoIdArc(
            $idarc, $idusuario
        );
        if (isset($arcplanobjetivos[0])) {
            foreach ($arcplanobjetivos as $apo) {
                $iddatarcdatplanobjetivo
                    = $apo['idarc'] . '-' . $apo['idplan'] . '-'
                    . $apo['idobjetivo'];
                if (!isset($respuesta['dat_arc_dat_plan_objetivo'][$iddatarcdatplanobjetivo])) {
                    $relacionesarcact['idarc'] = $apo['idarc'];
                    $relacionesarcact['idplan'] = $apo['idplan'];
                    $relacionesarcact['idobjetivo'] = $apo['idobjetivo'];
                    $relacionesarcact['idautor'] = $apo['idautor'];
                    $respuesta['dat_arc_dat_plan_objetivo'][$iddatarcdatplanobjetivo]
                        = $relacionesarcact;
                    $array[0] = $apo['idobjetivo'];
                    $respuesta = $this->ObtenerElementosParaExportar(
                        $idusuario, $array, 1, $respuesta, 1
                    );
                }
            }
        }
        return $respuesta;
    }

}
