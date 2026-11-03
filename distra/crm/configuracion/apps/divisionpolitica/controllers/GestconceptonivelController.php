<?php

/**
 * Componente para gestionar los conceptos de niveles estructurales.
 *
 * @package    Configuración
 * @subpackage DivisiónPolítica/Controllers
 * @copyright  XETID
 * @author     Livan A Capote Valdés
 * @version    1.0-0
 */

class GestconceptonivelController extends ZendExt_Controller_Secure
{

    /**
     * Constuctor de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Inicialización de la vista
     */
    public function gestconceptonivelAction()
    {
        /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
        $this->render();
    }

    /**
     * Adiciona un objeto NomConceptonivel
     *
     * @return code Código de respuesta
     * @throws Doctrine_Exception
     */
    public function adicionarAction()
    {
        $concepto = new NomConceptonivel();
        $concepto->denominacion = ($this->_request->getPost("denominacion") != '') ? $this->_request->getPost(
            "denominacion"
        ) : die("{'codMsg':3}");
        $concepto->descripcion = $this->_request->getPost("descripcion");
        $concepto->fechaini = $this->_request->getPost("fechaini");
        $concepto->fechafin = $this->_request->getPost("fechafin");
        try {
            $concepto->save();
            echo "{'codMsg':-1}";
            return;
        } catch (Doctrine_Exception $de) {
            /*if ($de->getCode() == 23505) {
                $codMsg = 42;
            }*/
            echo "{'codMsg':-2}";
            return;
        }
    }

    /**
     * Obtiene todos los datos de NomConceptonivel, según los filtros definidos
     *
     * @return array Arreglo con la cantidad de filas y los valores
     */
    public function cargardatosAction()
    {
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $filtrodenominacion = ($this->_request->getPost('filtrodenominacion') != '') ? strtolower(
            $this->_request->getPost('filtrodenominacion')
        ) : null;
        $filtrofechaini = ($this->_request->getPost('filtrofechaini') != '') ? $this->_request->getPost(
            'filtrofechaini'
        ) : null;
        $filtrofechafin = ($this->_request->getPost('filtrofechafin') != '') ? $this->_request->getPost(
            'filtrofechafin'
        ) : null;
        $cantidad = NomConceptonivel::cantidad($filtrodenominacion, $filtrofechaini, $filtrofechafin);
        $valores = NomConceptonivel::valores($limit, $start, $filtrodenominacion, $filtrofechaini, $filtrofechafin);
        if ($filtrodenominacion || $filtrofechafin || $filtrofechaini) {
            include_once Zend_Registry::get('config')->dir_aplication .
                'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
            $valores = UtilesDatosMaestros::colorSearch($valores,
                array('denominacion', 'fechaini', 'fechafin'),
                array($filtrodenominacion, $filtrofechaini, $filtrofechafin));
        }
        if (count($valores) != 0) {
            echo(json_encode(array('cantidad_filas' => $cantidad, 'root' => $valores)));
        } else {
            echo(json_encode(array('cantidad_filas' => 0, 'root' => array())));
        }
    }

    /**
     * Modifica un objeto NomConceptonivel
     *
     * @return code Código de respuesta
     * @throws Doctrine_Exception
     */
    public function modificarAction()
    {
        $objeto = Doctrine::getTable("NomConceptonivel")->find($this->_request->getPost("idconceptonivel"));
        if (is_object($objeto)) {
            try {
                $objeto->denominacion = $this->_request->getPost("denominacion");
                $objeto->descripcion = $this->_request->getPost("descripcion");
                $objeto->fechaini = $this->_request->getPost("fechaini");
                $objeto->fechafin = $this->_request->getPost("fechafin");
                $objeto->save();
                echo "{'codMsg':-1}";
                return;
            } catch (Doctrine_Exception $de) {
                /*if ($de->getCode() == 23505) {
                    $codMsg = 42;
                }*/
                echo "{'codMsg':-2}";
                return;
            }
        } else {
            die("{'codMsg':3}");
        }
    }


    /**
     * Elimina un objeto NomConceptonivel
     *
     * @return code Código de respuesta
     * @throws Doctrine_Exception
     */
    public function eliminarAction()
    {
        $objeto = Doctrine::getTable("NomConceptonivel")->find($this->_request->getPost("idconceptonivel"));

        if (is_object($objeto)) {
            try {
                $objeto->delete();
                echo "{'codMsg':-1}";
                return;
            } catch (Doctrine_Exception $ee) {
                if ($ee->getCode() == 23503) {
                    die("{'codMsg':-2}");
                }
                return false;
            }
        } else {
            die("{'codMsg':-3}");
        }
    }

}
