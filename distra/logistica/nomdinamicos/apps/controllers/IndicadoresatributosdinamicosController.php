<?php

/**
 * @author     Jorge Luis Cuellar Mondeja
 * @package    ConfiguraciÃ³n
 * @subpackage Nomencladores
 * @copyright  XETID
 * @version    2.0-0 - (31/08/2013)
 */
class IndicadoresatributosdinamicosController extends ZendExt_Controller_Secure
{
    protected $atribDinamModel;

    public function init()
    {
        parent :: init();
        $this->atribDinamModel = new AtributosDinamicosModel();
    }

    public function indicadoresatributosdinamicosAction()
    {
        $this->render();
    }

    /**
     * Cargar la estructura para el propertyGrid de atributos dinÃ¡micos
     */
    public function getPropertyGridAction()
    {
        echo json_encode($this->atribDinamModel->GetDatosPropertyGrid($this->_request->getPost()));
    }

    /**
     * Insertar valores a los atributos dinÃ¡micos del propertyGrid
     */
    public function insertarValoresAction()
    {

        try {
            $this->atribDinamModel->InsertarValoresAction($this->_request->getPost());
            echo json_encode(array('success' => true));
        } catch (Doctrine_Exception $e) {
            echo json_encode(array('failure' => true, 'error' => $e->getMessage()));
        }
    }

    /**
     *  Cargar datos del grid de Crea y Eliminar atributos dinÃ¡micos
     */
    public function getGridAction()
    {
        echo json_encode($this->atribDinamModel->GetDatosGrid($this->_request->getPost()));
    }

    /**
     *  Cargar los tipos de datos (nÃºmerico, Cadena de caracteres, etc ...) del grid de Crea y Eliminar atributos dinÃ¡micos
     */
    public function getTiposDatosAction()
    {
        echo json_encode(array('data' => $this->atribDinamModel->GetTiposDatos()));
    }

    /**
     *  Cargar los tipos de expresiones regulares ha utilizar cuando el tipo de dato es: Cadena de caracteres
     */
    public function getExpresionesAction()
    {
        echo json_encode(array('data' => $this->atribDinamModel->GetExpresionesRegulares()));
    }

    /**
     *  Cargar las tablas disponibles para cuando el tipo de datos es; Nomenclador
     */
    public function getTablasAction()
    {
        echo json_encode(array('data' => $this->atribDinamModel->GetTablasNomencladores()));
    }

    /**
     *  Cargar los Campos disponible de la tabla seleccionada cuando el tipo de datos es; Nomenclador
     */
    public function getCamposTablasAction()
    {
        echo json_encode(array('data' => $this->atribDinamModel->GetCamposTablasNomencladores($this->_request->getPost('idtabla'))));
    }

//    /**
//     *  Adicionar un nuevo atributo dinÃ¡mico desde un padre XXX
//     */
//    public function adicionarCampoNomAction()
//    {
//        
//    }

    /**
     *  Asociar  atributos dinÃ¡micos al indicador
     */
    public function asociarAtributosAction()
    {
        try {
            $parametros = $this->_request->getPost();
            $parametros['idatributos'] = json_decode($this->_request->getPost('idatributos'));
            $parametros['eliminarIdsAtri'] = json_decode($this->_request->getPost('eliminarIdsAtri'));
            $datos = $this->atribDinamModel->AsociarAtrbDinamico($parametros);
            if (count($datos['duplicados'])) {
                echo json_encode(array('arregloduplicados' => $datos['duplicados'], 'cod' => 2));
            } else {
                echo json_encode(array('cod' => 1, 'datos' => $datos));
            }
        } catch (Exception $e) {
            //print_r($e->getMessage());die;
            if ($e->getCode() == 23502) {
                echo json_encode(array('cod' => 4));
            } else {
                echo json_encode(array('cod' => 3));
            }
        }
    }

    /**
     *  Adicionar un nuevo atributo dinÃ¡mico
     */
    public function adicionarCampoAction()
    {
        try {
            $idtabla = $this->atribDinamModel->InsertarAtribDinamico($this->_request->getPost());
            if ($idtabla) {
                if ($this->_request->getPost('global') == 'on') {
                    echo json_encode(array('success' => true, 'idtabla' => $idtabla, 'columna' => 'idtablasgenerales'));
                } else {
                    echo json_encode(array('success' => true, 'idtabla' => $idtabla, 'columna' => 'idtablas'));
                }
            } else {
                echo json_encode(array('failure' => true, 'error' => 'duplicado'));
            }
        } catch (Exception $e) {
            print_r($e->getMessage());
            die("gerardo");
            if ($e->getCode() == 23502) {
                echo json_encode(array('failure' => true, 'cod' => 4));
            } else {
                echo json_encode(array('failure' => true, 'cod' => 3));
            }
        }
    }

    public function modificarDenominacionAction()
    {

        try {
            $this->atribDinamModel->ModificarDenomAtribDinamico($this->_request->getPost());

            echo json_encode(array('success' => true));
        } catch (Exception $e) {
            echo json_encode(array('failure' => true, 'error' => $e->getMessage()));
        }
    }

    /**
     *  Eliminar un atributos dinÃ¡mico
     */
    public function eliminarCampoAction()
    {
        try {
            $this->atribDinamModel->EliminarAtribDinamico($this->_request->getPost('idcampo'));
            echo json_encode(array('success' => true));
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                echo json_encode(array('failure' => true, 'enuso' => true));
            }
            echo json_encode(array('failure' => true, 'error' => $e->getMessage()));
        }
    }

}
