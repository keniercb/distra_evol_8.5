<?php

/**
 * @name GestSesion - Clase controladora de administración de sesiones.
 * @package   seguridad.
 * @copyright UCID.
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestsesionController extends ZendExt_Controller_Secure
{

    /**
     * @method init - Constructor de la clase.
     * @return void
     */
    function init()
    {
        parent::init();
    }

    /**
     * @method gestsesionAction - Acción principal de la clase
     * encargada de levantar la vista correspondiente.
     * @return void
     */
    public function gestsesionAction()
    {
        SegSession::CleanAnonymusSession();
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method cargarSesion Función usada para cargar el listado de sesiones.
     * @return json
     */
    public function cargarSesionAction()
    {
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $params = json_decode($this->_getParam('params'));
        $datos = SegSession::cargarsesion($start, $limit, $params);
        echo json_encode(
            array(
                'total_filas' => SegSession::total($params),
                'datos' => $datos
            )
        );
    }

    /**
     * @method eliminarAction Función usada para eliminar
     * las sesiones seleccionadas.
     * @return string
     */
    public function eliminarAction()
    {
        $sessionIds = json_decode($this->_request->getPost('sessionIds'));
        SegSession::eliminarsesion($sessionIds);
        $this->showMessage(
            'La(s) sesi&oacute;n(es) ha(n) '
            . 'sido eliminada(s) satisfactoriamente.'
        );
    }

    public function cargarUsuariosAction()
    {
        echo json_encode(
            array(
                'usuarios' => SegSession::getUsers()
            )
        );
    }

    public function cargarIPAction()
    {
        echo json_encode(
            array(
                'ips' => SegSession::getIps()
            )
        );
    }
}
