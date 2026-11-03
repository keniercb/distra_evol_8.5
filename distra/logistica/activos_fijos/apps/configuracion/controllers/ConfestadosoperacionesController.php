<?php

/**
 *
 */
class ConfestadosoperacionesController extends ZendExt_Controller_Secure
{

    private $_confEstatusEntidad, $_sConfGeneral;

    /**
     *
     */
    function init()
    {
        $this->_confEstatusEntidad = new CfgEstadosEntidad();
        $this->sNomGenerales = new NomencladoresActivosService();
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        parent:: init();
    }

    /**
     *
     */
    function confestadosoperacionesAction()
    {
        $this->render();
    }

    /**
     *
     */
    function cargarcomboestadoAction()
    {
        $estructura = 'Estructura';
        $idEstructura = $this->global->$estructura->idestructura;

        $estados = $this->sNomGenerales->getEstatusTecnicos(array('idestructura' => $idEstructura));
        echo json_encode($estados);
    }

    /**
     *
     */
    function cargarcomboestadousanentidadAction()
    {
        $estructura = 'Estructura';
        $idEstructura = $this->global->$estructura->idestructura;

        $estados = $this->sNomGenerales->getEstatusTecUsanEntidad($idEstructura);
        echo json_encode($estados);
    }

    /**
     *
     */
    function cargaroperacionesAction()
    {
        $datos = array();
        $global = ZendExt_GlobalConcept::getInstance();
        $estructura = 'Estructura';
        $idEstructura = $global->$estructura->idestructura;

        $operaciones = $this->_sConfGeneral->obtenerOperaciones($idEstructura, LogisticaGlobal::SUBSISTEMA_AFT);
        if ($this->_request->getPost('rec')) {
            $estadoAsociado = $this->_confEstatusEntidad->getTodosEstatus(
                $this->_request->getPost('idestatustecnico')
            );
            foreach ($operaciones as $rowuno) {
                $flag = false;
                foreach ($estadoAsociado as $row) {
                    if ($row['idoperacion'] == $rowuno['idnomoperaciones']) {
                        $flag = true;
                    }
                }
                if ($flag == false) {
                    $datos[] = array('idoperacion' => $rowuno['idnomoperaciones'],
                        'denominacion' => $rowuno['denominacion']);
                }
            }
        } else {
            foreach ($operaciones as $ky => $operacion) {
                $datos[$ky]['idoperacion'] = $operacion['idnomoperaciones'];
                $datos[$ky]['denominacion'] = $operacion['denominacion'];
                $datos[$ky]['idconcepto'] = $operacion['idconceptooperacion'];
                $datos[$ky]['operacioncontable'] = $operacion->contabilidadadicional;
                $datos[$ky]['idcuenta'] = $operacion['idcuenta'];
            }
        }

        echo json_encode(array('datos' => $datos));
    }

    /**
     *
     */
    function getdatosAction()
    {
        try {
            $classEstructura = 'Estructura';

            $idestado = $this->_request->getPost('idestatustecnico');
            $operacion = $this->_request->getPost('idoperacion');

            $parametros = new stdClass();
            ComunAFTModel::getInstance()->configStartAndLimitInParams(
                $parametros, $this->_request->getPost('start'), $this->_request->getPost('limit')
            );

            $idproximoestado = ($this->_request->getPost('idproximoestado')) ?
                $this->_request->getPost('idproximoestado') : '';

            $idEstructuracomun = $this->global->$classEstructura->idestructura;

            $result = $this->_confEstatusEntidad->getTodosEstatus(
                $idEstructuracomun, $idestado, $operacion, $idproximoestado, $parametros->start, $parametros->limit
            );
            $total = $this->_confEstatusEntidad->getCantTodosPorEstado(
                $idEstructuracomun, $idestado, $operacion, $idproximoestado
            );

            $datos = array();
            $i = 0;
            foreach ($result as $key) {
                $datos[$i] = $key;
                $opercion = $this->_sConfGeneral->obtenerOperaciones(0, 0, 0, $key['idoperacion']);
                $datos[$i]['denominacion'] = $opercion[0]['denominacion'];

                $estado = $this->sNomGenerales->getEstatusTecById($key['idestado']);
                $nextEstatus = $this->sNomGenerales->getEstatusTecById($key['idproximoestado']);

                if (count($estado)) {
                    $datos[$i]['estado'] = $estado[0]['denominacion'];
                }

                if (count($nextEstatus)) {
                    $datos[$i]['proximoestado'] = $nextEstatus[0]['denominacion'];
                } else {
                    $datos[$i]['proximoestado'] = '';
                }
                $i++;
            }

            echo json_encode(array('datos' => $datos, 'total' => $total));
        } catch (Exception $e) {
            echo $e;
        }
    }

