<?php

class DatProyecto extends BaseDatProyecto
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatEjercicio',
            array('local' => 'idproyecto', 'foreign' => 'idproyecto')
        );
    }

    /*
        * Funcion para cargar el combo de proyectos
        */
    public function cargarComboProyectos($parametros)
    {
        $cadenaSELECT
            = " SELECT p.idproyecto, e.denelemento , e.idusuariocrea
                FROM   mod_objetivos.dat_elementos e
                INNER JOIN mod_planifproyecto.dat_proyecto p
                ON (e.idelemento = p.idproyecto)
                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                ON (e.idelemento = eec.idelemento)
                WHERE p.plantilla = 0
                AND (e.idusuariocrea = {$parametros->idusuario}
                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario})) ";
        if (isset($parametros->idEstructura)) {
            $cadenaSELECT
                .= " AND eec.idestructuracrea = {$parametros->idEstructura}";
        }
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSELECT)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function obtenerHijosInmediatos($id)
    {
        $cadenaA
            = "
            SELECT ee.idelementohijo, ee.origen, e.idelemento,
            e.idtipoelemento, e.denelemento
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            INNER JOIN mod_objetivos.dat_elementos e
            ON(ee.idelementohijo = e.idelemento)
            WHERE ee.origen IN (0,1,2,3)
            AND ee.idelementopadre = {$id}   ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    public function proyectoGantt($parametros)
    {
        $cadenaSELECT
            = " SELECT e.idelemento, e.denelemento,
                e.gradocumplimiento, 1 as open, e.idtipoelemento,
                e.actualizarporciento, eh.idelementopadre, p.fechainicio,
                 p.fechafin ";
        $cadenaFROM
            = " FROM mod_objetivos.dat_elementos e ";
        $cadenaJOIN
            = " INNER JOIN mod_planifproyecto.dat_proyecto p
                ON (e.idelemento = p.idproyecto)

                LEFT JOIN mod_objetivos.dat_elementos_dat_elementos eh
                ON (e.idelemento = eh.idelementohijo AND eh.origen < 4
                AND eh.idelementopadre IN (SELECT ele.idelemento
                FROM mod_objetivos.dat_elementos ele
                WHERE ele.idtipoelemento IN (8,9,10))) ";
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario})
                AND e.idtipoelemento IN (8,9,10)
                AND p.plantilla = 0 ";
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
                .= " AND p.fechainicio <= '{$parametros->fechafin}' ";
        }
        if ($parametros->fechainicio) {
            $cadenaWHERE
                .= " AND p.fechafin >= '{$parametros->fechainicio}' ";
        }
        $cadenaORDER
            = " ORDER BY p.fechainicio ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE
            . $cadenaORDER;
        //print_r($cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }














}



