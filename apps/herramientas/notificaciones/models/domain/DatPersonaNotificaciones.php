<?php

class DatPersonaNotificaciones extends BaseDatPersonaNotificaciones
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatDestinatario',
            array('local' => 'iddestinatario', 'foreign' => 'iddestinatario')
        );
    }

    public static function getPersonsByAviso($idaviso, $start, $limit)
    {
        $query
            = 'SELECT p.idpersona as idcontacto, d.iddestinatario as iddest,
d.idtipodest as idtipocontacto
                FROM dat_destinatario d 
                INNER JOIN dat_personanotificacion p
                ON d.iddestinatario = p.iddestinatario
                INNER JOIN dat_avisodestinatarioviacontenido d2
                ON d.iddestinatario = d2.iddestinatario
                INNER JOIN nom_tipodestinatario n ON d.idtipodest = n.idtipodest
                WHERE (d2.idaviso = ' . $idaviso . ')
                GROUP BY idcontacto, iddest, idtipocontacto';
        if ($start && $limit) {
            $query .= "OFFSET $start ";
            $query .= "LIMIT $limit";
        }

        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($query);
    }

    public static function getTotalPersonsByAviso($idaviso)
    {
        $query
            = 'SELECT count(distinct d.iddestinatario)
                FROM dat_destinatario d 
                INNER JOIN dat_personanotificacion p
                ON d.iddestinatario = p.iddestinatario
                INNER JOIN dat_avisodestinatarioviacontenido d2
                ON d.iddestinatario = d2.iddestinatario
                INNER JOIN nom_tipodestinatario n ON d.idtipodest = n.idtipodest
                WHERE (d2.idaviso = ' . $idaviso . ')';

        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchOne($query);
    }

    public static function getIdsDestinatariosByIdsPerson($idsPerson)
    {
        $result = Doctrine_Query::create()
            ->select('iddestinatario as destinatario')
            ->from(__CLASS__)
            ->whereIn('idpersona', $idsPerson)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        $newResult = array();
        foreach ($result as $dest) {
            $newResult[] = $dest['destinatario'];
        }

        return $newResult;
    }
    
    /**
     * Devuelve si existe un grupo con al menos una persona
     */
    public static function ExistGroupWithDestinatarios()
    {
        $manager = Doctrine_Manager::getInstance();
        $query = "SELECT count(pn.idpersona )
            FROM mod_notificaciones.dat_personanotificacion pn 
            INNER JOIN mod_notificaciones.dat_grupodestinatario gd on pn.iddestinatario = gd.iddestinatario
            INNER JOIN mod_notificaciones.dat_gruponotificacion gn on gd.idgrupo = gn.idgrupo";

        try{
            if($manager->getCurrentConnection()->fetchArray($query) > 0){
                return true;
            }
            else{
                return false;
            }
        }catch (Exception $e) {
            echo $e->getMessage();
        }
    }

}
