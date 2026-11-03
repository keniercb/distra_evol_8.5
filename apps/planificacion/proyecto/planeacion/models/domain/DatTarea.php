<?php

class DatTarea extends BaseDatTarea {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatCalculoduracion', array('local' => 'idtarea', 'foreign' => 'idtarea')
        );
        $this->hasOne(
                'DatEjerciciotarea', array('local' => 'idtarea', 'foreign' => 'idtarea')
        );
        $this->hasMany(
                'DatControlejecuciontarea', array('local' => 'idtarea', 'foreign' => 'idtarea')
        );
    }

    public function getDatosTareaByIdElemento($idelemento) {
        $connA = Doctrine_Manager:: connection();
        $cadena
                = "SELECT t.fechainicio, t.fechafin
                FROM mod_planifproyecto.dat_tarea t
                WHERE t.idtarea = {$idelemento}";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

    public function getDependenciaSuperior($idelemento) {
        $connA = Doctrine_Manager:: connection();
        $cadena
                = "SELECT
                      *
                    FROM
                      mod_objetivos.dat_elementos_dat_elementos ee
                    WHERE
                      ee.idelementohijo = {$idelemento} AND
                      ee.origen IN (6,7,8)";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getTarea($idelemento) {
        $connA = Doctrine_Manager:: connection();
        $cadena
                = "SELECT *
                    FROM
                      mod_objetivos.dat_elementos e
                    WHERE
                      e.idtipoelemento = 10 AND
                      e.idelemento = {$idelemento}";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function updateTiempoEstimadoTarea($elemento) {

        $cadenaModificarTiempos = "";
        if ($elemento->tiempooptimista) {
            $cadenaModificarTiempos = ", tiempooptimista = {$elemento->tiempooptimista}
                                       , tiempomedio = {$elemento->tiempomedio}
                                       , tiempopesimista = {$elemento->tiempopesimista} ";
        }

        $cadena = " UPDATE
                      mod_planifproyecto.dat_tarea
                    SET
                      duracionestimada = {$elemento->tiempoEstimado} " . $cadenaModificarTiempos .
                        " WHERE mod_planifproyecto.dat_tarea.idtarea = {$elemento->idtarea} ";

        //print_r($cadena);die;
        $connA = Doctrine_Manager:: connection();
        $connA->execute($cadena);
    }

    public function updateGradocumplimientoTarea($elemento) {
        $cadena
                = " UPDATE mod_objetivos.dat_elementos
                SET estadocumplimiento = 'Cumplida',
                gradocumplimiento = '100'
                WHERE idelemento = {$elemento} ";
        $connA = Doctrine_Manager:: connection();
        $connA->execute($cadena);
    }

    public function getElemento($idelemento) {
        $de = Doctrine_Manager::getInstance();
        $connA = $de->getCurrentConnection();
        $cadena
                = "SELECT *, t.fechainicio, t.fechafin, h.fechainicio as fechainiciohito, h.fechafin as fechafinhito,
                             t.tiempooptimista as tiempooptimista, t.tiempomedio as tiempomedio, t.tiempopesimista as tiempopesimista, t.duracionestimada as duracionestimada
            FROM mod_objetivos.dat_elementos e
            Left JOIN mod_planifproyecto.dat_tarea t ON(t.idtarea = e.idelemento)
            Left JOIN mod_planifproyecto.dat_hito h ON(h.idhito = e.idelemento)
            WHERE e.idelemento = {$idelemento}";
        $res = $connA->execute($cadena);
        //$connA->commit();
        $result = $res->fetchAll();
        return $result;
    }

    public function obtenerElemento($idelemento) {
        $de = Doctrine_Manager::getInstance();
        $connA = $de->getCurrentConnection();
        $cadena
                = "SELECT *
            FROM mod_objetivos.dat_elementos e
            Left JOIN mod_planifproyecto.dat_tarea t ON(t.idtarea = e.idelemento)
            Left JOIN mod_planifproyecto.dat_hito h ON(h.idhito = e.idelemento)
            WHERE e.idelemento = {$idelemento}";
        $res = $connA->execute($cadena);
        $connA->commit();
        $result = $res->fetchAll();
        return $result;
    }

    public function existedependenciaSinFecha($parametros) {
        $connA = Doctrine_Manager:: connection();
        $cadena
                = "SELECT Count(e.idelementopadre)
            FROM mod_objetivos.dat_elementos_dat_elementos e
            INNER JOIN mod_planifproyecto.dat_tarea t ON(t.idtarea = e.idelementopadre)
            WHERE  e.idelementohijo = {$parametros['idtarea']} AND t.fechafin IS NULL ";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);

        return $result;
    }

    public function buscarMayorFecha($parametros) {
        $connA = Doctrine_Manager:: connection();
        $cadena
                = "SELECT MAX(t.fechafin)--,t.horafin
            FROM mod_objetivos.dat_elementos_dat_elementos e
            INNER JOIN mod_planifproyecto.dat_tarea t ON(t.idtarea = e.idelementopadre)
            WHERE  e.idelementohijo = {$parametros->idtarea}
            --GROUP BY t.horafin
            ";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function buscarMayorFechaNew($dependencias) {
        $connA = Doctrine_Manager:: connection();
        /*$cadena
                = "SELECT MAX(t.fechafin)as fechafin,MAX(t.horafin) as horafin
            FROM mod_planifproyecto.dat_tarea t
            WHERE t.idtarea IN ({$dependencias})
            --GROUP BY t.horafin";*/
        $cadena = "SELECT r.fecha::date as fechafin,
                          r.fecha::time as horafin
                    FROM (
                          SELECT MAX(t.fechafin::VARCHAR || ' ' || t.horafin::VARCHAR)::TIMESTAMP as fecha
                          FROM mod_planifproyecto.dat_tarea t
                          WHERE t.idtarea IN ({$dependencias}) )r";
        //print_r($cadena. ' ');die;
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function buscarFechaFecha($tareas) {
        $idtareas = implode(',', $tareas);
        $connA = Doctrine_Manager:: connection();
        $cadena
                = "SELECT MAX(t.fechafin),SUM (t.duracionestimada)
            FROM mod_planifproyecto.dat_tarea t
            WHERE  t.idtarea IN ({$idtareas})
            ";
        //print_r($cadena);die;
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function buscarFechaHito($tareas) {
        $idtareas = implode(',', $tareas);
        $connA = Doctrine_Manager:: connection();
        $cadena
                = "SELECT MAX(t.fechafin),MIN (t.fechainicio),SUM (t.duracionestimada)
            FROM mod_planifproyecto.dat_tarea t
            WHERE  t.idtarea IN ({$idtareas})
            ";
        //print_r($cadena);die;
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function buscarDuracionTareas($tareas) {
        $idtareas = implode(',', $tareas);
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT SUM (t.duracionestimada)
            FROM mod_planifproyecto.dat_tarea t
            WHERE  t.idtarea IN ({$idtareas})
            ";
        //print_r($cadena);die;
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function buscarDuracionHito($tareas) {
        $idtareas = implode(',', $tareas);
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT SUM (t.duracionestimada)
            FROM mod_planifproyecto.dat_tarea t
            WHERE  t.idtarea IN ({$idtareas})
            ";
        //print_r($cadena);die;
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getOrderByDependencias($parametros) {
        $connA = Doctrine_Manager:: connection();
        $cadena
                = "SELECT CASE WHEN t.dependencias = '0' THEN 0 ELSE
              array_length(regexp_split_to_array(t.dependencias, ','), 1)
              END as cantdep,t.idtarea
            FROM  mod_planifproyecto.dat_tarea t
            WHERE t.idtarea IN ({$parametros->tareasimplode})
            ORDER BY cantdep DESC";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getInvolucrados($idelemento) {
        $connA = Doctrine_Manager:: connection();
        $cadena
                = "SELECT *
            FROM  mod_objetivos.dat_elementos_dat_involucrados ei
            INNER JOIN mod_objetivos.dat_involucrados i ON(ei.idinvolucrado = i.idinvolucrado)
            WHERE ei.idelemento = {$idelemento}
           ";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function deleteRelacion($parametros) {
        $cadena
                = " DELETE FROM mod_objetivos.dat_elementos_dat_elementos
                WHERE idelementopadre = {$parametros->padreold}
                AND idelementohijo = {$parametros->idhijo} ";
        $connA = Doctrine_Manager:: connection();
        $connA->execute($cadena);
        return 1;
    }

    public function insertRelacion($parametros) {
        $cadena
                = " INSERT INTO mod_objetivos.dat_elementos_dat_elementos
            (idelementopadre, idelementohijo, origen, idautor)
            VALUES ({$parametros->idpadre}, {$parametros->idhijo},
            {$parametros->origen}, {$parametros->idusuariosession}) ";
        $connA = Doctrine_Manager:: connection();
        $connA->execute($cadena);
        return 1;
    }

    public function actualizarCumplimiento($params) {
        $cadena
                = " UPDATE mod_objetivos.dat_elementos
                SET estadocumplimiento='{$params->estadocump}',
                gradocumplimiento={$params->gradocumplimiento}
                WHERE idelemento = {$params->idElemen} ";
        $connA = Doctrine_Manager:: connection();
        $connA->execute($cadena);
        return 1;
    }

    public function obtenerIdUsuario($usuario) {
        $connA = Doctrine_Manager:: connection();
        $cadena
                = "SELECT
                  mod_seguridad.seg_usuario.idusuario
                FROM
                  mod_seguridad.seg_usuario
                WHERE
                  mod_seguridad.seg_usuario.nombreusuario = '{$usuario}'";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result[0]['idusuario'];
    }

}

//fin clase



