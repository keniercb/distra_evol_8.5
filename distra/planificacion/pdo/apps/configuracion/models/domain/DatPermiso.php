<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatPermiso extends BaseDatPermiso {

    public function setUp() {
        parent::setUp();
    }

    public function ObtenerPermisos($idppara, $limit, $start, $filters) {
        //$subordinado = 1;
        $query = new Doctrine_Query();
        if (is_array($filters)) {
            foreach ($filters as $datos) {
                if ($datos ['field'] == 'tipo') {
                    if ($datos ['data'] ['value'] == 'Grupo') {
                        $query->addWhere('p.tipopsobre = ?', '0');
                    } else {
                        $query->addWhere('p.tipopsobre = ?', '1');
                    }
                } elseif ($datos ['field'] == 'leer') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $query->addWhere(
                                "(p.numpermiso = 1 OR p.numpermiso = 5 
                            OR p.numpermiso = 7 OR p.numpermiso = 3 
                            OR p.numpermiso = 9 OR p.numpermiso = 13 
                            OR p.numpermiso = 15 OR p.numpermiso = 11)"
                        );
                    } else {
                        $query->addWhere(
                                "(p.numpermiso != 1 AND p.numpermiso != 5 
                            AND p.numpermiso != 7 AND p.numpermiso != 3
                            AND p.numpermiso != 9 AND p.numpermiso != 13 
                            AND p.numpermiso != 15 AND p.numpermiso != 11)"
                        );
                    }
                } elseif ($datos ['field'] == 'annadir') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $query->addWhere(
                                "(p.numpermiso = 2 OR p.numpermiso = 3 
                            OR p.numpermiso = 7 OR p.numpermiso = 11 
                            OR p.numpermiso = 15)"
                        );
                    } else {
                        $query->addWhere(
                                "(p.numpermiso != 2 AND p.numpermiso != 3 
                            AND p.numpermiso != 7 AND p.numpermiso != 11 
                            AND p.numpermiso != 15)"
                        );
                    }
                } elseif ($datos ['field'] == 'modificar') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $query->addWhere(
                                "(p.numpermiso = 5 OR p.numpermiso = 7 
                            OR p.numpermiso = 13 OR p.numpermiso = 15)"
                        );
                    } else {
                        $query->addWhere(
                                "(p.numpermiso != 5 AND p.numpermiso != 7 
                            AND p.numpermiso != 13 AND p.numpermiso != 15)"
                        );
                    }
                } elseif ($datos ['field'] == 'eliminar') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $query->addWhere(
                                "(p.numpermiso = 9 OR p.numpermiso = 11 
                            OR p.numpermiso = 13 OR p.numpermiso = 15)"
                        );
                    } else {
                        $query->addWhere(
                                "(p.numpermiso != 9 AND p.numpermiso != 11 
                            AND p.numpermiso != 13 AND p.numpermiso != 15)"
                        );
                    }
                }
            }
        }
        $result = $query->select('p.*')
                ->from('DatPermiso p')
                ->addWhere("p.idppara = $idppara  ")
                ->execute();
        $resultado['total'] = count($result->toArray());
        $resultt = $query->select('p.*')
                ->from('DatPermiso p')
                ->addWhere("p.idppara = $idppara ")
                ->offset($start)
                ->limit($limit)
                ->execute();
