<?php

/*
 * Este fichero es parte del paquete del portal.
 *
 * Autor: Liván Alejandro Capote Valdés.
 * <lacapote@xetid.cu>
 */

class AparienciaController extends ZendExt_Controller_Secure
{

    public function init()
    {
        $this->model = new AparienciaModel();
        parent::init();
    }

    function aparienciaAction()
    {
        $this->render();
    }

    /**
     * @name    obtenerFuncionalidadesAction
     * @author    Liván A Capote Valdés
     * @access    public
     *
     * @param
     *
     * @return
     * @uses      Método para listar las funcionalidades
     */
    function obtenerFuncionalidadesAction()
    {
        $session = Zend_Registry::get('session');
        $certificate = $session->certificado;
        $idestructura = $this->global->Estructura->idestructura;
        $perfil = $this->getPerfil();
        $systemsArray = $this->integrator->seguridad->getFunctionalitiesUser(
            $certificate,
            $perfil->idusuario,
            $idestructura
        );
        $perfil = $this->getPerfil();
        $objApariencia = DatApariencia::devolverAparienciaUsuario(
            $perfil->idusuario
        );
        if (count($systemsArray)) {
            $valores = array();
            $accesosDirectos = json_decode($objApariencia->accesosdirectos);
            $iniciosRapidos = json_decode($objApariencia->iniciosrapidos);
            $iniciosAutomaticos = json_decode(
                $objApariencia->iniciosautomaticos
            );
            //echo 'accesos: ',print_r($accesosDirectos);die;
            for ($i = 0; $i < count($systemsArray); $i++) {
                if ($this->_request->getPost('criterio_busqueda')) {
                    $mystring = $systemsArray[$i]['text'];
                    $findme = $this->_request->getPost('criterio_busqueda');
                    $pos = strpos($mystring, $findme);
                    $convertido = ucfirst($findme);
                    $convertidoOne = strtoupper($findme);
                    $posOne = strpos($mystring, $convertido);
                    $posDos = strpos($mystring, $convertidoOne);
                    if ($pos !== false || $posOne !== false || $posDos !== false
                    ) {
                        $tmp['idfuncionalidad'] = $systemsArray[$i]['idfuncionalidad'];
                        $tmp['referencia'] = $systemsArray[$i]['referencia'];
                        $tmp['descripcion'] = $systemsArray[$i]['descripcion'];
                        $tmp['icono'] = $systemsArray[$i]['icono'];
                        $tmp['id'] = $systemsArray[$i]['id'];
                        $tmp['text'] = $systemsArray[$i]['text'];
                        $tmp['idsistema'] = $systemsArray[$i]['idsistema'];
                        switch ($this->_request->getParam('bandera')) {
                            case 'accesos':
                                $tmp['checked'] = self::buscarArreglo(
                                    $accesosDirectos,
                                    $systemsArray[$i]['idfuncionalidad']
                                );
                                break;
                            case 'inicios':
                                $tmp['checked'] = self::buscarArreglo(
                                    $iniciosRapidos,
                                    $systemsArray[$i]['idfuncionalidad']
                                );
                                break;
                            case 'automatico':
                                $tmp['checked'] = self::buscarArreglo(
                                    $iniciosAutomaticos,
                                    $systemsArray[$i]['idfuncionalidad']
                                );
                                break;
                        }
                        $tmp['leaf'] = true;
                        $valores[] = $tmp;
                    }
                } else {
                    /*  echo 'id',print_r($systemsArray[$i]);
                      echo 'accesosDirectos',print_r($accesosDirectos);die;*/
                    $tmp['idfuncionalidad'] = $systemsArray[$i]['idfuncionalidad'];
                    $tmp['referencia'] = $systemsArray[$i]['referencia'];
                    $tmp['descripcion'] = $systemsArray[$i]['descripcion'];
                    $tmp['icono'] = $systemsArray[$i]['icono'];
                    $tmp['id'] = $systemsArray[$i]['id'];
                    $tmp['text'] = $systemsArray[$i]['text'];
                    $tmp['idsistema'] = $systemsArray[$i]['idsistema'];
                    switch ($this->_request->getParam('bandera')) {
                        case 'accesos':
                            $tmp['checked'] = self::buscarArreglo(
                                $accesosDirectos,
                                $systemsArray[$i]['idfuncionalidad']
                            );
                            break;
                        case 'inicios':
                            $tmp['checked'] = self::buscarArreglo(
                                $iniciosRapidos,
                                $systemsArray[$i]['idfuncionalidad']
                            );
                            break;
                        case 'automatico':
                            $tmp['checked'] = self::buscarArreglo(
                                $iniciosAutomaticos,
                                $systemsArray[$i]['idfuncionalidad']
                            );
                            break;
                    }
                    $tmp['leaf'] = true;
                    $valores[] = $tmp;
                }
            }
            echo json_encode($valores);
        } else {
            echo json_encode(array());
        }
    }

