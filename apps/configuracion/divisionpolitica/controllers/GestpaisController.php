<?php

/**
 * Componente para gestionar el nomenclador de conceptos.
 *
 * @package    Configuración
 * @subpackage DivisiónPolítica/Controllers
 * @copyright  XETID
 * @author     Livan A Capote Valdés
 * @version    1.0
 */

class GestpaisController extends ZendExt_Controller_Secure
{
    /**
     * Objeto de la clase NomPaisModel
     */
    private $model;

    /**
     * Constuctor de la clase
     */
    function init()
    {
        parent::init();
        $this->model = new NomPaisModel();
    }

    /**
     * Inicialización de la vista
     */
    public function gestpaisAction()
    {
        $this->render();
    }

    /**
     * Chequea la existencia de un país en la base de datos que cumpla con cualquier par\xE1metro
     *
     * @param string $nombrepais Nombre del país
     * @param string $siglas     Siglas del país
     * @param int    $codigo     del país
     *
     * @return code Código de respuesta, "-1" en caso de no coincidencia
     */
    function existePais($nombrepais, $siglas, $codigo)
    {
        $existenombre = Doctrine::getTable('NomPais')->findBy('nombrepais', $nombrepais)->toArray();
        if ($existenombre) {
            return -2;
        }else{
            $existeCodigo = Doctrine::getTable('NomPais')->findBy('codigopais', $codigo)->toArray();
            if ($existeCodigo) {
                return -4;
            }else{
                $existesigla = Doctrine::getTable('NomPais')->findBy('siglas', $siglas)->toArray();
                if ($existesigla) {
                    return -3;
                }
            }

        }


        return -1;
    }

