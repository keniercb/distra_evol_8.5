<?php

/**
 * @name GestfuncionalidadController - Clase controladora de funcionalidades
 *  perteneciente al componente de autorización.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestfuncionalidadController extends SeguridadController
{

    /**
     * @name init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @name gestfuncionalidadAction() - Función principal de la clase, 
     * encargada de resderiai la vista
     * correspondiente.
     * @return void
     */
    public function gestfuncionalidadAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method insertarfuncionalidadAction - Función usada para 
     * adicionar nuevas funcionalidades.
     */
    public function insertarfuncionalidadAction()
    {
        $funcionalidad = new DatFuncionalidad();
        $funcionalidad->idsistema = $this->_request->getPost('idsistema');
        $funcionalidad->denominacion = $this->_request->getPost('text');
        $funcionalidad->referencia = $this->_request->getPost('referencia');
        $funcionalidad->descripcion = $this->_request->getPost('descripcion');
        $funcionalidad->index = ($this->_request->getPost('index')) 
            ? $this->_request->getPost('index') : 0;
        $funcionalidad->icono = $this->_request->getPost('icono');
        $funcionalidad->iddominio = $this->global->Perfil->iddominio;
        $funcionalidad->visible = $this->_request->getPost('visible') != '' 
            ? $this->_request->getPost('visible'): false;
        $model = new DatFuncionalidadModel();
        $idfuncionalidad = $model->insertarfuncionalidad($funcionalidad);
        $objFuncCompart = new DatFuncionalidadCompartimentacion();
        $objFuncCompart->iddominio = $this->global->Perfil->iddominio;
        $objFuncCompart->idfuncionalidad = $idfuncionalidad;
        $objFuncCompart->save();
        $this->showMessage(
            'La funcionalidad ha sido adicionada satisfactoriamente.'
        );
    }

    /**
     * @method modificarfuncionalidadAction() - Función usada para 
     * modificar una funcionalidad determinada.
     */
    public function modificarfuncionalidadAction()
    {
        $funcionalidad = new DatFuncionalidad();
        $funcionalidad = Doctrine::getTable('DatFuncionalidad')
            ->find($this->_request->getPost('idfuncionalidad'));
        $funcionalidad->idsistema = $this->_request->getPost('idsistema');
        $funcionalidad->denominacion = $this->_request->getPost('text');
        $funcionalidad->referencia = $this->_request->getPost('referencia');
        $funcionalidad->descripcion = $this->_request->getPost('descripcion');
        $funcionalidad->index = $this->_request->getPost('index');
        $funcionalidad->icono = $this->_request->getPost('icono');
        $funcionalidad->visible = $this->_request->getPost('visible') != '' ?
            $this->_request->getPost('visible') : false;
        $model = new DatFuncionalidadModel();
        $model->modificarfuncionalidad($funcionalidad);
        $this->showMessage(
            'La funcionalidad ha sido modificada satisfactoriamente.'
        );
    }

    /**
     * @method eliminarfuncionalidadAction - Función usada para 
     * eliminar un conjunto de funcionalidades.
     */
    public function eliminarfuncionalidadAction()
    {
        $funcionalidad = new DatFuncionalidad();
        $funcionalidad = Doctrine::getTable('DatFuncionalidad')
            ->find($this->_request->getPost('idfuncionalidad'));
        $model = new DatFuncionalidadModel();
        $model->eliminarfuncionalidad($funcionalidad);
        $this->showMessage(
            'La funcionalidad ha sido eliminada satisfactoriamente.'
        );
    }

    /**
     * @method cargarsistemaAction - Función usada para 
     * cargar el árbol de sistemas.
     */
    public function cargarsistemaAction()
    {
        $sistemas = DatSistema::cargarsistema($this->_request->getPost('node'));
        $sistemaArr = array();
        if (count($sistemas) > 0) {
            foreach ($sistemas as $valores => $valor) {
                $sistemaArr[$valores]['id'] = $valor->id;
                $sistemaArr[$valores]['text'] = $valor->text;
                $sistemaArr[$valores]['abreviatura'] = $valor->abreviatura;
                $sistemaArr[$valores]['descripcion'] = $valor->descripcion;
                $sistemaArr[$valores]['icono'] = $valor->icono;
                $sistemaArr[$valores]['leaf'] = $valor->leaf;
            }
        }
        echo json_encode($sistemaArr);
    }

    /**
     * @method cargarfuncionalidadesAction - Función usada para 
     * listar las funcionalidades de un sistema.
     */
    public function cargarfuncionalidadesAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $limit = $this->_request->getPost("limit");
        $start = $this->_request->getPost("start");
        $denominacion = $this->_request->getPost("denominacion");
        if ($denominacion) {
            $datosfunc = DatFuncionalidad::buscarfuncionalidades(
                $idsistema, $denominacion, $limit, $start
            );
            $cantf = DatFuncionalidad::obtenercantfuncdenominacion(
                $idsistema, $denominacion
            );
        } else {
            $datosfunc = DatFuncionalidad::buscarfuncionalidadesgrid(
                $idsistema, $limit, $start
            );
            $cantf = DatFuncionalidad::obtenercantfunc($idsistema);
        }
        if ($datosfunc) {
            $datos = $datosfunc->toArray();
            echo json_encode(
                array('cantidad_filas' => $cantf, 'datos' => $datos)
            );
        }
    }

    /**
     * @method cargarReferenciaAction - Función usada para cargar 
     * el árbol de referencias para insertar posteriormente
     * las funcionalidades.
     */
    public function cargarReferenciaAction()
    {
        $idnodo = $this->_request->getPost('id');
        $name = $this->_request->getPost('text');
        $type = $this->_request->getPost('type');
        $dr = explode('/web', $_SERVER['DOCUMENT_ROOT']);
        if ($idnodo) {
            $raiz = $idnodo . '/';
        } else {
            $raiz = $dr[0] . '/' . 'apps/';
        }
        $nodes = array();
        if ($type != 'controlador') {
            $d = dir($raiz);
            while ($f = $d->read()) {
                if ($f == '.' || $f == '..' || substr($f, 0, 1) == '.' 
                    || $f == 'config.php' || $f == 'comun'
                    || $f == 'models'
                    || $f == 'services'
                    || $f == 'validators'
                    || $f == 'views'
                    || $f == 'index.php'
                ) {
                    continue;
                }
                if (is_dir($raiz . '/' . $f)) {
                    $nodes[] = array('text' => $f, 'id' => $raiz 
                        . $f, 'cls' => 'folder');
                } else {
                    if ($name == 'controllers') {
                        $nodes[] = array('text' => $f, 'id' => $raiz 
                            . $f, 'cls' => 'folder', 'type' => 'controlador');
                    } else {
                        $nodes[] = array('text' => $f, 'id' => $raiz 
                            . $f, 'leaf' => true, 'cls' => 'folder',
                                         'type' => 'controlador');
                    }
                }
            }
            $d->close();
        } else {
            $controler = explode('/controllers/', $idnodo);
            if (file_exists($controler[0] . '/config.php')) {
                include_once $controler[0] . '/config.php';
            }
            set_include_path(
                get_include_path(). PATH_SEPARATOR . dirname($idnodo)
            );
            $class = substr($controler[1], 0, strlen($controler[1]) - 4);
            $methods = @get_class_methods($class);
            $nodes = self::getMethodsInformation($methods, $idnodo, $name);
        }
        echo json_encode($nodes);
    }

    private function getMethodsInformation($methods, $idnodo, $name)
    {
        $arrayResult = array();
        $key = 0;
        $class = strtolower(substr($name, 0, strlen($name) - 14));
        $referencia = explode('/apps/', $idnodo);
        $referencia = substr($referencia[1], 0, strrpos($referencia[1], '/'));
        $referencia = str_replace('controllers', 'index.php', $referencia);
        $referencia = $referencia . '/' . $class;
        foreach ($methods as $function) {
            $cadena=substr($function, strlen($function) - 6, strlen($function));
            if ($cadena == 'Action') {
                $arrayResult[$key]['leaf'] = true;
                $arrayResult[$key]['text'] = $function;
                $arrayResult[$key]['id'] = $function;
                $arrayResult[$key]['type'] = 'action';
                $arrayResult[$key]['referencia'] = $referencia . '/' 
                    . substr($function, 0, strlen($function) - 6);
                $key++;
            }
        }

        return $arrayResult;
    }

}
