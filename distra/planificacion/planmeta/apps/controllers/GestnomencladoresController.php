<?php

/**
 * GestnomencladoresController
 * Controlador para gestionar los nomencladores
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificación
 * @ subpackage Planificación
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class GestnomencladoresController extends ZendExt_Controller_Secure
{

    /**
     * funcion init()
     * Para inicializar el modulo
     *
     * @author Dionisdel Ponce Santana
     * */
    function init()
    {
        parent::init();
    }

    /**
     * funcion gestnomencladores()
     * Para renderizar la vista
     *
     * @author Dionisdel Ponce Santana
     * */
    public function gestnomencladoresAction()
    {
        $this->render();
    }

    public function cargargruposAction()
    {
        $this->render();
    }

    /**
     * funcion listarNomencladoresTree()
     * Para renderizar la vista
     *
     * @author Dionisdel Ponce Santana
     * */
    public function listarNomencladoresTreeAction()
    {

        $dat = NomNomencladoresModel::getXMLNomencladores();

        echo json_encode($dat);
    }

    /**
     * funcion listarDatosNomenclador()
     * Para renderizar la vista
     *
     * @author Dionisdel Ponce Santana
     * */
    public function listarDatosNomencladorAction()
    {
        $node = $this->_request->getPost('node');

        if (is_array($this->_request->getPost('filtros'))) {
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

        $nom = NomNomencladoresModel::getNomById($node);
        $dat->data = NomNomencladoresModel::getConAlias(
            $parametros, $nom['domain'], $nom['alias']
        );
        echo json_encode(($dat) ? $dat : array());
    }

    /**
     * funcion adicionar()
     * Para adicionar o modificar un nomenclador
     *
     * @author Dionisdel Ponce Santana
     */
    public function adicionarAction()
    {
        $node = $this->_request->getPost('aformnode');
        $idnom = $this->_request->getPost('id');
        $denominacion = $this->_request->getPost('denominacion');
        $descripcion = $this->_request->getPost('descripcion');
        $model = new NomNomencladoresModel();
        $nom = $model->getNomById($node);
        //Si viene el id es para modificar, sino para adicionar
        if ($idnom) {
            $nomenclador = Doctrine::getTable($nom['domain'])->find($idnom);
        } else {
            eval('$nomenclador = new ' . $nom['domain'] . '();');
        }
        //seteo parámetros
        $nomenclador->denominacion = $denominacion;
        $nomenclador->descripcion = $descripcion;

        //adiciona el nuevo tipo de modelo
        $model->Insertar($nomenclador);

        // Devuelvo para la UI la confirmacion
        $dat->codMsg = 1;
        $dat->mensaje = (($idnom) ? 'mod' : 'add');
        echo json_encode($dat);
    }

    /**
     * función eliminar()
     * Para eliminar un nomenclador
     *
     * @author Dionisdel Ponce Santana
     */
    public function eliminarAction()
    {
        $node = $this->_request->getPost('node');
        $idnom = json_decode(stripslashes($this->_request->getPost('idnom')));
        $model = new NomNomencladoresModel();
        $nom = $model->getNomById($node);
        foreach ($idnom as $value) {
            $nomenclador = Doctrine::getTable($nom['domain'])->find($value);
            if ($model->Eliminar($nomenclador)) {
                $dat->codMsg = 1;
                $dat->mensaje
                    = 'El(Los) nomenclador(es) ha(n) sido eliminado(s) satisfactoriamente.';
            } else {
                $dat->codMsg = 3;
                $dat->mensaje
                    = 'El(Los) nomenclador(es) no ha(n) sido eliminado(s) satisfactoriamente.';
            }
        }

        echo json_encode($dat);
    }

}

