<?php
class GestionarcomiteController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function gestionarcomiteAction()
    {
        $this->render();
    }

    /**
     * Función para obtener los comités de ingreso desde el nomenclador.
     * @throws Exception
     */
    function getNomComiteAction()
    {
        try {
            $r = NomComiteModel::getComite();
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    function getPersonasAllAction()
    {
        $personas = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
            null,
            $this->_getParam('query'),
            $this->_getParam('limit'),
            $this->_getParam('start'),
            null,
            null,
            null
        );
        echo(json_encode($personas));
    }

    //Función para obtener los comités de ingreso desde Estructura y composición.
    function getEstructComiteAction()
    {
        try {
            if ($this->_getParam('node') == 'root') {
                $r = DatComiteModel::getEstructura(0);
            } else {
                $r = DatComiteModel::getEstructura($this->_getParam('node'));
            }
            echo(json_encode($r));
        } catch (Exception $e) {
            throw $e;
        }
    }

    //Función para adicionar un comité de ingreso
    function addComiteAction()
    {
        $r = NomComiteModel::addComite(
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('descripcion')
        );
        echo json_encode($r);
    }

    //Función para modificar un comité de ingreso
    function modComiteAction()
    {
        $r = NomComiteModel::modComite(
            $this->_getParam('idcomite'),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('descripcion')
        );
        echo json_encode($r);
    }

    //Función para eliminar un comité de ingreso
    function delComiteAction()
    {
        $r = NomComiteModel::delComite($this->_getParam('idcomite'));
        echo json_encode($r);
    }

    //Función para obtener las personas del comité de ingreso.
    function getPersonasComiteAction()
    {
        $datos = DatComiteModel::getPersonaComite(
            $this->_getParam('idcomite'),
            $this->_getParam('estructura'),
            $this->_getParam('limit'),
            $this->_getParam('start'),
            $this->_getParam('query')
        );
        $result->data = $datos[data];
        $result->total = $datos[total];
        echo json_encode($result);
    }

    //Función para insertar personas al comité de ingreso
    function addPersonasComiteAction()
    {
        $arrPers = json_decode(stripslashes($this->_getParam('arrayPers')));
        $result = DatComiteModel::addPersonaComite(
            $arrPers,
            $this->_getParam('idcomite'),
            $this->_getParam('estructura')
        );
        echo json_encode($result);
    }

    //Función para eliminar una persona del comité de ingreso
    function delPersonasComiteAction()
    {
        $arr= json_decode(stripslashes($this->_getParam('arrPersCte')));
        $result = DatComiteModel::delPersonaComite($arr);
        echo json_encode($result);
    }
}