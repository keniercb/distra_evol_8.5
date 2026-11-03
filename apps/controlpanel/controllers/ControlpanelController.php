<?php

class ControlpanelController extends ZendExt_Controller_Secure
{

    private $_controlModel;
    private $_controlJson;
    private $_util;

    function init()
    {
        parent::init();
        $this->_controlModel = new ControlPanelModel();
        $this->_controlJson = new ControlPanelJson();
        // $this->_controlModel->cleanCacheComposer();
        $this->_util = new UtilControlPanel();
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
    }

    function controlpanelAction()
    {
        $this->render();
    }

    /**
     * Aqui se carga el xml
     */
    public function cargarxmlRepositorioAction()
    {
        $fileNameJson = dirname(__FILE__) . '/../../../web/controlpanel/configuraciones/repo.json';
        $strDatos = file_get_contents($fileNameJson);
        $datos = json_decode($strDatos, true);
        if ($datos) {
            $repositorios = $datos["repositories"];
            $result = array();
            foreach ($repositorios as $repo) {
                $reposActivos = Array(
                    'DIR' => $repo['url'],
                    'active' => 1,
                    'leaf' => true,
                    'text' => $repo['denominacion'],
                    'idpadre' => 0,
                    'checked' => true
                );
                array_push($result, $reposActivos);
            }
            $inactivos = $datos["inactives"];
            foreach ($inactivos as $repo) {
                $reposInactivos = Array(
                    'DIR' => $repo['url'],
                    'active' => 0,
                    'leaf' => true,
                    'text' => $repo['denominacion'],
                    'idpadre' => 0,
                    'checked' => false
                );
                array_push($result, $reposInactivos);
            }
            echo json_encode($result);
        } else {
            echo json_encode(
                array(
                    'succes' => false,
                    'mensaje' => 'Error al obtener las direcciones
                    de los repositorios.'
                )
            );
        }
        $dir = dirname(dirname($fileNameJson));
        shell_exec("chmod -R 777 " . $dir);
    }

