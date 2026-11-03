<?php

/**
 * Controlador para gestionar plan
 *
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpmenurelacionesdinamicasController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionaractividades.phtml
     */
    function cmpmenurelacionesdinamicasAction()
    {
        $this->render();
    }

    /**
     * Funcion para obtener los estados de aprobacion
     */
    function cargarmenuestadosaprobacionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idelemento = $this->_request->getPost(
            'idelemento'
        ); //ver por dodnde lo envia
        $idusuariosession = $this->global->Perfil->idusuario;
        $idestadoinicial = $this->_request->getPost('idestadoinicial');
        $idtipodocumento = $this->_request->getPost('idtipodocumento');
        $objcmpmenumodel = new CmpmenurelacionesdinamicasModel();
        $arrayestadosaprobacion = $objcmpmenumodel->obtenerEstadosAprobacion(
            $idusuariosession, $idtipodocumento, $idelemento, $idestadoinicial
        );
        if (isset($arrayestadosaprobacion->codigo)) {
            echo json_encode($arrayestadosaprobacion);
        } else {
            echo json_encode(array('estados' => $arrayestadosaprobacion));
        }
    }

    /**
     * Funcion para cambiar el estado de aprobacion
     */
    function cambiarestadoaprobacionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $arrayidelementos = json_decode(
            stripslashes($this->_request->getPost('arrayidelementos'))
        );
        $idestadoinicial = $this->_request->getPost('idestadoinicial');
        $idestadofinal = $this->_request->getPost('idestadofinal');
        $idtipodocumento = $this->_request->getPost('idtipodocumento');

        $arrayidrepeticiones = [];
        foreach ($arrayidelementos as $value){
          if($idtipodocumento==3){
            $idrepeticiones = DatActividades::getIdRepeticiones($value);
            if($idrepeticiones[0]['idrepeticiones']!=null){
              $cant_repetiones = explode(',', trim($idrepeticiones[0]['idrepeticiones']));
              $arrayidrepeticiones = array_merge($arrayidrepeticiones,$cant_repetiones);
            }
          }
        }

        $arrayidelementos = array_merge($arrayidelementos,$arrayidrepeticiones);        

        $objcmpmenumodel = new CmpmenurelacionesdinamicasModel();
        $respuesta = $objcmpmenumodel->CambiarEstadoAprobacion(
            $arrayidelementos, $idusuariosession, $idestadoinicial,
            $idestadofinal, $idtipodocumento, $obj = null, $idsubsistema = 15
        );        
        
        if ($respuesta == 1) {            
            $objNotificacion = new CmpnotificacionesModel();
            $accion = 4;
            $idtipoelemento = $idtipodocumento;
            $idautor = $idusuariosession;
            $fecha = date('d/m/Y H:i:s');
            foreach ($arrayidelementos as $idelemento) {
                //busco el elemento para guardarlo en historial
                $objElemento = Doctrine::getTable('DatElementos')->find(
                    $idelemento
                );
                $objhisto->denelemento = $objElemento->denelemento;
                $objhisto->descelemento = $objElemento->descelemento;
                $objhisto->dirigente = $objElemento->dirigente;
                $objhisto->gradocumplimiento = $objElemento->gradocumplimiento;
                $objhisto->participante = $objElemento->participante;
                
                if($idtipoelemento == 0) {
                    //busco en planes
                    $objplan = Doctrine::getTable('DatPlanPdo')->find($idelemento);
                    $objcmpgestionarplanmodel = new CmpgestionarplanModel();
                    $objcambiohorario = $objcmpgestionarplanmodel->CambioHorario(
                        $idelemento, $objplan->fechainicio, $objplan->fechafin
                    );
                    $involucradoshisto = '';
                } elseif($idtipoelemento == 1) {                    
                    //busco en objetivos
                    $relaciones = DatElementosDatElementos::obtenerRelacionObj(
                        $idelemento
                    );
                    $objhisto->relaciones = $relaciones;
                    $objobjetivo = Doctrine::getTable('DatObjetivo')->find($idelemento);
                    $parametros->idobjetivo = $idelemento;
                    $parametros->fechainicio = $objobjetivo->fechainicio;
                    $parametros->fechafin = $objobjetivo->fechafin;
                    $objcambiohorario = CmpgestionarobjetivosModel::CambioHorario(
                        $parametros
                    );
                    $involucradoshisto = Doctrine::getTable(
                        'DatElementosDatInvolucrados'
                    )->findByDql("idelemento = '$idelemento'");
                    $arrayinvolucrados = array();
                    foreach ($involucradoshisto as $key => $involucrado) {
                        $involucradosuser = Doctrine::getTable('DatInvolucrados')->find(
                            $involucrado->idinvolucrado
                        );
                        $arrayinvolucrados[] = $involucradosuser->idusuario;
                    }
                    $involucradoshisto = implode(',', $arrayinvolucrados);

                } elseif($idtipoelemento == 3) {                    
                    //busco en actividades
                    $objactividad = Doctrine::getTable('DatActividades')->find(
                        $idelemento
                    );
                    $relaciones = DatElementosDatElementos::obtenerRelacionAct(
                        $idelemento
                    );                    
                    $objhisto->relaciones = $relaciones;
                    $parametros->idactividad = $idelemento;
                    $parametros->fechainicio = $objactividad->fechainicio;
                    $parametros->fechafin = $objactividad->fechafin;
                    $parametros->horainicio = $objactividad->horainicio;
                    $parametros->horafin = $objactividad->horafin;
                    $objcambiohorario = CmpgestionaractividadesModel::CambioHorario(
                        $parametros
                    );                    
                    $involucradoshisto = Doctrine::getTable(
                        'DatElementosDatInvolucrados'
                    )->findByDql("idelemento = '$idelemento'");
                    $arrayinvolucrados = array();
                    foreach ($involucradoshisto as $involucrado) {
                        $involucradosuser = Doctrine::getTable('DatInvolucrados')->find(
                            $involucrado->idinvolucrado
                        );
                        $arrayinvolucrados[] = $involucradosuser->idusuario;
                    }                    
                    $involucradoshisto = implode(',', $arrayinvolucrados);
                }

                /*$objNotificacion->generarNotificacion(
                    $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
                    $objcambiohorario, $objhisto, $involucradoshisto
                );*/

            }
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

}
