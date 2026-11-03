<?php
/**
 * @name NotificacionController - Clase controladora del nomenclador "Cargo para comisiones".
 * @extends ZendExt_Controller_Secure
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @date 02/11/2017 Ing. Orestes Rodríguez Lorenzo
 * @version 1.0.0
 */

class NotificacionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    /**
     * @method notificacion - Constructor de la clase
     * @author Ing. Orestes Rodríguez Lorenzo
     * @date 02/11/2017
     */
    public function notificacionAction()
    {
        $this->render();
    }

    public function obtenerConfigAction()
    {
        $objModel = new ConfNotificacionModel();
        $resultado = $objModel->obtenerConfig();
        echo json_encode($resultado);
    }

    public function obtenerDominiosAction()
    {
        $objDominio = new NomDominioModel();
        echo json_encode($objDominio->obtenerDominios());
    }

    public function gestionarConfiguracionesAction()
    {
        $objModel = new ConfNotificacionModel();
        if($this->_request->getPost('accion') === 'del') {
            $result = $objModel->eliminarConfiguracion(json_decode($this->_request->getPost('idnotificacion')));
        } else {
            $iddominio = $this->_request->getPost('iddominio');
            $servidor = $this->_request->getPost('servidor');
            $puerto = $this->_request->getPost('puerto');
            $smtpaut = $this->_request->getPost('smtpaut');
            $remitente = $this->_request->getPost('remitente');
            $nombremitente = $this->_request->getPost('nombremitente');
            $contrasena = $this->_request->getPost('contrasena');
            if ($this->_request->getPost('accion') === 'add') {
                $result = $objModel->adicionarConfiguracion(
                    $iddominio,
                    $servidor,
                    $puerto,
                    $smtpaut,
                    $remitente,
                    $nombremitente,
                    $contrasena
                );
            } else {
                $result = $objModel->modificarConfiguracion(
                    $this->_request->getPost('idnotificacion'),
                    $iddominio,
                    $servidor,
                    $puerto,
                    $smtpaut,
                    $remitente,
                    $nombremitente,
                    $contrasena
                );
            }
        }
        echo json_encode($result);
    }
}