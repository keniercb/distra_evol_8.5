<?php

class DatIndicadorviaadquisicionorganosatisface
    extends BaseDatIndicadorviaadquisicionorganosatisface
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatIndicadorviaadquisicion',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasOne(
            'DatIndicadorviaadquisicion', array('local'   => 'idviaadquisicion',
                                                'foreign' => 'idviaadquisicion')
        );
        $this->hasOne(
            'NomOrganosatisface', array('local'   => 'idorganosatisface',
                                        'foreign' => 'idorganosatisface')
        );
        $this->hasMany(
            'DatDesgviaadquisorgsat',
            array('local'   => 'idindicadorviaadquisicionorganosatisface',
                  'foreign' => 'idindicadorviaadquisicionorganosatisface')
        );
    }

    public function EliminarVAdqInd($idind)
    {
        $query = new Doctrine_Query();
        $query->delete('n.idviaadquisicion, n.idindicador, n.idorganosatisface')
            ->from('DatIndicadorviaadquisicionorganosatisface n')
            ->where('n.idindicador=?', $idind)
            ->execute();
    }

    public function obtenerOrganoSatisfIndicadorAsociado($idindicador)
    {
        $query = new Doctrine_Query(); //********AQUI
        $temp = $query->select('m.idorganosatisface,nv.denominacion')
            ->from('DatIndicadorviaadquisicionorganosatisface m')
            ->innerjoin('m.NomOrganosatisface nv')
            ->where('m.idindicador=?', $idindicador)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $temp;
    }

    public function obtenerId($idindicador, $organo, $via)
    {

        $query = new Doctrine_Query(); //********AQUI
        $temp = $query->select('m.idindicadorviaadquisicionorganosatisface')
            ->from('DatIndicadorviaadquisicionorganosatisface m')
            ->where(
                'm.idindicador=? AND m.idorganosatisface=? AND m.idviaadquisicion=?',
                array($idindicador, $organo, $via)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();

        return $temp[0]['idindicadorviaadquisicionorganosatisface'];
    }

    public function obtenerOrganoSatisfIndicadorAsociadoPlanif($idindicador)
    {
        $con = Doctrine_Manager::connection();
        $query
            = "SELECT distinct (nv.denominacion)
  FROM mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface m 
        INNER JOIN mod_datosmaestros.nom_organosatisface nv ON(m.idorganosatisface=nv.idorganosatisface)
        where m.idindicador= $idindicador";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

}

