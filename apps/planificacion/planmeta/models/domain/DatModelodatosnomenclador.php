<?php

class DatModelodatosnomenclador extends BaseDatModelodatosnomenclador
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasOne(
            'NomDatosnomenclador', array('local' => 'iddatosnomenclador',
                                         'foreign' => 'iddatosnomenclador')
        );
    }

    public function Insertar($iddatosnomenclador, $idmodelo)
    {
        $model = new DatModelodatosnomenclador();
        $model->iddatosnomenclador = $iddatosnomenclador;
        $model->idmodelo = $idmodelo;
        $model->save();
    }

    public function eliminarAsociacion($iddatosnomenclador, $idmodelo)
    {
        $query = new Doctrine_Query();

        $query->delete('DatModelodatosnomenclador')
            ->from('DatModelodatosnomenclador')
            ->where(
                'idmodelo = ? AND iddatosnomenclador = ?',
                array($idmodelo, $iddatosnomenclador)
            );

        return $query->execute();
    }

    public function eliminar($idmodelo)
    {
        $query = new Doctrine_Query();

        $query->delete('DatModelodatosnomenclador')
            ->from('DatModelodatosnomenclador')
            ->where('idmodelo=?', $idmodelo);

        return $query->execute();
    }

}
