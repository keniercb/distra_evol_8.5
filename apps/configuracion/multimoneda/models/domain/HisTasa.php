<?php

/**
 * Clase dominio <b>Historial Tasas</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain
 * @copyright  XETID
 * @version    1.0-0
 */
class HisTasa extends BaseHisTasa
{
    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasOne(
            'NomEntidadpersona',
            array('local' => 'idcliente', 'foreign' => 'codigo')
        );
        $this->hasOne(
            'Nomtipotasa',
            array('local' => 'idtipotasa', 'foreign' => 'idtipotasa')
        );
        parent::setUp();
    }
    private function auxFiltro($cond)
    {
        $filter = "";
        if ($cond['idtasas']) {
                $filter .= " and e.idtasa = '" . $cond['idtasas'] . "'";
        }
            if ($cond['idtasa']) {
                $filter .= " and e.idtasa = '" . $cond['idtasa'] . "'";
            } 
            if ($cond['venta']) {
                $filter .= " and e.venta = '" . $cond['venta'] . "'";
            } 
            if ($cond['compra']) {
                $filter .= " and e.compra = '" . $cond['compra'] . "'";
            } 
            if ($cond['desde']) {
                $filter .= " and e.desde = '" . $cond['desde'] . "'";
            } 
            if ($cond['hasta']) {
                $filter .= " and e.hasta = '" . $cond['hasta'] . "'";
            }
            return $filter;
    }

    /**
     * Obtiene historial de tasas.
     *
     * @param array $cond  Condiciones
     * @param int   $limit Límite
     * @param int   $start Inicio
     *
     * @return array Historial de tasas
     * @throws Doctrine_Exception
     */
    public function buscarHisTasa($cond = array(), $limit = 10, $start = 0)
    {
        try {
            $filter = " 0=0 ";
            $filter .= self::auxFiltro($cond);
            if ($cond['idcliente']) {
                $filter .= " and e.idcliente = '" . $cond['idcliente'] . "'";
            } 
            if ($cond['referencia']) {
                $filter .= " and e.referencia = '" . $cond['referencia'] . "'";
            } 
            if ($cond['idtipotasa']) {
                $filter .= " and e.idtipotasa = '" . $cond['idtipotasa'] . "'";
            } 
            if ($cond['nombretasa']) {
                $filter .= " and e.nombretasa = '" . $cond['nombretasa'] . "'";
            } 
            if ($cond['fechacambio']) {
                $filter .= " and e.fechacambio = '" . $cond['fechacambio']
                    . "'";
            } 
            $q = new Doctrine_Query();
            $estudiante = $q->from('HisTasa e')->where($filter)->execute();
            $estudiant = $q->from('HisTasa e')->where($filter)->limit($limit)
                ->offset($start)->execute();
            $estudiantes = $estudiant->toArray();
            $resultado = array('cant'  => $estudiante->count(),
                               'datos' => $estudiantes);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }
    private function auxFiltroDos($cond)
    {
        $filter = "";
        if ($cond['idtasas']) {
                $filter .= " and e.idtasas = '" . $cond['idtasas'] . "'";
        }
            if ($cond['idtasa']) {
                $filter .= " and e.idtasa = '" . $cond['idtasa'] . "'";
            } 
            if ($cond['venta']) {
                $filter .= " and e.venta = '" . $cond['venta'] . "'";
            } 
            if ($cond['compra']) {
                $filter .= " and e.compra = '" . $cond['compra'] . "'";
            } 
            if ($cond['desde']) {
                $filter .= " and e.desde >= '" . $cond['desde'] . "'";
            } 
            if ($cond['hasta']) {
                $filter .= " and e.hasta <= '" . $cond['hasta'] . "'";
            }
            return $filter;
    }
    private function auxFiltroTres($cond)
    {
        $filter = "";
        if ($cond['idcliente']) {
                $filter .= " and e.idcliente = '" . $cond['idcliente'] . "'";
        }
            if ($cond['referencia']) {
                $filter .= " and e.referencia = '" . $cond['referencia'] . "'";
            } 
            if ($cond['idtipotasa']) {
                $filter .= " and e.idtipotasa = '" . $cond['idtipotasa'] . "'";
            } 
            if ($cond['nombretasa']) {
                $filter .= " and lower(e.nombretasa)= '" . strtolower(
                        $cond['nombretasa']
                    ) . "'";
            } 
            if ($cond['nombretipotasa']) {
                $filter .= " and lower(t.nombretipotasa)= '" . strtolower(
                        $cond['nombretipotasa']
                    ) . "'";
            } 
            if ($cond['factordeconversion']) {
                $filter .= " and e.factordeconversion = '"
                    . $cond['factordeconversion'] . "'";
            }
            return $filter;
    }

    /**
     * Obtiene historial de tasas que se encuentran en la tabla Nomtipotasa.
     *
     * @param array $cond  Condiciones
     * @param int   $limit Límite
     * @param int   $start Inicio
     *
     * @return array Historial de tasas
     * @throws Doctrine_Exception
     */
    public function buscar($cond = array(), $limit = 10, $start = 0)
    {
        try {
            $filter = " 0=0 ";
            $filter .= self::auxFiltroDos($cond); 
            $filter .= self::auxFiltroTres($cond); 
            $q = new Doctrine_Query();            
            $estudiante = $q->select(
                    "e.idtasa,e.factordeconversion,e.venta,e.compra,e.desde,e.hasta,e.idcliente as codigo,
                    e.referencia,e.fechacambio,e.idtipotasa,e.nombretasa,t.nombretipotasa"
                )->from('HisTasa e')->innerJoin("e.Nomtipotasa t")->leftJoin(
                    "e.NomEntidadpersona c"
                )->where($filter)->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                    ->execute();
            $estudiant = $q->select(
             "e.idtasa,e.factordeconversion,e.venta,e.compra,e.desde,e.hasta,e.idcliente as codigo,e.referencia,
             e.fechacambio,e.idtipotasa,e.nombretasa,t.nombretipotasa"
            )->from('HisTasa e')->innerJoin("e.Nomtipotasa t")->leftJoin(
            "e.NomEntidadpersona c"
            )
                ->where($filter)->limit($limit)->offset($start)
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            $estudiantes = $estudiant;
            $resultado = array('cant'  => count($estudiante),
                               'datos' => $estudiantes);
            return $resultado;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

}


