<?php

class DatBusqueda extends BaseDatBusqueda
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasMany('DatBusquedausuario', array('local' => 'idbusqueda', 'foreign' => 'idbusqueda'));
    }

    public function getBusquedas($idconfiguracion, $idusuario)
    {
        $query = new Doctrine_Query ();
        $result = $query->select(
            'b.idbusqueda as idbusqueda, b.denominacion as denominacion, b.codigo as codigo,
            b.descripcion as descripcion, b.configuracion as configuracion, bu.pordefecto as pordefecto,
            bu.idbusquedausuario'
        )
            ->from('DatBusquedausuario bu')
            ->innerJoin('bu.DatBusqueda b')
            ->where("b.idconfiguracion = '$idconfiguracion' AND bu.idusuario = '$idusuario'")
            ->orderBy('b.idbusqueda DESC')
            ->execute();

        return $result->toArray();
    }

    public function getDatBusqueda($idbusqueda)
    {
        return $DatBusqueda = Doctrine::getTable('DatBusqueda')->find($idbusqueda);
    }

    public function obtenerBusquedas($idconfiguracion, $idusuario, $limit, $start)
    {
        $query = new Doctrine_Query ();
        $result = $query->select(
            'b.idbusqueda as idbusqueda, b.denominacion as denominacion, b.codigo as codigo,
                                    b.descripcion as descripcion, bu.pordefecto, bu.propietario'
        )
            ->from('DatBusquedausuario bu')
            ->innerJoin('bu.DatBusqueda b')
            ->where("b.idconfiguracion = '$idconfiguracion' AND bu.idusuario = '$idusuario'")
            ->orderBy('b.idbusqueda DESC')
            ->limit($limit)
            ->offset($start)
            ->execute();

        return $result->toArray();
    }

    public function cantidadBusquedas($idconfiguracion, $idusuario)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('COUNT(b.idbusqueda) as cantidad')
            ->from('DatBusquedausuario bu')
            ->innerJoin('bu.DatBusqueda b')
            ->where("b.idconfiguracion = '$idconfiguracion' AND bu.idusuario = '$idusuario'")
            ->execute();

        return $result[0]['cantidad'];
    }

    public function filtrarBusquedas($idconfiguracion, $idusuario, $limit, $start, $codigo, $denominacion)
    {
        $where = '';
        if ($codigo != '') {
            $where .= ' AND b.codigo ILIKE \'%' . $codigo . '%\'';
        }
        if ($denominacion != '') {
            $where .= ' AND b.denominacion ILIKE \'%' . $denominacion . '%\'';
        }
        $query = new Doctrine_Query();
        $result = $query->select(
            'b.idbusqueda as idbusqueda, b.denominacion as denominacion, b.codigo as codigo,
                                    b.descripcion as descripcion, bu.pordefecto, bu.propietario'
        )
            ->from('DatBusquedausuario bu')
            ->innerJoin('bu.DatBusqueda b')
            ->where("b.idconfiguracion = '$idconfiguracion' AND bu.idusuario = '$idusuario'" . $where)
            ->orderBy('b.idbusqueda DESC')
            ->limit($limit)
            ->offset($start)
            ->execute();

        return $result->toArray();
    }

    public function cantidadBusquedasFiltro($idconfiguracion, $idusuario, $codigo, $denominacion)
    {
        $where = '';
        if ($codigo != '') {
            $where .= ' AND b.codigo ILIKE \'%' . $codigo . '%\'';
        }
        if ($denominacion != '') {
            $where .= ' AND b.denominacion ILIKE \'%' . $denominacion . '%\'';
        }
        $query = new Doctrine_Query ();
        $result = $query->select('COUNT(b.idbusqueda) as cantidad')
            ->from('DatBusquedausuario bu')
            ->innerJoin('bu.DatBusqueda b')
            ->where("b.idconfiguracion = '$idconfiguracion' AND bu.idusuario = '$idusuario'" . $where)
            ->execute();

        return $result[0]['cantidad'];
    }

    public function existeBusqueda($idusuario, $denominacionBusqueda)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('b.idbusqueda')
            ->from('DatBusqueda b')
            ->where("b.idusuario = '$idusuario' AND b.denominacion = '$denominacionBusqueda'")
            ->execute();

        return $result->toArray();
    }

    public function getBusquedaById($idbusqueda)
    {
        return Doctrine_Query::create()->from('DatBusqueda')
            ->where('idbusqueda = ?', $idbusqueda)
            ->fetchOne();
    }

    /**
     * Obtiene la busqueda que tenga configurada un usuario por defecto
     *
     * @param $idconfiguracion
     * @param $idusuario
     *
     * @return array
     */
    public function getSearchSavedByDefault($idconfiguracion, $idusuario)
    {
        $query = new Doctrine_Query ();
        $result = $query->select(
            'b.idbusqueda as idbusqueda, b.denominacion as denominacion, b.codigo as codigo,
            b.descripcion as descripcion, b.configuracion as configuracion, bu.pordefecto as pordefecto,
            bu.idbusquedausuario'
        )
            ->from('DatBusquedausuario bu')
            ->innerJoin('bu.DatBusqueda b')
            ->where("b.idconfiguracion = '$idconfiguracion' AND bu.idusuario = '$idusuario' AND pordefecto=1")
            ->execute();

        return $result->toArray();
    }

}