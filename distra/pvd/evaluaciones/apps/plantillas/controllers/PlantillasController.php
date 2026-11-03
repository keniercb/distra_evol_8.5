<?php

class PlantillasController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function plantillasAction()
    {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    //Devuelve todas las planillas
    function todasplanillasAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $denominacion = $this->_request->getPost('denomPlanilla');

        $objPlanilla = new DatEvalplanillasevaluativas();
        if ($denominacion) {
            $r['datos'] = $objPlanilla->ObtenerPlanillaPorDenom($denominacion, $limit, $start);
        } else {
            $r['datos'] = $objPlanilla->MostrarPlanillas($limit, $start);
            $r['cantidad'] = $objPlanilla->GetCantTotal();
        }

        echo(json_encode($r));
    }

//Adiciona una planilla
    function adicionarplanillaAction()
    {
        $objPlanilla = new DatEvalplanillasevaluativas();
        $objPlanilla->codigo = $this->_request->getPost('cod');
        $objPlanilla->denom = $this->_request->getPost('denom');
        $objPlanilla->descripcion = $this->_request->getPost('descrip');
        $objPlanilla->fechainicio = $this->_request->getPost('fi');

        if ($this->_request->getPost('ff') == '') {
            $ff = null;
        } else {
            $ff = $this->_request->getPost('ff');
        }
        $objPlanilla->fechafin = $ff;
        $objPlanilla->iddominioevaluativo = $this->_request->getPost('iddominio');
        $objPlanilla->idestado = $this->_request->getPost('idestado');

        $objPlanillaModel = new DatEvalplanillasevaluativasModel();
        $objPlanillaModel->Insertar($objPlanilla);
        $r->result = 1;
        echo(json_encode($r));
    }

    function modificarplanillaAction()
    {
        $idplanilla = $this->_request->getPost('idplanilla');
        $objPlanilla = Doctrine::getTable('DatEvalplanillasevaluativas')->find($idplanilla);
        $codigo = $this->_request->getPost('cod');
        $objPlanilla->denom = $this->_request->getPost('denom');
        $objPlanilla->descripcion = $this->_request->getPost('descrip');
        $objPlanilla->fechainicio = $this->_request->getPost('fi');
        if ($this->_request->getPost('ff') == '') {
            $ff = null;
        } else {
            $ff = $this->_request->getPost('ff');
        }
        $objPlanilla->fechafin = $ff;
        $objPlanilla->iddominioevaluativo = $this->_request->getPost('iddominio');
        $objPlanilla->idestado = $this->_request->getPost('idestado');

        if ($objPlanilla->codigo != $codigo) {
            if (!$this->verificarcodigo($this->_request->getPost('cod'))) {
                $objPlanilla->codigo = $this->_request->getPost('cod');
                $objPlanillaModel = new DatEvalplanillasevaluativasModel();
                $objPlanillaModel->Actualizar($objPlanilla);
                $r->result = 1;

            } else {
                throw new ZendExt_Exception('CHE047');
            }
        } else {
            $objPlanilla->codigo = $this->_request->getPost('cod');
            $objPlanillaModel = new DatEvalplanillasevaluativasModel();
            $objPlanillaModel->Actualizar($objPlanilla);
            $r->result = 1;
        }
        echo(json_encode($r));
    }

    function duplicarPlanillaAction()
    {
        $idplanilla = $this->_request->getPost('idplanilla');
        $codigo = $this->_request->getPost('cod');
        $denominacion = $this->_request->getPost('denom');
        $descripcion = $this->_request->getPost('descrip');
        $fechaInicio = $this->_request->getPost('fi');
        $fechaFin = $this->_request->getPost('ff');
        $iddominio = $this->_request->getPost('iddominio');

        $objModel = new DatEvalplanillasevaluativasModel();
        $objModel->duplicarPlanillaAction(
            $idplanilla, $codigo, $denominacion, $descripcion, $fechaInicio, $fechaFin, $iddominio
        );

        $r->result = 1;
        echo json_encode($r);
    }

    function verificarcodigo($codigo)
    {
        $objIndicadorT = DatEvalplanillasevaluativas::contarcodigo($codigo);
        if ($objIndicadorT) {
            return 1;
        } else {
            return 0;
        }
    }

