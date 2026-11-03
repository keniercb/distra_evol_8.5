<?php

/**
 * GestcomentarioController
 * Controlador para gestionar los modelos
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificación
 * @ subpackage Planificación
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class GestcomentarioController extends ZendExt_Controller_Secure
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
     * funcion adicionarComentario()
     * Para adicionar o modificar un plan
     *
     * @author Dionisdel Ponce Santana
     */
    public function adicionarComentarioAction()
    {
        $idcomentario = $this->_request->getPost('idcomentario');
        $idelemento = $this->_request->getPost('idelemento');
        $idtipocomentario = $this->_request->getPost('idtipocomentario');
        $idtipodocumento = $this->_request->getPost('idtipodocumento');
        $asunto = $this->_request->getPost('asunto');
        $descripcion = $this->_request->getPost('descripcioncoment');
        $fechacreado = date('d-m-Y'); //Aqui se toma la fecha y hora de php
        $perfil = $this->getPerfil();
        $idusuario = $perfil->idusuario;

        //envio los datos para la model de comentario
        $model = new DatComentarioModel();
        $model->Insertar(
            $idcomentario, $idelemento, $idtipocomentario, $idtipodocumento,
            $asunto, $descripcion, $fechacreado, $idusuario
        );

        // Devuelvo para la IU la confirmacion
        $dat->codMsg = 1;
        $dat->mensaje = 'El comentario ha sido ' . (($idcomentario)
                ? 'modificado'
                :
                'adicionado') . ' satisfactoriamente.';
        echo json_encode($dat);
    }

    /**
     * funcion listarTiposComentariosAction()
     * Para listar los tipos de comentarios
     *
     * @author Dionisdel Ponce Santana
     */
    public function listarTiposComentariosAction()
    {
        $dat->data = NomTipocomentario::getTiposComentariosCombo();
        echo json_encode($dat);
    }

    /**
     * funcion listarComentarios()
     * Para listar los comentarios dado un idelemento
     *
     * @author Dionisdel Ponce Santana
     */
    public function listarComentariosAction()
    {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $idelemento = $this->_request->getPost('idelemento');

        //pregunto por los filtos y si biene alguno lo agrego a la busqueda
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'asunto') {
                    $parametros['filtros']['asunto'] = $datos['data']['value'];
                } elseif ($datos['field'] == 'descripcion') {
                    $parametros['filtros']['descripcion']
                        = $datos['data']['value'];
                } elseif ($datos['field'] == 'tcomentario') {
                    $parametros['filtros']['tcomentario']
                        = $datos['data']['value'];
                } elseif ($datos['field'] == 'usuario') {
                    $parametros['filtros']['usuario'] = $datos['data']['value'];
                } elseif ($datos['field'] == 'fechacreado') {
                    if ($datos['data']['comparison'] == "gt") {
                        $parametros['filtros']['fechacreado_condicion1']
                            = array('fecha'     => $datos['data']['value'],
                                    'condicion' => ">");
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $parametros['filtros']['fechacreado_condicion2']
                            = array('fecha'     => $datos['data']['value'],
                                    'condicion' => "<");
                    } else {
                        $parametros['filtros']['fechacreado_condicion3']
                            = array('fecha'     => $datos['data']['value'],
                                    'condicion' => "=");
                    }
                }
            }
        }


        $model = new DatComentarioModel();
        $result = $model->Listar($start, $limit, $idelemento, $parametros);
        echo json_encode($result);
    }

    /**
     * funcion eliminarComentario()
     * Para eliminar un comentario
     *
     * @author Dionisdel Ponce Santana
     */
    public function eliminarComentarioAction()
    {
        $idcomentario = $this->_request->getPost('idcomentario');
        $model = new DatComentarioModel();
        $model->Eliminar($idcomentario);
        // Devuelvo para la IU la confirmacion
        $dat->codMsg = 1;
        $dat->mensaje = 'El comentario ha sido eliminado satisfactoriamente.';
        echo json_encode($dat);
    }

}
