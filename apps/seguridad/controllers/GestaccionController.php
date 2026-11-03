<?php

/**
 * @name GestaccionController - Clase controladora de Acciones.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestaccionController extends ZendExt_Controller_Secure
{

    protected $_list = array('.',
        '..',
        'config.php',
        'comun',
        'models',
        'services',
        'validators',
        'views',
        'index.php',
        'config_external.php',
        'gen.php'
    );

    /**
     * @method init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @method gestaccionAction() - Función principal de la clase, encargada 
     * de renderiar la vista correspondiente.
     * @return void
     */
    public function gestaccionAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method cargarsistfuncAction() - Función usada para cargar 
     * el árbol de funcionalidades.
     * @return json
     */
    public function cargarsistfuncAction()
    {
        $idnodo = $this->_request->getPost('node');
        $idsistema = $this->_request->getPost('idsistema');
        if ($idnodo == 0) {
            $sistemas = DatSistema::cargarsistema($idnodo);
        } else {
            $sistemas = DatSistema::cargarsistema($idsistema);
        }
        $contador = 0;
        $sistemafunArr = array();
        if (count($sistemas) > 0) {
            foreach ($sistemas as $valores => $valor) {
                $sistemafunArr[$contador]['id'] = $valor->id . '_' . $idnodo;
                $sistemafunArr[$contador]['idsistema'] = $valor->id;
                $sistemafunArr[$contador]['text'] = $valor->text;
                $contador++;
            }
        }
        $funcionalidad = DatFuncionalidad::cargarfuncionalidades(
            $idsistema, 0, 0
        );
        if (count($funcionalidad) > 0) {
            foreach ($funcionalidad as $valores => $valor) {
                $sistemafunArr[$contador]['id'] = $valor->id . '_' . $idnodo;
                $sistemafunArr[$contador]['idfuncionalidad'] = $valor->id;
                $sistemafunArr[$contador]['referencia'] = $valor->referencia;
                $sistemafunArr[$contador]['text'] = $valor->text;
                $sistemafunArr[$contador]['leaf'] = true;
                $sistemafunArr[$contador]['externa'] = 
                    ($valor->DatSistema->externa != '') ? true : false;
                $contador++;
            }
        }
        echo json_encode($sistemafunArr);

        return;
    }

    /**
     * @method insertaraccionAction() - Función usada para gestionar 
     * las acciones propias de la arquitectura.
     * @return string
     */
    public function insertaraccionAction()
    {
        $arrayNodesCh = $this->_request->getPost('arrayNodesChecked');
        $arrayNodesChecked = self::obtenerArrayAcciones(
            json_decode(stripslashes($arrayNodesCh))
        );
        $arrayNodesE = $this->_request->getPost('arrayNodesElim');
        $arrayNodesElim = self::obtenerArrayAcciones(
            json_decode(stripslashes($arrayNodesE))
        );
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        //$referencia = explode('/', $this->_request->getPost('referencia'));
        if (count($arrayNodesElim) > 0 || count($arrayNodesChecked) > 0) {
            if (count($arrayNodesChecked)) {
                foreach ($arrayNodesChecked as $denominacion) {
                    $accion = new DatAccion();
                    $accion->denominacion = $denominacion;
                    $accion->idfuncionalidad = $idfuncionalidad;
                    $accion->iddominio = $this->global->Perfil->iddominio;
                    $model = new DatAccionModel();
                    $model->insertaraccion($accion);
                }
            }
            if (count($arrayNodesElim)) {
                $accionesUsadas = DatAccion::obtenerAccionesUsuario(
                    $arrayNodesElim, $idfuncionalidad
                );
                $accionesUsadas = SegUtil::convertToUnidimensional(
                    $accionesUsadas, 'denominacion'
                );
                if (count($accionesUsadas) > 0) {
                    $nodesElim = array();
                    $nodesElim = array_diff($arrayNodesElim, $accionesUsadas);
                    if (count($nodesElim) > 0) {
                        DatAccion::eliminarAcciones(
                            $nodesElim, $idfuncionalidad
                        );
                    }
                    $this->showMessage(
                        'Alguna(s) acci&oacute;n(es) seleccionada(s) no se '
                        .'puede(n) eliminar debido a que est&aacute;(n) en uso.'
                    );

                    return;
                } else {
                    DatAccion::eliminarAcciones(
                        $arrayNodesElim, $idfuncionalidad
                    );
                    echo "{'success':true}";

                    return;
                }
            }
            echo "{'success':true}";
        } else {
            echo "{'success':false}";
        }
    }

    /**
     * @method cargargridaccionesAction() - Función usada para listar las 
     * acciones de una funcionalidad determinada.
     * @return json
     */
    public function cargargridaccionesAction()
    {
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $denominacion = $this->_request->getPost('denominacion');
        $referencia = $this->_request->getPost('referencia');
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $datos = array();
        self::validarAcciones($idfuncionalidad, $referencia);
        if ($denominacion) {
            $datosacc = DatAccion::buscaraccion(
                $idfuncionalidad, $denominacion, $limit, $start
            );
            $canfilas = DatAccion::obtenercantaccionbuscadas(
                $idfuncionalidad, $denominacion
            );
        } else {
            $datosacc=DatAccion::cargaraccion($idfuncionalidad, $limit, $start);
            $canfilas = DatAccion::obtenercantaccion($idfuncionalidad);
        }
        if (count($datosacc)) {
            $datos = $datosacc->toArray();
        }
        echo json_encode(
            array('cantidad_filas' => $canfilas, 'datos' => $datos)
        );

        return;
    }

    /**
     * @author Darien García Tejo.
     * @method cargarReferenciaAction() - Función usada para cargar el 
     * directorio de ficheros de la aplicación.
     * @return type
     */
    public function cargarReferenciaAction()
    {
        $idnodo = str_replace('//', '/', $this->_request->getPost('id'));
        $name = $this->_request->getPost('text');
        //$controller = $this->_request->getPost('controlador');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $referencia = $this->_request->getPost('referencia');
        $controlador = explode('/', $referencia);
        $controlador = ucfirst($controlador[count($controlador) - 2]) 
            . 'Controller';
        $module = explode('/index.php/', $referencia);
        $dr = explode('/web', $_SERVER['DOCUMENT_ROOT']);
        $nodes = array();
        if ($idnodo) {
            $controler = explode('/controllers/', $idnodo);
            if (file_exists($controler[0] . '/config.php')) {
                include_once $controler[0] . '/config.php';
            }
            $idnodo = $idnodo . '.php';
            $includePath = get_include_path();
            set_include_path($includePath . PATH_SEPARATOR . dirname($idnodo));
            $methods = @get_class_methods($name);
            $nodes = self::getMethodsInformation(
                $methods, $idfuncionalidad
            );
            set_include_path($includePath);
        } else {
            $raiz = $dr[0] . '/' . 'apps/' . $module[0] . '/controllers/' 
                . $controlador;
            $nodes[] = array(
                'text' => $controlador, 
                'id' => $raiz, 
                'idfuncionalidad' => $idfuncionalidad,
                'type' => 'funcionalidad'
            );
        }
        echo json_encode($nodes);

        return;
    }

    /**
     * @author Darien García Tejo.
     * @method adicionarAccioneExternaAction() - Función encargada de 
     * registrar 
     * las acciones pertenecientes a las
     *         funcionalidades de los sistemas externos.
     * @return void
     */
    public function adicionarAccioneExternaAction()
    {
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $denominacion = $this->_request->getPost('denominacion');
        $accion = new DatAccion();
        $accion->denominacion = $denominacion;
        $accion->idfuncionalidad = $idfuncionalidad;
        $accion->iddominio = $this->global->Perfil->iddominio;
        $model = new DatAccionModel();
        $model->insertaraccion($accion);
        $this->showMessage(
            'La acci&oacute;n ha sido adicionada satisfactoriamente.'
        );
    }

    /**
     * @author Darien García Tejo.
     * @method modificarAccioneExternaAction - Función usada para actualizar 
     * la acción seleccionada dentro de una
     *         funcionalidad.
     * @return void
     */
    public function modificarAccioneExternaAction()
    {
        $idaccion = $this->_request->getPost('idaccion');
        $denominacion = $this->_request->getPost('denominacion');
        $objAcc = Doctrine::getTable('DatAccion')->find($idaccion);
        if ($objAcc->denominacion != $denominacion) {
            $objAcc->denominacion = $denominacion;
            $objAcc->save();
        }
        $this->showMessage(
            'La acci&oacute;n ha sido modificada satisfactoriamente.'
        );
    }

    /**
     *
     * @method guardarDescripcionAction - Función usada para actualizar 
     * la descripcion de las acciones dentro de una
     *         funcionalidad.
     * @return void
     */
    public function guardarDescripcionAction()
    {
        $datos = json_decode($this->_request->getPost('datos'));
        foreach ($datos as $accion) {
            $objAcc = Doctrine::getTable('DatAccion')->find($accion->idaccion);
            $objAcc->descripcion = $accion->descripcion;
            $objAcc->save();
        }

        echo json_encode(array("codigo" => 1));
    }

    /**
     * @author Darien García Tejo.
     * @method eliminarAccioneExternaAction - Función usada para eliminar 
     * las acciones seleccionadas de una
     *         funcionalidad.
     * @return void
     */
    public function eliminarAccioneExternaAction()
    {
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $arrayNodesElim = json_decode(
            stripslashes($this->_request->getPost('arrayIdAcciones'))
        );
        if (count($arrayNodesElim) > 0) {
            $accionesUsadas = DatAccion::obtenerAccionesUsuario(
                $arrayNodesElim, $idfuncionalidad
            );
            $accionesUsadas = SegUtil::convertToUnidimensional(
                $accionesUsadas, 'denominacion'
            );
            if (count($accionesUsadas) > 0) {
                $nodesElim = array();
                $nodesElim = array_diff($arrayNodesElim, $accionesUsadas);
                if (count($nodesElim) > 0) {
                    DatAccion::eliminarAcciones($nodesElim, $idfuncionalidad);
                }
                $this->showMessage(
                    'Alguna(s) acci&oacute;n(es) seleccionada(s) no '
                    . 'se puede(n) eliminar debido a que est&aacute;(n) en uso.'
                );

                return;
            } else {
                DatAccion::eliminarAcciones($arrayNodesElim, $idfuncionalidad);
                $this->showMessage(
                    'La(s) acci&oacute;n(es) ha(n) sido '
                    . 'eliminada(s) satisfactoriamente.'
                );

                return;
            }
        }
    }

    private function getMethodsInformation(
        $methods, $idfuncionalidad
    )
    {
        $arrayAcciones = array();
        $arrayFuncionalidades=DatAccion::cargarAccionByIdFunc($idfuncionalidad);
        $arrayAcciones = SegUtil::convertToUnidimensional(
            $arrayFuncionalidades, 'denominacion'
        );
        $arrayResult = array();
        $key = 0;
        $arrayCargar = array(
            'cargaretiquetasAction', 
            'closeportalAction', 
            'cargaraccionesAction',
            'cargarAccionesXUriAction', 
            'cargaraccionesbyidAction', 
            'cargarayudaAction'
        );
        foreach ($methods as $function) {
            $cadena=substr($function, strlen($function) - 6, strlen($function));
            if ($cadena == 'Action' 
                && !array_intersect(array($function), $arrayCargar)
            ) {
                $arrayResult[$key]['leaf'] = true;
                $arrayResult[$key]['text'] = $function;
                $arrayResult[$key]['id'] = $function;
                $arrayResult[$key]['type'] = 'action';
                $arrayResult[$key]['idfuncionalidad'] = $idfuncionalidad;
                if (array_intersect(array($function), $arrayAcciones)) {
                    $arrayResult[$key]['checked'] = true;
                    $arrayResult[$key]['defaultChecked'] = true;
                } else {
                    $arrayResult[$key]['checked'] = false;
                    $arrayResult[$key]['defaultChecked'] = false;
                }
                $arrayResult[$key]['acctionName'] = substr(
                    $function, 0, strlen($function) - 6
                );
                $key++;
            }
        }

        return $arrayResult;
    }

    private static function obtenerArrayAcciones($array)
    {
        $arrayResult = array();
        foreach ($array as $values) {
            array_push($arrayResult, substr($values, 0, strlen($values) - 6));
        }
        return $arrayResult;
    }

    private static function validarAcciones($idfuncionalidad, $referencia)
    {
        $controlador = explode('/', $referencia);
        $controller = ucfirst($controlador[count($controlador) - 2]) 
            . 'Controller';
        $module = explode('/index.php/', $referencia);
        $dr = explode('/web', $_SERVER['DOCUMENT_ROOT']);
        $raiz = $dr[0] . '/' . 'apps/' . $module[0] . '/controllers/' 
            . $controller;        
        if ($raiz) {
            $idnodo = $raiz . '.php';
            $includePath = get_include_path();
            set_include_path($includePath . PATH_SEPARATOR . dirname($idnodo));
            $methods = @get_class_methods($controller);
            //$methods = self::file_get_class_methods($idnodo);
            if (count($methods) > 0) {
                $arrayAcciones = array();
                $arrayAcciones = DatAccion::cargarAccionByIdFunc(
                    $idfuncionalidad
                );
                if (count($arrayAcciones) > 0) {
                    $arrayAcciones = SegUtil::convertToUnidimensional(
                        $arrayAcciones, 'denominacion'
                    );
                    $arrayElim = array();
                    $arrayElim = array_diff($arrayAcciones, $methods);
                    if (count($arrayElim) > 0) {
                        DatAccion::eliminarAcciones(
                            self::obtenerArrayAcciones($arrayElim), 
                            $idfuncionalidad
                        );
                    }
                }
            }
            set_include_path($includePath);
        }
    }

    public function pruebasAccionesAction()
    {
        
    }

}