//Elimina una planilla
    function eliminarplanillaAction()
    {
        $idplanilla = $this->_request->getPost('idPlanilla');

        $objPlanillaModel = new DatEvalplanillasevaluativasModel();
        $r = $objPlanillaModel->delete($idplanilla);
        echo(json_encode($r));
    }

//Devuelve todos los recursos evaluativos
    function todosrecursosAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objRecurso = new DatEvalrecursoevaluativo();
        $r['datos'] = $objRecurso->GetPorLimite($limit, $start);
        $r['cantidad'] = $objRecurso->GetCantTotal();

        echo(json_encode($r));
    }

//Devuelve todos los dominios evaluativos
    function cargardominioAction()
    {
        $idrecursoevaluativo = $this->_request->getPost('idrecurso');
        $iddominioevaluativo = $this->_request->getPost('iddominio');
        if ($iddominioevaluativo == 'raizDominio') {
            $iddominioevaluativo = -1;
        }

        $objDominio = new DatEvaldominioevaluativo();

        $r = $objDominio->GetDominioEvaluativo($iddominioevaluativo, $idrecursoevaluativo);
        $v = null;
        $nodos = array();
        if (count($r) > 0) {
            foreach ($r as $v) {
                $nodos[] = array('id'          => $v['iddominioevaluativo'], 'text' => $v['denom'],
                                 'descripcion' => $v['descripcion'], 'idpadre' => $v['idpadre']);
            }
        }
        echo(json_encode($nodos));
    }

//Devuelve los indicadores que tiene adjuntos una planilla
    function cargarindicadoresAction()
    {
        $idplanilla = $this->_request->getPost('idplanilla');
        $idnodopadre = $this->_request->getPost('idnodo');
        $indicadores = array();
        $objIndicadorPlanilla = new DatEvalindicadoresplanilla();
        $objIndicadorTexto = new NomEvalindicadortexto();
        $objIndImg = new NomEvalindicadorimagen();
        if (!empty($idplanilla) && $idplanilla != -1) {
            $indicadores = $objIndicadorPlanilla->GetIndicadoresPorPlanilla($idplanilla, $idnodopadre);

            $arrIndTexto = array();
            $arrIndImagen = array();
            foreach ($indicadores as $indicador) {
                if ($indicador['tipo'] == true) {
                    $arrIndTexto[] = $indicador['idindicador'];
                } else {
                    $arrIndImagen[] = $indicador['idindicador'];
                }
            }
            if (count($arrIndTexto) > 0) {
                $arrIndTexto = $objIndicadorTexto->getArrIndicadoresPorId($arrIndTexto);
            }
            if (count($arrIndImagen) > 0) {
                $arrIndImagen = $objIndImg->getArrIndicadoresPorId($arrIndImagen);
            }
            $result = array();
            if (count($indicadores) > 0) {
                foreach ($indicadores as $key => $indicador) {
                    foreach ($arrIndTexto as $indTexto) {
                        if ($indicador['idindicador'] == $indTexto['idindicadortexto']) {
                            $result[] = array_merge($indicador, $indTexto);
                        }
                    }
                    foreach ($arrIndImagen as $indImg) {
                        if ($indicador['idindicador'] == $indImg['idindicadorimagen']) {
                            $result[] = array_merge($indicador, $indImg);
                        }
                    }
                }
            }
            $nodos = array();
            if (count($result) > 0) {
                foreach ($result as $v) {
                    $icono = "";
                    if ($v['calculado'] == false) {
                        $icono = "task-folder";
                    } else {
                        if ($v['tipo'] == true && $v['eshoja'] == 1) {
                            $icono = "indicadorTexto";
                        } else {
                            if ($v['tipo'] == false && $v['eshoja'] == 1) {
                                $icono = "indicadorImagen";
                            }
                        }
                    }
                    $nodos[] = array('id'      => $v['idindicadorplanilla'], 'idindicador' => $v['idindicador']
                    , 'text'                   => $v['denom'], 'abreviatura' => $v['abreviatura'],
                                     'idpadre' => $v['idpadre']
                    , 'descripcion'            => $v['descripcion'], 'tipo' => $v['tipo'], 'iconCls' => $icono
                    , 'calculado'              => $v['calculado'], 'ayuda' => $v['ayuda']
                    , 'leaf'                   => $v['eshoja'] == 0 ? false : true
                    , 'idindicadorcalculado'   => $v['idindicadorcalculado']
                    , 'idexpresionmatematica'  => $v['idexpresionmatematica']
                    );
                }
            }
            echo json_encode($nodos);

            return;
        }
    }

    function getindicadorevaluarAction()
    {
        $idindicadorplanilla = $this->_request->getPost('idindicadorplanilla');
        $objIndicadorEvaluar = new DatEvalindicadoresevaluar();
        $result = $objIndicadorEvaluar->GetIndicadorEvaluar($idindicadorplanilla);

        echo(json_encode($result));
    }

