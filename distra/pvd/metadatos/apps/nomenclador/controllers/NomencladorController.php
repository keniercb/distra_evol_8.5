<?php

/***
 * Class NomencladorController
 * Descripción de la clase: Clase encargada de la gestión de los nomencladores
 *
 * @author    : Ing. Javier Limonta
 * @modify    : Ing. Yoandry Borges
 * @modify    : Ing. Daymel Machado
 * @modify    : Ing. Osvaldo M. Gonzalez
 * @copyright Copyright (c) 2013 xetid
 */
class NomencladorController extends ZendExt_Controller_Secure
{
    /**
     *
     */
    function init()
    {
        parent::init();
    }

    /**
     * Descripción del método: Carga los archivos JavaScript
     *
     * @return void : Mostrar los archivos JavaScript
     * @author    : Ing. Javier Limonta
     * @copyright Copyright (c) 2013 xetid
     */
    function gestionarnomencladorAction()
    {
        $this->render();
    }

    /**
     * Descripción del método: Gestiona todas las acciones sobre los nomencladores,
     * incluye los adicionar, modificar, eliminar, desactivar y activar los
     * nomencladores
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function gestionarAccionesAction()
    {
        $clase = $this->_request->getPost('clase');
        $accion = $this->_request->getPost('accion');
        $params = json_decode(stripslashes($this->_request->getPost('parametros')));
        $evento = self::getClass($clase, $accion);
        if (call_user_func_array($evento, array($params))) {
            echo("{'codMsg':1, 'mensaje' : '" . UtilModel::getMensajesNomencladores($accion, $params[1]) . "' }");
        } else {
            echo("{'codMsg':6, 'mensaje' : '" . UtilModel::getMensajesNomencladores($accion, $params[1], true) . "' }");
        }
    }

    /**
     * Descripción del método: Gestiona la jerarquia de los grados dentro del nomeclador en cuestion
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function gestionarOrdenAction()
    {
        $clase = $this->_request->getPost('clase');
        $accion = $this->_request->getPost('accion');
        $evento = $this->_request->getPost('evento');
        $params = json_decode(stripslashes($this->_request->getPost('parametros')));
        $params [] = array('accion' => $evento);
        $evento = self::getClass($clase, $accion);
        if (call_user_func_array($evento, array($params))) {
            echo("{'codMsg':1, 'mensaje' : '" . UtilModel::getMensajesNomencladores($accion, $params[0]) . "' }");
        } else {
            echo("{'codMsg':6, 'mensaje' : '" . UtilModel::getMensajesNomencladores($accion, $params[0], true) . "' }");
        }
    }

    /**
     * Descripción del método: Encargada de mostrar los elementos de los grid de todos
     * los nomencladores segun los parametros insertados
     *
     * @author    : Ing. Osvaldo Manuel Gonzalez Ortiz
     * @copyright Copyright (c) 2013 xetid
     */
    function mostrarValoresAction()
    {

        //die('A');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $clase = $this->_request->getPost('clase');
        $dir = $this->_request->getPost('dir');
        $sort = $this->_request->getPost('sort');

        $accion = $this->_request->getPost('accion');
        $gestion = $this->_request->getPost('gestion');
        $idgrupocomplejidad = $this->_getParam('idgrupocomplejidad', false);
        $params = json_decode(stripslashes($this->_request->getPost('parametros')));
        if (is_string($accion)) {
            $evento = self::getClass($clase, $accion);
            if ($params || is_numeric($idgrupocomplejidad)) {
                if ($params) {
                    $gestion = $params;
                } else {
                    if (is_numeric($idgrupocomplejidad)) {
                        $gestion = array($idgrupocomplejidad);
                    }
                }
            }
            $datos = call_user_func_array($evento, array($gestion));
            $mostrar = array('datos' => $datos);
            echo(json_encode($mostrar));
        } else {
            $evento = self::getClass($clase, 'cantidad');
            $cantidad = call_user_func_array($evento, array($params));
            $evento = self::getClass($clase, 'buscar');
            $valores = array($limit, $start, $params, $dir, $sort);
            $datos = call_user_func_array($evento, array($valores));
            $mostrar = array('cant' => $cantidad, 'datos' => $datos);
            echo(json_encode($mostrar));
        }
    }