    /**
     * Carga los paquetes del repositorio
     */
    public function cargarxmlAction()
    {
        // $this->_controlModel->cleanCacheComposer();
        $find = $this->_request->founded;
        $state = $this->_request->estado;

        $resp = array();
        $result = shell_exec(
            "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer show -a 2>&1"
        );
        if ($result) {

            $result = trim($result);
            $tmpArrays = explode(chr(10), $result);
            foreach ($tmpArrays as $cadena) {
                $tmp = explode(' ', $cadena);
                $name = $tmp[0];
                $actualizacion = $this->_util->get($name);
                $value = ($actualizacion) ? true : false;
                $resultado = shell_exec(
                    "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo/;"
                    . "COMPOSER_HOME=./.composer "
                    . "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer show $name"
                );

                $resultado = trim($resultado);
                $tmp = explode(chr(10), $resultado);
                $tmp = explode(':', $tmp[3]);
                $versions = trim($tmp[1]);
                $versionInstall = false;
                $post = strpos($versions, '*');
                $tmp = explode(',', $versions);
                $cantidad = count($tmp);

                if ($post !== false) {

                    $versionInstall = substr($versions, $post + 2, $post + 8);

                    if ($cantidad == 1) {
                        $elements = $this->_controlModel->getElementPackage(
                            $name,
                            $versionInstall
                        );
                        $logo = dirname($elements['dist']['url']) . "/logos/" . $elements['logo'];
                        $keys = array(
                            'NAME',
                            'ID',
                            "ESTADO",
                            'DENOMINACION',
                            "VERSIONINSTALADA",
                            'VERSION',
                            'URI',
                            'DEPENDENCIAS',
                            'DESCRIPCION',
                            'NAMEPAQUETE',
                            'LOGO',
                            'NAMEPRODUCT',
                            'AUTOR',
                            'FECHA',
                            'ISUPDATE'
                        );
                        $data = array_combine(
                            $keys,
                            array(
                                $name,
                                $name . "_" . $versionInstall,
                                'Instalado',
                                $elements['description'],
                                $versionInstall,
                                $versionInstall,
                                $elements['dist']['url'],
                                $elements['require'],
                                $elements['description'],
                                $name . "_" . $versionInstall,
                                $logo,
                                $elements['nameProduct'],
                                $elements['autor'],
                                $elements['fecha'],
                                $value
                            )
                        );
                        array_push($resp, $data);
                    }
                }
                $versionMayor = true;
                foreach ($tmp as $version) {
                    $version = trim($version);
                    $post = strpos($version, '*');
                    if ($post !== false) {
                        $version = substr($version, $post + 2, $post + 8);
                    }
                    $elements = $this->_controlModel->getElementPackage(
                        $name,
                        $version
                    );
                    $arrayVisible = $elements['extra']['visible'];
                    $liberado = $arrayVisible['liberado'];
                    $estado = 'No instalado';
                    $mostrar = false;
                    if ((__ENTORNO__ == "Desarrollo" && !$liberado) || $liberado
                    ) {
                        $mostrar = true;
                    }

                    if ($versionInstall && $post === false) {
                        if ($version > $versionInstall && $mostrar) {
                            $estado = 'Desactualizado';
                            $versionMayor = false;
                            $elements = $this->_controlModel->getElementPackage(
                                $name,
                                $version
                            );
                            $logo = dirname($elements['dist']['url']) . "/logos/" . $elements['logo'];
                            $keys = array(
                                'NAME',
                                'ID',
                                "ESTADO",
                                'DENOMINACION',
                                "VERSIONINSTALADA",
                                'VERSION',
                                'URI',
                                'DEPENDENCIAS',
                                'DESCRIPCION',
                                'NAMEPAQUETE',
                                'LOGO',
                                'NAMEPRODUCT',
                                'AUTOR',
                                'FECHA',
                                'ISUPDATE'
                            );
                            $data = array_combine(
                                $keys,
                                array(
                                    $name,
                                    $name . "_" . $version,
                                    $estado,
                                    $elements['description'],
                                    $versionInstall,
                                    $version,
                                    $elements['dist']['url'],
                                    $elements['require'],
                                    $elements['description'],
                                    $name . "_" . $version,
                                    $logo,
                                    $elements['nameProduct'],
                                    $elements['autor'],
                                    $elements['fecha'],
                                    $value
                                )
                            );
                            if ($mostrar) {
                                array_push($resp, $data);
                            }
                        } elseif ($version == $versionInstall) {
                            $estado = 'Instalado';
                            $elements = $this->_controlModel->getElementPackage(
                                $name,
                                $version
                            );
                            $logo = dirname($elements['dist']['url']) . "/logos/" . $elements['logo'];
                            $keys = array(
                                'NAME',
                                'ID',
                                "ESTADO",
                                'DENOMINACION',
                                "VERSIONINSTALADA",
                                'VERSION',
                                'URI',
                                'DEPENDENCIAS',
                                'DESCRIPCION',
                                'NAMEPAQUETE',
                                'LOGO',
                                'NAMEPRODUCT',
                                'AUTOR',
                                'FECHA',
                                'ISUPDATE'
                            );
                            $data = array_combine(
                                $keys,
                                array(
                                    $name,
                                    $name . "_" . $version,
                                    $estado,
                                    $elements['description'],
                                    $versionInstall,
                                    $version,
                                    $elements['dist']['url'],
                                    $elements['require'],
                                    $elements['description'],
                                    $name . "_" . $version,
                                    $logo,
                                    $elements['nameProduct'],
                                    $elements['autor'],
                                    $elements['fecha'],
                                    $value
                                )
                            );
                            if ($mostrar) {
                                array_push($resp, $data);
                            }
                        }
                    } elseif (!$versionInstall && $post === false) {

                        $elements = $this->_controlModel->getElementPackage(
                            $name,
                            $version
                        );
                        $logo = dirname($elements['dist']['url']) . "/logos/" . $elements['logo'];
                        $keys = array(
                            'NAME',
                            'ID',
                            "ESTADO",
                            'DENOMINACION',
                            "VERSIONINSTALADA",
                            'VERSION',
                            'URI',
                            'DEPENDENCIAS',
                            'DESCRIPCION',
                            'NAMEPAQUETE',
                            'LOGO',
                            'NAMEPRODUCT',
                            'AUTOR',
                            'FECHA',
                            'ISUPDATE'
                        );
                        $data = array_combine(
                            $keys,
                            array(
                                $name,
                                $name . "_" . $version,
                                $estado,
                                $elements['description'],
                                '-',
                                $version,
                                $elements['dist']['url'],
                                $elements['require'],
                                $elements['description'],
                                $name . "_" . $version,
                                $logo,
                                $elements['nameProduct'],
                                $elements['autor'],
                                $elements['fecha'],
                                $value
                            )
                        );
                        if ($mostrar) {
                            array_push($resp, $data);
                        }
                    } else {

                        if ($version == $versionInstall && $cantidad > 1 && $versionMayor
                        ) {
                            $estado = 'Instalado';
                            $elements = $this->_controlModel->getElementPackage(
                                $name,
                                $version
                            );
                            $logo = dirname($elements['dist']['url']) . "/logos/" . $elements['logo'];
                            $keys = array(
                                'NAME',
                                'ID',
                                "ESTADO",
                                'DENOMINACION',
                                "VERSIONINSTALADA",
                                'VERSION',
                                'URI',
                                'DEPENDENCIAS',
                                'DESCRIPCION',
                                'NAMEPAQUETE',
                                'LOGO',
                                'NAMEPRODUCT',
                                'AUTOR',
                                'FECHA',
                                'ISUPDATE'
                            );
                            $data = array_combine(
                                $keys,
                                array(
                                    $name,
                                    $name . "_" . $version,
                                    $estado,
                                    $elements['description'],
                                    $version,
                                    $version,
                                    $elements['dist']['url'],
                                    $elements['require'],
                                    $elements['description'],
                                    $name . "_" . $version,
                                    $logo,
                                    $elements['nameProduct'],
                                    $elements['autor'],
                                    $elements['fecha'],
                                    $value
                                )
                            );
                            if ($mostrar) {
                                array_push($resp, $data);
                            }
                        }
                    }
                }
            }
        }
        if ($find) {
            $arraysRespuesta = array();
            $find = strtolower($find);
            foreach ($resp as $package) {
                if (strpos($package['NAME'], $find) !== false) {
                    array_push($arraysRespuesta, $package);
                }
            }
            echo json_encode(
                array(
                    'succes' => true,
                    'datos' => $arraysRespuesta,
                    'cantidad_filas' => count($arraysRespuesta)
                )
            );

            return;
        }
        if ($state) {

            $arraysRespuesta = array();
            $estado = strtolower($state);

            foreach ($resp as $package) {
                if (strpos($package['ESTADO'], $state) !== false) {
                    array_push($arraysRespuesta, $package);
                }
            }
            echo json_encode(
                array(
                    'succes' => true,
                    'datos' => $arraysRespuesta,
                    'cantidad_filas' => count($arraysRespuesta)
                )
            );

            return;
        }

        echo json_encode(
            array(
                'succes' => true,
                'datos' => $resp,
                'cantidad_filas' => count($resp)
            )
        );
    }

