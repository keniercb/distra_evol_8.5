<?php

class NomProceso extends BaseNomProceso
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomTransicion', array('local' => 'idproceso', 'foreign' => 'idproceso'));
    }

    public function getNomProcesos()
    {
        return Doctrine_Query::create()
            ->from('NomProceso')
            ->fetchArray();
    }

    public function getNotificacionInicial($procesos){
        $query = Doctrine_Query::create()
            ->select('*')
            ->from('NomProceso p INDEXBY p.identificador')->where('p.notificar=1');
        if($procesos){
            if(!is_array($procesos))$procesos=array($procesos);
            $query->whereIn('p.identificador', $procesos);
        }
        return $query->fetchArray();
    }
}