    /**
     *
     */
    function eliminarasociadoAction()
    {
        $datos = json_decode(stripcslashes($this->_request->getPost('datos')));

        $bandera = true;
        foreach ($datos as $dato) {
            $this->_confEstatusEntidad->getNextEstatusByIdEstatusEntidad($dato);
            $bandera = $this->_confEstatusEntidad->eliminarByArrIdes($dato);
        }
        if ($bandera) {
            echo json_encode(array('CodMsg' => 1));
        } else {
            echo json_encode(array('CodMsg' => 3));
        }
    }

    /**
     *
     */
    function adicionaroperacionestadoAction()
    {
        try {
            $classEstructura = 'Estructura';

            $parametros = json_decode(
                stripcslashes($this->_request->getPost('parametros'))
            );
            $idEstructuracomun = $this->global->$classEstructura->idestructura;

            $existe = $this->_confEstatusEntidad->existEstatus($parametros, $idEstructuracomun);


            $proximoestadoexistente = $this->_confEstatusEntidad->getEstadoSalidaOperacion(
                $parametros, $idEstructuracomun
            );
            if (count($proximoestadoexistente) > 0) {
                if ($proximoestadoexistente[0]['idproximoestado'] == $parametros->idproximoestado) {
                    if ($existe == 0) {
                        $obj = new CfgEstadosEntidad();
                        $obj->idestructuracomun = $idEstructuracomun;
                        $obj->idestado = $parametros->idestatustecnico;
                        $obj->idproximoestado = $parametros->idproximoestado;
                        $obj->idoperacion = $parametros->idoperacion;
                        $obj->save();
                        echo json_encode(array('CodMsg' => '1'));
                    } else {
                        echo json_encode(array('CodMsg' => '3'));
                    }
                } else {
                    echo json_encode(array('CodMsg' => '4'));
                }
            } else {
                if ($existe == 0) {
                    $obj = new CfgEstadosEntidad();
                    $obj->idestructuracomun = $idEstructuracomun;
                    $obj->idestado = $parametros->idestatustecnico;
                    $obj->idproximoestado = $parametros->idproximoestado;
                    $obj->idoperacion = $parametros->idoperacion;
                    $obj->save();
                    echo json_encode(array('CodMsg' => '1'));
                } else {
                    echo json_encode(array('CodMsg' => '3'));
                }
            }
        } catch (Exception $e) {

            echo json_encode(array('CodMsg' => '2'));
        }
    }

    /**
     *
     */
    function modificaroperacionestadoAction()
    {
        try {
            $classEstructura = 'Estructura';

            $parametros = json_decode(
                stripcslashes($this->_request->getPost('parametros'))
            );
            $idEstructuracomun = $this->global->$classEstructura->idestructura;

            $obj = Doctrine::getTable('CfgEstadosEntidad')->find($parametros->idestadosentidad);
            $obj->idestructuracomun = $idEstructuracomun;
            $obj->idestado = $parametros->idestado;
            $obj->idproximoestado = $parametros->idproximoestado;
            $obj->idoperacion = $parametros->idoperacion;
            $obj->save();

            echo json_encode(array('CodMsg' => '1'));
        } catch (Exception $e) {
            echo json_encode(array('CodMsg' => '2'));
        }
    }

}
