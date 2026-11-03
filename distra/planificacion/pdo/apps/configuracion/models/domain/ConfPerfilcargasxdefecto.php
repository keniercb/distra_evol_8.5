<?php

class ConfPerfilcargasxdefecto extends BaseConfPerfilcargasxdefecto
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'ConfPerfil', array('local'   => 'idconfiguracionperfil',
                                'foreign' => 'idconfiguracionperfil')
        );
    }

    public function getByid($idconfiguracionperfil)
    {
        return Doctrine::getTable('ConfPerfilcargasxdefecto')->find(
            $idconfiguracionperfil
        )->toArray();
    }

    public function listar($parametros)
    {
        $cadenaSELECT = '';
        $cadenaJOIN = '';
        $cadenaQUERY = '';
        $condicion = '';
        $condicionfecha = '';
        $condiciondeno = '';
        $condiciondes = '';
        $condicionactual = '';
        $cadenaSELECT
            = " SELECT cp.idconfiguracionperfil, cp.denominacion,
                cp.fechacreacion, cp.actual, cp.descripcion, 0 as actividad,
                0 as plan, 0 as objetivo, 0 as fip,
                c. igual, c.mayor, c.menor";

        $cadenaJOIN = " FROM mod_objetivos.conf_perfil cp
        LEFT JOIN mod_objetivos.nom_comparacion c
ON(cp.idcomparacion = c.idcomparacion)";

        if (is_array($parametros->filtros)) {
            foreach ($parametros->filtros as $campo) {
                if ($campo['field'] == 'denominacion') {
                    $denom = $campo['data']['value'];
                    $condiciondeno .= " AND cp.denominacion ILIKE '%{$denom}%'";
                } else {
                    if ($campo['field'] == 'descripcion') {
                        $descrip = $campo['data']['value'];
                        $condiciondes .= " AND cp.descripcion ILIKE '%{$descrip}%'";
                    } else {
                        if ($campo['field'] == 'plan') {
                            if ($campo['data']['value'] == 'Activo') {
                                $plan = 1;
                            } else {
                                $plan = 0;
                            }
                            $condicion .= " and cpcxd.idtipoelemento = 0";
                        } else {
                            if ($campo['field'] == 'actividad') {
                                if ($campo['data']['value'] == 'Activo') {
                                    $act = 1;
                                } else {
                                    $act = 0;
                                }
                                $condicion .= " and cpcxd.idtipoelemento = 3";
                            } else {
                                if ($campo['field'] == 'objetivo') {
                                    if ($campo['data']['value'] == 'Activo') {
                                        $obj = 1;
                                    } else {
                                        $obj = 0;
                                    }
                                    $condicion .= " and cpcxd.idtipoelemento = 1";
                                } else {
                                    if ($campo['field'] == 'fip') {
                                        if ($campo['data']['value'] == 'Activo'
                                        ) {
                                            $fip = 1;
                                        } else {
                                            $fip = 0;
                                        }
                                        $condicion .= " and cpcxd.idtipoelemento = 2";
                                    } else {
                                        if ($campo['field'] == 'actual') {
                                            if ($campo['data']['value'] == 'Si'
                                            ) {
                                                $actual = 1;
                                            } else {
                                                $actual = 0;
                                            }
                                            $condicionactual .= " AND cp.actual = {$actual} ";
                                        } else {
                                            if ($campo['field']
                                                == 'fechacreacion'
                                            ) {
                                                $arrayfechainicio = explode(
                                                    ' ', $campo['data']['value']
                                                );
                                                if ($campo['data']['comparison']
                                                    == 'lt'
                                                ) {
                                                    $condicionfecha
                                                        .=
                                                        " AND cp.fechacreacion < '"
                                                        . $arrayfechainicio[0]
                                                        . "' ";
                                                } else {
                                                    if ($campo['data']['comparison']
                                                        == 'gt'
                                                    ) {
                                                        $condicionfecha
                                                            .=
                                                            " AND cp.fechacreacion > '"
                                                            . $arrayfechainicio[0]
                                                            . "' ";
                                                    } else {
                                                        if ($campo['data']['comparison']
                                                            == 'eq'
                                                        ) {
                                                            $condicionfecha
                                                                .=
                                                                " AND cp.fechacreacion = '"
                                                                . $arrayfechainicio[0]
                                                                . "' ";
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $cadenaWHERE
            = " WHERE cp.idautor = {$parametros->idusuario}" . $condicionfecha
            . "" . $condiciondeno . "" . $condiciondes . "" . $condicionactual
            . "
            AND cp.idconfiguracionperfil IN (SELECT cpcxd.idconfiguracionperfil 
            FROM mod_objetivos.conf_perfilcargasxdefecto cpcxd 
            WHERE true {$condicion})
            ORDER BY cp.denominacion";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        //print_r($cadenaWHERE);die;
        $sqlTotal = $cadenaQUERY;
        $cadenaQUERY .= " OFFSET {$parametros->start} LIMIT {$parametros->limit} ";
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        $result->total = count(
            $conn->execute($sqlTotal)->fetchAll(PDO::FETCH_ASSOC)
        );
        //print_r($result);die;
        return $result;
    }

    public function getTipoelementosdadoidconfperfil($id, $tipoconf)
    {
        $query = new Doctrine_Query();
        if ($tipoconf == 3) {
            $result = $query->from('ConfPerfilcargasxdefectoinvolucrado cxd')
                ->where('cxd.idconfiguracionperfil = ?', $id)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        } else {
            $result = $query->from('ConfPerfilcargasxdefecto cxd')
                ->where('cxd.idconfiguracionperfil = ?', $id)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        }

        return $result;
    }

    public function comprobarConfigActualCargaxDefecto($tipoelemento)
    {
        $existeactual = Doctrine::getTable('ConfPerfilcargasxdefecto')
            ->findByDql("idtipoelemento = $tipoelemento AND actual = 1");            
        if ($existeactual[0]->idtipoelemento != null) {
            $existeactual[0]->actual = 0;
            $existeactual[0]->save();
        }
    }

    public function comprobardenominacion($params, $tipo)
    {
        switch ($tipo) {
            case 1:
                $cadena 
                    = "conf_perfilcargasxdefecto.idconfiguracionperfil AND ";
                $cadenab = "mod_objetivos.conf_perfilcargasxdefecto";
                $select = "conf_perfilcargasxdefecto.idconfiguracionperfil";
                break;
            case 2:
                $cadena = "conf_perfilcalendario.idconfiguracionperfil AND ";
                $cadenab = "mod_objetivos.conf_perfilcalendario";
                $select = "conf_perfilcalendario.idconfiguracionperfil";
                break;
            default:
                $cadena
                    = "conf_perfilcargasxdefectoinvolucrado.idconfiguracionperfil AND ";
                $cadenab
                    = " mod_objetivos.conf_perfilcargasxdefectoinvolucrado";
                $select
                    = "conf_perfilcargasxdefectoinvolucrado.idconfiguracionperfil";
                break;
        }
        $consulta
            = "SELECT
            " . $select . "
            FROM mod_objetivos.conf_perfil, " . $cadenab .
            " WHERE conf_perfil.idconfiguracionperfil =" . $cadena
            . " conf_perfil.idautor = {$params->idusuario}
            AND conf_perfil.denominacion = '$params->denominacion'";
        $connb = Doctrine_Manager:: connection();
        //print_r($consulta);die;
        $res = $connb->execute($consulta);
        $result = $res->fetchAll();
        if (count($params->idconfiguracionperfil) != 0 && count($result) != 0) {
            if ($result[0][0] == $params->idconfiguracionperfil) {
                return false;
            }
            return true;
        } else {
            if (count($result) == 0) {
                return false;
            }
            return true;
        }
    }


}

