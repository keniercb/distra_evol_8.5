<?php

class CmpgestionarfondotiempoController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function  cmpgestionarfondotiempoAction()
    {
        $this->render();
    }

    function cargarDiasAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $anno = $this->_request->getPost('anno');
        $confCalendario = new ConfCalendario();
        $result = $confCalendario->getCalendarioPorEstructura(
            $idestructura, $anno
        );
        $result = $this->convertirArrayToUnidimensional($result);
        $r['datos'] = $result;
        $r['cantidad'] = count($result);

        echo(json_encode($r));
    }

    function addDiasAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idtipodia = $this->_request->getPost('idtipodia');
        $horas = $this->_request->getPost('horas');
        $anno = $this->_request->getPost('anno');
        $fechas = json_decode(stripslashes($this->_request->getPost('fechas')));

        $parametros['idestructura'] = $idestructura;
        $parametros['idtipodia'] = $idtipodia;
        $parametros['horas'] = $horas;
        $parametros['fechas'] = implode(',', $fechas);
        $parametros['anno'] = $anno;

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

    function delDiasAction()
    {
        $arrfechas = json_decode(
            stripslashes($this->_request->getPost('seleccion'))
        );
        $idestructura = $this->_request->getPost('idestructura');
        $anno = $this->_request->getPost('anno');

        $parametros['idestructura'] = $idestructura;
        $parametros['fechas'] = $arrfechas;
        $parametros['anno'] = $anno;

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
        $parametros['idestructuracompartir'] = $this->_request->getPost('idestructuracompartir');

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
                $dat->data [] = array('idtipodia'    => $val['idnomenclador'],
                                      'denominacion' => $val['denom'],
                                      'color'        => $val['color']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    function limpiarConfiguracionAction()
    {

    }

    public function cargarEntidadesAction()
    {
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $node = $this->_request->getPost('node');
        if ($node) {
            $idEstructura = $this->_request->getPost('node');
        } else {
            $idEstructura = 0;
        }

        $iddominio = $this->global->Perfil->iddominio;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras(
            $iddominio, $idEstructura, 0, 0, 3
        );

        echo json_encode($dominios);
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
