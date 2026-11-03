<?php

/**
 * @name ConfiguracionController - Clase controladora del componente de
 * configuracion.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class ConfiguracionController extends ZendExt_Controller_Secure
{

    /**
     * @method init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * Función principal de la clase,
     * encargada de renderiar la vista correspondiente.
     * @method gestaccionAction()
     *
     * @return void
     */
    public function configuracionAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * Función usada para cargar el árbol de funcionalidades.
     * @method cargarArbolAction()
     *
     * @return json
     */
    public function cargarArbolAction()
    {
        $register = Zend_Registry::getInstance();
        $arrayIni = new Zend_Config_Ini($register->config->ini->configArbol);
        $arrayResult = array();
        $iterator = 0;
        foreach ($arrayIni as $array) {
            foreach ($array as $key => $value) {
                $arrayResult[$iterator][$key] = $value;
            }
            $iterator++;
        }
        echo json_encode($arrayResult);
    }

    /**
     * @method cargarClaveAction() -
     * Función usada para cargar la configuración de la clave.
     * @return json
     */
    public function cargarClaveAction()
    {
        echo json_encode(
            array('datos' => SegRestricclaveacceso::cargarclave(1, 0))
        );
    }

    /**
     * Funcion usada para cargar el entorno de configuracion de las trazas.
     * @method cargarEntornoTrazaAction
     *
     * @return json
     */
    public function cargarEntornoTrazaAction()
    {
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini(
            $register->config->security_config,
            'trace'
        );
        echo json_encode(
            array('datos' => array(
                array('background' => (string)$config->background))
            )
        );
    }

    /**
     * Funcion usada para cargar la configuracion del bloqueo de usuarios y IP.
     * @method cargarConfiguracionBloqueoAction
     *
     * @return json
     */
    public function cargarConfiguracionBloqueoAction()
    {
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini(
            $register->config->security_config,
            'cache'
        );
        $temp = array(
            array('active' => $config->active,
                'minutes' => $config->minutes,
                'userActive' => $config->user->active,
                'userAttempts' => $config->user->attempts,
                'ipActive' => $config->ip->active,
                'ipAttempts' => $config->ip->attempts));
        echo json_encode(array('datos' => $temp));
    }

    /**
     * Funcion usada para mostrar si la entidad se muestra o no.
     * @method
     *
     * @return json
     */
    public function cargarEntidadAction()
    {
        $idusuario = $this->global->Perfil->idusuario;
        $res = SegUsuarioModel::getEntidad($idusuario);
        echo json_encode(array('datos' => $res));
    }

    /**
     * Funcion usada para cambiar el estado de la entidad.
     *
     * @return json
     */
    public function cambiarestadoEntidadAction()
    {
        $estado = $this->_request->getParams()['estado'];
        $idusuario = $this->global->Perfil->idusuario;
        $res = SegUsuarioModel::cambiarestadoEntidad($idusuario, $estado);

        echo json_encode(array('datos' => $res, 'Msg' => 'La configuraci&oacute;n de mostrar entidad se ha guardado correctamente.'));
    }

    /**
     * @method modificarclaveAction() -
     * Función usada para modificar la configuración de la clave.
     */
    public function modificarclaveAction()
    {
        $clave = new SegRestricclaveacceso();
        $clave = Doctrine::getTable('SegRestricclaveacceso')
            ->find($this->_request->getPost('idrestricclaveacceso'));
        $diascaducidad = $this->_request->getPost('diascaducidad');
        if ($diascaducidad != $clave->diascaducidad) {
            SegClaveaccesoModel::changeDateEnd($diascaducidad);
        }
        $clave->diascaducidad = $diascaducidad;
        $clave->minimocaracter = $this->_request->getPost('minimocaracteres');
        $clave->historico = $this->_request->getPost('historicoPass');
        if ($this->_request->getPost('numerica') == "on") {
            $clave->numerica = '1';
        } else {
            $clave->numerica = '0';
        }
        if ($this->_request->getPost('alfabetica') == "on") {
            $clave->alfabetica = '1';
        } else {
            $clave->alfabetica = '0';
        }
        if ($this->_request->getPost('signo') == "on") {
            $clave->signo = '1';
        } else {
            $clave->signo = '0';
        }
        if ($this->_request->getPost('mayuscula') == "on") {
            $clave->mayuscula = '1';
        } else {
            $clave->mayuscula = '0';
        }
        $model = new SegRestricclaveaccesoModel();
        if ($model->insertarclave($clave)) {
            $this->showMessage(
                'La configuraci&oacute;n de la clave '
                . 'ha sido guardada satisfactoriamente.'
            );
        }
    }

    /**
     * @method actualizarEntornoTrazaAction -
     * Funcion usada para actualizar el entorno de trazas.
     */
    public function actualizarEntornoTrazaAction()
    {
        $background = false;
        if ($this->_request->getPost('numerica') == 'on') {
            $background = true;
            $amqpConfigXml = ZendExt_FastResponse::getXML('amqpconfig');
            $amqpConnNode = $amqpConfigXml->conn;
            $amqpConnNodeAttributes = $amqpConnNode->attributes();
            $amqpConfig = array();
            foreach ($amqpConnNodeAttributes as $attribute => $value) {
                $amqpConfig[$attribute] = ($attribute == 'port')
                    ? (integer)$value : (string)$value;
            }
            try {
                $rabbitConn = new Rabbit_Connection($amqpConfig);
                $rabbitConn->connect();
                if (!$rabbitConn->isConnected()) {
                    throw new Exception('Error connecting to RabbitMQ Server.');
                } else {
                    $rabbitConn->close();
                }
            } catch (Exception $e) {
                $log = new ZendExt_Exception_Log(
                    new ZendExt_Exception('NOCONTROLLED', $e)
                );
                $log->handle();
                echo '{"success": false}';

                return;
            }
        }
        $register = Zend_Registry::getInstance();
        $array = array('skipExtends' => true, 'allowModifications' => true);
        $config = new Zend_Config_Ini(
            $register->config->security_config,
            null,
            $array
        );
        $config->trace->background = $background;
        $secConfig = array(
            'config' => $config,
            'filename' => $register->config->security_config
        );
        $writer = new Zend_Config_Writer_Ini($secConfig);
        $writer->write();
        $this->showMessage(
            'La configuraci&oacute;n del entorno de '
            . 'traza ha sido guardada satisfactoriamente.'
        );
    }

    /**
     * @method actualizarBloqueoAction - Funcion usada para
     * actualizar la configuracion del bloqueo.
     */
    public function actualizarBloqueoAction()
    {
        $register = Zend_Registry::getInstance();
        $activeCache = ($this->_request->getPost('active')) ? true : false;
        $minutes = ($this->_request->getPost('minutes'))
            ? $this->_request->getPost('minutes') : '';
        $userActive = ($this->_request->getPost('userActive')) ? true : false;
        $ipActive = ($this->_request->getPost('ipActive')) ? true : false;
        $temp = array('skipExtends' => true, 'allowModifications' => true);
        $config = new Zend_Config_Ini(
            $register->config->security_config,
            null,
            $temp
        );
        $config->cache->active = $activeCache;
        $config->cache->minutes = $minutes;
        $config->lock->user->active = $userActive;
        $config->lock->user->attempts = $this->_request->getPost('userAttempts');
        $config->lock->ip->active = $ipActive;
        $config->lock->ip->attempts = $this->_request->getPost('ipAttempts');
        $array = array(
            'config' => $config,
            'filename' => $register->config->security_config
        );
        $writer = new Zend_Config_Writer_Ini($array);
        $writer->write();
        $this->showMessage(
            'La configuraci&oacute;n del bloqueo '
            . 'ha sido guardada satisfactoriamente.'
        );
    }

    /**
     * @method obtenerModoInicioAction - Funcion usada para
     * para obtener el modo de inicio del usuario logueado.
     */
    public function obtenerModoInicioAction()
    {
        try {
            $usuario = $this->global->Perfil->idusuario;
            $resultado = NomDesktopModel::obtenerModoInicio($usuario);
            echo json_encode($resultado);
            return $resultado;
        } catch (Exception $e) {
            print_r($e->getMessage());
        }


    }

    /**
     * @method actualizarModoInicioAction - Funcion usada para
     * para actualizar el modo de inicio del usuario logueado.
     */
    public function actualizarModoInicioAction()
    {
        try {
            $value = $this->_request->getParams()['value'];
            $usuario = $this->global->Perfil->idusuario;
            $resultado = NomDesktopModel::modificarModoInicio($usuario, $value);
            echo json_encode($resultado);
            return $resultado;
        } catch (Exception $e) {
            print_r($e->getMessage());
        }
    }

    public function configurarAction()
    {
        $configdir = DIR_ABS_MT . 'apps/comun/recursos/json/ceinclient.json';
        $data = json_decode(file_get_contents($configdir))->dir;
        $data = explode(":", $data);
        $port = $data[2];
        $dir = str_replace('/', '', $data[1]);

        $temp = array(
            array('ipCein' => $dir,
                'port' => $port,
            )
        );
        echo json_encode(array('datos' => $temp));
    }

    public function configurarceinclientAction()
    {
        $params = $this->_getAllParams();
        $dir = $params['ipCein'];
        $port = $params['port'];
        $port = $port ? ':' . $port : '';
        $http = $params['radio'] == 'https' ? 'https' : 'http';
        $value = $http . '://' . $dir . $port;
        $configdir = DIR_ABS_MT . 'apps/comun/recursos/json/ceinclient.json';
        $data = array("dir" => $value);
        $result = file_put_contents($configdir, json_encode($data));
        if ($result) {
            echo json_encode(array("success" => true, "message" => "La configuraci&oacute;n se ha realizado correctamente."));
        } else {
            echo json_encode(array("success" => false, "message" => "Error al tratar de escribir configuracion debido a permisos de escritura."));
        }
    }

    public function testSoapServiceAction()
    {
        $dir_modulo_cein = DIR_ABS_MT . 'apps/herramientas/cein';
        $resp = is_dir($dir_modulo_cein);
        if ($resp) {
            $dirwsdl = 'http://' . $_SERVER['HTTP_HOST'] . '/herramientas/cein/webservices/CeinSoapService.wsdl';
        } else {
            $configdir = DIR_ABS_MT . 'apps/comun/recursos/json/ceinclient.json';
            $data = json_decode(file_get_contents($configdir));
            $dir = $data->dir;
            $dirwsdl = $dir . '/herramientas/cein/webservices/CeinSoapService.wsdl';
        }
        try {
            ini_set('soap.wsdl_cache_enabled', 0);
            $original = ini_get('default_socket_timeout');
            ini_set('default_socket_timeout', 15);
            $contextOptions = stream_context_create(
                array(
                    "ssl" => [
                        "verify_peer" => false,
                        "verify_peer_name" => false,
                        "allow_self_signed" => true
                    ]
                )
            );
            $s = new Zend_Soap_Client(
                $dirwsdl,
                array(
                    "stream_context" => $contextOptions
                )
            );
            $v = $s->testSoap();
            ini_set('default_socket_timeout', $original);
            echo json_encode(
                array(
                    "success" => $v
                )
            );
        } catch (Exception $e) {
            echo json_encode(
                array(
                    "success" => false
                )
            );
        }
    }

    public function tieneModuloCeinAction()
    {
        $dir_modulo_cein = DIR_ABS_MT . 'apps/herramientas/cein';
        $resp = is_dir($dir_modulo_cein);
        echo json_encode(
            array(
                "success" => $resp
            )
        );
    }

    public function configurarCeinWsdlAction()
    {
        header("Location: /herramientas/cein/services.php?generateWsdl=1");
    }

    public function cargarConfiguracionIntegridadAction()
    {
        $respuesta = array();

        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini(
            $register->config->security_config, 'fileIntegrity'
        );

        $respuesta['datos'] = array($config->toArray());
        echo json_encode($respuesta);
    }

    public function cambiarConfiguracionIntegridadAction()
    {
        $configuracion = array();
        $configuracion['escaneoActivo'] = stripcslashes($this->_request->getParams()['escaneoActivo']);
        $configuracion['invalidarSistema'] = stripcslashes($this->_request->getParams()['invalidarSistema']);
        $configuracion['horaEscaneo'] = stripcslashes($this->_request->getParams()['horaEscaneo']);

        echo json_encode(array('success' => $this->salvarConfiguracionIntegridad($configuracion)));

    }

    private function salvarConfiguracionIntegridad(array $configuracionIntegridad)
    {
        $register = Zend_Registry::getInstance();
        $array = array('skipExtends' => true, 'allowModifications' => true);
        $config = new Zend_Config_Ini(
            $register->config->security_config, null, $array
        );

        $config->fileIntegrity->escaneoActivo = $configuracionIntegridad['escaneoActivo'] === "true";
        $config->fileIntegrity->invalidarSistema = $configuracionIntegridad['invalidarSistema'] === "true";
        $config->fileIntegrity->horaEscaneo = $configuracionIntegridad['horaEscaneo'];

        $arrayFile = array(
            'config' => $config,
            'filename' => $register->config->security_config
        );
        $writer = new Zend_Config_Writer_Ini($arrayFile);
        try {
            $writer->write();
        } catch (Exception $exception) {
            throw new ZendExt_Exception('SEGINTEGRIDAD06', $exception);
        }
        return true;
    }

    public function actualizarBDAction()
    {
        echo json_encode(array('success' => DatFileModel::actualizarBD()));
    }


    public function exportarBaseDatosMTAction()
    {
        $respuesta = DatBdModel::exportarBaseDatosMT();
        echo json_encode($respuesta);
        return;
    }

    public function exportAction()
    {
        $arraysParameters = $this->getRequest()->getParams();
        $filename = $arraysParameters['filename'];
        $ruta = '/tmp/' . $filename;
        header('Content-Type: application/force-download');
        header('Content-Disposition: attachment; filename=' . $filename);
        header('Content-Transfer-Encoding: binary');
        header('Content-Length: ' . filesize($ruta));
        readfile($ruta);
    }

    public function importarBaseDatosMTAction()
    {
        $nombreTrozo = $this->_getParam('nombreTrozo');
        $nombreOriginal = basename($this->_getParam('nombreOriginal'));
        $accion = $this->_getParam('accion');
        $respuesta = DatBdModel::importarBaseDatosMT1($nombreTrozo, $nombreOriginal, $accion);
        echo json_encode($respuesta);
        return;
    }


}