    /**
     * Descripcion del metodo: Encargado de la creacion del arreglo con la clase y la accion segun los datos del
     * nomenclador
     *
     * @author Ing.Osvaldo Manuel Gonzalez
     *
     * @param $clase
     * @param $accion
     *
     * @return array
     */
    private static function getClass($clase, $accion)
    {
        $varClase = "";
        $clases = array(
            'organo' => 'NomOrganoModel', 'organoi' => 'NomOrganoModel', 'agrupacion' => 'NomOrganoModel',
            'sector' => 'NomSectorModel','nivelcargo' => 'NomNivelCargoModel',
            'agrupacioni' => 'NomOrganoModel', 'noformal' => 'NomOrganoModel', 'cargo' => 'NomCargoModel',
            'subcategoria' => 'NomCategoriaModel', 'categoria' => 'NomCategocupModel',
            'categoria_domain' => 'NomCategoria', 'grado' => 'NomGradoModel', 'grupo' => 'NomGrupoComplejidadModel',
            'grupo_domain' => 'NomGrupocomplejidad', 'preparacion' => 'NomPreparacionModel',
            'salario' => 'NomSalarioModel', 'salario_domain' => 'NomSalario',
            'subordinacion' => 'NomSubordinacionModel', 'tipomedio' => 'NomTipoMedioModel',
            'icono' => 'NomIconoModel', 'categoriamilitar' => 'NomCategoriaMilitar',
            'tipoescala' => 'NomTipoEscalaModel', 'tipoescala_domain' => 'NomTipoEscala',
            'escala' => 'NomEscalaSalarialModel', 'escala_domain' => 'NomEscalaSalarial',
            'normajuridica' => 'NomNormaJuridicaModel', 'normajuridica_domain' => 'NomNormaJuridica',
            'cargofacultado' => 'NomCargoFacultadoModel', 'cargofacultado_domain' => 'NomCargoFacultado',
            'firma' => 'NomFirmaModel',
            'complemento_domain' => 'AuxComplementoModel', 'complemento' => 'AuxComplemento');
        foreach ($clases as $key => $value) {
            if ($key == $clase) {
                $varClase = $value;
            }
        }
        return array($varClase, $accion);
    }

    /**
     * Construye el icono fisico de la direccion especificada para mostrarlo
     * en el componente iconcombo
     *
     * @author    : Ing.Osvaldo Gonzalez
     * @internal  param $img
     * @copyright Copyright (c) 2013 xetid
     */
    function getIconAction()
    {
        header('Content-type: image/gif');
        $img = imagecreatefromgif($_GET ['icon']);
        imagegif($img);
    }

    function gestionarComplementosSalarialesAction()
    {
        $accion = $this->_request->getPost('accion');
        $idcomplemento = json_decode($this->_request->getPost('idcomplemento'));
        $model = new AuxComplementoModel();
        switch ($accion) {
            case 'insertar':
                if ($model->insertar($idcomplemento)) {
                    echo("{'codMsg':1, 'mensaje' : 'El complemento salarial ha sido adicionado satisfactoriamente' }");
                } else {
                    echo("{'codMsg':6, 'mensaje' : 'Ha ocurrido un error al adicional el complemento salarial' }");
                }
                break;
            case 'eliminar':
                if ($model->eliminar($idcomplemento)) {
                    echo("{'codMsg':1, 'mensaje' : 'El complemento salarial ha sido eliminado satisfactoriamente' }");
                } else {
                    echo("{'codMsg':6, 'mensaje' : 'Ha ocurrido un error al eliminar el complemento salarial' }");
                }
                break;
        }
    }

    function mostrarComplementosAction()
    {
        $limit = (int)$this->_request->getPost('limit');
        $start = (int)$this->_request->getPost('start');
        $busqueda = '';
        $params = json_decode(stripslashes($this->_request->getPost('parametros')));
        if (count($params) > 1) {
            if ($params[1]->denominacion && $params[1]->denominacion != 'Criterio a buscar...') {
                $busqueda = (string)($params[1]->denominacion);
            }
            if ($params[2]->abreviatura && $params[2]->abreviatura != 'Criterio a buscar...') {
                $busqueda = (string)($params[1]->abreviatura);
            }
        }
        $model = new AuxComplemento();
        $cantidad = $model->cantidad($busqueda);
        if ($busqueda['denominacion'] == 'Criterio a buscar...') {
            $busqueda['denominacion'] = '';
        }
        if ($busqueda['abreviatura'] == 'Criterio a buscar...') {
            $busqueda['abreviatura'] = '';
        }

        $datos = $model->dameTodos($start, $limit, $busqueda);
        $mostrar = array('cant' => $cantidad, 'datos' => $datos);
        echo(json_encode($mostrar));
    }

    function getDominiosHijosAction()
    {
        $model = new NomFirmaModel();
        echo(json_encode($model->getDominiosHijos()));
    }
}
