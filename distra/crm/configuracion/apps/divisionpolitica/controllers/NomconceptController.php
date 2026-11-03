<?php

/**
 * Componente para gestionar los conceptos.
 *
 * @package    Configuración
 * @subpackage DivisiónPolítica/Controllers
 * @copyright  XETID
 * @author     Livan A. Capote Valdés
 * @version    1.0
 */

class NomconceptController extends ZendExt_Controller_Secure
{
    /**
     * objeto de la clase GestnivelestructuralModel
     */
    private $model;

    /**
     * Constuctor de la clase
     */
    function init()
    {
        $this->model = new GestnivelestructuralModel();
        parent::init();
    }

    /**
     * Inicialización de la vista
     */
    function nomconceptAction()
    {
        /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
        $this->render();
    }

    /**
     * Adiciona objeto NomConcepto
     *
     * @return code Código de respuesta
     * @throws Doctrine_Exception
     */
    function adicionarAction()
    {
        $concepto = new NomConcept();
        $concepto->denominacion = $this->_request->getPost("denominacion");
        $concepto->descripcion = $this->_request->getPost("descripcion");
        $concepto->fechaini = $this->_request->getPost("fechaini");
        $concepto->fechafin = $this->_request->getPost("fechafin");
        try {
            $concepto->save();
            $codMsg = -1;
        } catch (Doctrine_Exception $de) {
            if ($de->getCode() == 23505) {
                $codMsg = 42;
            }
        }
        echo Zend_Json::encode(array('codMsg' => $codMsg));
    }

    /**
     * Carga los datos de NomConcepto de acuerdo con los filtros pertinentes
     *
     * @return array Arreglo con la cantidad de filas y los datos correspondientes a los par\xE1metros comienzo y fin
     */
    function cargardatosAction()
    {
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $filtrodenominacion = ($this->_request->getPost('filtrodenominacion') != '') ? strtolower(
            $this->_request->getPost('filtrodenominacion')
        ) : null;
        $filtrofechainicio = ($this->_request->getPost('filtrofechaini') != '') ? $this->_request->getPost(
            'filtrofechaini'
        ) : null;
        $filtrofechafin = ($this->_request->getPost('filtrofechafin') != '') ? $this->_request->getPost(
            'filtrofechafin'
        ) : null;
        $cantidad = NomConcept::cantidad($filtrodenominacion, $filtrofechainicio, $filtrofechafin);
        $valores = NomConcept::valores($limit, $start, $filtrodenominacion, $filtrofechainicio, $filtrofechafin);
        echo (json_encode(
            $this->retornoCargarDatos(
                $cantidad, $valores, $filtrodenominacion,
                $filtrofechainicio, $filtrofechafin
            )
        ));
    }

