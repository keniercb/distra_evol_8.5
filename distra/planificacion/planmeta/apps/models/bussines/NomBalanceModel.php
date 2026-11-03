<?php

class NomBalanceModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnom_balance($nomBalance)
    {
        $nomBalance->save();
    }

    public function modificarnom_balance($nomBalance)
    {
        $nomBalance->save();
    }

    public function existenciabal($denominacion, $id)
    {
        if (count(NomBalance::verificarexistetciabal($denominacion, $id))
            != 0
        ) {
            return true;
        } else {
            return false;
        }
    }


    public function asociar($idbalance, $idsubtipobalance, $coeficiente,
        $cantidad, $data, $idEstructura, $identidad, $idejercicio
    )
    {
        $model = new DatSubtipobalancebalanceModel();
        if ($data) {
            foreach ($data as $dat) {
                if ($dat->idsubtipobalancebalance) {
                    $balance = Doctrine::getTable('DatSubtipobalancebalance')
                        ->find($dat->idsubtipobalancebalance);
                } else {
                    //verificar que el balance no este asociado ya a la entidad
                    $balance = new DatSubtipobalancebalance();
                    $balance->idsubtipobalance = $dat->idsubtipobalance;
                    $balance->idbalance = $dat->idbalance;
                    $balance->identidad = $identidad;
                    $balance->coeficiente = 0;
                    $balance->racion = 0;
                    $balance->total = 0;
                    $balance->idejercicio = $idejercicio;
                }
                if (isset($dat->coeficiente)) {
                    $balance->coeficiente = $dat->coeficiente;
                }
                $coef = $dat->coeficiente;
                if (isset($dat->total)) {
                    $balance->total = $dat->total;
                }

                if (isset($dat->coeficiente) && isset($dat->total)) {
                    $balance->racion = ceil($dat->coeficiente * $dat->total);
                } else {
                    if (isset($dat->coeficiente) && !isset($dat->total)) {
                        $balance->racion = ceil(
                            $dat->coeficiente * $balance->total
                        );
                    } else {
                        if (!isset($dat->coeficiente) && isset($dat->total)) {
                            $balance->racion = ceil(
                                $balance->coeficiente * $dat->total
                            );
                        }
                    }
                }


                if (!$dat->idsubtipobalancebalance && !$dat->coeficiente
                    && !$dat->total
                ) {
                    break;
                }

                //if(count(NomBalance::verifAS($dat->idbalance,$idsubtipobalance,$identidad))==0)
                //$resultado=$model->insertardat_subtipobalancebalance($balance);

                if (count($idEstructura) >= 1) {
                    foreach ($idEstructura as $idEntidad) {
                        //Actualizar los campos de las asociaciones de las entidades hijas
                        $query = new Doctrine_Query();

                        $query->update('DatSubtipobalancebalance')
                            ->set('coeficiente', '?', $coef)
                            ->where('identidad = ?', $idEntidad)
                            ->addWhere(
                                'idsubtipobalance = ?',
                                $balance->idsubtipobalance
                            )
                            ->addWhere('idbalance = ?', $balance->idbalance)
                            ->execute();

                    }
                } else {
                    $resultado = $model->insertardatSubtipobalancebalance(
                        $balance
                    );
                }


            }
        } else { //Asociar balance sin modificaciones en los valores AsociarBalance
            foreach ($idbalance as $id) {
                foreach ($idEstructura as $identidad) {
                    $data = new DatSubtipobalancebalance();
                    if ($coeficiente) {
                        $data->coeficiente = $coeficiente;
                    } else {
                        $data->coeficiente = 0;
                    }
                    if ($cantidad) {
                        $data->total = $cantidad;
                    } else {
                        $data->total = 0;
                    }
                    if ($cantidad && $coeficiente) {
                        $data->racion = ceil($cantidad * $coeficiente);
                    }

                    $data->idsubtipobalance = $idsubtipobalance;
                    $data->idbalance = $id;
                    $data->identidad = $identidad;

                    if (count(
                        NomBalance::verifAS(
                            $id, $idsubtipobalance, $identidad
                        )
                    ) == 0
                    ) {
                        $resultado = $model->insertardatSubtipobalancebalance(
                            $data
                        );
                    }
                }
            }
        }


    }


    public function desasociar($idbalance, $idsubtipobalance)
    {
        foreach ($idbalance as $id) {
            $b = NomBalance::buscarrelacion($id, $idsubtipobalance);

            if ($this->eliminarnomBalance($b)) {
                $result = true;
            } else {
                $result = false;
            }
        }
        return $result;

    }

    public function eliminarnomBalance($nomBalance)
    {
        return $nomBalance->delete();
    }
}


