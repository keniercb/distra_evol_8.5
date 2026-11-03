<?php

/**
 * Componente para gestinar los niveles estructurales.
 *
 * @package    Configuración
 * @subpackage DivisiónPolítica/Controllers
 * @copyright  UCID Cuba
 * @author     Livan A Capote Valdez
 * @version    1.0-0
 */

class GestnivelestructuralController extends ZendExt_Controller_Secure
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

    function gestnivelestructuralAction()
    {
        /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
        $this->render();
    }

    /**
     * Obtiene todas las tablas de nivel estructural
     *
     * @author Livan A Capote Valdes
     * @return array Arreglo con la cantidad y los datos de NomNivelestructural
     */
    function TablasAction()
    {
        $concepto = ($this->_request->getPost('idconceptoestructural') != '') ? $this->_request->getPost(
            'idconceptoestructural'
        ) : die("{'codMsg':3}");

        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');

        $cantidad = NomNivelestructural::cantidad($concepto);
        $valores = NomNivelestructural::cargar($limit, $start, $concepto);
        echo (json_encode(array('cant' => $cantidad, 'datos' => $valores)));
    }

    /**
     * Inserta objeto NomNivelestructural
     *
     * @author Livan A Capote Valdes
     * @return code Código respuesta
     */
    function insertarTablasAction()
    {
        $root = ($this->_request->getPost('root')) ? 1 : 0;
        $concepto = ($this->_request->getPost('concepto')) ? 1 : 0;
        /* ---Necesito comprobar que no se ha insertado ya el elemento--- */
        $comprobar = NomNivelestructural::comprobarAdic(
            $this->_request->getPost('idconceptoestructural'), $this->_request->getPost('idconceptonivel')
        );
        if ($comprobar == 0) {
            $objeto = new NomNivelestructural();
            $objeto->idconceptonivel = self::isNull($this->_request->getPost('idconceptonivel'));
            $objeto->fechaini = self::isNull($this->_request->getPost('fechaini'));
            $objeto->fechafin = self::isNull($this->_request->getPost('fechafin'));
            $objeto->concepto = $concepto;
            $objeto->raiz = $root;
            $objeto->idconceptoestructural = self::isNull($this->_request->getPost('idconceptoestructural'));
            if ($this->model->insertar($objeto)) {
                $codMsg = 1;
            }
        } else {
            $codMsg = 42;
        }
        echo Zend_Json::encode(array('codMsgg' => $codMsg));
    }

    /**
     * Verifica la existencia de un valor dado
     *
     * @param mixed $value
     *
     * @return mixed $value
     */
    private function isNull($value)
    {
        return $value != '' ? $value : null;
    }

    /**
     * Busca todas las conexiones
     *
     * @author Livan A Capote Valdes
     * @return array Arreglo con la cantidad y los datos de las conexiones
     */
    function buscarconexionesAction()
    {
        $idTabla = $this->_request->getPost('idtabla');
        $start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;
        if (isset($idTabla)) {
            $cantidad = $this->model->cantidadConexiones($idTabla);
            $arreglo = $this->model->buscarConexiones($idTabla, $start, $limit, true);
            echo json_encode(array('cant' => $cantidad, 'datos' => $arreglo));
        } else {
            echo json_encode(array('cant' => 0, 'datos' => array()));
        }
    }

    /**
     * Inserta objeto NomnivelestructuralNomNivelestructural
     *
     * @author Livan A Capote Valdes
     * @return code Código de respuesta
     */
    function insertarconexionesAction()
    {
        $objeto = new NomnivelestructuralNomnivelestructural();
        $objeto->idorigen = $this->_request->getPost('idtabla');
        $objeto->iddestino = $this->_request->getPost('idrelacion');
        if ($this->model->insertar($objeto)) {
            echo ("{'codMsgg':-1}");
        } else {
            echo ("{'codMsg':3}");
        }
    }

    /**
     * Obtiene el nomenclador de conceptos
     *
     * @author Livan A Capote Valdes
     * @return array Arreglo con la cantidad de filas y los datos de NomConceptoivel
     */
    function getConceptonivelAction()
    {
        $datos = NomConceptonivel::gettodos();
        echo json_encode(array('cantidad_filas' => count($datos), 'root' => $datos));
        return;
    }

    /**
     * Elimina objeto NomNivelestructural
     *
     * @author Livan A Capote Valdes
     * @return code Código de respuesta
     */
    function eliminartablaAction()
    {
        $idTabla = $this->_request->getPost('idtabla');
        $result = NomNivelestructural::buscarObjet($idTabla);
        if (!$result) {
            $objeto = Doctrine::getTable('NomNivelestructural')->find($idTabla);
            if (is_object($objeto)) {
                if ($this->model->eliminar($objeto)) {
                    $codMsg = 1;
                }
            } else {
                $codMsg = 1;
            }
        } else {
            $codMsg = 2;
        }
        echo Zend_Json::encode(array('cod' => $codMsg));
    }

    /**
     * Elimina objeto NomnivelestructuralNomnivelestructural
     *
     * @author Livan A Capote Valdes
     * @return code Código de respuesta
     */
    function eliminarconexionesAction()
    {
        $iddestino = $this->_request->getPost('idrelacion');
        $idorigen = $this->_request->getPost('idtabla');
        $objeto = Doctrine::getTable('NomnivelestructuralNomnivelestructural')->find(array($idorigen, $iddestino));
        if ($objeto instanceof NomnivelestructuralNomnivelestructural) {
            if ($this->model->eliminar($objeto)) {
                $codMsg = 1;
            }
        } else {
            $codMsg = 23;
        }
        echo Zend_Json::encode(array('cod' => $codMsg));
    }

    /**
     * Modifica objeto NomNivelestructural
     *
     * @author Livan A Capote Valdes
     * @return code Código de respuesta
     */
    function modificarTablasAction()
    {
        $idnivelestructural = ($this->_request->getPost('idnivelestructural') != '') ? $this->_request->getPost(
            'idnivelestructural'
        ) : die("{'codMsg':3,'mensaje':'Debe de seleccionar en nivel.'}");
        $comprobar = NomNivelestructural::comprobar(
            $this->_request->idconceptoestructural, $this->_request->idconceptonivel, $idnivelestructural
        );
        if ($comprobar == 0) {
            $objeto = Doctrine::getTable('NomNivelestructural')->find($idnivelestructural);
            if (is_object($objeto)) {
                $objeto->fechaini = $this->_request->getPost('fechaini');
                $objeto->fechafin = $this->_request->getPost('fechaf');
                $objeto->raiz = ($this->_request->getPost('root')) ? 1 : 0;
                $objeto->concepto = ($this->_request->getPost('concepto')) ? 1 : 0;
                $objeto->idconceptonivel = $this->_request->getPost('idconceptonivel');
                $objeto->idconceptoestructural = $this->_request->getPost('idconceptoestructural');
                if ($this->model->modificar($objeto)) {
                    $codMsg = 2;
                }
            } else {
                $codMsg = 3;
            }
        } else {
            $codMsg = 42;
        }
        echo Zend_Json::encode(array('codMsgg' => $codMsg));
    }

    /**
     * Obtiene los datos adicionales de NomCamponiveleav
     *
     * @author Livan A Capote Valdes
     * @return array
     */
    function obtenerDatosadicionalesAction()
    {
        $idconceptoestructural = $this->_request->getPost('idconceptoestructural');
        $mostrarOcultos = false;
        $campos = NomConcept::obtenerDatosadicionales($idconceptoestructural, $mostrarOcultos);
        $arregloRetorno [0] = array('cantidad' => count($campos [0] ['NomCamponiveleav']));
        for ($i = 0; $i < count($campos [0] ['NomCamponiveleav']); $i++) {
            //$data = array();
            $obligatorio = ($campos [0] ['NomCamponiveleav'] [$i] ['obligatorio'] == 1) ? false : true;
            $datos = array('xtype' => $campos [0] ['NomCamponiveleav'] [$i] ['tipocampo'],
                           'fieldLabel' => utf8_decode($campos [0] ['NomCamponiveleav'] [$i] ['nombre_mostrar']),
                           'id' => $campos [0] ['NomCamponiveleav'] [$i] ['idcampo'],
                           'maxLength' => $campos [0] ['NomCamponiveleav'] [$i] ['longitud'],
                           'name' => $campos [0] ['NomCamponiveleav'] [$i] ['nombre'],
                           'regex' => $campos [0] ['NomCamponiveleav'] [$i] ['regex'], 'allowBlank' => $obligatorio,
                           'value' => '');
            //-- si es un combo hay que agrupar todos los valores que tiene ese campo
            if ($campos [0] ['NomCamponiveleav'] [$i] ['tipocampo'] == 'combo') {
                $valores = NomValorDefectoeav::buscarValoresDefecto($campos [0] ['NomCamponiveleav'] [$i] ['idcampo']);
                $val = array();
                foreach ($valores as $v) {
                    $val [] = array($v ['valor'], $v ['valor']);
                }
                $datos ['data'] = $val;
            } else {
                $val = NomValorDefectoeav::buscarValoresDefecto($campos [0] ['NomCamponiveleav'] [$i] ['idcampo'], 1);
                $datos ['value'] = ($val [0] ['valor']) ? $val [0] ['valor'] : '';
            }
            $arregloRetorno [] = $datos;
        }
        echo json_encode($arregloRetorno);
        return;
    }

}
