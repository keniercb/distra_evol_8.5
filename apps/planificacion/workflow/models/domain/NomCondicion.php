<?php

class NomCondicion extends BaseNomCondicion
{
    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'DatCondicionTransicion',
            array('local' => 'idcondicion', 'foreign' => 'idcondicion')
        );
        $this->HasMany(
            'DatPostconacceso',
            array('local' => 'idcondicion', 'foreign' => 'idcondicion')
        );
    }

    public function ObtenerCondicionesPorTipo($tipocondicion)
    {
        $query = Doctrine_Query::create();
        return $query->select(
            'c.idcondicion,c.dencondicion as denominacion,c.desccondicion as descripcion'
        )
            ->from('NomCondicion c')
            ->where("c.tipocondicion = ?", $tipocondicion)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }


}//fin clase 