    /**
     * Modificar fichero de configuracion del repositorio
     */
    public function configurarAction()
    {
        $band = true;
        $dir = $this->_request->direccion;
        $denominacion = $this->_request->denominacion;
        $mensaje = 'No existe un repositorio con esta direcci&oacute;n.';
        $flag = false;
        $dir = ($dir[strlen($dir) - 1] == '/') ? $dir : $dir . '/';
        if ($this->_controlModel->urlEsValida($dir) == 1) {
            $flag = true;
        }
        if ($flag == true) {
            $fileNameJson = dirname(__FILE__) . '/../../../web/controlpanel/configuraciones/repo.json';
            $strDatos = file_get_contents($fileNameJson);
            $datos = json_decode($strDatos, true);
            // $repo = $this->_controlModel->readXML($dirlocal);
            $repositoriosInactives = $datos["inactives"];
            $repositoriosActives = $datos["repositories"];
            foreach ($repositoriosInactives as $repository) {
                if ($repository['url'] == $dir || $denominacion == $repository['denominacion']
                ) {
                    $band = false;
                    $mensaje = 'El repositorio que quiere adicionar ya existe.';
                }
            }
            foreach ($repositoriosActives as $repository) {
                if ($repository['url'] == $dir || $denominacion == $repository['denominacion']
                ) {
                    $band = false;
                    $mensaje = 'El repositorio que quiere adicionar ya existe.';
                }
            }
            if ($band == true) {
                $repoJson = array(
                    'type' => 'composer',
                    'url' => $dir,
                    'denominacion' => $denominacion
                );
                try {
                    $this->_controlJson->adicionarRepositorioInactivosArchivoJson(
                        $repoJson
                    );
                    $mensaje = 'El repositorio ha sido adicionado satisfactoriamente.';
                    echo json_encode(
                        array('succes' => $band, 'datos' => $mensaje)
                    );
                } catch (Exception $e) {
                    echo json_encode(
                        array('succes' => $band, 'datos' => $e->getMessage())
                    );
                }
            } else {
                echo json_encode(array('succes' => $band, 'datos' => $mensaje));
            }
        } else {
            echo json_encode(array('succes' => $flag, 'datos' => $mensaje));
        }
    }

    /**
     * funcion para instalar un paquete
     */
    public function copiararchivoAction()
    {

        $name = $this->_request->name;
        $version = $this->_request->version;
        $isconect = $this->_request->baseDatos;
        $flagSchemas = $this->_request->flagSchemas;

        $option = ($this->_request->opcion == 'true') ? true : false;
        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json"
        );
        $temp = json_decode($originalContent, true);
        if (isset($temp['require'])) {
            $temp['require'][$name] = "$version";
        } else {
            $temp['require'] = array();
            $temp['require'][$name] = "$version";
        }
        file_put_contents(
            dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json",
            json_encode($temp)
        );
        unlink(
            dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.lock"
        );
        $result = shell_exec(
            "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
            "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install 2>&1"
        );
        if ($isconect == 'false') {

            $dirCerts = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos($_SERVER['DOCUMENT_ROOT'], 'web')) . 'config' .
                               DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR . 'auth' . DIRECTORY_SEPARATOR;

            $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
            $password = $rsa->decrypt($this->_request->password);

