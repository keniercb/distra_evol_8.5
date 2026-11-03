<?php

/**
 * (c) Roberto Yasel Garcia Quintana.
 *
 * Clase controladora para gestion de incidencias
 * @copyright UCID Cuba
 * @package pye
 * @subpackage matrizrelaciones
 * @author Roberto Yasel Garcia Quintana.
 * @version
 */
class MatrizdofaController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    public function cargarAyudaAction()
    {
        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
    }

    public function matrizdofaAction()
    {
        try {
            $this->view->extensionesPLAN = $this->pIntegrator->integracion->extensionesPLAN();
            $this->view->pyeComun = $this->pIntegrator->integracion->pyeComun();
            $this->view->matrizdofaComponent = $this->pIntegrator->integracion->matrizdofaComponent();
            $this->view->jsreportesge = $this->pIntegrator->reportes->devolverJS();
            $this->render();
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function criteriosAction()
    {
        try {
            $this->view->extensionesPLAN = $this->pIntegrator->integracion->extensionesPLAN();
            $this->view->pyeComun = $this->pIntegrator->integracion->pyeComun();
            $this->view->matrizdofaComponent = $this->pIntegrator->integracion->matrizdofaComponent();
//            $this->view->jsayuda = $this->pIntegrator->ayuda->devolverJS();
            $this->render();
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getMessage()));
        }
    }

    public function gettreeambitoAction()
    {
        $ambitos = new DatEstudiomatrizdofaModel();
        $root = $ambitos->getTreeAmbitos();
        $count = count($root);
        for ($i = 0; $i < $count; $i++) {
            $root[$i]['text'] = $root[$i]['denominacion'];
            $root[$i]['leaf'] = true;
        }
        echo Zend_Json_Encoder::encode($root);
    }

    public function getfactoresclavesAction()
    {
        $factores = new DatEstudiomatrizdofaModel();
        $result = $factores->getFactoresClaves();
        echo json_encode(array('cantidad_filas' => count($result), 'root' => $result));
    }

    public function getproyectodofaAction()
    {
        $model = new DatEstudiomatrizdofaModel();
        $objeto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('objeto')));
        $data = $model->getMatrizDofa($objeto['idproyecto']);
        echo json_encode($data);
        //return;
    }

    public function getlistadosbyambitoAction()
    {


        $arreglo['start'] = $this->_request->getPost('start');
        $arreglo['limit'] = $this->_request->getPost('limit');
        $arreglo['analista'] = $this->_request->getPost('analista');
        $arreglo['idambitodofa'] = $this->_request->getPost('idambitodofa');


        $arreglo['idestudiomatriz'] = $this->_request->getPost('idestudiomatriz');


        //buscar////////
        $arreglo['denominacion'] = $this->_request->getPost('denominacion');
        $arreglo['factorclave'] = $this->_request->getPost('factor');

        $a = new DatMatrizdofaModel();
        $result = $a->getListadosByAmbito($arreglo);
        echo json_encode($result);
    }

    public function adicionarmodificarfactorAction()
    {

        $factor = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('objeto')));
        $idmatrizdofa = $factor->idmatrizdofa;
        $perfil = $this->getPerfil();
        $factor['idpersona'] = $perfil->idpersona;
        $insFactor = new DatMatrizdofaModel();
        $result = $insFactor->insertarModificarFactor($factor);
        if ($result) {
            echo("{'codMsg':100,'mensaje':'','idmatrizdofa':$result}");
            return;
        } else {
            if ($idmatrizdofa > 0) {
                echo("{'codMsg':3,'mensaje':'El elemento que desea modificar ya fue eliminado.Recargue el listado para actualizar los cambios realizados por otros usuarios.'}");
                return;
            }
            echo("{'codMsg':3,'mensaje':'Ha ocurrido un error','idmatrizdofa':$result}");
            return;
        }
    }

    public function eliminarfactorAction()
    {
        $factor = $this->_request->getPost('objeto');
        $objEliminar = json_decode(stripcslashes($factor));
        $a = new DatMatrizdofaModel();
        $result = $a->eliminarFactor($objEliminar);
        if ($result) {
            echo("{'codMsg':100,'mensaje':'mensaje','idfactor':$objEliminar->idfactor}");
            return;
        } else {
            if ($objEliminar->idfactor > 0) {
                echo("{'codMsg':3,'mensaje':'El elemento que desea modificar ya fue eliminado.Recargue el listado para actualizar los cambios realizados por otros usuarios.'}");
                return;
            }
            echo("{'codMsg':3,'mensaje':'Ha ocurrido un error.','idfactor':$objEliminar->idfactor}");
            return;
        }
    }

    public function getfortalezasdebilidadesAction()
    {


        //print_r($this->_request->getPost());die;

        $arreglo['analista'] = $this->_request->getPost('analista');
        $arreglo['idambitodofa'] = $this->_request->getPost('idambitodofa');
        $arreglo['idestudiomatriz'] = $this->_request->getPost('idestudiomatriz');
        $arreglo['parametro1'] = $this->_request->getPost('parametro1');
        $arreglo['parametro2'] = $this->_request->getPost('parametro2');

        $a = new DatMatrizdofaModel();
        $result = $a->getFortalezasDebilidades($arreglo);

        //va con parametro1
        $arreglo1 = array();

        //va con parametro2
        $arreglo2 = array();

        for ($i = 0; $i < $result['cantidad_filas']; $i++) {
            if ($result['root'][$i]['descripcion'] == $arreglo['parametro1']) {
                array_push($arreglo1, $result['root'][$i]);
            } else {
                array_push($arreglo2, $result['root'][$i]);
            }
        }

        $cont1 = count($arreglo1);
        $cont2 = count($arreglo2);

        $arregloTemp = array();
        $arregloFinal = array();

        if ($cont1 >= $cont2) {
            for ($i = 0; $i < $cont1; $i++) {
                $arregloTemp[$arreglo['parametro1']] = $arreglo1[$i]['denominacion'];
                $arregloTemp[$arreglo['parametro2']] = array_key_exists($i, $arreglo2) ? $arreglo2[$i]['denominacion'] : '';
                array_push($arregloFinal, $arregloTemp);
            }
        } else {
            for ($i = 0; $i < $cont2; $i++) {
                $arregloTemp[$arreglo['parametro1']] = array_key_exists($i, $arreglo1) ? $arreglo1[$i]['denominacion'] : '';
                $arregloTemp[$arreglo['parametro2']] = $arreglo2[$i]['denominacion'];
                array_push($arregloFinal, $arregloTemp);
            }
        }

        $result['cantidad_filas'] = count($arregloFinal);
        $result['root'] = $arregloFinal;
        echo json_encode($result);
    }

    public function getlistadosbynomfactorxparesAction()
    {
        $arreglo = $this->_request->getPost();
        $a = new DatMatrizdofaModel();
        $result = $a->getListadosByNomFactorXPares($arreglo);
        echo json_encode($result);
    }

    public function adicionarmodificarestrategiaAction()
    {
        $estrategia = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('objeto')));
        $orden = json_decode($this->_request->getPost('orden'));
        $idestrategia = $estrategia->idestrategia;
        $insEstrategia = new DatMatrizdofaModel();
        if (!empty($orden)) {
            $eliminadas = json_decode($this->_request->getPost('eliminadas'));
            foreach ($eliminadas as $value) {
                $estrategia = DatEstrategia::getByid($value->idestrategia);
                if ($estrategia->idestrategia) {
                    $estrategia->orden = null;
                    $estrategia->save();
                    $result = $estrategia->idestrategia;
                }
            }

            $datos = json_decode($this->_request->getPost('datos'));
            foreach ($datos as $C => $value1) {
                $estrategia = DatEstrategia::getByid($value1->idestrategia);
                if ($estrategia->idestrategia) {
                    $estrategia->orden = $C;
                    $estrategia->save();
                    $result = $estrategia->idestrategia;
                }
            }

        } else {
            $result = $insEstrategia->insertarModificarEstrategia($estrategia);
        }
        if ($result) {
            echo("{'codMsg':100,'mensaje':'','idestrategia':$result}");
            return;
        } else {
            if ($idestrategia > 0) {
                echo("{'codMsg':3,'mensaje':'El elemento que desea modificar ya fue eliminado.Recargue el listado para actualizar los cambios realizados por otros usuarios.'}");
                return;
            }
            echo("{'codMsg':3,'mensaje':'Ha ocurrido un error','idestrategia':$result}");
            return;
        }
    }

    public function eliminarestrategiaAction()
    {
        $estrategia = $this->_request->getPost('objeto');
        $objEliminar = json_decode(stripcslashes($estrategia));
        $a = new DatMatrizdofaModel();
        $result = $a->eliminarEstrategia($objEliminar);
        if ($result['success']) {
            echo("{'codMsg':100,'success':true ,'mensaje':'La estrategia has sido eliminada satisfactoriamente.','idestrategia':$objEliminar->idestrategia}");
            return 1;
        } else {
            if ($objEliminar->idestrategia > 0) {
                echo("{'codMsg':3,'success':true, 'mensaje':'La estrategia que desea eliminar actualmente esta en uso.'}");
                return;
            }
            echo("{'codMsg':3,'success':true,'mensaje':'Ha ocurrido un error.','idestrategia':$objEliminar->idestrategia}");
            return;
        }
    }

    public function getestrategiasAction()
    {
        $arreglo['idmatrizdofa'] = $this->_request->getPost('idmatrizdofa');
        $arreglo['orden'] = $this->_request->getPost('orden');
        $arreglo['start'] = $this->_request->getPost('start');
        $arreglo['limit'] = $this->_request->getPost('limit');
        $estrategias = new DatMatrizdofaModel();
        $root = $estrategias->getEstrategias($arreglo);
        echo json_encode($root);
    }

    /**
     * Obtener configuracion matriz
     *
     * @author    Ing. 1Tte Rubier Sorio Pazos
     * @copyright XETID Cuba
     * @throws Zend_Json_Exception
     */
    public function obtenerconfiguracionmatrizdofaAction()
    {
        $arreglo['idmatrizdofa'] = $this->_request->getPost('idmatrizdofa');
        $arreglo['arreglo'] = Zend_Json_Decoder::decode(stripcslashes(($this->_request->getPost('arreglo'))));
        $model = new DatMatrizdofaModel();
        $res = $model->obtenerConfiguracionMatrizDofa($arreglo);
        echo json_encode($res);
    }

    /**
     * Obtener criterios
     *
     * @author    Ing. 1Tte Rubier Sorio Pazos
     * @copyright XETID Cuba
     * @throws Zend_Json_Exception
     */
    public function getCriteriosAction()
    {
        $p['denominacion'] = ($this->_request->getPost('denominacion')) ? $this->_request->getPost('denominacion') : '';
        $p['fechaini'] = ($this->_request->getPost('fechaini')) ? $this->_request->getPost('fechaini') : '';
        $p['fechafin'] = ($this->_request->getPost('fechafin')) ? $this->_request->getPost('fechafin') : '';
        $model = new DatMatrizdofaModel();
        $res = NomCriterio::getCriterios($p);
        echo json_encode(array('root' => $res, 'cantidad_filas' => count($res)));
    }

    public function exportarDocumentoAction()
    {
        $idestudiomatriz = $this->_request->getParam('idestudiomatriz');
        $descargar = $this->_request->getParam('descargar');
        $idproyecto = $this->_request->getParam('idproyecto');
        $model = new DatEstudiomatrizdofaModel();
        $objetosestudios = $this->integrator->prospectiva->getProyectos('DatEstudiomatrizdofa', 0, 1000);
        $data = $model->getMatrizDofa($idproyecto);
        print_r($data);
        print_r($objetosestudios);
        die;
    }

    function saveCriteriosAction()
    {
        $model = new DatMatrizdofaModel();
        $objeto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('objeto')));
        $result = $model->saveCriterios($objeto);
        echo Zend_Json_Encoder::encode($result);
    }

    /**
     * Adiciona relacion entre Estrategia y criterio
     *
     * @author    Ing. 1Tte Rubier Sorio Pazos
     * @copyright XETID Cuba
     * @throws Zend_Json_Exception
     */
    public function savecruceAction()
    {
        $objeto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('objeto')));
        $model = new DatMatrizdofaModel();
        $res = $model->gestionarcruce($objeto, '');
        echo json_encode(array("success" => true, "data" => $res));
    }

    /**
     * Elimina relacion entre Estrategia y criterio
     *
     * @author    Ing. 1Tte Rubier Sorio Pazos
     * @copyright XETID Cuba
     * @throws Zend_Json_Exception
     */
    public function delcruceAction()
    {
        $objeto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('objeto')));
        $model = new DatMatrizdofaModel();
        $res = $model->gestionarcruce($objeto, 'delete');
        echo json_encode(array("success" => true, "data" => $res));
    }

    public function exportarResultadoOrdenadoAction()
    {
        $p['narchivo'] = $this->_request->getPost('narchivodofa');
        $p['farchivo'] = $this->_request->getPost('farchivodofa');
        $p['store'] = json_decode($this->_request->getPost('storedofa'));
        $d = "Estrategia ordenada";


        $html = '<div class="portlet-body">';
        $html .= '<table style="width:100%;">';
        $html .= '<tbody>';
        $html .= '<tr>';
        $html .= '<td style="width:75%;vertical-align: top;">';
        $html .= '</br></br>';


        if (count($p['store'])) {
            $html .= '<div style="padding-left: 60px;padding-top: 10px;">';
            $html .= '<table table class="table table-striped table-hover" style="width:100%;">';
            $html .= '<thead>';
            $html .= '<tr>';
            $html .= '<th style="text-align: left;  font-size: 20px; !important; font-weight: bold" >Estrategias ordenadas</th>';
            $html .= '</tr>';
            $html .= '</thead>';
            $html .= '<tbody>';
            $i = 1;
            foreach ($p['store'] as $value) {
                $html .= '<tr>';
                $html .= '<td>' . $i . "- " . $value->denominacion . '</td>';
                $html .= '</tr>';
                $i++;
            }
            $html .= '</tbody>';
            $html .= '</table>';
            $html .= '</div>';
        } else
            $html .= '<div style="padding-left: 60px;padding-top: 10px;color: #dedede;">No hay estrategias que mostrar.</div>';
        $html .= '</br></br>';

        $tabla = $html;

        $nombre = strtr($p['narchivo'], " ", "_");
        if ($p['farchivo'] == 'rtf') {
            header("Pragma: public");
            header("Expires: 0");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Content-Type: application/force-download");
            header("Content-type: application/ms-word");
            header("Content-Type: application/download");
            header("Content-Disposition: attachment;filename=" . "{$nombre}.rtf");
            header("Content-Transfer-Encoding: binary ");
            echo $tabla;
        } else {
            //Parametros de configuracion del PDF
            ini_set("memory_limit", "250M");
            $dir_www = $_SERVER ['DOCUMENT_ROOT'];
            $dir_rel_mt = '/';
            $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);
            $GLOBALS ['dirdom'] = $dir_abs_mt . 'lib/dompdf/dompdf_config.inc.php';
            Zend_Loader::loadFile($GLOBALS ['dirdom']);
            $autoloader = Zend_Loader_Autoloader::getInstance();
            $default = $autoloader->getDefaultAutoloader();
            $autoloader->setDefaultAutoloader('DOMPDF_autoload');
            $dompdf = new DOMPDF ();
            $dompdf->load_html($tabla);
            $dompdf->render();
            $dompdf->stream(" $nombre.pdf");
            $autoloader->setDefaultAutoloader($default);
            $dompdf->output();
        }
    }

    public function obtenerReporteAction()
    {

        try {
            $data = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('parametros')));

            $model = new DatMatrizdofaModel();
            $result = $model->getDatosReporte($data);
            $result['informe'] = 'Informe de la Matriz DOFA';
            $result['denominacion'] = $data['denominacion'];

            $report = $this->integrator->reportesge->obtenerReporte($result);
            echo Zend_Json_Encoder::encode(array('html' => $report));
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

}
