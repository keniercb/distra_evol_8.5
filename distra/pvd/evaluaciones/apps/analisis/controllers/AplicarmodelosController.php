<?php

class AplicarmodelosController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
        //$this->direccionModulo = Zend_  Registry::getInstance()->config->modulo_path; TEXTRRRRRRRRR
        //die($this->direccionModulo);
        //include_once('D:/wamp/www/pvdNuevo/apps/pvd/comun/recursos/rtf/Rtf.php');
        //require_once('D:/wamp/www/pvdNuevo/apps/pvd/comun/recursos/rtf/Rtf.php');
    }

    function aplicarmodelosAction() {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();       
        $this->view->scriptFichaProcesoEval = $this->pIntegrator->procesoevaluativo->getScriptFichaProcesoEval();
        $this->render();
    }

    function getEvaluadosPEAction() {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        
        $arrEvaldos = $this->pIntegrator->evaluar->getEvaluadosByProceso($idpreprocesoevaluativo, $limit, $start);
        print_r($arrEvaldos);die;
        if ($arrEvaldos) {
            $arrIdPersonas = array();
            foreach ($arrEvaldos as $evaluado) {
                $arrIdPersonas[] = $evaluado['idrecurso'];
            }
            $personas = $this->integrator->pvd->getPrincipalesDatosPersona($arrIdPersonas);
           
            foreach ($arrEvaldos as &$evaluado) {
                foreach ($personas as $personaAux) {
                    if ($evaluado['idrecurso'] == $personaAux->idpersona) {
                        $evaluado['idpersona'] = $personaAux->idpersona;
                        $evaluado['numid'] = $personaAux->numid;
                        $evaluado['nombre'] = $personaAux->nombre;
                        $evaluado['snombre'] = $personaAux->snombre;
                        $evaluado['papel'] = $personaAux->papel;
                        $evaluado['sapel'] = $personaAux->sapel;
                        $evaluado['sexo'] = $personaAux->sexo;
                        $evaluado['idfoto'] = $personaAux->idfoto;
                        $evaluado['extension'] = $personaAux->extension;
                        $evaluado['categoria'] = $personaAux->categoria;
                        $varAux = split("-", $personaAux->fechanacimiento);
                        $evaluado['edad'] = date('Y') - $varAux[0];
                        $evaluado['fechanacimiento'] = $personaAux->fechanacimiento;
                        $evaluado['entidad'] = $this->global->Estructura->denominacion; //Modificar mas adelante para cojer la entidad segun el evaluado
                        $objAux = $this->pIntegrator->persona->obtenerCargoPersona($evaluado['idrecurso']);
                        $evaluado['cargo'] = $objAux[0]->cargo;
                        if ($personaAux->idfoto && $personaAux->foto && $personaAux->extension) {
                            $this->SincronizarImgBDconFicheroServer($personaAux->idfoto, $personaAux->foto, $personaAux->extension);
                        }
                    }
                }
            }
            $r['datos'] = $arrEvaldos;
            $cantidad = $this->pIntegrator->evaluar->getCantEvaluadosByProceso($idpreprocesoevaluativo);
            $r['cantidad'] = $cantidad[0]['cantidad'];
            echo json_encode($r);
        } else {
            $r['datos'] = array();
            $r['cantidad'] = 0;
            echo json_encode($r);
        }
    }

    private function SincronizarImgBDconFicheroServer($idfoto, $foto, $extension) {
        $ffp = fopen("views/images/personas/" . "{$idfoto}" . "{$extension}", "wb");
        fclose($ffp);
        file_put_contents("views/images/personas/" . "{$idfoto}" . "{$extension}", $foto);
    }

    function getserieAction() {
        $arrIdpersonaevaluacion = json_decode(stripslashes($this->_request->getPost('arrIdpersonaevaluacion')));
        $arrIndicadores = json_decode(stripslashes($this->_request->getPost('arrInd')));

        foreach ($arrIndicadores as $indicador) {
            $arrIdInd.=$indicador.',';
        }
        $arrIdInd = substr($arrIdInd, 0, -1);

        // $arrInds = $this->pIntegrator->evaluar->getIndicadoresEvalByPersona($idpersonaevaluacion);
        //print_r($arrInds);die;
        //$arrInd
        $objAplicarmodelos = new AplicarmodelosModel();
        $r = array();
        foreach ($arrIdpersonaevaluacion as $idpersonaevaluacion) {
            $serie = null;
            $arrAux = array();
            $result = $objAplicarmodelos->getIndicadoresEvalTextByPersona($idpersonaevaluacion, $arrIdInd);
            foreach ($result as $key => $value) {
                $arrAux[] = array(
                    $value['valor'],
                    $key + 1,
                    $value['denom'],
                    $value['descripcion']
                );
            }
            $serie->idpersonaevaluacion = $idpersonaevaluacion;
            $serie->data= $arrAux;
            $r[] = $serie;
        }
        echo json_encode($r);
    }

    function getModelosPorPlanillaAction() {
        $idplanilla = $this->_request->getPost('idplanilla');
        $arrModelos['datos'] = $this->pIntegrator->evaluaciones->getModelosActivosPorPlanilla($idplanilla);
        echo json_encode($arrModelos);
    }

    function cargarPlanillaAction() {
        $idplanilla = $this->_request->getPost('idplanilla');
        $idnodo = $this->_request->getPost('idnodo');

        //$idpersonaevalfueraproceso = $this->_request->getPost('idpersonaevalfueraproceso');
        if ($idnodo == 'raizPlanilla') { //Pregunto para mandar a cargar la raiz (El nombre de la planilla evaluativa) de acuerdo al proceso evaluativo seleccionado
            //Cargo la planilla a partir del proceso evaluativo
            $planilla = $this->pIntegrator->evaluaciones->ObtenerPlanillaPorId($idplanilla);
            $planilla[0]->text = $planilla[0]->denom;
            $planilla[0]->id = -1;
            echo json_encode($planilla);
        } else {
            $indicadores = $this->pIntegrator->evaluaciones->ObtenerIndicadoresPorPlanilla($idplanilla, $idnodo);
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
                foreach ($indicadores as $key => $indicador) {
                    foreach ($arrIndTexto as $indTexto) {
                        if ($indicador['idindicador'] == $indTexto['idindicadortexto']) {//revisar esta mierda..
                            $result[] = array_merge($indicador, $indTexto);
                        }
                    }
                    foreach ($arrIndImagen as $indImg) {
                        if ($indicador['idindicador'] == $indImg['idindicadorimagen']) {//revisar esta mierda..
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
                    } else if ($v['tipo'] == true && $v['calculado'] == true) {
                        $icono = "indicadorTexto";
                        $a = true;
                    } else if ($v['tipo'] == false && $v['calculado'] == true) {
                        $icono = "indicadorImagen";
                    }
                    $valorComplementotextual = "";
                    $idindicadorevaluacion = null;
                    $idindicadorevalfueraproceso = null;
                    $idvalor = null;
                    $valor = '';
                    $nodos[] = array(
                        'id' => $v['idindicadorplanilla'],
                        'idindicador' => $v['idindicador'],
                        'ayuda' => $v['ayuda'],
                        'qtip' => ($v['descripcion'] != '' ? '<b>Descripci&oacute;n</b></br>' . $v['descripcion'] : ''),
                        'complementotextual' => $v['complementotextual'],
                        'text' => $v['denom'],
                        'idpadre' => $v['idpadre'],
                        'calculado' => $v['calculado'],
                        'tipo' => $v['tipo'],
                        'idescala' => $v['idescala'],
                        'iconCls' => $icono,
                        'leaf' => $v['eshoja'] == 0 ? false : true,
                        'checked' =>  $v['eshoja'] == 0 ? null : false,
                        'idindicadorevaluacion' => $idindicadorevaluacion,
                        'idindicadorevalfueraproceso' => $idindicadorevalfueraproceso,
                        'idvalor' => $idvalor,
                        'valor' => $valor,
                        'valorComplementotextual' => $valorComplementotextual);
                }
            }
            echo json_encode($nodos);
        }
    }

    function aplicarmodelosmatematicosAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');

        $objAplicarmodelosModel = new AplicarmodelosModel();
        $r['datos'] = $objAplicarmodelosModel->aplicarModelosMatematicosByProceso($idpreprocesoevaluativo, $idmodelo);
        echo json_encode($r);
    }

    function guardarResultadoEvalModeloAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $arrPersonaEvalResult = json_decode(stripslashes($this->_request->getPost('arrPersonaEvalResult')));


        $objPersonaEvalFinalModel = new DatEvalpersonaevaluacionfinalModel();
        $objPersonaEvalFinalModel->Eliminar($idpreprocesoevaluativo, $idmodelo);

        //ARREGLAR ESTO Y TRABAJAR CON DOCTRINE_COLLECTION (es mas eficiente)
        foreach ($arrPersonaEvalResult as $personaEvalResult) {
            $DatEvalpersonaevaluacionfinal = new DatEvalpersonaevaluacionfinal();
            $DatEvalpersonaevaluacionfinal->idmodelo = $idmodelo;
            $DatEvalpersonaevaluacionfinal->idpreprocesoevaluativo = $idpreprocesoevaluativo;
            $DatEvalpersonaevaluacionfinal->idpersonaevaluacion = $personaEvalResult->idpersonaevaluacion;
            $DatEvalpersonaevaluacionfinal->resultado = $personaEvalResult->resultado;
            $objPersonaEvalFinalModel->Insertar($DatEvalpersonaevaluacionfinal);
        }

        echo json_encode($r->success = true);
    }

    function cargarmodelosmatematicosAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $estado = $this->_request->getPost('estado');
        $objAplicarmodelosModel = new AplicarmodelosModel();
        $r['datos'] = $objAplicarmodelosModel->cargarModelosMatematicos($idpreprocesoevaluativo, $idmodelo);
        echo json_encode($r);
    }

    function exportarResultadoEvalModeloAction() {

        $idmodelo = $this->_request->getPost('idmodelo');
        $id = $this->_request->getPost('numid');
        $nombre = $this->_request->getPost('nombre');
        $resultado = $this->_request->getPost('resultado');
        $idpreprocesoevaluativo = $this->_request->getPost('idpreprocesoevaluativo');
        $titulo = $this->_request->getPost('titulo');
        $formato = $this->_request->getPost('formato');
        $estado = $this->_request->getPost('estado');
        $denominacionproceso = $this->_request->getPost('denominacionproceso');


        $AplicarmodelosModel = new AplicarmodelosModel();
        $arrpersonas = $AplicarmodelosModel->cargarModelosMatematicos($idpreprocesoevaluativo, $idmodelo);

        //print_r($arrpersonas);die;
        if ($arrpersonas[0]) {
            $url = "";
            echo json_encode($url);
            return;
        }

        /* $array = array();
          $array[]['idpersonaevaluacion'] = $arrpersonas[0]['idpersonaevaluacion']; */
        //print_r($array);die;
        ///////////////Funciones en rtf///////////
        if ($formato == 'rtf') {
            $dir = $_SERVER ['DOCUMENT_ROOT'];
            $apps = str_replace('/web', '/', $dir);
            require_once($apps . 'apps/pvd/comun/recursos/rtf/Rtf.php');
            $rtf = new Rtf();

            $sect = &$rtf->addSection();
            $pTitulo = new Font(16, 'Time New Roman', '0000000');
            //$pTitulo->setBold();
            $sect->writeText($titulo, $pTitulo, new ParFormat('center'));
            $sect->writeText('', new Font(), new ParFormat());
            $sect->writeText($denominacionproceso, new Font(12, Arial), new ParFormat('left'));

            $sect->writeText('', new Font(), new ParFormat());
            //////////Formato de la tabla////////
            $filas = '1'; //para controlar la cant. de filas de la tablas
            $celda = '1';
            if (!empty($arrpersonas)) {
                $filas += count($arrpersonas);
            }

            $sect->writeText('', new Font(), new ParFormat()); // para dar un espacio entre elementos
            $table = &$sect->addTable('left');
            $table->addRows($filas, 0.5);
            $table->addColumnsList(array(2.8, 2.8, 2.8, 2.8, 2.8, 2.8));
            $table->writeToCell(1, 1, utf8_encode('No. identidad'), new Font(10, Arial), new ParFormat('center'));
            $table->writeToCell(1, 2, 'Nombre', new Font(10, Arial), new ParFormat('center'));
            $table->writeToCell(1, 3, 'Primer Apellido', new Font(10, Arial), new ParFormat('center'));
            $table->writeToCell(1, 4, 'Segundo Apellido', new Font(10, Arial), new ParFormat('center'));
            $table->writeToCell(1, 5, 'Estado', new Font(10, Arial), new ParFormat('center'));
            $table->writeToCell(1, 6, 'Resultado', new Font(10, Arial), new ParFormat('center'));
            $table->setBackgroundOfCells('#cccccc', 1, 1, 1, 6);
            for ($i = 0; $i < 6; $i++) {
                $table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 2, $filas, $celda++);
                //$table->addColumn($celda++);
                $id = $arrpersonas[$i]['numid'];
                $table->writeToCell($celda, 1, $id, new Font(8, Arial), new ParFormat('center'));
                $nombre = $arrpersonas[$i]['nombre'];
                $table->writeToCell($celda, 2, $nombre, new Font(8, Arial), new ParFormat('center'));
                $pApellido = $arrpersonas[$i]['papel'];
                $table->writeToCell($celda, 3, $pApellido, new Font(8, Arial), new ParFormat('center'));
                $sApellido = $arrpersonas[$i]['sapel'];
                $table->writeToCell($celda, 4, $sApellido, new Font(8, Arial), new ParFormat('center'));
                $estado = $arrpersonas[$i]['estado'];
                $table->writeToCell($celda, 5, $this->formatoEstado($estado), new Font(8, Arial), new ParFormat('center'));
                $resultado = $arrpersonas[$i]['resultado'];
                $table->writeToCell($celda, 6, $resultado, new Font(8, Arial), new ParFormat('center'));
            }

            $rtf->save('reporte.rtf');
            $r->url = '/pvd/evaluaciones/analisis/reporte.rtf';
        } else {
            $objpdf = new ReportePdf();
            $objpdf->CrearPlanilla();
            $objpdf->CrearPagina($arrpersonas, $titulo, $idpreprocesoevaluativo, $estado, $denominacionproceso);
            $objpdf->Guardar();
            $r->url = '/pvd/evaluaciones/analisis/ReportePdf.pdf';
        }
        echo json_encode($r);
    }

    function formatoEstado($estado) {
        if ($estado == 1) {
            return 'Evaluado';
        } else if ($estado == 2) {
            return 'No evaluado';
        }else
            return utf8_encode('En reclamacion');
    }

}
