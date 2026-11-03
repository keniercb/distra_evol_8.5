<?php

/**
 * @name Gestbloqueo - Clase controladora de gestión de bloqueos.
 * @package   seguridad.
 * @copyright UCID.
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestbloqueoController extends ZendExt_Controller_Secure
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
     * @method gestbloqueoAction - Acción principal de la clase
     * encargada de levantar la vista correspondiente.
     * @return void
     */
    public function gestbloqueoAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method cargarAction Función usada para cargar el el lisado de bloqueos.
     * @return json
     */
    public function cargarAction()
    {

        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $denominacion = ($this->_request->getPost("buscar") != "")
            ? $this->_request->getPost("buscar") : null;
        $type = $this->_request->getPost("type");

        $datos = self::cargarDatos($start, $limit, $denominacion, $type);

        echo json_encode($datos);
    }

    private static function cargarDatos($start, $limit, $denominacion, $type)
    {
        $class = self::getClass($type);
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini(
            $register->config->security_config, 'cache'
        );
        if ($config->active) {
            SegBloqueo::gc($config->minutes * 60);
        }
        return call_user_func_array(
            array($class[0], 'cargar'), array($start, $limit, $denominacion)

        );
    }

    /**
     * @method actualizarAction Función usada para
     * modificar el rol seleccionado
     * @return string
     */
    public function actualizarAction()
    {
        $arrayDel = json_decode(
            stripslashes($this->_request->getPost('ArrayDel'))
        );
        $class = self::getClass($this->_request->getPost("type"));
        call_user_func_array(array($class[0], 'actualizar'), array($arrayDel));
        $this->showMessage(
            "El(Los) {$class[1]}(s) ha(n) sido "
            . "desbloqueado(s) satisfactoriamente."
        );
    }

    /**
     * @access Private
     *
     * @param string $type Tipo de bloqueo.
     *
     * @return string Clase que implementa la funcion.
     */
    private static function getClass($type)
    {
        switch ($type) {
            case 'user':
                return array('SegBloqueoUsuarioModel', 'usuario');
            case 'ip':
                return array('SegBloqueoIpModel', 'ip');
        }
    }
}