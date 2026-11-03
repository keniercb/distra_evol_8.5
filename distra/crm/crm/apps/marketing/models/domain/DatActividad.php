<?php

class DatActividad extends BaseDatActividad
{

    public function setUp()
    {
        $this->hasOne(
            'DatCampanna',
            array('local' => 'idcampanna', 'foreign' => 'idcampanna')
        );
        $this->hasOne(
            'NomCanal',
            array('local' => 'idcanal', 'foreign' => 'idcanal')
        );
        $this->hasOne(
            'NomPrioridad',
            array('local' => 'idprioridad', 'foreign' => 'idprioridad')
        );
        $this->hasMany(
            'DatClienteActividad',
            array('local' => 'idactividad', 'foreign' => 'idactividad')
        );

        parent::setUp();
    }

    public function getActividad($params)
    {
        $query = new Doctrine_Query();
        $query->select('da.*, np.denominacion as denomprioridad,nc.denominacion as denomcanal')
            ->from('DatActividad da')
            ->innerjoin('da.NomPrioridad np')
            ->innerjoin('da.NomCanal nc')
            ->orderby('da.idactividad DESC')
            ->offset($params['start'])
            ->limit($params['limit'])
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        if($params['idcampanna']){
            $query->addWhere('idcampanna=?',$params['idcampanna']);
        }

        $result = $query->execute();

        return array('data' => $result, 'count' => $query->count());
    }
}
