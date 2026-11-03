<?php

/**
 * Adrian Fernandez Martinez
 * 10/05/13
 */
class ConftipomedioController extends ZendExt_Controller_Secure
{

    private $_mTipoMedio;

    /**
     *
     */
    function init()
    {
        parent:: init();   
        $this->_mTipoMedio = new ConfiguraciontipomedioModel($this->_request->getPost('tipo'));
        $this->_mTipoMedio->loadPluginsFromFile('listapluginsconf')->buildRelations();
    }

    /**
     *
     */
    function conftipomedioAction()
    {
        $this->render();
    }

    /**
     *
     */
    function cargartiposmediosAction()
    {
        $parametros = new stdClass();

        ComunAFTModel::getInstance()->configStartAndLimitInParams(
            $parametros, $this->_request->getPost('start'), $this->_request->getPost('limit')
        );
        if ($this->_request->getPost('denominacion') != null) {
            $parametros->denominacion = $this->_request->getPost('denominacion');
        }
        $parametros->tipo = $this->_request->getPost('tipo');
        $datos = $this->_mTipoMedio->cargarTiposMedios($parametros);
        $datos['col_muestra'] = $this->_mTipoMedio->columnasMuestra($datos['datos']);
       // print_r($datos);die;
        echo json_encode($datos);
    }

    /*
     * Función encargada de adicionar, modificar y eliminar (no se elimina, se cambia el parámetro actual a 0)
     */

    function gestionartiposmediosAction()
    {
        //try {
            $parametros = json_decode(stripcslashes($this->_request->getPost('parametros')));
            $concepto = $this->_request->getPost('concepto');
            $tipo = $this->_request->getPost('tipo');
            //$mTipoMedio = new ConfiguraciontipomedioModel($this->_request->getPost('tipo'));
            $response = $this->_mTipoMedio->gestionarTipoMedio((array) $parametros, $concepto, $tipo);
           
            if ($response) {
                echo("{'CodMsg':1}");
            } 
      /*  } catch (Exception $e) {
            echo("{'CodMsg':3}");
        }*/
    }


}
