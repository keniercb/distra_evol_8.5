<?php

class DatDestinatario extends BaseDatDestinatario
{
    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'DatGrupoNotificaciones',
            array('local' => 'iddestinatario', 'foreign' => 'iddestinatario')
        );
        $this->HasMany(
            'DatPersonaNotificaciones',
            array('local' => 'iddestinatario', 'foreign' => 'iddestinatario')
        );
        $this->HasMany(
            'DatEstructuraNotificaciones',
            array('local' => 'iddestinatario', 'foreign' => 'iddestinatario')
        );
        $this->HasMany(
            'DatGrupoDestinatario',
            array('local' => 'iddestinatario', 'foreign' => 'iddestinatario')
        );
        $this->hasOne(
            'NomTipoDestinatario',
            array('local' => 'idtipodest', 'foreign' => 'idtipodest')
        );
        $this->HasMany(
            'DatAvisoDestinatarioViaContenido',
            array('local' => 'iddestinatario', 'foreign' => 'iddestinatario')
        );
    }

    public static function eliminarDestinatario($iddestinatario)
    {
        Doctrine:: getTable('DatDestinatario')
            ->createQuery()
            ->delete()
            ->where('iddestinatario = ?', $iddestinatario)
            ->execute();
    }

    public static function getByAviso($idaviso, $start, $limit)
    {
        $query
            = 'SELECT d.iddestinatario as idcontacto,
d.idtipodest as idtipocontacto
                FROM dat_destinatario d 
                INNER JOIN dat_avisodestinatarioviacontenido d2
                ON d.iddestinatario = d2.iddestinatario
                INNER JOIN nom_tipodestinatario n ON d.idtipodest = n.idtipodest
                WHERE (d2.idaviso = ' . $idaviso . ')
                GROUP BY idcontacto, idtipocontacto ';
        if ($start && $limit) {
            $query .= "OFFSET $start ";
            $query .= "LIMIT $limit";
        }

        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($query);
    }

    public static function getTotalByAviso($idaviso)
    {
        $query
            = 'SELECT count(distinct d.iddestinatario)
                FROM dat_destinatario d 
                INNER JOIN dat_avisodestinatarioviacontenido d2
                ON d.iddestinatario = d2.iddestinatario
                INNER JOIN nom_tipodestinatario n ON d.idtipodest = n.idtipodest
                WHERE (d2.idaviso = ' . $idaviso . ')';

        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchOne($query);
    }
    
    //-----------------------metodos para notificar por correos en CEIN---------------------------
    public static function obtenerDestinatariosdadoGrupo($denomgrupo)
    {
        //$denomgrupo = "'{$denomgrupo}'";
        $query = "Select gd.iddestinatario as idcontacto, d.idtipodest
            from mod_notificaciones.dat_grupodestinatario gd
            inner join mod_notificaciones.dat_gruponotificacion gn on gd.idgrupo = gn.idgrupo
            inner join mod_notificaciones.dat_destinatario d on gd.iddestinatario = d.iddestinatario
            where nombre = '{$denomgrupo}'";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($query);

    }

}