    private function buscarArreglo($array, $valor)
    {
        foreach ($array as $value) {
            if ($value->id == $valor) {
                return true;
            }
        }

        return false;
    }

    /**
     * @name    listadeImagenesAction
     * @author    Liván A Capote Valdés
     * @access    public
     *
     * @param
     *
     * @return
     * @uses      Método para listar las imágenes
     */
    function listadeImagenesAction()
    {
        $dir = explode('apps', dirname(__FILE__));
        $directorio = $this->_request->get('directorio');
        $temp = $dir[0] . "web/portal/views/js/portal/apariencia/imagen/wallpapers/";
        $list = $this->model->listadeImagenes($temp);
        echo json_encode(array("images" => $list));
    }

    function listadeIconosAction()
    {
        $dir = explode('apps', dirname(__FILE__));
        $temp = $dir[0] . "web/portal/views/js/portal/apariencia/imagen/Icons/";
        $list = $this->model->listadeIconos($temp);
        echo json_encode(array("images" => $list));
    }

    function listadeIconosMenuAction()
    {
        $dirIndex = $_SERVER['SCRIPT_FILENAME'];
        $webPath = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'web';

        $iconFonts = file_get_contents( $webPath . "/lib/ExtJS/temas/fonts-icons.json");
        $iconFonts = json_decode($iconFonts, true);
        $iconFonts = $iconFonts['icons'];

        foreach ($iconFonts as $icon){
            $result[] = array('icon'=>$icon['properties']['name']);
        }
        echo json_encode(array('icons' => $result));
//        $dir = explode('apps', dirname(__FILE__));
//        $temp = $dir[0] . "web/lib/ExtJS/temas/default/images/iconos/";
//        $list = $this->model->listadeIconosMenu($temp);
//        echo json_encode(array("images" => $list));
    }

    function eliminarConfiguracion($idusuario)
    {
        $objApariancia = DatApariencia::devolverAparienciaUsuario($idusuario);
        $objApariancia->delete();
    }

    /**
     * @name    subirImagenAction
     * @author    Liván A Capote Valdés
     * @access    public
     *
     * @param
     *
     * @return
     * @uses      Método para subir una imagen al servidor
     */
    function subirImagenAction()
    {
        if (!isset($_FILES["image"])) {
            echo json_encode(
                array(
                    'cod' => 6,
                    'mensaje' => "El archivo seleccionado no es v&aacutelido.",
                    'success' => 'false'
                )
            );
            var_dump('entro aqui');

            return;
        } else {
            $validarchivo = $_FILES["image"]['type'];
            $buscar = 'image';
            $resultado = strpos($validarchivo, $buscar);
            $size = getimagesize($_FILES['image']['tmp_name']);
            if ($resultado === false) {
                echo json_encode(
                    array(
                        'cod' => 6,
                        'mensaje' => "El archivo seleccionado no es v&aacutelido.",
                        'success' => 'false'
                    )
                );

                return;
            }
            $config = $this->_request->getPost('config');
            if ($config == 'rapido' || $config == 'menu') {
                if ($size[0] > 150 || $size[1] > 150) {
                    echo json_encode(
                        array(
                            'cod' => 6,
                            'mensaje' => "La imagen seleccionada no tiene las " . "dimensiones establecidas .",
                            'success' => 'false'
                        )
                    );

                    return;
                }
            }
            $archivo = $_FILES["image"]['name'];
            $dir = explode('apps', dirname(__FILE__));
            $dire = $this->_request->getPost('directorio');
            $rutaDestino = $dir[0] . $dire;
            $destino = $archivo;
            if (is_file($rutaDestino . '/' . $destino)) {
                echo json_encode(
                    array(
                        'cod' => 3,
                        'mensaje' => "La imagen que desea subir ya existe.",
                        'success' => 'false'
                    )
                );

                return;
            } else {
                if (move_uploaded_file(
                    $_FILES['image']['tmp_name'],
                    $rutaDestino . '/' . $destino
                )) {
                    echo json_encode(
                        array(
                            'cod' => 1,
                            'mensaje' => "La imagen ha sido adicionada satisfactoriamente.",
                            'success' => 'true'
                        )
                    );

                    return;
                } else {
                    echo json_encode(
                        array(
                            'cod' => 6,
                            'mensaje' => "Ha ocurrido un error subiendo el archivo.",
                            'success' => 'false'
                        )
                    );

                    return;
                }
            }
        }
    }

