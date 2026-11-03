<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatSistemaDatServidores extends BaseDatSistemaDatServidores
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatSistema',
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasOne(
            'DatServidor',
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasOne(
            'DatGestor', 
            array('local' => 'idgestor', 'foreign' => 'idgestor')
        );
        $this->hasOne(
            'DatBd', 
            array('local' => 'idbd', 'foreign' => 'idbd')
        );
        $this->hasOne(
            'DatEsquema', 
            array('local' => 'idesquema', 'foreign' => 'idesquema')
        );
        $this->hasOne(
            'SegRolesbd', 
            array('local' => 'idrolbd', 'foreign' => 'idrolbd')
        );
    }

    static public function eliminarrelacionessistema($idsistema)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatSistemaDatServidores')
            ->where("idsistema =?", $idsistema)
            ->execute();
        return true;
    }

    static public function obteneresquemasmarcados(
        $idsistema, $idservidor, $idgestor, $idbd
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('idesquema')
            ->from('DatSistemaDatServidores')
            ->where(
                "idsistema =? and idservidor =? and idgestor=? and idbd=?", 
                array($idsistema, $idservidor, $idgestor, $idbd)
            )
            ->execute();
        return $datos;
    }

    static public function obtenercantgestorsistema($idsistema)
    {
        $query = Doctrine_Query::create();
        $datos = $query->from('DatSistemaDatServidores')
            ->where("idsistema =?", $idsistema)
            ->execute();
        return $datos;
    }

    static public function obtenercantservsistema($idservidor)
    {
        $query = Doctrine_Query::create();
        return $query->select('s.idservidor,ss.idservidor')
            ->from('DatServidor s,s.DatSistemaDatServidores ss')
            ->where('ss.idservidor = ?', $idservidor)
            ->count();
    }

    static public function obtenersistemacompleto($idsistema)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'e.denominacion,s.idsistema,g.gestor,b.denominacion,v.denominacion'
        )->from(
            'DatSistema s,s.DatEsquema e,s.DatGestor g,'
            . 's.DatBd b,s.DatServidor v'
        )->where("s.idsistema=?", $idsistema)
            ->execute()
            ->toArray(true);
        return $datos;
    }

    static public function comprobargestor($idsistema, $idgestor)
    {
        $query = Doctrine_Query::create();
        $cant = $query->from('DatSistemaDatServidores s')
            ->where(
                "s.idsistema=? and s.idgestor=?", 
                array($idsistema, $idgestor)
            )
            ->count();
        return $cant;
    }

    static public function chequeado(
        $idsistema, $ipgestorbd, $gestor, $namebd, $nameesquema, $rolbd
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'ss.idsistema, ss.idservidor, ss.idgestor, ss.idbd, '
            . 'ss.idesquema, ss.idrolbd'
        )
            ->from('DatSistemaDatServidores ss')
            ->innerJoin('ss.DatServidor sv')
            ->innerJoin('ss.DatGestor g')
            ->innerJoin('ss.DatBd bd')
            ->innerJoin('ss.DatEsquema e')
            ->where(
                "ss.idsistema = ? and ss.idrolbd = ? and sv.ip = ? "
                . "and g.gestor = ? and bd.denominacion = ? "
                . "and e.denominacion = ?", 
                array(
                    $idsistema, 
                    $rolbd, 
                    $ipgestorbd, 
                    $gestor, 
                    $namebd, 
                    $nameesquema
                )
            )
            ->execute();
        return $datos;
    }

    static public function chequeado0racle(
        $idsistema, $ipgestorbd, $gestor, $namebd, $nameesquema
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'ss.idsistema, ss.idservidor, ss.idgestor, ss.idbd, ss.idesquema'
        )
            ->from('DatSistemaDatServidores ss')
            ->innerJoin('ss.DatServidor sv')
            ->innerJoin('ss.DatGestor g')
            ->innerJoin('ss.DatBd bd')
            ->innerJoin('ss.DatEsquema e')
            ->where(
                "ss.idsistema = ? and  sv.ip = ? and g.gestor = ? "
                . "and bd.denominacion = ? and e.denominacion = ?", 
                array($idsistema, $ipgestorbd, $gestor, $namebd, $nameesquema)
            )
            ->execute();
        return $datos;
    }

    static function eliminarEsquemasChequeados(
        $idsistema, $idservidor, $idgestor, $idbd, $arrayEsquemas
    )
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatSistemaDatServidores')
            ->where(
                "ss.idsistema = ? and sv.ip = ? and g.gestor = ? "
                . "and bd.denominacion = ?", 
                array(
                    $idsistema, $idservidor, $idgestor, $idbd, $arrayEsquemas
                )
            )
            ->execute();
    }

    static public function obtenerBdNoUsadas($arrBd, $idservidor, $idgestor)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'bd.idbd, bd.denominacion, '
            . 'count(distinct bd.denominacion) as cantbd'
        )
            ->from('DatBd bd')
            ->innerJoin('bd.DatSistemaDatServidores ss')
            ->where(
                'ss.idservidor = ? AND ss.idgestor = ?', 
                array($idservidor, $idgestor)
            )
            ->whereNotIn("bd.denominacion", $arrBd)
            ->groupBy('bd.idbd, bd.denominacion')
            ->execute();
        return $datos;
    }

    static public function obtenerBdUsadas($arrBd, $idservidor, $idgestor)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'bd.idbd, count(distinct ss.idservidor) as cantservidor, '
            . 'count(distinct ss.idgestor) as cantgestor'
        )
            ->from('DatBd bd')
            ->innerJoin('bd.DatSistemaDatServidores ss')
            ->where(
                'ss.idservidor <> ? OR ss.idgestor <> ?', 
                array($idservidor, $idgestor)
            )
            ->whereIn("bd.idbd", $arrBd)
            ->groupBy('bd.idbd')
            ->execute();
        return $datos;
    }

    static public function borrarBdFisicamente($arrBd, $idservidor, $idgestor)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatSistemaDatServidores')
            ->where(
                'idservidor = ? AND idgestor = ?', 
                array($idservidor, $idgestor)
            )
            ->whereIn('idbd', $arrBd)
            ->execute();
    }

    static public function obtenerEsquemas($arrBd, $idservidor, $idgestor)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'e.idesquema, count(distinct ss.idservidor) as cantservidor, '
            . 'count(distinct ss.idgestor) as cantgestor'
        )
            ->from('DatEsquema e')
            ->innerJoin('e.DatSistemaDatServidores ss')
            ->whereIn("ss.idbd", $arrBd)
            ->where(
                'ss.idservidor = ? AND ss.idgestor = ?', 
                array($idservidor, $idgestor)
            )
            ->groupBy('e.idesquema')
            ->execute();
        return $datos;
    }

    static public function obtenerEsquemasUsados(
        $arrayEsq, $idservidor, $idgestor
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'e.idesquema, count(distinct ss.idservidor) as cantservidor,'
            . ' count(distinct ss.idgestor) as cantgestor'
        )
            ->from('DatEsquema e')
            ->innerJoin('e.DatSistemaDatServidores ss')
            ->where(
                'ss.idservidor <> ? OR ss.idgestor <> ?', 
                array($idservidor, $idgestor)
            )
            ->whereIn('e.idesquema', $arrayEsq)
            ->groupBy('e.idesquema')
            ->execute();
        return $datos;
    }

    static public function obtenerEsquemasNoUsados(
        $arrEsq, $idservidor, $idgestor, $idbd
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'e.idesquema, count(distinct ss.idbd), '
            . 'count(distinct ss.idservidor) as cantservidor, '
            . 'count(distinct ss.idgestor) as cantgestor'
        )
            ->from('DatEsquema e')
            ->innerJoin('e.DatSistemaDatServidores ss')
            ->where(
                'ss.idservidor = ? AND ss.idgestor = ? AND ss.idbd = ?', 
                array($idservidor, $idgestor, $idbd)
            )
            ->whereNotIn("e.denominacion", $arrEsq)
            ->groupBy('e.idesquema')
            ->execute();
        return $datos;
    }

    static public function obtenerEsquemasUsadosByBD(
        $arrEsq, $idservidor, $idgestor, $idbd
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'e.idesquema, count(distinct ss.idbd), '
            . 'count(distinct ss.idservidor) as cantservidor, '
            . 'count(distinct ss.idgestor) as cantgestor'
        )
            ->from('DatEsquema e')
            ->innerJoin('e.DatSistemaDatServidores ss')
            ->where(
                'ss.idservidor <> ? OR ss.idgestor <> ? OR ss.idbd <> ?', 
                array($idservidor, $idgestor, $idbd)
            )
            ->whereIn("e.idesquema", $arrEsq)
            ->groupBy('e.idesquema')
            ->execute();
        return $datos;
    }

    static public function borrarEsqFisicamente(
        $arrEsq, $idservidor, $idgestor, $idbd
    )
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatSistemaDatServidores')
            ->where(
                'idservidor = ? AND idgestor = ? AND idbd = ?', 
                array($idservidor, $idgestor, $idbd)
            )
            ->whereIn('idesquema', $arrEsq)
            ->execute();
    }

    static public function countSistemsByIdrolesBd($idrolbd)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(idrolbd) cant')
            ->from('DatSistemaDatServidores')
            ->where('idrolbd = ? ', $idrolbd)
            ->execute();
        return $datos[0]->cant;
    }

    static public function verifyCheckedRole($rolesbd, $idsistema)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(idrolbd) cant')
            ->from('DatSistemaDatServidores')
            ->where(
                'idrolbd = ? and idsistema = ?', array($rolesbd, $idsistema)
            )
            ->execute();
        if ($datos[0]->cant > 0)
            return true;
        else
            return false;
    }

    static public function existEsquemasUsadosByBD(
        $esqArr, $idservidor, $idgestor, $idbd
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'e.idesquema, e.denominacion text, ss.idservidor, '
            . 'ss.idgestor, ss.idbd'
        )
            ->from('DatEsquema e')
            ->innerJoin('e.DatSistemaDatServidores ss')
            ->where(
                'ss.idservidor <> ? OR ss.idgestor <> ? OR ss.idbd <> ?', 
                array($idservidor, $idgestor, $idbd)
            )
            ->whereIn("e.denominacion", $esqArr)
            ->execute();
        return $datos;
    }

    static public function existEsquemasUsedByBD(
        $esqArr, $idservidor, $idgestor, $idbd
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'e.idesquema, e.denominacion text, ss.idservidor, '
            . 'ss.idgestor, ss.idbd'
        )
            ->from('DatEsquema e')
            ->innerJoin('e.DatSistemaDatServidores ss')
            ->where(
                'ss.idservidor = ? AND ss.idgestor = ? AND ss.idbd = ?', 
                array($idservidor, $idgestor, $idbd)
            )
            ->whereIn("e.denominacion", $esqArr)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function getConection($idsistema)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'ss.idsistema, se.idservidor, se.denominacion servidor, se.ip, '
            . 'g.gestor, g.idgestor, b.idbd, b.denominacion bd, '
            . 'e.denominacion esquema, e.idesquema, r.idrolbd, '
            . 'r.nombrerol rol, r.passw'
        )
            ->from('DatSistemaDatServidores ss')
            ->innerjoin('ss.DatServidor se')
            ->innerjoin('ss.DatGestor g')
            ->innerjoin('ss.DatBd b')
            ->innerjoin('ss.DatEsquema e')
            ->innerjoin('ss.SegRolesbd r')
            ->where("ss.idsistema = ?", $idsistema)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    //*********************************///
    static public function borrarConexion(
        $idservidor, $idbd, $idrolesbd, $idsistema
    )
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatSistemaDatServidores')
            ->where(
                'idservidor = ?  AND idbd = ? AND idrolbd = ? AND idsistema =?',
                array($idservidor, $idbd, $idrolesbd, $idsistema)
            )
            ->execute();
    }

    static public function seleccionarconex(
        $idbd, $idsistema, $idesquema, $idservidor, $idgestor, $idrolesbd
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'ss.idbd, ss.idsistema, ss.idesquema, ss.idservidor, '
            . 'ss.idgestor, ss.idrolbd'
        )
            ->from('DatSistemaDatServidores ss')
            ->where(
                'ss.idbd = ?  AND ss.idsistema = ? AND ss.idesquema = ? '
                . 'AND ss.idservidor = ? AND ss.idgestor = ? '
                . 'AND ss.idrolbd = ?', 
                array(
                    $idbd, 
                    $idsistema, 
                    $idesquema, 
                    $idservidor, 
                    $idgestor,
                    $idrolesbd
                )
            )
            ->execute()
            ->toArray();
        return $datos;
    }

    ///****************************
    static public function conexiones($idsistema)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select(
            'ss.idsistema,se.ip,g.puerto,g.gestor,b.denominacion,'
            . 'e.denominacion,r.nombrerol,r.passw'
        )
            ->from('DatSistemaDatServidores ss')
            ->innerjoin('ss.DatServidor se')
            ->innerjoin('ss.DatGestor g')
            ->innerjoin('ss.DatBd b')
            ->innerjoin('ss.DatEsquema e')
            ->innerjoin('ss.SegRolesbd r')
            ->where("ss.idsistema = ?", $idsistema)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

}