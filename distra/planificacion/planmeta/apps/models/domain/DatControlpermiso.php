<?php

class DatControlpermiso extends BaseDatControlpermiso {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomDatosnomenclador', array('local' => 'idestado', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasMany(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

    public function listarPermisos($parametros, $idsentidades) {
        $addWhereFiltros = "";
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'identidad') {
                    $idsentidades = $datos['data']['value'];
                } elseif ($datos['field'] == 'adicionar') {
                    if ($datos['data']['value'] == 'Sí')
                        $addWhereFiltros .= " AND cp.adicionar =1";
                    else
                        $addWhereFiltros .= " AND cp.adicionar =0";
                } elseif ($datos['field'] == 'eliminar') {
                    if ($datos['data']['value'] == 'Sí')
                        $addWhereFiltros .= " AND cp.eliminar =1";
                    else
                        $addWhereFiltros .= " AND cp.eliminar =0";
                } elseif ($datos['field'] == 'modificar') {
                    if ($datos['data']['value'] == 'Sí')
                        $addWhereFiltros .= " AND cp.modificar =1";
                    else
                        $addWhereFiltros .= " AND cp.modificar =0";
                }elseif ($datos ['field'] == 'fecha') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhereFiltros .= " AND cp.fecha::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhereFiltros .= " AND cp.fecha::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhereFiltros .= " AND cp.fecha::date='{$fechafin}'";
                    }
                } elseif ($datos['field'] == 'idusuario') {
                    $addWhereFiltros .= " AND cp.idusuario ={$datos['data']['value']}";
                }
            }
        }
        $delimitando = "";
        if ($parametros['start'] != null && $parametros['limit']) {
            $delimitando = " LIMIT {$parametros['limit']} OFFSET {$parametros['start']} ";
        }
        $conn = Doctrine_Manager::connection();

        $query = "SELECT idcontrolpermiso,
                        f.idfila as identidad,
                        case when eliminar = 1
                        then true else false end as eliminar,
                        case when modificar = 1
                        then true else false end as modificar,
                        case when adicionar = 1
                        then true else false end as adicionar,
                        idusuario,
                        fecha,
                        COUNT(*) OVER() AS total
                 FROM mod_estructuracomp.nom_filaestruc f
                    LEFT JOIN mod_planificacion.dat_controlpermiso cp ON (f.idfila = cp.identidad
                     AND cp.idfuncionalidad = {$parametros['idfuncionalidad']}  
                    AND cp.idejercicio = {$parametros['idejercicio']} 
                    AND cp.idestado = {$parametros['idestado']} )
                    where f.idfila IN ($idsentidades)
                    $addWhereFiltros
                    $delimitando";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        return $res;
    }

    //Servicio para obtener los permisos de una funcionalidad, 
    //en una entidad, en un ejercicio para el estado 
    //que tiene definido el mismo
    public function obtenerPermisosxEntidad($idfuncionalidad, $identidad, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT eliminar,
                         modificar,
                         adicionar
                 FROM mod_planificacion.dat_controlpermiso cp
                      INNER JOIN mod_planificacion.nom_ejercicioplanificacion e ON cp.idejercicio
                        = e.idejercicio AND cp.idestado = e.idestado
                 where cp.identidad = $identidad AND
                       cp.idfuncionalidad = $idfuncionalidad  AND
                       cp.idejercicio = $idejercicio";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if (!$res[0]) {
            $temp['eliminar'] = "0";
            $temp['modificar'] = "0";
            $temp['adicionar'] = "0";
            $res = array();
            $res[0] = $temp;
        }
        return $res;
    }

    public function asignarPermisoAdicionar($params, $identidad) {
        $params['identidad'] = $identidad;
        //Version 1.0
        //Operación más rápida [581ms, 545ms, 550ms]
        $conn = Doctrine_Manager::connection();
        $query = "SELECT idcontrolpermiso
          FROM mod_planificacion.dat_controlpermiso cp
          where cp.identidad = $identidad
          AND cp.idfuncionalidad = {$params['idfuncionalidad']}
          AND cp.idejercicio = {$params['idejercicio']}
          AND cp.idestado = {$params['idestado']}";
        $controlpermiso = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        if ($controlpermiso) {
            $queryUpdat = "UPDATE mod_planificacion.dat_controlpermiso
          SET adicionar = 1,idusuario ={$params['idusuario']}
          WHERE idcontrolpermiso = $controlpermiso[0]";
            $conn->execute($queryUpdat);
        } else {
            $queryInsert = "INSERT INTO mod_planificacion.dat_controlpermiso(idfuncionalidad, identidad,
          eliminar, modificar, adicionar, idejercicio, idestado, idusuario)
          VALUES ({$params['idfuncionalidad']},$identidad,0,0,1,{$params['idejercicio']},
          {$params['idestado']},{$params['idusuario']})";
            $conn->execute($queryInsert);
        }

        //Version 2.0
        //Operación más lenta... [3.83s, 3.78s, 4.11s]
        /* $controlpermiso = Doctrine::getTable('DatControlpermiso')->findByDql("idfuncionalidad = {$params['idfuncionalidad']} AND identidad = {$params['identidad']}  AND idejercicio = {$params['idejercicio']} AND idestado = {$params['idestado']}");
          $controlpermiso[0]->idfuncionalidad = $params['idfuncionalidad'];
          $controlpermiso[0]->identidad = $params['identidad'];
          $controlpermiso[0]->idejercicio = $params['idejercicio'];
          $controlpermiso[0]->idestado = $params['idestado'];
          $controlpermiso[0]->idusuario = $params['idusuario'];

          $controlpermiso[0]->adicionar = 1;
          $controlpermiso[0]->save(); */
    }

    public function asignarPermisoModificar($params, $identidad) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT idcontrolpermiso
                  FROM mod_planificacion.dat_controlpermiso cp                      
                  where cp.identidad = $identidad 
                        AND cp.idfuncionalidad = {$params['idfuncionalidad']}  
                        AND cp.idejercicio = {$params['idejercicio']} 
                        AND cp.idestado = {$params['idestado']}";
        $controlpermiso = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        if ($controlpermiso) {
            $queryUpdat = "UPDATE mod_planificacion.dat_controlpermiso
                            SET modificar = 1,idusuario ={$params['idusuario']}
                            WHERE idcontrolpermiso = $controlpermiso[0]";
            $conn->execute($queryUpdat);
        } else {
            $queryInsert = "INSERT INTO mod_planificacion.dat_controlpermiso(idfuncionalidad, identidad,
                            eliminar, modificar, adicionar, idejercicio, idestado, idusuario)
                          VALUES ({$params['idfuncionalidad']},$identidad,0,1,0,{$params['idejercicio']},
                          {$params['idestado']},{$params['idusuario']})";
            $conn->execute($queryInsert);
        }
    }

    public function asignarPermisoEliminar($params, $identidad) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT idcontrolpermiso
                  FROM mod_planificacion.dat_controlpermiso cp                      
                  where cp.identidad = $identidad 
                        AND cp.idfuncionalidad = {$params['idfuncionalidad']}  
                        AND cp.idejercicio = {$params['idejercicio']} 
                        AND cp.idestado = {$params['idestado']}";
        $controlpermiso = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        if ($controlpermiso) {
            $queryUpdat = "UPDATE mod_planificacion.dat_controlpermiso
                            SET eliminar = 1,idusuario ={$params['idusuario']}
                            WHERE idcontrolpermiso = $controlpermiso[0]";
            $conn->execute($queryUpdat);
        } else {
            $queryInsert = "INSERT INTO mod_planificacion.dat_controlpermiso(idfuncionalidad, identidad,
                            eliminar, modificar, adicionar, idejercicio, idestado, idusuario)
                          VALUES ({$params['idfuncionalidad']},$identidad,1,0,0,{$params['idejercicio']},
                          {$params['idestado']},{$params['idusuario']})";
            $conn->execute($queryInsert);
        }
    }

    public function quitarPermisoAdicionar($params, $identidad) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT idcontrolpermiso
                  FROM mod_planificacion.dat_controlpermiso cp                      
                  where cp.identidad = $identidad 
                        AND cp.idfuncionalidad = {$params['idfuncionalidad']}  
                        AND cp.idejercicio = {$params['idejercicio']} 
                        AND cp.idestado = {$params['idestado']}";
        $controlpermiso = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        if ($controlpermiso) {
            $queryUpdat = "UPDATE mod_planificacion.dat_controlpermiso
                            SET adicionar = 0,idusuario ={$params['idusuario']}
                            WHERE idcontrolpermiso = $controlpermiso[0]";
            $conn->execute($queryUpdat);
        } else {
            $queryInsert = "INSERT INTO mod_planificacion.dat_controlpermiso(idfuncionalidad, identidad,
                            eliminar, modificar, adicionar, idejercicio, idestado, idusuario)
                          VALUES ({$params['idfuncionalidad']},$identidad,0,0,0,{$params['idejercicio']},
                          {$params['idestado']},{$params['idusuario']})";
            $conn->execute($queryInsert);
        }
    }

    public function quitarPermisoModificar($params, $identidad) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT idcontrolpermiso
                  FROM mod_planificacion.dat_controlpermiso cp                      
                  where cp.identidad = $identidad 
                        AND cp.idfuncionalidad = {$params['idfuncionalidad']}  
                        AND cp.idejercicio = {$params['idejercicio']} 
                        AND cp.idestado = {$params['idestado']}";
        $controlpermiso = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        if ($controlpermiso) {
            $queryUpdat = "UPDATE mod_planificacion.dat_controlpermiso
                            SET modificar = 0,idusuario ={$params['idusuario']}
                            WHERE idcontrolpermiso = $controlpermiso[0]";
            $conn->execute($queryUpdat);
        } else {
            $queryInsert = "INSERT INTO mod_planificacion.dat_controlpermiso(idfuncionalidad, identidad,
                            eliminar, modificar, adicionar, idejercicio, idestado, idusuario)
                          VALUES ({$params['idfuncionalidad']},$identidad,0,0,0,{$params['idejercicio']},
                          {$params['idestado']},{$params['idusuario']})";
            $conn->execute($queryInsert);
        }
    }

    public function quitarPermisoEliminar($params, $identidad) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT idcontrolpermiso
                  FROM mod_planificacion.dat_controlpermiso cp                      
                  where cp.identidad = $identidad 
                        AND cp.idfuncionalidad = {$params['idfuncionalidad']}  
                        AND cp.idejercicio = {$params['idejercicio']} 
                        AND cp.idestado = {$params['idestado']}";
        $controlpermiso = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        if ($controlpermiso) {
            $queryUpdat = "UPDATE mod_planificacion.dat_controlpermiso
                            SET eliminar = 0,idusuario ={$params['idusuario']}
                            WHERE idcontrolpermiso = $controlpermiso[0]";
            $conn->execute($queryUpdat);
        } else {
            $queryInsert = "INSERT INTO mod_planificacion.dat_controlpermiso(idfuncionalidad, identidad,
                            eliminar, modificar, adicionar, idejercicio, idestado, idusuario)
                          VALUES ({$params['idfuncionalidad']},$identidad,0,0,0,{$params['idejercicio']},
                          {$params['idestado']},{$params['idusuario']})";
            $conn->execute($queryInsert);
        }
    }

}
