<?php

class HisTareaAviso extends BaseHisTareaAviso
{

    public function setUp()
    {
        parent::setUp();
        $this->HasOne(
            'DatAviso', array('local' => 'idaviso', 'foreign' => 'idaviso')
        );
        $this->HasOne(
            'HisEventoDespachado', array('local' => 'ideventodespachado',
                                         'foreign' => 'ideventodespachado')
        );
        $this->HasMany(
            'HisRespuestaTarea',
            array('local' => 'idtarea', 'foreign' => 'idtarea')
        );
        //no fisic
        $this->hasOne(
            'NomTipocontenido',
            array('local' => 'viaaviso', 'foreign' => 'viaenvio')
        );
    }

    static public function getIdByUuid($uuid)
    {
        $task = Doctrine:: getTable(__CLASS__)->findBy('uuid', $uuid);

        return $task[0]->idtarea;
    }

    static public function getRealDestAndContacts($idtarea)
    {
        $task = Doctrine::getTable(__CLASS__)->find($idtarea);

        return array(explode(',', $task->destinatariosreal),
                     explode(',', $task->contactosreal));
    }

    static public function getConfirmationByCto($idtarea, $cto)
    {
        return Doctrine_Query::create()
            ->select('rd.exito as exito, rd.fecha as fecha, rd.observacion as detalle')
            ->from(__CLASS__ . ' task')
            ->innerJoin('task.HisRespuestaTarea rt')
            ->innerJoin('rt.HisRespuestaDestinatario rd')
            ->where('task.idtarea = ?', $idtarea)
            ->andWhere('rd.destinatario = ?', $cto)
            ->execute()->toArray(false);
    }

}