    /**
     * @name    eliminarImagenAction
     * @author    Liván A Capote Valdés
     * @access    public
     *
     * @param
     *
     * @return
     * @uses      Método para eliminar una imagen
     */
    function eliminarImagenAction()
    {
        $dir = explode('apps', dirname(__FILE__));
        $dire = $this->_request->getPost('directorio');
        $directorio = $dir[0] . $dire;
        $imagen = $this->_request->getPost('imagen');
        $url = $this->_request->getPost('url');
        //Se comprueba de que el directorio no exista
        if (is_file($directorio . '/' . $imagen)) {
            if(DatApariencia::imagenEnUso($url)){
                echo json_encode(
                    array(
                        'cod' => 6,
                        'mensaje' => 'La imagen seleccionada no se puede eliminar debido a que está en uso.'
                    )
                );
            }else {
                unlink($directorio . '/' . $imagen);
                echo json_encode(
                    array(
                        'cod' => 7,
                        'mensaje' => "La imagen ha sido eliminada satisfactoriamente."
                    )
                );
            }
            return;
        } else {
            echo json_encode(
                array(
                    'cod' => 3,
                    'mensaje' => "La imagen que desea eliminar no existe."
                )
            );

            return;
        }
    }

    /**
     * @name    crearMensajes
     * @author  Carlos Sarmiento Samper
     * @access
     *
     * @param
     *
     * @return
     * @uses    Para debolver el mensaje correspondiente en cada accion
     */
    function crearMensajes($accion, $elemento)
    {
        switch ($accion) {
            case 'eliminar':
                switch ($elemento) {
                    case 'accesos':
                        return json_encode(
                            array(
                                'cod' => 1,
                                'mensaje' => "El acceso directo ha sido eliminado" . " satisfactoriamente."
                            )
                        );
                        break;
                    case 'inicios':
                        return json_encode(
                            array(
                                'cod' => 1,
                                'mensaje' => "El inicio r&aacutepido ha sido eliminado" . " satisfactoriamente."
                            )
                        );
                        break;
                    case 'automaticos':
                        return json_encode(
                            array(
                                'cod' => 1,
                                'mensaje' => "El inicio autom&aacutetico ha sido eliminado" . " satisfactoriamente."
                            )
                        );
                        break;
                }
                break;
            case 'agregar':
                switch ($elemento) {
                    case 'accesos':
                        return json_encode(
                            array(
                                'cod' => 1,
                                'mensaje' => "El acceso directo ha sido adicionado" . " satisfactoriamente."
                            )
                        );
                        break;
                    case 'inicios':
                        return json_encode(
                            array(
                                'cod' => 1,
                                'mensaje' => "El inicio r&aacutepido ha sido adicionado satisfactoriamente."
                            )
                        );
                        break;
                    case 'automaticos':
                        return json_encode(
                            array(
                                'cod' => 1,
                                'mensaje' => "El inicio autom&aacutetico ha sido adicionado satisfactoriamente."
                            )
                        );
                        break;
                }
                break;
            case 'modificar':
                switch ($elemento) {
                    case 'accesos':
                        return json_encode(
                            array(
                                'cod' => 1,
                                'mensaje' => "El acceso directo ha sido modificado satisfactoriamente."
                            )
                        );
                        break;
                    case 'inicios':
                        return json_encode(
                            array(
                                'cod' => 1,
                                'mensaje' => "El inicio r&aacutepido ha sido modificado" . " satisfactoriamente."
                            )
                        );
                        break;
                    case 'automaticos':
                        return json_encode(
                            array(
                                'cod' => 1,
                                'mensaje' => "El inicio autom&aacutetico ha sido modificado" . " satisfactoriamente."
                            )
                        );
                        break;
                }
                break;
        }
    }

