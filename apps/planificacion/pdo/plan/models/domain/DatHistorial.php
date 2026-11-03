<?php

/**
 * @author  Osleidy Quiala Fernández
 * @version 1.0.0
 */
class DatHistorial extends BaseDatHistorial
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomAccion', array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
    }

    public function Buscar($idhistorial)
    {
        $temp = $this->conn->getTable('DatHistorial')->find($idhistorial);
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatHistorial')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 20, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatHistorial')->limit($limite = 20)->offset(
            $inicio = 0
        )->execute();
        return $result->toArray();
    }

    public function Insertar($obj)
    {
        $datHistorial = new DatHistorial();
        try {
            $datHistorial->idtipoelemento = $obj->idtipoelemento;
            $datHistorial->idelemento = $obj->idelemento;
            $datHistorial->idautor = $obj->idautor;
            $datHistorial->idaccion = $obj->idaccion;
            $datHistorial->fecha = date('d/m/Y');
            $datHistorial->save();
            return $datHistorial->idhistorial;
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    /**
     * Funcion para listar historial de actividades
     */
    public function listarActividades($parametros)
    {
        $condicionfecha = '';
        $condicioncar = '';
        $condicionaccion = '';
        $condicionautor = '';
        $condiciondenominacion = '';
        $cadenaSELECT
            = " SELECT dh.idhistorial, dh.idtipoelemento, dh.idelemento as car, 
                dh.denelemento as denominacion,	dh.fechainicio, dh.fechafin, 
                dh.horainicio, dh.horafin, dh.descelemento, 
                dh.gradocumplimiento, dh.participante, dh.dirigente, 
                dh.involucrados, dh.idautor as autor, dh.idaccion as accion, dh.estado as estado,
                dh.fecha as fecha, dh.hora as hora ";
        $cadenaJOIN = " FROM mod_objetivos.dat_historial dh ";
        if (is_array($parametros->filtros)) {
            foreach ($parametros->filtros as $campo) {
                if ($campo['field'] == 'car') {
                    $car = $campo['data']['value'];
                    $condicioncar .= " AND dh.uriidelemento ILIKE '%{$car}%'";
                } elseif ($campo['field'] == 'denominacion') {
                    $denominacion = $campo['data']['value'];
                    $condiciondenominacion .= " AND dh.denelemento ILIKE '%{$denominacion}%'";
                } elseif ($campo['field'] == 'accion') {
                    if ($campo['data']['value'] == 'Modificado') {
                        $accion = 2;
                    } elseif ($campo['data']['value'] == 'Creado') {
                        $accion = 1;
                    } elseif ($campo['data']['value'] == 'Eliminado') {
                        $accion = 3;
                    } else {
                        $accion = 4;
                    }
                    $condicionaccion .= " AND dh.idaccion = {$accion} ";
                } elseif ($campo['field'] == 'autor') {
                    $autor = $campo['data']['value'];
                    $condicionautor .= " AND dh.idautor ILIKE '%{$autor}%'";
                } elseif ($campo['field'] == 'fecha') {
                    $arrayfechainicio = explode(' ', $campo['data']['value']);
                    if ($campo['data']['comparison'] == 'lt') {
                        $condicionfecha .= " AND dh.fecha < '"
                            . $arrayfechainicio[0] . "' ";
                    } elseif ($campo['data']['comparison'] == 'gt') {
                        $condicionfecha .= " AND dh.fecha > '"
                            . $arrayfechainicio[0] . "' ";
                    } elseif ($campo['data']['comparison'] == 'eq') {
                        $condicionfecha .= " AND dh.fecha = '"
                            . $arrayfechainicio[0] . "' ";
                    }
                }
            }
        }
        $autoroelemento = " dh.idautor = {$parametros->idusuario} ";
        if ($parametros->idelemento) {
            $autoroelemento = " dh.idelemento = {$parametros->idelemento}";
        }
        $cadenaWHERE
            = " WHERE {$autoroelemento}" . $condicionfecha . "" . $condicioncar
            . "" . $condicionautor . "" . $condicionaccion . ""
            . $condiciondenominacion .
            " AND dh.idtipoelemento = 3 ";
        if ($parametros->sort) {
            $cadenaORDER = " ORDER BY {$parametros->sort} {$parametros->dir}";
        } else {
            $cadenaORDER = " ORDER BY dh.idhistorial ASC ";
        }
        $cadenaQUERY
            = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE . $cadenaORDER;
        $sqlTotal = $cadenaQUERY;
        if ($parametros->nolimit != 1) {
            $cadenaQUERY .= " OFFSET {$parametros->start} LIMIT {$parametros->limit} ";
        }

//        print_r($cadenaQUERY);die;

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

    /**
     * Funcion para listar historial de planes
     */
    public function listarPlanes($parametros)
    {
        $condicionfecha = '';
        $condicioncar = '';
        $condicionaccion = '';
        $condicionautor = '';
        $condiciondenominacion = '';
        $cadenaSELECT
            = " SELECT dh.idhistorial, dh.idtipoelemento, dh.idelemento as car,
                        dh.denelemento as denominacion, dh.idautor as autor, 
                        dh.idaccion as accion, dh.fecha, dh.fechainicio, 
                        dh.fechafin, dh.descelemento, dh.gradocumplimiento ";
        $cadenaJOIN = " FROM mod_objetivos.dat_historial dh ";
        if (is_array($parametros->filtros)) {
            foreach ($parametros->filtros as $campo) {
                if ($campo['field'] == 'car') {
                    $car = $campo['data']['value'];
                    $condicioncar .= " AND dh.uriidelemento ILIKE '%{$car}%'";
                } elseif ($campo['field'] == 'denominacion') {
                    $denominacion = $campo['data']['value'];
                    $condiciondenominacion .= " AND dh.denelemento ILIKE '%{$denominacion}%'";
                } elseif ($campo['field'] == 'accion') {
                    if ($campo['data']['value'] == 'Modificado') {
                        $accion = 2;
                    } elseif ($campo['data']['value'] == 'Creado') {
                        $accion = 1;
                    } elseif ($campo['data']['value'] == 'Eliminado') {
                        $accion = 3;
                    } else {//Cambio de estado
                        $accion = 4;
                    }
                    $condicionaccion .= " AND dh.idaccion = {$accion} ";
                } elseif ($campo['field'] == 'autor') {
                    $autor = $campo['data']['value'];
                    $condicionautor .= " AND dh.idautor ILIKE '%{$autor}%'";
                } elseif ($campo['field'] == 'fecha') {
                    $arrayfechainicio = explode(' ', $campo['data']['value']);
                    if ($campo['data']['comparison'] == 'lt') {
                        $condicionfecha .= " AND dh.fecha < '"
                            . $arrayfechainicio[0] . "' ";
                    } elseif ($campo['data']['comparison'] == 'gt') {
                        $condicionfecha .= " AND dh.fecha > '"
                            . $arrayfechainicio[0] . "' ";
                    } elseif ($campo['data']['comparison'] == 'eq') {
                        $condicionfecha .= " AND dh.fecha = '"
                            . $arrayfechainicio[0] . "' ";
                    }
                }
            }
        }
        $autoroelemento = " dh.idautor = {$parametros->idusuario} ";
        if ($parametros->idelemento) {
            $autoroelemento = " dh.idelemento = {$parametros->idelemento}";
        }
        $cadenaWHERE
            = " WHERE {$autoroelemento}" . $condicionfecha . "" . $condicioncar
            . "" . $condicionautor . "" . $condicionaccion . ""
            . $condiciondenominacion . "
                        AND dh.idtipoelemento = 0 ";
        if ($parametros->sort) {
            $cadenaORDER = " ORDER BY {$parametros->sort} {$parametros->dir}";
        } else {
            $cadenaORDER = " ORDER BY dh.idhistorial ASC ";
        }
        $cadenaQUERY
            = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE . $cadenaORDER;
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

    /**
     * Funcion para listar historial de objetivos
     */
    public function listarObjetivos($parametros)
    {
        $condicionfecha = '';
        $condicioncar = '';
        $condicionaccion = '';
        $condicionautor = '';
        $condiciondenominacion = '';
        $cadenaSELECT
            = " SELECT dh.idhistorial, dh.idtipoelemento, dh.idelemento as car,
                dh.denelemento as denominacion, dh.idautor as autor, 
                dh.idaccion as accion, dh.fecha, dh.fechainicio, dh.fechafin, 
                dh.descelemento, dh.gradocumplimiento, dh.participante, 
                dh.dirigente, dh.involucrados";
        $cadenaJOIN = " FROM mod_objetivos.dat_historial dh ";
        if (is_array($parametros->filtros)) {
            foreach ($parametros->filtros as $campo) {
                if ($campo['field'] == 'car') {
                    $car = $campo['data']['value'];
                    $condicioncar .= " AND dh.uriidelemento ILIKE '%{$car}%'";
                } elseif ($campo['field'] == 'denominacion') {
                    $denominacion = $campo['data']['value'];
                    $condiciondenominacion .= " AND dh.denelemento ILIKE '%{$denominacion}%'";
                } elseif ($campo['field'] == 'accion') {
                    if ($campo['data']['value'] == 'Modificado') {
                        $accion = 2;
                    } elseif ($campo['data']['value'] == 'Creado') {
                        $accion = 1;
                    } elseif ($campo['data']['value'] == 'Eliminado') {
                        $accion = 3;
                    } else {
                        $accion = 4;
                    }
                    $condicionaccion .= " AND dh.idaccion = {$accion} ";
                } elseif ($campo['field'] == 'autor') {
                    $autor = $campo['data']['value'];
                    $condicionautor .= " AND dh.idautor ILIKE '%{$autor}%'";
                } elseif ($campo['field'] == 'fecha') {
                    $arrayfechainicio = explode(' ', $campo['data']['value']);
                    if ($campo['data']['comparison'] == 'lt') {
                        $condicionfecha .= " AND dh.fecha < '"
                            . $arrayfechainicio[0] . "' ";
                    } elseif ($campo['data']['comparison'] == 'gt') {
                        $condicionfecha .= " AND dh.fecha > '"
                            . $arrayfechainicio[0] . "' ";
                    } elseif ($campo['data']['comparison'] == 'eq') {
                        $condicionfecha .= " AND dh.fecha = '"
                            . $arrayfechainicio[0] . "' ";
                    }
                }
            }
        }
        $autoroelemento = " dh.idautor = {$parametros->idusuario} ";
        if ($parametros->idelemento) {
            $autoroelemento = " dh.idelemento = {$parametros->idelemento}";
        }
        $cadenaWHERE
            = " WHERE {$autoroelemento}" . $condicionfecha . "" . $condicioncar
            . "" . $condicionautor . "" . $condicionaccion . ""
            . $condiciondenominacion .
            " AND dh.idtipoelemento = 1";
        if ($parametros->sort) {
            $cadenaORDER = " ORDER BY {$parametros->sort} {$parametros->dir}";
        } else {
            $cadenaORDER = " ORDER BY dh.idhistorial ASC ";
        }
        $cadenaQUERY
            = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE . $cadenaORDER;
        $sqlTotal = $cadenaQUERY;
        $cadenaQUERY .= " OFFSET {$parametros->start} LIMIT {$parametros->limit} ";
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)
            ->fetchAll(PDO::FETCH_ASSOC);
        $result->total = count(
            $conn->execute($sqlTotal)->fetchAll(PDO::FETCH_ASSOC)
        );
        return $result;
    }

    public function listarFIP($parametros)
    {
        $condicionfecha = '';
        $condicioncar = '';
        $condicionaccion = '';
        $condicionautor = '';
        $condiciondenominacion = '';
        $cadenaSELECT
            = " SELECT dh.idhistorial, dh.idtipoelemento, dh.idelemento as car,
                dh.denelemento as denominacion, dh.idautor as autor,
                dh.idaccion as accion, dh.fecha, dh.fechainicio, dh.fechafin,
                dh.descelemento, dh.gradocumplimiento, dh.participante,
                dh.dirigente, dh.involucrados";
        $cadenaJOIN = " FROM mod_objetivos.dat_historial dh ";
        if (is_array($parametros->filtros)) {
            foreach ($parametros->filtros as $campo) {
                if ($campo['field'] == 'car') {
                    $car = $campo['data']['value'];
                    $condicioncar .= " AND dh.uriidelemento ILIKE '%{$car}%'";
                } elseif ($campo['field'] == 'denominacion') {
                    $denominacion = $campo['data']['value'];
                    $condiciondenominacion .= " AND dh.denelemento ILIKE '%{$denominacion}%'";
                } elseif ($campo['field'] == 'accion') {
                    if ($campo['data']['value'] == 'Modificado') {
                        $accion = 2;
                    } elseif ($campo['data']['value'] == 'Creado') {
                        $accion = 1;
                    } elseif ($campo['data']['value'] == 'Eliminado') {
                        $accion = 3;
                    } else {
                        $accion = 4;
                    }
                    $condicionaccion .= " AND dh.idaccion = {$accion} ";
                } elseif ($campo['field'] == 'autor') {
                    $autor = $campo['data']['value'];
                    $condicionautor .= " AND dh.idautor ILIKE '%{$autor}%'";
                } elseif ($campo['field'] == 'fecha') {
                    $arrayfechainicio = explode(' ', $campo['data']['value']);
                    if ($campo['data']['comparison'] == 'lt') {
                        $condicionfecha .= " AND dh.fecha < '"
                            . $arrayfechainicio[0] . "' ";
                    } elseif ($campo['data']['comparison'] == 'gt') {
                        $condicionfecha .= " AND dh.fecha > '"
                            . $arrayfechainicio[0] . "' ";
                    } elseif ($campo['data']['comparison'] == 'eq') {
                        $condicionfecha .= " AND dh.fecha = '"
                            . $arrayfechainicio[0] . "' ";
                    }
                }
            }
        }
        $autoroelemento = " dh.idautor = {$parametros->idusuario} ";
        if ($parametros->idelemento) {
            $autoroelemento = " dh.idelemento = {$parametros->idelemento}";
        }
        $cadenaWHERE
            = " WHERE {$autoroelemento}" . $condicionfecha . "" . $condicioncar
            . "" . $condicionautor . "" . $condicionaccion . ""
            . $condiciondenominacion .
            " AND dh.idtipoelemento = 2";
        if ($parametros->sort) {
            $cadenaORDER = " ORDER BY {$parametros->sort} {$parametros->dir}";
        } else {
            $cadenaORDER = " ORDER BY dh.idhistorial ASC ";
        }
        $cadenaQUERY
            = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE . $cadenaORDER;
        $sqlTotal = $cadenaQUERY;
        $cadenaQUERY .= " OFFSET {$parametros->start} LIMIT {$parametros->limit} ";
        $conn = Doctrine_Manager::connection();
        $result->data = $conn->execute($cadenaQUERY)
            ->fetchAll(PDO::FETCH_ASSOC);
        $result->total = count(
            $conn->execute($sqlTotal)->fetchAll(PDO::FETCH_ASSOC)
        );
        return $result;
    }

    /**
     * Funcion para Comparar actividad con version actual
     */
    public function comActualActividad($parametros)
    {
        $cadenaSELECT
            = " SELECT a.idactividad, e.fechacreacion as fecha, a.fechainicio,
                a.fechafin, a.horainicio, a.horafin, e.denelemento, 
                e.descelemento, e.idusuariocrea, e.participante, e.dirigente, 
                e.fechacreacion, e.gradocumplimiento  ";
        $cadenaFROM
            = " FROM mod_objetivos.dat_actividades a
                INNER JOIN mod_objetivos.dat_elementos e 
                ON (a.idactividad = e.idelemento) ";
        $cadenaWHERE = " WHERE a.idactividad = {$parametros->idelemento}";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function comActualFIP($parametros)
    {
        $cadenaSELECT
            = " SELECT f.idfip,
                                e.fechacreacion as fecha,
                                f.fechaemision as fechainicio,
                                f.fechacumplimiento as fechafin,
                                e.denelemento,
                                e.descelemento,
                                e.idusuariocrea,
                                e.participante,
                                e.dirigente,
                                e.fechacreacion,
                                e.gradocumplimiento  ";
        $cadenaFROM
            = " FROM mod_objetivos.dat_fip f
                    INNER JOIN mod_objetivos.dat_elementos e ON (f.idfip = e.idelemento) ";
        $cadenaWHERE = "  WHERE f.idfip = {$parametros->idelemento}";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
//        print_r($cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Funcion para Comparar objetivo con version actual
     */
    public function compactualobjetivo($parametros)
    {
        $cadenaSELECT
            = " SELECT o.idobjetivo, e.fechacreacion as fecha, o.fechainicio,
                o.fechafin, e.denelemento, e.descelemento, e.idusuariocrea, 
                e.participante, e.dirigente, e.fechacreacion, 
                e.gradocumplimiento ";
        $cadenaFROM
            = " FROM mod_objetivos.dat_objetivo o
                INNER JOIN mod_objetivos.dat_elementos e 
                ON (o.idobjetivo = e.idelemento) ";
        $cadenaWHERE = " WHERE o.idobjetivo = {$parametros->idelemento}";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Funcion para Comparar plan con version actual
     */
    public function compactualplan($parametros)
    {
        $cadenaSELECT
            = " SELECT p.idplan, e.fechacreacion as fecha, p.fechainicio,
                p.fechafin, e.denelemento, e.descelemento, e.idusuariocrea, 
                e.participante, e.dirigente, e.fechacreacion, 
                e.gradocumplimiento ";
        $cadenaFROM
            = " FROM mod_objetivos.dat_plan_pdo p
                INNER JOIN mod_objetivos.dat_elementos e 
                ON (p.idplan = e.idelemento) ";
        $cadenaWHERE = " WHERE p.idplan = {$parametros->idelemento}";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Funcion para Comparar historial con version anterior
     */
    public function compAnterior($parametros)
    {
        $cadenaSELECT
            = " SELECT h.idhistorial, h.idautor, h.fecha, h.fechainicio,
                h.fechafin, h.horainicio, h.horafin, h.denelemento, 
                h.descelemento, h.participante, h.dirigente, h.estado,
                h.gradocumplimiento, h.involucrados ";
        $cadenaFROM = " FROM  mod_objetivos.dat_historial h ";
        $cadenaWHERE
            = " WHERE   h.idhistorial = (SELECT MAX(h.idhistorial)
            FROM  mod_objetivos.dat_historial h
                        WHERE  h.idelemento = {$parametros->idelemento} 
                        AND h.idhistorial < {$parametros->idhistorial} )";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Funcion para obtener el historial de cuando se le dio 100%
     */
    public function historialCumplida($idelemento)
    {
        $cadenaSELECT
            = " SELECT h.idhistorial,h.denelemento, h.fecha, h.gradocumplimiento  ";
        $cadenaFROM = " FROM  mod_objetivos.dat_historial h ";
        $cadenaWHERE
            = " WHERE   h.idhistorial = (SELECT MAX(h.idhistorial)
                                FROM  mod_objetivos.dat_historial h
                                WHERE  h.idelemento = {$idelemento}
                                 AND h.gradocumplimiento = '100')";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Funcion para obtener los hijos de un relacion
     */
    public function obtenerHijos($idPadre, $parametros, $idTipo)
    {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (h.fecha >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF = " AND (h.fecha <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSELECT
            = " SELECT DISTINCT(h.idelemento) ";
        $cadenaFROM = " FROM  mod_objetivos.dat_historial h ";
        $cadenaWHERE
            = " WHERE h.relaciones LIKE '%$idPadre%'
                AND h.idtipoelemento = $idTipo {$cadenaFechaI} {$cadenaFechaF}";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Funcion para obtener los hijos de un relacion
     */
    public function obtenerComportamiento($Params, $idAccion, $mod)
    {
        if ($mod == 1) {
            $cadenaSELECT
                = " SELECT COUNT(DISTINCT(h.fechainicio)) -1
                + (COUNT(DISTINCT(h.fechafin)) -1)
                + (COUNT(DISTINCT(h.horainicio)) -1)
                + (COUNT(DISTINCT(h.horafin)) -1) AS desviaciones ";
        } else {
            $cadenaSELECT
                = "SELECT COUNT(h.idhistorial) ";
        }
        $cadenaFROM = " FROM  mod_objetivos.dat_historial h ";
        $cadenaWHERE
            = " WHERE h.idelemento = $Params->idElem
                AND h.fecha >= '$Params->fecha' ";
        if ($idAccion != 2) {
            $cadenaWHERE
                .= " AND h.idaccion = $idAccion ";
        }
        if ($Params->trimestre == 1) {
            $cadenaWHERE
                .= " AND (h.fecha >= '$Params->fIni'
                AND h.fecha <= '$Params->fFin' )";
        }
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }
    //funcion para obtener la ultima y penultima tupla modificada de actividades
    public function obtenerTuplaMod($parametros)
    {
        ($parametros->penultima) ?
            $cadenapenultima = " AND h.idhistorial < {$parametros->idhistorial}"
            : $cadenapenultima = '';
        $cadenaSELECT
            = " SELECT h.idhistorial, h.idautor, h.fecha, h.fechainicio,
                h.fechafin, h.horainicio, h.horafin, h.denelemento,
                h.descelemento, h.participante, h.dirigente,
                h.gradocumplimiento, h.involucrados, a.lugar ";
        $cadenaFROM = " FROM  mod_objetivos.dat_historial h ";
        $cadenaINNER = " INNER JOIN mod_objetivos.dat_actividades a ON a.idactividad = {$parametros->idelemento} ";
        $cadenaWHERE
            = " WHERE   h.idhistorial = (SELECT MAX(h.idhistorial)
            FROM  mod_objetivos.dat_historial h
                        WHERE  h.idelemento = {$parametros->idelemento} AND h.idaccion = 2 $cadenapenultima)";

        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaINNER . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


}
