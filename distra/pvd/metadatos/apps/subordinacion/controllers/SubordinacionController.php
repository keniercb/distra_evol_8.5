<?php

/**
 * Class EstructurasbController
 * Clase encargada de la gestión de las subordinaciones
 *
 * @author    : Ing. Javier Limonta
 * @modify    : Ing. Pedro Alberto Jimenez
 * @modify    : Ing. Osvaldo M. Gonzalez
 * @copyright Copyright (c) 2013 xetid
 */
class SubordinacionController extends ZendExt_Controller_Secure
{
    /**
     * @var
     */
    var $consecutivo;

    /**
     *
     */
    function init()
    {
        parent::init();
    }

    /**
     * Descripción del método: Constructor de la clase
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Pedro Alberto Jimenez
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @copyright Copyright (c) 2013 xetid
     */
    function subordinacionAction()
    {
        $this->render();
    }

    /**
     * Inserta una estructura en una subordinacion especificada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @internal  param    : $idPadre
     * @internal  param    : $idHijo
     * @internal  param    : $idSub
     * @return int Retorna 1 en caso de ser insertada 0 en caso contrario
     * @copyright Copyright (c) 2013 xetid
     */
    function cambiarSubordinacionAction()
    {
        $idPadre = $this->_request->getPost('idpadre');
        $idHijo = $this->_request->getPost('hijo');
        $idSub = $this->_request->getPost('idsub');
        $modelSubordinacion = new DatSubordinacionModel();
        $cant = $modelSubordinacion->buscarExisteIdHijo($idHijo, $idSub);
        if ($cant > 0) {
            echo("{'codMsg':6,'mensaje': 'El elemento ya se encuentra subordinado.'}");
        } else {
            $resp = $modelSubordinacion->insertarSubordinacion($idHijo, $idPadre, $idSub);
            if ($resp) {
                echo("{'codMsg':1,'mensaje': 'La subordinación ha sido adicionada satisfactoriamente.'}");
            } else {
                echo("{'codMsg':6,'mensaje': 'Ha ocurrido un error al adicionar la subordinación.'}");
            }
        }
    }

    /**
     * Descripción del método: Busca los hijos de una subordinacion o elemento de la misma determinada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @internal  param    : $idPadre
     * @internal  param    : $node
     * @internal  param    : $idSub
     * @return array Retorna un arreglo con los hijos de la subordinacion deseada
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarSubordinacionAction()
    {
        $resultado = array();
        $node = $this->_request->getPost('node');
        $idSub = $this->_request->getPost('idsub');
        $idPadre = $this->_request->getPost('idpadre');
        if (!is_numeric($node)) {

            $objectModel = new NomSubordinacionModel();
            $result = $objectModel->buscarSubordinacionesVisibles(array(1000, 0));
            if (count($result) > 0) {
                foreach ($result as $key => $value) {
                    $resultado[$key]['qtip'] = ' ';
                    $resultado[$key]['id'] = (string) $value['idnomsubordinacion'];
                    $resultado[$key]['realid'] = $value['idnomsubordinacion'];
                    $resultado[$key]['hijos'] = $value['leaf'];
                    $resultado[$key]['idsub'] = $value['idnomsubordinacion'];
                    $resultado[$key]['text'] = $value['denominacion'] . '  ' . '(' . $value['abreviatura'] . ')';
                }
            }
        } else {

            $objectModel = new SubordinacionModel();
            $result = $objectModel->dameHijos($idPadre, $idSub);
            if (count($result) > 0) {
                foreach ($result as $key => $value) {
                    $resultado[$key]['qtip'] = ' ';
                    $resultado[$key]['id'] = $value['idestructura'] . $value['idnomsubordinacion'];
                    $resultado[$key]['realid'] = $value['idestructura'];
                    $resultado[$key]['text'] = $value['denominacion'];
                    $resultado[$key]['hijos'] = $value['leaf'];
                    $resultado[$key]['idconcepto'] = $value['idconcepto'];
                    $resultado[$key]['idsub'] = $value['idnomsubordinacion'];
                    $resultado[$key]['icon'] = $value['icono'];
                }
            }
        }
        echo json_encode($resultado);
    }

    /**
     * Descripción del método: Elimina una subordinacion determinada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo Gonzalez
     * @internal  param    : $identificador
     * @internal  param    : $idSub
     * @return array Retorna mensaje de confirmacion
     * @copyright Copyright (c) 2013 xetid
     */
    function eliminarSubordinacionAction()
    {
        $identificador = $this->_request->getPost('identificador');
        $idSub = $this->_request->getPost('idsub');
        $objectModel = new DatSubordinacionModel();
        $resp = $objectModel->eliminarSubordinacion($identificador, $idSub);
        if ($resp) {
            echo("{'codMsg':1,'mensaje': 'La subordinación ha sido eliminada satisfactoriamente.'}");
        } else {
            echo("{'codMsg':6,'mensaje': 'Ha ocurrido un error al eliminar la subordinación.'}");
        }
    }
}