<?php

class ConfPerfilcalendario extends BaseConfPerfilcalendario
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'NomVistacalendario', array('local'   => 'idvistaxdefecto',
                                        'foreign' => 'idvistacalendario')
        );
        $this->hasOne(
            'ConfPerfil', array('local'   => 'idconfiguracionperfil',
                                'foreign' => 'idconfiguracionperfil')
        );
        $this->hasMany(
            'DatConfperfilcalendarioUsuariosinvolucrados',
            array('local'   => 'idconfiguracionperfil',
                  'foreign' => 'idconfiguracionperfil')
        );
    }

    public function getByid($idconfiguracionperfil)
    {
        return Doctrine::getTable('ConfPerfilcalendario')->find(
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
            = " SELECT cp.idconfiguracionperfil,cp.denominacion,
                cp.fechacreacion, cp.actual,cp.descripcion,
c. igual, c.mayor, c.menor";
        $cadenaJOIN = " FROM mod_objetivos.conf_perfil cp

LEFT JOIN mod_objetivos.nom_comparacion c
ON(cp.idcomparacion = c.idcomparacion)

";
        if ($parametros->actual == 1 || $parametros->idconfiguracion) {
            if ($parametros->idconfiguracion
                && $parametros->idconfiguracion != 'personal'
            ) {
                $condicionactual .= " AND cp.idconfiguracionperfil = {$parametros->idconfiguracion} ";
            } else {
                $condicionactual .= " AND cp.actual = 1 ";
            }
            $cadenaJOIN .= " INNER JOIN mod_objetivos.conf_perfilcalendario cpcal 
                ON cp.idconfiguracionperfil = cpcal.idconfiguracionperfil ";
            $cadenaSELECT
                = " SELECT cpcal.*,cp.*,(select array( SELECT  dcu.idinvolucrado 
                    FROM mod_objetivos.dat_confperfilcalendario_usuariosinvolucrados dcu
                    WHERE dcu.idconfiguracionperfil = cp.idconfiguracionperfil)) as involucrados ";
        }
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
                        if ($campo['field'] == 'actual') {
                            if ($campo['data']['value'] == 'Si') {
                                $actual = 1;
                            } else {
                                $actual = 0;
                            }
                            $condicionactual .= " AND cp.actual = {$actual} ";
                        } else {
                            if ($campo['field'] == 'fechacreacion') {
                                $arrayfechainicio = explode(
                                    ' ', $campo['data']['value']
                                );
                                if ($campo['data']['comparison'] == 'lt') {
                                    $condicionfecha
                                        .= " AND cp.fechacreacion < '"
                                        . $arrayfechainicio[0] . "' ";
                                } else {
                                    if ($campo['data']['comparison'] == 'gt') {
                                        $condicionfecha
                                            .= " AND cp.fechacreacion > '"
                                            . $arrayfechainicio[0] . "' ";
                                    } else {
                                        if ($campo['data']['comparison']
                                            == 'eq'
                                        ) {
                                            $condicionfecha
                                                .= " AND cp.fechacreacion = '"
                                                . $arrayfechainicio[0] . "' ";
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
            AND cp.idconfiguracionperfil IN (SELECT cpc.idconfiguracionperfil 
            FROM mod_objetivos.conf_perfilcalendario cpc WHERE true {$condicion}) 
            ORDER BY cp.denominacion";
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        //print_r($cadenaQUERY);die;
        $sqlTotal = $cadenaQUERY;
        if ($parametros->nolimit != 1) {
            $cadenaQUERY .= " OFFSET {$parametros->start} LIMIT {$parametros->limit} ";
        }
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        if ($parametros->nolimit != 1) {
            $result->total = count(
                $conn->execute($sqlTotal)->fetchAll(PDO::FETCH_ASSOC)
            );
        }
        return $result;
    }

    public function getConfigDadoIdconfperfil($id)
    {
        $query = new Doctrine_Query();
        $result = $query->from('ConfPerfilcalendario cpc')
            ->where('cpc.idconfiguracionperfil = ?', $id)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function actualizarActualCalendarA($idconfiguracionperfil)
    {
        $cadenaUPDATE = '';
        $cadenaJOIN = '';
        $cadenaWHERE = '';
        $cadenaQUERY = '';
        $cadenaUPDATE = " UPDATE conf_perfil SET actual = 0 ";
        $cadenaJOIN
            = " FROM mod_objetivos.conf_perfil c 
                INNER JOIN mod_objetivos.conf_perfilcalendario cp 
                ON c.idconfiguracionperfil = cp.idconfiguracionperfil";
        $cadenaWHERE
            = " WHERE c.actual = 1 
                AND c.idconfiguracionperfil <>{$idconfiguracionperfil} ";
        $cadenaQUERY = $cadenaUPDATE . $cadenaJOIN . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
       /* $result = */$conn->execute($cadenaQUERY);
        return 1;
    }

    public function actualizarActualCalendar()
    {
        $cadenaUPDATE = '';
        $cadenaJOIN = '';
        $cadenaWHERE = '';
        $cadenaQUERY = '';
        $cadenaUPDATE = " UPDATE conf_perfil SET actual = 0 ";
        $cadenaJOIN
            = " FROM mod_objetivos.conf_perfil c 
                INNER JOIN mod_objetivos.conf_perfilcalendario cp 
                ON c.idconfiguracionperfil = cp.idconfiguracionperfil";
        $cadenaWHERE = " WHERE c.actual = 1 ";
        $cadenaQUERY = $cadenaUPDATE . $cadenaJOIN . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        /*$result = */$conn->execute($cadenaQUERY);
        return 1;
    }


}