    /**
     * Carga los datos de NomConcepto de acuerdo con los filtros pertinentes
     *
     * @param int   $cantidad
     * @param array $valores
     * @param mixed $filtrodenominacion
     * @param date  $filtrofechainicio
     * @param date  $filtrofechafin
     *
     * @return array
     */
    private function retornoCargarDatos($cantidad, $valores, $filtrodenominacion, $filtrofechainicio, $filtrofechafin)
    {
        if ($cantidad != 0) {
            return array('cantidad_filas' => $cantidad, 'root' => $valores);
        } elseif ($filtrodenominacion == null && $filtrofechainicio == null && $filtrofechafin == null) {
            return array('cantidad_filas' => 0, 'root' => array(), 'codMsg' => 1,
                         'mensaje'        => 'No existen datos que mostrar.');
        } else {
            return array('cantidad_filas' => 0, 'root' => array(), 'codMsg' => 1,
                         'mensaje'        => 'No existen datos que se correspondan con los criterios de búsqueda
                         especificados.');
        }
    }

    /**
     * Modifica objeto NomConcept
     *
     * @return code Código de respuesta
     * @throws Doctrine_Exception
     */
    function modificarAction()
    {
        $objeto = Doctrine::getTable("NomConcept")->find($this->_request->getPost("idconceptoestructural"));
        if (is_object($objeto)) {
            try {
                $objeto->denominacion = $this->_request->getPost("denominacion");
                $objeto->descripcion = $this->_request->getPost("descripcion");
                $objeto->fechaini = $this->_request->getPost("fechaini");
                $objeto->fechafin = $this->_request->getPost("fechafin");
                $objeto->save();
                echo ("{'mesj':-1,'mensaje':'El concepto estructural ha sido modificado satisfactoriamente.'}");
                return;
            } catch (Doctrine_Exception $de) {
                /*if ($de->getCode() == 23505) {
                    $codMsg = 42;
                }*/
                echo "{'mesj':3,'mensaje':'El concepto estructural ya existe.'}";
                return;
            }
        } else {
            echo ("{'mesj':4,'mensaje':'Ya este elemento ha sido eliminado por favor refresque su web.'}");
            return;
        }
    }

    /**
     * Elimina objeto NomConcept
     *
     * @return code Código de respuesta
     * @throws Doctrine_Exception
     */
    function eliminarAction()
    {
        $objeto = Doctrine::getTable("NomConcept")->find($this->_request->getPost("idconceptoestructural"));
        try {
            $objeto->delete();
            $codMsg = 1;
            echo Zend_Json::encode(array('cod' => $codMsg));
        } catch (Doctrine_Exception $de) {
            if ($de->getCode() == 23503) {
                $codMsg = 23;
                echo Zend_Json::encode(array('cod' => $codMsg));
            } else {
                echo Zend_Json::encode(array('codMsg' => 3, 'mensaje' => $de));
            }
        }
    }

    /**
     * Desactiva objeto NomConcept
     *
     * @return code Código de respuesta
     */
    public function desactivarconceptoAction()
    {
        $concepto = Doctrine::getTable("NomConcept")->find($this->_request->getPost("idconceptoestructural"));
        $concepto->fechafin = Zend_Date :: now();
        $concepto->save();
        echo json_encode(array('codMsg' => 1, 'msgLabel' => 'lbUpdConceptSuccess'));
    }

    /**
     * Obtiene los tipos de datos
     *
     * @return array Arreglo con la cantidad de tipos y los datos tipos
     */
    function mostrartiposdatosAction()
    {
        $tipos = array(array('id' => 'integer', 'tipo' => 'integer'),
                       array('id' => 'integer unsigned', 'tipo' => 'integer unsigned'),
                       array('id' => 'float', 'tipo' => 'float'),
                       array('id' => 'float unsigned', 'tipo' => 'float unsigned'),
                       array('id' => 'varchar', 'tipo' => 'varchar'), array('id' => 'text', 'tipo' => 'text'),
                       array('id' => 'correo', 'tipo' => 'correo'));
        echo (json_encode(array('cant' => count($tipos), 'datos' => $tipos)));
    }

    /**
     * Obtiene los tipos de campos
     *
     * @return array Arreglo con la cantidad de tipos de campos y los datos tipos de campos
     */
    function mostrartiposcamposAction()
    {
        $tipos = array(array('id' => 'textfield', 'tipo' => 'textfield'),
                       array('id' => 'textarea', 'tipo' => 'textarea'),
                       array('id' => 'datefield', 'tipo' => 'datefield'),
                       array('id' => 'combo', 'tipo' => 'combo'));
        echo (json_encode(array('cant' => count($tipos), 'datos' => $tipos)));
    }

    /**
     * Obtiene los campos
     *
     * @return array Arreglo con la cantidad de campos y los datos campos
     */
    function mostrarcamposAction()
    {
        $idtabla = $this->_request->getPost('idtabla');
        $limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 10;
        $start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $campos = $this->model->buscarCampos($limit, $start, $idtabla);
        $mostrar = array('cant' => count($campos), 'datos' => $campos);
        echo (json_encode($mostrar));
    }

    /**
     * Inserta objeto NomCamponiveleav
     *
     * @return code Código de respuesta
     */
    function insertarcamposAction()
    {
        $idTabla = $this->_request->getPost('idtabla');
        $nombreCampo = $this->_request->getPost('nombre');
        $tipo = $this->_request->getPost('tipo');
        $longitud = $this->_request->getPost('longitud');
        $nombrec = $this->_request->getPost('nombre_mostrar');
        $regex = $this->clasificador($tipo);
        $visible = self::validadCampos($this->_request->getPost('visible'));
        $tipocampo = $this->_request->getPost('tipocampo');
        $descripcion = $this->_request->getPost('descripcion');
        $actual = self::validadCampos($this->_request->getPost('ac'));
        $orden = self::validadCampos($this->_request->getPost('orden'));
        $obligatorio = self::validadCampos($this->_request->getPost('obligatorio'));
        if ($valoridCampo = $this->model->insertarcampos(
            $idTabla, $nombreCampo, $tipo, $longitud, $nombrec, $regex, $visible, $tipocampo, $descripcion, $orden,
            $actual, $obligatorio, $visible
        )
        ) {
            $filas = $this->model->buscarFilas($idTabla);
            $arregloDefecto = json_decode(stripcslashes($this->_request->getPost('vpdcb')));
            if (is_array($arregloDefecto)) {
                foreach ($arregloDefecto as $elemento) {
                    $this->model->insertarValores($valoridCampo, $elemento->idvalor, $elemento->idvalor);
                }
            }
            $defecto = " ";
            switch ($tipo) {
                /*case 'int' :
                case 'float' :*/
                case 'bit' :
                    $defecto = 0;
                    break;
            }
            foreach ($filas as $fila) {
                $this->model->insertarValores($fila ['idfila'], $valoridCampo, $defecto);
            }
            echo ("{'codMsg':1,'mensaje': 'El campo ha sido adicionado satisfactoriamente.'}");
        } else {
            echo ("{'codMsg':3,'mensaje': 'Error insertando.'}");
        }
    }

    /**
     * Comprueba el valor de un campo dado
     *
     * @param mixed  $campo
     *
     * @return int
     */
    private function validadCampos($campo)
    {
        if ($campo && $campo == 1) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Obtiene el clasificador correspondiente
     *
     * @param string $tipo Tipo de clasificador
     *
     * @return string
     */
    function clasificador($tipo)
    {
        /* $clasificador default 'text' */
        $clasificador = '';
        switch ($tipo) {
            case 'integer' :
                $clasificador = '/^-?\d*$/';
                break;
            case 'integer unsigned' :
                $clasificador = '/^\d*$/';
                break;
            case 'varchar' :
                $clasificador = '/^([a-zA-Z????????????????]+ ?[a-zA-Z????????????????]*)+$/';
                break;
            case 'float' :
                $clasificador = '/^-?\d+(\.\d*)?$/';
                break;
            case 'float unsigned' :
                $clasificador = '/^\d+(\.\d*)?$/';
                break;
            case 'correo' :
                $clasificador = '/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/';
                break;
        }
        return $clasificador;
    }

    /**
     * Modifica objeto NomCamponiveleav
     *
     * @return code Código de respuesta
     */
    function modificarcamposAction()
    {
        $idcampo = $this->_request->getPost('idcampo');
        $idTabla = $this->_request->getPost('idtabla');
        $nombreCampo = $this->_request->getPost('nombre');
        $tipo = $this->_request->getPost('tipo');
        $longitud = $this->_request->getPost('longitud');
        $nombrec = $this->_request->getPost('nombre_mostrar');
        $regex = $this->clasificador($tipo);
        $visible = ($this->_request->getPost('visible')) && $this->_request->getPost('visible') == 1 ? 1 : 0;
        $tipocampo = $this->_request->getPost('tipocampo');
        $descripcion = $this->_request->getPost('descripcion');
        if ($this->model->modificarcampos(
            $idcampo, $idTabla, $nombreCampo, $tipo, $longitud, $nombrec, $regex, $visible, $tipocampo, $descripcion
        )
        ) {
            $arregloDefecto = json_decode(stripcslashes($this->_request->getPost('vpdcb')));
            if (is_array($arregloDefecto)) {
                $this->model->eliminarValorporCampo($idcampo);
                foreach ($arregloDefecto as $elemento) {
                    $this->model->insertarValores($idcampo, $elemento->idvalor, $elemento->idvalor);
                }
            }
            echo ("{'codMsg':1,'mensaje': 'El campo ha sido modificado satisfactoriamente.'}");
        } else {
            echo ("{'codMsg':3,'mensaje': 'Error modificando.'}");
        }
    }

    /**
     * Elimina objeto NomCamponiveleav
     *
     * @return code Código de respuesta
     */
    function eliminarcamposAction()
    {
        $idCampo = $this->_request->getPost('idcampo');
        /*$tabla = */
        $this->model->buscarTablaPertenece($idCampo);
        if ($this->model->cambiaractual($idCampo)) {
            echo ("{'codMsg':1,'mensaje': 'El campo ha sido eliminado satisfactoriamente.'}");
        } else {
            echo ("{'codMsg':3,'mensaje': 'No se pudo eliminar .'}");
        }
    }

    /**
     * Obtiene el valor de NomValorDefectoeav
     *
     * @return array Arreglo con la cantidad de valores y los datos de valores
     */
    function mostrarvalorcomboAction()
    {
        $idcampos = $this->_request->getPost('idcampo');
        $arreglo = $this->model->buscarValoresCampo($idcampos);
        echo json_encode(array('cant' => count($arreglo), 'datos' => $arreglo));
    }

}