//        echo $query->getSqlQuery();die;
        $resultado['resultado'] = $resultt->toArray();
        return $resultado;
    }

    static public function GetPermisosPorIdusuariocreaNoSubNoGrupo(
    $idusuariocrea, $limit, $start, $filters
    ) {
        $subordinado = 0;
        $esgrupo = 0;
        $query = new Doctrine_Query();
        if (is_array($filters)) {
            foreach (
            $filters as /* $key => */ $datos
            ) {
                if ($datos ['field'] == 'denominacionpara') {
                    $query->addWhere(
                            "upper(p.denppara) LIKE '%" . strtoupper(
                                    $datos ['data'] ['value']
                            ) . "%'"
                    );
                } elseif ($datos ['field'] == 'denominacionsobre') {

                    $query->addWhere(
                            "upper(p.denpsobre) LIKE '%" . strtoupper(
                                    $datos ['data'] ['value']
                            ) . "%'"
                    );
                } elseif ($datos ['field'] == 'tipopara') {
                    if ($datos ['data'] ['value'] == 'Grupo') {
                        $query->addWhere('p.tipoppara = ?', '0');
                    } else {
                        $query->addWhere('p.tipoppara = ?', '1');
                    }
                } elseif ($datos ['field'] == 'tiposobre') {
                    if ($datos ['data'] ['value'] == 'Grupo') {
                        $query->addWhere('p.tipopsobre = ?', '0');
                    } else {
                        $query->addWhere('p.tipopsobre = ?', '1');
                    }
                } elseif ($datos ['field'] == 'leer') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $query->addWhere(
                                "(p.numpermiso = 1 OR p.numpermiso = 5 
                            OR p.numpermiso = 7 OR p.numpermiso = 3 
                            OR p.numpermiso = 9 OR p.numpermiso = 13 
                            OR p.numpermiso = 15 OR p.numpermiso = 11)"
                        );
                    } else {
                        $query->addWhere(
                                "(p.numpermiso != 1 AND p.numpermiso != 5 
                            AND p.numpermiso != 7 AND p.numpermiso != 3 
                            AND p.numpermiso != 9 AND p.numpermiso != 13 
                            AND p.numpermiso != 15 AND p.numpermiso != 11)"
                        );
                    }
                } elseif ($datos ['field'] == 'annadir') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $query->addWhere(
                                "(p.numpermiso = 2 OR p.numpermiso = 3 
                            OR p.numpermiso = 7 OR p.numpermiso = 11 
                            OR p.numpermiso = 15)"
                        );
                    } else {
                        $query->addWhere(
                                "(p.numpermiso != 2 AND p.numpermiso != 3 
                            AND p.numpermiso != 7 AND p.numpermiso != 11 
                            AND p.numpermiso != 15)"
                        );
                    }
                } elseif ($datos ['field'] == 'modificar') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $query->addWhere(
                                "(p.numpermiso = 5 OR p.numpermiso = 7 
                            OR p.numpermiso = 13 OR p.numpermiso = 15)"
                        );
                    } else {
                        $query->addWhere(
                                "(p.numpermiso != 5 AND p.numpermiso != 7 
                            AND p.numpermiso != 13 AND p.numpermiso != 15)"
                        );
                    }
                } elseif ($datos ['field'] == 'eliminar') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $query->addWhere(
                                "(p.numpermiso = 9 OR p.numpermiso = 11 
                            OR p.numpermiso = 13 OR p.numpermiso = 15)"
                        );
                    } else {
                        $query->addWhere(
                                "(p.numpermiso != 9 AND p.numpermiso != 11 
                            AND p.numpermiso != 13 AND p.numpermiso != 15)"
                        );
                    }
                }
            }
        }
        $result = $query->select('p.*')
                ->from('DatPermiso p')
                ->addWhere(
                        "p.idusuariocrea = $idusuariocrea 
                AND p.subordinado = $subordinado  
                AND (p.esgrupo = $esgrupo OR p.esgrupo IS NULL)"
                )
                ->execute();
        $resultado['total'] = count($result->toArray());
        $resultt = $query->select('p.*')
                ->from('DatPermiso p')
                ->addWhere(
                        "p.idusuariocrea = $idusuariocrea 
                AND p.subordinado = $subordinado  
                AND (p.esgrupo = $esgrupo OR p.esgrupo IS NULL)"
                )
                ->offset($start)
                ->limit($limit)
                ->execute();
        $resultado['resultado'] = $resultt->toArray();
        return $resultado;
    }

    static public function GetPermisoPorURIPermiso($uri) {
        $query = new Doctrine_Query();
        $result = $query->select('p.*')
                ->from('DatPermiso p')
                ->where('p.uri = ?', $uri)
                ->execute();
        return $result->toArray();
    }
