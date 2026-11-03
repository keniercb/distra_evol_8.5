<?php

class HisRespuestaTarea extends BaseHisRespuestaTarea
{

    public function setUp()
    {
        parent::setUp();
        $this->HasOne(
            'NomEstadoTarea',
            array('local' => 'estadotarea', 'foreign' => 'idestado')
        );
        $this->HasOne(
            'HisTareaAviso', array('local' => 'idtarea', 'foreign' => 'idtarea')
        );
        $this->HasMany(
            'HisRespuestaDestinatario',
            array('local' => 'idrespuesta', 'foreign' => 'idrespuestatarea')
        );
    }

    public static function getByTask($idtask)
    {
        $taskAnswer = Doctrine::getTable(__CLASS__)->findBy('idtarea', $idtask);

        return end($taskAnswer);
    }

    static public function hasConfirmation($idtask)
    {
        return
            Doctrine::getTable(__CLASS__)->findBy('idtarea', $idtask)->count()
            > 0;
    }
}