    /**
     * @name    guardarAccesoDirectoAction
     * @author    Liván A Capote Valdés
     * @access    public
     *
     * @param
     *
     * @return
     * @uses      Para guardar los accesos directos del usuario
     */
    public function  guardarAccesoDirectoAction()
    {
        $mensaje = '';
        $perfil = $this->getPerfil();
        $acceso = json_decode($this->_request->getPost('acceso'));
        $objApariencia = DatApariencia::devolverAparienciaUsuario(
            $perfil->idusuario
        );
        //Es que existe el usuario con configuración
        $objApariencia->idusuario = $perfil->idusuario;
        /**En esta condicional se obtiene la apariencia para los accesos
         * directos, y la apariencia para
         * la barra de inicio rapido en caso de que no se cumpla**/
        if ($this->_request->getParam('bandera') == 'accesos') {
            $arrayApariencia = $objApariencia->accesosdirectos ? json_decode(
                $objApariencia->accesosdirectos
            ) : array();
        } else {
            if ($this->_request->getParam('bandera') == 'inicios') {
                $arrayApariencia = $objApariencia->iniciosrapidos ? json_decode(
                    $objApariencia->iniciosrapidos
                ) : array();
            } else {
                $arrayApariencia =
                    $objApariencia->iniciosautomaticos ? json_decode($objApariencia->iniciosautomaticos) : array();
            }
        }
        if ($acceso->aWinConfig->estado == 'eliminar') {
            $pos = 0;
            foreach ($arrayApariencia as $key => $value) {
                if ($value->id == $acceso->aWinConfig->id) {
                    $pos = $key;
                    break;
                }
            }
            unset($arrayApariencia[$pos]);
            $arrayApariencia = array_values($arrayApariencia);
            if ($this->_request->getParam('bandera') == 'accesos') {
                $mensaje = $this->crearMensajes('eliminar', 'accesos');
            } else {
                if ($this->_request->getParam('bandera') == 'automatico') {
                    $mensaje = $this->crearMensajes('eliminar', 'automaticos');
                } else {
                    $mensaje = $this->crearMensajes('eliminar', 'inicios');
                }
            }
        } else {
            if ($acceso->aWinConfig->estado == 'agregar' || $this->_request->getParam('addStarMenu') == 'true'
            ) {
                $pos = 'que';
                foreach ($arrayApariencia as $key => $value) {
                    if ($value->id == $acceso->aWinConfig->id) {
                        $pos = $key;
                        break;
                    }
                }
                if ($arrayApariencia[$pos]) {
                    $mensaje = json_encode(
                        array(
                            'cod' => 6,
                            'mensaje' => "El acceso directo que quiere" . " adicionar ya existe."
                        )
                    );
                } else {
                    $arrayApariencia[] = $acceso->aWinConfig;
                    if ($this->_request->getParam('bandera') == 'accesos') {
                        $mensaje = $this->crearMensajes('agregar', 'accesos');
                    } else {
                        if ($this->_request->getParam('bandera') == 'automatico'
                        ) {
                            $mensaje = $this->crearMensajes(
                                'agregar',
                                'automaticos'
                            );
                        } else {
                            $mensaje = $this->crearMensajes(
                                'agregar',
                                'inicios'
                            );
                        }
                    }
                }
            } else {
                $pos = 0;
                foreach ($arrayApariencia as $key => $value) {
                    if ($value->id == $acceso->aWinConfig->id) {
                        $pos = $key;
                        break;
                    }
                }
                $arrayApariencia[$pos]->text = $acceso->aWinConfig->text;
                $arrayApariencia[$pos]->icono = $acceso->aWinConfig->icono;
                $mensaje = $this->crearMensajes('modificar', 'accesos');;
            }
        }
        if ($this->_request->getParam('bandera') == 'accesos') {
            //Busco la tabla de apariencia para modificarlo
            $objApariencia->accesosdirectos = json_encode($arrayApariencia);
            $objApariencia->save();
            echo $mensaje;

            return;
        } else {
            if ($this->_request->getParam('bandera') == 'automatico') {
                if ($acceso->aWinConfig->estado == 'eliminar') {
                    $mensaje = $this->crearMensajes('eliminar', 'automaticos');
                } else {
                    if ($acceso->aWinConfig->estado == 'agregar') {
                        $mensaje = $this->crearMensajes(
                            'agregar',
                            'automaticos'
                        );
                    } else {
                        if ($acceso->aWinConfig->estado == 'modificar') {
                            $mensaje = $this->crearMensajes(
                                'modificar',
                                'automaticos'
                            );
                        }
                    }
                }
                $objApariencia->iniciosautomaticos = json_encode(
                    $arrayApariencia
                );
                $objApariencia->save();
                echo $mensaje;

                return;
            } else {
                if ($acceso->aWinConfig->estado == 'eliminar') {
                    $mensaje = $this->crearMensajes('eliminar', 'inicios');
                } else {
                    if ($acceso->aWinConfig->estado == 'agregar') {
                        $mensaje = $this->crearMensajes('agregar', 'inicios');
                    } else {
                        if ($acceso->aWinConfig->estado == 'modificar') {
                            $mensaje = $this->crearMensajes(
                                'modificar',
                                'inicios'
                            );
                        }
                    }
                }
                //Busco la tabla de apariencia para modificarlo
                $objApariencia->iniciosrapidos = json_encode($arrayApariencia);
                $objApariencia->save();
                echo $mensaje;

                return;
            }
        }
    }

