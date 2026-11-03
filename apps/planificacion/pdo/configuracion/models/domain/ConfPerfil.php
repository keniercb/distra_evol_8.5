<?php

class ConfPerfil extends BaseConfPerfil
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'ConfPerfilcalendario', array('local'   => 'idconfiguracionperfil',
                                          'foreign' => 'idconfiguracionperfil')
        );
        $this->hasMany(
            'ConfPerfilcargasxdefecto',
            array('local'   => 'idconfiguracionperfil',
                  'foreign' => 'idconfiguracionperfil')
        );
    }

    public function getByid($idtipoelemento)
    {
        return Doctrine::getTable('ConfPerfil')->find($idtipoelemento)->toArray(
        );
    }

    public function obtenerConfById($id)
    {
        $objetoconf = Doctrine::getTable('ConfPerfil')->findByDql(
            "idconfiguracionperfil = $id", null, Doctrine::HYDRATE_ARRAY
        );
        return $objetoconf[0];
    }

    public function getConfPerfilxtipoelytipoconf($parametros)
    {
        $cadenaSELECT = '';
        $cadenaJOIN = '';
        $cadenaWHERE = '';
        $cadenaQUERY = '';


        $cadenaSELECT = " SELECT *";
        $cadenaJOIN = " FROM mod_objetivos.conf_perfil cp ";


        $cadenaJOIN .= " LEFT JOIN mod_objetivos.nom_comparacion comp 
            ON cp.idcomparacion = comp.idcomparacion";
        //esto es julio
        if ($parametros->tipoconfiguracion == 2) {
            $cadenaJOIN .= " INNER JOIN mod_objetivos.conf_perfilcargasxdefecto cpcxd 
                ON cp.idconfiguracionperfil = cpcxd.idconfiguracionperfil";
        } else {
            if ($parametros->tipoconfiguracion == 3) {
                $cadenaJOIN
                    .= " INNER JOIN mod_objetivos.conf_perfilcargasxdefectoinvolucrado cpcxd 
                        ON cp.idconfiguracionperfil = cpcxd.idconfiguracionperfil
                        INNER JOIN mod_objetivos.dat_perfilinvolucrado_usuariosinvolucrados dpiui 
                        ON cpcxd.idconfiguracionperfil = dpiui.idconfiguracionperfil";
            }
        }
        if ($parametros->idcargaxdefecto) {
            $cadenaWHERE
                = " WHERE cp.idautor = {$parametros->idusuario} 
                    AND cpcxd.idtipoelemento = {$parametros->idtipoelemento} 
                    AND cpcxd.idconfiguracionperfil = {$parametros->idcargaxdefecto}";
        } else {
            $cadenaWHERE
                = " WHERE cp.idautor = {$parametros->idusuario} 
                    AND cpcxd.idtipoelemento = {$parametros->idtipoelemento} 
                    AND cpcxd.actual = 1";
        }
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        //print_r($cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarComportamientos($parametros)
    {
        $cadenaSELECT = '';
        $cadenaJOIN = '';
        $cadenaWHERE = '';
        $cadenaQUERY = '';
        $cadenaORDERBY = '';
        $cadenaSELECT
            = " SELECT cp.idconfiguracionperfil,cp.denominacion, cp.descripcion,
                cp.fechacreacion,cp.actual";
        $cadenaJOIN
            = " FROM mod_objetivos.conf_perfil cp
                INNER JOIN mod_objetivos.conf_perfilcargasxdefectoinvolucrado cpcxd 
                ON cp.idconfiguracionperfil = cpcxd.idconfiguracionperfil";
        $cadenaWHERE = " WHERE cp.idautor = {$parametros->idusuario}";
        $cadenaORDERBY
            = " GROUP BY cp.idconfiguracionperfil ORDER BY cp.denominacion ";
        foreach ($parametros->filtros as $campo) {
            if ($campo['field'] == 'denominacion') {
                $denom = $campo['data']['value'];
                $cadenaWHERE .= " AND cp.denominacion ILIKE '%{$denom}%'";
            } else {
                if ($campo['field'] == 'fip') {
                    if ($campo['data']['value'] == 'Activo') {
                        $cadenaWHERE .= " and cpcxd.idtipoelemento = 2";
                    }
                } else {
                    if ($campo['field'] == 'actividad') {
                        if ($campo['data']['value'] == 'Activo') {
                            $cadenaWHERE .= " and cpcxd.idtipoelemento = 3";
                        }
                    } else {
                        if ($campo['field'] == 'arc') {
                            if ($campo['data']['value'] == 'Activo') {
                                $cadenaWHERE .= " and cpcxd.idtipoelemento = 4";
                            }
                        } else {
                            if ($campo['field'] == 'objetivo') {
                                if ($campo['data']['value'] == 'Activo') {
                                    $cadenaWHERE .= " and cpcxd.idtipoelemento = 1";
                                }
                            } else {
                                if ($campo['field'] == 'descripcion') {
                                    $descrip = $campo['data']['value'];

                                    $cadenaWHERE .= " AND cp.descripcion ILIKE '%{$descrip}%'";
                                }
                            }
                        }
                    }
                }
            }
            if ($campo['field'] == 'actual') {
                if ($campo['data']['value'] == 'Si') {
                    $activo = 1;
                } else {
                    $activo = 0;
                }
                $cadenaWHERE .= " AND cp.actual = {$activo}";
            } else {
                if ($campo['field'] == 'fechacreacion') {

                    $arrayfechainicio = explode(' ', $campo['data']['value']);
                    if ($campo['data']['comparison'] == 'lt') {

                        $cadenaWHERE
                            .=
                            " AND cp.fechacreacion < '" . $arrayfechainicio[0]
                            . "' ";
                    } else {
                        if ($campo['data']['comparison'] == 'gt') {
                            $cadenaWHERE .= " AND cp.fechacreacion > '"
                                . $arrayfechainicio[0] . "' ";
                        } else {
                            if ($campo['data']['comparison'] == 'eq') {
                                $cadenaWHERE .= " AND cp.fechacreacion = '"
                                    . $arrayfechainicio[0] . "' ";
                            }
                        }
                    }
                }
            }
        }


        /* if ( $parametros->filtros) {
          foreach ($parametros->$filtros as $campo) {
                if ($campo['field'] == 'actual') {
                   if($campo['data']['value']=='Si')
                         $activo= 1;
                         else
                             $activo= 0;

                 $cadenaWHERE .= " AND due.activo = {$activo}";
              }    else

                 if ($campo['field'] == 'fechacreacion') {
                      $arrayfechainicio = explode(' ', $campo['data']['value']);
                       if ($campo['data']['comparison'] == 'lt')
                       {
                       $cadenaWHERE .= " AND cp.fechacreacion < '" . $arrayfechainicio[0] . "' ";
                       } else
                       if ($campo['data']['comparison'] == 'gt')
                       {
                       $cadenaWHERE .= " AND cp.fechacreacion> '" . $arrayfechainicio[0] . "' ";
                       } else
                       if ($campo['data']['comparison'] == 'eq')
                       {
                       $cadenaWHERE .= " AND cp.fechacreacion = '" . $arrayfechainicio[0] . "' ";
                       }
                 }
             }
             }*/

        $cadenaQUERY
            = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE . $cadenaORDERBY;

        $conn = Doctrine_Manager::connection();
        $result->total = count(
            $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC)
        );
        $cadenaQUERY .= " OFFSET {$parametros->start} LIMIT {$parametros->limit} ";
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );

        return $result;
    }


}

