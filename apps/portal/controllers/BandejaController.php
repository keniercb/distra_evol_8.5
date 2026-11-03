<?php

/**
 * Created by PhpStorm.
 * User: jose
 * Date: 2/16/15
 * Time: 2:28 PM
 */
class BandejaController extends ZendExt_Controller_Secure
{

    private $_modelBandeja;

    public function init()
    {
        $this->_modelBandeja = new BandejaNotificacionModel();
        parent::init();
    }

    function bandejaAction()
    {
        $this->render();
    }

    public function getCantidadNotificacionesNoLeidasAction()
    {
        $idusuario = $this->global->Perfil->idusuario;
        $arrays = $this->_modelBandeja->getCantidadNotificacionesNoLeidasAction(
            $idusuario
        );
        $result = array();
        foreach ($arrays as $value) {
            $tipo = $value['idtipoaviso'];
            switch ($tipo) {
                case 1:
                    $row = array(
                        'cantidad' => (int)$value['cantidad'],
                        'iconClass' => 'icon-infor',
                        'tipo' => 'info',
                        'titulo' => $value['denominacion'],
                        'idtipo' => $tipo
                    );
                    break;
                case 2:
                    $row = array(
                        'cantidad' => (int)$value['cantidad'],
                        'iconClass' => 'icon-warning-sign',
                        'tipo' => 'warning',
                        'titulo' => $value['denominacion'],
                        'idtipo' => $tipo
                    );
                    break;
                case 3:
                    $row = array(
                        'cantidad' => (int)$value['cantidad'],
                        'iconClass' => 'icon-remove',
                        'tipo' => 'error',
                        'titulo' => $value['denominacion'],
                        'idtipo' => $tipo
                    );
                    break;
                case 4:
                    $row = array(
                        'cantidad' => (int)$value['cantidad'],
                        'iconClass' => 'icon-bullhorn',
                        'tipo' => 'alert',
                        'titulo' => $value['denominacion'],
                        'idtipo' => $tipo
                    );
                    break;
            }
            array_push($result, $row);
        }
        echo json_encode($result);
    }

    public function listarNotificacionesAction()
    {
        $type = $this->getRequest()
            ->getParam('tipo');
        $idusuario = $this->global->Perfil->idusuario;
        $arrays = $this->_modelBandeja->listarNotificaciones($idusuario, $type);
        echo json_encode(
            array(
                'data' => $arrays,
                'cantidad' => count($arrays)
            )
        );
    }

    public function marcarLeidoAction()
    {
        $id = $this->getRequest()
            ->getParam('id');
        $this->_modelBandeja->cambiarEstado($id, 0);
        echo json_encode(
            array(
                'success' => true,
                'codMsg' => 'MsgExitoLeido'
            )
        );
    }

    public function marcarNoLeidoAction()
    {
        $id = $this->getRequest()
            ->getParam('id');
        $this->_modelBandeja->cambiarEstado($id, 1);
        echo json_encode(
            array(
                'success' => true,
                'codMsg' => 'MsgExitoNoLeido'
            )
        );
    }

    public function eliminarNotificacionesAction()
    {
        $ids = json_decode($this->getRequest()->getParam('ids'), true);
        $this->_modelBandeja->eliminarNotificaciones($ids);
        echo json_encode(
            array(
                'success' => true,
                'codMsg' => 'MsgExitoEliminar'
            )
        );
    }
}