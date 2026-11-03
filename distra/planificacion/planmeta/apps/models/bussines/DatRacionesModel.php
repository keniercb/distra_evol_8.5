<?php

class DatRacionesModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listarTipoBalance($idconftiponomesp)
    {
        return NomTipobalance::listarTipoBalance(
            $idconftiponomesp
        );
    }

    public function listarSubTipoBalance($idtipobalance)
    {
        //Capturo una instancia de Doctrine_Manager y obteniendo la conexion activa
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql
            = "SELECT idsubtipobalance, denominacion, idtipobalance
               FROM mod_planificacion.nom_subtipobalance WHERE idtipobalance = $idtipobalance
               order by denominacion";
        return $conn->fetchAll($sql);
    }

    public function buscarTS($params)
    {

        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT i.idnomecladordinamicoaft
            FROM mod_planificacion.nom_nomencladordinamicoaft i
            WHERE i.idtiponomencladoraft = "
            . $params['tipo'] . " and
                i.idsubtiponomencladoraft =" . $params['sub']
            . "and i.idespecialidad =" . $params['identidad'] . "";
        $resUno = $conn->execute($sql);

        return $resUno->fetchAll(PDO::FETCH_ASSOC);
    }

    public function guardarTS($params)
    {
        $id = self::buscarTS($params);
        if ($id[0] != "") {
            $resUno = array();
            return $resUno;
        } else {
            $conn = Doctrine_Manager::connection();
            $sql
                = "INSERT INTO  mod_planificacion.nom_nomencladordinamicoaft
                  (idtiponomencladoraft,idsubtiponomencladoraft,idespecialidad)
                VALUES (" . $params['tipo'] . "," . $params['sub'] . ","
                . $params['identidad'] . ");";
            $resUno = $conn->execute($sql);
            return $resUno->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public function consolidar($idsubtipobalance, $idconftiponomesp,$parametros
    )
    {
        if ($parametros) {
            foreach ($parametros as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $condiciones [] = "upper(a.denominacion) LIKE ? ";
                        $arrayParametros[] = ("%" . strtoupper($s) . "%");
                    } elseif ($p == 'descripcion') {
                        $condiciones [] = "upper(a.descripcion) LIKE ? ";
                        $arrayParametros[] = ("%" . strtoupper($s) . "%");
                    } else {
                        if ($p == 'total_mayorq' || $p == 'total_menorq'
                            || $p == 'total_iguala'
                        ) {
                            $condiciones [] = " ds.total " . $s['condicion']
                                . " ?";
                            $arrayParametros[] = $s['total'];
                        }
                    }
                }
            }

            foreach ($condiciones as $condicion) {
                if ($WHERE == "") {
                    $WHERE = 'AND ' . $condicion;
                } else {
                    $WHERE = $WHERE . " AND " . $condicion;
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $query
            = "

                        SELECT DISTINCT     a.idbalance, 
                                            a.denominacion,
                                            a.descripcion,
                                            ds.idsubtipobalance,
                                            ds.idsubtipobalancebalance,
                                            ds.coeficiente as coeficiente,
                                            SUM(ds.total) as total ,
                                            SUM(ds.racion) as racion 
                                            
                                            
                                            FROM mod_planificacion.nom_balance a
						
                                            INNER JOIN mod_planificacion.dat_subtipobalancebalance ds
                                                ON(a.idbalance = ds.idbalance ) 
					WHERE a.idconftiponomesp=" . $idconftiponomesp
            . " AND ds.idsubtipobalance=" . $idsubtipobalance . " $WHERE
					GROUP BY
                                            a.idbalance, 
                                            a.denominacion,
                                            a.descripcion,
					                        ds.idsubtipobalance,
					                        ds.coeficiente,
                                                                ds.idsubtipobalancebalance
                                            ";


        if ($arrayParametros) {
            $res = $conn->execute($query, $arrayParametros);
        } else {
            $res = $conn->execute($query);
        }
        return $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function consolidarexportar($parametros)
    {
        $conn = Doctrine_Manager::connection();
        $query
            = "

                        SELECT DISTINCT     a.idbalance, 
                                            a.denominacion,
                                            a.descripcion,
											ds.idsubtipobalance,
                                            ds.coeficiente as coeficiente,
                                            SUM(ds.total) as total ,
                                            SUM(ds.racion) as racion 
                                            
                                            
                                            FROM mod_planificacion.nom_balance a
						
                                            INNER JOIN mod_planificacion.dat_subtipobalancebalance ds
                                                ON(a.idbalance = ds.idbalance ) 
					WHERE a.idconftiponomesp=" . $parametros['idconftiponomesp']
            . " AND ds.idsubtipobalance=" . $parametros['idsubtipobalance'] . "
					GROUP BY
                                            a.idbalance, 
                                            a.denominacion,
                                            a.descripcion,
					                        ds.idsubtipobalance,
					                        ds.coeficiente
                                            ";
        if ($arrayParametros) {
            $res = $conn->execute($query, $arrayParametros);
        } else {
            $res = $conn->execute($query);
        }
        return $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function totalParcial($identidad, $idsubtipobalance, $todos,
        $idconftiponomesp, $parametros, $idejercicio, $hijas = null
    )
    {
        $data = NomBalance::totalParcialNiveles(
            $identidad, $idsubtipobalance,
            $parametros, $hijas, $idejercicio
        );
        return $data;
    }

    public function listarBalance($identidad, $idsubtipobalance, $todos,
        $idconftiponomesp, $start, $limit, $parametros, $idejercicio
    )
    {
        $data = NomBalance::listarRaciones(
            $identidad, $idsubtipobalance, $todos, $idconftiponomesp,
            $idejercicio
        );
        return $data;
    }

    public function listarTotalesBalance($identidad, $idsubtipobalance, $todos,
        $idconftiponomesp, $parametros, $idejercicio
    )
    {
        $data = NomBalance::listartotalRaciones(
            $identidad, $idsubtipobalance, $todos, $idconftiponomesp,
            $parametros, $idejercicio
        );
        return $data;
    }

    public function adicionarBalance($dat)
    {
        foreach ($dat as $data) {
            if ($data->idsubtipobalancebalance) {
                $balance = Doctrine::getTable('DatSubtipobalancebalance')->find(
                    $data->idsubtipobalancebalance
                );
            } else {
                $balance = new DatSubtipobalancebalance();
                $balance->idsubtipobalance = $data->idsubtipobalance;
                $balance->idbalance = $data->idbalance;
                $balance->coeficiente = 0;
                $balance->racion = 0;
                $balance->total = 0;
            }
            if (isset($data->coeficiente)) {
                $balance->coeficiente = $data->coeficiente;
            }
            if (isset($data->racion)) {
                $balance->racion = $data->racion;
            }
            //echo '<pre>';
            if (!$data->idsubtipobalancebalance && !$data->coeficiente
                && !$data->racion
            ) {
                break;
            }
            $balance->save();
        }
        return $data->codMsg = 1;
    }

}