    /**
     * Chequea la existencia de un país en la base de datos que cumpla con todos los par\xE1metros
     *
     * @param string $nombrepais Nombre del país
     * @param string $siglas     Siglas del país
     * @param int    $id         Identificador de país
     * @param int    $codigo     del país
     *
     * @return bool "true" en caso de coincidencia
     */
    function existePaisM($nombrepais, $siglas, $id, $codigo)
    {
        $cntPais = NomPais::getPaisesNomodificados($nombrepais, $siglas, $id, $codigo);
        if ($cntPais[0]['count'] > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Adiciona objeto NomPais
     *
     * @return code Código de respuesta
     */
    public function adicionarAction()
    {
        $pais = new NomPais();
        $pais->nombrepais = $this->_request->getPost("nombrepais");
        $pais->codigopais = $this->_request->getPost("codigopais");
        $pais->siglas = $this->_request->getPost("siglas");
        $pais->nacionalidad = $this->_request->getPost("nacionalidad");
        $pais->fechainicio = $this->_request->getPost("fechainicio");
        $pais->fechafin = $this->_request->getPost("fechafin");
        $result = $this->existePais(
            $this->_request->getPost("nombrepais"), $this->_request->getPost("siglas"),
            $this->_request->getPost("codigopais")
        );
        if ($result != -1) {
            echo("{'codMsg':$result}");
            return;
        } else {
            $pais->save();
            echo("{'codMsg':-1}");
            return;
        }
    }

    /**
     * Obtiene todos los datos de País
     *
     * @return array Arreglo con la cantidad de filas y los valores de país
     */
    public function cargardatosAction()
    {
        $start = ($this->_request->getPost("start")) ? $this->_request->getPost("start") : 0;
        $limit = ($this->_request->getPost("limit")) ? $this->_request->getPost("limit") : 20;
        $filtrocodigo = $this->_request->getPost('filtrocodigo');
        $fitrosiglas = $this->_request->getPost('fitrosiglas');
        $filtrodenominacion = strtolower($this->_request->getPost('filtrodenominacion'));
        $filtrofechainicio = $this->_request->getPost('filtrofechainicio');
        $filtrofechafin = $this->_request->getPost('filtrofechafin');
        $cantidad = NomPais::cantidad(
            $filtrodenominacion, $filtrofechainicio, $filtrofechafin, $filtrocodigo, $fitrosiglas
        );
        $valores = NomPais::valores(
            $limit, $start, $filtrodenominacion, $filtrofechainicio, $filtrofechafin, $filtrocodigo, $fitrosiglas
        );
        if ($filtrocodigo || $fitrosiglas || $filtrodenominacion || $filtrofechainicio || $filtrofechafin) {
            include_once Zend_Registry::get('config')->dir_aplication .
                'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
            $valores = UtilesDatosMaestros::colorSearch($valores,
                array('codigopais', 'siglas', 'nombrepais', 'fechainicio', 'fechafin'),
                array($filtrocodigo, $fitrosiglas, $filtrodenominacion, $filtrofechainicio, $filtrofechafin));
        }
        if ($cantidad != 0) {
            echo(json_encode(array('cantidad_filas' => $cantidad, 'root' => $valores)));
        } else {
            echo(json_encode(array('cantidad_filas' => 0, 'root' => array())));
        }
    }

    /**
     * Obtiene todos los datos de reporte
     *
     * @return array
     */
    public function obtenerdatosreporteAction()
    {
        $dataReport = $this->model->obtenerDatosImprimirReporte();
        echo json_encode($dataReport);
    }

    /**
     * Modifica el país seleccionado
     *
     * @return code Código de respuesta
     */
    public function modificarAction()
    {
        $nomPais = $this->_request->getPost("nombrepais");
        $siglasP = $this->_request->getPost("siglas");
        $idpais = $this->_request->getPost("idpais");
        $codigo = $this->_request->getPost("codigopais");
        $objpais = new NomPais();
        $objpais->nombrepais = $nomPais;
        $objpais->siglas = $siglasP;
        $objpais->codigopais = $codigo;
        $objpais->idpais = $idpais;
        $result = NomPais::verificarModpais($objpais);
        if ($result != -1) {
            echo("{'codMsg':$result}");
            return;
        } else {
            $pais = Doctrine::getTable("NomPais")->find($this->_request->getPost("idpais"));
            if (is_object($pais)) {
                $pais->nombrepais = ($this->_request->getPost("nombrepais") != '') ? $this->_request->getPost(
                    "nombrepais"
                ) : die("{'codMsg':3}");
                $pais->codigopais = $this->_request->getPost("codigopais");
                $pais->siglas = $this->_request->getPost("siglas");
                $pais->nacionalidad = $this->_request->getPost("nacionalidad");
                $pais->fechainicio = $this->_request->getPost("fechainicio");
                $pais->fechafin = $this->_request->getPost("fechafin");
                $pais->save();
                echo("{'codMsg':-1}");
                return;
            } else {
                die("{'codMsg':3}");
            }
        }
    }

    /**
     * Elimina el país seleccionado
     *
     * @return code Código de respuesta
     * @throws Exception
     */
    public function eliminarAction()
    {
        try {
            $objeto = Doctrine::getTable("NomPais")->find($this->_request->getPost("idpais"));
            if (is_object($objeto)) {
//                $objeto->delete();
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                $conexionActual->fetchAll(
                    "DELETE FROM mod_datosmaestros.nom_pais pais WHERE $objeto->idpais = pais.idpais;"
                );
                echo("{'codMsg':-1}");
                return;
            } else {
                echo("{'codMsg':3}");
            }
        } catch (Exception $ex) {
            if ($ex->getCode() == 23503) {
                echo("{'codMsg':-2}");
                return;
            }
        }
    }

    /**
     * Obtiene todos los países
     *
     * @return array Arreglo con la cantidad de filas y los datos de país
     * @throws Exception
     */
    public function getnompaisesAction()
    {
        try {
            $model = new GestnomencladoresModel();
            $paises = $model->getPaises();
            echo json_encode(array('cantidad_filas' => count($paises), 'root' => $paises));
            return;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

}
