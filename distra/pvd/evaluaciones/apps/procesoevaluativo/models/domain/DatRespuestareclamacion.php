<?php

class DatRespuestareclamacion extends BaseDatRespuestareclamacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatReclamacion',
            array('local' => 'idreclamacion', 'foreign' => 'idreclamacion')
        );
        $this->hasOne(
            'DatNivelreclamacion',
            array('local' => 'idnivelreclamacion', 'foreign' => 'idnivelreclamacion')
        );
    }

    public function Buscar($idrespuestareclamacion)
    {
        return Doctrine::getTable('DatRespuestareclamacion')->find($idrespuestareclamacion);
    }

    public function Modificar($idreclamacion,$procedeparam,$respuesta){

            $query = Doctrine_Query::create()
                ->update('DatRespuestareclamacion')
                ->where('idreclamacion= ? ', $idreclamacion);
            if ($procedeparam != '') {
                $query->set('procede', '?', $procedeparam);
            }
            if ($respuesta != '') {
                $query->set('respuesta', '?', $respuesta);
            }
            else {
                $query->set('respuesta', 'null');
            }
            $result = $query->execute();
            if ($result) {
                return true;
            } else {
                return false;
            }
     }
}