<?php

/**
 * @author    Mairelys Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpIntercambioModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function ExportarElementos(
    $idusuario, $arrayidelementos, $tipoelemento, $opcionformato, $relacionEntreElem, $descendencia, $repeticiones, $sincronizar, $dominioSincronizar, $escenario, $export, $guardarCal
    ) {
        $respuesta = null;
        try {
            $arrayelementos = $this->ObtenerElementosParaExportar(
                    $idusuario, $arrayidelementos, $tipoelemento, $respuesta = array(), $relacionEntreElem, $descendencia, $repeticiones
            );
//                print_r($arrayelementos);die;
            if ($opcionformato == '.sipac') {
                $dirindex = $_SERVER['SCRIPT_FILENAME'];
                $appspath = substr($dirindex, 0, strrpos($dirindex, 'web'))
                        . 'apps/planificacion/comun/sipac_clean.db';
                $temppath = substr($dirindex, 0, strrpos($dirindex, 'web'))
                        . 'apps/planificacion/';
                $tempfile = $temppath . time() . ".db";
                copy($appspath, $tempfile);
                try {
                    $db = new PDO('sqlite:' . $tempfile);
                } catch (PDOException $e) {
//                    print_r($e);die;
                }
                foreach ($arrayelementos as $tablename => $table) {
                    foreach ($table as $elemento) {
                        $querykey = "INSERT INTO $tablename ( ";
                        $querydata = " VALUES ( ";
                        $union = " ,";
                        $index = 0;
                        foreach ($elemento as $key => $dato) {

                            if (strlen((string) $dato) > 0) {
                                $dato = "'" . $dato . "'";
                                $querykey = $querykey . $key . $union;
                                $querydata = $querydata . $dato . $union;
                            }
                            $index++;
                        }
                        $query = substr($querykey, 0, -1) . ") " . substr(
                                        $querydata, 0, -1
                                ) . ")";
                        $db->exec($query);
                    } 
                }
                $db = null;
            }
            switch ($opcionformato) {
                case '.sipac':
                    $objintercambiosipac = new IntercambioSipacModel();
                    $objintercambiosipac->ExportarDatosSipac($tempfile);
                    break;
                case '.ics':
                    /* $arrayelementos = $this->ObtenerElementosParaExportar(
                      $idusuario, $arrayidelementos, $tipoelemento,
                      $respuesta = array(), $relacionEntreElem
                      ); */ //1

                    foreach ($arrayelementos['dat_elementos'] as $key => $value) {
                        //print_r($arrayelementos['dat_actividades'][$key]['fechainicio']);die;
                        $fechainicio = $this->TransformarFecha($arrayelementos['dat_actividades'][$key]['fechainicio']);
                        $horainicio = $this->TransformarHora($arrayelementos['dat_actividades'][$key]['horainicio'], true, "");
                        $fechafin = $this->TransformarFecha($arrayelementos['dat_actividades'][$key]['fechafin']);
                        $horafin = $this->TransformarHora($arrayelementos['dat_actividades'][$key]['horafin'], true, "");
                        //print_r($fechainicio." ".$horainicio);die;
                        //print_r($fechafin." ".$horafin);die;

                        $arrayelementos['dat_elementos'][$key]['fechainicio'] = $arrayelementos['dat_actividades'][$key]['fechainicio'];
                        $arrayelementos['dat_elementos'][$key]['fechaHoraInicioTransf'] = $fechainicio . " " . $horainicio;

                        $arrayelementos['dat_elementos'][$key]['horainicio'] = $arrayelementos['dat_actividades'][$key]['horainicio'];

                        $arrayelementos['dat_elementos'][$key]['fechafin'] = $arrayelementos['dat_actividades'][$key]['fechafin'];
                        $arrayelementos['dat_elementos'][$key]['fechaHoraFinTransf'] = $fechafin . " " . $horafin;

                        $arrayelementos['dat_elementos'][$key]['horafin'] = $arrayelementos['dat_actividades'][$key]['horafin'];

                        $arrayelementos['dat_elementos'][$key]['lugar'] = $arrayelementos['dat_actividades'][$key]['lugar'];

                        // print_r($arrayelementos['dat_elementos']);die;
                    }
                    $usuarioOrganizador
                            = $this->integrator->seguridad->nombreUsuario(
                            $idusuario
                    );
                    $idpersona = $this->global->Perfil->idpersona;
                    $objsPersona
                            = $this->integrator->pvd->getPrincipalesDatosPersona(
                            $idpersona
                    );

                    if (isset($objsPersona->data[0])) {
                        $nombreOrganizador
                                = $objsPersona->data[0]['nombreapellidos'];
                    } else {
                        $nombreOrganizador = $this->global->Perfil->nombre . ' '
                                . $this->global->Perfil->apellidos;
                    }

                    $export->setTitle("Mis Actividades");
                    $ical = $export->toICal(
                            $arrayelementos['dat_elementos'], $sincronizar, $dominioSincronizar, $usuarioOrganizador, $nombreOrganizador
                    );

                    if ($guardarCal) {


                        //$raiz.= "/radicale/$usuarioOrganizador";
                        $raiz = "/var/www/vhosts/radicale/";


                        $file = 'Calendar.ics';
                        chdir($raiz);
                        $user = 'yasmanybp'; //$usuarioOrganizador; //'yespino';
                        mkdir($user, 0775);
                        //chgrp($raiz . $user, 'www-data');
                        //chown($raiz . $user, 'radicale');
                        chdir($raiz . $user);

                        $control = fopen($file, "w+");
                        if ($control == false) {
                            return 0;
                        } else {
                            //chown($raiz . $user . $file, 'radicale:www-data');
                            $mensaje = ( file_put_contents($file, $ical) !== false) ? 1 : 0;
                            chmod($raiz . $user . '/' . $file, 0775);
                            //chgrp($raiz . $user . $file, 'www-data');
                            //print_r($raiz . $user);die;
                            chown($raiz . $user . '/', 'radicale');
                            chown($raiz . $user . '/' . $file, 'radicale');
                            return $mensaje;
                        }
                    } else {
                        header('Content-Description: File Transfer');
                        header(
                                'Content-Type: application/octet-stream;charset=utf-8'
                        );
                        header(
                                "Content-Disposition: attachment; filename=\"actividades_exportadas("
                                . Date('d-m-Y H:i:s') . ").ics\""
                        );
                        header('Expires: 0');
                        header('Pragma: no-cache');
                        echo $ical;
                    }
                    break;
                default:
                    $objintercambioexcel = new IntercambioExcelModel();
                    $objintercambioexcel->ExportarDatosExcel(
                            $idusuario, $arrayelementos, $arrayidelementos, $opcionformato, $tipoelemento, $relacionEntreElem, $escenario
                    );
                    break;
            }
        } catch (Exception $e) {
            print_r($e);die;
        }
    }

    /**
     * Nombre de la funciÃƒÂ³n exportarAction
     * Descripcion Funcion que se encarga de conformar los arreglos que
     * contienen los datos de los elementos seleccionados y sus relaciones
     * en dependencia de la seleccion del usuario.
     *
     * @author * Mairelys Fernandez
     */
    public function ObtenerElementosParaExportar(
    $idusuario, $arrayidelementos, $tipoelemento, $respuesta, $relacionEntreElem, $descendencia = 0, $repeticiones = 0
    ) {
       
        $procede = 0;
        if (isset($arrayidelementos[0])) {
            foreach ($arrayidelementos as $key => $idelemento) {
                if ($tipoelemento != 5 && !isset($respuesta['dat_elementos'][$idelemento])
                ) {
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
                                        $idelemento, $respuesta, $idusuario, $relacionEntreElem
                                );
                                break;
                            case 1:
                                $respuesta = $this->ExportarObjetivoDadoId(
                                        $idelemento, $respuesta, $relacionEntreElem, $idusuario
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
                                        $idelemento, $idusuario, $respuesta, $relacionEntreElem, $descendencia, $repeticiones
                                );
                                 //print_r($respuesta);die;
                                break;
                        }

                        if (!$descendencia) {
                            $respuesta
                                    = $this->ExportarInvolucradosDadoIdElemento(
                                    $idelemento, $respuesta
                            );
                            $respuesta
                                    = $this->ExportarNomencladoresDadoIdElemento(
                                    $idelemento, $respuesta
                            );

                            if ($relacionEntreElem == 1) {
                                $respuesta
                                        = $this->ExportarRelacionesDadoIdElemento(
                                        $idelemento, $idusuario, $respuesta
                                );
                            }
                        }
                    }
                } 
                //elementos cometados por llamar a una recursividad indefinida
