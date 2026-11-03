<?php
class DatParticipantecurso extends BaseDatParticipantecurso
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatAccioncurso',
            array('local' => 'idaccioncurso', 'foreign' => 'idaccioncurso')
        );
        $this->hasOne(
            'DatAccionparticipante',
            array('local' => 'idaccionparticipante', 'foreign' => 'idaccionparticipante')
        );
    }

    public function getById($idparticipantecurso)
    {
        return Doctrine::getTable('DatParticipantecurso')->find($idparticipantecurso);
    }
}