            $datosConection = array(
                'host' => $this->_request->servidor,
                'dbname' => $this->_request->bd,
                'puerto' => $this->_request->puerto,
                'user' => $this->_request->usuario,
                'pass' => $password,
            );

        }
        $var = strpos($result, 'UnexpectedValueException');
        if ($var !== false) {
            $result = explode('[UnexpectedValueException]', $result);
            $resultado = explode(chr(10), $result[1]);
            file_put_contents(
                dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json",
                $originalContent
            );
            unlink(
                dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.lock"
            );
            shell_exec(
                "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
                "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
            );
            $this->revertirCambios();
            echo json_encode(
                array('succes' => false, 'datos' => $resultado[1])
            );

            return;
        }
        $error = false;
        $install = explode("<--", $result);
        $resp = array();
        for ($index = 1; $index < count($install); $index++) {
            $tmp = explode('-->', $install[$index]);
            array_push($resp, $tmp[0]);
        }
        foreach ($resp as $paqueteVaule) {
            try {

                $respuestas = $this->_controlModel->instalarPaquete(
                    $paqueteVaule,
                    ($flagSchemas == 'false') ? 'true' : $isconect,
                    $datosConection,
                    $option,
                    'install',
                    null,
                    null,
                    $flagSchemas
                );
            } catch (Exception $e) {
                $error = true;
                file_put_contents(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json",
                    $originalContent
                );
                unlink(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.lock"
                );
                $result = shell_exec(
                    "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
                    "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
                );
                $this->revertirCambios();

                if($e->getCode()){
                    $results = array('succes' => false, 'cod' => $e->getCode(), 'datos' => $e->getMessage());
                }else{
                    $results = array('succes' => false, 'datos' => 'La conexi&oacute;n a la base de datos no ha sido establecida.');
                }
                echo json_encode($results);
                return;
            }
        }
        if (!$error) {
            if ($respuestas) {
                $this->limpiarCambios();
                echo json_encode(
                    array(
                        'succes' => true,
                        'datos' => 'La aplicaci&oacute;n ha sido instalada
                        satisfactoriamente.'
                    )
                );
            } else {
                $this->revertirCambios();
                file_put_contents(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json",
                    $originalContent
                );
                unlink(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.lock"
                );
                $result = shell_exec(
                    "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
                    "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
                );
                echo json_encode(
                    array(
                        'succes' => false,
                        'datos' => 'No se pudo instalar la aplicaci&oacute;n.'
                    )
                );
            }
        }
    }

    /**
     * function comprobar si alguna app instala esta utilizando
     * la app a desinstalar
     */
    public function comprobarUtlizacionAction()
    {
        $metodo = $this->_request->metodo;
        $appname = $this->_request->nameapp;
        $appversion = $this->_request->appversion;
        $idPaquete = $appname . '_' . $appversion;
        $datos = "";//$appname . '(' . $appversion . ')';
        $conexion = false;
        $arrays['bd'] = Zend_Registry::getInstance()->config->bd->session->bd;
        $arrays['host'] = Zend_Registry::getInstance()->config->bd->session->host;
        $arrays['port'] = Zend_Registry::getInstance()->config->bd->session->port;
        if ($metodo == 'instalar') {
            try {
                $listadoPaquetesInstalado = $this->_controlModel->listadoPaquetesInstalar($idPaquete);
                if ($listadoPaquetesInstalado[0] != false) {
                    $cambios = $this->_controlModel->getCambios(
                        $idPaquete,
                        'install'
                    );
                    $cadena = $cambios[1];
                    $cadena = preg_replace("/^<br \/>*/", '', $cadena);
                    $cambios[1] = $cadena;
                    if ($cambios[1]) {
                        $resp = $this->_controlModel->dividirAcciones(
                            $cadena,
                            'install'
                        );
                        $resp['instalar'] =
                            (strpos($resp['instalar'][0], "Sin cambios") === false) ? $resp['instalar'] : false;
                        $resp['desinstalar'] =
                            (strpos($resp['desinstalar'][0], "Sin cambios") === false) ? $resp['desinstalar'] : false;
                        $resp['actualizar'] =
                            (strpos($resp['actualizar'][0], "Sin cambios") === false) ? $resp['actualizar'] : false;
                        if ($cambios[0]) {
                            echo json_encode(
                                array(
                                    'succes' => true,
                                    'instalar' => $resp['instalar'],
                                    'desinstalar' => $resp['desinstalar'],
                                    'actualizar' => $resp['actualizar'],
                                    'conexion' => true,
                                    'connection_date' => $arrays
                                )
                            );
                        } else {
                            echo json_encode(
                                array(
                                    'succes' => true,
                                    'instalar' => $resp['instalar'],
                                    'desinstalar' => $resp['desinstalar'],
                                    'actualizar' => $resp['actualizar'],
                                    'conexion' => false
                                )
                            );
                        }
                    } else {
                        echo json_encode(
                            array(
                                'succes' => false,
                                'datos' => 'No se pudo instalar la aplicación.'
                            )
                        );
                    }
                } else {
                    echo json_encode(
                        array(
                            'succes' => false,
                            'datos' => $listadoPaquetesInstalado[2],
                            'version' => $listadoPaquetesInstalado[1]
                        )
                    );
                }
            } catch (Exception $e) {
            }
        } elseif ($metodo == 'desintalar') {
            $resp = array('desinstalar' => array());
            $tmp = explode('_', $idPaquete);
            $name = $tmp[0];
            $version = $tmp[1];
            $result = shell_exec(
                "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo;COMPOSER_HOME=./.composer php "
                . "../../../apps/controlpanel/comun/recursos/composer/bin/composer depends $name 2>&1"
            );
            if (strpos(
                $result,
                "here is no installed package depending on \"$name\"."
            )) {
                $estado = $this->_controlModel->haveConection($name, $version);
                $listadoPaquetesDesintalar = $this->_controlModel->paquetesDesintalar($idPaquete);

                for ($i = 1; $i < count($listadoPaquetesDesintalar); $i++) {

                    if (!$estado) {
                        $auxTmp = explode(" ", $listadoPaquetesDesintalar[$i]);
                        $axuname = trim($auxTmp[0]);
                        $axuVersion = trim(
                            str_replace(
                                ')',
                                "",
                                str_replace('(', "", $auxTmp[1])
                            )
                        );

                        $estado = $this->_controlModel->haveConection(
                            $axuname,
                            $axuVersion
                        );
                    }

                    $v1 = explode(' ',$listadoPaquetesDesintalar[$i]);
                    $name1 = $v1[0];

                    $v1 = str_replace('(', '',$v1[1]);
                    $v1 = str_replace(')', '',$v1);

                    $pcero = ($v1{0} == '7') ? '-alfa' : (($v1{0} == '8') ? '-beta' : '-rc');
                    $v1 = substr($v1,1) . $pcero;

                    array_push(
                        $resp['desinstalar'],
                        '-' . $name1 .' ('. $v1 . ')<br />'
                    );
                }

                $pcero = ($version{0} == '7') ? '-alfa' : (($version{0} == '8') ? '-beta' : '-rc');
                $version = substr($version,1) . $pcero;

                array_push(
                    $resp['desinstalar'],
                    '-' . trim($name) . ' (' . trim($version) . ')<br />'
                );
                echo json_encode(
                    array(
                        'succes' => true,
                        'datos' => $resp['desinstalar'],
                        "conexion" => $estado
                    )
                );
            } else {
                $resp['desinstalar'] = str_replace(
                    'requires',
                    'requiere',
                    $result
                );
                echo json_encode(
                    array('succes' => false, 'datos' => $resp['desinstalar'])
                );
            }
        } elseif ($metodo == 'actualizar') {

            $cambios = $this->_controlModel->getCambios($idPaquete);
            //var_dump($cambios); die;
            $cadena = $cambios[1];
            $cadena = preg_replace("/^<br \/>*/", '', $cadena);
            $cambios[1] = $cadena;
            if ($cambios[1]) {
                $resp = $this->_controlModel->dividirAcciones($cadena);
                $resp['instalar'] =
                    (strpos($resp['instalar'][0], "Sin cambios") === false) ? $resp['instalar'] : false;
                $resp['desinstalar'] =
                    (strpos($resp['desinstalar'][0], "Sin cambios") === false) ? $resp['desinstalar'] : false;
                $resp['actualizar'] =
                    (strpos($resp['actualizar'][0], "Sin cambios") === false) ? $resp['actualizar'] : false;
                if ($cambios[0]) {
                    echo json_encode(
                        array(
                            'succes' => true,
                            'instalar' => $resp['instalar'],
                            'desinstalar' => $resp['desinstalar'],
                            'actualizar' => $resp['actualizar'],
                            'conexion' => true,
                            'connection_date' => $arrays
                        )
                    );
                } else {
                    echo json_encode(
                        array(
                            'succes' => true,
                            'instalar' => $resp['instalar'],
                            'desinstalar' => $resp['desinstalar'],
                            'actualizar' => $resp['actualizar'],
                            'conexion' => false
                        )
                    );
                }
            } else {
                echo json_encode(
                    array(
                        'succes' => false,
                        'datos' => 'No se pudo actualizar la aplicación.'
                    )
                );
            }
        } elseif ($metodo == 'revertir') {
            $version = $this->_util->get($appname);

            if ($version) {
                $idPaquete = $appname . '_' . $version;
                $cambios = $this->_controlModel->getCambios(
                    $idPaquete,
                    'install'
                );
                $cadena = $cambios[1];
                $cadena = preg_replace("/^<br \/>*/", '', $cadena);
                $cambios[1] = $cadena;
                if ($cambios[1]) {
                    $resp = $this->_controlModel->dividirAcciones2($cadena);
                    $resp['instalar'] =
                        (strpos($resp['instalar'][0], "Sin cambios") === false) ? $resp['instalar'] : false;
                    $resp['desinstalar'] =
                        (strpos($resp['desinstalar'][0], "Sin cambios") === false) ? $resp['desinstalar'] : false;
                    $resp['actualizar'] =
                        (strpos($resp['actualizar'][0], "Sin cambios") === false) ? $resp['actualizar'] : false;
                    if (!$resp['instalar'] && !$resp['desinstalar'] && !$resp['actualizar']
                    ) {
                        echo json_encode(
                            array(
                                'succes' => false,
                                'datos' => 'La operación no se puede realizar.' .
                                    'Existen dependencias que no pueden ser resueltas.'
                            )
                        );
                    } else {
                        if ($cambios[0]) {
                            echo json_encode(
                                array(
                                    'succes' => true,
                                    'instalar' => $resp['instalar'],
                                    'desinstalar' => $resp['desinstalar'],
                                    'actualizar' => $resp['actualizar'],
                                    'conexion' => true,
                                    'connection_date' => $arrays
                                )
                            );
                        } else {
                            echo json_encode(
                                array(
                                    'succes' => true,
                                    'instalar' => $resp['instalar'],
                                    'desinstalar' => $resp['desinstalar'],
                                    'actualizar' => $resp['actualizar'],
                                    'conexion' => false
                                )
                            );
                        }
                    }
                } else {
                    echo json_encode(
                        array(
                            'succes' => false,
                            'datos' => 'No se pudo actualizar la aplicación.'
                        )
                    );
                }
            } else {
                echo json_encode(
                    array(
                        'succes' => false,
                        'datos' => 'No se pudo actualizar la aplicación.'
                    )
                );
            }
        }
    }


    /**
     * desinstalarappAction - Función usada para desintalar una aplicación.
     */
    public function desinstalarappAction()
    {
        $paquetes = json_decode($this->_request->paquetes);
        $deleDatos = $this->_request->deleteDatos;
        //$paquetes = str_replace('<br />', '', $appname);

        //$appname = str_replace('-', '', $appname);
        //$appname = substr($appname,1);
        //$paquetes = explode(",", $appname);
        $bool = false;
        $arraysName = array();

        foreach ($paquetes as $value) {
            if ($value != "") {
                $value = str_replace('<br />', '', $value);
                //$value = str_replace('-', '', $value{0});
                $value = str_replace(' ', '', $value);
                $idPaquete = explode('(', $value);
                $idPaquete = str_replace('-','', $idPaquete[0]);

                array_push($arraysName, $idPaquete);
                $bool = $this->_controlModel->desintalarPaquete(
                    $value,
                    $deleDatos
                );
            }
        }

        if (!$bool) {
            $this->revertirCambios();
            echo json_encode(array('succes' => false));
        } else {
            foreach ($arraysName as $namepackage) {
                $this->_util->clearStack($namepackage);
            }
            $this->limpiarCambios();
            $idPaquete = explode('(', $paquetes[count($paquetes) - 1]);
            $name = trim($idPaquete[0]);
            $name = str_replace('-', '',$name);
            $idPaquete = explode(')', $idPaquete[1]);

            $split = explode('-',$idPaquete[0]);
            $pcero = ($split[1] == 'alfa') ? '7' : (($split[1] == 'beta') ? '8' : '9');
            $version = $pcero . $split[0];

            $originalContent = file_get_contents(
                dirname(__FILE__) . '/../../../web/controlpanel/repo/composer.json'
            );

            $temp = json_decode($originalContent, true);

            if (isset($temp['require'][$name]) && $temp['require'][$name] == "$version"
            ) {
                unset($temp['require'][$name]);
                if (count($temp['require']) == 0) {
                    unset($temp['require']);
                }
                if (file_exists(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.lock"
                )) {
                    unlink(
                        dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.lock"
                    );
                }
                file_put_contents(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json",
                    json_encode($temp)
                );
                $result = shell_exec(
                    "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
                    "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
                );
            }
            echo json_encode(array('succes' => $bool));
        }
    }

    public function limpiarCambios()
    {
        $originalContent = file_get_contents(
            dirname(__FILE__) . '/../../../web/controlpanel/repo/trash/jobs.json'
        );
        $jobs = json_decode($originalContent, true);
        foreach ($jobs['files'] as $key => $job) {
            unset($jobs['files'][$key]);
        }
        file_put_contents(
            dirname(__FILE__) . '/../../../web/controlpanel/repo/trash/jobs.json',
            json_encode($jobs)
        );
        $items = array_diff(
            scandir(
                dirname(__FILE__) . '/../../../web/controlpanel/repo/trash/'
            ),
            array('.', '..', 'jobs.json')
        );
        foreach ($items as $key => $value) {
            if ($value !== 'descarga') {
                shell_exec(
                    'rm -R ' . dirname(__FILE__) . '/../../../web/controlpanel/repo/trash/' . $value
                );
            }
        }
        if (file_exists(
            dirname(__FILE__) . '/../../../web/controlpanel/repo/trash/descarga/'
        )) {
            shell_exec(
                'rm -R ' . dirname(__FILE__) . '/../../../web/controlpanel/repo/trash/descarga/*'
            );
        }

        return true;
    }

    public function revertirCambios()
    {
        $originalContent = file_get_contents(
            dirname(__FILE__) . '/../../../web/controlpanel/repo/trash/jobs.json'
        );
        $jobs = json_decode($originalContent, true);
        foreach ($jobs['files'] as $key => $job) {
            shell_exec($job);
            unset($jobs['files'][$key]);
        }
        if (file_exists(
            dirname(__FILE__) . '/../../../web/controlpanel/repo/trash/descarga/'
        )) {
            shell_exec(
                'rm -R ' . dirname(__FILE__) . '/../../../web/controlpanel/repo/trash/descarga/*'
            );
        }
        file_put_contents(
            dirname(__FILE__) . '/../../../web/controlpanel/repo/trash/jobs.json',
            json_encode($jobs)
        );
    }

    /**
     * actualizarAction - Función usada para actualizar una
     * aplicacion ya instalada
     * y exista alguna versión superior en el repositorio.
     */
    public function actualizarAction()
    {
        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json"
        );

        $appname = $this->_request->nameapp;
        $version = $this->_request->version;
        $isconect = $this->_request->baseDatos;
        $option = ($this->_request->opcion == 'true') ? true : false;
        if ($isconect != 'false') {
            $datosConection = array(
                'host' => $this->_request->servidor,
                'dbname' => $this->_request->bd,
                'puerto' => $this->_request->puerto,
                'user' => $this->_request->usuario,
                'pass' => $this->_request->password,
            );
            try {
                $acciones = $this->_controlModel->getCambios(
                    $appname . '_' . $version
                );
                $this->_controlModel->procesarAcciones(
                    $acciones[1],
                    $datosConection,
                    $option
                );
                $message = 'La aplicación ha sido actualizada satisfactoriamente.';
                $this->limpiarCambios();
                echo json_encode(array('succes' => true, 'datos' => $message));
            } catch (Exception $e) {
                file_put_contents(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json",
                    $originalContent
                );
                unlink(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.lock"
                );
                $result = shell_exec(
                    "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
                    "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
                );
                $this->revertirCambios();
                echo json_encode(
                    array('succes' => false, 'datos' => $e->getMessage())
                );
            }
        } else {

            try {
                $acciones = $this->_controlModel->getCambios(
                    $appname . '_' . $version
                );
                $this->_controlModel->procesarAcciones($acciones[1]);
                $message = 'La aplicación ha sido actualizada satisfactoriamente.';
                $this->limpiarCambios();
                echo json_encode(array('succes' => true, 'datos' => $message));
            } catch (Exception $e) {
                file_put_contents(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json",
                    $originalContent
                );
                unlink(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.lock"
                );
                $result = shell_exec(
                    "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
                    "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
                );
                $this->revertirCambios();
                echo json_encode(
                    array('succes' => false, 'datos' => $e->getMessage())
                );
            }
        }
    }

    /**
     * reInstalarAction - Función usada para reinstalar un paquete.
     */
    public function reInstalarAction()
    {
        $appname = $this->_request->nameapp;
        $version = $this->_request->version;
        $option = ($this->_request->opcion == 'true') ? true : false;
        $idPaquete = $appname . '_' . $version;
        $resukt = $this->_controlModel->reinstalarPaquete(
            $appname,
            $version,
            $option
        );
        if ($resukt) {
            $this->limpiarCambios();
            $message = 'El paquete ha sido reinstalado satisfactoriamente.';
        } else {
            $this->revertirCambios();
            $message = 'Ocurrio un error al reinstalar el paquete.';
        }
        echo json_encode(array('succes' => $resukt, 'datos' => $message));
    }


    public function eliminarRepositorioAction()
    {
        $i = -1;
        $urlRepo = $this->_request->getPost('url');
        $reposDirec = dirname(__FILE__) . '/../../../web/controlpanel/configuraciones/repo.json';
        $strRepo = file_get_contents($reposDirec);
        $datos = json_decode($strRepo, true);
        $active = $this->_request->getPost('active');
        $isAtive = ($active == '1' || $active == "true") ? true : false;
        $key = ($isAtive) ? 'repositories' : 'inactives';
        foreach ($datos[$key] as $repos) {
            $i++;
            if ($repos['url'] == $urlRepo) {
                $pos = $i;
                break;
            }
        }
        $this->_controlJson->eliminarRepositorio($datos, $pos, $isAtive);
        echo json_encode(
            array(
                'succes' => true,
                'datos' => 'El repositorio ha sido eliminado satisfactoriamente.'
            )
        );
    }

    public function activarRepoAction()
    {
        $arreglo = $this->_request->founded;
        $datas = json_decode(stripslashes($arreglo), true);
        $jsonClave = dirname(__FILE__) . '/../comun/recursos/json/claves_publicas.json';
        $util = new UtilControlPanel();
        $arraysTmp = json_decode(file_get_contents($jsonClave), true);
        foreach ($datas as $repo) {
            if ($repo['active']) {
                $arraysTmp = $util->copyClavePublica(
                    $repo['DIR'] . 'clave_publica',
                    $repo['text'],
                    $arraysTmp
                );
            } else {
                $arraysTmp = $util->deleteClavePublica(
                    $repo['text'],
                    $arraysTmp
                );
            }
        }
        file_put_contents($jsonClave, json_encode($arraysTmp));
        $this->_controlJson->modificarActiveRepo($datas);
        echo json_encode(array('success' => true));
    }

    public function revertAction()
    {
        $originalContent = file_get_contents(
            dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json"
        );
        $appname = $this->_request->nameapp;
        //$option = $this->_request->opcion;
        //$version = $this->_request->version;
        // $acciones = $this->_request->datos_id;
        $isconect = $this->_request->baseDatos;
        $version = $this->_util->get($appname);
        $idPaquete = $appname . '_' . $version;
        if ($isconect != 'false') {
            $datosConection = array(
                'host' => $this->_request->servidor,
                'dbname' => $this->_request->bd,
                'puerto' => $this->_request->puerto,
                'user' => $this->_request->usuario,
                'pass' => $this->_request->password,
            );
            try {
                $acciones = $this->_controlModel->getCambios(
                    $idPaquete,
                    'install'
                );
                $this->_controlModel->procesarAcciones(
                    $acciones[1],
                    $datosConection
                );
                $this->_util->pop($appname);
                $message = 'La aplicación ha sido actualizada satisfactoriamente.';
                $this->limpiarCambios();
                echo json_encode(array('succes' => true, 'datos' => $message));
            } catch (Exception $e) {
                file_put_contents(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json",
                    $originalContent
                );
                unlink(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.lock"
                );
                $result = shell_exec(
                    "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
                    "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
                );
                $this->revertirCambios();
                echo json_encode(
                    array('succes' => false, 'datos' => $e->getMessage())
                );
            }
        } else {
            try {
                $acciones = $this->_controlModel->getCambios(
                    $idPaquete,
                    'install'
                );
                $this->_controlModel->procesarAcciones($acciones[1]);
                $message = 'La aplicación ha sido actualizada satisfactoriamente.';
                $this->limpiarCambios();
                $this->_util->pop($appname);
                echo json_encode(array('succes' => true, 'datos' => $message));
            } catch (Exception $e) {
                file_put_contents(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.json",
                    $originalContent
                );
                unlink(
                    dirname(__FILE__) . "/../../../web/controlpanel/repo/composer.lock"
                );
                $result = shell_exec(
                    "cd " . dirname(__FILE__) . "/../../../web/controlpanel/repo/;" . "COMPOSER_HOME=./.composer " .
                    "php ../../../apps/controlpanel/comun/recursos/composer/bin/composer install"
                );
                $this->revertirCambios();
                echo json_encode(
                    array('succes' => false, 'datos' => $e->getMessage())
                );
            }
        }
    }

    public function ModifyRepositoriesAction()
    {
        $oldUrl = $this->_request->oldDireccion;
        $oldDenominacion = $this->_request->oldDenominacion;
        $newUrl = $this->_request->direccion;
        $newDenominacion = $this->_request->denominacion;
        $isActive = $this->_request->active;
        $fileNameJson = dirname(__FILE__) . '/../../../web/controlpanel/configuraciones/repo.json';
        $arraysRepo = json_decode(file_get_contents($fileNameJson), true);
        if ($this->_controlModel->urlEsValida($newUrl) == 0) {
            echo json_encode(
                array(
                    "succes" => false,
                    "datos" => "No existe un repositorio con esta direcci&oacute;n."
                )
            );

            return;
        }
        if ($isActive == 'true' || $isActive === true) {
            foreach ($arraysRepo['repositories'] as $key => $active) {
                if ($active['denominacion'] == $oldDenominacion && $active['url'] == $oldUrl
                ) {
                    $arraysRepo['repositories'][$key]['denominacion'] = $newDenominacion;
                    $arraysRepo['repositories'][$key]['url'] = $newUrl;
                    if (file_put_contents(
                        $fileNameJson,
                        json_encode($arraysRepo)
                    )) {
                        $dirclavejson = dirname(__FILE__) . '/../comun/recursos/json/claves_publicas.json';
                        $arraysClave = json_decode(
                            file_get_contents($dirclavejson),
                            true
                        );
                        $newArr = $arraysClave[$oldDenominacion];
                        unset($arraysClave[$oldDenominacion]);
                        $arraysClave[$newDenominacion] = $newArr;
                        file_put_contents(
                            $dirclavejson,
                            json_encode($arraysClave)
                        );
                        echo json_encode(
                            array(
                                "succes" => true,
                                "datos" => "El repositorio ha sido modificado satisfactoriamente."
                            )
                        );
                    } else {
                        echo json_encode(
                            array(
                                "succes" => false,
                                "datos" => "No se puede escribir en el fichero."
                            )
                        );
                    }

                    return;
                } elseif ($active['denominacion'] == $newDenominacion || $active['url'] == $newUrl
                ) {
                    echo json_encode(
                        array(
                            "succes" => false,
                            "datos" => "El repositorio ya existe."
                        )
                    );

                    return;
                }
            }
        } else {
            foreach ($arraysRepo['inactives'] as $key => $inactives) {
                if ($inactives['denominacion'] == $oldDenominacion && $inactives['url'] == $oldUrl
                ) {
                    $arraysRepo['inactives'][$key]['denominacion'] = $newDenominacion;
                    $arraysRepo['inactives'][$key]['url'] = $newUrl;
                    if (file_put_contents(
                        $fileNameJson,
                        json_encode($arraysRepo)
                    )) {
                        echo json_encode(
                            array(
                                "succes" => true,
                                "datos" => "El repositorio ha sido modificado satisfactoriamente."
                            )
                        );
                    } else {
                        echo json_encode(
                            array(
                                "succes" => false,
                                "datos" => "No se puede escribir en el fichero."
                            )
                        );
                    }

                    return;
                } elseif ($inactives['denominacion'] == $newDenominacion || $inactives['url'] == $newUrl
                ) {
                    echo json_encode(
                        array(
                            "succes" => false,
                            "datos" => "El repositorio ya existe."
                        )
                    );

                    return;
                }
            }
        }
    }
}
