<?php

class DatEstudiocurvaconflicto extends BaseDatEstudiocurvaconflicto
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'DatIntensidadconflicto',
            array('local' => 'idestudiocurvaconflicto', 'foreign' => 'idestudiocurvaconflicto')
        );
        $this->hasMany(
            'DatMedicion', array('local' => 'idestudiocurvaconflicto', 'foreign' => 'idestudiocurvaconflicto')
        );
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
    }

    public function getByid($idestudiocurvaconflicto)
    {
        return Doctrine::getTable('DatEstudiocurvaconflicto')
            ->find($idestudiocurvaconflicto)
            ->toArray();
    }

    static function getProyectocurvaconflicto($idproyecto)
    {
        try {
            $q = Doctrine_Query::create();
            $q->select(
               'ecc.idproyecto as idproyecto,
                ecc.idestudiocurvaconflicto as idestudiocurvaconflicto,
                ecc.fechaini as fechainicio,
                ecc.fechafin as fechafin,
                ecc.nativo as nativo,
                ecc.escala as escala,
                ecc.fromproblema as fromproblema,
                ecc.fechaintermedia as fechaintermedia,
                ecc.fechaavanzada as fechaavanzada,
                ecc.descripcion as descripcion,
                p.denominacion as denominacion'
            )
                ->from('DatEstudiocurvaconflicto ecc')
                ->innerJoin('ecc.DatProyecto p')
                ->where('ecc.idproyecto = ?', $idproyecto)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }
}