//                else {
//                    if (!isset($respuesta['dat_arc'][$idelemento])) {
//                        $respuesta = $this->ExportarArcDadoId(
//                                $idelemento, $respuesta, $idusuario, $relacionEntreElem
//                        );
//                    }
//                }
            }
        }

        return $respuesta;
    }

    public function DevolverIdRelacionados(
    $arrayidelementos, $relacionEntreElem
    ) {
        if (!isset($arrayidelementos['dat_elementos_dat_elementos']['idelementohijo'])) {
            
        }
    }

    public function ExportarActividadesDadoId(
    $idelemento, $idusuario, $respuesta, $relacionEntreElem, $descendencia = 0, $repeticiones = 0
    ) {
        $objdatact = new DatActividades();
        $act = $objdatact->GetDatosActDadoUser($idelemento, $idusuario);
        
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
        /*echo '<pre>';
        print_r($respuesta);die;*/
        if ($relacionEntreElem == 1) {
            $respuesta = $this->ExportarArcDadoIdActividad(
                    $idelemento, $idusuario, $respuesta
            );
        }
        if ($repeticiones == 1) {
            $respuesta = $this->ExportarRepeticionesActividad(
                    $idelemento, $idusuario, $respuesta, $descendencia
            );
        }
        if ($descendencia == 1) {
            $respuesta = $this->ExportarDescendenciaActividad(
                    $idelemento, $idusuario, $respuesta, $repeticiones
            );
        }
        return $respuesta;
    }

    public function ExportarDescendenciaActividad($idelemento, $idusuario, $respuesta, $repeticiones = 0
    ) {

        $parametros->idelemento = $idelemento;
        $parametros->idusuario = $idusuario;
        $objElemento = new DatElementos();

        $arrayActividadesHijas = $objElemento->ObtenerDescendenciaActividad(
                $parametros
        );
        if (isset($arrayActividadesHijas[0])) {
            foreach ($arrayActividadesHijas as $key => $actividad) {
                $existe = Doctrine::getTable('DatElementos')->find(
                        $actividad['idelemento']
                );
                $respuesta = $this->ExportarElementoDadoId(
                        $existe, $respuesta
                );
                $respuesta = $this->ExportarActividadesDadoId(
                        $actividad['idelemento'], $idusuario, $respuesta, 0, 1, $repeticiones
                );
            }
        }

        return $respuesta;
    }

    public function ExportarRepeticionesActividad($idelemento, $idusuario, $respuesta, $descendencia
    ) {

        $parametros->idelemento = $idelemento;
        $parametros->idusuario = $idusuario;
        $objElemento = new DatElementos();

        $arrayRepeticiones = $objElemento->ObtenerRepeticionesExportarActividad(
                $parametros
        );
        if (isset($arrayRepeticiones[0])) {
            foreach ($arrayRepeticiones as $key => $repeticion) {
                $existe = Doctrine::getTable('DatElementos')->find(
                        $repeticion['idelemento']
                );
                $respuesta = $this->ExportarElementoDadoId(
                        $existe, $respuesta
                );
                $respuesta = $this->ExportarActividadesDadoId(
                        $repeticion['idelemento'], $idusuario, $respuesta, 0, $descendencia, 1
                );
            }
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
            foreach ($arrayrelacionesarc as $relhijasA) {
                $iddatarcdatplan
                        = $relhijasA['idarc'] . "-" . $relhijasA['idplan'];
                if (!isset($respuesta['dat_arc_dat_plan'][$iddatarcdatplan])) {
                    $relacionesarcplan['idarc'] = $relhijasA['idarc'];
                    $relacionesarcplan['idplan'] = $relhijasA['idplan'];
                    $relacionesarcplan['idautorrelacion']
                            = $relhijasA['idautor'];
                    $respuesta['dat_arc_dat_plan'][$iddatarcdatplan]
                            = $relacionesarcplan;
                }
            }
            foreach ($arrayrelacionesarc as $relhijasB) {
                $array[0] = $relhijasB['idplan'];
                $respuesta = $this->ObtenerElementosParaExportar(
                        $idusuario, $array, 0, $respuesta, 1
                );
            }
        }
        return $respuesta;
    }

    public function ExportarObjetivoDadoId(
    $idelemento, $respuesta, $relacionEntreElem, $idusuario
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

    public function ExportarFipDadoId($idelemento, $respuesta) {
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

    public function ExportarElementoDadoId($existe, $respuesta) {

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
            //$respuesta['dat_elementos'][$existe->idelemento]['privado'] = $existe->privado;
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
            $respuesta = $this->ExportarActividadDadoIdPlan(
                    $plan['idplan'], $respuesta, $idusuario
            );
        }
        return $respuesta;
    }

    public function ExportarArcDadoIdPlan($idplan, $respuesta, $idusuario) {
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

    public function ExportarInvolucradosDadoIdElemento($idelemento, $respuesta) {
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

    public function ExportarNomencladoresDadoIdElemento($idelemento, $respuesta) {
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
            foreach ($arrayrelacionados as $key => $relacion) {
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
                    $array[0] = ($relacion['idelementohijo'] == $idelemento) ? $relacion['idelementopadre'] : $relacion['idelementohijo'];
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

    public function ExportarInvolucradosDadoIDArc($idarc, $respuesta) {
        $objdatarcdatinv = new DatArcDatInvolucrados();
        $involarc = $objdatarcdatinv->datosRelacionARCInvol($idarc);
        foreach ($involarc as $relacionarcinvol) {
            for (
            $key = 0; $key < count($respuesta['dat_arc_dat_involucrados']); $key++
            ) {
                if ($respuesta['dat_arc_dat_involucrados'][$key]['idarc'] == $relacionarcinvol['idarc'] && $respuesta['dat_arc_dat_involucrados'][$key]['idinvolucrado'] == $relacionarcinvol['idinvolucrado']
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

    public function ExportarPlanDadoIdArc($idarc, $respuesta, $idusuario) {
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

    public function ExportarActividadDadoIdArc($idarc, $respuesta, $idusuario) {
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

    public function ExportarActividadDadoIdPlan($idplan, $respuesta, $idusuario) {
        $arrayact
                = DatElementosDatElementos::BuscarTodasActividadesAlPlanConRepeticion(
                        $idplan
        );
        $arrayidelementos = array();
        if (isset($arrayact[0])) {
            foreach ($arrayact as $act) {
                $arrayidelementos[] = $act['idelemento'];
            }
        }
        $respuesta = $this->ObtenerElementosParaExportar(
                $idusuario, $arrayidelementos, $tipoelemento = 3, $respuesta, $relacionEntreElem = 1
        );
        return $respuesta;
    }

    public function ExportarActividadDadoIdObjetivo(
    $idobjetivo, $respuesta, $idusuario
    ) {
        /* $arrayact = DatElementosDatElementos::BuscarTodasActividadesAlPlanConRepeticion($idplan);
          $arrayidelementos = array();
          if (isset($arrayact[0])) {
          foreach ($arrayact as $act) {
          $arrayidelementos[] = $act['idelemento'];
          }
          }
          $respuesta = $this->ObtenerElementosParaExportar($idusuario,
          $arrayidelementos, $tipoelemento = 3, $respuesta, $relacionEntreElem = 1);
          return $respuesta; */
    }

    public function ExportarObjetivoDadoIdArc($idarc, $respuesta, $idusuario) {
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

    public function EfectuarImportacion($tempfile) {
        //Conectarme a la bd sqlite
        $db = new PDO('sqlite:' . $tempfile);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        // Comprobar fallos y repetidos en Elementos
        $fallos = $this->VerificarElementos($db, $fallos);
        // Comprobar fallos en los nomencladores de criterios de medida
        $fallos = $this->VerificarNomCriteriosMedida($db, $fallos);
        //Comprobar fallos en los nomencladores asociados a los elementos
        $fallos = $this->VerificarNomElementos($db, $fallos);
        // marcar repetidos en ARC
        $this->VerificarArc($db);
        $arrayrepetidos = $this->devolverElementosRepetidos($db);
        $respuesta ['repetidos'] = empty($arrayrepetidos) ? array() : $arrayrepetidos;
        $respuesta ['fallos'] = $fallos; //array($fallos);        
        return $respuesta;
    }

    private function VerificarElementos($db, $fallos) {
        $stmt = $db->query(
                "SELECT idelemento, idestadoaprob, idtipoelemento, denelemento FROM dat_elementos"
        );
        $respuesta = $stmt->fetchAll(PDO::FETCH_NUM);
        //print_r($respuesta);die;
        if (isset($respuesta[0])) {
            $arrayElementos = array();
            foreach ($respuesta as $r) {
                $arrayElementos[] = $r[0];
            }
            // Obtener los elementos que se repiten en bd local
            $datElementos = new DatElementos();
            $result = $datElementos->ObtenerElementosExistentes(
                    $arrayElementos
            );
            $existentes = array();
            foreach ($result as $e) {
                $existentes[] = $e['idelemento'];
            }
            foreach ($respuesta as $elemento) {
                // Si el elemento es un repetido
                if (!in_array($elemento[0], $existentes)) {
                    //marco al elemento como nuevo en la bd sqlite
                    $stmt = $db->query(
                            "UPDATE dat_elementos SET nuevo = 1
                            WHERE idelemento = $elemento[0]"
                    );
                } else {
                    //marco al elemento como repetido en la bd sqlite
                    $stmt = $db->query(
                            "UPDATE dat_elementos SET nuevo = 0
                            WHERE idelemento = $elemento[0]"
                    );
                }
                // Comprobar si el estado de aprobacion esta en la bd local
                if ($elemento[1]) {
                    $existestado = $this->pIntegrator->workflow->DenomEstado(
                            $elemento[1]
                    );
                    if (!isset($existestado[0])) {
                        $fallos [$elemento[0]]['tipoelem'] = $elemento[2];
                        $fallos [$elemento[0]]['denominacion']
                                = $elemento[3] . $elemento[2];
                        $fallos [$elemento[0]]['nomencladores'][]
                                = "Estado de aprobación";
                    }
                }
            }
        }
        return $fallos;
    }

    private function VerificarNomCriteriosMedida($db, $fallos) {
        $stmtk = $db->query(
                "SELECT idcriteriomedida, idumedida, idobjetivo
                FROM dat_criteriomedida"
        );
        $respuesta = $stmtk->fetchAll(PDO::FETCH_NUM);
        if (isset($respuesta[0])) {
            //Marco como nuevos los crierios de medida que no existen en la BD local
            $arraycm = array();
            foreach ($respuesta as $cm) {
                $arraycm[] = $cm[0];
            }
            // Obtener los criterios de medida que se repiten en bd local
            $datcriterio = new DatCriteriomedida();
            $result = $datcriterio->ObtenerCriteriosExistentes($arraycm);
            $existentes = array();
            foreach ($result as $a) {
                $existentes[] = $a['idcriteriomedida'];
            }
            foreach ($respuesta as $criterio) {

                if (!in_array($criterio[0], $existentes)) {
                    // marco al elemento como nuevo en la bd sqlite
                    $stmt = $db->exec(
                            "UPDATE dat_criteriomedida SET nuevo = 1
                            WHERE idcriteriomedida = $criterio[0] "
                    );
                } else {
                    $stmt = $db->exec(
                            "UPDATE dat_criteriomedida SET nuevo = 0
                            WHERE idcriteriomedida = $criterio[0]"
                    );
                }
            }
            //Fallos en la UM de los Criterios de Medida
            foreach ($respuesta as $cm) {
                $idum
                        = $this->pIntegrator->configuracionpdo->ObtenerNomencladorPorId(
                        $cm[1]
                );
                if (!isset($idum[0])) {
                    $stmtl = $db->query(
                            "SELECT denelemento FROM dat_elementos
                            WHERE idelemento = $cm[2]"
                    );
                    $resultA = $stmtl->fetchAll(PDO::FETCH_NUM);
                    $fallos [$criteriomedida[$cm[2]]]['tipoelem'] = 1;
                    $fallos [$criteriomedida[$cm[2]]]['denominacion']
                            = $resultA[0][0] . 1;
                    $fallos [$criteriomedida[$cm[2]]]['nomencladores'][]
                            = "Unidad de medida del criterio";
                }
            }
        }
        return $fallos;
    }

    private function VerificarNomElementos($db, $fallos) {
        $stmt = $db->query(
                "SELECT idnomenclador, idelemento, tiponomenclador
                FROM dat_elementos_nom_nomenclador"
        );
        $result = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($result[0])) {
            foreach ($result as $nomelemento) {
                $datosnom
                        = $this->pIntegrator->configuracionpdo->DameDatosNomenclador(
                        $nomelemento[0]
                );
                if (!$datosnom) {
                    $stmtm = $db->query(
                            "SELECT denelemento, idtipoelemento
                            FROM dat_elementos 
                            WHERE idelemento = $nomelemento[1]"
                    );
                    $resultn = $stmtm->fetchAll(PDO::FETCH_NUM);

                    $denominacion = $resultn[0][0];
                    $tipo = $resultn[0][1];

                    if ($nomelemento[2] == 0) {
                        $nomelemento[2] = "Categoría del plan";
                    }
                    if ($nomelemento[2] == 1) {
                        $nomelemento[2] = "Unidad de medida del criterio";
                    }
                    if ($nomelemento[2] == 2) {
                        $nomelemento[2] = "Categoría de la actividad";
                    }
                    if ($nomelemento[2] == 3) {
                        $nomelemento[2] = "Tipo de actividad";
                    }
                    if ($nomelemento[2] == 4) {
                        $nomelemento[2] = "Tipo de FIP";
                    }
                    if ($nomelemento[2] == 5) {
                        $nomelemento[2] = "Nom Datos Proc Fip";
                    }
                    if ($nomelemento[2] == 6) {
                        $nomelemento[2] = "Estado de Cumplimiento";
                    }
                    if ($nomelemento[2] == 7) {
                        $nomelemento[2] = "Nivel de acceso al FIP";
                    }
                    if (isset($fallos[$nomelemento[1]])) {
                        $fallos [$nomelemento[1]]['nomencladores'][]
                                = $nomelemento[2];
                    } else {
                        $fallos [$nomelemento[1]]['tipoelem'] = $tipo;
                        $fallos [$nomelemento[1]]['denominacion']
                                = $denominacion . $tipo;
                        $fallos [$nomelemento[1]]['nomencladores'] []
                                = $nomelemento[2];
                    }
                }
            }
        }
        return $fallos;
    }

    private function VerificarArc($db) {
        $stmt = $db->query("SELECT idarc FROM dat_arc");
        $respuesta = $stmt->fetchAll(PDO::FETCH_NUM);

        if (isset($respuesta[0])) {
            $arrayArc = array();
            foreach ($respuesta as $r) {
                $arrayArc[] = $r[0];
            }
            // Obtener los arc que se repiten en bd local
            $datArc = new DatArc();
            $result = $datArc->ObtenerArcExistentes($arrayArc);

            $existentes = array();
            foreach ($result as $a) {
                $existentes[] = $a['idarc'];
            }
            foreach ($respuesta as $arc) {
                // Si el arc es un repetido
                if (!in_array($arc[0], $existentes)) {
                    // marco al elemento como nuevo en la bd sqlite
                    $stmt = $db->exec(
                            "UPDATE dat_arc SET nuevo = 1 WHERE idarc = $arc[0]"
                    );
                } else {// marco al elemento como nuevo en la bd sqlite
                    $stmt = $db->exec(
                            "UPDATE dat_arc SET nuevo = 0 WHERE idarc = $arc[0]"
                    );
                }
            }
        }
    }

    public function devolverElementosRepetidos($db) {
        // Obtener los elementos del 1er nivel que estan repetidos
        $sql
                = "SELECT  idtipoelemento, denelemento, idusuariocrea, idelemento
            FROM dat_elementos         
            WHERE nuevo <> 1 AND idelemento NOT IN (SELECT idelementohijo 
            FROM dat_elementos_dat_elementos  WHERE origen <> 1 
            ORDER BY idelementohijo)
            GROUP BY idelemento, idtipoelemento,denelemento,idusuariocrea";
        $stmto = $db->query($sql);
        $resultp = $stmto->fetchAll(PDO::FETCH_NUM);
        //print_r($db);die('hhejej');
        if (isset($resultp[0])) {
            foreach ($resultp as $elementorep) {
                $elemento = new stdClass();
                $elemento->idelemento = $elementorep[3];
                $elemento->tipoelem = $elementorep[0];
                $elemento->denominacion = $elementorep[1] . $elementorep[0];
                $elemento->nombreautor
                        = $this->integrator->seguridad->nombreUsuario(
                        $elementorep[2]
                );
                $elemento->_parent = null;
                $elemento->_is_leaf = $this->tieneHijos(
                        $db, $elementorep[3], $elementorep[0]
                );
                $informacionrepetida[] = $elemento;
            }
        }
        // Obtener los arc del 1er nivel que estan repetidos
        $sql
                = "SELECT idarc, denarc, idusuariocrea
                FROM dat_arc WHERE idarc = idarcp AND nuevo <> 1";
        $stmtp = $db->query($sql);
        $resultq = $stmtp->fetchAll(PDO::FETCH_NUM);
        if (isset($resultq[0])) {
            foreach ($resultq as $arcrep) {
                $arc = new stdClass();
                $arc->idelemento = $arcrep[0];
                $arc->tipoelem = 5;
                $arc->denominacion = $arcrep[1] . $arc->tipoelem;
                $arc->nombreautor = $this->integrator->seguridad->nombreUsuario(
                        $arcrep[2]
                );
                $arc->_parent = null;
                $arc->_is_leaf = $this->tieneHijos($db, $arcrep[0], 5);
                $informacionrepetida[] = $arc;
            }
        }
        return $informacionrepetida;
    }

    public function devolverElementosHijos($idimportacion, $idelemento, $tipo) {
        /* Obtener el fichero sqlite correspondiente al idimportacion */
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $temppath = substr($dirindex, 0, strrpos($dirindex, 'web'))
                . 'apps/planificacion/';
        $tempfile = $temppath . $idimportacion . ".db";
        /* Conectarme a la bd sqlite */
        $db = new PDO('sqlite:' . $tempfile);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        $informacionhijos = array();
        if ($tipo != 5) {
            $sql
                    = " SELECT  idtipoelemento, denelemento, idusuariocrea,
                     idelemento 
                     FROM dat_elementos  
                     INNER JOIN dat_elementos_dat_elementos 
                     ON idelementohijo = idelemento
                     WHERE idelementopadre = $idelemento 
                         AND (origen = 0 OR origen = 4 ) AND nuevo <> 1 
                     GROUP BY idelemento, idtipoelemento, 
                     denelemento,idusuariocrea";
            $stmt = $db->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_NUM);
            if (isset($result[0])) {
                foreach ($result as $elemhijos) {
                    $elemento = new stdClass();
                    $elemento->idelemento = $elemhijos[3];
                    $elemento->tipoelem = $elemhijos[0];
                    $elemento->denominacion
                            = $elemhijos[1] . $elemento->tipoelem;
                    $elemento->nombreautor
                            = $this->integrator->seguridad->nombreUsuario(
                            $elemhijos[2]
                    );
                    $elemento->idimportacion = $idimportacion;
                    $elemento->_parent = $idelemento;
                    $elemento->_is_leaf = $this->tieneHijos(
                            $db, $elemhijos[3], $elemhijos[0]
                    );
                    $informacionhijos['infhijos'][] = $elemento;
                }
            }
        } else {
            $sql
                    = "SELECT idarc, denarc, idusuariocrea
                    FROM dat_arc 
                    WHERE idarcp = $idelemento 
                        AND idarcp <> idarc AND nuevo <> 1";
            $stmt = $db->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_NUM);
            if (isset($result[0])) {
                foreach ($result as $archijas) {
                    $arc = new stdClass();
                    $arc->idelemento = $archijas[0];
                    $arc->tipoelem = 5;
                    $arc->denominacion = $archijas[1] . $arc->tipoelem;
                    $arc->nombreautor
                            = $this->integrator->seguridad->nombreUsuario(
                            $archijas[2]
                    );
                    $arc->idimportacion = $idimportacion;
                    $arc->_parent = $idelemento;
                    $arc->_is_leaf = $this->tieneHijos($db, $archijas[0], 5);
                    $informacionhijos['infhijos'][] = $arc;
                }
            }
        }
        return $informacionhijos;
    }

    private function tieneHijos($db, $idelemento, $idtipoelemento) {
        $hoja = true;
        if ($idtipoelemento != 5) {
            $sql
                    = " SELECT
                    COUNT(idelemento)  
                    FROM dat_elementos 
                    INNER JOIN dat_elementos_dat_elementos 
                    ON idelementohijo = idelemento
                    WHERE idelementopadre = $idelemento 
                        AND (origen = 0 OR origen = 4 ) AND nuevo <> 1";
            $stmt = $db->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_NUM);
        } else {
            $sql
                    = " SELECT
                    COUNT(idarc)  
                    FROM dat_arc              
                    WHERE idarcp = $idelemento
                        AND idarcp <> idarc AND nuevo <> 1 ";
            $stmt = $db->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_NUM);
        }
        if ($result[0][0] > 0) {
            $hoja = false;
        }
        return $hoja;
    }

    public function InsertarInformacionBDLocal(
    $sobrescribir, $idimportacion, $tipoelemento, $iddominio, $idusuario, $certificado
    ) {
        $arrayIdElemInsert = array();
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $temppath = substr($dirindex, 0, strrpos($dirindex, 'web'))
                . 'apps/planificacion/';
        $tempfile = $temppath . $idimportacion . ".db";
        $db = new PDO('sqlite:' . $tempfile);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        /* Se llama a las funcionalidades para insertar toda la iformacion nueva */
        $this->ImportarElementos($db);
        $this->ImportarCriteriosMedida($db);
        $this->ImportarARC($db);
        $this->ImportarNomNomencladoresPorElementos($db);
        $this->ImportarRelacionEntreElementos($db);
        $this->ImportarInvolucradosPorElemento($db);
        $this->ImportarInvolucradosPorArc($db);
        $this->ImportarInvolucradosPorCriterio($db);
        $this->ImportarRelacionArcPlan($db);
        $this->ImportarRelacionArcPlanActividades($db);
        $this->ImportarRelacionArcPlanObjetivo($db);
        /* Se llama a las funcionalidades para sobrescribir inf repetida */
        if ($sobrescribir == 'true') {
            $arrayIdElemInsert = $this->sobrescribirEnDatElementos(
                    $db, $tipoelemento, $arrayIdElemInsert
            );
            $arrayIdElemInsert = $this->sobrescribirEnDatArc(
                    $db, $tipoelemento, $arrayIdElemInsert
            );
        }
        if ($tipoelemento != 5) {
            /* Consulta a BD SQLITE para obtener los elementos nuevos */
            $sql
                    = "SELECT idelemento
            FROM dat_elementos
            WHERE nuevo = 1 AND idtipoelemento = $tipoelemento";
            $stmt = $db->query($sql);
            $nuevos = $stmt->fetchAll(PDO::FETCH_NUM);
            /* Adicionando los elementos nuevos al array respuesta */
            foreach ($nuevos as $value) {
                $arrayIdElemInsert[] = $value[0];
            }
        } else {
            /* Consulta a BD SQLITE para obtener los elementos nuevos */
            $sql
                    = "SELECT idarc
            FROM dat_arc                   
            WHERE nuevo = 1 ";
            $stmt = $db->query($sql);
            $nuevos = $stmt->fetchAll(PDO::FETCH_NUM);
            /* Adicionando los elementos nuevos al array respuesta */
            foreach ($nuevos as $value) {
                $arrayIdElemInsert[] = $value[0];
            }
        }
        if (isset($arrayIdElemInsert[0])) {
            return $this->DevolverElementosDeUnTipoDeterminado(
                            $tipoelemento, $arrayIdElemInsert, $iddominio, $idusuario, $certificado
            );
        }
        $db = null;
        ob_clean();
        flush();
        return array('resultado' => array());
    }

    public function ImportarElementos($db) {
        $sql
                = "SELECT  *
            FROM dat_elementos                   
            WHERE nuevo = 1";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $key => $elemento) {
                $datelemento = new DatElementos();
                $datelemento->idelemento = $elemento[0];
                $datelemento->idtipoelemento = $elemento[1];
                $datelemento->denelemento = $elemento[2];
                $datelemento->descelemento = $elemento[3];
                $datelemento->idusuariocrea = $elemento[4];
                $datelemento->llevahistorial = $elemento[5];
                $datelemento->activo = $elemento[6];
                $datelemento->gradocumplimiento = $elemento[7];
                $datelemento->privado = $elemento[8];
                $datelemento->participante = $elemento[9];
                $datelemento->idestadoaprob = $elemento[10];
                $datelemento->estadocumplimiento = $elemento[11];
                $datelemento->dirigente = $elemento[12];
                switch ($elemento[1]) {
                    case 0:
                        $sql
                                = "SELECT  *
                 FROM dat_plan_pdo
                 WHERE dat_plan_pdo.idplan = $elemento[0]";
                        $stmt = $db->query($sql);
                        $plan = $stmt->fetchAll(PDO::FETCH_NUM);
                        if (strlen($elemento[0]) < 10) {
                            $objcmpgestionarplanmodel
                                    = new CmpgestionarplanModel();
                            $respuesta
                                    = $objcmpgestionarplanmodel->AdicionarPlan(
                                    $elemento[4], $elemento[2], $elemento[3], $elemento[7], $idcategoria, $idestadocump, $plan[0][1], $plan[0][2], $idtipoelemento = 0
                            );
                            $idelemento = $respuesta[1];
                            $stmt = $db->query(
                                    "UPDATE dat_elementos
                                    SET idelemento = $idelemento 
                                    WHERE idelemento = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_plan_pdo SET idplan = $idelemento
                                    WHERE idplan = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_elementos_dat_elementos
                                    SET idelementopadre = $idelemento 
                                        WHERE idelementopadre = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_arc_dat_plan
                                    SET idplan = $idelemento 
                                        WHERE idplan = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_arc_dat_plan_objetivo
                                    SET idplan = $idelemento 
                                        WHERE idplan = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_arc_dat_plan_actividades
                                    SET idplan = $idelemento 
                                        WHERE idplan = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_elementos_nom_nomenclador
                                    SET idelemento = $idelemento 
                                        WHERE idelemento = $elemento[0]"
                            );
                        } else {
                            $datelemento->save();
                            $datelemento->idelemento = $elemento[0];
                            $datelemento->save();
                            $datplan = new DatPlanPdo();
                            $datplan->idplan = $plan[0][0];
                            $datplan->fechainicio = $plan[0][1];
                            $datplan->fechafin = $plan[0][2];
                            $datplan->save();
                        }
                        break;
                    case 1:
                        $sql
                                = "SELECT  *
                    FROM dat_objetivo
                    WHERE dat_objetivo.idobjetivo = $elemento[0]";
                        $stmt = $db->query($sql);
                        $objetivo = $stmt->fetchAll(PDO::FETCH_NUM);
                        if (strlen($elemento[0]) < 10) {
                            $parametros->idtipoelemento = $elemento[1];
                            $parametros->idusuariocrea = $elemento[4];
                            $parametros->denelemento = $elemento[2];
                            $parametros->descelemento = $elemento[3];
                            $parametros->gradocumplimiento = $elemento[7];
                            $parametros->participantes = $elemento[9];
                            $parametros->dirigentes = $elemento[12];
                            $parametros->fechainicio = $objetivo[1];
                            $parametros->fechafin = $objetivo[2];
                            $parametros->retornar = 1;
                            $objcmpgestionarobjetivosmodel
                                    = new CmpgestionarobjetivosModel();
                            $respuesta
                                    = $objcmpgestionarobjetivosmodel->AdicionarObjetivo(
                                    $parametros
                            );
                            $idelemento = $respuesta->idobjetivo;
                            $stmt = $db->query(
                                    "UPDATE dat_elementos
                                    SET idelemento = $idelemento 
                                        WHERE idelemento = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_objetivo
                                    SET idobjetivo = $idelemento 
                                        WHERE idobjetivo = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_elementos_dat_elementos
                                    SET idelementopadre = $idelemento 
                                        WHERE idelementopadre = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_elementos_dat_elementos
                                    SET idelementohijo = $idelemento 
                                        WHERE idelementohijo = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_arc_dat_plan_objetivo
                                    SET idobjetivo = $idelemento 
                                        WHERE idobjetivo = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_criteriomedida
                                    SET idobjetivo = $idelemento 
                                        WHERE idobjetivo = $elemento[0]"
                            );
                        } else {
                            $datelemento->save();
                            $datelemento->idelemento = $elemento[0];
                            $datelemento->save();
                            $datobjetivo = new DatObjetivo();
                            $datobjetivo->idobjetivo = $objetivo[0][0];
                            $datobjetivo->fechainicio = $objetivo[0][1];
                            $datobjetivo->fechafin = $objetivo[0][2];
                            $datobjetivo->save();
                        }
                        break;
                    case 2:
                        $sql
                                = "SELECT  *
                        FROM dat_fip
                        WHERE dat_fip.idfip = $elemento[0]";
                        $stmt = $db->query($sql);
                        $fip = $stmt->fetchAll(PDO::FETCH_NUM);
                        if (strlen($elemento[0]) < 10) {
                            $parametros->idtipoelemento = $elemento[1];
                            $parametros->idusuariocrea = $elemento[4];
                            $parametros->denelemento = $elemento[2];
                            $parametros->descelemento = $elemento[3];
                            $parametros->gradocumplimiento = $elemento[7];
                            $parametros->participantes = $elemento[9];
                            $parametros->dirigentes = $elemento[12];
                            $parametros->emite = $fip[1];
                            $parametros->fechaemision = $fip[2];
                            $parametros->fechacumplimiento = $fip[3];
                            $parametros->fechacumplio = $fip[4];
                            $parametros->numfip = $fip[5];
                            $parametros->documentorigen = $fip[6];
                            $parametros->retornar = 1;
                            $objcmpgestionarfipesmodel
                                    = new CmpgestionarfipModel();
                            $respuesta
                                    = $objcmpgestionarfipesmodel->AdicionarFip(
                                    $parametros
                            );
                            $idelemento = $respuesta->idfip;
                            $stmt = $db->query(
                                    "UPDATE dat_elementos
                                    SET idelemento = $idelemento 
                                        WHERE idelemento = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_fip SET idfip = $idelemento
                                    WHERE idfip = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_elementos_dat_elementos
                                    SET idelementopadre = $idelemento 
                                        WHERE idelementopadre = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_elementos_dat_elementos
                                    SET idelementohijo = $idelemento 
                                        WHERE idelementohijo = $elemento[0]"
                            );
                        } else {
                            $datelemento->save();
                            $datelemento->idelemento = $elemento[0];
                            $datelemento->save();
                            $datfip = new DatFip();
                            $datfip->idfip = $fip[0][0];
                            $datfip->emite = $fip[0][1];
                            $datfip->fechaemision = $fip[0][2];
                            $datfip->fechacumplimiento = $fip[0][3];
                            $datfip->fechacumplio = $fip[0][4];
                            $datfip->numfip = $fip[0][5];
                            $datfip->documentorigen = $fip[0][6];
                            $datfip->save();
                        }
                        break;
                    case 3:
                        $sql
                                = "SELECT  *
                        FROM dat_actividades
                        WHERE dat_actividades.idactividad = $elemento[0]";
                        $stmt = $db->query($sql);
                        $actividad = $stmt->fetchAll(PDO::FETCH_NUM);
                        if (strlen($elemento[0]) < 10) {
                            $parametros->tiporepeticion = $actividad[1];
                            $parametros->fechainicio = $actividad[2];
                            $parametros->fechafin = $actividad[3];
                            $parametros->horainicio = $actividad[4];
                            $parametros->horafin = $actividad[5];
                            $parametros->lugar = $actividad[6];
                            $parametros->esprincipal = $actividad[7];
                            $parametros->extraplan = $actividad[0][8];
                            $parametros->retornar = 1;
                            $objcmpgestionaractividadesmodel
                                    = new CmpgestionaractividadesModel();
                            $respuesta
                                    = $objcmpgestionaractividadesmodel->AdicionarActividad(
                                    $parametros
                            );
                            $idelemento = $respuesta->idactividad;
                            $stmt = $db->query(
                                    "UPDATE dat_elementos
                                    SET idelemento = $idelemento 
                                        WHERE idelemento = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_actividades
                                    SET idactividad = $idelemento 
                                        WHERE idactividad = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_elementos_dat_elementos
                                    SET idelementopadre = $idelemento 
                                        WHERE idelementopadre = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_elementos_dat_elementos
                                    SET idelementohijo = $idelemento 
                                        WHERE idelementohijo = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_arc_dat_plan_actividades
                                    SET idactividad = $idelemento 
                                        WHERE idactividad = $elemento[0]"
                            );
                            $stmt = $db->query(
                                    "UPDATE dat_elementos_nom_nomenclador
                                    SET idelemento = $idelemento 
                                        WHERE idelemento = $elemento[0]"
                            );
                        } else {
                            $datelemento->save();
                            $datelemento->idelemento = $elemento[0];
                            $datelemento->save();
                            $datactividad = new DatActividades();
                            $datactividad->idactividad = $actividad[0][0];
                            $datactividad->tiporepeticion = $actividad[0][1];
                            $datactividad->fechainicio = $actividad[0][2];
                            $datactividad->fechafin = $actividad[0][3];
                            $datactividad->horainicio = $actividad[0][4];
                            $datactividad->horafin = $actividad[0][5];
                            $datactividad->lugar = $actividad[0][6];
                            $datactividad->esprincipal = $actividad[0][7];
                            $datactividad->extraplan = $actividad[0][8];
                            $datactividad->save();
                        }
                        break;
                }
            }
        }
    }

    public function ImportarARC($db) {
        $sqlArcPerNivel
                = "SELECT  *
                FROM dat_arc   
                WHERE idarc = idarcp AND nuevo = 1";
        $stmt = $db->query($sqlArcPerNivel);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $key => $arc) {
                $datarc = new DatArc();
                $datarc->denarc = $arc[4];
                $datarc->descrip = $arc[5];
                $datarc->idusuariocrea = $arc[6];
                $datarc->fechacreacion = $arc[7];
                $datarc->fechainicio = $arc[8];
                $datarc->fechafin = $arc[9];
                $datarc->activo = $arc[10];
                $datarc->caduca = $arc[11];
                // $datarc->numcapitulo = $arc[13];
                if (strlen($arc[0]) < 10) {
                    $objcmpgestionararcmodel = new CmpgestionararcModel();
                    $respuesta = $objcmpgestionararcmodel->AdicionarArc(
                            $arc[6], $arc[4], $arc[5], $arc[8], $arc[9], $arrayinvolucrados, null, 0, $arrayelementosrelacionados, array()
                    );
                    $idarc = $respuesta[1];
                    $stmtg = $db->query(
                            "UPDATE dat_arc SET idarc = $idarc
                            WHERE idarc = $arc[0]"
                    );
                    $stmth = $db->query(
                            "UPDATE dat_arc SET idarcp = $idarc
                            WHERE idarcp = $arc[0]"
                    );
                    $stmtf = $db->query(
                            "UPDATE dat_arc_dat_plan SET idarc = $idarc
                            WHERE idarc = $arc[0]"
                    );
                    $stmti = $db->query(
                            "UPDATE dat_arc_dat_plan_objetivo SET idarc = $idarc
                            WHERE idarc = $arc[0]"
                    );
                    $stmtj = $db->query(
                            "UPDATE dat_arc_dat_plan_actividades SET idarc = $idarc
                            WHERE idarc = $arc[0]"
                    );
                } else {
                    $datarc->idarc = $arc[0];
                    $datarc->idarcp = $arc[1];
                    $datarc->save();
                }
            }
        }
        $sqlArcSdoNivel
                = "SELECT  *
                FROM dat_arc
                WHERE idarc <> idarcp AND nuevo = 1";
        $stmt = $db->query($sqlArcSdoNivel);
        $resultado = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($resultado[0])) {
            foreach ($resultado as $key => $arc) {
                $datarc = new DatArc();
                $datarc->denarc = $arc[4];
                $datarc->descrip = $arc[5];
                $datarc->idusuariocrea = $arc[6];
                $datarc->fechacreacion = $arc[7];
                $datarc->fechainicio = $arc[8];
                $datarc->fechafin = $arc[9];
                $datarc->activo = $arc[10];
                $datarc->caduca = $arc[11];
                if (strlen($arc[0]) < 10) {
                    $objcmpgestionararcmodel = new CmpgestionararcModel();
                    $respuesta = $objcmpgestionararcmodel->AdicionarArc(
                            $arc[6], $arc[4], $arc[5], $arc[8], $arc[9], $arrayinvolucrados, $arc[1], 1, $arrayelementosrelacionados, array()
                    );
                    $idarc = $respuesta[1];
                    $stmtg = $db->query(
                            "UPDATE dat_arc SET idarc = $idarc
                            WHERE idarc = $arc[0]"
                    );
                    $stmth = $db->query(
                            "UPDATE dat_arc SET idarcp = $idarc
                            WHERE idarcp = $arc[0]"
                    );
                    $stmtf = $db->query(
                            "UPDATE dat_arc_dat_plan SET idarc = $idarc
                            WHERE idarc = $arc[0]"
                    );
                    $stmti = $db->query(
                            "UPDATE dat_arc_dat_plan_objetivo SET idarc = $idarc
                            WHERE idarc = $arc[0]"
                    );
                    $stmtj = $db->query(
                            "UPDATE dat_arc_dat_plan_actividades SET idarc = $idarc
                            WHERE idarc = $arc[0]"
                    );
                } else {
                    $datarc->idarc = $arc[0];
                    $datarc->idarcp = $arc[1];
                    $datarc->save();
                }
            }
        }
    }

    public function ImportarInvolucradosPorCriterio($db) {
        $sql
                = "SELECT  *
                FROM dat_criteriomedida_dat_involucrados";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        $objcriterioinvol = new DatCriterioDatInvolucrados();
        if (isset($result[0])) {
            foreach ($result as $key => $criteriomedidainv) {
                $existe = $objcriterioinvol->Buscar(
                        $criteriomedidainv[0], $criteriomedidainv[1]
                );
                if (!isset($existe)) {
                    $datcriteriomedidainvol = new DatCriterioDatInvolucrados();
                    $datcriteriomedidainvol->idcriteriomedida
                            = $criteriomedidainv[0];
                    $datcriteriomedidainvol->idinvolucrado
                            = $criteriomedidainv[1];
                    $datcriteriomedidainvol->llaveinvolucrado
                            = $criteriomedidainv[2];
                    $datcriteriomedidainvol->save();
                }
            }
        }
    }

    public function ImportarRelacionArcPlanObjetivo($db) {
        $sql
                = "SELECT  *
                FROM dat_arc_dat_plan_objetivo";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        $objarcplanobj = new DatArcDatPlanObjetivo();
        if (isset($result[0])) {
            foreach ($result as $key => $arcplanobj) {
                $existe = $objarcplanobj->ObtenerRelacionPlanArcObj(
                        $arcplanobj[0], $arcplanobj[1], $arcplanobj[2]
                );
                if (!isset($existe[0])) {
                    $datarcdatplanobjetivo = new DatArcDatPlanObjetivo();
                    $datarcdatplanobjetivo->idplan = $arcplanobj[0];
                    $datarcdatplanobjetivo->idarc = $arcplanobj[1];
                    $datarcdatplanobjetivo->idobjetivo = $arcplanobj[2];
                    $datarcdatplanobjetivo->idautor = $arcplanobj[3];
                    $datarcdatplanobjetivo->save();
                }
            }
        }
    }

    public function ImportarRelacionArcPlanActividades($db) {
        $sql
                = "SELECT  *
                FROM dat_arc_dat_plan_actividades";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        $obj = new DatArcDatPlanActividades();
        if (isset($result[0])) {
            foreach ($result as $key => $arcplanact) {
                $existe = $obj->ObtenerRelacionPlanArcAct(
                        $arcplanact[0], $arcplanact[1], $arcplanact[2]
                );
                if (!isset($existe[0])) {
                    $datarcdatplanact = new DatArcDatPlanActividades();
                    $datarcdatplanact->idarc = $arcplanact[1];
                    $datarcdatplanact->idplan = $arcplanact[0];
                    $datarcdatplanact->idactividad = $arcplanact[2];
                    $datarcdatplanact->idautor = $arcplanact[3];
                    $datarcdatplanact->save();
                }
            }
        }
    }

    public function ImportarInvolucradosPorElemento($db) {
        $sql
                = "SELECT  *
                FROM dat_elementos_dat_involucrados";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        $objinvol = new DatInvolucrados();
        $objeleminvol = new DatElementosDatInvolucrados();
        if (isset($result[0])) {
            foreach ($result as $key => $involelemento) {
                $existeinvol = $objinvol->ExisteInvolucrado($involelemento[0]);
                if (isset($existeinvol[0])) {
                    $existelminvol = $objeleminvol->ExisteInvolucrado(
                            $involelemento[0], $involelemento[1]
                    );
                    if (!isset($existelminvol[0])) {
                        $datelemdatinvol = new DatElementosDatInvolucrados();
                        $datelemdatinvol->idelemento = $involelemento[0];
                        $datelemdatinvol->idinvolucrado = $involelemento[1];
                        $datelemdatinvol->llaveinvolucrado = $involelemento[2];
                        $datelemdatinvol->save();
                    }
                }
            }
        }
    }

    public function ImportarNomNomencladoresPorElementos($db) {
        $sql
                = "SELECT  *
                FROM dat_elementos_nom_nomenclador";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        $objelemnom = new DatElementosNomNomenclador();
        if (isset($result[0])) {
            foreach ($result as $key => $nomelemento) {
                $existenom
                        = $this->pIntegrator->configuracionpdo->ObtenerNomencladorPorId(
                        $nomelemento[1]
                );
                if (isset($existenom[0])) {
                    $existeelemnom = $objelemnom->ExisteElem_Nom(
                            $nomelemento[0], $nomelemento[1]
                    );
                    if (!$existeelemnom) {
                        $datelemnom = new DatElementosNomNomenclador();
                        $datelemnom->idelemento = $nomelemento[0];
                        $datelemnom->idnomenclador = $nomelemento[1];
                        $datelemnom->tiponomenclador = $nomelemento[2];
                        $datelemnom->save();
                    }
                }
            }
        }
    }

    public function ImportarRelacionEntreElementos($db) {
        $sql
                = "SELECT  *
                FROM dat_elementos_dat_elementos";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        $objelemelem = new DatElementosDatElementos();
        if (isset($result[0])) {
            foreach ($result as $elemelemento) {
                $existe = $objelemelem->BuscarPadreHijo(
                        $elemelemento[0], $elemelemento[1]
                );
                if (!isset($existe[0])) {
                    $datelemdatelem = new DatElementosDatElementos();
                    $datelemdatelem->idelementopadre = $elemelemento[0];
                    $datelemdatelem->idelementohijo = $elemelemento[1];
                    $datelemdatelem->origen = $elemelemento[2];
                    $datelemdatelem->idautor = $elemelemento[3];
                    $datelemdatelem->nivelrelacion = $elemelemento[4];
                    $datelemdatelem->save();
                }
            }
        }
    }

    public function ImportarInvolucradosPorArc($db) {
        $sql
                = "SELECT  *
                FROM dat_arc_dat_involucrados";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        $objinvol = new DatInvolucrados();
        $objarcinvol = new DatArcDatInvolucrados();
        if (isset($result[0])) {
            foreach ($result as $key => $involarc) {
                $existeinvol = $objinvol->ExisteInvolucrado($involarc[1]);
                if (isset($existeinvol[0])) {
                    $existearcinvol = $objarcinvol->ExisteElemento(
                            $involarc[0], $involarc[1]
                    );
                    if (!isset($existearcinvol[0])) {
                        $datarcdatinvol = new DatArcDatInvolucrados();
                        $datarcdatinvol->idarc = $involarc[0];
                        $datarcdatinvol->idinvolucrado = $involarc[1];
                        $datarcdatinvol->llaveinvolucrado = $involarc[2];
                        $datarcdatinvol->save();
                    }
                }
            }
        }
    }

    public function ImportarRelacionArcPlan($db) {
        $sql
                = "SELECT  *
                FROM dat_arc_dat_plan";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        $obj = new DatArcDatPlan();
        if (isset($result[0])) {
            foreach ($result as $key => $planarc) {
                $existe = $obj->ExisteArea_Plan($planarc[0], $planarc[1]);
                if (!isset($existe[0])) {
                    $objdatarcdatplan = new DatArcDatPlan();
                    $objdatarcdatplan->idarc = $planarc[0];
                    $objdatarcdatplan->idplan = $planarc[1];
                    $objdatarcdatplan->idautorrelacion = $planarc[2];
                    $objdatarcdatplan->save();
                }
            }
        }
    }

    public function ImportarCriteriosMedida($db) {
        $sql
                = "SELECT  *
                FROM dat_criteriomedida   
                WHERE nuevo = 1";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $key => $criteriomedida) {
                $datcriteriomedida = new DatCriteriomedida();
                $datcriteriomedida->idumedida = $criteriomedida[1];
                $datcriteriomedida->idobjetivo = $criteriomedida[2];
                $datcriteriomedida->idestadocump = $criteriomedida[3];
                $datcriteriomedida->dencriterio = $criteriomedida[4];
                $datcriteriomedida->fechainicio = $criteriomedida[5];
                $datcriteriomedida->fechafin = $criteriomedida[6];
                $datcriteriomedida->valormeta = $criteriomedida[7];
                $datcriteriomedida->valoreal = $criteriomedida[8];
                $datcriteriomedida->participante = $criteriomedida[9];
                $datcriteriomedida->descriterio = $criteriomedida[10];
                $datcriteriomedida->gradocumplimiento = $criteriomedida[11];
                $datcriteriomedida->estadocumplimiento = $criteriomedida[12];
                $datcriteriomedida->idusuariocrea = $criteriomedida[13];
                $datcriteriomedida->save();
                $datcriteriomedida->idcriteriomedida = $criteriomedida[0];
                $datcriteriomedida->save();
            }
        }
    }

    private function sobrescribirEnDatElementos(
    $db, $tipoelemento, $arrayIdElemInsert
    ) {
        $sql
                = "SELECT  *
                FROM dat_elementos                   
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $elemento) {
                $datoselemento = new DatElementos();
                $datoselemento->idelemento = $elemento[0];
                $datoselemento->idtipoelemento = $elemento[1];
                $datoselemento->denelemento = $elemento[2];
                $datoselemento->descelemento = $elemento[3];
                $datoselemento->idusuariocrea = $elemento[4];
                $datoselemento->llevahistorial = $elemento[5];
                $datoselemento->activo = $elemento[6];
                $datoselemento->gradocumplimiento = $elemento[7];
                $datoselemento->privado = $elemento[8];
                $datoselemento->participante = $elemento[9];
                $datoselemento->idestadoaprob = $elemento[10];
                $datoselemento->estadocumplimiento = $elemento[11];
                $datoselemento->dirigente = $elemento[12];
                $datoselemento->ActualizarInfElemento();
                if ($datoselemento->idtipoelemento == $tipoelemento) {
                    $arrayIdElemInsert[] = $datoselemento->idelemento;
                }
            }
        }
        $this->sobrescribirEnDatPlan($db);
        $this->sobrescribirEnDatObjetivos($db);
        $this->sobrescribirEnDatCriterioMedida($db);
        $this->sobrescribirEnDatFip($db);
        $this->sobrescribirEnDatActividades($db);
        return $arrayIdElemInsert;
    }

    private function sobrescribirEnDatPlan($db) {
        $sql
                = "SELECT  *
                FROM dat_plan_pdo  
                INNER JOIN  dat_elementos ON idelemento = idplan 
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $plan) {
                $datplan = new DatPlanPdo();
                $datplan->fechainicio = $plan[1];
                $datplan->fechafin = $plan[2];
                $datplan->idplan = $plan[0];
                $datplan->ActualizarInfPlan();
            }
        }
    }

    private function sobrescribirEnDatObjetivos($db) {
        $sql
                = "SELECT  *
                FROM dat_objetivo 
                INNER JOIN  dat_elementos ON idelemento = idobjetivo 
                WHERE nuevo = 0 ";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $objetivo) {
                $datobjetivo = new DatObjetivo();
                $datobjetivo->fechainicio = $objetivo[1];
                $datobjetivo->fechafin = $objetivo[2];
                $datobjetivo->idobjetivo = $objetivo[0];
                $datobjetivo->ActualizarInfObjetivo();
            }
        }
    }

    private function sobrescribirEnDatActividades($db) {
        $sql
                = "SELECT  *
                FROM dat_actividades  
                INNER JOIN  dat_elementos  ON idelemento = idactividad 
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $actividad) {
                $datact = new DatActividades();
                $datact->idactividad = $actividad[0];
                $datact->tiporepeticion = $actividad[1];
                $datact->fechainicio = $actividad[2];
                $datact->fechafin = $actividad[3];
                $datact->horainicio = $actividad[4];
                $datact->horafin = $actividad[5];
                $datact->lugar = $actividad[6];
                $datact->esprincipal = $actividad[7];
                $datact->extraplan = $actividad[8];
                $datact->ActualizarInfActividad();
            }
        }
    }

    private function sobrescribirEnDatCriterioMedida($db) {
        $sql
                = "SELECT  *
                FROM dat_criteriomedida   
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $criterio) {
                $datcriteriomedida = new DatCriteriomedida();
                $datcriteriomedida->idcriteriomedida = $criterio[0];
                $datcriteriomedida->idumedida = $criterio[1];
                $datcriteriomedida->idobjetivo = $criterio[2];
                $datcriteriomedida->idestadocump = $criterio[3];
                $datcriteriomedida->dencriterio = $criterio[4];
                $datcriteriomedida->fechainicio = $criterio[5];
                $datcriteriomedida->fechafin = $criterio[6];
                $datcriteriomedida->valormeta = $criterio[7];
                $datcriteriomedida->valoreal = $criterio[8];
                $datcriteriomedida->participante = $criterio[9];
                $datcriteriomedida->descriterio = $criterio[10];
                $datcriteriomedida->gradocumplimiento = $criterio[11];
                $datcriteriomedida->estadocumplimiento = $criterio[12];
                $datcriteriomedida->idusuariocrea = $criterio[13];
                $datcriteriomedida->ActualizarInfCriterioM();
            }
        }
    }

    private function sobrescribirEnDatFip($db) {
        $sql
                = "SELECT  *
                FROM dat_fip  
                INNER JOIN  dat_elementos ON idelemento = idfip 
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $fip) {
                $datfip = new DatFip();
                $datfip->emite = $fip[1];
                $datfip->fechaemision = $fip[2];
                $datfip->fechacumplimiento = $fip[3];
                $datfip->fechacumplio = $fip[4];
                $datfip->numfip = $fip[5];
                $datfip->documentorigen = $fip[6];
                $datfip->idfip = $fip[0];
                $datfip->ActualizarInfFip();
            }
        }
    }

    private function sobrescribirEnDatArc(
    $db, $tipoelemento, $arrayIdElemInsert
    ) {
        $sql
                = "SELECT  *
                FROM dat_arc   
                WHERE nuevo = 0";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            foreach ($result as $arc) {
                $datarc = new DatArc();
                $datarc->denarc = $arc[4];
                $datarc->descrip = $arc[5];
                $datarc->idusuariocrea = $arc[6];
                $datarc->fechacreacion = $arc[7];
                $datarc->fechainicio = $arc[8];
                $datarc->fechafin = $arc[9];
                $datarc->activo = $arc[10];
                $datarc->caduca = $arc[11];
                $datarc->idarc = $arc[0];
                $datarc->idarcp = $arc[1];
                $datarc->ActualizarInfArc();
                if ($tipoelemento == 5) {
                    $arrayIdElemInsert[] = $datarc->idarc;
                }
            }
        }
        return $arrayIdElemInsert;
    }

    public function DevolverElementosDeUnTipoDeterminado(
    $tipoelemento, $arrayidelem, $iddominio, $idusuario, $certificado
    ) {
        if ($tipoelemento == 0) {
            return $this->DevolverPlanImport(
                            $arrayidelem, $idusuario, $certificado, $iddominio
            );
        }
        if ($tipoelemento == 1) {
            return $this->DevolverObjImport($arrayidelem, $idusuario);
        }
        if ($tipoelemento == 2) {
            return $this->DevolverFIPImport(
                            $arrayidelem, $idusuario, $certificado, $iddominio
            );
        }
        if ($tipoelemento == 3) {
            return $this->DevolverActivImport($arrayidelem, $idusuario);
        }
        if ($tipoelemento == 5) {
            return $this->DevolverARCImport($arrayidelem, $idusuario);
        }
    }

    public function DevolverPlanImport(
    $arrayidelem, $idusuario, $certificado, $iddominio
    ) {
        $arrayplanes = DatPlanPdo::getPlanesImport($arrayidelem);
        if (isset($arrayplanes['resultado'])) {
            foreach ($arrayplanes['resultado'] as $key => $plan) {
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                $entrada = 1;
                if ($plan['idusuariocrea'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                            = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                            $idusuario, $plan['idusuariocrea'], $certificado, $iddominio
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                if ($plan['idestadoaprob'] != null) {
                    $arrayestadosaprob
                            = $this->integrator->configuracion->DenomEstado(
                            $plan['idestadoaprob']
                    );
                }
                $nombreestadoapro = '';
                if (isset($arrayestadosaprob[0])) {
                    $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                }
                $arrayplanes['resultado'][$key]['nombreautor']
                        = $this->integrator->seguridad->nombreUsuario(
                        $plan['idusuariocrea']
                );
                $arrayplanes['resultado'][$key]['estadocumplimiento']
                        = $plan['estadocumplimiento'] . "("
                        . $plan['gradocumplimiento'] . "%)";
                $arrayplanes['resultado'][$key]['nombreestadoaprob']
                        = $nombreestadoapro;
                $arrayplanes['resultado'][$key]['_is_leaf'] = true;
                $arrayplanes['resultado'][$key]['_parent'] = null;
                $arrayplanes['resultado'][$key]['superior'] = $superior;
                $arrayplanes['resultado'][$key]['subordinado'] = $subordinado;
                $arrayplanes['resultado'][$key]['modificar'] = $modificar;
                $arrayplanes['resultado'][$key]['eliminar'] = $eliminar;
            }//fin del foreach
        }//fin de la condicional                
        return $arrayplanes;
    }

    public function DevolverObjImport($arrayidelem, $idusuario) {
        $objdatelementos = new DatElementos();
        $arrayobjetivos = $objdatelementos->GetObjetivos($arrayidelem);
        if (isset($arrayobjetivos['resultado'])) {
            foreach ($arrayobjetivos['resultado'] as $key => $objetivo) {
                $parent = null;
                $obj = new DatElementosDatElementos();
                $existepadre = $obj->BuscarElementoPadreOrigen(
                        $objetivo['idelemento']
                );
                if (isset($existepadre [0])) {
                    $parent = $existepadre [0]['idelementopadre'];
                }
                $leaf = true;
                $tienehijos = $objdatelementos->CargarObjetivos(
                        $objetivo['idelemento'], $idusuario, '', '', '', '', '', '', '', $start, 10, '', '', array(), 0, array()
                );
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($objetivo['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                            = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                            $idusuario, $objetivo['idautor']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                if ($objetivo['idestadoaprob'] != null) {
                    $arrayestadosaprob
                            = $this->integrator->configuracion->DenomEstado(
                            $objetivo['idestadoaprob']
                    );
                }
                $nombreestadoapro = '';
                if (isset($arrayestadosaprob[0])) {
                    $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                }
                $tienecriterios = 0;
                $idobj = $objetivo['idelemento'];
                $arraycriterios = Doctrine::getTable('DatCriteriomedida')
                        ->findByDql("idobjetivo = $idobj");
                if (isset($arraycriterios[0]->idcriteriomedida) && $arraycriterios[0]->idcriteriomedida != ""
                ) {
                    $tienecriterios = 1;
                }
                $arrayobjetivos['resultado'][$key]['nombreautor']
                        = $this->integrator->seguridad->nombreUsuario(
                        $objetivo['idautor']
                );
                $arrayobjetivos['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayobjetivos['resultado'][$key]['_parent'] = $parent;
                $arrayobjetivos['resultado'][$key]['superior'] = $superior;
                $arrayobjetivos['resultado'][$key]['subordinado']
                        = $subordinado;
                $arrayobjetivos['resultado'][$key]['modificar'] = $modificar;
                $arrayobjetivos['resultado'][$key]['eliminar'] = $eliminar;
                $arrayobjetivos['resultado'][$key]['estadocumplimiento']
                        = $objetivo['estadocumplimiento'] . "("
                        . $objetivo['gradocumplimiento'] . "%)";
                $arrayobjetivos['resultado'][$key]['nombreestadoaprob']
                        = $nombreestadoapro;
                $arrayobjetivos['resultado'][$key]['observaciones']
                        = $objetivo['observaciones'];
                $arrayobjetivos['resultado'][$key]['criterios']
                        = $tienecriterios;
            }
        }
        return $arrayobjetivos;
    }

    public function DevolverFIPImport(
    $arrayidelem, $idusuario, $certificado, $iddominio
    ) {
        $objdatelementos = new DatElementos();
        $arrayfips = $objdatelementos->GetarrayFIPS($arrayidelem);
        if (isset($arrayfips['resultado'])) {
            foreach ($arrayfips['resultado'] as $key => $fip) {
                $parent = null;
                $obj = new DatElementosDatElementos();
                $existepadre = $obj->BuscarElementoPadreOrigen(
                        $fip['idelemento']
                );
                if (isset($existepadre [0])) {
                    $parent = $existepadre [0]['idelementopadre'];
                }
                $leaf = true;
                $tienehijos = $objdatelementos->CargarFips(
                        $fip['idelemento'], $idusuario, $iddominio, $certificado, '', '', '', 0, 10, null, array()
                );
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($fip['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                            = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                            $idusuario, $fip['idautor']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                $arrayfips['resultado'][$key]['nombreautor']
                        = $this->integrator->seguridad->nombreUsuario(
                        $fip['idautor']
                );
                $arrayfips['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayfips['resultado'][$key]['_parent'] = $parent;
                $arrayfips['resultado'][$key]['superior'] = $superior;
                $arrayfips['resultado'][$key]['subordinado'] = $subordinado;
                $arrayfips['resultado'][$key]['modificar'] = $modificar;
                $arrayfips['resultado'][$key]['eliminar'] = $eliminar;
                $arrayfips['resultado'][$key]['estadocumplimiento']
                        = $fip['estadocumplimiento'] . "("
                        . $fip['gradocumplimiento']
                        . "%)";
                $arrayfips['resultado'][$key]['observaciones']
                        = $fip['observaciones'];
            }
        }
        return $arrayfips;
    }

    public function DevolverARCImport($arrayidARC, $idusuario) {
        $objcmparcmodel = new CmpgestionararcModel();
        return $objcmparcmodel->CargarAreasImportadas($arrayidARC, $idusuario);
    }

    public function DevolverActivImport($arrayidacts, $idusuario) {
        $objdatelementos = new DatElementos();
        $arrayactividades = $objdatelementos->GetActividades($arrayidacts);
        if (isset($arrayactividades['resultado'])) {
            foreach ($arrayactividades['resultado'] as $key => $actividad) {
                $parent = null;
                $obj = new DatElementosDatElementos();
                $existepadre = $obj->BuscarElementoPadreOrigen(
                        $actividad['idelemento']
                );
                if (isset($existepadre [0])) {
                    $parent = $existepadre [0]['idelementopadre'];
                }
                $leaf = true;
                $tienehijos = $objdatelementos->CargarActividades(
                        $actividad['idelemento'], $idusuario, '', '', "", "", array(), array(), '', '', '', '', 10, '', '', array(), 0, array()
                );
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($actividad['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                            = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                            $idusuario, $actividad['idautor']
                    );
                    if ($permisomodificacion) {

                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                if ($actividad['idestadoaprob'] != null) {
                    $arrayestadosaprob
                            = $this->integrator->configuracion->DenomEstado(
                            $actividad['idestadoaprob']
                    );
                }
                $nombreestadoapro = '';
                if (isset($arrayestadosaprob[0])) {
                    $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                }
                $arrayactividades['resultado'][$key]['nombreautor']
                        = $this->integrator->seguridad->nombreUsuario(
                        $actividad['idautor']
                );
                $arrayactividades['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayactividades['resultado'][$key]['_parent'] = $parent;
                $arrayactividades['resultado'][$key]['superior'] = $superior;
                $arrayactividades['resultado'][$key]['subordinado']
                        = $subordinado;
                $arrayactividades['resultado'][$key]['modificar'] = $modificar;
                $arrayactividades['resultado'][$key]['eliminar'] = $eliminar;
                $arrayactividades['resultado'][$key]['estadocumplimiento']
                        = $actividad['estadocumplimiento'] . "("
                        . $actividad['gradocumplimiento'] . "%)";
                $arrayactividades['resultado'][$key]['nombreestadoaprob']
                        = $nombreestadoapro;
                $arrayactividades['resultado'][$key]['observaciones']
                        = $actividad['observaciones'];
            }//fin del foreach
        }//fin de condicional
        return $arrayactividades;
    }

    public function comparacion_Persistido_Repetido($id, $tipo, $idimportacion) {
        /* Obtener el fichero sqlite correspondiente al idimportacion */
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $temppath = substr($dirindex, 0, strrpos($dirindex, 'web'))
                . 'apps/planificacion/';
        $tempfile = $temppath . $idimportacion . ".db";
        /* Conectarme a la bd sqlite */
        $db = new PDO('sqlite:' . $tempfile);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        if ($tipo != 5) {
            $respuesta = $this->datosElemento_Persistido_Repetido($id, $db);
        } else {
            $respuesta = $this->datosArc_Persistida_Repetida($id, $db);
        }
        return $respuesta;
    }

    public function datosElemento_Persistido_Repetido($id, $db) {
        $objdatelemento = new DatElementos();
        $elempersistido = $objdatelemento->BuscarElementoPersistido($id);
        $datoselementoper = new stdClass();
        $datoselementoper = $this->datosElemento_Persistido($elempersistido);
        $elemrepetido = $this->BuscarElementoRepetido($id, $db);
        $datoselementorep = new stdClass();
        $datoselementorep = $this->datosElemento_Repetido($elemrepetido);
        switch ($datoselementoper->idtipoelemento) {
            case 0:
                $datoselementoper = $this->datosPlan_Persistido(
                        $id, $datoselementoper
                );
                $datoselementorep = $this->datosPlan_Repetido(
                        $id, $datoselementorep, $db
                );
                break;
            case 1:
                $datoselementoper = $this->datosObjetivo_Persistido(
                        $id, $datoselementoper
                );
                $datoselementorep = $this->datosObjetivo_Repetido(
                        $id, $datoselementorep, $db
                );
                break;
            case 2:
                $datoselementoper = $this->datosFip_Persistido(
                        $id, $datoselementoper
                );
                $datoselementorep = $this->datosFip_Repetido(
                        $id, $datoselementorep, $db
                );
                break;
            case 3:
                $datoselementoper = $this->datosActividades_Persistido(
                        $id, $datoselementoper
                );
                $datoselementorep = $this->datosActividades_Repetido(
                        $id, $datoselementorep, $db
                );
                break;
        }
        $respuesta ['datosPersistentes'] = $datoselementoper;
        $respuesta ['datosAImport'] = $datoselementorep;
        return $respuesta;
    }

    public function datosElemento_Persistido($elempersistido) {
        $datoselementoper = new stdClass();
        $datoselementoper->idelemento = $elempersistido[0]['idelemento'];
        $datoselementoper->idtipoelemento
                = $elempersistido[0]['idtipoelemento'];
        $datoselementoper->denelemento = $elempersistido[0]['denelemento'];
        $datoselementoper->descelemento = ($elempersistido[0]['descelemento']) ? $elempersistido[0]['descelemento'] : '-';
        $datoselementoper->idusuariocrea = $elempersistido[0]['idusuariocrea'];
        $datoselementoper->llevahistorial
                = $elempersistido[0]['llevahistorial'];
        $datoselementoper->activo = $elempersistido[0]['activo'];
        $datoselementoper->gradocumplimiento
                = $elempersistido[0]['gradocumplimiento'];
        $datoselementoper->privado = $elempersistido[0]['privado'];
        $datoselementoper->participante = ($elempersistido[0]['participante']) ? $elempersistido[0]['participante'] : '-';
        $datoselementoper->idestadoaprob = $elempersistido[0]['idestadoaprob'];
        $datoselementoper->estadocumplimiento
                = $elempersistido[0]['estadocumplimiento'];
        $datoselementoper->dirigente = ($elempersistido[0]['dirigente']) ? $elempersistido[0]['dirigente'] : '-';
        return $datoselementoper;
    }

    public function BuscarElementoRepetido($id, $db) {
        $sql
                = " SELECT  *
        FROM dat_elementos                   
        WHERE idelemento = $id";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        return $result;
    }

    public function datosElemento_Repetido($elemrepetido) {
        $datoselementorep = new stdClass();
        $datoselementorep->idelemento = $elemrepetido[0][0];
        $datoselementorep->idtipoelemento = $elemrepetido[0][1];
        $datoselementorep->denelemento = $elemrepetido[0][2];
        $datoselementorep->descelemento = ($elemrepetido[0][3]) ? $elemrepetido[0][3] : '-';
        $datoselementorep->idusuariocrea = $elemrepetido[0][4];
        $datoselementorep->llevahistorial = $elemrepetido[0][5];
        $datoselementorep->activo = $elemrepetido[0][6];
        $datoselementorep->gradocumplimiento = $elemrepetido[0][7];
        $datoselementorep->privado = $elemrepetido[0][8];
        $datoselementorep->participante = ($elemrepetido[0][9]) ? $elemrepetido[0][9] : '-';
        $datoselementorep->idestadoaprob = $elemrepetido[0][10];
        $datoselementorep->estadocumplimiento = $elemrepetido[0][11];
        $datoselementorep->dirigente = ($elemrepetido[0][12]) ? $elemrepetido[0][12] : '-';
        return $datoselementorep;
    }

    public function datosPlan_Persistido($id, $datoselementoper) {
        $existe = Doctrine::getTable('DatPlanPdo')->find($id);
        if (isset($existe->idplan)) {
            $datoselementoper->fechainicio = $existe->fechainicio;
            $datoselementoper->fechafin = $existe->fechafin;
        }
        return $datoselementoper;
    }

    public function datosPlan_Repetido($id, $datoselementorep, $db) {
        $sql
                = "SELECT  *
                FROM dat_plan_pdo                   
                WHERE idplan = $id";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            $datoselementorep->fechainicio = $result[0][1];
            $datoselementorep->fechafin = $result[0][2];
        }
        return $datoselementorep;
    }

    public function datosObjetivo_Persistido($id, $datoselementoper) {
        $existe = Doctrine::getTable('DatObjetivo')->find($id);
        if (isset($existe->idobjetivo)) {
            $datoselementoper->fechainicio = $existe->fechainicio;
            $datoselementoper->fechafin = $existe->fechafin;
        }
        return $datoselementoper;
    }

    public function datosObjetivo_Repetido($id, $datoselementorep, $db) {
        $sql
                = "SELECT  *
                FROM dat_objetivo                   
                WHERE idobjetivo = $id";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            $datoselementorep->fechainicio = $result[0][1];
            $datoselementorep->fechafin = $result[0][2];
        }
        return $datoselementorep;
    }

    public function datosActividades_Persistido($id, $datoselementoper) {
        $existe = Doctrine::getTable('DatActividades')->find($id);
        if (isset($existe->idactividad)) {
            $datoselementoper->fechainicio = $existe->fechainicio;
            $datoselementoper->fechafin = $existe->fechafin;
            $datoselementoper->tiporepeticion = $existe->tiporepeticion;
            $datoselementoper->horainicio = $existe->horainicio;
            $datoselementoper->horafin = $existe->horafin;
            $datoselementoper->lugar = ($existe->lugar) ? $existe->lugar : '-';
            $datoselementoper->esprincipal = $existe->esprincipal;
            $datoselementoper->extraplan = $existe->extraplan;
        }
        return $datoselementoper;
    }

    public function datosActividades_Repetido($id, $datoselementorep, $db) {
        $sql
                = "SELECT  *
                FROM dat_actividades                   
                WHERE idactividad = $id";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            $datoselementorep->fechainicio = $result[0][2];
            $datoselementorep->fechafin = $result[0][3];
            $datoselementorep->tiporepeticion = $result[0][1];
            $datoselementorep->horainicio = $result[0][4];
            $datoselementorep->horafin = $result[0][5];
            $datoselementorep->lugar = ($result[0][6]) ? $result[0][6] : '-';
            $datoselementorep->esprincipal = $result[0][7];
            $datoselementorep->extraplan = $result[0][8];
        }
        return $datoselementorep;
    }

    public function datosFip_Persistido($id, $datoselementoper) {
        $existe = Doctrine::getTable('DatFip')->find($id);
        if (isset($existe->idfip)) {
            $datoselementoper->emite = ($existe->emite) ? $existe->emite : '-';
            $datoselementoper->fechaemision = $existe->fechaemision;
            $datoselementoper->fechacumplimiento = $existe->fechacumplimiento;
            $datoselementoper->fechacumplio = ($existe->fechacumplio) ? $existe->fechacumplio : '-';
            $datoselementoper->numfip = ($existe->numfip) ? $existe->numfip : '-';
            $datoselementoper->documentorigen = $existe->documentorigen;
        }
        return $datoselementoper;
    }

    public function datosFip_Repetido($id, $datoselementorep, $db) {
        $sql
                = "SELECT  *
                FROM dat_fip                   
                WHERE idfip = $id";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            $datoselementorep->emite = ($result[0][1]) ? $result[0][1] : '-';
            $datoselementorep->fechaemision = $result[0][2];
            $datoselementorep->fechacumplimiento = $result[0][3];
            $datoselementorep->fechacumplio = ($result[0][4]) ? $result[0][4] : '-';
            $datoselementorep->numfip = ($result[0][5]) ? $result[0][5] : '-';
            $datoselementorep->documentorigen = $result[0][6];
        }
        return $datoselementorep;
    }

    private function datosArc_Persistida_Repetida($id, $db) {
        $objdatarc = new DatArc();
        $arcpersistido = $objdatarc->BuscarArcPersistida($id);
        $datosarcper = new stdClass();
        $datosarcper->idarc = $arcpersistido[0]['idarc'];
        $datosarcper->denelemento = $arcpersistido[0]['denarc'];
        $datosarcper->descelemento = ($arcpersistido[0]['descrip']) ? $arcpersistido[0]['descrip'] : '-';
        $datosarcper->idusuariocrea = $arcpersistido[0]['idusuariocrea'];
        $datosarcper->fechacreacion = $arcpersistido[0]['fechacreacion'];
        $datosarcper->fechainicio = $arcpersistido[0]['fechainicio'];
        $datosarcper->fechafin = ($arcpersistido[0]['fechafin']) ? $arcpersistido[0]['fechafin'] : '-';
        $datosarcper->activo = $arcpersistido[0]['activo'];
        $datosarcper->caduca = $arcpersistido[0]['caduca'];
        $datosarcper->idarcp = $arcpersistido[0]['idarcp'];
        //Buscar el arc repetida en la BD SQLITE
        $sql
                = "SELECT  *
                FROM dat_arc                   
                WHERE idarc = $id";
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_NUM);
        if (isset($result[0])) {
            $datosarcrep->idarc = $result[0][0];
            $datosarcrep->denelemento = $result[0][4];
            $datosarcrep->descelemento = ($result[0][5]) ? $result[0][5] : '-';
            $datosarcrep->idusuariocrea = $result[0][6];
            $datosarcrep->fechacreacion = $result[0][7];
            $datosarcrep->fechainicio = $result[0][8];
            $datosarcrep->fechafin = ($result[0][9]) ? $result[0][9] : '-';
            $datosarcrep->activo = $result[0][10];
            $datosarcrep->caduca = $result[0][11];
            $datosarcrep->idarcp = $result[0][1];
        }
        $respuesta ['datosPersistentes'] = $datosarcper;
        $respuesta ['datosAImport'] = $datosarcrep;
        return $respuesta;
    }

    public function TransformarFecha($date) {

        $arrayDatosFecha = array();
        //se trata de identificar el tipo de separador de la fecha
        $existeSeparadorSlach = strpos($date, "/");
        if ($existeSeparadorSlach !== false) {
            $arrayDatosFecha = explode('/', $date);
        } else {
            $existeSeparadorGuion = strpos($date, "-");
            if ($existeSeparadorGuion !== false) {
                $arrayDatosFecha = explode('-', $date);
            }
        }
        if (isset($arrayDatosFecha[0])) {
            //verificando si la primera posicion corresponde al anno
            if (count($arrayDatosFecha[0]) == 4) {
                $date = $arrayDatosFecha[0] . "-" . $arrayDatosFecha[1] . "-"
                        . $arrayDatosFecha[2];
            } else {
                $date = $arrayDatosFecha[2] . "-" . $arrayDatosFecha[1] . "-"
                        . $arrayDatosFecha[0];
            }
        }

        return $date;
    }

    public function TransformarHora($hora, $esMilitar, $parteDia) {

        $arrayDatosHora = explode(':', $hora);
        if ($esMilitar) {
            $hora = $arrayDatosHora[0] . $arrayDatosHora[1] . "00";
        }

        return $hora;
    }

    public function DefinirElementosFinales($parametros) {
        $respuesta = 1;
        $cantNoExisten = 0;
        $totalElementos = 0;
        if ($parametros->accion == 'actualizar') {
            foreach (
            $parametros->arrayElementosExistentes as $key => $elementoExistente
            ) {

                $objElementoOriginal = Doctrine::getTable('DatElementos')->find(
                        $elementoExistente->idelemento
                );
                if (isset($objElementoOriginal->idelemento)) {
                    $objElementoOriginal->denelemento
                            = $elementoExistente->denelemento;
                    $objElementoOriginal->descelemento
                            = $elementoExistente->descelemento;
                    $objElementoOriginal->dirigente
                            = $elementoExistente->dirigentes;
                    $objElementoOriginal->participante
                            = $elementoExistente->participantes;
                    $objElementoOriginal->save();

                    $objActividadOriginal = Doctrine::getTable('DatActividades')
                            ->find($elementoExistente->idelemento);
                    $objActividadOriginal->fechainicio
                            = $elementoExistente->fechainicio;
                    $objActividadOriginal->fechafin
                            = $elementoExistente->fechafin;
                    $objActividadOriginal->horainicio
                            = $elementoExistente->horainicio;
                    $objActividadOriginal->horafin
                            = $elementoExistente->horafin;
                    $objActividadOriginal->lugar = $elementoExistente->lugar;
                    $objActividadOriginal->save();
                } else {
                    $cantNoExisten++;
                }
                $totalElementos++;
            }
        }

        if ($cantNoExisten == $totalElementos && $parametros->accion == 'actualizar'
        ) {
            $respuesta = 2;
        }

        return $respuesta;
    }

}