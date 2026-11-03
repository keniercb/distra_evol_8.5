<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpfechacontrolModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function CargarFechasControl($parametros)
    {
        $arrayfechascontrol = DatFechaControl::CargarFechasControl($parametros);
        if (isset($arrayfechascontrol[0])) {
            foreach ($arrayfechascontrol as $key => $fechacontrol) {
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($actividad['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $parametros->idusuariosession, $fechacontrol['idautor']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                // $fechaocurrenciacontrol = explode('-', $fechacontrol['fechacontrol']);
                // $fechacreadocontrol = explode('-', $fechacontrol['fechacreacion']);
                $fechaocurrenciacontrol = $fechacontrol['fechacontrol'];
                $fechacreadocontrol = $fechacontrol['fechacreacion'];

                $arrayfechascontrol[$key]['nombreautor']
                    = $this->integrator->seguridad->nombreUsuario(
                    $fechacontrol['idautor']
                );
                $arrayfechascontrol[$key]['eliminar'] = $eliminar;
                $arrayfechascontrol[$key]['fechacontrol']
                    = $fechaocurrenciacontrol;
                //$fechaocurrenciacontrol[2] . ' / ' . $fechaocurrenciacontrol[1] . ' / ' .$fechaocurrenciacontrol[0];
                $arrayfechascontrol[$key]['fechacreacion']
                    = $fechacreadocontrol;
                //$fechacreadocontrol[2] . ' / ' . $fechacreadocontrol[1] . ' / ' . $fechacreadocontrol[0];
            }
        }
        return $arrayfechascontrol;
    }

    public function AdicionarFechaControl($parametros)
    {
        $objelemento = Doctrine::getTable('DatElementos')->find(
            $parametros->idelemento
        );

        if (!isset($objelemento->idelemento)) {
            $respuesta = 3;
        } else {
            $idelemento = $objelemento->idelemento;
            $fechacontrol = $parametros->fechacontrol;
            $existefecha = Doctrine::getTable('DatFechaControl')->findByDql(
                "idelemento = $idelemento AND fechacontrol = '$fechacontrol'"
            );
            if (isset($existefecha[0]->idelemento)
                && $existefecha[0]->idelemento != ''
            ) {
                $respuesta = 2;
            } else {
                $objfechacontrol = new DatFechaControl();
                $objfechacontrol->idelemento = $parametros->idelemento;
                $objfechacontrol->fechacontrol = $parametros->fechacontrol;
                $objfechacontrol->comentario = $parametros->comentario;
                $objfechacontrol->idautor = $parametros->idusuariocrea;
                $objfechacontrol->fechacreacion = $parametros->fechacreacion;
                $objfechacontrol->save();
                $respuesta = 1;
            }
        }
        return $respuesta;
    }

    public function EliminarFechasControl($parametros)
    {
        $objelemento = Doctrine::getTable('DatElementos')->find(
            $parametros->idelemento
        );
        if (!isset($objelemento->idelemento)) {
            $respuesta = 0;
        } else {
            $cantfechaseliminadas = 0;
            foreach ($parametros->arrayidfechascontrol as $fechacontrol) {
                $idelemento = $parametros->idelemento;
                $objfechacontrol = Doctrine::getTable('DatFechaControl')
                    ->findByDql(
                        "idelemento = $idelemento AND fechacontrol = '$fechacontrol'"
                    );
                if (isset($objfechacontrol[0]->idelemento)
                    && $objfechacontrol[0]->idelemento != ''
                ) {
                    //$objfechacontrol->delete();
                    $params->idelemento = $objfechacontrol[0]->idelemento;
                    $params->fechacontrol = $objfechacontrol[0]->fechacontrol;
                    DatFechaControl::eliminarFechaControl($params);
                    $cantfechaseliminadas++;
                }
            }
            if ($cantfechaseliminadas == count(
                    $parametros->arrayidfechascontrol
                )
            ) {
                $respuesta = 1;
            } else {
                if ($cantfechaseliminadas > 0) {
                    $respuesta = 2;
                } else {
                    $respuesta = 3;
                }
            }
        }
        return $respuesta;
    }
}
 
