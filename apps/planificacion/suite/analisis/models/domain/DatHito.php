<?php

class DatHito extends BaseDatHito
{
    public function setUp()
    {
        parent::setUp();
    }

    public function hitoGantt($parametros)
    {
        $cadenaSELECT
            = " SELECT e.idelemento, e.denelemento,
                e.gradocumplimiento, 1 as open, e.idtipoelemento,
                e.actualizarporciento, eh.idelementopadre, h.fechainicio,
                h.fechafin ";
        $cadenaFROM
            = " FROM mod_objetivos.dat_elementos e ";
        $cadenaJOIN
            = " INNER JOIN mod_planifproyecto.dat_hito h
                ON (e.idelemento = h.idhito)

                LEFT JOIN mod_objetivos.dat_elementos_dat_elementos eh
                ON (e.idelemento = eh.idelementohijo AND eh.origen < 4
                AND eh.idelementopadre IN (SELECT ele.idelemento
                FROM mod_objetivos.dat_elementos ele
                WHERE ele.idtipoelemento IN (8,9,10))) ";
        $cadenaWHERE
            = " WHERE (e.idusuariocrea = {$parametros->idusuario})
                AND e.idtipoelemento IN (8,9,10)
                AND h.plantilla = 0 ";
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
                .= " AND h.fechainicio <= '{$parametros->fechafin}' ";
        }
        if ($parametros->fechainicio) {
            $cadenaWHERE
                .= " AND h.fechafin >= '{$parametros->fechainicio}' ";
        }
        $cadenaORDER
            = " ORDER BY h.fechainicio ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE
            . $cadenaORDER;
        //print_r($cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    /*
    * Funcion para cargar el combo hitos
    */
    public function cargarComboHitos($parametros)
    {
        $cadenaSELECT
            = " SELECT h.idhito, e.denelemento , e.idusuariocrea
                FROM   mod_objetivos.dat_elementos e
                INNER JOIN mod_planifproyecto.dat_hito h
                ON (e.idelemento = h.idhito)
                INNER JOIN mod_objetivos.dat_elementoestructuracrea eec
                ON (e.idelemento = eec.idelemento)";

        if (isset($parametros->idproy) && $parametros->idproy != '') {
            $cadenaSELECT
                .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos ee
                        ON (ee.idelementohijo = e.idelemento
                        AND ee.idelementopadre = {$parametros->idproy})";
        }
        $cadenaSELECT
            .= " WHERE h.plantilla = 0
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


}//fin clase
?>


