<?php

/**
 * Controlador para gestionar relaciones
 * Autor: Tte. Nestor Bernal Vidal
 * UCID-ERP
 * V1.0
 */
class CmprelacionesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    function cmprelacionesAction()
    {
        $this->render();
    }

    /**
     *
     */
    function cargarcbrelacionadoconAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $relacionesiniciales = $this->_request->getPost('relacionesiniciales');
		$tributar = $this->_request->getPost('tributar');		
        $objrelacionesmodel = new CmprelacionesModel();
        $arrayrelaciones = $objrelacionesmodel->CargarTiposElementosARelacionar(
            $tipoelemento, $relacionesiniciales, $tributar
        );
        if (isset($arrayrelaciones[0])) {
            echo json_encode(array('datos' => $arrayrelaciones));
        } else {
            $this->showMessage('No existen elementos al cual tributar.');
        }
    }

    /**
     *
     */
    function cargargridrelacionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $idelemento = $this->_request->getPost('idelemento');
        $start = ($this->_request->getPost('start'))
            ? $this->_request->getPost('start') : 0;
        $limit = ($this->_request->getPost('limit'))
            ? $this->_request->getPost('limit') : 15;
        $objrelacionesmodel = new CmprelacionesModel();
        $arrayrelaciones
            = $objrelacionesmodel->CargarRelacionesSuperioresPaginado(
            $tipoelemento, $idelemento, $idusuariosession, $limit, $start
        );
        if (isset($arrayrelaciones['contador'])) {
            echo json_encode(
                array('total' => $arrayrelaciones['contador'],
                      'campos' => $arrayrelaciones['array'])
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    /**
     *
     */
    function adicionarelacionessuperioresAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $idelemento = $this->_request->getPost('idelemento');
        $arrayelementosrelacionados = json_decode(
            stripslashes($this->_request->getPost('arrayelementosrelacionados'))
        );
        $objrelacionesmodel = new CmprelacionesModel();
        $respuesta = $objrelacionesmodel->RelacionarElementos(
            $idelemento, $tipoelemento, $arrayelementosrelacionados,
            $parentrelacidelemento = 'hijo', $idusuariosession
        );

        if($tipoelemento==3){
          $idrepeticiones = DatActividades::getIdRepeticiones($idelemento);
          if($idrepeticiones[0]['idrepeticiones']!=null){
            $cant_repetiones = explode(',', trim($idrepeticiones[0]['idrepeticiones']));
            foreach ($cant_repetiones as $value){
              $respuesta = $objrelacionesmodel->RelacionarElementos(
                $value, $tipoelemento, $arrayelementosrelacionados,
                $parentrelacidelemento = 'hijo', $idusuariosession
              );
            }
          }
        }

        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     *
     */
    function adicionarrelacionesmultiplesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $arrayidelementoshijos = json_decode(
            stripslashes($this->_request->getPost('arrayidelementoshijos'))
        );
        $arrayelementosrelacionados = json_decode(
            stripslashes($this->_request->getPost('arrayelementosrelacionados'))
        );
        if (isset($arrayidelementoshijos)
            && isset($arrayelementosrelacionados[0])
        ) {
            $cantrelacionesejecutadas = 0;
            $cantrelacionesnoejecutadas = 0;
            $cantelementoshijosnoexistentes = 0;
            $objrelacionesmodel = new CmprelacionesModel();

            foreach ( $arrayidelementoshijos as  $idelementohijo ) {
                $resp = $objrelacionesmodel->RelacionarElementos(
                    $idelementohijo, $tipoelemento, $arrayelementosrelacionados,
                    $parentrelacidelemento = 'hijo', $idusuariosession
                );
                if ($resp == 0) {
                    $cantelementoshijosnoexistentes++;
                }
                if ($resp == 3) {
                    $cantrelacionesnoejecutadas++;
                }
                if ($resp == 1) {
                    $cantrelacionesejecutadas++;
                }
                if ($resp == 2) {
                    $cantrelacionesejecutadas++;
                    $cantrelacionesnoejecutadas++;
                }
            }
            if ($cantelementoshijosnoexistentes != (count(
                        $arrayelementosrelacionados
                    ) * count($arrayidelementoshijos))
            ) {
                $respuesta = 3;
                if ($cantrelacionesejecutadas > 0
                    && $cantrelacionesnoejecutadas == 0
                ) {
                    $respuesta = 1;
                }
                if ($cantrelacionesejecutadas > 0
                    && $cantrelacionesnoejecutadas > 0
                ) {
                    $respuesta = 2;
                }
                if ($cantrelacionesnoejecutadas == count(
                        $arrayelementosrelacionados
                    )
                ) {
                    $respuesta = 3;
                }
            } else {
                $respuesta = 0;
            }
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     *
     */
    function eliminarrelacionesuperioresAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $idelemento = $this->_request->getPost('idelemento');
        $arrayrelacionesseleccionadas = json_decode(
            stripslashes(
                $this->_request->getPost('arrayrelacionesseleccionadas')
            )
        );
        $objrelacionesmodel = new CmprelacionesModel();
        $respuesta = $objrelacionesmodel->EliminarRelacionesSuperiores(
            $tipoelemento, $idelemento, $arrayrelacionesseleccionadas
        );
        if($tipoelemento==3){
          $idrepeticiones = DatActividades::getIdRepeticiones($idelemento);
          if($idrepeticiones[0]['idrepeticiones']!=null){
            $cant_repetiones = explode(',', trim($idrepeticiones[0]['idrepeticiones']));
            foreach ($cant_repetiones as $value){
              $respuesta = $objrelacionesmodel->EliminarRelacionesSuperiores(
                $tipoelemento, $value, $arrayrelacionesseleccionadas
              );
            }
          }
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

}


