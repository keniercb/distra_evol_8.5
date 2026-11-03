<?php

/* 
* Esta clase ha sido generada por Doctrine Generator 
*/

class ConfCalendariofechasModel extends ZendExt_Model
{
    public function init()
    {
        parent::ZendExt_Model();
    }

    public function Guardar($ConfCalendariofechas)
    {
        $ConfCalendariofechas->save();
    }

    public function Eliminar($ConfCalendariofechas)
    {
        $ConfCalendariofechas->delete();
    }

    public function adicionar($params)
    {
        try {
            $confCalendariofechas = new ConfCalendariofechas();
            $confCalendariofechas->idcalendario = $params['idcalendario'];
            $confCalendariofechas->anno = $params['anno'];
            $confCalendariofechas->horas = $params['horas'];
            $confCalendariofechas->fechas = $params['fechas'];
            $confCalendariofechas->heredada = $params['heredada'];
            $confCalendariofechas->horainicio = $params['horainicio'];
            $confCalendariofechas->horafin = $params['horafin'];

            $confCalendariofechas->save();
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modificar($params)
    {
        try {
            $calendarioFechas = Doctrine::getTable('ConfCalendariofechas')
                ->findByDql(
                    "idcalendario = {$params['idcalendario']}"
                );
            if (isset ($calendarioFechas[0])) {
                $calendarioFechas[0]->anno = $params['anno'];
                $calendarioFechas[0]->fechas = $params['fechas'];
                $calendarioFechas[0]->heredada = $params['heredada'];
                if ($params['accion'] == 'ADD') {
                    $calendarioFechas[0]->horas = $params['horas'];
                    $calendarioFechas[0]->horainicio = $params['horainicio'];
                    $calendarioFechas[0]->horafin = $params['horafin'];
                }
                $calendarioFechas->save();
                return 1;
            }
        } catch (Exception $e) {
            return 0;
        }
    }

    public function modificarFechas($fechas, $idcalendario)
    {
        try {
            if (empty($fechas)) {
                $calendario = new ConfCalendario();
                $calendario->eliminar($idcalendario);
                return true;
            } else {
                $calendarioFechas = Doctrine::getTable('ConfCalendariofechas')
                    ->findByDql(
                        "idcalendario = $idcalendario"
                    );
                if (isset ($calendarioFechas[0])) {
                    $calendarioFechas[0]->fechas = $fechas;
                    $calendarioFechas->save();
                    return true;
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
}

