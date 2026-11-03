<?php

/**
 * @name GestnomdominioController - Clase controladora de dominios.
 * @package   seguridad
 * @copyright UCID.
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestnomdominioController extends SeguridadController
{

    /**
     * @name init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @name gestnomdominioAction() - Función principal de la clase, 
     * encargada de renderiar la vista correspondiente.
     * @return void
     */
    public function gestnomdominioAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method geticonAction -
     */
    public function geticonAction()
    {
        header('Content-type: image/gif');
        $img = imagecreatefromgif(
            '../metadatos/comun/recursos/iconos/' . $_GET ['icon'] . '.gif'
        );
        imagegif($img);
    }

    /**
     * @method cargardominiosAction - Función usada para cargar 
     * el listado de dominios por lotes.
     */
    public function cargardominiosAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $dendominio = $this->_request->getPost('denDom');
        if ($dendominio) {
            $arraydominios =$this->integrator->metadatos->BuscarDomioDadoNombre(
                $limit, $start, $dendominio
            );
        } else {
            $arraydominios = $this->integrator->metadatos->BuscarDominios(
                $limit, $start
            );
        }
        echo json_encode($arraydominios);
    }

    /**
     * @method insertarnomdominioAction - Función usada para 
     * adicionar un nuevo dominio.
     */
    public function insertarnomdominioAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $descripcion = $this->_request->getPost('descripcion');
        //arreglo de estructuras chekeadas
        $arrayEstructuras = json_decode(
            stripslashes($this->_request->getPost('arrayEntidades'))
        );
        //arreglo de entidades chekeadas sin desplegar, 
        //es decir hay ke chekear ademas todos sus hijos
        $arrayPadres = json_decode(
            stripslashes($this->_request->getPost('arrayPadres'))
        );
        $arrayEstructuras = array(
            'estructuras' => $arrayEstructuras, 
            'padres' => $arrayPadres
        );
        if ($this->integrator->metadatos->InsertarDominio(
            $denominacion, $descripcion, $arrayEstructuras
        )) {
            echo "{'cod':1,'mensaje': ' El dominio ha sido "
            . "adicionado satisfactoriamente.'}";
        } else {
            echo "{'cod':3,'mensaje': ' El dominio no se pudo insertar.'}";
        }
    }

    /**
     * @method modificarnomdominioAction - Función usada para 
     * modificar el dominio seleccionado.
     */
    public function modificarnomdominioAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $descripcion = $this->_request->getPost('descripcion');
        $iddominio = $this->_request->getPost('iddominio');
        $arrayTiene = json_decode(
            stripslashes($this->_request->getPost('arrayTiene'))
        );
        //estructura chekeadas
        $arrayEstructuras = json_decode(
            stripslashes($this->_request->getPost('arrayEntidades'))
        );
        //estructuras a eliminar ke son las ke se deschekearon
        $arrayEstructurasEliminar = json_decode(
            stripslashes($this->_request->getPost('arrayEntidadesEliminar'))
        );
        //array de nodos marcados sin desplegar, es decir los ke hay
        // ke buscar sus hijos y ponerlos como chekeados
        $arrayPadres = json_decode(
            stripslashes($this->_request->getPost('arrayPadres'))
        );
        //array de nodos desmarcados sin desplegar, hay ke buscar 
        //sus hijos y ponerlos en el array a eliminar
        $arrayPadresEliminar = json_decode(
            stripslashes($this->_request->getPost('arrayPadresEliminar'))
        );
        if (count($arrayTiene)) { //Descartando nodos que ya estan insertados.
            if (count($arrayEstructurasEliminar)) {
                $arrayTiene =array_diff($arrayTiene, $arrayEstructurasEliminar);
            }
            if (count($arrayPadres)) {
                $arrayPadres = array_diff($arrayPadres, $arrayTiene);
            }
            if (count($arrayEstructuras)) {
                $arrayEstructuras = array_diff($arrayEstructuras, $arrayTiene);
            }
        }
        if (count($arrayEstructuras) > 0 
            || count($arrayPadres) > 0 
            || count($arrayEstructurasEliminar)
        ) {
            $array = array(
                'estructuras' => $arrayEstructuras, 
                'padres' => $arrayPadres,
                'arrayEntidadesEliminar' => $arrayEstructurasEliminar,
                'arrayPadresEliminar' => $arrayPadresEliminar
            );
            $this->integrator->metadatos->ModificarDominio(
                $iddominio, $denominacion, $descripcion, $array
            );
            echo "{'cod':1,'mensaje': 'El dominio ha sido "
            . "modificado satisfactoriamente.'}";
        } elseif (count($arrayTiene)) {
            if ($denominacion || $descripcion) {
                $this->integrator->metadatos->ModificarDominio(
                    $iddominio, $denominacion, $descripcion, array()
                );
            }
            echo "{'cod':1,'mensaje': 'El dominio ha sido "
            . "modificado satisfactoriamente.'}";
        } else {
            echo "{'cod':3,'mensaje': 'El dominio debe contener "
            . "al menos una entidad.'}";
        }
    }

    /**
     * @method eliminarnomdominioAction - Función usada para 
     * eliminar el dominio seleccionado.
     */
    public function eliminarnomdominioAction()
    {
        $iddominio = $this->_request->getPost('iddominio');
        $cantusuariodominio = SegUsuario::cantusuariodadodominio($iddominio);
        if ($cantusuariodominio > 0) {
            echo "{'cod':3,'mensaje': 'El dominio seleccionado "
            . "no se puede eliminar debido a que est&aacute; en uso.'}";
        } else {
            $this->integrator->metadatos->EliminarDominio(
                $this->_request->getPost('iddominio')
            );
            echo "{'cod':1,'mensaje': 'El dominio ha sido "
            . "eliminado satisfactoriamente.'}";
        }
    }

    /**
     * @method cargarestructurasAction - Función usada para 
     * cargar el árbol de estructuras pertenecientes
     * al dominio seleccionado.
     */
    public function cargarestructurasAction()
    {
        $idEstructura = $this->_request->getPost('node');
        $accion = $this->_request->getPost('accion');
        $iddominiomod = $this->_request->getPost('iddominio');
        $estructuras = array();
        if ($accion == 'insertar') {
            $estructuras = $this->integrator->metadatos
                ->buscarHijosEstructuras(0, $idEstructura, 1, 0, 0);
        } else {
            $arrayEstructuras = $this->integrator->metadatos
                ->buscarHijosEstructuras(
                    $iddominiomod, $idEstructura, 1, 0, 1
                );
            $estructuras = self::obtenerDatos($arrayEstructuras);
        }
        echo json_encode($estructuras);
    }

    private static function obtenerDatos($arrayEstructuras)
    {
        foreach ($arrayEstructuras as $key => $valores) {
            $estructuras [$key] ['id'] = $valores ['id'];
            $estructuras [$key] ['icon'] = $valores ['icon'];
            $estructuras [$key] ['checked'] = $valores ['checked'];
            $estructuras [$key] ['unchecked'] = $valores ['unchecked'];
            $estructuras [$key] ['_parent'] = $valores ['_parent'];
            $estructuras [$key] ['leaf'] = $valores ['leaf'];
            if (isset($valores ['hoja']) && $valores ['hoja']) {
                $estructuras [$key] ['leaf'] = true;
            }
            $estructuras [$key] ['text'] = $valores ['text'];
            $estructuras [$key] ['tiene'] = $valores ['tiene'];
            if ($valores ['tiene'] && !$valores ['valor']) {
                $estructuras [$key] ['expanded'] = true;
            } elseif ($valores ['tiene'] 
                && $valores ['valor'] 
                && !$valores ['checked']) {
                $estructuras [$key] ['expanded'] = true;
            }
        }

        return $estructuras;
    }

}