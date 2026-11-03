<?php
class DefinirprocesoController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function definirprocesoAction()
    {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    function cargarcomboperiodoAction()
    {
        $r['datos'] = NomEvalperiodoevaluativo::GetTodos();
        for ($i = 0; $i < count($r['datos']); $i++) {
            if ($r['datos'][$i]['medidatiempo'] == 0) {
                if (intval($r['datos'][$i]['periodo']) > 1) {
                    $r['datos'][$i]['periodo'] .= ' Días';
                } else {
                    $r['datos'][$i]['periodo'] .= ' Día';
                }
            } else {
                if ($r['datos'][$i]['medidatiempo'] == 1) {
                    if (intval($r['datos'][$i]['periodo']) > 1) {
                        $r['datos'][$i]['periodo'] .= ' Meses';
                    } else {
                        $r['datos'][$i]['periodo'] .= ' Mes';
                    }
                } else {
                    if (intval($r['datos'][$i]['periodo']) > 1) {
                        $r['datos'][$i]['periodo'] .= ' Años';
                    } else {
                        $r['datos'][$i]['periodo'] .= ' Año';
                    }
                }
            }
        }
        echo json_encode($r);

        return;
    }

    function buscartipoprocesoAction()
    {
        $r['datos'] = DatEvaldefprocesoevaluativo::Buscar($this->_request->getPost('idTP'));
        echo json_encode($r);
    }

    function cargarcombotipoprocesoAction()
    {
        $r['datos'] = NomEvaltipoprocesoevaluativo::GetTodos();
        echo json_encode($r);
    }

    function todosdefinirprocesosevaluativosAction()
    {
        $filtro = $this->_request->getPost('filtro');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objDefinirProcesos = new DatEvaldefprocesoevaluativo();
        if ($filtro == '') {
            $r['datos'] = $objDefinirProcesos->ObtenerTodoDeTodos($start, $limit);
            $r['cantidad'] = $objDefinirProcesos->GetCantTotal();
            echo(json_encode($r));
        } else {
            $r['datos'] = $objDefinirProcesos->ObtenerTodoDeTodosFiltro($filtro, $start, $limit);
            $r['cantidad'] = $objDefinirProcesos->GetCantTotalFiltro($filtro);
            echo(json_encode($r));
        }
    }

    function getplanillasasociadasAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $objDatEvaldefprocesoplanillas = new DatEvaldefprocesoplanillas();
        $r['datos'] = $objDatEvaldefprocesoplanillas->obtenerPlanillaAsociadasProceso($iddefprocesoevaluativo);
        echo(json_encode($r));
    }

    function getplanillasactivasAction()
    {
        $filtro = $this->_request->getPost('filtro');
        $objDatEvalplanillasevaluativas = new DatEvalplanillasevaluativas();
        if ($filtro == '') {
            $r['datos'] = $objDatEvalplanillasevaluativas->GetPlanillasActivas();
            $r['cantidad'] = $objDatEvalplanillasevaluativas->cantPlanillasActivas();
            echo(json_encode($r));
        } else {
            $r['datos'] = $objDatEvalplanillasevaluativas->GetPlanillasActivasFiltro($filtro);
            $r['cantidad'] = $objDatEvalplanillasevaluativas->cantPlanillasActivasFiltro($filtro);
            echo(json_encode($r));
        }
    }

    function getModelosMatematicosAction()
    {
        if ($this->_request->getPost('idplanilla')) {
            $idplanilla = $this->_request->getPost('idplanilla');
            $arrModelos = $this->pIntegrator->evaluaciones->getModelosActivosPorPlanilla($idplanilla);
            if ($arrModelos) {
                $arr = array();
                foreach ($arrModelos as $k => $v) {
                    $arr[$k]['idmodelo'] = $v['idmodelo'];
                    $arr[$k]['denom'] = $v['denom'];
                    $arr[$k]['descripcion'] = $v['descripcion'];
                }
                echo json_encode(array('datos' => $arr));
            } else {
                echo json_encode(array());
            }
        } else {
            echo json_encode(array());
        }
    }

    function eliminarPlanillaAsociadaAction()
    {
        $idprocesoplanilla = $this->_request->getPost('idprocesoplanilla');
        $idplanilla = $this->_request->getPost('idplanilla');
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $objDatEvaldefprocesoplanillasModel = new DatEvaldefprocesoplanillasModel();
        $result = $objDatEvaldefprocesoplanillasModel->Eliminar(
            $iddefprocesoevaluativo, $idplanilla, $idprocesoplanilla
        );
        $r->success = true;
        echo(json_encode($r));
    }

    function asociarplanillasAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $idplanilla = $this->_request->getPost('idPlanilla');
        $idModelo = $this->_request->getPost('idModelo');
        $objDatEvaldefprocesoplanillasModel = new DatEvaldefprocesoplanillasModel();
        $objDatEvaldefprocesoplanillas = new DatEvaldefprocesoplanillas();
        $valor = $objDatEvaldefprocesoplanillas->ExisteProcesoPlanilla($iddefprocesoevaluativo, $idplanilla);
        if ($valor) {
            if ($valor[0]['idmodelo'] != $idModelo) {
                $arr['idprocesoplanilla'] = $valor[0]['idprocesoplanilla'];
                $arr['iddefprocesoevaluativo'] = $valor[0]['iddefprocesoevaluativo'];
                $arr['idplanilla'] = $valor[0]['idplanilla'];
                $arr['idmodelo'] = $idModelo;
                $resp = $objDatEvaldefprocesoplanillasModel->Actualizar($arr);
                if ($resp) {
                    $r->codResult = 1;
                    $r->accion = 'MOD';
                } else {
                    $r->codResult = 3;
                    $r->accion = 'MOD';
                }
            } else {
                $r->codResult = 0;
                $r->accion = 'MOD';
            }
        } else {
            $objDatEvaldefprocesoplanillas->iddefprocesoevaluativo = $iddefprocesoevaluativo;
            $objDatEvaldefprocesoplanillas->idplanilla = $idplanilla;
            $objDatEvaldefprocesoplanillas->idmodelo = $idModelo;
            $resp = $objDatEvaldefprocesoplanillasModel->Insertar($objDatEvaldefprocesoplanillas);
            if (!$resp) {
                $r->codResult = 1;
                $r->accion = 'ADD';
            } else {
                $r->codResult = 3;
                $r->accion = 'ADD';
            }
        }
        echo json_encode($r);
    }

    function cargarplanillasactivasAction()
    {
        $iddPlanilla = $this->_request->getPost('idPlanilla');
        $node = $this->_request->getPost('node');
        $v = null;
        $nodos = array();
        if ($node == 'raizPlanilla') {
            $r = $this->pIntegrator->evaluaciones->ObtenerPlanillasActivas();
            if (count($r) > 0) {
                foreach ($r as $v) {
                    $nodos[] = array('id' => $v->idplanilla, 'text' => $v->denom);
                }
            }
        } else {
            $r = $this->pIntegrator->evaluaciones->BuscarModelosByPlanilla($iddPlanilla);
            if (count($r) > 0) {
                foreach ($r as $v) {
                    $nodos[] = array('id' => $v->idmodelo, 'text' => $v->denom, 'leaf' => true);
                }
            }
        }

        echo(json_encode($nodos));
    }

    function cargarrecomendacionesAction()
    {
        $idtiporecomendacionevaluativa = $this->_request->getPost('idtiporecomendacion');
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $procesoreco = DatEvalprocesorecomendaciones::GetTodos();
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $r['datos'] = NomEvalrecomendacion::ObtenerRecomendacionPorIdTipo(
            $idtiporecomendacionevaluativa, $limit, $start
        );

        $result['cantidad'] = NomEvalrecomendacion::GetCantTotalNoAsociadas($idtiporecomendacionevaluativa);
        $result['datos'] = array();

        foreach ($r['datos'] as $a) {
            $flag = false;
            foreach ($procesoreco as $b) {
                if ($a['idrecomendacion'] == $b['idrecomendacion']
                    && $b['iddefprocesoevaluativo'] == $iddefprocesoevaluativo
                ) {
                    $flag = true;
                }
            }
            if (!$flag) {
                $result['datos'][] = $a;
                $flag = false;
            }
        }
        echo(json_encode($result));
    }

    function cargarsenyalamientosAction()
    {
        $idtiposenyalamiento = $this->_request->getPost('idtiposenyalamiento');
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $procesosenya = DatEvalprocesoresenyalamiento::GetTodos();
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $r['datos'] = NomEvalsenyalamiento::GetSenyalamientoPorIdTipo($idtiposenyalamiento, $limit, $start);

        $result['cantidad'] = NomEvalsenyalamiento::GetCantTotalPorIdTipo($idtiposenyalamiento);
        $result['datos'] = array();

        foreach ($r['datos'] as $a) {
            $flag = false;
            foreach ($procesosenya as $b) {
                if ($a['idsenyalamiento'] == $b['idsenyalamiento']
                    && $b['iddefprocesoevaluativo'] == $iddefprocesoevaluativo
                ) {
                    $flag = true;
                }
            }
            if (!$flag) {
                $result['datos'][] = $a;
                $flag = false;
            }
        }
        echo(json_encode($result));
    }

    function cargartiposrecomendacionesAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $r['datos'] = NomEvaltiporecomendacion::GetPorLimite($limit, $start);
        $r['cantidad'] = NomEvaltiporecomendacion::GetCantTotal();
        echo(json_encode($r));
    }

    function cargartipossenyalamientosAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $r['datos'] = NomEvaltiposenyalamiento::GetPorLimite($limit, $start);
        $r['cantidad'] = NomEvaltiposenyalamiento::GetCantTotal();
        echo(json_encode($r));
    }

    function adicionardefinirprocesoAction()
    {
        $arrNiveles = json_decode(stripslashes($this->_request->getPost('arrNiveles')));
        $objDefProcesos = new DatEvaldefprocesoevaluativo();
        $objDefProcesos->denom = $this->_request->getPost('denom');
        $objDefProcesos->descripcion = $this->_request->getPost('descripcion');
        $objDefProcesos->fechacomienzo = $this->_request->getPost('fechainicio');
        $objDefProcesos->idperiodoevaluativo = $this->_request->getPost('idperiodoevaluativo');
        $objDefProcesos->idtipoprocesoevaluativo = $this->_request->getPost('idtipoprocesoevaluativo');
        $objDefProcesos->idescala = $this->_request->getPost('idescala');
        $objDefProcesos->puedereclamar = $this->_request->getPost('puedereclamar');
        //$objDefProcesos->opinante = $this->_request->getPost('opinante');
        $objDefProcesos->opinionevaluado = $this->_request->getPost('opinionevaluado');

        if (count($arrNiveles) > 0) {
            foreach ($arrNiveles as $key => $nivel) {
                $objDefProcesos->DatNivelreclamacion[$key]['denominacion'] = $nivel->denominacion;
                $objDefProcesos->DatNivelreclamacion[$key]['nivel'] = $nivel->nivel;
                $objDefProcesos->DatNivelreclamacion[$key]['tiemporeclamacion'] = $nivel->tiemporeclamacion;
                $objDefProcesos->DatNivelreclamacion[$key]['tiemporespuesta'] = $nivel->tiemporespuesta;
            }
        }
        $objDefProcesos->save();


        $r->codResult = 1;
        $r->mensaje = "El proceso evaluativo definido se ha adicionado satisfactoriamente.";
        $r->succes = true;
        echo(json_encode($r));
    }

    function modificardefinirprocesoAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $objDefProcesos = Doctrine::getTable('DatEvaldefprocesoevaluativo')->find($iddefprocesoevaluativo);
        $arrNiveles = json_decode(stripslashes($this->_request->getPost('arrNiveles')));
        $arrEliminar = json_decode(stripslashes($this->_request->getPost('arrEliminar')));
        $objDefProcesos->denom = $this->_request->getPost('denom');
        $objDefProcesos->descripcion = $this->_request->getPost('descripcion');
        $objDefProcesos->fechacomienzo = $this->_request->getPost('fechacomienzo');
        $objDefProcesos->idperiodoevaluativo = $this->_request->getPost('idperiodoevaluativo');
        $objDefProcesos->idtipoprocesoevaluativo = $this->_request->getPost('idtipoprocesoevaluativo');
        $objDefProcesos->idescala = $this->_request->getPost('idescala');
        $objDefProcesos->puedereclamar = $this->_request->getPost('puedereclamar');
        $objDefProcesos->opinionevaluado = $this->_request->getPost('opinionevaluado');
        //$objDefProcesos->opinante = $this->_request->getPost('opinante');

        /*print_r($this->_request->getPost('puedereclamar'));
        die;*/
        $DatNivelreclamacionModel = new DatNivelreclamacionModel();
        if ($this->_request->getPost('puedereclamar') == 0) {
            $cantidad = $DatNivelreclamacionModel->EliminarNivelByProceso($iddefprocesoevaluativo);
        }else{
            if(count($arrEliminar)>0){
                foreach($arrEliminar as $idnivelreclamacion){
                    $cantidad = $DatNivelreclamacionModel->Eliminar($idnivelreclamacion);
                }
            }
            if (count($arrNiveles) > 0) {
                $DatNivelreclamacionModel->Actualizar($arrNiveles,$iddefprocesoevaluativo);
            }
        }


        $objDefProcesosModel = new DatEvaldefprocesoevaluativoModel();
        $objDefProcesosModel->Actualizar($objDefProcesos);

        $r->codResult = 1;
        $r->mensaje = "El proceso evaluativo definido se ha modificado satisfactoriamente.";
        echo(json_encode($r));
    }

    function eliminarNivelAction()
    {
        $idnivelreclamacion = $this->_request->getPost('idnivelreclamacion');
        $DatNivelreclamacionModel = new DatNivelreclamacionModel();
        $r = $DatNivelreclamacionModel->Eliminar($idnivelreclamacion);
        echo(json_encode($r));
    }

    function eliminardefinirprocesoAction()
    {
        try {
            $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
            $DatNivelreclamacionModel = new DatNivelreclamacionModel();
            $cant = $DatNivelreclamacionModel->EliminarNivelByProceso($iddefprocesoevaluativo);
            $objDefProcesos = Doctrine::getTable('DatEvaldefprocesoevaluativo')->find($iddefprocesoevaluativo);
            $objDefProcesosModel = new DatEvaldefprocesoevaluativoModel();
            $objDefProcesosModel->Eliminar($objDefProcesos);
            $r->codResult = 1;
            $r->exception = 0;
            $r->mensaje = "El proceso evaluativo definido se ha eliminado satisfactoriamente.";
            echo(json_encode($r));
        } catch (Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;
                echo(json_encode($r));
            }
        }
    }

    function restaurarasociacionesAction()
    {
        $recomendacionesAsociadas = json_decode(stripcslashes($this->_request->getPost('recomendacionesAsociadas')));
        $objProcesoRecModel = new DatEvalprocesorecomendacionesModel();
        foreach ($recomendacionesAsociadas as $v) {
            $objProcesoRec = Doctrine::getTable('DatEvalprocesorecomendaciones')->find($v);
            $objProcesoRecModel->Eliminar($objProcesoRec);
        }
        $r->codResult = 1;
        $r->mensaje = "Las recomendaciones han sido desasociadas satisfactoriamente.";
        echo(json_encode($r));
    }

    function restaurarasociacionesSAction()
    {
        $senyalamientosAsociadas = json_decode(stripcslashes($this->_request->getPost('senyalamientosAsociadas')));
        $objProcesoRecModel = new DatEvalprocesoresenyalamientoModel();
        foreach ($senyalamientosAsociadas as $v) {
            $objProcesoRec = Doctrine::getTable('DatEvalprocesoresenyalamiento')->find($v);
            $objProcesoRecModel->Eliminar($objProcesoRec);
        }
        $r->codResult = 1;
        $r->mensaje = "Los se&ntilde;alamientos han sido desasociadas satisfactoriamente.";
        echo(json_encode($r));
    }

    function cargarrecomendacionesasociadasAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $r['datos'] = DatEvalprocesorecomendaciones::getRecomendacionesPE($iddefprocesoevaluativo, $limit, $start);
        $r['cantidad'] = DatEvalprocesorecomendaciones::getCantRecomendacionesPE($iddefprocesoevaluativo);

        echo(json_encode($r));
    }

    function cargarsenyalamientosasociadosAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $r['datos'] = DatEvalprocesoresenyalamiento::getSenalamientosPE($iddefprocesoevaluativo, $limit, $start);
        $r['cantidad'] = DatEvalprocesoresenyalamiento::getCantSenalamientosPE($iddefprocesoevaluativo);
        echo(json_encode($r));
    }

    function asociarrecomendacionesAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefinirprocesoevaluativo');
        $recomendaciones = json_decode(stripcslashes($this->_request->getPost('recomendaciones')));
        $objProcesoRecModel = new DatEvalprocesorecomendacionesModel();
        foreach ($recomendaciones as $v) {
            $objProcesoRec = new DatEvalprocesorecomendaciones();
            $objProcesoRec->iddefprocesoevaluativo = $iddefprocesoevaluativo;
            $objProcesoRec->idrecomendacion = $v;
            $objProcesoRecModel->Insertar($objProcesoRec);
        }
        $r->codResult = 1;
        $r->mensaje = "Las recomendaciones seleccionadas se han guardado correctamente.";
        echo(json_encode($r));
    }

    function asociarsenyalamientosAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefinirprocesoevaluativo');
        $senyalamientos = json_decode(stripcslashes($this->_request->getPost('senyalamientos')));
        $objProcesoSenModel = new DatEvalprocesoresenyalamientoModel();
        foreach ($senyalamientos as $v) {
            $objProcesoSen = new DatEvalprocesoresenyalamiento();
            $objProcesoSen->iddefprocesoevaluativo = $iddefprocesoevaluativo;
            $objProcesoSen->idsenyalamiento = $v;
            $objProcesoSenModel->Insertar($objProcesoSen);
        }
        $r->codResult = 1;
        $r->mensaje = "Los se&ntilde;alamientos seleccionados se han guardado correctamente.";
        echo(json_encode($r));
    }

    function obteneridmodelomodificarAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefinirprocesoevaluativo');
        $objProcesomodelos = Doctrine::getTable('DatEvalprocesomodelos')->findOneByiddefprocesoevaluativo(
            $iddefprocesoevaluativo
        );
        $r->idmodeloamodificar = $objProcesomodelos->idmodelo;
        echo(json_encode($r));
    }

    function adicionarNotificacionAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $asunto = $this->_request->getPost('asunto');
        $mensaje = $this->_request->getPost('mensaje');
        $usuario = $this->_request->getPost('usuario');
        $pass = $this->_request->getPost('pass');
        $idprocesonotif = $this->_request->getPost('idprocesonotif');

        $RSA = new ZendExt_RSA();
        $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
        $nuevaclave = $RSA->encrypt($pass, $keys[1], $keys[0], 5);

        $DatProcesoNotif = new DatProcesonotif();
        $DatProcesoNotifModel = new DatProcesonotifModel();

        $DatProcesoNotif->iddefprocesoevaluativo = $iddefprocesoevaluativo;
        $DatProcesoNotif->asunto = $asunto;
        $DatProcesoNotif->mensaje = $mensaje;
        $DatProcesoNotif->remitente = $usuario;
        $DatProcesoNotif->contrasenna = $nuevaclave;
        $modificar = 0;
        if ($idprocesonotif == null) {
            $DatProcesoNotifModel->Insertar($DatProcesoNotif);
        } else {
            $modificar = 1;
            $DatProcesoNotifModel->Modificar($asunto, $mensaje, $idprocesonotif, $usuario, $nuevaclave);
        }
        $r->modificar = $modificar;
        $r->exito = 1;
        $r->exception = 0;
        echo(json_encode($r));
    }

    function getNivelesAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');

        $DatNivelreclamacion = new DatNivelreclamacion();
        $r['data'] = $DatNivelreclamacion->GetPorLimite($limit, $start, $iddefprocesoevaluativo);
        echo(json_encode($r));
    }

}
