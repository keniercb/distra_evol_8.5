<?php

class DatEventoAvisoDestinatario extends BaseDatEventoAvisoDestinatario
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatEvento', array('local' => 'idevento', 'foreign' => 'idevento')
        );
        $this->hasOne(
            'DatAviso', array('local' => 'idaviso', 'foreign' => 'idaviso')
        );
        $this->hasOne(
            'DatPersonaNotificaciones',
            array('local' => 'iddestinatario', 'foreign' => 'iddestinatario')
        );

    }

    public static function getAllAvisoByPersonType($idDestinatario, $type)
    {


        $sql
            = "SELECT d.id AS id, d.idevento AS idevento, d.idaviso AS idaviso,
d.iddestinatario AS iddestinatario,
                d.originadopor AS originadopor,d.fecha AS fecha,
                d.estado AS estado,d2.idevento AS idevento,
                d2.descripcion AS descripcion, d2.referencia AS referencia,
                d3.denominacion AS denominacion,
                d3.descripcion AS descripcionAviso,
                d3.idtipoaviso AS idtipoaviso,d3.idaviso AS idaviso,
                d3.creadopor AS creadopor,d3.fechacreacion AS fechacreacion,
                 n.idtipoaviso AS idtipoaviso,
                n.denominacion AS denominacion
                FROM mod_notificaciones.dat_eventoavisodestinatario d,
                 mod_notificaciones.dat_evento d2,
                 mod_notificaciones.dat_aviso d3,
                 mod_notificaciones.nom_tipoaviso n ";
        $where
            = "WHERE d.iddestinatario = ? AND d.idaviso = d3.idaviso
            AND d.idevento = d2.idevento AND d3.idtipoaviso = n.idtipoaviso";
        $query = Doctrine_Manager::getInstance()->getCurrentConnection();
        $arrays = array($idDestinatario);
        if ($type != 0) {
            $where .= " AND n.idtipoaviso = ? order by d.estado Desc";
            array_push($arrays, $type);
        } else {
            $where .= " order by d.fecha Desc";
        }
        $result = $query->fetchAll($sql . $where, $arrays);

        return $result;
    }

    public static function getCantidadNotificaciones($idDestinatario)
    {
        $sql
            = "SELECT n.idtipoaviso as idtipoaviso,
n.denominacion AS denominacion, COUNT(n.denominacion) AS cantidad
                FROM mod_notificaciones.dat_eventoavisodestinatario d,
                 mod_notificaciones.dat_aviso d2,
                 mod_notificaciones.nom_tipoaviso n
                WHERE (d.idaviso = d2.idaviso AND d2.idtipoaviso = n.idtipoaviso
                 AND d.iddestinatario = ? AND d.estado = 1)
                GROUP BY n.denominacion,n.idtipoaviso";
        $query = Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql, array($idDestinatario));

        return $query;
    }

}