//Carga los estados por los que pasa una planilla
    function cargarEstadosAction()
    {
        $arrEstados = $this->pIntegrator->evaluaciones->CargarEstados();
        if (is_array($arrEstados)) {
            $arrEstados = array('cantidad' => count($arrEstados), 'datos' => $arrEstados);
            echo(json_encode($arrEstados));
        }
    }

//Devuelve todas las escalas
    function todasescalasAction()
    {
        //$limit = $this->_request->getPost ( 'limit' );
        //$start = $this->_request->getPost ( 'start' );
        $objEscala = new DatEvalescala();
        $r['datos'] = $objEscala->GetTodos();
        $r['cantidad'] = $objEscala->GetCantTotal();
        echo(json_encode($r));
    }

//Devuelve tipo de escala  segun idescala
    function getTipoEscalaAction()
    {
        $idescala = $this->_request->getPost('idescala');
        $objEscala = new DatEvalescala();
        $r = $objEscala->Buscar($idescala);
        echo(json_encode($r[0][tipoescala]));
    }

//Devuelve los valores de una escala
    function cargarvaloresescalaAction()
    {
        $idescala = $this->_request->getPost('idescala');
        $objEscala = new DatEvalescala();
        $arrValoresEscala['datos'] = $objEscala->GetValoresPorEscala($idescala);
        $arrValoresEscala['cantidad'] = count($arrValoresEscala['datos']);
        echo(json_encode($arrValoresEscala));
    }