    /**
     * @name    obtenerConfiguracionAction
     * @author     Liván A Capote Valdés
     * @access     public
     *
     * @param
     *
     * @return
     * @uses       Para obtener la configuración del usuario
     * @modificado por Carlos Sarmiento 6/3/2015
     */
    public function  obtenerConfiguracionAction()
    {
        $perfil = $this->getPerfil();
        $acceso = json_decode($this->_request->getPost('acceso'));
        $inicio = $this->_request->getPost('inicio');
        if ($inicio) {
            $this->inicio = $inicio;
        } else {
            $this->inicio = '';
        }
        $objApariencia = DatApariencia::devolverAparienciaUsuario(
            $perfil->idusuario
        );
        if (!$objApariencia->idapariencia) {
            $objApariencia->idusuario = $perfil->idusuario;
            $objApariencia->save();
        }
        echo Zend_Json_Encoder::encode($objApariencia->toArray());
    }


    /**
     * @name    guardarFondoAction
     * @author    Israel Valdés Marrero
     * @access    public
     *
     * @param
     *
     * @return
     * @uses      Método para guardar el fondo
     */
    function guardarFondoAction()
    {
        $perfil = $this->getPerfil();
        $datos['idUsuario'] = $perfil->idusuario;
        $datos['dirFondo'] = $this->_request->getPost('dirFondo');
        if (DatApariencia::guardarFondo($datos)) {
            echo json_encode(
                array(
                    'cod' => 1,
                    'mensaje' => "La imagen ha sido modificada satisfactoriamente.",
                    'success' => true
                )
            );
        } else {
            echo false;
        };
    }

    /**
     * @name    guardarIconoMenuAction
     * @author    Carlos Alberto Sarmiento
     * @access    public
     *
     * @param
     *
     * @return
     * @uses      Método para guardar el icono para el menu
     */
    function guardarIconoMenuAction()
    {
        $obj = $this->_request->getPost('bandera');
        $icon = $this->_request->getPost('icon');
        $id = $this->_request->getPost('identidad');
        $safe = $this->integrator->seguridad->safeIconMenu($obj, $icon, $id);
        $perfil = $this->getPerfil();
        $datos['idUsuario'] = $perfil->idusuario;
        $datos['dirFondo'] = $this->_request->getPost('dirFondo');
    }

    function obtenerIconoFuncionalidadAction () {
        $idfunc = $this->_request->getPost('idfunc');
        $funcData = $this->integrator->seguridad->getFuncIcon($idfunc);
        echo json_encode(array("icono" => $funcData[0]['icono']));
    }
}
