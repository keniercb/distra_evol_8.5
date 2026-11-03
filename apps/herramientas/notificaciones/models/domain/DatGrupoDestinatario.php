<?php

class DatGrupoDestinatario extends BaseDatGrupoDestinatario
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatGrupoNotificaciones',
            array('local' => 'idgrupo', 'foreign' => 'idgrupo')
        );
        $this->hasOne(
            'DatDestinatario',
            array('local' => 'iddestinatario', 'foreign' => 'iddestinatario')
        );
    }

    public static function deletePersonsFromGroup($group, $persons)
    {
        $q = Doctrine_Query:: create()
            ->select('p.iddestinatario')
            ->from('DatPersonaNotificaciones p')
            ->whereIn('p.idpersona', $persons)
            ->execute()
            ->toArray();
        $destinatarios = array();
        foreach ($q as $e) {
            $destinatarios[] = $e['iddestinatario'];
        }
        Doctrine_Query:: create()
            ->delete(__CLASS__ . ' gd')
            ->where('gd.idgrupo = ?', $group)
            ->andWhereIn('gd.iddestinatario', $destinatarios)
            ->execute();
    }

} 