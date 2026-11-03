<?php
$diwwwexcel = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($diwwwexcel . '/pvd/comun/recursos/PHPExcel.php');
include_once($diwwwexcel . '/pvd/comun/recursos/PHPExcel/Reader/Excel5.php');
include_once($diwwwexcel . '/pvd/comun/recursos/PHPExcel/IOFactory.php');
class GestionarprocesoseleccionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function gestionarprocesoseleccionAction()
    {
        $this->view->reccompleja = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
        $this->render();
    }

    // Función para obtener los cargos y sus homologaciones.
    function getCargosAction()
    {
        try {
            $r = DatProcesoModel::getCargos($this->_getParam('query'));
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function getComiteByIdProcesoAction()
    {
        try {
            $r = DatProcesocomiteModel::getComiteByIdProceso($this->_getParam('idproceso'));
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function getPlanillasevaluativasAction()
    {
        try {
            $r = ConfTecnicaModel::getTecnicaNoProceso($this->_getParam('idproceso'));
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function getResponsableTecnicaSeleccionAction()
    {
        try {
            $r = DatResponsableModel::getRespByTecnica($this->_getParam('idprocesotecnica'));
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function getModelosbyPlanillaAction()
    {
        try {
            $r = DatProcesoModel::getModeloByPlanilla($this->_getParam('idplanilla'));
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function getMenuSeleccionAction()
    {
        $id = $this->_request->getPost('node');
        $idproceso = $this->_request->getPost('idproceso');
        $otroproc = $this->_request->getPost('otro');
        if ($id == 'idmenu') {
            if ($otroproc == 1) {
                $menu = array(
                    array(
                        'id' => 'gestseleccion',
                        'text' => 'Gestionar selección',
                        'idpadre' => 'idmenu',
                        'leaf' => true,
                        'iconCls' => 'seleccion'
                    )
                );
            } else {
                $menu = array(
                    array(
                        'id' => 'gestcandidatos',
                        'text' => 'Gestionar candidatos',
                        'idpadre' => 'idmenu',
                        'leaf' => true,
                        'iconCls' => 'clienteproveedor'
                    ), array(
                        'id' => 'tecnicas',
                        'text' => 'Técnicas de selección',
                        'idpadre' => 'idmenu',
                        'iconCls' => 'tecnica'
                    ), array(
                        'id' => 'gestseleccion',
                        'text' => 'Gestionar selección',
                        'idpadre' => 'idmenu',
                        'leaf' => true,
                        'iconCls' => 'seleccion'
                    ), array(
                        'id' => 'analisis',
                        'text' => 'Análisis',
                        'idpadre' => 'idmenu',
                        'leaf' => true,
                        'iconCls' => 'graficar'
                    ), array(
                        'id' => 'gestseguimiento',
                        'text' => 'Seguimiento',
                        'idpadre' => 'idmenu',
                        'leaf' => true,
                        'iconCls' => 'deshacer'
                    )
                );
            }
        } else {
            $tecn = DatProcesotecnicaModel::getTecnicaByIdProceso($idproceso);
            $menu = Array();
            foreach ($tecn as $i=>$val) {
                $menu[$i]['id'] = $val['idprocesotecnica'];
                $menu[$i]['text'] = $val['planilla'];
                $menu[$i]['cantd'] = $val['cantd'];
                $menu[$i]['planillasexp'] = DatProcesotecnica::tienePlanillaNoActiva($val['idprocesotecnica']);
                $menu[$i]['idpadre'] = 'tecnicas';
                $menu[$i]['iconCls'] = 'documentos';
                $menu[$i]['leaf'] = true;
            }
        }
        echo json_encode($menu);
    }

    function getTecPlanillaByProcesAction()
    {
        $result = DatProcesotecnicaModel::getTecnicaByIdProceso($this->_getParam('idproceso'));
        $resp = Array();
        foreach ($result as $k=>$val) {
            if ($val['idescala']) {
                $valores = ConfTecnicaModel::getValoresByIdEscala($val['idescala']);
                foreach ($valores as $i=>$value) {
                    $valor[$i][0] = $value['id'];
                    $valor[$i][1] = $value['denominacion'];
                }
            } else {
                $valor = Array();
            }
            $resp[$k]['idplanilla'] = $val['idtecnica'];
            $resp[$k]['planilla'] = $val['planilla'];
            $resp[$k]['idprocesotecnica'] = $val['idprocesotecnica'];
            $resp[$k]['modelomatematico'] = $val['modelomatematico'];
            $resp[$k]['idmodelo'] = $val['idmodelo'];
            $resp[$k]['validez'] = $val['validez'];
            $resp[$k]['unidad'] = $val['unidad'];
            $resp[$k]['idescala'] = $val['idescala'];
            $resp[$k]['idtecnica'] = $val['idtecnica'];
            $resp[$k]['fdesde'] = $val['fdesde'];
            $resp[$k]['fhasta'] = $val['fhasta'];
            $resp[$k]['orden'] = $val['orden'];
            $resp[$k]['hito'] = $val['hito'];
            $resp[$k]['valor'] = $val['valor'];
            $resp[$k]['condicion'] = $val['condicion'];
            $resp[$k]['cantd'] = $val['cantd'];
            $resp[$k]['planillasexp'] = DatProcesotecnica::tienePlanillaNoActiva($val['idprocesotecnica']);
            $resp[$k]['values'] = $valor;
        }
        $r->datos = $resp;
        echo(json_encode($r));
    }

    function getValoresbyIdEscalaAction()
    {
        $r->datos = ConfTecnicaModel::getValoresByIdEscala($this->_getParam('idescala'));
        echo(json_encode($r));
    }

    function getPersonasByProcesoAction()
    {
        $r->datos = DatProcesocomite::getComitesByIdProceso($this->_getParam('idproceso'));
        echo(json_encode($r));
    }

    function addModeloProcesoseleccionAction()
    {
        $r = DatProcesoModel::modExpresionMatematica(
            $this->_request->getPost('idproceso'),
            $this->_request->getPost('idexpresionmatematica')
        );
        echo(json_encode($r));
    }

    function actualizarOrdenAction()
    {
        try {
            $tecnicas = json_decode(stripslashes($this->_request->getPost('tecnicas')));
            $r = DatProcesotecnicaModel::actualizarOrden($tecnicas);
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function guardarComiteProcesoAction()
    {
        try {
            $arrcomite = json_decode(stripslashes($this->_request->getPost('arrcomite')));
            $r = DatProcesocomiteModel::addComiteProceso($this->_getParam('idproceso'), $arrcomite);
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function iniciarTecnicaAction()
    {
        $acceso = $this->chequearAcceso(
            $this->_request->getPost('idproceso'),
            $this->_request->getPost('idprocesotecnica')
        );
        if ($acceso == 1) {
            $arrcandidato = json_decode(stripslashes($this->_request->getPost('candidatos')));
            $r = DatResultadotecnicaModel::iniciarTecnica($this->_request->getPost('idprocesotecnica'), $arrcandidato);
        } else {
            $r = 2;
        }
        echo(json_encode($r));
    }

    function getCandidatosByProcesoAction()
    {
        $r = DatCandidatoModel::getCandidatosByProceso(
            $this->_request->getPost('idproceso'),
            $this->_request->getPost('start'),
            $this->_request->getPost('limit'),
            $this->_request->getPost('query')
        );
        echo(json_encode($r));
    }

    function getCandidatosTecnicaProcesoAction()
    {
        $r = DatResultadotecnicaModel::getCandidatos(
            $this->_request->getPost('idproceso'),
            $this->_request->getPost('idprocesotecnica'),
            $this->_request->getPost('start'),
            $this->_request->getPost('limit'),
            $this->_request->getPost('query')
        );
        echo(json_encode($r));
    }

    function addCandidatoAction()
    {
        $acceso = $this->chequearAcceso($this->_request->getPost('idproceso'), null);
        if ($acceso == 1) {
            $arrcandidato = json_decode(stripslashes($this->_request->getPost('candidatos')));
            $r = DatCandidatoModel::addCandidato(
                $this->_getParam('idproceso'),
                $this->_getParam('idviareclutamiento'),
                $arrcandidato
            );
        } else {
            $r = 0;
        }
        echo(json_encode($r));
    }

    function updateViaRecCandidatoAction()
    {
        $acceso = $this->chequearAcceso($this->_request->getPost('idproceso'), null);
        if ($acceso == 1) {
            $r = DatCandidatoModel::updateViaRecCandidato(
                $this->_getParam('idcandidato'),
                $this->_getParam('idviareclutamiento')
            );
        } else {
            $r = 0;
        }
        echo(json_encode($r));
    }

    function excluirCandidatoAction()
    {
        $acceso = $this->chequearAcceso($this->_request->getPost('idproceso'), null);
        if ($acceso == 1) {
            $arrcandidato = json_decode(stripslashes($this->_request->getPost('candidatos')));
            $idmotivoexclusion = $this->_request->getPost('idmotivo');
            $observexclusion = $this->_request->getPost('observacion');
            $r = DatCandidatoModel::excluirCandidato($arrcandidato, $idmotivoexclusion, $observexclusion);
        } else {
            $r = 0;
        }
        echo(json_encode($r));
    }

    function deleteCandidatosAction()
    {
        $acceso = $this->chequearAcceso($this->_request->getPost('idproceso'), null);
        if ($acceso == 1) {
            $arrcandidato = json_decode(stripslashes($this->_request->getPost('candidatos')));
            $r = DatCandidatoModel::deleteCandidatos($arrcandidato);
        } else {
            $r = 0;
        }
        echo(json_encode($r));
    }

    function deleteTecnicaProcesoAction()
    {
        try {
            $tecnicas = json_decode(stripslashes($this->_request->getPost('tecnicas')));
            $respuesta = true;
            foreach ($tecnicas as $p) {
                $r = DatProcesotecnicaModel::deleteTecnicaProceso($p);
                if ($r == false) {
                    $respuesta = false;
                }
            }
            echo json_encode($respuesta);
        } catch (Exception $e) {
            throw $e;
        }
    }

    function guardarTecnicaProcesoAction()
    {
        try {
            $idprocesotecnica = $this->_getParam('idprocesotecnica');
            $idproceso = $this->_getParam('idproceso');
            $idmodelo = $this->_getParam('idmodelo');
            $idtecnica = $this->_getParam('idtecnica');
            $tiempo = ($this->_getParam('tiempo'))?$this->_getParam('tiempo'):null;
            $unidad = ($this->_getParam('unidad'))?$this->_getParam('unidad'):null;
            $fdesde = $this->_getParam('fdesde');
            $fhasta = $this->_getParam('fhasta');
            $hito = $this->_getParam('hito');
            $condicion = $this->_getParam('condicion');
            $valor = $this->_getParam('valor');
            $accion = $this->_getParam('accion');
            $responsables = json_decode(stripslashes($this->_request->getPost('responsables')));
            if ($accion == 'mod') {
                $r = DatProcesotecnicaModel::modTecnicaProceso(
                    $idprocesotecnica,
                    $idproceso,
                    $idtecnica,
                    $idmodelo,
                    $tiempo,
                    $unidad,
                    $fdesde,
                    $fhasta,
                    $hito,
                    $condicion,
                    $valor,
                    $responsables
                );
            } else {
                $r = DatProcesotecnicaModel::addTecnicaProceso(
                    $idproceso,
                    $idtecnica,
                    $idmodelo,
                    $tiempo,
                    $unidad,
                    $fdesde,
                    $fhasta,
                    $hito,
                    $condicion,
                    $valor,
                    $responsables
                );
            }
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function getCargosByIdProcesoAction()
    {
        try {
            $r = DatProcesoModel::getCargosByIdProceso($this->_getParam('idproceso'));
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Función para obtener los procesos de selección.
    function getProcesosSeleccionAction()
    {
        $limite = $this->_getParam('limit');
        $inicio = $this->_getParam('start');
        $denom = $this->_getParam('denominacion');
        $cargartodo = $this->_getParam('cargartodo');
        $cargo = json_decode(stripslashes($this->_request->getPost('cargo')));
        try {
            $idestructuraglobal = $this->global->Estructura->idestructura;
            $r = DatProcesoModel::getProcesos($limite, $inicio, $denom, $cargo, $idestructuraglobal, $cargartodo);
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Función para obtener los comité.
    function getComiteAction()
    {
        try {
            $r = $this->pIntegrator->maestro->obtenerComisiones(5);
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    //Función para adicionar procesos de selección.
    function addProcesoSeleccionAction()
    {
        $denominacion = $this->_getParam('denominacion');
        $fdesde = $this->_getParam('fdesde');
        $fhasta = $this->_getParam('fhasta');
        $recurso = $this->_getParam('recurso');
        $contratar = $this->_getParam('contratar');
        $idestructura = $this->global->Estructura->idestructura;
        $cargos = json_decode(stripslashes($this->_request->getPost('cargos')));
        $r = DatProcesoModel::addProceso($denominacion, $fdesde, $fhasta, $recurso, $contratar, $idestructura, $cargos);
        echo json_encode($r);
    }

    //Función para modificar procesos de selección.
    function modProcesoSeleccionAction()
    {
        $idproceso = $this->_getParam('idproceso');
        $denominacion = $this->_getParam('denominacion');
        $fdesde = $this->_getParam('fdesde');
        $fhasta = ($this->_getParam('fhasta'))?$this->_getParam('fhasta'):null;
        $recurso = ($this->_getParam('recurso'))?$this->_getParam('recurso'):null;
        $contratar = ($this->_getParam('contratar'))?$this->_getParam('contratar'):2;
        $cargos = json_decode(stripslashes($this->_request->getPost('cargos')));
        $r = DatProcesoModel::modProceso($idproceso, $denominacion, $fdesde, $fhasta, $recurso, $contratar, $cargos);
        echo json_encode($r);
    }

    //Función para eliminar un proceso de selección.
    function delProcesoSeleccionAction()
    {
        $procesos = json_decode(stripslashes($this->_request->getPost('procesos')));
        $respuesta = true;
        foreach ($procesos as $p) {
            $r = DatProcesoModel::delProceso($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    public function loadPlanillaAction()
    {
        $idplanilla = $this->_request->getPost('idplanilla');
        $idresultadotecnica = $this->_request->getPost('idrecurso');
        //Obtengo planilla evaluativa
        $planilla = $this->pIntegrator->evaluaciones->ObtenerPlanillaPorId($idplanilla);
        //Obtengo evaluacion de la persona
        $objResulTecSelection = DatResultadotecnica::getResultadoById($idresultadotecnica);
        $resultado = Array();
        $resultado[0]['text'] = $planilla[0]->denom;
        $resultado[0]['denom'] = $planilla[0]->denom;
        $resultado[0]['id'] = -1;
        $resultado[0]['idpadre'] = -1;
        $resultado[0]['leaf'] = false;
        $resultado[0]['expanded'] = true;
        if ($objResulTecSelection) {
            $resultado[0]['text'] = $planilla[0]->denom.'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right><b>'.$objResulTecSelection->resultado.'</b></div>';
        }
        $indicadores = $this->obtenerIndicadores($idresultadotecnica, $idplanilla);
        $children =  $this->generarArbolIndicadores($indicadores);
        if (count($children) > 0) {
            $resultado[0]['children'] = $children;
            $resultado[0]['leaf'] = false;
        } else {
            $resultado[0]['leaf'] = true;
        }
        echo json_encode($resultado);
    }

    private function obtenerIndicadores($idresultadotecnica, $idplanilla)
    {
        $indicadores = $this->pIntegrator->evaluaciones->ObtenerIndicadoresPorPlanilla($idplanilla, '');
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
            $arrIndTexto = $this->pIntegrator->evaluaciones->ObtenerIndicadoresTextPorId($arrIndTexto);
        }
        if (count($arrIndImagen) > 0) {
            $arrIndImagen = $this->pIntegrator->evaluaciones->ObtenerIndicadoresImagenPorId($arrIndImagen);
        }
        $result = array();
        if (count($indicadores) > 0) {
            foreach ($indicadores as $indicador) {
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
            foreach ($result as $p => $v) {
                $idindicadorseleccion = '';
                $valorComplementotextual = '';
                $valor = '';
                $valorMostrar = '';
                $objDatIndSel = new DatIndicadortecnicaModel();
                $arrIndicadores = $objDatIndSel->getIndicadorSeleccion($idresultadotecnica, $v['idindicadorplanilla']);
                if (!$arrIndicadores) {
                    $idindicadorseleccion = DatIndicadortecnicaModel::addIndicadoTecnica(
                        $idresultadotecnica,
                        $v['idindicadorplanilla']
                    );
                } else {
                    $valorComplementotextual = $arrIndicadores['complemento'];
                    $valor = $arrIndicadores['resultado'];
                    $idindicadorseleccion = $arrIndicadores['idindicadortecnica'];
                    if (!empty($v['idescala'])) {
                        $valoresEscala = $this->pIntegrator->evaluaciones->getValuesByIdEscala($v['idescala']);
                        foreach ($valoresEscala as $valorEscala) {
                            if ($valorEscala['valor'] == $valor) {
                                $valorMostrar = $valorEscala['denom'];
                                break;
                            }
                        }
                    }
                }
                $nodos[] = array(
                    'id' => $v['idindicadorplanilla'],
                    'idindicador' => $v['idindicador'],
                    'ayuda' => $v['ayuda'],
                    'qtip' => ($v['descripcion'] != '' ? '<b>Denominaci&oacute;n:</b></br>' . $v['denom'].'</br><b>Descripci&oacute;n:</b></br>' . $v['descripcion'] : '<b>Denominaci&oacute;n:</b></br>' . $v['denom']),
                    'complementotextual' => $v['complementotextual'],
                    'denom' => $v['denom'],
                    'idpadre' => $v['idpadre'],
                    'idescala' => $v['idescala'],
                    'calculado' => $v['calculado'],
                    'tipo' => $v['tipo'],
                    'idescala' => $v['idescala'],
                    'leaf' => $v['eshoja'] == 0 ? false : true,
                    'checked' => $v['eshoja'] == 0 ? null : false,
                    'idindicadorevaluacion' => $idindicadorseleccion,
                    'valor' => $valor,
                    'valorMostrar' => $valorMostrar ? $valorMostrar : $valor,
                    'valorComplementotextual' => $valorComplementotextual
                );
                if ($v['eshoja'] == 0) {
                    $nodos[$p]['text'] = $v['denom'];
                } else {
                    $den = (strlen($v['denom'])>70)?substr($v['denom'], 0, 69).'...':$v['denom'];
                    if ($nodos[$p]['valorMostrar'] == '') {
                        $nodos[$p]['text'] = $den.'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right>-</div>';
                    } else {
                        $nodos[$p]['text'] = $den.'<div  style="height:0px; margin-right:20px; margin-top:-16px; important!" ALIGN=right>'.$nodos[$p]['valorMostrar'].'</div>';
                    }
                }
            }
        }
        return $nodos;
    }

    private function generarArbolIndicadores(array &$array, $idPadre = null, &$len = -1)
    {
        $treeFormat = array();
        $len = isset($len) && $len >= 0 ? $len : count($array);
        $cont = 0;
        while ($len > $cont) {
            $v = $array[$cont];
            $lenght = count($treeFormat);
            if (empty($idPadre)) {
                if ($v['id'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['id'] = $v['id'];
                    $treeFormat[$lenght]['idpadre'] = -1;
                    $treeFormat[$lenght]['expanded'] = true;
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generarArbolIndicadores($array, $v['id'], $len);
                    if (count($children) > 0) {
                        $treeFormat[$lenght]['children'] = $children;
                        $treeFormat[$lenght]['leaf'] = false;
                    } else {
                        $treeFormat[$lenght]['leaf'] = true;
                    }
                } else {
                    $cont++;
                }
            } else if ($v['idpadre'] == $idPadre && $v['id'] != $idPadre) {
                $treeFormat[$lenght] = $v;
                $treeFormat[$lenght]['id']= $v['id'];
                $treeFormat[$lenght]['expanded'] = false;
                array_splice($array, $cont, 1);
                $len--;
                $children = $this->generarArbolIndicadores($array, $v['id'], $len);
                if (count($children) > 0) {
                    $treeFormat[$lenght]['children'] = $children;
                    $treeFormat[$lenght]['leaf'] = false;
                    $treeFormat[$lenght]['expanded'] = true;
                } else {
                    $treeFormat[$lenght]['leaf'] = true;
                }
            } else {
                $cont++;
            }
        }
        return $treeFormat;
    }

    public function saveDataIndicadorAction()
    {
        $arrIndicadores = json_decode(stripslashes($this->_request->getPost('indicadores')));
        $arrvalores = json_decode(stripslashes($this->_request->getPost('valores')));
        $complemento = ($this->_request->getPost('complementotextual'))?$this->_request->getPost('complementotextual'):null;
        foreach ($arrIndicadores as $p => $val) {
            $idindicadortecnica = $val->idindicadorevaluacion;
            $resultado = (count($arrvalores) == 1)?$arrvalores[0]:$arrvalores[$p];
            if ($idindicadortecnica) {
                $r->success = DatIndicadortecnicaModel::updateIndicadoTecnica(
                    $idindicadortecnica,
                    $resultado,
                    $complemento
                );
                $r->resultadoEvaluacion = '';
            }
        }
        echo json_encode($r);
    }

    public function guardarResultadoTecnicaAction()
    {
        $idresultadotecnica = $this->_request->getPost('idresultadotecnica');
        $idplanilla = $this->_request->getPost('idplanilla');
        $idmodelo = $this->_request->getPost('idmodelo');
        $acceso = $this->chequearAcceso(
            $this->_request->getPost('idproceso'),
            $this->_request->getPost('idprocesotecnica')
        );
        if ($acceso == 1) {
            $objModel = new DatResultadotecnicaModel();
            $objModel->saveResult($idresultadotecnica, $idplanilla, $idmodelo);
            $r = true;
        } else {
            $r = false;
        }
        echo json_encode($r);
    }

    function aplicarModeloSeleccionAction()
    {
        try {
            $idproceso = $this->_request->getPost('idproceso');
            $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
            $acceso = $this->chequearAcceso($this->_request->getPost('idproceso'), null);
            if ($acceso == 1) {
                $result = DatResultadoseleccionModel::aplicarModeloSeleccion($idproceso, $idexpresionmatematica);
                $r->codigo = 1;
                $r->cantPers = $result->cantPers;
            } else {
                $r->codigo = 2;
                $r->cantPers = 0;
            }
        } catch (Exception $e) {
            $r->codigo = 0;
            $r->cantPers = 0;
        }
        echo json_encode($r);
    }

    function getCandidatosPreseleccionadosAction()
    {
        if ($this->_request->getPost('idproceso') != '') {
            $limit = $this->_request->getPost('limit');
            $start = $this->_request->getPost('start');
            $r = DatResultadoseleccionModel::getCandidatosPreseleccionados(
                $this->_request->getPost('idproceso'), $start, $limit,
                $this->_request->getPost('query')
            );
            echo json_encode($r);
        }
    }

    function getCandidatosSeleccionadosAction()
    {
        if ($this->_request->getPost('idproceso') != '') {
            $limit = $this->_request->getPost('limit');
            $start = $this->_request->getPost('start');
            $r = DatResultadoseleccionModel::getCandidatosSeleccionados(
                $this->_request->getPost('idproceso'), $start, $limit,
                $this->_request->getPost('query')
            );
            echo json_encode($r);
        }
    }

    function setSelecCandAction()
    {
        $arrCandResSelec = json_decode(stripslashes($this->_request->getPost('arrcand')));
        $acceso = $this->chequearAcceso($this->_request->getPost('idproceso'), null);
        if ($acceso == 1) {
            $r = DatResultadoseleccionModel::setCandidatosSelec(
                $arrCandResSelec,
                $this->_request->getPost('seleccion')
            );
        } else {
            $r = 0;
        }
        echo json_encode($r);
    }

    function getMotivosExclusionAction()
    {
        $r = NomMotivoexclusionModel::getMotivoExclusion();
        echo(json_encode($r->datos));
    }

    function getMotivosReincorporacionAction()
    {
        $r = NomMotreincorporacionModel::getMotReincorporacion();
        echo(json_encode($r->datos));
    }

    function getExcluidosAction()
    {
        $r = DatCandidatoModel::getExcluidosByProceso(
            $this->_request->getPost('idproceso'),
            $this->_request->getPost('start'),
            $this->_request->getPost('limit'),
            $this->_request->getPost('query')
        );
        echo(json_encode($r));
    }

    function reincorporarCandidatoAction()
    {
        $arr = json_decode(stripslashes($this->_request->getPost('arrIncorp')));
        $acceso = $this->chequearAcceso($this->_request->getPost('idproceso'), null);
        if ($acceso == 1) {
            $r = DatCandidatoModel::reincorporarCandidatoByProceso(
                $this->_request->getPost('idproceso'),
                $arr,
                $this->_request->getPost('idmotivo'),
                $this->_request->getPost('observacion')
            );
        } else {
            $r = 0;
        }
        echo(json_encode($r));
    }

    function getDatosGraficaAction()
    {
        try {
            $r['data'] = DatProceso::getDataGrafica($this->_request->getPost('idproceso'))[0];
            $r['success'] = true;
            echo(json_encode($r));
        } catch(Exception $e) {
            echo(json_encode($r['success'] = false));
        }
    }

    function getEstructuraAction()
    {
        try {
            if ($this->_getParam('node') == -1) {
                $id = $this->global->Estructura->idestructura;
                $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
                $p = 0;
                foreach ($r as $est) {
                    $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($est->id, false);
                    $datos = Array();
                    if (count($cargos) > 0) {
                        $idcargos = Array();
                        foreach ($cargos as $h=>$carg) {
                            $idcargos[$h] = $carg['idcargo'];
                        }
                        $datos = DatProcesocargo::procByArrayIdCargo($idcargos, $this->_request->getPost('idproceso'));
                    }
                    if (count($datos)>0) {
                        $result[$p] = $est;
                        $p++;
                    }
                }
            } else {
                $id = $this->_getParam('node');
                $result = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
            }
            $hijos = Array();
            foreach ($result as $h=>$v) {
                if ($v->idconcepto != 7) {
                    $hijos[$h] = $v;
                }
            }
            echo json_encode($hijos);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

    function guardarUbicacionAction()
    {
        try {
            $ubicacion = ($this->_request->getPost('ubicacion'))?$this->_request->getPost('ubicacion'):null;
            $idresultadoseleccion = $this->_request->getPost('idresultadoseleccion');
            $acceso = $this->chequearAcceso($this->_request->getPost('idproceso'), null);
            if ($acceso == 1) {
                if ($ubicacion == null) {
                    DatResultadoseleccionModel::guardarUbicacion($ubicacion, $idresultadoseleccion);
                    $r->codigo = 1;
                } else {
                    $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($ubicacion, false);
                    $datos = Array();
                    if (count($cargos) > 0) {
                        foreach ($cargos as $h=>$carg) {
                            $idcargos[$h] = $carg['idcargo'];
                        }
                        $datos = DatProcesocargo::procByArrayIdCargo($idcargos, $this->_request->getPost('idproceso'));
                    }
                    if (count($datos)>0) {
                        DatResultadoseleccionModel::guardarUbicacion($ubicacion, $idresultadoseleccion);
                        $r->codigo = 1;
                    } else {
                        $r->codigo = 3;
                    }
                }
            } else {
                $r->codigo = 2;
            }
        } catch (Exception $e) {
            $r->codigo = 0;
        }
        echo json_encode($r);
    }

    function getViasReclutamientoAction()
    {
        try {
            $r = NomViareclutamientoModel::getViasReclutamientoActivas();
            echo(json_encode($r));
        } catch (Exception $e) {
            echo(json_encode(Array()));
        }
    }

    function desasociarComiteProcesoAction()
    {
        try {
            $arrcomite = json_decode(stripslashes($this->_request->getPost('comites')));
            $r = DatProcesocomiteModel::desasociarComiteProceso($this->_getParam('idproceso'), $arrcomite);
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function addObservacionAction()
    {
        $ipt = ($this->_request->getPost('idprocesotecnica')!='')?$this->_request->getPost('idprocesotecnica'):null;
        $acceso = $this->chequearAcceso($this->_request->getPost('idproceso'), $ipt);
        if ($acceso == 1) {
            $r = DatCandidatoModel::updateCandidato($this->_getParam('idcandidato'), $this->_getParam('observacion'));
        } else {
            $r = 2;
        }
        echo(json_encode($r));
    }

    function comprobarValidezResultadoTecnicaAction()
    {
        $r = DatResultadotecnicaModel::comprobarValidezResultadoTecnica();
        echo(json_encode($r));
    }

    function getMotivosSeguimientoAction()
    {
        $r = NomMotivoseguimientoModel::getMotivosSeguimientoActivos();
        echo(json_encode($r));
    }

    function getCandidatosSeguimientoAction()
    {
        $idproceso = $this->_request->getPost('idproceso');
        $filtro = $this->_request->getPost('query');
        $limite = $this->_request->getPost('limit');
        $inicio = $this->_request->getPost('start');
        $r = DatSeguimientoModel::getCandidatosSeguimiento($idproceso, $limite, $inicio, $filtro);
        echo(json_encode($r));
    }

    function addCandidatosSeguimientoAction()
    {
        $acceso = $this->chequearAcceso($this->_request->getPost('idproceso'), null);
        if ($acceso == 1) {
            $candidatos = json_decode(stripslashes($this->_request->getPost('candidatos')));
            $idmotivoseguimiento = $this->_request->getPost('motivoseguimiento');
            $fdesde = $this->_request->getPost('fdesde');
            $fhasta = $this->_request->getPost('fhasta');
            $respuesta = true;
            foreach ($candidatos as $p) {
                $r = DatSeguimientoModel::addSeguimiento($p, $idmotivoseguimiento, $fdesde, $fhasta);
                if ($r == false) {
                    $respuesta = false;
                }
            }
        } else {
            $respuesta = 0;
        }
        echo(json_encode($respuesta));
    }

    function updateCandidatosSeguimientoAction()
    {
        $acceso = $this->chequearAcceso($this->_request->getPost('idproceso'), null);
        if ($acceso == 1) {
            $idseguimiento = $this->_request->getPost('idseguimiento');
            $idmotivoseguimiento = $this->_request->getPost('motivoseguimiento');
            $fdesde = $this->_request->getPost('fdesde');
            $fhasta = $this->_request->getPost('fhasta');
            $concluir = $this->_request->getPost('concluir');
            $candidatos = json_decode(stripslashes($this->_request->getPost('candidatos')));
            $respuesta = true;
            $hoy = date('d/m/Y');
            if ($concluir == 1) {
                foreach ($candidatos as $p) {
                    $r = DatSeguimientoModel::modSeguimiento($p, null, null, null, $hoy, $concluir);
                    if ($r == false) {
                        $respuesta = false;
                    }
                }
            } else {
                $respuesta = DatSeguimientoModel::modSeguimiento(
                    $idseguimiento,
                    $candidatos[0],
                    $idmotivoseguimiento,
                    $fdesde,
                    $fhasta,
                    $concluir
                );
            }
        } else {
            $respuesta = 0;
        }
        echo(json_encode($respuesta));
    }

    function deleteCandidatosSeguimientoAction()
    {
        $candidatos = json_decode(stripslashes($this->_request->getPost('candidatos')));
        $respuesta = true;
        foreach ($candidatos as $p) {
            $r = DatSeguimientoModel::delSeguimiento($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo(json_encode($respuesta));
    }

    function getEntidadesAction()
    {
        try {
            $idestructuraglobal = $this->global->Estructura->idestructura;
            $entidadesdom = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($idestructuraglobal);
            $entidades = Array();
            $pos = 0;
            foreach ($entidadesdom as $v) {
                if ($v->id != $idestructuraglobal) {
                    $entidades[$pos]['identidad'] = $v->id;
                    $entidades[$pos]['denominacion'] = $v->text;
                    $pos++;
                }
            }
            echo(json_encode($entidades));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function getEntidadesByIdProcesoAction()
    {
        try {
            $comp = ConfCompprocesoModel::getEntidadesByIdProceso($this->_getParam('idproceso'));
            echo(json_encode($comp));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function compartirProcesoAction()
    {
        $idproceso = $this->_request->getPost('idproceso');
        $entidades = json_decode(stripslashes($this->_request->getPost('entidades')));
        $r = ConfCompprocesoModel::saveConfig($idproceso, $entidades);
        echo(json_encode($r));
    }

    function getPersonasAllAction()
    {
        $personas = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
            null,
            $this->_getParam('query'),
            $this->_getParam('limit'),
            $this->_getParam('start')
        );
        echo(json_encode($personas));
    }

    function getProcesosCompAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $idprocesoactual =$this->_getParam('idproceso');
        $proc = ConfCompprocesoModel::getProcesosByIdEstructura($idestructura, $idprocesoactual);
        echo(json_encode($proc));
    }

    function getCompetenciasByProcesoAction()
    {
        $idprocesoactual =$this->_getParam('idproceso');
        $proc = DatProcesoModel::getCompetenciasByProceso($idprocesoactual);
        echo(json_encode($proc));
    }

    public function importarDatosExcelAction()
    {
        $idresultadotecnica = $this->_request->getPost('idrecurso');
        $idplanilla = $this->_getParam('idplanilla');
        $identidad = $this->global->Estructura->idestructura;
        $respuesta = new stdClass();
        $respuesta->codMsg = 1;
        $nameFile = explode('.', $_FILES['fileUpload']['name']);
        if ($nameFile[count($nameFile)-1] == 'xls') {
            $dirfile = $_FILES['fileUpload']['tmp_name'];
            //Si la direccion del archivo existe
            if (file_exists($dirfile)) {
                $configImportar = ZendExt_IoC_Inter::getInstance()->maestro->obtenerConfImportarExcel(
                    1,
                    $identidad,
                    array($idplanilla)
                );
                $inputFileType = ($configImportar[0]['extension'] == 'xls')?'Excel5':'Excel2007';
                //Creando un Reader de PhpExcel para 2005
                $objReader = PHPExcel_IOFactory::createReader($inputFileType);
                $objReader->setReadDataOnly(true);
                $objPHPExcel = $objReader->load($dirfile);
                $worksheettoarray = $objPHPExcel->getActiveSheet()->toArray(null, true, true, true);
                $valorindicadores = DatIndicadortecnica::getIndicadorSeleccionByIdresultadotecnica($idresultadotecnica);
                foreach ($configImportar[0]['ConfImportarcamposexcel'] as $conf) {
                    $encontrado = false;
                    foreach ($valorindicadores as $ind) {
                        if ($conf['idcampo'] == $ind['idindicadorplanilla']) {
                            $encontrado = true;
                        }
                    }
                    if ($encontrado == true) {
                        $columnafila = explode(':', $conf['columnafila']);
                        $eval = (empty($worksheettoarray[$columnafila[1]][$columnafila[0]]))?0:$worksheettoarray[$columnafila[1]][$columnafila[0]];
                        if (is_numeric($eval)) {
                            DatIndicadortecnica::updateValorIndicador($conf['idcampo'], $eval, $idresultadotecnica);
                        } else {
                            $respuesta->codMsg = 3;
                            $respuesta->failure = 'true';
                            echo json_encode($respuesta);
                            return;
                        }
                    }
                }
                $respuesta->success = 'true';
                echo json_encode($respuesta);
                return;
            } else {
                $respuesta->codMsg = 5;
                $respuesta->failure = 'true';
                echo json_encode($respuesta);
            }
        } else {
            $respuesta->codMsg = 6;
            $respuesta->failure = 'true';
            echo json_encode($respuesta);
        }
    }

    function chequearAcceso($idproceso, $idprocesotecnica)
    {
        $idusuario = $this->global->Perfil->idusuario;
        $personaLogueada = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
        $idpersona = $personaLogueada[0]['idpersona'];
        $personaEsta = DatProceso::getPersonaMiembroComiteProceso($idproceso, $idpersona);
        if (count($personaEsta)>0) {
            if ($idprocesotecnica != null) {
                $personaResponsable = DatResponsable::getPersonaMiembroComiteProcesotecnica(
                    $idprocesotecnica,
                    $idpersona
                );
                if (count($personaResponsable->tieneresp) > 0) {
                    if (count($personaResponsable->estaid) > 0) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    }
}