//sera
    static public function ObtenerPermisosSobreSubordinados($idppara) {
        $subordinado = 1;
//        $query = new Doctrine_Query();
//        $result = $query->select('p.*')
//                ->from('DatPermiso p')
//                ->where("p.idppara = $idppara AND p.subordinado = $subordinado")
//                ->execute();
//        return $result->toArray();

        $connA = Doctrine_Manager:: connection();
        $cadena
            = "select p.*,
                       case
                         when u.idpersona is null then u.nombreusuario
                         else u.nombreusuario || ' (' || coalesce((coalesce(pe.nombre, '') ||
                           coalesce(' ' || pe.snombre, '') || coalesce(' ' || pe.papel, '') ||
                           coalesce(' ' || pe.sapel, '')), '') || ')'
                       end as nombrecompleto,
                       coalesce((coalesce(pe.nombre, '') || coalesce(' ' || pe.snombre, '') ||
                         coalesce(' ' || pe.papel, '') || coalesce(' ' || pe.sapel, '')), '') as
                         nombresolo
                from mod_objetivos.dat_permiso p
                     inner join mod_seguridad.seg_usuario u on (u.idusuario = p.idpsobre)
                     left join mod_persona.dat_persona pe on (pe.idpersona = u.idpersona)
                where p.idppara = $idppara AND
                      p.subordinado = $subordinado
                order By nombresolo";
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;




    }

    static public function ObtenerPermisosSobreGrupo($idppara) {
        $esgrupo = 1;
        $query = new Doctrine_Query();
        $result = $query->select('p.*')
                ->from('DatPermiso p')
                ->where("p.idppara = $idppara AND p.esgrupo = $esgrupo")
                ->execute();
        return $result->toArray();
    }

    public function EliminarPermisosPorId($arrayidpermisos) {
        $query = Doctrine_Query::create();
        $query->delete('DatPermiso')
                ->from('DatPermiso')
                ->whereIn('idpermiso', $arrayidpermisos)
                ->execute();
    }

    public function EliminarPermisosPorURI($uri) {
        $query = Doctrine_Query::create();
        $query->delete('DatPermiso')
                ->from('DatPermiso')
                ->whereIn('uri', $uri)
                ->execute();
    }

    static public function GetPermisosPara($idppara) {
        $subordinado = 0;
        $esgrupo = 0;
        $query = new Doctrine_Query();
        $result = $query->select('p.*')
                ->from('DatPermiso p')
                ->where(
                        "p.idppara = $idppara AND p.subordinado = $subordinado 
                AND (p.esgrupo = $esgrupo OR p.esgrupo IS NULL)"
                )
                ->execute();
        return $result->toArray();
    }

    static public function GetPermisosAdicionarNivelSupPara($idppara) {
        $subordinado = 0;
        $esgrupo = 0;
        $query = new Doctrine_Query();
        $result = $query->select('p.*')
                ->from('DatPermiso p')
                ->where(
                        "p.idppara = $idppara AND p.subordinado = $subordinado 
                AND (p.esgrupo = $esgrupo OR p.esgrupo IS NULL) 
                AND p.idusuariocrea <> $idppara AND (p.numpermiso = 2 
                OR p.numpermiso = 3 OR p.numpermiso = 7 OR p.numpermiso= 11 
                OR p.numpermiso = 15)"
                )
                ->execute();
        return $result->toArray();
    }

    static public function GetPermisosParaDadoIdusuariocrea(
    $idppara, $idusuariocrea
    ) {
        $query = new Doctrine_Query();
        $result = $query->select('p.*')
                ->from('DatPermiso p')
                ->where("p.idppara = $idppara AND p.idusuariocrea = $idusuariocrea")
                ->execute();
        return $result->toArray();
    }

    static public function GetPermisosSobreDadoIdusuariocrea(
    $idpsobre, $idusuariocrea
    ) {
        $query = new Doctrine_Query();
        $result = $query->select('p.*')
                ->from('DatPermiso p')
                ->where(
                        "p.idpsobre = $idpsobre AND p.idusuariocrea = $idusuariocrea"
                )
                ->execute();
        return $result->toArray();
    }

    static public function DamePermisosParaSobre($idppara, $idpsobre) {
        $query = new Doctrine_Query();
        $result = $query->select('p.*')
                ->from('DatPermiso p')
                ->where(" p.idppara = '$idppara' AND   p.idpsobre = '$idpsobre'")
                ->execute();
        return $result->toArray();
    }

    static public function ObtPermisosDado_UserDenSubPara($idppara, $denominacion, $subordinado, $permiso
    ) {
        $query = new Doctrine_Query ();
        switch ($permiso) {
            case 'adicionar':
                $result = $query->select('p.*')
                        ->from('DatPermiso p')
                        ->where(
                                "(p.idpsobre = $idppara)
                    AND p.subordinado = $subordinado
                    AND (p.denppara ILIKE '%$denominacion%')
                    AND (p.numpermiso = 2
                    OR p.numpermiso = 3
                    OR p.numpermiso = 7
                    OR p.numpermiso= 11
                    OR p.numpermiso = 15)"
                        )
                        ->execute();
                return $result->toArray();
                break;
        }
    }

    static public function ObtPermisosDado_UserDenSub(
    $idppara, $denominacion, $subordinado, $permiso
    ) {
        $query = new Doctrine_Query();
        switch ($permiso) {
            case 'adicionar':
                $result = $query->select('p.*')
                        ->from('DatPermiso p')
                        ->where(
                                "p.idppara = $idppara AND p.subordinado = $subordinado 

                        AND (p.numpermiso = 2 OR p.numpermiso = 3 
                        OR p.numpermiso = 7 OR p.numpermiso= 11 
                        OR p.numpermiso = 15)"
                        )
                        ->execute();
                //AND p.denpsobre ILIKE '%$denominacion%'
                return $result->toArray();
                break;
            case 'leer':
                $result = $query->select('p.*')
                        ->from('DatPermiso p')
                        ->where(
                                "p.idppara = $idppara AND p.subordinado = $subordinado 
                        AND p.denpsobre ILIKE '%$denominacion%' 
                        AND (p.numpermiso <> 2)"
                        )
                        ->execute();
                return $result->toArray();
                break;
        }
    }

    static public function EliminarPermisosPSobre(
    $arrayidpsobre, $idusuariocrea
    ) {
        $consulta
                = "DELETE FROM mod_objetivos.dat_permiso p
                    WHERE p.idpsobre IN(" . $arrayidpsobre
                . ") AND idusuariocrea = " . $idusuariocrea;                
        $conn = Doctrine_Manager:: connection();
        /* $res = */
        $conn->execute($consulta);
    }

    static public function eliminarPermisos($idPermisos) {
        $consulta
                = "DELETE FROM mod_objetivos.dat_permiso p
                    WHERE p.idpsobre = $idPermisos OR p.idppara = $idPermisos";
        $conn = Doctrine_Manager:: connection();
        $conn->execute($consulta);
    }

    static public function obtenerCadenaSubordinacion(
    $idusuariosession, $idsubordinado
    ) {
        $consulta
                = "SELECT * FROM mod_objetivos.dat_subordinacion s
            WHERE s.nivelrelacion = 1 AND s.idpadre = ";
        if ($idsubordinado == 0) {
            $consulta .= "" . $idusuariosession;
        } else {
            $consulta .= "" . $idsubordinado . " AND s.idpadre 
            IN (SELECT s1.idhijo FROM mod_objetivos.dat_subordinacion s1
            WHERE s1.idpadre = "
                    . $idusuariosession . ")";
        }
        $conn = Doctrine_Manager:: connection();
        $resultado = $conn->execute($consulta);
        return $resultado->fetchAll();
    }

    public function obtenerSubordinados($idusuariosession) {
        $cadena = "  select * from mod_objetivos.f_devolversubordinados  ( " . $idusuariosession . " )";
        $connector = Doctrine_Manager:: connection();
        $resultado = $connector->execute($cadena)->fetchAll();
        //print_r($resultado);die;
        return $resultado;
    }

}

//fin clase 




