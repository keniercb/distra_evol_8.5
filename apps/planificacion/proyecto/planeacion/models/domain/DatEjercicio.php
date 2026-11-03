<?php

class DatEjercicio extends BaseDatEjercicio
{

    public function setUp()
    {
        parent::setUp();
    }

    /**
     * Accion para listar los ejercicios
     */
    public function listarEjercicios($parametros)
    {
        $cadenaWhere = "";
        if ($parametros->filtros) {
            foreach ($parametros->filtros as $datos) {
                if ($datos ['field'] == 'denominacion') {
                    $cadenaWhere = $cadenaWhere . " AND upper(denominacion) LIKE '%" . strtoupper($datos ['data'] ['value']) . "%'";
                } elseif ($datos ['field'] == 'descripcion') {
                    $cadenaWhere = $cadenaWhere . " AND upper(descripcion) LIKE '%" . strtoupper($datos ['data'] ['value']) . "%'";
                } elseif ($datos ['field'] == 'tiempo') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {
                            $cond = ">";
                        }
                    }
                    $cadenaWhere = $cadenaWhere . " AND tiemporeal {$cond} " . ($datos ['data'] ['value']);
                } else if ($datos['field'] == 'estado') {
                    $cadenaWhere = $cadenaWhere . " AND estado in (" . $datos ['data'] ['value'] . ") ";
                } else if ($datos['field'] == 'fecha') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {
                            $cond = ">";
                        }
                    }
                    $arrayfecha = explode(' ', $datos ['data'] ['value']);
                    $fecha = explode('-', $arrayfecha[0]);
                    $cadenaWhere = $cadenaWhere . " AND fecha {$cond} '" . $fecha[0] . '-' . $fecha[1] . '-' . $fecha[2] . "'";
                }
            }
        }
        $cadenaQuery = "SELECT   
                                denominacion,
                                descripcion,
                                duracionestimada as duracionest,
                                tiemporeal as tiempo,
                                estado,
                                fecha,
                                idejercicio,  
                                idusuario,
                                count(*) OVER() as total
                          FROM 
                                mod_planifproyecto.dat_ejercicio
                                
                          WHERE identidad=$parametros->identidad 
                                AND idusuario=$parametros->idusuario
                                $cadenaWhere";

        $conn = Doctrine_Manager:: connection();
        $result = $conn->execute($cadenaQuery . " LIMIT(" . $parametros->limit . ")
                      OFFSET(" . $parametros->start . ")")->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Accion para eliminar los ejercicios
     */
    public function eliminarEjercicio($idejercicios)
    {
        $query = "DELETE FROM mod_planifproyecto.dat_ejercicio e
                  WHERE e.idejercicio in ($idejercicios)";
        $conn = Doctrine_Manager:: connection();
        $conn->execute($query);
        return 1;
    }

}
