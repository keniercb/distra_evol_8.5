<?php

/**
 * Recuperaciones para planificacion
 * Controlador para el control del a ejecucion
 *
 * @ author Javier Lamas Collejo
 * @ package Planificacion
 * @ subpackage Planificacion material
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class ConceptoController extends ZendExt_Controller_Secure
{

    /**
     * funcion init()
     * Para inicializar el modulo
     * */
    function init()
    {
        parent::init();
    }

    public function conceptoAction()
    {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
       // $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarconceptosAction()
    {
        $identidad = $this->global->Estructura->idestructura;
        $filtros = $this->_request->getPost('filtros');
        if (is_array($filtros)) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    }
                }
            }
        }

        $start = $this->_request->getParam('start');
        $limit = $this->_request->getParam('limit');
        $response = NomConcepto::listarTodos(
            $identidad, $parametros, $start, $limit
        );
        $total = NomConcepto::obtenerTotal($identidad, $parametros);
        echo json_encode(array('data' => $response, 'total' => $total));
    }

    public function cargardatosconceptoAction()
    {
        $idconcepto = $this->_request->getParam('idselected');
        $response = NomConcepto::obtenerDatosConceptoDadoId($idconcepto);
        echo json_encode($response);
    }

    public function insertupdateconceptoAction()
    {
        $idconcepto = $this->_request->getParam('idconcepto');
        $denominacion = $this->_request->getParam('denominacion');
        $descripcion = $this->_request->getParam('descripcion');
        $color = $this->_request->getParam('color');
        $concepto = new NomConcepto();
        if ($idconcepto) {
            $existe = NomConcepto::existeDenominacionModificar(
                $denominacion, $idconcepto
            );
            if (empty($existe[0])) {
                $concepto = NomConcepto::obtenerConceptoDadoId($idconcepto);
                $concepto->color = $color;
                $concepto->denominacion = $denominacion;
                $concepto->descripcion = $descripcion;
                $idconcepto = NomConceptoModel::insertarnom_concepto($concepto);
            } else {
                $idconcepto = -2;
            }
        } else {
            $identidad = $this->global->Estructura->idestructura;
            $luzverde = NomConcepto::obtenerConceptoDadoDenominacion(
                $denominacion, $identidad
            );
            if (empty($luzverde[0])) {
                $concepto->color = $color;
                $concepto->denominacion = $denominacion;
                $concepto->descripcion = $descripcion;
                $concepto->uriconcepto = strtolower(
                    str_replace(' ', '', $denominacion)
                );
                $idconcepto = NomConceptoModel::insertarnom_concepto($concepto);
                $integrator = ZendExt_IoC::getInstance();
                $estructura = $integrator->metadatos->DameEstructura(
                    $identidad
                );
                $conceptoEspecialidad = new DatConceptoespecialidad();
                $conceptoEspecialidad->idconcepto = $idconcepto;
                $conceptoEspecialidad->idespecialidad
                    = $estructura[0]->idespecialidad;
                $idconceptoespecialidad
                    = DatConceptoespecialidadModel::insertardatConceptoespecialidad(
                        $conceptoEspecialidad
                    );
            } else {
                $idconcepto = -2;
            }
        }
        echo json_encode(
            array('cod' => $idconcepto, 'nomod' => $idconceptoespecialidad)
        );
    }

    public
    function eliminarconceptoAction()
    {
        $idsconceptos = json_decode(
            stripslashes($this->_request->getParam('todelete'))
        );
        $res = NomConceptoModel::eliminarConceptos($idsconceptos);
        echo json_encode(array('cod' => $res));
    }

}
