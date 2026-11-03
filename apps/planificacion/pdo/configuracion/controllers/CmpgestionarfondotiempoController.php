<?php

class CmpgestionarfondotiempoController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function cmpgestionarfondotiempoAction()
    {
        $this->render();
    }

    function cargarDiasAction()
    {
        $parametros['idestructura'] = $this->_request->getPost('idestructura');
        $parametros['idcalendario'] = $this->_request->getPost('idcalendario');
        $parametros['anno'] = $this->_request->getPost('anno');
        $confCalendarioMolel = new ConfCalendarioModel();
        $result = $confCalendarioMolel->getCalendario($parametros);
        if ($result != 0) {
            $result = $this->convertirArrayToUnidimensional($result);
            $r['datos'] = $result;
            $r['cantidad'] = count($result);

        } else $r['cod'] = 0;
        echo(json_encode($r));
    }

    function addDiasAction()
    {
        $parametros['fechas'] = json_decode(($this->_request->getPost('fechas')));
        $parametros['anno'] = $this->_request->getPost('anno');
        $parametros['fechas'] = self::validarFechasAnno($parametros);
        $parametros['idtipodia'] = $this->_request->getPost('idtipodia');
        $parametros['horas'] = $this->_request->getPost('horas');
        $parametros['anno'] = $this->_request->getPost('anno');
        $parametros['horainicio'] = $this->_request->getPost('horainicio');
        $parametros['horafin'] = $this->_request->getPost('horafin');
        $parametros['incidencia'] = $this->_request->getPost('incidencia');
        $idcalendario = $this->_request->getPost('idcalendario');
        $idestructura = $this->_request->getPost('idestructura');
        $parametros['getByIdEstructura'] = (!empty($idestructura)) ? 'si' : 'no';
        $parametros['idestructura'] = (!empty($idestructura)) ? $idestructura : $idcalendario;


        $calendarioModel = new ConfCalendarioModel();
        $result = $calendarioModel->adicionarDiasCalendario($parametros);

        if ($result['add_estructura'] && $result['add_estructura_hija']) {
            $r['cod'] = 1;
        } else {
            if ($result['add_estructura'] && !$result['add_estructura_hija']) {
                $r['cod'] = 2;
            } else {
                $r['cod'] = 3;
            }
        }
        echo(json_encode($r));
    }

    function addDiasOldAction()
    {
        $parametros['fechas'] = json_decode(stripslashes($this->_request->getPost('fechas')));
        $parametros['anno'] = $this->_request->getPost('anno');
        $parametros['fechas'] = self::validarFechasAnno($parametros);
        $parametros['idtipodia'] = $this->_request->getPost('idtipodia');
        $parametros['horas'] = $this->_request->getPost('horas');
        $parametros['anno'] = $this->_request->getPost('anno');
        $parametros['idestructura'] = $this->_request->getPost('idestructura');
        $parametros['idcalendario'] = $this->_request->getPost('idcalendario');
        $parametros['getByIdEstructura'] = (empty($parametros['idestructura'])) ? false : true;

        $calendarioModel = new ConfCalendarioModel();
        $result = $calendarioModel->adicionarDiasCalendario($parametros);

        if ($result['add_estructura'] && $result['add_estructura_hija']) {
            $r['cod'] = 1;
        } else {
            if ($result['add_estructura'] && !$result['add_estructura_hija']) {
                $r['cod'] = 2;
            } else {
                $r['cod'] = 3;
            }
        }
        echo(json_encode($r));
    }

    public function validarFechasAnno ($parametros){
        $fechas = $parametros['fechas'];
        $anno = $parametros['anno'];
        foreach ($fechas as $value => $key) {
            $fecha = explode('/',$key);
            if ($fecha[2] != $anno) {
                unset($fechas[$value]);
            }
        }
        return implode(',', $fechas);
    }

    function delDiasAction()
    {
        $parametros['idestructura'] = $this->_request->getPost('idestructura');
        $parametros['fechas'] = json_decode(
            stripslashes($this->_request->getPost('seleccion'))
        );
        $parametros['anno'] = $this->_request->getPost('anno');
        $parametros['idcalendario'] = $this->_request->getPost('idcalendario');
        $parametros['getByIdEstructura'] = (empty($parametros['idestructura'])) ? false : true;

        $calendarioModel = new ConfCalendarioModel();
        $result = $calendarioModel->eliminarDiasCalendario($parametros);
        echo(json_encode($result));

    }

    function delConfiguracionAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $anno = $this->_request->getPost('anno');

        $parametros['idestructura'] = $idestructura;
        $parametros['anno'] = $anno;

        $calendarioModel = new ConfCalendarioModel();
        $result = $calendarioModel->eliminarCalendario($parametros);
        echo(json_encode($result));

    }

    function delegarConfiguracionAction()
    {
        $parametros['idestructura'] = $this->_request->getPost('idestructura');
        $parametros['anno'] = $this->_request->getPost('anno');

        $calendarioModel = new ConfCalendarioModel();
        $result = $calendarioModel->delegarCalendario($parametros);
        echo(json_encode($result));

    }

    function compartirConfiguracionAction()
    {
        $parametros['idestructura'] = $this->_request->getPost('idestructura');
        $parametros['anno'] = $this->_request->getPost('anno');
        $parametros['idestructuracompartir'] = $this->_request->getPost(
            'idestructuracompartir'
        );

        $calendarioModel = new ConfCalendarioModel();
        $result = $calendarioModel->compartirCalendario($parametros);
        echo(json_encode($result));

    }

    function cargarTipoDiasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 12;
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        if ($nomencladores != null) {
            foreach ($nomencladores as $val) {
                $dat->data [] = array('idtipodia' => $val['idnomenclador'],
                    'denominacion' => $val['denom'],
                    'color' => $val['color'],
                    'incidencia' => $val['incidencia']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    function limpiarConfiguracionAction()
    {

    }

    function listarFondoTiempoAction()
    {
        $parametros['start'] = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;
        $model = new ConfCalendarioModel();
        $result = $model->listarFondoTiempo($parametros);
        if (isset($result['resultado'])) {
            if ($result['total'] == 0) {
                echo json_encode(array('campos' => array(), 'total' => 0));
            } else {
                echo json_encode(array('campos' => $result['resultado'], 'total' => $result['total']));
            }

        } else echo json_encode(array('campos' => array(), 'total' => 0));
    }

    function adicionarFondoTiempoAction()
    {
        $parametros['denominacion'] = $this->_request->getPost('denominacion');
        $model = new ConfCalendarioModel();
        $result = $model->adicionarFondoTiempo($parametros);
        if ($result) echo json_encode(array('cod' => 1));
        else echo json_encode(array('cod' => 0));
    }

    function guardarFondoTiempoAction()
    {
        $arrayElementos = json_decode($this->_request->getPost('arrayElementos'));
        $model = new ConfCalendarioModel();
        $result = $model->guardarFondoTiempo($arrayElementos);
        if ($result) echo json_encode(array('cod' => 1));
        else echo json_encode(array('cod' => 0));
    }

    function eliminarFondoTiempoAction()
    {
        $arrayIdElementosEliminar = json_decode(
            stripslashes($this->_request->getPost('arrayIdElementosEliminar'))
        );
        $model = new ConfCalendarioModel();
        $result = $model->eliminarFondoTiempo($arrayIdElementosEliminar);
        echo json_encode(array('mensaje' => $result));
    }

    public function cargarEntidadesAction()
    {
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $idEstructura = ($this->_request->getPost('node'))
            ? $this->_request->getPost('node') : 0;
        $valor = $this->_request->getPost('denominacion');
        $iddominio = $this->global->Perfil->iddominio;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras(
            $iddominio, $idEstructura, 0, 0, 3
        );
        $result = array();
        foreach ($dominios as $key => $val) {
            if ($valor != null) {
                $flag = stristr($val['text'], $valor);
            }
            if ($val['tipo'] != 7) {
                $result[$key] = $val;
                $result[$key]['qtip'] = $val['text'];
            }
        }
        if ($valor != null) {
            foreach ($result as $key => $value) {
                if (stristr($value['text'], $valor) == false) {
                    unset($result[$key]);
                }
            }
            $res = array();
            $i = 0;
            foreach ($result as $key => $val) {
                $res[$i++] = $val;
            }
        }
        if ($res != null) {
            $result = $res;
        }
        echo json_encode($result);
    }

    public function convertirArrayToUnidimensional($array)
    {
        $temp = array();
        $result = array();
        foreach ($array as $value => $key) {
            foreach ($key as $value1 => $key1) {
                if ($value1 == 'ConfCalendario') {
                    foreach ($key1 as $value2 => $key2) {
                        if ($value2 == 'NomTipoDia') {
                            foreach ($key2 as $value3 => $key3) {
                                $temp[$value3] = $key3;
                            }
                        } else {
                            $temp[$value2] = $key2;
                        }
                    }
                } else {
                    $temp[$value1] = $key1;
                }
            }
            $result[$value] = $temp;
        }
        return $result;
    }

}

?>
