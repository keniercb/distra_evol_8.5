<?php

class NomPuestotrabajo extends BaseNomPuestotrabajo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatSecnrocontropuestotrabajo',
            array(
                'local'   => 'idpuestotrabajo',
                'foreign' => 'idpuestotrabajo'
            )
        );
        $this->hasOne(
            'ConfConfiguracionfactura',
            array(
                'local'   => 'idconfiguracion',
                'foreign' => 'idconfiguracion'
            )
        );
        if (class_exists("DatDocfactura")) {
            $this->hasMany(
                'DatDocfactura',
                array(
                    'local'   => 'idpuestotrabajo',
                    'foreign' => 'idpuestotrabajo'
                )
            );
        }
    }

    /**
     * Funcion que cargar los datos de numero de control
     *
     * @param array $params Arreglo con los parametros necesarios
     *
     * @return array Retorna datos y cantidad de elementos
     */
    public function loadPuestoTrabajo($parametros)
    {
        $query = Doctrine_Query::create();
        $query->select('*')
            ->from('NomPuestotrabajo dsca')
            ->where("dsca.idestructuracomun =?", array($parametros['idestructuracomun']));
        $cantidad = $query->count();
        if ($parametros['limit']) {
            $query->offset($parametros['start'])->limit($parametros['limit']);
        }
        $datos = $query->fetchArray();
        return array('datos' => $datos, 'cantidad' => $cantidad);
    }

    /**
     * Funcion que permite saber si existe el elemento
     *
     * @param array $params Arreglo con los parametros necesarios
     *
     * @return array Retorna cantidad de elementos
     */
    public function existsPuestoTrabajo($params)
    {
        $query = Doctrine_Query::create()
            ->from('NomPuestotrabajo ta')
            ->where("ta.denominacion =?", array($params['denominacion']))
            ->count();
        return $query;
    }

}
