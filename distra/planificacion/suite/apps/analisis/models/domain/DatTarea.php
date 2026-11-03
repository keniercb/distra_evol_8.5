<?php

class DatTarea extends BaseDatTarea
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatCalculoduracion',
            array('local' => 'idtarea', 'foreign' => 'idtarea')
        );
    }

    public function obtenerDatosTarea($idelemento, $params)
    {
        if ($params->fechafin != '') {
            $cadenaFechaI = " AND (t.fechafin <= '{$params->fechafin}') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($params->fechainicio != '') {
            $cadenaFechaF
                = " AND (t.fechainicio >= '{$params->fechainicio}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaA
            = "  SELECT t.duracionestimada, t.fechainicio, t.fechafin,
                t.horainicio, t.horafin ,e.gradocumplimiento, e.peso
                FROM mod_planifproyecto.dat_tarea t
                 INNER JOIN mod_objetivos.dat_elementos e
                ON(t.idtarea = e.idelemento)
                WHERE idtarea = {$idelemento}
                {$cadenaFechaI}
                {$cadenaFechaF} ";
        //print_r($cadenaA);die;
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getTipoTarea($idelemento, $params)
    {
        $cadenaA
            = "  SELECT n.dennomenclador, en.idnomenclador
            FROM mod_objetivos.dat_elementos_nom_nomenclador en
            INNER JOIN mod_objetivos.nom_nomenclador n
            ON (en.idnomenclador = n.idnomenclador)
            WHERE en.tiponomenclador = {$params->tiponom}
            AND en.idelemento = {$idelemento} ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    // tareas incumplidas hasta la fecha
    public function tareasIncumplidas($parametros)
    {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (t.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (t.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(t.idtarea)";
        }
        $cadena
            .= " FROM  mod_planifproyecto.dat_tarea t
                    INNER JOIN mod_objetivos.dat_elementos e
                    ON (e.idelemento = t.idtarea)

                    INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)

                    WHERE e.gradocumplimiento < 100
                    AND t.fechafin < " . "'" . date('Y-m-d') . "'" . "
                    AND (e.idusuariocrea = {$parametros->idusuario}

                    OR e.idelemento IN (SELECT ei.idelemento
                    FROM mod_objetivos.dat_elementos_dat_involucrados ei
                    LEFT JOIN mod_objetivos.dat_involucrados i
                    ON (ei.idinvolucrado = i.idinvolucrado)
                    WHERE i.idusuario = {$parametros->idusuario}))
                    {$cadenaFechaI}
                    {$cadenaFechaF} AND t.plantilla = 0 ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    //tareas Parcialmente cumplidas hasta la fecha
    public function tareasPcumplidas($parametros)
    {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (t.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (t.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(t.idtarea)";
        }
        $cadena
            .= " FROM mod_planifproyecto.dat_tarea t

                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = t.idtarea)

                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)

                WHERE e.gradocumplimiento < 100
                AND e.gradocumplimiento > 0
                AND t.fechafin >= " . "'" . date('Y-m-d') . "'" . "
                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))               
                {$cadenaFechaI}
                {$cadenaFechaF} AND t.plantilla = 0 ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    //tareas No iniciadas
    public function tareasNoIniciadas($parametros)
    {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (t.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (t.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(t.idtarea)";
        }
        $cadena
            .= " FROM mod_planifproyecto.dat_tarea t
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = t.idtarea)

                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)

                WHERE e.gradocumplimiento = 0
                AND t.fechafin >= " . "'" . date('Y-m-d') . "'" . "
                AND t.fechainicio <= " . "'" . date('Y-m-d') . "'" . "
                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                {$cadenaFechaI}
                {$cadenaFechaF} AND t.plantilla = 0 ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        //print_r($cadena);die;
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    //tareas Cumplidas
    public function tareasCumplidas($parametros)
    {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (t.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (t.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(t.idtarea)";
        }
        $cadena
            .= " FROM mod_planifproyecto.dat_tarea t
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = t.idtarea)

                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)

                WHERE e.gradocumplimiento = 100
                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                {$cadenaFechaI}
                {$cadenaFechaF} AND t.plantilla = 0 ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    //tareas incumplidas sin iniciar y fuera de fecha
    public function incumpSinIFueraFecha($parametros)
    {
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(t.idtarea)";
        }
        $cadena
            .= " FROM mod_planifproyecto.dat_tarea t
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = t.idtarea)

                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)

                WHERE t.fechafin < " . "'" . date('Y-m-d') . "'" . "
                AND e.gradocumplimiento = 0
                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                AND t.plantilla = 0 ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    //tareas parcialmente cumplidas fuera de fecha
    public function parcialCFueraFecha($parametros)
    {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (t.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (t.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(t.idtarea)";
        }
        $cadena
            .= " FROM mod_planifproyecto.dat_tarea t
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = t.idtarea)

                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)

                WHERE t.fechafin < " . "'" . date('Y-m-d') . "'" . "
                AND e.gradocumplimiento < 100
                AND e.gradocumplimiento > 0
                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                {$cadenaFechaI}
                {$cadenaFechaF} AND t.plantilla = 0 ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    //tareas parcialmente cumplidas en tiempo
    public function parcialCEnTiempo($parametros)
    {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (t.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (t.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(t.idtarea)";
        }
        $cadena
            .= " FROM mod_planifproyecto.dat_tarea t
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = t.idtarea)

                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)

                WHERE t.fechafin >= " . "'" . date('Y-m-d') . "'" . "
                AND e.gradocumplimiento < 100
                AND e.gradocumplimiento > 0
                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                {$cadenaFechaI}
                {$cadenaFechaF} AND t.plantilla = 0 ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    //tareas no iniciadas y en tiempo
    public function noIniciadasEnTiempo($parametros)
    {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (t.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (t.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(t.idtarea)";
        }
        $cadena
            .= " FROM mod_planifproyecto.dat_tarea t
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = t.idtarea)

                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)

                WHERE t.fechafin >= " . "'" . date('Y-m-d') . "'" . "
                AND e.gradocumplimiento = 0
                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                {$cadenaFechaI}
                {$cadenaFechaF} AND t.plantilla = 0 ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    //tareas que inician la proxima semana
    public function proximaSemana($proximoLunes, $proximoDomingo, $parametros)
    {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (t.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (t.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        if ($parametros->peso == 1) {
            $cadena = "SELECT SUM(e.peso)";
        } else {
            $cadena = "SELECT COUNT(t.idtarea)";
        }
        $cadena
            .= " FROM mod_planifproyecto.dat_tarea t
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = t.idtarea)

                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)

                WHERE t.fechainicio >= '{$proximoLunes}'
                AND t.fechainicio <= '{$proximoDomingo}'
                AND e.gradocumplimiento = 0

                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                {$cadenaFechaI}
                {$cadenaFechaF} AND t.plantilla = 0 ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function tareasPlanif($parametros, $fechaI, $fechaF)
    {
        $cadena
            = " SELECT DISTINCT(t.idtarea), t.fechainicio, t.fechafin,
                t.horainicio, t.horafin, e.gradocumplimiento ";
        $cadena
            .= " FROM mod_planifproyecto.dat_tarea t

                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = t.idtarea)

                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)

                WHERE (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))

                AND (t.fechafin >= '$fechaI')
                AND (t.fechainicio <= '$fechaF')
                AND t.plantilla = 0 ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function tipoNomenclador($parametros)
    {
        $cadena
            = " SELECT  n.idnomenclador,  n.dennomenclador
                FROM mod_objetivos.nom_nomenclador n
                WHERE n.tiponomenclador = {$parametros->tiponom}
                AND n.idusuariocrea = {$parametros->idusuario} ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function tareasPorTipos($parametros)
    {
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (t.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (t.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        if ($parametros->peso == 1) {
            $cadena
                = " SELECT  n.idnomenclador,  n.dennomenclador, e.peso ";
        } else {
            $cadena
                = " SELECT  n.idnomenclador, n.dennomenclador, t.fechafin,
                t.horainicio, t.horafin, t.fechainicio ";
        }
        $cadena
            .= " FROM mod_objetivos.nom_nomenclador n
                LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                ON ( n.idnomenclador = en.idnomenclador )
                LEFT JOIN mod_objetivos.dat_elementos e
                ON ( e.idelemento = en.idelemento )

                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)

                LEFT JOIN mod_planifproyecto.dat_tarea t
                ON ( t.idtarea = e.idelemento)
                LEFT JOIN mod_objetivos.dat_grupo_nom_nomenclador g
                ON (n.idnomenclador = g.idnomenclador)

                WHERE n.tiponomenclador = {$parametros->tiponom}
                AND n.idusuariocrea = {$parametros->idusuario}
                AND n.idnomenclador = {$parametros->idnomenclador}

                AND (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                AND t.plantilla = 0
                {$cadenaFechaI}
                {$cadenaFechaF} ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    public function actividadesPlanif($parametros, $fechaI, $fechaF)
    {
        $cadena
            = " SELECT DISTINCT(t.idtarea), t.fechainicio, t.fechafin,
                t.horainicio, t.horafin, e.gradocumplimiento
                FROM mod_planifproyecto.dat_tarea t
                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = t.idtarea)
                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                    ON (e.idelemento = eec.idelemento)
                WHERE (e.idusuariocrea = {$parametros->idusuario}
                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))
                AND (t.fechafin >= '$fechaI')
                AND (t.fechainicio <= '$fechaF')
                AND t.plantilla = 0 ";
        if (isset($parametros->idEstructura)) {
            $cadena
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        //print_r($cadena);die;
        $result = $conn->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    public function tareaGantt($parametros)
    {
        $cadenaSELECT
            = " SELECT e.idelemento, e.denelemento,
                e.gradocumplimiento, 1 as open, e.idtipoelemento,
                e.actualizarporciento, eh.idelementopadre, t.fechainicio,
                t.fechafin, t.horainicio, t.horafin ";
        $cadenaFROM
            = " FROM mod_objetivos.dat_elementos e ";
        $cadenaJOIN
            = " INNER JOIN  mod_planifproyecto.dat_tarea t
                ON (e.idelemento = t.idtarea)

                LEFT JOIN mod_objetivos.dat_elementos_dat_elementos eh
                ON (e.idelemento = eh.idelementohijo AND eh.origen < 4
                AND eh.idelementopadre IN (SELECT ele.idelemento
                FROM mod_objetivos.dat_elementos ele
                WHERE ele.idtipoelemento IN (8,9,10))) ";
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario})
                AND e.idtipoelemento IN (8,9,10)
                AND t.plantilla = 0 ";
        if ($parametros->denominacion) {
            $cadenaWHERE .= " AND upper(e.denelemento) LIKE '%"
                . strtoupper($parametros->denominacion) . "%'";
        }
        if ($parametros->arrayTiposElementos) {
            $cadenaWHERE .= " AND e.idtipoelemento IN ("
                . $parametros->arrayTipos . ") ";
        }
        if ($parametros->fechafin) {
            $cadenaWHERE
                .= " AND t.fechainicio <= '{$parametros->fechafin}' ";
        }
        if ($parametros->fechainicio) {
            $cadenaWHERE
                .= " AND t.fechafin >= '{$parametros->fechainicio}' ";
        }
        $cadenaORDER
            = " ORDER BY t.fechainicio, t.horainicio ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE
            . $cadenaORDER;
        //print_r($cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function DependenciasDeGantt($parametros)
    {
        $cadenaSELECT
            = " SELECT  ee.idelementopadre,
                ee.idelementohijo, ee.origen, 3 as type";
        $cadenaFROM = " FROM mod_objetivos.dat_elementos_dat_elementos ee
        INNER JOIN  mod_objetivos.dat_elementos e
        ON (e.idelemento = ee.idelementopadre AND e.idtipoelemento = 10) ";
        $cadenaWHERE
            = " WHERE ee.origen > 5; ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }



}//fin clase



