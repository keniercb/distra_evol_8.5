<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarobservacionesModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function CargarObservaciones($idelemento, $idusuariocrea)
    {
        $arrayobservaciones = DatObservacionesPdo::GetObsDadoIdElemen(
            $idelemento
        );
        if (isset($arrayobservaciones[0])) {
            $eliminar = 0;
            foreach ($arrayobservaciones as $val) {
                if ($val['idusuariocrea'] == $idusuariocrea) {
                    $eliminar = 1;
                }
                $dat->data  [] = array('idobs'         => $val['idobservaciones'],
                                       'denominacion'  => $val['asunto'],
                                       'obs'           => $val['cuerpo'],
                                       'fechacreacion' => $val['fechacreacion'],
                                       'eliminar'      => $eliminar,
                                       'autor'         => $this->integrator->seguridad->nombreUsuario(
                                           $val['idusuariocrea']
                                       )
                );
            }
        } else {
            $dat->data = array();
        }
        return $dat;
    }

    public function AdicionarObservaciones(
        $asunto, $cuerpo, $idelemento, $idusuariocrea
    ) {
        //$noexiste = 0;
        $existeelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if (!isset($existeelemento)) {
            $mensaje = 3;
        } else {
            $existeobs = DatObservacionesPdo::GetObsMismoDenUserElem(
                $asunto, $idelemento
            );
            if (isset($existeobs[0])) {
                $mensaje = 2;
            } else {
                $observacion = new DatObservacionesPdo();
                $observacion->asunto = $asunto;
                $observacion->cuerpo = $cuerpo;
                $observacion->idusuariocrea = $idusuariocrea;
                $observacion->idelemento = $idelemento;
                $observacion->fechacreacion = date('d/m/Y');
                $observacion->save();
                $mensaje = 1;
            }
        }
        return $mensaje;
    }

    public function EliminarObservaciones($arrayidobservaciones)
    {
        //$arrayObservacionesxElemento = new ArrayObject();
        //$elemento = new CmpgestionarelementoModel();
        //$datObservacion = new DatObservacionesPdo();
        foreach ($arrayidobservaciones as $observacion) {
            $objobservacion = Doctrine::getTable('DatObservacionesPdo')->find(
                $observacion
            );
            /*$idelemento = */
            $objobservacion->idelemento;
            if (isset($objobservacion)) {
                $objobservacion->delete();
            }
        }
        return 1;
    }

    public function cambiarFormatoFechaAction($fecha)
    {
        list($anno, $mes, $dia) = explode("-", $fecha);
        return $dia . " / " . $mes . " / " . $anno;
    }
}