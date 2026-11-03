<?php

class PrepararprocesoController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function prepararprocesoAction()
    {
		
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();		
        $this->view->reccompleja = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();		
        $this->render();
    }

    function todospreprocesosevaluativosAction()
    {			
        $filtro = $this->_request->getPost('denominacion');
        $fdesde = $this->_request->getPost('fdesde');
        $fhasta = $this->_request->getPost('hasta');
        $estado = $this->_request->getPost('estado');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idestructura = $this->global->Estructura->idestructura;
        $objPreProcesos = new DatEvalpreprocesoevaluativo();
        $r['datos'] = $objPreProcesos->ObtenerTodosDefinirDadoPreparar($idestructura, $limit, $start, $idpreprocesoevaluativo, $filtro, $fdesde, $fhasta, $estado);
        $r['cantidad'] = $objPreProcesos->GetCantTotal($idestructura, $idpreprocesoevaluativo, $filtro, $fdesde, $fhasta, $estado);
        $r['success'] = true;

        echo json_encode($r);
    }

    function getProcesosEvalPlanillaActivaAction()
    {
        $filtro = $this->_request->getPost('filtro');
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $idtipoprocesoevaluativo = $this->_request->getPost('idtipoprocesoevaluativo');
        $idestructura = $this->_request->getPost('idestructura');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idestructura = ($idestructura != null) ? $idestructura : $this->global->Estructura->idestructura;
        $objPreProcesos = new DatEvalpreprocesoevaluativo();
        if (empty($iddefprocesoevaluativo) && empty($idtipoprocesoevaluativo)) {
            $r['datos'] = $objPreProcesos->getProcesosEvalPlanillaActiva($idestructura, $limit, $start);
            $r['cantidad'] = $objPreProcesos->getCantTotalProcesosEvalPlanillaActiva($idestructura);
            echo(json_encode($r));
        } else {
            //print_r($filtro);die;
            $r['datos'] = $objPreProcesos->ObtenerTodosDefinirDadoPrepararFiltro(
                $idestructura, $start, $limit, $iddefprocesoevaluativo, $idtipoprocesoevaluativo
            );
            $r['cantidad'] = $objPreProcesos->GetCantTotalFiltro($filtro);
            echo(json_encode($r));
        }
    }

    //Devuelve los procesos evaluativos preparados junto al proceso evaluativo que pertenece
    function getProcesoEvalDef()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objPrepProceso = new DatEvalpreprocesoevaluativo();
        $r['datos'] = $objPrepProceso->getProcesoEvalDef($limit, $start);
        $r['cantidad'] = $objPrepProceso->GetCantTotal();
        echo(json_encode($r));
    }

    function cargarcomboprocesodefAction()
    {
        $r['datos'] = DatEvaldefprocesoevaluativo::getProcesosConPlanillaActiva();
        echo json_encode($r);
    }

    function adicionarpreprocesoAction()
    {

        $objPreProcesos = new DatEvalpreprocesoevaluativo();
        $objPreProcesos->iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $objPreProcesos->identidad = $this->global->Estructura->idestructura;
        $fechainicioPE = $this->_request->getPost('fechainicioPE');
        $fechaFinPE = $this->_request->getPost('fechaFinPE');
        $opinante = $this->_request->getPost('opinion');
        $fechainicioPE = explode('/', $fechainicioPE);
        $fechainicioPE = $fechainicioPE[2] . '-' . $fechainicioPE[1] . '-' . $fechainicioPE[0];
        $objPreProcesos->fechainicioproceso = $fechainicioPE;
        $objPreProcesos->opinante = $opinante;
        if ($fechaFinPE == '') {
            $objPreProcesos->fechafinproceso = null;
        } else {
            $fechaFinPE = explode('/', $fechaFinPE);
            $fechaFinPE = $fechaFinPE[2] . '-' . $fechaFinPE[1] . '-' . $fechaFinPE[0];
            $objPreProcesos->fechafinproceso = $fechaFinPE;
        }
        $objPreProcesosModel = new DatEvalpreprocesoevaluativoModel();
        $objPreProcesosModel->Insertar($objPreProcesos);
        $r->codResult = 1;
        $r->mensaje = "El proceso evaluativo ha sido adicionado satisfactoriamente.";
        echo(json_encode($r));
    }

    function modificarpreprocesoAction()
    {
        $idprepararPE = $this->_request->getPost('idprepararPE');
        $objPreProcesos = Doctrine::getTable('DatEvalpreprocesoevaluativo')->find($idprepararPE);

        $objPreProcesos->iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');

        $objPreProcesos->opinante = $this->_request->getPost('opinion');

        $objPreProcesos->fechainicioproceso = $this->_request->getPost('fechainicioPE');
        $ffp = $this->_request->getPost('fechaFinPE');
        ($ffp == '') ? $objPreProcesos->fechafinproceso = null : $objPreProcesos->fechafinproceso = $ffp;

        $objPreProcesosModel = new DatEvalpreprocesoevaluativoModel();
        $objPreProcesosModel->Actualizar($objPreProcesos);

        $r->codResult = 1;
        $r->mensaje = "El proceso evaluativo ha sido modificado satisfactoriamente.";
        echo(json_encode($r));
    }

    function eliminarprepararprocesoAction()
    {
        try {
            $idprepararPE = $this->_request->getPost('idprepararPE');
            $objPreProcesos = Doctrine::getTable('DatEvalpreprocesoevaluativo')->find($idprepararPE);

            $objPreProcesosModel = new DatEvalpreprocesoevaluativoModel();
            $objPreProcesosModel->Eliminar($objPreProcesos);

            $r->success = true;
            echo(json_encode($r));
        } catch (Exception $e) {
            $r->codMsg = $e->getCode();
            $r->mensaje = $e->getMessage();
            $r->file = $e->getFile();
            $r->linea = $e->getLine();
            echo json_encode($r);
        }
    }

    function obtenerpersonasAction()
    {
        $idcomisionevaluacion = $this->_request->getPost('idcomisionevaluacion');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idestructura = $this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        $idpersonausuario = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
        $iddominio = $this->global->Perfil->iddominio;

        $arrPermisos = $this->integrator->pvd->GetSeguridadXPersona($idpersonausuario[0]->idpersona, $idusuario);
        $permiso = -1;
        if (count($arrPermisos) > 0) {
            $permiso = $arrPermisos[0]['permiso'];
        }
        $personas = $this->integrator->pvd->BuscarPersonaPorTexto(
            $start, $limit, '', $idestructura, $iddominio, $permiso
        );

        $personasComision = DatEvalpersonascomision::getPersonasXComision($idcomisionevaluacion);
        $arrAux = array();
        $i = 0;
        $cantidad = 0;
        $bandera = false;
        foreach ($personas as &$persona) {
            foreach ($personasComision as $perComision) {
                if ($persona['idpersona'] == $perComision['idpersona']) {
                    $bandera = true;
                } else {
                    $cantidad++;
                }
            }
            if (!$bandera) {
                $persona['nombre']
                    =
                    $persona['nombre'] . ' ' . $persona['snombre'] . ' ' . $persona['papel'] . ' ' . $persona['sapel'];
                $arrAux[$i] = $persona;
                $i++;
            }
            $bandera = false;
        }
        $r['data'] = $arrAux;
        $r['cantidad'] = $this->integrator->pvd->CantidadBuscarPersonaPorTexto('', $idestructura, $iddominio, $permiso);
        $r['cantidad'] -= $cantidad;
        echo json_encode($r);
    }

    // Inicio de: Gestion de comisiones...
    function cargarcomisionesAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idestructura = $this->global->Estructura->idestructura;

        $DatEvalcomisionevaluacion = new DatEvalcomisionevaluacion();
        $r['datos'] = $DatEvalcomisionevaluacion->getComisionesXProceso(
            $idpreprocesoevaluativo, $idestructura, $limit, $start
        );
        $r['cantidad'] = $DatEvalcomisionevaluacion->cantComisionesXProceso(
            $idpreprocesoevaluativo, $idestructura, $limit, $start
        );
        echo(json_encode($r));
    }

    function adicionarcomisionAction()
    {
        $denom = $this->_request->getPost('tfDenominacionComision');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idestructura = $this->global->Estructura->idestructura;

        $objComision = new DatEvalcomisionevaluacion();
        $objComision->idpreprocesoevaluativo = $idpreprocesoevaluativo;
        $objComision->denom = $denom;
        $objComision->fechainicio = $this->_request->getPost('dfFechaInicioComision');
        $objComision->fechafin = $this->_request->getPost('dfFechaFinComision');
        $objComision->idestructura = $idestructura;

        $existe = $objComision->existeComision($denom, $idpreprocesoevaluativo, $idestructura);

        if ($existe) {
            $r->codResult = 3;
            $r->mensaje = "Ya existe una comisi&oacute;n con esa denominaci&oacute;n.";
            echo(json_encode($r));
        } else {

            $objComisionModel = new DatEvalcomisionevaluacionModel();
            $objComisionModel->Insertar($objComision);
            $r->codResult = 1;
            $r->mensaje = "La comisi&oacute;n se ha guardado satisfactoriamente.";
            echo(json_encode($r));
        }
    }

    function modificarcomisionAction()
    {
        $idcomisionevaluacion = $this->_request->getPost('idcomisionevaluacion');
        $denom = $this->_request->getPost('tfDenominacionComision');

        $objAux = new DatEvalcomisionevaluacion();
        $objComision = $objAux->Buscar($idcomisionevaluacion);
        $objComision->fechainicio = $this->_request->getPost('dfFechaInicioComision');
        $objComision->fechafin = $this->_request->getPost('dfFechaFinComision');
        $objComision->denom = $denom;

        $objComisionModel = new DatEvalcomisionevaluacionModel();
        $objComisionModel->Actualizar($objComision);
        $r->codResult = 1;
        $r->mensaje = "La comisi&oacute;n se ha modificado satisfactoriamente.";
        echo(json_encode($r));
    }

    function eliminarcomisionAction()
    {
        $idcomisionevaluacion = $this->_request->getPost('idcomisionevaluacion');
        $objComisionModel = new DatEvalcomisionevaluacionModel();
        $objComisionModel->Eliminar($idcomisionevaluacion);
        $r->codResult = 1;
        // $r->mensaje = "La comisión se ha eliminado satisfactoriamente.";
        echo(json_encode($r));
    }

    function asociarpersonaAction()
    {
        $idcomisionevaluacion = $this->_request->getPost('idcomisionevaluacion');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idpersonas = json_decode(stripslashes($this->_request->getPost('idpersonas')));
        $idestructura = $this->global->Estructura->idestructura;
        $formaevaluacion = 1;
        $objPersonacomisionmodel = new DatEvalpersonascomisionModel();
        $personasComision = DatEvalpersonascomision::getPersonasXComision($idcomisionevaluacion);

        //Obtener evaluadores por idcomisionevaluacion
        $arrEvaluadores = DatEvalprocesoevaluadores::getEvaluadoresPorComision($idcomisionevaluacion);
        $arrEvaluadosSeguridad = array();
        if (count($arrEvaluadores) > 0) {
            foreach ($arrEvaluadores as $evaluador) {
                $arrEvaluadosSeguridad[] = $this->pIntegrator->seguridadevaluaciones->obtenerEvaluados(
                    $evaluador['idpersona'], $idestructura, $formaevaluacion, $idpreprocesoevaluativo, "", ""
                );
            }
        }
        foreach ($idpersonas as $idpersona) {
            if ($this->searchByKeyInArray($personasComision, 'idpersona', $idpersona) == false) {
                $objPersonacomision = new DatEvalpersonascomision();
                $objPersonacomision->idpersona = $idpersona;
                $objPersonacomision->idcomisionevaluacion = $idcomisionevaluacion;
                $objPersonacomisionmodel->Insertar($objPersonacomision);

                //Adiciono a la persona en la tabla de seguridad con todas las personas que evaluan los evaluadores de la comision a la que pertenece
                if (count($arrEvaluadosSeguridad) > 0) {
                    $idSeguridadevalentidad = $this->pIntegrator->seguridadevaluaciones->adicionarSeguridadEvalEntidad(
                        $idpersona, $idestructura, $formaevaluacion, $idpreprocesoevaluativo, 1
                    );

                    //Le agrego los evaluados a seguridad con permiso de lectura solamente
                    foreach ($arrEvaluadosSeguridad as $evaluadores) {
                        foreach ($evaluadores as $evaluado) {
                            $varAux2 = $this->pIntegrator->seguridadevaluaciones->adicionarAccesoEvalEntidad(
                                $evaluado['idpersona'], 1, 0, $idSeguridadevalentidad
                            );
                        }
                    }
                }
            }
        }
        $var = count($idpersonas);
        if ($var == 1) {
            $r->codResult = 1;
            $r->mensaje = "La persona seleccionada ha sido adicionada satisfactoriamente.";
            echo(json_encode($r));
        } else {
            $r->codResult = 1;
            $r->mensaje = "Las personas seleccionadas han sido adicionadas satisfactoriamente.";
            echo(json_encode($r));
        }
    }

    function cargarplanillasprocesoAction()
    {
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $objProcesoPlanilla = new DatEvaldefprocesoplanillas();
        $r->datos = $objProcesoPlanilla->obtenerPlanillaAsociadasProceso($iddefprocesoevaluativo);
        echo json_encode($r);
    }

    private function searchByKeyInArray($array, $key, $value)
    {
        foreach ($array as $pValue) {
            if ($pValue[$key] == $value) {
                return true;
            }
        }

        return false;
    }

    function restaurarpersonaAction()
    {
        $arrPersonas = json_decode(stripslashes($this->_request->getPost('arrPersonas')));
        $objPersonacomisionmodel = new DatEvalpersonascomisionModel();
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $formaevaluacion = $this->_request->getPost('formaevaluacion');
        $identidad = $this->global->Estructura->idestructura;

        foreach ($arrPersonas as $persona) {
            /**************Elimino al comisionado de la tabla de de seguridad en caso de que se encuentre***********/
          /*  $varAux = $this->pIntegrator->seguridadevaluaciones->eliminarSeguridadEvalEntidad(
                $persona[1], $identidad, $formaevaluacion, $idpreprocesoevaluativo
            );*/

            /***************Elimino al comisionado de la tabla 'dat_evalpersonascomision'	***********************/
            $objPersonacomisionmodel->Eliminar($persona[1]);
        }
        $r->codResult = 1;
        $r->mensaje = "La(s) persona(s) seleccionada(s) se ha(n) eliminado satisfactoriamente.";
        echo(json_encode($r));
    }

    function asociarevaluadoresAction()
    {
        $arrEvaluadores = json_decode(stripslashes($this->_request->getPost('arrPersonasID')));
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idprocesocomisionevaluacion = $this->_request->getPost('idprocesocomisionevaluacion');
        $idprocesoplanilla = json_decode($this->_request->getPost('idprocesoplanilla'));
        //print_r($idprocesocomisionevaluacion);die;
        $evaluado = new DatEvalprocesoevaluadoresModel();
        $evaluado->adicionarevaluadores($arrEvaluadores, $idpreprocesoevaluativo, $idprocesocomisionevaluacion);

        $r->adicionado = true;
        echo(json_encode($r));
    }

    function restaurarpersonaedoresAction()
    {
        $idprocesoevaluadores = $this->_request->getPost('idprocesoevaluadores');
        $objEvaluadores = new DatEvalprocesoevaluadoresModel();
        $r = $objEvaluadores->EliminarEvaluador($idprocesoevaluadores);
        echo(json_encode($r));
    }

    function asociarevaluadosAction()
    {
        $arrEvaluados = json_decode(stripslashes($this->_request->getPost('arrPersonasID')));
        $idEvaluador = $this->_request->getPost('idEvaluador');
        $idprocesoplanilla = $this->_request->getPost('idprocesoplanilla');
        $permisoEscritura = $this->_request->getPost('permisoEscritura');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $autoevaluacion = json_decode($this->_request->getPost('autoevaluacion'));

        if ($permisoEscritura == 'false') {
            $permisoEscritura = 0;
        } else {
            $permisoEscritura = 1;
        }
        $objEvaluados = new DatEvalprocesoevaluadosModel();
        $objEvaluados->adicionarevaluados(
            $idpreprocesoevaluativo, $arrEvaluados, $idEvaluador, $permisoEscritura, $idprocesoplanilla, $autoevaluacion
        );
        $r->adicionado = true;
        echo(json_encode($r));
    }

    

    function restaurarpersonaedosAction()
    {
        $idEvaluado = $this->_request->getPost('idEvaluado');
        $objEvaluado = new DatEvalprocesoevaluadosModel();
        $r = $objEvaluado->EliminarEvluado($idEvaluado);
        echo(json_encode($r));
    }

    function cargarpersonasporcomisionAction()
    {
        $filtro = $this->_request->getPost('filtro');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idcomisionevaluacion = $this->_request->getPost('idcomisionevaluacion');

        $objPerComision = new DatEvalpersonascomision();
        if ($filtro == '') {
            $r['datos'] = $objPerComision->GetPorLimite($idcomisionevaluacion, $limit, $start);
            $r['cantidad'] = $objPerComision->CantTotal($idcomisionevaluacion);
        } else {
            $r['datos'] = $objPerComision->GetPorLimitePersonaComision($idcomisionevaluacion, $limit, $start, $filtro);
            $r['cantidad'] = $objPerComision->CantTotalporPersonaComision($idcomisionevaluacion, $filtro);

        }
        echo(json_encode($r));
    }

    function cargarevaluadoresAction()
    {
        $idestructuraevaluativa = $this->_request->getPost('idestructuraevaluativa');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $filter = $this->_request->getPost('query');

        $objDomain = new DatEstructurapersona();

        $r['data'] = $objDomain->getAll($idestructuraevaluativa, $limit, $start, $filter);
        $r['total'] = $objDomain->total($idestructuraevaluativa, $filter);
        echo json_encode($r);
    }

    function desactivarPersonaAction()
    {
        $idpersona = $this->_request->getPost('idpersona');
        $activar = $this->_request->getPost('activar');

        $DatEstructurapersonaModel = new DatEstructurapersonaModel();
        $DatEstructurapersonaModel->Modificar($idpersona, $activar);
        $r->success = 1;
        echo json_encode($r);
    }

    function modEstructuraAction()
    {
        $idEstructura = $this->_request->getPost('idEstructura');
        $idEstructuraPadre = $this->_request->getPost('idEstructuraPadre');

        $DatEstructuraevaluativaModel = new DatEstructuraevaluativaModel();
        $DatEstructuraevaluativaModel->Modificar($idEstructura, $idEstructuraPadre);
        $r->success = 1;
        echo json_encode($r);
    }

    function reuvicarPersonaAction()
    {
        $idestructurapersona = $this->_request->getPost('idestructurapersona');
        $idestructuraevaluativa = $this->_request->getPost('idestructuraevaluativa');

        $DatEstructurapersonaModel = new DatEstructurapersonaModel();
        $DatEstructurapersonaModel->ReuvicarPersona($idestructurapersona, $idestructuraevaluativa);
        $r->success = 1;
        echo json_encode($r);
    }

    function cargarEvaluadosPorEvaluadorAction()
    {
        $filtro = $this->_request->getPost('query');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idprocesoevaluadores = $this->_request->getPost('idprocesoevaluadores');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $autoevaluacion = json_decode($this->_request->getPost('autoevaluacion'));

        $objEvaluados = new DatEvalprocesoevaluados();
        $r->datos = $objEvaluados->getEvaluados(
            $idpreprocesoevaluativo, $idprocesoevaluadores, $limit, $start, $filtro, $autoevaluacion
        );
        $r->cantidad = $objEvaluados->getCantEvaluados(
            $idpreprocesoevaluativo, $idprocesoevaluadores, $filtro, $autoevaluacion
        );
        echo(json_encode($r));
    }

    function cargarevaluadosporevaluadoresAction()
    {
        $idPersonaEvaluador = $this->_request->getPost('idPersonaEvaluador');
        $idprocesoevaluadores = $this->_request->getPost('idprocesoevaluadores');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $formaevaluacion = $this->_request->getPost('formaevaluacion');
        $idestructura = $this->global->Estructura->idestructura;
        $objEvaluados = new DatEvalprocesoevaluados();
        $evaluados = $objEvaluados->getEvaluadosProcesoEvaluador(
            $idpreprocesoevaluativo, $idprocesoevaluadores, $limit, $start
        );

        $arrIdPersonas = array();
        $arrIdEvaluados = array();
        foreach ($evaluados as $evaluado) {
            $arrIdPersonas[] = $evaluado['idpersona'];
            $arrIdEvaluados[] = $evaluado['idprocesoevaluados'];
            $arrIdEvaluados[] = $evaluado['idprocesoevaluadores'];
        }
        $personas = array();
        if (count($arrIdPersonas) > 0) {
            $personas = $this->integrator->pvd->BuscarPersonaPorArreglodeID($arrIdPersonas);
        }
        $arrAux = array();
        $i = 0;
        $arrEvaluadosSeguridad = $this->pIntegrator->seguridadevaluaciones->obtenerEvaluados(
            $idPersonaEvaluador, $idestructura, $formaevaluacion, $idpreprocesoevaluativo, "", ""
        );
        foreach ($personas as $persona) {
            $perAux['idprocesoevaluados'] = $arrIdEvaluados[$i++];
            $perAux['idprocesoevaluadores'] = $arrIdEvaluados[$i++];
            $perAux['numid'] = $persona['numid'];
            $perAux['nombre'] = $persona['nombre'];
            $perAux['snombre'] = $persona['snombre'];
            $perAux['papel'] = $persona['papel'];
            $perAux['sapel'] = $persona['sapel'];
            $perAux['idpersona'] = $persona['idpersona'];
            foreach ($arrEvaluadosSeguridad as $evaluadoSeguridad) {
                if ($evaluadoSeguridad['idpersona'] == $perAux['idpersona']) {
                    $perAux['idevalaccesoevalentidad'] = $evaluadoSeguridad['idevalaccesoevalentidad'];
                    break;
                }
            }
            $arrAux[] = $perAux;
        }
        $r['datos'] = $arrAux;
        $r['cantidad'] = $objEvaluados->cantEvaluadosProcesoEvaluador($idpreprocesoevaluativo, $idprocesoevaluadores);
        echo(json_encode($r));
    }

    function cargarcbComisionAction()
    {
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idestructura = $this->global->Estructura->idestructura;
        $objProcComision = new DatEvalprocesocomisionevaluacion();
        $r['datos'] = $objProcComision->getComisionesAsociadasCombo($idpreprocesoevaluativo, $idestructura);
        echo json_encode($r);
    }

    public function cargarcomisionnoasociadasAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idestructura = $this->global->Estructura->idestructura;
        $objComision = new DatEvalcomisionevaluacion();
        $r['datos'] = $objComision->getComisionesNoAsocidas(
            $idpreprocesoevaluativo, $iddefprocesoevaluativo, $idestructura, $limit, $start
        );
        $r['cantidad'] = $objComision->getCantComisionesNoAsocidas(
            $idpreprocesoevaluativo, $iddefprocesoevaluativo, $idestructura
        );
        echo json_encode($r);
    }

    public function cargarcomisionasociadasAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idestructura = $this->global->Estructura->idestructura;

        $objProcComision = new DatEvalprocesocomisionevaluacion();
        $r['datos'] = $objProcComision->getComisionesAsociadas($idpreprocesoevaluativo, $idestructura, $limit, $start);
        $r['cantidad'] = $objProcComision->getCantComisionesAsociadas($idpreprocesoevaluativo, $idestructura);
        echo json_encode($r);
    }

    public function asociarcomisionAction()
    {
        $idscomisionevaluacion = json_decode(stripslashes($this->_request->getPost('idscomisionevaluacion')));
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idestructura = $this->global->Estructura->idestructura;

        $objProcComEvalModel = new DatEvalprocesocomisionevaluacionModel();
        foreach ($idscomisionevaluacion as $idcomisionevaluacion) {
            $objAux = new DatEvalprocesocomisionevaluacion();
            $objAux->idcomisionevaluacion = $idcomisionevaluacion;
            $objAux->idpreprocesoevaluativo = $idpreprocesoevaluativo;
            $objAux->idestructura = $idestructura;
            $objProcComEvalModel->Insertar($objAux);
        }
        $r->codResult = 1;
        $r->mensaje = "Las comisiones seleccionadas se han asociado satisfactoriamente.";
        $r->idprocesoevaluadores = $idprocesoevaluadores;
        echo(json_encode($r));
    }

    public function restaurarcomisionasociadaAction()
    {
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $arrComisiones = json_decode(stripslashes($this->_request->getPost('arrComisiones')));
        $objProcesoComEvalModel = new DatEvalprocesocomisionevaluacionModel();

        foreach ($arrComisiones as $comision) {
            //Obtengo las personas que conforman la comision
            $arrComisionados = DatEvalpersonascomision::getPersonasXComision($comision->idcomisionevaluacion);

            //Obtengo los evaluadores que pertenecen la comision
            $arrEvaluadores = DatEvalprocesoevaluadores::getEvaluadoresPorComision($comision->idcomisionevaluacion);

            $arrIdPersonas = array();
            foreach ($arrComisionados as $comisionado) {
                $arrIdPersonas[] = $comisionado['idpersona'];
            }
            foreach ($arrEvaluadores as $evaluador) {
                $arrIdPersonas[] = $evaluador['idpersona'];
            }

            //Elimino la asociacion de la comision con el proceso evaluativo
            $objProcesoComEval = Doctrine::getTable('DatEvalprocesocomisionevaluacion')->find(
                $comision->idprocesocomisionevaluacion
            );

            $objProcesoComEvalModel->Eliminar($objProcesoComEval);
        }
        $r->codResult = 1;
        $r->mensaje = "Las comisiones seleccionadas se han restaurado satisfactoriamente.";
        echo(json_encode($r));
    }

    public function obtenerpersonasedoresAction()
    {
        $idprocesocomisionevaluacion = $this->_request->getPost('idprocesocomisionevaluacion');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idestructura = $this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        $idpersonausuario = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
        $iddominio = $this->global->Perfil->iddominio;

        $arrPermisos = $this->integrator->pvd->GetSeguridadXPersona($idpersonausuario[0]->idpersona, $idusuario);
        $permiso = -1;
        if (count($arrPermisos) > 0) {
            $permiso = $arrPermisos[0]['permiso'];
        }
        $personas = $this->integrator->pvd->BuscarPersonaPorTexto(
            $start, $limit, '', $idestructura, $iddominio, $permiso
        );

        $objProcEvaldores = new DatEvalprocesoevaluadores();
        $evaluadores = $objProcEvaldores->getEvaluadores(
            $idpreprocesoevaluativo, $idprocesocomisionevaluacion, $limit, $start
        );

        $arrAux = array();
        $cantidad = 0;
        $bandera = false;
        foreach ($personas as &$persona) {
            foreach ($evaluadores as $evaluador) {
                if ($persona['idpersona'] == $evaluador['idpersona']) {
                    $bandera = true;
                } else {
                    $cantidad++;
                }
            }
            if (!$bandera) {
                $perAux['nombre']
                    =
                    $persona['nombre'] . ' ' . $persona['snombre'] . ' ' . $persona['papel'] . ' ' . $persona['sapel'];
                $perAux['idpersona'] = $persona['idpersona'];
                $arrAux[] = $perAux;
            }
            $bandera = false;
        }
        $r['data'] = $arrAux;
        $r['cantidad'] = $this->integrator->pvd->CantidadBuscarPersonaPorTexto('', $idestructura, $iddominio, $permiso);
        $r['cantidad'] -= $cantidad;
        echo json_encode($r);
    }

    public function obtenerpersonasEdosAction()
    {
        $idprocesoevaluadores = $this->_request->getPost('idprocesoevaluadores');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idestructura = $this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        $idpersonausuario = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
        $iddominio = $this->global->Perfil->iddominio;
        $arrPermisos = $this->integrator->pvd->GetSeguridadXPersona($idpersonausuario[0]->idpersona, $idusuario);
        $permiso = -1;
        if (count($arrPermisos) > 0) {
            $permiso = $arrPermisos[0]['permiso'];
        }
        $personas = $this->integrator->pvd->BuscarPersonaPorTexto(
            $start, $limit, '', $idestructura, $iddominio, $permiso
        );
        $arrAux = array();
        if ($idprocesoevaluadores != "") {
            $objProcEvaldos = new DatEvalprocesoevaluados();
            $evaluados = $objProcEvaldos->getEvaluadosProcesoEvaluador(
                $idpreprocesoevaluativo, $idprocesoevaluadores, $limit, $start
            );
            $cantidad = 0;
            $bandera = false;
            foreach ($personas as &$persona) {
                foreach ($evaluados as $evaluado) {
                    if ($persona['idpersona'] == $evaluado['idpersona']) {
                        $bandera = true;
                    } else {
                        $cantidad++;
                    }
                }
                if (!$bandera) {
                    $perAux['nombre'] = $persona['nombre'] . ' ' . $persona['snombre'] . ' ' . $persona['papel'] . ' '
                        . $persona['sapel'];
                    $perAux['idpersona'] = $persona['idpersona'];
                    $arrAux[] = $perAux;
                }
                $bandera = false;
            }
            $r['datos'] = $arrAux;
            $r['cantidad'] = $this->integrator->pvd->CantidadBuscarPersonaPorTexto(
                '', $idestructura, $iddominio, $permiso
            );
            $r['cantidad'] -= $cantidad;
            echo json_encode($r);
        } else {
            foreach ($personas as $persona) {
                $perAux['nombre']
                    =
                    $persona['nombre'] . ' ' . $persona['snombre'] . ' ' . $persona['papel'] . ' ' . $persona['sapel'];
                $perAux['idpersona'] = $persona['idpersona'];
                $arrAux[] = $perAux;
            }
            $r['datos'] = $arrAux;
            $r['cantidad'] = $this->integrator->pvd->CantidadBuscarPersonaPorTexto(
                '', $idestructura, $iddominio, $permiso
            );
            echo json_encode($r);
        }
    }

    function getPersonaPorCargoAction()
    {
        $cargo = $this->_request->getPost('idcargo');
        $idpersonacargo = ZendExt_IoC::getInstance()->pvd->persona->GetPersonaByArrIdCargo(
            $cargo, 1, 15, 0
        );
        $idpersona = Array();
        foreach ($idpersonacargo as $i => $e) {
            $idpersona[$i] = $e['idpersona'];
        }
        if (count($idpersona) > 0) {
            $personas['data'] = ZendExt_IoC::getInstance()->pvd->BuscarPersonaPorArreglodeID($idpersona);
            $personas['total'] = count($personas['data']);
        } else {
            $personas['data'] = Array();
            $personas['total'] = 0;
        }
        echo(json_encode($personas));
    }

    public function getEstructuraEvaluativaAction()
    {
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idpadre = $this->_request->getPost('idpadre');
        $objModel = new DatEstructuraevaluativaModel();
        $data = $objModel->getTreeEstructuraEvaluativa($idpreprocesoevaluativo, $idpadre);
        echo json_encode($data);
    }

    public function getEstructuraAction()
    {
        $node = $this->_request->getPost('node');
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        if ($node=='root') {
            $objtroot = new DatEvalpersonaevaluacion();
            $arrayevaluadores =$objtroot->DameRootEvaluadores($idperiodoproceso);
            foreach($arrayevaluadores as $k=>$id){
                $arrayevaluadores[$k]['id'] = $id['idpersonaevaluador'];
                $arrayevaluadores[$k]['idpadre'] = $id['idpersonaevaluador'];

                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(array($id['idpersonaevaluador']), null, null, 0, null,null, null);

                $arrayevaluadores[$k]['text'] = $persona->data[0]['nombreapellidos'].' ('.$persona->data[0]['categoria'].')'.'          PLANILLA: '.$id['denom'];
                $arrayevaluadores[$k]['checked'] = false;

            }
        }
        else
        {
            $objtroot = new DatEvalpersonaevaluacion();
            $arrayevaluadores =$objtroot->DameEvaluados($node,$idperiodoproceso);
            foreach($arrayevaluadores as $k=>$id){
                $arrayevaluadores[$k]['id'] = $id['idpersonaevaluado'].'1';
                $arrayevaluadores[$k]['idllave'] = $id['idpersonaevaluado'];
                $arrayevaluadores[$k]['idpadre'] = $id['idpersonaevaluador'];
                if($id['nopersona']==0){
                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(array($id['idpersonaevaluado']), null, null, 0, null,null, null);
                    $arrayevaluadores[$k]['text'] = $persona->data[0]['nombreapellidos'].' ('.$persona->data[0]['categoria'].')'.'          PLANILLA: '.$id['denom'];
                }
                else
                {
                    $datosEstructura = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($id['idpersonaevaluado']));
                    $estructura = explode('/', $datosEstructura[0]['rutaDenominacion']);
                    $arrayevaluadores[$k]['text'] =$estructura[0] . '/' . $estructura[3];
                }

                $arrayevaluadores[$k]['checked'] = false;
                $arrayevaluadores[$k]['leaf'] = true;


            }
        }


        echo json_encode($arrayevaluadores);
    }

    public function saveEstructuraEvaluativaAction()
    {
        $arrIdpersona = json_decode(stripslashes($this->_request->getPost('arrIdpersona')));
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $idprocesoplanilla = $this->_request->getPost('idprocesoplanilla');
        $planilla = $this->_request->getPost('planilla');

        if($planilla == 0 ){
            $objModel = new DatEvalpersonaevaluacion();
            $arrap = $objModel->obtenerPlantillaModelo($idperiodoproceso,$idprocesoplanilla);
            $objModel->modificartodo($idperiodoproceso, $arrap[0]['idplanilla'],$arrap[0]['idmodelo']);
        }else{
            $objModel = new DatEvalpersonaevaluacion();
            $arrap = $objModel->obtenerPlantillaModelo($idperiodoproceso,$idprocesoplanilla);

            $objModel->modificar($arrIdpersona, $idperiodoproceso, $arrap[0]['idplanilla'],$arrap[0]['idmodelo']);
        }


        $r->success = true;
        echo json_encode($r);
    }

    public function deleteEstructuraEvaluativaAction()
    {
        $idestructuraevaluativa = $this->_request->getPost('idestructuraevaluativa');

        $objModel = new DatEstructuraevaluativaModel();
        $r->success = $objModel->delete($idestructuraevaluativa);

        echo json_encode($r);
    }

    public function limpiarEstructuraEvaluativaAction()
    {
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $idprocesoplanilla = $this->_request->getPost('idplanilla');

        $objModel = new DatEstructuraevaluativaModel();
        $r->success = $objModel->limpiar($idpreprocesoevaluativo, $idprocesoplanilla);

        echo json_encode($r);

    }

    /**
     * Accion de adicionar periodo evaluativo
     */
    public function addRangeAction()
    {
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $iddefprocesoevaluativo = $this->_request->getPost('iddefprocesoevaluativo');
        $denominacion = $this->_request->getPost('denominacion');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $fechainicioeval = $this->_request->getPost('fechainicioeval');
        $fechafineval = $this->_request->getPost('fechafineval');
        $idtipoestructura = $this->_request->getPost('idtipoestructura');
        $planilla = $this->_request->getPost('planilla');
        set_time_limit(36000);
        ini_set('memory_limit', '2048M');
        $objModel = new DatEvalprocesoperiodoModel();
		$estado = 1;
        $result = $objModel->addRange($idpreprocesoevaluativo, $denominacion, $fechainicio, $fechafin, $fechainicioeval, $fechafineval, $estado, $idtipoestructura,$planilla);
        if ($result == 1) {
            $request->success = true;
            $request->mensaje = "El periodo ha sido adicionado satisfactoriamente.";
            echo json_encode($request);
        } else {
            $request->success = false;
            $request->mensaje = "El periodo que quiere adicionar ya existe.";
            echo json_encode($request);
        }
    }

   //************adicionar persona a la estrcutura evalautiva***************//
    public function adicionarpersonaestructuraAction()
    {
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $idplanilla = $this->_request->getPost('idplanilla');       
		
        $estado = $this->_request->getPost('estado');
        $idpersonaevaluador = $this->_request->getPost('idpersonaevaluador');
        $idpersonaevaluado = $this->_request->getPost('idpersonaevaluado');		

        $objModel = new DatEvalprocesoperiodoModel();

        $result = $objModel->addPersonaEstructura($idperiodoproceso, $idplanilla, $estado, $idpersonaevaluador, $idpersonaevaluado);

        if ($result == 1) {
            $request->success = true;
            $request->mensaje = "La persona se ha adicionado satisfactoriamente.";
            echo json_encode($request);
        } else {
            $this->request->success = false;
            $this->request->mensaje = "La persona que quiere adicionar ya existe.";
            echo json_encode($request);
        }
    }

    public function changeRangeAction()
    {
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $denominacion = $this->_request->getPost('denominacion');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $fechainicioeval = $this->_request->getPost('fechainicioeval');
        $fechafineval = $this->_request->getPost('fechafineval');
        $planilla = $this->_request->getPost('planilla');
        try {
            $objModel = new DatEvalprocesoperiodoModel();
            $result = $objModel->changeRange($idperiodoproceso, $denominacion, $fechainicio, $fechafin, $fechainicioeval, $fechafineval,$planilla);
            if ($result) {
                $request->success = true;
                $request->mensaje = "El preiodo ha sido modifcado satisfactoriamente.";
                echo json_encode($request);
            }
        } catch (Exception $e) {
            $request->success = false;
            $request->mensaje = $e->getMessage();
            $request->file = $e->getFile();
            $request->linea = $e->getLine();
            echo json_encode($request);
        }
    }

    public function removeRangeAction()
    {
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');

        try {
            if ($idperiodoproceso != '') {
                $objModel = new DatEvalprocesoperiodoModel();
                $result = $objModel->removeRange($idperiodoproceso);
                if ($result == 1) {
                    $request->success = true;
                    $request->mensaje = "El preiodo del proceso ha sido eliminado satisfactoriamente.";
                    echo json_encode($request);
                }
            } else {
                throw new Exception('No existe un período del proceso al cual se debe eliminar');
            }
        } catch (Exception $e) {
        }
    }

    public function cambiarestadoAction()
    {
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $objProcesoModel = new DatPeriodoprocesoModel();
        $objProcesoModel->ModificarEstado($idperiodoproceso);
        $r->codResult = 1;
        $r->mensaje = "El estado se ha modificado satisfactoriamente.";
        echo(json_encode($r));
    }

    function getPersonasEvalAction()
    {
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');

        $objDomain = new DatEvalpersonaevaluacion();
        $r['datos'] = $objDomain->getEvaluadosProceso(
            $idperiodoproceso, null,
            $query, $limit, $start, true
        );
        $r['cantidad'] = $objDomain->getCantEvaluadosPeriodo($idperiodoproceso, null, $this->_request->getPost('query'));

        echo json_encode($r);
    }

    //****************Evaluadores para la estrcutura del periodo******//

    function getEvaluadoresEstructuraAction()
    {
        $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');

        $objDomain = new DatEvalpersonaevaluacion();
        $r['datos'] = $objDomain->getEvaluadoresEstructura($idperiodoproceso, $query, $limit, $start);
        $r['cantidad'] = $objDomain->getCantEvaluadoresEstructura($idperiodoproceso, $this->_request->getPost('query'));

        echo json_encode($r);
    }

    function getEvaluadoresAction()
    {
        try {
            $idperiodoproceso = $this->_request->getPost('idperiodoproceso');
            $idpersona = $this->_request->getPost('idpersona');
            $objModel = new DatPeriodoprocesoModel();
            if ($this->_request->getPost('query') != '') {
                $r = $objModel->getGestionarpersonas($idpersona, $idperiodoproceso, $this->_request->getPost('limit'), $this->_request->getPost('start'), $this->_request->getPost('query'));
            } else {
                $r = $objModel->getGestionarpersonas($idpersona, $idperiodoproceso, $this->_request->getPost('limit'), $this->_request->getPost('start'));
            }
            echo json_encode($r);
        } catch (Exception $e) {
            $r->codMsg = $e->getCode();
            $r->mensaje = $e->getMessage();
            $r->file = $e->getFile();
            $r->linea = $e->getLine();
            echo json_encode($r);
        }
    }

    function cambiarevaluadorAction()
    {
        try {
            $idpersona_eval = $this->_request->getPost('idpersona_eval');
            $idpersona = $this->_request->getPost('idpersona');

            $objModel = new DatPeriodoprocesoModel();
            if ($objModel->cambiarEvaluador($idpersona_eval, $idpersona)) {
                $r->codMsg = 1;
                $r->mensaje = "El evaluador ha sido modificado satisfactoriamente.";
                echo(json_encode($r));
            }
        } catch (Exception $e) {
            $r->codMsg = $e->getCode();
            $r->mensaje = $e->getMessage();
            $r->file = $e->getFile();
            $r->linea = $e->getLine();
            echo json_encode($r);
        }

    }
	
    function tieneEstructuraAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $tipo = $this->_request->getPost('tipo');
        set_time_limit(36000);
        ini_set('memory_limit', '2048M');
       // $arrEstPersona = ZendExt_IoC_Inter::getInstance()->maestro->getEstructurasControlByDominioyEstructura($tipo, $idestructura);
        $arrEstPersona = ZendExt_IoC_Inter::getInstance()->maestro->getEstructurasControlTiene($tipo, $idestructura);

        //$cant = count($arrEstPersona);

            if ($arrEstPersona[0]['count']>0)
			{
			 $r->success = true;
             echo (json_encode($r));			 
            }
			else
			{
			   $r->success = false;
               echo (json_encode($r));
			}
    }
	function cargarpersonascargoAction()
	{
		
       $idestructura = $this->_request->getPost('idestructura');
	   $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
	   
	   $arrCargos = $this->integrator->metadatos->obtenerCargosEstructura($idestructura,false,false);

		foreach($arrCargos as $array){
			$idcargo[] = $array['idcargo'];
		}
		
        $objModel = new DatEstructuraevaluativa();
        $r['datos'] = $objModel->getPersonas($idpreprocesoevaluativo, $idestructura);
      	
	   //$strIdPersona = array();
	   if(count($r['datos'])>0)
	   {
         foreach ($r['datos'] as $p) {	
         $strIdPersona[]  = $p['idpersona'];        
        }
	   }  
	      		
		$personas = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, 0, null,$idcargo, null);		
		if(count($strIdPersona)>0){
			foreach ($personas->data as $j=>$pers){
			foreach	($strIdPersona as $id){				
				if($pers['idpersona']!= $id){
					
					$datos['data'][]=$pers;
					
				}
				else
				{
					$datos['data'] = Array();
				}
				
			}	
			//$personanew['data'] = $pers;
		}
		
		echo (json_encode($datos));	
		}
		else
		{		
			echo (json_encode($personas));
		}
	}
    public function sincronizarestructuraAction()
    {
        try {
            set_time_limit(36000);
            ini_set('memory_limit', '2048M');
            $idperiodoproceso = $this->_request->getPost('idperiodoproceso');

            $objProcesoModel = new DatPeriodoprocesoModel();
            if ( $objProcesoModel->Sincronizarestructura($idperiodoproceso)) {
                $r->codResult = 1;
                $r->mensaje = "La estructura se modifico satisfactoriamente.";
                echo(json_encode($r));
            }
        } catch (Exception $e) {
            $r->codMsg = $e->getCode();
            $r->mensaje = $e->getMessage();
            $r->file = $e->getFile();
            $r->linea = $e->getLine();
            echo json_encode($r);
        }
    }
}