//Devuelve todos los indicadores
    function cargartodosindicadoresAction()
    {
        $tipoI = $this->_request->getPost('tipoI');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $filtro = $this->_request->getPost('filtro');

        $objIndicadorTexto = new NomEvalindicadortexto();
        $objIndImg = new NomEvalindicadorimagen();
        $arrIndTexto = array();
        $arrIndImagen = array();
        $result = array();
        //Si se va a adicionar un indcador de agrupacion
        if ($tipoI == 'Ag' || $tipoI == 'Text') {
            if ($filtro) {
                $arrIndTexto = $objIndicadorTexto->ObtenerIndicadorTBuscado($filtro, $limit, $start);
                $cantidad = $objIndicadorTexto->ObtenerCantidadIndicadorTBuscado($filtro);
                $result = array();
                foreach ($arrIndTexto as $key => $v) {
                    $result[] = array('idindicador' => $v['idindicadortexto'], 'denom' => $v['denom'],
                                      'tipo'        => 'Texto', 'descripcion' => $v['descripcion']);
                }
                $r->datos = $result;
                $r->cantidad = $cantidad;
            } else {
                $arrIndTexto = $objIndicadorTexto->GetPorLimite($limit, $start);
                $cantidad = $objIndicadorTexto->GetCantTotal();
                $result = array();
                foreach ($arrIndTexto as $key => $v) {
                    $result[] = array('idindicador' => $v['idindicadortexto'], 'denom' => $v['denom'],
                                      'tipo'        => 'Texto', 'descripcion' => $v['descripcion']);
                }
                $r->datos = $result;
                $r->cantidad = $cantidad;
            }
        } //Si se va a adicionar un indcador de imagen
        else {
            if ($tipoI == 'Img') {
                $arrIndImagen = $objIndImg->GetTodos();
                $r->cantidad = $objIndImg->GetCantTotal();
                if (count($arrIndImagen) > 0) {
                    foreach ($arrIndImagen as $key => $v) {
                        $result[] = array('idindicador' => $v['idindicadorimagen'], 'denom' => $v['nombre'],
                                          'tipo'        => 'Imagen', 'descripcion' => $v['descripcion']);
                    }
                }
                $r->datos = $result;
            }
        }
        echo json_encode($r);
    }

    //Adiciona un indicador a la planilla
    function addindicadorplanillaAction()
    {
        $idindicador = $this->_request->getPost('idindicador');
        $tipo = $this->_request->getPost('tipo');
        $abreviatura = $this->_request->getPost('abreviatura');
        $idpadre = $this->_request->getPost('idpadre');
        $calculado = $this->_request->getPost('calculado');
        $idplanilla = $this->_request->getPost('idplanilla');
        $tipoI = $this->_request->getPost('tipoI');
        /*
          if($tipoI == 'Ag'){
          $tipo = $this->getTipoIndicador($denomIndicador);
          } */

        $objIndicadorPlanilla = new DatEvalindicadoresplanilla();
        $existe = $objIndicadorPlanilla->existeIndicadorPlanilla($idplanilla, $idindicador, $tipo);

        if (!$existe) {
            $objIndicadorPlanilla->idindicador = $idindicador;
            $objIndicadorPlanilla->tipo = $tipo;
            $objIndicadorPlanilla->abreviatura = $abreviatura;
            $objIndicadorPlanilla->eshoja = $tipoI == 'Ag' ? 0 : 1;
            if ($idpadre != '') {
                $objIndicadorPlanilla->idpadre = $idpadre;
            }
            $objIndicadorPlanilla->idplanilla = $idplanilla;

            $objIndicadorPlanillaModel = new DatEvalindicadoresplanillaModel();
            $objIndicadorPlanillaModel->Insertar($objIndicadorPlanilla);

            if ($idpadre == '') {
                $idindicadorplanilla = $objIndicadorPlanilla->GetLastIdIP();
                $objIndicadorPlanilla = Doctrine::getTable('DatEvalindicadoresplanilla')->find($idindicadorplanilla);
                $objIndicadorPlanilla->idpadre = $idindicadorplanilla;
                $objIndicadorPlanillaModel->Actualizar($objIndicadorPlanilla);
            }

            $r->result = 1;
            echo(json_encode($r));
        } else {
            $r->result = 3;
            echo json_encode($r);
        }
    }

    function eliminarindicadorplanillaAction()
    {
        $idindicadorplanilla = $this->_request->getPost('idindicadorplanilla');

        $objIndicadorPlanillaModel = new DatEvalindicadoresplanillaModel();
        $r = $objIndicadorPlanillaModel->delete($idindicadorplanilla);

        echo(json_encode($r));
    }

    private function getTipoIndicador($cadena)
    {
        $trozos = explode("_", $cadena);
        if ($trozos[0] == 'Texto') {
            $resultado = 'true';
        } else {
            $resultado = 'false';
        }

        return $resultado;
    }

    function guardarDatosIPAction()
    {
        $idindicadorplanilla = $this->_request->getPost('idindicadorplanilla');
        $idescala = $this->_request->getPost('idescala');
        $complementotextual = $this->_request->getPost('complementotextual');
        $obligatorio = $this->_request->getPost('obligatorio');
        $ayuda = $this->_request->getPost('ayuda');
        $objIndicadorEvaluarModel = new DatEvalindicadoresevaluarModel();
        $objIndicadorEI = new DatEvalindicadoresevaluar();
        $idindicadorevaluar = $objIndicadorEI->GetIdIndicadorEvaluar($idindicadorplanilla);

        if (!empty($idindicadorevaluar)) {
            $idevalindicadoresevaluar = $idindicadorevaluar[0]['idevalindicadoresevaluar'];
            $objIndicadorEA = new DatEvalindicadoresevaluar();
            $objIndicadorEA = Doctrine::getTable('DatEvalindicadoresevaluar')->find($idevalindicadoresevaluar);
            if ($idescala != -1) {
                $objIndicadorEA->idescala = $idescala;
            }
            $objIndicadorEA->complementotextual = $complementotextual;
            $objIndicadorEA->obligatorio = $obligatorio;
            $objIndicadorEvaluarModel->Actualizar($objIndicadorEA);
        } else {
            $objIndicadorEI->idindicadorplanilla = $idindicadorplanilla;
            if ($idescala != -1) {
                $objIndicadorEI->idescala = $idescala;
            }
            $objIndicadorEI->complementotextual = $complementotextual;
            $objIndicadorEI->obligatorio = $obligatorio;
            $objIndicadorEvaluarModel->Insertar($objIndicadorEI);
        }

        if ($ayuda != '') {
            $objIndicadorPlanilla = new DatEvalindicadoresplanilla();
            $objIndicadorPlanilla = Doctrine::getTable('DatEvalindicadoresplanilla')->find($idindicadorplanilla);
            $objIndicadorPlanilla->ayuda = $ayuda;
            $objIndicadorPlanillaModel = new DatEvalindicadoresplanillaModel();
            $objIndicadorPlanillaModel->Actualizar($objIndicadorPlanilla);
        }

        $r->success = true;
        echo json_encode($r);
    }

    function addExpMatematicaIndAction()
    {
        $idindicadorplanilla = $this->_request->getPost('idindicadorplanilla');
        $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');

        $objIndCalculado = new DatEvalindicadorescalculado();
        $objIndCalculado->idindicadorplanilla = $idindicadorplanilla;
        $objIndCalculado->idexpresionmatematica = $idexpresionmatematica;
        $objIndCalculado->save();

        $objModel = new DatEvalindicadoresplanillaModel();
        $objModel->updateCalculado($idindicadorplanilla, 1);

        $r->idindicadorcalculado = $objIndCalculado->idindicadorcalculado;
        $r->success = true;
        echo json_encode($r);
    }

    function elimExpMatmaticaIndAction()
    {
        $idindicadorcalculado = $this->_request->getPost('idindicadorcalculado');
        $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
        $objModel = new DatEvalindicadorescalculadoModel();
        $r = $objModel->Eliminar($idindicadorcalculado, $idexpresionmatematica);
        $r->success = true;
        echo json_encode($r);
    }

    function getExpresionMatematicaAction()
    {
        $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
        $r = $this->pIntegrator->comun->BuscarTodosporarrIdExpresionMatematica(array($idexpresionmatematica));
        echo json_encode($r);
    }

    function sincronizarImagenAction()
    {
        $idIndicadorImagen = $this->_request->getPost('idIndicadorImagen');
        $nombreImagen = $this->pIntegrator->evaluaciones->SincronizarImgBDconFicheroServer($idIndicadorImagen);
        echo(json_encode($nombreImagen));
    }

}
