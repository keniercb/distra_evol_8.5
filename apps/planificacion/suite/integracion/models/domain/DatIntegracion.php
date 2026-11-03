<?php

/**
 * @author
 * @version
 * @copyright
 */
class DatIntegracion extends BaseDatIntegracion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomModulo',
            array('local' => 'idmodulofuente', 'foreign' => 'idmodulo')
        );
		 $this->hasOne(
            'NomModulo',
            array('local' => 'idmodulodestino', 'foreign' => 'idmodulo')
        );
        
    }

    public function VerificarIntegracionModulos($parametros){
        $objConex = Doctrine_Manager:: connection();

        $cadenaSql = "SELECT * FROM mod_planifplataforma.dat_integracion i
                      WHERE i.idmodulofuente = ".$parametros->idModuloFuente."
                      AND i.idmodulodestino = ".$parametros->idModuloFuente;

        $resultado = $objConex->execute($cadenaSql)->fetchAll();
        return $resultado;
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
        $cadenaFROM = " FROM mod_objetivos.dat_elementos_dat_elementos ee ";
        $cadenaWHERE
            = " WHERE /*ee.idautor = {$parametros->idusuario}
                AND*/ ee.origen > 5; ";
        $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        //print_r($cadenaQUERY);die;
        $result = $conn->execute($cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }

}

//fin clase 



