<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of AtributosporagrupacionesController
 *
 * @author gerardo
 */
class AtributosporagrupacionesController extends ZendExt_Controller_Secure
{
    private $model;

    function init()
    {
        parent::init();
        $this->model = new AtributosporagrupacionesModel();
    }

    public function atributosporagrupacionesAction()
    {
        $this->render();
    }

    public function adicionarAgrupacionAction()
    {
        $parametros = $this->_request->GetPost();
        try {
            $result = $this->model->adicionarAgrupaciones($parametros);
            if ($result == 2) {
                echo json_encode(array('Msg' => 2));
            } else {
                echo json_encode(array('Msg' => 1));
            }
        } catch (Exception $e) {
            echo json_encode(
                array('Msg' => 3, 'error' => $e->Message())
            );
        }
    }

    public function cargaragrupacionesAction()
    {
        $parametros = $this->_request->GetPost();
        try {
            $datos = $this->model->cargaragrupaciones($parametros);
            echo json_encode($datos);
        } catch (Exception $e) {
            echo json_encode(
                array('Msg' => 3, 'error' => $e->Message())
            );
        }
    }

    public function eliminarAgrupacionAction()
    {
        $parametros = $this->_request->GetPost();
        try {
            $this->model->eliminarAgrupacion($parametros);
            echo json_encode(array('Msg' => 1));
        } catch (Exception $e) {
            echo json_encode(
                array('Msg' => 3, 'error' => $e->Message())
            );
        }
    }

    /**
     *  Cargar los tipos de datos (númerico, Cadena de caracteres, etc ...) del grid de Crea y Eliminar atributos dinámicos
     */
    public function getTiposDatosAction()
    {
        echo json_encode(array('data' => $this->model->GetTiposDatos()));
    }

    /**
     *  Cargar las tablas disponibles para cuando el tipo de datos es; Nomenclador
     */
    public function getTablasAction()
    {
        echo json_encode(array('data' => $this->model->GetTablasNomencladores()));
    }

    /**
     *  Cargar los tipos de expresiones regulares ha utilizar cuando el tipo de dato es: Cadena de caracteres
     */
    public function getExpresionesAction()
    {
        echo json_encode(array('data' => $this->model->GetExpresionesRegulares()));
    }

    public function adicionarAtributoAction()
    {
        $parametros = $this->_request->getPost();
        $parametros = self::ValidarValores($parametros);
        if ($parametros['tabla']) {
            $parametros['idtablanomdinamico'] = $parametros['tabla'];
        }
        try {
            $result = $this->model->adicionarAtributo($parametros);
            if ($result == 2) {
                echo json_encode(array('failure' => true, 'codigoMsg' => 2));
            } else {
                echo json_encode(array('success' => true));
            }
        } catch (Exception $e) {
            echo json_encode(array('failure' => true));
        }
    }

    public function eliminarAtributoAction()
    {
        $parametros = new stdClass();
        $parametros->atributos = json_decode(stripcslashes($this->_request->getPost('arrayAtrib')));
        try {
            $resultado = $this->model->eliminarAtributo($parametros);
            if ($resultado == 2) {
                echo json_encode(array('Msg' => 2));
            } else {
                echo json_encode(array('Msg' => 1));
            }
        } catch (Exception $e) {
            echo json_encode(array('Msg' => 3));
        }
    }

    public function ValidarValores($arreglo)
    {
        foreach ($arreglo as $key => $value) {
            if ($value == "") {
                unset($arreglo[$key]);
            }
        }
        return $arreglo;
    }

    public function cargarAtributosAction()
    {
        $parametros = $this->_request->getPost();
        $parametros['start'] = ($parametros['start']) ? $parametros['start'] : 0;
        $parametros['limit'] = ($parametros['limit']) ? $parametros['limit'] : 20;
        try {
            echo json_encode($this->model->cargarAtributos($parametros));
        } catch (Exception $e) {
            echo json_encode(
                array('Msg' => 3, 'error' => $e->Message())
            );
        }
    }

}
