<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpmenurelacionesdinamicasModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los estados de aprobacion que puedo modificar
     */
    public function obtenerEstadosAprobacion(
        $idusuario, $idtipodocumento, $idelemento, $idestadoinicial
    ) {
        $objelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        $mensaje
            = 'El estado de este plan ha sido cambiado y no es el mismo 
                que se le muestra en el registro.Por favor actualice el 
                registro de planes.';
        switch ($idtipodocumento) {
            case 1:
                $mensaje
                    = 'El estado de este objetivo ha sido cambiado y no es el 
                        mismo que se le muestra en el registro.Por favor 
                        actualice el registro de objetivos.';
                break;
            case 3:
                $mensaje
                    = 'El estado de esta actividad ha sido cambiado y no es el 
                        mismo que se le muestra en el registro.Por favor 
                        actualice el registro de actividades.';
                break;
        }
        if ($idestadoinicial == $objelemento->idestadoaprob) {
            $estados = $this->pIntegrator->workflow->EstadosModDoc(
                $idusuario, $idtipodocumento, $idestadoinicial
            );
        } else {
            $estados = array('codigo' => 3, 'mensaje' => $mensaje);
        }
        return $estados;
    }

    /**
     * Funcion para modificar el estado de aprobacion
     */
    public function CambiarEstadoAprobacion(
        $arrayidelementos, $idusuariosession, $idestadoinicial, $idestadofinal,
        $idtipodocumento, $obj/*, $idsubsistema*/
    )
    {

      $aux_arrayidelementos=$arrayidelementos;

     /* foreach ($aux_arrayidelementos as $idelemento) {
        $tienerepeticiones = DatElementosDatElementos::repeticionesPorActividad($idelemento);
        foreach ($tienerepeticiones as $key => $repeticion) {

          $arrayidelementos[count($arrayidelementos)]=$repeticion['idelementohijo'];
        }
      }*/
      //print_r($arrayidelementos);DIE('S');
        if (isset($arrayidelementos)) {
            $objcmpelemetmodel = new CmpgestionarelementoModel();
            /*************
               Optimizando actualizar estados
              **********************************/

            $parametros = new stdClass();
            $parametros->arrayidelementos=$arrayidelementos;
            $parametros->idusuariosession=$idusuariosession;
            $parametros->idestadofinal=$idestadofinal;
            $parametros->idtipodocumento=$idtipodocumento;
            $respuesta = $objcmpelemetmodel->actualizandoEstadoAElemento($parametros);


            /*************************************
                                                    *************************************/
//            foreach ($arrayidelementos as $idelemento) {
//                $respuesta = $objcmpelemetmodel->CambiarEstadoAprobacion(
//                    $idelemento, $idusuariosession, $idestadoinicial,
//                    $idestadofinal, $idtipodocumento, $obj, $cant = 1
//                );
//                /* if($respuesta){
//                    $accion = 4;
//                    $idtipoelemento = $idtipodocumento;
//                    $idautor = $idusuariosession;
//                    $fecha = date('d/m/Y H:i:s');
//                    $objNotificacion = new CmpnotificacionesModel();
//                    $objNotificacion->generarNotificacion($accion, $idelemento,
//                    $idtipoelemento, $idautor, $fecha,$objcambiohorario = null);
//                 }*/
//                if ($respuesta != 1) {
//                    return $respuesta;
//                }
//            }
        }
        return $respuesta;
    }

}
